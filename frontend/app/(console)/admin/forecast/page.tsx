'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import {
  Empty, Loading, ServiceDownNotice, ServiceUnavailable, fetchService,
} from '@/components/ServiceState'

/**
 * 응답 모양을 손으로 다시 적지 않는다. **서비스가 커밋한 스키마에서 온 타입을 쓴다.**
 *
 * 예전에는 여기 인라인 타입이 있었고, 그래서 `npm run gen:types` 가 만든 타입은
 * 아무 데서도 안 쓰였다. ML-Product 가 `SegmentRow.region` 을 `key` 로 바꿨을 때
 * 빌드는 멀쩡히 통과했고 화면은 `undefined` 를 렌더할 참이었다 — 드리프트를
 * 막겠다던 장치가 연결이 안 돼 있던 것이다.
 */
import type { components } from '@/types/services/forecast'

type Schemas = components['schemas']
type Segment = Schemas['SegmentRow']
type SegmentsRes = Schemas['SegmentResponse']
type LowRow = Schemas['LowDemandRow']
type LowRes = Schemas['LowDemandResponse']
type MetricsRes = Schemas['MetricsResponse']

/** 서비스가 허용하는 축. 늘어나면 여기와 `SEGMENT_DIMENSIONS` 를 같이 고친다. */
const SEGMENT_AXES = ['region', 'property_type'] as const
type SegmentAxis = (typeof SEGMENT_AXES)[number]

const AXIS_LABEL: Record<SegmentAxis, string> = {
  region: '지역',
  property_type: '숙소 유형',
}

export default function ForecastPage() {
  const [segments, setSegments] = useState<SegmentsRes | null>(null)
  const [low, setLow] = useState<LowRes | null>(null)
  const [metrics, setMetrics] = useState<MetricsRes | null>(null)
  const [down, setDown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [threshold, setThreshold] = useState(1.0)
  const [axis, setAxis] = useState<SegmentAxis>('region')

  const load = (t: number, by: SegmentAxis = axis) => {
    setLoading(true)
    Promise.all([
      fetchService<SegmentsRes>(`/api/forecast/forecast/segments?by=${by}`),
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
      <div className="mb-9">
        <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">수요 예측</h1>
        <p className="text-[14px] leading-[1.6] text-ink-soft mt-2.5">
          예측 시점 기준으로 재구성한 피처로 낸 예측. 수요가 낮게 나온 숙소는 콘텐츠 생성 대상이 된다.
        </p>
      </div>

      {down && <ServiceDownNotice detail={down} />}
      {!down && loading && <Loading />}

      {!down && !loading && (
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-line p-6">
            <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-5">
              모델 비교
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] leading-[1.55]">
                <thead>
                  <tr className="text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                    <th className="text-left pb-3.5 pt-1 font-semibold">모델</th>
                    <th className="text-right">WAPE</th>
                    <th className="text-right">기준선 대비</th>
                    <th className="text-right">폴드</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics?.rows.map((r) => (
                    <tr key={r.model} className="border-t border-line">
                      <td className="py-3.5 font-medium">
                        {r.model}
                        {r.model === metrics.serving && (
                          <span className="ml-2 text-xs text-gold-600 font-bold">서빙</span>
                        )}
                      </td>
                      <td className="text-right tabular-nums">{r.wape_mean.toFixed(4)}</td>
                      <td className="text-right tabular-nums">
                        {r.vs_baseline_pct === null ? '—' : `+${r.vs_baseline_pct}%`}
                      </td>
                      <td className="text-right tabular-nums text-ink-faint">{r.folds}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] leading-[1.6] text-ink-faint mt-3">{metrics?.measured_by}</p>
          </section>

          <section className="bg-white rounded-2xl border border-line p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
              <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em]">
                세그먼트별 오차
              </h2>
              {/*
                축이 하나면 "평균 뒤를 본다"는 주장이 반쪽이다. 특정 숙소 유형에서만
                무너지는 모델을 지역 평균이 덮어 가린다.
              */}
              <div className="flex gap-1">
                {SEGMENT_AXES.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAxis(a); load(threshold, a) }}
                    className={`text-[13px] px-3.5 py-1.5 rounded-lg border transition-colors ${
                      a === axis
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white text-ink-faint border-line hover:border-ink/35'
                    }`}
                  >
                    {AXIS_LABEL[a]}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[12px] leading-[1.6] text-ink-faint mb-3">{segments?.note}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] leading-[1.55]">
                <thead>
                  <tr className="text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                    <th className="text-left pb-3.5 pt-1 font-semibold">{AXIS_LABEL[axis]}</th>
                    <th className="text-right">WAPE</th>
                    <th className="text-right">수요 0인 날</th>
                    <th className="text-right">표본</th>
                  </tr>
                </thead>
                <tbody>
                  {segments?.rows.map((r) => (
                    <tr key={r.key} className="border-t border-line">
                      <td className="py-3.5">{r.key}</td>
                      <td className="text-right tabular-nums">{r.wape.toFixed(4)}</td>
                      <td className="text-right tabular-nums">{(r.zero_ratio * 100).toFixed(1)}%</td>
                      <td className="text-right tabular-nums text-ink-faint">{r.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] leading-[1.6] text-ink-faint mt-3">
              오차가 큰 지역일수록 수요 0인 날이 많다. 평균 하나만 보면 가려지는 부분이다.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-line p-6">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em]">
                수요가 낮은 숙소·날짜
              </h2>
              <div className="ml-auto flex items-center gap-2">
                <label className="text-xs text-ink-faint">임계</label>
                <input
                  type="number" step="0.1" min="0" value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-20 border border-line rounded-lg px-2 py-1 text-sm"
                />
                <button
                  onClick={() => load(threshold)}
                  className="px-3 py-1.5 rounded-lg bg-charcoal text-white text-sm font-semibold"
                >
                  다시 조회
                </button>
              </div>
            </div>
            {low && low.count === 0 ? (
              <Empty label="임계 미만인 항목이 없습니다" />
            ) : (
              <>
                <p className="text-[12px] leading-[1.6] text-ink-faint mb-2">
                  {low?.count}건 — 이 목록이 콘텐츠 생성으로 넘어간다
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {low?.rows.map((r) => (
                    <a
                      key={`${r.property_id}-${r.stay_date}`}
                      href={`/admin/content?property=${r.property_id}`}
                      className="border border-line rounded-lg px-3 py-2 text-sm hover:border-gold-400"
                    >
                      <div className="font-medium">{r.property_id}</div>
                      <div className="text-[12px] leading-[1.6] text-ink-faint">
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
