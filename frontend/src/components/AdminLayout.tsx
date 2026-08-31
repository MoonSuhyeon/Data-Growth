'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

/**
 * 사이드바를 두 무리로 나눈다.
 *
 * 열두 개를 한 줄로 세워 두면 어디까지가 한 종류인지 눈으로 세어야 한다. 이
 * 콘솔에는 실제로 성격이 다른 두 가지가 섞여 있다 — **예약 백엔드를 직접
 * 만지는 운영 화면**과, **다른 서비스의 API 를 불러 보는 분석 화면**이다.
 * 나눠 두면 하나가 안 뜰 때 어느 서비스가 죽었는지도 바로 짐작된다.
 */
const NAV_GROUPS = [
  {
    title: '운영',
    items: [
      { path: '/admin', label: '대시보드', exact: true },
      { path: '/admin/properties', label: '숙소 관리', exact: false },
      { path: '/admin/stay-dates', label: '숙박 관리', exact: false },
      { path: '/admin/users', label: '사용자 관리', exact: false },
      { path: '/admin/refunds', label: '환불 관리', exact: false },
      { path: '/admin/peak-dates', label: '특별 요금일', exact: false },
      { path: '/admin/coupons', label: '쿠폰 관리', exact: false },
      { path: '/admin/reviews', label: '리뷰 관리', exact: false },
    ],
  },
  {
    title: '분석 · AI',
    items: [
      { path: '/admin/sales', label: '영업 기회', exact: false },
      { path: '/admin/growth', label: '그로스 대시보드', exact: false },
      { path: '/admin/forecast', label: '수요 예측', exact: false },
      { path: '/admin/content', label: '콘텐츠 생성', exact: false },
      { path: '/admin/support', label: '상담 승인', exact: false },
    ],
  },
] as const

/** 상단 헤더 높이. `Navbar` 와 같아야 사이드바가 화면에 딱 맞는다. */
const HEADER_H = 76

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') router.replace('/')
  }, [user])

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="flex" style={{ minHeight: `calc(100vh - ${HEADER_H}px)` }}>
      {/* 사이드바
          `w-48`(192px)에 `px-4 py-2.5` 였다. "그로스 대시보드" 가 겨우 들어가는
          폭이라 글자가 벽에 붙어 보였다. 폭과 안쪽 여백을 같이 늘린다 —
          **글자를 줄이는 것보다 자리를 넓히는 것이 먼저다.** */}
      <aside
        className="w-[236px] shrink-0 border-r border-line bg-white self-start sticky"
        style={{ top: HEADER_H, height: `calc(100vh - ${HEADER_H}px)` }}
      >
        <nav className="py-7 overflow-y-auto h-full">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.title} className={gi > 0 ? 'mt-8 pt-8 border-t border-line' : ''}>
              <p className="px-6 pb-3.5 text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em]">
                {group.title}
              </p>
              {group.items.map(({ path, label, exact }) => {
                const active = exact ? pathname === path : pathname.startsWith(path)
                return (
                  <Link
                    key={path}
                    href={path}
                    aria-current={active ? 'page' : undefined}
                    className={`block px-6 py-3 text-[14px] leading-[1.5] transition-colors border-l-[3px] ${
                      active
                        ? 'bg-gold-50 text-gold-800 border-gold-500 font-semibold'
                        : 'text-ink-soft border-transparent font-normal hover:bg-mist hover:text-ink'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* 본문. 바탕을 회색으로 두면 흰 카드가 종이처럼 떠 보이는데, 이 콘솔은
          표가 많아서 그 대비가 오히려 눈을 피곤하게 한다. 흰 바탕에 선으로
          구분한다. */}
      {/* **여백은 여기서 한 번만 준다.**
          화면마다 `p-6`·`p-8`·없음이 섞여 있어서, 어떤 화면은 사이드바에 글자가
          붙고 어떤 화면은 넉넉했다. 한곳에서 주면 어긋날 수가 없다. */}
      <main className="flex-1 min-w-0 bg-canvas px-8 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  )
}
