import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getNotificationSettings, updateNotificationSettings } from '../api/movies'
import type { NotificationSetting } from '../types'

interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

export default function MyNotificationSettings() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<NotificationSetting | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    getNotificationSettings()
      .then(r => setSettings(r.data))
      .finally(() => setLoading(false))
  }, [user, navigate])

  const update = (key: keyof NotificationSetting, value: boolean) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      await updateNotificationSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">알림 설정</h1>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-2">채널 설정</h2>
        <Toggle label="이메일 알림" checked={settings.email_enabled} onChange={v => update('email_enabled', v)} />
        <Toggle label="SMS 알림" checked={settings.sms_enabled} onChange={v => update('sms_enabled', v)} />
        <Toggle label="푸시 알림" checked={settings.push_enabled} onChange={v => update('push_enabled', v)} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">알림 종류</h2>
        <Toggle
          label="예매 알림"
          description="예매 확인 및 변경 사항 알림"
          checked={settings.booking_notification}
          onChange={v => update('booking_notification', v)}
        />
        <Toggle
          label="환불 알림"
          description="환불 처리 완료 알림"
          checked={settings.refund_notification}
          onChange={v => update('refund_notification', v)}
        />
        <Toggle
          label="마케팅 알림"
          description="이벤트 및 프로모션 정보"
          checked={settings.marketing_notification}
          onChange={v => update('marketing_notification', v)}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saved ? '저장 완료!' : saving ? '저장 중...' : '설정 저장'}
      </button>
    </div>
  )
}
