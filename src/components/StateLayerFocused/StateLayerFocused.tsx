import type { HTMLAttributes } from 'react';

export interface StateLayerFocusedProps extends HTMLAttributes<HTMLSpanElement> {
  /** 호스트 경계 밖으로 한 단계 넘겨 링을 그린다. Figma variant `outerFocus`. */
  outerFocus?: boolean;
}

/**
 * Figma `StateLayer/Focused` 컴포넌트 세트 (node 35:12806).
 *
 * Figma 설명: "컴포넌트가 포커스(focused) 상태일 때 적용되는 시각적 상태 표현 요소.
 * 키보드 탐색 또는 포커스 이동 시 요소의 경계를 강조한다."
 *
 * Figma 원본 구조는 2단이다 — 바깥 프레임과 그 안의 `state area`.
 * 바깥 프레임은 시각 값을 갖지 않고 그 치수는 진열용 데모 박스 크기일 뿐이라
 * 코드로 옮기지 않았다. 크기는 호스트가 정한다. 그리는 것은 `state area`
 * 하나뿐이므로 한 요소로 합쳤다. (CLAUDE.md 원칙 2)
 *
 * · 테두리 색: Figma 변수 `state/focused` 가 기존 토큰 `--color-state-focused` 와
 *   값이 같아 재사용했다.
 * · 테두리 두께: Figma 실측값(가장 얇은 선). 변수 바인딩이 없다.
 *   토큰 `--spacing-hairline` → 유틸리티 `border-hairline` 으로 그린다.
 *   Tailwind 코어의 `border` 를 쓰지 않는 이유는 그것이 토큰을 우회한 값이기 때문이다.
 * · 반경: `state area` 의 코너 반경이 Figma 변수 `radius/4` 에 바인딩돼 있다
 *   → 기존 토큰 `--radius-4` → `rounded-4`
 * · 위치: `outerFocus=false` 는 호스트를 정확히 덮고(Figma: 부모를 채우는 자식),
 *   `outerFocus=true` 는 사방으로 한 단계 넘겨 그린다(Figma: 음수 inset).
 *   그 크기는 Figma 실측값이고 기존 토큰 `--spacing-4` 와 값이 같아 재사용했다.
 * · fill: 두 variant 모두 없다. 안쪽은 투명하므로 배경 유틸리티가 들어갈 자리가 없다.
 *
 * 값 대조표(Figma 원값 ↔ 토큰 원값)는 `StateLayerFocused.design.md` 에 있다.
 *
 * Figma variant 축 `radius` 는 값이 `small` 하나뿐이라 prop 으로 만들지 않았다.
 * 두 variant 모두 같은 변수 `radius/4` 에 바인딩돼 있어 호출부가 바꿀 수 있는 것이
 * 없기 때문이다. 축이 없는 것이지 값이 없는 것이 아니라서, 반경은 상수로 들어간다. (원칙 2)
 *
 * `<span>` 을 쓰는 이유는 `<button>` 의 콘텐츠 모델이 phrasing content 라서다.
 * `<div>` 를 넣으면 버튼 안에서 무효한 마크업이 된다.
 *
 * `absolute` 오버레이이므로 **호스트가 `relative` 여야 한다.** 합성 조건은 design.md 참조.
 * `aria-hidden` 은 이 요소가 순수 장식이기 때문이고(포커스 위치는 브라우저와 보조기술이
 * 이미 알고 있다), `pointer-events-none` 은 링이 호스트의 클릭·호버를 가로채지 않게 한다.
 * 둘 다 시각 토큰이 아니다.
 */
export function StateLayerFocused({
  outerFocus = false,
  className = '',
  ...props
}: StateLayerFocusedProps) {
  return (
    <span
      aria-hidden
      className={[
        'pointer-events-none absolute rounded-4',
        'border-hairline border-solid border-state-focused',
        outerFocus ? '-inset-4' : 'inset-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
