/**
 * 큐를 담아 두는 곳.
 *
 * **인터페이스로 떼어 둔 이유가 있다.** 웹은 `localStorage`, React Native 는
 * `AsyncStorage` 다. SDK 본체가 `localStorage` 를 직접 부르면 앱을 붙일 때
 * 트래커를 다시 쓰게 되고, 그러면 "웹과 앱이 같은 계약을 쓴다"는 전제가 깨진다.
 * 계약을 지키는 건 이 한 겹이다.
 *
 * 동기 인터페이스인 것은 절충이다. `AsyncStorage` 는 비동기라 어댑터가 메모리에
 * 캐시를 들고 뒤에서 쓰기를 미뤄야 한다. 대신 트래커 쪽은 단순해진다.
 */

export interface QueueStorage {
  read(key: string): string | null
  write(key: string, value: string): void
  remove(key: string): void
}

/** 서버 렌더 중이거나 저장소가 막혔을 때. 큐는 살아 있고, 새로고침에 사라진다. */
export class MemoryStorage implements QueueStorage {
  private map = new Map<string, string>()
  read(key: string) {
    return this.map.has(key) ? (this.map.get(key) as string) : null
  }
  write(key: string, value: string) {
    this.map.set(key, value)
  }
  remove(key: string) {
    this.map.delete(key)
  }
}

/**
 * `localStorage` 어댑터.
 *
 * 사파리 프라이빗 모드나 용량 초과에서 `setItem` 이 던진다. 던지게 두면 이벤트
 * 하나 때문에 화면이 죽는다 — **계측이 제품을 넘어뜨리면 안 된다.** 그래서 삼키고
 * 메모리로 물러난다. 큐가 새로고침을 못 넘기는 건 손해지만, 큐 때문에 예약이
 * 안 되는 것보다 낫다.
 */
export class LocalStorage implements QueueStorage {
  private fallback = new MemoryStorage()

  read(key: string) {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return this.fallback.read(key)
    }
  }
  write(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      this.fallback.write(key, value)
    }
  }
  remove(key: string) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      this.fallback.remove(key)
    }
  }
}

export function defaultStorage(): QueueStorage {
  if (typeof window === 'undefined') return new MemoryStorage()
  return new LocalStorage()
}
