/**
 * 트래킹 SDK — 큐, 오프라인 버퍼, 배치 전송.
 *
 * 지키려는 문장은 하나다. **비행기 모드에서 시작한 예약이, 재접속 후 정확히 한 번
 * 세어진다.** 그 한 문장이 아래 결정들을 전부 끌고 온다.
 *
 * 1. `event_id` 는 **큐에 넣을 때** 만든다. 전송할 때 만들면 재시도마다 새 ID 가
 *    생기고, 서버의 중복 제거가 그대로 무력화된다. 정확히 한 번은 클라이언트가
 *    "한 번만 보내기"로 달성하는 게 아니라 — 그건 네트워크 위에서 불가능하다 —
 *    **여러 번 보내도 같은 ID 로 보내서** 서버가 접게 만드는 것으로 달성한다.
 *
 * 2. 전송 실패는 큐에서 지우지 않는다. 성공 응답을 받은 것만 지운다.
 *
 * 3. 서버가 `quarantined` 로 답한 것도 지운다. 재시도해도 같은 이유로 또 격리된다 —
 *    안 지우면 그 이벤트가 큐 맨 앞에 영원히 앉아 뒤를 전부 막는다.
 */
import { defaultStorage, type QueueStorage } from './storage'
import type { DeviceType, EventInput, IngestResponse, Platform, TrackedEvent } from './types'

/**
 * 수집 경로. `next.config.mjs` 의 rewrite 가 예약 백엔드로 넘긴다.
 *
 * 앞에 라우트 핸들러를 하나 더 두지 않은 이유가 있다. 백엔드가 죽으면 rewrite 는
 * 502 를 내고, SDK 는 그걸 실패로 보고 **큐를 지키기 때문이다.** 핸들러를 끼우면
 * 그 실패를 다시 번역해야 하고, 번역을 한 번 잘못하면(예: 503 을 200 으로 삼키면)
 * 이벤트가 조용히 사라진다. 손댈 곳이 없는 쪽을 고른다.
 */
export const INGEST_PATH = '/api/v1/events'

const QUEUE_KEY = 'tk.queue'
const ANON_KEY = 'tk.anonymous_id'

export interface TrackerOptions {
  endpoint?: string
  storage?: QueueStorage
  /** 한 요청에 담는 최대 건수. 서버 상한(500)보다 작게 잡는다. */
  batchSize?: number
  /**
   * 큐 최대 길이. **무제한 버퍼는 없다** — 저장소에 한도가 있다.
   * 넘치면 가장 오래된 것부터 버리되, 버렸다는 사실을 조용히 넘기지 않는다.
   */
  maxQueue?: number
  /** 실패 후 재시도 대기(ms). 지수 백오프의 기준값. */
  retryBaseMs?: number
  platform?: Platform
  fetchImpl?: typeof fetch
  now?: () => Date
  /** 버려진 이벤트 수를 받는다. 계측의 계측 — 안 보면 손실을 모른다. */
  onDrop?: (count: number, reason: 'queue_full') => void
}

function uuid(): string {
  const c = globalThis.crypto
  if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  // crypto 가 없는 환경(구형·비보안 컨텍스트). 충돌 확률은 서버 중복 제거를
  // 흔들 만큼은 아니지만, 이게 폴백이라는 건 분명히 해 둔다.
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 14)}`
}

function detectDevice(): DeviceType {
  if (typeof navigator === 'undefined') return 'DESKTOP'
  const ua = navigator.userAgent
  if (/iPad|Tablet/i.test(ua)) return 'TABLET'
  if (/Mobi|Android|iPhone/i.test(ua)) return 'MOBILE'
  return 'DESKTOP'
}

export class Tracker {
  private storage: QueueStorage
  private endpoint: string
  private batchSize: number
  private maxQueue: number
  private retryBaseMs: number
  private platform: Platform
  private fetchImpl: typeof fetch
  private now: () => Date
  private onDrop?: TrackerOptions['onDrop']

  private anonymousId: string
  private userId: string | null = null
  private sessionId: string | null = null
  private variant: string | null = null
  private failures = 0
  private flushing: Promise<void> | null = null

  constructor(opts: TrackerOptions = {}) {
    this.storage = opts.storage ?? defaultStorage()
    this.endpoint = opts.endpoint ?? INGEST_PATH
    this.batchSize = opts.batchSize ?? 50
    this.maxQueue = opts.maxQueue ?? 1000
    this.retryBaseMs = opts.retryBaseMs ?? 1000
    this.platform = opts.platform ?? 'WEB'
    this.fetchImpl = opts.fetchImpl ?? ((...a) => fetch(...a))
    this.now = opts.now ?? (() => new Date())
    this.onDrop = opts.onDrop

    this.anonymousId = this.storage.read(ANON_KEY) ?? uuid()
    this.storage.write(ANON_KEY, this.anonymousId)
  }

  // ─────────────────────────────── 신원
  /**
   * 로그인. **익명 ID 는 바꾸지 않는다.**
   *
   * 여기서 새 ID 를 발급하면 로그인 전 행동이 다른 사람의 것이 되고, 스티칭이
   * 이으려던 바로 그 연결이 끊긴다. 둘을 같이 실어 보내는 게 계약의 요점이다.
   */
  identify(userId: string) {
    this.userId = userId
  }

  setSession(sessionId: string | null) {
    this.sessionId = sessionId
  }

  /**
   * 실험 변형을 이후 이벤트에 실어 보낸다. `properties.variant` 로 들어간다 —
   * `scripts/run_analytics.py` 가 읽는 자리다.
   *
   * **배정을 받은 사용자만 부른다.** 참여 불가이거나 서버에 못 닿은 경우 `null`
   * 로 둬야 한다. 그때 `control` 을 넣으면 대조군이 "실험 대상이 아니었던 사람"
   * 으로 오염되고, 원격 배정으로 없앤 교락이 계측 쪽으로 되돌아온다.
   *
   * 실험 하나만 다룬다. 여러 개를 동시에 돌리려면 `properties.variant` 를
   * 실험 ID 로 키를 나눈 맵으로 바꿔야 하고, 분석 쪽도 같이 바꿔야 한다.
   */
  setExperimentVariant(variant: string | null) {
    this.variant = variant
  }

  get anonymous_id() {
    return this.anonymousId
  }

  // ─────────────────────────────── 큐
  private readQueue(): TrackedEvent[] {
    const raw = this.storage.read(QUEUE_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as TrackedEvent[]) : []
    } catch {
      // 저장소가 깨졌다. 여기서 던지면 이후 모든 이벤트가 막힌다.
      this.storage.remove(QUEUE_KEY)
      return []
    }
  }

  private writeQueue(events: TrackedEvent[]) {
    this.storage.write(QUEUE_KEY, JSON.stringify(events))
  }

  get pending(): TrackedEvent[] {
    return this.readQueue()
  }

  /** 큐에 쌓는다. 네트워크를 건드리지 않는다 — 호출부는 기다리지 않는다. */
  track(input: EventInput) {
    const event: TrackedEvent = {
      ...input,
      properties: this.variant
        ? { ...(input.properties ?? {}), variant: this.variant }
        : input.properties,
      event_id: uuid(),
      anonymous_id: this.anonymousId,
      user_id: this.userId,
      session_id: this.sessionId,
      sent_at: this.now().toISOString(),
      platform: this.platform,
      device_type: detectDevice(),
    }

    let queue = this.readQueue()
    queue.push(event)

    if (queue.length > this.maxQueue) {
      const dropped = queue.length - this.maxQueue
      // 오래된 것부터 버린다. 최근 행동이 분석에 더 쓸모 있고, 오래 갇힌
      // 이벤트일수록 시계 오차로 이미 신뢰도가 낮다.
      queue = queue.slice(dropped)
      this.onDrop?.(dropped, 'queue_full')
    }

    this.writeQueue(queue)
    return event
  }

  // ─────────────────────────────── 전송
  /**
   * 큐를 비운다. **성공한 것만 지운다.**
   *
   * 동시에 두 번 들어오면 같은 배치를 두 번 보내게 되므로 진행 중인 플러시에
   * 합류시킨다. 서버가 중복을 접어 주긴 하지만, 그건 안전망이지 설계가 아니다.
   */
  async flush(): Promise<void> {
    if (this.flushing) return this.flushing
    this.flushing = this._flush().finally(() => {
      this.flushing = null
    })
    return this.flushing
  }

  private async _flush(): Promise<void> {
    /**
     * **이번 플러시가 책임질 범위를 먼저 못 박는다.**
     *
     * "큐가 빌 때까지" 돌면 끝나지 않을 수 있다. 사용자가 계속 클릭하는 동안
     * 이벤트가 보내는 속도만큼 들어오면 이 루프는 영원히 안 끝나고, 그 사이
     * 큐도 메모리도 계속 자란다. 시작 시점의 스냅샷만 보내고, 그 뒤에 들어온
     * 건 다음 플러시로 넘긴다 — 10초 뒤면 어차피 다시 돈다.
     */
    const snapshot = this.readQueue()

    for (let i = 0; i < snapshot.length; i += this.batchSize) {
      const batch = snapshot.slice(i, i + this.batchSize)

      let res: Response
      try {
        res = await this.fetchImpl(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batch),
          keepalive: true,
        })
      } catch {
        // 오프라인이거나 서버가 죽었다. 큐는 그대로 둔다.
        this.failures += 1
        return
      }

      if (!res.ok) {
        this.failures += 1
        return
      }

      this.failures = 0

      // 보낸 만큼 지운다. **다시 읽어서** 지운다 — 전송 중에 새 이벤트가 들어왔을
      // 수 있고, 보낸 배치를 통째로 덮어쓰면 그 사이 이벤트가 사라진다.
      const sent = new Set(batch.map((e) => e.event_id))
      this.writeQueue(this.readQueue().filter((e) => !sent.has(e.event_id)))

      // 서버가 격리한 것도 지웠다. 재시도해도 같은 이유로 또 격리되기 때문이다.
      // 다만 조용히 넘기지는 않는다.
      const body = (await res.json().catch(() => null)) as IngestResponse | null
      if (body && body.quarantined > 0 && typeof console !== 'undefined') {
        console.warn(`[tracking] ${body.quarantined}건 격리됨`, body.reasons)
      }
    }
  }

  /** 다음 재시도까지 기다릴 시간. 실패가 이어지면 늘린다. 상한은 30초. */
  get backoffMs(): number {
    if (this.failures === 0) return 0
    return Math.min(this.retryBaseMs * 2 ** (this.failures - 1), 30_000)
  }

  get failureCount() {
    return this.failures
  }
}
