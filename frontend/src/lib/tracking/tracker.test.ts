/**
 * M4 — 트래킹 SDK.
 *
 * 검증하려는 문장은 하나다. **오프라인에서 시작한 예약이 재접속 후 정확히 한 번
 * 세어진다.** 서버의 중복 제거와 짝을 이뤄야 성립하므로, 여기서는 서버를 흉내 낸
 * 가짜 수집기를 두고 `event_id` 로 접게 한다 — 실제 엔드포인트와 같은 규칙이다.
 */
import { describe, expect, it, vi } from 'vitest'

import { MemoryStorage } from './storage'
import { Tracker } from './tracker'
import type { TrackedEvent } from './types'

/** 서버를 흉내 낸다. `event_id` 로 한 번만 센다 — `analytics/collector.py` 와 같은 규칙. */
function fakeServer() {
  const seen = new Set<string>()
  const counted: TrackedEvent[] = []
  let online = true
  let calls = 0

  const impl = (async (_url: string, init?: RequestInit) => {
    calls += 1
    if (!online) throw new TypeError('Failed to fetch') // 브라우저가 오프라인에서 내는 그 오류
    const batch = JSON.parse(String(init?.body)) as TrackedEvent[]
    let accepted = 0
    let duplicates = 0
    for (const e of batch) {
      if (seen.has(e.event_id)) duplicates += 1
      else {
        seen.add(e.event_id)
        counted.push(e)
        accepted += 1
      }
    }
    return new Response(
      JSON.stringify({ accepted, duplicates, quarantined: 0, failure_rate: 0, reasons: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }) as unknown as typeof fetch

  return {
    impl,
    counted,
    get calls() {
      return calls
    },
    goOffline() {
      online = false
    },
    goOnline() {
      online = true
    },
  }
}

function make(server: ReturnType<typeof fakeServer>, opts = {}) {
  return new Tracker({
    storage: new MemoryStorage(),
    fetchImpl: server.impl,
    endpoint: '/api/events',
    ...opts,
  })
}

// ─────────────────────────────── 핵심 문장
describe('오프라인 → 재접속', () => {
  it('비행기 모드에서 시작한 예약이 재접속 후 정확히 한 번 세어진다', async () => {
    const server = fakeServer()
    const t = make(server)

    server.goOffline()
    t.track({ event_name: 'booking_started', property_id: 'p-1' })
    await t.flush()

    expect(server.counted).toHaveLength(0)
    expect(t.pending).toHaveLength(1) // 실패했다고 버리지 않는다

    server.goOnline()
    await t.flush()

    expect(server.counted).toHaveLength(1)
    expect(t.pending).toHaveLength(0)
  })

  it('응답이 유실돼 같은 배치를 다시 보내도 한 번만 세어진다', async () => {
    const server = fakeServer()
    const t = make(server)
    t.track({ event_name: 'booking_started', property_id: 'p-1' })

    const first = t.pending[0]
    await t.flush()
    // 응답이 유실됐다고 가정하고 같은 이벤트를 그대로 다시 보낸다
    await server.impl('/api/events', { method: 'POST', body: JSON.stringify([first]) })

    expect(server.counted).toHaveLength(1)
  })

  it('event_id 는 큐에 넣을 때 정해지고 재시도해도 바뀌지 않는다', async () => {
    // 이게 무너지면 재시도마다 새 이벤트가 되어 서버 중복 제거가 무력해진다.
    const server = fakeServer()
    const t = make(server)

    server.goOffline()
    t.track({ event_name: 'property_viewed', property_id: 'p-1' })
    const id = t.pending[0].event_id

    await t.flush()
    await t.flush()
    expect(t.pending[0].event_id).toBe(id)

    server.goOnline()
    await t.flush()
    expect(server.counted[0].event_id).toBe(id)
  })
})

// ─────────────────────────────── 버리지 않는다
describe('실패 처리', () => {
  it('서버가 500 을 주면 큐를 지우지 않는다', async () => {
    const t = new Tracker({
      storage: new MemoryStorage(),
      fetchImpl: (async () => new Response('boom', { status: 500 })) as unknown as typeof fetch,
    })
    t.track({ event_name: 'property_viewed', property_id: 'p-1' })
    await t.flush()
    expect(t.pending).toHaveLength(1)
  })

  it('실패가 이어지면 백오프가 늘고 상한에서 멈춘다', async () => {
    const server = fakeServer()
    server.goOffline()
    const t = make(server, { retryBaseMs: 1000 })
    t.track({ event_name: 'property_viewed', property_id: 'p-1' })

    expect(t.backoffMs).toBe(0)
    await t.flush()
    expect(t.backoffMs).toBe(1000)
    await t.flush()
    expect(t.backoffMs).toBe(2000)
    for (let i = 0; i < 20; i += 1) await t.flush()
    expect(t.backoffMs).toBe(30_000) // 무한정 늘지 않는다
  })

  it('성공하면 백오프가 초기화된다', async () => {
    const server = fakeServer()
    const t = make(server)
    server.goOffline()
    t.track({ event_name: 'property_viewed', property_id: 'p-1' })
    await t.flush()
    expect(t.failureCount).toBe(1)

    server.goOnline()
    await t.flush()
    expect(t.failureCount).toBe(0)
    expect(t.backoffMs).toBe(0)
  })
})

// ─────────────────────────────── 큐
describe('큐', () => {
  it('저장소를 공유하면 새로고침 후에도 큐가 남아 있다', async () => {
    const server = fakeServer()
    const storage = new MemoryStorage() // localStorage 를 흉내 낸다
    const before = make(server, { storage })
    server.goOffline()
    before.track({ event_name: 'booking_started', property_id: 'p-1' })

    // 새로고침 — 트래커는 새로 만들어지지만 저장소는 그대로다
    const after = make(server, { storage })
    expect(after.pending).toHaveLength(1)

    server.goOnline()
    await after.flush()
    expect(server.counted).toHaveLength(1)
  })

  it('익명 ID 는 새로고침 후에도 같다', () => {
    const server = fakeServer()
    const storage = new MemoryStorage()
    const a = make(server, { storage })
    const b = make(server, { storage })
    expect(b.anonymous_id).toBe(a.anonymous_id)
  })

  it('로그인해도 익명 ID 를 바꾸지 않는다', () => {
    // 바꾸면 로그인 전 행동이 다른 사람 것이 되고, 스티칭이 이으려던 연결이 끊긴다.
    const server = fakeServer()
    const t = make(server)
    const anon = t.anonymous_id
    t.identify('u-1')
    const e = t.track({ event_name: 'booking_completed', property_id: 'p-1', booking_id: 'b-1' })
    expect(t.anonymous_id).toBe(anon)
    expect(e.anonymous_id).toBe(anon)
    expect(e.user_id).toBe('u-1')
  })

  it('큐가 상한을 넘으면 오래된 것부터 버리고 버렸다고 알린다', () => {
    const server = fakeServer()
    const onDrop = vi.fn()
    const t = make(server, { maxQueue: 3, onDrop })

    for (let i = 0; i < 5; i += 1) t.track({ event_name: 'property_viewed', property_id: `p-${i}` })

    expect(t.pending).toHaveLength(3)
    expect(t.pending.map((e) => e.property_id)).toEqual(['p-2', 'p-3', 'p-4'])
    expect(onDrop).toHaveBeenCalledWith(1, 'queue_full')
  })

  it('배치 상한만큼 끊어 보내고 남은 것을 이어서 보낸다', async () => {
    const server = fakeServer()
    const t = make(server, { batchSize: 2 })
    for (let i = 0; i < 5; i += 1) t.track({ event_name: 'property_viewed', property_id: `p-${i}` })

    await t.flush()
    expect(server.counted).toHaveLength(5)
    expect(server.calls).toBe(3) // 2 + 2 + 1
    expect(t.pending).toHaveLength(0)
  })

  it('전송 중에 들어온 이벤트를 덮어쓰지 않는다', async () => {
    const server = fakeServer()
    let t!: Tracker
    let injected = false
    const racing = (async (_u: string, init?: RequestInit) => {
      if (!injected) {
        injected = true
        // 요청이 나가 있는 동안 사용자가 다음 화면으로 넘어갔다
        t.track({ event_name: 'payment_started', property_id: 'p-late' })
      }
      return server.impl(_u, init)
    }) as unknown as typeof fetch

    t = new Tracker({ storage: new MemoryStorage(), fetchImpl: racing, batchSize: 1 })
    t.track({ event_name: 'booking_started', property_id: 'p-1' })
    await t.flush()

    // 보낸 것만 지웠다 — 그 사이 들어온 이벤트는 큐에 남아 있다
    expect(t.pending.map((e) => e.event_name)).toEqual(['payment_started'])

    await t.flush()
    expect(server.counted.map((e) => e.event_name)).toEqual([
      'booking_started',
      'payment_started',
    ])
  })

  it('플러시가 끝나지 않는 일은 없다 — 보내는 속도만큼 이벤트가 들어와도', async () => {
    // "큐가 빌 때까지" 돌면 이 상황에서 영원히 안 끝난다. 시작 시점 스냅샷만
    // 책임지므로 반드시 끝나고, 나머지는 다음 플러시가 가져간다.
    const server = fakeServer()
    let t!: Tracker
    const chatty = (async (_u: string, init?: RequestInit) => {
      t.track({ event_name: 'property_viewed', property_id: 'p-more' })
      return server.impl(_u, init)
    }) as unknown as typeof fetch

    t = new Tracker({ storage: new MemoryStorage(), fetchImpl: chatty, batchSize: 1 })
    for (let i = 0; i < 3; i += 1) t.track({ event_name: 'property_viewed', property_id: `p-${i}` })

    await t.flush() // 끝나야 한다
    expect(server.counted).toHaveLength(3)
    expect(t.pending).toHaveLength(3) // 그 사이 들어온 3건은 다음 차례
  })
})

// ─────────────────────────────── 시각
describe('시각', () => {
  it('sent_at 은 발생 시각이지 전송 시각이 아니다', async () => {
    // 플러시할 때 찍으면 오프라인에 갇힌 이벤트가 전부 재접속 순간에 일어난
    // 것으로 기록되고, 세션 경계와 퍼널 순서가 무너진다.
    const server = fakeServer()
    let clock = new Date('2025-06-01T00:00:00Z')
    const t = make(server, { now: () => clock })

    server.goOffline()
    t.track({ event_name: 'booking_started', property_id: 'p-1' })
    const occurred = t.pending[0].sent_at

    clock = new Date('2025-06-03T00:00:00Z') // 이틀 뒤에 재접속
    server.goOnline()
    await t.flush()

    expect(server.counted[0].sent_at).toBe(occurred)
    expect(server.counted[0].sent_at).toBe('2025-06-01T00:00:00.000Z')
  })
})

// ─────────────────────────────── 계측이 제품을 넘어뜨리지 않는다
describe('견고성', () => {
  it('저장소가 깨져 있어도 새 이벤트를 받는다', () => {
    const server = fakeServer()
    const storage = new MemoryStorage()
    storage.write('tk.queue', '{망가진 JSON')
    const t = make(server, { storage })
    t.track({ event_name: 'property_viewed', property_id: 'p-1' })
    expect(t.pending).toHaveLength(1)
  })

  it('빈 큐를 플러시해도 요청을 보내지 않는다', async () => {
    const server = fakeServer()
    const t = make(server)
    await t.flush()
    expect(server.calls).toBe(0)
  })
})
