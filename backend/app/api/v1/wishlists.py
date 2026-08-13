from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Wishlist, Property
from app.schemas import WishlistResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=list[WishlistResponse])
async def get_my_wishlists(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(Wishlist, Property)
        .join(Property, Wishlist.property_id == Property.id)
        .where(Wishlist.user_id == user.id)
        .order_by(Wishlist.created_at.desc())
    )
    rows = result.all()
    return [
        WishlistResponse(
            id=f.id,
            property_id=m.id,
            property_name=m.name,
            property_photo_url=m.photo_url,
            created_at=f.created_at,
        )
        for f, m in rows
    ]


@router.post("/{property_id}", response_model=WishlistResponse)
async def add_wishlist(
    property_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    property_uuid = UUID(property_id)
    property_result = await db.execute(select(Property).where(Property.id == property_uuid))
    property = property_result.scalars().first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    existing = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == user.id,
            Wishlist.property_id == property_uuid
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="Already in wishlists")

    fav = Wishlist(
        id=uuid.uuid4(),
        user_id=user.id,
        property_id=property_uuid,
        created_at=datetime.utcnow(),
    )
    db.add(fav)
    await db.commit()
    await db.refresh(fav)

    return WishlistResponse(
        id=fav.id,
        property_id=property.id,
        property_name=property.name,
        property_photo_url=property.photo_url,
        created_at=fav.created_at,
    )


@router.delete("/{property_id}", status_code=204)
async def remove_wishlist(
    property_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    property_uuid = UUID(property_id)
    result = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == user.id,
            Wishlist.property_id == property_uuid
        )
    )
    fav = result.scalars().first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not in wishlists")

    await db.delete(fav)
    await db.commit()


@router.get("/check/{property_id}")
async def check_wishlist(
    property_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        return {"is_wishlist": False}
    try:
        user = await get_current_user(authorization.split(" ")[1], db)
    except Exception:
        return {"is_wishlist": False}

    result = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == user.id,
            Wishlist.property_id == UUID(property_id)
        )
    )
    return {"is_wishlist": result.scalars().first() is not None}
