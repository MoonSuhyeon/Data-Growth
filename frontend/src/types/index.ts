export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  role: 'USER' | 'ADMIN'
  created_at: string
}

export interface Movie {
  id: string
  title: string
  title_en: string | null
  synopsis: string
  director: string
  cast: string[]
  runtime: number
  rating: 'ALL' | 'AGE_12' | 'AGE_15' | 'AGE_19'
  poster_url: string | null
  release_date: string | null
  status: 'NOW_SHOWING' | 'COMING_SOON' | 'ENDED'
  genres?: Genre[]
  formats?: ScreeningFormat[]
  avg_rating?: number | null
  review_count?: number
}

export interface Theater {
  id: string
  name: string
  region: string
  address: string
  phone: string
}

export interface Screening {
  id: string
  movie_id: string
  hall_id: string
  hall_name: string
  theater_id: string
  total_seats: number
  start_time: string
  end_time: string
  screening_date: string
  format_id: string | null
  format_code: string | null
  format_name: string | null
  format_extra_charge: number
  special_day_name: string | null
  special_day_extra_charge: number
}

export interface SeatInfo {
  id: string
  row: string
  number: number
  seat_grade: 'STANDARD' | 'SWEETBOX' | 'WHEELCHAIR'
  is_held: boolean
  is_booked: boolean
}

export interface BookingSeat {
  seat_id: string
  price: number
}

export interface Booking {
  id: string
  booking_number: string
  total_price: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED'
  booked_at: string
  booking_seats: BookingSeat[]
}

export interface DetailedBooking {
  id: string
  booking_number: string
  total_price: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED'
  booked_at: string
  movie_title: string
  movie_poster_url: string | null
  theater_name: string
  hall_name: string
  start_time: string
  end_time: string
  screening_date: string
  format_name: string | null
  seats: string[]
  refund: Refund | null
  receipt: Receipt | null
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

export interface ScreeningFormat {
  id: string
  code: string
  name: string
  extra_charge: number
  description: string | null
}

export interface SpecialPricingDay {
  id: string
  date: string
  name: string
  extra_charge: number
  description: string | null
}

export interface Genre {
  id: string
  name: string
}

export interface Notification {
  id: string
  type: 'BOOKING_CONFIRMED' | 'REFUND_COMPLETED' | 'SCREENING_REMINDER' | 'MARKETING'
  title: string
  body: string | null
  is_read: boolean
  created_at: string
  related_booking_id: string | null
}

export type PaymentMethod = 'CARD' | 'KAKAOPAY' | 'NAVERPAY'

export interface TicketInfo {
  seat_label: string
  qr_code: string
}

export interface BookingCreated {
  booking_number: string
  total_price: number
  status: string
  booked_at: string
  tickets: TicketInfo[]
}

export interface AudienceType {
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
  screening_id: string
  seat_ids: string[]
  payment_method: PaymentMethod
  audience_breakdown?: Record<string, number>
}

export interface GuestLookupRequest {
  booking_number: string
  phone: string
}

export interface GuestBookingDetail {
  booking_number: string
  name: string
  phone: string
  movie_title: string
  theater_name: string
  hall_name: string
  start_time: string
  seats: string[]
  total_price: number
  status: string
  booked_at: string
  tickets: TicketInfo[]
}

// ====== 3단계 ======

export interface Favorite {
  id: string
  movie_id: string
  movie_title: string
  movie_poster_url: string | null
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  user_name: string
  movie_id: string
  rating: number
  content: string | null
  status_code: string
  is_spoiler: boolean
  helpful_count: number
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

export interface MenuOption {
  id: string
  name: string
  price: number
  is_available: boolean
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  is_available: boolean
  display_order: number
  options: MenuOption[]
}

export interface MenuCategory {
  id: string
  name: string
  display_order: number
  is_active: boolean
  items: MenuItem[]
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
