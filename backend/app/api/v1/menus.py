from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid

from app.core.database import get_db
from app.models import MenuCategory, MenuItem, MenuOption
from app.schemas import MenuCategoryResponse, MenuItemResponse, MenuOptionResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("", response_model=list[MenuCategoryResponse])
async def get_menu(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MenuCategory)
        .options(
            selectinload(MenuCategory.items).selectinload(MenuItem.options)
        )
        .where(MenuCategory.is_active == True)
        .order_by(MenuCategory.display_order)
    )
    categories = result.scalars().all()

    return [
        MenuCategoryResponse(
            id=c.id,
            name=c.name,
            display_order=c.display_order,
            is_active=c.is_active,
            items=[
                MenuItemResponse(
                    id=item.id,
                    category_id=item.category_id,
                    name=item.name,
                    price=item.price,
                    description=item.description,
                    image_url=item.image_url,
                    is_available=item.is_available,
                    display_order=item.display_order,
                    options=[
                        MenuOptionResponse(
                            id=opt.id,
                            name=opt.name,
                            price=opt.price,
                            is_available=opt.is_available,
                        )
                        for opt in item.options if opt.is_available
                    ],
                )
                for item in c.items if item.is_available
            ],
        )
        for c in categories
    ]
