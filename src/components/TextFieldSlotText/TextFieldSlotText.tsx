import type {
  HTMLAttributes,
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { Icon } from '../Icon/Icon';
import { StateLayerFocused } from '../StateLayerFocused/StateLayerFocused';
import { TextFieldSlotEndItems } from '../TextFieldSlotEndItems/TextFieldSlotEndItems';

/** Figma variant 축 `state`. 값 3개는 컴포넌트 세트 13:2377 에 있는 것 그대로다. */
export type TextFieldSlotTextState = 'default' | 'focused' | 'done';

/**
 * `state` 와 `isTyping` 의 **실재하는 조합 4개만** 받는다.
 *
 * `get_metadata`(13:2377) 로 확인한 세트의 자식은 정확히 4개이고
 * `default`·`done` 에는 `isTyping=true` 짝이 없다. 3×2=6 이 아니다.
 * 없는 조합을 만들지 않기 위해 축 2개를 따로 두지 않고 유니온으로 묶었다.
 * (`TextFieldTextSet` 의 `StatusAndDisabled` 와 같은 방식, CLAUDE.md 원칙 1·2)
 */
type StateAndTyping =
  | { state?: 'default'; isTyping?: false }
  | { state: 'focused'; isTyping?: boolean }
  | { state: 'done'; isTyping?: false };

export type TextFieldSlotTextProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /**
   * 입력 자리에 놓이는 문구. Figma component property `text` 에 대응하고
   * Figma 기본값도 "플레이스홀더" 다.
   */
  children?: ReactNode;
  /**
   * 오른쪽 끝 슬롯의 내용. Figma component property `hasSlotEnd`(기본 true) 에 대응한다.
   *
   * Figma 의 그 자리는 `TextFieldSlot/End/Items` 인스턴스이고, 그 안은 다시
   * `Icon/line`(18:5191) **인스턴스 스왑 슬롯**이라 그릴 글리프가 지정돼 있지 않다
   * (`TextFieldSlotEndItems.design.md` 가 이미 판정해 둔 사실). 그래서 글리프는
   * 호출부가 넘긴다. 넘기지 않으면 슬롯 자체를 렌더하지 않는다 — Figma 의
   * `hasSlotEnd=false` 와 같은 결과다. boolean prop 을 따로 두지 않은 이유는
   * 이 prop 하나로 두 상태가 그대로 표현되기 때문이다. (원칙 2)
   */
  slotEnd?: ReactNode;
  /**
   * 지우기 버튼의 클릭 핸들러.
   * 버튼은 Figma 에 `state=focused, isTyping=true`(13:2394) 에만 있는
   * `close-circle-fill`(13:2401) 자리이고, 다른 조합에서는 렌더되지 않는다.
   */
  onClear?: MouseEventHandler<HTMLButtonElement>;
  /**
   * 지우기 버튼의 접근성 이름. 아이콘이 유일한 의미 전달자라 이름이 필요하다.
   * 기본값은 Figma 인스턴스 이름(`close-circle-fill`)이 뜻하는 동작의 한국어 표기다.
   */
  clearLabel?: string;
  /**
   * **실제 입력 모드.** 넘기면 문구 자리가 `<p>` 대신 `<input>` 이 되고,
   * 여기 담긴 속성이 그 `<input>` 에 그대로 전달된다 (`value`·`onChange`·
   * `placeholder`·`id`·`name` 등). 넘기지 않으면 기존과 완전히 같다 —
   * `children` 을 `<p>` 로 표시하는 진열 모드다.
   *
   * 두 모드를 나눈 이유는 이 컴포넌트가 두 가지 일을 겸하기 때문이다.
   * Storybook 은 Figma variant 4개를 **그림으로** 세워 보여야 해서 `<p>` 가 필요하고
   * (`● ● ● ● ● ●` 같은 문구는 값이 아니라 그림이다), 페이지는 타이핑되는
   * `<input>` 이 필요하다. 진열 모드를 지우면 앞쪽이 표현 불가가 된다.
   *
   * 입력 모드에서 달라지는 것은 셋뿐이다.
   * 1. 장식 커서(13:2389 · 13:2400)를 그리지 않는다 — 브라우저가 진짜 캐럿을 그리므로
   *    두 개가 겹쳐 보이게 된다.
   * 2. 포커스 링을 `state` prop 이 아니라 **실제 포커스**가 켠다 (아래 주석 참조).
   * 3. placeholder 색이 `text/disabled-onLight` 다 — Figma 근거는 아래 주석에 있다.
   */
  input?: InputHTMLAttributes<HTMLInputElement>;
} & StateAndTyping;

/**
 * Figma `TextFieldSlot/Text` 컴포넌트 세트 (node 13:2377).
 *
 * 입력 필드의 **입력 줄 한 칸**이다. 라벨·도움말은 여기 없다 —
 * 그 조립은 Wave 3 의 `TextField/Text`(13:2188)가 한다.
 *
 * 값 대조표와 판단 근거는 `TextFieldSlotText.design.md` 에 있다.
 *
 * ## 조합 4개가 만드는 차이
 *
 * | | 포커스 링 | 커서 | 문구 색 | 지우기 버튼 |
 * |---|---|---|---|---|
 * | `default` | 없음 | 없음 | `text/secondary` | 없음 |
 * | `focused` | 있음 | 문구 **앞** | `text/secondary` | 없음 |
 * | `focused` + `isTyping` | 있음 | 문구 **뒤** | `text/primary` | 있음 |
 * | `done` | 없음 | 없음 | `text/primary` | 없음 |
 *
 * ## 재사용한 Wave 1 컴포넌트
 * · 포커스 링 → `StateLayerFocused`. Figma 도 `StateLayer/Focused`(35:12806)
 *   **인스턴스**를 쓴다(13:2385 · 13:2395). 새로 그리지 않았다. (원칙 2)
 * · 오른쪽 끝 슬롯 → `TextFieldSlotEndItems` (`contentType="icon"`).
 * · 지우기 아이콘 → `Icon name="close-circle-fill" color="secondary"`.
 *   export SVG 의 fill 이 변수 `icon/secondary` 의 값과 같아서 `secondary` 다.
 *
 * ## 크기를 고정하지 않는다
 * Figma variant 4개는 전부 362×55 지만 둘 다 파생값이다.
 * · 폭 362 는 이 파일의 진열 폭이고 안의 `text` 가 FILL 이다 → `w-full`
 *   (`TextSetTitle` · `Divider` · `TextFieldTextSet` 과 같은 판단)
 * · 높이 55 는 상하 패딩(변수 `spacing/14`) 2개 + 본문 한 줄 높이 27 의 합이다
 *   (18 × 행간 1.5 = 27, 14 + 27 + 14 = 55). 제약이 아니라 hug 결과라서 옮기지 않았다
 *   (`TabItem` 이 높이 49 에 대해 세운 것과 같은 기준).
 *
 * ## a11y
 * 루트는 `<div>` 다. 이 컴포넌트는 문구를 **표시**할 뿐 `<input>` 이 아니다 —
 * Figma 의 문구는 텍스트 노드이고 상호작용 축도 `state` 하나뿐이다. 실제 입력
 * 요소로 만들지 여부는 이것을 조립하는 Wave 3 이 정한다 (원칙 1·2).
 * 지우기 버튼만 예외로 `<button>` 이다 — 근거는 design.md 참조.
 */
export function TextFieldSlotText({
  state = 'default',
  isTyping = false,
  children = '플레이스홀더',
  slotEnd,
  onClear,
  clearLabel = '지우기',
  input,
  className = '',
  ...props
}: TextFieldSlotTextProps) {
  const isFocused = state === 'focused';
  // 문구 색: default 와 focused(미입력)는 변수 text/secondary,
  // done 과 focused+입력중은 변수 text/primary 다.
  const textColor = state === 'done' || isTyping ? 'text-text-primary' : 'text-text-secondary';

  // 커서 13:2389 · 13:2400 — 세로 막대. Figma 는 가로 막대를 90도 돌려 표현하지만
  // 결과 기하가 같으므로 회전 없이 세로로 그린다.
  const cursor = (
    <span aria-hidden className="h-24 w-textfield-cursor-width shrink-0 rounded-100 bg-bg-brand" />
  );

  return (
    <div
      className={[
        // `group` 은 입력 모드의 포커스 링이 자손 <input> 의 포커스를 읽기 위한 것이다.
        // 진열 모드에서는 읽는 자식이 없어 아무 일도 하지 않는다 (Button.tsx 와 같은 방식).
        'group relative flex w-full flex-col justify-center',
        'rounded-4 bg-bg-tertiary px-16 py-14',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {/* 13:2385 · 13:2395 — Figma 가 쓰는 StateLayer/Focused 인스턴스 그대로.
          진열 모드는 `state` prop 이 켜고, 입력 모드는 **실제 포커스**가 켠다.
          입력 모드를 CSS(`group-focus-within`)로 돌린 이유: 아래 <input> 이 UA 기본
          포커스 링을 끄기 때문에, 링을 그리는 조건과 끄는 조건이 어긋나면 "포커스는
          가는데 표시가 없는" 상태가 만들어져 WCAG 2.4.7 에 미달한다. 둘을 같은
          셀렉터에 묶으면 그 간극이 생길 수 없다. `Button.tsx` 가 pressed 레이어에
          `hidden group-active:block` 을 쓴 것과 같은 이유다. */}
      {input ? (
        <StateLayerFocused className="hidden group-focus-within:block" />
      ) : isFocused ? (
        <StateLayerFocused />
      ) : null}

      {/* content 13:2379 등 */}
      <div className="relative flex w-full items-center gap-16">
        {/* wrapper 13:2380 등 */}
        <div className="flex min-w-0 flex-1 items-center">
          {/* text 13:2381 등 — 넘치는 문구는 잘리고 말줄임표가 붙는다. */}
          <div className="flex min-w-0 flex-1 items-center overflow-clip">
            {input ? (
              <input
                {...input}
                className={[
                  // 리셋 3개. 시각 값이 아니라 UA 기본 스타일을 걷어내는 것이다
                  // (`min-w-0` 을 레이아웃 리셋으로 둔 것과 같은 성격).
                  // · bg-transparent — 배경은 이 슬롯의 루트가 bg-bg-tertiary 로 이미 그렸다.
                  //   input 이 자기 배경을 덧그리면 그 위에 두 번 칠하는 것이 된다.
                  // · outline-none — 그 자리를 위의 StateLayerFocused 가 대신 그린다.
                  //   끄는 조건과 그리는 조건이 같은 셀렉터에 묶여 있다 (위 주석).
                  // · w-full — Figma 13:2381 `text` 가 FILL 인 것을 옮긴 것이다.
                  'w-full min-w-0 bg-transparent outline-none',
                  // 타이포는 진열 모드의 <p> 와 같은 유틸리티다.
                  'truncate font-body-large',
                  // placeholder 색은 이 화면의 Figma 근거가 있다 — 27818:7077 의 문구
                  // "아이디를 입력해 주세요" 가 변수 text/disabled-onLight 다
                  // (state=default 의 text/secondary 가 아니다).
                  'placeholder:text-text-disabled-on-light',
                  textColor,
                ].join(' ')}
              />
            ) : (
              <>
                {isFocused && !isTyping ? cursor : null}
                <p className={['truncate break-words font-body-large', textColor].join(' ')}>
                  {children}
                </p>
                {isTyping ? cursor : null}
              </>
            )}
          </div>
          {/* close-circle-fill 13:2401 — 슬롯 바깥이 아니라 wrapper 소속이다.
              입력 모드에서는 `onClear` 가 있을 때만 그린다. 진열 모드의 버튼은
              variant 를 보여주는 그림이라 핸들러가 없어도 되지만, 입력 모드의
              버튼은 눌러서 값이 비워지지 않으면 동작하지 않는 컨트롤이 된다. */}
          {isTyping && (!input || onClear) ? (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={onClear}
              className="flex shrink-0 items-center"
            >
              <Icon name="close-circle-fill" color="secondary" />
            </button>
          ) : null}
        </div>

        {/* TextFieldSlot/End/Items 13:2383 등 */}
        {slotEnd ? (
          <TextFieldSlotEndItems contentType="icon" className="shrink-0">
            {slotEnd}
          </TextFieldSlotEndItems>
        ) : null}
      </div>
    </div>
  );
}
