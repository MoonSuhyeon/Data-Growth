from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import uuid4
from datetime import datetime, timedelta
import uuid

from app.core.database import get_db
from app.models import (
    User, Booking, BookingRoom, StayVoucher, Payment,
    Room, StayDate, RoomType, RoomHold, RatePlan, GuestType,
)
from app.schemas import (
    GuestBookingRequest, GuestLookupRequest,
    CreateBookingResponse, GuestBookingDetailResponse, StayVoucherInfo,
)

router = APIRouter()


@router.post("", response_model=CreateBookingResponse)
async def create_guest_booking(
    request: GuestBookingRequest,
    db: AsyncSession = Depends(get_db),
):
    """비회원 예약"""
    now = datetime.utcnow()
    room_ids = list(dict.fromkeys(request.room_ids))

    # StayDate 확인
    result = await db.execute(select(StayDate).where(StayDate.id == request.stay_date_id))
    stay_date = result.scalars().first()
    if not stay_date:
        raise HTTPException(status_code=404, detail="StayDate not found")

    # 현재 hold된 객실과 충돌 체크
    result = await db.execute(
        select(RoomHold).where(
            (RoomHold.stay_date_id == request.stay_date_id) &
            (RoomHold.room_id.in_(room_ids)) &
            (RoomHold.expires_at > now)
        )
    )
    if result.scalars().all():
        raise HTTPException(status_code=409, detail="이미 선택 중인 객실이 있습니다")

    # 이미 예약된 객실 체크
    result = await db.execute(
        select(BookingRoom)
        .join(Booking, BookingRoom.booking_id == Booking.id)
        .where(
            (Booking.stay_date_id == request.stay_date_id) &
            (BookingRoom.room_id.in_(room_ids)) &
            (Booking.status == "CONFIRMED")
        )
    )
    if result.scalars().all():
        raise HTTPException(status_code=409, detail="이미 예약된 객실이 있습니다")

    # 게스트 User 생성
    guest_user = User(
        id=uuid4(),
        name=request.name,
        phone=request.phone,
        is_guest=True,
        guest_expires_at=now + timedelta(days=30),
        role="USER",
    )
    db.add(guest_user)
    await db.flush()

    # 객실 정보 조회
    result = await db.execute(select(Room).where(Room.id.in_(room_ids)))
    rooms = result.scalars().all()
    room_map = {s.id: s for s in rooms}

    # 가격 정책 계산
    dow = stay_date.check_in.weekday()
    day_type = "WEEKEND" if dow >= 5 else "WEEKDAY"
    hour = stay_date.check_in.hour
    if hour < 12:
        season = "OFF"
    elif hour < 17:
        season = "SHOULDER"
    elif hour < 22:
        season = "PEAK"
    else:
        season = "HOLIDAY"

    result = await db.execute(
        select(RatePlan).where(
            (RatePlan.day_type == day_type) &
            (RatePlan.season == season)
        )
    )
    policy_map = {p.room_grade: p.price for p in result.scalars().all()}

    base_total = sum(policy_map.get(room_map[sid].room_grade, 0) for sid in room_ids)

    # 투숙객 타입 할인 적용
    discount_total = 0
    if request.guest_breakdown:
        guest_result = await db.execute(
            select(GuestType).where(GuestType.is_active == True)
        )
        guest_map = {at.code: at.discount_amount for at in guest_result.scalars().all()}
        discount_total = sum(
            guest_map.get(code, 0) * count
            for code, count in request.guest_breakdown.items()
        )

    total_price = base_total + discount_total

    # Booking 생성
    booking_number = f"BK-{uuid.uuid4().hex[:8].upper()}"
    booking = Booking(
        id=uuid4(),
        booking_number=booking_number,
        user_id=guest_user.id,
        stay_date_id=request.stay_date_id,
        total_price=total_price,
        status="CONFIRMED",
        booked_at=now,
        guest_breakdown=request.guest_breakdown,
    )
    db.add(booking)
    await db.flush()

    # BookingRoom + StayVoucher 생성
    stay_voucher_infos: list[StayVoucherInfo] = []
    for room_id in room_ids:
        room = room_map[room_id]
        price = policy_map.get(room.room_grade, 0)
        bs = BookingRoom(
            id=uuid4(),
            booking_id=booking.id,
            room_id=room.id,
            price=price,
        )
        db.add(bs)
        await db.flush()

        qr = str(uuid4())
        db.add(StayVoucher(
            id=uuid4(),
            booking_room_id=bs.id,
            qr_code=qr,
            status="ISSUED",
            issued_at=now,
        ))
        stay_voucher_infos.append(StayVoucherInfo(
            room_label=f"{room.floor}층 {room.number}호",
            qr_code=qr,
        ))

    # Payment 생성 (mock)
    db.add(Payment(
        id=uuid4(),
        booking_id=booking.id,
        payment_method=request.payment_method,
        amount=total_price,
        status="SUCCESS",
        approval_number=f"AP-{uuid.uuid4().hex[:10].upper()}",
        approved_at=now,
    ))

    await db.commit()

    return CreateBookingResponse(
        booking_number=booking_number,
        total_price=total_price,
        status="CONFIRMED",
        booked_at=booking.booked_at,
        stay_vouchers=stay_voucher_infos,
    )


@router.post("/lookup", response_model=GuestBookingDetailResponse)
async def lookup_guest_booking(
    request: GuestLookupRequest,
    db: AsyncSession = Depends(get_db),
):
    """비회원 예약 조회"""
    result = await db.execute(
        select(Booking)
        .join(User, Booking.user_id == User.id)
        .options(
            selectinload(Booking.user),
            selectinload(Booking.booking_rooms).selectinload(BookingRoom.room),
            selectinload(Booking.booking_rooms).selectinload(BookingRoom.stay_voucher),
            selectinload(Booking.stay_date).selectinload(StayDate.room_type).selectinload(RoomType.property),
            selectinload(Booking.stay_date).selectinload(StayDate.property),
        )
        .where(
            (Booking.booking_number == request.booking_number) &
            (User.phone == request.phone) &
            (User.is_guest == True)
        )
    )
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="예약 내역을 찾을 수 없습니다")

    stay_date = booking.stay_date
    room_type = stay_date.room_type
    property = room_type.property
    property = stay_date.property
    user = booking.user

    rooms = [f"{bs.room.floor}{bs.room.number}" for bs in booking.booking_rooms]
    stay_vouchers = [
        StayVoucherInfo(room_label=f"{bs.room.floor}{bs.room.number}", qr_code=bs.stay_voucher.qr_code)
        for bs in booking.booking_rooms
        if bs.stay_voucher
    ]
    status_str = str(booking.status.value) if hasattr(booking.status, 'value') else str(booking.status)

    return GuestBookingDetailResponse(
        booking_number=booking.booking_number,
        name=user.name,
        phone=user.phone or "",
        property_name=property.name,
        room_type_name=room_type.name,
        check_in=stay_date.check_in,
        rooms=rooms,
        total_price=booking.total_price,
        status=status_str,
        booked_at=booking.booked_at,
        stay_vouchers=stay_vouchers,
    )
