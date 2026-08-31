'use client'

/**
 * 영업 기회 보드.
 *
 * ## 한 API 가 죽어도 화면이 하얗게 되지 않는다
 *
 * 이 화면은 두 곳을 읽는다 — 기회 목록과 후보 목록. 예전 화면들처럼
 * `if (down) return <ServiceDownNotice/>` 로 **전체를 대체하면**, 후보 조회만
 * 실패해도 이미 잘 읽어 온 기회 목록까지 사라진다.
 *
 * 그래서 상태를 **판마다** 따로 들고, 죽은 판에만 안내를 그린다.
 * `ServiceDownNotice` 가 "하나가 꺼져 있어도 나머지는 그대로 동작합니다" 라고
 * 적어 둔 약속을 화면이 실제로 지키게 하는 것이다.
 *
 * 기회 생성은 예측 서비스까지 살아 있어야 하므로 실패가 잦은 자리다.
 * 실패해도 목록은 그대로 두고 **그 줄 옆에만** 이유를 붙인다.
 */

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import {
  Empty, Loading, ServiceDownNotice, ServiceUnavailable, fetchService,
} from '@/components/ServiceState'
import type { OpportunityRow, ProspectRow } from '@/types/services/sales'
import { STATUS_LABEL } from '@/types/services/sales'

/** 로딩·실패·데이터를 한 덩어리로 들고 다닌다. 셋을 따로 두면 조합이 어긋난다. */
type Panel<T> = { data: T | null; error: string | null; busy: boolean }

const idle = <T,>(): Panel<T> => ({ data: null, error: null, busy: true })

function message(e: unknown): string {
  if (e instanceof ServiceUnavailable) return e.message
  return e instanceof Error ? e.message : String(e)
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-ink-faint text-[13px]">—</span>
  return (
    <span className="inline-flex items-baseline gap-0.5 tabular-nums">
      <b className="text-[19px] leading-none text-ink">{score}</b>
      <span className="text-[11px] text-ink-faint">점</span>
    </span>
  )
}

export default function SalesPage() {
  const [opps, setOpps] = useState<Panel<OpportunityRow[]>>(idle)
  const [prospects, setProspects] = useState<Panel<ProspectRow[]>>(idle)
  /** 후보별 생성 실패 사유. 목록을 지우지 않고 그 줄에만 붙인다. */
  const [failed, setFailed] = useState<Record<string, string>>({})
  const [creating, setCreating] = useState<string | null>(null)

  const loadOpps = useCallback(() => {
    setOpps((p) => ({ ...p, busy: true }))
    return fetchService<OpportunityRow[]>('/api/sales/opportunities')
      .then((data) => setOpps({ data, error: null, busy: false }))
      .catch((e) => setOpps({ data: null, error: message(e), busy: false }))
  }, [])

  const loadProspects = useCallback(() => {
    setProspects((p) => ({ ...p, busy: true }))
    return fetchService<ProspectRow[]>('/api/sales/prospects')
      .then((data) => setProspects({ data, error: null, busy: false }))
      .catch((e) => setProspects({ data: null, error: message(e), busy: false }))
  }, [])

  useEffect(() => { loadOpps(); loadProspects() }, [loadOpps, loadProspects])

  async function create(p: ProspectRow) {
    setCreating(p.id)
    setFailed((f) => ({ ...f, [p.id]: '' }))
    try {
      await fetchService('/api/sales/opportunities', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prospect_id: p.id }),
      })
      await Promise.all([loadOpps(), loadProspects()])
    } catch (e) {
      // 서버가 준 문장을 그대로 쓴다. 화면이 다시 쓰면 규칙이 바뀔 때
      // 두 곳을 고쳐야 하고, 한쪽만 고치면 화면이 거짓말을 한다.
      setFailed((f) => ({ ...f, [p.id]: message(e) }))
    } finally {
      setCreating(null)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">영업 기회</h1>
        <p className="text-[14px] leading-[1.6] text-ink-soft mt-2.5">
          수요가 오르는데 우리 공급이 얇은 시장을 찾아, 그 시장에 맞는 미입점 숙소를 영업 대상으로 세운다.
        </p>
        <p className="text-[12px] leading-[1.6] text-ink-faint mt-2">
          미입점 숙소 목록은 <b>데모용 합성 데이터</b>다. 점수는 기회를 만든 시점의 예측으로 한 번만 계산해 굳힌다.
        </p>
      </div>

      {/* ── 기회 목록 ─────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-[15px] font-bold text-ink mb-3">
          기회 {opps.data ? `· ${opps.data.length}건` : ''}
        </h2>

        {opps.error ? (
          <ServiceDownNotice detail={opps.error} />
        ) : opps.busy && !opps.data ? (
          <Loading label="기회를 불러오는 중" />
        ) : !opps.data?.length ? (
          <Empty label="아직 만든 기회가 없습니다. 아래 후보에서 만들어 보세요." />
        ) : (
          <div className="rounded-xl border border-line overflow-hidden bg-white">
            <table className="w-full text-[13px]">
              <thead className="bg-mist">
                <tr className="text-left text-ink-faint">
                  <th className="px-4 py-2.5 font-medium w-20">점수</th>
                  <th className="px-4 py-2.5 font-medium">대상</th>
                  <th className="px-4 py-2.5 font-medium w-28">상태</th>
                  <th className="px-4 py-2.5 font-medium">근거</th>
                </tr>
              </thead>
              <tbody>
                {opps.data.map((o) => (
                  <tr key={o.id} className="border-t border-line align-top hover:bg-mist/60">
                    <td className="px-4 py-3"><ScoreBadge score={o.score} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/sales/${o.id}`} className="font-medium text-ink hover:underline">
                        {o.target_name ?? '—'}
                      </Link>
                      <div className="text-ink-faint text-[12px] mt-0.5">
                        {o.region} · {o.property_type}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-md bg-mist px-2 py-0.5 text-[12px] text-ink-soft">
                        {STATUS_LABEL[o.status]}
                      </span>
                      {o.confidence === 'low' && (
                        <div className="text-[11px] text-amber-700 mt-1">오차 큼</div>
                      )}
                      {o.confidence === 'unknown' && (
                        <div className="text-[11px] text-ink-faint mt-1">오차 미상</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-soft leading-[1.6]">{o.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── 후보 목록 ─────────────────────────────────────── */}
      <section>
        <h2 className="text-[15px] font-bold text-ink mb-1">미입점 숙소</h2>
        <p className="text-[12px] text-ink-faint mb-3 leading-[1.6]">
          여기에는 점수가 없다. 목록에서 매기면 화면을 열 때마다 예측이 달라져,
          기회로 굳힌 점수와 다른 숫자를 말하게 된다.
        </p>

        {prospects.error ? (
          <ServiceDownNotice detail={prospects.error} />
        ) : prospects.busy && !prospects.data ? (
          <Loading label="후보를 불러오는 중" />
        ) : !prospects.data?.length ? (
          <Empty label="미입점 숙소가 없습니다." />
        ) : (
          <div className="rounded-xl border border-line overflow-hidden bg-white">
            <table className="w-full text-[13px]">
              <thead className="bg-mist">
                <tr className="text-left text-ink-faint">
                  <th className="px-4 py-2.5 font-medium">숙소</th>
                  <th className="px-4 py-2.5 font-medium w-32">유형 · 규모</th>
                  <th className="px-4 py-2.5 font-medium w-20">평점</th>
                  <th className="px-4 py-2.5 font-medium w-56"> </th>
                </tr>
              </thead>
              <tbody>
                {prospects.data.map((p) => (
                  <tr key={p.id} className="border-t border-line align-top hover:bg-mist/60">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{p.name}</div>
                      <div className="text-ink-faint text-[12px] mt-0.5">
                        {p.region}{p.area ? ` · ${p.area}` : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {p.property_type}{p.capacity ? ` · ${p.capacity}인` : ''}
                    </td>
                    <td className="px-4 py-3 text-ink-soft tabular-nums">
                      {p.rating?.toFixed(1) ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.has_open_opportunity ? (
                        <span className="text-[12px] text-ink-faint">기회가 이미 열려 있음</span>
                      ) : !p.contactable ? (
                        // 누르고 409 를 보는 것보다 미리 막고 이유를 적는 편이 낫다.
                        <span className="text-[12px] text-ink-faint">연락 수단이 없어 영업 대상이 아님</span>
                      ) : (
                        <button
                          onClick={() => create(p)}
                          disabled={creating === p.id}
                          className="text-[13px] px-3 py-1.5 rounded-lg border border-line bg-white
                                     text-ink hover:border-ink/35 disabled:opacity-50 transition-colors"
                        >
                          {creating === p.id ? '만드는 중…' : '기회 만들기'}
                        </button>
                      )}
                      {failed[p.id] && (
                        <div className="text-[12px] text-amber-800 mt-2 leading-[1.5]">
                          {failed[p.id]}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
