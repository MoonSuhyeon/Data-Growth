"""M0 — 이벤트 계약이 브라우저를 전제하지 않는가.

앱은 아직 없다. 그런데 앱이 생긴 뒤에 계약을 고치면 **이미 쌓인 데이터는 못 고친다.**
그래서 클라이언트보다 계약을 먼저 만들고, 시뮬레이터로 검증한다.

여기서 확인하는 것은 세 가지다.

    1. 같은 이벤트가 두 번 와도 한 번만 센다        (오프라인 버퍼 + 재시도)
    2. 기기 시계가 틀어져도 순서가 무너지지 않는다   (앱 시계는 자주 틀리다)
    3. 앱 이벤트는 설치 식별자 없이 통과하지 못한다  (재설치·크로스 플랫폼 결합의 전제)
"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd

from analytics.collector import EventCollector
from analytics.funnel import compute, sessionize
from analytics.simulator import SimConfig, simulate
from tracking.taxonomy import MAX_CLOCK_SKEW, Event, EventName, Platform

BASE = datetime(2025, 6, 1, 10, 0)


def ev(name: EventName, sent: datetime, **kw) -> dict:
    return {
        "event_id": kw.pop("event_id", f"e-{name.value}-{sent.isoformat()}"),
        "event_name": name.value,
        "anonymous_id": kw.pop("anon", "a1"),
        "sent_at": sent.isoformat(),
        **kw,
    }


def to_frame(collector: EventCollector) -> pd.DataFrame:
    df = pd.DataFrame([{**e.model_dump(), "timestamp": e.timestamp} for e in collector.store])
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["event_name"] = df["event_name"].map(lambda x: getattr(x, "value", x))
    return df


# ─────────────────────────────────────────────── 1. 중복 전송
def test_same_event_delivered_twice_is_counted_once():
    """재전송은 예외가 아니라 정상이다. 두 번 세면 퍼널이 부푼다."""
    c = EventCollector()
    e = ev(EventName.PROPERTY_VIEWED, BASE, property_id="P1", event_id="dup-1")
    r = c.collect([e, dict(e), dict(e)])

    assert len(r.accepted) == 1
    assert len(r.duplicates) == 2
    assert r.total == 3, "중복도 수신 건수에는 든다 — 전송 계층 지표라서"
    assert r.duplicate_rate == round(2 / 3, 6)


def test_duplicates_across_batches_are_still_caught():
    """오프라인 버퍼는 다음 배치에 다시 올린다. 배치 경계를 넘어도 잡아야 한다."""
    c = EventCollector()
    e = ev(EventName.BOOKING_STARTED, BASE, property_id="P1", event_id="dup-2")
    c.collect([e])
    second = c.collect([dict(e)])

    assert second.accepted == []
    assert second.duplicates == ["dup-2"]
    assert len(c.store) == 1


def test_duplicate_delivery_does_not_inflate_the_funnel():
    """계약 확장의 목적 — 중복이 섞여도 퍼널 수치가 유지되는가."""
    clean, _ = simulate(SimConfig(n_visitors=1_500, seed=7))
    noisy, _ = simulate(SimConfig(n_visitors=1_500, seed=7, duplicate_rate=0.25))

    assert len(noisy) > len(clean), "중복이 실제로 섞였는지 먼저 확인"

    a, b = EventCollector(), EventCollector()
    a.collect(clean)
    b.collect(noisy)

    fa = compute(sessionize(to_frame(a)))
    fb = compute(sessionize(to_frame(b)))

    for x, y in zip(fa, fb):
        assert x.event == y.event
        assert x.users == y.users, f"{x.event}: 중복 때문에 {x.users} → {y.users} 로 부풀었다"


# ─────────────────────────────────────────────── 2. 시계 오차
def test_small_skew_trusts_the_client():
    """네트워크 지연 수준의 차이까지 서버 시각으로 갈아치우면 순서가 거칠어진다."""
    e = Event(**ev(EventName.PROPERTY_VIEWED, BASE, property_id="P1"),
              received_at=BASE + timedelta(seconds=3))
    assert e.timestamp == BASE


def test_large_skew_falls_back_to_server_time():
    """앱 시계가 크게 틀어지면 클라이언트를 믿지 않는다."""
    received = BASE + MAX_CLOCK_SKEW + timedelta(hours=1)
    e = Event(**ev(EventName.PROPERTY_VIEWED, BASE, property_id="P1"),
              received_at=received)
    assert e.timestamp == received
    assert e.clock_skew > MAX_CLOCK_SKEW


def test_clock_skew_does_not_break_session_boundaries():
    """시계가 틀어진 이벤트가 섞여도 세션 수가 무너지지 않아야 한다.

    클라이언트 시각을 그대로 믿으면 과거로 끼어든 이벤트가 30분 규칙을 흔들어
    세션이 쪼개지거나 합쳐진다.
    """
    clean, _ = simulate(SimConfig(n_visitors=1_200, seed=11))
    skewed, _ = simulate(SimConfig(n_visitors=1_200, seed=11,
                                   clock_skew_rate=0.15, clock_skew_hours=40))

    a, b = EventCollector(), EventCollector()
    a.collect(clean)
    b.collect(skewed)

    sa = sessionize(to_frame(a))["session_id"].nunique()
    sb = sessionize(to_frame(b))["session_id"].nunique()

    assert sa == sb, f"시계 오차로 세션이 {sa} → {sb} 로 변했다"


# ─────────────────────────────────────────────── 3. 플랫폼
def test_web_event_needs_no_install_id():
    c = EventCollector()
    r = c.collect([ev(EventName.PROPERTY_VIEWED, BASE, property_id="P1")])
    assert len(r.accepted) == 1
    assert r.accepted[0].platform is Platform.WEB
    assert r.accepted[0].is_app is False


def test_app_event_without_install_id_is_quarantined():
    """앱은 설치 식별자가 있어야 한다.

    없으면 재설치한 사람을 신규로 보게 되고, 웹과 앱의 같은 사람도 못 잇는다.
    나중에 고칠 수 없는 종류의 손실이라 수집 시점에 막는다.
    """
    c = EventCollector()
    r = c.collect([ev(EventName.PROPERTY_VIEWED, BASE,
                      property_id="P1", platform="IOS")])
    assert r.accepted == []
    assert "install_id" in r.quarantined[0].reason


def test_app_event_with_install_id_is_accepted():
    c = EventCollector()
    r = c.collect([ev(EventName.PROPERTY_VIEWED, BASE, property_id="P1",
                      platform="ANDROID", install_id="inst-1", app_version="1.2.0")])
    assert len(r.accepted) == 1
    e = r.accepted[0]
    assert e.is_app and e.install_id == "inst-1" and e.app_version == "1.2.0"


def test_device_type_and_platform_are_separate_axes():
    """모바일 브라우저는 device_type=MOBILE 이면서 platform=WEB 이다.

    이 둘을 하나로 묶으면 "모바일 전환이 낮다" 가 웹 문제인지 앱 문제인지 못 가른다.
    지금 트래픽은 전부 웹이므로, 그 구분이 실제로 필요해지기 전에 만들어 둔다.
    """
    c = EventCollector()
    r = c.collect([ev(EventName.PROPERTY_VIEWED, BASE,
                      property_id="P1", device_type="MOBILE")])
    e = r.accepted[0]
    assert e.device_type.value == "MOBILE"
    assert e.platform is Platform.WEB
    assert e.is_app is False


def test_simulator_traffic_is_all_web_today():
    """앱이 없다. 모바일 58% 도 전부 모바일 웹이다 — 그 사실을 고정해 둔다."""
    raw, _ = simulate(SimConfig(n_visitors=300, seed=3))
    c = EventCollector()
    c.collect(raw)
    assert {e.platform for e in c.store} == {Platform.WEB}
    assert any(e.device_type.value == "MOBILE" for e in c.store)
