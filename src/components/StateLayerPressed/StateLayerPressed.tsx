import type { HTMLAttributes } from 'react';

/** Figma variant 축 `color`. 값 2개는 Figma 컴포넌트 세트에 있는 것 그대로다. */
export type StateLayerPressedColor = 'black' | 'white';

export interface StateLayerPressedProps extends HTMLAttributes<HTMLSpanElement> {
  /** 오버레이 색. Figma 변수 `stateLayer/pressed-black` · `stateLayer/pressed-white`. */
  color?: StateLayerPressedColor;
  /** 호스트 경계 밖으로 넘겨 덮는다. Figma variant `boundaryOut`. */
  boundaryOut?: boolean;
}

/** Figma variant `color` → 기존 semantic 색 토큰. 값 대조는 design.md 참조. */
const COLOR: Record<StateLayerPressedColor, string> = {
  black: 'bg-state-layer-pressed-black',
  white: 'bg-state-layer-pressed-white',
};

/**
 * Figma `StateLayer/Pressed` 컴포넌트 세트 (node 35:12765).
 *
 * Figma 설명: "컴포넌트가 눌린(pressed) 상태를 시각적으로 표현하기 위한 오버레이 요소.
 * 사용자 입력 시 컴포넌트 위에 레이어 형태로 적용된다."
 *
 * Figma 원본 구조는 2단이다 — 바깥 프레임과 그 안의 `state area`.
 * 바깥 프레임은 시각 값을 갖지 않고 그 치수는 데모 박스 크기일 뿐이라
 * (Divider 의 바깥 폭과 같은 성격) 코드로 옮기지 않았다. 크기는 호스트가 정한다.
 * 그려지는 것은 `state area` 하나뿐이므로 한 요소로 합쳤다. (CLAUDE.md 원칙 2)
 *
 * · 색: Figma 변수 `stateLayer/pressed-black` · `stateLayer/pressed-white` 가
 *   기존 토큰 `--color-state-layer-pressed-black` ·
 *   `--color-state-layer-pressed-white` 와 값이 같아 재사용했다.
 * · 반경: `state area` 의 코너 반경이 Figma 변수 `radius/0` 에 바인딩돼 있다
 *   → 기존 토큰 `--radius-0` → `rounded-0`. 이것은 **기본값**이고, 둥근 모서리를 가진
 *   호스트는 `className` 으로 반경 유틸리티를 넘겨 덮을 수 있다 (Button 이 그렇게 한다).
 *   반경 prop 을 두지 않은 이유와 호스트 측 판단은 design.md 참조.
 * · 위치: `boundaryOut=false` 는 호스트를 정확히 덮고(Figma: 부모를 채우는 자식),
 *   `boundaryOut=true` 는 사방으로 한 단계 넘겨 덮는다(Figma: 음수 inset).
 *   그 크기는 Figma 실측값이고 기존 토큰 `--spacing-4` 와 값이 같아 재사용했다.
 *
 * 값 대조표(Figma 원값 ↔ 토큰 원값)는 `StateLayerPressed.design.md` 에 있다.
 *
 * `<span>` 을 쓰는 이유는 `<button>` 의 콘텐츠 모델이 phrasing content 라서다.
 * `<div>` 를 넣으면 버튼 안에서 무효한 마크업이 된다.
 *
 * `absolute` 오버레이이므로 **호스트가 `relative` 여야 한다.** 합성 조건은 design.md 참조.
 *
 * 자식 순서: 이 레이어는 호스트의 **콘텐츠보다 먼저** 와야 한다. 호스트 전체를 덮는
 * 반투명 오버레이라, 콘텐츠 뒤에 두면 라벨까지 함께 어두워진다. 앞에 두면 fill 과 라벨
 * 사이에 놓여 배경만 눌린 것처럼 보인다. Figma 의 Button pressed 3종(1:4055 · 1:4033 ·
 * 1:4016)이 전부 레이어를 `content` 앞에 둔다. 순서를 정하는 것은 호스트다 —
 * 이 컴포넌트는 크기도 쌓임 순서도 갖지 않는다.
 * `aria-hidden` 은 이 요소가 순수 장식이기 때문이고, `pointer-events-none` 은
 * 오버레이가 호스트의 클릭·호버를 가로채지 않게 한다. 둘 다 시각 토큰이 아니다.
 */
export function StateLayerPressed({
  color = 'black',
  boundaryOut = false,
  className = '',
  ...props
}: StateLayerPressedProps) {
  return (
    <span
      aria-hidden
      className={[
        'pointer-events-none absolute rounded-0',
        boundaryOut ? '-inset-4' : 'inset-0',
        COLOR[color],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
