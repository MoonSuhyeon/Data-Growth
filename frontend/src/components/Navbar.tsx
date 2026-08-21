'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { getUnreadNotificationCount } from '../api/properties'

/**
 * 컨테이너 규격. **모든 섹션이 이 한 줄을 쓴다.**
 *
 * 네비바가 `max-w-6xl px-4`, 히어로가 또 다르면 요소들의 왼쪽 끝이 안 맞고,
 * 그게 "화면이 왼쪽으로 쏠려 보인다" 의 실체다.
 */
export const SHELL = 'max-w-[1440px] mx-auto px-6 md:px-10'

/**
 * 상단 카테고리 탭.
 *
 * 에어비앤비의 전체·숙소·체험·서비스를 그대로 따른다. 다만 **이 서비스에는
 * 숙소밖에 없다.** 체험·서비스를 눌러도 아무 일이 없게 두면 지난번에 걷어낸
 * 죽은 버튼이 되므로, 눌리기는 하되 **"아직 열지 않았다" 는 화면으로 데려간다.**
 * 누를 수 있게 생겼으면 무슨 일이든 일어나야 한다.
 */
export const TABS = [
  { key: 'all', label: '전체', icon: '🌐', ready: true },
  { key: 'stays', label: '숙소', icon: '🏡', ready: true },
  { key: 'experiences', label: '체험', icon: '🎈', ready: false },
  { key: 'services', label: '서비스', icon: '🛎️', ready: false },
] as const

export type TabKey = (typeof TABS)[number]['key']

const MY_MENU = [
  { to: '/my/bookings', label: '내 예약' },
  { to: '/my/wishlists', label: '저장한 숙소' },
  { to: '/my/reviews', label: '내 후기' },
  { to: '/my/coupons', label: '쿠폰' },
  { to: '/my/points', label: '포인트' },
  { to: '/my/notification-settings', label: '알림 설정' },
] as const

/* ─────────────────────────────────────────────── 중앙 탭 */

function CategoryTabs() {
  const params = useSearchParams()
  const pathname = usePathname()
  const active = (params.get('tab') as TabKey | null) ?? 'all'
  // 탭은 홈에서만 뜻이 있다. 다른 화면에서 밑줄을 그리면 그 화면이 그 카테고리인
  // 것처럼 보인다.
  const onHome = pathname === '/'

  return (
    <div className="hidden md:flex items-end gap-9">
      {TABS.map((t) => {
        const selected = onHome && active === t.key
        return (
          <Link
            key={t.key}
            href={t.key === 'all' ? '/' : `/?tab=${t.key}`}
            className={`flex flex-col items-center gap-1.5 pb-2.5 border-b-2 transition-colors ${
              selected
                ? 'border-charcoal text-ink font-semibold'
                : 'border-transparent text-ink-soft font-normal hover:text-ink'
            }`}
          >
            <span className="text-[22px] leading-none" aria-hidden>{t.icon}</span>
            <span className="text-[14px] leading-[1.4] tracking-[0.01em]">{t.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────── 네비바 */

export default function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) { setUnreadCount(0); return }
    getUnreadNotificationCount()
      .then((res) => setUnreadCount(res.data.count))
      .catch(() => {})
  }, [user])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 열린 메뉴는 Esc 로도 닫혀야 한다. 바깥 클릭만 두면 키보드로 쓰는 사람은
  // 메뉴를 닫을 방법이 없다.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-line">
      <div className={`${SHELL} h-[88px] flex items-center justify-between gap-8`}>

        {/* ── 로고 (좌) */}
        <Link href="/" className="flex items-center gap-2.5 select-none shrink-0">
          <Image src="/h2g-logo.png" alt="" width={162} height={233} priority className="h-10 w-auto" />
          <span className="hidden sm:flex flex-col leading-none">
            <span className="text-[20px] font-medium tracking-[0.01em] text-gilt font-[family-name:var(--font-display)]">
              Host 2 Guest
            </span>
            <span className="text-[11px] leading-[1.4] tracking-[0.3em] text-ink-faint uppercase mt-1.5">
              Stay Curated
            </span>
          </span>
        </Link>

        {/* ── 카테고리 탭 (중앙)
             `useSearchParams` 는 프리렌더 중에 Suspense 경계를 요구한다. 없으면
             빌드가 통째로 실패하므로 탭만 따로 감싼다. */}
        <Suspense fallback={<div className="hidden md:block h-[52px]" />}>
          <CategoryTabs />
        </Suspense>

        {/* ── 우측 메뉴 */}
        <div className="flex items-center gap-1.5 text-[14px] shrink-0">
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
                  <span className="absolute top-1 right-1 bg-burgundy text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-0.5">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2.5 pl-3.5 pr-2 py-2 rounded-full border border-line bg-white hover:shadow-md transition-shadow"
                >
                  <svg className={`w-4 h-4 text-ink-soft transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="w-8 h-8 rounded-full bg-gilt text-white grid place-items-center text-[13px] font-bold">
                    {user.name?.[0] ?? '·'}
                  </span>
                </button>

                {menuOpen && (
                  <div role="menu" className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-lg py-2.5 z-50 overflow-hidden border border-line">
                    <p className="px-5 pt-1 pb-3 text-[14px] leading-[1.5] font-semibold text-ink">{user.name}님</p>
                    <div className="mx-5 rule-gold mb-2" />
                    {MY_MENU.map(({ to, label }) => (
                      <Link
                        key={to}
                        href={to}
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="block px-5 py-3 text-[14px] leading-[1.5] text-ink-soft hover:bg-gold-50 hover:text-gold-700 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    {user.role === 'ADMIN' && (
                      <>
                        <div className="mx-5 my-2 rule-gold" />
                        <Link
                          href="/admin"
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="block px-5 py-3 text-[14px] leading-[1.5] font-semibold text-gold-700 hover:bg-gold-50 transition-colors"
                        >
                          운영 콘솔
                        </Link>
                      </>
                    )}
                    <div className="mx-5 my-2 rule-gold" />
                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      className="w-full text-left px-5 py-3 text-[14px] leading-[1.5] text-ink-faint hover:bg-gold-50 hover:text-ink-soft transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/booking/lookup" className="hidden sm:block px-4 py-2.5 rounded-full text-ink-soft hover:text-gold-700 hover:bg-gold-50 transition-colors font-medium leading-[1.5]">
                예약 조회
              </Link>
              <Link href="/login" className="px-4 py-2.5 rounded-full text-ink-soft hover:text-gold-700 hover:bg-gold-50 transition-colors font-medium leading-[1.5]">
                로그인
              </Link>
              <Link href="/signup" className="ml-1 bg-gilt text-white px-5 py-2.5 rounded-full text-[14px] font-semibold shadow-gold hover:brightness-105 transition leading-[1.5]">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
