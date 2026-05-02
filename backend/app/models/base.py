import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import (
    Column, String, Integer, Text, DateTime, Boolean, Date, ForeignKey,
    UniqueConstraint, Index, func, Enum as SQLEnum, JSON, Numeric
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class RoleEnum(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class TermTypeEnum(str, Enum):
    SERVICE = "SERVICE"
    PRIVACY = "PRIVACY"
    MARKETING = "MARKETING"


class MovieRatingEnum(str, Enum):
    ALL = "ALL"
    AGE_12 = "AGE_12"
    AGE_15 = "AGE_15"
    AGE_19 = "AGE_19"


class MovieStatusEnum(str, Enum):
    NOW_SHOWING = "NOW_SHOWING"
    COMING_SOON = "COMING_SOON"
    ENDED = "ENDED"


class SeatGradeEnum(str, Enum):
    STANDARD = "STANDARD"
    SWEETBOX = "SWEETBOX"
    WHEELCHAIR = "WHEELCHAIR"


class BookingStatusEnum(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"


class RefundStatusEnum(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"


class ReceiptTypeEnum(str, Enum):
    CASH = "CASH"
    TAX = "TAX"
    GENERAL = "GENERAL"


class NotificationTypeEnum(str, Enum):
    BOOKING_CONFIRMED = "BOOKING_CONFIRMED"
    REFUND_COMPLETED = "REFUND_COMPLETED"
    SCREENING_REMINDER = "SCREENING_REMINDER"
    MARKETING = "MARKETING"


class TicketStatusEnum(str, Enum):
    ISSUED = "ISSUED"
    USED = "USED"
    CANCELLED = "CANCELLED"


class PaymentStatusEnum(str, Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"


class PaymentMethodEnum(str, Enum):
    CARD = "CARD"
    KAKAOPAY = "KAKAOPAY"
    NAVERPAY = "NAVERPAY"


class DayTypeEnum(str, Enum):
    WEEKDAY = "WEEKDAY"
    WEEKEND = "WEEKEND"


class TimeSlotEnum(str, Enum):
    MORNING = "MORNING"
    AFTERNOON = "AFTERNOON"
    EVENING = "EVENING"
    NIGHT = "NIGHT"


# ============================================
# Code Tables (Lookup Tables) - 3단계 Module 0
# ============================================

class UserStatusCode(Base):
    __tablename__ = "user_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class UserRoleCode(Base):
    __tablename__ = "user_role_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class BookingStatusCode(Base):
    __tablename__ = "booking_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class PaymentStatusCode(Base):
    __tablename__ = "payment_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class PaymentMethodCode(Base):
    __tablename__ = "payment_method_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class SeatStatusCode(Base):
    __tablename__ = "seat_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class SeatGradeCode(Base):
    __tablename__ = "seat_grade_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class HallTypeCode(Base):
    __tablename__ = "hall_type_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class CouponStatusCode(Base):
    __tablename__ = "coupon_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class CouponTypeCode(Base):
    __tablename__ = "coupon_type_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class MovieStatusCode(Base):
    __tablename__ = "movie_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class RatingCode(Base):
    __tablename__ = "rating_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class TicketStatusCode(Base):
    __tablename__ = "ticket_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class ReviewStatusCode(Base):
    __tablename__ = "review_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


# ============================================
# 회원/인증
# ============================================

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=True, index=True)
    hashed_password = Column(String(255), nullable=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.USER, nullable=False)
    is_guest = Column(Boolean, default=False, nullable=False, index=True)
    guest_expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    # 3단계 enhancements
    status_code = Column(String(30), ForeignKey("user_status_codes.code"), nullable=True)
    point_balance = Column(Integer, default=0, nullable=True)

    term_agreements = relationship("TermAgreement", back_populates="user")
    identity_verifications = relationship("IdentityVerification", back_populates="user")
    seat_holds = relationship("SeatHold", back_populates="user")
    bookings = relationship("Booking", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")
    reviews = relationship("Review", back_populates="user", foreign_keys="Review.user_id")
    point_histories = relationship("PointHistory", back_populates="user")
    user_coupons = relationship("UserCoupon", back_populates="user")
    memberships = relationship("Membership", back_populates="user")
    notification_setting = relationship("NotificationSetting", back_populates="user", uselist=False)
    activities = relationship("UserActivity", back_populates="user")


class IdentityVerification(Base):
    __tablename__ = "identity_verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    verified_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="identity_verifications")


class Term(Base):
    __tablename__ = "terms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(SQLEnum(TermTypeEnum), nullable=False)
    version = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    required = Column(Boolean, default=False, nullable=False)
    effective_from = Column(DateTime, default=func.now(), nullable=False)

    term_agreements = relationship("TermAgreement", back_populates="term")


class TermAgreement(Base):
    __tablename__ = "term_agreements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    term_id = Column(UUID(as_uuid=True), ForeignKey("terms.id"), nullable=False)
    agreed_at = Column(DateTime, default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "term_id", name="uq_user_term"),
    )

    user = relationship("User", back_populates="term_agreements")
    term = relationship("Term", back_populates="term_agreements")


# ============================================
# 콘텐츠
# ============================================

class Movie(Base):
    __tablename__ = "movies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    title_en = Column(String(255), nullable=True)
    synopsis = Column(Text, nullable=False)
    director = Column(String(100), nullable=False)
    cast = Column(Text, nullable=False)  # JSON string
    runtime = Column(Integer, nullable=False)
    rating = Column(SQLEnum(MovieRatingEnum), nullable=False)
    poster_url = Column(String(512), nullable=True)
    release_date = Column(DateTime, nullable=True)
    status = Column(SQLEnum(MovieStatusEnum), default=MovieStatusEnum.NOW_SHOWING, nullable=False)
    # 3단계 enhancements
    end_date = Column(DateTime, nullable=True)
    distributor = Column(String(100), nullable=True)
    total_bookings = Column(Integer, default=0, nullable=True)
    booking_rank = Column(Integer, nullable=True)
    # 4단계 review stats
    avg_rating = Column(Numeric(3, 2), nullable=True)
    review_count = Column(Integer, default=0, nullable=True)

    screenings = relationship("Screening", back_populates="movie")
    movie_formats = relationship("MovieFormat", back_populates="movie")
    movie_genres = relationship("MovieGenre", back_populates="movie")
    favorites = relationship("Favorite", back_populates="movie")
    reviews = relationship("Review", back_populates="movie")


class Theater(Base):
    __tablename__ = "theaters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    region = Column(String(50), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    # 3단계 enhancements
    latitude = Column(Numeric(10, 7), nullable=True)
    longitude = Column(Numeric(10, 7), nullable=True)
    parking_available = Column(Boolean, default=False, nullable=True)
    parking_count = Column(Integer, nullable=True)

    halls = relationship("Hall", back_populates="theater")


class Hall(Base):
    __tablename__ = "halls"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    theater_id = Column(UUID(as_uuid=True), ForeignKey("theaters.id"), nullable=False)
    name = Column(String(50), nullable=False)
    total_seats = Column(Integer, nullable=False)
    # 3단계 enhancements
    hall_type_code = Column(String(30), ForeignKey("hall_type_codes.code"), nullable=True)
    location_detail = Column(String(100), nullable=True)
    standard_seat_count = Column(Integer, nullable=True)
    sweetbox_seat_count = Column(Integer, nullable=True)
    wheelchair_seat_count = Column(Integer, nullable=True)

    theater = relationship("Theater", back_populates="halls")
    seats = relationship("Seat", back_populates="hall")
    screenings = relationship("Screening", back_populates="hall")
    hall_type = relationship("HallTypeCode", foreign_keys=[hall_type_code], primaryjoin="Hall.hall_type_code == HallTypeCode.code")


class Seat(Base):
    __tablename__ = "seats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hall_id = Column(UUID(as_uuid=True), ForeignKey("halls.id"), nullable=False)
    row = Column(String(1), nullable=False)
    number = Column(Integer, nullable=False)
    seat_grade = Column(SQLEnum(SeatGradeEnum), default=SeatGradeEnum.STANDARD, nullable=False)
    # 3단계 enhancements
    status_code = Column(String(30), ForeignKey("seat_status_codes.code"), nullable=True)

    __table_args__ = (
        UniqueConstraint("hall_id", "row", "number", name="uq_hall_seat"),
    )

    hall = relationship("Hall", back_populates="seats")
    seat_holds = relationship("SeatHold", back_populates="seat")
    booking_seats = relationship("BookingSeat", back_populates="seat")


class Screening(Base):
    __tablename__ = "screenings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    movie_id = Column(UUID(as_uuid=True), ForeignKey("movies.id"), nullable=False)
    hall_id = Column(UUID(as_uuid=True), ForeignKey("halls.id"), nullable=False)
    format_id = Column(UUID(as_uuid=True), ForeignKey("screening_formats.id"), nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    screening_date = Column(DateTime, nullable=False, index=True)
    # 3단계 enhancements
    sequence_number = Column(Integer, nullable=True)
    booked_seats = Column(Integer, default=0, nullable=True)
    booking_rate = Column(Numeric(5, 2), default=0, nullable=True)

    __table_args__ = (
        Index("idx_movie_date", "movie_id", "screening_date"),
        Index("idx_hall_time", "hall_id", "start_time"),
    )

    movie = relationship("Movie", back_populates="screenings")
    hall = relationship("Hall", back_populates="screenings")
    format = relationship("ScreeningFormat", back_populates="screenings")
    seat_holds = relationship("SeatHold", back_populates="screening")
    bookings = relationship("Booking", back_populates="screening")


# ============================================
# 좌석점유 + 예매 + 결제
# ============================================

class SeatHold(Base):
    __tablename__ = "seat_holds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    screening_id = Column(UUID(as_uuid=True), ForeignKey("screenings.id"), nullable=False)
    seat_id = Column(UUID(as_uuid=True), ForeignKey("seats.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    session_id = Column(String(255), nullable=True)
    held_at = Column(DateTime, default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=False, index=True)

    __table_args__ = (
        UniqueConstraint("screening_id", "seat_id", name="uq_screening_seat"),
    )

    screening = relationship("Screening", back_populates="seat_holds")
    seat = relationship("Seat", back_populates="seat_holds")
    user = relationship("User", back_populates="seat_holds")


class AudienceType(Base):
    __tablename__ = "audience_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    discount_amount = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)


class PricePolicy(Base):
    __tablename__ = "price_policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    day_type = Column(SQLEnum(DayTypeEnum), nullable=False)
    time_slot = Column(SQLEnum(TimeSlotEnum), nullable=False)
    seat_grade = Column(SQLEnum(SeatGradeEnum), nullable=False)
    price = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint("day_type", "time_slot", "seat_grade", name="uq_price_policy"),
    )


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_number = Column(String(36), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    screening_id = Column(UUID(as_uuid=True), ForeignKey("screenings.id"), nullable=False)
    total_price = Column(Integer, nullable=False)
    status = Column(SQLEnum(BookingStatusEnum), default=BookingStatusEnum.PENDING, nullable=False)
    booked_at = Column(DateTime, default=func.now(), nullable=False)
    audience_breakdown = Column(JSON, nullable=True)
    # 3단계 additions
    coupon_discount = Column(Integer, default=0, nullable=True)
    points_used = Column(Integer, default=0, nullable=True)

    user = relationship("User", back_populates="bookings")
    screening = relationship("Screening", back_populates="bookings")
    booking_seats = relationship("BookingSeat", back_populates="booking")
    payment = relationship("Payment", back_populates="booking", uselist=False)
    refund = relationship("Refund", back_populates="booking", uselist=False)
    receipt = relationship("Receipt", back_populates="booking", uselist=False)
    seat_changes = relationship("SeatChangeHistory", back_populates="booking")
    coupon_usage = relationship("CouponUsage", back_populates="booking", uselist=False)
    point_histories = relationship("PointHistory", back_populates="booking")
    booking_menus = relationship("BookingMenu", back_populates="booking")
    reviews = relationship("Review", back_populates="booking")


class BookingSeat(Base):
    __tablename__ = "booking_seats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    seat_id = Column(UUID(as_uuid=True), ForeignKey("seats.id"), nullable=False)
    price = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint("booking_id", "seat_id", name="uq_booking_seat"),
    )

    booking = relationship("Booking", back_populates="booking_seats")
    seat = relationship("Seat", back_populates="booking_seats")
    ticket = relationship("Ticket", back_populates="booking_seat", uselist=False)


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_seat_id = Column(UUID(as_uuid=True), ForeignKey("booking_seats.id"), nullable=False, unique=True)
    qr_code = Column(String(36), unique=True, nullable=False)
    status = Column(SQLEnum(TicketStatusEnum), default=TicketStatusEnum.ISSUED, nullable=False)
    issued_at = Column(DateTime, default=func.now(), nullable=False)
    used_at = Column(DateTime, nullable=True)

    booking_seat = relationship("BookingSeat", back_populates="ticket")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False, unique=True)
    payment_method = Column(SQLEnum(PaymentMethodEnum), nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(SQLEnum(PaymentStatusEnum), default=PaymentStatusEnum.PENDING, nullable=False)
    approval_number = Column(String(100), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    # 3단계 enhancements
    pg_transaction_id = Column(String(100), nullable=True)
    method_code = Column(String(30), ForeignKey("payment_method_codes.code"), nullable=True)
    status_code = Column(String(30), ForeignKey("payment_status_codes.code"), nullable=True)

    booking = relationship("Booking", back_populates="payment")


# ============================================
# 환불 / 영수증
# ============================================

class Refund(Base):
    __tablename__ = "refunds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), unique=True, nullable=False)
    refund_amount = Column(Integer, nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(SQLEnum(RefundStatusEnum), default=RefundStatusEnum.PENDING, nullable=False)
    requested_at = Column(DateTime, default=func.now(), nullable=False)
    processed_at = Column(DateTime, nullable=True)

    booking = relationship("Booking", back_populates="refund")


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), unique=True, nullable=False)
    receipt_number = Column(String(50), unique=True, nullable=False)
    receipt_type = Column(SQLEnum(ReceiptTypeEnum), default=ReceiptTypeEnum.GENERAL, nullable=False)
    issued_at = Column(DateTime, default=func.now(), nullable=False)
    total_amount = Column(Integer, nullable=False, default=0)
    tax_amount = Column(Integer, nullable=False, default=0)
    issuer_name = Column(String(100), nullable=True)
    issuer_registration_number = Column(String(20), nullable=True)

    booking = relationship("Booking", back_populates="receipt")


# ============================================
# 상영 형식
# ============================================

class ScreeningFormat(Base):
    __tablename__ = "screening_formats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    extra_charge = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)

    movie_formats = relationship("MovieFormat", back_populates="format")
    screenings = relationship("Screening", back_populates="format")


class MovieFormat(Base):
    __tablename__ = "movie_formats"

    movie_id = Column(UUID(as_uuid=True), ForeignKey("movies.id"), primary_key=True)
    format_id = Column(UUID(as_uuid=True), ForeignKey("screening_formats.id"), primary_key=True)

    movie = relationship("Movie", back_populates="movie_formats")
    format = relationship("ScreeningFormat", back_populates="movie_formats")


# ============================================
# 특별가격일
# ============================================

class SpecialPricingDay(Base):
    __tablename__ = "special_pricing_days"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    extra_charge = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)


# ============================================
# 장르
# ============================================

class Genre(Base):
    __tablename__ = "genres"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)

    movie_genres = relationship("MovieGenre", back_populates="genre")


class MovieGenre(Base):
    __tablename__ = "movie_genres"

    movie_id = Column(UUID(as_uuid=True), ForeignKey("movies.id"), primary_key=True)
    genre_id = Column(UUID(as_uuid=True), ForeignKey("genres.id"), primary_key=True)

    movie = relationship("Movie", back_populates="movie_genres")
    genre = relationship("Genre", back_populates="movie_genres")


# ============================================
# 알림
# ============================================

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(SQLEnum(NotificationTypeEnum), nullable=False)
    title = Column(String(200), nullable=False)
    body = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    related_booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True)

    user = relationship("User", back_populates="notifications")


# ============================================
# 좌석 변경 이력
# ============================================

class SeatChangeHistory(Base):
    __tablename__ = "seat_change_histories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    old_seat_ids = Column(JSON, nullable=False)
    new_seat_ids = Column(JSON, nullable=False)
    changed_at = Column(DateTime, default=func.now(), nullable=False)
    reason = Column(Text, nullable=True)

    booking = relationship("Booking", back_populates="seat_changes")


# ============================================
# 즐겨찾기 - 3단계 Module 4
# ============================================

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    movie_id = Column(UUID(as_uuid=True), ForeignKey("movies.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="uq_user_movie_favorite"),
    )

    user = relationship("User", back_populates="favorites")
    movie = relationship("Movie", back_populates="favorites")


# ============================================
# 쿠폰 - 3단계 Module 7
# ============================================

class CouponMaster(Base):
    __tablename__ = "coupon_masters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    type_code = Column(String(30), ForeignKey("coupon_type_codes.code"), nullable=False)
    discount_value = Column(Integer, nullable=False)
    min_booking_amount = Column(Integer, default=0, nullable=False)
    max_discount_amount = Column(Integer, nullable=True)
    valid_from = Column(DateTime, nullable=False)
    valid_to = Column(DateTime, nullable=False)
    max_issues = Column(Integer, nullable=True)
    issued_count = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    user_coupons = relationship("UserCoupon", back_populates="coupon_master")


class UserCoupon(Base):
    __tablename__ = "user_coupons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    coupon_master_id = Column(UUID(as_uuid=True), ForeignKey("coupon_masters.id"), nullable=False)
    status_code = Column(String(30), ForeignKey("coupon_status_codes.code"), nullable=False, default="ACTIVE")
    issued_at = Column(DateTime, default=func.now(), nullable=False)
    used_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="user_coupons")
    coupon_master = relationship("CouponMaster", back_populates="user_coupons")
    coupon_usage = relationship("CouponUsage", back_populates="user_coupon", uselist=False)


class CouponUsage(Base):
    __tablename__ = "coupon_usages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_coupon_id = Column(UUID(as_uuid=True), ForeignKey("user_coupons.id"), nullable=False)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    discount_amount = Column(Integer, nullable=False)
    used_at = Column(DateTime, default=func.now(), nullable=False)

    user_coupon = relationship("UserCoupon", back_populates="coupon_usage")
    booking = relationship("Booking", back_populates="coupon_usage")


# ============================================
# 포인트 - 3단계 Module 8
# ============================================

class PointHistory(Base):
    __tablename__ = "point_histories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False)  # EARN, USE, REFUND, EXPIRE
    amount = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True)
    description = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    user = relationship("User", back_populates="point_histories")
    booking = relationship("Booking", back_populates="point_histories")


# ============================================
# 메뉴 주문 - 3단계 Module 6
# ============================================

class MenuCategory(Base):
    __tablename__ = "menu_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    items = relationship("MenuItem", back_populates="category")


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(UUID(as_uuid=True), ForeignKey("menu_categories.id"), nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(512), nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)

    category = relationship("MenuCategory", back_populates="items")
    options = relationship("MenuOption", back_populates="item")
    booking_menus = relationship("BookingMenu", back_populates="item")


class MenuOption(Base):
    __tablename__ = "menu_options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("menu_items.id"), nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(Integer, default=0, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)

    item = relationship("MenuItem", back_populates="options")
    booking_menus = relationship("BookingMenu", back_populates="option")


class BookingMenu(Base):
    __tablename__ = "booking_menus"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    item_id = Column(UUID(as_uuid=True), ForeignKey("menu_items.id"), nullable=False)
    option_id = Column(UUID(as_uuid=True), ForeignKey("menu_options.id"), nullable=True)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Integer, nullable=False)

    booking = relationship("Booking", back_populates="booking_menus")
    item = relationship("MenuItem", back_populates="booking_menus")
    option = relationship("MenuOption", back_populates="booking_menus")


# ============================================
# 멤버십 - 3단계 Module 9
# ============================================

class Partner(Base):
    __tablename__ = "partners"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    code = Column(String(30), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    logo_url = Column(String(512), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    products = relationship("MembershipProduct", back_populates="partner")


class MembershipProduct(Base):
    __tablename__ = "membership_products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    partner_id = Column(UUID(as_uuid=True), ForeignKey("partners.id"), nullable=False)
    name = Column(String(100), nullable=False)
    discount_type = Column(String(20), nullable=False)  # FIXED_AMOUNT or PERCENT
    discount_value = Column(Integer, nullable=False)
    monthly_price = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    partner = relationship("Partner", back_populates="products")
    memberships = relationship("Membership", back_populates="product")


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("membership_products.id"), nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    started_at = Column(DateTime, default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_user_membership"),
    )

    user = relationship("User", back_populates="memberships")
    product = relationship("MembershipProduct", back_populates="memberships")


class DiscountCombinationRule(Base):
    __tablename__ = "discount_combination_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    discount_a = Column(String(30), nullable=False)
    discount_b = Column(String(30), nullable=False)
    is_stackable = Column(Boolean, default=True, nullable=False)
    description = Column(Text, nullable=True)


# ============================================
# 리뷰 - 4단계 Module 1
# ============================================

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    movie_id = Column(UUID(as_uuid=True), ForeignKey("movies.id"), nullable=False)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True)
    rating = Column(Integer, nullable=False)
    content = Column(Text, nullable=True)
    status_code = Column(String(30), ForeignKey("review_status_codes.code"), nullable=False, default="ACTIVE")
    is_spoiler = Column(Boolean, default=False, nullable=False)
    helpful_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="uq_user_movie_review"),
    )

    user = relationship("User", back_populates="reviews", foreign_keys=[user_id])
    movie = relationship("Movie", back_populates="reviews")
    booking = relationship("Booking", back_populates="reviews")
    helpfuls = relationship("ReviewHelpful", back_populates="review")
    reports = relationship("ReviewReport", back_populates="review")


class ReviewHelpful(Base):
    __tablename__ = "review_helpfuls"

    review_id = Column(UUID(as_uuid=True), ForeignKey("reviews.id"), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    review = relationship("Review", back_populates="helpfuls")
    user = relationship("User", foreign_keys=[user_id])


class ReviewReport(Base):
    __tablename__ = "review_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    review_id = Column(UUID(as_uuid=True), ForeignKey("reviews.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reason = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("review_id", "user_id", name="uq_review_report"),
    )

    review = relationship("Review", back_populates="reports")
    user = relationship("User", foreign_keys=[user_id])


# ============================================
# 알림 설정 - 4단계 Module 2
# ============================================

class NotificationSetting(Base):
    __tablename__ = "notification_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    email_enabled = Column(Boolean, default=True, nullable=False)
    sms_enabled = Column(Boolean, default=True, nullable=False)
    push_enabled = Column(Boolean, default=True, nullable=False)
    booking_notification = Column(Boolean, default=True, nullable=False)
    refund_notification = Column(Boolean, default=True, nullable=False)
    marketing_notification = Column(Boolean, default=False, nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="notification_setting")


# ============================================
# 사용자 활동 로그 - 4단계 Module 4
# ============================================

class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)
    description = Column(String(300), nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    user = relationship("User", back_populates="activities")


# ============================================
# 관리자 감사 로그 - 4단계 Module 5
# ============================================

class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String(50), nullable=False)
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(100), nullable=True)
    before_data = Column(JSON, nullable=True)
    after_data = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    admin = relationship("User", foreign_keys=[admin_id])
