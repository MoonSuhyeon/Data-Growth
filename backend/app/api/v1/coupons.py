from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import CouponMaster, UserCoupon
from app.schemas import UserCouponResponse, CouponIssueRequest
from app.api.v1.auth import get_current_user

router = APIRouter()


def _user_coupon_response(uc: UserCoupon, cm: CouponMaster) -> UserCouponResponse:
    return UserCouponResponse(
        id=uc.id,
        coupon_master_id=cm.id,
        coupon_name=cm.name,
        coupon_code=cm.code,
        type_code=cm.type_code,
        discount_value=cm.discount_value,
        min_booking_amount=cm.min_booking_amount,
        status_code=uc.status_code,
        issued_at=uc.issued_at,
        used_at=uc.used_at,
        expires_at=uc.expires_at,
    )


@router.get("/me", response_model=list[UserCouponResponse])
async def get_my_coupons(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(UserCoupon, CouponMaster)
        .join(CouponMaster, UserCoupon.coupon_master_id == CouponMaster.id)
        .where(UserCoupon.user_id == user.id)
        .order_by(UserCoupon.issued_at.desc())
    )
    return [_user_coupon_response(uc, cm) for uc, cm in result.all()]


@router.post("/issue", response_model=UserCouponResponse)
async def issue_coupon(
    request: CouponIssueRequest,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    cm_result = await db.execute(
        select(CouponMaster).where(
            CouponMaster.code == request.coupon_code,
            CouponMaster.is_active == True,
        )
    )
    cm = cm_result.scalars().first()
    if not cm:
        raise HTTPException(status_code=404, detail="유효하지 않은 쿠폰 코드입니다")

    now = datetime.utcnow()
    if now < cm.valid_from or now > cm.valid_to:
        raise HTTPException(status_code=400, detail="쿠폰 유효 기간이 아닙니다")

    if cm.max_issues and cm.issued_count >= cm.max_issues:
        raise HTTPException(status_code=400, detail="쿠폰 발급 수량이 초과되었습니다")

    existing = await db.execute(
        select(UserCoupon).where(
            UserCoupon.user_id == user.id,
            UserCoupon.coupon_master_id == cm.id,
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="이미 발급받은 쿠폰입니다")

    uc = UserCoupon(
        id=uuid.uuid4(),
        user_id=user.id,
        coupon_master_id=cm.id,
        status_code="ACTIVE",
        issued_at=now,
        expires_at=cm.valid_to,
    )
    db.add(uc)
    cm.issued_count += 1
    await db.commit()
    await db.refresh(uc)

    return _user_coupon_response(uc, cm)
