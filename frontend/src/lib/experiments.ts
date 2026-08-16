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

/**
 * 세션 동안의 배정 캐시. 한 번 물었으면 다시 묻지 않는다.
 *
 * `null` 은 "물었는데 못 닿았다"는 뜻이다. `undefined`(키 없음)와 구분해야
 * 재시도 여부를 정할 수 있다.
 */
const CACHE = new Map<string, Assignment | null>()

/** 테스트와 명시적 무효화용. 배정은 세션 내내 안정적이어야 하므로 평소엔 안 부른다. */
export function clearAssignmentCache() {
  CACHE.clear()
}

function toState(found: Assignment | null): AssignmentState {
  if (found && found.status === 'assigned' && found.variant) {
    return { loading: false, variant: found.variant, status: 'assigned' }
  }
  return { loading: false, variant: null, status: found?.status ?? 'unreachable' }
}

export function useAssignment(experimentId: string): AssignmentState {
  const [state, setState] = useState<AssignmentState>(() => {
    const hit = CACHE.get(experimentId)
    if (hit === undefined) return { loading: true, variant: null, status: null }
    return toState(hit)
  })

  useEffect(() => {
    let alive = true

    /**
     * 화면 상태와 계측 태깅을 **항상 같이** 한다.
     *
     * 예전에는 캐시가 있으면 여기까지 안 오고 곧장 return 했다. 그러면 두 번째
     * 숙소부터 화면은 실험군인데 이벤트에는 변형이 안 실린다 — 노출이 어느 군도
     * 아닌 채로 기록되고, 그 사람은 분모 어디에도 못 들어간다. 화면과 계측이
     * 갈라지는 이런 버그는 **화면이 멀쩡해서** 눈으로는 안 잡힌다.
     */
    const apply = (found: Assignment | null) => {
      const next = toState(found)
      // 배정을 받은 사람만 태깅한다. 못 닿았거나 참여 불가면 null 이다 —
      // control 로 채우면 대조군이 오염된다.
      tracker().setExperimentVariant(next.variant)
      if (alive) setState(next)
    }

    if (CACHE.has(experimentId)) {
      apply(CACHE.get(experimentId) ?? null)
      return
    }

    const unit = tracker().anonymous_id
    const qs = new URLSearchParams({ unit_id: unit, platform: 'WEB' })

    fetch(`/api/v1/experiments/assignments?${qs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((body: { assignments: Assignment[] }) => {
        const found = body.assignments.find((a) => a.experiment_id === experimentId) ?? null
        CACHE.set(experimentId, found)
        apply(found)
      })
      .catch(() => {
        CACHE.set(experimentId, null)
        apply(null)
      })

    return () => {
      alive = false
    }
  }, [experimentId])

  return state
}

export const STICKY_CTA = 'exp_sticky_cta'
