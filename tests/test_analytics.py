"""수집·세션화·스티칭·퍼널·실험 통계 검증."""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd
import pytest

from analytics.collector import EventCollector
from analytics.etl.identity import build_identity_map, journey_key, stitch
from analytics.experiments.stats import (
    assign, check_srm, required_sample_size, two_proportion_test,
)
from analytics.funnel import compute, sessionize
from analytics.simulator import SimConfig, simulate
from tracking.taxonomy import EventName


# ------------------------------------------------------------- collector
def test_valid_event_is_accepted():
    c = EventCollector()
    r = c.collect([{
        "event_id": "e1", "event_name": "property_viewed",
        "anonymous_id": "a1", "timestamp": datetime.utcnow().isoformat(),
        "property_id": "P0001",
    }])
    assert len(r.accepted) == 1 and not r.quarantined


def test_missing_required_property_is_quarantined_not_dropped():
    """property_viewed 는 property_id 가 필수다. 드롭이 아니라 격리여야 한다."""
    c = EventCollector()
    r = c.collect([{
        "event_id": "e1", "event_name": "property_viewed",
        "anonymous_id": "a1", "timestamp": datetime.utcnow().isoformat(),
    }])
    assert not r.accepted
    assert len(r.quarantined) == 1
    assert "property_id" in r.quarantined[0].reason
    assert c.quarantine, "격리 저장소에 남아 있어야 재처리할 수 있다"


def test_unknown_event_name_is_quarantined():
    c = EventCollector()
    r = c.collect([{
        "event_id": "e1", "event_name": "totally_made_up",
        "anonymous_id": "a1", "timestamp": datetime.utcnow().isoformat(),
    }])
    assert len(r.quarantined) == 1


def test_blank_anonymous_id_is_rejected():
    c = EventCollector()
    r = c.collect([{
        "event_id": "e1", "event_name": "search_performed",
        "anonymous_id": "   ", "timestamp": datetime.utcnow().isoformat(),
        "search_id": "s1",
    }])
    assert len(r.quarantined) == 1


# ------------------------------------------------------------ sessionize
def _ev(anon, name, ts, **kw):
    return {"event_id": f"e{ts.timestamp()}", "event_name": name.value,
            "anonymous_id": anon, "user_id": kw.get("uid"), "timestamp": ts, **kw}


def test_session_splits_after_30_minutes():
    t0 = datetime(2025, 6, 1, 10, 0)
    df = pd.DataFrame([
        _ev("a1", EventName.SEARCH_PERFORMED, t0),
        _ev("a1", EventName.PROPERTY_VIEWED, t0 + timedelta(minutes=10)),
        _ev("a1", EventName.PROPERTY_VIEWED, t0 + timedelta(minutes=45)),  # 35분 공백
    ])
    out = sessionize(df)
    assert out["session_id"].nunique() == 2


def test_session_spanning_midnight_belongs_to_start_date():
    t0 = datetime(2025, 6, 1, 23, 50)
    df = pd.DataFrame([
        _ev("a1", EventName.SEARCH_PERFORMED, t0),
        _ev("a1", EventName.PROPERTY_VIEWED, t0 + timedelta(minutes=20)),  # 익일 00:10
    ])
    out = sessionize(df)
    assert out["session_id"].nunique() == 1
    assert out["session_date"].nunique() == 1
    assert out["session_date"].iloc[0] == pd.Timestamp("2025-06-01")


# -------------------------------------------------------------- identity
def test_anonymous_events_are_stitched_retroactively():
    """로그인 이전 행동이 회원 여정에 붙어야 한다."""
    t0 = datetime(2025, 6, 1, 10, 0)
    df = pd.DataFrame([
        _ev("a1", EventName.SEARCH_PERFORMED, t0),                       # 익명
        _ev("a1", EventName.PROPERTY_VIEWED, t0 + timedelta(minutes=2)),  # 익명
        _ev("a1", EventName.BOOKING_STARTED, t0 + timedelta(minutes=5), uid="U1"),
    ])
    out, rep = stitch(df)
    assert (out["resolved_user_id"] == "U1").all()
    assert rep.stitched == 2
    assert rep.stitch_rate == 1.0


def test_shared_device_uses_earliest_login():
    t0 = datetime(2025, 6, 1, 10, 0)
    df = pd.DataFrame([
        _ev("a1", EventName.BOOKING_STARTED, t0 + timedelta(minutes=5), uid="U1"),
        _ev("a1", EventName.BOOKING_STARTED, t0 + timedelta(minutes=9), uid="U2"),
    ])
    imap = build_identity_map(df)
    assert imap.loc[imap["anonymous_id"] == "a1", "user_id"].iloc[0] == "U1"


def test_journey_key_keeps_anonymous_visitors():
    """끝까지 익명인 방문자를 분석에서 제외하지 않는다."""
    t0 = datetime(2025, 6, 1, 10, 0)
    df = pd.DataFrame([_ev("a1", EventName.SEARCH_PERFORMED, t0)])
    out, _ = stitch(df)
    assert journey_key(out).iloc[0] == "a1"


# ---------------------------------------------------------------- funnel
def test_funnel_is_monotonically_decreasing():
    events, _ = simulate(SimConfig(n_visitors=800, seed=3))
    c = EventCollector()
    c.collect(events)
    df = pd.DataFrame([e.model_dump() for e in c.store])
    df, _ = stitch(df)
    steps = compute(df)
    users = [s.users for s in steps]
    assert users == sorted(users, reverse=True), users
    assert steps[0].overall_rate == 1.0


def test_later_step_users_are_subset_of_earlier():
    events, _ = simulate(SimConfig(n_visitors=600, seed=5))
    c = EventCollector()
    c.collect(events)
    df = pd.DataFrame([e.model_dump() for e in c.store])
    df, _ = stitch(df)
    steps = compute(df)
    for a, b in zip(steps, steps[1:]):
        assert b.users <= a.users


# ------------------------------------------------------------ experiments
def test_assignment_is_deterministic():
    for uid in ("u1", "u2", "u3"):
        assert assign(uid, "exp") == assign(uid, "exp")


def test_assignment_is_balanced():
    counts = {"control": 0, "treatment": 0}
    for i in range(20_000):
        counts[assign(f"u{i}", "exp")] += 1
    ratio = counts["treatment"] / sum(counts.values())
    assert 0.48 < ratio < 0.52, counts


def test_same_user_different_experiment_can_differ():
    a = [assign("u1", f"exp{i}") for i in range(50)]
    assert len(set(a)) == 2, "실험마다 독립적으로 배정되어야 한다"


def test_sample_size_grows_as_mde_shrinks():
    big = required_sample_size(0.09, mde=0.20)
    small = required_sample_size(0.09, mde=0.05)
    assert small > big * 4


def test_srm_detects_imbalance():
    healthy = check_srm({"control": 5000, "treatment": 5010})
    assert healthy.healthy
    broken = check_srm({"control": 5000, "treatment": 5600})
    assert not broken.healthy


def test_two_proportion_test_detects_real_lift():
    r = two_proportion_test(control_x=900, control_n=10_000,
                            treatment_x=1_080, treatment_n=10_000)
    assert r.significant
    assert r.relative_lift > 0.15
    assert r.ci_low > 0


def test_two_proportion_test_reports_no_effect():
    r = two_proportion_test(control_x=900, control_n=10_000,
                            treatment_x=905, treatment_n=10_000)
    assert not r.significant
    assert r.ci_low < 0 < r.ci_high


def test_zero_sample_raises():
    with pytest.raises(ValueError):
        two_proportion_test(0, 0, 1, 10)
