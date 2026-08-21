'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/store/authStore'

/**
 * 저장된 토큰을 복원할 때까지 화면을 잡아둔다.
 *
 * 예전 App.tsx 가 하던 일이다. 루트 레이아웃은 서버 컴포넌트라 훅을 못 쓰니
 * 클라이언트 경계를 여기 한 군데로 모았다.
 *
 * 콘솔(`/admin/*`)은 자기 레이아웃에 사이드바가 있어서 상단 Navbar 를 띄우지 않는다.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isInitializing } = useAuthStore()
  const pathname = usePathname()
  const isConsole = pathname?.startsWith('/admin')

  useEffect(() => {
    initializeAuth()
  }, [])

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {!isConsole && <Navbar />}
      {children}
    </>
  )
}
