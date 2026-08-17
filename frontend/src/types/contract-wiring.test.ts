/**
 * 계약 타입이 **실제로 연결되어 있는지** 지킨다.
 *
 * 이 검사가 있는 이유가 있다. `gen-types.mjs` 는 세 서비스의 스키마에서 타입을
 * 만들어 두는데, 한동안 그 타입을 **아무 화면도 쓰지 않았다.** 콘솔 페이지가
 * 응답 모양을 인라인으로 다시 적고 있었기 때문이다.
 *
 * 그 상태에서 ML-Product 가 `SegmentRow.region` 을 `key` 로 바꿨는데 빌드는 그냥
 * 통과했다. 화면은 `undefined` 를 렌더할 참이었다. README 는 "서비스가 응답 모양을
 * 바꾸면 콘솔 빌드가 깨진다"고 적혀 있었지만, 장치가 연결이 안 돼 있었다.
 *
 * **타입은 스스로를 지키지 못한다.** 누군가 편의상 인라인 타입을 다시 쓰면 방어는
 * 조용히 원상복귀되고, 그때는 아무 빌드도 안 깨진다. 그래서 연결 자체를 테스트한다.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const ROOT = path.resolve(__dirname, '../..')

/** 서비스를 부르는 콘솔 화면 → 그 화면이 따라야 할 생성 타입 */
const WIRING: Record<string, string> = {
  'app/(console)/admin/forecast/page.tsx': '@/types/services/forecast',
  'app/(console)/admin/content/page.tsx': '@/types/services/content',
  'app/(console)/admin/support/page.tsx': '@/types/services/support',
}

const read = (rel: string) => readFileSync(path.join(ROOT, rel), 'utf-8')

describe('계약 타입 연결', () => {
  it.each(Object.entries(WIRING))(
    '%s 는 생성된 타입을 import 한다',
    (page, mod) => {
      expect(read(page)).toContain(`from '${mod}'`)
    },
  )

  it.each(Object.keys(WIRING))(
    '%s 는 응답 모양을 손으로 다시 적지 않는다',
    (page) => {
      const src = read(page)
      // 서비스 응답을 가리키는 이름을 로컬에서 다시 정의하면 계약이 갈라진다.
      // (`Decision`·`Session` 처럼 계약에 스키마가 없는 것은 예외 — 그건 파일에
      //  왜 손으로 적었는지가 주석으로 적혀 있다.)
      const handRolled = src.match(/^type (\w*(?:Res|Response|Row|Out))\s*=\s*\{/gm) ?? []
      expect(handRolled).toEqual([])
    },
  )

  it('support 세션 응답도 계약에서 온다', () => {
    // 이 응답만 오래도록 스키마가 없어서(`dict`) 손으로 적혀 있었다.
    // 서비스가 SessionOut 을 주기 시작했으므로 손으로 적을 이유가 사라졌다.
    const src = read('app/(console)/admin/support/page.tsx')
    expect(src).toMatch(/type Session = Schemas\['SessionOut'\]/)
  })

  it('생성된 타입 파일이 비어 있지 않다', () => {
    // 저장소를 나란히 안 두면 gen-types 가 건너뛴다. 그때 빈 파일이 남으면
    // 위 검사는 통과하는데 타입은 아무것도 안 지킨다.
    for (const mod of new Set(Object.values(WIRING))) {
      const rel = mod.replace('@/', 'src/') + '.ts'
      const src = read(rel)
      expect(src).toContain('schemas')
      expect(src.length).toBeGreaterThan(500)
    }
  })
})

describe('열거형은 계약에서 온다', () => {
  it('콘텐츠 세그먼트·포맷 목록이 문자열 배열로 방치되어 있지 않다', () => {
    // 값이 그냥 string[] 이면 서비스가 값을 바꿔도 아무 데서도 안 걸린다.
    const src = read('app/(console)/admin/content/page.tsx')
    expect(src).toMatch(/const SEGMENTS:\s*Schemas\['Segment'\]\[\]/)
    expect(src).toMatch(/const FORMATS:\s*Schemas\['ContentFormat'\]\[\]/)
  })
})
