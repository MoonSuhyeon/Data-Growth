from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_token
from app.models import User, Term, TermAgreement, NotificationSetting
from app.schemas import SignupRequest, LoginRequest, TokenResponse, UserResponse

router = APIRouter()


async def get_current_user(token: str, db: AsyncSession = Depends(get_db)) -> User:
    """JWT 토큰으로 현재 사용자 조회"""
    payload = decode_token(token)
    if not payload or "email" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    result = await db.execute(select(User).where(User.email == payload["email"]))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.post("/signup", response_model=UserResponse)
async def signup(request: SignupRequest, db: AsyncSession = Depends(get_db)):
    """회원가입"""
    # 기존 사용자 확인
    result = await db.execute(select(User).where(User.email == request.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already exists")

    # 필수 약관 확인
    if not request.term_service or not request.term_privacy:
        raise HTTPException(status_code=400, detail="Must agree to required terms")

    # 사용자 생성
    user = User(
        id=uuid.uuid4(),
        email=request.email,
        hashed_password=hash_password(request.password),
        name=request.name,
        phone=request.phone,
        role="USER",
    )
    db.add(user)
    await db.flush()

    # 약관 동의 기록
    result = await db.execute(select(Term))
    terms = result.scalars().all()

    for term in terms:
        if (term.type == "SERVICE" and request.term_service) or \
           (term.type == "PRIVACY" and request.term_privacy) or \
           (term.type == "MARKETING" and request.term_marketing):
            agreement = TermAgreement(
                id=uuid.uuid4(),
                user_id=user.id,
                term_id=term.id,
            )
            db.add(agreement)

    # Create default notification settings
    from datetime import datetime
    db.add(NotificationSetting(
        id=uuid.uuid4(),
        user_id=user.id,
        email_enabled=True,
        sms_enabled=True,
        push_enabled=True,
        booking_notification=True,
        refund_notification=True,
        marketing_notification=request.term_marketing,
        updated_at=datetime.utcnow(),
    ))

    await db.commit()
    return UserResponse.from_orm(user)


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """로그인"""
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalars().first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"email": user.email})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def get_me(authorization: str = Header(None), db: AsyncSession = Depends(get_db)):
    """현재 사용자 정보 조회"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ")[1]
    user = await get_current_user(token, db)
    return UserResponse.from_orm(user)
