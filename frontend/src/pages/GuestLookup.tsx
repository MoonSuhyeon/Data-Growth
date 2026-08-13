import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { lookupGuestBooking } from '../api/properties'
import type { GuestBookingDetail } from '../types'

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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">비회원 예약 조회</h1>
      <p className="text-sm text-gray-500 mb-6">예약 시 입력한 예약번호와 연락처로 조회하세요.</p>

      {!result ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예약번호</label>
            <input
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              placeholder="BK-XXXXXXXX"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleLookup}
            disabled={loading || !bookingNumber.trim() || !phone.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
          >
            {loading ? '조회 중...' : '조회하기'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-blue-600 px-4 py-3">
              <p className="text-xs text-blue-100">예약번호</p>
              <p className="text-lg font-mono font-bold text-white">{result.booking_number}</p>
            </div>
            <div className="p-4 text-sm space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">예약자</span>
                <span className="font-medium text-gray-900">{result.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">연락처</span>
                <span>{result.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">숙소</span>
                <span className="font-medium text-gray-900">{result.property_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">숙소</span>
                <span>{result.property_name} · {result.room_type_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">일시</span>
                <span>
                  {new Date(result.check_in).toLocaleDateString('ko-KR', {
                    month: 'long', day: 'numeric', weekday: 'short',
                  })}{' '}{formatTime(result.check_in)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">객실</span>
                <span>{result.rooms.join(', ')}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>결제 금액</span>
                <span className="text-blue-600">{result.total_price.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {result.tickets.length > 0 && (
            <div className="space-y-3">
              {result.tickets.map((ticket) => (
                <div
                  key={ticket.qr_code}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="flex-shrink-0 p-1.5 border border-gray-200 rounded-xl">
                    <QRCodeSVG value={ticket.qr_code} size={80} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">객실 {ticket.room_label}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5 break-all">{ticket.qr_code}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setResult(null); setBookingNumber(''); setPhone('') }}
            className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            다시 조회하기
          </button>
        </div>
      )}
    </main>
  )
}
