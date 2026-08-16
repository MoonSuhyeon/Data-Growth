'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { getMyCoupons, issueCoupon } from '@/api/properties'
import type { UserCoupon } from '@/types'

function CouponCard({ coupon }: { coupon: UserCoupon }) {
  const isActive = coupon.status_code === 'ACTIVE'
  const discount = coupon.type_code === 'FIXED_AMOUNT'
    ? `${coupon.discount_value.toLocaleString()}원`
    : `${coupon.discount_value}%`

  return (
    <div className={`bg-white rounded-xl border-2 ${isActive ? 'border-blue-200' : 'border-gray-200 opacity-60'} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-gray-900">{coupon.coupon_name}</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{discount} 할인</p>
          {coupon.min_booking_amount > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {coupon.min_booking_amount.toLocaleString()}원 이상 결제 시 사용 가능
            </p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isActive ? 'bg-blue-100 text-blue-700' :
          coupon.status_code === 'USED' ? 'bg-gray-100 text-gray-500' :
          'bg-red-100 text-red-500'
        }`}>
          {isActive ? '사용 가능' : coupon.status_code === 'USED' ? '사용 완료' : '만료'}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
        <span>코드: {coupon.coupon_code}</span>
        {coupon.expires_at && (
          <span>~{new Date(coupon.expires_at).toLocaleDateString('ko-KR')}</span>
        )}
      </div>
    </div>
  )
}

export default function MyCoupons() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [coupons, setCoupons] = useState<UserCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [issuing, setIssuing] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    getMyCoupons()
      .then(r => setCoupons(r.data))
      .finally(() => setLoading(false))
  }, [user])

  const handleIssue = async () => {
    if (!code.trim()) return
    setError('')
    setIssuing(true)
    try {
      const res = await issueCoupon(code.trim())
      setCoupons(prev => [res.data, ...prev])
      setCode('')
    } catch (e: any) {
      setError(e.response?.data?.detail || '쿠폰 등록에 실패했습니다')
    } finally {
      setIssuing(false)
    }
  }

  const activeCoupons = coupons.filter(c => c.status_code === 'ACTIVE')
  const usedCoupons = coupons.filter(c => c.status_code !== 'ACTIVE')

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">내 쿠폰</h1>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">쿠폰 코드 등록</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="쿠폰 코드 입력"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => e.key === 'Enter' && handleIssue()}
          />
          <button
            onClick={handleIssue}
            disabled={issuing || !code.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {issuing ? '등록 중...' : '등록'}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-500">사용 가능 ({activeCoupons.length})</p>
        {activeCoupons.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">사용 가능한 쿠폰이 없습니다</p>
        ) : (
          activeCoupons.map(c => <CouponCard key={c.id} coupon={c} />)
        )}

        {usedCoupons.length > 0 && (
          <>
            <p className="text-sm font-medium text-gray-500 mt-6">사용/만료 ({usedCoupons.length})</p>
            {usedCoupons.map(c => <CouponCard key={c.id} coupon={c} />)}
          </>
        )}
      </div>
    </div>
  )
}
