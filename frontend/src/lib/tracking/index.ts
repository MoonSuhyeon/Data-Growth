/**
 * 브라우저에 트래커를 붙이는 곳. 판단은 전부 `tracker.ts` 에 있고, 여기는
 * **언제 비울지**만 정한다.
 */
import { INGEST_PATH, Tracker } from './tracker'
import type { EventInput } from './types'

export { INGEST_PATH, Tracker } from './tracker'
export { LocalStorage, MemoryStorage, type QueueStorage } from './storage'
export type * from './types'

let instance: Tracker | null = null
let timer: ReturnType<typeof setInterval> | null = null

/** 주기 플러시 간격. 짧으면 요청이 늘고, 길면 이탈 직전 이벤트를 놓친다. */
const FLUSH_INTERVAL_MS = 10_000

export function tracker(): Tracker {
  if (instance) return instance
  instance = new Tracker()
  if (typeof window !== 'undefined') attach(instance)
  return instance
}

function attach(t: Tracker) {
  const flush = () => {
    void t.flush()
  }

  // 온라인 복귀. 오프라인 동안 쌓인 게 여기서 나간다.
  window.addEventListener('online', flush)

  timer ??= setInterval(() => {
    if (navigator.onLine === false) return
    // 연속 실패 중이면 쉰다. 죽은 서버를 10초마다 두드려 봐야 큐만 자란다.
    if (t.backoffMs > FLUSH_INTERVAL_MS) return
    flush()
  }, FLUSH_INTERVAL_MS)

  /**
   * 탭을 떠나는 순간. `pagehide` 이후에는 `fetch` 응답을 받을 수 없다.
   *
   * 그래서 `sendBeacon` 으로 던지고 **큐는 지우지 않는다.** 도착했는지 알 수
   * 없으니 지우면 유실이고, 안 지우면 다음 방문에 다시 보내진다. 후자를 고른다 —
   * 서버가 `event_id` 로 접기 때문에 두 번 보내도 한 번만 세어지기 때문이다.
   * 중복 제거가 서버에 있는 것의 실질적인 대가가 여기서 돌아온다.
   */
  window.addEventListener('pagehide', () => {
    const pending = t.pending
    if (pending.length === 0) return
    if (typeof navigator.sendBeacon !== 'function') return
    navigator.sendBeacon(
      INGEST_PATH,
      new Blob([JSON.stringify(pending.slice(0, 50))], { type: 'application/json' }),
    )
  })
}

/** 화면에서 부르는 한 줄. */
export function track(input: EventInput) {
  return tracker().track(input)
}

export function identify(userId: string) {
  tracker().identify(userId)
}
