'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

const NAV = [
  { path: '/admin', label: '대시보드', exact: true },
  { path: '/admin/properties', label: '숙소 관리' },
  { path: '/admin/stay-dates', label: '숙박 관리' },
  { path: '/admin/users', label: '사용자 관리' },
  { path: '/admin/refunds', label: '환불 관리' },
  { path: '/admin/peak-dates', label: '특별 요금일' },
  { path: '/admin/coupons', label: '쿠폰 관리' },
  { path: '/admin/reviews', label: '리뷰 관리' },
  // 아래 넷은 다른 서비스의 API 를 부른다. 운영자가 하는 일 기준으로 한 줄에 놓는다.
  { path: '/admin/growth', label: '그로스 대시보드' },
  { path: '/admin/forecast', label: '수요 예측' },
  { path: '/admin/content', label: '콘텐츠 생성' },
  { path: '/admin/support', label: '상담 승인' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') router.replace('/')
  }, [user])

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <aside className="w-48 bg-white border-r border-gray-200 flex-shrink-0">
        <nav className="py-4">
          <p className="px-4 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            관리자
          </p>
          {NAV.map(({ path, label, exact }) => {
            const active = exact ? pathname === path : pathname.startsWith(path)
            return (
              <Link
                key={path}
                href={path}
                className={`block px-4 py-2.5 text-sm font-medium border-r-2 transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700 border-blue-600'
                    : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  )
}
