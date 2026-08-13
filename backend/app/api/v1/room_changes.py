from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Booking, BookingRoom, Room, RoomHold, Notification, RoomChangeHistory, StayDate, Property
from app.schemas import RoomChangeRequest, RoomChangeResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.post("/{booking_id}/change-rooms", response_model=RoomChangeResponse)
async def change_rooms(
    booking_id: str,
    request: RoomChangeRequest,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.booking_rooms))
        .where(Booking.id == UUID(booking_id))
    )
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    status_val = booking.status.value if hasattr(booking.status, 'value') else str(booking.status)
    if status_val != "CONFIRMED":
        raise HTTPException(status_code=400, detail="확정된 예약만 객실을 변경할 수 있습니다")

    new_room_ids = [UUID(str(sid)) for sid in request.new_room_ids]
    old_room_ids = [bs.room_id for bs in booking.booking_rooms]

    if len(new_room_ids) != len(old_room_ids):
        raise HTTPException(status_code=400, detail="객실 수는 동일해야 합니다")

    # Check new rooms are not already booked (excluding current booking)
    conflict_result = await db.execute(
        select(BookingRoom)
        .join(Booking, BookingRoom.booking_id == Booking.id)
        .where(
            BookingRoom.room_id.in_(new_room_ids),
            Booking.stay_date_id == booking.stay_date_id,
            Booking.status == "CONFIRMED",
            Booking.id != booking.id,
        )
    )
    conflicts = conflict_result.scalars().all()
    if conflicts:
        raise HTTPException(status_code=409, detail="선택한 객실 중 이미 예약된 객실이 있습니다")

    # Check holds by others
    hold_result = await db.execute(
        select(RoomHold).where(
            RoomHold.room_id.in_(new_room_ids),
            RoomHold.stay_date_id == booking.stay_date_id,
            RoomHold.user_id != user.id,
            RoomHold.expires_at > datetime.utcnow(),
        )
    )
    if hold_result.scalars().first():
        raise HTTPException(status_code=409, detail="선택한 객실 중 다른 사용자가 점유 중인 객실이 있습니다")

    # Fetch room info for pricing
    room_result = await db.execute(select(Room).where(Room.id.in_(new_room_ids)))
    new_rooms = {s.id: s for s in room_result.scalars().all()}
    if len(new_rooms) != len(new_room_ids):
        raise HTTPException(status_code=400, detail="유효하지 않은 객실입니다")

    # Preserve per-room prices (keep same price structure)
    old_bs_map = {bs.room_id: bs.price for bs in booking.booking_rooms}
    old_prices = list(old_bs_map.values())

    now = datetime.utcnow()

    # Delete old booking rooms
    for bs in booking.booking_rooms:
        await db.delete(bs)
    await db.flush()

    # Create new booking rooms (reuse old prices in order)
    for i, room_id in enumerate(new_room_ids):
        price = old_prices[i] if i < len(old_prices) else 0
        db.add(BookingRoom(
            id=uuid.uuid4(),
            booking_id=booking.id,
            room_id=room_id,
            price=price,
        ))

    # Record history (JSON column stores as list of strings)
    history = RoomChangeHistory(
        id=uuid.uuid4(),
        booking_id=booking.id,
        old_room_ids=[str(sid) for sid in old_room_ids],
        new_room_ids=[str(sid) for sid in new_room_ids],
        changed_at=now,
        reason=request.reason,
    )
    db.add(history)

    # Get property title for notification
    stay_date_result = await db.execute(
        select(StayDate, Property)
        .join(Property, StayDate.property_id == Property.id)
        .where(StayDate.id == booking.stay_date_id)
    )
    row = stay_date_result.first()
    property_name = row[1].name if row else "숙소"

    db.add(Notification(
        id=uuid.uuid4(),
        user_id=user.id,
        type="BOOKING_CONFIRMED",
        title="객실 변경 완료",
        body=f"{property_name} 예약의 객실이 변경되었습니다.",
        is_read=False,
        created_at=now,
        related_booking_id=booking.id,
    ))

    await db.commit()
    await db.refresh(history)

    return RoomChangeResponse(
        id=history.id,
        booking_id=history.booking_id,
        old_room_ids=[UUID(s) for s in history.old_room_ids],
        new_room_ids=[UUID(s) for s in history.new_room_ids],
        changed_at=history.changed_at,
        reason=history.reason,
    )
