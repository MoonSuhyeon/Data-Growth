from fastapi import APIRouter, Depends, HTTPException
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
    """숙소 상세.

    **없는 숙소는 404 다.** 예전에는 `return None` 이었는데, 응답 모델이
    `PropertyDetailResponse` 로 지정돼 있어서 FastAPI 가 `None` 을 그 모양으로
    직렬화하려다 실패하고 **500** 을 냈다. 화면은 어떤 오류든 "숙소를 찾을 수
    없습니다" 로 그리기 때문에, 서버가 터진 것과 없는 숙소가 구분되지 않았다.
    """
    # 형식이 틀린 ID 도 404 다. `UUID()` 가 던지는 ValueError 를 안 잡으면
    # 주소창에 아무 문자열이나 넣는 것만으로 500 이 난다 — 그건 서버 문제가
    # 아니라 **없는 주소**다.
    try:
        pid = UUID(property_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="숙소를 찾을 수 없습니다")

    result = await db.execute(
        select(Property)
        .options(
            selectinload(Property.property_amenities).selectinload(PropertyAmenity.amenity),
            # 관계 이름은 `board_type` 이다. `format` 은 영화 상영관 시절의
            # 이름이 남은 것이고, 이것 때문에 **상세 조회가 통째로 500** 이었다.
            selectinload(Property.property_board_types).selectinload(PropertyBoardType.board_type),
        )
        .where(Property.id == pid)
    )
    property = result.scalars().first()
    if not property:
        raise HTTPException(status_code=404, detail="숙소를 찾을 수 없습니다")

    amenities = [AmenityInfo(id=mg.amenity.id, name=mg.amenity.name) for mg in property.property_amenities if mg.amenity]
    board_types = [
        BoardTypeInfo(
            id=pb.board_type.id, code=pb.board_type.code, name=pb.board_type.name,
            extra_charge=pb.board_type.extra_charge, description=pb.board_type.description,
        )
        for pb in property.property_board_types if pb.board_type
    ]

    base = PropertyResponse.model_validate(property, from_attributes=True)
    return PropertyDetailResponse(
        **base.model_dump(),
        amenities=amenities,
        board_types=board_types,
    )
