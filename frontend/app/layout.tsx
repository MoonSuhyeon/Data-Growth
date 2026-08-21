import type { Metadata } from 'next'
import './globals.css'
import AuthGate from '@/components/AuthGate'
import MockGate from '@/mocks/MockGate'

/*
 * 글꼴은 **한 벌뿐이다** — Pretendard. `globals.css` 에서 CDN 으로 받는다.
 *
 * 처음에는 네 벌이었다(Playfair·Inter·Noto Serif KR·Noto Sans KR). 제목을
 * 세리프로 세우려던 것인데, 라틴 세리프에는 한글 자소가 없어서 한글 제목만
 * 다른 글꼴로 떨어졌다. 그다음엔 브랜드 워드마크 한 곳에만 남겼는데, 그것도
 * 산세리프 단색으로 바꾸면서 쓸 데가 없어졌다.
 *
 * **한 곳에서만 쓰는 글꼴은 그 한 곳을 고치는 순간 짐이 된다.** 지웠다.
 */

export const metadata: Metadata = {
  title: 'Host 2 Guest — 머무는 시간을 고르는 일',
  description:
    '엄선한 숙소와 운영 콘솔. 수요 예측·콘텐츠 생성·상담 승인이 한 화면에 모인다.',
  icons: { icon: '/h2g-logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-canvas text-ink antialiased">
        {/* 목이 먼저다. 토큰 복원(`/auth/me`)도 가로챌 수 있어야 백엔드 없이 돈다. */}
        <MockGate>
          <AuthGate>{children}</AuthGate>
        </MockGate>
      </body>
    </html>
  )
}
