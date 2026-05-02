from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Booking, BookingSeat, Seat, SeatHold, Notification, SeatChangeHistory, Screening, Movie
from app.schemas import SeatChangeRequest, SeatChangeResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.post("/{booking_id}/change-seats", response_model=SeatChangeResponse)
async def change_seats(
    booking_id: str,
    request: SeatChangeRequest,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.booking_seats))
        .where(Booking.id == UUID(booking_id))
    )
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    status_val = booking.status.value if hasattr(booking.status, 'value') else str(booking.status)
    if status_val != "CONFIRMED":
        raise HTTPException(status_code=400, detail="확정된 예매만 좌석을 변경할 수 있습니다")

    new_seat_ids = [UUID(str(sid)) for sid in request.new_seat_ids]
    old_seat_ids = [bs.seat_id for bs in booking.booking_seats]

    if len(new_seat_ids) != len(old_seat_ids):
        raise HTTPException(status_code=400, detail="좌석 수는 동일해야 합니다")

    # Check new seats are not already booked (excluding current booking)
    conflict_result = await db.execute(
        select(BookingSeat)
        .join(Booking, BookingSeat.booking_id == Booking.id)
        .where(
            BookingSeat.seat_id.in_(new_seat_ids),
            Booking.screening_id == booking.screening_id,
            Booking.status == "CONFIRMED",
            Booking.id != booking.id,
        )
    )
    conflicts = conflict_result.scalars().all()
    if conflicts:
        raise HTTPException(status_code=409, detail="선택한 좌석 중 이미 예매된 좌석이 있습니다")

    # Check holds by others
    hold_result = await db.execute(
        select(SeatHold).where(
            SeatHold.seat_id.in_(new_seat_ids),
            SeatHold.screening_id == booking.screening_id,
            SeatHold.user_id != user.id,
            SeatHold.expires_at > datetime.utcnow(),
        )
    )
    if hold_result.scalars().first():
        raise HTTPException(status_code=409, detail="선택한 좌석 중 다른 사용자가 점유 중인 좌석이 있습니다")

    # Fetch seat info for pricing
    seat_result = await db.execute(select(Seat).where(Seat.id.in_(new_seat_ids)))
    new_seats = {s.id: s for s in seat_result.scalars().all()}
    if len(new_seats) != len(new_seat_ids):
        raise HTTPException(status_code=400, detail="유효하지 않은 좌석입니다")

    # Preserve per-seat prices (keep same price structure)
    old_bs_map = {bs.seat_id: bs.price for bs in booking.booking_seats}
    old_prices = list(old_bs_map.values())

    now = datetime.utcnow()

    # Delete old booking seats
    for bs in booking.booking_seats:
        await db.delete(bs)
    await db.flush()

    # Create new booking seats (reuse old prices in order)
    for i, seat_id in enumerate(new_seat_ids):
        price = old_prices[i] if i < len(old_prices) else 0
        db.add(BookingSeat(
            id=uuid.uuid4(),
            booking_id=booking.id,
            seat_id=seat_id,
            price=price,
        ))

    # Record history (JSON column stores as list of strings)
    history = SeatChangeHistory(
        id=uuid.uuid4(),
        booking_id=booking.id,
        old_seat_ids=[str(sid) for sid in old_seat_ids],
        new_seat_ids=[str(sid) for sid in new_seat_ids],
        changed_at=now,
        reason=request.reason,
    )
    db.add(history)

    # Get movie title for notification
    screening_result = await db.execute(
        select(Screening, Movie)
        .join(Movie, Screening.movie_id == Movie.id)
        .where(Screening.id == booking.screening_id)
    )
    row = screening_result.first()
    movie_title = row[1].title if row else "영화"

    db.add(Notification(
        id=uuid.uuid4(),
        user_id=user.id,
        type="BOOKING_CONFIRMED",
        title="좌석 변경 완료",
        body=f"{movie_title} 예매의 좌석이 변경되었습니다.",
        is_read=False,
        created_at=now,
        related_booking_id=booking.id,
    ))

    await db.commit()
    await db.refresh(history)

    return SeatChangeResponse(
        id=history.id,
        booking_id=history.booking_id,
        old_seat_ids=[UUID(s) for s in history.old_seat_ids],
        new_seat_ids=[UUID(s) for s in history.new_seat_ids],
        changed_at=history.changed_at,
        reason=history.reason,
    )
