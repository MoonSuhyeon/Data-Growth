'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import client from '@/api/client'

interface AdminRefund {
  id: string
  booking_id: string
  booking_number: string
  user_name: string
  property_name: string
  refund_amount: number
  reason: string | null
  status: string
  requested_at: string
  processed_at: string | null
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: '처리중',
  APPROVED: '승인됨',
  REJECTED: '거절됨',
  COMPLETED: '완료',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-yellow-700 bg-yellow-100',
  APPROVED: 'text-gold-700 bg-gold-100',
  REJECTED: 'text-red-700 bg-red-100',
  COMPLETED: 'text-green-700 bg-green-100',
}

export default function AdminRefunds() {
  const [refunds, setRefunds] = useState<AdminRefund[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (filterStatus) params.status = filterStatus
    client
      .get<AdminRefund[]>('/admin/refunds', { params })
      .then((r) => setRefunds(r.data))
      .finally(() => setLoading(false))
  }, [filterStatus])

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">환불 관리</h1>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">전체 상태</option>
            <option value="PENDING">처리중</option>
            <option value="COMPLETED">완료</option>
            <option value="REJECTED">거절됨</option>
          </select>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-200 rounded-lg" />)}
          </div>
        ) : refunds.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">환불 내역이 없습니다.</p>
        ) : (
          <div className="bg-white border border-line rounded-xl overflow-x-auto">
            <table className="w-full text-[14px] leading-[1.55]">
              <thead>
                <tr className="bg-gray-50 border-b border-line">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">예약번호</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">사용자</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">숙소</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">환불금액</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">상태</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">신청일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {refunds.map((r) => (
                  <tr key={r.id} className="hover:bg-mist">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.booking_number}</td>
                    <td className="px-4 py-3 text-gray-700 hidden md:table-cell">{r.user_name}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{r.property_name}</td>
                    <td className="px-4 py-3 text-gray-700">{r.refund_amount.toLocaleString()}원</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLOR[r.status] ?? ''}`}>
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                      {new Date(r.requested_at).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
