import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR, Noto_Serif_KR, Playfair_Display } from 'next/font/google'
import './globals.css'
import AuthGate from '@/components/AuthGate'
import MockGate from '@/mocks/MockGate'

/**
 * 글꼴 네 벌 — 라틴과 한글을 따로 싣는다.
 *
 * Playfair Display 에는 한글 자소가 없다. 한글 글꼴을 같이 안 실으면 영문 제목만
 * 세리프로 나오고 한글 제목은 기본 글꼴로 떨어져서, 같은 화면 안에서 제목의
 * 인상이 갈린다.
 *
 * `display: 'swap'` 은 의도다. 글꼴을 기다리며 글자를 숨기면 느린 회선에서 본문이
 * 몇 초씩 빈 채로 남는다. 잠깐 대체 글꼴로 보이는 편이 낫다.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
})

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Host 2 Guest — 머무는 시간을 고르는 일',
  description:
    '엄선한 숙소와 운영 콘솔. 수요 예측·콘텐츠 생성·상담 승인이 한 화면에 모인다.',
  icons: { icon: '/h2g-logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [playfair.variable, inter.variable, notoSerifKr.variable, notoSansKr.variable]

  return (
    <html lang="ko" className={fonts.join(' ')}>
      <body className="min-h-screen bg-ivory text-ink antialiased">
        {/* 목이 먼저다. 토큰 복원(`/auth/me`)도 가로챌 수 있어야 백엔드 없이 돈다. */}
        <MockGate>
          <AuthGate>{children}</AuthGate>
        </MockGate>
      </body>
    </html>
  )
}
