'use client'

import { Suspense, useEffect, useRef, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import {
  getProperty, getStayDates, getStayDate,
  getStayDateRooms, holdRooms, releaseRooms, createBooking, createGuestBooking, getGuestTypes,
} from '@/api/properties'
import { useAuthStore } from '@/store/authStore'
import { useGuestStore } from '@/store/guestStore'
import type { Property, StayDate, RoomInfo, PaymentMethod, TicketInfo, GuestType } from '@/types'


const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CARD', label: '신용/체크카드' },
  { value: 'KAKAOPAY', label: '카카오페이' },
  { value: 'NAVERPAY', label: '네이버페이' },
]

const TERMS = [
  {
    id: 'refund_policy' as const,
    label: '이용/취소/환불 규정 안내',
    content: `1. 숙소예약

부분취소는 불가합니다. (숙소 예약만 온라인으로 4장을 예약한 경우 4장 모두 취소만 가능, 통합결제 서비스를 이용하여 숙소 예약와 부가서비스상품을 같이 결제한 경우 숙소 예약만 취소하는 것은 불가하며 숙소 예약 취소 시 구매한 부가서비스 상품도 같이 결제 취소 됨)
온라인 예약 취소는 숙소 숙박 시작 시간 20분 전까지 가능합니다.
체크인 24시간 전까지 취소 가능합니다.
현장 취소를 하는 경우, 숙박시간 이전까지만 가능하며 숙소 숙박일 이후 취소/환불/결제수단 변경은 불가합니다.
단, 일부 행사의 경우 행사 당일 취소/환불/결제 수단 변경이 불가합니다.
온라인 예약 시 웹·앱에서 예약 취소가 가능하며, 체크인 완료 후에는 온라인 취소가 불가합니다. (숙소로 직접 문의)

2. 숙소 예약와 함께 부가서비스 상품을 구매한 경우 취소

숙소와 함께 구매한 부가서비스 상품의 경우, 숙소 예약를 취소하지 않고 부가서비스 상품만 취소하는 것이 가능합니다.
단, 임원할인, 임직원카드할인, 1회용 컵보증금이 부과된 상품 결제의 경우 부가서비스상품만 취소하는 것이 불가합니다.
예약한 숙소를 취소하는 경우에는 같이 구매한 부가서비스 상품도 함께 취소됩니다.
숙소별 상품 재고 소진 시 주문이 취소 될 수 있습니다.
숙소와 함께 구매한 부가서비스 상품은 모바일 티켓에서 확인하실 수 있으며, 해당 화면에서 숙소 숙박 당일에 한해 픽업 신청 가능합니다.
고객이 지금 픽업 신청하여 해당 매장에서 주문 접수가 이루어진 경우, 즉시 상품 준비가 진행되기 때문에 결제 취소가 불가합니다.
매장의 픽업 요청에도 불구하고 고객이 수령대기시간(픽업 요청 알림 발송 시부터 20분)을 초과하여 상품을 미수령할 경우 해당 상품은 폐기될 수 있으며, 상품이 폐기된 경우 이로 인한 모든 책임은 고객이 부담합니다.
구매한 부가서비스 상품을 지금 픽업 신청하지 않으신 경우에 한하여 숙소 숙박일 이후 7일 이내에 취소 요청을 한 경우에 결제 취소/환불이 가능합니다.
결제 취소는 앱 > 더보기 > 예약/결제내역 > 해당 주문 상세 내역에서 가능합니다. 체크인 완료 후에는 온라인 취소가 불가합니다. (숙소로 직접 문의)

3. 패스트오더

▸ 바로픽업
결제와 동시에 해당 매장으로 주문이 전송되며, 매장에서 주문 접수를 한 이후에는 제조가 시작되므로 결제 취소는 불가합니다.
매장 상황으로 인하여 고객의 주문 요청에 대해 매장에서 주문 접수가 지연되거나 주문 접수를 하지 아니하는 경우, 고객에게 어플리케이션 PUSH 또는 알림톡으로 해당 사항을 안내합니다. 이 경우 구매자에 한하여 '결제취소' 가능하며 매장의 사정으로 준비가 어려운 경우 주문 취소 및 구매자분께 환불 처리 됩니다.
고객이 패스트오더를 통해 주문한 상품이 제조 완료된 경우, 해당 매장에서 고객에게 알림을 통해 픽업 요청을 전달합니다. 해당 매장의 픽업 요청 후 수령대기시간(픽업 안내 시로부터 20분)이 지났음에도 고객이 상품을 미수령한 경우, 주문 물품 폐기 등에 따른 모든 불이익은 고객이 부담합니다.

▸ 나중픽업
상품 준비 전까지 결제 취소 가능하며, 주문이 승인되어 상품 준비로 변경된 이후 취소/환불은 불가합니다.
픽업 가능일 내 픽업요청 하지 않을 경우, 픽업가능일 익일 자동 결제취소됩니다.
상품이 준비 완료된 경우, 해당 매장에서 고객에게 알림톡을 통해 픽업 가능 상태를 전달합니다. 픽업 안내 후 수령대기시간(픽업 안내 시로부터 20분)이 지났음에도 상품을 미수령한 경우, 주문 물품 폐기 등에 따른 모든 불이익은 고객이 부담합니다.

4. 기프트콘

▸ 숙소람권
구매일로부터 60일 이내, 해당 기프트콘이 미사용 상태일 경우 결제금액 100% 취소가 가능합니다.
유효기간 만료 후, 구매일로부터 5년 이내까지 수신자(최종소지자)가 결제금액의 90% 환불 요청이 가능합니다. (5년 경과 시 환불 불가)
이미 사용된 기프트콘은 결제취소 및 환불 신청이 불가합니다.
유효기간 연장 신청 시 발급일로부터 5년 이내 횟수 제한 없이 3개월(92일) 단위로 연장됩니다.
수신자(최종소지자)는 선물받은 기프트콘의 수신 거절을 60일 이내 요청할 수 있습니다.

5. 기프트카드

기프트샵에서 구매한 기프트카드는 구매 후 14일 내 전액 구매(결제) 취소 가능합니다.
단, 구매 후 기프트카드를 사용한 이력이 있을 경우 구매 결제 취소가 불가합니다.

6. 환불규정

▸ 스마트결제/신용카드/체크카드
카드 결제금액은 카드사 정책에 따라 승인취소가 진행되며 3일 이후 매입 취소 시 영업일 기준 3~10일 소요됩니다.

▸ 카카오페이
카카오페이머니나 카카오포인트를 사용하신 경우 각각의 잔액으로 원복되며, 카드 결제를 하신 경우는 카드사 정책에 따라 승인취소가 진행됩니다.

▸ 네이버페이
네이버페이 포인트를 사용하신 경우 네이버페이 포인트로 원복되며, 카드 결제를 하신 경우는 카드사 정책에 따라 승인취소가 진행됩니다.

▸ 토스
toss 머니/쿠폰/포인트를 사용하신 경우 각각의 머니/쿠폰/포인트로 원복됩니다. 카드 결제금액은 카드사 정책에 따라 승인취소가 진행되며 3일 이후 매입취소 시 영업일 기준 3~10일 소요됩니다. 결제 및 사용관련 문의는 토스고객센터 (1599-4905 / 24시간 연중무휴) 이용바랍니다.

▸ 미성년자 권리보호 안내
미성년자인 고객께서 계약을 체결하시는 경우 법정대리인이 그 계약에 동의하지 아니하면 미성년자 본인 또는 법정대리인이 그 계약을 취소할 수 있습니다.

▸ 분쟁 해결
회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해의 보상 등에 관한 처리를 위하여 고객센터(1600-0000)를 설치·운영하고 있습니다.`,
  },
  {
    id: 'culture_deduction' as const,
    label: '문화비 소득공제 안내',
    content: `2023년 7월 1일 결제분부터 숙소 투숙료에 대해 문화비 소득공제가 적용됩니다.
총급여 7천만 원 이하 근로자 중 신용카드 등 사용액이 총급여액의 25%가 넘는 근로소득자를 대상으로 적용됩니다.
공제율은 30%, 공제한도는 전통시장 사용분, 대중교통 사용분, 문화비 사용분에 대한 소득공제를 합해 총 300만원 입니다.
문화비 소득공제는 대상 상품일 경우 자동 적용되며, 결제 완료 후 변경이 불가합니다.`,
  },
]
const INITIAL_TERMS = { refund_policy: false, culture_deduction: false }

const STEPS = ['날짜', '객실', '결제', '완료']

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  APARTMENT: '아파트',
  HOTEL: '호텔',
  GUESTHOUSE: '게스트하우스',
  PENSION: '펜션',
  HOUSE: '단독주택',
}

function getPropertyTypeMessage(type?: string): string {
  switch (type) {
    case 'APARTMENT':
      return '아파트 한 채를 통째로 사용합니다.\n공동 현관 출입은 안내받은 비밀번호를 사용해 주세요.\n\n※ 이웃이 함께 사는 건물입니다. 22시 이후 소음에 유의해 주세요.'
    case 'HOTEL':
      return '프런트가 상시 운영됩니다.\n체크인 시 신분증을 확인합니다.\n\n※ 신분증: 주민등록증, 운전면허증, 여권 (사진, 캡처본 불가)'
    case 'GUESTHOUSE':
      return '거실·주방을 다른 투숙객과 함께 사용합니다.\n객실 외 공간에서는 정숙을 부탁드립니다.\n\n※ 공용 공간 이용 시간은 07시~23시입니다.'
    case 'PENSION':
      return '독채로 사용하며 취사와 바비큐가 가능합니다.\n체크아웃 시 조리 도구는 세척해 주세요.\n\n※ 바비큐 시설은 별도 예약이 필요할 수 있습니다.'
    case 'HOUSE':
      return '단독주택 전체를 사용합니다.\n마당과 주차 공간이 포함됩니다.\n\n※ 반려동물 동반은 숙소 정책을 확인해 주세요.'
    default:
      return '숙소 유형 정보를 확인해 주세요.'
  }
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const num = i + 1
        const done = current > num
        const active = current === num
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-1.5 ${active ? 'text-blue-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                active ? 'bg-blue-600 text-white' : done ? 'bg-green-100 text-green-600' : 'bg-gray-100'
              }`}>
                {done ? '✓' : num}
              </div>
              <span className="text-xs font-medium hidden sm:block">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
          </div>
        )
      })}
    </div>
  )
}

function Timer({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState(0)
  useEffect(() => {
    const calc = () => setRemaining(Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)))
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [expiresAt])
  const m = Math.floor(remaining / 60).toString().padStart(2, '0')
  const s = (remaining % 60).toString().padStart(2, '0')
  return (
    <span className={`font-mono font-bold ${remaining < 60 ? 'text-red-500' : 'text-blue-600'}`}>
      {m}:{s}
    </span>
  )
}

function RoomGrid({ rooms, selected, onToggle, maxSelect }: {
  rooms: RoomInfo[]
  selected: Set<string>
  onToggle: (id: string) => void
  maxSelect: number
}) {
  const rows = [...new Set(rooms.map((s) => s.floor))].sort()
  const maxNum = rooms.length > 0 ? Math.max(...rooms.map((s) => s.number)) : 0
  const cols = Array.from({ length: maxNum }, (_, i) => i + 1)

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-max">
        <div className="text-center text-xs text-gray-400 mb-4 bg-gray-100 rounded py-1.5 px-8">스크린</div>
        {rows.map((row) => {
          const roomMap = new Map(rooms.filter((s) => s.floor === row).map((s) => [s.number, s]))
          return (
            <div key={row} className="flex items-center gap-1.5 mb-1.5">
              <span className="w-5 text-xs text-gray-400 text-center">{row}</span>
              {cols.map((num) => {
                const room = roomMap.get(num)
                if (!room) return <div key={num} className="w-8 h-8 flex-shrink-0" />
                const unavailable = room.is_booked || room.is_held
                const isSelected = selected.has(room.id)
                const atMax = !isSelected && selected.size >= maxSelect
                const roomColor = unavailable || atMax
                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  : isSelected
                  ? 'bg-blue-600 text-white'
                  : room.room_grade === 'DELUXE'
                  ? 'bg-pink-400 text-white hover:bg-pink-500'
                  : room.room_grade === 'ACCESSIBLE'
                  ? 'bg-sky-400 text-white hover:bg-sky-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                return (
                  <button
                    key={room.id}
                    disabled={unavailable || atMax}
                    onClick={() => onToggle(room.id)}
                    className={`w-8 h-8 rounded text-xs font-medium transition-colors flex-shrink-0 ${roomColor}`}
                  >
                    {room.number}
                  </button>
                )
              })}
            </div>
          )
        })}
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-gray-100 inline-block" />스탠다드</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-pink-400 inline-block" />DELUXE</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-sky-400 inline-block" />장애인 객실</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-blue-600 inline-block" />선택</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-gray-300 inline-block" />선택불가</span>
        </div>
      </div>
    </div>
  )
}

function BookingInner() {
  const params = useSearchParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { guestInfo, setGuestInfo, clearGuestInfo } = useGuestStore()

  const propertyId = params.get('propertyId') ?? ''
  const stayDateId = params.get('stayDateId') ?? ''

  // ── 결제/완료 state ────────────────────────────────────────────────
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD')
  const [bookingNumber, setBookingNumber] = useState<string | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [tickets, setTickets] = useState<TicketInfo[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [terms, setTerms] = useState(INITIAL_TERMS)
  const [viewingTerm, setViewingTerm] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showExpiredModal, setShowExpiredModal] = useState(false)

  // ── 비회원 state ──────────────────────────────────────────────────
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingStayDateId, setPendingStayDateId] = useState<string | null>(null)
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestReadyToPay, setGuestReadyToPay] = useState(false)

  // ── 숙소 state ────────────────────────────────────────────────────
  const [property, setProperty] = useState<Property | null>(null)

  // ── Step 1 state ──────────────────────────────────────────────────
  const [allStayDates, setAllStayDates] = useState<StayDate[]>([])
  const [step1Loading, setStep1Loading] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  // ── Step 2 (객실) state ───────────────────────────────────────────
  const [guestTypes, setGuestTypes] = useState<GuestType[]>([])
  const [guestCounts, setAudienceCounts] = useState<Record<string, number>>({})
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [roomsKey, setRoomsKey] = useState(0)
  const [currentStayDate, setCurrentStayDate] = useState<StayDate | null>(null)

  const holdRef = useRef<{ stayDateId: string; roomIds: string[] } | null>(null)

  const isGuest = !user && !!guestInfo
  const step = bookingNumber ? 4 : (expiresAt || (isGuest && guestReadyToPay)) ? 3 : stayDateId ? 2 : 1
  const totalTickets = Object.values(guestCounts).reduce((a, b) => a + b, 0)

  // ── Effects ───────────────────────────────────────────────────────
  useEffect(() => { if (!propertyId) router.push('/') }, [propertyId])

  useEffect(() => {
    getGuestTypes().then((res) => {
      setGuestTypes(res.data)
      const init: Record<string, number> = {}
      res.data.forEach((at, i) => { init[at.code] = i === 0 ? 1 : 0 })
      setAudienceCounts(init)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!propertyId) return
    getProperty(propertyId).then((r) => setProperty(r.data)).catch(() => {})
  }, [propertyId])

  useEffect(() => {
    if (!propertyId) return
    setStep1Loading(true)
    getStayDates({ property_id: propertyId })
      .then((sRes) => setAllStayDates(sRes.data))
      .finally(() => setStep1Loading(false))
  }, [propertyId])

  useEffect(() => {
    if (!stayDateId) {
      if (holdRef.current) {
        releaseRooms({ stay_date_id: holdRef.current.stayDateId, room_ids: holdRef.current.roomIds }).catch(() => {})
        holdRef.current = null
      }
      setExpiresAt(null)
      setSelected(new Set())
      setCurrentStayDate(null)
      setGuestReadyToPay(false)
      return
    }
    setRoomsLoading(true)
    getStayDateRooms(stayDateId).then((r) => setRooms(r.data.rooms)).finally(() => setRoomsLoading(false))
    getStayDate(stayDateId).then((r) => setCurrentStayDate(r.data)).catch(() => {})
  }, [stayDateId, roomsKey])

  useEffect(() => {
    if (expiresAt && selected.size > 0) holdRef.current = { stayDateId, roomIds: [...selected] }
  }, [expiresAt, selected, stayDateId])

  useEffect(() => { if (expiresAt || guestReadyToPay) setTerms(INITIAL_TERMS) }, [expiresAt, guestReadyToPay])

  useEffect(() => {
    return () => {
      if (holdRef.current) releaseRooms({ stay_date_id: holdRef.current.stayDateId, room_ids: holdRef.current.roomIds }).catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!expiresAt) return
    const ms = new Date(expiresAt).getTime() - Date.now()
    if (ms <= 0) { setShowExpiredModal(true); return }
    const id = setTimeout(() => setShowExpiredModal(true), ms)
    return () => clearTimeout(id)
  }, [expiresAt])

  // ── Handlers ──────────────────────────────────────────────────────
  const toggleRoom = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) }
      else if (next.size < totalTickets) { next.add(id) }
      return next
    })
  }, [totalTickets])

  const handleHold = async () => {
    if (selected.size !== totalTickets || totalTickets === 0) {
      setError(`객실을 ${totalTickets}석 선택해주세요`)
      return
    }
    setError(null)

    if (isGuest) {
      setGuestReadyToPay(true)
      return
    }

    setSubmitting(true)
    try {
      const res = await holdRooms({ stay_date_id: stayDateId, room_ids: [...selected] })
      setExpiresAt(res.data.expires_at)
    } catch {
      setError('객실 선택에 실패했습니다. 이미 선택된 객실일 수 있습니다.')
    } finally { setSubmitting(false) }
  }

  const handleConfirm = async () => {
    setSubmitting(true); setError(null)
    try {
      if (isGuest && guestInfo) {
        const res = await createGuestBooking({
          name: guestInfo.name,
          phone: guestInfo.phone,
          stay_date_id: stayDateId,
          room_ids: [...selected],
          payment_method: paymentMethod,
          guest_breakdown: guestCounts,
        })
        holdRef.current = null
        setBookingNumber(res.data.booking_number)
        setTotalPrice(res.data.total_price)
        setTickets(res.data.tickets)
        clearGuestInfo()
      } else {
        const res = await createBooking({ stay_date_id: stayDateId, room_ids: [...selected], payment_method: paymentMethod, guest_breakdown: guestCounts })
        holdRef.current = null
        setBookingNumber(res.data.booking_number)
        setTotalPrice(res.data.total_price)
        setTickets(res.data.tickets)
      }
    } catch {
      setError('결제에 실패했습니다. 다시 시도해주세요.')
    } finally { setSubmitting(false) }
  }

  const handleCancelPayment = async () => {
    if (!isGuest && holdRef.current) {
      await releaseRooms({ stay_date_id: holdRef.current.stayDateId, room_ids: holdRef.current.roomIds }).catch(() => {})
      holdRef.current = null
    }
    setExpiresAt(null)
    setGuestReadyToPay(false)
    setSelected(new Set())
    setRoomsKey((k) => k + 1)
  }

  // ── Derived: Step 1 ───────────────────────────────────────────────
  // 숙소는 이미 정해져 있다. 남은 선택은 '언제'와 '어떤 객실 타입'뿐이다.
  const allDates = [...new Set(allStayDates.map((s) => s.stay_date.split('T')[0]))].sort()
  const effectiveDate = allDates.includes(selectedDate) ? selectedDate : (allDates[0] ?? '')

  const stayDatesOnDate = allStayDates
    .filter((s) => s.stay_date.startsWith(effectiveDate))
    .sort((a, b) => a.room_type_name.localeCompare(b.room_type_name))

  // ── Derived: Step 2/3 ─────────────────────────────────────────────
  const currentProperty = property
  const selectedRooms = rooms.filter((s) => selected.has(s.id))

  // 1박 요금 — 요일 × 객실 등급. 백엔드 rate_plans 의 기본 요율과 같은 기준이다.
  function getRoomPrice(room: RoomInfo, sc: StayDate): number {
    const d = new Date(sc.check_in)
    const isWeekend = d.getDay() === 0 || d.getDay() === 5 || d.getDay() === 6
    const base = room.room_grade === 'DELUXE' ? 150000 : 90000
    return Math.round((base * (isWeekend ? 1.3 : 1)) / 1000) * 1000
  }

  const roomPrices = currentStayDate ? selectedRooms.map((s) => ({ room: s, price: getRoomPrice(s, currentStayDate) })) : []
  const baseRoomTotal = roomPrices.reduce((sum, { price }) => sum + price, 0)
  const avgBasePerPerson = totalTickets > 0 ? Math.round(baseRoomTotal / totalTickets) : 0
  const audienceDiscount = guestTypes.reduce((sum, at) => sum + at.discount_amount * (guestCounts[at.code] ?? 0), 0)
  const previewTotal = baseRoomTotal + audienceDiscount

  const allTermsAgreed = terms.refund_policy && terms.culture_deduction

  // ─────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <StepIndicator current={step} />

      {/* ═══════════════════════════════════════════════════════════
          STEP 1: 날짜 · 객실 타입 선택
      ═══════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div>
          <div className="flex items-center gap-2 mb-7">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ←
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {property ? `${property.name} · 날짜 선택` : '날짜 선택'}
            </h2>
          </div>

          {/* 날짜 탭 */}
          <div style={{ marginBottom: 36 }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">날짜</p>
            {allDates.length === 0 ? (
              <p className="text-sm text-gray-400">숙박 일정이 없습니다.</p>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {allDates.map((date) => {
                  const d = new Date(date)
                  const active = date === effectiveDate
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className="flex-shrink-0 rounded-xl text-center transition-all"
                      style={{
                        minWidth: '62px',
                        padding: '10px 14px',
                        ...(active
                          ? { backgroundColor: '#f97316', color: '#fff', boxShadow: '0 2px 10px rgba(249,115,22,0.35)', border: '1.5px solid #f97316' }
                          : { backgroundColor: '#fff', color: '#374151', border: '1.5px solid #e5e7eb' })
                      }}
                    >
                      <div className="text-sm font-bold leading-tight">
                        {d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}
                      </div>
                      <div className="text-xs mt-0.5" style={{ opacity: 0.75 }}>
                        {d.toLocaleDateString('ko-KR', { weekday: 'short' })}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* 날짜별 객실 타입 */}
          {step1Loading ? (
            <p className="text-sm text-gray-400 py-6 text-center">불러오는 중…</p>
          ) : stayDatesOnDate.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">예약 가능한 객실이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stayDatesOnDate.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (!user && !guestInfo) {
                      setPendingStayDateId(s.id)
                      setShowAuthModal(true)
                      return
                    }
                    router.push(`/booking?propertyId=${propertyId}&stayDateId=${s.id}`)
                  }}
                  className="rounded-xl p-4 text-left transition-all bg-white"
                  style={{ border: '1.5px solid #e0f2fe' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#f97316'
                    e.currentTarget.style.backgroundColor = '#fff7ed'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e0f2fe'
                    e.currentTarget.style.backgroundColor = '#fff'
                  }}
                >
                  <div className="text-base font-black text-gray-900 mb-1">{s.room_type_name}</div>
                  <div className="text-xs text-gray-500">
                    체크인 {formatTime(s.check_in)} · 체크아웃 {formatTime(s.check_out)}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.total_rooms}실</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STEP 2: 객실 선택
      ═══════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => router.push(`/booking?propertyId=${propertyId}`)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ←
            </button>
            <h2 className="text-lg font-bold text-gray-900">객실 선택</h2>
            {isGuest && (
              <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">비회원</span>
            )}
          </div>
          {currentStayDate && (
            <p className="text-sm text-gray-500 mb-4 ml-7">
              {currentProperty?.name ?? ''} · {currentStayDate.room_type_name} · {formatTime(currentStayDate.check_in)}
            </p>
          )}

          {/* 투숙 인원 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5">
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">투숙 인원</p>
              <p className="text-xs text-gray-400">
                총 <span className="font-black text-orange-500">{totalTickets}</span>명 · 해당 인원만큼 객실을 선택해주세요
              </p>
            </div>
            {guestTypes.length === 0 ? (
              <div className="h-24 bg-gray-50 animate-pulse rounded-xl" />
            ) : (
              <div className="divide-y divide-gray-100">
                {guestTypes.map((at) => {
                  const count = guestCounts[at.code] ?? 0
                  return (
                    <div key={at.code} className="flex items-center justify-between py-3">
                      <div>
                        <span className="text-sm font-medium text-gray-800">{at.name}</span>
                        {at.discount_amount < 0 && (
                          <span className="text-xs text-blue-500 ml-1.5">
                            {at.discount_amount.toLocaleString()}원
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setAudienceCounts((prev) => ({ ...prev, [at.code]: Math.max(0, count - 1) }))
                            setSelected(new Set())
                          }}
                          disabled={count === 0}
                          className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 font-bold text-lg leading-none flex items-center justify-center disabled:opacity-30 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-gray-900">{count}</span>
                        <button
                          onClick={() => {
                            setAudienceCounts((prev) => ({ ...prev, [at.code]: Math.min(8, count + 1) }))
                            setSelected(new Set())
                          }}
                          disabled={count >= 8}
                          className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 font-bold text-lg leading-none flex items-center justify-center disabled:opacity-30 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 객실 그리드 */}
          {roomsLoading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <RoomGrid rooms={rooms} selected={selected} onToggle={toggleRoom} maxSelect={totalTickets} />
          )}

          {selected.size > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
              선택한 객실: {selectedRooms.map((s) => `${s.floor}${s.number}`).join(', ')} ({selected.size}/{totalTickets}석)
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => router.push(`/booking?propertyId=${propertyId}`)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              이전
            </button>
            <button
              onClick={handleHold}
              disabled={submitting || selected.size !== totalTickets || totalTickets === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              {submitting ? '처리 중...' : `${selected.size}/${totalTickets}석 선택 완료`}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STEP 3: 결제
      ═══════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="pb-28">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">결제</h2>
            {expiresAt && !isGuest && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">남은 시간</span>
                <Timer expiresAt={expiresAt} />
              </div>
            )}
            {isGuest && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">비회원 예약</span>
            )}
          </div>

          {/* 비회원 정보 */}
          {isGuest && guestInfo && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4 text-sm">
              <p className="text-xs text-gray-400 mb-2">예약자 정보</p>
              <div className="flex justify-between text-gray-700">
                <span className="text-gray-500">이름</span>
                <span className="font-medium">{guestInfo.name}</span>
              </div>
              <div className="flex justify-between text-gray-700 mt-1">
                <span className="text-gray-500">연락처</span>
                <span>{guestInfo.phone}</span>
              </div>
            </div>
          )}

          {/* 예약 정보 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 flex gap-4">
            {property?.photo_url && (
              <img src={property.photo_url} alt={property.name} className="w-16 h-24 object-cover rounded-lg flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-gray-900 truncate">{property?.name ?? ''}</p>
                {property && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex-shrink-0">
                    {PROPERTY_TYPE_LABEL[property.property_type] ?? '숙소'}
                  </span>
                )}
              </div>
              {currentStayDate && (
                <>
                  <p className="text-gray-600">{currentProperty?.name} · {currentStayDate.room_type_name}</p>
                  <p className="text-gray-600">
                    {new Date(currentStayDate.check_in).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}{' '}
                    {formatTime(currentStayDate.check_in)}
                  </p>
                </>
              )}
              <p className="text-gray-600 mt-1">객실: {selectedRooms.map((s) => `${s.floor}${s.number}`).join(', ')}</p>
              {!isGuest && guestTypes.length > 0 && (
                <p className="text-gray-600">
                  {guestTypes.filter(at => (guestCounts[at.code] ?? 0) > 0)
                    .map(at => `${at.name} ${guestCounts[at.code]}명`)
                    .join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* 결제 금액 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 text-sm">
            <p className="font-semibold text-gray-900 mb-3">결제 금액</p>
            {guestTypes.filter(at => (guestCounts[at.code] ?? 0) > 0).map((at) => {
              const count = guestCounts[at.code]
              const perPrice = avgBasePerPerson + at.discount_amount
              return (
                <div key={at.code} className="flex justify-between text-gray-600 py-1">
                  <span>{at.name} {count}명 × {perPrice.toLocaleString()}원</span>
                  <span>{(count * perPrice).toLocaleString()}원</span>
                </div>
              )
            })}
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-gray-900">
              <span>합계</span>
              <span className="text-orange-500 text-base">{previewTotal.toLocaleString()}원</span>
            </div>
          </div>

          {/* 결제 수단 */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">결제 수단</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === m.value ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:bg-sky-50'
                  }`}
                >
                  <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value}
                    onChange={() => setPaymentMethod(m.value)} className="accent-orange-500" />
                  <span className="text-sm font-medium">{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
            <label className="flex items-start gap-3 cursor-pointer pb-3 mb-1 border-b border-gray-100">
              <input type="checkbox" checked={allTermsAgreed}
                onChange={(e) => setTerms({ refund_policy: e.target.checked, culture_deduction: e.target.checked })}
                className="w-4 h-4 rounded accent-orange-500 cursor-pointer mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">전체 약관 동의하기</p>
                <p className="text-xs text-gray-500 mt-0.5">주문상품 정보 결제 대행 서비스, 취소 및 환불 규정 안내에 대해 모두 동의합니다.</p>
              </div>
            </label>
            {TERMS.map((term) => (
              <div key={term.id} className="flex items-center justify-between py-2">
                <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                  <input type="checkbox" checked={terms[term.id]}
                    onChange={() => setTerms((p) => ({ ...p, [term.id]: !p[term.id] }))}
                    className="w-4 h-4 rounded accent-orange-500 cursor-pointer flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate"><span className="text-red-500 mr-1">[필수]</span>{term.label}</span>
                </label>
                <button type="button" onClick={() => setViewingTerm(term.id)}
                  className="text-xs text-gray-400 hover:text-gray-600 underline ml-2 flex-shrink-0">보기</button>
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 flex gap-3 max-w-4xl mx-auto">
            <button onClick={handleCancelPayment}
              className="flex-none border border-gray-300 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50">
              취소
            </button>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={submitting || !allTermsAgreed}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-black transition-colors"
            >
              {previewTotal.toLocaleString()}원 결제하기
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STEP 4: 완료
      ═══════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">예약 완료!</h2>
            <p className="text-gray-500 text-sm mt-1">예약가 성공적으로 완료되었습니다</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4">
            <div className="bg-blue-600 px-4 py-3">
              <p className="text-xs text-blue-100">예약번호</p>
              <p className="text-lg font-mono font-bold text-white">{bookingNumber}</p>
            </div>
            <div className="p-4 text-sm space-y-2 text-gray-600">
              {property && (
                <div className="flex justify-between">
                  <span className="text-gray-400">숙소</span>
                  <span className="font-medium text-gray-900">{property.name}</span>
                </div>
              )}
              {currentProperty && currentStayDate && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">숙소</span>
                    <span>{currentProperty.name} · {currentStayDate.room_type_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">일시</span>
                    <span>
                      {new Date(currentStayDate.check_in).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}{' '}
                      {formatTime(currentStayDate.check_in)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">객실</span>
                <span>{tickets.map((t) => t.room_label).join(', ')}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>결제 금액</span>
                <span className="text-blue-600">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {tickets.length > 0 && (
            <div className="space-y-3 mb-6">
              {tickets.map((ticket) => (
                <div key={ticket.qr_code} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
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

          <div className="flex gap-3">
            {user ? (
              <button onClick={() => router.push('/my/bookings')}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                예약 내역 보기
              </button>
            ) : (
              <button onClick={() => router.push('/booking/lookup')}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                예약 조회하기
              </button>
            )}
            <button onClick={() => router.push('/')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
              홈으로
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: 약관 보기
      ═══════════════════════════════════════════════════════════ */}
      {viewingTerm && (() => {
        const term = TERMS.find((t) => t.id === viewingTerm)
        return term ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-sm font-bold text-gray-900">{term.label}</h3>
                <button onClick={() => setViewingTerm(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5 text-sm text-gray-600 whitespace-pre-line leading-relaxed">{term.content}</div>
              <div className="px-5 pb-5 flex-shrink-0">
                <button onClick={() => setViewingTerm(null)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-bold">확인</button>
              </div>
            </div>
          </div>
        ) : null
      })()}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: 결제 시간 만료
      ═══════════════════════════════════════════════════════════ */}
      {showExpiredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="px-6 pt-6 pb-2 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">결제 가능 시간 경과</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                결제 가능 시간이 경과되어<br />객실 선택 화면으로 돌아갑니다.
              </p>
            </div>
            <div className="px-6 py-4">
              <button
                onClick={async () => { setShowExpiredModal(false); await handleCancelPayment() }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: 결제 전 확인
      ═══════════════════════════════════════════════════════════ */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[92vh]">
            {/* 헤더 */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1.5px solid #f0f9ff' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 rounded-full bg-orange-500" />
                <h2 className="text-base font-black text-gray-900">결제 전 확인해 주세요</h2>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {/* 숙소 숙소 유형 */}
              <div className="flex gap-3.5 bg-sky-50 rounded-xl p-4" style={{ border: '1px solid #bae6fd' }}>
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">숙소 숙소 유형 안내</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{getPropertyTypeMessage(property?.property_type)}</p>
                </div>
              </div>

              {/* 취소/환불 */}
              <div className="flex gap-3.5 bg-orange-50 rounded-xl p-4" style={{ border: '1px solid #fed7aa' }}>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">취소/환불 불가 안내</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    모바일을 통해 취소하실 경우 숙박시간 20분 전까지 취소 가능하며,
                    현장에서 취소하실 경우 숙박시간 전까지 취소하실 수 있습니다.
                    숙박시간 이후 취소/환불/결제 수단 변경은 불가합니다.
                  </p>
                </div>
              </div>

              {/* 입장 전 안내 */}
              <div className="flex gap-3.5 bg-white rounded-xl p-4" style={{ border: '1.5px solid #e5e7eb' }}>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">입장 전 안내사항</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    입장 지연에 따른 투숙 불편을 최소화하기 위해 본 숙소는 10분 후 숙박이 시작됩니다.
                  </p>
                </div>
              </div>

              {/* 주차 안내 */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #8B1A2B30' }}>
                <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#8B1A2B0D' }}>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#8B1A2B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <h3 className="text-sm font-black" style={{ color: '#8B1A2B' }}>주차 안내 (발렛주차)</h3>
                </div>
                <div className="px-4 py-3.5 bg-white space-y-2">
                  {[
                    { label: '위치', value: '스타플렉스 건물 지하 2층 ~ 4층' },
                    { label: '운영시간', value: '오전 8시 ~ 오후 20시' },
                    { label: '인증방법', value: '출차 시 숙소 티켓 제시 (모바일/지류 모두 가능)' },
                    { label: '요금', value: '투숙 시 3시간 5,000원 / 초과 10분당 1,000원' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 text-sm">
                      <span className="text-gray-400 font-medium flex-shrink-0 w-16">{label}</span>
                      <span className="text-gray-700 font-semibold">{value}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 pt-2 mt-1" style={{ borderTop: '1px solid #f3f4f6' }}>
                    발렛 무료 서비스는 숙소 투숙 고객에 한함 · 20시 이후 입차 시 이용 제한될 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex gap-2.5" style={{ borderTop: '1.5px solid #f0f9ff' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => { setShowConfirmModal(false); handleConfirm() }}
                disabled={submitting}
                className="text-white py-3.5 rounded-xl text-sm font-black transition-colors disabled:opacity-60"
                style={{ flex: 2, backgroundColor: '#f97316' }}
                onMouseEnter={e => !submitting && (e.currentTarget.style.backgroundColor = '#ea6c10')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f97316')}
              >
                {submitting ? '결제 중...' : '확인하고 결제하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: 예약 방법 선택 (비회원)
      ═══════════════════════════════════════════════════════════ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">예약 방법 선택</h3>
            <p className="text-sm text-gray-500 mb-5">로그인하거나 비회원으로 예약할 수 있습니다.</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAuthModal(false)
                  router.push(`/login?redirect=${encodeURIComponent(`/booking?propertyId=${propertyId}&stayDateId=${pendingStayDateId}`)}`)
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-sm font-bold transition-colors"
              >
                로그인하기
              </button>
              <button
                onClick={() => {
                  setShowAuthModal(false)
                  setShowGuestForm(true)
                }}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                비회원 예약
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full text-gray-400 text-sm py-1 hover:text-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: 비회원 정보 입력
      ═══════════════════════════════════════════════════════════ */}
      {showGuestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">비회원 예약</h3>
            <p className="text-sm text-gray-500 mb-5">예약 조회에 사용되니 정확히 입력해 주세요.</p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="이름 입력"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowGuestForm(false); setGuestName(''); setGuestPhone('') }}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                취소
              </button>
              <button
                disabled={!guestName.trim() || !guestPhone.trim()}
                onClick={() => {
                  setGuestInfo({ name: guestName.trim(), phone: guestPhone.trim() })
                  setShowGuestForm(false)
                  setGuestName('')
                  setGuestPhone('')
                  router.push(`/booking?propertyId=${propertyId}&stayDateId=${pendingStayDateId}`)
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

/**
 * useSearchParams 는 Suspense 경계 안에 있어야 한다.
 *
 * 쿼리스트링은 서버가 정적으로 만들 때 알 수 없는 값이라, Next 가 여기서 렌더를
 * 멈추고 브라우저에 넘긴다. 경계를 안 주면 페이지 전체가 그 대기에 걸린다.
 */
export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BookingInner />
    </Suspense>
  )
}
