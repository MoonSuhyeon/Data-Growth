from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models import Property
from app.schemas import RegionResponse

router = APIRouter()


@router.get("", response_model=list[RegionResponse])
async def get_regions(db: AsyncSession = Depends(get_db)):
    """지역 목록 조회.

    영화 도메인의 '극장'은 여기서 엔티티가 아니다. 숙박에서는 파는 것과 파는 장소가
    같아서 위치가 숙소의 속성이 됐고, 지역 목록은 테이블이 아니라 집계로 나온다.
    """
    result = await db.execute(
        select(Property.region, func.count(Property.id))
        .where(Property.status != "DELISTED")
        .group_by(Property.region)
        .order_by(func.count(Property.id).desc())
    )
    return [
        RegionResponse(region=region, property_count=count)
        for region, count in result.all()
    ]
