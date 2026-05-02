from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models import Genre
from app.schemas import GenreResponse

router = APIRouter()


@router.get("", response_model=list[GenreResponse])
async def get_genres(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Genre).order_by(Genre.name))
    return [GenreResponse(id=g.id, name=g.name) for g in result.scalars().all()]
