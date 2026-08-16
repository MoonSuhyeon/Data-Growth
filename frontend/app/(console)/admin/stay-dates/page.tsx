'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import client from '@/api/client'
import type { Property } from '@/types'

interface RoomTypeInfo {
  id: string
  name: string
  property_id: string
  property_name: string
  total_rooms: number
}

interface AdminStayDate {
  id: string
  property_id: string
  property_name: string
  room_type_id: string
  room_type_name: string
  total_rooms: number
  check_in: string
  check_out: string
  stay_date: string
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR')
}

function toTimeStr(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const EMPTY_FORM = {
  property_id: '',
  room_type_id: '',
  stay_date: '',
  check_in: '',
  check_out: '',
}

function StayDateModal({
  stayDate,
  properties,
  roomTypes,
  onClose,
  onSaved,
}: {
  stayDate: AdminStayDate | null
  properties: Property[]
  roomTypes: RoomTypeInfo[]
  onClose: () => void
  onSaved: (s: AdminStayDate) => void
}) {
  const isEdit = stayDate !== null
  const [form, setForm] = useState(() =>
    stayDate
      ? {
          property_id: stayDate.property_id,
          room_type_id: stayDate.room_type_id,
          stay_date: stayDate.stay_date.split('T')[0],
          check_in: toTimeStr(stayDate.check_in),
          check_out: toTimeStr(stayDate.check_out),
        }
      : { ...EMPTY_FORM }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const propertyOptions = [
    ...new Map(roomTypes.map((h) => [h.property_id, h.property_name])).entries(),
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.property_id || !form.room_type_id || !form.stay_date || !form.check_in || !form.check_out) {
      setError('모든 항목을 입력해주세요')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      property_id: form.property_id,
      room_type_id: form.room_type_id,
      check_in: new Date(`${form.stay_date}T${form.check_in}:00`).toISOString(),
      check_out: new Date(`${form.stay_date}T${form.check_out}:00`).toISOString(),
      stay_date: new Date(`${form.stay_date}T00:00:00`).toISOString(),
    }
    try {
      const res = isEdit
        ? await client.put<AdminStayDate>(`/admin/stay-dates/${stayDate!.id}`, payload)
        : await client.post<AdminStayDate>('/admin/stay-dates', payload)
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">
            {isEdit ? '숙박 수정' : '숙박 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">숙소 *</label>
            <select
              value={form.property_id}
              onChange={(e) => set('property_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">숙소 선택</option>
              {properties.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">객실 타입 *</label>
            <select
              value={form.room_type_id}
              onChange={(e) => set('room_type_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">객실 타입 선택</option>
              {propertyOptions.map(([tid, tname]) => (
                <optgroup key={tid} label={tname}>
                  {roomTypes
                    .filter((h) => h.property_id === tid)
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.total_rooms}석)
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">숙박일 *</label>
            <input
              type="date"
              value={form.stay_date}
              onChange={(e) => set('stay_date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">시작 시간 *</label>
              <input
                type="time"
                value={form.check_in}
                onChange={(e) => set('check_in', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">종료 시간 *</label>
              <input
                type="time"
                value={form.check_out}
                onChange={(e) => set('check_out', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 rounded-xl text-sm font-medium transition-colors"
            >
              {saving ? '저장 중...' : isEdit ? '수정 완료' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminStayDates() {
  const [stayDates, setStayDates] = useState<AdminStayDate[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomTypeInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [filterProperty, setFilterProperty] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [modal, setModal] = useState<AdminStayDate | null | undefined>(undefined)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      client.get<Property[]>('/properties'),
      client.get<RoomTypeInfo[]>('/admin/room-types'),
    ]).then(([m, h]) => {
      setProperties(m.data)
      setRoomTypes(h.data)
    })
  }, [])

  useEffect(() => {
    const params: Record<string, string> = {}
    if (filterProperty) params.property_id = filterProperty
    if (filterDate) params.date = filterDate
    client
      .get<AdminStayDate[]>('/admin/stay-dates', { params })
      .then((r) => setStayDates(r.data))
      .finally(() => setLoading(false))
  }, [filterProperty, filterDate])

  const handleSaved = (saved: AdminStayDate) => {
    setStayDates((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id)
      return idx >= 0 ? prev.map((s) => (s.id === saved.id ? saved : s)) : [saved, ...prev]
    })
    setModal(undefined)
  }

  const handleDelete = async (s: AdminStayDate) => {
    if (
      !confirm(
        `${s.property_name} (${fmtDate(s.stay_date)} ${fmtTime(s.check_in)}) 숙박을 삭제하시겠습니까?`
      )
    )
      return
    setDeletingId(s.id)
    try {
      await client.delete(`/admin/stay-dates/${s.id}`)
      setStayDates((prev) => prev.filter((x) => x.id !== s.id))
    } catch {
      alert('삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">숙박 관리</h1>
          <button
            onClick={() => setModal(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + 숙박 추가
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 숙소</option>
            {properties.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(filterProperty || filterDate) && (
            <button
              onClick={() => {
                setFilterProperty('')
                setFilterDate('')
              }}
              className="text-sm text-gray-400 hover:text-gray-600 px-2"
            >
              초기화
            </button>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : stayDates.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">
            {filterProperty || filterDate ? '해당 조건의 숙박 일정이 없습니다.' : '오늘 이후 숙박 일정이 없습니다. 날짜 필터로 과거 일정을 조회하세요.'}
          </p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">숙소</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">숙소 / 객실 타입</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">날짜</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">시간</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stayDates.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.property_name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {s.property_name} · {s.room_type_name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{fmtDate(s.stay_date)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {fmtTime(s.check_in)} ~ {fmtTime(s.check_out)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setModal(s)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
                        disabled={deletingId === s.id}
                        className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-40"
                      >
                        {deletingId === s.id ? '삭제 중' : '삭제'}
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
        <StayDateModal
          stayDate={modal}
          properties={properties}
          roomTypes={roomTypes}
          onClose={() => setModal(undefined)}
          onSaved={handleSaved}
        />
      )}
    </AdminLayout>
  )
}
