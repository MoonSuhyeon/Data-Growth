from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import NotificationSetting
from app.schemas import NotificationSettingResponse, NotificationSettingRequest
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=NotificationSettingResponse)
async def get_notification_settings(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(NotificationSetting).where(NotificationSetting.user_id == user.id)
    )
    settings = result.scalars().first()
    if not settings:
        settings = NotificationSetting(
            id=uuid.uuid4(),
            user_id=user.id,
            email_enabled=True,
            sms_enabled=True,
            push_enabled=True,
            booking_notification=True,
            refund_notification=True,
            marketing_notification=False,
            updated_at=datetime.utcnow(),
        )
        db.add(settings)
        await db.commit()
        await db.refresh(settings)

    return NotificationSettingResponse(
        id=settings.id,
        email_enabled=settings.email_enabled,
        sms_enabled=settings.sms_enabled,
        push_enabled=settings.push_enabled,
        booking_notification=settings.booking_notification,
        refund_notification=settings.refund_notification,
        marketing_notification=settings.marketing_notification,
        updated_at=settings.updated_at,
    )


@router.put("/me", response_model=NotificationSettingResponse)
async def update_notification_settings(
    request: NotificationSettingRequest,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(NotificationSetting).where(NotificationSetting.user_id == user.id)
    )
    settings = result.scalars().first()
    if not settings:
        settings = NotificationSetting(
            id=uuid.uuid4(),
            user_id=user.id,
        )
        db.add(settings)

    settings.email_enabled = request.email_enabled
    settings.sms_enabled = request.sms_enabled
    settings.push_enabled = request.push_enabled
    settings.booking_notification = request.booking_notification
    settings.refund_notification = request.refund_notification
    settings.marketing_notification = request.marketing_notification
    settings.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(settings)

    return NotificationSettingResponse(
        id=settings.id,
        email_enabled=settings.email_enabled,
        sms_enabled=settings.sms_enabled,
        push_enabled=settings.push_enabled,
        booking_notification=settings.booking_notification,
        refund_notification=settings.refund_notification,
        marketing_notification=settings.marketing_notification,
        updated_at=settings.updated_at,
    )
