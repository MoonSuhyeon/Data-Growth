from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Booking, Refund, Notification, Screening, Movie, PointHistory
from app.schemas import RefundRequest, RefundResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.post("/{booking_id}/refund", response_model=RefundResponse)
async def request_refund(
    booking_id: str,
    request: RefundRequest,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.refund))
        .where(Booking.id == UUID(booking_id))
    )
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    status_val = booking.status.value if hasattr(booking.status, 'value') else str(booking.status)
    if status_val != "CONFIRMED":
        raise HTTPException(status_code=400, detail="확정된 예매만 환불할 수 있습니다")
    if booking.refund is not None:
        raise HTTPException(status_code=400, detail="이미 환불 요청된 예매입니다")

    now = datetime.utcnow()
    refund = Refund(
        id=uuid.uuid4(),
        booking_id=booking.id,
        refund_amount=booking.total_price,
        reason=request.reason,
        status="COMPLETED",
        requested_at=now,
        processed_at=now,
    )
    db.add(refund)

    booking.status = "REFUNDED"

    screening_result = await db.execute(
        select(Screening, Movie)
        .join(Movie, Screening.movie_id == Movie.id)
        .where(Screening.id == booking.screening_id)
    )
    row = screening_result.first()
    movie_title = row[1].title if row else "영화"

    notification = Notification(
        id=uuid.uuid4(),
        user_id=user.id,
        type="REFUND_COMPLETED",
        title="환불 완료",
        body=f"{movie_title} 예매가 환불 처리되었습니다. 환불금액: {booking.total_price:,}원",
        is_read=False,
        created_at=now,
        related_booking_id=booking.id,
    )
    db.add(notification)

    # Recover points that were earned on this booking
    EARN_RATE = 0.01
    points_earned = int(booking.total_price * EARN_RATE)
    if points_earned > 0 and not user.is_guest:
        current_balance = user.point_balance or 0
        new_balance = max(0, current_balance - points_earned)
        user.point_balance = new_balance
        db.add(PointHistory(
            id=uuid.uuid4(),
            user_id=user.id,
            type="REFUND",
            amount=-points_earned,
            balance_after=new_balance,
            booking_id=booking.id,
            description=f"{movie_title} 환불로 인한 포인트 회수",
            created_at=now,
        ))

    await db.commit()
    await db.refresh(refund)

    return RefundResponse(
        id=refund.id,
        booking_id=refund.booking_id,
        refund_amount=refund.refund_amount,
        reason=refund.reason,
        status="COMPLETED",
        requested_at=refund.requested_at,
        processed_at=refund.processed_at,
    )
