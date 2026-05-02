from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_validator
from enum import Enum
import json
from typing import Optional


# ==================== Auth ====================
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=1)
    phone: str | None = None
    term_service: bool
    term_privacy: bool
    term_marketing: bool = False


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    phone: str | None = None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== GenreInfo / FormatInfo (used inside MovieDetailResponse) ====================
class GenreInfo(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class FormatInfo(BaseModel):
    id: UUID
    code: str
    name: str
    extra_charge: int = 0
    description: str | None = None

    class Config:
        from_attributes = True


# ==================== Movie ====================
class MovieResponse(BaseModel):
    id: UUID
    title: str
    title_en: str | None = None
    synopsis: str
    director: str
    cast: list[str] = []
    runtime: int
    rating: str
    poster_url: str | None = None
    release_date: datetime | None = None
    status: str

    @field_validator('cast', mode='before')
    @classmethod
    def parse_cast(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v or []

    class Config:
        from_attributes = True


class MovieDetailResponse(MovieResponse):
    genres: list[GenreInfo] = []
    formats: list[FormatInfo] = []


class MovieRequest(BaseModel):
    title: str = Field(..., min_length=1)
    title_en: str | None = None
    synopsis: str = Field(..., min_length=1)
    director: str = Field(..., min_length=1)
    cast: list[str] = []
    runtime: int = Field(..., gt=0)
    rating: str = Field(..., pattern="^(ALL|AGE_12|AGE_15|AGE_19)$")
    poster_url: str | None = None
    release_date: datetime | None = None
    status: str = Field(default="NOW_SHOWING", pattern="^(NOW_SHOWING|COMING_SOON|ENDED)$")


# ==================== Theater ====================
class TheaterResponse(BaseModel):
    id: UUID
    name: str
    region: str
    address: str
    phone: str

    class Config:
        from_attributes = True


# ==================== Hall ====================
class HallInfo(BaseModel):
    id: UUID
    name: str
    theater_id: UUID
    theater_name: str
    total_seats: int


# ==================== Screening ====================
class ScreeningResponse(BaseModel):
    id: UUID
    movie_id: UUID
    hall_id: UUID
    hall_name: str
    theater_id: UUID
    total_seats: int
    start_time: datetime
    end_time: datetime
    screening_date: datetime
    format_id: UUID | None = None
    format_code: str | None = None
    format_name: str | None = None
    format_extra_charge: int = 0
    special_day_name: str | None = None
    special_day_extra_charge: int = 0


class ScreeningRequest(BaseModel):
    movie_id: UUID
    hall_id: UUID
    start_time: datetime
    end_time: datetime
    screening_date: datetime


class AdminScreeningResponse(BaseModel):
    id: UUID
    movie_id: UUID
    movie_title: str
    hall_id: UUID
    hall_name: str
    theater_id: UUID
    theater_name: str
    total_seats: int
    start_time: datetime
    end_time: datetime
    screening_date: datetime


# ==================== Seat ====================
class SeatInfo(BaseModel):
    id: UUID
    row: str
    number: int
    seat_grade: str
    is_held: bool = False
    is_booked: bool = False


class ScreeningSeatsResponse(BaseModel):
    screening_id: UUID
    seats: list[SeatInfo]


# ==================== Seat Hold ====================
class SeatHoldRequest(BaseModel):
    screening_id: UUID
    seat_ids: list[UUID]


class SeatHoldResponse(BaseModel):
    screening_id: UUID
    seat_ids: list[UUID]
    expires_at: datetime


# ==================== AudienceType ====================
class AudienceTypeResponse(BaseModel):
    id: UUID
    code: str
    name: str
    discount_amount: int
    description: str | None = None
    is_active: bool

    class Config:
        from_attributes = True


# ==================== Booking ====================
class BookingRequest(BaseModel):
    screening_id: UUID
    seat_ids: list[UUID]
    payment_method: str = Field(..., pattern="^(CARD|KAKAOPAY|NAVERPAY)$")
    audience_breakdown: dict[str, int] | None = None


class BookingSeatResponse(BaseModel):
    seat_id: UUID
    price: int

    class Config:
        from_attributes = True


class BookingResponse(BaseModel):
    id: UUID
    booking_number: str
    total_price: int
    status: str
    booked_at: datetime
    booking_seats: list[BookingSeatResponse]

    class Config:
        from_attributes = True


class MyBookingsResponse(BaseModel):
    bookings: list[BookingResponse]
    total_count: int


# ==================== Create Booking Response ====================
class TicketInfo(BaseModel):
    seat_label: str
    qr_code: str


class CreateBookingResponse(BaseModel):
    booking_number: str
    total_price: int
    status: str
    booked_at: datetime
    tickets: list[TicketInfo]


# ==================== Admin ====================
class AdminStats(BaseModel):
    total_users: int
    today_bookings: int
    today_revenue: int
    now_showing_count: int


class AdminBookingItem(BaseModel):
    id: UUID
    booking_number: str
    user_name: str
    movie_title: str
    total_price: int
    status: str
    booked_at: datetime


class AdminUserResponse(BaseModel):
    id: UUID
    email: str | None = None
    name: str
    phone: str | None = None
    role: str
    created_at: datetime
    booking_count: int = 0


class UserRoleRequest(BaseModel):
    role: str = Field(..., pattern="^(USER|ADMIN)$")


# ==================== Guest Booking ====================
class GuestBookingRequest(BaseModel):
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=1)
    screening_id: UUID
    seat_ids: list[UUID]
    payment_method: str = Field(..., pattern="^(CARD|KAKAOPAY|NAVERPAY)$")
    audience_breakdown: dict[str, int] | None = None


class GuestLookupRequest(BaseModel):
    booking_number: str
    phone: str


class GuestBookingDetailResponse(BaseModel):
    booking_number: str
    name: str
    phone: str
    movie_title: str
    theater_name: str
    hall_name: str
    start_time: datetime
    seats: list[str]
    total_price: int
    status: str
    booked_at: datetime
    tickets: list[TicketInfo]


# ==================== Refund ====================
class RefundRequest(BaseModel):
    reason: str | None = None


class RefundResponse(BaseModel):
    id: UUID
    booking_id: UUID
    refund_amount: int
    reason: str | None = None
    status: str
    requested_at: datetime
    processed_at: datetime | None = None

    class Config:
        from_attributes = True


# ==================== Receipt ====================
class ReceiptResponse(BaseModel):
    id: UUID
    booking_id: UUID
    receipt_number: str
    receipt_type: str
    issued_at: datetime
    total_amount: int
    tax_amount: int
    issuer_name: str | None = None
    issuer_registration_number: str | None = None

    class Config:
        from_attributes = True


# ==================== ScreeningFormat ====================
class ScreeningFormatResponse(BaseModel):
    id: UUID
    code: str
    name: str
    extra_charge: int
    description: str | None = None

    class Config:
        from_attributes = True


class ScreeningFormatRequest(BaseModel):
    code: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    extra_charge: int = Field(..., ge=0)
    description: str | None = None


# ==================== SpecialPricingDay ====================
class SpecialPricingDayResponse(BaseModel):
    id: UUID
    date: date
    name: str
    extra_charge: int
    description: str | None = None

    class Config:
        from_attributes = True


class SpecialPricingDayRequest(BaseModel):
    date: date
    name: str = Field(..., min_length=1)
    extra_charge: int = Field(..., ge=0)
    description: str | None = None


# ==================== Genre ====================
class GenreResponse(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class GenreRequest(BaseModel):
    name: str = Field(..., min_length=1)


# ==================== Notification ====================
class NotificationResponse(BaseModel):
    id: UUID
    type: str
    title: str
    body: str | None = None
    is_read: bool
    created_at: datetime
    related_booking_id: UUID | None = None

    class Config:
        from_attributes = True


# ==================== SeatChange ====================
class SeatChangeRequest(BaseModel):
    new_seat_ids: list[UUID]
    reason: str | None = None


class SeatChangeResponse(BaseModel):
    id: UUID
    booking_id: UUID
    old_seat_ids: list[UUID]
    new_seat_ids: list[UUID]
    changed_at: datetime
    reason: str | None = None

    class Config:
        from_attributes = True


# ==================== DetailedBooking ====================
class DetailedBookingResponse(BaseModel):
    id: UUID
    booking_number: str
    total_price: int
    status: str
    booked_at: datetime
    movie_title: str
    movie_poster_url: str | None = None
    theater_name: str
    hall_name: str
    start_time: datetime
    end_time: datetime
    screening_date: datetime
    format_name: str | None = None
    seats: list[str]
    refund: RefundResponse | None = None
    receipt: ReceiptResponse | None = None


# ==================== Admin Refund ====================
class AdminRefundResponse(BaseModel):
    id: UUID
    booking_id: UUID
    booking_number: str
    user_name: str
    movie_title: str
    refund_amount: int
    reason: str | None = None
    status: str
    requested_at: datetime
    processed_at: datetime | None = None


# ==================== ScreeningResponse (extended) ====================
class ScreeningDetailResponse(BaseModel):
    id: UUID
    movie_id: UUID
    hall_id: UUID
    hall_name: str
    theater_id: UUID
    total_seats: int
    start_time: datetime
    end_time: datetime
    screening_date: datetime
    format_id: UUID | None = None
    format_code: str | None = None
    format_name: str | None = None
    format_extra_charge: int = 0
    special_day_name: str | None = None
    special_day_extra_charge: int = 0


# ==================== Code Table ====================
class CodeTableResponse(BaseModel):
    code: str
    name: str
    description: str | None = None
    display_order: int = 0
    is_active: bool = True

    class Config:
        from_attributes = True


# ==================== Favorite ====================
class FavoriteResponse(BaseModel):
    id: UUID
    movie_id: UUID
    movie_title: str
    movie_poster_url: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Review ====================
class ReviewRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    content: str | None = None
    is_spoiler: bool = False


class ReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    user_name: str
    movie_id: UUID
    rating: int
    content: str | None = None
    status_code: str
    is_spoiler: bool
    helpful_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReviewHelpfulResponse(BaseModel):
    review_id: UUID
    helpful_count: int


# ==================== Coupon ====================
class CouponMasterResponse(BaseModel):
    id: UUID
    code: str
    name: str
    type_code: str
    discount_value: int
    min_booking_amount: int
    max_discount_amount: int | None = None
    valid_from: datetime
    valid_to: datetime
    max_issues: int | None = None
    issued_count: int
    is_active: bool

    class Config:
        from_attributes = True


class CouponMasterRequest(BaseModel):
    code: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    type_code: str = Field(..., pattern="^(FIXED_AMOUNT|PERCENT)$")
    discount_value: int = Field(..., ge=0)
    min_booking_amount: int = Field(default=0, ge=0)
    max_discount_amount: int | None = None
    valid_from: datetime
    valid_to: datetime
    max_issues: int | None = None


class UserCouponResponse(BaseModel):
    id: UUID
    coupon_master_id: UUID
    coupon_name: str
    coupon_code: str
    type_code: str
    discount_value: int
    min_booking_amount: int
    status_code: str
    issued_at: datetime
    used_at: datetime | None = None
    expires_at: datetime | None = None

    class Config:
        from_attributes = True


class CouponIssueRequest(BaseModel):
    coupon_code: str


# ==================== Points ====================
class PointHistoryResponse(BaseModel):
    id: UUID
    type: str
    amount: int
    balance_after: int
    booking_id: UUID | None = None
    description: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class PointBalanceResponse(BaseModel):
    balance: int
    histories: list[PointHistoryResponse]


class UsePointsRequest(BaseModel):
    points: int = Field(..., ge=0)


# ==================== Menu ====================
class MenuOptionResponse(BaseModel):
    id: UUID
    name: str
    price: int
    is_available: bool

    class Config:
        from_attributes = True


class MenuItemResponse(BaseModel):
    id: UUID
    category_id: UUID
    name: str
    price: int
    description: str | None = None
    image_url: str | None = None
    is_available: bool
    display_order: int
    options: list[MenuOptionResponse] = []

    class Config:
        from_attributes = True


class MenuCategoryResponse(BaseModel):
    id: UUID
    name: str
    display_order: int
    is_active: bool
    items: list[MenuItemResponse] = []

    class Config:
        from_attributes = True


class MenuItemRequest(BaseModel):
    category_id: UUID
    name: str = Field(..., min_length=1)
    price: int = Field(..., ge=0)
    description: str | None = None
    image_url: str | None = None
    is_available: bool = True
    display_order: int = 0


class MenuCategoryRequest(BaseModel):
    name: str = Field(..., min_length=1)
    display_order: int = 0
    is_active: bool = True


class BookingMenuItemRequest(BaseModel):
    item_id: UUID
    option_id: UUID | None = None
    quantity: int = Field(..., ge=1)


# ==================== Membership ====================
class PartnerResponse(BaseModel):
    id: UUID
    name: str
    code: str
    description: str | None = None
    logo_url: str | None = None
    is_active: bool

    class Config:
        from_attributes = True


class MembershipProductResponse(BaseModel):
    id: UUID
    partner_id: UUID
    partner_name: str
    name: str
    discount_type: str
    discount_value: int
    monthly_price: int
    is_active: bool

    class Config:
        from_attributes = True


class MembershipResponse(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    partner_name: str
    discount_type: str
    discount_value: int
    status: str
    started_at: datetime
    expires_at: datetime | None = None

    class Config:
        from_attributes = True


# ==================== NotificationSetting ====================
class NotificationSettingResponse(BaseModel):
    id: UUID
    email_enabled: bool
    sms_enabled: bool
    push_enabled: bool
    booking_notification: bool
    refund_notification: bool
    marketing_notification: bool
    updated_at: datetime

    class Config:
        from_attributes = True


class NotificationSettingRequest(BaseModel):
    email_enabled: bool = True
    sms_enabled: bool = True
    push_enabled: bool = True
    booking_notification: bool = True
    refund_notification: bool = True
    marketing_notification: bool = False


# ==================== UserActivity ====================
class UserActivityResponse(BaseModel):
    id: UUID
    type: str
    description: str | None = None
    ip_address: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== AdminAuditLog ====================
class AdminAuditLogResponse(BaseModel):
    id: UUID
    admin_id: UUID
    admin_name: str
    action: str
    resource_type: str
    resource_id: str | None = None
    before_data: dict | None = None
    after_data: dict | None = None
    ip_address: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Enhanced BookingRequest ====================
class BookingRequestV2(BaseModel):
    screening_id: UUID
    seat_ids: list[UUID]
    payment_method: str = Field(..., pattern="^(CARD|KAKAOPAY|NAVERPAY)$")
    audience_breakdown: dict[str, int] | None = None
    user_coupon_id: UUID | None = None
    points_to_use: int = Field(default=0, ge=0)
    menu_items: list[BookingMenuItemRequest] = []
