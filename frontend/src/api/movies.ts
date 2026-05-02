import client from './client'
import type {
  Movie, Theater, Screening, SeatInfo, BookingCreated, PaymentMethod,
  AudienceType, GuestBookingRequest, GuestLookupRequest, GuestBookingDetail,
  DetailedBooking, Refund, Receipt, Genre, Notification, ScreeningFormat, SpecialPricingDay,
  Favorite, Review, UserCoupon, CouponMaster, PointBalance, MenuCategory,
  MembershipProduct, Membership, NotificationSetting, UserActivity,
} from '../types'

export const getMovies = (status?: string) =>
  client.get<Movie[]>('/movies', { params: status ? { status } : {} })

export const getMovie = (id: string) =>
  client.get<Movie>(`/movies/${id}`)

export const getTheaters = () =>
  client.get<Theater[]>('/theaters')

export const getScreenings = (params: {
  movie_id?: string
  theater_id?: string
  date?: string
}) => client.get<Screening[]>('/screenings', { params })

export const getScreening = (id: string) =>
  client.get<Screening>(`/screenings/${id}`)

export const getScreeningSeats = (screeningId: string) =>
  client.get<{ screening_id: string; seats: SeatInfo[] }>(`/screenings/${screeningId}/seats`)

export const holdSeats = (data: { screening_id: string; seat_ids: string[] }) =>
  client.post<{ screening_id: string; seat_ids: string[]; expires_at: string }>('/seat-holds', data)

export const releaseSeats = (data: { screening_id: string; seat_ids: string[] }) =>
  client.delete('/seat-holds', { data })

export const getAudienceTypes = () =>
  client.get<AudienceType[]>('/audience-types')

export const createBooking = (data: {
  screening_id: string
  seat_ids: string[]
  payment_method: PaymentMethod
  audience_breakdown?: Record<string, number>
}) => client.post<BookingCreated>('/bookings', data)

export const getMyBookings = () =>
  client.get<DetailedBooking[]>('/bookings/me')

export const requestRefund = (bookingId: string, reason?: string) =>
  client.post<Refund>(`/bookings/${bookingId}/refund`, { reason })

export const getReceipt = (bookingId: string) =>
  client.get<Receipt>(`/bookings/${bookingId}/receipt`)

export const changeSeats = (bookingId: string, data: { new_seat_ids: string[]; reason?: string }) =>
  client.post(`/bookings/${bookingId}/change-seats`, data)

export const getGenres = () =>
  client.get<Genre[]>('/genres')

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
export interface MovieInput {
  title: string
  title_en: string | null
  synopsis: string
  director: string
  cast: string[]
  runtime: number
  rating: string
  poster_url: string | null
  release_date: string | null
  status: string
}

export const adminCreateMovie = (data: MovieInput) =>
  client.post<Movie>('/admin/movies', data)

export const adminUpdateMovie = (id: string, data: MovieInput) =>
  client.put<Movie>(`/admin/movies/${id}`, data)

export const adminDeleteMovie = (id: string) =>
  client.delete(`/admin/movies/${id}`)

export const adminGetRefunds = (status?: string) =>
  client.get('/admin/refunds', { params: status ? { status } : {} })

export const adminGetSpecialPricingDays = () =>
  client.get<SpecialPricingDay[]>('/admin/special-pricing-days')

export const adminCreateSpecialPricingDay = (data: Omit<SpecialPricingDay, 'id'>) =>
  client.post<SpecialPricingDay>('/admin/special-pricing-days', data)

export const adminUpdateSpecialPricingDay = (id: string, data: Omit<SpecialPricingDay, 'id'>) =>
  client.put<SpecialPricingDay>(`/admin/special-pricing-days/${id}`, data)

export const adminDeleteSpecialPricingDay = (id: string) =>
  client.delete(`/admin/special-pricing-days/${id}`)

export const adminGetScreeningFormats = () =>
  client.get<ScreeningFormat[]>('/admin/screening-formats')

export const adminCreateScreeningFormat = (data: Omit<ScreeningFormat, 'id'>) =>
  client.post<ScreeningFormat>('/admin/screening-formats', data)

export const adminUpdateScreeningFormat = (id: string, data: Omit<ScreeningFormat, 'id'>) =>
  client.put<ScreeningFormat>(`/admin/screening-formats/${id}`, data)

export const adminDeleteScreeningFormat = (id: string) =>
  client.delete(`/admin/screening-formats/${id}`)

// ==================== Favorites ====================
export const getMyFavorites = () =>
  client.get<Favorite[]>('/favorites/me')

export const addFavorite = (movieId: string) =>
  client.post<Favorite>(`/favorites/${movieId}`)

export const removeFavorite = (movieId: string) =>
  client.delete(`/favorites/${movieId}`)

export const checkFavorite = (movieId: string) =>
  client.get<{ is_favorite: boolean }>(`/favorites/check/${movieId}`)

// ==================== Reviews ====================
export const getMovieReviews = (movieId: string) =>
  client.get<Review[]>(`/movies/${movieId}/reviews`)

export const createReview = (movieId: string, data: { rating: number; content?: string; is_spoiler?: boolean }) =>
  client.post<Review>(`/movies/${movieId}/reviews`, data)

export const updateReview = (reviewId: string, data: { rating: number; content?: string; is_spoiler?: boolean }) =>
  client.put<Review>(`/reviews/${reviewId}`, data)

export const deleteReview = (reviewId: string) =>
  client.delete(`/reviews/${reviewId}`)

export const toggleReviewHelpful = (reviewId: string) =>
  client.post<{ review_id: string; helpful_count: number }>(`/reviews/${reviewId}/helpful`)

export const reportReview = (reviewId: string, reason?: string) =>
  client.post(`/reviews/${reviewId}/report`, null, { params: reason ? { reason } : {} })

export const getMyReviews = () =>
  client.get<Review[]>('/movies/me/reviews')  // route registered before /{movie_id}/reviews

// ==================== Coupons ====================
export const getMyCoupons = () =>
  client.get<UserCoupon[]>('/coupons/me')

export const issueCoupon = (coupon_code: string) =>
  client.post<UserCoupon>('/coupons/issue', { coupon_code })

// ==================== Points ====================
export const getMyPoints = () =>
  client.get<PointBalance>('/points/me')

// ==================== Menu ====================
export const getMenuCategories = () =>
  client.get<MenuCategory[]>('/menus')

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
