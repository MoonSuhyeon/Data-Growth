import path from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  // tsconfig 는 `jsx: "preserve"` 다 — Next 가 자기 방식으로 변환하기 때문이다.
  // vitest 는 그 변환기를 안 거치므로 여기서 직접 알려 준다. `automatic` 이면
  // 테스트 파일마다 `import React` 를 쓰지 않아도 된다.
  esbuild: { jsx: 'automatic' },
  resolve: {
    // tsconfig 의 `@/*` → `./src/*` 와 같아야 한다. 어긋나면 타입은 통과하는데
    // 테스트만 모듈을 못 찾는다.
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    // 기본은 node. DOM 이 필요한 파일만 맨 위에 `// @vitest-environment jsdom` 을
    // 붙인다. 전부 jsdom 으로 돌리면 SDK 같은 순수 로직 테스트까지 느려지고,
    // 브라우저 전역이 있어서 **서버에서 안 도는 코드**가 통과해 버린다.
    environment: 'node',
    setupFiles: ['./src/mocks/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'app/**/*.test.{ts,tsx}'],
  },
})
