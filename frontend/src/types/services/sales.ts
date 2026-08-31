/**
 * 영업 파이프라인 응답 모양. 계약은 `docs/sales-api-contract.md`.
 *
 * 손으로 적은 타입이다 — 다른 서비스처럼 OpenAPI 에서 생성한 것이 아니다.
 * 백엔드가 같은 레포에 있어 스키마가 갈릴 때 테스트가 먼저 깨진다.
 */

export type SalesMode = 'ACQUISITION' | 'EXPANSION'

export type OpportunityStatus =
  | 'OPEN' | 'QUALIFIED' | 'PROPOSED' | 'ENGAGED' | 'WON' | 'LOST'

/** 예측 오차에서 온다. **점수와 별개다** — 점수를 깎아 보이게 하면 안 된다. */
export type Confidence = 'high' | 'low' | 'unknown'

export interface ProspectRow {
  id: string
  name: string
  region: string
  area: string | null
  property_type: string
  capacity: number | null
  rating: number | null
  /** 연락 수단이 있는가. 없으면 기회를 만들 수 없다. */
  contactable: boolean
  /** 이미 열린 기회가 있는가. 버튼 대신 링크를 그린다. */
  has_open_opportunity: boolean
}

export interface OpportunityRow {
  id: string
  mode: SalesMode
  status: OpportunityStatus
  product: string
  score: number | null
  confidence: Confidence | null
  rationale: string | null
  target_name: string | null
  region: string | null
  property_type: string | null
}

export interface ScoreBreakdown {
  gap_score: number
  fit_score: number
  fit_axes: { capacity: number; rating: number; area: number }
  fit_reasons: string[]
  market: {
    region: string
    property_type: string
    demand: number
    supply: number
    /** `null` 일 수 있다. **0 으로 그리면 "아주 정확하다" 로 읽힌다.** */
    wape: number | null
  }
}

export interface OpportunityDetail extends OpportunityRow {
  score_breakdown: ScoreBreakdown | null
  next_action: string | null
  prospect: {
    id: string
    name: string
    area: string | null
    capacity: number | null
    rating: number | null
    contact_email: string | null
    contact_phone: string | null
    source: string
  } | null
}

export const STATUS_LABEL: Record<OpportunityStatus, string> = {
  OPEN: '발굴',
  QUALIFIED: '대상 확정',
  PROPOSED: '제안 발송',
  ENGAGED: '반응',
  WON: '계약',
  LOST: '종료',
}

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: '예측 신뢰 높음',
  low: '예측 오차가 커 사람 확인 필요',
  unknown: '이 지역 오차를 잴 표본이 없었다',
}
