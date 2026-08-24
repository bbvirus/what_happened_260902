import type { HTMLAttributes, ReactNode } from 'react';
import { Divider } from '../Divider/Divider';
import { Icon } from '../Icon/Icon';
import { ListSlotRadio } from '../ListSlotRadio/ListSlotRadio';
import { TextSetTitle } from '../TextSetTitle/TextSetTitle';

/**
 * `title` 을 지우기 위해 `Omit` 이 필요하다. `HTMLAttributes` 가
 * `title?: string` 을 이미 선언해 둔 탓에 `ReactNode` 로 재정의하면 충돌한다.
 * `TextSetTitle.tsx` · `TextButton.tsx` 와 같은 패턴이다.
 */
export interface ListRadioProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma variant 축 `isChecked`. 세트에 있는 축은 이것뿐이다. 기본값은 Figma 기본 variant 인 false. */
  isChecked?: boolean;
  /** 행 제목. Figma 안쪽 `Text Set Title` 인스턴스의 텍스트 자리. */
  title: ReactNode;
}

/**
 * Figma `List/Radio` 컴포넌트 세트 (node 60:24137).
 *
 * Figma 설명: "Content 계열에서 여러 정보를 항목 단위로 정렬하여 표현하기 위한
 * 컴포넌트입니다. 텍스트, 아이콘, 썸네일 등 다양한 요소를 포함한 정보를 목록
 * 형태로 구성할 때 사용되며, 메뉴, 설정, 콘텐츠 목록 등 정보 탐색 구조에서
 * 활용됩니다. 키워드 : 리스트, 정보 목록, 리스트 항목, List"
 *
 * ## 합성 컴포넌트다 — 새로 그린 것이 하나도 없다
 * Figma 원본의 자식 4개가 전부 **인스턴스**다 (`get_metadata` 60:24172 · 60:24188).
 * 그래서 넷 모두 기존 컴포넌트를 그대로 가져다 썼다. (CLAUDE.md 원칙 2)
 *
 * | Figma 인스턴스 | 재사용한 컴포넌트 |
 * |---|---|
 * | `ListSlot/Radio` (60:24176 · 60:24192) | `ListSlotRadio` — 라디오 글리프를 다시 그리지 않았다 |
 * | `Text Set Title` (27737:3510 · 27737:3609) | `TextSetTitle` `size="sm"`, `description` 없음 |
 * | `Icon/chevronRight-small-line` (60:24179 · 60:24195) | `Icon` `name="chevronRight-small"` |
 * | `Divider` (27742:6599 · 27742:6610) | `Divider` |
 *
 * `ListSlotRadio` 의 `isDisabled` 는 넘기지 않는다 — Figma 두 변형 모두
 * 인스턴스가 `isDisabled=false` 다. 원자에 있는 축이라고 해서 이 행에 만들지 않는다.
 * 원자의 알려진 특이사항(비활성에 dim 처리가 없다, checked 글리프가 도넛이다)은
 * `ListSlotRadio.design.md` 에 이미 적혀 있어 여기서 다시 확인하지 않았다.
 *
 * ## 시각 값 2개만 이 파일에 있다
 * · `py-24` — Figma 변수 `spacing/24` → 기존 토큰 `--spacing-24`. 행 상하 패딩이고
 *   높이 72 가 여기서 나온다 (24 + content 24 + 24).
 * · `gap-16` — Figma 변수 `spacing/16` → 기존 토큰 `--spacing-16`. 라디오 ↔ 텍스트 ↔
 *   chevron 사이 간격이다.
 * 나머지 색·타이포·선 두께는 전부 위 네 컴포넌트가 자기 토큰으로 그린다.
 * 값 대조표(Figma 원값 ↔ 토큰 원값)는 `ListRadio.design.md` 에 있다.
 *
 * ## Figma 구조에서 접은 단
 * Figma 원본은 `content`(60:24174) 안에 `slot-start`(60:24175) · `slot-end`(60:24178)
 * 프레임을 한 단 더 두고 그 안에 인스턴스를 담는다. 두 프레임은 24×24 이고
 * 담긴 인스턴스도 24×24 라 **자체 시각 값이 하나도 없다** — 패딩도 배경도 없고
 * `content` 의 `items-center` 와 같은 정렬을 반복할 뿐이다. 그래서 두 단을 접고
 * 인스턴스를 `content` 의 직접 자식으로 놓았다. `Divider` · `TextSetTitle` 에서
 * 이미 내린 것과 같은 판단이다 (시각 값을 갖지 않는 중간 래퍼는 만들지 않는다).
 *
 * `content` 단은 접지 않았다 — 루트의 `py-24` 와 별개로 `gap-16` 을 갖고,
 * 절대 배치된 `Divider` 가 이 단 밖에 있어야 행 높이에 더해지지 않는다.
 *
 * ## 폭과 구분선 위치
 * Figma 변형은 폭 362 고정이고 `Divider` 인스턴스만 좌우로 1 씩 들어가 360 이다.
 * 폭 362 를 옮기지 않았다 — 같은 파일의 `Divider`(360×1) · `TextSetTitle`(360)
 * 에서 이미 "360 은 컴포넌트 속성이 아니라 모바일 페이지 폭에서 온 배치값" 으로
 * 판정하고 `w-full` 로 옮겼다. 폭을 고정하지 않으므로 구분선을 1 씩 들여넣을
 * 여유 2 도 존재하지 않아 `inset-x-0` 으로 행 폭을 채운다. 근거는 design.md 참조.
 *
 * `Divider` 를 절대 배치하는 것은 Figma 그대로다 (원본도 `bottom: 0` 절대 배치).
 * 흐름에 두면 hairline 만큼 행이 높아져 72 가 깨진다.
 *
 * ## a11y — 이 컴포넌트가 담당하지 않는 것
 * **이 컴포넌트는 선택 가능한 행의 시각 표현이다.** 라디오 그룹의 의미론은
 * 갖지 않는다. `role="radio"` · `aria-checked` · 그룹핑(`role="radiogroup"`) ·
 * 키보드 조작은 호스트가 담당하며, 루트 `<div>` 에 props 가 전개되므로
 * 호스트가 그 속성을 이 컴포넌트에 그대로 얹을 수 있다. 역할 분담표는 design.md 참조.
 *
 * ## 넣지 않은 prop
 * Figma 는 이 세트에 component property `hasIconStart` · `hasIconEnd` ·
 * `iconEnd`(instance swap) 를 더 갖고 있다. 요청 범위가 `isChecked` 축 하나이고
 * 두 변형 모두 두 슬롯이 켜진 상태여서 props 로 만들지 않았다. 발견 사실은
 * design.md 에 남겼다 — 필요해지면 그때 실제 값을 보고 추가한다. (원칙 1·2)
 */
export function ListRadio({
  isChecked = false,
  title,
  className = '',
  ...props
}: ListRadioProps) {
  return (
    <div
      className={['relative flex w-full items-center py-24', className].filter(Boolean).join(' ')}
      {...props}
    >
      <Divider className="absolute inset-x-0 bottom-0" />
      <div className="flex min-w-0 flex-1 items-center gap-16">
        <ListSlotRadio isChecked={isChecked} />
        <TextSetTitle size="sm" title={title} className="min-w-0 flex-1" />
        <Icon name="chevronRight-small" />
      </div>
    </div>
  );
}
