import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MovieDetail from './pages/MovieDetail'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import MyNotifications from './pages/MyNotifications'
import MyFavorites from './pages/MyFavorites'
import MyReviews from './pages/MyReviews'
import MyCoupons from './pages/MyCoupons'
import MyPoints from './pages/MyPoints'
import MyNotificationSettings from './pages/MyNotificationSettings'
import ReceiptPage from './pages/ReceiptPage'
import SeatChangePage from './pages/SeatChangePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMovies from './pages/admin/AdminMovies'
import AdminScreenings from './pages/admin/AdminScreenings'
import AdminUsers from './pages/admin/AdminUsers'
import AdminRefunds from './pages/admin/AdminRefunds'
import AdminSpecialPricingDays from './pages/admin/AdminSpecialPricingDays'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminReviews from './pages/admin/AdminReviews'
import TheaterList from './pages/TheaterList'
import TheaterScreenings from './pages/TheaterScreenings'
import GuestLookup from './pages/GuestLookup'
import { useAuthStore } from './store/authStore'

export default function App() {
  const { initializeAuth, isInitializing } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [])

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my/bookings" element={<MyBookings />} />
          <Route path="/my/notifications" element={<MyNotifications />} />
          <Route path="/my/favorites" element={<MyFavorites />} />
          <Route path="/my/reviews" element={<MyReviews />} />
          <Route path="/my/coupons" element={<MyCoupons />} />
          <Route path="/my/points" element={<MyPoints />} />
          <Route path="/my/notification-settings" element={<MyNotificationSettings />} />
          <Route path="/bookings/:bookingId/receipt" element={<ReceiptPage />} />
          <Route path="/bookings/:bookingId/change-seats" element={<SeatChangePage />} />
          <Route path="/theaters" element={<TheaterList />} />
          <Route path="/theaters/:id" element={<TheaterScreenings />} />
          <Route path="/booking/lookup" element={<GuestLookup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<AdminMovies />} />
          <Route path="/admin/screenings" element={<AdminScreenings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/refunds" element={<AdminRefunds />} />
          <Route path="/admin/special-pricing-days" element={<AdminSpecialPricingDays />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Routes>
      </div>
    </Router>
  )
}
