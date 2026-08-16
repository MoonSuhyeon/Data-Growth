'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import {
  Empty, Loading, ServiceDownNotice, ServiceUnavailable, fetchService,
} from '@/components/ServiceState'

type Segment = { region: string; wape: number; mae: number; zero_ratio: number; n: number }
type SegmentsRes = { model: string; note: string; rows: Segment[] }
type LowRow = { property_id: string; region: string; stay_date: string; predicted: number }
type LowRes = { threshold: number; count: number; rows: LowRow[] }
type MetricRow = { model: string; wape_mean: number; vs_baseline_pct: number | null; folds: number }
type MetricsRes = { baseline: string; serving: string; measured_by: string; rows: MetricRow[] }

export default function ForecastPage() {
  const [segments, setSegments] = useState<SegmentsRes | null>(null)
  const [low, setLow] = useState<LowRes | null>(null)
  const [metrics, setMetrics] = useState<MetricsRes | null>(null)
  const [down, setDown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [threshold, setThreshold] = useState(1.0)

  const load = (t: number) => {
    setLoading(true)
    Promise.all([
      fetchService<SegmentsRes>('/api/forecast/forecast/segments'),
      fetchService<LowRes>(`/api/forecast/forecast/low-demand?threshold=${t}&limit=40`),
      fetchService<MetricsRes>('/api/forecast/metrics'),
    ])
      .then(([s, l, m]) => { setSegments(s); setLow(l); setMetrics(m); setDown(null) })
      .catch((e) => setDown(e instanceof ServiceUnavailable ? e.message : String(e.message)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(threshold) }, [])

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">수요 예측</h1>
        <p className="text-sm text-gray-500 mt-1">
          예측 시점 기준으로 재구성한 피처로 낸 예측. 수요가 낮게 나온 숙소는 콘텐츠 생성 대상이 된다.
        </p>
      </div>

      {down && <ServiceDownNotice detail={down} />}
      {!down && loading && <Loading />}

      {!down && !loading && (
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              모델 비교
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase">
                    <th className="text-left py-2">모델</th>
                    <th className="text-right">WAPE</th>
                    <th className="text-right">기준선 대비</th>
                    <th className="text-right">폴드</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics?.rows.map((r) => (
                    <tr key={r.model} className="border-t border-gray-100">
                      <td className="py-2 font-medium">
                        {r.model}
                        {r.model === metrics.serving && (
                          <span className="ml-2 text-xs text-blue-600 font-bold">서빙</span>
                        )}
                      </td>
                      <td className="text-right tabular-nums">{r.wape_mean.toFixed(4)}</td>
                      <td className="text-right tabular-nums">
                        {r.vs_baseline_pct === null ? '—' : `+${r.vs_baseline_pct}%`}
                      </td>
                      <td className="text-right tabular-nums text-gray-400">{r.folds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">{metrics?.measured_by}</p>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              지역별 오차
            </h2>
            <p className="text-xs text-gray-400 mb-3">{segments?.note}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase">
                    <th className="text-left py-2">지역</th>
                    <th className="text-right">WAPE</th>
                    <th className="text-right">수요 0인 날</th>
                    <th className="text-right">표본</th>
                  </tr>
                </thead>
                <tbody>
                  {segments?.rows.map((r) => (
                    <tr key={r.region} className="border-t border-gray-100">
                      <td className="py-2">{r.region}</td>
                      <td className="text-right tabular-nums">{r.wape.toFixed(4)}</td>
                      <td className="text-right tabular-nums">{(r.zero_ratio * 100).toFixed(1)}%</td>
                      <td className="text-right tabular-nums text-gray-400">{r.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              오차가 큰 지역일수록 수요 0인 날이 많다. 평균 하나만 보면 가려지는 부분이다.
            </p>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                수요가 낮은 숙소·날짜
              </h2>
              <div className="ml-auto flex items-center gap-2">
                <label className="text-xs text-gray-500">임계</label>
                <input
                  type="number" step="0.1" min="0" value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                />
                <button
                  onClick={() => load(threshold)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                >
                  다시 조회
                </button>
              </div>
            </div>
            {low && low.count === 0 ? (
              <Empty label="임계 미만인 항목이 없습니다" />
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-2">
                  {low?.count}건 — 이 목록이 콘텐츠 생성으로 넘어간다
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {low?.rows.map((r) => (
                    <a
                      key={`${r.property_id}-${r.stay_date}`}
                      href={`/admin/content?property=${r.property_id}`}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm hover:border-blue-400"
                    >
                      <div className="font-medium">{r.property_id}</div>
                      <div className="text-xs text-gray-400">
                        {r.region} · {r.stay_date} · 예측 {r.predicted.toFixed(2)}
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </AdminLayout>
  )
}
