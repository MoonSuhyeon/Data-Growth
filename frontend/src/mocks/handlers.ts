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

import {
  FORECAST_LOW_DEMAND, FORECAST_METRICS, FORECAST_SEGMENTS,
  GROWTH, PROPERTIES, REVIEWS, USER,
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

  http.get('/api/v1/wishlists/check/:id', () => HttpResponse.json({ is_wishlist: false })),

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

  // ── BFF (`/api/*` — 라우트 핸들러가 세 서비스로 넘기는 경로)
  http.get('/api/growth', () => HttpResponse.json(GROWTH)),
  http.get('/api/forecast/forecast/segments', () => HttpResponse.json(FORECAST_SEGMENTS)),
  http.get('/api/forecast/forecast/low-demand', () => HttpResponse.json(FORECAST_LOW_DEMAND)),
  http.get('/api/forecast/metrics', () => HttpResponse.json(FORECAST_METRICS)),

  http.post('/api/content/index', () =>
    HttpResponse.json({ indexed: 128, sources: ['숙소 설명', '리뷰'] }),
  ),
  http.post('/api/content/generate', () =>
    HttpResponse.json({ text: '해운대 오션뷰 아파트 — 바다가 보이는 3인 기준 숙소.', citations: [] }),
  ),

  http.get('/api/support/support/sessions/:id', ({ params }) =>
    HttpResponse.json({ session_id: params.id, messages: [], decision: null }),
  ),
  http.post('/api/support/support/messages', () =>
    HttpResponse.json({ decision: null, trace: [], reply: '확인했습니다.' }),
  ),
  http.post('/api/support/support/confirm', () =>
    HttpResponse.json({ decision: { action: 'REFUND', approved: true }, trace: [] }),
  ),
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
