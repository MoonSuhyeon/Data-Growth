import { useEffect, useState } from 'react'
import { getMovies, adminCreateMovie, adminUpdateMovie, adminDeleteMovie } from '../../api/movies'
import type { MovieInput } from '../../api/movies'
import type { Movie } from '../../types'
import AdminLayout from './AdminLayout'

const RATING_LABEL: Record<string, string> = {
  ALL: '전체', AGE_12: '12세', AGE_15: '15세', AGE_19: '청소년불가',
}
const STATUS_LABEL: Record<string, string> = {
  NOW_SHOWING: '상영 중', COMING_SOON: '개봉 예정', ENDED: '상영 종료',
}
const STATUS_COLOR: Record<string, string> = {
  NOW_SHOWING: 'text-green-600 bg-green-50',
  COMING_SOON: 'text-blue-600 bg-blue-50',
  ENDED: 'text-gray-500 bg-gray-100',
}

const EMPTY_FORM: MovieInput = {
  title: '',
  title_en: '',
  synopsis: '',
  director: '',
  cast: [],
  runtime: 0,
  rating: 'ALL',
  poster_url: '',
  release_date: null,
  status: 'NOW_SHOWING',
}

function MovieModal({
  movie,
  onClose,
  onSaved,
}: {
  movie: Movie | null
  onClose: () => void
  onSaved: (m: Movie) => void
}) {
  const isEdit = movie !== null
  const [form, setForm] = useState<MovieInput>(() =>
    movie
      ? {
          title: movie.title,
          title_en: movie.title_en ?? '',
          synopsis: movie.synopsis,
          director: movie.director,
          cast: movie.cast ?? [],
          runtime: movie.runtime,
          rating: movie.rating,
          poster_url: movie.poster_url ?? '',
          release_date: movie.release_date ? movie.release_date.split('T')[0] : null,
          status: movie.status,
        }
      : { ...EMPTY_FORM }
  )
  const [castText, setCastText] = useState((movie?.cast ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof MovieInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.synopsis.trim() || !form.director.trim() || form.runtime <= 0) {
      setError('필수 항목을 모두 입력해주세요')
      return
    }
    setSaving(true)
    setError(null)
    const payload: MovieInput = {
      ...form,
      title_en: form.title_en?.trim() || null,
      cast: castText.split(',').map((s) => s.trim()).filter(Boolean),
      poster_url: form.poster_url?.trim() || null,
      release_date: form.release_date || null,
    }
    try {
      const res = isEdit
        ? await adminUpdateMovie(movie!.id, payload)
        : await adminCreateMovie(payload)
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? '영화 수정' : '영화 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">제목 *</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="한국 제목"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">영문 제목</label>
              <input
                value={form.title_en ?? ''}
                onChange={(e) => set('title_en', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="English title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">감독 *</label>
              <input
                value={form.director}
                onChange={(e) => set('director', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">상영 시간(분) *</label>
              <input
                type="number"
                value={form.runtime || ''}
                onChange={(e) => set('runtime', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={1}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">등급 *</label>
              <select
                value={form.rating}
                onChange={(e) => set('rating', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">전체관람가</option>
                <option value="AGE_12">12세 이상</option>
                <option value="AGE_15">15세 이상</option>
                <option value="AGE_19">청소년관람불가</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">상태 *</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NOW_SHOWING">상영 중</option>
                <option value="COMING_SOON">개봉 예정</option>
                <option value="ENDED">상영 종료</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">출연진 (쉼표로 구분)</label>
              <input
                value={castText}
                onChange={(e) => setCastText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="배우1, 배우2, 배우3"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">줄거리 *</label>
              <textarea
                value={form.synopsis}
                onChange={(e) => set('synopsis', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">포스터 URL</label>
              <input
                value={form.poster_url ?? ''}
                onChange={(e) => set('poster_url', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">개봉일</label>
              <input
                type="date"
                value={form.release_date ?? ''}
                onChange={(e) => set('release_date', e.target.value || null)}
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
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '영화 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMovie, setModalMovie] = useState<Movie | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    getMovies()
      .then((res) => setMovies(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = (saved: Movie) => {
    setMovies((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id)
      return idx >= 0 ? prev.map((m) => (m.id === saved.id ? saved : m)) : [saved, ...prev]
    })
    setModalMovie(undefined)
  }

  const handleDelete = async (movie: Movie) => {
    if (!confirm(`"${movie.title}"을(를) 삭제하시겠습니까?`)) return
    setDeletingId(movie.id)
    try {
      await adminDeleteMovie(movie.id)
      setMovies((prev) => prev.filter((m) => m.id !== movie.id))
    } catch {
      alert('삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">영화 관리</h1>
          <button
            onClick={() => setModalMovie(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + 영화 추가
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-200 rounded-lg" />)}
          </div>
        ) : movies.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">등록된 영화가 없습니다.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">제목</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">감독</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">등급</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">상영시간</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">상태</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movies.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{m.title}</div>
                      {m.title_en && <div className="text-xs text-gray-400">{m.title_en}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.director}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {RATING_LABEL[m.rating] ?? m.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{m.runtime}분</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLOR[m.status] ?? ''}`}>
                        {STATUS_LABEL[m.status] ?? m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setModalMovie(m)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        disabled={deletingId === m.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40"
                      >
                        {deletingId === m.id ? '삭제 중' : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalMovie !== undefined && (
          <MovieModal
            movie={modalMovie}
            onClose={() => setModalMovie(undefined)}
            onSaved={handleSaved}
          />
        )}
      </div>
    </AdminLayout>
  )
}
