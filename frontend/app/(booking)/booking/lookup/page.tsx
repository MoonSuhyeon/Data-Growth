'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { lookupGuestBooking } from '@/api/properties'
import type { GuestBookingDetail } from '@/types'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

export default function GuestLookup() {
  const [bookingNumber, setBookingNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<GuestBookingDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLookup = async () => {
    if (!bookingNumber.trim() || !phone.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await lookupGuestBooking({
        booking_number: bookingNumber.trim(),
        phone: phone.trim(),
      })
      setResult(res.data)
    } catch {
      setError('예약 내역을 찾을 수 없습니다. 예약번호와 연락처를 확인해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-2">비회원 예약 조회</h1>
      <p className="text-sm text-ink-faint mb-6">예약 시 입력한 예약번호와 연락처로 조회하세요.</p>

      {!result ? (
        <div className="bg-white border border-line rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">예약번호</label>
            <input
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              placeholder="BK-XXXXXXXX"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">연락처</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleLookup}
            disabled={loading || !bookingNumber.trim() || !phone.trim()}
            className="w-full bg-gilt hover:brightness-105 disabled:opacity-45 text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
          >
            {loading ? '조회 중...' : '조회하기'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="bg-gilt px-4 py-3">
              <p className="text-xs text-white/70">예약번호</p>
              <p className="text-lg font-mono font-bold text-white">{result.booking_number}</p>
            </div>
            <div className="p-4 text-sm space-y-2 text-ink-soft">
              <div className="flex justify-between">
                <span className="text-ink-faint">예약자</span>
                <span className="font-medium text-ink">{result.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-faint">연락처</span>
                <span>{result.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-faint">숙소</span>
                <span className="font-medium text-ink">{result.property_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-faint">숙소</span>
                <span>{result.property_name} · {result.room_type_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-faint">일시</span>
                <span>
                  {new Date(result.check_in).toLocaleDateString('ko-KR', {
                    month: 'long', day: 'numeric', weekday: 'short',
                  })}{' '}{formatTime(result.check_in)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-faint">객실</span>
                <span>{result.rooms.join(', ')}</span>
              </div>
              <div className="flex justify-between font-bold text-ink pt-2 border-t border-line">
                <span>결제 금액</span>
                <span className="text-gold-700">{result.total_price.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {result.tickets.length > 0 && (
            <div className="space-y-3">
              {result.tickets.map((ticket) => (
                <div
                  key={ticket.qr_code}
                  className="bg-white border border-line rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="flex-shrink-0 p-1.5 border border-line rounded-xl">
                    <QRCodeSVG value={ticket.qr_code} size={80} />
                  </div>
                  <div>
                    <p className="font-bold text-ink">객실 {ticket.room_label}</p>
                    <p className="text-xs text-ink-faint font-mono mt-0.5 break-all">{ticket.qr_code}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setResult(null); setBookingNumber(''); setPhone('') }}
            className="w-full border border-line text-ink-soft py-2.5 rounded-xl text-sm font-medium hover:bg-mist"
          >
            다시 조회하기
          </button>
        </div>
      )}
    </main>
  )
}
