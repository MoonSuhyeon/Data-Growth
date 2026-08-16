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
  // 서버에서는 항상 null 로 시작한다. 복원은 브라우저에서 initializeAuth 가 한다.
  token: readToken(),
  isInitializing: !!readToken(), // token 있을 때만 복원 대기
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
