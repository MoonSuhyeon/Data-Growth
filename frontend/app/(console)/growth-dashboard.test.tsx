// @vitest-environment jsdom
/**
 * E3 — 콘솔이 **정적 리포트가 아니라 질의**를 쓴다.
 *
 * 예전에는 `reports/growth.json` 한 장을 읽었다. 축 선택이 동작한 것도 모든 축을
 * 미리 계산해 넣어 뒀기 때문이고, 기간은 조합이 무한해서 같은 수를 쓸 수 없었다.
 *
 * 여기서 보는 건 화면이 예쁘게 그려지는지가 아니라 **기간을 바꾸면 실제로 다른
 * 질의가 나가는지** 다. 안 나가면 버튼은 장식이다.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { server } from '@/mocks/server'
import { useAuthStore } from '@/store/authStore'

import GrowthPage from './admin/growth/page'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/admin/growth',
  useSearchParams: () => new URLSearchParams(),
}))

/** 실제로 나간 요청을 본다. 응답만 보면 파라미터가 무시돼도 알 수 없다. */
const seen: string[] = []

beforeEach(() => {
  seen.length = 0
  server.events.on('request:start', ({ request }) => seen.push(request.url))
  // AdminLayout 은 ADMIN 이 아니면 **아무것도 그리지 않는다.** 로그인 없이
  // 렌더하면 빈 화면이 나오고, 그걸 "데이터가 안 왔다" 로 오해하기 쉽다.
  useAuthStore.setState({
    user: { id: 'u-admin', email: 'admin@stay.example', name: '관리자', role: 'ADMIN' } as never,
    token: 't', isInitializing: false,
  })
})
afterEach(() => {
  server.events.removeAllListeners()
  cleanup()
})

const analytics = () => seen.filter((u) => u.includes('/analytics/'))

describe('그로스 대시보드', () => {
  it('정적 리포트와 기간 질의를 **둘 다** 부른다', async () => {
    render(<GrowthPage />)
    await screen.findByText(/그로스 대시보드/)

    await waitFor(() => {
      expect(seen.some((u) => u.includes('/api/growth'))).toBe(true)
      expect(seen.some((u) => u.includes('/analytics/overview'))).toBe(true)
      expect(seen.some((u) => u.includes('/analytics/segments'))).toBe(true)
    })
  })

  it('기간을 바꾸면 from·to 를 실은 질의가 새로 나간다', async () => {
    const user = userEvent.setup()
    render(<GrowthPage />)
    await screen.findByText(/그로스 대시보드/)
    await waitFor(() => expect(analytics().length).toBeGreaterThan(0))

    const before = analytics().length
    await user.click(screen.getByRole('button', { name: '7일' }))

    await waitFor(() => {
      const after = analytics()
      expect(after.length).toBeGreaterThan(before)
      // 버튼이 상태만 바꾸고 질의를 안 바꾸면 여기서 걸린다
      expect(after.some((u) => u.includes('from=') && u.includes('to='))).toBe(true)
    })
  })

  it('축을 바꾸면 그 축으로 다시 묻는다', async () => {
    const user = userEvent.setup()
    render(<GrowthPage />)
    await screen.findByText(/그로스 대시보드/)
    await waitFor(() => expect(analytics().length).toBeGreaterThan(0))

    await user.click(screen.getByRole('button', { name: '지역' }))
    await waitFor(() => {
      expect(analytics().some((u) => u.includes('by=region'))).toBe(true)
    })
  })

  it('무엇을 보고 있는지 창을 적는다', async () => {
    // 요청한 기간과 데이터가 있는 기간은 다를 수 있다. 안 적으면 빈 구간을
    // "0 이 나왔다" 로 읽는다.
    render(<GrowthPage />)
    expect(await screen.findByText(/이벤트 .*건/)).toBeInTheDocument()
  })

  it('목표는 미달과 이탈을 나눠 보여 준다', async () => {
    render(<GrowthPage />)
    expect(await screen.findByText(/목표 대조/)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('미달')).toBeInTheDocument()
      expect(screen.getByText('미측정')).toBeInTheDocument()
    })
  })
})
