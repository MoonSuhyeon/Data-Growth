"""매출 지표.

이벤트에 ``amount`` 가 실려 오는데 지금껏 아무도 읽지 않았다. 퍼널은 "샀는가"만
묻고 "얼마어치 샀는가"는 안 물었다.

여기서 고정하는 건 숫자가 아니라 **정의**다. AOV·ARPPU·ARPU 는 자주 섞여 쓰이고,
섞이면 같은 이름으로 다른 숫자를 보고하게 된다.
"""
from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd
import pytest

from analytics.funnel import sessionize
from analytics.retention import churn, label_visits
from analytics.revenue import by_segment, cohort_revenue, summarize
from tracking.taxonomy import EventName

T0 = datetime(2025, 6, 1, 10, 0)


def ev(anon, when, name=EventName.PROPERTY_VIEWED, amount=None, **kw):
    return {
        "anonymous_id": anon,
        "user_id": None,
        "event_name": name.value,
        "timestamp": when,
        "property_id": "P0001",
        "amount": amount,
        **kw,
    }


def buy(anon, when, amount, **kw):
    return ev(anon, when, EventName.BOOKING_COMPLETED, amount=amount, **kw)


def frame(rows):
    df = pd.DataFrame(rows)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    return df


def labelled(rows):
    return label_visits(sessionize(frame(rows)))


# ─────────────────────────────── 정의
def test_aov_arppu_and_arpu_are_three_different_things():
    """한 사람이 두 번 사면 셋이 전부 갈린다. 같은 값이면 정의가 섞인 것이다."""
    df = frame([
        ev("a", T0), buy("a", T0 + timedelta(minutes=5), 100_000),
        buy("a", T0 + timedelta(days=3), 200_000),
        ev("b", T0),                       # 둘러만 보고 안 삼
    ])
    r = summarize(df)

    assert r.orders == 2 and r.buyers == 1 and r.people == 2
    assert r.aov == 150_000.0      # 매출 / 주문 수
    assert r.arppu == 300_000.0    # 매출 / 구매자 수
    assert r.arpu == 150_000.0     # 매출 / 전체 사람 수
    assert r.purchase_rate == 0.5


def test_amount_counts_only_on_the_revenue_event():
    """다른 이벤트에 금액이 붙어 와도 매출로 세지 않는다."""
    df = frame([
        ev("a", T0, EventName.BOOKING_STARTED, amount=999_999),
        buy("a", T0 + timedelta(minutes=5), 50_000),
    ])
    assert summarize(df).gross_revenue == 50_000


def test_a_completed_booking_without_amount_is_not_counted_as_zero():
    """금액이 없는 주문은 0 원 주문이 아니다 — 세면 AOV 가 조용히 낮아진다."""
    df = frame([
        buy("a", T0, 100_000),
        buy("b", T0, None),
    ])
    r = summarize(df)
    assert r.orders == 1
    assert r.aov == 100_000.0


def test_revenue_is_gross_not_net():
    """취소가 데이터에 없으므로 환불을 뺄 수 없다. 그 사실이 값에 반영돼 있다."""
    df = frame([
        buy("a", T0, 100_000),
        ev("a", T0 + timedelta(days=1), EventName.BOOKING_CANCELLED, booking_id="B1"),
    ])
    # 취소 이벤트가 있어도 총매출은 그대로다. 순매출을 원하면 환불 금액이 필요하다.
    assert summarize(df).gross_revenue == 100_000


def test_one_person_across_two_identifiers_is_one_buyer():
    """스티칭 결과를 쓴다. 익명·회원이 갈리면 구매자가 두 명으로 세어진다."""
    df = frame([
        buy("a", T0, 100_000),
        dict(buy("b", T0 + timedelta(days=1), 100_000), user_id="U1"),
    ])
    df["resolved_user_id"] = ["U1", "U1"]
    r = summarize(df)
    assert r.buyers == 1
    assert r.orders == 2


# ─────────────────────────────── 세그먼트
def test_segment_revenue_separates_conversion_from_basket_size():
    """전환율이 달라도 객단가는 같을 수 있다. 퍼널만 보면 그 구분이 안 된다."""
    rows = []
    for i in range(4):                      # DESKTOP: 4명 중 2명 구매
        rows.append(ev(f"d{i}", T0, device_type="DESKTOP"))
    rows += [buy("d0", T0, 100_000, device_type="DESKTOP"),
             buy("d1", T0, 100_000, device_type="DESKTOP")]
    for i in range(4):                      # MOBILE: 4명 중 1명 구매, 금액은 같다
        rows.append(ev(f"m{i}", T0, device_type="MOBILE"))
    rows.append(buy("m0", T0, 100_000, device_type="MOBILE"))

    seg = by_segment(frame(rows), "device_type").set_index("device_type")
    assert seg.loc["DESKTOP", "aov"] == seg.loc["MOBILE", "aov"]      # 객단가는 같고
    assert seg.loc["DESKTOP", "arpu"] > seg.loc["MOBILE", "arpu"]     # 1인당은 다르다


# ─────────────────────────────── 우측 절단
def test_cohort_revenue_drops_cohorts_without_a_full_window():
    """N일이 안 찬 코호트를 넣으면 최근일수록 돈을 덜 쓴 것처럼 보인다."""
    rows = [
        ev("old", T0), buy("old", T0 + timedelta(days=1), 100_000),
        ev("new", T0 + timedelta(days=20)),          # 관측 끝 직전에 처음 옴
    ]
    rows.append(ev("old", T0 + timedelta(days=21)))  # 관측 종료 시점을 늘린다
    cr = cohort_revenue(labelled(rows), within_days=7)
    cohorts = set(cr["cohort"])
    assert cohorts, "완전한 창을 가진 코호트는 남아야 한다"
    # 마지막 주에 처음 온 사람의 코호트는 7일이 안 찼으므로 빠진다
    assert len(cohorts) < 3


def test_churn_needs_labels_first():
    df = frame([ev("a", T0)])
    with pytest.raises(ValueError, match="label_visits"):
        churn(sessionize(df))


def test_churn_counts_people_who_did_not_come_back_within_the_window():
    rows = [
        ev("stay", T0), ev("stay", T0 + timedelta(days=2)),   # 7일 안에 재방문
        ev("gone", T0),                                        # 안 돌아옴
        ev("stay", T0 + timedelta(days=30)),                   # 관측 창을 늘린다
    ]
    ch = churn(labelled(rows), within_days=7)
    first = ch.iloc[0]
    assert first["people"] == 2
    assert first["churned"] == 1
    assert first["d7_churn_rate"] == 0.5
