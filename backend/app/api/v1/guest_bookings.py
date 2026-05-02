from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import uuid4
from datetime import datetime, timedelta
import uuid

from app.core.database import get_db
from app.models import (
    User, Booking, BookingSeat, Ticket, Payment,
    Seat, Screening, Hall, SeatHold, PricePolicy, AudienceType,
)
from app.schemas import (
    GuestBookingRequest, GuestLookupRequest,
    CreateBookingResponse, GuestBookingDetailResponse, TicketInfo,
)

router = APIRouter()


@router.post("", response_model=CreateBookingResponse)
async def create_guest_booking(
    request: GuestBookingRequest,
    db: AsyncSession = Depends(get_db),
):
    """비회원 예매"""
    now = datetime.utcnow()
    seat_ids = list(dict.fromkeys(request.seat_ids))

    # Screening 확인
    result = await db.execute(select(Screening).where(Screening.id == request.screening_id))
    screening = result.scalars().first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    # 현재 hold된 좌석과 충돌 체크
    result = await db.execute(
        select(SeatHold).where(
            (SeatHold.screening_id == request.screening_id) &
            (SeatHold.seat_id.in_(seat_ids)) &
            (SeatHold.expires_at > now)
        )
    )
    if result.scalars().all():
        raise HTTPException(status_code=409, detail="이미 선택 중인 좌석이 있습니다")

    # 이미 예매된 좌석 체크
    result = await db.execute(
        select(BookingSeat)
        .join(Booking, BookingSeat.booking_id == Booking.id)
        .where(
            (Booking.screening_id == request.screening_id) &
            (BookingSeat.seat_id.in_(seat_ids)) &
            (Booking.status == "CONFIRMED")
        )
    )
    if result.scalars().all():
        raise HTTPException(status_code=409, detail="이미 예매된 좌석이 있습니다")

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

    # 좌석 정보 조회
    result = await db.execute(select(Seat).where(Seat.id.in_(seat_ids)))
    seats = result.scalars().all()
    seat_map = {s.id: s for s in seats}

    # 가격 정책 계산
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

    base_total = sum(policy_map.get(seat_map[sid].seat_grade, 0) for sid in seat_ids)

    # 관람객 타입 할인 적용
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

    total_price = base_total + discount_total

    # Booking 생성
    booking_number = f"BK-{uuid.uuid4().hex[:8].upper()}"
    booking = Booking(
        id=uuid4(),
        booking_number=booking_number,
        user_id=guest_user.id,
        screening_id=request.screening_id,
        total_price=total_price,
        status="CONFIRMED",
        booked_at=now,
        audience_breakdown=request.audience_breakdown,
    )
    db.add(booking)
    await db.flush()

    # BookingSeat + Ticket 생성
    ticket_infos: list[TicketInfo] = []
    for seat_id in seat_ids:
        seat = seat_map[seat_id]
        price = policy_map.get(seat.seat_grade, 0)
        bs = BookingSeat(
            id=uuid4(),
            booking_id=booking.id,
            seat_id=seat.id,
            price=price,
        )
        db.add(bs)
        await db.flush()

        qr = str(uuid4())
        db.add(Ticket(
            id=uuid4(),
            booking_seat_id=bs.id,
            qr_code=qr,
            status="ISSUED",
            issued_at=now,
        ))
        ticket_infos.append(TicketInfo(
            seat_label=f"{seat.row}{seat.number}",
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
        tickets=ticket_infos,
    )


@router.post("/lookup", response_model=GuestBookingDetailResponse)
async def lookup_guest_booking(
    request: GuestLookupRequest,
    db: AsyncSession = Depends(get_db),
):
    """비회원 예매 조회"""
    result = await db.execute(
        select(Booking)
        .join(User, Booking.user_id == User.id)
        .options(
            selectinload(Booking.user),
            selectinload(Booking.booking_seats).selectinload(BookingSeat.seat),
            selectinload(Booking.booking_seats).selectinload(BookingSeat.ticket),
            selectinload(Booking.screening).selectinload(Screening.hall).selectinload(Hall.theater),
            selectinload(Booking.screening).selectinload(Screening.movie),
        )
        .where(
            (Booking.booking_number == request.booking_number) &
            (User.phone == request.phone) &
            (User.is_guest == True)
        )
    )
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="예매 내역을 찾을 수 없습니다")

    screening = booking.screening
    hall = screening.hall
    theater = hall.theater
    movie = screening.movie
    user = booking.user

    seats = [f"{bs.seat.row}{bs.seat.number}" for bs in booking.booking_seats]
    tickets = [
        TicketInfo(seat_label=f"{bs.seat.row}{bs.seat.number}", qr_code=bs.ticket.qr_code)
        for bs in booking.booking_seats
        if bs.ticket
    ]
    status_str = str(booking.status.value) if hasattr(booking.status, 'value') else str(booking.status)

    return GuestBookingDetailResponse(
        booking_number=booking.booking_number,
        name=user.name,
        phone=user.phone or "",
        movie_title=movie.title,
        theater_name=theater.name,
        hall_name=hall.name,
        start_time=screening.start_time,
        seats=seats,
        total_price=booking.total_price,
        status=status_str,
        booked_at=booking.booked_at,
        tickets=tickets,
    )
