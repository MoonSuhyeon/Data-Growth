/**
 * M6 — 실험 변형이 이벤트에 실리는 규칙.
 *
 * 원격 배정(M3)이 없애려던 교락은 계측 쪽에서 쉽게 되살아난다. 배정을 못 받은
 * 사람을 `control` 로 세는 순간, 대조군에 **"실험 대상이 아니었던 사람"과
 * "서버에 못 닿은 사람"** 이 섞인다. 후자는 네트워크가 나쁜 쪽이고 네트워크가
 * 나쁘면 전환도 낮으니, 대조군 전환율이 실제보다 낮아지고 실험이 이긴 것처럼
 * 보인다. 편향이 반대 방향으로 되돌아온다.
 */
import { describe, expect, it } from 'vitest'

import { MemoryStorage } from './storage'
import { Tracker } from './tracker'

function make() {
  return new Tracker({
    storage: new MemoryStorage(),
    fetchImpl: (async () => new Response('{}', { status: 200 })) as unknown as typeof fetch,
  })
}

describe('변형 태깅', () => {
  it('변형을 지정하지 않으면 이벤트에 변형이 없다', () => {
    const e = make().track({ event_name: 'property_viewed', property_id: 'p-1' })
    expect(e.properties?.variant).toBeUndefined()
  })

  it('배정을 받으면 이후 이벤트에 실린다', () => {
    const t = make()
    t.setExperimentVariant('treatment')
    const e = t.track({ event_name: 'property_viewed', property_id: 'p-1' })
    expect(e.properties?.variant).toBe('treatment')
  })

  it('배정 실패를 control 로 채우지 않는다', () => {
    // 화면은 대조군처럼 그려도 되지만, 기록까지 대조군이면 안 된다.
    const t = make()
    t.setExperimentVariant(null)
    const e = t.track({ event_name: 'property_viewed', property_id: 'p-1' })
    expect(e.properties?.variant).toBeUndefined()
  })

  it('변형을 지정해도 호출부가 넘긴 properties 를 덮지 않는다', () => {
    const t = make()
    t.setExperimentVariant('control')
    const e = t.track({
      event_name: 'property_viewed',
      property_id: 'p-1',
      properties: { source: 'search' },
    })
    expect(e.properties).toEqual({ source: 'search', variant: 'control' })
  })

  it('변형은 지정 이후 이벤트에만 붙는다', () => {
    // 배정은 비동기로 온다. 그 전에 발생한 이벤트를 소급해 태깅하지 않는다 —
    // 그 사람이 그때 무엇을 봤는지는 알 수 없기 때문이다.
    const t = make()
    const before = t.track({ event_name: 'search_performed', search_id: 's-1' })
    t.setExperimentVariant('treatment')
    const after = t.track({ event_name: 'property_viewed', property_id: 'p-1' })

    expect(before.properties?.variant).toBeUndefined()
    expect(after.properties?.variant).toBe('treatment')
  })
})
