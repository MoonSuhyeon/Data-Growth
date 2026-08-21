// @vitest-environment jsdom
/**
 * 홈 화면 — 새로 생긴 **조작**을 고정한다.
 *
 * 레이아웃을 테스트하지 않는다. 여백이나 글자 크기는 눈으로 보는 것이고, 여기서
 * 볼 것은 **누를 수 있게 생긴 것이 실제로 무슨 일을 하는가**다. 이 저장소에서
 * 방금 걷어낸 버그가 정확히 그 종류였다 — 눌리는데 아무 일도 안 하는 버튼.
 */
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { resetWishlist } from '@/mocks/handlers'
import { useAuthStore } from '@/store/authStore'
import { USER } from '@/mocks/fixtures'

import Home from './page'

const push = vi.fn()
let searchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => searchParams,
}))

beforeEach(() => {
  push.mockClear()
  searchParams = new URLSearchParams()
  resetWishlist()
  useAuthStore.setState({ user: null, token: null, isInitializing: false })
})

afterEach(cleanup)

/** 목록이 도착할 때까지 기다린다. 스켈레톤 상태에서 단언하면 늘 실패한다. */
async function loaded() {
  render(<Home />)
  expect(await screen.findByText('해운대 오션뷰 아파트')).toBeInTheDocument()
}

describe('홈 — 카테고리 탭', () => {
  it('지역 탭을 누르면 그 지역만 남는다', async () => {
    const user = userEvent.setup()
    await loaded()
    expect(screen.getByText('강릉 소나무 펜션')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /강원/ }))

    expect(screen.getByText('강릉 소나무 펜션')).toBeInTheDocument()
    expect(screen.queryByText('해운대 오션뷰 아파트')).not.toBeInTheDocument()
  })

  it('같은 탭을 다시 누르면 해제된다', async () => {
    const user = userEvent.setup()
    await loaded()
    const tab = screen.getByRole('button', { name: /강원/ })

    await user.click(tab)
    expect(screen.queryByText('해운대 오션뷰 아파트')).not.toBeInTheDocument()

    await user.click(tab)
    expect(screen.getByText('해운대 오션뷰 아파트')).toBeInTheDocument()
  })

  it('선택된 탭만 눌린 상태로 표시된다', async () => {
    const user = userEvent.setup()
    await loaded()
    await user.click(screen.getByRole('button', { name: /펜션/ }))

    expect(screen.getByRole('button', { name: /펜션/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /전체/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('탭은 데이터에 있는 지역만 만든다', async () => {
    await loaded()
    // 시드에 없는 지역이 탭으로 있으면 눌러도 빈 화면이 나온다
    expect(screen.queryByRole('button', { name: /제주/ })).not.toBeInTheDocument()
  })
})

describe('홈 — 검색', () => {
  it('여행지 입력이 목록을 거른다', async () => {
    const user = userEvent.setup()
    await loaded()

    await user.type(screen.getByLabelText('여행지 검색'), '강릉')

    expect(screen.getByText('강릉 소나무 펜션')).toBeInTheDocument()
    expect(screen.queryByText('해운대 오션뷰 아파트')).not.toBeInTheDocument()
  })

  it('조건에 맞는 게 없으면 "없다" 와 "못 불러왔다" 를 구분해 말한다', async () => {
    const user = userEvent.setup()
    await loaded()

    await user.type(screen.getByLabelText('여행지 검색'), '없는지역이름')

    expect(screen.getByText('조건에 맞는 숙소가 없습니다.')).toBeInTheDocument()
    expect(screen.queryByText(/불러오지 못했습니다/)).not.toBeInTheDocument()
  })
})

describe('홈 — 저장 하트', () => {
  it('로그인하지 않았으면 로그인으로 보낸다', async () => {
    const user = userEvent.setup()
    await loaded()

    await user.click(screen.getAllByRole('button', { name: '저장' })[0])

    expect(push).toHaveBeenCalledWith('/login')
  })

  it('로그인했으면 실제로 저장되고 상태가 바뀐다', async () => {
    useAuthStore.setState({ user: USER, token: 't' })
    const user = userEvent.setup()
    await loaded()

    await user.click(screen.getAllByRole('button', { name: '저장' })[0])

    // 화면이 먼저 바뀌고(낙관적), 서버에도 남는다
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: '저장 취소' }).length).toBe(1))
  })

  it('저장한 것은 다시 들어와도 채워져 있다', async () => {
    useAuthStore.setState({ user: USER, token: 't' })
    const user = userEvent.setup()
    await loaded()
    await user.click(screen.getAllByRole('button', { name: '저장' })[0])
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: '저장 취소' }).length).toBe(1))

    // 새로 들어온다 — 목이 상태를 들고 있으므로 서버에 남았는지가 여기서 갈린다
    cleanup()
    await loaded()
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: '저장 취소' }).length).toBe(1))
  })

  it('하트 클릭이 카드 링크로 새어 나가지 않는다', async () => {
    useAuthStore.setState({ user: USER, token: 't' })
    const user = userEvent.setup()
    await loaded()

    const card = screen.getByText('해운대 오션뷰 아파트').closest('a')!

    // 여기까지 오는 데 두 번 틀렸다. 남겨 둔다.
    //
    // 1. `push` 가 안 불렸는지로는 확인할 수 없다 — jsdom 에서 `Link` 이동은
    //    목킹된 라우터를 거치지 않아서, 가드를 지워도 그 단언은 통과한다.
    //    **절대 실패하지 않는 테스트는 없느니만 못하다.**
    // 2. 앵커에 리스너를 달아도 안 된다 — React 는 핸들러를 루트에 위임하므로
    //    앵커의 네이티브 리스너가 **먼저** 돌고, 그 시점엔 아직 안 막혀 있다.
    //
    // 그래서 **클릭이 카드 밖으로 나가는지**를 본다. `stopPropagation` 이
    // 걸려 있으면 이벤트는 문서까지 올라오지 못한다.
    let escaped = false
    const spy = () => { escaped = true }
    document.addEventListener('click', spy)
    await user.click(within(card).getByRole('button', { name: '저장' }))
    document.removeEventListener('click', spy)

    expect(escaped).toBe(false)
  })
})

describe('홈 — 아직 열지 않은 카테고리', () => {
  it('체험 탭은 빈 목록이 아니라 "준비 중" 을 말한다', async () => {
    searchParams = new URLSearchParams('tab=experiences')
    render(<Home />)

    expect(await screen.findByText(/체험은 아직 준비 중입니다/)).toBeInTheDocument()
    // 빈 그리드로 두면 "숙소가 하나도 없다" 로 읽힌다
    expect(screen.queryByText('아직 등록된 숙소가 없습니다.')).not.toBeInTheDocument()
  })

  it('준비 중 화면에서 숙소로 돌아갈 길을 준다', async () => {
    searchParams = new URLSearchParams('tab=services')
    render(<Home />)

    expect(await screen.findByRole('link', { name: '숙소 보러 가기' })).toHaveAttribute('href', '/')
  })
})
