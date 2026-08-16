'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMyBookings, requestRefund } from '@/api/properties'
import { useAuthStore } from '@/store/authStore'
import type { DetailedBooking } from '@/types'

const STATUS_LABEL: Record<string, string> = {
  PENDING: '처리중',
  CONFIRMED: '예약완료',
  CANCELLED: '취소됨',
  REFUNDED: '환불완료',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  REFUNDED: 'bg-purple-100 text-purple-700',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR')
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function MyBookings() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [bookings, setBookings] = useState<DetailedBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [refundingId, setRefundingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    getMyBookings()
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false))
  }, [user])

  const handleRefund = async (b: DetailedBooking) => {
    if (!confirm(`${b.property_name} 예약를 환불 신청하시겠습니까?\n환불 금액: ${b.total_price.toLocaleString()}원`)) return
    setRefundingId(b.id)
    try {
      await requestRefund(b.id)
      setBookings((prev) =>
        prev.map((x) => x.id === b.id ? { ...x, status: 'REFUNDED' } : x)
      )
    } catch {
      alert('환불 처리에 실패했습니다.')
    } finally {
      setRefundingId(null)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">내 예약 내역</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-36 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">예약 내역이 없습니다</p>
          <button onClick={() => router.push('/')} className="text-blue-600 text-sm hover:underline">
            숙소 보러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-start gap-3 p-4">
                {b.property_photo_url ? (
                  <img
                    src={b.property_photo_url}
                    alt={b.property_name}
                    className="w-14 aspect-[2/3] object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 aspect-[2/3] bg-gray-100 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">{b.property_name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLOR[b.status] ?? ''}`}>
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-0.5">
                    {b.property_name} · {b.room_type_name}
                    {b.board_type_name && <span className="ml-1 text-blue-600 font-medium">[{b.board_type_name}]</span>}
                  </p>
                  <p className="text-xs text-gray-500 mb-0.5">
                    {fmtDate(b.stay_date)} {fmtTime(b.check_in)} ~ {fmtTime(b.check_out)}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    객실: {b.rooms.length > 0 ? b.rooms.join(', ') : '-'} · {b.total_price.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-400 font-mono">{b.booking_number}</p>
                </div>
              </div>

              {b.status === 'CONFIRMED' && (
                <div className="border-t border-gray-100 px-4 py-2 flex gap-3">
                  <button
                    onClick={() => router.push(`/bookings/${b.id}/receipt`)}
                    className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                  >
                    영수증
                  </button>
                  <button
                    onClick={() => router.push(`/bookings/${b.id}/change-rooms`)}
                    className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                  >
                    객실 변경
                  </button>
                  <button
                    onClick={() => handleRefund(b)}
                    disabled={refundingId === b.id}
                    className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40 ml-auto"
                  >
                    {refundingId === b.id ? '처리중...' : '환불 신청'}
                  </button>
                </div>
              )}

              {b.status === 'REFUNDED' && b.refund && (
                <div className="border-t border-gray-100 px-4 py-2 text-xs text-purple-600">
                  환불 완료 · {b.refund.refund_amount.toLocaleString()}원
                  {b.refund.processed_at && ` · ${fmtDate(b.refund.processed_at)}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
