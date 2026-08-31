/** 노드(테스트)에서 요청을 가로챈다. 브라우저용은 `browser.ts`.
 *
 * ## 숙소 목록만 작은 픽스처로 되돌린다
 *
 * 데모에서는 목이 실물 시드에서 뽑은 숙소 41건을 준다 — 둘만 있으면 목록이
 * 비어 보이기 때문이다. 그런데 홈·예약 테스트는 **작고 고정된 두 건**을 전제로
 * 쓰여 있다("지역 탭을 누르면 그 지역만 남는다" 같은 검사는 데이터가 늘면
 * 성립하지 않는다).
 *
 * 그 검사들을 41건에 맞춰 다시 쓰는 것은 이번 작업의 범위가 아니고, 데이터가
 * 늘었다고 깨지는 검사는 애초에 데이터에 기댄 검사다. 여기서 **테스트에서만**
 * 목록을 원래대로 돌려 둔다 — 데모 쪽은 그대로 41건이다.
 */
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'

import { PROPERTIES } from './fixtures'
import { handlers } from './handlers'

const testOnly = [
  http.get('/api/v1/properties', ({ request }) => {
    const status = new URL(request.url, 'http://localhost').searchParams.get('status')
    return HttpResponse.json(
      status ? PROPERTIES.filter((p) => p.status === status) : PROPERTIES,
    )
  }),
]

export const server = setupServer(...testOnly, ...handlers)
