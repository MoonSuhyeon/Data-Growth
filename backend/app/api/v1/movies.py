from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID

from app.core.database import get_db
from app.models import Movie, MovieGenre, Genre, MovieFormat, ScreeningFormat
from app.schemas import MovieResponse, MovieDetailResponse, GenreInfo, FormatInfo

router = APIRouter()


@router.get("", response_model=list[MovieResponse])
async def get_movies(status: str | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Movie)
    if status:
        query = query.where(Movie.status == status)
    result = await db.execute(query)
    movies = result.scalars().all()
    return [MovieResponse.model_validate(m, from_attributes=True) for m in movies]


@router.get("/{movie_id}", response_model=MovieDetailResponse)
async def get_movie(movie_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Movie)
        .options(
            selectinload(Movie.movie_genres).selectinload(MovieGenre.genre),
            selectinload(Movie.movie_formats).selectinload(MovieFormat.format),
        )
        .where(Movie.id == UUID(movie_id))
    )
    movie = result.scalars().first()
    if not movie:
        return None

    genres = [GenreInfo(id=mg.genre.id, name=mg.genre.name) for mg in movie.movie_genres if mg.genre]
    formats = [
        FormatInfo(
            id=mf.format.id, code=mf.format.code, name=mf.format.name,
            extra_charge=mf.format.extra_charge, description=mf.format.description,
        )
        for mf in movie.movie_formats if mf.format
    ]

    base = MovieResponse.model_validate(movie, from_attributes=True)
    return MovieDetailResponse(
        **base.model_dump(),
        genres=genres,
        formats=formats,
    )
