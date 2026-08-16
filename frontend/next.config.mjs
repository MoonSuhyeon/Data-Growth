/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  // 예약 서비스 백엔드는 별도 프로세스다. 브라우저가 직접 부르지 않고
  // 이 경로로 넘겨서, 화면이 백엔드 주소를 알 필요가 없게 한다.
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.BOOKING_API_URL ?? 'http://127.0.0.1:8000'}/api/v1/:path*`,
      },
    ]
  },
}
