import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { adminGetCoupons, adminCreateCoupon, adminToggleCoupon } from '../../api/properties'
import type { CouponMaster } from '../../types'

const empty = {
  code: '',
  name: '',
  type_code: 'FIXED_AMOUNT' as const,
  discount_value: 0,
  min_booking_amount: 0,
  max_discount_amount: null as number | null,
  valid_from: '',
  valid_to: '',
  max_issues: null as number | null,
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<CouponMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminGetCoupons()
      .then(r => setCoupons(r.data))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    setError('')
    setSaving(true)
    try {
      const data = {
        ...form,
        valid_from: new Date(form.valid_from).toISOString(),
        valid_to: new Date(form.valid_to).toISOString(),
      }
      const res = await adminCreateCoupon(data as any)
      setCoupons(prev => [res.data, ...prev])
      setShowModal(false)
      setForm(empty)
    } catch (e: any) {
      setError(e.response?.data?.detail || '생성 실패')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (id: string) => {
    await adminToggleCoupon(id)
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c))
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">쿠폰 관리</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            쿠폰 생성
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['코드', '이름', '할인', '발급', '유효기간', '상태', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-blue-700">{c.code}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {c.type_code === 'FIXED_AMOUNT'
                        ? `${c.discount_value.toLocaleString()}원`
                        : `${c.discount_value}%`
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {c.issued_count}{c.max_issues ? `/${c.max_issues}` : ''}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(c.valid_from).toLocaleDateString('ko-KR')} ~{' '}
                      {new Date(c.valid_to).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.is_active ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(c.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {c.is_active ? '비활성화' : '활성화'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">쿠폰 생성</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">쿠폰 코드</label>
                  <input
                    value={form.code}
                    onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="WELCOME2024"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">쿠폰 이름</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">할인 유형</label>
                  <select
                    value={form.type_code}
                    onChange={e => setForm(p => ({ ...p, type_code: e.target.value as any }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="FIXED_AMOUNT">정액 (원)</option>
                    <option value="PERCENT">정률 (%)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">할인값</label>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={e => setForm(p => ({ ...p, discount_value: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">최소 결제 금액</label>
                  <input
                    type="number"
                    value={form.min_booking_amount}
                    onChange={e => setForm(p => ({ ...p, min_booking_amount: Number(e.target.value) }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-700">유효 시작</label>
                    <input
                      type="date"
                      value={form.valid_from}
                      onChange={e => setForm(p => ({ ...p, valid_from: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">유효 종료</label>
                    <input
                      type="date"
                      value={form.valid_to}
                      onChange={e => setForm(p => ({ ...p, valid_to: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">최대 발급 수 (빈칸=무제한)</label>
                  <input
                    type="number"
                    value={form.max_issues ?? ''}
                    onChange={e => setForm(p => ({ ...p, max_issues: e.target.value ? Number(e.target.value) : null }))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => { setShowModal(false); setForm(empty); setError('') }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm"
                >
                  취소
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving || !form.code || !form.name || !form.valid_from || !form.valid_to}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm disabled:opacity-50"
                >
                  {saving ? '생성 중...' : '생성'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
