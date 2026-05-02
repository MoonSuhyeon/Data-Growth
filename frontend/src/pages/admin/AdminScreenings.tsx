import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import client from '../../api/client'
import type { Movie } from '../../types'

interface HallInfo {
  id: string
  name: string
  theater_id: string
  theater_name: string
  total_seats: number
}

interface AdminScreening {
  id: string
  movie_id: string
  movie_title: string
  hall_id: string
  hall_name: string
  theater_id: string
  theater_name: string
  total_seats: number
  start_time: string
  end_time: string
  screening_date: string
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR')
}

function toTimeStr(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const EMPTY_FORM = {
  movie_id: '',
  hall_id: '',
  screening_date: '',
  start_time: '',
  end_time: '',
}

function ScreeningModal({
  screening,
  movies,
  halls,
  onClose,
  onSaved,
}: {
  screening: AdminScreening | null
  movies: Movie[]
  halls: HallInfo[]
  onClose: () => void
  onSaved: (s: AdminScreening) => void
}) {
  const isEdit = screening !== null
  const [form, setForm] = useState(() =>
    screening
      ? {
          movie_id: screening.movie_id,
          hall_id: screening.hall_id,
          screening_date: screening.screening_date.split('T')[0],
          start_time: toTimeStr(screening.start_time),
          end_time: toTimeStr(screening.end_time),
        }
      : { ...EMPTY_FORM }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const theaters = [
    ...new Map(halls.map((h) => [h.theater_id, h.theater_name])).entries(),
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.movie_id || !form.hall_id || !form.screening_date || !form.start_time || !form.end_time) {
      setError('모든 항목을 입력해주세요')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      movie_id: form.movie_id,
      hall_id: form.hall_id,
      start_time: new Date(`${form.screening_date}T${form.start_time}:00`).toISOString(),
      end_time: new Date(`${form.screening_date}T${form.end_time}:00`).toISOString(),
      screening_date: new Date(`${form.screening_date}T00:00:00`).toISOString(),
    }
    try {
      const res = isEdit
        ? await client.put<AdminScreening>(`/admin/screenings/${screening!.id}`, payload)
        : await client.post<AdminScreening>('/admin/screenings', payload)
      onSaved(res.data)
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? '상영 수정' : '상영 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">영화 *</label>
            <select
              value={form.movie_id}
              onChange={(e) => set('movie_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">영화 선택</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">상영관 *</label>
            <select
              value={form.hall_id}
              onChange={(e) => set('hall_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">상영관 선택</option>
              {theaters.map(([tid, tname]) => (
                <optgroup key={tid} label={tname}>
                  {halls
                    .filter((h) => h.theater_id === tid)
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.total_seats}석)
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">상영일 *</label>
            <input
              type="date"
              value={form.screening_date}
              onChange={(e) => set('screening_date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">시작 시간 *</label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => set('start_time', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">종료 시간 *</label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => set('end_time', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 rounded-xl text-sm font-medium transition-colors"
            >
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminScreenings() {
  const [screenings, setScreenings] = useState<AdminScreening[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [halls, setHalls] = useState<HallInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMovie, setFilterMovie] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [modal, setModal] = useState<AdminScreening | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      client.get<Movie[]>('/movies'),
      client.get<HallInfo[]>('/admin/halls'),
    ]).then(([m, h]) => {
      setMovies(m.data)
      setHalls(h.data)
    })
  }, [])

  useEffect(() => {
    const params: Record<string, string> = {}
    if (filterMovie) params.movie_id = filterMovie
    if (filterDate) params.date = filterDate
    client
      .get<AdminScreening[]>('/admin/screenings', { params })
      .then((r) => setScreenings(r.data))
      .finally(() => setLoading(false))
  }, [filterMovie, filterDate])

  const handleSaved = (saved: AdminScreening) => {
    setScreenings((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id)
      return idx >= 0 ? prev.map((s) => (s.id === saved.id ? saved : s)) : [saved, ...prev]
    })
    setModal(undefined)
  }

  const handleDelete = async (s: AdminScreening) => {
    if (
      !confirm(
        `${s.movie_title} (${fmtDate(s.screening_date)} ${fmtTime(s.start_time)}) 상영을 삭제하시겠습니까?`
      )
    )
      return
    setDeletingId(s.id)
    try {
      await client.delete(`/admin/screenings/${s.id}`)
      setScreenings((prev) => prev.filter((x) => x.id !== s.id))
    } catch {
      alert('삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">상영 관리</h1>
          <button
            onClick={() => setModal(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + 상영 추가
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={filterMovie}
            onChange={(e) => setFilterMovie(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 영화</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(filterMovie || filterDate) && (
            <button
              onClick={() => {
                setFilterMovie('')
                setFilterDate('')
              }}
              className="text-sm text-gray-400 hover:text-gray-600 px-2"
            >
              초기화
            </button>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : screenings.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">
            {filterMovie || filterDate ? '해당 조건의 상영 일정이 없습니다.' : '오늘 이후 상영 일정이 없습니다. 날짜 필터로 과거 일정을 조회하세요.'}
          </p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">영화</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">극장 / 상영관</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">날짜</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">시간</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {screenings.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.movie_title}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {s.theater_name} · {s.hall_name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{fmtDate(s.screening_date)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {fmtTime(s.start_time)} ~ {fmtTime(s.end_time)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setModal(s)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        disabled={deletingId === s.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40"
                      >
                        {deletingId === s.id ? '삭제 중' : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== undefined && (
        <ScreeningModal
          screening={modal}
          movies={movies}
          halls={halls}
          onClose={() => setModal(undefined)}
          onSaved={handleSaved}
        />
      )}
    </AdminLayout>
  )
}
