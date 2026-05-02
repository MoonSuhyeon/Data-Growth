from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Partner, MembershipProduct, Membership
from app.schemas import PartnerResponse, MembershipProductResponse, MembershipResponse
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/products", response_model=list[MembershipProductResponse])
async def get_membership_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MembershipProduct, Partner)
        .join(Partner, MembershipProduct.partner_id == Partner.id)
        .where(MembershipProduct.is_active == True, Partner.is_active == True)
        .order_by(MembershipProduct.monthly_price)
    )
    return [
        MembershipProductResponse(
            id=mp.id,
            partner_id=mp.partner_id,
            partner_name=p.name,
            name=mp.name,
            discount_type=mp.discount_type,
            discount_value=mp.discount_value,
            monthly_price=mp.monthly_price,
            is_active=mp.is_active,
        )
        for mp, p in result.all()
    ]


@router.get("/me", response_model=list[MembershipResponse])
async def get_my_memberships(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(Membership, MembershipProduct, Partner)
        .join(MembershipProduct, Membership.product_id == MembershipProduct.id)
        .join(Partner, MembershipProduct.partner_id == Partner.id)
        .where(Membership.user_id == user.id, Membership.status == "ACTIVE")
    )
    return [
        MembershipResponse(
            id=m.id,
            product_id=mp.id,
            product_name=mp.name,
            partner_name=p.name,
            discount_type=mp.discount_type,
            discount_value=mp.discount_value,
            status=m.status,
            started_at=m.started_at,
            expires_at=m.expires_at,
        )
        for m, mp, p in result.all()
    ]


@router.post("/{product_id}/subscribe", response_model=MembershipResponse)
async def subscribe(
    product_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    product_uuid = UUID(product_id)
    result = await db.execute(
        select(MembershipProduct, Partner)
        .join(Partner, MembershipProduct.partner_id == Partner.id)
        .where(MembershipProduct.id == product_uuid)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    mp, p = row

    existing = await db.execute(
        select(Membership).where(
            Membership.user_id == user.id,
            Membership.product_id == product_uuid,
            Membership.status == "ACTIVE",
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="이미 구독 중입니다")

    now = datetime.utcnow()
    m = Membership(
        id=uuid.uuid4(),
        user_id=user.id,
        product_id=product_uuid,
        status="ACTIVE",
        started_at=now,
    )
    db.add(m)
    await db.commit()
    await db.refresh(m)

    return MembershipResponse(
        id=m.id,
        product_id=mp.id,
        product_name=mp.name,
        partner_name=p.name,
        discount_type=mp.discount_type,
        discount_value=mp.discount_value,
        status=m.status,
        started_at=m.started_at,
        expires_at=m.expires_at,
    )


@router.delete("/{membership_id}/cancel", status_code=204)
async def cancel_membership(
    membership_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(Membership).where(Membership.id == UUID(membership_id))
    )
    m = result.scalars().first()
    if not m:
        raise HTTPException(status_code=404, detail="Membership not found")
    if m.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    m.status = "CANCELLED"
    m.cancelled_at = datetime.utcnow()
    await db.commit()
