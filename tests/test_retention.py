"""재방문과 리텐션.

퍼널은 "이번에 온 사람이 사는가"를 묻는다. 여기서 묻는 건 **"온 사람이 다시
오는가"** 다. 한 번 사고 사라지는 사람만 늘리는 성장과 돌아오는 사람이 쌓이는
성장은 다르고, 전환율만 보면 그 둘이 구분되지 않는다.

이 파일이 생기기 전까지 시뮬레이터에는 **재방문자가 한 명도 없었다.** 방문자마다
새 익명 ID 를 발급했기 때문이다. 그래서 "로그인 전 행동을 소급해서 잇는다"는
스티칭의 주장도 쉬운 경우(한 세션 안에서 로그인)만 밟고 있었다.
"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd
import pytest

from analytics.funnel import sessionize
from analytics.retention import NEW, RETURNING, label_visits, retention
from analytics.simulator import SimConfig, simulate
from tracking.taxonomy import EventName

T0 = datetime(2025, 6, 1, 10, 0)


def ev(anon: str, when: datetime, name=EventName.PROPERTY_VIEWED, **kw) -> dict:
    return {
        "anonymous_id": anon,
        "event_name": name.value,
        "timestamp": when,
        "property_id": "P0001",
        # journey_key 가 회원 ID 를 먼저 본다. 실제 파이프라인 프레임에는 항상
        # 있는 컬럼이라 픽스처에도 둔다.
        "user_id": None,
        **kw,
    }


def frame(rows: list[dict]) -> pd.DataFrame:
    df = pd.DataFrame(rows)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    return label_visits(sessionize(df))


# ─────────────────────────────── 라벨
def test_first_session_is_new_and_later_ones_are_returning():
    df = frame([
        ev("a", T0),
        ev("a", T0 + timedelta(days=3)),
        ev("a", T0 + timedelta(days=9)),
    ])
    kinds = df.sort_values("timestamp")["visit_type"].tolist()
    assert kinds == [NEW, RETURNING, RETURNING]
    assert df.sort_values("timestamp")["visit_seq"].tolist() == [1, 2, 3]


def test_events_inside_one_session_share_the_label():
    """세션 안에서 라벨이 흔들리면 세그먼트 분모가 깨진다."""
    df = frame([
        ev("a", T0),
        ev("a", T0 + timedelta(minutes=4)),
        ev("a", T0 + timedelta(minutes=9)),
    ])
    assert df["visit_type"].nunique() == 1
    assert df["visit_type"].iloc[0] == NEW


def test_two_people_do_not_share_a_sequence():
    df = frame([ev("a", T0), ev("b", T0 + timedelta(days=1))])
    assert set(df["visit_type"]) == {NEW}


def test_label_requires_sessions_first():
    """세션이 없으면 방문을 셀 수 없다. 조용히 틀린 값을 내지 않는다."""
    df = pd.DataFrame([ev("a", T0)])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    with pytest.raises(ValueError, match="sessionize"):
        label_visits(df)


# ─────────────────────────────── 코호트
def test_return_rate_counts_people_not_sessions():
    df = frame([
        ev("a", T0), ev("a", T0 + timedelta(days=2)), ev("a", T0 + timedelta(days=5)),
        ev("b", T0),
    ])
    rep = retention(df)
    assert rep.people == 2
    assert rep.returned == 1          # a 만 다시 왔다. 세 번 왔어도 한 사람이다
    assert rep.return_rate == 0.5
    assert rep.sessions == 4


def test_cohorts_split_by_first_seen_week():
    df = frame([
        ev("a", T0),                                   # 첫 주
        ev("a", T0 + timedelta(days=2)),
        ev("b", T0 + timedelta(days=14)),              # 다른 주
    ])
    rep = retention(df)
    assert len(rep.by_cohort) == 2
    assert sum(n for n, _ in rep.by_cohort.values()) == 2


def test_retention_requires_labels_first():
    df = pd.DataFrame([ev("a", T0)])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    with pytest.raises(ValueError, match="label_visits"):
        retention(sessionize(df))


# ─────────────────────────────── 시뮬레이션 데이터의 성질
def test_simulator_actually_produces_returning_visitors():
    """`returning_rate` 가 0 이면 스티칭의 어려운 경우가 데이터에 없다."""
    raw, _ = simulate(SimConfig(n_visitors=3_000, seed=11))
    seen = {}
    for e in raw:
        seen.setdefault(e["anonymous_id"], 0)
        seen[e["anonymous_id"]] += 1
    assert len(seen) < 3_000, "익명 ID 가 방문 수와 같으면 재방문자가 없는 것이다"


def test_someone_browses_anonymously_then_logs_in_on_a_later_day():
    """스티칭이 실제로 어려운 경우.

    한 세션 안에서 로그인하면 소급 결합은 쉽다. 며칠 전 익명 행동까지 이어야
    비로소 "로그인 전 행동을 버리지 않는다"는 주장이 시험된다.
    """
    raw, _ = simulate(SimConfig(n_visitors=6_000, seed=11))
    first_anon, first_uid = {}, {}
    for e in sorted(raw, key=lambda x: x["sent_at"]):
        a = e["anonymous_id"]
        first_anon.setdefault(a, e["sent_at"])
        if e.get("user_id"):
            first_uid.setdefault(a, e["sent_at"])

    spans = [
        (datetime.fromisoformat(t) - datetime.fromisoformat(first_anon[a])).days
        for a, t in first_uid.items()
    ]
    assert any(s >= 1 for s in spans), "하루 이상 지나 로그인한 사람이 있어야 한다"


def test_returning_visitor_keeps_the_same_variant():
    """재방문에서 군이 바뀌면 한 사람의 행동이 두 군에 흩어진다."""
    raw, _ = simulate(SimConfig(n_visitors=4_000, seed=11))
    by_anon: dict[str, set] = {}
    for e in raw:
        v = (e.get("properties") or {}).get("variant")
        by_anon.setdefault(e["anonymous_id"], set()).add(v)
    assert all(len(v) == 1 for v in by_anon.values())


def test_late_cohorts_look_worse_because_they_had_less_time():
    """우측 절단. 코호트를 나눠 봐야 하는 이유 그 자체다.

    관측 창 끝에 처음 온 사람은 다시 올 시간이 없었을 뿐인데, 전체 재방문율에
    섞이면 "안 돌아온 사람"으로 세어진다.
    """
    raw, _ = simulate(SimConfig(n_visitors=8_000, seed=11))
    from analytics.collector import EventCollector

    c = EventCollector()
    c.collect(raw)
    df = pd.DataFrame([{**e.model_dump(), "timestamp": e.timestamp} for e in c.store])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    rep = retention(label_visits(sessionize(df)))

    rates = [r / n for n, r in rep.by_cohort.values()]
    assert len(rates) >= 3
    assert rates[-1] < max(rates), "마지막 코호트가 가장 낮아야 우측 절단이 재현된 것이다"
