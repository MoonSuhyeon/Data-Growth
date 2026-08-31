'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMyBookings, getRefundQuote, requestRefund } from '@/api/properties'
import { track } from '@/lib/tracking'
import { useAuthStore } from '@/store/authStore'
import type { DetailedBooking } from '@/types'
import PropertyPhoto from '@/components/PropertyPhoto'

const STATUS_LABEL: Record<string, string> = {
  PENDING: '처리중',
  CONFIRMED: '예약완료',
  CANCELLED: '취소됨',
  REFUNDED: '환불완료',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-mist text-ink-faint',
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
    // **결제액이 아니라 환불액을 묻는다.**
    //
    // 예전에는 `total_price` 를 그대로 보여 줬다. 환불이 언제 취소하든 전액이던
    // 시절엔 맞았지만, 이제 정책이 금액을 정한다 — 체크인이 지났으면 0원이다.
    // 안내와 실제가 다르면 그건 안내가 아니라 오해다.
    setRefundingId(b.id)

    let quoted: number | null = null
    try {
      const q = await getRefundQuote(b.id)
      if (q.data.refundable) quoted = q.data.refund_amount
      else alert(q.data.reason ?? '환불할 수 없는 예약입니다')
    } catch {
      // 금액을 모르는 채로 환불을 넣지 않는다.
      alert('환불 금액을 확인하지 못했습니다. 잠시 뒤 다시 시도해 주세요.')
    }

    // **`null` 로 검사한다.** `if (!quoted)` 로 두면 0원이 걸린다 — 체크인이
    // 지난 예약의 환불액이 정확히 0이고, 그건 실패가 아니라 정상적인 답이다.
    if (quoted === null) { setRefundingId(null); return }

    const ok = confirm(
      `${b.property_name} 예약을 환불 신청하시겠습니까?\n` +
      `결제 금액: ${b.total_price.toLocaleString()}원\n` +
      `환불 금액: ${quoted.toLocaleString()}원`,
    )
    if (!ok) { setRefundingId(null); return }

    try {
      const res = await requestRefund(b.id)
      track({
        event_name: 'booking_cancelled',
        booking_id: b.id,
        property_id: (b as { property_id?: string }).property_id,
        /*
          `amount` 는 "이 이벤트에서 움직인 금액"이고 취소에서는 **돌려준 돈**이다.
          결제액을 보내면 정책상 절반만 환불했는데 계측에는 전액이 취소된 것으로
          남고, 순매출이 조용히 어긋난다.
        */
        amount: res.data.refund_amount,
      })
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
      <h1 className="text-xl font-bold text-ink mb-6">내 예약 내역</h1>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-36 bg-mist rounded-xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-ink-faint">
          <p className="text-lg mb-2">예약 내역이 없습니다</p>
          <button onClick={() => router.push('/')} className="text-gold-700 text-sm hover:underline">
            숙소 보러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="border border-line rounded-xl overflow-hidden">
              <div className="flex items-start gap-3 p-4">
                <div className="w-14 aspect-[2/3] rounded-lg flex-shrink-0 overflow-hidden">
                  <PropertyPhoto src={b.property_photo_url} alt={b.property_name}
                                 seed={b.property_name ?? b.id} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-ink text-sm truncate">{b.property_name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLOR[b.status] ?? ''}`}>
                      {STATUS_LABEL[b.status] ?? b.status}
                    </span>
                  </div>
                  <p className="text-xs text-ink-faint mb-0.5">
                    {b.property_name} · {b.room_type_name}
                    {b.board_type_name && <span className="ml-1 text-gold-700 font-medium">[{b.board_type_name}]</span>}
                  </p>
                  <p className="text-xs text-ink-faint mb-0.5">
                    {fmtDate(b.stay_date)} {fmtTime(b.check_in)} ~ {fmtTime(b.check_out)}
                  </p>
                  <p className="text-xs text-ink-faint mb-2">
                    객실: {b.rooms.length > 0 ? b.rooms.join(', ') : '-'} · {b.total_price.toLocaleString()}원
                  </p>
                  <p className="text-xs text-ink-faint font-mono">{b.booking_number}</p>
                </div>
              </div>

              {b.status === 'CONFIRMED' && (
                <div className="border-t border-line px-4 py-2 flex gap-3">
                  <button
                    onClick={() => router.push(`/bookings/${b.id}/receipt`)}
                    className="text-xs text-ink-soft hover:text-ink font-medium"
                  >
                    영수증
                  </button>
                  <button
                    onClick={() => router.push(`/bookings/${b.id}/change-rooms`)}
                    className="text-xs text-ink-soft hover:text-ink font-medium"
                  >
                    객실 변경
                  </button>
                  {/* 상담 에이전트 진입점.
                      **예약번호를 실어 보낸다** — 고객에게 번호를 외워서 적으라고
                      할 수 없고, 오타 하나면 남의 예약을 조회하게 된다.

                      옆의 "환불 신청" 과 하는 일이 다르다. 저쪽은 바로 환불을
                      넣고, 이쪽은 **정책과 환불 예상액을 먼저 알려주고 멈춘다.**
                      확인을 누르기 전에는 아무 일도 일어나지 않는다. */}
                  <button
                    onClick={() => router.push(`/support?booking=${encodeURIComponent(b.booking_number)}`)}
                    className="text-xs text-gold-700 hover:text-gold-800 font-medium"
                  >
                    취소 문의
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
                <div className="border-t border-line px-4 py-2 text-xs text-purple-600">
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
