"""신규 호스트 획득 — **어느 시장에 무엇이 부족한가, 그리고 이 숙소가 거기 맞는가.**

영업 대상을 고르는 판단은 두 조각으로 나뉜다. 섞어 놓으면 왜 골랐는지 설명할 수 없다.

  1. **Market Gap** — 그 시장(지역 × 숙소 유형)의 수요가 우리 공급보다 큰가.
     숙소 하나하나와 무관한, 시장 단위의 값이다.
  2. **Property Fit** — 그 시장이 필요로 하는 모양에 이 숙소가 맞는가.
     시장이 같아도 숙소마다 달라지는 값이다.

## 왜 곱하는가

두 값을 **더하지 않고 곱한다.** 더하면 한쪽이 0이어도 점수가 남는다 — 수요가 이미
포화인 시장의 훌륭한 숙소가, 수요가 폭발하는 시장의 평범한 숙소보다 위로 올라온다.
영업에서 그건 틀린 순서다. 시장이 없으면 숙소가 좋아도 팔 이유가 없고, 시장이 있어도
맞지 않는 숙소를 데려오면 입점시켜 놓고 안 팔린다. **둘 다 있어야 기회다.**

## 예측 오차를 버리지 않는다

수요는 예측값이고 예측에는 오차가 있다. ML 서비스가 `/forecast/low-demand` 에서
`region_wape` 를 같이 내보내는 이유가 그것이다 — 스키마가 소비자에게 오차를 보게
강제한다. 여기서 그 값을 떨어뜨리면 그 강제가 한 홉 만에 무너진다.

그래서 `market_gap` 은 `wape` 를 결과에 그대로 달고 다니고, `score` 는 오차가 큰
시장의 점수를 **낮추지 않는다** — 대신 `confidence` 로 갈라 낸다. 낮추면 두 가지가
한 숫자에 섞여서, 87점이 "기회가 작다"인지 "기회는 큰데 못 믿겠다"인지 구분되지
않는다. 그 둘은 영업이 취할 행동이 다르다. 앞은 건너뛰고, 뒤는 사람이 본다.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

#: 지역 이름이 서비스마다 다르다. 예측 서비스는 영문(``Seoul``), 우리 원장은
#: 한글(``서울``)을 쓴다. **정본은 우리 원장 쪽**이다 — 고객에게 보이는 이름이고,
#: 예측은 그 위에 얹히는 파생물이기 때문이다.
REGION_ALIASES: dict[str, str] = {
    "Seoul": "서울",
    "Busan": "부산",
    "Jeju": "제주",
    "Gangneung": "강릉",
    "Gyeongju": "경주",
}


def normalize_region(name: str) -> str:
    """예측 서비스의 지역 이름을 우리 원장의 이름으로 옮긴다.

    모르는 이름은 **그대로 둔다.** 여기서 임의로 버리면 새 지역이 생겼을 때
    조용히 사라지고, 아무도 그 지역이 빠진 걸 모른다.
    """
    return REGION_ALIASES.get(name, name)


#: 공급이 0인 시장의 갭. 나눗셈이 발산하므로 상한을 둔다. 이 값을 넘겨 봐야
#: "아무도 없다" 이상의 정보가 없고, 정렬만 이 한 칸이 독점하게 된다.
MAX_GAP = 3.0

#: 공급 0 인 시장의 분모. 1 로 두면 "한 곳도 없다" 와 "한 곳 있다" 가 같은 값이
#: 되어, 획득 영업이 가장 먼저 봐야 할 시장이 순위에서 묻힌다.
EMPTY_MARKET_WEIGHT = 0.5

#: 이 아래로는 표본이 얇아 시장이라 부르지 않는다. 예측 3건으로 "수요가 는다"고
#: 말하면 그건 예측이 아니라 우연이다.
MIN_MARKET_N = 5

#: 플랫폼이 받아 줄 최소 평점. 미달이면 적합도가 0 이 되어 곱셈에서 탈락한다.
#: 영업 전에 걸러야 할 것을 점수로 눌러 두면 목록 아래쪽에 살아남는다.
MIN_RATING = 3.0


def demand_by_segment(forecast: pd.DataFrame) -> pd.DataFrame:
    """숙소·날짜 예측을 시장 단위로 접는다.

    `GET /forecast` 가 주는 행은 숙소 하나의 하루다. 영업이 보는 단위는 시장이라
    여기서 (지역 × 유형) 으로 접는다. **합이 아니라 평균**이다 — 숙소 수가 많은
    시장이 자동으로 수요가 큰 시장이 되면, 갭을 구할 때 분자와 분모가 같은 것을
    세게 되어 항상 1 근처가 나온다.
    """
    need = {"region", "property_type", "predicted"}
    missing = need - set(forecast.columns)
    if missing:
        raise ValueError(f"예측에 없는 컬럼: {sorted(missing)}")

    df = forecast.copy()
    df["region"] = df["region"].map(normalize_region)

    out = (
        df.groupby(["region", "property_type"], observed=True)
        .agg(demand=("predicted", "mean"), n=("predicted", "size"))
        .reset_index()
    )
    return out.sort_values(["region", "property_type"]).reset_index(drop=True)


def supply_by_segment(properties: pd.DataFrame) -> pd.DataFrame:
    """우리 플랫폼에 이미 있는 숙소 수를 시장 단위로 센다."""
    need = {"region", "property_type"}
    missing = need - set(properties.columns)
    if missing:
        raise ValueError(f"숙소에 없는 컬럼: {sorted(missing)}")

    out = (
        properties.groupby(["region", "property_type"], observed=True)
        .size()
        .rename("supply")
        .reset_index()
    )
    return out.sort_values(["region", "property_type"]).reset_index(drop=True)


def market_gap(demand: pd.DataFrame, supply: pd.DataFrame,
               wape_by_region: dict[str, float] | None = None) -> pd.DataFrame:
    """시장별 수요 대비 공급 부족.

    ``gap`` 은 숙소 한 곳이 감당해야 하는 수요다 — 클수록 공급이 모자라다.
    ``gap_score`` 는 그것을 0~1 로 눌러 곱셈에 쓸 수 있게 만든 값이다.

    **공급이 0인 시장을 버리지 않는다.** 우리가 한 곳도 없는 시장이야말로 획득
    영업의 본령이라, 여기서 떨어뜨리면 가장 중요한 후보가 조용히 사라진다.
    분모에 ``EMPTY_MARKET_WEIGHT`` 를 더해 0 공급을 1 공급보다 위로 올리고,
    ``MAX_GAP`` 으로 상한을 씌워 발산을 막는다.
    """
    merged = demand.merge(supply, on=["region", "property_type"], how="left")

    # **어휘가 어긋나면 조용히 틀린다.** 지역 이름이 서비스마다 다른데 정규화를
    # 빠뜨리면 조인이 전부 실패하고, 모든 시장의 공급이 0 이 된다. 그러면 이 함수는
    # "전 시장이 최대 기회" 라는 그럴듯한 표를 에러 하나 없이 내놓는다.
    #
    # 판단은 **지역 집합**으로 한다. (지역 × 유형) 쌍이 안 겹치는 것은 정상이다 —
    # 제주에 호텔만 있고 펜션이 없을 수 있고, 그게 바로 획득 기회다. 그런데
    # **지역 이름이 하나도 안 겹치는 것**은 사업 사실일 수가 없다. 우리가 예측하는
    # 시장은 우리 숙소에서 나온 것이기 때문이다.
    if not demand.empty and not supply.empty:
        shared = set(demand["region"]) & set(supply["region"])
        if not shared:
            raise ValueError(
                "수요와 공급의 지역 이름이 하나도 겹치지 않습니다 — "
                "지역 어휘가 어긋났을 가능성이 큽니다"
                f" (수요={sorted(set(demand['region']))[:5]} / "
                f"공급={sorted(set(supply['region']))[:5]})"
            )

    merged["supply"] = merged["supply"].fillna(0).astype(int)

    # 분모에 ``EMPTY_MARKET_WEIGHT`` 를 더한다. 그냥 ``clip(lower=1)`` 로 두면
    # **공급 0 인 시장과 1 인 시장이 똑같은 갭을 낸다** — 한 곳도 없는 시장이
    # 획득 영업의 본령인데 그걸 구분 못 하는 지표가 된다. 0.5 를 더하면 0 공급이
    # 1 공급보다 확실히 위로 오면서 발산도 하지 않는다.
    denom = merged["supply"] + EMPTY_MARKET_WEIGHT
    merged["gap"] = (merged["demand"] / denom).clip(upper=MAX_GAP)
    merged["gap_score"] = (merged["gap"] / MAX_GAP).clip(0.0, 1.0)

    # 표본이 얇은 시장은 점수를 지운다. 0 으로 두면 "기회가 없다" 로 읽히는데
    # 사실은 "모른다" 다. 그 둘을 같은 칸에 넣으면 나중에 가를 수 없다.
    thin = merged["n"] < MIN_MARKET_N
    merged.loc[thin, "gap_score"] = np.nan

    wape_by_region = wape_by_region or {}
    merged["wape"] = merged["region"].map(wape_by_region)
    merged["thin"] = thin

    cols = ["region", "property_type", "demand", "supply", "n",
            "gap", "gap_score", "wape", "thin"]
    return merged[cols].sort_values("gap_score", ascending=False).reset_index(drop=True)


@dataclass(frozen=True)
class Fit:
    """적합도와 그 내역. **총점만 내면 "왜 이 숙소인가" 에 답할 수 없다.**"""

    score: float
    reasons: list[str] = field(default_factory=list)
    #: 축별 값. 화면이 산출식을 펼쳐 보여줄 때 쓴다.
    axes: dict[str, float] = field(default_factory=dict)

    @property
    def rejected(self) -> bool:
        return self.score == 0.0


def property_fit(prospect: dict, market: dict) -> Fit:
    """이 숙소가 그 시장이 필요로 하는 모양에 맞는가.

    축은 넷이다 — 유형 · 규모 · 평점 · 위치. 유형은 게이트이고(시장을 정의하므로
    다르면 애초에 그 시장의 후보가 아니다), 나머지 셋은 0~1 로 매겨 평균한다.

    ``market`` 은 ``market_gap`` 의 한 행에 그 시장의 중앙 규모(``median_capacity``)
    와 지역 내 세부 지역별 공급(``area_supply``)이 붙은 것이다.
    """
    if prospect.get("property_type") != market.get("property_type"):
        return Fit(0.0, ["숙소 유형이 이 시장과 다르다"], {})

    rating = float(prospect.get("rating") or 0.0)
    if rating < MIN_RATING:
        return Fit(0.0, [f"평점 {rating:.1f} — 최소 기준 {MIN_RATING} 미달"], {})

    axes: dict[str, float] = {}
    reasons: list[str] = []

    # 규모 — 그 시장에서 실제로 팔리는 크기에 가까울수록 높다. 크다고 좋은 게
    # 아니라서 절대값이 아니라 **거리**로 잰다.
    median_cap = float(market.get("median_capacity") or 0.0)
    cap = float(prospect.get("capacity") or 0.0)
    if median_cap > 0 and cap > 0:
        axes["capacity"] = max(0.0, 1.0 - abs(cap - median_cap) / median_cap)
        if axes["capacity"] >= 0.8:
            reasons.append(f"{int(cap)}인 규모가 이 시장 중앙값({int(median_cap)}인)에 가깝다")
    else:
        axes["capacity"] = 0.5  # 모르면 중립. 0 으로 두면 모름이 감점이 된다.

    # 평점 — 최소 기준 위에서 5.0 까지를 편다.
    axes["rating"] = min(1.0, (rating - MIN_RATING) / (5.0 - MIN_RATING))
    if rating >= 4.5:
        reasons.append(f"평점 {rating:.1f}")

    # 위치 — 지역 안에서도 우리 숙소가 적은 곳일수록 높다. 같은 제주라도 이미
    # 열 곳이 있는 동네와 한 곳도 없는 동네는 영업 가치가 다르다.
    area_supply = market.get("area_supply") or {}
    area = prospect.get("area")
    if area is None or not area_supply:
        axes["area"] = 0.5
    else:
        here = int(area_supply.get(area, 0))
        busiest = max(area_supply.values()) if area_supply else 0
        axes["area"] = 1.0 if busiest == 0 else max(0.0, 1.0 - here / busiest)
        if here == 0:
            reasons.append(f"{area}에는 우리 숙소가 아직 없다")

    score = float(np.mean([axes["capacity"], axes["rating"], axes["area"]]))
    return Fit(round(score, 4), reasons, {k: round(v, 4) for k, v in axes.items()})


@dataclass(frozen=True)
class Score:
    """획득 점수. **한 숫자로 뭉치지 않는다.**"""

    total: int                    # 0~100
    gap_score: float
    fit: Fit
    #: ``high`` · ``low`` · ``unknown``. 예측 오차에서 온다 — 점수와 섞지 않는다.
    confidence: str
    market: dict

    def explain(self) -> str:
        """왜 이 숙소인가. 화면과 제안서가 같은 문장을 쓰게 한다."""
        m = self.market
        head = (f"{m['region']} {m['property_type']} 시장은 숙소당 예측 수요 "
                f"{m['demand']:.2f} 에 우리 공급이 {m['supply']}곳이다")
        why = " · ".join(self.fit.reasons) if self.fit.reasons else "적합도 특이사항 없음"
        tail = {"high": "", "low": " (예측 오차가 커 사람 확인 필요)",
                "unknown": " (이 지역 오차를 잴 표본이 없었다)"}[self.confidence]
        return f"{head}. {why}.{tail}"


def confidence_of(wape: float | None, thin: bool) -> str:
    """예측을 얼마나 믿을 수 있는가. **점수와 따로 낸다.**

    낮은 신뢰도를 점수에서 빼면 "기회가 작다" 와 "못 믿겠다" 가 한 숫자에 섞인다.
    영업이 취할 행동이 다르므로 갈라 둔다 — 앞은 건너뛰고, 뒤는 사람이 본다.
    """
    if thin or wape is None or (isinstance(wape, float) and np.isnan(wape)):
        return "unknown"
    return "high" if wape <= 0.35 else "low"


def score(prospect: dict, market: dict) -> Score:
    """Market Gap × Property Fit → 0~100.

    ``market`` 은 ``market_gap`` 한 행에 ``median_capacity`` · ``area_supply`` 를
    붙인 dict 다.
    """
    gap = market.get("gap_score")
    fit = property_fit(prospect, market)

    if gap is None or (isinstance(gap, float) and np.isnan(gap)):
        total = 0
    else:
        total = int(round(float(gap) * fit.score * 100))

    return Score(
        total=total,
        gap_score=0.0 if gap is None or np.isnan(gap) else round(float(gap), 4),
        fit=fit,
        confidence=confidence_of(market.get("wape"), bool(market.get("thin"))),
        market=market,
    )


def rank(prospects: list[dict], markets: list[dict]) -> list[Score]:
    """후보를 점수순으로 세운다. 점수가 0 인 것은 뺀다 — 유형이 다르거나
    평점 미달이라 **영업 대상이 아닌 것**이지, 순위가 낮은 것이 아니다."""
    by_market = {(m["region"], m["property_type"]): m for m in markets}
    out: list[Score] = []
    for p in prospects:
        m = by_market.get((p.get("region"), p.get("property_type")))
        if m is None:
            continue
        s = score(p, m)
        if s.total > 0:
            out.append(s)
    return sorted(out, key=lambda s: s.total, reverse=True)


__all__ = [
    "MAX_GAP", "EMPTY_MARKET_WEIGHT", "MIN_MARKET_N", "MIN_RATING",
    "REGION_ALIASES", "normalize_region",
    "Fit", "Score",
    "demand_by_segment", "supply_by_segment", "market_gap",
    "property_fit", "confidence_of", "score", "rank",
]
