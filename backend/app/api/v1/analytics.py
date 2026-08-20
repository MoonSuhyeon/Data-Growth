"""분석 조회 — **기간과 축을 물어볼 수 있게 한다.**

지금까지 콘솔은 `reports/growth.json` 한 장을 읽었다. 파이프라인이 미리 계산해 둔
답만 볼 수 있었고, 기간을 바꾸려면 스크립트를 다시 돌려야 했다. 축 선택이 동작한
것도 모든 축을 미리 계산해 넣어 뒀기 때문이다 — 기간은 조합이 무한해서 같은 수를
쓸 수 없다.

**계산 로직을 다시 쓰지 않는다.** `analytics/` 의 함수들이 이미 DataFrame 을 받으므로,
여기서는 저장소에서 기간으로 잘라 그대로 넘긴다. 두 벌로 만들면 화면이 보는 숫자와
파이프라인이 내는 숫자가 갈린다.

    GET /api/v1/analytics/overview?from=&to=
    GET /api/v1/analytics/segments?by=&from=&to=
"""
from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from analytics.features import AWAITING_APP, adoption, unused
from analytics.funnel import by_segment, compute, conversion_rate, sessionize
from analytics.retention import churn, label_visits, retention
from analytics.revenue import summarize
from analytics.store import EventStore
from analytics.targets import evaluate as evaluate_targets
from analytics.targets import summary as target_summary
from tracking.taxonomy import FUNNEL_STEPS

router = APIRouter(prefix="/analytics", tags=["Analytics"])

_store = EventStore()

#: 쪼갤 수 있는 축. 임의 컬럼을 그대로 `groupby` 에 넘기면 사용자가 KeyError 를 본다.
SEGMENT_AXES = ("device_type", "region", "visit_type")

#: 상품 축은 이벤트에 없다. 별도로 다룬다 — 분모가 다르기 때문이다(아래 주석 참고).
PRODUCT_AXIS = "property_type"


def _prepared(since: datetime | None, until: datetime | None):
    """저장소에서 기간을 잘라 분석이 쓸 수 있는 모양까지 만든다.

    순서가 곧 의미다 — 세션을 나눈 뒤 스티칭하고, **그 다음에** 방문 라벨을 붙인다.
    라벨을 스티칭 앞에 붙이면 로그인 전후 방문이 다른 사람으로 갈려서 돌아온
    사람이 신규로 세어진다.
    """
    from analytics.etl.identity import stitch
    from analytics.simulator import PROPERTY_CATALOG

    df = _store.frame(since, until)
    if df.empty:
        return df

    df["timestamp"] = df["sent_at"]
    df["variant"] = df["properties"].map(lambda p: (p or {}).get("variant"))
    df["property_type"] = df["property_id"].map(
        lambda pid: (PROPERTY_CATALOG.get(pid) or {}).get("property_type")
    )
    df = sessionize(df)
    df, _ = stitch(df)
    return label_visits(df)


class Window(BaseModel):
    """언제부터 언제까지를 잰 것인지 응답이 스스로 말한다."""

    requested_from: datetime | None = None
    requested_to: datetime | None = None
    data_from: datetime | None = None
    data_to: datetime | None = None
    events: int


class OverviewResponse(BaseModel):
    window: Window
    funnel: list[dict]
    cvr: float
    retention: dict
    revenue: dict
    features: list[dict]
    targets: dict


@router.get("/overview", response_model=OverviewResponse)
def overview(
    from_: datetime | None = Query(None, alias="from"),
    to: datetime | None = Query(None),
) -> OverviewResponse:
    """기간 하나에 대한 전체 그림."""
    df = _prepared(from_, to)

    if df.empty:
        # 빈 기간은 **오류가 아니다.** 0 을 돌려주되 창을 같이 말해서, 읽는 사람이
        # "데이터가 없다" 와 "기간을 잘못 골랐다" 를 구분할 수 있게 한다.
        return OverviewResponse(
            window=Window(requested_from=from_, requested_to=to, events=0),
            funnel=[], cvr=0.0, retention={}, revenue={}, features=[],
            targets={"rows": evaluate_targets({}), "summary": target_summary(evaluate_targets({}))},
        )

    steps = compute(df)
    cvr = conversion_rate(df)
    ret = retention(df)
    rev = summarize(df)
    seg = by_segment(df, "device_type")
    mobile = seg.loc[seg["device_type"] == "MOBILE", "booking_started_rate"]

    measured = {
        "funnel.cvr": float(cvr),
        "funnel.mobile_booking_started": float(mobile.iloc[0]) if len(mobile) else None,
        "retention.return_rate": float(ret.return_rate),
        "revenue.arpu": float(rev.arpu),
        "collection.failure_rate": None,   # 수집 품질은 /events/health 가 답한다
        "revenue.cancellation_rate": float(rev.cancellation_rate),
    }
    rows = evaluate_targets(measured)

    return OverviewResponse(
        window=Window(
            requested_from=from_, requested_to=to,
            data_from=df["timestamp"].min(), data_to=df["timestamp"].max(),
            events=int(len(df)),
        ),
        funnel=[
            {"event": s.event, "users": int(s.users),
             "step_rate": None if s.step_rate is None else float(s.step_rate),
             "drop": int(s.drop)}
            for s in steps
        ],
        cvr=round(float(cvr), 4),
        retention={
            "people": ret.people, "returned": ret.returned, "sessions": ret.sessions,
            "return_rate": ret.return_rate,
            "cohorts": [
                {"cohort": c, "people": n, "returned": r,
                 "return_rate": round(r / n, 4) if n else 0.0}
                for c, (n, r) in ret.by_cohort.items()
            ],
            "churn_d7": churn(df, within_days=7).to_dict(orient="records"),
        },
        revenue={
            "gross_revenue": rev.gross_revenue, "refunded": rev.refunded,
            "net_revenue": rev.net_revenue, "orders": rev.orders,
            "cancellations": rev.cancellations,
            "cancellation_rate": rev.cancellation_rate,
            "buyers": rev.buyers, "people": rev.people,
            "purchase_rate": rev.purchase_rate,
            "aov": rev.aov, "arppu": rev.arppu, "arpu": rev.arpu,
        },
        features=adoption(df).to_dict(orient="records"),
        targets={
            "rows": rows, "summary": target_summary(rows),
            "declared_in": "analytics/targets.py",
            "never_emitted": unused(df, expected=set(AWAITING_APP)),
        },
    )


class SegmentResponse(BaseModel):
    window: Window
    dimension: str
    #: 축마다 분모가 다를 수 있다. 다르면 응답이 말해야 한다.
    note: str | None = None
    rows: list[dict]


@router.get("/segments", response_model=SegmentResponse)
def segments(
    by: str = Query("device_type"),
    from_: datetime | None = Query(None, alias="from"),
    to: datetime | None = Query(None),
) -> SegmentResponse:
    """세그먼트별 퍼널.

    축이 하나면 "평균이 가리는 것을 드러낸다" 가 반쪽이다. 디바이스만 보면 채널
    문제는 보이지만 **무엇을 파느냐**는 안 보인다.
    """
    allowed = (*SEGMENT_AXES, PRODUCT_AXIS)
    if by not in allowed:
        raise HTTPException(400, f"쪼갤 수 없는 축입니다: {by} (가능: {', '.join(allowed)})")

    df = _prepared(from_, to)
    win = Window(
        requested_from=from_, requested_to=to,
        data_from=None if df.empty else df["timestamp"].min(),
        data_to=None if df.empty else df["timestamp"].max(),
        events=int(len(df)),
    )
    if df.empty:
        return SegmentResponse(window=win, dimension=by, rows=[])

    note = None
    if by == PRODUCT_AXIS:
        # 검색은 숙소에 귀속되지 않는다. 그대로 쪼개면 모든 유형의 1단계가 0 이
        # 되므로 조회부터 센다 — 그리고 그 사실을 응답이 말한다.
        rows = by_segment(df, by, steps=FUNNEL_STEPS[1:])
        note = "검색은 숙소에 귀속되지 않아 조회(property_viewed)부터 센다"
    else:
        rows = by_segment(df, by)

    return SegmentResponse(window=win, dimension=by, note=note,
                           rows=rows.to_dict(orient="records"))


class AnomalyResponse(BaseModel):
    baseline: Window
    current: Window
    healthy: bool
    findings: list[dict]
    #: 판정하지 않은 것. **"이상 없음" 과 다르다** — 표본이 모자라 못 본 것이다.
    skipped: list[str]


@router.get("/anomalies", response_model=AnomalyResponse)
def anomalies(
    baseline_from: datetime = Query(..., alias="baseline_from"),
    baseline_to: datetime = Query(..., alias="baseline_to"),
    from_: datetime = Query(..., alias="from"),
    to: datetime = Query(...),
) -> AnomalyResponse:
    """두 기간을 견줘 나빠진 것을 찾는다.

    **비교 대상을 부르는 쪽이 정하게 한다.** 서버가 "지난주" 를 자동으로 고르지
    않는 이유는, 무엇과 견주느냐가 곧 판단이기 때문이다 — 성수기를 비수기와
    견주면 매번 울리고, 매번 울리는 경보는 무시된다.
    """
    from analytics.anomaly import detect

    base = _prepared(baseline_from, baseline_to)
    cur = _prepared(from_, to)
    rep = detect(base, cur)

    def win(a, b, df):
        return Window(
            requested_from=a, requested_to=b,
            data_from=None if df.empty else df["timestamp"].min(),
            data_to=None if df.empty else df["timestamp"].max(),
            events=int(len(df)),
        )

    return AnomalyResponse(
        baseline=win(baseline_from, baseline_to, base),
        current=win(from_, to, cur),
        healthy=rep.healthy,
        findings=[
            {"metric": f.metric, "label": f.label, "baseline": f.baseline,
             "current": f.current, "change": f.change, "severity": f.severity.value,
             "reason": f.reason, "sample": f.sample}
            for f in rep.findings
        ],
        skipped=rep.skipped,
    )
