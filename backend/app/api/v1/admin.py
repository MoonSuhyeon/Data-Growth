from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date as DateType
from uuid import UUID
import uuid
import json
from datetime import date, datetime

from app.core.database import get_db
from app.models import User, Movie, Hall, Theater, Screening, Booking, BookingSeat, Refund, SpecialPricingDay, ScreeningFormat, Genre, MovieGenre, CouponMaster, Review, ReviewStatusCode
from app.schemas import (
    MovieResponse, MovieRequest,
    AdminStats, AdminBookingItem,
    HallInfo, ScreeningRequest, AdminScreeningResponse,
    AdminUserResponse, UserRoleRequest,
    AdminRefundResponse,
    SpecialPricingDayResponse, SpecialPricingDayRequest,
    ScreeningFormatResponse, ScreeningFormatRequest,
    GenreResponse, GenreRequest,
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

    now_showing_count = (await db.execute(
        select(func.count(Movie.id)).where(Movie.status == "NOW_SHOWING")
    )).scalar() or 0

    return AdminStats(
        total_users=total_users,
        today_bookings=today_bookings,
        today_revenue=today_revenue,
        now_showing_count=now_showing_count,
    )


@router.get("/bookings/recent", response_model=list[AdminBookingItem])
async def get_recent_bookings(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Booking, User, Movie)
        .join(User, Booking.user_id == User.id)
        .join(Screening, Booking.screening_id == Screening.id)
        .join(Movie, Screening.movie_id == Movie.id)
        .order_by(Booking.booked_at.desc())
        .limit(10)
    )
    return [
        AdminBookingItem(
            id=b.id,
            booking_number=b.booking_number,
            user_name=u.name,
            movie_title=m.title,
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


# ==================== Movies ====================

@router.post("/movies", response_model=MovieResponse)
async def create_movie(
    request: MovieRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    movie = Movie(
        id=uuid.uuid4(),
        title=request.title,
        title_en=request.title_en or None,
        synopsis=request.synopsis,
        director=request.director,
        cast=json.dumps(request.cast, ensure_ascii=False),
        runtime=request.runtime,
        rating=request.rating,
        poster_url=request.poster_url or None,
        release_date=request.release_date,
        status=request.status,
    )
    db.add(movie)
    await db.commit()
    await db.refresh(movie)
    return MovieResponse.model_validate(movie, from_attributes=True)


@router.put("/movies/{movie_id}", response_model=MovieResponse)
async def update_movie(
    movie_id: str,
    request: MovieRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Movie).where(Movie.id == UUID(movie_id)))
    movie = result.scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    movie.title = request.title
    movie.title_en = request.title_en or None
    movie.synopsis = request.synopsis
    movie.director = request.director
    movie.cast = json.dumps(request.cast, ensure_ascii=False)
    movie.runtime = request.runtime
    movie.rating = request.rating
    movie.poster_url = request.poster_url or None
    movie.release_date = request.release_date
    movie.status = request.status

    await db.commit()
    await db.refresh(movie)
    return MovieResponse.model_validate(movie, from_attributes=True)


@router.delete("/movies/{movie_id}")
async def delete_movie(
    movie_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Movie).where(Movie.id == UUID(movie_id)))
    movie = result.scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    await db.delete(movie)
    await db.commit()
    return {"ok": True}


# ==================== Halls ====================

@router.get("/halls", response_model=list[HallInfo])
async def get_halls(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Hall, Theater)
        .join(Theater, Hall.theater_id == Theater.id)
        .order_by(Theater.name, Hall.name)
    )
    return [
        HallInfo(
            id=h.id,
            name=h.name,
            theater_id=h.theater_id,
            theater_name=t.name,
            total_seats=h.total_seats,
        )
        for h, t in result.all()
    ]


# ==================== Screenings ====================

@router.get("/screenings", response_model=list[AdminScreeningResponse])
async def get_admin_screenings(
    movie_id: str | None = Query(None),
    theater_id: str | None = Query(None),
    date_str: str | None = Query(None, alias="date"),
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Screening, Hall, Theater, Movie)
        .join(Hall, Screening.hall_id == Hall.id)
        .join(Theater, Hall.theater_id == Theater.id)
        .join(Movie, Screening.movie_id == Movie.id)
    )
    if movie_id:
        query = query.where(Screening.movie_id == UUID(movie_id))
    if theater_id:
        query = query.where(Hall.theater_id == UUID(theater_id))
    if date_str:
        query = query.where(cast(Screening.screening_date, DateType) == date_str)
    else:
        # 필터 없을 때 오늘 이후 상영만, 최대 300건
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        query = query.where(Screening.screening_date >= today)

    result = await db.execute(
        query.order_by(Screening.screening_date.asc(), Screening.start_time).limit(300)
    )
    return [
        AdminScreeningResponse(
            id=s.id,
            movie_id=s.movie_id,
            movie_title=m.title,
            hall_id=s.hall_id,
            hall_name=h.name,
            theater_id=h.theater_id,
            theater_name=t.name,
            total_seats=h.total_seats,
            start_time=s.start_time,
            end_time=s.end_time,
            screening_date=s.screening_date,
        )
        for s, h, t, m in result.all()
    ]


@router.post("/screenings", response_model=AdminScreeningResponse)
async def create_screening(
    request: ScreeningRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    hall_row = (await db.execute(
        select(Hall, Theater)
        .join(Theater, Hall.theater_id == Theater.id)
        .where(Hall.id == request.hall_id)
    )).first()
    if not hall_row:
        raise HTTPException(status_code=404, detail="Hall not found")
    hall, theater = hall_row

    movie = (await db.execute(select(Movie).where(Movie.id == request.movie_id))).scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    screening = Screening(
        id=uuid.uuid4(),
        movie_id=request.movie_id,
        hall_id=request.hall_id,
        start_time=request.start_time,
        end_time=request.end_time,
        screening_date=request.screening_date,
    )
    db.add(screening)
    await db.commit()
    await db.refresh(screening)

    return AdminScreeningResponse(
        id=screening.id,
        movie_id=screening.movie_id,
        movie_title=movie.title,
        hall_id=screening.hall_id,
        hall_name=hall.name,
        theater_id=hall.theater_id,
        theater_name=theater.name,
        total_seats=hall.total_seats,
        start_time=screening.start_time,
        end_time=screening.end_time,
        screening_date=screening.screening_date,
    )


@router.put("/screenings/{screening_id}", response_model=AdminScreeningResponse)
async def update_screening(
    screening_id: str,
    request: ScreeningRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    screening = (await db.execute(
        select(Screening).where(Screening.id == UUID(screening_id))
    )).scalars().first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    hall_row = (await db.execute(
        select(Hall, Theater)
        .join(Theater, Hall.theater_id == Theater.id)
        .where(Hall.id == request.hall_id)
    )).first()
    if not hall_row:
        raise HTTPException(status_code=404, detail="Hall not found")
    hall, theater = hall_row

    movie = (await db.execute(select(Movie).where(Movie.id == request.movie_id))).scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    screening.movie_id = request.movie_id
    screening.hall_id = request.hall_id
    screening.start_time = request.start_time
    screening.end_time = request.end_time
    screening.screening_date = request.screening_date

    await db.commit()
    await db.refresh(screening)

    return AdminScreeningResponse(
        id=screening.id,
        movie_id=screening.movie_id,
        movie_title=movie.title,
        hall_id=screening.hall_id,
        hall_name=hall.name,
        theater_id=hall.theater_id,
        theater_name=theater.name,
        total_seats=hall.total_seats,
        start_time=screening.start_time,
        end_time=screening.end_time,
        screening_date=screening.screening_date,
    )


@router.delete("/screenings/{screening_id}")
async def delete_screening(
    screening_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    screening = (await db.execute(
        select(Screening).where(Screening.id == UUID(screening_id))
    )).scalars().first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")
    await db.delete(screening)
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
        select(Refund, Booking, User, Movie)
        .join(Booking, Refund.booking_id == Booking.id)
        .join(User, Booking.user_id == User.id)
        .join(Screening, Booking.screening_id == Screening.id)
        .join(Movie, Screening.movie_id == Movie.id)
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
            movie_title=m.title,
            refund_amount=r.refund_amount,
            reason=r.reason,
            status=_enum_val(r.status),
            requested_at=r.requested_at,
            processed_at=r.processed_at,
        )
        for r, b, u, m in result.all()
    ]


# ==================== Special Pricing Days ====================

@router.get("/special-pricing-days", response_model=list[SpecialPricingDayResponse])
async def get_special_pricing_days(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(SpecialPricingDay).order_by(SpecialPricingDay.date.asc()))
    return [
        SpecialPricingDayResponse(
            id=spd.id, date=spd.date, name=spd.name,
            extra_charge=spd.extra_charge, description=spd.description
        )
        for spd in result.scalars().all()
    ]


@router.post("/special-pricing-days", response_model=SpecialPricingDayResponse)
async def create_special_pricing_day(
    request: SpecialPricingDayRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    spd = SpecialPricingDay(
        id=uuid.uuid4(),
        date=request.date,
        name=request.name,
        extra_charge=request.extra_charge,
        description=request.description,
    )
    db.add(spd)
    await db.commit()
    await db.refresh(spd)
    return SpecialPricingDayResponse(
        id=spd.id, date=spd.date, name=spd.name,
        extra_charge=spd.extra_charge, description=spd.description
    )


@router.put("/special-pricing-days/{spd_id}", response_model=SpecialPricingDayResponse)
async def update_special_pricing_day(
    spd_id: str,
    request: SpecialPricingDayRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(SpecialPricingDay).where(SpecialPricingDay.id == UUID(spd_id)))
    spd = result.scalars().first()
    if not spd:
        raise HTTPException(status_code=404, detail="Not found")
    spd.date = request.date
    spd.name = request.name
    spd.extra_charge = request.extra_charge
    spd.description = request.description
    await db.commit()
    await db.refresh(spd)
    return SpecialPricingDayResponse(
        id=spd.id, date=spd.date, name=spd.name,
        extra_charge=spd.extra_charge, description=spd.description
    )


@router.delete("/special-pricing-days/{spd_id}")
async def delete_special_pricing_day(
    spd_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(SpecialPricingDay).where(SpecialPricingDay.id == UUID(spd_id)))
    spd = result.scalars().first()
    if not spd:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(spd)
    await db.commit()
    return {"ok": True}


# ==================== Screening Formats ====================

@router.get("/screening-formats", response_model=list[ScreeningFormatResponse])
async def get_screening_formats(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ScreeningFormat).order_by(ScreeningFormat.code))
    return [
        ScreeningFormatResponse(
            id=f.id, code=f.code, name=f.name,
            extra_charge=f.extra_charge, description=f.description
        )
        for f in result.scalars().all()
    ]


@router.post("/screening-formats", response_model=ScreeningFormatResponse)
async def create_screening_format(
    request: ScreeningFormatRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    fmt = ScreeningFormat(
        id=uuid.uuid4(),
        code=request.code,
        name=request.name,
        extra_charge=request.extra_charge,
        description=request.description,
    )
    db.add(fmt)
    await db.commit()
    await db.refresh(fmt)
    return ScreeningFormatResponse(
        id=fmt.id, code=fmt.code, name=fmt.name,
        extra_charge=fmt.extra_charge, description=fmt.description
    )


@router.put("/screening-formats/{fmt_id}", response_model=ScreeningFormatResponse)
async def update_screening_format(
    fmt_id: str,
    request: ScreeningFormatRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ScreeningFormat).where(ScreeningFormat.id == UUID(fmt_id)))
    fmt = result.scalars().first()
    if not fmt:
        raise HTTPException(status_code=404, detail="Not found")
    fmt.code = request.code
    fmt.name = request.name
    fmt.extra_charge = request.extra_charge
    fmt.description = request.description
    await db.commit()
    await db.refresh(fmt)
    return ScreeningFormatResponse(
        id=fmt.id, code=fmt.code, name=fmt.name,
        extra_charge=fmt.extra_charge, description=fmt.description
    )


@router.delete("/screening-formats/{fmt_id}")
async def delete_screening_format(
    fmt_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ScreeningFormat).where(ScreeningFormat.id == UUID(fmt_id)))
    fmt = result.scalars().first()
    if not fmt:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(fmt)
    await db.commit()
    return {"ok": True}


# ==================== Genres ====================

@router.get("/genres", response_model=list[GenreResponse])
async def get_genres_admin(
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Genre).order_by(Genre.name))
    return [GenreResponse(id=g.id, name=g.name) for g in result.scalars().all()]


@router.post("/genres", response_model=GenreResponse)
async def create_genre(
    request: GenreRequest,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    g = Genre(id=uuid.uuid4(), name=request.name)
    db.add(g)
    await db.commit()
    await db.refresh(g)
    return GenreResponse(id=g.id, name=g.name)


@router.delete("/genres/{genre_id}")
async def delete_genre(
    genre_id: str,
    _user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Genre).where(Genre.id == UUID(genre_id)))
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
            movie_id=r.movie_id, rating=r.rating, content=r.content,
            status_code=r.status_code, is_spoiler=r.is_spoiler,
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
