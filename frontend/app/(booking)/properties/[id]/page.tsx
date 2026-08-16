'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getProperty, getPropertyReviews, createReview, toggleReviewHelpful,
  checkWishlist, addWishlist, removeWishlist,
} from '@/api/properties'
import { useAuthStore } from '@/store/authStore'
import type { Property, Review } from '@/types'

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  ALL: '전체투숙가',
  AGE_12: '12세 이상',
  AGE_15: '15세 이상',
  AGE_19: '청소년투숙불가',
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

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isWishlist, setIsWishlist] = useState(false)
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
    getProperty(id).then(res => setProperty(res.data)).finally(() => setLoading(false))
    getPropertyReviews(id).then(res => setReviews(res.data)).catch(() => {})
    if (user) {
      checkWishlist(id).then(res => setIsWishlist(res.data.is_wishlist)).catch(() => {})
    }
  }, [id, user])

  const handleWishlist = async () => {
    if (!user) { router.push('/login'); return }
    if (!id) return
    setFavLoading(true)
    try {
      if (isWishlist) {
        await removeWishlist(id)
        setIsWishlist(false)
      } else {
        await addWishlist(id)
        setIsWishlist(true)
      }
    } finally {
      setFavLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!user) { router.push('/login'); return }
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
    if (!user) { router.push('/login'); return }
    try {
      const res = await toggleReviewHelpful(reviewId)
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, helpful_count: res.data.helpful_count } : r
      ))
    } catch {}
  }

  const avgRating = (property as any)?.avg_rating
  const reviewCount = (property as any)?.review_count ?? reviews.length

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

  if (!property) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">숙소를 찾을 수 없습니다.</div>
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex gap-6 md:gap-10">
        <div className="w-40 md:w-56 flex-shrink-0">
          {property.photo_url ? (
            <img
              src={property.photo_url}
              alt={property.name}
              className="w-full aspect-[2/3] object-cover rounded-xl shadow-md"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              사진 없음
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex-1">{property.name}</h1>
            <button
              onClick={handleWishlist}
              disabled={favLoading}
              className={`text-2xl transition-all ${isWishlist ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
              title={isWishlist ? '위시리스트 해제' : '위시리스트 담기'}
            >
              {isWishlist ? '♥' : '♡'}
            </button>
          </div>
          {property.name_en && <p className="text-gray-400 text-sm mb-3">{property.name_en}</p>}

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
              {PROPERTY_TYPE_LABEL[property.property_type] ?? property.property_type}
            </span>
            <span className="text-gray-300">|</span>
            <span>{property.max_guests}분</span>
            <span className="text-gray-300">|</span>
            <span>호스트 {property.host_name}</span>
          </div>

          {avgRating && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400">★</span>
              <span className="font-bold text-gray-900">{Number(avgRating).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({reviewCount}개 리뷰)</span>
            </div>
          )}

          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {property.amenities.map((g) => (
                <span key={g.id} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {property.board_types && property.board_types.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {property.board_types.map((f) => (
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

          <p className="text-gray-600 text-sm leading-relaxed mb-8">{property.description}</p>

          <button
            onClick={() => router.push(`/booking?propertyId=${id}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-3 rounded-xl text-base transition-colors"
            style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }}
          >
            예약하기
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            투숙객 리뷰 ({reviewCount})
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
              placeholder="숙소 감상을 남겨주세요 (선택)"
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
