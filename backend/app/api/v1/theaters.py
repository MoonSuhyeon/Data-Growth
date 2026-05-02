from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models import Theater
from app.schemas import TheaterResponse

router = APIRouter()


@router.get("", response_model=list[TheaterResponse])
async def get_theaters(db: AsyncSession = Depends(get_db)):
    """극장 목록 조회"""
    result = await db.execute(select(Theater))
    theaters = result.scalars().all()
    return [TheaterResponse.from_orm(t) for t in theaters]
