"""홀드아웃이 평균 회귀와 개입 효과를 실제로 가르는지 본다.

핵심 테스트는 하나다 — **효과가 0인데도 순진한 추정은 성공을 보고한다.** 그게
홀드아웃이 필요한 이유이고, 그 상황을 여기서 직접 만들어 확인한다.
"""
from __future__ import annotations

import json
import random
from pathlib import Path

import pytest

from analytics.intervention import (DEFAULT_HOLDOUT_RATE, HOLDOUT_VECTORS,
                                    UnitOutcome, measure, split)


# ─────────────────────────────────────────────── 저수요 후보를 만드는 시나리오
def make_outcomes(n_pool: int = 4000, n_candidates: int = 600,
                  effect: float = 0.0, noise: float = 0.08,
                  seed: int = 7) -> list[UnitOutcome]:
    """저수요 개입 파이프라인을 그대로 재현한다.

    1. 단위마다 **진짜 점유율**이 있다
    2. 모델은 그걸 오차와 함께 본다 → ``predicted``
    3. **예측이 가장 낮은 것**을 후보로 고른다 ← 편향이 들어오는 지점
    4. 후보를 개입군/홀드아웃으로 가른다
    5. 실제 결과는 진짜 점유율 + **새 오차** + (개입군이면 효과)

    3번이 핵심이다. 예측 오차가 있는 상태에서 가장 낮은 것을 고르면 그 표본은
    "운 나쁘게 낮게 예측된" 단위로 채워진다. 그 운은 다음 회차에 반복되지 않는다.
    """
    rng = random.Random(seed)
    units = []
    for i in range(n_pool):
        unit_id = f"P{i % 200:03d}:2026-09-{i % 28 + 1:02d}"
        true_rate = min(max(rng.gauss(0.55, 0.15), 0.02), 0.98)
        predicted = min(max(true_rate + rng.gauss(0, noise), 0.0), 1.0)
        units.append((unit_id, true_rate, predicted))

    # 저수요 에이전트가 하는 일: 예측이 낮은 순으로 자른다
    units.sort(key=lambda u: u[2])
    candidates = units[:n_candidates]

    arms = split([u[0] for u in candidates])
    outcomes = []
    for unit_id, true_rate, predicted in candidates:
        treated = arms[unit_id]
        actual = true_rate + rng.gauss(0, noise) + (effect if treated else 0.0)
        outcomes.append(UnitOutcome(unit_id=unit_id, predicted=predicted,
                                    actual=min(max(actual, 0.0), 1.0),
                                    treated=treated))
    return outcomes


# ─────────────────────────────────────────────────── 두 저장소가 같은 답을 내는가
def test_assignment_matches_the_shared_golden_vectors():
    """배정은 조정자(bank-transfer-demo)가 하고 효과는 여기서 잰다.

    두 쪽 규칙이 어긋나면 "이 단위가 어느 군인가" 에 답이 두 개가 되고, 홀드아웃
    자체가 무의미해진다. 같은 파일이 양쪽에 커밋돼 있고 양쪽 테스트가 각자
    검사한다 — 한쪽을 고치면 다른 쪽이 깨진다.
    """
    spec = json.loads(Path(HOLDOUT_VECTORS).read_text(encoding="utf-8"))
    arms = split(list(spec["vectors"]), holdout_rate=spec["holdout_rate"],
                 experiment_id=spec["experiment_id"])
    for unit_id, expected in spec["vectors"].items():
        got = "treated" if arms[unit_id] else "holdout"
        assert got == expected, f"{unit_id}: {got} != {expected}"


def test_the_vector_file_covers_both_arms():
    """한쪽 군만 든 벡터는 규칙이 바뀌어도 안 깨진다."""
    spec = json.loads(Path(HOLDOUT_VECTORS).read_text(encoding="utf-8"))
    assert set(spec["vectors"].values()) == {"treated", "holdout"}


# ─────────────────────────────────────────────────────────────── A4 · 배정
def test_split_is_deterministic():
    """같은 단위는 늘 같은 군이다.

    난수를 쓰면 회차마다 군이 바뀌고, 한 단위의 결과가 두 군에 흩어진다.
    """
    ids = [f"P{i:03d}:2026-09-01" for i in range(500)]
    assert split(ids) == split(ids)


def test_split_respects_the_rate():
    ids = [f"P{i:04d}:2026-09-{i % 28 + 1:02d}" for i in range(6000)]
    held = sum(1 for t in split(ids, holdout_rate=0.25).values() if not t)
    assert 0.23 < held / len(ids) < 0.27


def test_split_refuses_to_treat_everything():
    """홀드아웃 0% 은 "측정하지 않겠다" 와 같은 말이다."""
    with pytest.raises(ValueError):
        split(["P001:2026-09-01"], holdout_rate=0.0)
    with pytest.raises(ValueError):
        split(["P001:2026-09-01"], holdout_rate=1.0)


def test_assignment_is_not_correlated_with_predicted_demand():
    """배정이 예측값과 엮이면 홀드아웃이 견줄 대상이 못 된다."""
    outcomes = make_outcomes()
    treated = [o.predicted for o in outcomes if o.treated]
    holdout = [o.predicted for o in outcomes if not o.treated]
    gap = abs(sum(treated) / len(treated) - sum(holdout) / len(holdout))
    assert gap < 0.01, f"두 군의 예측 수준이 이미 다르다 (차이 {gap:.4f})"


# ───────────────────────────────────────────────────────────── A5 · 효과
def test_naive_estimate_reports_success_when_there_is_no_effect():
    """**이 파일의 요점.**

    개입 효과를 0 으로 두고 돌린다. 그런데도 "예측 대비 실적" 은 크게 양수다 —
    후보를 예측이 낮은 것으로 골랐기 때문이다. 홀드아웃이 없으면 이 숫자밖에
    낼 수 없고, 그래서 에이전트는 아무것도 안 해도 성공한 것처럼 보인다.
    """
    eff = measure(make_outcomes(effect=0.0))
    assert eff.readable

    assert eff.naive_lift > 0.05, (
        f"평균 회귀가 재현되지 않았다 — 순진한 추정 {eff.naive_lift:+.4f}")
    assert abs(eff.true_lift) < 0.015, (
        f"홀드아웃 대비 효과는 0 근처여야 한다 — {eff.true_lift:+.4f}")
    assert eff.overstated_by > 0.05


def test_holdout_recovers_a_planted_effect():
    """효과를 심으면 홀드아웃 대비 추정이 그 값을 찾아낸다."""
    eff = measure(make_outcomes(effect=0.06))
    assert eff.readable
    assert abs(eff.true_lift - 0.06) < 0.015, f"심은 효과를 못 찾았다 — {eff.true_lift:+.4f}"
    # 순진한 추정은 여전히 부풀어 있다: 진짜 효과 + 평균 회귀분
    assert eff.naive_lift > eff.true_lift + 0.04


def test_regression_to_the_mean_shrinks_when_the_model_is_better():
    """편향의 크기는 **예측 오차의 크기**를 따라간다.

    모델이 정확해질수록 "예측이 낮은 것" 을 골라도 편향이 작아진다. 즉 이건
    데이터 문제가 아니라 선택 방식의 문제다.
    """
    noisy = measure(make_outcomes(effect=0.0, noise=0.12))
    sharp = measure(make_outcomes(effect=0.0, noise=0.03))
    assert noisy.naive_lift > sharp.naive_lift * 2


def test_a_null_effect_is_not_called_significant():
    """차이가 0.004 로 나왔다고 "작은 효과가 있었다" 라고 하면 안 된다.

    구간이 0 을 품으면 **"효과 없음" 이 아니라 "모르겠음"** 이고, 둘 다 "효과가
    있었다" 는 아니다.
    """
    eff = measure(make_outcomes(effect=0.0))
    assert not eff.significant
    assert eff.ci_low < 0 < eff.ci_high
    assert "유의하지 않음" in str(eff)


def test_a_real_effect_clears_the_interval():
    eff = measure(make_outcomes(effect=0.06))
    assert eff.significant
    assert eff.ci_low > 0, "구간이 0 을 품으면 효과를 주장할 수 없다"
    assert eff.ci_low < 0.06 < eff.ci_high, "심은 값이 구간 안에 있어야 한다"


def test_significance_requires_readability_first():
    """SRM 이 걸린 결과는 p 값이 아무리 작아도 유의하다고 하지 않는다."""
    outcomes = make_outcomes(effect=0.20)
    kept = [o for o in outcomes if o.treated] + [o for o in outcomes if not o.treated][:20]
    eff = measure(kept)
    assert eff.p_value < 0.05, "이 표본이면 p 는 작다 — 그런데도"
    assert not eff.significant, "읽을 수 없는 결과에 유의성을 붙이면 안 된다"


# ───────────────────────────────────────────── 읽을 수 없는 경우를 읽지 않는다
def test_a_broken_split_is_not_readable():
    """배정이 틀어지면 숫자를 내놓기 전에 멈춘다.

    개입군만 남기고 홀드아웃을 절반 버린다 — 배치 작업이 일부 실패했을 때
    실제로 생기는 모양이다.
    """
    outcomes = make_outcomes(effect=0.06)
    kept = [o for o in outcomes if o.treated] + [o for o in outcomes if not o.treated][:20]
    eff = measure(kept)
    assert not eff.readable
    assert "이상" in str(eff) or "읽을 수 없음" in str(eff)


def test_no_holdout_at_all_is_not_readable():
    outcomes = [o for o in make_outcomes() if o.treated]
    eff = measure(outcomes)
    assert not eff.readable
    assert eff.holdout_n == 0


def test_a_small_holdout_is_readable_but_says_so():
    """멈추지는 않되 결론의 강도를 낮춘다."""
    outcomes = make_outcomes(effect=0.06)
    treated = [o for o in outcomes if o.treated][:56]
    holdout = [o for o in outcomes if not o.treated][:24]
    eff = measure(treated + holdout)
    assert eff.readable
    assert any("홀드아웃이" in n for n in eff.notes)


def test_default_rate_is_what_split_uses():
    """`measure()` 의 기대 비율과 `split()` 의 실제 비율이 어긋나면 SRM 이 헛운다."""
    outcomes = make_outcomes()
    assert measure(outcomes, holdout_rate=DEFAULT_HOLDOUT_RATE).readable
    assert not measure(outcomes, holdout_rate=0.05).readable
