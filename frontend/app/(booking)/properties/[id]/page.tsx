'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getProperty, getPropertyReviews, createReview, toggleReviewHelpful,
  checkWishlist, addWishlist, removeWishlist,
} from '@/api/properties'
import { useAuthStore } from '@/store/authStore'
import { track } from '@/lib/tracking'
import { STICKY_CTA, useAssignment } from '@/lib/experiments'
import type { Property, Review } from '@/types'

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  ALL: '전체투숙가',
  AGE_12: '12세 이상',
  AGE_15: '15세 이상',
  AGE_19: '청소년투숙불가',
}

/** 식사 조건 배지 색. 키는 `backend/app/seed.py` 의 `BOARD_TYPES` 코드다. */
const BOARD_COLOR: Record<string, string> = {
  ROOM_ONLY: 'bg-gray-100 text-gray-700',
  BREAKFAST: 'bg-amber-100 text-amber-700',
  HALF_BOARD: 'bg-emerald-100 text-emerald-700',
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
            {/* 투숙 여부는 서버가 예약 이력에서 판정한다. 화면이 추측하지 않는다. */}
            {review.verified_stay && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                실제 투숙
              </span>
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
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (!id) return
    // 404 를 안 받으면 처리되지 않은 거부로 샌다. 화면은 `property` 가 null 인
    // 채로 "찾을 수 없습니다" 를 그리니 멀쩡해 보이는데, 콘솔에는 매번 오류가
    // 찍히고 오류 리포팅을 붙이면 그때부터 노이즈가 된다.
    getProperty(id)
      .then(res => setProperty(res.data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false))
    getPropertyReviews(id).then(res => setReviews(res.data)).catch(() => {})
    if (user) {
      checkWishlist(id).then(res => setIsWishlist(res.data.is_wishlist)).catch(() => {})
    }
  }, [id, user])

  /**
   * sticky CTA 실험. 배정은 서버가 준다.
   *
   * 데스크톱도 배정을 받는다 — 배정을 기기와 무관하게 두면 같은 사람이 기기를
   * 바꿔도 군이 유지된다. 대신 이 실험의 대상은 모바일이므로 sticky 바는
   * `md:hidden` 이고, 분석도 `device_type == MOBILE` 로 거른다.
   */
  const assignment = useAssignment(STICKY_CTA)
  const showSticky = assignment.variant === 'treatment'

  /**
   * 노출 이벤트. **배정이 정해진 뒤에 보낸다.**
   *
   * 마운트 즉시 보내면 배정 응답이 아직 안 와서 변형이 안 실린다. 그러면 노출은
   * 기록됐는데 어느 군인지 모르는 이벤트가 생기고, 그 사람은 분모 어디에도 못
   * 들어간다. 노출의 정의는 "봤다"가 아니라 **"어느 군을 봤다"** 여야 한다.
   *
   * 의존성이 `id` 와 배정 상태뿐인 것도 의도다. 위 effect 는 로그인 상태가 바뀔
   * 때도 다시 도는데, 조회 이벤트를 거기 같이 넣으면 로그인 한 번에 같은 숙소
   * 조회가 두 번 세어진다. 중복 제거는 재전송을 접어 줄 뿐, 정말로 두 번 발생한
   * 이벤트는 구분하지 못한다 — 계측 버그는 계측하는 쪽에서 막아야 한다.
   */
  useEffect(() => {
    if (!id || assignment.loading) return
    track({ event_name: 'property_viewed', property_id: String(id) })
  }, [id, assignment.loading])

  const startBooking = () => {
    track({ event_name: 'booking_started', property_id: String(id) })
    router.push(`/booking?propertyId=${id}`)
  }

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
        // 찜을 **누른 순간**이 아니라 성공한 뒤에 보낸다. 실패한 찜은 찜이 아니다.
        track({ event_name: 'wishlist_added', property_id: String(id) })
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
      const res = await createReview(id, { rating, content: content || undefined })
      setReviews(prev => [res.data, ...prev])
      setShowReviewForm(false)
      setContent('')
      setRating(5)
    } catch (e: any) {
      // 403 은 "투숙을 마친 예약이 없다" 이다. 일반 실패 문구로 덮으면
      // 사용자는 왜 못 쓰는지 영영 모른다.
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
        {/* 스켈레톤은 실제 레이아웃과 같은 폭이어야 한다. 여기만 `w-56` 이면
            모바일에서 로딩이 끝나는 순간 이미지가 224px → 160px 로 줄면서
            아래 내용이 통째로 위로 튄다. 마지막에 튀는 화면에서는 누르려던 것과
            눌린 것이 달라진다 — 계측 이전에 전환의 문제다. */}
        <div className="flex gap-6 md:gap-10">
          <div className="w-40 md:w-56 aspect-[2/3] bg-gray-200 rounded-xl flex-shrink-0" />
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
    <main
      className={`max-w-4xl mx-auto px-4 py-8 ${showSticky ? 'pb-28 md:pb-8' : ''}`}
    >
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
                  className={`text-xs px-2 py-0.5 rounded font-medium ${BOARD_COLOR[f.code] ?? 'bg-gray-100 text-gray-700'}`}
                >
                  {f.name}
                  {f.extra_charge > 0 && ` +${f.extra_charge.toLocaleString()}원`}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-600 text-sm leading-relaxed mb-8">{property.description}</p>

          <button
            onClick={startBooking}
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

      {/*
        실험군만 보는 하단 고정 CTA. 모바일 전용(`md:hidden`)이다 — 데스크톱은
        스크롤이 짧아 CTA 가 늘 보이므로 이 처치가 손댈 게 없다.

        `pb-28` 로 본문 아래를 비워 두는 게 짝이다. 안 그러면 이 바가 마지막
        리뷰를 덮고, 처치군만 콘텐츠가 가려진 채로 비교된다 — 그러면 측정하는
        게 "CTA 를 붙인 효과"가 아니라 "리뷰를 가린 효과"가 섞인 값이 된다.

        `pb-[env(safe-area-inset-bottom)]` 은 아이폰 홈 인디케이터 영역이다.
        없으면 버튼 아래쪽이 잘려 탭이 안 먹는다.
      */}
      {showSticky && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{property.name}</p>
              <p className="text-xs text-gray-400 truncate">
                {avgRating ? `★ ${avgRating.toFixed(1)} · 리뷰 ${reviewCount}` : property.region}
              </p>
            </div>
            <button
              onClick={startBooking}
              className="flex-none bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl text-base transition-colors"
            >
              예약하기
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
