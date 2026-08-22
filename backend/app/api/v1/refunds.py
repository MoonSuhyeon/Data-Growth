from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Booking, Refund, Notification, StayDate, Property, PointHistory
from app.schemas import RefundQuoteResponse, RefundRequest, RefundResponse
from app import refund_policy
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/{booking_id}/refund-quote", response_model=RefundQuoteResponse)
async def refund_quote(
    booking_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    """환불하면 얼마인가. **집행하지 않는다.**

    상담 에이전트가 이걸 조회해 고객에게 설명하고, 고객이 승인하면 그때
    `POST /refund` 가 **같은 규칙으로** 다시 계산한다. 두 곳이 같은
    `refund_policy` 를 쓰므로 설명과 집행이 어긋날 수 없다.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    try:
        bid = UUID(booking_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다")

    row = await db.execute(
        select(Booking, StayDate)
        .join(StayDate, Booking.stay_date_id == StayDate.id)
        .options(selectinload(Booking.refund))
        .where(Booking.id == bid)
    )
    found = row.first()
    if not found:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다")
    booking, stay = found
    if booking.user_id != user.id:
        # 남의 예약은 "없다" 로 답한다 — 403 을 주면 그 번호가 존재한다는 사실이
        # 새어 나간다.
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다")

    q = refund_policy.quote(booking.total_price, stay.check_in)
    status_val = booking.status.value if hasattr(booking.status, "value") else str(booking.status)

    # **금액이 0 인 것과 환불할 수 없는 상태는 다르다.** 체크인이 지나 0원인
    # 예약은 여전히 "환불 요청은 가능하지만 돌려받을 돈이 없는" 상태이고,
    # 이미 취소된 예약은 요청 자체가 안 된다.
    blocked = None
    if status_val != "CONFIRMED":
        blocked = f"확정된 예약만 환불할 수 있습니다 (현재 {status_val})"
    elif booking.refund is not None:
        blocked = "이미 환불 요청된 예약입니다"

    return RefundQuoteResponse(
        booking_id=booking.id,
        total_price=q.total_price,
        days_until_check_in=q.days_until_check_in,
        refund_ratio=q.ratio,
        refund_amount=q.amount,
        policy_name=q.policy_name,
        policy_description=q.policy_description,
        refundable=blocked is None,
        reason=blocked,
    )


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
        raise HTTPException(status_code=400, detail="확정된 예약만 환불할 수 있습니다")
    if booking.refund is not None:
        raise HTTPException(status_code=400, detail="이미 환불 요청된 예약입니다")

    # **정책이 금액을 정한다.** 예전에는 `booking.total_price` 였다 — 언제
    # 취소하든 전액이었고, 그래서 상담 에이전트가 "0원 환불" 이라고 설명한 뒤
    # 9만원이 나갔다. 설명과 집행이 같은 규칙을 쓰게 한다.
    #
    # 금액을 요청에서 받지 않는 것도 의도다. 받으면 호출자가 환불액을 정하게
    # 되고, 고객 브라우저도 같은 엔드포인트를 부를 수 있다.
    stay_row = await db.execute(
        select(StayDate).where(StayDate.id == booking.stay_date_id))
    stay = stay_row.scalars().first()
    if stay is None:
        raise HTTPException(status_code=409, detail="숙박일 정보를 찾을 수 없어 환불을 계산할 수 없습니다")
    q = refund_policy.quote(booking.total_price, stay.check_in)

    now = datetime.utcnow()
    refund = Refund(
        id=uuid.uuid4(),
        booking_id=booking.id,
        refund_amount=q.amount,
        reason=request.reason,
        status="COMPLETED",
        requested_at=now,
        processed_at=now,
    )
    db.add(refund)

    booking.status = "REFUNDED"

    stay_date_result = await db.execute(
        select(StayDate, Property)
        .join(Property, StayDate.property_id == Property.id)
        .where(StayDate.id == booking.stay_date_id)
    )
    row = stay_date_result.first()
    property_name = row[1].name if row else "숙소"

    notification = Notification(
        id=uuid.uuid4(),
        user_id=user.id,
        type="REFUND_COMPLETED",
        title="환불 완료",
        # 알림도 **실제 환불액**을 말해야 한다. `total_price` 를 쓰면
        # 정책상 절반만 돌려주는데 알림은 전액이라고 한다.
        body=f"{property_name} 예약이 환불 처리되었습니다. 환불금액: {q.amount:,}원",
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
            description=f"{property_name} 환불로 인한 포인트 회수",
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
