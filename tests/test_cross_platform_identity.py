"""M1 — 웹과 앱의 같은 사람을 하나의 여정으로 잇는가.

식별자가 하나였을 때는 없던 문제 셋을 본다.

    1. install_id 가 여러 anonymous_id 를 묶는다   (앱은 익명 ID 가 자주 바뀐다)
    2. 웹 세션과 앱 세션이 한 여정으로 모인다      (user_id 를 통해)
    3. 재설치는 되찾을 수 없다                     — 한계를 감추지 않고 센다
"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd

from analytics.collector import EventCollector
from analytics.etl.identity import build_identity_map, journey_key, stitch
from analytics.simulator import SimConfig, simulate
from tracking.taxonomy import EventName, Platform

T0 = datetime(2025, 6, 1, 10, 0)


def ev(anon: str, name: EventName, minutes: int, *, uid: str | None = None,
       platform: str = "WEB", install: str | None = None, **kw) -> dict:
    ts = T0 + timedelta(minutes=minutes)
    return {
        "event_id": f"e-{anon}-{install or 'web'}-{minutes}",
        "event_name": name.value,
        "anonymous_id": anon,
        "user_id": uid,
        "install_id": install,
        "platform": platform,
        "timestamp": ts,
        **kw,
    }


def frame(rows: list[dict]) -> pd.DataFrame:
    return pd.DataFrame(rows)


# ─────────────────────────────────── 1. install_id 가 익명 ID 를 묶는다
def test_install_id_joins_sessions_that_anonymous_id_would_split():
    """앱을 다시 켜서 익명 ID 가 바뀌어도, 같은 설치면 한 사람이다.

    anonymous_id 만 보면 두 사람으로 보인다. 웹만 있던 시절에는 없던 결합이다.
    """
    df = frame([
        ev("a1", EventName.SEARCH_PERFORMED, 0, platform="IOS", install="i1"),
        ev("a2", EventName.PROPERTY_VIEWED, 30, platform="IOS", install="i1"),
        # 세 번째 실행에서 로그인한다
        ev("a3", EventName.BOOKING_STARTED, 60, uid="U1", platform="IOS", install="i1"),
    ])
    out, rep = stitch(df)

    assert (out["resolved_user_id"] == "U1").all(), "설치 ID 로 앞선 두 방문이 결합돼야 한다"
    assert rep.stitched == 2
    assert rep.stitched_by_key.get("install_id") == 2
    assert rep.stitched_by_key.get("anonymous_id", 0) == 0, "익명 ID 로는 풀 수 없던 것들이다"


def test_web_only_data_still_stitches_by_anonymous_id():
    """앱이 없던 경로가 그대로 돌아야 한다 — 계약을 넓힌 대가가 없어야 한다."""
    df = frame([
        ev("a1", EventName.SEARCH_PERFORMED, 0),
        ev("a1", EventName.BOOKING_STARTED, 5, uid="U1"),
    ])
    out, rep = stitch(df)
    assert (out["resolved_user_id"] == "U1").all()
    assert rep.stitched_by_key.get("anonymous_id") == 1


# ─────────────────────────────────── 2. 크로스 플랫폼
def test_web_and_app_sessions_resolve_to_one_journey():
    """같은 사람이 웹에서 둘러보고 앱에서 예약하면 하나의 여정이어야 한다."""
    df = frame([
        # 웹에서 익명으로 둘러본다
        ev("web-1", EventName.SEARCH_PERFORMED, 0),
        ev("web-1", EventName.PROPERTY_VIEWED, 3, property_id="P1"),
        # 나중에 웹에서 로그인
        ev("web-1", EventName.BOOKING_STARTED, 10, uid="U1", property_id="P1"),
        # 다음 날 앱에서 — 익명 ID 도 설치 ID 도 다르다
        ev("app-1", EventName.PROPERTY_VIEWED, 1500, platform="ANDROID",
           install="i9", property_id="P1"),
        ev("app-1", EventName.BOOKING_COMPLETED, 1510, uid="U1", platform="ANDROID",
           install="i9", property_id="P1", booking_id="B1"),
    ])
    out, rep = stitch(df)

    assert (out["resolved_user_id"] == "U1").all()
    assert journey_key(out).nunique() == 1, "여정이 하나로 모여야 한다"
    assert rep.cross_platform_users == 1


def test_cross_platform_is_only_possible_through_login():
    """로그인이 없으면 웹과 앱은 이어지지 않는다. 그게 정직한 결과다.

    기기를 넘는 연결고리가 계정뿐이라, 없는 걸 만들어내지 않는다.
    """
    df = frame([
        ev("web-1", EventName.PROPERTY_VIEWED, 0, property_id="P1"),
        ev("app-1", EventName.PROPERTY_VIEWED, 100, platform="IOS",
           install="i9", property_id="P1"),
    ])
    out, rep = stitch(df)

    assert out["resolved_user_id"].isna().all()
    assert journey_key(out).nunique() == 2, "이어졌다고 우기면 안 된다"
    assert rep.cross_platform_users == 0


# ─────────────────────────────────── 3. 재설치
def test_reinstall_is_detected_and_counted():
    """같은 회원에게 설치 ID 가 둘이면 재설치다."""
    df = frame([
        ev("a1", EventName.BOOKING_STARTED, 0, uid="U1", platform="IOS", install="i1"),
        ev("a2", EventName.BOOKING_STARTED, 5000, uid="U1", platform="IOS", install="i2"),
    ])
    _, rep = stitch(df)
    assert rep.reinstalled_users == 1


def test_pre_login_events_of_a_wiped_install_cannot_be_recovered():
    """재설치 전의 **로그인하지 않은** 구간은 이을 방법이 없다.

    기기에 남은 유일한 연결고리(install_id)가 사라졌기 때문이다.
    파이프라인의 결함이 아니라 한계라서, 되찾은 척하지 않는다.
    """
    df = frame([
        # 옛 설치 — 끝까지 익명
        ev("old-anon", EventName.PROPERTY_VIEWED, 0, platform="IOS", install="i1"),
        # 재설치 후 로그인
        ev("new-anon", EventName.BOOKING_STARTED, 5000, uid="U1",
           platform="IOS", install="i2"),
    ])
    out, _ = stitch(df)

    lost = out[out["install_id"] == "i1"]
    assert lost["resolved_user_id"].isna().all(), "없는 연결을 만들어내면 안 된다"
    assert journey_key(out).nunique() == 2


# ─────────────────────────────────── 우선순위
def test_install_id_wins_over_anonymous_id_on_conflict():
    """공용 기기에서 두 식별자가 다른 회원을 가리키면 더 안정적인 쪽을 따른다."""
    df = frame([
        ev("shared", EventName.BOOKING_STARTED, 0, uid="U2"),          # 웹 쿠키 공유
        ev("shared", EventName.BOOKING_STARTED, 10, uid="U1",
           platform="IOS", install="i1"),
        ev("shared", EventName.PROPERTY_VIEWED, 20, platform="IOS", install="i1"),
    ])
    out, _ = stitch(df)
    target = out[out["event_name"] == EventName.PROPERTY_VIEWED.value]
    assert target["resolved_user_id"].iloc[0] == "U1"


# ─────────────────────────────────── 파이프라인 전체
def test_pipeline_handles_app_traffic_end_to_end():
    """앱 트래픽을 섞어도 수집 → 스티칭이 끝까지 돈다.

    앱은 아직 없다. 그래서 시뮬레이터로 미리 태워 본다 — 클라이언트가 생긴 뒤에
    파이프라인을 고치면 이미 쌓인 데이터는 못 고치기 때문이다.
    """
    raw, _ = simulate(SimConfig(n_visitors=800, seed=13, app_share=0.4))
    c = EventCollector()
    c.collect(raw)

    platforms = {e.platform for e in c.store}
    assert Platform.WEB in platforms
    assert platforms & {Platform.IOS, Platform.ANDROID}, "앱 트래픽이 섞여야 한다"

    df = pd.DataFrame([{**e.model_dump(), "timestamp": e.timestamp} for e in c.store])
    df["platform"] = df["platform"].map(lambda x: getattr(x, "value", x))
    out, rep = stitch(df)

    assert rep.total_events == len(df)
    assert rep.stitched > 0
    assert rep.stitched_by_key.get("install_id", 0) > 0, "설치 ID 로 풀린 건이 있어야 한다"
    assert journey_key(out).notna().all()


def test_identity_map_carries_both_key_types():
    raw, _ = simulate(SimConfig(n_visitors=600, seed=17, app_share=0.5))
    c = EventCollector()
    c.collect(raw)
    df = pd.DataFrame([{**e.model_dump(), "timestamp": e.timestamp} for e in c.store])

    imap = build_identity_map(df)
    assert set(imap["key_type"]) == {"install_id", "anonymous_id"}
    assert imap["user_id"].notna().all()
