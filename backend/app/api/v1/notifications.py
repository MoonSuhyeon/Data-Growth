from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID

from app.core.database import get_db
from app.models import Notification
from app.schemas import NotificationResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=list[NotificationResponse])
async def get_my_notifications(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
    )
    notifications = result.scalars().all()
    return [
        NotificationResponse(
            id=n.id,
            type=n.type.value if hasattr(n.type, 'value') else str(n.type),
            title=n.title,
            body=n.body,
            is_read=n.is_read,
            created_at=n.created_at,
            related_booking_id=n.related_booking_id,
        )
        for n in notifications
    ]


@router.get("/me/unread-count")
async def get_unread_count(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        return {"count": 0}
    try:
        token = authorization.split(" ")[1]
        user = await get_current_user(token, db)
    except Exception:
        return {"count": 0}

    count = (await db.execute(
        select(func.count(Notification.id))
        .where(Notification.user_id == user.id, Notification.is_read == False)
    )).scalar() or 0
    return {"count": count}


@router.patch("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    result = await db.execute(
        select(Notification).where(Notification.id == UUID(notification_id))
    )
    n = result.scalars().first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    if n.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    n.is_read = True
    await db.commit()
    return {"ok": True}


@router.patch("/me/read-all")
async def mark_all_read(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)

    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user.id, Notification.is_read == False)
    )
    for n in result.scalars().all():
        n.is_read = True
    await db.commit()
    return {"ok": True}
