'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import {
  adminGetPeakDates,
  adminCreatePeakDate,
  adminUpdatePeakDate,
  adminDeletePeakDate,
} from '@/api/properties'
import type { PeakDate } from '@/types'

const EMPTY: Omit<PeakDate, 'id'> = {
  date: '',
  name: '',
  extra_charge: 0,
  description: null,
}

function Modal({
  item,
  onClose,
  onSaved,
}: {
  item: PeakDate | null
  onClose: () => void
  onSaved: (s: PeakDate) => void
}) {
  const isEdit = item !== null
  const [form, setForm] = useState<Omit<PeakDate, 'id'>>(
    item ? { date: item.date, name: item.name, extra_charge: item.extra_charge, description: item.description } : { ...EMPTY }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: string, value: string | number | null) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.date || !form.name) { setError('날짜와 이름을 입력해주세요'); return }
    setSaving(true)
    setError(null)
    try {
      const res = isEdit
        ? await adminUpdatePeakDate(item!.id, form)
        : await adminCreatePeakDate(form)
      onSaved(res.data)
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? '특별 요금일 수정' : '특별 요금일 추가'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">날짜 *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">이름 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="예: 문화의 날"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">추가 요금 (원)</label>
            <input
              type="number"
              value={form.extra_charge}
              onChange={(e) => set('extra_charge', Number(e.target.value))}
              min={0}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">설명</label>
            <input
              type="text"
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value || null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 rounded-xl text-sm font-medium"
            >
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminPeakDates() {
  const [items, setItems] = useState<PeakDate[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<PeakDate | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    adminGetPeakDates()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = (saved: PeakDate) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === saved.id)
      return idx >= 0 ? prev.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...prev]
    })
    setModal(undefined)
  }

  const handleDelete = async (item: PeakDate) => {
    if (!confirm(`${item.name} (${item.date})을 삭제하시겠습니까?`)) return
    setDeletingId(item.id)
    try {
      await adminDeletePeakDate(item.id)
      setItems((prev) => prev.filter((x) => x.id !== item.id))
    } catch {
      alert('삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">특별 요금일 관리</h1>
          <button
            onClick={() => setModal(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + 추가
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-200 rounded-lg" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">특별 요금일이 없습니다.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">날짜</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">이름</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">추가요금</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{item.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-700">+{item.extra_charge.toLocaleString()}원</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setModal(item)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40"
                      >
                        {deletingId === item.id ? '삭제 중' : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal !== undefined && (
        <Modal item={modal} onClose={() => setModal(undefined)} onSaved={handleSaved} />
      )}
    </AdminLayout>
  )
}
