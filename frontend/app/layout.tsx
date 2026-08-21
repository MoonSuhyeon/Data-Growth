import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'
import AuthGate from '@/components/AuthGate'
import MockGate from '@/mocks/MockGate'

/**
 * 글꼴은 두 벌뿐이다.
 *
 * 본문과 제목은 **Pretendard** — `globals.css` 에서 CDN 으로 받는다. 한글과
 * 라틴을 한 벌로 덮으므로 Noto Sans KR·Noto Serif KR·Inter 를 따로 실을 이유가
 * 없어졌다. 글꼴을 네 벌 받던 것을 한 벌로 줄인 셈이라 첫 화면도 그만큼 가볍다.
 *
 * Playfair 는 **브랜드 워드마크에만** 남긴다. 로고타이프는 본문이 아니라 그림에
 * 가까워서, 거기서는 세리프가 브랜드를 만든다. 한글 자소가 없다는 문제도
 * "Host 2 Guest" 라는 라틴 문자열에만 쓰므로 생기지 않는다.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Host 2 Guest — 머무는 시간을 고르는 일',
  description:
    '엄선한 숙소와 운영 콘솔. 수요 예측·콘텐츠 생성·상담 승인이 한 화면에 모인다.',
  icons: { icon: '/h2g-logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={playfair.variable}>
      <body className="min-h-screen bg-ivory text-ink antialiased">
        {/* 목이 먼저다. 토큰 복원(`/auth/me`)도 가로챌 수 있어야 백엔드 없이 돈다. */}
        <MockGate>
          <AuthGate>{children}</AuthGate>
        </MockGate>
      </body>
    </html>
  )
}
