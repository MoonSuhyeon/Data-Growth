'use client'

/**
 * 기회 상세 — **"왜 이 점수인가" 를 펼치는 화면.**
 *
 * 점수는 `시장 갭 × 숙소 적합도` 다. 그래서 두 막대를 나란히 놓고 사이에 `×` 를
 * 둔다. 합으로 그리면 설계가 화면에서 거짓말이 된다 — 시장이 없어도 숙소가
 * 좋으면 점수가 남는 것처럼 보이기 때문이다.
 *
 * `confidence` 는 점수 옆에 따로 둔다. 점수를 흐리게 만들거나 깎아 보이게 하지
 * 않는다. "기회가 작다" 와 "못 믿겠다" 는 영업이 취할 행동이 다르다.
 */

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import {
  Loading, ServiceDownNotice, ServiceUnavailable, fetchService,
} from '@/components/ServiceState'
import type { OpportunityDetail } from '@/types/services/sales'
import { CONFIDENCE_LABEL, STATUS_LABEL } from '@/types/services/sales'

const AXIS_LABEL: Record<string, string> = {
  capacity: '규모', rating: '평점', area: '위치',
}

function Bar({ value, label, hint }: { value: number; label: string; hint?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[13px] text-ink-soft">{label}</span>
        <span className="text-[13px] tabular-nums text-ink">{(value * 100).toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-mist overflow-hidden">
        <div className="h-full rounded-full bg-charcoal" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
      </div>
      {hint && <p className="text-[12px] text-ink-faint mt-1.5 leading-[1.5]">{hint}</p>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] text-ink-faint mb-0.5">{label}</div>
      <div className="text-[14px] text-ink">{children}</div>
    </div>
  )
}

export default function OpportunityDetailPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = use(params)
  const [data, setData] = useState<OpportunityDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchService<OpportunityDetail>(`/api/sales/opportunities/${id}`)
      .then(setData)
      .catch((e) => setError(
        e instanceof ServiceUnavailable ? e.message
          : e instanceof Error ? e.message : String(e)))
  }, [id])

  if (error) {
    return (
      <AdminLayout>
        <BackLink />
        <ServiceDownNotice detail={error} />
      </AdminLayout>
    )
  }
  if (!data) return <AdminLayout><BackLink /><Loading /></AdminLayout>

  const bd = data.score_breakdown
  const conf = data.confidence ?? 'unknown'

  return (
    <AdminLayout>
      <BackLink />

      <div className="mb-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">
              {data.target_name ?? '이름 없음'}
            </h1>
            <p className="text-[13px] text-ink-soft mt-1.5">
              {data.region} · {data.property_type} · {data.product}
            </p>
          </div>
          <div className="text-right">
            <div className="tabular-nums">
              <span className="text-[38px] font-bold text-ink leading-none">{data.score ?? '—'}</span>
              <span className="text-[13px] text-ink-faint ml-1">점</span>
            </div>
            {/* 신뢰도는 점수를 깎지 않는다. 옆에 따로 선다. */}
            <div className={`text-[12px] mt-1.5 ${conf === 'low' ? 'text-amber-700' : 'text-ink-faint'}`}>
              {CONFIDENCE_LABEL[conf]}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-block rounded-md bg-mist px-2.5 py-1 text-[12px] text-ink-soft">
            {STATUS_LABEL[data.status]}
          </span>
          {data.next_action && (
            <span className="text-[12px] text-ink-faint">다음 · {data.next_action}</span>
          )}
        </div>
      </div>

      {data.rationale && (
        <p className="rounded-xl border border-line bg-white p-5 text-[14px] leading-[1.75] text-ink mb-6">
          {data.rationale}
        </p>
      )}

      {!bd ? (
        <p className="text-[13px] text-ink-faint mb-6">이 기회에는 산출 내역이 남아 있지 않습니다.</p>
      ) : (
        <section className="mb-8">
          <h2 className="text-[15px] font-bold text-ink mb-1">왜 이 점수인가</h2>
          <p className="text-[12px] text-ink-faint mb-4 leading-[1.6]">
            둘을 <b>곱한다.</b> 시장이 없으면 숙소가 좋아도 팔 이유가 없고,
            시장이 있어도 맞지 않는 숙소는 데려와도 안 팔린다.
          </p>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 items-center">
            <div className="rounded-xl border border-line bg-white p-5">
              <Bar
                value={bd.gap_score}
                label="시장 갭"
                hint={`숙소당 예측 수요 ${bd.market.demand.toFixed(2)} · 우리 공급 ${bd.market.supply}곳`}
              />
              <p className="text-[12px] text-ink-faint mt-3 leading-[1.5]">
                예측 오차{' '}
                {/* null 을 0 으로 그리면 "아주 정확하다" 로 읽힌다. */}
                {bd.market.wape === null
                  ? <b className="text-ink-soft">잴 표본 없음</b>
                  : <b className="text-ink-soft tabular-nums">{(bd.market.wape * 100).toFixed(1)}%</b>}
              </p>
            </div>

            <div className="text-center text-[22px] text-ink-faint md:py-0 py-1">×</div>

            <div className="rounded-xl border border-line bg-white p-5">
              <Bar value={bd.fit_score} label="숙소 적합도" />
              <div className="mt-4 space-y-3">
                {(['capacity', 'rating', 'area'] as const).map((k) => (
                  <Bar key={k} value={bd.fit_axes[k]} label={AXIS_LABEL[k]} />
                ))}
              </div>
            </div>
          </div>

          {bd.fit_reasons.length > 0 && (
            <ul className="mt-5 space-y-1.5">
              {bd.fit_reasons.map((r) => (
                <li key={r} className="text-[13px] text-ink-soft leading-[1.6]">· {r}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {data.prospect && (
        <section className="mb-8">
          <h2 className="text-[15px] font-bold text-ink mb-3">후보 정보</h2>
          <div className="rounded-xl border border-line bg-white p-5 grid sm:grid-cols-3 gap-5">
            <Field label="동네">{data.prospect.area ?? '—'}</Field>
            <Field label="규모">{data.prospect.capacity ? `${data.prospect.capacity}인` : '—'}</Field>
            <Field label="평점">{data.prospect.rating?.toFixed(1) ?? '—'}</Field>
            <Field label="이메일">{data.prospect.contact_email ?? '—'}</Field>
            <Field label="전화">{data.prospect.contact_phone ?? '—'}</Field>
            <Field label="출처">
              {data.prospect.source}
              {data.prospect.source === 'seed' && (
                <span className="text-[12px] text-ink-faint ml-1.5">(데모용 합성 데이터)</span>
              )}
            </Field>
          </div>
        </section>
      )}

      {/*
        다음 단계는 아직 백엔드가 없다. 버튼 자리를 미리 잡아 두되 **비활성으로
        두고 왜 안 되는지 적는다.** 없는 척 숨기면 나중에 화면 구조를 갈아엎게 되고,
        눌리는 척하면 데모에서 아무 일도 안 일어나는 버튼이 된다.
      */}
      <section>
        <h2 className="text-[15px] font-bold text-ink mb-3">다음 단계</h2>
        <div className="rounded-xl border border-dashed border-line p-5 flex flex-wrap gap-2.5">
          {[
            ['제안 생성', '영업용 콘텐츠 형식이 아직 없습니다'],
            ['승인', '승인 관문이 아직 이 경로에 붙지 않았습니다'],
            ['발송', '알림 생성 API 가 아직 없습니다'],
          ].map(([label, why]) => (
            <button
              key={label}
              disabled
              title={why}
              className="text-[13px] px-3.5 py-1.5 rounded-lg border border-line bg-mist text-ink-faint cursor-not-allowed"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-ink-faint mt-2.5 leading-[1.6]">
          아직 구현되지 않은 단계입니다. 승인 없이 발송되는 경로를 만들지 않기 위해,
          발송은 승인 관문이 붙은 뒤에 엽니다.
        </p>
      </section>
    </AdminLayout>
  )
}

function BackLink() {
  return (
    <Link href="/admin/sales" className="text-[13px] text-ink-faint hover:text-ink inline-block mb-5">
      ← 영업 기회
    </Link>
  )
}
