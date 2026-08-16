// @vitest-environment jsdom
/**
 * C3 — 한 가닥 끝단 검증.
 *
 * 화면을 전부 테스트하지 않는다. **퍼널 한 가닥**만 실제로 렌더해서 지나간다.
 *
 *     목록 → 지역 선택 → 숙소 선택 → 상세 → 예약하기
 *
 * 단위 테스트가 이미 각 부품을 덮고 있으므로, 여기서 볼 것은 부품이 아니라
 * **부품 사이**다. 구체적으로 세 가지다.
 *
 *   1. 화면이 **실제로 어떤 요청을 보내는가** — MSW 가 네트워크 경계에서 받는다.
 *      함수를 모킹했다면 경로·쿼리·인터셉터가 전부 검증에서 빠졌을 것이다.
 *   2. 그 과정에서 **무엇이 계측되는가** — 화면은 이벤트를 그리지 않으므로,
 *      수집 엔드포인트에 도착한 것으로만 확인할 수 있다.
 *   3. 실험 배정이 **화면과 계측 양쪽에** 제대로 반영되는가.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { clearAssignmentCache } from '@/lib/experiments'
import { collected } from '@/mocks/handlers'
import { server } from '@/mocks/server'
import { tracker } from '@/lib/tracking'

import PropertyDetail from './properties/[id]/page'
import PropertyList from './properties/page'

// ── next/navigation 은 App Router 런타임이 넣어 준다. 테스트에는 그게 없다.
const push = vi.fn()
let params: Record<string, string> = { id: 'p-1' }

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
  useParams: () => params,
  usePathname: () => '/properties',
  useSearchParams: () => new URLSearchParams(),
}))

/** 배정을 원하는 값으로 바꾼다. 기본 핸들러는 `afterEach` 가 되돌린다. */
function assignVariant(variant: string | null, status = 'assigned') {
  server.use(
    http.get('/api/v1/experiments/assignments', () =>
      HttpResponse.json({
        unit_id: 'u',
        platform: 'WEB',
        app_version: null,
        assignments: [{ experiment_id: 'exp_sticky_cta', status, variant, reason: null }],
      }),
    ),
  )
}

/**
 * 상세 화면이 떴는지 확인한다.
 *
 * `findByText(이름)` 은 못 쓴다 — 실험군에서는 제목과 sticky 바 **양쪽에** 같은
 * 이름이 나와서 "여러 개 찾았다"로 실패한다. 제목만 집으려면 role 로 찍는다.
 * 이런 게 접근성 있는 마크업이 테스트를 쉽게 만드는 자리다.
 */
function detailHeading(name: string) {
  return screen.findByRole('heading', { name })
}

/** 큐를 비우고, 수집기에 도착한 이벤트 이름을 순서대로 돌려준다. */
async function flushAndRead(): Promise<string[]> {
  await tracker().flush()
  return collected.map((e) => String(e.event_name))
}

beforeEach(() => {
  push.mockClear()
  params = { id: 'p-1' }
  window.localStorage.clear()
  // 배정 캐시는 모듈 수준이라 테스트 사이에 넘어간다. 안 지우면 앞 테스트의
  // 배정으로 뒤 테스트가 돌고, 실패가 순서에 따라 달라진다.
  clearAssignmentCache()
  // 앞 테스트가 남긴 큐를 비운다. 저장소가 정본이라 모듈 리셋으로는 안 지워진다.
  tracker().setExperimentVariant(null)
})

afterEach(cleanup)

// ─────────────────────────────── 한 가닥
describe('예약 퍼널 한 가닥', () => {
  it('목록에서 지역을 고르고 숙소로 들어가 예약을 시작한다', async () => {
    const user = userEvent.setup()

    // ── 1. 목록
    render(<PropertyList />)
    // 로딩이 아니라 데이터가 그려질 때까지 기다린다 — 요청이 실제로 나갔다는 뜻이다.
    // 첫 지역은 화면이 정한다(숙소가 있는 첫 지역), 그래서 강원이 열려 있다.
    expect(await screen.findByText('강릉 소나무 펜션')).toBeInTheDocument()

    // ── 2. 지역 바꾸기 = 검색
    await user.click(screen.getByRole('button', { name: /부산\/울산/ }))
    expect(await screen.findByText('해운대 오션뷰 아파트')).toBeInTheDocument()

    // ── 3. 숙소 선택 — 라우터가 상세로 보낸다
    await user.click(screen.getByRole('button', { name: '해운대 오션뷰 아파트' }))
    expect(push).toHaveBeenCalledWith('/properties/p-1')

    cleanup()

    // ── 4. 상세
    render(<PropertyDetail />)
    expect(await detailHeading('해운대 오션뷰 아파트')).toBeInTheDocument()
    // 리뷰도 같은 화면에서 온다 — 두 요청이 다 나갔다는 확인
    expect(screen.getByText('바다가 정말 잘 보입니다.')).toBeInTheDocument()

    // ── 5. 예약 시작
    await user.click(screen.getByRole('button', { name: '예약하기' }))
    expect(push).toHaveBeenCalledWith('/booking?propertyId=p-1')

    // ── 6. 이 가닥에서 계측된 것
    const names = await flushAndRead()
    expect(names).toEqual(['search_performed', 'property_viewed', 'booking_started'])
  })

  it('없는 숙소는 빈 화면이 아니라 못 찾았다고 말한다', async () => {
    // 404 를 200 + null 로 답하면 화면이 "빈 숙소"를 그린다. 그 차이를 고정한다.
    params = { id: 'p-없음' }
    render(<PropertyDetail />)
    expect(await screen.findByText(/숙소를 찾을 수 없습니다/)).toBeInTheDocument()
  })
})

// ─────────────────────────────── 실험이 화면과 계측 양쪽에 걸리는가
describe('sticky CTA 실험', () => {
  it('실험군에만 하단 고정 CTA 가 그려진다', async () => {
    assignVariant('treatment')
    render(<PropertyDetail />)
    await detailHeading('해운대 오션뷰 아파트')

    // 본문 CTA 와 고정 바 CTA, 둘이 된다
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: '예약하기' })).toHaveLength(2)
    })
  })

  it('대조군에는 본문 CTA 하나뿐이다', async () => {
    assignVariant('control')
    render(<PropertyDetail />)
    await detailHeading('해운대 오션뷰 아파트')

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: '예약하기' })).toHaveLength(1)
    })
  })

  it('노출 이벤트에 배정된 군이 실려 나간다', async () => {
    assignVariant('treatment')
    render(<PropertyDetail />)
    await detailHeading('해운대 오션뷰 아파트')

    await waitFor(async () => {
      await tracker().flush()
      const viewed = collected.find((e) => e.event_name === 'property_viewed')
      expect(viewed).toBeDefined()
      expect((viewed as { properties?: { variant?: string } }).properties?.variant).toBe('treatment')
    })
  })

  it('배정에 못 닿으면 대조군 화면을 그리되 대조군으로 세지 않는다', async () => {
    // 이 프로젝트에서 가장 되돌리기 쉬운 편향이다. 못 닿은 사람을 control 로
    // 채우면 대조군이 "네트워크 나쁜 사람"으로 오염되고, 실험이 이긴 것처럼 보인다.
    server.use(
      http.get('/api/v1/experiments/assignments', () => HttpResponse.error()),
    )
    render(<PropertyDetail />)
    await detailHeading('해운대 오션뷰 아파트')

    // 화면: 대조군과 같다 (고정 바 없음)
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: '예약하기' })).toHaveLength(1)
    })

    // 계측: 어느 군도 아니다
    await waitFor(async () => {
      await tracker().flush()
      const viewed = collected.find((e) => e.event_name === 'property_viewed')
      expect(viewed).toBeDefined()
      expect((viewed as { properties?: { variant?: string } }).properties?.variant).toBeUndefined()
    })
  })

  it('두 번째 숙소로 넘어가도 변형이 계속 실린다', async () => {
    /**
     * 이 가닥이 실제로 잡아낸 버그의 회귀 테스트다.
     *
     * 배정 캐시가 있으면 훅이 곧장 return 하면서 `setExperimentVariant` 를 건너뛰고
     * 있었다. 결과는 **화면은 실험군인데 이벤트에는 변형이 없는** 상태 — 첫 숙소만
     * 정상이고 두 번째부터 노출이 어느 군도 아닌 채로 기록된다.
     *
     * 화면이 멀쩡해서 눈으로는 안 잡히고, 단위 테스트는 훅과 트래커를 따로 보니
     * 그 사이를 못 본다. **부품 사이를 지나가야** 나오는 종류다.
     */
    assignVariant('treatment')

    render(<PropertyDetail />)
    await detailHeading('해운대 오션뷰 아파트')
    cleanup()

    // 두 번째 숙소 — 이번엔 캐시에서 답이 나온다
    params = { id: 'p-2' }
    render(<PropertyDetail />)
    await detailHeading('강릉 소나무 펜션')

    await waitFor(async () => {
      await tracker().flush()
      const second = collected
        .filter((e) => e.event_name === 'property_viewed')
        .find((e) => e.property_id === 'p-2')
      expect(second).toBeDefined()
      expect((second as { properties?: { variant?: string } }).properties?.variant).toBe('treatment')
    })
  })

  it('참여 불가한 사용자도 control 로 세지 않는다', async () => {
    assignVariant(null, 'not_eligible')
    render(<PropertyDetail />)
    await detailHeading('해운대 오션뷰 아파트')

    await waitFor(async () => {
      await tracker().flush()
      const viewed = collected.find((e) => e.event_name === 'property_viewed')
      expect(viewed).toBeDefined()
      expect((viewed as { properties?: { variant?: string } }).properties?.variant).toBeUndefined()
    })
  })
})
