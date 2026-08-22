/**
 * MSW 핸들러 — 네트워크 경계에서 가로챈다.
 *
 * **왜 axios 를 모킹하지 않고 네트워크를 가로채는가.**
 * `vi.mock('@/api/properties')` 로 함수를 갈아끼우면 테스트는 쉬워지지만, 검증
 * 대상에서 **실제로 깨지는 층이 빠진다** — 경로 오타, 쿼리스트링 조립, 인터셉터,
 * 응답 파싱. 그 층들이 전부 목 뒤로 숨는다. MSW 는 요청이 나가는 것까지는 그대로
 * 두고 응답만 만들어 주므로, 화면이 **어떤 요청을 보냈는지** 를 검증할 수 있다.
 *
 * **왜 테스트와 개발이 같은 핸들러를 쓰는가.**
 * 두 벌로 나누면 반드시 갈라진다. 개발용 목을 고치고 테스트용을 안 고치면,
 * 테스트는 이제 존재하지 않는 응답을 상대로 통과한다. 한 벌만 둔다.
 */
import { HttpResponse, http } from 'msw'

import type { Wishlist } from '@/types'

import {
  FORECAST_LOW_DEMAND, FORECAST_METRICS, FORECAST_SEGMENTS, FORECAST_SEGMENTS_BY_TYPE,
  GROWTH, GUEST_TYPES, PROPERTIES, REVIEWS, ROOMS, STAY_DATE, USER,
} from './fixtures'

/** 이 배정으로 실험군 화면을 그린다. 테스트가 `server.use()` 로 덮어쓴다. */
export const DEFAULT_VARIANT = 'control'

/**
 * 수집된 이벤트. 테스트가 "무엇이 계측됐는가"를 여기서 확인한다.
 *
 * 목이 상태를 갖는 게 보통은 냄새인데, 여기서는 **계측이 검증 대상 그 자체**라
 * 필요하다. 화면은 이벤트를 화면에 안 그리므로 다른 확인 방법이 없다.
 */
export const collected: Record<string, unknown>[] = []

export function resetCollected() {
  collected.length = 0
}

/** 진행 결정. 거절은 `proceed: false` 에 `reason` 만 실린다 — 모양이 다르다. */
const DECISION = {
  proceed: true,
  reason: null,
  refund_amount: 36_000,
  refund_ratio: 0.2,
  policy: '체크인 1일 전까지 20% 환불',
}

/** 목이 들고 있는 위시리스트. `resetWishlist()` 로 테스트마다 비운다 —
 *  안 비우면 앞 테스트가 남긴 저장이 다음 테스트의 초기 상태가 된다. */
const savedWishlist: Wishlist[] = []

export function resetWishlist() {
  savedWishlist.length = 0
}

/** 목이 기억하는 상담 세션. `resetSessions()` 로 테스트마다 비운다. */
type OpenedSession = {
  session_id: string
  booking_id: string | null
  opened_at: string
  last_message: string
  awaiting_confirmation: boolean
  escalated: boolean
  response: string
}
const openedSessions: OpenedSession[] = []

export function resetSessions() {
  openedSessions.length = 0
}

export const handlers = [
  // ── 예약 백엔드 (`/api/v1/*` — next.config rewrite 가 넘기는 경로)
  http.get('/api/v1/properties', ({ request }) => {
    const status = new URL(request.url, 'http://localhost').searchParams.get('status')
    const rows = status ? PROPERTIES.filter((p) => p.status === status) : PROPERTIES
    return HttpResponse.json(rows)
  }),

  http.get('/api/v1/properties/:id', ({ params }) => {
    const found = PROPERTIES.find((p) => p.id === params.id)
    // 없는 숙소를 200 + null 로 답하지 않는다. 화면이 "빈 숙소"를 그리게 된다.
    return found ? HttpResponse.json(found) : new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/v1/properties/:id/reviews', ({ params }) =>
    HttpResponse.json(params.id === 'p-1' ? REVIEWS : []),
  ),

  http.get('/api/v1/stay-dates', () => HttpResponse.json([STAY_DATE])),

  http.get('/api/v1/stay-dates/:id', ({ params }) =>
    HttpResponse.json({ ...STAY_DATE, id: String(params.id) }),
  ),

  http.get('/api/v1/guest-types', () => HttpResponse.json(GUEST_TYPES)),

  http.get('/api/v1/stay-dates/:id/rooms', ({ params }) =>
    HttpResponse.json({ stay_date_id: String(params.id), rooms: ROOMS }),
  ),

  http.get('/api/v1/wishlists/check/:id', () => HttpResponse.json({ is_wishlist: false })),

  // ── 위시리스트. **상태를 들고 있는 목이다.**
  //
  // 빈 배열만 돌려주면 "저장했다가 새로고침하면 풀려 있다" 는 종류의 버그를
  // 못 잡는다. 목록 화면은 이 목록으로 하트를 칠하므로, 넣고 빼는 것이 실제로
  // 반영돼야 검증이 성립한다.
  http.get('/api/v1/wishlists/me', () => HttpResponse.json([...savedWishlist])),

  http.post('/api/v1/wishlists/:id', ({ params }) => {
    const id = String(params.id)
    const property = PROPERTIES.find((p) => p.id === id)
    if (!savedWishlist.some((w) => w.property_id === id)) {
      savedWishlist.push({
        id: `w-${id}`,
        property_id: id,
        property_name: property?.name ?? '',
        property_photo_url: property?.photo_url ?? null,
        created_at: new Date().toISOString(),
      })
    }
    return HttpResponse.json(savedWishlist[savedWishlist.length - 1])
  }),

  http.delete('/api/v1/wishlists/:id', ({ params }) => {
    const i = savedWishlist.findIndex((w) => w.property_id === String(params.id))
    if (i >= 0) savedWishlist.splice(i, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/v1/auth/me', ({ request }) => {
    // 토큰이 없으면 401. 인터셉터가 401 을 어떻게 다루는지도 검증 대상이다.
    const auth = request.headers.get('Authorization')
    return auth ? HttpResponse.json(USER) : new HttpResponse(null, { status: 401 })
  }),

  http.post('/api/v1/auth/login', () =>
    HttpResponse.json({ access_token: 'test-token', token_type: 'bearer' }),
  ),

  // ── 실험 배정 (M3)
  http.get('/api/v1/experiments/assignments', ({ request }) => {
    const url = new URL(request.url, 'http://localhost')
    return HttpResponse.json({
      unit_id: url.searchParams.get('unit_id'),
      platform: url.searchParams.get('platform') ?? 'WEB',
      app_version: url.searchParams.get('app_version'),
      assignments: [
        {
          experiment_id: 'exp_sticky_cta',
          status: 'assigned',
          variant: DEFAULT_VARIANT,
          reason: null,
        },
      ],
    })
  }),

  // ── 이벤트 수집 (M4)
  http.post('/api/v1/events', async ({ request }) => {
    const batch = (await request.json()) as Record<string, unknown>[]
    collected.push(...batch)
    return HttpResponse.json({
      accepted: batch.length,
      duplicates: 0,
      quarantined: 0,
      failure_rate: 0,
      reasons: [],
    })
  }),

  // ── 분석 질의 (`/api/v1/analytics/*` — rewrite 가 예약 백엔드로 넘긴다)
  //
  // 기간을 보고 답한다. 무시하면 화면이 기간을 바꿔도 같은 표가 나오고, 그게
  // 정상인지 버그인지 구분이 안 된다 — 축 파라미터에서 이미 한 번 겪은 함정이다.
  http.get('/api/v1/analytics/overview', ({ request }) => {
    const u = new URL(request.url, 'http://localhost')
    const from = u.searchParams.get('from')
    const narrowed = Boolean(from)
    return HttpResponse.json({
      window: {
        requested_from: from,
        requested_to: u.searchParams.get('to'),
        data_from: '2025-06-01T09:00:00',
        data_to: narrowed ? '2025-06-08T20:00:00' : '2025-06-30T21:00:00',
        events: narrowed ? 7271 : 34078,
      },
      // 리포트의 퍼널은 `{steps, cvr, biggest_drop}` 이고 API 는 배열을 준다.
      // 모양이 다르다는 사실을 목이 알고 있어야 화면 검증이 성립한다.
      funnel: GROWTH.funnel.steps.map((f, i) => ({
        event: f.event, users: f.users, step_rate: f.step_rate,
        drop: i === 0 ? 0 : GROWTH.funnel.steps[i - 1].users - f.users,
      })),
      cvr: narrowed ? 0.086 : 0.0957,
      retention: {
        people: 9778, returned: 1921, sessions: 12040, return_rate: 0.1964,
        cohorts: [{ cohort: '2025-06-02', people: 2428, returned: 588, return_rate: 0.242 }],
        churn_d7: narrowed
          ? []   // 7일이 안 찬 기간은 빈 결과다 — 오류가 아니다
          : [{ cohort: '2025-06-02', people: 2428, churned: 845, d7_churn_rate: 0.348 }],
      },
      revenue: {
        gross_revenue: 164360000, refunded: 5501000, net_revenue: 158859000,
        orders: 952, cancellations: 59, cancellation_rate: 0.062,
        buyers: 933, people: 9778, purchase_rate: 0.0954,
        aov: 172647, arppu: 176163, arpu: 16809,
      },
      features: [
        { feature: 'wishlist_added', gate: 'property_viewed', reachable: 6468,
          used: 857, adoption_rate: 0.1325, uses_per_user: 1.02 },
      ],
      targets: {
        rows: [
          { key: 'funnel.cvr', label: '최종 전환율', value: 0.0957, goal: 0.1,
            floor: 0.08, direction: 'UP', unit: 'rate', status: 'below',
            rationale: '현재 9.6%.' },
          { key: 'collection.failure_rate', label: '수집 격리율', value: null,
            goal: 0.005, floor: 0.02, direction: 'DOWN', unit: 'rate',
            status: 'unknown', rationale: '계측 품질 지표.' },
        ],
        summary: { met: 0, below: 1, breach: 0, unknown: 1 },
        declared_in: 'analytics/targets.py',
        never_emitted: [],
      },
    })
  }),

  http.get('/api/v1/analytics/segments', ({ request }) => {
    const by = new URL(request.url, 'http://localhost').searchParams.get('by') ?? 'device_type'
    const table: Record<string, unknown[]> = GROWTH.segments_by
    const rows = table[by] ?? GROWTH.segments_by.device_type
    return HttpResponse.json({
      dimension: by,
      // 상품 축은 분모가 다르다. 목도 그 사실을 같이 말해야 화면 검증이 성립한다.
      note: by === 'property_type'
        ? '검색은 숙소에 귀속되지 않아 조회(property_viewed)부터 센다'
        : null,
      rows,
    })
  }),

  // ── BFF (`/api/*` — 라우트 핸들러가 세 서비스로 넘기는 경로)
  http.get('/api/growth', () => HttpResponse.json(GROWTH)),
  http.get('/api/forecast/forecast/segments', ({ request }) => {
    // 축이 파라미터가 됐으므로 목도 축을 봐야 한다. 무시하면 화면이 축을 바꿔도
    // 같은 표가 나오고, 그게 정상인지 버그인지 구분이 안 된다.
    const by = new URL(request.url, 'http://localhost').searchParams.get('by') ?? 'region'
    return HttpResponse.json(by === 'property_type' ? FORECAST_SEGMENTS_BY_TYPE : FORECAST_SEGMENTS)
  }),
  http.get('/api/forecast/forecast/low-demand', () => HttpResponse.json(FORECAST_LOW_DEMAND)),
  http.get('/api/forecast/metrics', () => HttpResponse.json(FORECAST_METRICS)),

  http.post('/api/content/index', () =>
    HttpResponse.json({ indexed: 128, sources: ['숙소 설명', '리뷰'] }),
  ),
  http.post('/api/content/generate', () =>
    HttpResponse.json({ text: '해운대 오션뷰 아파트 — 바다가 보이는 3인 기준 숙소.', citations: [] }),
  ),

  // 모양은 `bank-transfer-demo/openapi.json` 의 SessionOut·AgentOut 을 따른다.
  // 예전 목은 `messages`·`reply`·`{action, approved}` 처럼 **없는 필드**를 쓰고
  // 있었다. 그런 목으로 통과한 화면은 실물에서 깨진다.
  /** 승인 대기 목록. **`booking_id` 를 받은 요청만 여기 뜬다** —
   *  고객이 예약에서 연 문의가 콘솔에 도달하는지가 검증 대상이다. */
  http.get('/api/support/support/sessions', ({ request }) => {
    const awaiting = new URL(request.url, 'http://localhost').searchParams.get('awaiting')
    const rows = awaiting === 'true' ? openedSessions.filter((r) => r.awaiting_confirmation)
                                     : openedSessions
    return HttpResponse.json(rows)
  }),

  http.get('/api/support/support/sessions/:id', ({ params }) =>
    HttpResponse.json({
      session_id: String(params.id),
      awaiting_confirmation: true,
      next_nodes: ['execute'],
      response: '환불 금액을 확인해 주세요.',
      escalated: false,
      decision: DECISION,
      // `node` 만 보장되고 나머지 키는 노드마다 다르다 — 목도 그렇게 둔다
      trace: [
        { node: 'intent', intent: 'CANCEL_REFUND', booking_id: 'B1001' },
        { node: 'retrieve', tool: 'calculate_refund', ok: true },
        { node: 'decide', ...DECISION },
      ],
    }),
  ),
  http.post('/api/support/support/messages', async ({ request }) => {
    const body = (await request.json()) as { session_id: string; booking_id?: string; message: string }
    // 고객 화면에서 열면 예약번호가 실려 온다. 목이 그걸 기억해야 대기 목록에
    // 뜨는지 검사할 수 있다.
    openedSessions.unshift({
      session_id: body.session_id,
      booking_id: body.booking_id ?? null,
      opened_at: new Date().toISOString(),
      last_message: body.message,
      awaiting_confirmation: true,
      escalated: false,
      response: '환불 금액을 확인해 주세요.',
    })
    return HttpResponse.json({
      session_id: body.session_id,
      response: '환불 금액을 확인해 주세요.',
      awaiting_confirmation: true,
      escalated: false,
      verified: false,
      decision: DECISION,
    })
  }),
  http.post('/api/support/support/confirm', async ({ request }) => {
    const body = (await request.json()) as { session_id: string; approved: boolean }
    // 승인하면 대기 목록에서 빠져야 한다.
    const row = openedSessions.find((r) => r.session_id === body.session_id)
    if (row) row.awaiting_confirmation = false
    return HttpResponse.json({
      session_id: body.session_id,
      response: '취소와 환불을 처리했습니다.',
      awaiting_confirmation: false,
      escalated: false,
      verified: true,
      decision: DECISION,
    })
  }),
]

/**
 * 서비스가 죽었을 때. BFF 가 503 + `service_unavailable` 로 답하는 계약이다.
 *
 * 이 목이 있어야 `ServiceDownNotice` 가 실제로 뜨는지 볼 수 있다. 서비스를 직접
 * 꺼 보는 것 말고는 재현할 방법이 없던 상태였다.
 */
export function serviceDown(path: string) {
  return http.all(path, () =>
    HttpResponse.json(
      { error: 'service_unavailable', service: 'forecast', detail: '해당 서비스가 실행 중인지 확인하세요.' },
      { status: 503 },
    ),
  )
}
