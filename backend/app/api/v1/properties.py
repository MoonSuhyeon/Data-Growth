from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID

from app.core.database import get_db
from app.models import Property, PropertyAmenity, Amenity, PropertyBoardType, BoardType
from app.schemas import PropertyResponse, PropertyDetailResponse, AmenityInfo, BoardTypeInfo

router = APIRouter()


@router.get("", response_model=list[PropertyResponse])
async def get_properties(status: str | None = None, db: AsyncSession = Depends(get_db)):
    query = select(Property)
    if status:
        query = query.where(Property.status == status)
    result = await db.execute(query)
    properties = result.scalars().all()
    return [PropertyResponse.model_validate(m, from_attributes=True) for m in properties]


@router.get("/{property_id}", response_model=PropertyDetailResponse)
async def get_property(property_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Property)
        .options(
            selectinload(Property.property_amenities).selectinload(PropertyAmenity.amenity),
            selectinload(Property.property_board_types).selectinload(PropertyBoardType.format),
        )
        .where(Property.id == UUID(property_id))
    )
    property = result.scalars().first()
    if not property:
        return None

    amenities = [AmenityInfo(id=mg.amenity.id, name=mg.amenity.name) for mg in property.property_amenities if mg.amenity]
    board_types = [
        BoardTypeInfo(
            id=mf.format.id, code=mf.format.code, name=mf.format.name,
            extra_charge=mf.format.extra_charge, description=mf.format.description,
        )
        for mf in property.property_board_types if mf.format
    ]

    base = PropertyResponse.model_validate(property, from_attributes=True)
    return PropertyDetailResponse(
        **base.model_dump(),
        amenities=amenities,
        board_types=board_types,
    )
