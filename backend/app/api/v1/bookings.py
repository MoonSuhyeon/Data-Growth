from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import (
    Booking, Payment, StayVoucher, BookingRoom, Room, RoomHold,
    StayDate, RatePlan, GuestType, Property, RoomType, Property,
    Notification, BoardType, PeakDate, Refund, Receipt,
    UserCoupon, CouponMaster, CouponUsage, PointHistory, User,
    BookingAddOn, AddOnItem, AddOnOption,
)
from app.schemas import (
    BookingRequest, CreateBookingResponse, StayVoucherInfo,
    DetailedBookingResponse, RefundResponse, ReceiptResponse,
)
from app.api.v1.auth import get_current_user

router = APIRouter()


def _enum_str(v) -> str:
    return v.value if hasattr(v, 'value') else str(v)


@router.get("/me", response_model=list[DetailedBookingResponse])
async def get_my_bookings(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    result = await db.execute(
        select(Booking)
        .options(
            selectinload(Booking.booking_rooms).selectinload(BookingRoom.room),
            selectinload(Booking.refund),
            selectinload(Booking.receipt),
        )
        .where(Booking.user_id == user.id)
        .order_by(Booking.booked_at.desc())
    )
    bookings = result.scalars().all()

    if not bookings:
        return []

    stay_date_ids = list({b.stay_date_id for b in bookings})
    scr_result = await db.execute(
        select(StayDate, RoomType, Property)
        .join(RoomType, StayDate.room_type_id == RoomType.id)
        .join(Property, StayDate.property_id == Property.id)
        .where(StayDate.id.in_(stay_date_ids))
    )
    scr_map = {row[0].id: row for row in scr_result.all()}

    board_type_ids = list({row[0].board_type_id for row in scr_map.values() if row[0].board_type_id})
    fmt_map: dict = {}
    if board_type_ids:
        fmt_result = await db.execute(select(BoardType).where(BoardType.id.in_(board_type_ids)))
        fmt_map = {f.id: f for f in fmt_result.scalars().all()}

    responses = []
    for b in bookings:
        row = scr_map.get(b.stay_date_id)
        if not row:
            continue
        s, h, t, m = row
        fmt = fmt_map.get(s.board_type_id) if s.board_type_id else None

        rooms = []
        for bs in b.booking_rooms:
            room = bs.room
            if room:
                rooms.append(f"{room.floor}층 {room.number}호")

        refund_resp = None
        if b.refund:
            r = b.refund
            refund_resp = RefundResponse(
                id=r.id,
                booking_id=r.booking_id,
                refund_amount=r.refund_amount,
                reason=r.reason,
                status=_enum_str(r.status),
                requested_at=r.requested_at,
                processed_at=r.processed_at,
            )

        receipt_resp = None
        if b.receipt:
            rc = b.receipt
            receipt_resp = ReceiptResponse(
                id=rc.id,
                booking_id=rc.booking_id,
                receipt_number=rc.receipt_number,
                receipt_type=_enum_str(rc.receipt_type),
                issued_at=rc.issued_at,
                total_amount=rc.total_amount,
                tax_amount=rc.tax_amount,
                issuer_name=rc.issuer_name,
                issuer_registration_number=rc.issuer_registration_number,
            )

        responses.append(DetailedBookingResponse(
            id=b.id,
            booking_number=b.booking_number,
            total_price=b.total_price,
            status=_enum_str(b.status),
            booked_at=b.booked_at,
            property_name=m.name,
            property_photo_url=m.photo_url,
            room_type_name=h.name,
            check_in=s.check_in,
            check_out=s.check_out,
            stay_date=s.stay_date,
            board_type_name=fmt.name if fmt else None,
            rooms=rooms,
            refund=refund_resp,
            receipt=receipt_resp,
        ))

    return responses


@router.post("", response_model=CreateBookingResponse)
async def create_booking(
    request: BookingRequest,  # type: ignore[override]
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    room_ids = list(dict.fromkeys(request.room_ids))

    result = await db.execute(select(StayDate).where(StayDate.id == request.stay_date_id))
    stay_date = result.scalars().first()
    if not stay_date:
        raise HTTPException(status_code=404, detail="StayDate not found")

    result = await db.execute(
        select(RoomHold).where(
            (RoomHold.stay_date_id == request.stay_date_id) &
            (RoomHold.room_id.in_(room_ids)) &
            (RoomHold.user_id == user.id) &
            (RoomHold.expires_at > datetime.utcnow())
        )
    )
    holds = result.scalars().all()

    if len(holds) != len(room_ids):
        raise HTTPException(status_code=400, detail="객실 점유가 만료되었거나 유효하지 않습니다")

    result = await db.execute(select(Room).where(Room.id.in_(room_ids)))
    rooms = result.scalars().all()

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
    base_total = sum(policy_map.get(room.room_grade, 0) for room in rooms)

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

    # Format extra charge
    format_extra = 0
    if stay_date.board_type_id:
        fmt_result = await db.execute(select(BoardType).where(BoardType.id == stay_date.board_type_id))
        fmt = fmt_result.scalars().first()
        if fmt:
            format_extra = fmt.extra_charge * len(room_ids)

    # Special pricing day surcharge
    special_extra = 0
    from datetime import date as date_type
    stay_date_obj = stay_date.stay_date.date() if isinstance(stay_date.stay_date, datetime) else stay_date.stay_date
    spd_result = await db.execute(select(PeakDate).where(PeakDate.date == stay_date_obj))
    spd = spd_result.scalars().first()
    if spd:
        special_extra = spd.extra_charge * len(room_ids)

    total_price = base_total + discount_total + format_extra + special_extra

    # Earn 1% points
    EARN_RATE = 0.01
    points_earned = int(total_price * EARN_RATE)

    booking_number = f"BK-{uuid.uuid4().hex[:8].upper()}"
    booking = Booking(
        id=uuid.uuid4(),
        booking_number=booking_number,
        user_id=user.id,
        stay_date_id=request.stay_date_id,
        total_price=total_price,
        status="CONFIRMED",
        booked_at=datetime.utcnow(),
        guest_breakdown=request.guest_breakdown,
        coupon_discount=0,
        points_used=0,
    )
    db.add(booking)
    await db.flush()

    room_map = {s.id: s for s in rooms}
    booking_room_records = []
    for room_id in room_ids:
        room = room_map[room_id]
        price = policy_map.get(room.room_grade, 0)
        bs = BookingRoom(
            id=uuid.uuid4(),
            booking_id=booking.id,
            room_id=room.id,
            price=price,
        )
        db.add(bs)
        booking_room_records.append((bs, room))
    await db.flush()

    stay_voucher_infos: list[StayVoucherInfo] = []
    for bs, room in booking_room_records:
        qr = str(uuid.uuid4())
        db.add(StayVoucher(
            id=uuid.uuid4(),
            booking_room_id=bs.id,
            qr_code=qr,
            status="ISSUED",
            issued_at=datetime.utcnow(),
        ))
        stay_voucher_infos.append(StayVoucherInfo(
            room_label=f"{room.floor}층 {room.number}호",
            qr_code=qr,
        ))

    db.add(Payment(
        id=uuid.uuid4(),
        booking_id=booking.id,
        payment_method=request.payment_method,
        amount=total_price,
        status="SUCCESS",
        approval_number=f"AP-{uuid.uuid4().hex[:10].upper()}",
        approved_at=datetime.utcnow(),
    ))

    for hold in holds:
        await db.delete(hold)

    # Fetch property title for notification
    property_result = await db.execute(select(Property).where(Property.id == stay_date.property_id))
    property = property_result.scalars().first()
    property_name = property.name if property else "숙소"
    room_labels = ", ".join(f"{room.floor}층 {room.number}호" for _, room in booking_room_records)

    db.add(Notification(
        id=uuid.uuid4(),
        user_id=user.id,
        type="BOOKING_CONFIRMED",
        title="예약 완료",
        body=f"{property_name} 예약가 완료되었습니다. 객실: {room_labels}",
        is_read=False,
        created_at=datetime.utcnow(),
        related_booking_id=booking.id,
    ))

    # Earn points (1% of total price)
    if points_earned > 0 and not user.is_guest:
        new_balance = (user.point_balance or 0) + points_earned
        user.point_balance = new_balance
        db.add(PointHistory(
            id=uuid.uuid4(),
            user_id=user.id,
            type="EARN",
            amount=points_earned,
            balance_after=new_balance,
            booking_id=booking.id,
            description=f"{property_name} 예약 적립",
            created_at=datetime.utcnow(),
        ))

    # Update property booking stats
    if property:
        property.total_bookings = (property.total_bookings or 0) + len(room_ids)

    await db.commit()

    return CreateBookingResponse(
        booking_number=booking_number,
        total_price=total_price,
        status="CONFIRMED",
        booked_at=booking.booked_at,
        stay_vouchers=stay_voucher_infos,
    )
