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

/**
 * 데모 모드의 관리자.
 *
 * 기존 `USER` 는 고객 화면 검사에 쓰이므로 **건드리지 않는다.** 관리자 화면은
 * `role === 'ADMIN'` 을 요구하는데 `USER` 에는 그 필드가 아예 없다
 * (`as User` 캐스팅이 그걸 덮고 있었다). 백엔드가 있을 때는 실물이 채워 주던
 * 값이라 지금까지 드러나지 않았다.
 */
export const ADMIN_USER: User = {
  id: 'u-admin',
  email: 'admin@stay.example',
  name: '데모 관리자',
  phone: '010-0000-0000',
  role: 'ADMIN',
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
    photo_url: '/images/rooms/room-03.jpg',
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
    photo_url: '/images/rooms/room-11.jpg',
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

/**
 * 그로스 리포트. **모양은 `reports/growth.json` 에서 그대로 뽑았다.**
 *
 * 손으로 적어 두면 리포트가 자라는 동안 픽스처만 옛 모양으로 남는다. 실제로
 * 그랬다 — 예전 픽스처에는 `collection`·`retention`·`revenue`·`targets` 가
 * 통째로 없었고, `funnel` 도 배열이었다(지금은 `{steps, cvr, biggest_drop}`).
 * 그런 목으로 통과한 화면은 실물에서 깨진다.
 *
 * 배열은 2~3행으로 줄였다. 검증하려는 건 행 수가 아니라 모양이다.
 */
export const GROWTH = {
  "measured_by": "scripts/run_analytics.py",
  "collection": {
    "total": 35114,
    "accepted": 33932,
    "quarantined": 153,
    "duplicates": 1029,
    "failure_rate": 0.004357,
    "duplicate_rate": 0.029305
  },
  "identity": {
    "sessions": 12040,
    "stitched_events": 5189,
    "stitch_rate": 0.1802
  },
  "funnel": {
    "steps": [
      {
        "event": "search_performed",
        "users": 9748,
        "step_rate": null
      },
      {
        "event": "property_viewed",
        "users": 6438,
        "step_rate": 0.6604
      },
      {
        "event": "booking_started",
        "users": 1924,
        "step_rate": 0.2989
      }
    ],
    "cvr": 0.0941,
    "biggest_drop": "booking_started"
  },
  "segments": [
    {
      "device_type": "DESKTOP",
      "top_users": 3142,
      "cvr": 0.1085,
      "property_viewed_rate": 0.6607,
      "booking_started_rate": 0.3545,
      "payment_started_rate": 0.6128,
      "booking_completed_rate": 0.7561
    },
    {
      "device_type": "TABLET",
      "top_users": 888,
      "cvr": 0.1014,
      "property_viewed_rate": 0.6757,
      "booking_started_rate": 0.2867,
      "payment_started_rate": 0.657,
      "booking_completed_rate": 0.7965
    },
    {
      "device_type": "MOBILE",
      "top_users": 5718,
      "cvr": 0.085,
      "property_viewed_rate": 0.6579,
      "booking_started_rate": 0.2701,
      "payment_started_rate": 0.6053,
      "booking_completed_rate": 0.7902
    }
  ],
  "segments_by": {
    "device_type": [
      {
        "device_type": "DESKTOP",
        "top_users": 3142,
        "cvr": 0.1085,
        "property_viewed_rate": 0.6607,
        "booking_started_rate": 0.3545,
        "payment_started_rate": 0.6128,
        "booking_completed_rate": 0.7561
      },
      {
        "device_type": "TABLET",
        "top_users": 888,
        "cvr": 0.1014,
        "property_viewed_rate": 0.6757,
        "booking_started_rate": 0.2867,
        "payment_started_rate": 0.657,
        "booking_completed_rate": 0.7965
      },
      {
        "device_type": "MOBILE",
        "top_users": 5718,
        "cvr": 0.085,
        "property_viewed_rate": 0.6579,
        "booking_started_rate": 0.2701,
        "payment_started_rate": 0.6053,
        "booking_completed_rate": 0.7902
      }
    ],
    "region": [
      {
        "region": "Gyeongju",
        "top_users": 1955,
        "cvr": 0.0987,
        "property_viewed_rate": 0.6558,
        "booking_started_rate": 0.3066,
        "payment_started_rate": 0.6361,
        "booking_completed_rate": 0.772
      },
      {
        "region": "Seoul",
        "top_users": 1933,
        "cvr": 0.0962,
        "property_viewed_rate": 0.6674,
        "booking_started_rate": 0.3085,
        "payment_started_rate": 0.5955,
        "booking_completed_rate": 0.7848
      },
      {
        "region": "Gangneung",
        "top_users": 1919,
        "cvr": 0.0938,
        "property_viewed_rate": 0.6644,
        "booking_started_rate": 0.2957,
        "payment_started_rate": 0.6207,
        "booking_completed_rate": 0.7692
      }
    ],
    "property_type": [
      {
        "property_type": "GUESTHOUSE",
        "top_users": 1612,
        "cvr": 0.134,
        "booking_started_rate": 0.268,
        "payment_started_rate": 0.6296,
        "booking_completed_rate": 0.7941
      },
      {
        "property_type": "APARTMENT",
        "top_users": 1220,
        "cvr": 0.132,
        "booking_started_rate": 0.2902,
        "payment_started_rate": 0.6017,
        "booking_completed_rate": 0.7559
      },
      {
        "property_type": "HOTEL",
        "top_users": 1258,
        "cvr": 0.1312,
        "booking_started_rate": 0.2814,
        "payment_started_rate": 0.6102,
        "booking_completed_rate": 0.7639
      }
    ],
    "visit_type": [
      {
        "visit_type": "RETURNING",
        "top_users": 1882,
        "cvr": 0.0946,
        "property_viewed_rate": 0.6514,
        "booking_started_rate": 0.3026,
        "payment_started_rate": 0.6307,
        "booking_completed_rate": 0.7607
      },
      {
        "visit_type": "NEW",
        "top_users": 9739,
        "cvr": 0.0774,
        "property_viewed_rate": 0.6116,
        "booking_started_rate": 0.2695,
        "payment_started_rate": 0.6056,
        "booking_completed_rate": 0.7757
      }
    ]
  },
  "segments_note": {
    "property_type": "검색은 숙소에 귀속되지 않아 조회(property_viewed)부터 센다",
    "visit_type": "스티칭 이후에 판정한다 — 로그인 전후 방문이 갈리면 돌아온 사람이 신규로 세어진다"
  },
  "retention": {
    "people": 9778,
    "returned": 1920,
    "sessions": 12040,
    "return_rate": 0.1964,
    "note": "마지막 코호트는 다시 올 시간이 적었다 (우측 절단)",
    "cohorts": [
      {
        "cohort": "2025-05-26",
        "people": 356,
        "returned": 108,
        "return_rate": 0.3034
      },
      {
        "cohort": "2025-06-02",
        "people": 2428,
        "returned": 598,
        "return_rate": 0.2463
      }
    ],
    "churn_d7": [
      {
        "cohort": "2025-05-26",
        "people": 356,
        "churned": 118,
        "d7_churn_rate": 0.3315
      },
      {
        "cohort": "2025-06-02",
        "people": 2428,
        "churned": 840,
        "d7_churn_rate": 0.346
      }
    ]
  },
  "revenue": {
    "gross_revenue": 164360000,
    "orders": 952,
    "buyers": 933,
    "people": 9778,
    "purchase_rate": 0.0954,
    "aov": 172647.1,
    "arppu": 176162.9,
    "arpu": 16809.2,
    "refunded": 5501000,
    "net_revenue": 158859000,
    "cancellations": 59,
    "cancellation_rate": 0.062,
    "by_device": [
      {
        "device_type": "DESKTOP",
        "people": 3151,
        "buyers": 349,
        "gross_revenue": 62780000,
        "aov": 175854.3,
        "arpu": 19923.8
      },
      {
        "device_type": "TABLET",
        "people": 890,
        "buyers": 90,
        "gross_revenue": 15670000,
        "aov": 170326.1,
        "arpu": 17606.7
      },
      {
        "device_type": "MOBILE",
        "people": 5737,
        "buyers": 494,
        "gross_revenue": 85910000,
        "aov": 170795.2,
        "arpu": 14974.7
      }
    ],
    "cohort_d7": [
      {
        "cohort": "2025-05-26",
        "people": 356,
        "d7_revenue": 5020000,
        "d7_arpu": 14101.1
      },
      {
        "cohort": "2025-06-02",
        "people": 2428,
        "d7_revenue": 39220000,
        "d7_arpu": 16153.2
      }
    ],
    "notes": [
      "AOV·ARPU 는 총매출 기준이다 — 주문 시점의 값이고 환불은 나중에 일어난다",
      "ARPU 를 LTV 라고 부르지 않는다 — 30일 창에서 잰 값이고 생애가 아니다"
    ]
  },
  "targets": {
    "rows": [
      {
        "key": "funnel.cvr",
        "label": "최종 전환율",
        "value": 0.0941,
        "goal": 0.1,
        "floor": 0.08,
        "direction": "UP",
        "unit": "rate",
        "status": "below",
        "rationale": "현재 9.4%. 10% 를 넘기는 것이 이번 분기 목표이고, 8% 아래는 퍼널 어딘가가 깨진 것으로 본다."
      },
      {
        "key": "funnel.mobile_booking_started",
        "label": "모바일 예약 시작률",
        "value": 0.2701,
        "goal": 0.32,
        "floor": 0.24,
        "direction": "UP",
        "unit": "rate",
        "status": "below",
        "rationale": "데스크톱이 35.4%. 그 격차를 좁히는 것이 sticky CTA 실험의 목적이라 데스크톱 근처를 목표로 둔다."
      },
      {
        "key": "retention.return_rate",
        "label": "재방문율",
        "value": 0.1964,
        "goal": 0.25,
        "floor": 0.15,
        "direction": "UP",
        "unit": "rate",
        "status": "below",
        "rationale": "현재 19.6%. 재방문자가 신규보다 전환이 높으므로(9.46% vs 7.74%) 여기를 올리는 것이 매출로 직결된다."
      }
    ],
    "summary": {
      "met": 1,
      "below": 5,
      "breach": 0,
      "unknown": 0
    },
    "declared_in": "analytics/targets.py"
  },
  "features": {
    "rows": [
      {
        "feature": "search_performed",
        "gate": "-",
        "reachable": 9778,
        "used": 9748,
        "adoption_rate": 0.9969,
        "uses_per_user": 1.22
      },
      {
        "feature": "booking_info_submitted",
        "gate": "booking_started",
        "reachable": 1938,
        "used": 1648,
        "adoption_rate": 0.8504,
        "uses_per_user": 1.03
      },
      {
        "feature": "room_viewed",
        "gate": "property_viewed",
        "reachable": 6468,
        "used": 3702,
        "adoption_rate": 0.5724,
        "uses_per_user": 2.12
      }
    ],
    "note": "분모는 전체가 아니라 그 기능에 닿을 수 있었던 사람이다",
    "never_emitted": [],
    "awaiting_app": [
      "app_backgrounded",
      "app_foregrounded"
    ]
  },
  "experiment": {
    "name": "exp_mobile_sticky_cta",
    "hypothesis": "모바일 상세 페이지에 sticky CTA 를 노출하면 예약 시작률이 오른다",
    "baseline": 0.2701,
    "mde": 0.1,
    "required_per_group": 4371,
    "exposed": {
      "control": 1885,
      "treatment": 1896
    },
    "converted": {
      "control": 470,
      "treatment": 553
    },
    "underpowered": true,
    "relative_lift": 0.1698,
    "p_value": 0.003395,
    "srm_healthy": true,
    "srm_chi_square": 0.032,
    "planted_lift": 0.18
  }
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

/**
 * 저수요 숙소.
 *
 * **모양이 실제 스키마와 어긋나 있었다** — `{name, date, occupancy}` 로 적혀
 * 있었는데 서비스가 주는 것은 `{region, stay_date, predicted, region_wape}` 다.
 * 화면은 `predicted.toFixed(2)` 를 부르므로 이 목으로는 페이지가 통째로 죽는다.
 * 목이 실물과 다른 모양을 쓰면, 그 목으로 통과한 화면은 실물에서 깨진다.
 *
 * 지역은 영업 화면과 같은 곳을 고른다 — 제주 PENSION 수요가 꺾인 것이
 * 그쪽에서 영업 기회로 이어지는 이야기다.
 */
export const FORECAST_LOW_DEMAND = {
  threshold: 1.0,
  count: 5,
  measured_on: '2025-06-24',
  note: 'region_wape 가 null 이면 그 지역을 잴 표본이 없었다는 뜻이다 — 0 이 아니다.',
  rows: [
    { property_id: 'P012', region: '제주', stay_date: '2025-07-02',
      predicted: 0.21, region_wape: 0.3448, region_n: 300 },
    { property_id: 'P018', region: '제주', stay_date: '2025-07-03',
      predicted: 0.34, region_wape: 0.3448, region_n: 300 },
    { property_id: 'P007', region: '강릉', stay_date: '2025-07-02',
      predicted: 0.47, region_wape: 0.5159, region_n: 140 },
    { property_id: 'P021', region: '경주', stay_date: '2025-07-05',
      // 표본이 없어 오차를 못 잰 지역. **0 이 아니라 null 이다.**
      predicted: 0.52, region_wape: null, region_n: 0 },
    { property_id: 'P003', region: '부산', stay_date: '2025-07-04',
      predicted: 0.88, region_wape: 0.3173, region_n: 210 },
  ],
}

/**
 * 객실. **실제 시드와 같은 모양이어야 한다** — 201·202·301 처럼 번호가 곧
 * "층 + 방번호" 다. 1,2,3 같은 작은 수로 픽스처를 만들면 좌표 격자로 그리던
 * 옛 버그가 재현되지 않아서, 테스트가 통과하는데 화면은 깨진 상태가 된다.
 */
export const ROOMS = [
  { id: 'r-201', floor: '2', number: 201, room_grade: 'DELUXE' as const, is_held: false, is_booked: false },
  { id: 'r-202', floor: '2', number: 202, room_grade: 'STANDARD' as const, is_held: false, is_booked: false },
  { id: 'r-203', floor: '2', number: 203, room_grade: 'STANDARD' as const, is_held: false, is_booked: true },
  { id: 'r-301', floor: '3', number: 301, room_grade: 'ACCESSIBLE' as const, is_held: false, is_booked: false },
]

/** 숙박일. 예약 화면이 첫 화면에서 부른다. */
export const STAY_DATE = {
  id: 'sd-1',
  property_id: 'p-1',
  room_type_id: 'rt-1',
  room_type_name: '디럭스',
  total_rooms: 4,
  check_in: '2026-09-11',
  check_out: '2026-09-13',
  stay_date: '2026-09-11',
  board_type_id: 'b-1',
  board_type_code: 'ROOM_ONLY',
  board_type_name: '객실만',
  board_type_extra_charge: 0,
  peak_day_name: null,
  peak_day_extra_charge: 0,
}

/** 투숙객 유형. `discount_amount` 는 원 단위다. */
export const GUEST_TYPES = [
  { id: 'g-1', code: 'ADULT', name: '성인', discount_amount: 0, description: null, is_active: true },
  { id: 'g-2', code: 'CHILD', name: '아동', discount_amount: 20000, description: null, is_active: true },
  { id: 'g-3', code: 'INFANT', name: '유아', discount_amount: 40000, description: null, is_active: true },
]


/* ══════════════════════════════════════════════════════════════
   영업 파이프라인 — 화면 넷이 **같은 숙소 한 곳**을 이야기하게 한다.

   제주 조천의 펜션 하나가 축이다.

     수요 예측   제주 PENSION 수요가 오르는데 우리 공급이 얇다
        ↓
     영업 기회   그 시장의 미입점 숙소가 점수순으로 뜨고, 조천이 1위
        ↓
     기회 상세   왜 1위인지 — 시장 갭 × 숙소 적합도로 펼침
        ↓
     콘텐츠      그 숙소를 대상으로 만든 문구

   서로 다른 화면인데 하나의 서비스처럼 읽히려면 이름과 지역이 맞아야 한다.
   모양은 `docs/sales-api-contract.md` 와 FastAPI 응답 모델을 따른다.
   ══════════════════════════════════════════════════════════════ */

/** 기회 상세로 바로 들어오는 주소가 있어 id 를 고정한다. */
export const DEMO_OPPORTUNITY_ID = '150e1abf-373d-42f6-9dc9-5502dcb6b3b4'

export const SALES_PROSPECTS = [
  { id: 'ps-01', name: '조천 돌담 독채', region: '제주', area: '조천',
    property_type: 'PENSION', capacity: 4, rating: 4.7,
    contactable: true, has_open_opportunity: true },
  { id: 'ps-02', name: '안덕 바다뷰 펜션', region: '제주', area: '안덕',
    property_type: 'PENSION', capacity: 6, rating: 4.4,
    contactable: true, has_open_opportunity: true },
  { id: 'ps-03', name: '강문 오션 펜션', region: '강릉', area: '강문',
    property_type: 'PENSION', capacity: 4, rating: 4.6,
    contactable: true, has_open_opportunity: true },
  { id: 'ps-04', name: '보문 한옥채', region: '경주', area: '보문',
    property_type: 'HOUSE', capacity: 4, rating: 4.8,
    contactable: true, has_open_opportunity: true },
  // ↓ 걸러져야 하는 것들. **통과분만 있으면 필터가 도는지 화면에서 못 본다.**
  { id: 'ps-05', name: '한림 연락처없는 펜션', region: '제주', area: '한림',
    property_type: 'PENSION', capacity: 4, rating: 4.3,
    contactable: false, has_open_opportunity: false },
  { id: 'ps-06', name: '광안리 저평점 펜션', region: '부산', area: '광안리',
    property_type: 'PENSION', capacity: 4, rating: 2.6,
    contactable: true, has_open_opportunity: false },
]

export const SALES_OPPORTUNITIES = [
  {
    id: DEMO_OPPORTUNITY_ID,
    mode: 'ACQUISITION', status: 'QUALIFIED', product: 'LISTING',
    score: 74, confidence: 'high',
    rationale:
      '제주 PENSION 시장은 숙소당 예측 수요 2.40 에 우리 공급이 1곳이다. ' +
      '4인 규모가 이 시장 중앙값(4인)에 가깝다 · 평점 4.7 · 조천에는 우리 숙소가 아직 없다.',
    target_name: '조천 돌담 독채', region: '제주', property_type: 'PENSION',
  },
  {
    id: 'op-02',
    mode: 'ACQUISITION', status: 'QUALIFIED', product: 'LISTING',
    score: 58, confidence: 'high',
    rationale:
      '제주 PENSION 시장은 숙소당 예측 수요 2.40 에 우리 공급이 1곳이다. ' +
      '평점 4.4 · 안덕에는 우리 숙소가 아직 없다.',
    target_name: '안덕 바다뷰 펜션', region: '제주', property_type: 'PENSION',
  },
  {
    id: 'op-03',
    mode: 'ACQUISITION', status: 'PROPOSED', product: 'LISTING',
    // 오차가 큰 시장. **점수는 안 깎고 신뢰도로만 표시한다** —
    // "기회가 작다" 와 "못 믿겠다" 는 영업이 취할 행동이 다르다.
    score: 41, confidence: 'low',
    rationale:
      '강릉 PENSION 시장은 숙소당 예측 수요 1.80 에 우리 공급이 2곳이다. ' +
      '4인 규모가 이 시장 중앙값(4인)에 가깝다 · 평점 4.6 · 강문에는 우리 숙소가 아직 없다. ' +
      '(예측 오차가 커 사람 확인 필요)',
    target_name: '강문 오션 펜션', region: '강릉', property_type: 'PENSION',
  },
  {
    id: 'op-04',
    mode: 'ACQUISITION', status: 'ENGAGED', product: 'LISTING',
    score: 33, confidence: 'unknown',
    rationale:
      '경주 HOUSE 시장은 숙소당 예측 수요 1.60 에 우리 공급이 1곳이다. 평점 4.8. ' +
      '(이 지역 오차를 잴 표본이 없었다)',
    target_name: '보문 한옥채', region: '경주', property_type: 'HOUSE',
  },
]

/** 상세는 목록의 필드에 산출 내역·다음 액션·후보 정보가 더 붙는다. */
export const SALES_OPPORTUNITY_DETAIL: Record<string, Record<string, unknown>> = {
  [DEMO_OPPORTUNITY_ID]: {
    ...SALES_OPPORTUNITIES[0],
    score_breakdown: {
      gap_score: 0.8,
      fit_score: 0.9233,
      fit_axes: { capacity: 1.0, rating: 0.85, area: 1.0 },
      fit_reasons: [
        '4인 규모가 이 시장 중앙값(4인)에 가깝다',
        '평점 4.7',
        '조천에는 우리 숙소가 아직 없다',
      ],
      market: { region: '제주', property_type: 'PENSION',
                demand: 2.4, supply: 1, wape: 0.3448 },
    },
    next_action: '제안 생성',
    prospect: {
      id: 'ps-01', name: '조천 돌담 독채', area: '조천',
      capacity: 4, rating: 4.7,
      contact_email: 'jocheon@example.com', contact_phone: '064-100-0001',
      source: 'seed',
    },
  },
  'op-02': {
    ...SALES_OPPORTUNITIES[1],
    score_breakdown: {
      gap_score: 0.8, fit_score: 0.725,
      fit_axes: { capacity: 0.5, rating: 0.7, area: 1.0 },
      fit_reasons: ['평점 4.4', '안덕에는 우리 숙소가 아직 없다'],
      market: { region: '제주', property_type: 'PENSION',
                demand: 2.4, supply: 1, wape: 0.3448 },
    },
    next_action: '제안 생성',
    prospect: {
      id: 'ps-02', name: '안덕 바다뷰 펜션', area: '안덕', capacity: 6, rating: 4.4,
      contact_email: 'andeok@example.com', contact_phone: null, source: 'seed',
    },
  },
  'op-03': {
    ...SALES_OPPORTUNITIES[2],
    score_breakdown: {
      gap_score: 0.48, fit_score: 0.85,
      fit_axes: { capacity: 1.0, rating: 0.8, area: 0.75 },
      fit_reasons: ['4인 규모가 이 시장 중앙값(4인)에 가깝다', '평점 4.6',
                    '강문에는 우리 숙소가 아직 없다'],
      market: { region: '강릉', property_type: 'PENSION',
                demand: 1.8, supply: 2, wape: 0.5159 },
    },
    next_action: '반응 확인',
    prospect: {
      id: 'ps-03', name: '강문 오션 펜션', area: '강문', capacity: 4, rating: 4.6,
      contact_email: 'gangmun@example.com', contact_phone: null, source: 'seed',
    },
  },
  'op-04': {
    ...SALES_OPPORTUNITIES[3],
    score_breakdown: {
      gap_score: 0.43, fit_score: 0.7667,
      fit_axes: { capacity: 1.0, rating: 0.9, area: 0.4 },
      fit_reasons: ['평점 4.8'],
      // 표본이 없어 오차를 못 잰 시장. **0 이 아니라 null 이다** —
      // 0 으로 그리면 "아주 정확하다" 로 읽힌다.
      market: { region: '경주', property_type: 'HOUSE',
                demand: 1.6, supply: 1, wape: null },
    },
    next_action: '후속 연락',
    prospect: {
      id: 'ps-04', name: '보문 한옥채', area: '보문', capacity: 4, rating: 4.8,
      contact_email: 'bomun@example.com', contact_phone: '054-100-0002', source: 'seed',
    },
  },
}

/* ── 콘텐츠 검색 — 같은 숙소들을 대상으로 한다 ─────────────── */

/**
 * 검색 결과.
 *
 * 모양은 손으로 짓지 않고 `src/types/services/content.ts` 의 `SearchResponse`
 * 를 따른다 — 그 파일은 RAG-Marketing 이 커밋한 OpenAPI 에서 생성된 것이다.
 * 처음에 `{query, total, hits[name, snippet]}` 로 적었다가 화면이 아무것도
 * 못 그렸다. **목이 실물과 다른 모양을 쓰면, 그 목으로 통과한 화면은 실물에서
 * 깨진다.**
 *
 * 숙소는 영업 화면과 같은 곳들이다 — 제주 조천이 축이다.
 */
export const CONTENT_SEARCH = {
  candidates_before_filter: 96,
  candidates_after_filter: 3,
  filter_reduction: 0.969,
  grounded: true,
  reason: null,
  hits: [
    {
      chunk_id: 'ps-01::AMENITY::0',
      property_id: 'ps-01',
      doc_type: 'AMENITY',
      score: 0.8412,
      text: '조천 돌담 독채 — 야외 자쿠지와 바비큐 시설을 갖춘 독채. 돌담으로 둘러싸여 마당이 보이지 않는다.',
    },
    {
      chunk_id: 'ps-02::BASIC::0',
      property_id: 'ps-02',
      doc_type: 'BASIC',
      score: 0.7106,
      text: '안덕 바다뷰 펜션 — 전 객실 오션뷰. 최대 6인까지 묵을 수 있고 주차는 무료다.',
    },
    {
      chunk_id: 'ps-03::LOCATION::0',
      property_id: 'ps-03',
      doc_type: 'LOCATION',
      score: 0.6533,
      text: '강문 오션 펜션 — 강문해변까지 도보 4분. 주문진 수산시장이 차로 15분 거리다.',
    },
  ],
}

/**
 * 생성 결과. 사실 검증을 통과한 문구다.
 *
 * **검증에 걸린 예도 하나 둔다.** 통과분만 보여 주면 검증이 실제로 도는지
 * 화면에서 확인할 방법이 없다.
 */
export const CONTENT_GENERATED = {
  property_id: 'ps-01',
  segment: 'FAMILY',
  format: 'SNS',
  backend: 'template',
  text:
    '조천 돌담 독채 — 제주 조천에서 보내는 하루. 야외 자쿠지 · 바비큐 시설까지 ' +
    '준비되어 있습니다. 최대 4인 이용 가능, 평점 4.7.',
  validation: {
    consistent: true,
    issues: [],
    checked: ['야외 자쿠지', '바비큐 시설', '4인', '4.7'],
  },
  sources: ['ps-01::AMENITY::0', 'ps-01::BASIC::0'],
}
