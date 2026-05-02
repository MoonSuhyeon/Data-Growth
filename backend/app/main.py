from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import (
    auth, movies, theaters, screenings, seats, seat_holds,
    bookings, guest_bookings, audience_types, admin,
    refunds, receipts, genres, notifications, seat_changes,
)
from app.api.v1 import (
    favorites, reviews, coupons, points, menus,
    memberships, notification_settings, user_activities, codes,
)

app = FastAPI(
    title="Movie Booking API",
    description="영화 예매 API",
    version="3.0.0",
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
app.include_router(movies.router, prefix="/api/v1/movies", tags=["Movies"])
app.include_router(theaters.router, prefix="/api/v1/theaters", tags=["Theaters"])
app.include_router(screenings.router, prefix="/api/v1/screenings", tags=["Screenings"])
app.include_router(seats.router, prefix="/api/v1/screenings", tags=["Seats"])
app.include_router(seat_holds.router, prefix="/api/v1/seat-holds", tags=["SeatHolds"])
app.include_router(bookings.router, prefix="/api/v1/bookings", tags=["Bookings"])
app.include_router(refunds.router, prefix="/api/v1/bookings", tags=["Refunds"])
app.include_router(receipts.router, prefix="/api/v1/bookings", tags=["Receipts"])
app.include_router(seat_changes.router, prefix="/api/v1/bookings", tags=["SeatChanges"])
app.include_router(guest_bookings.router, prefix="/api/v1/guest-bookings", tags=["GuestBookings"])
app.include_router(audience_types.router, prefix="/api/v1/audience-types", tags=["AudienceTypes"])
app.include_router(genres.router, prefix="/api/v1/genres", tags=["Genres"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

# 3단계 & 4단계
app.include_router(favorites.router, prefix="/api/v1/favorites", tags=["Favorites"])
app.include_router(reviews.router, prefix="/api/v1/movies", tags=["Reviews"])
app.include_router(coupons.router, prefix="/api/v1/coupons", tags=["Coupons"])
app.include_router(points.router, prefix="/api/v1/points", tags=["Points"])
app.include_router(menus.router, prefix="/api/v1/menus", tags=["Menus"])
app.include_router(memberships.router, prefix="/api/v1/memberships", tags=["Memberships"])
app.include_router(notification_settings.router, prefix="/api/v1/notification-settings", tags=["NotificationSettings"])
app.include_router(user_activities.router, prefix="/api/v1/activities", tags=["UserActivities"])
app.include_router(codes.router, prefix="/api/v1/codes", tags=["CodeTables"])


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "version": "3.0.0"}
