export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  role: 'USER' | 'ADMIN'
  created_at: string
}

export interface Property {
  id: string
  name: string
  name_en: string | null
  description: string
  host_name: string
  highlights: string[]
  max_guests: number
  property_type: 'APARTMENT' | 'HOTEL' | 'GUESTHOUSE' | 'PENSION' | 'HOUSE'
  photo_url: string | null
  listed_at: string | null
  status: 'LISTED' | 'COMING_SOON' | 'DELISTED'
  region: string
  address: string
  amenities?: Amenity[]
  board_types?: BoardType[]
  avg_rating?: number | null
  review_count?: number
  phone?: string | null
}

// 극장이 숙소로 흡수되면서 지역은 엔티티가 아니라 집계 결과가 됐다.
export interface Region {
  region: string
  property_count: number
}

export interface StayDate {
  id: string
  property_id: string
  room_type_id: string
  room_type_name: string
  total_rooms: number
  check_in: string
  check_out: string
  stay_date: string
  board_type_id: string | null
  board_type_code: string | null
  board_type_name: string | null
  board_type_extra_charge: number
  peak_day_name: string | null
  peak_day_extra_charge: number
}

export interface RoomInfo {
  id: string
  floor: string
  number: number
  room_grade: 'STANDARD' | 'DELUXE' | 'ACCESSIBLE'
  is_held: boolean
  is_booked: boolean
}

export interface BookingRoom {
  room_id: string
  price: number
}

export interface Booking {
  id: string
  booking_number: string
  total_price: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED'
  booked_at: string
  booking_rooms: BookingRoom[]
}

export interface DetailedBooking {
  id: string
  booking_number: string
  total_price: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED'
  booked_at: string
  property_name: string
  property_photo_url: string | null
  room_type_name: string
  check_in: string
  check_out: string
  stay_date: string
  board_type_name: string | null
  rooms: string[]
  refund: Refund | null
  receipt: Receipt | null
}

/** 환불 예상액. `backend/app/schemas` 의 `RefundQuoteResponse` 와 같아야 한다. */
export interface RefundQuote {
  booking_id: string
  total_price: number
  days_until_check_in: number
  refund_ratio: number
  refund_amount: number
  policy_name: string
  policy_description: string
  refundable: boolean
  reason: string | null
}

export interface Refund {
  id: string
  booking_id: string
  refund_amount: number
  reason: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  requested_at: string
  processed_at: string | null
}

export interface Receipt {
  id: string
  booking_id: string
  receipt_number: string
  receipt_type: 'CASH' | 'TAX' | 'GENERAL'
  issued_at: string
  total_amount: number
  tax_amount: number
  issuer_name: string | null
  issuer_registration_number: string | null
}

export interface BoardType {
  id: string
  code: string
  name: string
  extra_charge: number
  description: string | null
}

export interface PeakDate {
  id: string
  date: string
  name: string
  extra_charge: number
  description: string | null
}

export interface Amenity {
  id: string
  name: string
}

export interface Notification {
  id: string
  type: 'BOOKING_CONFIRMED' | 'REFUND_COMPLETED' | 'CHECKIN_REMINDER' | 'MARKETING'
  title: string
  body: string | null
  is_read: boolean
  created_at: string
  related_booking_id: string | null
}

export type PaymentMethod = 'CARD' | 'KAKAOPAY' | 'NAVERPAY'

export interface TicketInfo {
  room_label: string
  qr_code: string
}

export interface BookingCreated {
  booking_number: string
  total_price: number
  status: string
  booked_at: string
  tickets: TicketInfo[]
}

export interface GuestType {
  id: string
  code: string
  name: string
  discount_amount: number
  description: string | null
  is_active: boolean
}

export interface GuestInfo {
  name: string
  phone: string
}

export interface GuestBookingRequest {
  name: string
  phone: string
  stay_date_id: string
  room_ids: string[]
  payment_method: PaymentMethod
  guest_breakdown?: Record<string, number>
}

export interface GuestLookupRequest {
  booking_number: string
  phone: string
}

export interface GuestBookingDetail {
  booking_number: string
  name: string
  phone: string
  property_name: string
  room_type_name: string
  check_in: string
  rooms: string[]
  total_price: number
  status: string
  booked_at: string
  tickets: TicketInfo[]
}

// ====== 3단계 ======

export interface Wishlist {
  id: string
  property_id: string
  property_name: string
  property_photo_url: string | null
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  user_name: string
  property_id: string
  rating: number
  content: string | null
  status_code: string
  helpful_count: number
  /** 실제 투숙 후 남긴 리뷰인가. 서버가 `booking_id` 에서 유도해 준다. */
  verified_stay: boolean
  created_at: string
  updated_at: string
}

export interface UserCoupon {
  id: string
  coupon_master_id: string
  coupon_name: string
  coupon_code: string
  type_code: 'FIXED_AMOUNT' | 'PERCENT'
  discount_value: number
  min_booking_amount: number
  status_code: string
  issued_at: string
  used_at: string | null
  expires_at: string | null
}

export interface CouponMaster {
  id: string
  code: string
  name: string
  type_code: 'FIXED_AMOUNT' | 'PERCENT'
  discount_value: number
  min_booking_amount: number
  max_discount_amount: number | null
  valid_from: string
  valid_to: string
  max_issues: number | null
  issued_count: number
  is_active: boolean
}

export interface PointHistory {
  id: string
  type: 'EARN' | 'USE' | 'REFUND' | 'EXPIRE'
  amount: number
  balance_after: number
  booking_id: string | null
  description: string | null
  created_at: string
}

export interface PointBalance {
  balance: number
  histories: PointHistory[]
}

export interface AddOnOption {
  id: string
  name: string
  price: number
  is_available: boolean
}

export interface AddOnItem {
  id: string
  category_id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  is_available: boolean
  display_order: number
  options: AddOnOption[]
}

export interface AddOnCategory {
  id: string
  name: string
  display_order: number
  is_active: boolean
  items: AddOnItem[]
}

export interface MembershipProduct {
  id: string
  partner_id: string
  partner_name: string
  name: string
  discount_type: 'FIXED_AMOUNT' | 'PERCENT'
  discount_value: number
  monthly_price: number
  is_active: boolean
}

export interface Membership {
  id: string
  product_id: string
  product_name: string
  partner_name: string
  discount_type: 'FIXED_AMOUNT' | 'PERCENT'
  discount_value: number
  status: string
  started_at: string
  expires_at: string | null
}

// ====== 4단계 ======

export interface NotificationSetting {
  id: string
  email_enabled: boolean
  sms_enabled: boolean
  push_enabled: boolean
  booking_notification: boolean
  refund_notification: boolean
  marketing_notification: boolean
  updated_at: string
}

export interface UserActivity {
  id: string
  type: string
  description: string | null
  ip_address: string | null
  created_at: string
}
