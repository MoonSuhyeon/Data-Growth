from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, cast
from sqlalchemy.types import Date as DateType
from datetime import datetime, date as date_type
from uuid import UUID

from app.core.database import get_db
from app.models import Screening, Hall, ScreeningFormat, SpecialPricingDay
from app.schemas import ScreeningResponse

router = APIRouter()


async def _build_response(s: Screening, h: Hall, db: AsyncSession) -> ScreeningResponse:
    fmt = None
    if s.format_id:
        fmt_result = await db.execute(select(ScreeningFormat).where(ScreeningFormat.id == s.format_id))
        fmt = fmt_result.scalars().first()

    screening_date_obj = s.screening_date.date() if isinstance(s.screening_date, datetime) else s.screening_date
    spd_result = await db.execute(
        select(SpecialPricingDay).where(SpecialPricingDay.date == screening_date_obj)
    )
    spd = spd_result.scalars().first()

    return ScreeningResponse(
        id=s.id,
        movie_id=s.movie_id,
        hall_id=s.hall_id,
        hall_name=h.name,
        theater_id=h.theater_id,
        total_seats=h.total_seats,
        start_time=s.start_time,
        end_time=s.end_time,
        screening_date=s.screening_date,
        format_id=fmt.id if fmt else None,
        format_code=fmt.code if fmt else None,
        format_name=fmt.name if fmt else None,
        format_extra_charge=fmt.extra_charge if fmt else 0,
        special_day_name=spd.name if spd else None,
        special_day_extra_charge=spd.extra_charge if spd else 0,
    )


@router.get("", response_model=list[ScreeningResponse])
async def get_screenings(
    movie_id: str | None = Query(None),
    theater_id: str | None = Query(None),
    date: str | None = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(Screening, Hall).join(Hall, Screening.hall_id == Hall.id)

    if movie_id:
        query = query.where(Screening.movie_id == UUID(movie_id))
    if theater_id:
        query = query.where(Hall.theater_id == UUID(theater_id))
    if date:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        query = query.where(cast(Screening.screening_date, DateType) == date_obj)

    query = query.order_by(Screening.start_time)

    result = await db.execute(query)
    rows = result.all()

    # Batch-load formats and special pricing days
    format_ids = list({s.format_id for s, h in rows if s.format_id})
    formats: dict = {}
    if format_ids:
        fmt_result = await db.execute(select(ScreeningFormat).where(ScreeningFormat.id.in_(format_ids)))
        formats = {f.id: f for f in fmt_result.scalars().all()}

    dates = list({
        (s.screening_date.date() if isinstance(s.screening_date, datetime) else s.screening_date)
        for s, h in rows
    })
    spd_map: dict = {}
    if dates:
        spd_result = await db.execute(select(SpecialPricingDay).where(SpecialPricingDay.date.in_(dates)))
        spd_map = {spd.date: spd for spd in spd_result.scalars().all()}

    responses = []
    for s, h in rows:
        fmt = formats.get(s.format_id) if s.format_id else None
        sd = s.screening_date.date() if isinstance(s.screening_date, datetime) else s.screening_date
        spd = spd_map.get(sd)
        responses.append(ScreeningResponse(
            id=s.id,
            movie_id=s.movie_id,
            hall_id=s.hall_id,
            hall_name=h.name,
            theater_id=h.theater_id,
            total_seats=h.total_seats,
            start_time=s.start_time,
            end_time=s.end_time,
            screening_date=s.screening_date,
            format_id=fmt.id if fmt else None,
            format_code=fmt.code if fmt else None,
            format_name=fmt.name if fmt else None,
            format_extra_charge=fmt.extra_charge if fmt else 0,
            special_day_name=spd.name if spd else None,
            special_day_extra_charge=spd.extra_charge if spd else 0,
        ))
    return responses


@router.get("/{screening_id}", response_model=ScreeningResponse)
async def get_screening(screening_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Screening, Hall)
        .join(Hall, Screening.hall_id == Hall.id)
        .where(Screening.id == UUID(screening_id))
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Screening not found")
    s, h = row
    return await _build_response(s, h, db)
