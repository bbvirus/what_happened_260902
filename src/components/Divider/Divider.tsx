import type { HTMLAttributes } from 'react';

export type DividerProps = HTMLAttributes<HTMLHRElement>;

/**
 * Figma `Divider` 섹션(node 27738:6454)의 컴포넌트 `Divider` (node 20:5645).
 *
 * Figma 원본 구조는 2단이다 — 바깥 COMPONENT(세로 auto-layout, clip)와
 * 그 안의 RECTANGLE `divider`(node 20:5646). 바깥 프레임은 시각 값을 하나도
 * 갖지 않고(fill 없음) 안쪽 사각형이 선 전체를 그린다. 그래서 두 단을 한 요소로
 * 합쳤다. 요청 범위 밖의 래퍼를 만들지 않는다. (CLAUDE.md 원칙 2)
 *
 * · 색: Figma 변수 `border/primary` → 기존 토큰 `--color-border-primary` 재사용
 * · 두께: 안쪽 사각형의 높이. Figma 값은 hairline 이며 토큰
 *   `--spacing-hairline` → 유틸리티 `h-hairline` 로 그린다.
 * · 폭: Figma 사각형은 `layoutSizingHorizontal: FILL` 이다. 컴포넌트의 360 은
 *   모바일 페이지 폭에서 온 배치값이지 컴포넌트 속성이 아니므로 `w-full` 로 옮겼다.
 *
 * Figma 컴포넌트의 `componentPropertyDefinitions` 는 비어 있다 —
 * variant 도 component property 도 0개다. 그래서 prop 은 두지 않았다.
 *
 * `<hr>` 을 쓰는 이유는 `role="separator"` 가 암묵으로 붙기 때문이다.
 * `border-0` 은 Tailwind preflight 가 `hr` 에 얹는 기본 위쪽 테두리를 지워
 * 선이 두 겹으로 보이는 것을 막는다. `shrink-0` 은 flex 컨테이너 안에서
 * hairline 높이가 0 으로 눌리지 않게 한다. 둘 다 시각 토큰이 아니라 리셋·레이아웃이다.
 */
export function Divider({ className = '', ...props }: DividerProps) {
  return (
    <hr
      className={['h-hairline w-full shrink-0 border-0 bg-border-primary', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
