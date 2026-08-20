from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from contextlib import asynccontextmanager

from app.api.v1 import (
    auth, properties, regions, stay_dates, rooms, room_holds, experiments, events, analytics,
    bookings, guest_bookings, guest_types, admin,
    refunds, receipts, amenities, notifications, room_changes,
)
from app.api.v1 import (
    wishlists, reviews, coupons, points, addons,
    memberships, notification_settings, user_activities, codes,
)

@asynccontextmanager
async def lifespan(_: FastAPI):
    # SQLite 로 띄웠을 때만 스키마와 데모 데이터를 만든다.
    # PostgreSQL 은 alembic 이 맡으므로 아무것도 하지 않는다.
    from app.demo import ensure_demo_data
    await ensure_demo_data()
    yield


app = FastAPI(
    title="Stay Booking API",
    description="숙소 예약 API",
    version="4.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(properties.router, prefix="/api/v1/properties", tags=["Properties"])
app.include_router(regions.router, prefix="/api/v1/regions", tags=["Regions"])
app.include_router(stay_dates.router, prefix="/api/v1/stay-dates", tags=["StayDates"])
app.include_router(rooms.router, prefix="/api/v1/stay-dates", tags=["Rooms"])
app.include_router(room_holds.router, prefix="/api/v1/room-holds", tags=["RoomHolds"])
app.include_router(bookings.router, prefix="/api/v1/bookings", tags=["Bookings"])
app.include_router(refunds.router, prefix="/api/v1/bookings", tags=["Refunds"])
app.include_router(receipts.router, prefix="/api/v1/bookings", tags=["Receipts"])
app.include_router(room_changes.router, prefix="/api/v1/bookings", tags=["RoomChanges"])
app.include_router(guest_bookings.router, prefix="/api/v1/guest-bookings", tags=["GuestBookings"])
app.include_router(guest_types.router, prefix="/api/v1/guest-types", tags=["GuestTypes"])
app.include_router(amenities.router, prefix="/api/v1/amenities", tags=["Amenities"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

# 부가 기능
app.include_router(wishlists.router, prefix="/api/v1/wishlists", tags=["Wishlists"])
app.include_router(reviews.router, prefix="/api/v1/properties", tags=["Reviews"])
app.include_router(coupons.router, prefix="/api/v1/coupons", tags=["Coupons"])
app.include_router(points.router, prefix="/api/v1/points", tags=["Points"])
app.include_router(addons.router, prefix="/api/v1/addons", tags=["AddOns"])
app.include_router(memberships.router, prefix="/api/v1/memberships", tags=["Memberships"])
app.include_router(notification_settings.router, prefix="/api/v1/notification-settings", tags=["NotificationSettings"])
app.include_router(user_activities.router, prefix="/api/v1/activities", tags=["UserActivities"])
app.include_router(codes.router, prefix="/api/v1/codes", tags=["CodeTables"])
# 실험 배정 — 클라이언트가 아니라 서버가 정한다.
app.include_router(experiments.router, prefix="/api/v1/experiments", tags=["Experiments"])
app.include_router(events.router, prefix="/api/v1", tags=["Events"])
app.include_router(analytics.router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "version": "4.0.0"}
