"""사전등록 HTE(E7).

부분군 분석이 욕먹는 이유는 셋이다 — 사후에 축을 고르고, 다중성을 무시하고,
표본이 모자란 곳의 "유의하지 않음" 을 "효과 없음" 이라고 쓴다. 셋 다 여기서 막는다.
"""
from __future__ import annotations

import pytest

from analytics.hte import estimate
from analytics.preregistration import load


@pytest.fixture(scope="module")
def prereg():
    return load("exp_sticky_cta")


def counts(spec: dict[str, tuple[int, int, int, int]]):
    """``{부분군: (대조 전환, 대조 노출, 처치 전환, 처치 노출)}`` 를 입력 모양으로."""
    return {k: {"control": (v[0], v[1]), "treatment": (v[2], v[3])}
            for k, v in spec.items()}


BIG = 6000      # 사전등록의 required_per_group(4,371)을 넘는다
SMALL = 900     # 못 미친다


# ─────────────────────────────────────── 1. 등록되지 않은 축은 거절한다
def test_an_unregistered_dimension_is_refused(prereg):
    """**경고가 아니라 거절이다.** 경고는 무시되고, 무시된 경고는 없는 것과 같다."""
    r = estimate(counts({"ios": (100, BIG, 130, BIG)}), prereg, by="platform")
    assert not r.readable
    assert "사전등록에 없는 축" in r.blocked
    assert r.segments == [], "차단했는데 숫자를 내놓으면 차단이 아니다"


def test_the_block_names_what_is_registered(prereg):
    r = estimate(counts({"a": (1, 10, 1, 10)}), prereg, by="browser")
    assert "region" in r.blocked and "visit_type" in r.blocked


def test_a_registered_dimension_passes(prereg):
    r = estimate(counts({"NEW": (1500, BIG, 1700, BIG)}), prereg, by="visit_type")
    assert r.readable
    assert len(r.segments) == 1


# ─────────────────────────────────────── 2. 다중성은 파일이 정한다
def test_the_alpha_comes_from_the_preregistration(prereg):
    """코드에 적으면 결과를 보고 고칠 수 있게 된다."""
    r = estimate(counts({"NEW": (1500, BIG, 1700, BIG)}), prereg, by="visit_type")
    assert r.raw_alpha == 0.05
    assert r.alpha == 0.025, "본페로니, family_size=2"
    assert all(s.alpha == 0.025 for s in r.segments)


def test_the_correction_is_explained_not_just_applied(prereg):
    r = estimate(counts({"NEW": (1500, BIG, 1700, BIG)}), prereg, by="visit_type")
    assert any("낮췄다" in n for n in r.notes)


def test_a_borderline_result_fails_the_corrected_threshold(prereg):
    """**보정이 판정을 실제로 바꾸는지 본다.**

    적용했다고 적어 두기만 하고 판정에 안 쓰면 아무것도 안 한 것이다. p=0.0409 —
    보정 전 α(0.05)면 유의하고, 보정 후 α(0.025)면 아니다.

    `skip` 하지 않는다. 조건이 안 맞으면 넘어가는 테스트는 없는 테스트이고,
    이 숫자는 조건이 아니라 **고정할 수 있는 값**이다.
    """
    r = estimate(counts({"NEW": (1600, BIG, 1700, BIG)}), prereg, by="visit_type")
    seg = r.segments[0]

    assert 0.025 <= seg.p_value < 0.05, f"경계 밖이다 (p={seg.p_value:.4f})"
    assert not seg.significant, "보정된 α 를 안 쓰고 있다"
    assert seg.verdict == "효과 없음", "표본은 충분하다 — '모름' 이 아니라 '효과 없음' 이다"


# ─────────────────────────────────────── 3. "효과 없음" 과 "모름" 은 다르다
def test_an_underpowered_segment_says_it_does_not_know(prereg):
    """**이 모듈의 요점.**

    사전등록의 required_per_group 은 전체 검정을 위한 수다. 쪼개면 각 군은 그
    일부이고, 거기서 "효과가 없었다" 고 쓰면 틀린 문장이다.
    """
    r = estimate(counts({"Jeju": (240, SMALL, 250, SMALL)}), prereg, by="region")
    seg = r.segments[0]
    assert not seg.significant
    assert not seg.powered
    assert "모름" in seg.verdict
    assert "효과 없음" not in seg.verdict


def test_a_powered_null_is_allowed_to_say_no_effect(prereg):
    """표본이 충분한데 유의하지 않으면 그건 진짜 "효과 없음" 이다."""
    r = estimate(counts({"Seoul": (1620, BIG, 1625, BIG)}), prereg, by="region")
    seg = r.segments[0]
    assert seg.powered
    assert not seg.significant
    assert seg.verdict == "효과 없음"


def test_a_small_segment_can_still_be_significant(prereg):
    """검정력은 **유의하지 않을 때의 결론**만 막는다. 작아도 크게 다르면 유의하다."""
    r = estimate(counts({"Jeju": (200, SMALL, 400, SMALL)}), prereg, by="region")
    seg = r.segments[0]
    assert not seg.powered
    assert seg.significant
    assert seg.verdict == "효과 있음"


def test_underpowered_segments_are_named_in_the_notes(prereg):
    r = estimate(counts({
        "Seoul": (1600, BIG, 1700, BIG),
        "Jeju": (240, SMALL, 250, SMALL),
    }), prereg, by="region")
    note = next(n for n in r.notes if "못 미치는" in n)
    assert "Jeju" in note and "Seoul" not in note
    assert "'모름'" in note or "모름" in note


# ─────────────────────────────────────── 4. 부분군의 배정도 볼 것
def test_a_segment_with_broken_assignment_is_not_read(prereg):
    """전체 SRM 이 성해도 한 부분군만 틀어질 수 있다.

    `check_srm_by()` 가 존재하는 이유와 같은 상황이고, 그 부분군의 전환율은
    읽으면 안 된다.
    """
    r = estimate(counts({"Busan": (1500, 6000, 1900, 3000)}), prereg, by="region")
    seg = r.segments[0]
    assert not seg.srm_healthy
    assert not seg.significant, "배정이 틀어졌으면 p 가 작아도 유의하다고 하면 안 된다"
    assert "읽을 수 없음" in seg.verdict


# ─────────────────────────────────────── 5. 승자의 저주
def test_the_largest_segment_carries_a_warning(prereg):
    """가장 큰 값을 골라 인용하는 순간 그 값은 위로 편향된다."""
    r = estimate(counts({
        "Seoul": (1600, BIG, 1650, BIG),
        "Busan": (1600, BIG, 1700, BIG),
        "Jeju": (1600, BIG, 1780, BIG),
    }), prereg, by="region")

    top = r.largest
    assert top.key == "Jeju"
    assert "위로 편향된 추정" in r.winners_curse_note
    assert "3개 부분군 중" in r.winners_curse_note


def test_a_single_segment_needs_no_winners_curse_warning(prereg):
    """하나뿐이면 고른 게 아니다. 늘 붙는 경고는 무시된다."""
    r = estimate(counts({"NEW": (1600, BIG, 1700, BIG)}), prereg, by="visit_type")
    assert r.winners_curse_note == ""


def test_a_broken_segment_cannot_be_the_largest(prereg):
    """읽으면 안 되는 부분군이 대표값으로 뽑히면 안 된다."""
    r = estimate(counts({
        "Seoul": (1600, BIG, 1700, BIG),
        "Busan": (1500, 6000, 2400, 3000),     # SRM 이 깨졌고 효과는 커 보인다
    }), prereg, by="region")
    assert r.largest.key == "Seoul"


# ─────────────────────────────────────── 입력
def test_an_empty_arm_is_skipped_with_a_note(prereg):
    r = estimate(counts({
        "Seoul": (1600, BIG, 1700, BIG),
        "Gyeongju": (0, 0, 5, 40),
    }), prereg, by="region")
    assert [s.key for s in r.segments] == ["Seoul"]
    assert any("비어 있어" in n for n in r.notes)
