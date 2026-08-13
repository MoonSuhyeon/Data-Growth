import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PropertyDetail from './pages/PropertyDetail'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import MyNotifications from './pages/MyNotifications'
import MyWishlist from './pages/MyWishlist'
import MyReviews from './pages/MyReviews'
import MyCoupons from './pages/MyCoupons'
import MyPoints from './pages/MyPoints'
import MyNotificationSettings from './pages/MyNotificationSettings'
import ReceiptPage from './pages/ReceiptPage'
import RoomChangePage from './pages/RoomChangePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProperties from './pages/admin/AdminProperties'
import AdminStayDates from './pages/admin/AdminStayDates'
import AdminUsers from './pages/admin/AdminUsers'
import AdminRefunds from './pages/admin/AdminRefunds'
import AdminPeakDates from './pages/admin/AdminPeakDates'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminReviews from './pages/admin/AdminReviews'
import PropertyList from './pages/PropertyList'
import PropertyStayDates from './pages/PropertyStayDates'
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
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my/bookings" element={<MyBookings />} />
          <Route path="/my/notifications" element={<MyNotifications />} />
          <Route path="/my/wishlists" element={<MyWishlist />} />
          <Route path="/my/reviews" element={<MyReviews />} />
          <Route path="/my/coupons" element={<MyCoupons />} />
          <Route path="/my/points" element={<MyPoints />} />
          <Route path="/my/notification-settings" element={<MyNotificationSettings />} />
          <Route path="/bookings/:bookingId/receipt" element={<ReceiptPage />} />
          <Route path="/bookings/:bookingId/change-rooms" element={<RoomChangePage />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/properties/:id" element={<PropertyStayDates />} />
          <Route path="/booking/lookup" element={<GuestLookup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/admin/stay-dates" element={<AdminStayDates />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/refunds" element={<AdminRefunds />} />
          <Route path="/admin/peak-dates" element={<AdminPeakDates />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Routes>
      </div>
    </Router>
  )
}
