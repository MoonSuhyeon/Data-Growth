from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models import Amenity
from app.schemas import AmenityResponse

router = APIRouter()


@router.get("", response_model=list[AmenityResponse])
async def get_amenities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Amenity).order_by(Amenity.name))
    return [AmenityResponse(id=g.id, name=g.name) for g in result.scalars().all()]
