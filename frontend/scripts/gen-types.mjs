/**
 * 세 서비스의 openapi.json 에서 TypeScript 타입을 만든다.
 *
 * 각 서비스 저장소가 스키마를 커밋해 두고 CI 가 드리프트를 막는다. 여기서는
 * 그 스키마를 타입으로 바꿔서, 서비스가 응답 모양을 바꾸면 **콘솔 빌드가 깨지게** 한다.
 * 조용히 잘못된 값을 렌더하는 것보다 낫다.
 *
 * openapi-typescript 는 peer 로 TS 5 를 요구해 프로젝트(TS 6)와 충돌한다.
 * 빌드에 필요한 도구가 아니므로 의존성에 넣지 않고 npx 로 격리해 돌린다.
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const SERVICES = {
  forecast: '../../ML-Product/openapi.json',
  content: '../../re-bootcamp_quest2/openapi.json',
  support: '../../bank-transfer-demo/openapi.json',
}

mkdirSync('src/types/services', { recursive: true })

for (const [name, rel] of Object.entries(SERVICES)) {
  // 한글이 든 절대 경로를 넘기면 도구가 URL 인코딩해 버려 파일을 못 찾는다.
  // 상대 경로 그대로 넘긴다.
  if (!existsSync(path.resolve(rel))) {
    console.log(`  건너뜀 ${name} — ${rel} 없음 (저장소를 나란히 두면 생성됩니다)`)
    continue
  }
  const out = `src/types/services/${name}.ts`
  execSync(`npx -y openapi-typescript@7 ${rel} -o ${out}`, { stdio: 'inherit' })
  console.log(`  생성 ${out}`)
}
