import type { HTMLAttributes } from 'react';

/**
 * Figma variant 조합 키. `${isChecked}-${isDisabled}` 로 만든다.
 * Figma 컴포넌트 세트의 변형 4개와 1:1 대응한다.
 */
type VariantKey = `${boolean}-${boolean}`;

/**
 * Figma 변형 → 색 토큰 유틸리티. 값 대조는 design.md 참조.
 *
 * 네 칸 중 셋이 같은 값인 것은 **Figma 원본이 그렇기 때문이다.**
 * `isDisabled` 축에 별도의 dim 처리가 들어가 있지 않아, 비활성 두 변형은
 * 활성 checked 와 같은 색을 쓴다. 즉 `isDisabled` 는 `isChecked=false` 일 때만
 * 색을 바꾸고, 그 방향도 밝아지는 쪽이 아니라 **어두워지는 쪽**이다.
 * 토큰에 `--color-text-disabled-on-light` 가 이미 있지만 Figma 가 그것을
 * 이 컴포넌트에 바인딩하지 않았으므로 임의로 넣지 않았다. (CLAUDE.md 원칙 1)
 */
const COLOR: Record<VariantKey, string> = {
  'false-false': 'text-text-secondary',
  'true-false': 'text-text-primary',
  'false-true': 'text-text-primary',
  'true-true': 'text-text-primary',
};

/**
 * `isChecked` → SVG 기하. 20 뷰박스 기준이며 Figma export SVG 의
 * `<g id="wrapper">` path 를 그대로 옮긴 것이다.
 *
 * 두 변형 모두 stroke 없이 fill 만 쓰는 도넛 아웃라인이라 링 두께 같은
 * 시각 값이 코드에 들어오지 않는다. `checked` 는 점을 얹은 링이 아니라
 * **가운데가 비어 있는 두꺼운 도넛**이다 — Figma 원본 그대로다.
 * 원본 fill 은 Figma 변수 `text/secondary` · `text/primary` 였고
 * `currentColor` 로 바꿨다. 색은 위 `COLOR` 유틸리티가 결정한다.
 * `d` 값은 CLAUDE.md 토큰 규칙의 스코프 제외(SVG 기하) 대상이다.
 */
const PATH = {
  unchecked:
    'M18.5 10C18.5 5.30558 14.6944 1.5 10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 14.6944 5.30558 18.5 10 18.5V20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20V18.5C14.6944 18.5 18.5 14.6944 18.5 10Z',
  checked:
    'M14 10C14 7.79086 12.2091 6 10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14V20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20V14C12.2091 14 14 12.2091 14 10Z',
} as const;

export interface ListSlotRadioProps extends HTMLAttributes<HTMLSpanElement> {
  /** Figma variant 축 `isChecked`. 기본값 false. */
  isChecked?: boolean;
  /** Figma variant 축 `isDisabled`. 기본값 false. */
  isDisabled?: boolean;
}

/**
 * Figma `ListSlot/Radio` 컴포넌트 세트 (node 20:5729).
 *
 * Figma 설명: "Control 계열에서 사용되는 Radio 컴포넌트입니다.
 * 단일 선택 상태를 표현하기 위해 사용되며, 리스트·카드 구조에서 선택 표현에
 * 활용됩니다. 키워드 : 선택, 라디오, 컨트롤, Radio, single-select."
 *
 * Figma 원본 구조는 2단이다 — 24 각형 심볼 프레임과 그 안의 20 각형 `wrapper`.
 * 두 단을 그대로 옮겼다: 바깥은 심볼의 크기(= 이 컨트롤이 레이아웃에서 차지하는
 * 자리)이고 안쪽은 실제로 그려지는 글리프다. 20 을 24 로 늘리면 링 두께가
 * 함께 늘어나므로 두 단을 하나로 합치지 않았다.
 *
 * · 크기: 심볼 24 → `--spacing-24` → `size-24`, `wrapper` 20 → `--spacing-20`
 *   → `size-20`. 둘 다 Figma 실측값이고 기존 spacing 스케일과 값이 같아 재사용했다.
 * · 글리프 위치: 활성 두 변형의 `wrapper` 는 사방 균등 여백으로 중앙에 있고,
 *   `inline-flex items-center justify-center` 가 그 배치를 토큰 없이 재현한다.
 *   비활성 두 변형은 Figma 에서 가로로 어긋나 있는데 그것은 오토레이아웃
 *   패딩 오버플로로 생긴 것이라 옮기지 않았다. 근거는 design.md 참조.
 * · 색: Figma 변수 `text/primary` · `text/secondary` 가 기존 토큰
 *   `--color-text-primary` · `--color-text-secondary` 와 값이 같아 재사용했다.
 *
 * 값 대조표(Figma 원값 ↔ 토큰 원값)는 `ListSlotRadio.design.md` 에 있다.
 *
 * **`size` prop 을 두지 않았다.** Figma 컴포넌트 세트에 `size` 축이 있지만
 * 값은 `medium` 하나뿐이다 (`get_metadata` 20:5729 = 변형 4개, 전부 size=medium).
 * 값이 하나인 축은 분기를 만들지 못하므로 prop 으로 만들지 않았다. (원칙 2)
 *
 * `<span>` 을 쓰는 이유는 이 컨트롤이 `<button>` · `<label>` 안에 들어가기
 * 때문이다. 둘의 콘텐츠 모델이 phrasing content 라서 `<div>` 는 무효한 마크업이 된다.
 *
 * **이 컴포넌트는 시각 표현만 담당한다.** 선택 상태의 의미 전달(`role="radio"`,
 * `aria-checked`, `aria-disabled`), 키보드 조작, 포커스는 호스트가 담당한다.
 * 그래서 SVG 는 `aria-hidden` 이다. 역할 분담은 design.md 참조.
 */
export function ListSlotRadio({
  isChecked = false,
  isDisabled = false,
  className = '',
  ...props
}: ListSlotRadioProps) {
  return (
    <span
      className={[
        'inline-flex size-24 shrink-0 items-center justify-center',
        COLOR[`${isChecked}-${isDisabled}`],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="size-20 shrink-0"
      >
        <path d={isChecked ? PATH.checked : PATH.unchecked} fill="currentColor" />
      </svg>
    </span>
  );
}
