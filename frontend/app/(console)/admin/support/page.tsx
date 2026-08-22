'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { ServiceDownNotice, ServiceUnavailable, fetchService } from '@/components/ServiceState'

/**
 * 대화·승인 응답은 서비스가 커밋한 스키마에서 온다.
 *
 * `decision` 은 계약에서 열린 맵이다. 화면이 필드 이름을 알고 그리므로 여기서
 * 좁히되, **좁혔다는 사실을 드러낸다** — 서비스가 키를 바꾸면 타입은 통과하고
 * 화면만 비므로, 이 지점은 타입이 지켜주지 못한다.
 *
 * `Session` 은 계약에 없다. `/support/sessions/{id}` 가 `dict` 를 돌려주기
 * 때문이다. 그래서 여기만 손으로 적혀 있고, 그게 이 화면의 가장 약한 고리다.
 */
import type { components } from '@/types/services/support'

type Schemas = components['schemas']
type AgentOut = Schemas['AgentOut']
type Session = Schemas['SessionOut']
type SessionSummary = Schemas['SessionSummary']

export default function SupportPage() {
  const [sessionId] = useState(() => Math.random().toString(36).slice(2, 10))
  const [message, setMessage] = useState('B1002 예약을 취소하고 싶어요')
  const [out, setOut] = useState<AgentOut | null>(null)
  const [trace, setTrace] = useState<Session['trace']>([])
  const [down, setDown] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [waiting, setWaiting] = useState<SessionSummary[]>([])

  /** 고객이 연 문의 중 **사람 승인을 기다리는 것.** */
  const refreshWaiting = async () => {
    try {
      setWaiting(await fetchService<SessionSummary[]>('/api/support/support/sessions?awaiting=true'))
    } catch { /* 서비스가 안 떠 있으면 아래 배너가 말한다 */ }
  }

  useEffect(() => { refreshWaiting() }, [])

  const refreshTrace = async () => {
    try {
      const s = await fetchService<Session>(`/api/support/support/sessions/${sessionId}`)
      setTrace(s.trace ?? [])
    } catch { /* 세션이 아직 없으면 트레이스도 없다 */ }
  }

  const run = async (fn: () => Promise<AgentOut>) => {
    setBusy(true); setDown(null)
    try { setOut(await fn()); await refreshTrace(); await refreshWaiting() }
    catch (e) {
      setDown(e instanceof ServiceUnavailable ? e.message : String((e as Error).message))
    }
    finally { setBusy(false) }
  }

  const send = () => run(() => fetchService<AgentOut>('/api/support/support/messages', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId, message,
      request_id: Math.random().toString(36).slice(2),
    }),
  }))

  const decide = (approved: boolean) => run(() =>
    fetchService<AgentOut>('/api/support/support/confirm', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, approved }),
    }))

  return (
    <AdminLayout>
      <div className="mb-9">
        <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">상담 승인</h1>
        <p className="text-[14px] leading-[1.6] text-ink-soft mt-2.5">
          에이전트는 예약을 바꾸기 전에 멈춘다. 승인 전에는 어떤 예약도 바뀌지 않는다.
        </p>
      </div>

      {down && <ServiceDownNotice detail={down} />}

      {/* 고객이 연 문의.
          이 목록이 생기기 전까지 이 화면의 이름은 "상담 승인" 인데 **승인할
          대기 건 자체가 없었다** — 직원이 고객 문장을 직접 타이핑해 보는
          화면이었기 때문이다. */}
      <section className="mb-8 rounded-2xl border border-line overflow-hidden">
        <div className="px-7 py-5 border-b border-line flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-ink">승인 대기</h2>
          <span className="text-[13px] font-bold text-gold-600">{waiting.length}건</span>
        </div>
        {waiting.length === 0 ? (
          <p className="px-7 py-8 text-[14px] leading-[1.6] text-ink-faint">
            지금 기다리는 문의가 없습니다. 고객이 내 예약에서 "취소 문의" 를 열면 여기 나타납니다.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {waiting.map((w) => (
              <li key={w.session_id} className="px-7 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-[14px] font-semibold text-ink font-mono">
                    {w.booking_id ?? '예약 미상'}
                  </span>
                  <span className="text-[12px] text-ink-faint">
                    {new Date(w.opened_at).toLocaleString('ko-KR')}
                  </span>
                </div>
                <p className="text-[14px] leading-[1.6] text-ink-soft mt-1.5">{w.last_message}</p>
                <p className="text-[13px] leading-[1.6] text-ink-faint mt-1">{w.response}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            value={message} onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-line rounded-lg px-3 py-2 text-sm"
          />
          <button onClick={send} disabled={busy}
            className="px-4 py-2 rounded-lg bg-charcoal text-white text-sm font-semibold disabled:opacity-50">
            보내기
          </button>
        </div>
        <p className="text-[12px] leading-[1.6] text-ink-faint">
          세션 <code className="font-mono">{sessionId}</code>
        </p>

        {out && (
          <>
            <div className="bg-white rounded-2xl border border-line p-6">
              <h2 className="text-xs font-bold text-ink-faint uppercase tracking-widest mb-2">
                에이전트 응답
              </h2>
              <p className="text-sm">{out.response}</p>
            </div>

            {out.awaiting_confirmation && (
              <div className="rounded-xl border border-amber-400 bg-amber-50 p-5">
                <h2 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">
                  ⏸ 승인 대기 — 아직 아무것도 실행되지 않았다
                </h2>
{/*
                  `decision` 은 이제 계약에 모양이 있다. `proceed` 에 따라 환불
                  필드가 없을 수 있고, **그게 0 원과 다른 뜻**이다 — 거절된 결정을
                  "0 원 환불 승인"처럼 그리면 안 된다. 그래서 없을 때는 없다고 쓴다.
                */}
                {out.decision && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm mb-4">
                      <tbody>
                        <tr><td className="text-ink-faint py-1">환불 금액</td>
                          <td className="text-right font-bold tabular-nums">
                            {out.decision.refund_amount == null
                              ? <span className="text-ink-faint font-normal">환불 없음</span>
                              : `${out.decision.refund_amount.toLocaleString()}원`}
                          </td></tr>
                        <tr><td className="text-ink-faint py-1">환불 비율</td>
                          <td className="text-right tabular-nums">
                            {out.decision.refund_ratio == null
                              ? <span className="text-ink-faint">—</span>
                              : `${Math.round(out.decision.refund_ratio * 100)}%`}
                          </td></tr>
                        <tr><td className="text-ink-faint py-1 align-top">적용 정책</td>
                          <td className="text-right text-xs">{out.decision.policy ?? '-'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => decide(true)} disabled={busy}
                    className="px-4 py-2 rounded-lg bg-charcoal text-white text-sm font-semibold disabled:opacity-50">
                    승인하고 실행
                  </button>
                  <button onClick={() => decide(false)} disabled={busy}
                    className="px-4 py-2 rounded-lg border border-line text-sm font-semibold">
                    거절
                  </button>
                </div>
              </div>
            )}

            {out.escalated && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-5">
                <h2 className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">
                  사람에게 넘김
                </h2>
                <p className="text-sm text-red-900/70">
                  근거가 부족해 답을 만들지 않았다. 추측하는 대신 넘기는 것이 이 그래프의 규칙이다.
                </p>
              </div>
            )}

            {trace.length > 0 && (
              <div className="bg-white rounded-2xl border border-line p-6">
                <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-5">
                  트레이스 — 어느 노드가 무엇을 했나
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-[14px] leading-[1.55]">
                    <tbody>
                      {trace.map((step, i) => (
                        <tr key={i} className="border-t border-line">
                          <td className="py-1.5 w-24 font-mono text-xs font-semibold">{step.node}</td>
                          <td className="text-xs text-ink-faint">
                            {Object.entries(step)
                              .filter(([k]) => k !== 'node')
                              .map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(' · ') : v}`)
                              .join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}
