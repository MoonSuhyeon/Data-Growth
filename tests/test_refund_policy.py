"""환불 정책.

## 왜 생겼는가

환불 계산이 **상담 에이전트에만** 있었다. 예약 서비스는 언제 취소하든
`refund_amount = booking.total_price` — 전액이었다.

그래서 에이전트가 "체크인이 지났으니 0원 환불됩니다" 라고 설명하고 실제로는
9만원이 나갔다. 설명과 집행이 어긋나는 정도가 아니라 **에이전트의 존재 이유가
거짓말이 된다.**

금액을 요청에서 받는 방법도 있었지만 그건 호출자가 환불액을 정하게 만드는
것이라 열지 않았다. **돈을 다루는 계산은 돈을 소유한 서비스에** 둔다.

여기서 고정하는 것은 규칙 자체와, **설명(`refund-quote`)과 집행(`refund`)이
같은 값을 내는가** 다.
"""
from __future__ import annotations

import os
from datetime import date, datetime, timedelta

import pytest

# 라우터 모듈을 읽으려면 설정이 있어야 한다. 이 테스트는 DB 를 쓰지 않지만
# `Settings` 는 모듈을 불러오는 시점에 만들어진다.
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_refund_policy.db")
os.environ.setdefault("JWT_SECRET", "test-secret")

from app import refund_policy  # noqa: E402


TOTAL = 100_000


def q(days: int):
    """체크인이 `days` 일 남은 예약의 견적."""
    today = date(2026, 6, 1)
    return refund_policy.quote(TOTAL, today + timedelta(days=days), today=today)


# ─────────────────────────────────────── 구간
@pytest.mark.parametrize("days,ratio", [
    (30, 1.0), (8, 1.0), (7, 1.0),      # 7일 전까지 전액
    (6, 0.5), (4, 0.5), (3, 0.5),       # 3일 전까지 절반
    (2, 0.2), (1, 0.2),                 # 1일 전까지 20%
    (0, 0.0), (-1, 0.0), (-30, 0.0),    # 당일과 그 뒤는 없음
])
def test_the_tiers_hold_at_their_edges(days: int, ratio: float):
    """경계값을 전부 짚는다. **구간 정책은 경계에서 틀린다.**"""
    assert q(days).ratio == ratio


def test_a_passed_check_in_refunds_nothing_but_still_computes():
    """0원은 **"환불 없음" 이지 "계산 실패" 가 아니다.**"""
    r = q(-5)
    assert r.amount == 0
    assert r.refundable is False
    assert r.policy_description, "왜 0원인지 설명할 수 있어야 한다"


def test_the_amount_rounds_down():
    """반올림하면 1원이 더 나간다. **돈은 넘치는 쪽으로 틀리면 안 된다.**"""
    today = date(2026, 6, 1)
    r = refund_policy.quote(12_345, today + timedelta(days=5), today=today)
    assert r.ratio == 0.5
    assert r.amount == 6172, "12,345 의 절반은 6,172.5 다"


def test_a_datetime_check_in_is_accepted():
    """예약 서비스는 체크인을 `datetime` 으로 들고 있다."""
    today = date(2026, 6, 1)
    r = refund_policy.quote(TOTAL, datetime(2026, 6, 10, 15, 0), today=today)
    assert r.days_until_check_in == 9
    assert r.ratio == 1.0


def test_the_description_lists_every_tier():
    """고객에게 "왜 절반인가" 를 설명하려면 구간이 다 보여야 한다."""
    d = refund_policy.describe()
    for days, ratio in refund_policy.TIERS:
        assert f"{days}일" in d
        assert f"{int(ratio * 100)}%" in d
    assert "이후 환불 불가" in d


# ─────────────────────────────────────── 설명과 집행이 같은가
def test_quote_and_charge_share_one_rule():
    """**이 테스트가 이 파일의 요점이다.**

    견적을 내는 곳과 실제로 깎는 곳이 각자 계산하면 언젠가 갈린다. 두 곳이
    같은 함수를 부르는지 코드로 확인한다 — 숫자만 맞춰 두면 한쪽만 고쳤을 때
    조용히 어긋난다.
    """
    import inspect

    from app.api.v1 import refunds

    src = inspect.getsource(refunds)
    # 집행 경로가 자기 산수를 하지 않는다
    assert "refund_amount=booking.total_price" not in src, (
        "환불액이 다시 전액으로 돌아갔다")
    # 두 경로 모두 정책을 부른다
    assert src.count("refund_policy.quote(") >= 2, (
        "견적과 집행 중 한쪽이 정책을 안 쓴다")


def test_the_notification_says_the_real_amount():
    """알림이 `total_price` 를 말하면, 절반만 돌려주고 전액이라고 알린다."""
    import inspect

    from app.api.v1 import refunds

    src = inspect.getsource(refunds)
    assert "환불금액: {booking.total_price" not in src
    assert "환불금액: {q.amount" in src


# ─────────────────────────────────────── 숙소마다 다른 정책
def test_each_policy_has_its_own_tiers():
    """세 정책이 실제로 다른 답을 낸다.

    이름만 다르고 구간이 같으면 고르는 의미가 없다. 체크인 5일 전에서 갈린다.
    """
    today = date(2026, 6, 1)
    check_in = today + timedelta(days=5)
    ratios = {
        code: refund_policy.quote(TOTAL, check_in, today=today, code=code).ratio
        for code in refund_policy.POLICIES
    }
    assert ratios["FLEXIBLE"] == 1.0
    assert ratios["STANDARD"] == 0.5
    assert ratios["STRICT"] == 0.0
    assert len(set(ratios.values())) == 3, "정책들이 같은 답을 낸다"


def test_no_policy_falls_back_and_says_which():
    """**비어 있는 것과 표준을 고른 것은 다르다.**

    비면 기본값으로 계산하되, 어느 정책을 적용했는지 응답에 남는다.
    """
    r = refund_policy.quote(TOTAL, date(2026, 6, 6), today=date(2026, 6, 1), code=None)
    assert r.policy_code == refund_policy.DEFAULT_CODE
    assert r.policy_name


def test_an_unknown_code_does_not_crash_or_hide():
    """모르는 코드로 500 을 내지 않는다. 다만 무엇을 적용했는지는 밝힌다."""
    r = refund_policy.quote(TOTAL, date(2026, 6, 6), today=date(2026, 6, 1), code="없는정책")
    assert r.policy_code == refund_policy.DEFAULT_CODE


def test_both_paths_pass_the_property_policy():
    """견적과 집행이 **같은 인자로** 정책을 부르는가.

    한쪽만 숙소 코드를 넘기면 설명과 집행이 갈린다 — 이 파일이 존재하는 이유
    그 자체다.
    """
    import inspect

    from app.api.v1 import refunds

    src = inspect.getsource(refunds)
    assert src.count("cancellation_policy)") >= 2, (
        "견적과 집행 중 한쪽이 숙소 정책을 안 넘긴다")


# ─────────────────────────────────────── 멱등성
def test_a_repeated_refund_returns_the_first_one():
    """재시도는 정상 동작이다. 두 번째를 오류로 답하면 호출부는 "환불이 안 됐다"
    로 읽고 사람이 개입한다 — 실제로는 첫 번째가 성공했다."""
    import inspect

    from app.api.v1 import refunds

    src = inspect.getsource(refunds.request_refund)
    assert "이미 환불 요청된 예약입니다" not in src, "재시도가 아직 오류로 막힌다"
    # 기존 환불을 그대로 돌려준다
    assert "if booking.refund is not None:" in src
    assert "return RefundResponse(" in src


def test_the_status_check_comes_after_the_idempotency_check():
    """순서가 뒤집히면 **왜 안 되는지가 틀리게 나온다.**

    이미 REFUNDED 인 예약이 "확정된 예약만 환불할 수 있습니다" 로 막힌다.
    """
    import inspect

    from app.api.v1 import refunds

    src = inspect.getsource(refunds.request_refund)
    assert src.index("if booking.refund is not None:") < src.index('if status_val != "CONFIRMED"')
