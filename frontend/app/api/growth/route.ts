/**
 * 그로스 대시보드가 읽는 값.
 *
 * 콘솔이 파이프라인을 다시 돌리지 않는다. `scripts/run_analytics.py` 가 재어
 * `reports/growth.json` 에 써 둔 것을 그대로 준다 — ML-Product 의 /metrics 와 같은 방식이다.
 * 방금 잰 것처럼 보이면 안 되므로 응답에 measured_by 가 들어 있다.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
  const file = path.join(process.cwd(), '..', 'reports', 'growth.json')
  try {
    return new Response(await readFile(file, 'utf-8'), {
      headers: { 'content-type': 'application/json' },
    })
  } catch {
    return Response.json(
      {
        error: 'service_unavailable',
        service: 'growth',
        detail: '측정 결과가 없습니다. python scripts/run_analytics.py 를 먼저 실행하세요.',
      },
      { status: 503 },
    )
  }
}
