from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models import UserActivity
from app.schemas import UserActivityResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=list[UserActivityResponse])
async def get_my_activities(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(UserActivity)
        .where(UserActivity.user_id == user.id)
        .order_by(UserActivity.created_at.desc())
        .limit(100)
    )
    return [
        UserActivityResponse(
            id=a.id,
            type=a.type,
            description=a.description,
            ip_address=a.ip_address,
            created_at=a.created_at,
        )
        for a in result.scalars().all()
    ]
