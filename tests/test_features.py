"""기능 사용률과 순매출.

계약에 9개 이벤트를 정의해 두고 5개만 발생시키고 있었다. 나머지 넷은 필수 속성까지
정의돼 있는데 아무도 안 만들었다 — "우리는 이걸 잰다"는 주장만 남고 실제로는
아무것도 안 재는 상태였다.

여기서 고정하는 건 **분모**다. "찜한 사람 / 전체 방문자"로 재면 퍼널 깊은 곳의
기능은 언제나 저조해 보이고, 기능이 나쁜 것과 아무도 거기까지 못 간 것이 구분되지
않는다.
"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd

from analytics.features import AWAITING_APP, adoption, unused
from analytics.revenue import summarize
from analytics.simulator import simulate
from tracking.taxonomy import EventName

T0 = datetime(2025, 6, 1, 10, 0)


def ev(anon, name, when=T0, **kw):
    base = {
        "anonymous_id": anon,
        "user_id": None,
        "event_name": name.value,
        "timestamp": when,
        "amount": None,
    }
    base.update(kw)
    return base


def frame(rows):
    df = pd.DataFrame(rows)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    return df


# ─────────────────────────────── 분모
def test_denominator_is_who_could_have_reached_the_feature():
    """찜은 숙소를 봐야 누를 수 있다. 전체 방문자로 나누면 늘 저조해 보인다."""
    rows = [
        ev("a", EventName.SEARCH_PERFORMED), ev("a", EventName.PROPERTY_VIEWED),
        ev("a", EventName.WISHLIST_ADDED),
        ev("b", EventName.SEARCH_PERFORMED), ev("b", EventName.PROPERTY_VIEWED),
        # 검색만 하고 떠난 사람 둘 — 찜에 닿을 수 없었다
        ev("c", EventName.SEARCH_PERFORMED), ev("d", EventName.SEARCH_PERFORMED),
    ]
    row = adoption(frame(rows)).set_index("feature").loc["wishlist_added"]
    assert row["reachable"] == 2, "숙소를 본 사람만 분모다"
    assert row["used"] == 1
    assert row["adoption_rate"] == 0.5     # 전체(4명)로 나눴다면 25% 로 보였다
    assert row["gate"] == "property_viewed"


def test_uses_per_user_separates_breadth_from_depth():
    """사용률이 같아도 1인당 횟수가 다르면 다른 기능이다."""
    rows = [
        ev("a", EventName.PROPERTY_VIEWED),
        ev("a", EventName.ROOM_VIEWED, room_id="R1"),
        ev("a", EventName.ROOM_VIEWED, room_id="R2"),
        ev("a", EventName.ROOM_VIEWED, room_id="R3"),
        ev("b", EventName.PROPERTY_VIEWED),
        ev("b", EventName.WISHLIST_ADDED),
    ]
    ad = adoption(frame(rows)).set_index("feature")
    assert ad.loc["room_viewed", "uses_per_user"] == 3.0
    assert ad.loc["wishlist_added", "uses_per_user"] == 1.0


def test_a_feature_nobody_reached_is_not_reported_as_zero_percent():
    """분모가 0 이면 사용률도 0 이다 — 나쁜 게 아니라 잴 수 없는 것이다."""
    rows = [ev("a", EventName.SEARCH_PERFORMED)]
    row = adoption(frame(rows)).set_index("feature").loc["booking_cancelled"]
    assert row["reachable"] == 0
    assert row["adoption_rate"] == 0.0


# ─────────────────────────────── 계약과 현실
def test_unused_reports_events_defined_but_never_emitted():
    rows = [ev("a", EventName.SEARCH_PERFORMED)]
    missing = unused(frame(rows))
    assert "wishlist_added" in missing
    assert "search_performed" not in missing


def test_deliberate_absences_are_not_mixed_with_real_gaps():
    """앱 생명주기는 앱이 없어서 안 나온다 — 배선을 빠뜨린 것과 다르다.

    같은 경고로 묶으면 진짜 누락이 묻힌다.
    """
    rows = [ev("a", EventName.SEARCH_PERFORMED)]
    missing = unused(frame(rows), expected=set(AWAITING_APP))
    assert "app_backgrounded" not in missing
    assert "wishlist_added" in missing


def test_simulator_now_emits_every_contracted_business_event():
    """계약에 있는데 안 만드는 이벤트가 남아 있으면 안 된다(앱 생명주기 제외)."""
    raw, _ = simulate()
    seen = {e["event_name"] for e in raw}
    expected = {e.value for e in EventName} - set(AWAITING_APP)
    assert expected <= seen, f"아직 안 나오는 이벤트: {sorted(expected - seen)}"


# ─────────────────────────────── 순매출
def test_net_revenue_subtracts_what_was_given_back():
    """`amount` 를 "움직인 금액"으로 정의했기 때문에 뺄셈이 성립한다."""
    rows = [
        ev("a", EventName.BOOKING_COMPLETED, booking_id="B1", amount=100_000),
        ev("b", EventName.BOOKING_COMPLETED, booking_id="B2", amount=200_000),
        ev("a", EventName.BOOKING_CANCELLED, T0 + timedelta(days=2),
           booking_id="B1", amount=50_000),          # 부분 환불
    ]
    r = summarize(frame(rows))
    assert r.gross_revenue == 300_000
    assert r.refunded == 50_000
    assert r.net_revenue == 250_000
    assert r.cancellations == 1
    assert r.cancellation_rate == 0.5


def test_a_partial_refund_cannot_be_derived_from_the_cancellation_count():
    """건수만으로는 순매출을 못 낸다 — 전액 환불이 아닐 수 있다."""
    rows = [
        ev("a", EventName.BOOKING_COMPLETED, booking_id="B1", amount=100_000),
        ev("a", EventName.BOOKING_CANCELLED, T0 + timedelta(days=1),
           booking_id="B1", amount=20_000),
    ]
    r = summarize(frame(rows))
    assert r.cancellations == 1
    assert r.net_revenue == 80_000, "건수 기준이면 0 원이 됐을 것이다"


def test_aov_stays_on_gross_because_refunds_happen_later():
    """주문 시점의 값과 나중 시점의 값을 한 지표에 섞지 않는다."""
    rows = [
        ev("a", EventName.BOOKING_COMPLETED, booking_id="B1", amount=100_000),
        ev("a", EventName.BOOKING_CANCELLED, T0 + timedelta(days=3),
           booking_id="B1", amount=100_000),
    ]
    r = summarize(frame(rows))
    assert r.aov == 100_000.0
    assert r.net_revenue == 0
