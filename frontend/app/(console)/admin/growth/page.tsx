'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import {
  Loading, ServiceDownNotice, ServiceUnavailable, fetchService,
} from '@/components/ServiceState'

type Growth = {
  measured_by: string
  collection: { total: number; accepted: number; quarantined: number; failure_rate: number }
  identity: { sessions: number; stitched_events: number; stitch_rate: number }
  funnel: {
    steps: { event: string; users: number; step_rate: number | null }[]
    cvr: number; biggest_drop: string
  }
  segments: Record<string, string | number>[]
  experiment: {
    name: string; hypothesis: string; baseline: number; mde: number
    required_per_group: number
    exposed: Record<string, number>; converted: Record<string, number>
    underpowered: boolean; relative_lift: number; p_value: number
    srm_healthy: boolean; srm_chi_square: number; planted_lift: number
  }
}

export default function GrowthPage() {
  const [d, setD] = useState<Growth | null>(null)
  const [down, setDown] = useState<string | null>(null)

  useEffect(() => {
    fetchService<Growth>('/api/growth')
      .then(setD)
      .catch((e) => setDown(e instanceof ServiceUnavailable ? e.message : String(e.message)))
  }, [])

  if (down) return <AdminLayout><ServiceDownNotice detail={down} /></AdminLayout>
  if (!d) return <AdminLayout><Loading /></AdminLayout>

  const e = d.experiment

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">그로스 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">
          퍼널·세그먼트·실험. 숫자보다 <b>그 숫자를 믿어도 되는지</b>를 같이 본다.
        </p>
      </div>

      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        <Stat label="최종 전환율" value={`${(d.funnel.cvr * 100).toFixed(2)}%`} />
        <Stat label="이벤트" value={d.collection.total.toLocaleString()} />
        <Stat label="격리" value={`${(d.collection.failure_rate * 100).toFixed(2)}%`}
          note={`${d.collection.quarantined}건 — 버리지 않고 보관`} />
        <Stat label="스티칭" value={`${(d.identity.stitch_rate * 100).toFixed(1)}%`}
          note="로그인 전 익명 이벤트의 소급 결합" />
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">예약 퍼널</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase">
                <th className="text-left py-2">단계</th>
                <th className="text-right">사용자</th>
                <th className="text-right">직전 대비</th>
              </tr>
            </thead>
            <tbody>
              {d.funnel.steps.map((s) => {
                const worst = s.event === d.funnel.biggest_drop
                return (
                  <tr key={s.event} className="border-t border-gray-100">
                    <td className={`py-2 ${worst ? 'font-bold text-red-700' : ''}`}>
                      {s.event}
                      {worst && <span className="ml-2 text-xs">← 최대 이탈</span>}
                    </td>
                    <td className="text-right tabular-nums">{s.users.toLocaleString()}</td>
                    <td className="text-right tabular-nums">
                      {s.step_rate === null ? '—' : `${(s.step_rate * 100).toFixed(1)}%`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          디바이스별 — 평균이 가리는 것
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase">
                {Object.keys(d.segments[0] ?? {}).map((k) => (
                  <th key={k} className="text-left py-2">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.segments.map((row, i) => (
                <tr key={i} className="border-t border-gray-100">
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="py-2 tabular-nums">
                      {typeof v === 'number' ? v.toFixed(4).replace(/\.?0+$/, '') : String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          실험 — {e.name}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{e.hypothesis}</p>

        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <Stat label="상대 리프트" value={`${(e.relative_lift * 100).toFixed(1)}%`}
            note={`심어둔 값 ${(e.planted_lift * 100).toFixed(0)}%`} />
          <Stat label="p-value" value={e.p_value.toFixed(4)} />
          <Stat label="SRM" value={e.srm_healthy ? '정상' : '이상'}
            note={`χ² = ${e.srm_chi_square}`} />
        </div>

        {e.underpowered && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <p className="font-bold text-amber-800 text-sm">표본 미달 — 결론을 내지 않는다</p>
            <p className="text-sm text-amber-900/80 mt-1">
              그룹당 {e.exposed.control?.toLocaleString()} / 필요 {e.required_per_group.toLocaleString()}.
              p 값이 작아도 표본이 안 찼으면 그건 peeking 이 만드는 모양이다.
            </p>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-0.5">{value}</div>
      {note && <div className="text-xs text-gray-400 mt-1">{note}</div>}
    </div>
  )
}
