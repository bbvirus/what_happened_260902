import type { HTMLAttributes, ReactNode } from 'react';
import { TextFieldTextSet } from '../TextFieldTextSet/TextFieldTextSet';

/** Figma variant 축 `contentType`. 값 2개는 컴포넌트 세트에 있는 것 그대로다. */
export type TextFieldSlotBottomItemsContentType = 'text' | 'checkbox';

/**
 * 비선택 체크박스 박스 — 선만 있는 둥근 사각형. 16 뷰박스 좌표다.
 *
 * 출처: `get_design_context`(13:2225) 가 `ListSlot/Checkbox/small/false/false`
 * (`I13:2226;13:3940`) 에 물려 준 asset URL 을 그대로 받아 온 export SVG 의 `d` 값이다.
 * 이동·보정 0건. `d` 값은 CLAUDE.md 토큰 규칙의 스코프 제외(SVG 기하) 대상이다.
 *
 * Figma 가 이 박스를 stroke 를 가진 vector 로 만들었고 export 시 그 stroke 가
 * 아웃라인으로 확장돼 나온다 — 그래서 코너 반경과 선 두께가 `d` 안에 들어가 있다.
 * `ListSlotCheckbox.tsx` 가 24 짜리 형제 variant 에 쓰는 것과 같은 방식이다.
 */
const CHECKBOX_BOX_OUTLINE_SMALL =
  'M13 14.5V16H3V14.5H13ZM14.5 13V3C14.5 2.17157 13.8284 1.5 13 1.5H3C2.17157 1.5 1.5 2.17157 1.5 3V13C1.5 13.8284 2.17157 14.5 3 14.5V16L2.8457 15.9961C1.26055 15.9158 0 14.6051 0 13V3C0 1.34315 1.34315 0 3 0H13C14.6569 0 16 1.34315 16 3V13C16 14.6569 14.6569 16 13 16V14.5C13.8284 14.5 14.5 13.8284 14.5 13Z';

export interface TextFieldSlotBottomItemsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Figma variant 축 `contentType`.
   * 기본값 `text` 는 세트 13:2222 의 첫 variant(13:2223)이며
   * `get_design_context`(13:2223) 가 방출한 기본값과 같다.
   */
  contentType?: TextFieldSlotBottomItemsContentType;
  /**
   * 슬롯의 문구. 두 variant 모두 텍스트 자리를 정확히 하나 갖는다.
   *
   * · `contentType="text"` — 보조 문구. `TextFieldTextSet` 의 `children` 으로 그대로 넘어간다.
   *   Figma 기본 문구는 "도움말 메세지" 다.
   * · `contentType="checkbox"` — 체크박스 라벨. Figma 기본 문구는 "레이블" 이고
   *   서식(`font/label/medium` · `text/primary`)은 이 컴포넌트가 건다.
   */
  children: ReactNode;
}

/**
 * Figma `TextFieldSlot/Bottom/Items` 컴포넌트 세트 (node 13:2222, 섹션 "TextField").
 *
 * 입력 필드 아래에 붙는 슬롯이다. 변형은 축 하나(`contentType`) × 2개뿐이다.
 * 매핑표와 값의 출처는 `TextFieldSlotBottomItems.design.md` 에 있다.
 *
 * · `contentType="text"` (13:2223) — 자식이 `TextFieldTextSet` 인스턴스 하나다
 * · `contentType="checkbox"` (13:2225) — 자식이 `[Checkbox]` 인스턴스 하나다
 *
 * ## 재사용 판정 1 — `TextFieldTextSet` 은 재사용했다
 * `get_design_context`(13:2223) 가 인스턴스 `27738:6501` 의 **주 컴포넌트를
 * 35:14458 `TextFieldTextSet` 으로 확인해 주었고**, 이 저장소의
 * `TextFieldTextSet.tsx` 가 옮긴 세트와 같은 노드다. 안쪽 노드 id 도 전부 일치한다
 * (`35:14662` content · `35:14663` wrapper · `35:14664` iconarea ·
 * `35:14665` Icon/circle-fill · `35:14666` supportingText · `35:14667` text).
 * 물려 있는 값도 기본 variant 그대로다 — 본문색 `text/secondary`,
 * 아이콘 `Icon/circle-fill`, 아이콘 있음. 즉 `status="default"` ·
 * `hasIconStart={true}` 이고 둘 다 `TextFieldTextSet` 의 기본값이라 넘기지 않는다.
 * 보조 텍스트를 다시 그리지 않았다. (CLAUDE.md 원칙 2)
 *
 * ## 재사용 판정 2 — `ListCheckbox` · `ListSlotCheckbox` 는 재사용할 수 없었다
 * 셋 다 다른 컴포넌트다. 확인한 근거는 이렇다.
 *
 * | 후보 | Figma 노드 | 크기 | 판정 |
 * |---|---|---|---|
 * | 이 자리의 인스턴스 | `13:2226` `[Checkbox]` (주 컴포넌트 `13:3929`) | 61×40 | 체크박스 + 라벨 |
 * | `ListCheckbox` | `60:23751` `List/Checkbox` | 362×72 | 구분선 · 셰브론이 붙은 리스트 행. 다른 컴포넌트다 |
 * | `ListSlotCheckbox` | `20:5754` `ListSlot/Checkbox` | 24×24 | 박스 그림만. 크기 축이 다르다 (아래) |
 *
 * `[Checkbox]`(13:3929) 안의 박스는 `ListSlot/Checkbox/small/false/false` 이고
 * 20×20 이다. 그런데 이 저장소의 `ListSlotCheckbox` 가 옮긴 세트 20:5754 는
 * `get_metadata` 상 variant 가 4개(`isChecked` × `isDisabled`)뿐이고 **전부 24×24 다
 * — `size` 축이 없다.** 즉 `small` 은 이 저장소가 아직 옮기지 않은 variant 다.
 * (주 컴포넌트 13:3929 와 20:5764 는 다른 페이지에 있어 `get_metadata` 가
 * "invalid node selection" 을 돌려준다. 그래서 인스턴스 쪽에서만 확인했다.)
 *
 * 크기만 줄여 재사용할 수 없는 이유는 기하가 비례하지 않아서다. export 실측:
 * · 24 variant — 상자 24 안에 박스 20, 코너 반경 4, 선 두께 1.5 (여백 2)
 * · small variant — 상자 20 안에 박스 16, 코너 반경 3, 선 두께 1.5 (여백 2)
 * 24 짜리를 20 으로 축소하면 박스 16.67 · 반경 3.33 · 선 두께 1.25 가 되어 셋 다
 * 어긋난다. 여백만 2 로 같고 나머지가 비례하지 않는다.
 * `TextFieldTextSet` 이 24 뷰박스인 `Icon` 을 16 자리에 쓰지 않은 것과 같은 판정이다. (원칙 1)
 *
 * 재사용하려면 `ListSlotCheckbox` 에 `size` 축을 추가해야 하는데, 기존 컴포넌트
 * 수정은 이 작업의 범위 밖이라 하지 않았다. 무엇이 왜 필요한지는 반환 보고와
 * design.md 에 적었다. (원칙 3)
 *
 * ## 루트에 폭을 걸지 않는 이유
 * Figma 의 두 심볼 폭(362 · 61)은 hug/FILL 결과다. `text` 쪽 자식은 FILL 이고
 * `checkbox` 쪽 자식은 hug 다. 루트는 블록 요소라 부모 폭을 그대로 받으므로
 * 폭 유틸리티를 넣지 않았다 — `TextFieldSlotEndItems` 가 24×24 · 14×19 에 대해
 * 세운 것과 같은 기준이다. `checkbox` 자식에 `shrink-0` 을 두어 Figma 대로 왼쪽에 붙는다.
 *
 * ## 이 컴포넌트는 체크박스가 아니라 체크박스의 그림이다
 * Figma 인스턴스 13:2226 안에 상호작용 관련 노드가 하나도 없다 — hit area ·
 * 상태 레이어가 전부 없다. 세트 13:2222 의 축도 `contentType` 하나뿐이라
 * 선택/비활성 variant 자체가 없다(Figma 에 있는 것은 비선택·활성 1개다).
 * 그래서 없는 축을 prop 으로 만들지 않았다 (원칙 2).
 * 시맨틱(`<input type="checkbox">` 또는 `role="checkbox"` + `aria-checked`),
 * 라벨 연결, 키보드 조작, 포커스 표시는 **전부 호스트의 책임**이다.
 * `...props` 를 루트에 전개하므로 호스트가 그대로 얹을 수 있다.
 * `ListSlotCheckbox` · `ListCheckbox` 가 세운 규칙과 같다.
 */
export function TextFieldSlotBottomItems({
  contentType = 'text',
  children,
  className = '',
  ...props
}: TextFieldSlotBottomItemsProps) {
  return (
    // 13:2223 · 13:2225 둘 다 flex · items-start 이고 자식이 1개라 gap 이 없다.
    <div className={['flex items-start', className].filter(Boolean).join(' ')} {...props}>
      {contentType === 'text' ? (
        // 인스턴스 27738:6501 — 주 컴포넌트 35:14458. status·hasIconStart 는 기본값 그대로다.
        <TextFieldTextSet>{children}</TextFieldTextSet>
      ) : (
        // 인스턴스 13:2226 `[Checkbox]` — flex · items-center · gap = spacing/4 · py = 10.
        //
        // 상하 패딩 10 은 전용 토큰 --spacing-textfield-bottomitems-checkbox-inset-y 를 쓴다.
        //    Figma 원값 10 은 변수 바인딩이 아니고 (get_variable_defs(13:2225) 는
        //    spacing/4 만 돌려준다) spacing scale 13단에도 10 이 없다. 값이 같은 기존
        //    토큰 2개(--spacing-header-item-inset-y · --spacing-statusbar-inset-top)는
        //    각각 Header · OSBarTopNavigation 전용으로 선언돼 있어 여기서 쓰면 그
        //    선언과 어긋난다 (spacing.tokens.css 가 "값이 같아서가 아니라 축이 같아서"
        //    합친다고 못박아 뒀다). 그래서 `/sync-tokens` 가 세 번째 축으로 전용 토큰을
        //    추가했고, 이 행의 높이는 10 + 20 + 10 = 40 으로 Figma 와 일치한다.
        <div className="py-textfield-bottomitems-checkbox-inset-y flex shrink-0 items-center gap-4">
          {/* ListSlot/Checkbox/small I13:2226;13:3940 — 상자 20, 그 안의 글리프 16.
              여백 2 를 리터럴로 적지 않고 20 상자 안에서 가운데 정렬로 만든다. */}
          <span className="flex size-20 shrink-0 items-center justify-center">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="size-16 shrink-0"
            >
              <path d={CHECKBOX_BOX_OUTLINE_SMALL} className="fill-icon-secondary" />
            </svg>
          </span>

          {/* label I13:2226;13:3941 — 변수 font/label/medium · text/primary */}
          <span className="font-label-medium text-text-primary whitespace-nowrap">{children}</span>
        </div>
      )}
    </div>
  );
}
