/** 노드(테스트)에서 요청을 가로챈다. 브라우저용은 `browser.ts`. */
import { setupServer } from 'msw/node'

import { handlers } from './handlers'

export const server = setupServer(...handlers)
