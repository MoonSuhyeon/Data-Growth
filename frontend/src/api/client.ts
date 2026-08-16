import axios from 'axios'

const client = axios.create({
  // 콘솔 자기 경로로 부른다. next.config 의 rewrite 가 예약 백엔드로 넘긴다 —
  // 브라우저가 백엔드 주소를 알 필요가 없고, CORS 도 안 생긴다.
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = typeof window === 'undefined' ? null : window.localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default client
