/**
 * BFF — 세 서비스로 나가는 유일한 통로.
 *
 * 화면은 서비스 주소를 모른다. `/api/forecast/...` 처럼 콘솔 자기 경로만 부르고,
 * 여기서 실제 서비스로 넘긴다. 서비스 응답 모양이 바뀌어도 고칠 곳이 한 군데다.
 *
 * 그리고 브라우저가 서비스를 직접 부르지 않으므로 **CORS 문제 자체가 없어진다.**
 * 서버 간 호출이기 때문이다.
 */

export type ServiceKey = 'forecast' | 'content' | 'support' | 'booking'

const BASE: Record<ServiceKey, string> = {
  forecast: process.env.FORECAST_API_URL ?? 'http://127.0.0.1:8001',
  content: process.env.CONTENT_API_URL ?? 'http://127.0.0.1:8002',
  support: process.env.SUPPORT_API_URL ?? 'http://127.0.0.1:8003',
  // 예약 백엔드. `/api/v1/*` 는 next.config 의 rewrite 가 넘기지만,
  // 서버에서 조합해 부를 때는 주소가 필요하다.
  booking: process.env.BOOKING_API_URL ?? 'http://127.0.0.1:8000',
}

const LABEL: Record<ServiceKey, string> = {
  forecast: 'ML-Product (수요 예측)',
  content: 'RAG-Marketing (콘텐츠 생성)',
  support: 'Agent-Customer-Support (상담)',
  booking: '예약 백엔드 (영업 파이프라인)',
}

export class ServiceDown extends Error {
  constructor(readonly service: ServiceKey, readonly url: string, cause: unknown) {
    super(`${LABEL[service]} 에 연결할 수 없습니다 (${url})`)
    this.cause = cause
  }
}

/**
 * 서비스 호출. 죽어 있으면 조용히 빈 값을 주지 않고 ServiceDown 을 던진다.
 *
 * 빈 배열을 돌려주면 화면은 "데이터가 없다"고 표시하는데, 실제로는 서비스가
 * 안 떠 있는 것이다. 그 둘은 다르고, 사용자가 구분할 수 있어야 한다.
 */
export async function callService(
  service: ServiceKey,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = `${BASE[service]}${path}`
  try {
    return await fetch(url, { ...init, cache: 'no-store' })
  } catch (e) {
    throw new ServiceDown(service, url, e)
  }
}

/** 라우트 핸들러가 그대로 돌려줄 응답을 만든다. */
export async function proxy(service: ServiceKey, path: string, init?: RequestInit) {
  try {
    const upstream = await callService(service, path, init)
    const body = await upstream.text()
    return new Response(body, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch (e) {
    if (e instanceof ServiceDown) {
      return Response.json(
        { error: 'service_unavailable', service: e.service, detail: e.message },
        { status: 503 },
      )
    }
    throw e
  }
}

export const serviceLabel = LABEL
