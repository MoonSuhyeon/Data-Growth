import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import client from '../../api/client'

interface AdminUser {
  id: string
  email: string
  name: string
  phone: string | null
  role: string
  created_at: string
  booking_count: number
}

const ROLE_LABEL: Record<string, string> = {
  USER: '일반',
  ADMIN: '관리자',
}
const ROLE_COLOR: Record<string, string> = {
  USER: 'text-gray-600 bg-gray-100',
  ADMIN: 'text-blue-700 bg-blue-100',
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [inputSearch, setInputSearch] = useState('')
  const [query, setQuery] = useState('')
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (query) params.search = query
    client
      .get<AdminUser[]>('/admin/users', { params })
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false))
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(inputSearch.trim())
  }

  const handleRoleToggle = async (u: AdminUser) => {
    const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!confirm(`${u.name}님의 권한을 ${ROLE_LABEL[newRole]}(으)로 변경하시겠습니까?`)) return
    setTogglingId(u.id)
    try {
      await client.patch(`/admin/users/${u.id}/role`, { role: newRole })
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)))
    } catch {
      alert('권한 변경에 실패했습니다.')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">사용자 관리</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              placeholder="이름 또는 이메일"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
            <button
              type="submit"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              검색
            </button>
            {query && (
              <button
                type="button"
                onClick={() => {
                  setInputSearch('')
                  setQuery('')
                }}
                className="text-sm text-gray-400 hover:text-gray-600 px-2"
              >
                초기화
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">사용자가 없습니다.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">이름</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">이메일</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">전화번호</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">권한</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 hidden md:table-cell">예매</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">가입일</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{u.phone ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${ROLE_COLOR[u.role] ?? ''}`}
                      >
                        {ROLE_LABEL[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 hidden md:table-cell">
                      {u.booking_count}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                      {new Date(u.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        disabled={togglingId === u.id}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-40"
                      >
                        {u.role === 'ADMIN' ? '권한 해제' : '관리자 설정'}
                      </button>
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
