'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReceipt } from '@/api/properties'
import { useAuthStore } from '@/store/authStore'
import type { Receipt } from '@/types'

const RECEIPT_TYPE_LABEL: Record<string, string> = {
  GENERAL: '일반 영수증',
  CASH: '현금 영수증',
  TAX: '세금계산서',
}

export default function ReceiptPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { user } = useAuthStore()
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (!bookingId) return
    getReceipt(bookingId)
      .then((res) => setReceipt(res.data))
      .catch((err) => {
        const detail = err?.response?.data?.detail
        setError(typeof detail === 'string' ? detail : '영수증을 불러올 수 없습니다.')
      })
      .finally(() => setLoading(false))
  }, [user, bookingId])

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-4 py-8 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-xl" />
      </main>
    )
  }

  if (error || !receipt) {
    return (
      <main className="max-w-md mx-auto px-4 py-8 text-center text-gray-500">
        <p className="mb-4">{error ?? '영수증을 찾을 수 없습니다.'}</p>
        <button onClick={() => router.back()} className="text-blue-600 text-sm hover:underline">
          뒤로 가기
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-5 text-white">
          <p className="text-xs font-medium opacity-80 mb-1">{RECEIPT_TYPE_LABEL[receipt.receipt_type]}</p>
          <p className="text-2xl font-bold">{receipt.total_amount.toLocaleString()}원</p>
          <p className="text-xs opacity-70 mt-1 font-mono">{receipt.receipt_number}</p>
        </div>

        <div className="px-6 py-5 space-y-3">
          <Row label="발행일" value={new Date(receipt.issued_at).toLocaleDateString('ko-KR')} />
          <Row label="공급가액" value={`${(receipt.total_amount - receipt.tax_amount).toLocaleString()}원`} />
          <Row label="부가세 (10%)" value={`${receipt.tax_amount.toLocaleString()}원`} />
          <div className="border-t border-gray-200 pt-3">
            <Row label="합계" value={`${receipt.total_amount.toLocaleString()}원`} bold />
          </div>
          {receipt.issuer_name && (
            <Row label="발행자" value={receipt.issuer_name} />
          )}
          {receipt.issuer_registration_number && (
            <Row label="사업자번호" value={receipt.issuer_registration_number} />
          )}
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={() => router.back()}
            className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            닫기
          </button>
        </div>
      </div>
    </main>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm ${bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{value}</span>
    </div>
  )
}
