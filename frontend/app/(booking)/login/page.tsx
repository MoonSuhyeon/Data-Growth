'use client'

import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, getMe } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { identify } from '@/lib/tracking'
import { DEMO_ACCOUNTS, demoRoleOf } from '@/lib/demoAccounts'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})
type FormData = z.infer<typeof schema>

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)

  /*
    `?as=admin` 으로 들어오면 계정을 **미리 채운다.**

    시연 중에 이메일과 비밀번호를 타이핑하는 시간이 아깝고, 오타가 나면
    "로그인이 안 된다" 로 보여서 흐름이 끊긴다. 채워만 두고 **누르는 것은
    사람이 한다** — 화면을 여는 것만으로 로그인이 되면, 남의 계정으로
    들어와 있는데 그걸 모르는 상태가 생긴다.
  */
  const demo = demoRoleOf(searchParams.get('as'))
  const preset = demo ? DEMO_ACCOUNTS[demo] : null

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: preset
      ? { email: preset.email, password: preset.password }
      : undefined,
  })

  const onSubmit = async (data: FormData) => {
    try {
      const { data: tokenData } = await login(data)
      localStorage.setItem('token', tokenData.access_token)
      const { data: user } = await getMe()
      setAuth(user, tokenData.access_token)
      // 익명 ID 는 그대로 두고 회원 ID 만 붙인다. 여기서 익명 ID 를 새로 발급하면
      // 로그인 전 행동이 다른 사람 것이 되고, 스티칭이 이으려던 연결이 끊긴다.
      identify(String(user.id))
      const back = searchParams.get('redirect')
      router.replace(back ? decodeURIComponent(back) : (preset?.redirect ?? '/'))
    } catch {
      setError('root', { message: '이메일 또는 비밀번호가 올바르지 않습니다' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-ink mb-6">
          {preset ? `${preset.label} 로그인` : '로그인'}
        </h1>

        {preset && (
          <p className="text-[13px] leading-[1.6] text-ink-soft bg-mist rounded-lg px-3.5 py-3 mb-5">
            데모 계정이 입력되어 있습니다. <b>로그인</b>만 누르면 됩니다.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">이메일</label>
            <input
              {...register('email')}
              type="email"
              placeholder="example@email.com"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">비밀번호</label>
            <input
              {...register('password')}
              type="password"
              placeholder="비밀번호 입력"
              className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gilt hover:brightness-105 disabled:opacity-45 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-faint mt-6">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-gold-700 hover:underline font-medium">
            회원가입
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-line space-y-2">
          {/* 데모 바로가기. 지금 채워진 것과 **다른** 쪽만 보여 준다 —
              이미 관리자 계정이 채워져 있는데 "관리자로 채우기" 가 또 있으면
              눌러도 아무 일이 없어 고장으로 읽힌다. */}
          {demo !== 'admin' && (
            <Link
              href="/login?as=admin"
              className="block w-full text-center border border-line text-ink-soft py-2.5 rounded-lg text-sm font-medium hover:bg-mist transition-colors"
            >
              관리자로 로그인 (데모)
            </Link>
          )}
          {demo === 'admin' && (
            <Link
              href="/login"
              className="block w-full text-center border border-line text-ink-soft py-2.5 rounded-lg text-sm font-medium hover:bg-mist transition-colors"
            >
              일반 로그인으로
            </Link>
          )}
          <Link
            href="/booking/lookup"
            className="block w-full text-center border border-line text-ink-soft py-2.5 rounded-lg text-sm font-medium hover:bg-mist transition-colors"
          >
            비회원 예약 조회
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * useSearchParams 는 Suspense 경계 안에 있어야 한다.
 *
 * 쿼리스트링은 서버가 정적으로 만들 때 알 수 없는 값이라, Next 가 여기서 렌더를
 * 멈추고 브라우저에 넘긴다. 경계를 안 주면 페이지 전체가 그 대기에 걸린다.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mist" />}>
      <LoginInner />
    </Suspense>
  )
}
