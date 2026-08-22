import client from './client'
import type {
  Property, Region, StayDate, RoomInfo, BookingCreated, PaymentMethod,
  GuestType, GuestBookingRequest, GuestLookupRequest, GuestBookingDetail,
  DetailedBooking, Refund, Receipt, Amenity, Notification, BoardType, PeakDate,
  Wishlist, Review, UserCoupon, CouponMaster, PointBalance, AddOnCategory, RefundQuote,
  MembershipProduct, Membership, NotificationSetting, UserActivity,
} from '../types'

export const getProperties = (status?: string) =>
  client.get<Property[]>('/properties', { params: status ? { status } : {} })

export const getProperty = (id: string) =>
  client.get<Property>(`/properties/${id}`)

export const getRegions = () =>
  client.get<Region[]>('/regions')

export const getStayDates = (params: {
  property_id?: string
  room_type_id?: string
  date?: string
}) => client.get<StayDate[]>('/stay-dates', { params })

export const getStayDate = (id: string) =>
  client.get<StayDate>(`/stay-dates/${id}`)

export const getStayDateRooms = (stayDateId: string) =>
  client.get<{ stay_date_id: string; rooms: RoomInfo[] }>(`/stay-dates/${stayDateId}/rooms`)

export const holdRooms = (data: { stay_date_id: string; room_ids: string[] }) =>
  client.post<{ stay_date_id: string; room_ids: string[]; expires_at: string }>('/room-holds', data)

export const releaseRooms = (data: { stay_date_id: string; room_ids: string[] }) =>
  client.delete('/room-holds', { data })

export const getGuestTypes = () =>
  client.get<GuestType[]>('/guest-types')

export const createBooking = (data: {
  stay_date_id: string
  room_ids: string[]
  payment_method: PaymentMethod
  guest_breakdown?: Record<string, number>
}) => client.post<BookingCreated>('/bookings', data)

export const getMyBookings = () =>
  client.get<DetailedBooking[]>('/bookings/me')

/** 환불하면 얼마인가. **집행하지 않는다.** */
export const getRefundQuote = (bookingId: string) =>
  client.get<RefundQuote>(`/bookings/${bookingId}/refund-quote`)

export const requestRefund = (bookingId: string, reason?: string) =>
  client.post<Refund>(`/bookings/${bookingId}/refund`, { reason })

export const getReceipt = (bookingId: string) =>
  client.get<Receipt>(`/bookings/${bookingId}/receipt`)

export const changeRooms = (bookingId: string, data: { new_room_ids: string[]; reason?: string }) =>
  client.post(`/bookings/${bookingId}/change-rooms`, data)

export const getAmenitys = () =>
  client.get<Amenity[]>('/amenities')

export const getMyNotifications = () =>
  client.get<Notification[]>('/notifications/me')

export const getUnreadNotificationCount = () =>
  client.get<{ count: number }>('/notifications/me/unread-count')

export const markNotificationRead = (id: string) =>
  client.patch(`/notifications/${id}/read`)

export const markAllNotificationsRead = () =>
  client.patch('/notifications/me/read-all')

export const createGuestBooking = (data: GuestBookingRequest) =>
  client.post<BookingCreated>('/guest-bookings', data)

export const lookupGuestBooking = (data: GuestLookupRequest) =>
  client.post<GuestBookingDetail>('/guest-bookings/lookup', data)

// ==================== Admin ====================
export interface PropertyInput {
  name: string
  name_en: string | null
  description: string
  host_name: string
  highlights: string[]
  max_guests: number
  property_type: string
  photo_url: string | null
  listed_at: string | null
  status: string
}

export const adminCreateProperty = (data: PropertyInput) =>
  client.post<Property>('/admin/properties', data)

export const adminUpdateProperty = (id: string, data: PropertyInput) =>
  client.put<Property>(`/admin/properties/${id}`, data)

export const adminDeleteProperty = (id: string) =>
  client.delete(`/admin/properties/${id}`)

export const adminGetRefunds = (status?: string) =>
  client.get('/admin/refunds', { params: status ? { status } : {} })

export const adminGetPeakDates = () =>
  client.get<PeakDate[]>('/admin/peak-dates')

export const adminCreatePeakDate = (data: Omit<PeakDate, 'id'>) =>
  client.post<PeakDate>('/admin/peak-dates', data)

export const adminUpdatePeakDate = (id: string, data: Omit<PeakDate, 'id'>) =>
  client.put<PeakDate>(`/admin/peak-dates/${id}`, data)

export const adminDeletePeakDate = (id: string) =>
  client.delete(`/admin/peak-dates/${id}`)

export const adminGetBoardTypes = () =>
  client.get<BoardType[]>('/admin/board-types')

export const adminCreateBoardType = (data: Omit<BoardType, 'id'>) =>
  client.post<BoardType>('/admin/board-types', data)

export const adminUpdateBoardType = (id: string, data: Omit<BoardType, 'id'>) =>
  client.put<BoardType>(`/admin/board-types/${id}`, data)

export const adminDeleteBoardType = (id: string) =>
  client.delete(`/admin/board-types/${id}`)

// ==================== Wishlists ====================
export const getMyWishlist = () =>
  client.get<Wishlist[]>('/wishlists/me')

export const addWishlist = (propertyId: string) =>
  client.post<Wishlist>(`/wishlists/${propertyId}`)

export const removeWishlist = (propertyId: string) =>
  client.delete(`/wishlists/${propertyId}`)

export const checkWishlist = (propertyId: string) =>
  client.get<{ is_wishlist: boolean }>(`/wishlists/check/${propertyId}`)

// ==================== Reviews ====================
export const getPropertyReviews = (propertyId: string) =>
  client.get<Review[]>(`/properties/${propertyId}/reviews`)

export const createReview = (propertyId: string, data: { rating: number; content?: string }) =>
  client.post<Review>(`/properties/${propertyId}/reviews`, data)

export const updateReview = (reviewId: string, data: { rating: number; content?: string }) =>
  client.put<Review>(`/reviews/${reviewId}`, data)

export const deleteReview = (reviewId: string) =>
  client.delete(`/reviews/${reviewId}`)

export const toggleReviewHelpful = (reviewId: string) =>
  client.post<{ review_id: string; helpful_count: number }>(`/reviews/${reviewId}/helpful`)

export const reportReview = (reviewId: string, reason?: string) =>
  client.post(`/reviews/${reviewId}/report`, null, { params: reason ? { reason } : {} })

export const getMyReviews = () =>
  client.get<Review[]>('/properties/me/reviews')  // route registered before /{property_id}/reviews

// ==================== Coupons ====================
export const getMyCoupons = () =>
  client.get<UserCoupon[]>('/coupons/me')

export const issueCoupon = (coupon_code: string) =>
  client.post<UserCoupon>('/coupons/issue', { coupon_code })

// ==================== Points ====================
export const getMyPoints = () =>
  client.get<PointBalance>('/points/me')

// ==================== AddOn ====================
export const getAddOnCategories = () =>
  client.get<AddOnCategory[]>('/addons')

// ==================== Memberships ====================
export const getMembershipProducts = () =>
  client.get<MembershipProduct[]>('/memberships/products')

export const getMyMemberships = () =>
  client.get<Membership[]>('/memberships/me')

export const subscribeMembership = (productId: string) =>
  client.post<Membership>(`/memberships/${productId}/subscribe`)

export const cancelMembership = (membershipId: string) =>
  client.delete(`/memberships/${membershipId}/cancel`)

// ==================== Notification Settings ====================
export const getNotificationSettings = () =>
  client.get<NotificationSetting>('/notification-settings/me')

export const updateNotificationSettings = (data: Partial<NotificationSetting>) =>
  client.put<NotificationSetting>('/notification-settings/me', data)

// ==================== User Activities ====================
export const getMyActivities = () =>
  client.get<UserActivity[]>('/activities/me')

// ==================== Admin Coupons ====================
export const adminGetCoupons = () =>
  client.get<CouponMaster[]>('/admin/coupons')

export const adminCreateCoupon = (data: Omit<CouponMaster, 'id' | 'issued_count' | 'is_active'>) =>
  client.post<CouponMaster>('/admin/coupons', data)

export const adminToggleCoupon = (id: string) =>
  client.patch(`/admin/coupons/${id}/toggle`)

// ==================== Admin Reviews ====================
export const adminGetReviews = (status?: string) =>
  client.get<Review[]>('/admin/reviews', { params: status ? { status } : {} })

export const adminUpdateReviewStatus = (reviewId: string, status_code: string) =>
  client.patch(`/admin/reviews/${reviewId}/status`, null, { params: { status_code } })
