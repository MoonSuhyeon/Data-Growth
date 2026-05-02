from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Favorite, Movie
from app.schemas import FavoriteResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=list[FavoriteResponse])
async def get_my_favorites(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(Favorite, Movie)
        .join(Movie, Favorite.movie_id == Movie.id)
        .where(Favorite.user_id == user.id)
        .order_by(Favorite.created_at.desc())
    )
    rows = result.all()
    return [
        FavoriteResponse(
            id=f.id,
            movie_id=m.id,
            movie_title=m.title,
            movie_poster_url=m.poster_url,
            created_at=f.created_at,
        )
        for f, m in rows
    ]


@router.post("/{movie_id}", response_model=FavoriteResponse)
async def add_favorite(
    movie_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    movie_uuid = UUID(movie_id)
    movie_result = await db.execute(select(Movie).where(Movie.id == movie_uuid))
    movie = movie_result.scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    existing = await db.execute(
        select(Favorite).where(
            Favorite.user_id == user.id,
            Favorite.movie_id == movie_uuid
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="Already in favorites")

    fav = Favorite(
        id=uuid.uuid4(),
        user_id=user.id,
        movie_id=movie_uuid,
        created_at=datetime.utcnow(),
    )
    db.add(fav)
    await db.commit()
    await db.refresh(fav)

    return FavoriteResponse(
        id=fav.id,
        movie_id=movie.id,
        movie_title=movie.title,
        movie_poster_url=movie.poster_url,
        created_at=fav.created_at,
    )


@router.delete("/{movie_id}", status_code=204)
async def remove_favorite(
    movie_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    movie_uuid = UUID(movie_id)
    result = await db.execute(
        select(Favorite).where(
            Favorite.user_id == user.id,
            Favorite.movie_id == movie_uuid
        )
    )
    fav = result.scalars().first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not in favorites")

    await db.delete(fav)
    await db.commit()


@router.get("/check/{movie_id}")
async def check_favorite(
    movie_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        return {"is_favorite": False}
    try:
        user = await get_current_user(authorization.split(" ")[1], db)
    except Exception:
        return {"is_favorite": False}

    result = await db.execute(
        select(Favorite).where(
            Favorite.user_id == user.id,
            Favorite.movie_id == UUID(movie_id)
        )
    )
    return {"is_favorite": result.scalars().first() is not None}
