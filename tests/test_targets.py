"""목표선.

실험에서 이미 쓰는 규칙을 대시보드로 넓힌 것이다 — **선을 먼저 긋고 그 다음에
읽는다.** 목표 없이 숫자만 있으면 전환율 9.4% 가 좋은 건지 나쁜 건지 아무도 모르고,
다음 분기에 8.9% 가 되면 "조금 떨어졌네" 로 넘어간다.
"""
from __future__ import annotations

import pytest

from analytics.targets import BY_KEY, TARGETS, Direction, Target, evaluate, summary


# ─────────────────────────────── 방향
@pytest.mark.parametrize("value, expected", [
    (0.12, "met"),      # 목표 이상
    (0.10, "met"),      # 경계는 달성
    (0.09, "below"),    # 목표엔 못 미치지만 최소선 위
    (0.08, "below"),    # 최소선 경계
    (0.07, "breach"),   # 최소선 아래
])
def test_up_metric_has_three_states_not_two(value, expected):
    """**미달과 이탈은 다르다.** 하나로 뭉개면 진짜 사고가 묻힌다."""
    t = Target("x", "x", goal=0.10, floor=0.08, direction=Direction.UP)
    assert t.status(value) == expected


@pytest.mark.parametrize("value, expected", [
    (0.003, "met"),
    (0.005, "met"),
    (0.01, "below"),
    (0.02, "below"),
    (0.03, "breach"),
])
def test_down_metric_flips_the_comparison(value, expected):
    """낮을수록 좋은 지표. 방향을 안 정하면 '달성' 의 뜻이 지표마다 달라진다."""
    t = Target("x", "x", goal=0.005, floor=0.02, direction=Direction.DOWN)
    assert t.status(value) == expected


def test_a_missing_measurement_is_not_a_failure():
    """못 잰 것과 못 미친 것은 다르다. 섞으면 대시보드가 거짓말을 한다."""
    t = Target("x", "x", goal=0.1, floor=0.08, direction=Direction.UP)
    assert t.status(None) == "unknown"


# ─────────────────────────────── 선언
def test_every_target_says_why():
    """근거 없는 목표는 다음 사람이 마음대로 바꾼다."""
    for t in TARGETS:
        assert t.rationale.strip(), f"{t.key} 에 근거가 없다"


def test_floor_is_on_the_worse_side_of_goal():
    """최소선이 목표보다 나은 쪽에 있으면 'breach' 가 영원히 안 뜬다."""
    for t in TARGETS:
        if t.direction is Direction.UP:
            assert t.floor < t.goal, f"{t.key}: floor 가 goal 보다 높다"
        else:
            assert t.floor > t.goal, f"{t.key}: floor 가 goal 보다 낮다"


def test_keys_are_unique():
    assert len(BY_KEY) == len(TARGETS)


def test_targets_only_cover_metrics_we_actually_measure():
    """못 재는 지표에 목표를 두면 영원히 unknown 이 뜨고, 읽는 사람은 고장으로 여긴다.

    파이프라인이 실제로 채우는 키 목록과 맞는지 본다.
    """
    produced = {
        "funnel.cvr", "funnel.mobile_booking_started", "retention.return_rate",
        "revenue.arpu", "collection.failure_rate", "revenue.cancellation_rate",
    }
    assert set(BY_KEY) == produced, (
        f"목표만 있고 안 재는 것: {set(BY_KEY) - produced} / "
        f"재는데 목표 없는 것: {produced - set(BY_KEY)}"
    )


# ─────────────────────────────── 대조
def test_evaluate_returns_a_row_per_target():
    rows = evaluate({t.key: t.goal for t in TARGETS})
    assert len(rows) == len(TARGETS)
    assert all(r["status"] == "met" for r in rows)


def test_summary_counts_each_state():
    rows = evaluate({"funnel.cvr": 0.12})     # 하나만 재고 나머지는 미측정
    s = summary(rows)
    assert s["met"] == 1
    assert s["unknown"] == len(TARGETS) - 1
    assert sum(s.values()) == len(TARGETS)
