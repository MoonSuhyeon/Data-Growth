'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { getMyPoints } from '@/api/properties'
import type { PointBalance } from '@/types'

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  EARN: { label: '적립', color: 'text-green-600' },
  USE: { label: '사용', color: 'text-red-500' },
  REFUND: { label: '환불 복구', color: 'text-gold-700' },
  EXPIRE: { label: '소멸', color: 'text-ink-faint' },
}

export default function MyPoints() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [data, setData] = useState<PointBalance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    getMyPoints()
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">포인트</h1>

      <div className="bg-charcoal rounded-2xl p-6 text-white mb-6">
        <p className="text-sm text-white/55 mb-1">보유 포인트</p>
        {/* 검정 면 위의 숫자만 골드로. 화이트·검정·골드가 한 카드 안에서
            각자 자리를 갖는다 — 면은 검정, 글은 흰색, **값은 골드**. */}
        <p className="text-4xl font-bold text-gilt">{(data?.balance ?? 0).toLocaleString()}P</p>
        <p className="text-xs text-white/55 mt-2">예약 금액의 1% 자동 적립</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="font-semibold text-ink">포인트 내역</h2>
        </div>
        {!data?.histories.length ? (
          <div className="py-12 text-center text-ink-faint">포인트 내역이 없습니다</div>
        ) : (
          <div className="divide-y divide-line">
            {data.histories.map(h => {
              const meta = TYPE_LABELS[h.type] || { label: h.type, color: 'text-ink-soft' }
              const sign = h.type === 'EARN' || h.type === 'REFUND' ? '+' : '-'
              return (
                <div key={h.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      <span className={`mr-2 text-xs font-semibold ${meta.color}`}>[{meta.label}]</span>
                      {h.description || meta.label}
                    </p>
                    <p className="text-xs text-ink-faint mt-0.5">
                      {new Date(h.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${meta.color}`}>
                      {sign}{Math.abs(h.amount).toLocaleString()}P
                    </p>
                    <p className="text-xs text-ink-faint">{h.balance_after.toLocaleString()}P</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
