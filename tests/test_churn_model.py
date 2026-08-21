"""이탈 예측(E4).

**모델이 아니라 데이터를 자르는 방법을 검사한다.** 로지스틱 회귀는 어디에나 있고,
틀리는 자리는 언제나 누수·나눔·절단 셋이다.
"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd
import pytest

from analytics.churn_model import (ChurnModel, build, evaluate, split_by_time)
from analytics.simulator import SimConfig, simulate

TRAIN_CUT = datetime(2025, 7, 5)
TEST_CUT = datetime(2025, 7, 12)


def frame(structure: bool = True, n: int = 12000, days: int = 60,
          seed: int = 11) -> pd.DataFrame:
    ev, _ = simulate(SimConfig(n_visitors=n, days=days, seed=seed,
                               churn_structure=structure))
    df = pd.DataFrame(ev)
    df["sent_at"] = pd.to_datetime(df["sent_at"])
    return df


@pytest.fixture(scope="module")
def structured() -> pd.DataFrame:
    return frame(structure=True)


@pytest.fixture(scope="module")
def placebo() -> pd.DataFrame:
    """이탈이 행동과 **아무 상관 없는** 데이터. 배울 것이 없는 것이 정답이다."""
    return frame(structure=False)


def fit_on(df: pd.DataFrame, columns: list[str] | None = None):
    tr, te = split_by_time(df, TRAIN_CUT, TEST_CUT, horizon_days=14)
    if columns is not None:
        tr.X, te.X = tr.X[columns], te.X[columns]
    return ChurnModel().fit(tr.X, tr.y), te


BEHAVIOUR = ["visits", "views", "booked", "cancelled", "is_mobile", "tenure_days"]


# ────────────────────────────────────────── 1. 누수 — 특징은 기준일 앞에서만
def test_features_never_see_past_the_cutoff(structured):
    """기준일 뒤의 행동이 특징에 섞이면 예측이 아니라 결과다."""
    early = build(structured, TRAIN_CUT, horizon_days=14)
    late = build(structured, TEST_CUT, horizon_days=14)
    # 같은 사람의 방문 수는 기준일이 뒤로 갈수록 늘거나 같다 — 줄면 미래를 본 것이다
    common = early.X.index.intersection(late.X.index)
    assert (late.X.loc[common, "visits"] >= early.X.loc[common, "visits"]).all()


def test_a_leaked_label_gives_a_suspiciously_perfect_score(structured):
    """**누수의 모양을 직접 만들어 본다.**

    라벨 창의 방문 수를 특징에 넣으면 AUC 가 1 에 붙는다. 실전에서 이 숫자를 보면
    기뻐할 게 아니라 파이프라인을 뒤져야 한다.
    """
    tr, te = split_by_time(structured, TRAIN_CUT, TEST_CUT, horizon_days=14)

    def leak(data, cut):
        end = cut + timedelta(days=14)
        fut = structured[(structured["sent_at"] >= cut) & (structured["sent_at"] < end)]
        n = fut[fut["event_name"] == "search_performed"].groupby("anonymous_id").size()
        X = data.X.copy()
        X["future_visits"] = n.reindex(X.index).fillna(0)
        return X

    tr.X, te.X = leak(tr, TRAIN_CUT), leak(te, TEST_CUT)
    leaked = evaluate(ChurnModel().fit(tr.X, tr.y), te)
    assert leaked.auc > 0.98, f"누수를 심었는데 {leaked.auc:.3f} 밖에 안 나왔다"


# ────────────────────────────────────────── 2. 나눔은 시간으로
def test_the_test_cutoff_must_come_after_the_train_cutoff(structured):
    with pytest.raises(ValueError):
        split_by_time(structured, TEST_CUT, TRAIN_CUT, horizon_days=14)


def test_the_two_splits_are_different_moments(structured):
    tr, te = split_by_time(structured, TRAIN_CUT, TEST_CUT, horizon_days=14)
    assert tr.cutoff < te.cutoff
    # 뒤 기준일이 사람을 더 많이 본다 — 그 사이 새 방문자가 들어왔다
    assert len(te.y) > len(tr.y)


# ────────────────────────────────────────── 3. 절단 — 라벨에 완전한 창이 필요하다
def test_a_cutoff_without_a_full_window_is_refused(structured):
    """**조용히 줄이지 않는다.**

    창이 모자란데 그대로 라벨하면 "안 돌아온" 과 "돌아올 시간이 없었다" 가 섞이고,
    이탈률이 부풀고, 모델은 늦은 코호트를 전부 이탈로 배운다.
    """
    end = structured["sent_at"].max()
    with pytest.raises(ValueError, match="관측 밖으로"):
        build(structured, end - timedelta(days=3), horizon_days=14)


def test_the_error_names_both_possibilities(structured):
    end = structured["sent_at"].max()
    try:
        build(structured, end - timedelta(days=3), horizon_days=14)
    except ValueError as e:
        assert "돌아올 시간이 없었다" in str(e)


# ────────────────────────────────────────── 4. 위약 대조 — 이 파일의 요점
def test_a_high_auc_also_appears_where_there_is_nothing_to_learn(structured, placebo):
    """**E4 에서 가장 중요한 테스트.**

    이탈 구조를 끈 데이터 — 누가 돌아올지가 행동과 아무 상관 없는 데이터 — 에서도
    AUC 가 0.87 근처로 나온다. 모델이 읽은 것은 행동이 아니라 `days_since_last`,
    즉 **표집 방식의 부산물**이다.

    위약 대조 없이 읽은 점수는 그 자체로는 아무 말도 하지 않는다.
    """
    real = evaluate(*fit_on(structured))
    fake = evaluate(*fit_on(placebo))

    assert real.auc > 0.8, "구조가 있는 쪽은 높게 나온다"
    assert fake.auc > 0.8, "그런데 배울 것이 없는 쪽도 높게 나온다"
    assert abs(real.auc - fake.auc) < 0.03, (
        f"두 점수가 갈렸다 — 이 테스트의 전제가 깨졌다 ({real.auc:.3f} vs {fake.auc:.3f})")


def test_the_real_signal_shows_only_once_recency_is_removed(structured, placebo):
    """최근성을 빼면 그제서야 갈린다. 그 차이가 실제 신호다."""
    real = evaluate(*fit_on(structured, BEHAVIOUR))
    fake = evaluate(*fit_on(placebo, BEHAVIOUR))

    assert real.auc - fake.auc > 0.04, (
        f"행동 신호가 안 잡힌다 ({real.auc:.3f} vs {fake.auc:.3f})")
    assert fake.auc < 0.56, f"위약이 {fake.auc:.3f} — 배울 게 없는데 배웠다면 어딘가 새고 있다"


def test_the_planted_signs_are_recovered(structured):
    """시뮬레이터에 심은 부호를 모델이 되찾는가.

    라벨이 **이탈**이므로 부호가 뒤집힌다 — 예약은 이탈을 줄이고(음수), 취소는
    늘린다(양수).
    """
    model, _ = fit_on(structured, BEHAVIOUR)
    w = model.weights()
    assert w["booked"] < 0, f"예약이 이탈을 줄여야 한다 ({w['booked']:+.3f})"
    assert w["cancelled"] > 0, f"취소가 이탈을 늘려야 한다 ({w['cancelled']:+.3f})"


# ────────────────────────────────────────── 5. AUC 하나만 보지 않는다
def test_the_base_rate_travels_with_the_auc(structured):
    """기저율이 없으면 그 AUC 가 훌륭한지 아닌지 알 수 없다."""
    e = evaluate(*fit_on(structured))
    assert e.base_rate > 0.85, "이 데이터는 심하게 불균형하다"
    assert "기저 이탈률" in str(e)
    assert any("쏠려" in n for n in e.notes)


def test_a_high_auc_can_come_with_a_useless_lift(structured):
    """**순위가 좋아도 쓸 데가 없을 수 있다.**

    기저 이탈률이 93% 면 상위 10% 를 골라도 이탈률이 거의 안 오른다. 쿠폰을 누구에게
    줄지 정하는 쪽에서는 AUC 가 아니라 이 숫자가 답이다.
    """
    e = evaluate(*fit_on(structured))
    assert e.auc > 0.8
    assert e.lift_at_10 < 1.2, "기저율이 93% 인데 리프트가 크면 뭔가 새고 있다"


def test_calibration_is_reported_separately(structured):
    """확률을 그대로 쓰려면 순위가 아니라 보정을 봐야 한다."""
    e = evaluate(*fit_on(structured))
    assert abs(e.calibration_gap) < 0.05, f"확률 평균이 실제와 {e.calibration_gap:+.3f} 어긋난다"


def test_a_coin_flip_is_reported_as_a_coin_flip(placebo):
    """**AUC 0.5 는 실패가 아니라 사실일 수 있다.**

    시뮬레이션을 또 돌리지 않는다 — 이 파일에서 가장 비싼 것이 시뮬레이션이고,
    같은 데이터로 답할 수 있는 질문에 새 데이터를 쓸 이유가 없다.
    """
    e = evaluate(*fit_on(placebo, ["is_mobile"]))
    assert not e.useful
    assert "동전 던지기" in str(e)


# ────────────────────────────────────────── 방문의 정의
def test_a_cancellation_is_not_a_return_visit(structured):
    """취소는 며칠 뒤에 따라오는 이벤트지 방문이 아니다.

    방문으로 세면 취소한 사람이 전부 "돌아온" 것으로 잡히고, 취소가 이탈을 **줄이는**
    것으로 학습된다 — 시뮬레이터에 심은 부호와 정반대다.
    """
    late = structured[structured["sent_at"] >= TRAIN_CUT]
    cancels = late[late["event_name"] == "booking_cancelled"]["anonymous_id"]
    assert len(cancels) > 0, "이 구간에 취소가 있어야 검사가 성립한다"

    data = build(structured, TRAIN_CUT, horizon_days=14)
    only_cancel = [
        a for a in cancels
        if a in data.y.index
        and a not in set(late[(late["event_name"] == "search_performed")
                              & (late["sent_at"] < TRAIN_CUT + timedelta(days=14))]["anonymous_id"])
    ]
    assert only_cancel, "취소만 하고 다시 안 온 사람이 있어야 한다"
    assert data.y.loc[only_cancel].all(), "취소 이벤트가 방문으로 세어졌다"
