"""획득 점수 — **"왜 이 숙소인가" 에 답할 수 있는지**를 고정한다.

여기서 지키는 것은 총점의 정확한 값이 아니라 **분해 가능성**이다. 87점이
"시장이 커서" 인지 "숙소가 맞아서" 인지 구분되지 않으면 영업이 쓸 수 없다.
그래서 곱셈 구조, 게이트, 그리고 신뢰도를 점수에서 갈라 낸 것 셋을 고정한다.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from analytics.acquisition import (
    EMPTY_MARKET_WEIGHT, MAX_GAP, MIN_MARKET_N, MIN_RATING,
    confidence_of, demand_by_segment, market_gap, normalize_region, property_fit,
    rank, score, supply_by_segment,
)

import pytest


def forecast_rows(region="Jeju", ptype="PENSION", n=10, predicted=2.0):
    return pd.DataFrame([
        {"region": region, "property_type": ptype, "predicted": predicted}
        for _ in range(n)
    ])


def market(**kw):
    base = {
        "region": "제주", "property_type": "PENSION",
        "demand": 2.0, "supply": 1, "n": 10,
        "gap": 2.0, "gap_score": 2.0 / MAX_GAP, "wape": 0.30, "thin": False,
        "median_capacity": 4.0, "area_supply": {"애월": 0, "성산": 3},
    }
    base.update(kw)
    return base


def prospect(**kw):
    base = {"region": "제주", "property_type": "PENSION", "capacity": 4,
            "rating": 4.6, "area": "애월"}
    base.update(kw)
    return base


# ── 시장 집계 ────────────────────────────────────────────────

def test_수요는_합이_아니라_평균으로_접힌다():
    """합으로 접으면 숙소가 많은 시장이 자동으로 수요가 큰 시장이 되고,
    갭의 분자와 분모가 같은 것을 세게 되어 언제나 1 근처가 나온다."""
    df = demand_by_segment(forecast_rows(n=10, predicted=2.0))
    assert df.loc[0, "demand"] == 2.0
    assert df.loc[0, "n"] == 10


def test_공급이_없는_시장이_사라지지_않는다():
    """우리가 한 곳도 없는 시장이야말로 획득 영업의 본령이다."""
    demand = demand_by_segment(forecast_rows())          # 제주 · PENSION
    # 같은 지역에 유형만 다른 숙소가 있다 — 지역은 겹치되 그 시장의 공급은 0.
    supply = supply_by_segment(pd.DataFrame([
        {"region": "제주", "property_type": "HOTEL"},
    ]))
    gaps = market_gap(demand, supply)

    jeju = gaps[gaps["region"] == "제주"].iloc[0]
    assert jeju["supply"] == 0
    # 공급 0 은 분모가 EMPTY_MARKET_WEIGHT 라 1 공급보다 확실히 크고,
    # 여기서는 상한에 걸린다 (2.0 / 0.5 = 4.0 > MAX_GAP).
    assert jeju["gap"] == MAX_GAP
    assert jeju["gap_score"] == 1.0


def test_공급_0과_1이_같은_갭을_내지_않는다():
    """분모를 clip(lower=1) 로 두면 둘이 똑같아진다 — 획득 영업이 가장 먼저
    봐야 할 시장이 순위에서 묻히는 회귀다."""
    demand = demand_by_segment(forecast_rows())
    empty = market_gap(demand, supply_by_segment(pd.DataFrame(
        [{"region": "제주", "property_type": "HOTEL"}])))
    one = market_gap(demand, supply_by_segment(pd.DataFrame(
        [{"region": "제주", "property_type": "PENSION"}])))

    assert empty.loc[0, "gap"] > one.loc[0, "gap"]


def test_표본이_얇은_시장은_0이_아니라_모름이다():
    """0 으로 두면 "기회가 없다" 로 읽히는데 사실은 "모른다" 다."""
    demand = demand_by_segment(forecast_rows(n=MIN_MARKET_N - 1))
    gaps = market_gap(demand, supply_by_segment(pd.DataFrame(
        [{"region": "제주", "property_type": "PENSION"}])))

    assert bool(gaps.loc[0, "thin"]) is True
    assert np.isnan(gaps.loc[0, "gap_score"])


def test_예측_오차를_결과에_달고_다닌다():
    """ML 서비스가 스키마로 강제한 것을 한 홉 만에 떨어뜨리지 않는다."""
    demand = demand_by_segment(forecast_rows())
    gaps = market_gap(demand, supply_by_segment(pd.DataFrame(
        [{"region": "제주", "property_type": "PENSION"}])), {"제주": 0.42})
    assert gaps.loc[0, "wape"] == 0.42


def test_예측_서비스의_영문_지역을_우리_이름으로_옮긴다():
    """예측은 Seoul, 원장은 서울. 정본은 고객에게 보이는 원장 쪽이다."""
    df = demand_by_segment(forecast_rows(region="Jeju"))
    assert df.loc[0, "region"] == "제주"


def test_지역은_겹치고_유형만_다른_것은_정상이다():
    """제주에 호텔만 있고 펜션이 없을 수 있다 — 그게 바로 획득 기회다."""
    demand = demand_by_segment(forecast_rows())          # 제주 · PENSION
    supply = supply_by_segment(pd.DataFrame(
        [{"region": "제주", "property_type": "HOTEL"}]))
    assert market_gap(demand, supply).loc[0, "supply"] == 0


def test_모르는_지역은_버리지_않고_그대로_둔다():
    """여기서 버리면 새 지역이 생겼을 때 조용히 사라진다."""
    assert normalize_region("Sokcho") == "Sokcho"


def test_어휘가_어긋나면_조용히_넘어가지_않고_터진다():
    """정규화를 빠뜨리면 조인이 전부 실패해 "전 시장이 최대 기회" 라는
    그럴듯한 표가 에러 없이 나온다. 그 침묵이 이 프로젝트에서 제일 위험하다."""
    demand = pd.DataFrame([{"region": "Atlantis", "property_type": "PENSION",
                            "demand": 2.0, "n": 10}])
    supply = supply_by_segment(pd.DataFrame(
        [{"region": "제주", "property_type": "PENSION"}]))

    with pytest.raises(ValueError, match="어휘"):
        market_gap(demand, supply)


# ── 적합도 ───────────────────────────────────────────────────

def test_유형이_다르면_애초에_그_시장의_후보가_아니다():
    fit = property_fit(prospect(property_type="HOTEL"), market())
    assert fit.rejected
    assert "유형" in fit.reasons[0]


def test_최소_평점_미달은_점수로_누르지_않고_탈락시킨다():
    """점수로 누르면 목록 아래쪽에 살아남아 언젠가 영업 대상이 된다."""
    fit = property_fit(prospect(rating=MIN_RATING - 0.1), market())
    assert fit.rejected


def test_규모는_클수록이_아니라_가까울수록_좋다():
    near = property_fit(prospect(capacity=4), market(median_capacity=4.0))
    far = property_fit(prospect(capacity=12), market(median_capacity=4.0))
    assert near.axes["capacity"] > far.axes["capacity"]


def test_모르는_축은_감점이_아니라_중립이다():
    fit = property_fit(prospect(capacity=None), market())
    assert fit.axes["capacity"] == 0.5


def test_같은_지역이라도_우리가_없는_동네가_더_높다():
    empty = property_fit(prospect(area="애월"), market())
    crowded = property_fit(prospect(area="성산"), market())
    assert empty.axes["area"] > crowded.axes["area"]


def test_적합도는_이유를_함께_낸다():
    """총점만 내면 "왜 이 숙소인가" 에 답할 수 없다."""
    fit = property_fit(prospect(), market())
    assert fit.reasons


# ── 점수 ─────────────────────────────────────────────────────

def test_시장이_없으면_좋은_숙소도_기회가_아니다():
    """더하기였다면 살아남는다. 곱하기라서 0 이 된다."""
    s = score(prospect(), market(gap_score=0.0))
    assert s.total == 0


def test_신뢰도는_점수에서_갈라_낸다():
    """오차가 커도 점수를 깎지 않는다 — 깎으면 "기회가 작다" 와
    "못 믿겠다" 가 한 숫자에 섞여 행동을 못 고른다."""
    trusted = score(prospect(), market(wape=0.20))
    doubted = score(prospect(), market(wape=0.80))

    assert trusted.total == doubted.total
    assert trusted.confidence == "high"
    assert doubted.confidence == "low"


def test_표본이_없던_지역은_모름으로_남는다():
    assert confidence_of(None, thin=False) == "unknown"
    assert confidence_of(float("nan"), thin=False) == "unknown"
    assert confidence_of(0.1, thin=True) == "unknown"


def test_설명이_시장과_숙소_양쪽을_말한다():
    text = score(prospect(), market()).explain()
    assert "제주" in text and "PENSION" in text
    assert "애월" in text


def test_순위는_영업_대상이_아닌_것을_빼고_세운다():
    """유형 불일치·평점 미달은 순위가 낮은 게 아니라 대상이 아니다."""
    ranked = rank(
        [prospect(area="애월"), prospect(rating=2.0), prospect(property_type="HOTEL")],
        [market()],
    )
    assert len(ranked) == 1
    assert ranked[0].total > 0


def test_점수가_높은_순으로_정렬된다():
    ranked = rank(
        [prospect(area="성산", capacity=12), prospect(area="애월", capacity=4)],
        [market()],
    )
    assert [s.total for s in ranked] == sorted([s.total for s in ranked], reverse=True)
