from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models import GuestType
from app.schemas import GuestTypeResponse

router = APIRouter()


@router.get("", response_model=list[GuestTypeResponse])
async def list_guest_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(GuestType)
        .where(GuestType.is_active == True)
        .order_by(GuestType.created_at)
    )
    return [GuestTypeResponse.model_validate(at) for at in result.scalars().all()]
