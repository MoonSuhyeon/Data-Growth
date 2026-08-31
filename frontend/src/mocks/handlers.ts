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

import { DEMO_TOKEN } from './MockGate'
import {
  GEN_CONTENT_SEARCH,
  GEN_ADMIN_BOARD_TYPES,
  GEN_ADMIN_COUPONS,
  GEN_ADMIN_PEAK_DATES,
  GEN_ADMIN_REFUNDS,
  GEN_ADMIN_REVIEWS,
  GEN_ADMIN_ROOM_TYPES,
  GEN_ADMIN_STATS,
  GEN_ADMIN_STAY_DATES,
  GEN_ADMIN_USERS,
  GEN_FORECAST_LOW_DEMAND,
  GEN_FORECAST_METRICS,
  GEN_FORECAST_SEGMENTS,
  GEN_FORECAST_SEGMENTS_BY_TYPE,
  GEN_PROPERTIES,
  GEN_RECENT_BOOKINGS,
  GEN_SALES_OPPORTUNITIES,
  GEN_SALES_OPPORTUNITY_DETAIL,
  GEN_SALES_PROSPECTS,
} from './fixtures.generated'

import type { Wishlist } from '@/types'

import {
  ADMIN_USER,
  FORECAST_SEGMENTS,
  FORECAST_SEGMENTS_BY_TYPE,
  GROWTH,
  GUEST_TYPES,
  PROPERTIES,
  REVIEWS,
  ROOMS,
  STAY_DATE,
  USER,
} from './fixtures'

/** 이 배정으로 실험군 화면을 그린다. 테스트가 `server.use()` 로 덮어쓴다. */
/**
 * 목이 관리자 세션까지 대신할지.
 *
 * 브라우저에서 목이 도는 경우(= 데모)에만 참이다. 노드에서 도는 테스트
 * (`server.ts`)에서는 거짓이라, 401 을 검사하던 기존 테스트가 그대로 통과한다.
 */
/*
 * 데모에서 만든 기회. **상태를 들고 있는 목이다.**
 *
 * 201 만 돌려주고 목록은 그대로 두면, 화면에서 "기회 만들기" 를 눌러도 아무
 * 일이 없는 것처럼 보인다. 위시리스트 목이 같은 이유로 상태를 들고 있다.
 */
const createdOpportunities: Record<string, unknown>[] = []

export function resetOpportunities() {
  createdOpportunities.length = 0
}

const DEMO_SESSION =
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'

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
  // ── 운영 콘솔 대시보드
  //
  // 실물은 토큰을 요구한다(`/admin/*`). 데모에서는 MockGate 가 넣어 둔 토큰이
  // 실려 오므로 목도 그것만 확인한다 — 없으면 401 이어야 화면이 인증을 건너뛰지
  // 않았다는 것이 증명된다.
  http.get('/api/v1/admin/stats', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_STATS)
      : new HttpResponse(null, { status: 401 }),
  ),

  http.get('/api/v1/admin/bookings/recent', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_RECENT_BOOKINGS)
      : new HttpResponse(null, { status: 401 }),
  ),

  // 나머지 운영 화면. 목이 없으면 요청이 실제 백엔드로 새고, Vercel 에는
  // 그게 없어 사이드바의 절반이 깨진다.
  //
  // 쓰기(등록·수정·역할 변경)는 목을 두지 않는다 — 데모에서 눌러도 아무 일이
  // 없는 편이, 되는 척하고 새로고침하면 사라지는 것보다 낫다.
  http.get('/api/v1/admin/users', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_USERS)
      : new HttpResponse(null, { status: 401 }),
  ),

  http.get('/api/v1/admin/stay-dates', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_STAY_DATES)
      : new HttpResponse(null, { status: 401 }),
  ),

  http.get('/api/v1/admin/room-types', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_ROOM_TYPES)
      : new HttpResponse(null, { status: 401 }),
  ),

  http.get('/api/v1/admin/refunds', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_REFUNDS)
      : new HttpResponse(null, { status: 401 }),
  ),

  http.get('/api/v1/admin/peak-dates', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_PEAK_DATES)
      : new HttpResponse(null, { status: 401 }),
  ),

  http.get('/api/v1/admin/coupons', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_COUPONS)
      : new HttpResponse(null, { status: 401 }),
  ),

  http.get('/api/v1/admin/reviews', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_REVIEWS)
      : new HttpResponse(null, { status: 401 }),
  ),

  http.get('/api/v1/admin/board-types', ({ request }) =>
    request.headers.get('Authorization')
      ? HttpResponse.json(GEN_ADMIN_BOARD_TYPES)
      : new HttpResponse(null, { status: 401 }),
  ),

  // 숙소는 실물 시드에서 뽑은 41건을 쓴다. 둘만 있으면 목록이 비어 보인다.
  http.get('/api/v1/properties', ({ request }) => {
    const status = new URL(request.url, 'http://localhost').searchParams.get('status')
    const rows = status
      ? GEN_PROPERTIES.filter((p) => p.status === status)
      : GEN_PROPERTIES
    return HttpResponse.json(rows)
  }),

  http.get('/api/v1/properties/:id', ({ params }) => {
    // 상세는 중첩 필드(board_types·amenities)가 필요하다. 손으로 쓴 두 건이
    // 그 모양을 갖고 있으므로 먼저 보고, 없으면 실물 목록에서 찾는다.
    const found =
      PROPERTIES.find((p) => p.id === params.id) ??
      GEN_PROPERTIES.find((p) => p.id === params.id)
    // 없는 숙소를 200 + null 로 답하지 않는다. 화면이 "빈 숙소"를 그리게 된다.
    return found ? HttpResponse.json(found) : new HttpResponse(null, { status: 404 })
  }),

  http.get('/api/v1/properties/:id/reviews', ({ params }) =>
    HttpResponse.json(params.id === 'p-1' ? REVIEWS : []),
  ),

  /** 환불 견적. **0원이 정상 응답이다** — 체크인이 지난 예약이 그렇다. */
  http.get('/api/v1/bookings/:id/refund-quote', ({ params }) =>
    HttpResponse.json({
      booking_id: String(params.id),
      total_price: 90000,
      days_until_check_in: -3,
      refund_ratio: 0,
      refund_amount: 0,
      policy_name: '표준 취소 정책',
      policy_description: '체크인 7일 전까지 100% 환불, 이후 환불 불가',
      refundable: true,
      reason: null,
    }),
  ),

  http.post('/api/v1/bookings/:id/refund', ({ params }) =>
    HttpResponse.json({
      id: 'rf-1', booking_id: String(params.id), refund_amount: 0,
      reason: null, status: 'COMPLETED',
      requested_at: new Date().toISOString(), processed_at: new Date().toISOString(),
    }),
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

  /*
    데모 모드에서는 **토큰 없이도 관리자로 본다.**

    Vercel 에는 백엔드가 없어 로그인을 할 수가 없고, 그러면 심사위원이 운영
    콘솔을 열 방법이 없다. 그래서 목이 관리자 세션을 대신 준다.

    **실제 인증을 지우는 것이 아니다.** 목은 `NEXT_PUBLIC_API_MOCKING=enabled`
    일 때만 붙고, 그 값이 없으면 이 핸들러 자체가 존재하지 않는다. 백엔드가
    있는 환경에서는 기존 `/auth/me` 와 `AuthGate` 가 그대로 돈다.

    토큰이 오면 그대로 존중한다 — 테스트가 401 경로를 검사하려고 헤더를 빼는
    경우가 있는데, 그 검사는 고객 화면 쪽 `USER` 로 계속 성립해야 한다.
  */
  http.get('/api/v1/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth) return new HttpResponse(null, { status: 401 })
    // 데모가 넣어 둔 토큰이면 관리자, 그 밖에는 기존대로 고객이다.
    return auth.includes(DEMO_TOKEN)
      ? HttpResponse.json(ADMIN_USER)
      : HttpResponse.json(USER)
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
    return HttpResponse.json(
      by === 'property_type' ? GEN_FORECAST_SEGMENTS_BY_TYPE : GEN_FORECAST_SEGMENTS,
    )
  }),
  http.get('/api/forecast/forecast/low-demand', () => HttpResponse.json(GEN_FORECAST_LOW_DEMAND)),
  http.get('/api/forecast/metrics', () => HttpResponse.json(GEN_FORECAST_METRICS)),

  // 콘텐츠 검색. 화면이 색인 → 검색 → 생성 순으로 부른다.
  http.post('/api/sales/opportunities', async ({ request }) => {
    const body = (await request.json()) as { prospect_id?: string }
    const prospect = GEN_SALES_PROSPECTS.find((p) => p.id === body.prospect_id)

    // 실물이 막는 것은 목도 막는다. 통과만 하는 목으로 검증한 화면은
    // 거절 문구를 한 번도 못 그려 보고 배포된다.
    if (!prospect) {
      return HttpResponse.json({ detail: '그런 후보가 없습니다' }, { status: 404 })
    }
    if (!prospect.contactable) {
      return HttpResponse.json({ detail: '연락 수단이 없어 영업할 수 없습니다' }, { status: 409 })
    }
    if (prospect.rating !== null && prospect.rating < 3.0) {
      return HttpResponse.json(
        { detail: `영업 대상이 아닙니다: 평점 ${prospect.rating.toFixed(1)} — 최소 기준 3.0 미달` },
        { status: 409 },
      )
    }
    const already =
      prospect.has_open_opportunity ||
      createdOpportunities.some((o) => (o as { prospect_id: string }).prospect_id === prospect.id)
    if (already) {
      return HttpResponse.json(
        { detail: '이 후보에 열려 있는 기회가 이미 있습니다' }, { status: 409 },
      )
    }

    const made = {
      id: `op-demo-${createdOpportunities.length + 1}`,
      prospect_id: prospect.id,
      mode: 'ACQUISITION', status: 'QUALIFIED', product: 'LISTING',
      score: 52, confidence: 'high',
      rationale:
        `${prospect.region} ${prospect.property_type} 시장은 숙소당 예측 수요 2.10 에 ` +
        `우리 공급이 2곳이다. 평점 ${prospect.rating} · ` +
        `${prospect.area}에는 우리 숙소가 아직 없다.`,
      target_name: prospect.name,
      region: prospect.region,
      property_type: prospect.property_type,
      score_breakdown: {
        gap_score: 0.7, fit_score: 0.7429,
        fit_axes: { capacity: 0.75, rating: 0.65, area: 0.83 },
        fit_reasons: [`평점 ${prospect.rating}`, `${prospect.area}에는 우리 숙소가 아직 없다`],
        market: {
          region: prospect.region, property_type: prospect.property_type,
          demand: 2.1, supply: 2, wape: 0.3312,
        },
      },
      next_action: '제안 생성',
      prospect: {
        id: prospect.id, name: prospect.name, area: prospect.area,
        capacity: prospect.capacity, rating: prospect.rating,
        contact_email: `${prospect.id}@example.com`, contact_phone: null,
        source: 'seed',
      },
    }
    createdOpportunities.push(made)
    return HttpResponse.json(made, { status: 201 })
  }),

  http.post('/api/content/search', () => HttpResponse.json(GEN_CONTENT_SEARCH)),

  // ── 영업 파이프라인 (`/api/sales/*` — BFF 가 예약 백엔드로 넘기는 경로)
  //
  // 모양은 `docs/sales-api-contract.md` 와 FastAPI `sales.py` 의 응답 모델을
  // 따른다. 목이 다른 모양을 쓰면 그 목으로 통과한 화면은 실물에서 깨진다.
  http.get('/api/sales/prospects', ({ request }) => {
    const region = new URL(request.url, 'http://localhost').searchParams.get('region')
    return HttpResponse.json(
      region ? GEN_SALES_PROSPECTS.filter((p) => p.region === region) : GEN_SALES_PROSPECTS,
    )
  }),

  http.get('/api/sales/opportunities', ({ request }) => {
    const u = new URL(request.url, 'http://localhost')
    const mode = u.searchParams.get('mode')
    const status = u.searchParams.get('status')
    // 실물이 거르는 것은 목도 걸러야 한다. 무시하면 화면이 필터를 바꿔도 같은
    // 표가 나오고, 그게 정상인지 버그인지 구분이 안 된다.
    const rows = [...GEN_SALES_OPPORTUNITIES, ...createdOpportunities]
      .filter((o) => !mode || (o as { mode: string }).mode === mode)
      .filter((o) => !status || (o as { status: string }).status === status)
    // 실물은 점수순으로 준다. 목이 순서를 안 지키면 정렬 검증이 성립하지 않는다.
    return HttpResponse.json(
      [...rows].sort((a, b) =>
        ((b as { score: number }).score ?? 0) - ((a as { score: number }).score ?? 0)),
    )
  }),

  http.get('/api/sales/opportunities/:id', ({ params }) => {
    const found =
      GEN_SALES_OPPORTUNITY_DETAIL[String(params.id)] ??
      createdOpportunities.find((o) => (o as { id: string }).id === String(params.id))
    // 없는 기회를 200 + null 로 답하지 않는다. 화면이 "빈 기회" 를 그리게 된다.
    return found
      ? HttpResponse.json(found)
      : HttpResponse.json({ detail: '그런 기회가 없습니다' }, { status: 404 })
  }),

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
