/**
 * 이벤트 계약의 클라이언트 쪽 절반.
 *
 * `tracking/taxonomy.py` 와 같은 모양이어야 한다. 여기서 어긋나면 서버가 격리하고,
 * 격리는 조용하다 — 화면은 멀쩡한데 숫자만 빈다. 그래서 이름을 손으로 맞추지 말고
 * 이 파일 하나만 고치도록 모아 둔다.
 */

export type EventName =
  | 'search_performed'
  | 'property_viewed'
  | 'room_viewed'
  | 'wishlist_added'
  | 'booking_started'
  | 'booking_info_submitted'
  | 'payment_started'
  | 'booking_completed'
  | 'booking_cancelled'
  | 'app_backgrounded'
  | 'app_foregrounded'

/** 어디서 보냈는가. `DeviceType` 과 축이 다르다 — 모바일 브라우저는 `WEB` 이다. */
export type Platform = 'WEB' | 'IOS' | 'ANDROID'

export type DeviceType = 'MOBILE' | 'DESKTOP' | 'TABLET'

/** 호출부가 채우는 부분. 식별자와 시각은 SDK 가 붙인다. */
export interface EventInput {
  event_name: EventName
  property_id?: string
  room_id?: string
  search_id?: string
  booking_id?: string
  amount?: number
  region?: string
  referrer?: string
  properties?: Record<string, unknown>
}

/** 큐에 들어가고 네트워크로 나가는 최종 모양. */
export interface TrackedEvent extends EventInput {
  event_id: string
  anonymous_id: string
  user_id?: string | null
  session_id?: string | null
  /**
   * **이벤트가 일어난 시각.** 전송 시각이 아니다.
   *
   * 이름은 서버 계약을 따랐지만 의미는 발생 시각이다. 플러시할 때 찍으면
   * 오프라인에 이틀 갇힌 이벤트가 전부 "재접속한 순간"에 일어난 것으로 기록되고,
   * 세션 경계와 퍼널 순서가 통째로 무너진다. 서버는 `received_at` 을 따로 찍어
   * 둘의 차이로 기기 시계를 검증한다 — 그 검증이 성립하려면 이 값이 클라이언트가
   * 주장하는 발생 시각이어야 한다.
   */
  sent_at: string
  platform: Platform
  device_type: DeviceType
  install_id?: string | null
  app_version?: string | null
}

export interface IngestResponse {
  accepted: number
  duplicates: number
  quarantined: number
  failure_rate: number
  reasons: string[]
}
