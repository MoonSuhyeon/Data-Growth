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
  /** 축 이름 → 그 축으로 쪼갠 행들. 축이 늘어도 화면은 순회만 하면 된다. */
  segments_by?: Record<string, Record<string, string | number>[]>
  /** 축마다 분모가 다를 수 있다. 다르면 표에 적어야 읽는 사람이 안 속는다. */
  segments_note?: Record<string, string>
  retention?: {
    people: number; returned: number; sessions: number; return_rate: number
    cohorts: { cohort: string; people: number; returned: number; return_rate: number }[]
    note: string
    churn_d7?: { cohort: string; people: number; churned: number; d7_churn_rate: number }[]
  }
  revenue?: {
    gross_revenue: number; orders: number; buyers: number; people: number
    purchase_rate: number
    /** 셋을 따로 받는다. 하나만 받으면 화면이 어느 정의인지 모른다. */
    aov: number; arppu: number; arpu: number
    by_device: { device_type: string; people: number; buyers: number
      gross_revenue: number; aov: number; arpu: number }[]
    cohort_d7: { cohort: string; people: number; d7_revenue: number; d7_arpu: number }[]
    notes: string[]
    refunded?: number; net_revenue?: number
    cancellations?: number; cancellation_rate?: number
  }
  features?: {
    rows: { feature: string; gate: string; reachable: number; used: number
      adoption_rate: number; uses_per_user: number }[]
    note: string
    never_emitted: string[]
    awaiting_app: string[]
  }
  experiment: {
    name: string; hypothesis: string; baseline: number; mde: number
    required_per_group: number
    exposed: Record<string, number>; converted: Record<string, number>
    underpowered: boolean; relative_lift: number; p_value: number
    srm_healthy: boolean; srm_chi_square: number; planted_lift: number
  }
}

/** 원 단위. 소수점을 그대로 보여주면 금액이 아니라 계산 결과처럼 읽힌다. */
const won = (v: number) => `${Math.round(v).toLocaleString()}원`

/**
 * 기간 프리셋.
 *
 * `null` 은 "전체" 다. 기본값을 최근 N 일로 두지 않은 이유가 있다 — 데이터가
 * 2025년 6월치라 "최근 7일" 이 비어 보이고, 그러면 대시보드가 고장 난 것처럼
 * 읽힌다. 무엇을 보고 있는지는 화면이 창을 적어서 말한다.
 */
type FunnelStep = { event: string; users: number; step_rate: number | null; drop: number }

/** 기간 질의의 응답. `analytics/overview` 가 돌려주는 모양이다. */
type WindowData = {
  window: {
    requested_from: string | null; requested_to: string | null
    data_from: string | null; data_to: string | null; events: number
  }
  funnel: FunnelStep[]
  cvr: number
  retention: Growth['retention'] & object
  revenue: Growth['revenue'] & object
  features: { feature: string; gate: string; reachable: number; used: number
    adoption_rate: number; uses_per_user: number }[]
  targets: { rows: TargetRow[]; summary: Record<string, number>
    declared_in: string; never_emitted: string[] }
}

type SegmentsData = {
  dimension: string
  note: string | null
  rows: Record<string, string | number>[]
}

type TargetRow = {
  key: string; label: string; value: number | null; goal: number; floor: number
  direction: 'UP' | 'DOWN'; unit: string; status: string; rationale: string
}

/**
 * 기간을 쿼리스트링으로. 데이터가 2025년치라 **오늘 기준이 아니라 데이터 끝
 * 기준**으로 잡아야 한다 — 오늘로 잡으면 어떤 프리셋도 빈 결과가 나온다.
 * 서버가 창을 응답에 실어 주므로 화면은 그걸 그대로 보여 준다.
 */
function rangeQuery(days: number | null): string {
  if (days === null) return ''
  const to = new Date(DATA_END)
  const from = new Date(to)
  from.setDate(from.getDate() - days)
  return `?from=${from.toISOString().slice(0, 10)}&to=${to.toISOString().slice(0, 10)}`
}

/** 가장 많이 빠지는 단계. 서버가 안 주므로 화면이 센다. */
function biggestDrop(steps: FunnelStep[]): string {
  return steps.reduce((worst, s) => (s.drop > (worst?.drop ?? -1) ? s : worst),
    steps[0])?.event ?? ''
}

/**
 * 시뮬레이션 데이터의 마지막 날. 실제 서비스라면 오늘을 쓰면 되는데, 여기서는
 * 데이터가 과거 한 달치라 그렇게 두면 프리셋이 전부 빈 결과를 낸다. 이 값이
 * 하드코딩이라는 사실을 숨기지 않는다 — 실데이터가 들어오면 지워야 할 줄이다.
 */
const DATA_END = '2025-07-01'

const STATUS_LABEL: Record<string, string> = {
  met: '달성', below: '미달', breach: '이탈', unknown: '미측정',
}

/** 미달(개선 과제)과 이탈(사고)은 다른 색이어야 한다. */
const STATUS_STYLE: Record<string, string> = {
  met: 'bg-emerald-100 text-emerald-700',
  below: 'bg-amber-100 text-amber-700',
  breach: 'bg-red-100 text-red-700',
  unknown: 'bg-mist text-ink-faint',
}

const fmtTarget = (v: number | null, unit: string) =>
  v === null ? '-' : unit === 'won' ? won(v) : `${(v * 100).toFixed(2)}%`

const RANGES: { label: string; days: number | null }[] = [
  { label: '전체', days: null },
  { label: '7일', days: 7 },
  { label: '14일', days: 14 },
  { label: '30일', days: 30 },
]

/** 축 이름을 화면 말로 바꾼다. 없는 축은 원래 이름을 그대로 쓴다. */
const AXIS_LABEL: Record<string, string> = {
  device_type: '디바이스',
  region: '지역',
  property_type: '숙소 유형',
  visit_type: '신규/재방문',
}

export default function GrowthPage() {
  /*
    화면이 두 곳에서 읽는다. 섞어 쓰는 게 아니라 **성격이 다르기 때문**이다.

      /api/growth              파이프라인 실행 자체의 사실 — 수집 품질, 스티칭,
                               실험. 기간을 좁힌다고 달라지는 값이 아니다.
      /api/v1/analytics/*      기간에 따라 달라지는 값 — 퍼널·세그먼트·리텐션·
                               매출·기능·목표.

    예전에는 둘 다 정적 JSON 한 장에서 나왔다. 그래서 기간을 바꿀 수가 없었다 —
    축 선택이 됐던 건 모든 축을 미리 계산해 넣어 뒀기 때문이고, 기간은 조합이
    무한해서 같은 수를 쓸 수 없다.
  */
  const [report, setReport] = useState<Growth | null>(null)
  const [win, setWin] = useState<WindowData | null>(null)
  const [rows, setRows] = useState<Record<string, string | number>[]>([])
  const [note, setNote] = useState<string | null>(null)
  const [down, setDown] = useState<string | null>(null)
  const [axis, setAxis] = useState('device_type')
  const [days, setDays] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetchService<Growth>('/api/growth')
      .then(setReport)
      .catch((e) => setDown(e instanceof ServiceUnavailable ? e.message : String(e.message)))
  }, [])

  useEffect(() => {
    let alive = true
    setBusy(true)
    const qs = rangeQuery(days)
    Promise.all([
      fetchService<WindowData>(`/api/v1/analytics/overview${qs}`),
      fetchService<SegmentsData>(
        `/api/v1/analytics/segments?by=${axis}${qs ? `&${qs.slice(1)}` : ''}`,
      ),
    ])
      .then(([o, sg]) => {
        if (!alive) return
        setWin(o)
        setRows(sg.rows)
        setNote(sg.note ?? null)
        setDown(null)
      })
      .catch((e) => alive && setDown(e instanceof ServiceUnavailable ? e.message : String(e.message)))
      .finally(() => alive && setBusy(false))
    return () => { alive = false }
  }, [axis, days])

  if (down) return <AdminLayout><ServiceDownNotice detail={down} /></AdminLayout>
  if (!report || !win) return <AdminLayout><Loading /></AdminLayout>

  const e = report.experiment
  // 기존 렌더가 기대하는 모양으로 맞춘다. 두 출처를 한 객체로 합쳐도 **어디서 온
  // 값인지**는 위 주석과 창 표시가 말해 준다.
  const d: Growth = {
    ...report,
    funnel: {
      steps: win.funnel,
      cvr: win.cvr,
      biggest_drop: biggestDrop(win.funnel),
    },
    retention: { ...win.retention, note: report.retention?.note ?? '' },
    revenue: { ...win.revenue, by_device: report.revenue?.by_device ?? [],
               cohort_d7: report.revenue?.cohort_d7 ?? [],
               notes: report.revenue?.notes ?? [] },
    features: {
      rows: win.features,
      note: report.features?.note ?? '',
      never_emitted: win.targets.never_emitted ?? [],
      awaiting_app: report.features?.awaiting_app ?? [],
    },
  }
  const axes = ['device_type', 'region', 'property_type', 'visit_type']

  return (
    <AdminLayout>
      <div className="mb-9">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">그로스 대시보드</h1>
            <p className="text-[14px] leading-[1.6] text-ink-soft mt-2.5">
              퍼널·세그먼트·실험. 숫자보다 <b>그 숫자를 믿어도 되는지</b>를 같이 본다.
            </p>
          </div>
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r.label}
                onClick={() => setDays(r.days)}
                disabled={busy}
                className={`text-[13px] px-3.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                  r.days === days
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-ink-faint border-line hover:border-ink/35'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/*
          **무엇을 보고 있는지 화면이 말한다.** 요청한 기간과 실제 데이터가 있는
          기간은 다를 수 있다. 그 차이를 안 적으면 빈 구간을 "0 이 나왔다" 로 읽는다.
        */}
        <p className="text-[12px] leading-[1.6] text-ink-faint mt-2">
          {win.window.data_from
            ? `${win.window.data_from.slice(0, 10)} ~ ${win.window.data_to?.slice(0, 10)} · 이벤트 ${win.window.events.toLocaleString()}건`
            : '이 기간에는 이벤트가 없다'}
          {busy && ' · 불러오는 중…'}
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

      <section className="bg-white rounded-2xl border border-line p-7 mb-7">
        <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-5">예약 퍼널</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] leading-[1.55]">
            <thead>
              <tr className="text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                <th className="text-left pb-3.5 pt-1 font-semibold">단계</th>
                <th className="text-right">사용자</th>
                <th className="text-right">직전 대비</th>
              </tr>
            </thead>
            <tbody>
              {d.funnel.steps.map((s) => {
                const worst = s.event === d.funnel.biggest_drop
                return (
                  <tr key={s.event} className="border-t border-line">
                    <td className={`py-3.5 ${worst ? 'font-bold text-red-700' : ''}`}>
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

      <section className="bg-white rounded-2xl border border-line p-7 mb-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em]">
            세그먼트 — 평균이 가리는 것
          </h2>
          {/*
            축을 고를 수 있어야 대시보드다. 축이 하나면 파이프라인이 정해 둔
            답 하나를 보여주는 리포트지, 질문을 바꿔가며 답을 찾는 화면이 아니다.
          */}
          <div className="flex gap-1">
            {axes.map((a) => (
              <button
                key={a}
                onClick={() => setAxis(a)}
                className={`text-[13px] px-3.5 py-1.5 rounded-lg border transition-colors ${
                  a === axis
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-ink-faint border-line hover:border-ink/35'
                }`}
              >
                {AXIS_LABEL[a] ?? a}
              </button>
            ))}
          </div>
        </div>

        {note && <p className="text-[12px] leading-[1.6] text-amber-700 mb-3">※ {note}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-[14px] leading-[1.55]">
            <thead>
              <tr className="text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                {Object.keys(rows[0] ?? {}).map((k) => (
                  <th key={k} className="text-left pb-3.5 pt-1 font-semibold">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-line">
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="py-3.5 tabular-nums">
                      {typeof v === 'number' ? v.toFixed(4).replace(/\.?0+$/, '') : String(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/*
        목표 대조. **숫자보다 먼저 오는 절이다** — 전환율 9.4% 가 좋은 건지 나쁜
        건지는 선을 그어야만 답할 수 있다.
      */}
      <section className="bg-white rounded-2xl border border-line p-7 mb-7">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em]">
            목표 대조 — 선을 먼저 긋고 재는 것
          </h2>
          <p className="text-[12px] leading-[1.6] text-ink-faint">
            달성 {win.targets.summary.met} · 미달 {win.targets.summary.below} ·
            {' '}이탈 {win.targets.summary.breach} · 미측정 {win.targets.summary.unknown}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[14px] leading-[1.55]">
            <thead>
              <tr className="text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                <th className="text-left pb-3.5 pt-1 font-semibold">지표</th>
                <th className="text-right">현재</th>
                <th className="text-right">목표</th>
                <th className="text-right">최소선</th>
                <th className="text-left pl-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {win.targets.rows.map((t) => (
                <tr key={t.key} className="border-t border-line">
                  <td className="py-3.5" title={t.rationale}>{t.label}</td>
                  <td className="text-right tabular-nums">{fmtTarget(t.value, t.unit)}</td>
                  <td className="text-right tabular-nums text-ink-faint">
                    {fmtTarget(t.goal, t.unit)}
                  </td>
                  <td className="text-right tabular-nums text-ink-faint">
                    {fmtTarget(t.floor, t.unit)}
                  </td>
                  <td className="pl-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLE[t.status]}`}>
                      {STATUS_LABEL[t.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*
          미달과 이탈을 **다른 색으로** 그린다. 하나로 뭉개면 개선 과제와 사고가
          같아 보이고, 그러면 진짜 사고가 묻힌다.
        */}
        <p className="text-[12px] leading-[1.6] text-ink-faint mt-3">
          목표는 <code>{win.targets.declared_in}</code> 에 선언돼 있다 — 바꾸려면
          커밋이 남는다. 지표 이름에 마우스를 올리면 왜 그 값인지 나온다.
        </p>
      </section>

      {d.features && (
        <section className="bg-white rounded-2xl border border-line p-7 mb-7">
          <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-2">
            기능 사용률 — 퍼널에 안 들어가는 것들
          </h2>
          <p className="text-[12px] leading-[1.6] text-amber-700 mb-3">※ {d.features.note}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-[14px] leading-[1.55]">
              <thead>
                <tr className="text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                  <th className="text-left pb-3.5 pt-1 font-semibold">기능</th>
                  <th className="text-left">관문</th>
                  <th className="text-right">닿을 수 있던 사람</th>
                  <th className="text-right">쓴 사람</th>
                  <th className="text-right">사용률</th>
                  <th className="text-right">1인당</th>
                </tr>
              </thead>
              <tbody>
                {d.features.rows.map((r) => (
                  <tr key={r.feature} className="border-t border-line">
                    <td className="py-3.5">{r.feature}</td>
                    <td className="text-ink-faint text-xs">{r.gate}</td>
                    <td className="text-right tabular-nums">{r.reachable.toLocaleString()}</td>
                    <td className="text-right tabular-nums">{r.used.toLocaleString()}</td>
                    <td className="text-right tabular-nums">
                      {(r.adoption_rate * 100).toFixed(1)}%
                    </td>
                    <td className="text-right tabular-nums text-ink-faint">{r.uses_per_user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*
            계약에 정의만 되고 안 나오는 이벤트를 드러낸다. "우리는 이걸 잰다"는
            주장만 남고 실제로는 아무것도 안 재는 상태를 눈에 보이게 하는 것이다.
            앱 생명주기는 앱이 없어서 안 나오는 것이라 따로 적는다.
          */}
          {d.features.never_emitted.length > 0 && (
            <p className="text-[12px] leading-[1.6] text-red-700 mt-3">
              ⚠ 계약에 있는데 한 번도 발생하지 않음: {d.features.never_emitted.join(', ')}
            </p>
          )}
          <p className="text-[12px] leading-[1.6] text-ink-faint mt-2">
            앱을 기다리는 중: {d.features.awaiting_app.join(', ')}
          </p>
        </section>
      )}

      {d.revenue && (
        <section className="bg-white rounded-2xl border border-line p-7 mb-7">
          <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-2">
            매출 — 샀는가가 아니라 얼마어치 샀는가
          </h2>
          <p className="text-sm text-ink-soft mb-4">
            총매출 <b>{won(d.revenue.gross_revenue)}</b> · 주문{' '}
            {d.revenue.orders.toLocaleString()}건 · 구매자{' '}
            {d.revenue.buyers.toLocaleString()}/{d.revenue.people.toLocaleString()}명 (
            {(d.revenue.purchase_rate * 100).toFixed(1)}%)
          </p>
          {d.revenue.net_revenue !== undefined && (
            <p className="text-sm text-ink-soft mb-4">
              순매출 <b>{won(d.revenue.net_revenue)}</b> · 환불{' '}
              {won(d.revenue.refunded ?? 0)} · 취소{' '}
              {(d.revenue.cancellations ?? 0).toLocaleString()}건 (주문 대비{' '}
              {((d.revenue.cancellation_rate ?? 0) * 100).toFixed(1)}%)
            </p>
          )}

          {/*
            셋을 나란히 둔다. 하나만 보여주면 읽는 사람이 자기가 아는 정의로 읽고,
            그게 다른 정의면 조용히 틀린 결론이 된다.
          */}
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <Stat label="AOV" value={won(d.revenue.aov)} note="주문당" />
            <Stat label="ARPPU" value={won(d.revenue.arppu)} note="구매자당" />
            <Stat label="ARPU" value={won(d.revenue.arpu)} note="방문자당 (LTV 아님)" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[14px] leading-[1.55]">
              <thead>
                <tr className="text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                  <th className="text-left pb-3.5 pt-1 font-semibold">디바이스</th>
                  <th className="text-right">사람</th>
                  <th className="text-right">구매자</th>
                  <th className="text-right">AOV</th>
                  <th className="text-right">ARPU</th>
                </tr>
              </thead>
              <tbody>
                {d.revenue.by_device.map((r) => (
                  <tr key={r.device_type} className="border-t border-line">
                    <td className="py-3.5">{r.device_type}</td>
                    <td className="text-right tabular-nums">{r.people.toLocaleString()}</td>
                    <td className="text-right tabular-nums">{r.buyers.toLocaleString()}</td>
                    <td className="text-right tabular-nums">{won(r.aov)}</td>
                    <td className="text-right tabular-nums">{won(r.arpu)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-3 space-y-1">
            {d.revenue.notes.map((n) => (
              <li key={n} className="text-[12px] leading-[1.6] text-amber-700">※ {n}</li>
            ))}
          </ul>
        </section>
      )}

      {d.retention && (
        <section className="bg-white rounded-2xl border border-line p-7 mb-7">
          <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-2">
            리텐션 — 온 사람이 다시 오는가
          </h2>
          <p className="text-sm text-ink-soft mb-4">
            사람 {d.retention.people.toLocaleString()}명 · 세션{' '}
            {d.retention.sessions.toLocaleString()}개 (1인당{' '}
            {(d.retention.sessions / d.retention.people).toFixed(2)}) · 재방문율{' '}
            <b>{(d.retention.return_rate * 100).toFixed(1)}%</b>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-[14px] leading-[1.55]">
              <thead>
                <tr className="text-[11px] text-ink-faint uppercase tracking-[0.1em]">
                  <th className="text-left pb-3.5 pt-1 font-semibold">첫 방문 주</th>
                  <th className="text-right">사람</th>
                  <th className="text-right">다시 온 사람</th>
                  <th className="text-right">재방문율</th>
                </tr>
              </thead>
              <tbody>
                {d.retention.cohorts.map((c, i) => {
                  // 마지막 코호트는 관측 창 끝에 걸려 있다. 같은 색으로 그리면
                  // 리텐션이 무너진 것처럼 읽힌다.
                  const censored = i === d.retention!.cohorts.length - 1
                  return (
                    <tr key={c.cohort}
                      className={`border-t border-line ${censored ? 'text-ink-faint' : ''}`}>
                      <td className="py-3.5">
                        {c.cohort}
                        {censored && <span className="ml-2 text-xs">관측 중</span>}
                      </td>
                      <td className="text-right tabular-nums">{c.people.toLocaleString()}</td>
                      <td className="text-right tabular-nums">{c.returned.toLocaleString()}</td>
                      <td className="text-right tabular-nums">
                        {(c.return_rate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] leading-[1.6] text-amber-700 mt-3">※ {d.retention.note}</p>
        </section>
      )}

      <section className="bg-white rounded-2xl border border-line p-6">
        <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-2">
          실험 — {e.name}
        </h2>
        <p className="text-sm text-ink-soft mb-4">{e.hypothesis}</p>

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
    <div className="bg-white border border-line rounded-xl px-4 py-3">
      <div className="text-[12px] leading-[1.6] text-ink-faint uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-0.5">{value}</div>
      {note && <div className="text-[12px] leading-[1.6] text-ink-faint mt-1">{note}</div>}
    </div>
  )
}
