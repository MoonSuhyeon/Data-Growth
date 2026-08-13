from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from uuid import UUID, uuid4
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.core.security import decode_token
from app.models import User, Room, RoomHold, StayDate
from app.schemas import RoomHoldRequest, RoomHoldResponse

router = APIRouter()


async def get_current_user(authorization: str, db: AsyncSession) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    payload = decode_token(authorization.split(" ")[1])
    if not payload or "email" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    result = await db.execute(select(User).where(User.email == payload["email"]))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("", response_model=RoomHoldResponse)
async def hold_rooms(
    request: RoomHoldRequest,
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(authorization, db)

    now = datetime.utcnow()

    # 만료된 hold 먼저 삭제
    await db.execute(
        delete(RoomHold).where(RoomHold.expires_at <= now)
    )

    # 이미 hold/booked 여부 확인
    result = await db.execute(
        select(RoomHold).where(
            (RoomHold.stay_date_id == request.stay_date_id) &
            (RoomHold.room_id.in_(request.room_ids)) &
            (RoomHold.expires_at > now)
        )
    )
    existing = result.scalars().all()
    if existing:
        raise HTTPException(status_code=409, detail="One or more rooms are already held")

    expires_at = now + timedelta(minutes=10)
    for room_id in request.room_ids:
        db.add(RoomHold(
            id=uuid4(),
            stay_date_id=request.stay_date_id,
            room_id=room_id,
            user_id=user.id,
            expires_at=expires_at,
        ))
    await db.commit()

    # replace(tzinfo=timezone.utc) → Pydantic이 "+00:00" 포함한 ISO 문자열로 직렬화
    # → 브라우저 new Date()가 UTC로 정확히 파싱 (타이머 버그 해결)
    return RoomHoldResponse(
        stay_date_id=request.stay_date_id,
        room_ids=request.room_ids,
        expires_at=expires_at.replace(tzinfo=timezone.utc),
    )


@router.delete("")
async def release_rooms(
    request: RoomHoldRequest,
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    user = await get_current_user(authorization, db)
    await db.execute(
        delete(RoomHold).where(
            (RoomHold.stay_date_id == request.stay_date_id) &
            (RoomHold.room_id.in_(request.room_ids)) &
            (RoomHold.user_id == user.id)
        )
    )
    await db.commit()
    return {"detail": "released"}
