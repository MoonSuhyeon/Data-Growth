'use client'

/**
 * 숙소 사진. **없거나 못 불러와도 화면이 깨지지 않는다.**
 *
 * ## 왜 만들었나
 *
 * 시드가 `https://picsum.photos/seed/...` 를 넣어 두고 있었다. 그 서비스가 503 을
 * 내는 순간 **41개 숙소의 사진이 한꺼번에 사라지고**, `<img>` 에 폴백이 없어
 * 깨진 아이콘만 남았다. 데모가 외부 서비스 가동에 걸려 있었던 셈이다.
 *
 * 그래서 두 가지를 한다.
 *
 *   1. 사진이 없으면 **그 자리에서 그림을 만든다.** 네트워크를 타지 않으므로
 *      비행기 모드에서도 같은 화면이 나온다.
 *   2. 사진 주소가 있어도 **불러오기에 실패하면 같은 그림으로 떨어진다.**
 *      이번 사고의 원인은 picsum 이었지만, 다음에는 다른 주소일 것이다.
 *      한 번 고칠 때 종류를 막는다.
 *
 * ## 왜 회색 상자가 아니라 색을 입히나
 *
 * 목록이 스무 칸 넘게 이어지는데 전부 같은 회색이면 어느 칸을 보고 있었는지
 * 놓친다. 이름에서 뽑은 색을 쓰면 **같은 숙소는 늘 같은 색**이라 자리를 기억할
 * 수 있고, 카드끼리도 구분된다. 무작위였다면 새로 그릴 때마다 색이 바뀌어
 * 오히려 더 헷갈린다.
 */

import { useEffect, useState } from 'react'

/** 문자열 → 0~359. 같은 이름이면 늘 같은 색이 나오게 하는 것이 요점이다. */
function hueOf(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360
  return h
}

function Placeholder({ seed, label }: { seed: string; label?: string }) {
  const hue = hueOf(seed)
  // 채도를 낮게 잡는다. 사진 자리에 원색이 들어가면 카드의 진짜 정보(이름·가격)
  // 보다 배경이 먼저 눈에 들어온다.
  const from = `hsl(${hue} 34% 82%)`
  const to = `hsl(${(hue + 28) % 360} 30% 68%)`

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2 select-none"
      style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <svg className="w-9 h-9 opacity-60" fill="none" viewBox="0 0 24 24"
           stroke="white" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
      </svg>
      {label && (
        <span className="text-[11px] tracking-wide text-white/85 px-3 text-center leading-[1.4]">
          {label}
        </span>
      )}
    </div>
  )
}

export default function PropertyPhoto({
  src, alt, seed, label, className = 'w-full h-full object-cover',
}: {
  src?: string | null
  alt?: string
  /** 색을 정하는 값. 숙소 id 나 이름처럼 **바뀌지 않는 것**을 넘긴다. */
  seed: string
  /** 그림 안에 적을 짧은 말. 카드 아래에 이미 이름이 있으면 생략한다. */
  label?: string
  className?: string
}) {
  const [broken, setBroken] = useState(false)

  // 주소가 바뀌면 다시 시도한다. 안 그러면 한 번 실패한 카드가 목록을 다시
  // 불러온 뒤에도 영영 그림으로 남는다.
  useEffect(() => { setBroken(false) }, [src])

  if (!src || broken) return <Placeholder seed={seed} label={label} />

  return (
    <img
      src={src}
      alt={alt ?? ''}
      className={className}
      onError={() => setBroken(true)}
    />
  )
}
