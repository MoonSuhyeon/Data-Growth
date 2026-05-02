import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTheaters, getScreenings, getMovies } from '../api/movies'
import type { Theater, Screening, Movie } from '../types'

type TimeSlot = 'all' | 'morning' | 'afternoon' | 'evening' | 'weekend'

const TIME_SLOTS: { value: TimeSlot; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'morning', label: '오전' },
  { value: 'afternoon', label: '오후' },
  { value: 'evening', label: '18시 이후' },
  { value: 'weekend', label: '주말' },
]

const RATING_LABEL: Record<Movie['rating'], string> = {
  ALL: '전체관람가',
  AGE_12: '12세',
  AGE_15: '15세',
  AGE_19: '청소년 불가',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function matchesSlot(s: Screening, slot: TimeSlot): boolean {
  if (slot === 'all') return true
  const d = new Date(s.start_time)
  const h = d.getHours()
  const dow = d.getDay()
  if (slot === 'morning') return h < 12
  if (slot === 'afternoon') return h >= 12 && h < 18
  if (slot === 'evening') return h >= 18
  if (slot === 'weekend') return dow === 0 || dow === 6
  return true
}

const BURGUNDY = '#8B1A2B'

export default function TheaterScreenings() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [theater, setTheater] = useState<Theater | null>(null)
  const [allScreenings, setAllScreenings] = useState<Screening[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('all')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      getTheaters(),
      getScreenings({ theater_id: id }),
      getMovies(),
    ])
      .then(([tRes, sRes, mRes]) => {
        setTheater(tRes.data.find((t) => t.id === id) ?? null)
        setAllScreenings(sRes.data)
        setMovies(mRes.data)
        const dates = [...new Set(sRes.data.map((s) => s.screening_date.split('T')[0]))].sort()
        setSelectedDate(dates[0] ?? '')
      })
      .finally(() => setLoading(false))
  }, [id])

  const allDates = useMemo(
    () => [...new Set(allScreenings.map((s) => s.screening_date.split('T')[0]))].sort(),
    [allScreenings]
  )

  const movieGroups = useMemo(() => {
    const onDate = allScreenings.filter((s) => s.screening_date.startsWith(selectedDate))
    const filtered = onDate.filter((s) => matchesSlot(s, timeSlot))
    const movieIds = [...new Set(filtered.map((s) => s.movie_id))]
    return movieIds
      .map((mid) => ({
        movie: movies.find((m) => m.id === mid) ?? null,
        screenings: filtered.filter((s) => s.movie_id === mid),
      }))
      .filter((g) => g.movie !== null)
  }, [allScreenings, selectedDate, timeSlot, movies])

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

  if (!theater) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-400">극장을 찾을 수 없습니다.</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* 뒤로가기 + 제목 */}
      <div className="mb-7">
        <button
          onClick={() => navigate('/theaters')}
          className="text-sm text-gray-400 hover:text-orange-500 mb-2 inline-flex items-center gap-1 transition-colors font-medium"
        >
          ← 극장 목록
        </button>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: BURGUNDY }} />
          <h1 className="text-2xl font-black text-gray-900">{theater.name}</h1>
        </div>
        <p className="text-sm text-gray-500 ml-3">{theater.address}</p>
        {theater.phone && <p className="text-sm text-gray-400 ml-3 mt-0.5">{theater.phone}</p>}
      </div>

      {allDates.length === 0 ? (
        <p className="text-gray-400 text-sm">상영 일정이 없습니다.</p>
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

          {/* 영화별 상영 목록 */}
          {movieGroups.length === 0 ? (
            <p className="text-gray-400 text-sm">해당 조건의 상영 일정이 없습니다.</p>
          ) : (
            <div className="space-y-5">
              {movieGroups.map(({ movie, screenings }) => (
                <div key={movie!.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1.5px solid #e0f2fe' }}>
                  {/* 영화 정보 헤더 */}
                  <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: '#e0f2fe', backgroundColor: '#f0f9ff' }}>
                    {movie!.poster_url ? (
                      <img
                        src={movie!.poster_url}
                        alt={movie!.title}
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
                        <span className="font-black text-gray-900 text-base">{movie!.title}</span>
                        <span className="text-xs font-semibold bg-white text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                          {RATING_LABEL[movie!.rating]}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{movie!.runtime}분</span>
                      </div>
                      {movie!.title_en && (
                        <p className="text-xs text-gray-400 truncate">{movie!.title_en}</p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/movies/${movie!.id}`)}
                      className="text-xs font-bold flex-shrink-0 px-3 py-1.5 rounded-lg transition-colors"
                      style={{ color: BURGUNDY, backgroundColor: `${BURGUNDY}12` }}
                    >
                      상세보기
                    </button>
                  </div>

                  {/* 시간 슬롯 */}
                  <div className="px-5 py-5 flex flex-wrap gap-3">
                    {screenings.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => navigate(`/booking?movieId=${s.movie_id}&screeningId=${s.id}`)}
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
                          {formatTime(s.start_time)}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          ~ {formatTime(s.end_time)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1.5 pt-1.5 border-t border-gray-100">
                          {s.hall_name} · {s.total_seats}석
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
