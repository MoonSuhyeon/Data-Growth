"""취소 환불 정책.

## 왜 여기 있는가

환불 금액 계산이 **상담 에이전트에만** 있었다. 예약 서비스는 취소하면 무조건
`refund_amount = booking.total_price` 였다 — 언제 취소하든 전액이다.

그러면 에이전트가 "체크인이 지났으니 0원 환불됩니다" 라고 설명하고, 실제로는
9만원이 나간다. 설명과 집행이 어긋나는 정도가 아니라 **에이전트의 존재 이유인
정책 설명이 통째로 거짓말이 된다.**

고칠 자리는 둘 중 하나였다.

1. 예약 서비스가 금액을 인자로 받는다 → 호출자가 환불액을 정하게 된다. 고객
   브라우저도 같은 엔드포인트를 부를 수 있으니 **금액 위조**가 열린다.
2. 정책을 예약 서비스로 옮긴다 → **돈을 다루는 계산은 돈을 소유한 서비스에.**

2번이다. 에이전트는 설명하고 사람 승인을 받는 일을 하고, 얼마인지는 여기서 정한다.

## 숙소마다 다를 수 있다

`Property.cancellation_policy` 가 코드를 가리킨다. 안 정해 두면 `STANDARD` 다 —
**기본값이 있는 것과 정책이 하나뿐인 것은 다르다.** 새 숙소를 만들 때마다
정책을 고르라고 강요하면 등록이 막히고, 그렇다고 없는 채로 두면 환불액을 못
낸다. 기본값을 두되 그 기본값이 무엇인지 응답에 적는다.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime

#: 정책 목록. (체크인까지 남은 최소 일수, 환불 비율) 을 큰 것부터.
#:
#: 숙소가 고르는 값이라 **코드가 곧 계약**이다. 이름을 바꾸면 이미 등록된
#: 숙소가 가리키는 곳이 사라지므로, 이름은 늘리기만 하고 바꾸지 않는다.
POLICIES: dict[str, tuple[str, tuple[tuple[int, float], ...]]] = {
    "FLEXIBLE": ("유연", ((3, 1.0), (1, 0.5))),
    "STANDARD": ("표준", ((7, 1.0), (3, 0.5), (1, 0.2))),
    "STRICT": ("엄격", ((14, 1.0), (7, 0.5))),
}

#: 정책을 안 정한 숙소가 따르는 것.
DEFAULT_CODE = "STANDARD"

#: 예전 이름. 이 상수를 쓰던 곳이 있어 남겨 둔다.
TIERS: tuple[tuple[int, float], ...] = POLICIES[DEFAULT_CODE][1]
POLICY_NAME = f"{POLICIES[DEFAULT_CODE][0]} 취소 정책"


def _resolve(code: str | None) -> tuple[str, str, tuple[tuple[int, float], ...]]:
    """코드 → (코드, 이름, 구간).

    모르는 코드는 기본값으로 떨어뜨리되 **조용히 하지 않는다** — 돌려주는 코드가
    요청한 것과 다르므로, 응답을 보는 쪽이 알아챌 수 있다.
    """
    key = code if code in POLICIES else DEFAULT_CODE
    label, tiers = POLICIES[key]
    return key, f"{label} 취소 정책", tiers


def describe(code: str | None = None) -> str:
    _, _, tiers = _resolve(code)
    parts = [f"체크인 {d}일 전까지 {int(r * 100)}% 환불" for d, r in tiers]
    return ", ".join(parts) + ", 이후 환불 불가"


def refund_ratio(days_until_check_in: int, code: str | None = None) -> float:
    """남은 일수에 대한 환불 비율.

    체크인이 지났으면(음수) 어떤 구간에도 안 걸려 0 이다. **0 은 "환불 없음"
    이지 "계산 실패" 가 아니다** — 둘을 같은 값으로 두면 화면이 구분할 수 없다.
    """
    _, _, tiers = _resolve(code)
    for min_days, ratio in tiers:
        if days_until_check_in >= min_days:
            return ratio
    return 0.0


@dataclass(frozen=True)
class RefundQuote:
    """얼마를 돌려주는가, 그리고 왜."""

    total_price: int
    days_until_check_in: int
    ratio: float
    amount: int
    policy_code: str
    policy_name: str
    policy_description: str

    @property
    def refundable(self) -> bool:
        return self.amount > 0


def quote(total_price: int, check_in: date | datetime, today: date | None = None,
          code: str | None = None) -> RefundQuote:
    """환불 예상액.

    **내림한다.** 반올림하면 1원이 더 나가고, 돈은 넘치는 쪽으로 틀리면 안 된다.
    """
    if isinstance(check_in, datetime):
        check_in = check_in.date()
    days = (check_in - (today or date.today())).days
    key, name, _ = _resolve(code)
    ratio = refund_ratio(days, key)
    return RefundQuote(
        total_price=total_price,
        days_until_check_in=days,
        ratio=ratio,
        amount=int(total_price * ratio),
        policy_code=key,
        policy_name=name,
        policy_description=describe(key),
    )


__all__ = ["DEFAULT_CODE", "POLICIES", "POLICY_NAME", "RefundQuote", "TIERS",
           "describe", "quote", "refund_ratio"]
