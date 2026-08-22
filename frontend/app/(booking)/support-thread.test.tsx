// @vitest-environment jsdom
/**
 * 고객 상담 한 가닥.
 *
 *     내 예약 → 취소 문의 → 정책·환불액 확인 → 승인 → 콘솔 대기 목록에서 사라짐
 *
 * 이 저장소에서 상담 에이전트를 부르는 곳은 오랫동안 운영 콘솔뿐이었다. 직원이
 * 고객 문장을 직접 타이핑하는 화면이라, 이름은 "상담 승인" 인데 **승인할 대기 건
 * 자체가 생기지 않았다.** 여기서 보는 것은 그 대기 건이 생기고 없어지는가다.
 *
 * 부품이 아니라 **부품 사이**를 본다 — 예약번호가 화면에서 세션으로, 세션이
 * 콘솔 목록으로 넘어가는 자리.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { resetSessions } from '@/mocks/handlers'
import { useAuthStore } from '@/store/authStore'
import { USER } from '@/mocks/fixtures'

import SupportPage from './support/page'
import ConsoleSupport from '../(console)/admin/support/page'

const push = vi.fn()
const replace = vi.fn()
let searchParams = new URLSearchParams('booking=BK2608190016')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace, back: vi.fn(), refresh: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => '/support',
  useSearchParams: () => searchParams,
}))

beforeEach(() => {
  push.mockClear(); replace.mockClear()
  resetSessions()
  searchParams = new URLSearchParams('booking=BK2608190016')
  useAuthStore.setState({ user: USER, token: 'tok', isInitializing: false })
})

afterEach(cleanup)

describe('고객 상담 화면', () => {
  it('예약번호를 묻지 않고 바로 문의를 연다', async () => {
    render(<SupportPage />)

    // 고객이 아무것도 입력하지 않아도 에이전트가 답한다 — 무엇을 물어볼지는
    // 화면이 안다.
    expect(await screen.findByText(/환불 금액을 확인해 주세요/)).toBeInTheDocument()
    expect(screen.getByText(/BK2608190016/)).toBeInTheDocument()
  })

  it('환불 예상액을 확인하고 나서 고를 수 있다', async () => {
    render(<SupportPage />)
    await screen.findByText(/환불 금액을 확인해 주세요/)

    // **확인 버튼은 에이전트가 멈춰 섰을 때만 뜬다.**
    expect(screen.getByRole('button', { name: '취소 진행하기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '그만두기' })).toBeInTheDocument()
  })

  it('그만두면 예약이 그대로라고 말한다', async () => {
    const user = userEvent.setup()
    render(<SupportPage />)
    await screen.findByText(/환불 금액을 확인해 주세요/)

    await user.click(screen.getByRole('button', { name: '그만두기' }))

    expect(await screen.findByText(/예약은 그대로입니다/)).toBeInTheDocument()
  })

  it('예약을 모르면 아무것도 부르지 않고 길을 알려준다', async () => {
    searchParams = new URLSearchParams()
    render(<SupportPage />)

    expect(await screen.findByText(/어느 예약에 대한 문의인지 알 수 없습니다/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '내 예약에서 시작하기' }))
      .toHaveAttribute('href', '/my/bookings')
  })

  it('로그인하지 않았으면 로그인으로 보낸다', async () => {
    useAuthStore.setState({ user: null, token: null, isInitializing: false })
    render(<SupportPage />)

    await waitFor(() => expect(replace).toHaveBeenCalled())
    expect(String(replace.mock.calls[0][0])).toContain('/login')
  })
})

describe('콘솔 대기 목록', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: { ...USER, role: 'ADMIN' }, token: 'tok', isInitializing: false })
  })

  it('고객이 연 문의가 없으면 없다고 말한다', async () => {
    render(<ConsoleSupport />)

    expect(await screen.findByText(/지금 기다리는 문의가 없습니다/)).toBeInTheDocument()
  })

  it('고객이 문의를 열면 콘솔에 뜬다', async () => {
    // 고객 화면에서 연다
    render(<SupportPage />)
    await screen.findByText(/환불 금액을 확인해 주세요/)
    cleanup()

    // 직원이 콘솔을 연다
    render(<ConsoleSupport />)

    // **이 단언이 두 화면을 잇는 자리다.**
    expect(await screen.findByText('BK2608190016')).toBeInTheDocument()
    expect(screen.getByText('1건')).toBeInTheDocument()
  })

  it('승인된 문의는 대기 목록에서 빠진다', async () => {
    const user = userEvent.setup()
    render(<SupportPage />)
    await screen.findByText(/환불 금액을 확인해 주세요/)
    await user.click(screen.getByRole('button', { name: '취소 진행하기' }))
    await screen.findByText(/취소 요청을 접수했습니다/)
    cleanup()

    render(<ConsoleSupport />)

    // 처리한 건이 목록에 남으면 직원은 목록을 안 믿게 된다.
    expect(await screen.findByText(/지금 기다리는 문의가 없습니다/)).toBeInTheDocument()
  })
})
