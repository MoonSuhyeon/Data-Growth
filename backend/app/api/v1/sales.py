"""판매 기회 — 생성 · 목록 · 상세.

## 수요는 왜 요청 본문으로 받는가

점수를 내려면 시장 수요가 필요한데 그건 예측 서비스(ML-Product)에 있다.
여기서 직접 부를 수도 있지만, **무엇을 조사할지 고르는 판단은 에이전트가
갖는다**는 것이 이 시스템의 논지다. 그래서 에이전트가 `get_market_demand`
도구로 읽어 온 것을 그대로 넘겨받는다.

덤으로 이 API 는 예측 서비스가 떠 있지 않아도 시험할 수 있다. 서비스 둘을
같이 띄워야만 도는 테스트는 결국 안 돌게 된다.

## 공급은 왜 여기서 세는가

공급은 우리 원장의 사실이다. 넘겨받으면 호출자가 틀린 숫자를 보낼 수 있고,
그때 나오는 점수는 그럴듯하지만 틀린 값이다. **우리가 아는 것은 우리가 센다.**

## 기회가 될 수 없는 것은 점수로 누르지 않고 거절한다

연락처가 없거나, 유형이 시장과 다르거나, 평점이 기준 미달이면 영업 대상이
아니다. 낮은 점수로 만들어 두면 목록 아래쪽에 살아남아 언젠가 발송된다.
그래서 `409` 로 막고 **이유를 응답에 담는다** — 화면이 "왜 안 되는지" 를
말할 수 있어야 한다.

## 열린 기회 중복은 응용 계층에서 막는다

DB 유니크 제약으로 걸면 한 번 `LOST` 로 닫힌 뒤 다시 시도할 수 없다.
자세한 이유는 `0004_sales_pipeline` 마이그레이션 주석에 있다.
"""
from __future__ import annotations

import uuid
from typing import Any

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from analytics.acquisition import demand_by_segment, market_gap, normalize_region
from analytics.acquisition import score as score_of
from analytics.acquisition import supply_by_segment
from app.core.database import get_db
from app.models import Opportunity, OpportunityStatusEnum, Property, Prospect, SalesModeEnum

router = APIRouter(prefix="/sales", tags=["Sales"])

#: 획득 모드가 파는 것. 입점 그 자체다.
LISTING = "LISTING"

#: 기회가 살아 있다고 보는 상태. `WON` · `LOST` 는 닫힌 것이다.
OPEN_STATUSES = (
    OpportunityStatusEnum.OPEN,
    OpportunityStatusEnum.QUALIFIED,
    OpportunityStatusEnum.PROPOSED,
    OpportunityStatusEnum.ENGAGED,
)


# ─────────────────────────────────────────────── 스키마

class ForecastPayload(BaseModel):
    """에이전트가 예측 서비스에서 읽어 온 것. 모양을 그대로 받는다."""

    rows: list[dict[str, Any]] = Field(default_factory=list)
    wape_by_region: dict[str, float] = Field(default_factory=dict)


class CreateOpportunity(BaseModel):
    prospect_id: uuid.UUID
    forecast: ForecastPayload
    product: str = LISTING


class ProspectRow(BaseModel):
    """미입점 숙소 한 줄. **점수는 없다.**

    목록에서 점수를 미리 매기려면 후보마다 시장 표를 만들어야 하고, 그러면
    화면을 열 때마다 예측 서비스를 부르게 된다. 더 나쁜 것은 그 점수가 기회로
    굳힌 점수와 **다른 시점의 값**이 되어 두 화면이 다른 숫자를 말하는 것이다.
    점수는 기회를 만들 때 한 번만 낸다.
    """

    id: uuid.UUID
    name: str
    region: str
    area: str | None
    property_type: str
    capacity: int | None
    rating: float | None
    contactable: bool
    #: 이미 열린 기회가 있는가. 화면이 "기회 만들기" 버튼을 감추는 데 쓴다 —
    #: 누르고 나서 409 를 보는 것보다 낫다.
    has_open_opportunity: bool


class OpportunityRow(BaseModel):
    id: uuid.UUID
    mode: SalesModeEnum
    status: OpportunityStatusEnum
    product: str
    score: int | None
    confidence: str | None
    rationale: str | None
    target_name: str | None
    region: str | None
    property_type: str | None


class OpportunityDetail(OpportunityRow):
    #: 점수의 내역. **총점만 남기면 87점이 "시장이 커서" 인지 "숙소가 맞아서"
    #: 인지 나중에 알 수 없다.**
    score_breakdown: dict[str, Any] | None
    next_action: str | None
    prospect: dict[str, Any] | None


# ─────────────────────────────────────────────── 도우미

async def _supply_frame(db: AsyncSession) -> pd.DataFrame:
    """우리 원장의 공급. 지역·유형·동네까지 가져온다."""
    rows = (await db.execute(
        select(Property.region, Property.property_type, Property.area,
               Property.max_guests)
    )).all()
    return pd.DataFrame(
        [{"region": r, "property_type": t.value if hasattr(t, "value") else t,
          "area": a, "capacity": g} for r, t, a, g in rows],
        columns=["region", "property_type", "area", "capacity"],
    )


def _market_of(prospect: Prospect, forecast: ForecastPayload,
               supply: pd.DataFrame) -> dict | None:
    """이 후보가 속한 시장 한 줄. 없으면 ``None``.

    ``median_capacity`` 와 ``area_supply`` 는 적합도 계산이 요구하는 값이라
    여기서 붙인다 — 시장 표에는 없고 원장에만 있는 사실이다.
    """
    if not forecast.rows:
        return None

    demand = demand_by_segment(pd.DataFrame(forecast.rows))

    # **오차 표의 지역 이름도 정규화해야 한다.** 예측 서비스는 `Jeju` 로 주고
    # `demand_by_segment` 는 이미 `제주` 로 바꿔 놓았다. 여기서 안 맞추면 매핑이
    # 전부 빗나가 wape 가 NaN 이 되고, **신뢰도가 영원히 `unknown` 으로 나온다** —
    # 에러 없이, 그럴듯하게.
    wape = {normalize_region(k): v for k, v in forecast.wape_by_region.items()}
    gaps = market_gap(demand, supply_by_segment(supply), wape)

    ptype = prospect.property_type.value if hasattr(prospect.property_type, "value") \
        else prospect.property_type
    hit = gaps[(gaps["region"] == prospect.region) & (gaps["property_type"] == ptype)]
    if hit.empty:
        return None

    row = hit.iloc[0].to_dict()

    # 규모의 중앙값은 숙소 테이블에만 있는 사실이라 여기서 붙인다. 그 시장에
    # 우리 숙소가 하나도 없으면 ``None`` 이고, 적합도가 중립(0.5)으로 떨어질 뿐
    # 판단이 멈추지는 않는다 — 모르는 것이 감점이 되면 빈 시장이 불리해진다.
    same = supply[(supply["region"] == prospect.region)
                  & (supply["property_type"] == ptype)]["capacity"].dropna()
    row["median_capacity"] = float(same.median()) if not same.empty else None

    # 동네별 공급은 **지역 전체**에서 센다. 같은 시장 안에서만 세면 그 유형이
    # 없는 동네가 전부 0 이 되어 변별이 사라진다.
    row["area_supply"] = (
        supply[supply["region"] == prospect.region]["area"]
        .dropna().value_counts().to_dict()
    )
    return row


def _prospect_dict(p: Prospect) -> dict:
    return {
        "region": p.region,
        "area": p.area,
        "property_type": p.property_type.value if hasattr(p.property_type, "value")
        else p.property_type,
        "capacity": p.capacity,
        "rating": float(p.rating) if p.rating is not None else None,
    }


def _row(o: Opportunity) -> OpportunityRow:
    p = o.prospect
    return OpportunityRow(
        id=o.id, mode=o.mode, status=o.status, product=o.product,
        score=o.score, confidence=o.confidence, rationale=o.rationale,
        target_name=p.name if p else o.host_name,
        region=p.region if p else None,
        property_type=(p.property_type.value if p and hasattr(p.property_type, "value")
                       else (p.property_type if p else None)),
    )


# ─────────────────────────────────────────────── 엔드포인트

@router.get("/prospects", response_model=list[ProspectRow])
async def list_prospects(region: str | None = Query(None),
                         db: AsyncSession = Depends(get_db)):
    """아직 입점하지 않은 숙소. 이미 입점한 것은 빼고 준다."""
    stmt = select(Prospect).where(Prospect.onboarded_at.is_(None))
    if region:
        stmt = stmt.where(Prospect.region == region)
    rows = (await db.execute(stmt.order_by(Prospect.region, Prospect.name))).scalars().all()

    open_ids = {
        r[0] for r in (await db.execute(
            select(Opportunity.prospect_id).where(Opportunity.status.in_(OPEN_STATUSES))
        )).all()
    }
    return [
        ProspectRow(
            id=p.id, name=p.name, region=p.region, area=p.area,
            property_type=p.property_type.value if hasattr(p.property_type, "value")
            else p.property_type,
            capacity=p.capacity,
            rating=float(p.rating) if p.rating is not None else None,
            contactable=bool(p.contact_email or p.contact_phone),
            has_open_opportunity=p.id in open_ids,
        )
        for p in rows
    ]


@router.post("/opportunities", response_model=OpportunityDetail, status_code=201)
async def create_opportunity(body: CreateOpportunity,
                             db: AsyncSession = Depends(get_db)):
    """후보 하나를 판매 기회로 만든다. 점수는 만들 때 한 번 계산해 남긴다.

    **점수를 조회할 때마다 다시 계산하지 않는다.** 예측은 매일 바뀌므로 그러면
    같은 기회의 점수가 화면을 새로 고칠 때마다 달라지고, "왜 이 숙소를 골랐나"
    에 답할 수가 없다. 판단한 시점의 근거를 그대로 굳힌다.
    """
    prospect = await db.get(Prospect, body.prospect_id)
    if prospect is None:
        raise HTTPException(404, "그런 후보가 없습니다")
    if prospect.onboarded_at is not None:
        raise HTTPException(409, "이미 입점한 숙소입니다 — 획득 대상이 아닙니다")
    if not (prospect.contact_email or prospect.contact_phone):
        raise HTTPException(409, "연락 수단이 없어 영업할 수 없습니다")

    dup = (await db.execute(
        select(Opportunity.id).where(
            Opportunity.prospect_id == prospect.id,
            Opportunity.product == body.product,
            Opportunity.status.in_(OPEN_STATUSES),
        ).limit(1)
    )).first()
    if dup:
        raise HTTPException(409, "이 후보에 열려 있는 기회가 이미 있습니다")

    market = _market_of(prospect, body.forecast, await _supply_frame(db))
    if market is None:
        raise HTTPException(409, "이 후보가 속한 시장의 수요를 찾을 수 없습니다")

    result = score_of(_prospect_dict(prospect), market)
    if result.total == 0:
        # 낮은 점수로 만들어 두면 목록 아래쪽에 살아남아 언젠가 발송된다.
        reason = "; ".join(result.fit.reasons) or "시장 기회가 없습니다"
        raise HTTPException(409, f"영업 대상이 아닙니다: {reason}")

    opp = Opportunity(
        id=uuid.uuid4(),
        mode=SalesModeEnum.ACQUISITION,
        prospect_id=prospect.id,
        product=body.product,
        status=OpportunityStatusEnum.QUALIFIED,   # 점수가 매겨진 순간 자격 판정이 끝났다
        score=result.total,
        score_breakdown={
            "gap_score": result.gap_score,
            "fit_score": result.fit.score,
            "fit_axes": result.fit.axes,
            "fit_reasons": result.fit.reasons,
            "market": {
                "region": market["region"],
                "property_type": market["property_type"],
                "demand": float(market["demand"]),
                "supply": int(market["supply"]),
                "wape": None if pd.isna(market.get("wape")) else float(market["wape"]),
            },
        },
        rationale=result.explain(),
        confidence=result.confidence,
        next_action="제안 생성",
    )
    db.add(opp)
    await db.commit()
    await db.refresh(opp)
    opp.prospect = prospect
    return _detail(opp)


@router.get("/opportunities", response_model=list[OpportunityRow])
async def list_opportunities(
    mode: SalesModeEnum | None = Query(None),
    status: OpportunityStatusEnum | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """점수순 목록. **점수가 없는 것은 뒤로 보낸다.**"""
    stmt = select(Opportunity, Prospect).join(
        Prospect, Opportunity.prospect_id == Prospect.id, isouter=True)
    if mode is not None:
        stmt = stmt.where(Opportunity.mode == mode)
    if status is not None:
        stmt = stmt.where(Opportunity.status == status)

    rows = (await db.execute(stmt)).all()
    out = []
    for opp, prospect in rows:
        opp.prospect = prospect
        out.append(_row(opp))
    return sorted(out, key=lambda r: (r.score is None, -(r.score or 0)))


@router.get("/opportunities/{opportunity_id}", response_model=OpportunityDetail)
async def get_opportunity(opportunity_id: uuid.UUID,
                          db: AsyncSession = Depends(get_db)):
    """기회 하나. **산출 내역까지 준다** — 화면이 "왜 87점인가" 를 펼쳐야 한다."""
    opp = await db.get(Opportunity, opportunity_id)
    if opp is None:
        raise HTTPException(404, "그런 기회가 없습니다")
    opp.prospect = (await db.get(Prospect, opp.prospect_id)
                    if opp.prospect_id else None)
    return _detail(opp)


def _detail(o: Opportunity) -> OpportunityDetail:
    base = _row(o)
    return OpportunityDetail(
        **base.model_dump(),
        score_breakdown=o.score_breakdown,
        next_action=o.next_action,
        prospect=({
            "id": str(o.prospect.id),
            "name": o.prospect.name,
            "area": o.prospect.area,
            "capacity": o.prospect.capacity,
            "rating": float(o.prospect.rating) if o.prospect.rating is not None else None,
            "contact_email": o.prospect.contact_email,
            "contact_phone": o.prospect.contact_phone,
            "source": o.prospect.source,
        } if o.prospect else None),
    )
