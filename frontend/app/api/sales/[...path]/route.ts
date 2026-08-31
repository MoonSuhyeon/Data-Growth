/**
 * BFF — 영업 파이프라인.
 *
 * 조회는 그냥 백엔드로 넘긴다. **생성만 다르다** — 점수를 내려면 시장 수요가
 * 필요한데 그건 다른 서비스(ML-Product)에 있다.
 *
 * ## 왜 화면이 아니라 여기서 두 번 부르는가
 *
 * 화면이 예측을 먼저 받아 본문에 실어 보내면, 그 순간 **화면이 예측 응답의
 * 모양을 알아야 한다.** BFF 를 둔 이유가 바로 그걸 없애기 위해서였다.
 * 왕복도 세 번이 된다.
 *
 * ## 이것은 임시 배선이다
 *
 * 원래 이 조합은 에이전트(Agent-Sales)의 `get_market_demand` 도구가 한다 —
 * 무엇을 조사할지 고르는 판단이 에이전트에 있어야 하기 때문이다. 에이전트에
 * 영업 경로가 붙기 전까지, 화면이 먼저 돌 수 있게 여기서 같은 두 번을 부른다.
 * **두 벌의 규칙을 만들지는 않았다** — 정규화도 점수도 전부 백엔드가 한다.
 */
import { callService, proxy } from '@/lib/services'

type Ctx = { params: Promise<{ path: string[] }> }

const BACKEND_PREFIX = '/api/v1/sales'

function target(url: string, path: string[]) {
  const qs = new URL(url).search
  return `${BACKEND_PREFIX}/${path.join('/')}${qs}`
}

export async function GET(req: Request, { params }: Ctx) {
  const { path } = await params
  return proxy('booking', target(req.url, path))
}

/**
 * 예측을 읽어 본문에 실어 백엔드로 넘긴다.
 *
 * 예측 서비스가 죽으면 **기회를 만들지 않는다.** 빈 수요로 넘기면 백엔드가
 * "이 시장의 수요를 찾을 수 없습니다" 로 거절하는데, 그건 시장이 없다는
 * 말이지 서비스가 죽었다는 말이 아니다. 화면이 두 상황을 구분해야 한다.
 */
export async function POST(req: Request, { params }: Ctx) {
  const { path } = await params
  const body = await req.json().catch(() => ({}))

  if (path.join('/') !== 'opportunities') {
    return proxy('booking', target(req.url, path), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  let forecast: { rows: unknown[]; wape_by_region: Record<string, number> }
  try {
    const rowsRes = await callService('forecast', '/forecast?limit=2000')
    if (!rowsRes.ok) throw new Error(`예측 조회 실패 (${rowsRes.status})`)
    const rows = (await rowsRes.json())?.rows ?? []

    // 오차는 없어도 된다 — 신뢰도가 `unknown` 으로 떨어질 뿐 판단을 멈출
    // 이유가 아니다. 예측이 없으면 아무것도 할 수 없어 그때만 막는다.
    let wape_by_region: Record<string, number> = {}
    try {
      const segRes = await callService('forecast', '/forecast/segments?by=region')
      if (segRes.ok) {
        const seg = await segRes.json()
        for (const r of seg?.rows ?? []) wape_by_region[r.key] = r.wape
      }
    } catch {
      /* 오차 없이 진행한다 */
    }

    forecast = { rows, wape_by_region }
  } catch (e) {
    return Response.json(
      {
        error: 'service_unavailable',
        service: 'forecast',
        detail: `수요 예측을 읽을 수 없어 기회를 만들지 못했습니다 (${(e as Error).message})`,
      },
      { status: 503 },
    )
  }

  return proxy('booking', target(req.url, path), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...body, forecast }),
  })
}
