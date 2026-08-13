from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime

from app.core.database import get_db
from app.models import StayDate, Room, RoomHold, BookingRoom, Booking
from app.schemas import StayDateRoomsResponse, RoomInfo

router = APIRouter()


@router.get("/{stay_date_id}/rooms", response_model=StayDateRoomsResponse)
async def get_stay_date_rooms(stay_date_id: str, db: AsyncSession = Depends(get_db)):
    """숙박 화면의 객실 상태 조회"""
    stay_date_uuid = UUID(stay_date_id)

    # StayDate 확인
    result = await db.execute(select(StayDate).where(StayDate.id == stay_date_uuid))
    stay_date = result.scalars().first()
    if not stay_date:
        raise HTTPException(status_code=404, detail="StayDate not found")

    # 해당 객실 타입의 객실들
    result = await db.execute(select(Room).where(Room.room_type_id == stay_date.room_type_id))
    rooms = result.scalars().all()

    # 점유된 객실들 (만료되지 않은)
    result = await db.execute(
        select(RoomHold.room_id).where(
            (RoomHold.stay_date_id == stay_date_uuid) &
            (RoomHold.expires_at > datetime.utcnow())
        )
    )
    held_room_ids = set(row[0] for row in result.all())

    # 예약된 객실들 (CONFIRMED 상태인 예약)
    result = await db.execute(
        select(BookingRoom.room_id)
        .join(Booking, BookingRoom.booking_id == Booking.id)
        .where(
            (Booking.stay_date_id == stay_date_uuid) &
            (Booking.status == "CONFIRMED")
        )
    )
    booked_room_ids = set(row[0] for row in result.all())

    room_infos = [
        RoomInfo(
            id=room.id,
            floor=room.floor,
            number=room.number,
            room_grade=room.room_grade,
            is_held=room.id in held_room_ids,
            is_booked=room.id in booked_room_ids,
        )
        for room in rooms
    ]

    return StayDateRoomsResponse(stay_date_id=stay_date_uuid, rooms=room_infos)
