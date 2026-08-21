'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { adminGetReviews, adminUpdateReviewStatus } from '@/api/properties'
import type { Review } from '@/types'

const STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'ACTIVE', label: '정상' },
  { value: 'REPORTED', label: '신고됨' },
  { value: 'HIDDEN', label: '숨김' },
  { value: 'DELETED', label: '삭제' },
]

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const load = async () => {
    setLoading(true)
    const r = await adminGetReviews(status || undefined)
    setReviews(r.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [status])

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    await adminUpdateReviewStatus(reviewId, newStatus)
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status_code: newStatus } : r))
  }

  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    HIDDEN: 'bg-yellow-100 text-yellow-700',
    REPORTED: 'bg-red-100 text-red-700',
    DELETED: 'bg-mist text-ink-faint',
  }

  return (
    <AdminLayout>
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-ink">리뷰 관리</h1>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  status === opt.value
                    ? 'bg-charcoal text-white'
                    : 'bg-white text-ink-soft border border-line hover:bg-mist'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-ink-faint">로딩 중...</div>
        ) : (
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="text-center py-12 text-ink-faint">리뷰가 없습니다</div>
            )}
            {reviews.map(r => (
              <div key={r.id} className="bg-white rounded-xl shadow-sm p-5 border border-line">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      {r.verified_stay && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                          실제 투숙
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status_code] || 'bg-mist text-ink-faint'}`}>
                        {r.status_code}
                      </span>
                    </div>
                    <p className="text-sm text-ink mb-2">{r.content || '(내용 없음)'}</p>
                    <p className="text-[12px] leading-[1.6] text-ink-faint">
                      {r.user_name} · {new Date(r.created_at).toLocaleString('ko-KR')} · 도움 {r.helpful_count}명
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {r.status_code !== 'HIDDEN' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'HIDDEN')}
                        className="px-3 py-1.5 text-xs border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
                      >
                        숨김
                      </button>
                    )}
                    {r.status_code !== 'ACTIVE' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'ACTIVE')}
                        className="px-3 py-1.5 text-xs border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
                      >
                        복원
                      </button>
                    )}
                    {r.status_code !== 'DELETED' && (
                      <button
                        onClick={() => handleStatusChange(r.id, 'DELETED')}
                        className="px-3 py-1.5 text-xs border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
