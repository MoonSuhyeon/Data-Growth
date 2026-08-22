// @vitest-environment jsdom
/**
 * 객실 선택.
 *
 * 여기 **영화관 좌석표가 그대로 남아 있었다.** 객실을 `floor` × `number` 좌표에
 * 놓는 격자였는데, 숙소의 201호는 좌표가 아니라 이름이다. `Math.max(number)` 가
 * 301 이 되어 격자가 301칸으로 그려졌고, 실제 객실은 1만 픽셀쯤 오른쪽에 있었다.
 *
 * 증상은 셋이었지만 원인은 하나였다 — 화면이 비어 보이고, 가로 스크롤이 생기고,
 * 아무것도 못 골라서 버튼이 안 켜졌다.
 *
 * 그래서 여기서 검사하는 것은 모양이 아니라 **번호가 커도 고를 수 있는가**다.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ROOMS } from '@/mocks/fixtures'
import BookingPage from '../../app/(booking)/booking/page'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => '/booking',
  useSearchParams: () =>
    new URLSearchParams('propertyId=p-1&stayDateId=sd-1'),
}))

afterEach(cleanup)

/** 객실 목록이 그려질 때까지 기다린다. */
async function rooms() {
  render(<BookingPage />)
  expect(await screen.findByRole('button', { name: /201호/ })).toBeInTheDocument()
}

describe('객실 선택', () => {
  it('번호가 201·301 이어도 목록에 그려진다', async () => {
    await rooms()

    for (const r of ROOMS) {
      expect(screen.getByRole('button', { name: new RegExp(`${r.number}호`) })).toBeInTheDocument()
    }
  })

  it('빈 칸을 그리지 않는다', async () => {
    const { container } = render(<BookingPage />)
    await screen.findAllByRole('button', { name: /201호/ })

    // **이 단언이 옛 버그를 잡는 자리다.**
    //
    // "버튼이 문서에 있는가" 로는 못 잡는다 — jsdom 은 레이아웃을 계산하지
    // 않아서, 1만 픽셀 오른쪽으로 밀려나 있어도 `getByRole` 은 찾아낸다.
    // 실제로 되살려서 확인했고, 그 단언은 그대로 통과했다.
    //
    // DOM 에서 관측되는 차이는 **빈 칸의 개수**다. 좌표 격자는 4개 객실을
    // 그리려고 301칸을 만들고 297칸을 빈 `div` 로 채웠다.
    const empties = [...container.querySelectorAll('div')]
      .filter((el) => el.children.length === 0 && !el.textContent?.trim())
    expect(empties.length).toBeLessThan(10)
  })

  it('층으로 묶어서 보여 준다', async () => {
    await rooms()

    expect(screen.getByText('2층')).toBeInTheDocument()
    expect(screen.getByText('3층')).toBeInTheDocument()
  })

  it('고르면 눌린 상태가 된다', async () => {
    const user = userEvent.setup()
    await rooms()

    const room = screen.getByRole('button', { name: /201호/ })
    expect(room).toHaveAttribute('aria-pressed', 'false')

    await user.click(room)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /201호/ })).toHaveAttribute('aria-pressed', 'true'))
  })

  it('다시 누르면 풀린다', async () => {
    const user = userEvent.setup()
    await rooms()

    const room = () => screen.getByRole('button', { name: /201호/ })
    await user.click(room())
    await waitFor(() => expect(room()).toHaveAttribute('aria-pressed', 'true'))

    await user.click(room())
    await waitFor(() => expect(room()).toHaveAttribute('aria-pressed', 'false'))
  })

  it('이미 예약된 객실은 못 고른다', async () => {
    await rooms()

    // 시드에서 203호만 `is_booked` 다
    expect(screen.getByRole('button', { name: /203호/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /201호/ })).not.toBeDisabled()
  })

  it('좌석 어휘가 남아 있지 않다', async () => {
    await rooms()

    // "스크린" 은 극장 화면이고, "석" 은 좌석의 단위다. 숙소에는 둘 다 없다.
    expect(screen.queryByText('스크린')).not.toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/\d+석/)
  })
})
