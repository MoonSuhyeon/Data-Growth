import { create } from 'zustand'
import type { User } from '../types'
import client from '../api/client'

/**
 * 브라우저에서만 localStorage 를 만진다.
 *
 * 서버 렌더링 중에는 그 객체가 없다. 모듈이 로드되는 시점에 읽으면 빌드가 깨지고,
 * 그건 화면 문제가 아니라 **어디서 실행되는지를 안 따진** 문제다.
 */
const browser = () => typeof window !== 'undefined'
const readToken = () => (browser() ? window.localStorage.getItem('token') : null)
const writeToken = (t: string) => { if (browser()) window.localStorage.setItem('token', t) }
const dropToken = () => { if (browser()) window.localStorage.removeItem('token') }

interface AuthState {
  user: User | null
  token: string | null
  isInitializing: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  /*
   * **초기값은 서버와 브라우저가 같아야 한다.**
   *
   * 여기 `token: readToken()`, `isInitializing: !!readToken()` 이라고 적혀
   * 있었다. 서버에는 `window` 가 없어 둘 다 null/false 가 되고, 토큰을 가진
   * 브라우저에서는 값/true 가 된다. 그래서 서버는 화면을 그리고 브라우저는
   * 스피너를 그렸고, React 가 그 둘을 맞추지 못해 하이드레이션이 깨졌다.
   *
   * 스토어가 모듈을 불러오는 시점에 `localStorage` 를 읽는 것 자체가 원인이다.
   * 그 시점은 서버와 브라우저가 다르다. **읽기는 `initializeAuth` 로 미룬다** —
   * 그건 effect 안에서 도니까 브라우저에서만 돌고, 첫 렌더 뒤다.
   */
  token: null,
  // 복원이 끝나기 전에는 화면을 잡아 둔다. 서버도 같은 값이라 어긋나지 않는다.
  isInitializing: true,
  setAuth: (user, token) => {
    writeToken(token)
    set({ user, token })
  },
  clearAuth: () => {
    dropToken()
    set({ user: null, token: null, isInitializing: false })
  },
  initializeAuth: async () => {
    // 서버에서는 아무것도 하지 않는다.
    if (!browser()) return
    // 저장된 토큰을 **여기서** 읽는다. 스토어 생성 시점이 아니라.
    const token = get().token ?? readToken()
    if (!token) {
      set({ isInitializing: false })
      return
    }
    set({ token })
    try {
      const res = await client.get<User>('/auth/me')
      set({ user: res.data, isInitializing: false })
    } catch {
      // 401은 axios 인터셉터가 토큰 정리 + /login 리다이렉트 처리
      dropToken()
      set({ user: null, token: null, isInitializing: false })
    }
  },
}))
