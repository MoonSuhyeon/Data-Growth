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


# ==================== AmenityInfo / BoardTypeInfo (used inside PropertyDetailResponse) ====================
class AmenityInfo(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class BoardTypeInfo(BaseModel):
    id: UUID
    code: str
    name: str
    extra_charge: int = 0
    description: str | None = None

    class Config:
        from_attributes = True


# ==================== Property ====================
class PropertyResponse(BaseModel):
    id: UUID
    name: str
    name_en: str | None = None
    description: str
    host_name: str
    highlights: list[str] = []
    max_guests: int
    property_type: str
    photo_url: str | None = None
    listed_at: datetime | None = None
    status: str
    region: str
    address: str
    avg_rating: float | None = None
    review_count: int = 0

    @field_validator('highlights', mode='before')
    @classmethod
    def parse_highlights(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return []
        return v or []

    class Config:
        from_attributes = True


class PropertyDetailResponse(PropertyResponse):
    amenities: list[AmenityInfo] = []
    board_types: list[BoardTypeInfo] = []
    phone: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    parking_available: bool | None = None
    parking_count: int | None = None


class PropertyRequest(BaseModel):
    name: str = Field(..., min_length=1)
    name_en: str | None = None
    description: str = Field(..., min_length=1)
    host_name: str = Field(..., min_length=1)
    highlights: list[str] = []
    max_guests: int = Field(..., gt=0)
    property_type: str = Field(..., pattern="^(APARTMENT|HOTEL|GUESTHOUSE|PENSION|HOUSE)$")
    photo_url: str | None = None
    listed_at: datetime | None = None
    status: str = Field(default="LISTED", pattern="^(LISTED|COMING_SOON|DELISTED)$")
    region: str = Field(..., min_length=1)
    address: str = Field(..., min_length=1)
    phone: str = ""


# ==================== Region ====================
# 극장이 Property 로 흡수되면서 지역은 별도 엔티티가 아니라 Property 의 속성이 됐다.
# 목록은 테이블이 아니라 집계로 만든다.
class RegionResponse(BaseModel):
    region: str
    property_count: int


# ==================== RoomType ====================
class RoomTypeInfo(BaseModel):
    id: UUID
    name: str
    property_id: UUID
    property_name: str
    total_rooms: int


# ==================== StayDate ====================
class StayDateResponse(BaseModel):
    id: UUID
    property_id: UUID
    room_type_id: UUID
    room_type_name: str
    total_rooms: int
    check_in: datetime
    check_out: datetime
    stay_date: datetime
    board_type_id: UUID | None = None
    board_type_code: str | None = None
    board_type_name: str | None = None
    board_type_extra_charge: int = 0
    peak_day_name: str | None = None
    peak_day_extra_charge: int = 0


class StayDateRequest(BaseModel):
    property_id: UUID
    room_type_id: UUID
    check_in: datetime
    check_out: datetime
    stay_date: datetime


class AdminStayDateResponse(BaseModel):
    id: UUID
    property_id: UUID
    property_name: str
    room_type_id: UUID
    room_type_name: str
    total_rooms: int
    check_in: datetime
    check_out: datetime
    stay_date: datetime


# ==================== Room ====================
class RoomInfo(BaseModel):
    id: UUID
    floor: str
    number: int
    room_grade: str
    is_held: bool = False
    is_booked: bool = False


class StayDateRoomsResponse(BaseModel):
    stay_date_id: UUID
    rooms: list[RoomInfo]


# ==================== Room Hold ====================
class RoomHoldRequest(BaseModel):
    stay_date_id: UUID
    room_ids: list[UUID]


class RoomHoldResponse(BaseModel):
    stay_date_id: UUID
    room_ids: list[UUID]
    expires_at: datetime


# ==================== GuestType ====================
class GuestTypeResponse(BaseModel):
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
    stay_date_id: UUID
    room_ids: list[UUID]
    payment_method: str = Field(..., pattern="^(CARD|KAKAOPAY|NAVERPAY)$")
    guest_breakdown: dict[str, int] | None = None


class BookingRoomResponse(BaseModel):
    room_id: UUID
    price: int

    class Config:
        from_attributes = True


class BookingResponse(BaseModel):
    id: UUID
    booking_number: str
    total_price: int
    status: str
    booked_at: datetime
    booking_rooms: list[BookingRoomResponse]

    class Config:
        from_attributes = True


class MyBookingsResponse(BaseModel):
    bookings: list[BookingResponse]
    total_count: int


# ==================== Create Booking Response ====================
class StayVoucherInfo(BaseModel):
    room_label: str
    qr_code: str


class CreateBookingResponse(BaseModel):
    booking_number: str
    total_price: int
    status: str
    booked_at: datetime
    stay_vouchers: list[StayVoucherInfo]


# ==================== Admin ====================
class AdminStats(BaseModel):
    total_users: int
    today_bookings: int
    today_revenue: int
    listed_count: int


class AdminBookingItem(BaseModel):
    id: UUID
    booking_number: str
    user_name: str
    property_name: str
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
    stay_date_id: UUID
    room_ids: list[UUID]
    payment_method: str = Field(..., pattern="^(CARD|KAKAOPAY|NAVERPAY)$")
    guest_breakdown: dict[str, int] | None = None


class GuestLookupRequest(BaseModel):
    booking_number: str
    phone: str


class GuestBookingDetailResponse(BaseModel):
    booking_number: str
    name: str
    phone: str
    property_name: str
    property_name: str
    room_type_name: str
    check_in: datetime
    rooms: list[str]
    total_price: int
    status: str
    booked_at: datetime
    stay_vouchers: list[StayVoucherInfo]


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


# ==================== BoardType ====================
class BoardTypeResponse(BaseModel):
    id: UUID
    code: str
    name: str
    extra_charge: int
    description: str | None = None

    class Config:
        from_attributes = True


class BoardTypeRequest(BaseModel):
    code: str = Field(..., min_length=1)
    name: str = Field(..., min_length=1)
    extra_charge: int = Field(..., ge=0)
    description: str | None = None


# ==================== PeakDate ====================
class PeakDateResponse(BaseModel):
    id: UUID
    date: date
    name: str
    extra_charge: int
    description: str | None = None

    class Config:
        from_attributes = True


class PeakDateRequest(BaseModel):
    date: date
    name: str = Field(..., min_length=1)
    extra_charge: int = Field(..., ge=0)
    description: str | None = None


# ==================== Amenity ====================
class AmenityResponse(BaseModel):
    id: UUID
    name: str

    class Config:
        from_attributes = True


class AmenityRequest(BaseModel):
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


# ==================== RoomChange ====================
class RoomChangeRequest(BaseModel):
    new_room_ids: list[UUID]
    reason: str | None = None


class RoomChangeResponse(BaseModel):
    id: UUID
    booking_id: UUID
    old_room_ids: list[UUID]
    new_room_ids: list[UUID]
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
    property_name: str
    property_photo_url: str | None = None
    property_name: str
    room_type_name: str
    check_in: datetime
    check_out: datetime
    stay_date: datetime
    board_type_name: str | None = None
    rooms: list[str]
    refund: RefundResponse | None = None
    receipt: ReceiptResponse | None = None


# ==================== Admin Refund ====================
class AdminRefundResponse(BaseModel):
    id: UUID
    booking_id: UUID
    booking_number: str
    user_name: str
    property_name: str
    refund_amount: int
    reason: str | None = None
    status: str
    requested_at: datetime
    processed_at: datetime | None = None


# ==================== StayDateResponse (extended) ====================
class StayDateDetailResponse(BaseModel):
    id: UUID
    property_id: UUID
    room_type_id: UUID
    room_type_name: str
    property_id: UUID
    total_rooms: int
    check_in: datetime
    check_out: datetime
    stay_date: datetime
    board_type_id: UUID | None = None
    board_type_code: str | None = None
    board_type_name: str | None = None
    board_type_extra_charge: int = 0
    peak_day_name: str | None = None
    peak_day_extra_charge: int = 0


# ==================== Code Table ====================
class CodeTableResponse(BaseModel):
    code: str
    name: str
    description: str | None = None
    display_order: int = 0
    is_active: bool = True

    class Config:
        from_attributes = True


# ==================== Wishlist ====================
class WishlistResponse(BaseModel):
    id: UUID
    property_id: UUID
    property_name: str
    property_photo_url: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Review ====================
class ReviewRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    content: str | None = None


class ReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    user_name: str
    property_id: UUID
    rating: int
    content: str | None = None
    status_code: str
    helpful_count: int
    #: 실제 투숙 후 남긴 리뷰인가. **컬럼이 아니라 `booking_id` 에서 유도한다** —
    #: 같은 사실을 두 군데 저장하면 반드시 갈라진다.
    verified_stay: bool = False
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


# ==================== AddOn ====================
class AddOnOptionResponse(BaseModel):
    id: UUID
    name: str
    price: int
    is_available: bool

    class Config:
        from_attributes = True


class AddOnItemResponse(BaseModel):
    id: UUID
    category_id: UUID
    name: str
    price: int
    description: str | None = None
    image_url: str | None = None
    is_available: bool
    display_order: int
    options: list[AddOnOptionResponse] = []

    class Config:
        from_attributes = True


class AddOnCategoryResponse(BaseModel):
    id: UUID
    name: str
    display_order: int
    is_active: bool
    items: list[AddOnItemResponse] = []

    class Config:
        from_attributes = True


class AddOnItemRequest(BaseModel):
    category_id: UUID
    name: str = Field(..., min_length=1)
    price: int = Field(..., ge=0)
    description: str | None = None
    image_url: str | None = None
    is_available: bool = True
    display_order: int = 0


class AddOnCategoryRequest(BaseModel):
    name: str = Field(..., min_length=1)
    display_order: int = 0
    is_active: bool = True


class BookingAddOnItemRequest(BaseModel):
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
    stay_date_id: UUID
    room_ids: list[UUID]
    payment_method: str = Field(..., pattern="^(CARD|KAKAOPAY|NAVERPAY)$")
    guest_breakdown: dict[str, int] | None = None
    user_coupon_id: UUID | None = None
    points_to_use: int = Field(default=0, ge=0)
    addon_items: list[BookingAddOnItemRequest] = []
