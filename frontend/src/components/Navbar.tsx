'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState, useRef } from 'react'
import { getUnreadNotificationCount } from '../api/properties'

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [myAddOnOpen, setMyAddOnOpen] = useState(false)
  const addonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) { setUnreadCount(0); return }
    getUnreadNotificationCount()
      .then((res) => setUnreadCount(res.data.count))
      .catch(() => {})
  }, [user])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addonRef.current && !addonRef.current.contains(e.target as Node)) {
        setMyAddOnOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm" style={{ borderBottom: '2.5px solid #8B1A2B' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 select-none">
          <span className="text-2xl font-black tracking-tight" style={{ color: '#8B1A2B' }}>CINE</span>
          <span className="text-2xl font-black tracking-tight text-orange-500">BOOK</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-5 text-sm">
          {user ? (
            <>
              {/* Notification bell */}
              <Link href="/my/notifications" className="relative text-gray-600 hover:text-orange-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* My AddOn dropdown */}
              <div className="relative" ref={addonRef}>
                <button
                  onClick={() => setMyAddOnOpen(!myAddOnOpen)}
                  className="flex items-center gap-1.5 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{user.name}님</span>
                  <span className="sm:hidden">마이</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${myAddOnOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {myAddOnOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                    {[
                      { to: '/my/bookings', label: '내 예약' },
                      { to: '/my/wishlists', label: '위시리스트한 숙소' },
                      { to: '/my/reviews', label: '내 리뷰' },
                      { to: '/my/coupons', label: '쿠폰' },
                      { to: '/my/points', label: '포인트' },
                      { to: '/my/notification-settings', label: '알림 설정' },
                    ].map(({ to, label }) => (
                      <Link
                        key={to}
                        href={to}
                        onClick={() => setMyAddOnOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50 hover:text-orange-500 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    <div className="mx-3 my-1 border-t border-gray-100" />
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setMyAddOnOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium hover:bg-sky-50 transition-colors"
                        style={{ color: '#8B1A2B' }}
                      >
                        관리자 페이지
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-sky-50 hover:text-gray-600 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/booking/lookup" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">예약 조회</Link>
              <Link href="/login" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">로그인</Link>
              <Link
                href="/signup"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-xl text-sm font-bold transition-colors shadow-sm shadow-orange-200"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
