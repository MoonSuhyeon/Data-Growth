'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { getUnreadNotificationCount } from '../api/properties'

/**
 * 컨테이너 규격. **모든 섹션이 이 한 줄을 쓴다.**
 *
 * 좌우 여백은 화면이 넓어질수록 커진다 — 24px / 40px / 80px. 넓은 화면에서
 * 24px 만 두면 내용이 가장자리에 붙어 보이고, 좁은 화면에서 80px 을 두면
 * 카드가 뭉개진다.
 *
 * **이 상수만으로는 여백이 안 나왔었다.** `globals.css` 의 유니버설 리셋이
 * 레이어 밖에 있어서 `px-*` 와 `mx-auto` 를 통째로 이기고 있었다. 자세한
 * 내용은 그 파일에 적어 뒀다.
 */
export const SHELL = 'w-full max-w-[1760px] mx-auto px-6 sm:px-10 xl:px-20'

/*
 * 상단 카테고리 탭은 두지 않는다.
 *
 * 에어비앤비를 따라 전체·숙소·체험·서비스를 놨다가 체험·서비스를 뺐고,
 * 남은 전체·숙소는 **같은 것을 가리키는 두 이름**이었다. 이 서비스가 파는 것은
 * 숙소뿐이라 고를 것이 없다. 선택지가 하나뿐인 선택 UI 는 화면만 차지한다.
 *
 * 카테고리를 실제로 고르는 자리는 본문의 지역·유형 칩이다.
 */

const MY_MENU = [
  { to: '/my/bookings', label: '내 예약' },
  { to: '/my/wishlists', label: '저장한 숙소' },
  { to: '/my/reviews', label: '내 후기' },
  { to: '/my/coupons', label: '쿠폰' },
  { to: '/my/points', label: '포인트' },
  { to: '/my/notification-settings', label: '알림 설정' },
] as const

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
    <header className="sticky top-0 z-50 bg-canvas/95 backdrop-blur-sm border-b border-line">
      <div className={`${SHELL} h-[76px] flex items-center justify-between gap-8`}>

        {/* ── 로고 (좌)
             워드마크를 세리프 + 골드 그라디언트로 뒀었다. 20px 에서 읽기 나빴다 —
             그라디언트로 칠한 글자는 획마다 밝기가 달라 대비가 무너지고,
             세리프의 가는 획이 거기서 먼저 사라진다.

             **본문과 같은 산세리프에 단색으로 바꾼다.** 브랜드는 숫자 `2` 하나만
             골드로 집어서 만든다 — 글자 전체를 칠하는 것보다 눈에 더 남는다.
             부제("Stay Curated")는 뺐다. 로고 그림이 이미 같은 말을 하고 있고,
             줄이 둘이면 헤더가 무거워진다. */}
        <Link href="/" className="flex items-center gap-2.5 select-none shrink-0">
          <Image src="/h2g-logo.png" alt="" width={162} height={233} priority className="h-9 w-auto" />
          <span className="hidden sm:block text-[21px] font-bold tracking-[-0.02em] text-ink leading-none">
            Host <span className="text-gold-600">2</span> Guest
          </span>
        </Link>

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
