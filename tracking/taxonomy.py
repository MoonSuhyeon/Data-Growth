"""이벤트 택소노미.

**수집보다 정의가 먼저다.** 이름과 속성의 의미가 흔들리면 나중에 쌓인 데이터 전체를
신뢰할 수 없게 된다. 그래서 스키마를 코드로 고정하고, 검증에 실패한 이벤트는
버리지 않고 격리한다.

명명 규칙: ``<object>_<past_tense_verb>``

**플랫폼 중립으로 쓴다.** 지금 트래픽은 전부 웹이지만, 계약이 브라우저를 전제하면
나중에 앱을 붙일 때 숫자가 조용히 틀어진다. 그래서 클라이언트를 만들기 전에
계약부터 중립으로 만든다 — 순서가 뒤바뀌면 이미 쌓인 데이터는 못 고친다.
"""
from __future__ import annotations

from datetime import datetime, timedelta
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

    # --- 앱 생명주기 -------------------------------------------------
    # 웹에는 대응물이 없다. 브라우저는 "탭을 떠났다"를 알려주지 않아서 침묵으로
    # 추론할 수밖에 없지만, 앱은 백그라운드로 갔다는 사실을 명시적으로 알려준다.
    # 세션 경계를 추론이 아니라 신호로 정할 수 있게 하는 이벤트다.
    APP_BACKGROUNDED = "app_backgrounded"
    APP_FOREGROUNDED = "app_foregrounded"


class DeviceType(str, Enum):
    """기기 종류. **플랫폼과 다르다** — 모바일 브라우저도 MOBILE 이다."""

    MOBILE = "MOBILE"
    DESKTOP = "DESKTOP"
    TABLET = "TABLET"


class Platform(str, Enum):
    """어디서 보냈는가.

    ``DeviceType`` 과 헷갈리기 쉬운데 축이 다르다. 모바일 브라우저는
    ``device_type=MOBILE, platform=WEB`` 이고 앱은 ``platform=IOS|ANDROID`` 다.
    둘을 하나로 묶으면 "모바일 전환이 낮다"가 웹 문제인지 앱 문제인지 못 가른다.
    """

    WEB = "WEB"
    IOS = "IOS"
    ANDROID = "ANDROID"


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
    # 생명주기 이벤트는 추가 속성을 요구하지 않는다. platform 과 install_id 는
    # 앱 이벤트 공통 규칙에서 이미 강제된다.
    EventName.APP_BACKGROUNDED: (),
    EventName.APP_FOREGROUNDED: (),
}

# 생명주기 이벤트 — 퍼널에 들어가지 않는다. 사용자의 행동이 아니라 앱의 상태다.
LIFECYCLE_EVENTS: frozenset[EventName] = frozenset(
    {EventName.APP_BACKGROUNDED, EventName.APP_FOREGROUNDED}
)

# 기기 시계를 이만큼 넘게 믿지 않는다. 넘으면 서버 시각으로 정렬한다.
MAX_CLOCK_SKEW = timedelta(hours=6)


class Event(BaseModel):
    """수집 단위. 익명·회원 식별자를 **둘 다** 들고 다닌다.

    로그인 전 행동을 버리지 않는 것이 이 설계의 핵심이다.
    """

    event_id: str = Field(min_length=1)
    event_name: EventName
    anonymous_id: str = Field(min_length=1)
    user_id: str | None = None
    session_id: str | None = None

    # --- 시각 -------------------------------------------------------
    # 하나로 두면 기기 시계가 틀렸을 때 순서와 세션 경계가 같이 무너진다.
    # 클라이언트가 말한 시각과 서버가 받은 시각을 나눠 둔다.
    sent_at: datetime
    received_at: datetime | None = None

    # --- 플랫폼 -----------------------------------------------------
    platform: Platform = Platform.WEB
    # 앱 설치 식별자. 웹에는 없다. 재설치하면 바뀌므로 이것만으로 사람을 못 잇는다.
    install_id: str | None = None
    app_version: str | None = None

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

    @property
    def timestamp(self) -> datetime:
        """분석이 쓰는 시각.

        기기 시계가 크게 틀어졌으면 서버가 받은 시각을 쓴다. 클라이언트를 무조건
        믿으면, 오프라인 버퍼에 며칠 갇혔다 올라온 이벤트가 과거로 끼어들어
        세션 경계와 퍼널 순서를 흔든다.
        """
        if self.received_at is None:
            return self.sent_at
        if abs(self.received_at - self.sent_at) > MAX_CLOCK_SKEW:
            return self.received_at
        return self.sent_at

    @property
    def clock_skew(self) -> timedelta | None:
        return None if self.received_at is None else self.received_at - self.sent_at

    @property
    def is_app(self) -> bool:
        return self.platform is not Platform.WEB

    def missing_required(self) -> list[str]:
        """이벤트 종류가 요구하는 속성 중 비어 있는 것."""
        need = REQUIRED_PROPS.get(self.event_name, ())
        missing = [f for f in need if getattr(self, f, None) in (None, "")]
        # 앱은 설치 식별자가 있어야 재설치와 크로스 플랫폼 결합을 다룰 수 있다.
        if self.is_app and not self.install_id:
            missing.append("install_id")
        return missing


class QuarantinedEvent(BaseModel):
    """검증 실패 이벤트. **드롭하지 않는다.**

    스키마를 고친 뒤 재처리할 수 있어야 하고, 실패율 자체가 수집 품질 지표다.
    """

    raw: dict[str, Any]
    reason: str
    received_at: datetime = Field(default_factory=datetime.utcnow)


__all__ = [
    "DeviceType", "Event", "EventName", "FUNNEL_STEPS", "LIFECYCLE_EVENTS",
    "MAX_CLOCK_SKEW", "Platform", "QuarantinedEvent", "REQUIRED_PROPS",
]
