import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getMovie, getMovieReviews, createReview, toggleReviewHelpful,
  checkFavorite, addFavorite, removeFavorite,
} from '../api/movies'
import { useAuthStore } from '../store/authStore'
import type { Movie, Review } from '../types'

const RATING_LABEL: Record<string, string> = {
  ALL: '전체관람가',
  AGE_12: '12세 이상',
  AGE_15: '15세 이상',
  AGE_19: '청소년관람불가',
}

const FORMAT_COLOR: Record<string, string> = {
  '2D': 'bg-gray-100 text-gray-700',
  '3D': 'bg-blue-100 text-blue-700',
  '4DX': 'bg-orange-100 text-orange-700',
  IMAX: 'bg-purple-100 text-purple-700',
  'IMAX 3D': 'bg-indigo-100 text-indigo-700',
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`text-2xl transition-colors ${n <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review, onHelpful }: { review: Review; onHelpful: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-sm text-gray-900">{review.user_name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            {review.is_spoiler && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">스포일러</span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('ko-KR')}</span>
      </div>
      {review.content && <p className="text-sm text-gray-700 mb-3">{review.content}</p>}
      <button
        onClick={() => onHelpful(review.id)}
        className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-1 transition-colors"
      >
        👍 도움이 돼요 ({review.helpful_count})
      </button>
    </div>
  )
}

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  // Review form
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [isSpoiler, setIsSpoiler] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (!id) return
    getMovie(id).then(res => setMovie(res.data)).finally(() => setLoading(false))
    getMovieReviews(id).then(res => setReviews(res.data)).catch(() => {})
    if (user) {
      checkFavorite(id).then(res => setIsFavorite(res.data.is_favorite)).catch(() => {})
    }
  }, [id, user])

  const handleFavorite = async () => {
    if (!user) { navigate('/login'); return }
    if (!id) return
    setFavLoading(true)
    try {
      if (isFavorite) {
        await removeFavorite(id)
        setIsFavorite(false)
      } else {
        await addFavorite(id)
        setIsFavorite(true)
      }
    } finally {
      setFavLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!user) { navigate('/login'); return }
    if (!id) return
    setReviewError('')
    setSubmitting(true)
    try {
      const res = await createReview(id, { rating, content: content || undefined, is_spoiler: isSpoiler })
      setReviews(prev => [res.data, ...prev])
      setShowReviewForm(false)
      setContent('')
      setRating(5)
      setIsSpoiler(false)
    } catch (e: any) {
      setReviewError(e.response?.data?.detail || '리뷰 등록에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  const handleHelpful = async (reviewId: string) => {
    if (!user) { navigate('/login'); return }
    try {
      const res = await toggleReviewHelpful(reviewId)
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, helpful_count: res.data.helpful_count } : r
      ))
    } catch {}
  }

  const avgRating = (movie as any)?.avg_rating
  const reviewCount = (movie as any)?.review_count ?? reviews.length

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="flex gap-8">
          <div className="w-56 aspect-[2/3] bg-gray-200 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">영화를 찾을 수 없습니다.</div>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex gap-6 md:gap-10">
        <div className="w-40 md:w-56 flex-shrink-0">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover rounded-xl shadow-md"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              포스터 없음
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex-1">{movie.title}</h1>
            <button
              onClick={handleFavorite}
              disabled={favLoading}
              className={`text-2xl transition-all ${isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
              title={isFavorite ? '찜 해제' : '찜하기'}
            >
              {isFavorite ? '♥' : '♡'}
            </button>
          </div>
          {movie.title_en && <p className="text-gray-400 text-sm mb-3">{movie.title_en}</p>}

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
              {RATING_LABEL[movie.rating] ?? movie.rating}
            </span>
            <span className="text-gray-300">|</span>
            <span>{movie.runtime}분</span>
            <span className="text-gray-300">|</span>
            <span>감독 {movie.director}</span>
          </div>

          {avgRating && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400">★</span>
              <span className="font-bold text-gray-900">{Number(avgRating).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({reviewCount}개 리뷰)</span>
            </div>
          )}

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {movie.genres.map((g) => (
                <span key={g.id} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {movie.formats && movie.formats.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {movie.formats.map((f) => (
                <span
                  key={f.id}
                  className={`text-xs px-2 py-0.5 rounded font-medium ${FORMAT_COLOR[f.code] ?? 'bg-gray-100 text-gray-700'}`}
                >
                  {f.name}
                  {f.extra_charge > 0 && ` +${f.extra_charge.toLocaleString()}원`}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-600 text-sm leading-relaxed mb-8">{movie.synopsis}</p>

          <button
            onClick={() => navigate(`/booking?movieId=${id}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-3 rounded-xl text-base transition-colors"
            style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }}
          >
            예매하기
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            관람객 리뷰 ({reviewCount})
          </h2>
          {user && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 font-semibold transition-colors"
            >
              리뷰 작성
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">리뷰 작성</h3>
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">별점</p>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="영화 감상을 남겨주세요 (선택)"
              className="w-full px-3 py-2.5 border border-sky-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              rows={4}
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="spoiler"
                checked={isSpoiler}
                onChange={e => setIsSpoiler(e.target.checked)}
                className="rounded accent-orange-500"
              />
              <label htmlFor="spoiler" className="text-sm text-gray-600">스포일러 포함</label>
            </div>
            {reviewError && <p className="text-red-500 text-xs mt-2">{reviewError}</p>}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setShowReviewForm(false); setReviewError('') }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {submitting ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
