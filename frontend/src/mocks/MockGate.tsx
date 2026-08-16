'use client'

/**
 * 개발 중에만 목을 켠다.
 *
 * 이 콘솔은 서비스 넷을 부른다 — 예약 백엔드, 수요 예측, 콘텐츠 생성, 상담.
 * 화면 하나 고치자고 넷을 다 띄우는 건 비싸고, 안 띄우면 화면이 전부 "서비스에
 * 연결할 수 없습니다"만 보여준다. 그 사이를 메우는 게 목이다.
 *
 * **기본은 꺼짐이다.** `NEXT_PUBLIC_API_MOCKING=enabled` 일 때만 켠다.
 * 목이 기본이면 실물이 죽은 것을 못 알아채고, 그 상태로 배포까지 간다.
 *
 * 프로덕션 빌드에서는 아예 시작하지 않는다 — 환경변수를 잘못 넣어도 실제 사용자
 * 요청이 목으로 가로채이는 일은 없어야 한다.
 */
import { useEffect, useState } from 'react'

const ENABLED =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'

export default function MockGate({ children }: { children: React.ReactNode }) {
  // 워커가 준비되기 전에 화면이 요청을 보내면 그 요청만 목을 못 탄다.
  // 그러면 "가끔 실패하는" 개발 환경이 되므로, 준비될 때까지 잡아 둔다.
  const [ready, setReady] = useState(!ENABLED)

  useEffect(() => {
    if (!ENABLED) return
    let cancelled = false
    import('./browser').then(async ({ worker }) => {
      await worker.start({
        // 목이 없는 요청은 그냥 통과시킨다. 일부만 목으로 대체하고 나머지는
        // 실제 백엔드를 쓰는 조합이 개발 중에 자주 필요하다.
        onUnhandledRequest: 'bypass',
      })
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return null
  return <>{children}</>
}

export const MOCKING_ENABLED = ENABLED
