'use client'

import { useEffect, useState } from 'react'
import { getProperties, adminCreateProperty, adminUpdateProperty, adminDeleteProperty } from '@/api/properties'
import type { PropertyInput } from '@/api/properties'
import type { Property } from '@/types'
import AdminLayout from '@/components/AdminLayout'

const PROPERTY_TYPE_LABEL: Record<string, string> = {
  ALL: '전체', AGE_12: '12세', AGE_15: '15세', AGE_19: '청소년불가',
}
const STATUS_LABEL: Record<string, string> = {
  LISTED: '예약 가능', COMING_SOON: '오픈 예정', DELISTED: '판매 종료',
}
const STATUS_COLOR: Record<string, string> = {
  LISTED: 'text-green-600 bg-green-50',
  COMING_SOON: 'text-gold-600 bg-gold-50',
  DELISTED: 'text-gray-500 bg-gray-100',
}

const EMPTY_FORM: PropertyInput = {
  name: '',
  name_en: '',
  description: '',
  host_name: '',
  highlights: [],
  max_guests: 0,
  property_type: 'APARTMENT',
  photo_url: '',
  listed_at: null,
  status: 'LISTED',
}

function PropertyModal({
  property,
  onClose,
  onSaved,
}: {
  property: Property | null
  onClose: () => void
  onSaved: (m: Property) => void
}) {
  const isEdit = property !== null
  const [form, setForm] = useState<PropertyInput>(() =>
    property
      ? {
          name: property.name,
          name_en: property.name_en ?? '',
          description: property.description,
          host_name: property.host_name,
          highlights: property.highlights ?? [],
          max_guests: property.max_guests,
          property_type: property.property_type,
          photo_url: property.photo_url ?? '',
          listed_at: property.listed_at ? property.listed_at.split('T')[0] : null,
          status: property.status,
        }
      : { ...EMPTY_FORM }
  )
  const [highlightsText, setHighlightsText] = useState((property?.highlights ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof PropertyInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.description.trim() || !form.host_name.trim() || form.max_guests <= 0) {
      setError('필수 항목을 모두 입력해주세요')
      return
    }
    setSaving(true)
    setError(null)
    const payload: PropertyInput = {
      ...form,
      name_en: form.name_en?.trim() || null,
      highlights: highlightsText.split(',').map((s) => s.trim()).filter(Boolean),
      photo_url: form.photo_url?.trim() || null,
      listed_at: form.listed_at || null,
    }
    try {
      const res = isEdit
        ? await adminUpdateProperty(property!.id, payload)
        : await adminCreateProperty(payload)
      onSaved(res.data)
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? '숙소 수정' : '숙소 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">제목 *</label>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="한국 제목"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">영문 제목</label>
              <input
                value={form.name_en ?? ''}
                onChange={(e) => set('name_en', e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="English title"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">호스트 *</label>
              <input
                value={form.host_name}
                onChange={(e) => set('host_name', e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">숙박일(분) *</label>
              <input
                type="number"
                value={form.max_guests || ''}
                onChange={(e) => set('max_guests', parseInt(e.target.value) || 0)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                min={1}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">숙소 유형 *</label>
              <select
                value={form.property_type}
                onChange={(e) => set('property_type', e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="APARTMENT">아파트</option>
                <option value="HOTEL">호텔</option>
                <option value="GUESTHOUSE">게스트하우스</option>
                <option value="PENSION">펜션</option>
                <option value="HOUSE">단독주택</option>
                <option value="AGE_19">청소년투숙불가</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">상태 *</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="LISTED">예약 가능</option>
                <option value="COMING_SOON">오픈 예정</option>
                <option value="ENDED">숙박 종료</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">특징진 (쉼표로 구분)</label>
              <input
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="배우1, 배우2, 배우3"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">소개 *</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">사진 URL</label>
              <input
                value={form.photo_url ?? ''}
                onChange={(e) => set('photo_url', e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">개봉일</label>
              <input
                type="date"
                value={form.listed_at ?? ''}
                onChange={(e) => set('listed_at', e.target.value || null)}
                className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-line text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-mist"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-charcoal hover:bg-charcoal-soft disabled:bg-ink-faint text-white py-2 rounded-xl text-sm font-medium transition-colors"
            >
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '숙소 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [modalProperty, setModalProperty] = useState<Property | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    getProperties()
      .then((res) => setProperties(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = (saved: Property) => {
    setProperties((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id)
      return idx >= 0 ? prev.map((m) => (m.id === saved.id ? saved : m)) : [saved, ...prev]
    })
    setModalProperty(undefined)
  }

  const handleDelete = async (property: Property) => {
    if (!confirm(`"${property.name}"을(를) 삭제하시겠습니까?`)) return
    setDeletingId(property.id)
    try {
      await adminDeleteProperty(property.id)
      setProperties((prev) => prev.filter((m) => m.id !== property.id))
    } catch {
      alert('삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">숙소 관리</h1>
          <button
            onClick={() => setModalProperty(null)}
            className="bg-charcoal hover:bg-charcoal-soft text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + 숙소 추가
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-200 rounded-lg" />)}
          </div>
        ) : properties.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">등록된 숙소가 없습니다.</p>
        ) : (
          <div className="bg-white border border-line rounded-xl overflow-x-auto">
            <table className="w-full text-[14px] leading-[1.55]">
              <thead>
                <tr className="bg-gray-50 border-b border-line">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">제목</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">호스트</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">숙소 유형</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">숙박시간</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">상태</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((m) => (
                  <tr key={m.id} className="hover:bg-mist">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{m.name}</div>
                      {m.name_en && <div className="text-[12px] leading-[1.6] text-ink-faint">{m.name_en}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.host_name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {PROPERTY_TYPE_LABEL[m.property_type] ?? m.property_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{m.max_guests}분</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLOR[m.status] ?? ''}`}>
                        {STATUS_LABEL[m.status] ?? m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setModalProperty(m)}
                        className="text-gold-600 hover:text-gold-800 text-xs font-medium mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        disabled={deletingId === m.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40"
                      >
                        {deletingId === m.id ? '삭제 중' : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalProperty !== undefined && (
          <PropertyModal
            property={modalProperty}
            onClose={() => setModalProperty(undefined)}
            onSaved={handleSaved}
          />
        )}
      </div>
    </AdminLayout>
  )
}
