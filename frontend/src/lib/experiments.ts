/**
 * 실험 배정을 서버에 묻는다.
 *
 * 클라이언트가 스스로 정하지 않는 이유는 `backend/app/api/v1/experiments.py` 에
 * 적혀 있다. 여기서 지켜야 할 건 그 결정의 **나머지 절반**이다.
 *
 * **배정을 못 받았으면 화면은 대조군처럼 그리되, 대조군으로 기록하지 않는다.**
 * 둘은 다른 문제다. 화면은 뭐라도 그려야 하니 기본 UI 를 쓰는 게 맞다. 하지만
 * 그 사람을 `control` 로 세면 대조군에 "실험 대상이 아니었던 사람"과 "서버에 못
 * 닿은 사람"이 섞인다. 후자는 네트워크가 나쁜 사람들이고, 네트워크가 나쁘면
 * 전환도 낮다 — 대조군 전환율이 실제보다 낮게 나오고, 실험이 이긴 것처럼 보인다.
 * 없애려던 편향이 정확히 반대 방향으로 되돌아온다.
 */
'use client'

import { useEffect, useState } from 'react'

import { tracker } from '@/lib/tracking'

export type AssignmentStatus = 'assigned' | 'disabled' | 'not_eligible'

export interface Assignment {
  experiment_id: string
  status: AssignmentStatus
  variant: string | null
  reason: string | null
}

/** 아직 답이 안 왔는지, 안 올 것인지 구분한다. */
export interface AssignmentState {
  loading: boolean
  /** `assigned` 일 때만 값이 있다. */
  variant: string | null
  status: AssignmentStatus | 'unreachable' | null
}

const CACHE = new Map<string, Assignment | null>()

export function useAssignment(experimentId: string): AssignmentState {
  const [state, setState] = useState<AssignmentState>(() => {
    const hit = CACHE.get(experimentId)
    if (hit === undefined) return { loading: true, variant: null, status: null }
    return hit
      ? { loading: false, variant: hit.variant, status: hit.status }
      : { loading: false, variant: null, status: 'unreachable' }
  })

  useEffect(() => {
    let alive = true
    if (CACHE.has(experimentId)) return

    const unit = tracker().anonymous_id
    const qs = new URLSearchParams({ unit_id: unit, platform: 'WEB' })

    fetch(`/api/v1/experiments/assignments?${qs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((body: { assignments: Assignment[] }) => {
        const found = body.assignments.find((a) => a.experiment_id === experimentId) ?? null
        CACHE.set(experimentId, found)
        if (!alive) return
        if (found && found.status === 'assigned' && found.variant) {
          // 배정을 받은 사람만 이후 이벤트에 변형을 싣는다.
          tracker().setExperimentVariant(found.variant)
          setState({ loading: false, variant: found.variant, status: 'assigned' })
        } else {
          setState({ loading: false, variant: null, status: found?.status ?? 'unreachable' })
        }
      })
      .catch(() => {
        CACHE.set(experimentId, null)
        if (!alive) return
        // 변형을 심지 않는다. 이 사람은 어느 군도 아니다.
        setState({ loading: false, variant: null, status: 'unreachable' })
      })

    return () => {
      alive = false
    }
  }, [experimentId])

  return state
}

export const STICKY_CTA = 'exp_sticky_cta'
