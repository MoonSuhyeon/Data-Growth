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
 * ## 프로덕션 빌드에서도 켤 수 있다 — 다만 시켜야만 켜진다
 *
 * 예전에는 `NODE_ENV === 'development'` 를 함께 요구했다. 잘못된 배포에서
 * 실제 사용자 요청이 목으로 가로채이는 것을 막으려던 것인데, 그 조건이
 * **심사용 데모 배포까지 같이 막았다.** Vercel 은 프로덕션 빌드라 목이 영영
 * 켜지지 않았고, 백엔드가 없는 그 환경에서 화면은 전부 실패만 보여줬다.
 *
 * 지금은 환경변수 하나로만 갈린다. 그 값을 **넣지 않으면 꺼진 채로 남으므로**
 * 실수로 켜질 일은 없고, 넣는 것은 배포를 만드는 사람의 명시적인 선택이다.
 * 기본이 꺼짐이라는 성질은 그대로다.
 */
import { useEffect, useState } from 'react'

const ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'

/** 데모 세션임을 목이 알아볼 수 있는 값. 실물 토큰과 섞이지 않게 이름을 박아 둔다. */
export const DEMO_TOKEN = 'demo-admin-token'

export default function MockGate({ children }: { children: React.ReactNode }) {
  // 워커가 준비되기 전에 화면이 요청을 보내면 그 요청만 목을 못 탄다.
  // 그러면 "가끔 실패하는" 개발 환경이 되므로, 준비될 때까지 잡아 둔다.
  const [ready, setReady] = useState(!ENABLED)

  useEffect(() => {
    if (!ENABLED) return
    let cancelled = false

    /*
      데모 관리자 토큰을 넣어 둔다.

      `initializeAuth` 는 **토큰이 없으면 `/auth/me` 를 아예 안 부른다.** 그래서
      목이 관리자 세션을 준비해 놔도 화면은 물어보지 않았고, `user` 가 null 인
      채로 남아 관리자 페이지가 홈으로 튕겼다.

      토큰을 넣으면 기존 인증 흐름이 **그대로** 돈다 — 스토어도 AuthGate 도
      고칠 것이 없고, 목이 그 요청에 답할 뿐이다. 실제 백엔드 모드에서는 이
      코드가 실행되지 않으므로 진짜 로그인이 그대로다.
    */
    try {
      if (!window.localStorage.getItem('token')) {
        window.localStorage.setItem('token', DEMO_TOKEN)
      }
    } catch {
      // 저장소를 못 쓰는 브라우저에서도 화면은 떠야 한다.
    }

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
