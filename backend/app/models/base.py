import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import (
    Column, String, Integer, Text, DateTime, Boolean, Date, ForeignKey,
    UniqueConstraint, Index, func, Enum as SQLEnum, JSON, Numeric,
    Uuid as UUID,
)

# 방언 중립 타입만 쓴다. sa.Uuid 는 PostgreSQL 에서 네이티브 UUID 로, SQLite·MySQL
# 에서는 CHAR(32) 로 렌더된다. 92개 컬럼의 표기는 그대로 두고 import 만 바꿨다.
# PostgreSQL DDL 은 글자 단위로 동일해서 마이그레이션을 다시 만들 필요가 없다.
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class RoleEnum(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class TermTypeEnum(str, Enum):
    SERVICE = "SERVICE"
    PRIVACY = "PRIVACY"
    MARKETING = "MARKETING"


class PropertyTypeEnum(str, Enum):
    APARTMENT = "APARTMENT"
    HOTEL = "HOTEL"
    GUESTHOUSE = "GUESTHOUSE"
    PENSION = "PENSION"
    HOUSE = "HOUSE"


class PropertyStatusEnum(str, Enum):
    LISTED = "LISTED"
    COMING_SOON = "COMING_SOON"
    DELISTED = "DELISTED"


class RoomGradeEnum(str, Enum):
    STANDARD = "STANDARD"
    DELUXE = "DELUXE"
    ACCESSIBLE = "ACCESSIBLE"


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
    CHECKIN_REMINDER = "CHECKIN_REMINDER"
    MARKETING = "MARKETING"


class VoucherStatusEnum(str, Enum):
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


class SeasonEnum(str, Enum):
    OFF = "OFF"
    SHOULDER = "SHOULDER"
    PEAK = "PEAK"
    HOLIDAY = "HOLIDAY"


# ============================================
# Code Tables (Lookup Tables)
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


class RoomStatusCode(Base):
    __tablename__ = "room_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class RoomGradeCode(Base):
    __tablename__ = "room_grade_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class BedTypeCode(Base):
    __tablename__ = "bed_type_codes"
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


class PropertyStatusCode(Base):
    __tablename__ = "property_status_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class PropertyTypeCode(Base):
    __tablename__ = "property_type_codes"
    code = Column(String(30), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)


class VoucherStatusCode(Base):
    __tablename__ = "voucher_status_codes"
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
    status_code = Column(String(30), ForeignKey("user_status_codes.code"), nullable=True)
    point_balance = Column(Integer, default=0, nullable=True)

    term_agreements = relationship("TermAgreement", back_populates="user")
    identity_verifications = relationship("IdentityVerification", back_populates="user")
    room_holds = relationship("RoomHold", back_populates="user")
    bookings = relationship("Booking", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    wishlists = relationship("Wishlist", back_populates="user")
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
# 숙소
# ============================================

class Property(Base):
    """숙소.

    숙박에서는 파는 것과 파는 장소가 같다. 그래서 콘텐츠 속성(이름·소개·사진·평점)과
    위치 속성(지역·주소·좌표)이 한 테이블에 있다.
    """

    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    name_en = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    host_name = Column(String(100), nullable=False)
    highlights = Column(Text, nullable=False)  # JSON string
    max_guests = Column(Integer, nullable=False)
    property_type = Column(SQLEnum(PropertyTypeEnum), nullable=False)
    photo_url = Column(String(512), nullable=True)
    listed_at = Column(DateTime, nullable=True)
    status = Column(SQLEnum(PropertyStatusEnum), default=PropertyStatusEnum.LISTED, nullable=False)
    delisted_at = Column(DateTime, nullable=True)
    brand = Column(String(100), nullable=True)
    total_bookings = Column(Integer, default=0, nullable=True)
    booking_rank = Column(Integer, nullable=True)
    avg_rating = Column(Numeric(3, 2), nullable=True)
    review_count = Column(Integer, default=0, nullable=True)
    # 위치
    region = Column(String(50), nullable=False, index=True)
    address = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    latitude = Column(Numeric(10, 7), nullable=True)
    longitude = Column(Numeric(10, 7), nullable=True)
    parking_available = Column(Boolean, default=False, nullable=True)
    parking_count = Column(Integer, nullable=True)

    room_types = relationship("RoomType", back_populates="property")
    stay_dates = relationship("StayDate", back_populates="property")
    property_board_types = relationship("PropertyBoardType", back_populates="property")
    property_amenities = relationship("PropertyAmenity", back_populates="property")
    wishlists = relationship("Wishlist", back_populates="property")
    reviews = relationship("Review", back_populates="property")


class RoomType(Base):
    """객실 타입 — 같은 조건의 객실 묶음(스탠다드 트윈, 디럭스 온돌 …)."""

    __tablename__ = "room_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    name = Column(String(50), nullable=False)
    total_rooms = Column(Integer, nullable=False)
    bed_type_code = Column(String(30), ForeignKey("bed_type_codes.code"), nullable=True)
    location_detail = Column(String(100), nullable=True)
    standard_room_count = Column(Integer, nullable=True)
    deluxe_room_count = Column(Integer, nullable=True)
    accessible_room_count = Column(Integer, nullable=True)

    property = relationship("Property", back_populates="room_types")
    rooms = relationship("Room", back_populates="room_type")
    stay_dates = relationship("StayDate", back_populates="room_type")
    bed_type = relationship(
        "BedTypeCode",
        foreign_keys=[bed_type_code],
        primaryjoin="RoomType.bed_type_code == BedTypeCode.code",
    )


class Room(Base):
    """객실 — 재고의 최소 단위."""

    __tablename__ = "rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_type_id = Column(UUID(as_uuid=True), ForeignKey("room_types.id"), nullable=False)
    floor = Column(String(3), nullable=False)
    number = Column(Integer, nullable=False)
    room_grade = Column(SQLEnum(RoomGradeEnum), default=RoomGradeEnum.STANDARD, nullable=False)
    status_code = Column(String(30), ForeignKey("room_status_codes.code"), nullable=True)

    __table_args__ = (
        UniqueConstraint("room_type_id", "floor", "number", name="uq_room_type_room"),
    )

    room_type = relationship("RoomType", back_populates="rooms")
    room_holds = relationship("RoomHold", back_populates="room")
    booking_rooms = relationship("BookingRoom", back_populates="room")


class StayDate(Base):
    """숙박 가능일 — 숙소 × 객실타입 × 날짜 하나의 재고 행.

    영화의 '상영회차'가 좌석을 여는 단위였듯, 여기서는 이 행이 객실을 연다.
    """

    __tablename__ = "stay_dates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    room_type_id = Column(UUID(as_uuid=True), ForeignKey("room_types.id"), nullable=False)
    board_type_id = Column(UUID(as_uuid=True), ForeignKey("board_types.id"), nullable=True)
    check_in = Column(DateTime, nullable=False)
    check_out = Column(DateTime, nullable=False)
    stay_date = Column(DateTime, nullable=False, index=True)
    nights = Column(Integer, default=1, nullable=True)
    booked_rooms = Column(Integer, default=0, nullable=True)
    occupancy_rate = Column(Numeric(5, 2), default=0, nullable=True)

    __table_args__ = (
        Index("idx_property_date", "property_id", "stay_date"),
        Index("idx_room_type_checkin", "room_type_id", "check_in"),
    )

    property = relationship("Property", back_populates="stay_dates")
    room_type = relationship("RoomType", back_populates="stay_dates")
    board_type = relationship("BoardType", back_populates="stay_dates")
    room_holds = relationship("RoomHold", back_populates="stay_date")
    bookings = relationship("Booking", back_populates="stay_date")


# ============================================
# 객실 점유 + 예약 + 결제
# ============================================

class RoomHold(Base):
    """결제 완료 전 객실을 잠근다. 만료 시각을 넘기면 자동으로 풀린다."""

    __tablename__ = "room_holds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stay_date_id = Column(UUID(as_uuid=True), ForeignKey("stay_dates.id"), nullable=False)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    session_id = Column(String(255), nullable=True)
    held_at = Column(DateTime, default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=False, index=True)

    __table_args__ = (
        UniqueConstraint("stay_date_id", "room_id", name="uq_stay_date_room"),
    )

    stay_date = relationship("StayDate", back_populates="room_holds")
    room = relationship("Room", back_populates="room_holds")
    user = relationship("User", back_populates="room_holds")


class GuestType(Base):
    """투숙객 구분 — 성인/아동/유아. 인원 구성에 따라 요금이 달라진다."""

    __tablename__ = "guest_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    discount_amount = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)


class RatePlan(Base):
    """요금 정책 — 요일 × 시즌 × 객실등급."""

    __tablename__ = "rate_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    day_type = Column(SQLEnum(DayTypeEnum), nullable=False)
    season = Column(SQLEnum(SeasonEnum), nullable=False)
    room_grade = Column(SQLEnum(RoomGradeEnum), nullable=False)
    price = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint("day_type", "season", "room_grade", name="uq_rate_plan"),
    )


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_number = Column(String(36), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    stay_date_id = Column(UUID(as_uuid=True), ForeignKey("stay_dates.id"), nullable=False)
    total_price = Column(Integer, nullable=False)
    status = Column(SQLEnum(BookingStatusEnum), default=BookingStatusEnum.PENDING, nullable=False)
    booked_at = Column(DateTime, default=func.now(), nullable=False)
    guest_breakdown = Column(JSON, nullable=True)
    coupon_discount = Column(Integer, default=0, nullable=True)
    points_used = Column(Integer, default=0, nullable=True)

    user = relationship("User", back_populates="bookings")
    stay_date = relationship("StayDate", back_populates="bookings")
    booking_rooms = relationship("BookingRoom", back_populates="booking")
    payment = relationship("Payment", back_populates="booking", uselist=False)
    refund = relationship("Refund", back_populates="booking", uselist=False)
    receipt = relationship("Receipt", back_populates="booking", uselist=False)
    room_changes = relationship("RoomChangeHistory", back_populates="booking")
    coupon_usage = relationship("CouponUsage", back_populates="booking", uselist=False)
    point_histories = relationship("PointHistory", back_populates="booking")
    booking_addons = relationship("BookingAddOn", back_populates="booking")
    reviews = relationship("Review", back_populates="booking")


class BookingRoom(Base):
    __tablename__ = "booking_rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=False)
    price = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint("booking_id", "room_id", name="uq_booking_room"),
    )

    booking = relationship("Booking", back_populates="booking_rooms")
    room = relationship("Room", back_populates="booking_rooms")
    stay_voucher = relationship("StayVoucher", back_populates="booking_room", uselist=False)


class StayVoucher(Base):
    """체크인 바우처 — 객실 한 칸당 한 장. QR 로 프런트에서 확인한다."""

    __tablename__ = "stay_vouchers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_room_id = Column(UUID(as_uuid=True), ForeignKey("booking_rooms.id"), nullable=False, unique=True)
    qr_code = Column(String(36), unique=True, nullable=False)
    status = Column(SQLEnum(VoucherStatusEnum), default=VoucherStatusEnum.ISSUED, nullable=False)
    issued_at = Column(DateTime, default=func.now(), nullable=False)
    used_at = Column(DateTime, nullable=True)

    booking_room = relationship("BookingRoom", back_populates="stay_voucher")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False, unique=True)
    payment_method = Column(SQLEnum(PaymentMethodEnum), nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(SQLEnum(PaymentStatusEnum), default=PaymentStatusEnum.PENDING, nullable=False)
    approval_number = Column(String(100), nullable=True)
    approved_at = Column(DateTime, nullable=True)
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
# 식사 옵션
# ============================================

class BoardType(Base):
    """식사 조건 — 객실만, 조식포함, 반보드."""

    __tablename__ = "board_types"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(20), unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    extra_charge = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)

    property_board_types = relationship("PropertyBoardType", back_populates="board_type")
    stay_dates = relationship("StayDate", back_populates="board_type")


class PropertyBoardType(Base):
    __tablename__ = "property_board_types"

    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), primary_key=True)
    board_type_id = Column(UUID(as_uuid=True), ForeignKey("board_types.id"), primary_key=True)

    property = relationship("Property", back_populates="property_board_types")
    board_type = relationship("BoardType", back_populates="property_board_types")


# ============================================
# 성수기
# ============================================

class PeakDate(Base):
    __tablename__ = "peak_dates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    date = Column(Date, unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    extra_charge = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)


# ============================================
# 편의시설
# ============================================

class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)

    property_amenities = relationship("PropertyAmenity", back_populates="amenity")


class PropertyAmenity(Base):
    __tablename__ = "property_amenities"

    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), primary_key=True)
    amenity_id = Column(UUID(as_uuid=True), ForeignKey("amenities.id"), primary_key=True)

    property = relationship("Property", back_populates="property_amenities")
    amenity = relationship("Amenity", back_populates="property_amenities")


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
# 객실 변경 이력
# ============================================

class RoomChangeHistory(Base):
    __tablename__ = "room_change_histories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    old_room_ids = Column(JSON, nullable=False)
    new_room_ids = Column(JSON, nullable=False)
    changed_at = Column(DateTime, default=func.now(), nullable=False)
    reason = Column(Text, nullable=True)

    booking = relationship("Booking", back_populates="room_changes")


# ============================================
# 위시리스트
# ============================================

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "property_id", name="uq_user_property_wishlist"),
    )

    user = relationship("User", back_populates="wishlists")
    property = relationship("Property", back_populates="wishlists")


# ============================================
# 쿠폰
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
# 포인트
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
# 부가서비스 (조식·바비큐·픽업)
# ============================================

class AddOnCategory(Base):
    __tablename__ = "addon_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    items = relationship("AddOnItem", back_populates="category")


class AddOnItem(Base):
    __tablename__ = "addon_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(UUID(as_uuid=True), ForeignKey("addon_categories.id"), nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(512), nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)

    category = relationship("AddOnCategory", back_populates="items")
    options = relationship("AddOnOption", back_populates="item")
    booking_addons = relationship("BookingAddOn", back_populates="item")


class AddOnOption(Base):
    __tablename__ = "addon_options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id = Column(UUID(as_uuid=True), ForeignKey("addon_items.id"), nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(Integer, default=0, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)

    item = relationship("AddOnItem", back_populates="options")
    booking_addons = relationship("BookingAddOn", back_populates="option")


class BookingAddOn(Base):
    __tablename__ = "booking_addons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=False)
    item_id = Column(UUID(as_uuid=True), ForeignKey("addon_items.id"), nullable=False)
    option_id = Column(UUID(as_uuid=True), ForeignKey("addon_options.id"), nullable=True)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Integer, nullable=False)

    booking = relationship("Booking", back_populates="booking_addons")
    item = relationship("AddOnItem", back_populates="booking_addons")
    option = relationship("AddOnOption", back_populates="booking_addons")


# ============================================
# 멤버십
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
# 리뷰
# ============================================

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    booking_id = Column(UUID(as_uuid=True), ForeignKey("bookings.id"), nullable=True)
    rating = Column(Integer, nullable=False)
    content = Column(Text, nullable=True)
    status_code = Column(String(30), ForeignKey("review_status_codes.code"), nullable=False, default="ACTIVE")
    is_spoiler = Column(Boolean, default=False, nullable=False)
    helpful_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "property_id", name="uq_user_property_review"),
    )

    user = relationship("User", back_populates="reviews", foreign_keys=[user_id])
    property = relationship("Property", back_populates="reviews")
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
# 알림 설정
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
# 사용자 활동 로그
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
# 관리자 감사 로그
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
