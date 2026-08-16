import type { Metadata } from 'next'
import './globals.css'
import AuthGate from '@/components/AuthGate'

export const metadata: Metadata = {
  title: '숙박 마켓플레이스',
  description: '예약 서비스와 운영 콘솔. 수요 예측·콘텐츠 생성·상담 승인이 한 화면에 모인다.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  )
}
