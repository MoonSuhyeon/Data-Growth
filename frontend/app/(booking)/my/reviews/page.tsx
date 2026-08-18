'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { getMyReviews, deleteReview } from '@/api/properties'
import type { Review } from '@/types'

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function MyReviews() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    getMyReviews()
      .then(r => setReviews(r.data))
      .finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (reviewId: string) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return
    await deleteReview(reviewId)
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">내 리뷰</h1>
      {reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">작성한 리뷰가 없습니다</p>
          <Link href="/" className="text-blue-600 hover:underline">숙소 보러 가기</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <StarRating rating={review.rating} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  review.status_code === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  review.status_code === 'HIDDEN' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {review.status_code === 'ACTIVE' ? '공개' :
                   review.status_code === 'HIDDEN' ? '숨김' : review.status_code}
                </span>
              </div>
              {review.content && (
                <p className="text-gray-700 text-sm mb-3">{review.content}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span>도움 {review.helpful_count}명</span>
                  <span>{new Date(review.created_at).toLocaleDateString('ko-KR')}</span>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
