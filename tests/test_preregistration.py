"""사전등록과 규칙 검사기.

**이 파일에도 LLM 이 없다.** 결과 검토에서 규칙으로 잡을 수 있는 것은 규칙이
잡는다 — 표본·SRM·순서·부분군·다중비교. 전부 산술이고 비교다.

검사기는 보고서가 아니라 **게이트**다. `readable` 이 거짓이면 전환율을 읽지 않는다.
"""
from __future__ import annotations

from datetime import date

import pytest

from analytics.preregistration import (
    Level, Prereg, Result, adjusted_alpha, check, load,
)

D0 = date(2025, 6, 1)


def prereg(**over) -> Prereg:
    base = dict(
        id="x", kind="prospective", registered_at=date(2025, 5, 20),
        hypothesis="가설", primary={"metric": "m", "alpha": 0.05, "mde": 0.1},
        design={"required_per_group": 1_000},
        gates={"read_conversion_only_if_srm_healthy": True},
        segments=[{"name": "visit_type", "reason": "r"}],
        multiplicity={},
    )
    base.update(over)
    return Prereg(**base)


def result(**over) -> Result:
    base = dict(
        exposed={"control": 1_200, "treatment": 1_200},
        srm_healthy=True, srm_checked=True,
        reported_segments=set(), tested_metrics=1, data_starts=D0,
    )
    base.update(over)
    return Result(**base)


# ─────────────────────────────── 통과해야 하는 것
def test_a_clean_run_has_nothing_to_say():
    """계획대로면 아무 말도 안 한다. 늘 뭐라도 말하는 검사기는 무시된다."""
    v = check(prereg(), result())
    assert v.readable
    assert not v.violations
    assert v.strength == "보통"


# ─────────────────────────────── 막아야 하는 것
def test_a_broken_assignment_blocks_reading_conversion():
    """배정이 틀어졌으면 전환율 차이가 처치 때문인지 알 수 없다."""
    v = check(prereg(), result(srm_healthy=False))
    assert not v.readable
    assert any(x.rule == "SRM 위반" and x.level is Level.BLOCK for x in v.violations)


def test_not_checking_srm_at_all_also_blocks():
    """안 본 것과 봐서 통과한 것은 다르다."""
    v = check(prereg(), result(srm_checked=False))
    assert not v.readable


def test_claiming_prospective_after_the_data_is_a_block():
    """데이터를 본 뒤에 쓴 등록은 사전등록이 아니다.

    소급이라고 적으면 통과하되 약해진다. **거짓으로 적으면 막는다** — 그 거짓말이
    통과하면 이 장치 전체가 장식이 된다.
    """
    v = check(prereg(registered_at=date(2025, 7, 1)), result())
    assert not v.readable
    assert any(x.rule == "사전성" for x in v.violations)


# ─────────────────────────────── 약해지는 것
def test_a_retrospective_analysis_is_allowed_but_weaker():
    v = check(prereg(kind="retrospective", registered_at=date(2025, 7, 1)), result())
    assert v.readable, "소급 분석이 쓸모없다는 뜻이 아니다"
    assert v.strength == "약함"


def test_missing_the_planned_sample_weakens_not_blocks():
    """표본이 모자란 것은 사고가 아니라 '아직' 이다."""
    v = check(prereg(), result(exposed={"control": 400, "treatment": 420}))
    assert v.readable
    assert any(x.rule == "표본 부족" and x.level is Level.WEAKEN for x in v.violations)


def test_a_segment_that_was_not_registered_is_flagged():
    """등록에 없던 축으로 쪼갠 결과는 계획된 게 아니라 주워온 것이다."""
    v = check(prereg(), result(reported_segments={"visit_type", "property_type"}))
    hit = next(x for x in v.violations if x.rule == "사후 부분군")
    # 걸린 축은 등록에 없던 것뿐이어야 한다. 메시지 뒷부분의 "등록된 축은 …" 은
    # 안내라서 visit_type 이 거기 나오는 것은 정상이다 — 그 둘을 문자열로 구분하려
    # 들면 메시지를 못 고치게 된다. 걸린 목록만 떼어 본다.
    flagged = hit.detail.split("보고했다:")[1].split(".")[0]
    assert "property_type" in flagged
    assert "visit_type" not in flagged, "등록된 축까지 걸면 경보가 늘 울린다"


def test_registered_segments_do_not_trigger_anything():
    assert not check(prereg(), result(reported_segments={"visit_type"})).violations


def test_testing_many_metrics_without_a_correction_is_flagged():
    v = check(prereg(), result(tested_metrics=4))
    hit = next(x for x in v.violations if x.rule == "다중비교 미보정")
    # 0.05 로 4번 보면 적어도 하나가 우연히 유의할 확률이 18.5% 다
    assert "18.5%" in hit.detail


def test_a_declared_correction_silences_it():
    v = check(prereg(multiplicity={"correction": "bonferroni", "family_size": 4}),
              result(tested_metrics=4))
    assert not any(x.rule == "다중비교 미보정" for x in v.violations)


def test_bonferroni_divides_alpha():
    p = prereg(multiplicity={"correction": "bonferroni", "family_size": 2})
    assert adjusted_alpha(p) == 0.025
    assert adjusted_alpha(prereg()) == 0.05      # 보정이 없으면 그대로


# ─────────────────────────────── 실제 파일
def test_the_committed_prereg_loads_and_is_honest():
    """저장소에 든 사전등록이 스스로에게 거짓말하지 않는지 본다."""
    p = load("exp_sticky_cta")
    assert p.id == "exp_sticky_cta"
    assert p.hypothesis
    assert p.design["required_per_group"] > 0
    assert p.segment_names, "볼 부분군을 안 적으면 사후 해석을 구분할 수 없다"
    for s in p.segments:
        assert s.get("reason"), f"{s['name']} 에 이유가 없다"


def test_the_committed_prereg_admits_it_is_retrospective():
    """실험은 이미 돌았다. prospective 라고 적으면 검사기가 막아야 하고,
    실제로 그렇게 적혀 있지 않아야 한다."""
    p = load("exp_sticky_cta")
    assert p.kind == "retrospective"
    v = check(p, result(data_starts=D0))
    assert v.readable and v.strength == "약함"


def test_a_missing_prereg_is_an_error_not_a_default():
    """등록이 없으면 '기본값으로 진행' 이 아니라 멈춘다."""
    with pytest.raises(FileNotFoundError):
        load("does_not_exist")
