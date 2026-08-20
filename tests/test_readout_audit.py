"""판독문 생성(C3)·감사관(C4)·단방향 게이트(C5)·채택률(C6).

`docs/readout-review.md` 가 정리한 설계를 코드로 고정한다. 핵심 문장은 하나다 —
**모델은 의심을 올릴 수만 있고 해소할 수는 없다.**
"""
from __future__ import annotations

from datetime import date

import pytest

from analytics import audit_ledger as ledger
from analytics.audit import (
    AuditResult, Flag, FlagClass, HeuristicAuditor, get_auditor, run,
)
from analytics.preregistration import Level, Prereg, Verdict, Violation
from analytics.readout import generate


def prereg(**over) -> Prereg:
    base = dict(
        id="exp", kind="retrospective", registered_at=date(2025, 7, 1),
        hypothesis="모바일 상세에 sticky CTA 를 노출하면 예약 시작률이 오른다.",
        primary={"metric": "funnel.booking_started_rate", "alpha": 0.05, "mde": 0.1},
        design={"required_per_group": 1_000},
        gates={}, segments=[{"name": "visit_type", "reason": "r"}], multiplicity={},
    )
    base.update(over)
    return Prereg(**base)


CLEAN = Verdict()
BLOCKED = Verdict([Violation("SRM 위반", Level.BLOCK, "배정이 틀어졌다")])
WEAK = Verdict([Violation("사전성", Level.WEAKEN, "소급 분석이다")])


# ─────────────────────────────── C3 판독문
def test_the_readout_copies_the_numbers_it_was_given():
    """**판정을 바꾸지 않는다.** 표시용으로 반올림해도 안 된다 —
    화면의 4.9% 와 계산의 5.01% 중 무엇이 기준인지 모르게 된다."""
    r = generate(prereg(), CLEAN, control_rate=0.2493, treatment_rate=0.2917,
                 relative_lift=0.170, p_value=0.0034, significant=True)
    text = r.text()
    assert "24.93%" in text and "29.17%" in text
    assert "0.0034" in text
    assert "유의함" in text


def test_a_blocked_verdict_carries_no_numbers():
    """막힌 결과에 숫자를 같이 실으면 읽는 사람은 결국 그 숫자를 쓴다."""
    r = generate(prereg(), BLOCKED, control_rate=0.25, treatment_rate=0.29,
                 p_value=0.0001, significant=True)
    assert not r.readable
    assert "0.0001" not in r.text()
    assert "결론을 읽지 않는다" in r.text()


def test_the_readout_separates_facts_from_interpretation():
    """감사 대상은 사람이 덧붙인 쪽이다. 섞여 있으면 무엇을 볼지 정할 수 없다."""
    r = generate(prereg(), WEAK, interpretation="모바일에서 특히 효과가 컸다.")
    assert r.facts and r.interpretation
    assert "특히" not in " ".join(r.facts)


# ─────────────────────────────── C4 감사관
def test_an_unregistered_segment_in_the_prose_is_flagged():
    """등록에 없던 축으로 말하면 계획된 게 아니라 주워온 것이다."""
    r = generate(prereg(), WEAK, interpretation="property_type 별로 보면 차이가 컸다.")
    flags = HeuristicAuditor().audit(prereg(), r)
    assert any(f.flag_class is FlagClass.POST_HOC_SEGMENT for f in flags)


def test_a_registered_segment_is_not_flagged():
    """등록된 축까지 걸면 매번 울리고, 그러면 아무도 안 본다."""
    r = generate(prereg(), WEAK, interpretation="visit_type 별로 보면 차이가 있었다.")
    flags = HeuristicAuditor().audit(prereg(), r)
    assert not any(f.flag_class is FlagClass.POST_HOC_SEGMENT for f in flags)


def test_causal_language_on_a_retrospective_design_is_flagged():
    """관측된 것은 두 군의 차이다. 소급 분석은 원인을 단정할 수 없다."""
    r = generate(prereg(), WEAK, interpretation="sticky CTA 때문에 예약이 늘었다.")
    flags = HeuristicAuditor().audit(prereg(), r)
    hit = next(f for f in flags if f.flag_class is FlagClass.CAUSAL_OVERREACH)
    assert "소급" in hit.why


def test_a_flag_quotes_the_original_span():
    """요약해서 올리면 받는 사람이 원문을 확인할 방법이 없다."""
    r = generate(prereg(), WEAK, interpretation="이번 실험은 매출이 올랐기 때문에 성공이다.")
    flags = HeuristicAuditor().audit(prereg(), r)
    assert flags
    assert all(f.quoted_span and f.quoted_span in r.interpretation for f in flags)


def test_saying_nothing_is_not_flagged():
    r = generate(prereg(), WEAK, interpretation="")
    assert not HeuristicAuditor().audit(prereg(), r)


def test_a_flag_cannot_carry_a_verdict():
    """**구조가 곧 제약이다.** 판정을 담을 자리가 없으므로 감사관은
    "유의하다/아니다" 를 말할 수 없다."""
    fields = set(Flag.__dataclass_fields__)
    assert fields == {"flag_class", "quoted_span", "why"}
    assert not fields & {"significant", "p_value", "verdict", "approved"}


def test_the_backend_is_named():
    """무엇이 돌았는지 밝힌다. 규칙 기반은 모델이 하는 일을 다 대신하지 못한다."""
    assert get_auditor().backend in {"heuristic", "llm"}
    assert run(prereg(), generate(prereg(), WEAK)).backend


# ─────────────────────────────── C5 단방향 게이트
def test_a_flag_blocks():
    res = AuditResult("heuristic", [Flag(FlagClass.CAUSAL_OVERREACH, "x", "y")])
    assert res.blocked


def test_no_flags_does_not_grant_a_pass():
    """"괜찮아 보인다" 는 아무 효력이 없다 — 여는 메서드 자체가 없다."""
    res = AuditResult("heuristic", [])
    assert not res.blocked
    assert not any(n in dir(res) for n in ("approve", "clear", "unblock", "pass_"))
    assert "통과권을 주는 것은 아니다" in str(res)


# ─────────────────────────────── C6 채택률
@pytest.fixture
def led(tmp_path):
    return tmp_path / "ledger.jsonl"


def test_raised_flags_are_recorded_without_a_judgement(led):
    ledger.record("exp", [Flag(FlagClass.POST_HOC_SEGMENT, "s", "w")], "heuristic", led)
    s = ledger.acceptance(led)["POST_HOC_SEGMENT"]
    assert s["raised"] == 1 and s["judged"] == 0
    assert s["acceptance_rate"] is None, "판단 안 한 것은 기각이 아니다"


def test_a_class_with_too_few_judgements_is_not_judged(led):
    ledger.record("exp", [Flag(FlagClass.POST_HOC_SEGMENT, "s", "w")], "heuristic", led)
    for _ in range(3):
        ledger.judge("exp", "POST_HOC_SEGMENT", accepted=False, path=led)
    assert "보류" in ledger.acceptance(led)["POST_HOC_SEGMENT"]["verdict"]
    # 근거가 모자라면 켜 둔다 — 끄는 쪽이 더 위험하다
    assert "POST_HOC_SEGMENT" in ledger.enabled_classes(led)


def test_a_class_people_keep_rejecting_gets_turned_off(led):
    """항상 울리는 경보는 무시되고, 무시되면 진짜 실패도 못 잡는다."""
    for _ in range(ledger.MIN_JUDGED + 2):
        ledger.judge("exp", "CAUSAL_OVERREACH", accepted=False, path=led)
    s = ledger.acceptance(led)["CAUSAL_OVERREACH"]
    assert s["acceptance_rate"] == 0.0
    assert s["verdict"].startswith("끄자")
    assert "CAUSAL_OVERREACH" not in ledger.enabled_classes(led)


def test_a_useful_class_stays_on(led):
    for _ in range(ledger.MIN_JUDGED + 2):
        ledger.judge("exp", "HYPOTHESIS_MISMATCH", accepted=True, path=led)
    s = ledger.acceptance(led)["HYPOTHESIS_MISMATCH"]
    assert s["verdict"].startswith("유지")
    assert "HYPOTHESIS_MISMATCH" in ledger.enabled_classes(led)


def test_judgements_are_appended_not_edited(led):
    """앞 줄을 고치면 누가 언제 뭐라 판단했는지가 지워지고, 채택률을 조작할 수 있다."""
    ledger.judge("exp", "POST_HOC_SEGMENT", accepted=True, path=led)
    ledger.judge("exp", "POST_HOC_SEGMENT", accepted=False, path=led)
    assert len(led.read_text(encoding="utf-8").strip().splitlines()) == 2
