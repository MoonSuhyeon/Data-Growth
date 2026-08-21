'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '@/api/properties'
import { useAuthStore } from '@/store/authStore'
import type { Notification } from '@/types'

const TYPE_ICON: Record<string, string> = {
  BOOKING_CONFIRMED: '🎬',
  REFUND_COMPLETED: '💰',
  SCREENING_REMINDER: '⏰',
  MARKETING: '📢',
}

export default function MyNotifications() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    getMyNotifications()
      .then((res) => setNotifications(res.data))
      .finally(() => setLoading(false))
  }, [user])

  const handleRead = async (n: Notification) => {
    if (n.is_read) return
    await markNotificationRead(n.id).catch(() => {})
    setNotifications((prev) =>
      prev.map((x) => x.id === n.id ? { ...x, is_read: true } : x)
    )
  }

  const handleReadAll = async () => {
    await markAllNotificationsRead().catch(() => {})
    setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-ink">알림</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            className="text-sm text-gold-700 hover:text-gold-800"
          >
            모두 읽음
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-16 bg-mist rounded-xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-ink-faint">
          <p>알림이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleRead(n)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                n.is_read
                  ? 'border-line bg-white'
                  : 'border-gold-200 bg-gold-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{TYPE_ICON[n.type] ?? '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-medium ${n.is_read ? 'text-ink-soft' : 'text-ink'}`}>
                      {n.title}
                    </p>
                    {!n.is_read && (
                      <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  {n.body && <p className="text-xs text-ink-faint mt-0.5 line-clamp-2">{n.body}</p>}
                  <p className="text-xs text-ink-faint mt-1">
                    {new Date(n.created_at).toLocaleDateString('ko-KR', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
