'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState, useRef } from 'react'
import { getUnreadNotificationCount } from '../api/properties'

/**
 * 마이 메뉴. **여기 있는 항목은 전부 실제 라우트가 있다.**
 *
 * 배열로 뽑아 둔 이유가 있다 — 예전에는 JSX 안에 흩어져 있어서, 라우트를 지울
 * 때 메뉴가 같이 지워졌는지 눈으로 세어야 했다. 한 곳에 모아 두면 `app/` 아래
 * 폴더와 대조하기가 쉽다.
 */
const MY_MENU = [
  { to: '/my/bookings', label: '내 예약' },
  { to: '/my/wishlists', label: '저장한 숙소' },
  { to: '/my/reviews', label: '내 후기' },
  { to: '/my/coupons', label: '쿠폰' },
  { to: '/my/points', label: '포인트' },
  { to: '/my/notification-settings', label: '알림 설정' },
] as const

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

  // 열린 메뉴는 Esc 로도 닫혀야 한다. 바깥 클릭만 두면 키보드로 쓰는 사람은
  // 메뉴를 닫을 방법이 없다.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMyAddOnOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-6xl mx-auto px-4 h-[72px] flex items-center justify-between">

        {/* ── 브랜드 */}
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <Image
            src="/h2g-logo.png"
            alt=""
            width={162}
            height={233}
            priority
            className="h-9 w-auto"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[19px] font-semibold tracking-tight text-gilt font-[family-name:var(--font-display)]">
              Host 2 Guest
            </span>
            <span className="text-[10px] tracking-[0.28em] text-ink-faint uppercase mt-1">
              Stay Curated
            </span>
          </span>
        </Link>

        {/* ── 오른쪽 */}
        <div className="flex items-center gap-1 text-sm">
          {user ? (
            <>
              <Link
                href="/my/notifications"
                aria-label={unreadCount > 0 ? `알림 ${unreadCount}건` : '알림'}
                className="relative p-2.5 rounded-full text-ink-soft hover:text-gold-600 hover:bg-gold-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-burgundy text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* 마이 메뉴 — 에어비앤비의 알약형 트리거를 따른다 */}
              <div className="relative ml-1" ref={addonRef}>
                <button
                  onClick={() => setMyAddOnOpen(!myAddOnOpen)}
                  aria-expanded={myAddOnOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-line bg-white hover:shadow-card transition-shadow"
                >
                  <svg className={`w-4 h-4 text-ink-soft transition-transform ${myAddOnOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="w-7 h-7 rounded-full bg-gilt text-white grid place-items-center text-xs font-bold">
                    {user.name?.[0] ?? '·'}
                  </span>
                </button>

                {myAddOnOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2.5 w-56 bg-white rounded-2xl shadow-card-hover py-2 z-50 overflow-hidden border border-line"
                  >
                    <p className="px-4 pt-1 pb-2.5 text-sm font-semibold text-ink">{user.name}님</p>
                    <div className="mx-4 rule-gold mb-1.5" />
                    {MY_MENU.map(({ to, label }) => (
                      <Link
                        key={to}
                        href={to}
                        role="menuitem"
                        onClick={() => setMyAddOnOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-gold-50 hover:text-gold-700 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    {user.role === 'ADMIN' && (
                      <>
                        <div className="mx-4 my-1.5 rule-gold" />
                        <Link
                          href="/admin"
                          role="menuitem"
                          onClick={() => setMyAddOnOpen(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-gold-700 hover:bg-gold-50 transition-colors"
                        >
                          운영 콘솔
                        </Link>
                      </>
                    )}
                    <div className="mx-4 my-1.5 rule-gold" />
                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      className="w-full text-left px-4 py-2.5 text-sm text-ink-faint hover:bg-gold-50 hover:text-ink-soft transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/booking/lookup"
                className="px-3.5 py-2 rounded-full text-ink-soft hover:text-gold-700 hover:bg-gold-50 transition-colors font-medium"
              >
                예약 조회
              </Link>
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-full text-ink-soft hover:text-gold-700 hover:bg-gold-50 transition-colors font-medium"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="ml-1 bg-gilt text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-gold hover:brightness-105 transition"
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
