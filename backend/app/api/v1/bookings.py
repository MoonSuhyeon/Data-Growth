from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import (
    Booking, Payment, Ticket, BookingSeat, Seat, SeatHold,
    Screening, PricePolicy, AudienceType, Movie, Hall, Theater,
    Notification, ScreeningFormat, SpecialPricingDay, Refund, Receipt,
    UserCoupon, CouponMaster, CouponUsage, PointHistory, User,
    BookingMenu, MenuItem, MenuOption,
)
from app.schemas import (
    BookingRequest, CreateBookingResponse, TicketInfo,
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
            selectinload(Booking.booking_seats).selectinload(BookingSeat.seat),
            selectinload(Booking.refund),
            selectinload(Booking.receipt),
        )
        .where(Booking.user_id == user.id)
        .order_by(Booking.booked_at.desc())
    )
    bookings = result.scalars().all()

    if not bookings:
        return []

    screening_ids = list({b.screening_id for b in bookings})
    scr_result = await db.execute(
        select(Screening, Hall, Theater, Movie)
        .join(Hall, Screening.hall_id == Hall.id)
        .join(Theater, Hall.theater_id == Theater.id)
        .join(Movie, Screening.movie_id == Movie.id)
        .where(Screening.id.in_(screening_ids))
    )
    scr_map = {row[0].id: row for row in scr_result.all()}

    format_ids = list({row[0].format_id for row in scr_map.values() if row[0].format_id})
    fmt_map: dict = {}
    if format_ids:
        fmt_result = await db.execute(select(ScreeningFormat).where(ScreeningFormat.id.in_(format_ids)))
        fmt_map = {f.id: f for f in fmt_result.scalars().all()}

    responses = []
    for b in bookings:
        row = scr_map.get(b.screening_id)
        if not row:
            continue
        s, h, t, m = row
        fmt = fmt_map.get(s.format_id) if s.format_id else None

        seats = []
        for bs in b.booking_seats:
            seat = bs.seat
            if seat:
                seats.append(f"{seat.row}{seat.number}")

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
            movie_title=m.title,
            movie_poster_url=m.poster_url,
            theater_name=t.name,
            hall_name=h.name,
            start_time=s.start_time,
            end_time=s.end_time,
            screening_date=s.screening_date,
            format_name=fmt.name if fmt else None,
            seats=seats,
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

    seat_ids = list(dict.fromkeys(request.seat_ids))

    result = await db.execute(select(Screening).where(Screening.id == request.screening_id))
    screening = result.scalars().first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    result = await db.execute(
        select(SeatHold).where(
            (SeatHold.screening_id == request.screening_id) &
            (SeatHold.seat_id.in_(seat_ids)) &
            (SeatHold.user_id == user.id) &
            (SeatHold.expires_at > datetime.utcnow())
        )
    )
    holds = result.scalars().all()

    if len(holds) != len(seat_ids):
        raise HTTPException(status_code=400, detail="좌석 점유가 만료되었거나 유효하지 않습니다")

    result = await db.execute(select(Seat).where(Seat.id.in_(seat_ids)))
    seats = result.scalars().all()

    dow = screening.start_time.weekday()
    day_type = "WEEKEND" if dow >= 5 else "WEEKDAY"
    hour = screening.start_time.hour
    if hour < 12:
        time_slot = "MORNING"
    elif hour < 17:
        time_slot = "AFTERNOON"
    elif hour < 22:
        time_slot = "EVENING"
    else:
        time_slot = "NIGHT"

    result = await db.execute(
        select(PricePolicy).where(
            (PricePolicy.day_type == day_type) &
            (PricePolicy.time_slot == time_slot)
        )
    )
    policy_map = {p.seat_grade: p.price for p in result.scalars().all()}
    base_total = sum(policy_map.get(seat.seat_grade, 0) for seat in seats)

    discount_total = 0
    if request.audience_breakdown:
        audience_result = await db.execute(
            select(AudienceType).where(AudienceType.is_active == True)
        )
        audience_map = {at.code: at.discount_amount for at in audience_result.scalars().all()}
        discount_total = sum(
            audience_map.get(code, 0) * count
            for code, count in request.audience_breakdown.items()
        )

    # Format extra charge
    format_extra = 0
    if screening.format_id:
        fmt_result = await db.execute(select(ScreeningFormat).where(ScreeningFormat.id == screening.format_id))
        fmt = fmt_result.scalars().first()
        if fmt:
            format_extra = fmt.extra_charge * len(seat_ids)

    # Special pricing day surcharge
    special_extra = 0
    from datetime import date as date_type
    screening_date_obj = screening.screening_date.date() if isinstance(screening.screening_date, datetime) else screening.screening_date
    spd_result = await db.execute(select(SpecialPricingDay).where(SpecialPricingDay.date == screening_date_obj))
    spd = spd_result.scalars().first()
    if spd:
        special_extra = spd.extra_charge * len(seat_ids)

    total_price = base_total + discount_total + format_extra + special_extra

    # Earn 1% points
    EARN_RATE = 0.01
    points_earned = int(total_price * EARN_RATE)

    booking_number = f"BK-{uuid.uuid4().hex[:8].upper()}"
    booking = Booking(
        id=uuid.uuid4(),
        booking_number=booking_number,
        user_id=user.id,
        screening_id=request.screening_id,
        total_price=total_price,
        status="CONFIRMED",
        booked_at=datetime.utcnow(),
        audience_breakdown=request.audience_breakdown,
        coupon_discount=0,
        points_used=0,
    )
    db.add(booking)
    await db.flush()

    seat_map = {s.id: s for s in seats}
    booking_seat_records = []
    for seat_id in seat_ids:
        seat = seat_map[seat_id]
        price = policy_map.get(seat.seat_grade, 0)
        bs = BookingSeat(
            id=uuid.uuid4(),
            booking_id=booking.id,
            seat_id=seat.id,
            price=price,
        )
        db.add(bs)
        booking_seat_records.append((bs, seat))
    await db.flush()

    ticket_infos: list[TicketInfo] = []
    for bs, seat in booking_seat_records:
        qr = str(uuid.uuid4())
        db.add(Ticket(
            id=uuid.uuid4(),
            booking_seat_id=bs.id,
            qr_code=qr,
            status="ISSUED",
            issued_at=datetime.utcnow(),
        ))
        ticket_infos.append(TicketInfo(
            seat_label=f"{seat.row}{seat.number}",
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

    # Fetch movie title for notification
    movie_result = await db.execute(select(Movie).where(Movie.id == screening.movie_id))
    movie = movie_result.scalars().first()
    movie_title = movie.title if movie else "영화"
    seat_labels = ", ".join(f"{seat.row}{seat.number}" for _, seat in booking_seat_records)

    db.add(Notification(
        id=uuid.uuid4(),
        user_id=user.id,
        type="BOOKING_CONFIRMED",
        title="예매 완료",
        body=f"{movie_title} 예매가 완료되었습니다. 좌석: {seat_labels}",
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
            description=f"{movie_title} 예매 적립",
            created_at=datetime.utcnow(),
        ))

    # Update movie booking stats
    if movie:
        movie.total_bookings = (movie.total_bookings or 0) + len(seat_ids)

    await db.commit()

    return CreateBookingResponse(
        booking_number=booking_number,
        total_price=total_price,
        status="CONFIRMED",
        booked_at=booking.booked_at,
        tickets=ticket_infos,
    )
