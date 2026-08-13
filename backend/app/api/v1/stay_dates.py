from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, cast
from sqlalchemy.types import Date as DateType
from datetime import datetime, date as date_type
from uuid import UUID

from app.core.database import get_db
from app.models import StayDate, RoomType, BoardType, PeakDate
from app.schemas import StayDateResponse

router = APIRouter()


async def _build_response(s: StayDate, h: RoomType, db: AsyncSession) -> StayDateResponse:
    fmt = None
    if s.board_type_id:
        fmt_result = await db.execute(select(BoardType).where(BoardType.id == s.board_type_id))
        fmt = fmt_result.scalars().first()

    stay_date_obj = s.stay_date.date() if isinstance(s.stay_date, datetime) else s.stay_date
    spd_result = await db.execute(
        select(PeakDate).where(PeakDate.date == stay_date_obj)
    )
    spd = spd_result.scalars().first()

    return StayDateResponse(
        id=s.id,
        property_id=s.property_id,
        room_type_id=s.room_type_id,
        room_type_name=h.name,
        total_rooms=h.total_rooms,
        check_in=s.check_in,
        check_out=s.check_out,
        stay_date=s.stay_date,
        board_type_id=fmt.id if fmt else None,
        board_type_code=fmt.code if fmt else None,
        board_type_name=fmt.name if fmt else None,
        board_type_extra_charge=fmt.extra_charge if fmt else 0,
        peak_day_name=spd.name if spd else None,
        peak_day_extra_charge=spd.extra_charge if spd else 0,
    )


@router.get("", response_model=list[StayDateResponse])
async def get_stay_dates(
    property_id: str | None = Query(None),
    date: str | None = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(StayDate, RoomType).join(RoomType, StayDate.room_type_id == RoomType.id)

    if property_id:
        query = query.where(StayDate.property_id == UUID(property_id))
    if date:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        query = query.where(cast(StayDate.stay_date, DateType) == date_obj)

    query = query.order_by(StayDate.check_in)

    result = await db.execute(query)
    rows = result.all()

    # Batch-load board_types and special pricing days
    board_type_ids = list({s.board_type_id for s, h in rows if s.board_type_id})
    board_types: dict = {}
    if board_type_ids:
        fmt_result = await db.execute(select(BoardType).where(BoardType.id.in_(board_type_ids)))
        board_types = {f.id: f for f in fmt_result.scalars().all()}

    dates = list({
        (s.stay_date.date() if isinstance(s.stay_date, datetime) else s.stay_date)
        for s, h in rows
    })
    spd_map: dict = {}
    if dates:
        spd_result = await db.execute(select(PeakDate).where(PeakDate.date.in_(dates)))
        spd_map = {spd.date: spd for spd in spd_result.scalars().all()}

    responses = []
    for s, h in rows:
        fmt = board_types.get(s.board_type_id) if s.board_type_id else None
        sd = s.stay_date.date() if isinstance(s.stay_date, datetime) else s.stay_date
        spd = spd_map.get(sd)
        responses.append(StayDateResponse(
            id=s.id,
            property_id=s.property_id,
            room_type_id=s.room_type_id,
            room_type_name=h.name,
            total_rooms=h.total_rooms,
            check_in=s.check_in,
            check_out=s.check_out,
            stay_date=s.stay_date,
            board_type_id=fmt.id if fmt else None,
            board_type_code=fmt.code if fmt else None,
            board_type_name=fmt.name if fmt else None,
            board_type_extra_charge=fmt.extra_charge if fmt else 0,
            peak_day_name=spd.name if spd else None,
            peak_day_extra_charge=spd.extra_charge if spd else 0,
        ))
    return responses


@router.get("/{stay_date_id}", response_model=StayDateResponse)
async def get_stay_date(stay_date_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(StayDate, RoomType)
        .join(RoomType, StayDate.room_type_id == RoomType.id)
        .where(StayDate.id == UUID(stay_date_id))
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="StayDate not found")
    s, h = row
    return await _build_response(s, h, db)
