from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Booking, Receipt
from app.schemas import ReceiptResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/{booking_id}/receipt", response_model=ReceiptResponse)
async def get_or_create_receipt(
    booking_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.receipt))
        .where(Booking.id == UUID(booking_id))
    )
    booking = result.scalars().first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    status_val = booking.status.value if hasattr(booking.status, 'value') else str(booking.status)
    if status_val not in ("CONFIRMED",):
        raise HTTPException(status_code=400, detail="확정된 예매만 영수증을 발급할 수 있습니다")

    if booking.receipt is not None:
        r = booking.receipt
        return ReceiptResponse(
            id=r.id,
            booking_id=r.booking_id,
            receipt_number=r.receipt_number,
            receipt_type=r.receipt_type.value if hasattr(r.receipt_type, 'value') else str(r.receipt_type),
            issued_at=r.issued_at,
            total_amount=r.total_amount,
            tax_amount=r.tax_amount,
            issuer_name=r.issuer_name,
            issuer_registration_number=r.issuer_registration_number,
        )

    now = datetime.utcnow()
    tax_amount = int(booking.total_price * 0.1)
    receipt_number = f"RC-{uuid.uuid4().hex[:10].upper()}"

    receipt = Receipt(
        id=uuid.uuid4(),
        booking_id=booking.id,
        receipt_number=receipt_number,
        receipt_type="GENERAL",
        issued_at=now,
        total_amount=booking.total_price,
        tax_amount=tax_amount,
        issuer_name="CineSite",
        issuer_registration_number="123-45-67890",
    )
    db.add(receipt)
    await db.commit()
    await db.refresh(receipt)

    return ReceiptResponse(
        id=receipt.id,
        booking_id=receipt.booking_id,
        receipt_number=receipt.receipt_number,
        receipt_type="GENERAL",
        issued_at=receipt.issued_at,
        total_amount=receipt.total_amount,
        tax_amount=receipt.tax_amount,
        issuer_name=receipt.issuer_name,
        issuer_registration_number=receipt.issuer_registration_number,
    )
