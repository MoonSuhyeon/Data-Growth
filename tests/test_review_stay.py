"""리뷰는 투숙한 사람만 쓴다.

`reviews.booking_id` 는 컬럼으로 있는데 **아무도 안 채우고 있었다.** 리뷰 생성이
안 넣고 시드에는 예약 자체가 없었다. 그래서 "실제 투숙" 을 유도할 방법이 없었고,
동시에 **아무나 별점을 남길 수 있었다.**

이 저장소는 평점을 화면에 그대로 내건다(`_update_property_rating`). 아무나 쓸 수
있는 평점은 믿을 근거가 없는 숫자다 — 묵지 않은 사람의 별점을 섞어 놓고 "평균
4.5" 라고 말하는 것과 같다.
"""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta

import pytest

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_review_stay.db")
os.environ.setdefault("JWT_SECRET", "test-secret")

from app.models.base import BookingStatusEnum  # noqa: E402


# ─────────────────────────────── 투숙의 정의
def _stayed(status: BookingStatusEnum, check_out: datetime, now: datetime) -> bool:
    """`_completed_stay` 가 쓰는 조건. 여기서 정의를 고정한다."""
    return status is BookingStatusEnum.CONFIRMED and check_out <= now


NOW = datetime(2025, 6, 20, 12, 0)


@pytest.mark.parametrize(
    "status, check_out, expected, why",
    [
        (BookingStatusEnum.CONFIRMED, NOW - timedelta(days=1), True, "묵고 나왔다"),
        (BookingStatusEnum.CONFIRMED, NOW + timedelta(days=3), False,
         "앞으로 묵을 예약이다 — 아직 경험이 없다"),
        (BookingStatusEnum.CANCELLED, NOW - timedelta(days=1), False,
         "취소했으면 묵지 않았다"),
        (BookingStatusEnum.REFUNDED, NOW - timedelta(days=1), False,
         "환불받았으면 묵지 않았다"),
        (BookingStatusEnum.PENDING, NOW - timedelta(days=1), False,
         "결제가 안 끝난 예약은 투숙이 아니다"),
    ],
)
def test_what_counts_as_a_completed_stay(status, check_out, expected, why):
    """**두 조건을 같이 봐야 한다.** 하나만 보면 경계가 샌다.

    상태만 보면 다음 주에 올 사람이 리뷰를 쓰고, 날짜만 보면 취소한 사람이 쓴다.
    """
    assert _stayed(status, check_out, NOW) is expected, why


# ─────────────────────────────── API 경계
@pytest.fixture(scope="module")
def client():
    import asyncio

    from fastapi.testclient import TestClient

    from app.core.database import engine
    from app.main import app
    from app.models.base import Base
    from app.seed import seed

    async def prep():
        async with engine.begin() as c:
            await c.run_sync(Base.metadata.create_all)
        await seed()

    asyncio.run(prep())
    yield TestClient(app)
    # DB 파일은 지우지 않는다 — 테스트 전체가 한 DB 를 공유한다
    # (`tests/conftest.py`). 지우면 남의 데이터까지 날아간다.


@pytest.fixture(scope="module")
def auth(client):
    r = client.post("/api/v1/auth/login",
                    json={"email": "user1@stay.example", "password": "pass1234"})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _properties_for(email: str, status: BookingStatusEnum) -> list[str]:
    import asyncio

    from sqlalchemy import select

    from app.core.database import AsyncSessionLocal
    from app.models import Booking, StayDate, User

    async def q():
        async with AsyncSessionLocal() as s:
            u = (await s.execute(select(User).where(User.email == email))).scalars().first()
            rows = (await s.execute(
                select(StayDate.property_id)
                .join(Booking, Booking.stay_date_id == StayDate.id)
                .where(Booking.user_id == u.id, Booking.status == status,
                       StayDate.check_out <= datetime.utcnow())
            )).scalars().all()
            return [str(p) for p in rows]

    return asyncio.run(q())


def test_a_guest_who_stayed_can_review_and_is_marked_verified(client, auth):
    pid = _properties_for("user1@stay.example", BookingStatusEnum.CONFIRMED)[0]
    r = client.post(f"/api/v1/properties/{pid}/reviews", headers=auth,
                    json={"rating": 5, "content": "좋았습니다"})
    assert r.status_code == 200, r.text
    assert r.json()["verified_stay"] is True


def test_someone_who_cancelled_cannot_review(client, auth):
    """취소한 예약은 투숙이 아니다. 여기가 막히지 않으면 규칙이 없는 것과 같다."""
    cancelled = set(_properties_for("user1@stay.example", BookingStatusEnum.CANCELLED))
    confirmed = set(_properties_for("user1@stay.example", BookingStatusEnum.CONFIRMED))
    only_cancelled = sorted(cancelled - confirmed)
    if not only_cancelled:
        pytest.skip("취소만 있는 숙소가 시드에 없다")

    r = client.post(f"/api/v1/properties/{only_cancelled[0]}/reviews", headers=auth,
                    json={"rating": 1, "content": "안 갔지만"})
    assert r.status_code == 403
    assert "투숙" in r.json()["detail"]


def test_someone_who_never_booked_cannot_review(client, auth):
    import asyncio

    from sqlalchemy import select

    from app.core.database import AsyncSessionLocal
    from app.models import Property

    mine = set(_properties_for("user1@stay.example", BookingStatusEnum.CONFIRMED)) | \
        set(_properties_for("user1@stay.example", BookingStatusEnum.CANCELLED))

    async def other():
        async with AsyncSessionLocal() as s:
            rows = (await s.execute(select(Property.id))).scalars().all()
            return [str(p) for p in rows if str(p) not in mine]

    pid = asyncio.run(other())[0]
    r = client.post(f"/api/v1/properties/{pid}/reviews", headers=auth,
                    json={"rating": 1, "content": "안 가봤는데요"})
    assert r.status_code == 403


def test_the_reason_is_returned_so_the_screen_can_explain(client, auth):
    """403 에 이유가 없으면 화면은 "실패했습니다" 밖에 못 쓴다."""
    import asyncio

    from sqlalchemy import select

    from app.core.database import AsyncSessionLocal
    from app.models import Property

    mine = set(_properties_for("user1@stay.example", BookingStatusEnum.CONFIRMED))

    async def other():
        async with AsyncSessionLocal() as s:
            rows = (await s.execute(select(Property.id))).scalars().all()
            return [str(p) for p in rows if str(p) not in mine]

    r = client.post(f"/api/v1/properties/{asyncio.run(other())[-1]}/reviews", headers=auth,
                    json={"rating": 3})
    assert r.json().get("detail"), "이유 없는 거절은 화면이 설명할 수 없다"


# ─────────────────────────────── 시드가 전제를 만드는가
def test_seed_creates_completed_stays():
    """투숙 이력이 없으면 규칙을 세워도 아무도 리뷰를 못 쓴다."""
    import asyncio

    from sqlalchemy import func, select

    from app.core.database import AsyncSessionLocal
    from app.models import Booking, StayDate

    async def q():
        async with AsyncSessionLocal() as s:
            return (await s.execute(
                select(func.count()).select_from(Booking)
                .join(StayDate, Booking.stay_date_id == StayDate.id)
                .where(Booking.status == BookingStatusEnum.CONFIRMED,
                       StayDate.check_out <= datetime.utcnow())
            )).scalar()

    assert asyncio.run(q()) > 0
