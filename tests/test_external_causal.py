"""외부 데이터와 관측 인과(E6 / D1·D3).

여기서 막는 사고는 하나같이 **에러 없이 틀린 숫자**를 만든다 — 그래서 타입과
게이트로 막는다.
"""
from __future__ import annotations

from datetime import date, timedelta

import pytest

from analytics.causal import did, pretrend
from analytics.external.series import (ExternalSeries, FetchWindow, Observation,
                                       ScaleKind, align)

W1 = FetchWindow(date(2024, 1, 1), date(2024, 12, 31), date(2025, 1, 5))
W2 = FetchWindow(date(2025, 1, 1), date(2025, 12, 31), date(2026, 1, 5))


def series(window=W1, scale=ScaleKind.RELATIVE_INDEX, key="야놀자",
           source="datalab", unit="index", values=None, start=None):
    start = start or window.start
    values = values if values is not None else [50.0, 60.0, 70.0]
    obs = [Observation(start + timedelta(days=30 * i), v) for i, v in enumerate(values)]
    return ExternalSeries(source=source, key=key, window=window, scale=scale,
                          unit=unit, observations=obs)


# ─────────────────────────────── D1-1. 상대 지수는 조회마다 자가 다르다
def test_two_pulls_of_a_relative_index_cannot_be_concatenated():
    """**그래프는 멀쩡해 보이고 숫자는 뜻이 없다.**

    데이터랩·트렌드가 주는 값은 요청 창 안에서 최댓값을 100 으로 다시 스케일한
    지수다. 창이 다르면 다른 자로 잰 것이다.
    """
    a, b = series(W1), series(W2)
    with pytest.raises(ValueError, match="상대 지수는 조회 창마다"):
        a.concat(b)


def test_the_error_says_how_to_fix_it():
    with pytest.raises(ValueError, match="한 번의 요청, 한 창"):
        series(W1).concat(series(W2))


def test_absolute_values_can_be_concatenated_across_windows():
    """원·건수는 창이 달라도 같은 자다. 전부 막으면 쓸 수 없는 물건이 된다."""
    a = series(W1, ScaleKind.ABSOLUTE, unit="KRW", values=[1e8, 2e8])
    b = series(W2, ScaleKind.ABSOLUTE, unit="KRW", values=[3e8, 4e8])
    joined = a.concat(b)
    assert len(joined.observations) == 4
    assert joined.window.start == W1.start and joined.window.end == W2.end


def test_the_same_window_can_be_concatenated_even_for_an_index():
    """한 번의 요청에서 나온 조각들은 같은 자다."""
    a = series(W1, values=[50.0, 60.0])
    b = ExternalSeries("datalab", "야놀자", W1, ScaleKind.RELATIVE_INDEX, "index",
                       [Observation(date(2024, 6, 1), 80.0)])
    assert len(a.concat(b).observations) == 3


def test_mixing_scales_is_refused():
    with pytest.raises(ValueError, match="척도가 다르다"):
        series(W1, ScaleKind.RELATIVE_INDEX).concat(series(W1, ScaleKind.ABSOLUTE))


def test_observations_outside_the_declared_window_are_refused():
    """창을 들고 다니게 해 놓고 창 밖 값을 허용하면 그 창은 장식이다."""
    with pytest.raises(ValueError, match="조회 창 밖의 관측"):
        ExternalSeries("dart", "광고선전비", W1, ScaleKind.ABSOLUTE, "KRW",
                       [Observation(date(2023, 5, 1), 1.0)])


# ─────────────────────────────── D1-2. 없는 것과 0 은 다르다
def test_a_missing_value_is_not_zero():
    """`광고선전비` 가 안 쪼개져 있는 것과 광고를 안 한 것은 다른 사실이다."""
    s = ExternalSeries("dart", "광고선전비", W1, ScaleKind.ABSOLUTE, "KRW", [
        Observation(date(2024, 3, 31), 1.2e9),
        Observation(date(2024, 6, 30), None, "판관비 주석에 안 쪼개져 있었다"),
        Observation(date(2024, 9, 30), 1.5e9),
    ])
    assert s.values() == [1.2e9, 1.5e9], "결측을 0 으로 채우면 안 된다"
    assert len(s.missing) == 1
    assert s.missing[0].missing_reason
    assert s.coverage == pytest.approx(2 / 3)


def test_absence_is_normal_not_an_error():
    """전부 비어 있어도 예외를 던지지 않는다 — 공시에 따라 정상적으로 그렇다."""
    s = ExternalSeries("dart", "광고선전비", W1, ScaleKind.ABSOLUTE, "KRW",
                       [Observation(date(2024, 3, 31), None, "본문·주석 모두 없음")])
    assert s.values() == []
    assert s.coverage == 0.0


def test_the_summary_line_says_how_many_are_missing():
    s = ExternalSeries("dart", "광고선전비", W1, ScaleKind.ABSOLUTE, "KRW", [
        Observation(date(2024, 3, 31), 1.0),
        Observation(date(2024, 6, 30), None),
    ])
    assert "결측 1" in str(s)


# ─────────────────────────────── D1-3. 맞추기
def test_aligning_two_index_series_from_different_pulls_is_refused():
    """처치군과 대조군을 다른 자로 재고 차이를 빼면 그 차이는 자의 차이다."""
    with pytest.raises(ValueError, match="다른 자로 재고"):
        align(series(W1, key="야놀자"), series(W2, key="여기어때"))


def test_alignment_drops_dates_where_either_side_is_missing():
    a = ExternalSeries("datalab", "a", W1, ScaleKind.ABSOLUTE, "n", [
        Observation(date(2024, 1, 1), 1.0), Observation(date(2024, 2, 1), 2.0)])
    b = ExternalSeries("datalab", "b", W1, ScaleKind.ABSOLUTE, "n", [
        Observation(date(2024, 1, 1), 5.0), Observation(date(2024, 2, 1), None)])
    assert align(a, b) == [(date(2024, 1, 1), 1.0, 5.0)]


# ─────────────────────────────── D3-1. 평행추세는 게이트다
CAMPAIGN = date(2024, 7, 1)


#: 결정적인 흔들림. 완벽한 직선이면 잔차가 0 이라 t 검정이 극한으로 가고,
#: 그러면 실제로 쓰이는 경로를 시험하지 못한다.
WOBBLE = (0.4, -0.3, 0.2, -0.5, 0.3, -0.2, 0.5, -0.4)


def parallel_data(gap_slope=0.0, n_pre=8, n_post=6):
    """개입 전 두 계열이 나란히(또는 벌어지며) 움직이는 자료."""
    rows = []
    for i in range(n_pre):
        d = CAMPAIGN - timedelta(days=30 * (n_pre - i))
        w = WOBBLE[i % len(WOBBLE)]
        rows.append((d, 100 + 2.0 * i + gap_slope * i + w, 100 + 2.0 * i - w))
    for i in range(n_post):
        d = CAMPAIGN + timedelta(days=30 * i)
        rows.append((d, 100 + 2.0 * (n_pre + i) + gap_slope * (n_pre + i) + 10,
                     100 + 2.0 * (n_pre + i)))
    return rows


def test_parallel_pre_trends_pass_the_gate():
    p = pretrend.check(parallel_data(gap_slope=0.0), CAMPAIGN)
    assert p.parallel
    assert "효과 추정으로 넘어가도 된다" in p.verdict


def test_diverging_pre_trends_fail_the_gate():
    """**개입 후 차이가 아무리 커도 구제되지 않는다.**"""
    p = pretrend.check(parallel_data(gap_slope=1.5), CAMPAIGN)
    assert not p.parallel
    assert "가를 수 없다" in p.verdict


def test_a_failed_pre_trend_is_reported_as_a_finding():
    p = pretrend.check(parallel_data(gap_slope=1.5), CAMPAIGN)
    assert "실패가 아니라 발견" in p.verdict


def test_too_few_pre_periods_is_not_a_pass():
    """두 점으로는 어떤 두 직선도 평행이다."""
    p = pretrend.check(parallel_data(gap_slope=0.0, n_pre=3), CAMPAIGN)
    assert not p.parallel
    assert "판정 불가" in p.verdict
    assert "두 점으로는" in p.verdict


def test_a_non_significant_but_large_gap_is_called_unknown():
    """**"유의하지 않으니 평행하다" 는 틀렸다.**

    관측이 적으면 어떤 기울기 차이든 유의하지 않게 나온다. 그건 평행의 증거가
    아니라 모른다는 뜻이다.
    """
    rows = []
    for i in range(5):
        d = CAMPAIGN - timedelta(days=30 * (5 - i))
        # 기울기는 크게 다른데 잡음도 커서 p 가 크게 나오는 모양
        rows.append((d, 100 + 6.0 * i + (12 if i % 2 else -12), 100 + 2.0 * i))
    p = pretrend.check(rows, CAMPAIGN)
    assert p.p_value >= 0.05, f"이 자료에서는 p 가 작다 ({p.p_value:.3f})"
    assert abs(p.relative_gap) > pretrend.PARALLEL_TOLERANCE
    assert p.underpowered
    assert not p.parallel
    assert "모른다는 뜻" in p.verdict


def test_no_pre_period_at_all():
    p = pretrend.check([(CAMPAIGN + timedelta(days=1), 1.0, 1.0)], CAMPAIGN)
    assert p.n_pre == 0
    assert not p.parallel


# ─────────────────────────────── D3-2. 게이트가 추정을 막는다
def test_did_refuses_to_compute_when_the_gate_failed():
    """**주석을 달고 계수를 내놓지 않는다.**

    읽는 사람은 계수를 읽고 단서는 안 읽는다. 그래서 막는다.
    """
    rows = parallel_data(gap_slope=1.5)
    p = pretrend.check(rows, CAMPAIGN)
    result = did.estimate(rows, CAMPAIGN, p)

    assert not result.readable
    assert result.effect is None, "막혔으면 0 이 아니라 None 이다"
    assert "가를 수 없다" in result.blocked
    assert result.blocked.count("평행하지 않다") == 1, "같은 문장이 두 번 나온다"
    assert "추정하지 않는다" in result.statement


def test_did_computes_once_the_gate_passes():
    rows = parallel_data(gap_slope=0.0)
    p = pretrend.check(rows, CAMPAIGN)
    result = did.estimate(rows, CAMPAIGN, p)

    assert result.readable
    assert result.effect == pytest.approx(10.0, abs=0.5), "심은 +10 을 되찾아야 한다"


def test_the_strongest_available_sentence_never_says_caused():
    """실험이라면 "일으켰다" 를 쓸 수 있다. 여기서는 자격이 없다."""
    rows = parallel_data(gap_slope=0.0)
    result = did.estimate(rows, CAMPAIGN, pretrend.check(rows, CAMPAIGN))
    s = result.statement
    assert "일으켰다" not in s
    assert "일관되며" in s
    assert "배제할 수 없다" in s


def test_the_standing_threats_are_always_attached():
    """뭉뚱그린 "한계" 는 아무도 안 읽는다. 하나씩 이름으로 남긴다."""
    rows = parallel_data(gap_slope=0.0)
    result = did.estimate(rows, CAMPAIGN, pretrend.check(rows, CAMPAIGN))
    assert set(did.STANDING_THREATS) <= set(result.threats)
    assert any("성수기" in t for t in result.threats)


def test_extra_threats_add_but_cannot_remove():
    """여기 있는 것은 뺄 수 없다 — 보고서마다 다시 쓰게 두면 불리한 게 빠진다."""
    rows = parallel_data(gap_slope=0.0)
    result = did.estimate(rows, CAMPAIGN, pretrend.check(rows, CAMPAIGN),
                          extra_threats=("경쟁사가 같은 달에 앱을 개편했다",))
    assert len(result.threats) == len(did.STANDING_THREATS) + 1


def test_the_pretrend_is_a_required_argument():
    """기본값을 주면 안 부르고도 돌릴 수 있게 되고, 그러면 문턱이 아니다."""
    with pytest.raises(TypeError):
        did.estimate(parallel_data(), CAMPAIGN)     # type: ignore[call-arg]


# ─────────────────────────────── D2. 관측 연구의 사전등록
def test_the_observational_preregistration_loads():
    """실험용 로더가 그대로 읽어야 한다 — 형식이 갈리면 검사기도 갈린다."""
    from analytics.preregistration import load

    p = load("obs_lodging_campaign")
    assert p.id == "obs_lodging_campaign"
    assert p.kind == "retrospective", "소급을 소급이라고 적어야 한다"
    assert p.design["method"] == "difference_in_differences"


def test_the_control_group_is_named_with_a_reason():
    """**결과를 본 뒤에 대조군을 고르는 것이 관측 자료판 p-해킹이다.**"""
    import tomllib
    from pathlib import Path

    from analytics.preregistration import PREREG_DIR

    raw = tomllib.loads(
        (Path(PREREG_DIR) / "obs_lodging_campaign.toml").read_text(encoding="utf-8"))
    control = raw["control"]
    assert control["name"]
    assert len(control["reason"].strip()) > 20, "왜 그것인지 없으면 안 고른 것과 같다"
    assert control["rejected"], "탈락 후보가 없으면 '그때 그걸 골랐으면' 에 답할 수 없다"


def test_no_mde_is_promised_where_the_sample_cannot_grow():
    """못 하는 약속을 적어 두면 그 자체가 거짓말이다."""
    from analytics.preregistration import load

    assert "mde" not in load("obs_lodging_campaign").primary


def test_the_gate_matches_the_code(monkeypatch):
    """파일이 정한 문턱과 코드의 기본값이 어긋나면 사전등록이 장식이 된다."""
    from analytics.preregistration import load

    gates = load("obs_lodging_campaign").gates
    assert gates["min_pre_periods"] == pretrend.MIN_PRE_PERIODS
    assert gates["pretrend_tolerance"] == pretrend.PARALLEL_TOLERANCE
    assert gates["estimate_only_if_parallel"] is True


def test_the_named_threats_survive_into_the_report():
    """분석이 끝난 뒤 유리한 것만 남기지 못하게 한다."""
    import tomllib
    from pathlib import Path

    from analytics.preregistration import PREREG_DIR

    raw = tomllib.loads(
        (Path(PREREG_DIR) / "obs_lodging_campaign.toml").read_text(encoding="utf-8"))
    registered = {t["name"] for t in raw["threats"]}
    assert len(registered) == 4

    rows = parallel_data(gap_slope=0.0)
    result = did.estimate(rows, CAMPAIGN, pretrend.check(rows, CAMPAIGN))
    # 이름이 그대로 같을 필요는 없지만, 등록한 수만큼은 보고서에 실려야 한다
    assert len(result.threats) >= len(registered)
