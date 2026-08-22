'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { SHELL } from '@/components/Navbar'
import { ServiceUnavailable, fetchService } from '@/components/ServiceState'
import { useAuthStore } from '@/store/authStore'
import type { components } from '@/types/services/support'

type AgentOut = components['schemas']['AgentOut']

/**
 * 고객이 여는 상담 화면.
 *
 * 그동안 이 에이전트를 부르는 곳은 운영 콘솔뿐이었다. 직원이 고객 문장을 직접
 * 타이핑하는 화면이라, 이름은 "상담 승인" 인데 **승인할 대기 건 자체가 생기지
 * 않았다.** 여기가 그 대기 건이 생기는 자리다.
 *
 * ## 예약번호를 묻지 않는다
 *
 * `?booking=BK2608190016` 으로 들어온다. 고객에게 예약번호를 외워서 적으라고
 * 할 수 없고, 오타 하나면 남의 예약을 조회하게 된다. 화면이 아는 사실을
 * 화면이 실어 보낸다.
 *
 * ## 확인 없이는 아무 일도 안 일어난다
 *
 * 에이전트는 정책과 환불액을 **먼저 알려주고 멈춘다**(`interrupt_before`).
 * 고객이 확인을 눌러야 다음이 있다. 이 화면이 그 멈춤을 그대로 보여 준다.
 */
function SupportInner() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, token, isInitializing } = useAuthStore()

  const bookingNumber = params.get('booking') ?? ''
  const [sessionId] = useState(() => `c-${Math.random().toString(36).slice(2, 10)}`)
  const [out, setOut] = useState<AgentOut | null>(null)
  const [busy, setBusy] = useState(false)
  const [down, setDown] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  const auth = token ? { authorization: `Bearer ${token}` } : undefined

  const run = useCallback(async (fn: () => Promise<AgentOut>) => {
    setBusy(true); setError(null)
    try {
      setOut(await fn())
    } catch (e) {
      // 서비스가 안 떠 있는 것과 요청이 거절된 것은 다른 사실이다.
      if (e instanceof ServiceUnavailable) setDown(e.message)
      else setError(e instanceof Error ? e.message : '요청을 처리하지 못했습니다')
    } finally {
      setBusy(false)
    }
  }, [])

  // 화면에 들어오면 바로 문의를 연다. 고객이 문장을 지어낼 필요가 없다 —
  // 무엇을 물어볼지는 이 화면이 안다.
  useEffect(() => {
    if (isInitializing) return
    if (!user) { router.replace(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`); return }
    if (!bookingNumber || out) return

    run(() => fetchService<AgentOut>('/api/support/support/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...auth },
      body: JSON.stringify({
        session_id: sessionId,
        message: '예약을 취소하고 싶어요',
        request_id: crypto.randomUUID(),
        booking_id: bookingNumber,
      }),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitializing, user, bookingNumber])

  const confirm = (approved: boolean) =>
    run(async () => {
      const res = await fetchService<AgentOut>('/api/support/support/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...auth },
        body: JSON.stringify({ session_id: sessionId, approved }),
      })
      setDone(approved ? '취소 요청을 접수했습니다.' : '요청을 취소했습니다. 예약은 그대로입니다.')
      return res
    })

  if (!bookingNumber) {
    return (
      <Shell>
        <p className="text-[15px] leading-[1.6] text-ink">어느 예약에 대한 문의인지 알 수 없습니다.</p>
        <Link href="/my/bookings" className="inline-block mt-6 text-[14px] font-medium text-gold-700 underline underline-offset-4">
          내 예약에서 시작하기
        </Link>
      </Shell>
    )
  }

  if (down) {
    return (
      <Shell>
        <p className="text-[15px] leading-[1.6] font-medium text-ink">상담 서비스에 연결할 수 없습니다.</p>
        <p className="text-[14px] leading-[1.6] text-ink-faint mt-3">{down}</p>
        <p className="text-[13px] leading-[1.6] text-ink-faint mt-4">
          예약은 그대로입니다. 잠시 뒤 다시 시도해 주세요.
        </p>
      </Shell>
    )
  }

  const decision = out?.decision as
    | { proceed: boolean; reason?: string | null; refund_amount?: number | null; refund_ratio?: number | null }
    | null
    | undefined

  return (
    <Shell>
      <p className="text-[13px] leading-[1.5] text-ink-faint">예약 {bookingNumber}</p>
      <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em] mt-2 mb-8">
        예약 취소 문의
      </h1>

      {busy && !out && <p className="text-[14px] text-ink-faint py-8">상담원을 연결하는 중…</p>}

      {out && (
        <div className="rounded-2xl border border-line p-7">
          <p className="text-[15px] leading-[1.7] text-ink whitespace-pre-line">{out.response}</p>

          {decision?.proceed && decision.refund_amount != null && (
            <div className="mt-6 pt-6 border-t border-line">
              <p className="text-[13px] leading-[1.5] text-ink-faint mb-1.5">예상 환불액</p>
              <p className="text-[28px] font-bold leading-[1.25] text-gold-600">
                {decision.refund_amount.toLocaleString()}원
              </p>
              {decision.refund_ratio != null && (
                <p className="text-[13px] leading-[1.6] text-ink-faint mt-2">
                  결제 금액의 {Math.round(decision.refund_ratio * 100)}%
                </p>
              )}
            </div>
          )}

          {/* 에스컬레이션. **에이전트가 모르면 지어내지 않고 사람에게 넘긴다.** */}
          {out.escalated && (
            <p className="mt-5 text-[13px] leading-[1.6] text-ink-faint">
              상담원이 확인 후 안내드립니다. 예약은 그대로 유지됩니다.
            </p>
          )}

          {done && (
            <p className="mt-6 pt-6 border-t border-line text-[14px] leading-[1.6] font-medium text-ink">
              {done}
            </p>
          )}

          {error && (
            <p className="mt-6 pt-6 border-t border-line text-[14px] leading-[1.6] text-burgundy">
              {error}
            </p>
          )}

          {/* 확인 버튼은 **에이전트가 멈춰 섰을 때만** 뜬다. 늘 띄워 두면
              누를 수 있게 생겼는데 아무 일도 안 하는 버튼이 된다. */}
          {out.awaiting_confirmation && !done && (
            <div className="mt-7 flex gap-3">
              <button
                onClick={() => confirm(true)}
                disabled={busy}
                className="flex-1 bg-gilt text-white py-3.5 rounded-full text-[15px] font-semibold shadow-gold hover:brightness-105 disabled:opacity-45 transition"
              >
                {busy ? '처리 중…' : '취소 진행하기'}
              </button>
              <button
                onClick={() => confirm(false)}
                disabled={busy}
                className="px-7 py-3.5 rounded-full border border-line text-[15px] font-medium text-ink-soft hover:border-ink/35 disabled:opacity-45 transition"
              >
                그만두기
              </button>
            </div>
          )}
        </div>
      )}

      <Link
        href="/my/bookings"
        className="inline-block mt-8 text-[14px] font-medium text-gold-700 hover:text-gold-800 underline underline-offset-4"
      >
        내 예약으로 돌아가기
      </Link>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className={`${SHELL} py-14 md:py-16`}>
      <div className="max-w-xl">{children}</div>
    </main>
  )
}

export default function SupportPage() {
  return (
    <Suspense fallback={<Shell><p className="text-[14px] text-ink-faint">불러오는 중…</p></Shell>}>
      <SupportInner />
    </Suspense>
  )
}
