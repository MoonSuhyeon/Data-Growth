/** BFF — support 서비스로 넘긴다. 화면은 이 경로만 안다. */
import { proxy } from '@/lib/services'

type Ctx = { params: Promise<{ path: string[] }> }

function target(url: string, path: string[]) {
  const qs = new URL(url).search
  return '/' + path.join('/') + qs
}

/**
 * 고객의 토큰을 그대로 넘긴다.
 *
 * 상담 에이전트는 실제 예약을 볼 때 **호출자의 토큰으로 `/bookings/me` 를**
 * 부른다. 여기서 헤더를 안 넘기면 에이전트가 아무 예약도 못 보고, 화면은
 * "예약을 찾지 못했습니다" 를 그린다 — 예약은 멀쩡히 있는데.
 *
 * 토큰을 넘기는 것이 권한을 넓히는 게 아니라 **좁힌다.** 에이전트가 볼 수
 * 있는 범위가 이 고객의 예약으로 한정된다.
 */
function forwardAuth(req: Request): HeadersInit {
  const auth = req.headers.get('authorization')
  return auth ? { authorization: auth } : {}
}

export async function GET(req: Request, { params }: Ctx) {
  const { path } = await params
  return proxy('support', target(req.url, path), { headers: forwardAuth(req) })
}

export async function POST(req: Request, { params }: Ctx) {
  const { path } = await params
  return proxy('support', target(req.url, path), {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...forwardAuth(req) },
    body: await req.text(),
  })
}
