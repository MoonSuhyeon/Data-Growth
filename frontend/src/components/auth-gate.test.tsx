// @vitest-environment jsdom
/**
 * 토큰 복원 게이트.
 *
 * 하이드레이션이 깨져서 고친 자리라 두 가지를 같이 본다.
 *
 * 1. **서버와 브라우저의 첫 렌더가 같은가.** 스토어가 모듈 로드 시점에
 *    `localStorage` 를 읽고 있었다. 서버에는 `window` 가 없어 값이 달랐고,
 *    그래서 서버는 화면을 브라우저는 스피너를 그렸다.
 * 2. **게이트가 열리는가.** 초기값을 `isInitializing: true` 로 통일했으니,
 *    토큰이 없을 때 이 값이 안 내려가면 **모든 화면이 스피너에서 멈춘다.**
 *    고치다가 만들기 딱 좋은 사고라 여기서 막는다.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import AuthGate from '@/components/AuthGate'
import { useAuthStore } from '@/store/authStore'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

// Navbar 는 이 테스트의 관심사가 아니고, 알림 조회까지 끌고 온다.
vi.mock('@/components/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }))

beforeEach(() => {
  window.localStorage.clear()
  useAuthStore.setState({ user: null, token: null, isInitializing: true })
})

afterEach(cleanup)

describe('AuthGate', () => {
  it('초기값은 서버와 브라우저가 같다', () => {
    // 스토어를 새로 읽어도 `localStorage` 를 보지 않아야 한다. 보면 서버에서
    // 만든 HTML 과 브라우저의 첫 렌더가 갈린다.
    window.localStorage.setItem('token', 'saved-token')

    const fresh = useAuthStore.getInitialState()
    expect(fresh.token).toBeNull()
    expect(fresh.isInitializing).toBe(true)
  })

  it('토큰이 없으면 게이트가 열린다', async () => {
    render(<AuthGate><p>본문</p></AuthGate>)

    // 여기서 안 열리면 **모든 화면이 스피너에서 멈춘다.**
    expect(await screen.findByText('본문')).toBeInTheDocument()
    await waitFor(() => expect(useAuthStore.getState().isInitializing).toBe(false))
  })

  it('토큰이 있으면 복원이 끝난 뒤에 연다', async () => {
    window.localStorage.setItem('token', 'saved-token')

    render(<AuthGate><p>본문</p></AuthGate>)

    // 복원이 끝나면 본문이 나온다. 목이 `/auth/me` 에 사용자를 준다.
    expect(await screen.findByText('본문')).toBeInTheDocument()
    await waitFor(() => expect(useAuthStore.getState().user).not.toBeNull())
  })

  it('복원 중에는 본문 대신 스피너를 그린다', () => {
    // 복원을 멈춰 세운다. 그냥 렌더하면 `render` 가 effect 를 바로 흘려서
    // 복원이 끝나 버리고, 중간 프레임을 볼 수 없다.
    useAuthStore.setState({ isInitializing: true, initializeAuth: async () => {} })

    const { container } = render(<AuthGate><p>본문</p></AuthGate>)

    // 이 화면이 서버와 브라우저 양쪽의 첫 렌더다. 둘이 같아야 한다.
    expect(screen.queryByText('본문')).not.toBeInTheDocument()
    expect(container.querySelector('.animate-spin')).not.toBeNull()
  })
})
