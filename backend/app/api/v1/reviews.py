from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update
from uuid import UUID
import uuid
from datetime import datetime

from app.core.database import get_db
from app.models import Review, ReviewHelpful, ReviewReport, Movie, Booking, BookingSeat
from app.schemas import ReviewRequest, ReviewResponse, ReviewHelpfulResponse
from app.api.v1.auth import get_current_user

router = APIRouter()

# IMPORTANT: /me/reviews must be defined BEFORE /{movie_id}/reviews to avoid
# "me" being captured as a movie_id UUID parameter.

@router.get("/me/reviews", response_model=list[ReviewResponse])
async def get_my_reviews(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(
        select(Review)
        .where(Review.user_id == user.id, Review.status_code != "DELETED")
        .order_by(Review.created_at.desc())
    )
    reviews = result.scalars().all()
    return [
        ReviewResponse(
            id=r.id,
            user_id=r.user_id,
            user_name=user.name,
            movie_id=r.movie_id,
            rating=r.rating,
            content=r.content,
            status_code=r.status_code,
            is_spoiler=r.is_spoiler,
            helpful_count=r.helpful_count,
            created_at=r.created_at,
            updated_at=r.updated_at,
        )
        for r in reviews
    ]


async def _review_to_response(review: Review, user_name: str) -> ReviewResponse:
    return ReviewResponse(
        id=review.id,
        user_id=review.user_id,
        user_name=user_name,
        movie_id=review.movie_id,
        rating=review.rating,
        content=review.content,
        status_code=review.status_code,
        is_spoiler=review.is_spoiler,
        helpful_count=review.helpful_count,
        created_at=review.created_at,
        updated_at=review.updated_at,
    )


async def _update_movie_rating(movie_id: UUID, db: AsyncSession):
    result = await db.execute(
        select(func.avg(Review.rating), func.count(Review.id))
        .where(Review.movie_id == movie_id, Review.status_code == "ACTIVE")
    )
    avg_r, cnt = result.one()
    await db.execute(
        update(Movie)
        .where(Movie.id == movie_id)
        .values(avg_rating=float(avg_r) if avg_r else None, review_count=cnt or 0)
    )


@router.get("/{movie_id}/reviews", response_model=list[ReviewResponse])
async def get_movie_reviews(
    movie_id: str,
    db: AsyncSession = Depends(get_db)
):
    from sqlalchemy.orm import selectinload
    movie_uuid = UUID(movie_id)

    result = await db.execute(
        select(Review)
        .where(Review.movie_id == movie_uuid, Review.status_code == "ACTIVE")
        .order_by(Review.created_at.desc())
    )
    reviews = result.scalars().all()

    from app.models import User
    user_ids = list({r.user_id for r in reviews})
    user_result = await db.execute(
        select(User).where(User.id.in_(user_ids))
    )
    user_map = {u.id: u.name for u in user_result.scalars().all()}

    return [
        ReviewResponse(
            id=r.id,
            user_id=r.user_id,
            user_name=user_map.get(r.user_id, "알 수 없음"),
            movie_id=r.movie_id,
            rating=r.rating,
            content=r.content,
            status_code=r.status_code,
            is_spoiler=r.is_spoiler,
            helpful_count=r.helpful_count,
            created_at=r.created_at,
            updated_at=r.updated_at,
        )
        for r in reviews
    ]


@router.post("/{movie_id}/reviews", response_model=ReviewResponse)
async def create_review(
    movie_id: str,
    request: ReviewRequest,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    movie_uuid = UUID(movie_id)
    movie_result = await db.execute(select(Movie).where(Movie.id == movie_uuid))
    if not movie_result.scalars().first():
        raise HTTPException(status_code=404, detail="Movie not found")

    existing = await db.execute(
        select(Review).where(
            Review.user_id == user.id,
            Review.movie_id == movie_uuid
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="이미 리뷰를 작성하셨습니다")

    now = datetime.utcnow()
    review = Review(
        id=uuid.uuid4(),
        user_id=user.id,
        movie_id=movie_uuid,
        rating=request.rating,
        content=request.content,
        status_code="ACTIVE",
        is_spoiler=request.is_spoiler,
        helpful_count=0,
        created_at=now,
        updated_at=now,
    )
    db.add(review)
    await db.flush()
    await _update_movie_rating(movie_uuid, db)
    await db.commit()

    return ReviewResponse(
        id=review.id,
        user_id=review.user_id,
        user_name=user.name,
        movie_id=review.movie_id,
        rating=review.rating,
        content=review.content,
        status_code=review.status_code,
        is_spoiler=review.is_spoiler,
        helpful_count=review.helpful_count,
        created_at=review.created_at,
        updated_at=review.updated_at,
    )


@router.put("/reviews/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: str,
    request: ReviewRequest,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(select(Review).where(Review.id == UUID(review_id)))
    review = result.scalars().first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    review.rating = request.rating
    review.content = request.content
    review.is_spoiler = request.is_spoiler
    review.updated_at = datetime.utcnow()
    await db.flush()
    await _update_movie_rating(review.movie_id, db)
    await db.commit()

    return ReviewResponse(
        id=review.id,
        user_id=review.user_id,
        user_name=user.name,
        movie_id=review.movie_id,
        rating=review.rating,
        content=review.content,
        status_code=review.status_code,
        is_spoiler=review.is_spoiler,
        helpful_count=review.helpful_count,
        created_at=review.created_at,
        updated_at=review.updated_at,
    )


@router.delete("/reviews/{review_id}", status_code=204)
async def delete_review(
    review_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    result = await db.execute(select(Review).where(Review.id == UUID(review_id)))
    review = result.scalars().first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id and user.role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Forbidden")

    movie_id = review.movie_id
    review.status_code = "DELETED"
    await db.flush()
    await _update_movie_rating(movie_id, db)
    await db.commit()


@router.post("/reviews/{review_id}/helpful", response_model=ReviewHelpfulResponse)
async def toggle_helpful(
    review_id: str,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    review_uuid = UUID(review_id)
    result = await db.execute(select(Review).where(Review.id == review_uuid))
    review = result.scalars().first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    existing = await db.execute(
        select(ReviewHelpful).where(
            ReviewHelpful.review_id == review_uuid,
            ReviewHelpful.user_id == user.id,
        )
    )
    helpful = existing.scalars().first()
    if helpful:
        await db.delete(helpful)
        review.helpful_count = max(0, review.helpful_count - 1)
    else:
        db.add(ReviewHelpful(
            review_id=review_uuid,
            user_id=user.id,
            created_at=datetime.utcnow(),
        ))
        review.helpful_count += 1

    await db.commit()
    return ReviewHelpfulResponse(review_id=review_uuid, helpful_count=review.helpful_count)


@router.post("/reviews/{review_id}/report", status_code=204)
async def report_review(
    review_id: str,
    reason: str | None = None,
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = await get_current_user(authorization.split(" ")[1], db)

    review_uuid = UUID(review_id)
    existing = await db.execute(
        select(ReviewReport).where(
            ReviewReport.review_id == review_uuid,
            ReviewReport.user_id == user.id,
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="이미 신고한 리뷰입니다")

    db.add(ReviewReport(
        id=uuid.uuid4(),
        review_id=review_uuid,
        user_id=user.id,
        reason=reason,
        created_at=datetime.utcnow(),
    ))
    await db.commit()
