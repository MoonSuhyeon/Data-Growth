import { create } from 'zustand'
import type { User } from '../types'
import client from '../api/client'

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
  token: localStorage.getItem('token'),
  isInitializing: !!localStorage.getItem('token'), // token 있을 때만 복원 대기
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isInitializing: false })
  },
  initializeAuth: async () => {
    const { token } = get()
    if (!token) {
      set({ isInitializing: false })
      return
    }
    try {
      const res = await client.get<User>('/auth/me')
      set({ user: res.data, isInitializing: false })
    } catch {
      // 401은 axios 인터셉터가 localStorage 정리 + /login 리다이렉트 처리
      localStorage.removeItem('token')
      set({ user: null, token: null, isInitializing: false })
    }
  },
}))
