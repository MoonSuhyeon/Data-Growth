from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.core.database import get_db
from app.models import PointHistory, User
from app.schemas import PointBalanceResponse, PointHistoryResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=PointBalanceResponse)
async def get_my_points(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(PointHistory)
        .where(PointHistory.user_id == user.id)
        .order_by(PointHistory.created_at.desc())
        .limit(50)
    )
    histories = result.scalars().all()

    return PointBalanceResponse(
        balance=user.point_balance or 0,
        histories=[
            PointHistoryResponse(
                id=h.id,
                type=h.type,
                amount=h.amount,
                balance_after=h.balance_after,
                booking_id=h.booking_id,
                description=h.description,
                created_at=h.created_at,
            )
            for h in histories
        ]
    )
