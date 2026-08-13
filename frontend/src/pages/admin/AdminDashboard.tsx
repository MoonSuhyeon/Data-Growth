import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import client from '../../api/client'

interface AdminStats {
  total_users: number
  today_bookings: number
  today_revenue: number
  now_showing_count: number
}

interface BookingItem {
  id: string
  booking_number: string
  user_name: string
  property_name: string
  total_price: number
  status: string
  booked_at: string
}

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: '확정',
  PENDING: '대기',
  CANCELLED: '취소',
}
const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: 'text-green-700 bg-green-50',
  PENDING: 'text-yellow-700 bg-yellow-50',
  CANCELLED: 'text-gray-400 bg-gray-100',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      client.get<AdminStats>('/admin/stats'),
      client.get<BookingItem[]>('/admin/bookings/recent'),
    ])
      .then(([s, b]) => {
        setStats(s.data)
        setBookings(b.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = stats
    ? [
        { label: '전체 회원', value: stats.total_users.toLocaleString() + '명', color: 'text-blue-600' },
        { label: '오늘 예약', value: stats.today_bookings.toLocaleString() + '건', color: 'text-green-600' },
        { label: '오늘 매출', value: stats.today_revenue.toLocaleString() + '원', color: 'text-purple-600' },
        { label: '예약 가능', value: stats.now_showing_count.toLocaleString() + '편', color: 'text-orange-500' },
      ]
    : []

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl">
        <h1 className="text-xl font-bold text-gray-900 mb-6">대시보드</h1>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {cards.map((c) => (
                <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                  <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700">최근 예약</h2>
              </div>
              {bookings.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-10">예약 내역이 없습니다.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">예약번호</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">회원</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">숙소</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">금액</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">상태</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">일시</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-400">
                          {b.booking_number.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{b.user_name}</td>
                        <td className="px-4 py-3 text-gray-700">{b.property_name}</td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {b.total_price.toLocaleString()}원
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLOR[b.status] ?? ''}`}
                          >
                            {STATUS_LABEL[b.status] ?? b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
                          {new Date(b.booked_at).toLocaleString('ko-KR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
