from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime

from app.core.database import get_db
from app.models import Screening, Seat, SeatHold, BookingSeat, Booking
from app.schemas import ScreeningSeatsResponse, SeatInfo

router = APIRouter()


@router.get("/{screening_id}/seats", response_model=ScreeningSeatsResponse)
async def get_screening_seats(screening_id: str, db: AsyncSession = Depends(get_db)):
    """상영 화면의 좌석 상태 조회"""
    screening_uuid = UUID(screening_id)

    # Screening 확인
    result = await db.execute(select(Screening).where(Screening.id == screening_uuid))
    screening = result.scalars().first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    # 해당 상영관의 좌석들
    result = await db.execute(select(Seat).where(Seat.hall_id == screening.hall_id))
    seats = result.scalars().all()

    # 점유된 좌석들 (만료되지 않은)
    result = await db.execute(
        select(SeatHold.seat_id).where(
            (SeatHold.screening_id == screening_uuid) &
            (SeatHold.expires_at > datetime.utcnow())
        )
    )
    held_seat_ids = set(row[0] for row in result.all())

    # 예매된 좌석들 (CONFIRMED 상태인 예매)
    result = await db.execute(
        select(BookingSeat.seat_id)
        .join(Booking, BookingSeat.booking_id == Booking.id)
        .where(
            (Booking.screening_id == screening_uuid) &
            (Booking.status == "CONFIRMED")
        )
    )
    booked_seat_ids = set(row[0] for row in result.all())

    seat_infos = [
        SeatInfo(
            id=seat.id,
            row=seat.row,
            number=seat.number,
            seat_grade=seat.seat_grade,
            is_held=seat.id in held_seat_ids,
            is_booked=seat.id in booked_seat_ids,
        )
        for seat in seats
    ]

    return ScreeningSeatsResponse(screening_id=screening_uuid, seats=seat_infos)
