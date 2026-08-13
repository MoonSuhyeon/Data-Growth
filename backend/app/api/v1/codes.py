from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.core.database import get_db
from app.schemas import CodeTableResponse

router = APIRouter()

VALID_CODE_TABLES = {
    "user_status_codes",
    "user_role_codes",
    "booking_status_codes",
    "payment_status_codes",
    "payment_method_codes",
    "room_status_codes",
    "room_grade_codes",
    "bed_type_codes",
    "coupon_status_codes",
    "coupon_type_codes",
    "property_status_codes",
    "property_type_codes",
    "voucher_status_codes",
    "review_status_codes",
}


@router.get("/{table_name}", response_model=list[CodeTableResponse])
async def get_code_table(table_name: str, db: AsyncSession = Depends(get_db)):
    if table_name not in VALID_CODE_TABLES:
        raise HTTPException(status_code=404, detail="Code table not found")

    result = await db.execute(
        text(f"SELECT code, name, description, display_order, is_active FROM {table_name} WHERE is_active = true ORDER BY display_order")
    )
    rows = result.fetcroom_type()
    return [
        CodeTableResponse(
            code=row.code,
            name=row.name,
            description=row.description,
            display_order=row.display_order,
            is_active=row.is_active,
        )
        for row in rows
    ]
