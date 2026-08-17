/**
 * 목이 돌려주는 데이터.
 *
 * 핸들러와 분리해 둔 이유가 있다. 테스트는 대개 **응답 모양이 아니라 특정 값**에
 * 관심이 있다("리뷰가 0건일 때", "숙소가 없을 때"). 픽스처가 따로 있으면 핸들러를
 * 건드리지 않고 그 케이스만 갈아끼울 수 있다.
 *
 * 값은 `backend/app/seed.py` 의 시드와 같은 어휘를 쓴다. 목이 실제 서버와 다른
 * 어휘를 쓰기 시작하면, 목으로 통과한 화면이 실물에서 깨진다.
 */
import type { Property, Review, User } from '@/types'

export const USER: User = {
  id: 'u-1',
  email: 'demo@example.com',
  name: '데모 사용자',
  phone: '010-0000-0000',
} as User

export const PROPERTIES: Property[] = [
  {
    id: 'p-1',
    name: '해운대 오션뷰 아파트',
    name_en: 'Haeundae Ocean View',
    description: '바다가 보이는 3인 기준 아파트.',
    host_name: '김호스트',
    highlights: ['오션뷰', '주차 가능'],
    max_guests: 3,
    property_type: 'APARTMENT',
    photo_url: null,
    listed_at: '2025-01-10',
    status: 'LISTED',
    region: '부산/울산',
    address: '부산 해운대구',
    amenities: [{ id: 'a-1', name: '와이파이' }],
    // 코드는 seed.py 의 BOARD_TYPES 와 같아야 한다 — 배지 색상 맵이 이 값으로 갈린다
    board_types: [
      { id: 'b-1', code: 'ROOM_ONLY', name: '객실만', extra_charge: 0 },
      { id: 'b-2', code: 'BREAKFAST', name: '조식 포함', extra_charge: 18000 },
    ],
    avg_rating: 4.5,
    review_count: 2,
  },
  {
    id: 'p-2',
    name: '강릉 소나무 펜션',
    name_en: null,
    description: '솔밭 옆 조용한 펜션.',
    host_name: '이호스트',
    highlights: ['바베큐'],
    max_guests: 6,
    property_type: 'PENSION',
    photo_url: null,
    listed_at: '2025-02-01',
    status: 'LISTED',
    region: '강원',
    address: '강원 강릉시',
    amenities: [],
    board_types: [{ id: 'b-1', code: 'ROOM_ONLY', name: '객실만', extra_charge: 0 }],
    avg_rating: null,
    review_count: 0,
  },
] as unknown as Property[]

export const REVIEWS: Review[] = [
  {
    id: 'r-1',
    user_name: '투숙객A',
    rating: 5,
    content: '바다가 정말 잘 보입니다.',
    helpful_count: 3,
    created_at: '2025-05-01T10:00:00Z',
  },
  {
    id: 'r-2',
    user_name: '투숙객B',
    rating: 4,
    content: '조용하고 깨끗했어요.',
    helpful_count: 1,
    created_at: '2025-05-03T10:00:00Z',
  },
] as unknown as Review[]

export const GROWTH = {
  generated_at: '2025-06-01T00:00:00Z',
  funnel: [
    { step: 1, event: 'search_performed', users: 10000, step_rate: 1.0, overall_rate: 1.0, drop: 0 },
    { step: 2, event: 'property_viewed', users: 6200, step_rate: 0.62, overall_rate: 0.62, drop: 3800 },
    { step: 3, event: 'booking_started', users: 1712, step_rate: 0.276, overall_rate: 0.171, drop: 4488 },
  ],
  by_device: [
    { device_type: 'MOBILE', top_users: 5800, cvr: 0.066, booking_started_rate: 0.243 },
    { device_type: 'DESKTOP', top_users: 3300, cvr: 0.0991, booking_started_rate: 0.329 },
  ],
  experiment: {
    control: { exposed: 2116, converted: 480 },
    treatment: { exposed: 2113, converted: 535 },
    srm_healthy: true,
    significant: true,
  },
}

/**
 * 세그먼트 응답. **모양은 `ML-Product/openapi.json` 을 따른다.**
 *
 * 목이 실제 계약과 다른 모양을 쓰기 시작하면, 목으로 통과한 화면이 실물에서
 * 깨진다. 예전 픽스처는 `region`·`mape` 였는데 서비스는 `key`·`wape` 다 —
 * 축을 파라미터로 열면서 바뀐 것이고, 여기도 같이 따라와야 한다.
 */
export const FORECAST_SEGMENTS = {
  model: 'lgbm',
  dimension: 'region',
  note: '가장 최근 폴드 기준. 전체 평균 뒤에 가려지는 구간 편차를 드러낸다.',
  rows: [
    { key: 'Seoul', wape: 0.2751, mae: 0.31, rmse: 0.52, zero_ratio: 0.18, n: 336 },
    { key: 'Gyeongju', wape: 0.5159, mae: 0.44, rmse: 0.71, zero_ratio: 0.41, n: 140 },
  ],
}

export const FORECAST_SEGMENTS_BY_TYPE = {
  model: 'lgbm',
  dimension: 'property_type',
  note: '가장 최근 폴드 기준. 전체 평균 뒤에 가려지는 구간 편차를 드러낸다.',
  rows: [
    { key: 'GUESTHOUSE', wape: 0.3055, mae: 0.33, rmse: 0.55, zero_ratio: 0.22, n: 280 },
    { key: 'PENSION', wape: 0.3608, mae: 0.37, rmse: 0.60, zero_ratio: 0.29, n: 280 },
  ],
}

export const FORECAST_METRICS = {
  baseline: 'seasonal_naive',
  serving: 'lgbm',
  measured_by: 'walk-forward, 5 folds',
  rows: [
    { model: 'seasonal_naive', wape_mean: 0.42, vs_baseline_pct: null, folds: 5 },
    { model: 'lgbm', wape_mean: 0.33, vs_baseline_pct: -21.4, folds: 5 },
  ],
}

export const FORECAST_LOW_DEMAND = {
  threshold: 0.4,
  rows: [{ property_id: 'p-2', name: '강릉 소나무 펜션', date: '2025-07-02', occupancy: 0.21 }],
}
