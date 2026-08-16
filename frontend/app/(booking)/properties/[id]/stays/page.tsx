'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProperty, getStayDates } from '@/api/properties'
import type { Property, StayDate } from '@/types'

type TimeSlot = 'all' | 'weekday' | 'weekend'

const TIME_SLOTS: { value: TimeSlot; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'weekday', label: '주중' },
  { value: 'weekend', label: '주말' },
]

const PROPERTY_TYPE_LABEL: Record<Property['property_type'], string> = {
  APARTMENT: '아파트',
  HOTEL: '호텔',
  GUESTHOUSE: '게스트하우스',
  PENSION: '펜션',
  HOUSE: '단독주택',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function matchesSlot(s: StayDate, slot: TimeSlot): boolean {
  if (slot === 'all') return true
  // 금·토 체크인을 주말 요율로 본다 — 백엔드 rate_plans 와 같은 기준이다.
  const dow = new Date(s.check_in).getDay()
  const isWeekend = dow === 5 || dow === 6 || dow === 0
  return slot === 'weekend' ? isWeekend : !isWeekend
}

const BURGUNDY = '#8B1A2B'

export default function PropertyStayDates() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [property, setProperty] = useState<Property | null>(null)
  const [allStayDates, setAllStayDates] = useState<StayDate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('all')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      getProperty(id),
      getStayDates({ property_id: id }),
    ])
      .then(([pRes, sRes]) => {
        setProperty(pRes.data)
        setAllStayDates(sRes.data)
        const dates = [...new Set(sRes.data.map((s) => s.stay_date.split('T')[0]))].sort()
        setSelectedDate(dates[0] ?? '')
      })
      .finally(() => setLoading(false))
  }, [id])

  const allDates = useMemo(
    () => [...new Set(allStayDates.map((s) => s.stay_date.split('T')[0]))].sort(),
    [allStayDates]
  )

  const propertyGroups = useMemo(() => {
    const onDate = allStayDates.filter((s) => s.stay_date.startsWith(selectedDate))
    const filtered = onDate.filter((s) => matchesSlot(s, timeSlot))
    if (!property || filtered.length === 0) return []
    return [{ property, stayDates: filtered }]
  }, [allStayDates, selectedDate, timeSlot, property])

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-6 w-24 bg-sky-100 rounded" />
        <div className="h-12 bg-sky-100 rounded-xl" />
        <div className="h-10 bg-sky-100 rounded-xl" />
        <div className="h-8 bg-sky-100 rounded-xl w-80" />
        {[1, 2, 3].map((i) => <div key={i} className="h-44 bg-sky-100 rounded-2xl" />)}
      </main>
    )
  }

  if (!property) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-400">숙소을 찾을 수 없습니다.</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* 뒤로가기 + 제목 */}
      <div className="mb-7">
        <button
          onClick={() => router.push('/regions')}
          className="text-sm text-gray-400 hover:text-orange-500 mb-2 inline-flex items-center gap-1 transition-colors font-medium"
        >
          ← 숙소 목록
        </button>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: BURGUNDY }} />
          <h1 className="text-2xl font-black text-gray-900">{property.name}</h1>
        </div>
        <p className="text-sm text-gray-500 ml-3">{property.address}</p>
        {property.phone && <p className="text-sm text-gray-400 ml-3 mt-0.5">{property.phone}</p>}
      </div>

      {allDates.length === 0 ? (
        <p className="text-gray-400 text-sm">숙박 일정이 없습니다.</p>
      ) : (
        <>
          {/* 날짜 탭 */}
          <div style={{ marginBottom: 36 }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">날짜</p>
            <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {allDates.map((date) => {
                const d = new Date(date)
                const isActive = date === selectedDate
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className="flex-shrink-0 rounded-xl text-sm font-bold transition-all text-center"
                    style={{
                      minWidth: '62px',
                      padding: '10px 14px',
                      ...(isActive
                        ? { backgroundColor: '#f97316', color: '#fff', boxShadow: '0 2px 8px rgba(249,115,22,0.35)', border: '1.5px solid #f97316' }
                        : { backgroundColor: '#fff', color: '#374151', border: '1.5px solid #e5e7eb' })
                    }}
                  >
                    <div>{d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</div>
                    <div className="text-xs opacity-80 mt-0.5">{d.toLocaleDateString('ko-KR', { weekday: 'short' })}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 시간대 필터 */}
          <div style={{ marginBottom: 36 }}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">시간대</p>
            <div className="flex gap-2 flex-wrap">
              {TIME_SLOTS.map((slot) => {
                const isActive = timeSlot === slot.value
                return (
                  <button
                    key={slot.value}
                    onClick={() => setTimeSlot(slot.value)}
                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    style={isActive
                      ? { backgroundColor: BURGUNDY, color: '#fff', border: `1.5px solid ${BURGUNDY}` }
                      : { backgroundColor: '#fff', color: '#6b7280', border: '1.5px solid #e5e7eb' }
                    }
                  >
                    {slot.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 숙소별 숙박 목록 */}
          {propertyGroups.length === 0 ? (
            <p className="text-gray-400 text-sm">해당 조건의 숙박 일정이 없습니다.</p>
          ) : (
            <div className="space-y-5">
              {propertyGroups.map(({ property, stayDates }) => (
                <div key={property!.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1.5px solid #e0f2fe' }}>
                  {/* 숙소 정보 헤더 */}
                  <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: '#e0f2fe', backgroundColor: '#f0f9ff' }}>
                    {property!.photo_url ? (
                      <img
                        src={property!.photo_url}
                        alt={property!.name}
                        className="w-11 h-16 object-cover rounded-lg flex-shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="w-11 h-16 bg-sky-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <svg className="w-5 h-5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-gray-900 text-base">{property!.name}</span>
                        <span className="text-xs font-semibold bg-white text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                          {PROPERTY_TYPE_LABEL[property!.property_type]}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">최대 {property!.max_guests}인</span>
                      </div>
                      {property!.name_en && (
                        <p className="text-xs text-gray-400 truncate">{property!.name_en}</p>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/properties/${property!.id}`)}
                      className="text-xs font-bold flex-shrink-0 px-3 py-1.5 rounded-lg transition-colors"
                      style={{ color: BURGUNDY, backgroundColor: `${BURGUNDY}12` }}
                    >
                      상세보기
                    </button>
                  </div>

                  {/* 시간 슬롯 */}
                  <div className="px-5 py-5 flex flex-wrap gap-3">
                    {stayDates.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => router.push(`/booking?propertyId=${s.property_id}&stayDateId=${s.id}`)}
                        className="rounded-xl text-left transition-all hover:shadow-md"
                        style={{
                          border: '1.5px solid #bae6fd',
                          padding: '10px 16px',
                          minWidth: '120px',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#f97316'
                          e.currentTarget.style.backgroundColor = '#fff7ed'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#bae6fd'
                          e.currentTarget.style.backgroundColor = ''
                        }}
                      >
                        <div className="font-black text-gray-900 text-sm">
                          {formatTime(s.check_in)}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ~ {formatTime(s.check_out)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1.5 pt-1.5 border-t border-gray-100">
                          {s.room_type_name} · {s.total_rooms}석
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
