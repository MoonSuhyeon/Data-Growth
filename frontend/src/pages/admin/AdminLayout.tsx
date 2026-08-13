import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { path: '/admin', label: '대시보드', exact: true },
  { path: '/admin/properties', label: '숙소 관리' },
  { path: '/admin/stay-dates', label: '숙박 관리' },
  { path: '/admin/users', label: '사용자 관리' },
  { path: '/admin/refunds', label: '환불 관리' },
  { path: '/admin/peak-dates', label: '특별 요금일' },
  { path: '/admin/coupons', label: '쿠폰 관리' },
  { path: '/admin/reviews', label: '리뷰 관리' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') navigate('/', { replace: true })
  }, [user, navigate])

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
                to={path}
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
