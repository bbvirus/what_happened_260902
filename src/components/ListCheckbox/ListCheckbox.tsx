import type { HTMLAttributes, ReactNode } from 'react';
import { Divider } from '../Divider/Divider';
import { Icon } from '../Icon/Icon';
import { ListSlotCheckbox } from '../ListSlotCheckbox/ListSlotCheckbox';
import { TextSetTitle } from '../TextSetTitle/TextSetTitle';

/**
 * 행의 밀도. Figma `List/Checkbox`(60:23751) 의 기본 심볼이 `default`,
 * `page/Consent`(27683:3187) 의 약관 4행이 쓰는 값이 `compact` 다.
 *
 * ⚠ **축 이름 `size` 는 이 저장소의 명명이다.** Figma 인스턴스 이름
 * `[List] Checkbox/false/compact/false` 에서 읽어낼 수 있는 것은 **값** `compact`
 * 뿐이고, MCP 가 마스터의 property 이름을 내주지 않는다. 같은 섹션의
 * `ListSlot/Radio`(20:5729) 가 `size=medium, …` 형태로 `size` 축을 쓰고 있어
 * 그 이름을 따랐다. 근거와 한계는 `ListCheckbox.design.md` 에 적었다.
 */
export type ListCheckboxSize = 'default' | 'compact';

/**
 * 행 상하 패딩. Figma 변수 `spacing/24` · `spacing/20` → 토큰 `--spacing-24` · `--spacing-20`.
 * Tailwind 가 스캔할 수 있도록 정적 클래스명을 그대로 적는다 (`TextSetTitle.tsx` 와 같은 이유).
 */
const ROOT_PADDING: Record<ListCheckboxSize, string> = {
  default: 'py-24',
  compact: 'py-20',
};

/**
 * `title` 을 지우기 위해 `Omit` 이 필요하다. `HTMLAttributes` 가
 * `title?: string` 을 이미 선언해 둔 탓에 `ReactNode` 로 재정의하면 충돌한다.
 * `TextSetTitle.tsx` 가 같은 이유로 같은 패턴을 쓴다.
 */
export interface ListCheckboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma variant 축 `isChecked`. 기본값은 Figma 기본 variant 인 `false`. */
  isChecked?: boolean;
  /**
   * 행 라벨. Figma `Text Set Title` 인스턴스의 `Title` 텍스트 자리다.
   * 내용 슬롯이며 시각 값이 아니다 — `TextSetTitle.tsx` 가 세운 근거와 같다.
   */
  title: ReactNode;
  /** 행의 밀도. 기본값은 `List/Checkbox`(60:23751) 심볼의 값인 `default`. */
  size?: ListCheckboxSize;
  /**
   * Figma component property `hasIconEnd`. 끝 셰브론 노출 여부.
   * 기본값은 Figma 기본값인 `true`.
   */
  hasIconEnd?: boolean;
  /**
   * 행 아래 구분선 노출 여부. 기본값은 `List/Checkbox`(60:23751) 심볼이 늘 그리는 `true`.
   *
   * ⚠ **prop 이름 `hasDivider` 는 이 저장소의 명명이다.** Figma 는 구분선을
   * 인스턴스 오버라이드로 숨기고(`27683:3196` 의 `Divider` 가 `hidden`),
   * MCP 가 그 property 이름을 내주지 않는다. `hasIconEnd` 와 같은 형태를 따랐다.
   */
  hasDivider?: boolean;
}

/**
 * Figma `List/Checkbox` 컴포넌트 세트 (node 60:23751, 섹션 27683:4431).
 *
 * Figma 설명: "Content 계열에서 여러 정보를 항목 단위로 정렬하여 표현하기 위한
 * 컴포넌트입니다. 텍스트, 아이콘, 썸네일 등 다양한 요소를 포함한 정보를 목록 형태로
 * 구성할 때 사용되며, 메뉴, 설정, 콘텐츠 목록 등 정보 탐색 구조에서 활용됩니다.
 * 키워드 : 리스트, 정보 목록, 리스트 항목, List"
 *
 * ## 합성 컴포넌트다 — 새로 그린 것이 하나도 없다
 * `get_metadata`(60:23786 · 60:23802)가 이 행의 자식 4개를 전부 **instance** 로
 * 반환했고, 4개 모두 이 저장소에 이미 구현돼 있어 그대로 import 했다.
 *
 * | Figma 노드 | 종류 | 재사용한 컴포넌트 |
 * |---|---|---|
 * | `60:23790` · `60:23806` `ListSlot/Checkbox` | instance of 20:5754 | `ListSlotCheckbox` |
 * | `27737:6056` · `27737:6082` `Text Set Title` | instance of 27719:1908 | `TextSetTitle` (`size="sm"`) |
 * | `60:23793` · `60:23809` `Icon/chevronRight-small-line` | instance | `Icon name="chevronRight-small"` |
 * | `27742:6589` · `27742:6596` `Divider` | instance of 20:5645 | `Divider` |
 *
 * 체크박스 SVG · 셰브론 SVG · 구분선을 다시 그리지 않았다. (CLAUDE.md 원칙 2)
 * 체크박스 원자의 특이사항(비선택 박스가 stroke 확장된 vector 라서 `radius/4` 와
 * 선 두께 1.5 가 `d` 안에 들어가 있고 `rounded-4` 토큰이 코드에 나타나지 않는 것,
 * `isDisabled` 에 dim 처리가 없는 것)은 `ListSlotCheckbox.design.md` 에 이미 조사돼
 * 있어 다시 조사하지 않고 그 문서를 신뢰했다.
 *
 * ## Figma 3단 구조를 1단으로 접은 근거
 * Figma 원본은 이렇다.
 *
 * ```
 * symbol 60:23786 (row, 가로 auto-layout, py=spacing/24)  362×72
 * ├─ instance 27742:6589 "Divider"  360×1  @ (1,71)   ← absolute
 * └─ frame 60:23788 "content" (가로, gap=spacing/16, FILL)  362×24
 *    ├─ frame 60:23789 "slot-start"  24×24  → instance ListSlot/Checkbox
 *    ├─ instance 27737:6056 "Text Set Title"  282×24  (FILL)
 *    └─ frame 60:23792 "slot-end"  24×24  → instance Icon/chevronRight-small-line
 * ```
 *
 * `content` · `slot-start` · `slot-end` 세 프레임은 **시각 값을 하나도 갖지 않는다**
 * (fill · stroke · radius 전부 없음). 그리고
 * · `content` 는 row 의 유일한 in-flow 자식이고 FILL 이므로 row 의 폭을 그대로 받는다
 * · `slot-start` · `slot-end` 는 자식이 24×24 인스턴스 하나뿐이고 크기가 그 인스턴스와
 *   같다 (24×24) — 감싸는 것 외에 하는 일이 없다
 *
 * 그래서 row 의 `py=spacing/24` 와 `content` 의 `gap=spacing/16` 을 한 요소에 얹고
 * 슬롯 래퍼를 없앴다. `Divider`·`TextSetTitle`·`ListSlotCheckbox` 가 각각 같은
 * 판단(값 없는 중간 래퍼는 만들지 않는다)을 내렸고 그 규칙을 그대로 따랐다. (원칙 2)
 *
 * 접은 결과의 높이가 Figma 실측과 맞는지 확인했다:
 * `spacing/24`(24) + content 높이 24 + `spacing/24`(24) = 72 = 심볼 높이 ✔
 * 가로도 맞는다: 24 + `spacing/16`(16) + 282 + `spacing/16`(16) + 24 = 362 = 심볼 폭 ✔
 *
 * ## 폭 — 362 를 옮기지 않은 이유
 * `content` 가 FILL 이므로 행의 폭은 부모가 정한다 → `w-full`.
 * 362 는 이 파일의 모바일 페이지 폭(360)에서 온 배치값으로 본다.
 * 같은 판단의 근거가 이 노드 안에 그대로 있다: 안의 `Divider` 인스턴스는 자기 고유
 * 폭 360 을 유지해서 362 짜리 행 안에 좌우로 1 씩 남긴 채 놓여 있다. 두 값(362 · 360)이
 * 서로 어긋나 있다는 것 자체가 둘 다 컴포넌트 속성이 아니라는 표시다.
 * `Divider.design.md` · `TextSetTitle.tsx` 가 이미 같은 결론을 내렸다.
 * 그 좌우 1 을 옮기지 않은 근거는 `ListCheckbox.design.md` 에 있다.
 *
 * ## 구분선을 absolute 로 두는 이유
 * Figma 에서 `Divider` 는 auto-layout 의 자식이 아니라 절대 배치(bottom=0)다.
 * 그래서 행 높이 72 에 hairline 을 더하지 않는다 (72 = 24+24+24 로 패딩과 내용만으로 맞는다).
 * in-flow 로 넣으면 행이 73 이 되므로 Figma 와 같은 절대 배치로 옮겼다.
 * `absolute inset-x-0 bottom-0` 의 `0` 은 시각 값이 아니라 배치 기준점이다.
 *
 * ## 이 컴포넌트는 체크박스 행의 그림이다
 * `get_metadata` 상 두 variant 안에 상호작용 관련 노드가 하나도 없다 —
 * hit area · pressed/focused 상태 레이어가 전부 없어 `StateLayerPressed` ·
 * `StateLayerFocused` 를 재사용할 자리가 없다 (있는데 안 쓴 것이 아니라 Figma 에 없다).
 * 그래서 `ListSlotCheckbox` 와 같은 성격의 표시 요소로 구현했다. 시맨틱(`role` ·
 * `aria-checked`), 체크박스 그룹 묶기, 라벨 연결, 키보드 조작, 포커스 표시는
 * **전부 호스트의 책임**이다. 책임 분리표는 `ListCheckbox.design.md` 에 있다.
 * `...props` 를 루트에 전개하므로 호스트가 `role` · `aria-checked` · `onClick` ·
 * `tabIndex` 를 그대로 얹을 수 있다.
 *
 * 포커스 표시를 그리지 않는 이유도 같다 — Figma 에 그 variant 가 없고,
 * UA 아웃라인을 끄는 코드가 아예 없으므로 호스트의 포커스 표시가 살아 있다
 * (`TabItem` · `ListSlotCheckbox` 와 같은 규칙).
 *
 * ## Figma 에 있으나 이 작업의 범위에 없는 component property 2개
 * `get_design_context` 가 이 세트에서 `hasIconStart`(boolean) ·
 * `hasIconEnd`(boolean) · `iconEnd`(instance swap) 를 함께 읽어냈다.
 * 그중 `hasIconEnd` 는 `page/Consent`(27683:3187) 가 실제로 끄고 있어 prop 으로 열었다.
 * 나머지 `hasIconStart` · `iconEnd` 는 쓰는 화면이 아직 없어 만들지 않았고,
 * Figma 기본값(`true` · 기본 인스턴스)대로만 렌더한다. (원칙 2)
 *
 * ## 나중에 늘어난 축 3개 — 전부 `page/Consent` 가 실제로 요구한 값이다
 * | prop | 요구한 노드 | Figma 근거 |
 * |---|---|---|
 * | `size='compact'` | `27683:3196`~`3199` | 상하 패딩이 `spacing/component/y/20`, 행 높이 64 |
 * | `hasIconEnd={false}` | `27683:3193` | `slot-end` 프레임이 `hidden` |
 * | `hasDivider={false}` | `27683:3196`~`3199` | `Divider` 인스턴스가 `hidden` |
 *
 * 세 기본값은 모두 기존 렌더 결과와 같다 — 이 축들이 붙기 전의 호출부는 바뀌지 않는다.
 */
export function ListCheckbox({
  isChecked = false,
  title,
  size = 'default',
  hasIconEnd = true,
  hasDivider = true,
  className = '',
  ...props
}: ListCheckboxProps) {
  return (
    <div
      className={['relative flex w-full items-center gap-16', ROOT_PADDING[size], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {/* slot-start 60:23789 · 60:23805 → instance ListSlot/Checkbox 60:23790 · 60:23806 */}
      <ListSlotCheckbox isChecked={isChecked} />

      {/* Text Set Title 27737:6056 · 27737:6082 — size=sm, description=false */}
      <TextSetTitle size="sm" title={title} className="min-w-0 flex-1" />

      {/* slot-end 60:23792 · 60:23808 → instance Icon/chevronRight-small-line 60:23793 · 60:23809 */}
      {hasIconEnd ? <Icon name="chevronRight-small" /> : null}

      {/* Divider 27742:6589 · 27742:6596 — Figma 에서 절대 배치(bottom=0)다 */}
      {hasDivider ? <Divider className="absolute inset-x-0 bottom-0" /> : null}
    </div>
  );
}
