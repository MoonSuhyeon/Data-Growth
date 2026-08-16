/**
 * 브라우저(개발)에서 요청을 가로챈다.
 *
 * `NEXT_PUBLIC_API_MOCKING=enabled` 일 때만 켠다. 세 서비스와 예약 백엔드를 전부
 * 띄우지 않고도 화면을 만질 수 있게 하는 게 목적이고, **기본은 꺼짐**이다 —
 * 목이 기본이면 실물이 죽은 것을 못 알아챈다.
 *
 *     npx msw init public/ --save     # 서비스 워커 파일을 public 에 놓는다
 */
import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
