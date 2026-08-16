'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup, login, getMe } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const TERMS_LIST = [
  {
    id: 'term_service' as const,
    required: true,
    label: '서비스 이용약관 동의',
    content: `제1조 (목적)
본 약관은 CJ ONE(이하 "회사")이 제공하는 CJ ONE 통합 멤버십 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 회사가 제공하는 포인트 적립·사용, 숙소 예약 등 통합 멤버십 서비스를 의미합니다.
② "이용자"란 본 약관에 동의하고 서비스를 이용하는 회원을 말합니다.
③ "포인트"란 서비스 이용 시 적립되어 현금처럼 사용할 수 있는 CJ ONE 포인트를 말합니다.

제3조 (약관의 효력 및 변경)
① 본 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
② 회사는 합리적인 사유가 있는 경우 관련 법령에 위배되지 않는 범위에서 본 약관을 변경할 수 있습니다.

제4조 (서비스 이용)
① 이용자는 회사가 정한 절차에 따라 회원가입을 완료한 후 서비스를 이용할 수 있습니다.
② 회원 자격은 1인 1계정을 원칙으로 하며, 타인의 명의를 사용한 가입은 금지됩니다.
③ 만 14세 미만의 경우 법정대리인의 동의가 필요합니다.

제5조 (포인트 적립 및 사용)
① 포인트는 CJ ONE 제휴 서비스 이용 시 적립됩니다.
② 적립된 포인트는 현금처럼 사용하거나 다양한 혜택으로 교환할 수 있습니다.
③ 포인트의 유효기간은 최종 적립일로부터 2년이며, 유효기간 경과 시 소멸됩니다.
④ 부정한 방법으로 적립된 포인트는 회사가 임의로 취소할 수 있습니다.

제6조 (이용자의 의무)
① 이용자는 다음 행위를 하여서는 안 됩니다.
 - 타인의 정보 도용 및 허위 정보 등록
 - 회사의 서비스 운영을 방해하는 행위
 - 포인트의 불법·부정 적립 및 사용
 - 관련 법령에 위반되는 행위

제7조 (서비스 중단 및 이용 제한)
회사는 다음의 경우 서비스 제공을 중단하거나 이용을 제한할 수 있습니다.
 - 시스템 점검, 보수, 교체 등 부득이한 경우
 - 이용자가 본 약관을 위반한 경우
 - 천재지변, 국가비상사태 등 불가항력의 경우

제8조 (면책조항)
① 회사는 천재지변 또는 이에 준하는 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.
② 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 회사는 책임을 지지 않습니다.

제9조 (분쟁 해결)
서비스 이용과 관련된 분쟁은 상호 협의를 통해 해결하며, 협의가 이루어지지 않을 경우 회사의 본사 소재지 관할 법원에서 해결합니다.

부칙
본 약관은 2023년 7월 1일부터 시행합니다.`,
  },
  {
    id: 'term_privacy' as const,
    required: true,
    label: '개인정보 처리방침 동의',
    content: `CJ ONE은 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」 등 관련 법령을 준수합니다.

1. 수집하는 개인정보 항목

[필수]
 - 이름, 이메일 주소, 비밀번호
 - 생년월일, 성별, 휴대폰 번호

[선택]
 - 주소, 직업, 관심사

2. 개인정보 수집 및 이용 목적
 - CJ ONE 통합 멤버십 서비스 제공 및 회원 관리
 - 숙소 예약, 체크인 바우처 발급 및 관련 서비스 제공
 - 포인트 적립·사용·관리
 - 고객 문의 처리 및 분쟁 해결
 - 서비스 개선 및 신규 서비스 개발

3. 개인정보 보유 및 이용 기간
 - 회원 탈퇴 시까지 (단, 관련 법령에 따라 일정 기간 보관)
 - 전자상거래법: 계약·청약철회 기록 5년, 대금결제 기록 5년
 - 소비자 보호법: 소비자 불만·분쟁 처리 기록 3년

4. 개인정보 제3자 제공

회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
단, 다음의 경우는 예외입니다.
 - 법령의 규정에 의한 경우
 - 서비스 제공을 위해 제휴사와 공유하는 경우(사전 고지)

5. 개인정보 처리 위탁
회사는 서비스 향상을 위해 아래와 같이 개인정보 처리를 위탁합니다.
 - 수탁업체: CJ시스템즈(주) / 위탁 업무: IT 시스템 운영 및 관리

6. 이용자의 권리
이용자는 언제든지 다음의 권리를 행사할 수 있습니다.
 - 개인정보 열람, 정정, 삭제 요청
 - 개인정보 처리 정지 요청
 - 마케팅 수신 동의 철회

7. 쿠키(Cookie) 사용
회사는 이용자에게 개인화된 서비스를 제공하기 위해 쿠키를 사용합니다.
이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.

8. 개인정보 보호책임자
 - 성명: 개인정보 보호팀
 - 문의: privacy@cjone.com
 - 고객센터: 1588-1234

본 방침은 2023년 7월 1일부터 시행합니다.`,
  },
  {
    id: 'term_marketing' as const,
    required: false,
    label: '마케팅 정보 수신 동의',
    content: `CJ ONE 마케팅 정보 수신 동의

수신에 동의하시면 CJ ONE의 다양한 혜택과 이벤트 정보를 받으실 수 있습니다.

1. 마케팅 정보 수신 채널
 - 이메일
 - SMS / MMS
 - 앱 푸시 알림
 - 카카오 알림톡

2. 제공되는 정보
 - 신규 숙소 오픈 소식 및 특별 할인
 - CJ ONE 포인트 특별 적립 이벤트
 - 생일·기념일 등 개인화 혜택 쿠폰
 - CJ 계열사(올리브영, CJ대한통운 등) 제휴 혜택
 - 시즌별 이벤트 및 프로모션 안내

3. 수신 동의 철회
 - 언제든지 CJ ONE 앱 > 설정 > 알림 설정에서 수신 동의를 철회할 수 있습니다.
 - 수신 거부 후에도 거래 관련 안내(예약 확인, 결제 완료 등)는 계속 발송됩니다.

4. 유의사항
 - 동의하지 않으셔도 기본 서비스 이용에는 제한이 없습니다.
 - 수신 동의 시 개인정보(이메일, 휴대폰번호)가 마케팅 목적으로 활용됩니다.
 - 마케팅 정보 보유 기간: 동의 철회 시까지

문의: CJ ONE 고객센터 1588-1234`,
  },
]

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  passwordConfirm: z.string(),
  name: z.string().min(1, '이름을 입력하세요'),
  phone: z.string().optional(),
  term_service: z.literal(true, { error: '서비스 이용약관에 동의해주세요' }),
  term_privacy: z.literal(true, { error: '개인정보 처리방침에 동의해주세요' }),
  term_marketing: z.boolean().optional(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
})
type FormData = z.infer<typeof schema>

export default function Signup() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [viewingTerm, setViewingTerm] = useState<typeof TERMS_LIST[number] | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { term_marketing: false },
  })

  const allRequired = watch('term_service') && watch('term_privacy')

  const onSubmit = async (data: FormData) => {
    try {
      await signup({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone || undefined,
        term_service: true,
        term_privacy: true,
        term_marketing: data.term_marketing ?? false,
      })
      const { data: tokenData } = await login({ email: data.email, password: data.password })
      const { data: user } = await getMe()
      setAuth(user, tokenData.access_token)
      router.push('/')
    } catch {
      setError('root', { message: '회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.' })
    }
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">회원가입</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
            <input {...register('email')} type="email" placeholder="example@email.com" className={inputClass} />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
            <input {...register('password')} type="password" placeholder="8자 이상" className={inputClass} />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인 *</label>
            <input {...register('passwordConfirm')} type="password" placeholder="비밀번호 재입력" className={inputClass} />
            {errors.passwordConfirm && <p className={errorClass}>{errors.passwordConfirm.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
            <input {...register('name')} type="text" placeholder="홍길동" className={inputClass} />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <input {...register('phone')} type="tel" placeholder="010-0000-0000" className={inputClass} />
          </div>

          {/* 약관 동의 */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-1">
            {/* 전체 동의 */}
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 mb-1 border-b border-gray-100 cursor-pointer">
              <input
                type="checkbox"
                className="rounded accent-blue-600"
                checked={!!allRequired && !!watch('term_marketing')}
                onChange={(e) => {
                  setValue('term_service', e.target.checked as true, { shouldValidate: true })
                  setValue('term_privacy', e.target.checked as true, { shouldValidate: true })
                  setValue('term_marketing', e.target.checked)
                }}
              />
              전체 동의 (필수 + 선택)
            </label>

            {TERMS_LIST.map((term) => (
              <div key={term.id}>
                <div className="flex items-center justify-between py-1.5">
                  <label className="flex items-center gap-2 text-sm cursor-pointer flex-1 min-w-0">
                    <input
                      {...register(term.id)}
                      type="checkbox"
                      className="rounded accent-blue-600 flex-shrink-0"
                    />
                    <span className="truncate">
                      <span className={`mr-1 ${term.required ? 'text-red-500' : 'text-gray-400'}`}>
                        [{term.required ? '필수' : '선택'}]
                      </span>
                      {term.label}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setViewingTerm(term)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline ml-2 flex-shrink-0"
                  >
                    보기
                  </button>
                </div>
                {term.id === 'term_service' && errors.term_service && (
                  <p className={errorClass}>{errors.term_service.message}</p>
                )}
                {term.id === 'term_privacy' && errors.term_privacy && (
                  <p className={errorClass}>{errors.term_privacy.message}</p>
                )}
              </div>
            ))}
          </div>

          {errors.root && (
            <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">로그인</Link>
        </p>
      </div>

      {/* 약관 상세 보기 모달 */}
      {viewingTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-sm font-bold text-gray-900">{viewingTerm.label}</h3>
              <button onClick={() => setViewingTerm(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {viewingTerm.content}
            </div>
            <div className="px-5 pb-5 flex-shrink-0">
              <button
                onClick={() => setViewingTerm(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
