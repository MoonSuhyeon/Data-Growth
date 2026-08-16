/**
 * 모든 테스트 앞뒤로 도는 준비/정리.
 *
 * `onUnhandledRequest: 'error'` 가 이 파일의 핵심이다. 핸들러가 없는 요청이
 * **조용히 실패하는 대신 테스트를 깨뜨린다.** 이걸 켜지 않으면 화면이 엉뚱한
 * 경로를 부르고 있어도(오타, 바뀐 API) 테스트는 "로딩 중"만 보고 통과하거나,
 * 무슨 이유인지 모르는 채로 실패한다.
 */
import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { resetCollected } from './handlers'
import { server } from './server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  // 테스트가 `server.use()` 로 덮어쓴 핸들러를 되돌린다. 안 하면 앞 테스트의
  // 설정이 뒤 테스트로 새고, 실패가 순서에 따라 달라진다.
  server.resetHandlers()
  resetCollected()
})

afterAll(() => server.close())
