/**
 * 데모 계정. **시연을 위해 한곳에 모아 둔 것이지 비밀이 아니다.**
 *
 * 같은 값이 `backend/app/seed.py` 와 저장소 README 에 이미 적혀 있다. 시드가
 * 만드는 계정이라 누구나 저장소를 열면 볼 수 있고, 그래서 여기 적는다고 새로
 * 새는 것은 없다. **다만 시드로 만든 데이터에만 통한다** — 운영 DB 에는 이
 * 계정이 없다.
 *
 * 로그인 화면이 값을 미리 채우는 데 쓴다. 시연 중에 이메일과 비밀번호를 타이핑하는
 * 시간이 아깝고, 오타가 나면 "로그인이 안 된다" 로 보여서 흐름이 끊긴다.
 */

export type DemoRole = 'admin' | 'user'

export const DEMO_ACCOUNTS: Record<DemoRole, {
  email: string
  password: string
  label: string
  /** 로그인 뒤 갈 곳. */
  redirect: string
}> = {
  admin: {
    email: 'admin@stay.example',
    password: 'admin1234',
    label: '운영 콘솔',
    redirect: '/admin',
  },
  user: {
    email: 'user1@stay.example',
    password: 'pass1234',
    label: '고객 화면',
    redirect: '/',
  },
}

/** 쿼리스트링의 `as` 값을 데모 역할로 옮긴다. 모르는 값이면 채우지 않는다. */
export function demoRoleOf(raw: string | null): DemoRole | null {
  return raw === 'admin' || raw === 'user' ? raw : null
}
