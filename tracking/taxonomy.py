"""이벤트 택소노미.

**수집보다 정의가 먼저다.** 이름과 속성의 의미가 흔들리면 나중에 쌓인 데이터 전체를
신뢰할 수 없게 된다. 그래서 스키마를 코드로 고정하고, 검증에 실패한 이벤트는
버리지 않고 격리한다.

명명 규칙: ``<object>_<past_tense_verb>``
"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator


class EventName(str, Enum):
    """수집하는 이벤트. 퍼널 순서와 무관하게 전부 여기 정의한다."""

    SEARCH_PERFORMED = "search_performed"
    PROPERTY_VIEWED = "property_viewed"
    ROOM_VIEWED = "room_viewed"
    WISHLIST_ADDED = "wishlist_added"
    BOOKING_STARTED = "booking_started"
    BOOKING_INFO_SUBMITTED = "booking_info_submitted"
    PAYMENT_STARTED = "payment_started"
    BOOKING_COMPLETED = "booking_completed"
    BOOKING_CANCELLED = "booking_cancelled"


class DeviceType(str, Enum):
    MOBILE = "MOBILE"
    DESKTOP = "DESKTOP"
    TABLET = "TABLET"


# 퍼널 정의 — 순서가 곧 분석 단위다.
FUNNEL_STEPS: tuple[EventName, ...] = (
    EventName.SEARCH_PERFORMED,
    EventName.PROPERTY_VIEWED,
    EventName.BOOKING_STARTED,
    EventName.PAYMENT_STARTED,
    EventName.BOOKING_COMPLETED,
)

# 이벤트별 필수 속성. 없으면 격리 대상이다.
REQUIRED_PROPS: dict[EventName, tuple[str, ...]] = {
    EventName.SEARCH_PERFORMED: ("search_id",),
    EventName.PROPERTY_VIEWED: ("property_id",),
    EventName.ROOM_VIEWED: ("property_id", "room_id"),
    EventName.WISHLIST_ADDED: ("property_id",),
    EventName.BOOKING_STARTED: ("property_id",),
    EventName.BOOKING_INFO_SUBMITTED: ("property_id",),
    EventName.PAYMENT_STARTED: ("property_id",),
    EventName.BOOKING_COMPLETED: ("property_id", "booking_id"),
    EventName.BOOKING_CANCELLED: ("booking_id",),
}


class Event(BaseModel):
    """수집 단위. 익명·회원 식별자를 **둘 다** 들고 다닌다.

    로그인 전 행동을 버리지 않는 것이 이 설계의 핵심이다.
    """

    event_id: str
    event_name: EventName
    anonymous_id: str = Field(min_length=1)
    user_id: str | None = None
    session_id: str | None = None
    timestamp: datetime

    property_id: str | None = None
    room_id: str | None = None
    search_id: str | None = None
    booking_id: str | None = None

    device_type: DeviceType = DeviceType.DESKTOP
    referrer: str | None = None
    region: str | None = None
    amount: int | None = Field(default=None, ge=0)
    properties: dict[str, Any] = Field(default_factory=dict)

    @field_validator("anonymous_id")
    @classmethod
    def _not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("anonymous_id 는 비어 있을 수 없다")
        return v

    def missing_required(self) -> list[str]:
        """이벤트 종류가 요구하는 속성 중 비어 있는 것."""
        need = REQUIRED_PROPS.get(self.event_name, ())
        return [f for f in need if getattr(self, f, None) in (None, "")]


class QuarantinedEvent(BaseModel):
    """검증 실패 이벤트. **드롭하지 않는다.**

    스키마를 고친 뒤 재처리할 수 있어야 하고, 실패율 자체가 수집 품질 지표다.
    """

    raw: dict[str, Any]
    reason: str
    received_at: datetime = Field(default_factory=datetime.utcnow)


__all__ = [
    "DeviceType", "Event", "EventName", "FUNNEL_STEPS",
    "QuarantinedEvent", "REQUIRED_PROPS",
]
