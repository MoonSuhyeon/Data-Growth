from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models import AudienceType
from app.schemas import AudienceTypeResponse

router = APIRouter()


@router.get("", response_model=list[AudienceTypeResponse])
async def list_audience_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AudienceType)
        .where(AudienceType.is_active == True)
        .order_by(AudienceType.created_at)
    )
    return [AudienceTypeResponse.model_validate(at) for at in result.scalars().all()]
