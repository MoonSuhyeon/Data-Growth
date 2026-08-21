'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getMyBookings } from '@/api/properties'
import { useAuthStore } from '@/store/authStore'
import type { DetailedBooking } from '@/types'

export default function RoomChangePage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { user } = useAuthStore()
  const router = useRouter()

  const [booking, setBooking] = useState<DetailedBooking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (!bookingId) return

    getMyBookings().then((res) => {
      const found = res.data.find((b) => b.id === bookingId)
      if (!found) { router.push('/my/bookings'); return }
      if (found.status !== 'CONFIRMED') { router.push('/my/bookings'); return }
      setBooking(found)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user, bookingId])

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-48 bg-mist rounded-xl" />
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 text-center text-ink-faint">
        <p>예약를 찾을 수 없습니다.</p>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-ink mb-2">객실 변경</h1>
      <p className="text-sm text-ink-faint mb-6">
        {booking.property_name} · {booking.property_name} {booking.room_type_name}
      </p>

      <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-gold-800 mb-1">현재 객실</p>
        <p className="text-gold-700">{booking.rooms.join(', ')}</p>
      </div>

      <div className="bg-white border border-line rounded-xl p-6 text-center text-ink-faint">
        <p className="text-base mb-2">객실 변경은 재예약 방식으로 진행됩니다.</p>
        <p className="text-sm mb-4 text-ink-faint">
          먼저 기존 예약를 환불한 후, 원하는 객실으로 새로 예약해 주세요.
        </p>
        <button
          onClick={() => router.push('/my/bookings')}
          className="text-sm text-gold-700 hover:underline"
        >
          예약 내역으로 돌아가기
        </button>
      </div>
    </main>
  )
}
