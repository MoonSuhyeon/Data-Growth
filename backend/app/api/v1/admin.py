from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date as DateType
from uuid import UUID
import uuid
import json
from datetime import date, datetime

from app.core.database import get_db
from app.models import User, Property, RoomType, StayDate, Booking, BookingRoom, Refund, PeakDate, BoardType, Amenity, PropertyAmenity, CouponMaster, Review, ReviewStatusCode
from app.schemas import (
    PropertyResponse, PropertyRequest,
    AdminStats, AdminBookingItem,
    RoomTypeInfo, StayDateRequest, AdminStayDateResponse,
    AdminUserResponse, UserRoleRequest,
    AdminRefundResponse,
    PeakDateResponse, PeakDateRequest,
    BoardTypeResponse, BoardTypeRequest,
    AmenityResponse, AmenityRequest,
    CouponMasterResponse, CouponMasterRequest,
    ReviewResponse,
)
from app.api.v1.auth import get_current_user

router = APIRouter()


async def require_admin(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)
    if user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")
    return user


def _enum_val(v):
    return v.value if hasattr(v, 'value') else v


# ==================== Dashboard ====================

@router.get("/stats", response_model=AdminStats)
async def get_stats(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()

    total_users = (await db.execute(
        select(func.count(User.id)).where(User.is_guest == False)
    )).scalar() or 0

    row = (await db.execute(
        select(
            func.count(Booking.id),
            func.coalesce(func.sum(Booking.total_price), 0),
        ).where(
            cast(Booking.booked_at, DateType) == today,
            Booking.status == "CONFIRMED",
        )
    )).one()
    today_bookings = row[0] or 0
    today_revenue = row[1] or 0

    listed_count = (await db.execute(
        select(func.count(Property.id)).where(Property.status == "LISTED")
    )).scalar() or 0

    return AdminStats(
        total_users=total_users,
        today_bookings=today_bookings,
        today_revenue=today_revenue,
        listed_count=listed_count,
    )


@router.get("/bookings/recent", response_model=list[AdminBookingItem])
async def get_recent_bookings(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Booking, User, Property)
        .join(User, Booking.user_id == User.id)
        .join(StayDate, Booking.stay_date_id == StayDate.id)
        .join(Property, StayDate.property_id == Property.id)
        .order_by(Booking.booked_at.desc())
        .limit(10)
    )
    return [
        AdminBookingItem(
            id=b.id,
            booking_number=b.booking_number,
            user_name=u.name,
            property_name=m.name,
            total_price=b.total_price,
            status=_enum_val(b.status),
            booked_at=b.booked_at,
        )
        for b, u, m in result.all()
    ]


# ==================== Users ====================

@router.get("/users", response_model=list[AdminUserResponse])
async def get_users(
    search: str | None = Query(None),
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(User, func.count(Booking.id).label("booking_count"))
        .outerjoin(Booking, Booking.user_id == User.id)
        .where(User.is_guest == False)
        .group_by(User.id)
    )
    if search:
        query = query.where(
            User.name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%")
        )
    result = await db.execute(query.order_by(User.created_at.desc()))
    return [
        AdminUserResponse(
            id=u.id,
            email=u.email,
            name=u.name,
            phone=u.phone,
            role=_enum_val(u.role),
            created_at=u.created_at,
            booking_count=booking_count,
        )
        for u, booking_count in result.all()
    ]


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    request: UserRoleRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == UUID(user_id)))
    target = result.scalars().first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.role = request.role
    await db.commit()
    return {"ok": True}


# ==================== Properties ====================

@router.post("/properties", response_model=PropertyResponse)
async def create_property(
    request: PropertyRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    property = Property(
        id=uuid.uuid4(),
        name=request.name,
        name_en=request.name_en or None,
        description=request.description,
        host_name=request.host_name,
        highlights=json.dumps(request.highlights, ensure_ascii=False),
        max_guests=request.max_guests,
        property_type=request.property_type,
        photo_url=request.photo_url or None,
        listed_at=request.listed_at,
        status=request.status,
        region=request.region,
        address=request.address,
        phone=request.phone,
    )
    db.add(property)
    await db.commit()
    await db.refresh(property)
    return PropertyResponse.model_validate(property, from_attributes=True)


@router.put("/properties/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str,
    request: PropertyRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Property).where(Property.id == UUID(property_id)))
    property = result.scalars().first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    property.name = request.name
    property.name_en = request.name_en or None
    property.description = request.description
    property.host_name = request.host_name
    property.highlights = json.dumps(request.highlights, ensure_ascii=False)
    property.max_guests = request.max_guests
    property.property_type = request.property_type
    property.photo_url = request.photo_url or None
    property.listed_at = request.listed_at
    property.status = request.status
    property.region = request.region
    property.address = request.address
    property.phone = request.phone

    await db.commit()
    await db.refresh(property)
    return PropertyResponse.model_validate(property, from_attributes=True)


@router.delete("/properties/{property_id}")
async def delete_property(
    property_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Property).where(Property.id == UUID(property_id)))
    property = result.scalars().first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    await db.delete(property)
    await db.commit()
    return {"ok": True}


# ==================== RoomTypes ====================

@router.get("/room-types", response_model=list[RoomTypeInfo])
async def get_room_types(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(RoomType, Property)
        .join(Property, RoomType.property_id == Property.id)
        .order_by(Property.name, RoomType.name)
    )
    return [
        RoomTypeInfo(
            id=h.id,
            name=h.name,
            property_id=t.id,
            property_name=t.name,
            total_rooms=h.total_rooms,
        )
        for h, t in result.all()
    ]


# ==================== StayDates ====================

@router.get("/stay-dates", response_model=list[AdminStayDateResponse])
async def get_admin_stay_dates(
    property_id: str | None = Query(None),
    date_str: str | None = Query(None, alias="date"),
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(StayDate, RoomType, Property)
        .join(RoomType, StayDate.room_type_id == RoomType.id)
        .join(Property, StayDate.property_id == Property.id)
    )
    if property_id:
        query = query.where(StayDate.property_id == UUID(property_id))
    if date_str:
        query = query.where(cast(StayDate.stay_date, DateType) == date_str)
    else:
        # 필터 없을 때 오늘 이후 숙박만, 최대 300건
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        query = query.where(StayDate.stay_date >= today)

    result = await db.execute(
        query.order_by(StayDate.stay_date.asc(), StayDate.check_in).limit(300)
    )
    return [
        AdminStayDateResponse(
            id=s.id,
            property_id=s.property_id,
            property_name=m.name,
            room_type_id=s.room_type_id,
            room_type_name=h.name,
            total_rooms=h.total_rooms,
            check_in=s.check_in,
            check_out=s.check_out,
            stay_date=s.stay_date,
        )
        for s, h, m in result.all()
    ]


@router.post("/stay-dates", response_model=AdminStayDateResponse)
async def create_stay_date(
    request: StayDateRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    room_type_row = (await db.execute(
        select(RoomType, Property)
        .join(Property, RoomType.property_id == Property.id)
        .where(RoomType.id == request.room_type_id)
    )).first()
    if not room_type_row:
        raise HTTPException(status_code=404, detail="RoomType not found")
    room_type, property = room_type_row

    # 숙소가 하나로 합쳐진 뒤로 객실타입의 숙소가 곧 숙박일의 숙소다.
    # 두 번 조회하는 대신 어긋난 요청을 거절한다.
    if request.property_id != property.id:
        raise HTTPException(status_code=400, detail="room_type does not belong to property")

    stay_date = StayDate(
        id=uuid.uuid4(),
        property_id=request.property_id,
        room_type_id=request.room_type_id,
        check_in=request.check_in,
        check_out=request.check_out,
        stay_date=request.stay_date,
    )
    db.add(stay_date)
    await db.commit()
    await db.refresh(stay_date)

    return AdminStayDateResponse(
        id=stay_date.id,
        property_id=stay_date.property_id,
        property_name=property.name,
        room_type_id=stay_date.room_type_id,
        room_type_name=room_type.name,
        total_rooms=room_type.total_rooms,
        check_in=stay_date.check_in,
        check_out=stay_date.check_out,
        stay_date=stay_date.stay_date,
    )


@router.put("/stay-dates/{stay_date_id}", response_model=AdminStayDateResponse)
async def update_stay_date(
    stay_date_id: str,
    request: StayDateRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    stay_date = (await db.execute(
        select(StayDate).where(StayDate.id == UUID(stay_date_id))
    )).scalars().first()
    if not stay_date:
        raise HTTPException(status_code=404, detail="StayDate not found")

    room_type_row = (await db.execute(
        select(RoomType, Property)
        .join(Property, RoomType.property_id == Property.id)
        .where(RoomType.id == request.room_type_id)
    )).first()
    if not room_type_row:
        raise HTTPException(status_code=404, detail="RoomType not found")
    room_type, property = room_type_row

    # 숙소가 하나로 합쳐진 뒤로 객실타입의 숙소가 곧 숙박일의 숙소다.
    # 두 번 조회하는 대신 어긋난 요청을 거절한다.
    if request.property_id != property.id:
        raise HTTPException(status_code=400, detail="room_type does not belong to property")

    stay_date.property_id = request.property_id
    stay_date.room_type_id = request.room_type_id
    stay_date.check_in = request.check_in
    stay_date.check_out = request.check_out
    stay_date.stay_date = request.stay_date

    await db.commit()
    await db.refresh(stay_date)

    return AdminStayDateResponse(
        id=stay_date.id,
        property_id=stay_date.property_id,
        property_name=property.name,
        room_type_id=stay_date.room_type_id,
        room_type_name=room_type.name,
        total_rooms=room_type.total_rooms,
        check_in=stay_date.check_in,
        check_out=stay_date.check_out,
        stay_date=stay_date.stay_date,
    )


@router.delete("/stay-dates/{stay_date_id}")
async def delete_stay_date(
    stay_date_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    stay_date = (await db.execute(
        select(StayDate).where(StayDate.id == UUID(stay_date_id))
    )).scalars().first()
    if not stay_date:
        raise HTTPException(status_code=404, detail="StayDate not found")
    await db.delete(stay_date)
    await db.commit()
    return {"ok": True}


# ==================== Refunds ====================

@router.get("/refunds", response_model=list[AdminRefundResponse])
async def get_all_refunds(
    status: str | None = Query(None),
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Refund, Booking, User, Property)
        .join(Booking, Refund.booking_id == Booking.id)
        .join(User, Booking.user_id == User.id)
        .join(StayDate, Booking.stay_date_id == StayDate.id)
        .join(Property, StayDate.property_id == Property.id)
    )
    if status:
        query = query.where(Refund.status == status)
    result = await db.execute(query.order_by(Refund.requested_at.desc()))
    return [
        AdminRefundResponse(
            id=r.id,
            booking_id=r.booking_id,
            booking_number=b.booking_number,
            user_name=u.name,
            property_name=m.name,
            refund_amount=r.refund_amount,
            reason=r.reason,
            status=_enum_val(r.status),
            requested_at=r.requested_at,
            processed_at=r.processed_at,
        )
        for r, b, u, m in result.all()
    ]


# ==================== Special Pricing Days ====================

@router.get("/peak-dates", response_model=list[PeakDateResponse])
async def get_peak_dates(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(PeakDate).order_by(PeakDate.date.asc()))
    return [
        PeakDateResponse(
            id=spd.id, date=spd.date, name=spd.name,
            extra_charge=spd.extra_charge, description=spd.description
        )
        for spd in result.scalars().all()
    ]


@router.post("/peak-dates", response_model=PeakDateResponse)
async def create_special_pricing_day(
    request: PeakDateRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    spd = PeakDate(
        id=uuid.uuid4(),
        date=request.date,
        name=request.name,
        extra_charge=request.extra_charge,
        description=request.description,
    )
    db.add(spd)
    await db.commit()
    await db.refresh(spd)
    return PeakDateResponse(
        id=spd.id, date=spd.date, name=spd.name,
        extra_charge=spd.extra_charge, description=spd.description
    )


@router.put("/peak-dates/{spd_id}", response_model=PeakDateResponse)
async def update_special_pricing_day(
    spd_id: str,
    request: PeakDateRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(PeakDate).where(PeakDate.id == UUID(spd_id)))
    spd = result.scalars().first()
    if not spd:
        raise HTTPException(status_code=404, detail="Not found")
    spd.date = request.date
    spd.name = request.name
    spd.extra_charge = request.extra_charge
    spd.description = request.description
    await db.commit()
    await db.refresh(spd)
    return PeakDateResponse(
        id=spd.id, date=spd.date, name=spd.name,
        extra_charge=spd.extra_charge, description=spd.description
    )


@router.delete("/peak-dates/{spd_id}")
async def delete_special_pricing_day(
    spd_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(PeakDate).where(PeakDate.id == UUID(spd_id)))
    spd = result.scalars().first()
    if not spd:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(spd)
    await db.commit()
    return {"ok": True}


# ==================== StayDate Formats ====================

@router.get("/board-types", response_model=list[BoardTypeResponse])
async def get_board_types(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(BoardType).order_by(BoardType.code))
    return [
        BoardTypeResponse(
            id=f.id, code=f.code, name=f.name,
            extra_charge=f.extra_charge, description=f.description
        )
        for f in result.scalars().all()
    ]


@router.post("/board-types", response_model=BoardTypeResponse)
async def create_board_type(
    request: BoardTypeRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    fmt = BoardType(
        id=uuid.uuid4(),
        code=request.code,
        name=request.name,
        extra_charge=request.extra_charge,
        description=request.description,
    )
    db.add(fmt)
    await db.commit()
    await db.refresh(fmt)
    return BoardTypeResponse(
        id=fmt.id, code=fmt.code, name=fmt.name,
        extra_charge=fmt.extra_charge, description=fmt.description
    )


@router.put("/board-types/{fmt_id}", response_model=BoardTypeResponse)
async def update_board_type(
    fmt_id: str,
    request: BoardTypeRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(BoardType).where(BoardType.id == UUID(fmt_id)))
    fmt = result.scalars().first()
    if not fmt:
        raise HTTPException(status_code=404, detail="Not found")
    fmt.code = request.code
    fmt.name = request.name
    fmt.extra_charge = request.extra_charge
    fmt.description = request.description
    await db.commit()
    await db.refresh(fmt)
    return BoardTypeResponse(
        id=fmt.id, code=fmt.code, name=fmt.name,
        extra_charge=fmt.extra_charge, description=fmt.description
    )


@router.delete("/board-types/{fmt_id}")
async def delete_board_type(
    fmt_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(BoardType).where(BoardType.id == UUID(fmt_id)))
    fmt = result.scalars().first()
    if not fmt:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(fmt)
    await db.commit()
    return {"ok": True}


# ==================== Amenitys ====================

@router.get("/amenities", response_model=list[AmenityResponse])
async def get_amenities_admin(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Amenity).order_by(Amenity.name))
    return [AmenityResponse(id=g.id, name=g.name) for g in result.scalars().all()]


@router.post("/amenities", response_model=AmenityResponse)
async def create_amenity(
    request: AmenityRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    g = Amenity(id=uuid.uuid4(), name=request.name)
    db.add(g)
    await db.commit()
    await db.refresh(g)
    return AmenityResponse(id=g.id, name=g.name)


@router.delete("/amenities/{amenity_id}")
async def delete_amenity(
    amenity_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Amenity).where(Amenity.id == UUID(amenity_id)))
    g = result.scalars().first()
    if not g:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(g)
    await db.commit()
    return {"ok": True}


# ==================== Coupon Management ====================

@router.get("/coupons", response_model=list[CouponMasterResponse])
async def list_coupons(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CouponMaster).order_by(CouponMaster.created_at.desc())
    )
    return [
        CouponMasterResponse(
            id=c.id, code=c.code, name=c.name, type_code=c.type_code,
            discount_value=c.discount_value, min_booking_amount=c.min_booking_amount,
            max_discount_amount=c.max_discount_amount, valid_from=c.valid_from,
            valid_to=c.valid_to, max_issues=c.max_issues, issued_count=c.issued_count,
            is_active=c.is_active,
        )
        for c in result.scalars().all()
    ]


@router.post("/coupons", response_model=CouponMasterResponse)
async def create_coupon(
    request: CouponMasterRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.execute(select(CouponMaster).where(CouponMaster.code == request.code))
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="Coupon code already exists")

    c = CouponMaster(
        id=uuid.uuid4(),
        code=request.code,
        name=request.name,
        type_code=request.type_code,
        discount_value=request.discount_value,
        min_booking_amount=request.min_booking_amount,
        max_discount_amount=request.max_discount_amount,
        valid_from=request.valid_from,
        valid_to=request.valid_to,
        max_issues=request.max_issues,
        issued_count=0,
        is_active=True,
        created_at=datetime.utcnow(),
    )
    db.add(c)
    await db.commit()
    await db.refresh(c)
    return CouponMasterResponse(
        id=c.id, code=c.code, name=c.name, type_code=c.type_code,
        discount_value=c.discount_value, min_booking_amount=c.min_booking_amount,
        max_discount_amount=c.max_discount_amount, valid_from=c.valid_from,
        valid_to=c.valid_to, max_issues=c.max_issues, issued_count=c.issued_count,
        is_active=c.is_active,
    )


@router.patch("/coupons/{coupon_id}/toggle")
async def toggle_coupon(
    coupon_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(CouponMaster).where(CouponMaster.id == UUID(coupon_id)))
    c = result.scalars().first()
    if not c:
        raise HTTPException(status_code=404, detail="Not found")
    c.is_active = not c.is_active
    await db.commit()
    return {"is_active": c.is_active}


# ==================== Review Management ====================

@router.get("/reviews", response_model=list[ReviewResponse])
async def list_reviews(
    status: str | None = Query(None),
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(Review)
    if status:
        query = query.where(Review.status_code == status)
    query = query.order_by(Review.created_at.desc()).limit(200)
    result = await db.execute(query)
    reviews = result.scalars().all()

    user_ids = list({r.user_id for r in reviews})
    user_result = await db.execute(select(User).where(User.id.in_(user_ids)))
    user_map = {u.id: u.name for u in user_result.scalars().all()}

    return [
        ReviewResponse(
            id=r.id, user_id=r.user_id,
            user_name=user_map.get(r.user_id, "알 수 없음"),
            property_id=r.property_id, rating=r.rating, content=r.content,
            status_code=r.status_code,
            helpful_count=r.helpful_count, created_at=r.created_at, updated_at=r.updated_at,
        )
        for r in reviews
    ]


@router.patch("/reviews/{review_id}/status")
async def update_review_status(
    review_id: str,
    status_code: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Review).where(Review.id == UUID(review_id)))
    r = result.scalars().first()
    if not r:
        raise HTTPException(status_code=404, detail="Not found")
    r.status_code = status_code
    await db.commit()
    return {"status_code": status_code}
