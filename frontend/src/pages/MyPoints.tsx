import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getMyPoints } from '../api/properties'
import type { PointBalance } from '../types'

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  EARN: { label: '적립', color: 'text-green-600' },
  USE: { label: '사용', color: 'text-red-500' },
  REFUND: { label: '환불 복구', color: 'text-blue-600' },
  EXPIRE: { label: '소멸', color: 'text-gray-400' },
}

export default function MyPoints() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [data, setData] = useState<PointBalance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    getMyPoints()
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [user, navigate])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">포인트</h1>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6">
        <p className="text-sm text-blue-200 mb-1">보유 포인트</p>
        <p className="text-4xl font-bold">{(data?.balance ?? 0).toLocaleString()}P</p>
        <p className="text-xs text-blue-200 mt-2">예약 금액의 1% 자동 적립</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">포인트 내역</h2>
        </div>
        {!data?.histories.length ? (
          <div className="py-12 text-center text-gray-400">포인트 내역이 없습니다</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data.histories.map(h => {
              const meta = TYPE_LABELS[h.type] || { label: h.type, color: 'text-gray-600' }
              const sign = h.type === 'EARN' || h.type === 'REFUND' ? '+' : '-'
              return (
                <div key={h.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className={`mr-2 text-xs font-semibold ${meta.color}`}>[{meta.label}]</span>
                      {h.description || meta.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(h.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${meta.color}`}>
                      {sign}{Math.abs(h.amount).toLocaleString()}P
                    </p>
                    <p className="text-xs text-gray-400">{h.balance_after.toLocaleString()}P</p>
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
