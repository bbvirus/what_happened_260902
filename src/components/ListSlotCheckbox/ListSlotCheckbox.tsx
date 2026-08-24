import type { SVGProps } from 'react';

/**
 * SVG 기하. 출처는 `download_assets(nodeId, defaultFormat: svg)` 로 심볼 4개를
 * 각각 통째로 내보낸 export 파일이며, 그 안의 vector path 를 그대로 뽑은 것이다.
 * 좌표는 24 뷰박스 기준으로 이미 자리가 잡혀 있어 오프셋을 다시 계산하지 않았다.
 *
 * Figma 는 이 박스를 stroke 를 가진 vector 로 만들었고 export 시 그 stroke 가
 * 아웃라인으로 확장돼 나온다 (레이어 이름 `Vector (Stroke)` 가 그 표시다).
 * 그래서 코너 반경과 선 두께가 `d` 안에 포함된 채로 들어오고, 두 값이 시각 값으로
 * 코드에 노출되지 않는다. `Icon.tsx` 가 심볼 12개에 쓰는 것과 같은 방식이다.
 * `d` 값은 CLAUDE.md 토큰 규칙의 스코프 제외(SVG 기하) 대상이다.
 *
 * 반경이 Figma 변수 `radius/4` 에 바인딩돼 있는데도 `rounded-4` 토큰이 코드에
 * 들어오지 않는다. 그 대가를 감수한 이유와 다른 경로가 막힌 이유는
 * `ListSlotCheckbox.design.md` 의 "반경과 선 두께" 절에 있다.
 *
 * 아래 3개 path 가 variant 4개를 모두 덮는다 — 같은 기하를 공유하는 variant 끼리
 * `d` 가 완전히 동일했다(export 4개를 비교해 확인). 색만 갈라진다.
 */

/** 비선택 박스 — 선만 있는 둥근 사각형. 20:5757 · 20:5761 의 `Vector (Stroke)`. */
const BOX_OUTLINE =
  'M18 20.5V22H6V20.5H18ZM20.5 18V5.99998C20.5 4.61927 19.3807 3.49998 18 3.49998H6C4.61929 3.49998 3.5 4.61927 3.5 5.99998V18C3.5 19.3807 4.61929 20.5 6 20.5V22L5.79395 21.9951C3.7488 21.8913 2.10865 20.2512 2.00488 18.206L2 18V5.99998C2 3.79085 3.79086 1.99998 6 1.99998H18C20.2091 1.99998 22 3.79085 22 5.99998V18C22 20.14 20.3194 21.8879 18.2061 21.9951L18 22V20.5C19.3807 20.5 20.5 19.3807 20.5 18Z';

/** 선택 박스 — 꽉 찬 둥근 사각형. 20:5772 · 20:5777 의 `Vector`. */
const BOX_FILLED =
  'M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6Z';

/** 체크 표시. 35:19928 · 35:19924 `check-small-line` 안의 `Vector`. */
const CHECK_MARK =
  'M17.2436 7.24321C17.5694 6.91827 18.097 6.91905 18.422 7.24483C18.7469 7.57066 18.7461 8.09821 18.4203 8.42322L10.9106 15.9151C10.5858 16.2391 10.0601 16.24 9.73463 15.9167L5.57772 11.7858C5.25129 11.4614 5.25007 10.9339 5.57447 10.6075C5.89888 10.281 6.4264 10.279 6.75286 10.6034L10.3206 14.1491L17.2436 7.24321Z';

export interface ListSlotCheckboxProps extends SVGProps<SVGSVGElement> {
  /** Figma variant 축 `isChecked`. 선택된 상태인지. */
  isChecked?: boolean;
  /** Figma variant 축 `isDisabled`. 비활성 상태인지. **시각 표현만 바꾼다** — 아래 주석 참조. */
  isDisabled?: boolean;
}

/**
 * Figma `ListSlot/Checkbox` 컴포넌트 세트 (node 20:5754, 섹션 27683:4431).
 *
 * Figma 설명: "Control 계열에서 사용되는 Checkbox 컴포넌트입니다.
 * 다중 선택 상태를 표현하기 위해 사용되며, 리스트·카드 구조에서 선택 표현에 활용됩니다."
 *
 * Figma 원본 구조는 3단이다 — 심볼 · `wrapper` 프레임 · vector.
 * 중간의 `wrapper` 프레임들은 fill · stroke · radius 를 하나도 갖지 않아 시각 값이
 * 없다. 그리는 것은 vector 뿐이라 24 뷰박스 SVG 한 장으로 합쳤다. (CLAUDE.md 원칙 2)
 *
 * · 크기: 심볼 4개 전부 24×24 다. 기존 토큰 `--spacing-24` 와 값이 같아 재사용했다
 *   → `size-24`. Figma 진열 프레임의 1012×108 은 컴포넌트 속성이 아니라 옮기지 않았다.
 * · 박스 색: 비선택·활성만 Figma 변수 `text/secondary` → `--color-text-secondary`,
 *   나머지 3개 variant 는 `text/primary` → `--color-text-primary`
 * · 체크 표시 색: 활성은 Figma 변수 `bg/primary` → `--color-bg-primary`,
 *   비활성은 `text/primary` → `--color-text-primary`
 *
 * 값 대조표(Figma 원값 ↔ 토큰 원값)는 `ListSlotCheckbox.design.md` 에 있다.
 *
 * ## Figma 원본을 그대로 옮긴 두 지점 — 보정하지 않았다
 * (1) **비활성 variant 가 흐려지지 않는다.** Figma 가 비활성 박스에 `text/primary` 를
 *     바인딩해 두었다 — 활성 선택 상태와 같은 색이다. 비선택 쪽은 비활성이 활성보다
 *     오히려 진하다. 저장소에 `--color-text-disabled` · `--color-border-disabled` 계열
 *     토큰이 있지만 Figma 가 그것을 쓰지 않았다.
 * (2) **`isChecked=true, isDisabled=true`(20:5775)의 체크 표시가 보이지 않는다.**
 *     체크 fill 과 그 아래 박스 fill 이 둘 다 `text/primary` 로 같은 색이다.
 *     노드는 존재하므로(35:19924) 코드도 그린다. 렌더 결과가 단색 사각형인 것까지 같다.
 *
 * 둘 다 Figma 파일의 실제 값이다. 눈대중으로 고치지 않았다 (원칙 1).
 * 고칠지는 요청자가 정한다 (원칙 3). 근거 픽셀 표본은 design.md 에 있다.
 * 색을 semantic 토큰 유틸리티로만 지정하고 있어, Figma 쪽 바인딩이 바뀌면
 * 토큰 동기화만으로 따라간다 — 이 파일을 고칠 필요가 없다.
 *
 * ## 이 컴포넌트는 체크박스가 아니라 체크박스의 그림이다
 * Figma 심볼 안에 상호작용 관련 노드가 하나도 없다 — hit area · 상태 레이어 ·
 * 라벨 전부 없다. 그래서 `Icon` 과 같은 성격의 순수 표시 요소로 구현했다.
 * 시맨틱(`<input type="checkbox">` 또는 `role="checkbox"` + `aria-checked`),
 * `disabled` 속성, 터치 타깃, 키보드 조작, 라벨 연결은 **전부 호스트의 책임**이다.
 * 책임 분리표는 design.md 에 있다.
 *
 * `aria-hidden` 을 기본으로 붙이는 이유는 `Icon.tsx` 와 같다: 호스트가 선택 상태를
 * 이미 보조기술에 알리고 있어 이 그림까지 노출하면 중복이 된다.
 * props 를 `aria-hidden` **뒤에** 전개하므로 호출부가 덮어쓸 수 있다.
 *
 * `pointer-events` 를 건드리지 않는다. `isDisabled` 는 시각만 바꾼다.
 * 여기서 클릭을 막으면 호스트가 `disabled` 를 걸지 않았을 때
 * "보기엔 비활성인데 눌리는" 상태와 "눌리지 않지만 disabled 도 아닌" 상태가 섞인다.
 *
 * 포커스 표시도 그리지 않는다 — Figma 에 그 variant 가 없다. UA 아웃라인을 끄는 코드가
 * 아예 없으므로 호스트의 포커스 표시가 그대로 살아 있다 (`TabItem` 과 같은 규칙).
 *
 * `shrink-0` 은 24×24 가 Figma 가 고정한 크기라, 리스트 행 같은 flex 컨테이너 안에서
 * 줄어들지 않게 하기 위한 것이다. 시각 토큰이 아니다.
 */
export function ListSlotCheckbox({
  isChecked = false,
  isDisabled = false,
  className = '',
  ...props
}: ListSlotCheckboxProps) {
  // 박스 색: 비선택·활성만 text/secondary 다. 나머지 3개는 text/primary 다.
  const boxColor = !isChecked && !isDisabled ? 'fill-text-secondary' : 'fill-text-primary';

  // 체크 표시 색: 활성은 bg/primary, 비활성은 text/primary (= 박스와 같은 색).
  const checkColor = isDisabled ? 'fill-text-primary' : 'fill-bg-primary';

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={['size-24 shrink-0', className].filter(Boolean).join(' ')}
      {...props}
    >
      {/* wrapper 20:5757 · 20:5761 · 20:5772 · 20:5777 의 vector */}
      <path d={isChecked ? BOX_FILLED : BOX_OUTLINE} className={boxColor} />

      {/* check-small-line 35:19928 · 35:19924 의 vector. 선택 variant 에만 있다. */}
      {isChecked ? <path d={CHECK_MARK} className={checkColor} /> : null}
    </svg>
  );
}
