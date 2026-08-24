import type {
  HTMLAttributes,
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { Icon } from '../Icon/Icon';
import { StateLayerFocused } from '../StateLayerFocused/StateLayerFocused';
import { TextFieldSlotEndItems } from '../TextFieldSlotEndItems/TextFieldSlotEndItems';

/** Figma variant 축 `state`. 값 3개는 컴포넌트 세트 13:2347 에 있는 것 그대로다. */
export type TextFieldSlotPasswordState = 'default' | 'focused' | 'done';

/**
 * `state` 와 `isTyping` 의 **실재하는 조합 4개만** 받는다.
 *
 * `get_metadata`(13:2347) 로 확인한 세트의 자식은 정확히 4개이고
 * `default`·`done` 에는 `isTyping=true` 짝이 없다. 3×2=6 이 아니다.
 * 없는 조합을 만들지 않기 위해 축 2개를 따로 두지 않고 유니온으로 묶었다.
 * (`TextFieldTextSet` 의 `StatusAndDisabled` 와 같은 방식, CLAUDE.md 원칙 1·2)
 */
type StateAndTyping =
  | { state?: 'default'; isTyping?: false }
  | { state: 'focused'; isTyping?: boolean }
  | { state: 'done'; isTyping?: false };

export type TextFieldSlotPasswordProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /**
   * 입력 자리에 놓이는 문구. Figma component property `text` 에 대응하고
   * Figma 기본값도 가려진 글자 6개("● ● ● ● ● ●")다.
   *
   * ⚠ Figma 는 가림 문자를 **텍스트 내용으로** 넣어 두었다. 실제 마스킹
   * (`<input type="password">`)이 아니다. 그대로 옮겼다 (원칙 1).
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
   * 버튼은 Figma 에 `state=focused, isTyping=true`(13:2368) 에만 있는
   * `close-circle-fill`(13:2375) 자리이고, 다른 조합에서는 렌더되지 않는다.
   */
  onClear?: MouseEventHandler<HTMLButtonElement>;
  /**
   * 지우기 버튼의 접근성 이름. 아이콘이 유일한 의미 전달자라 이름이 필요하다.
   * 기본값은 Figma 인스턴스 이름(`close-circle-fill`)이 뜻하는 동작의 한국어 표기다.
   */
  clearLabel?: string;
  /**
   * **실제 입력 모드.** 넘기면 문구 자리가 `<p>` 대신 `<input>` 이 되고,
   * 여기 담긴 속성이 그 `<input>` 에 그대로 전달된다 (`type`·`value`·`onChange`·
   * `placeholder`·`id`·`name` 등). 넘기지 않으면 기존과 완전히 같다.
   *
   * 근거와 두 모드를 나눈 이유는 `TextFieldSlotText` 의 같은 prop 주석과 같다.
   * 여기서는 이 컴포넌트만의 차이가 하나 더 있다 — 진열 모드의 `text` 프레임
   * (13:2351)은 Figma 에서 **hug** 지만, 입력 모드에서는 FILL 로 바꾼다.
   * hug 는 `● ● ● ● ● ●` 라는 고정 샘플 문구의 폭이고, 타이핑되는 입력에는
   * 채울 폭이 있어야 한다. Figma 값을 버린 것이 아니라 값이 아닌 것(샘플 문구의
   * 결과 폭)을 옮기지 않은 것이다.
   *
   * ⚠ 진열 모드의 `● ● ● ● ● ●` 는 **그려진 가림 문자**이고 마스킹이 아니다.
   *   실제 마스킹은 입력 모드에서 `type="password"` 를 넘겼을 때 브라우저가 한다.
   */
  input?: InputHTMLAttributes<HTMLInputElement>;
} & StateAndTyping;

/**
 * Figma `TextFieldSlot/Password` 컴포넌트 세트 (node 13:2347).
 *
 * 비밀번호 입력 필드의 **입력 줄 한 칸**이다. 라벨·도움말은 여기 없다 —
 * 그 조립은 Wave 3 의 `TextField/Password`(13:2167)가 한다.
 *
 * 값 대조표와 판단 근거는 `TextFieldSlotPassword.design.md` 에 있다.
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
 * ## `TextFieldSlot/Text`(13:2377) 와 다른 점은 두 가지뿐이다
 * 1. `text` 프레임이 FILL 이 아니라 hug 다 (13:2351 등이 폭 117 로 내용에 맞는다).
 *    그래서 말줄임표 처리가 없고, 입력중에는 `wrapeer` 가 `justify-between` 으로
 *    지우기 버튼을 오른쪽 끝에 민다.
 * 2. Figma 기본 문구가 가려진 글자다.
 *
 * (Figma 의 프레임 이름 오타 `wrapeer` 는 원본 그대로다. 코드에는 옮기지 않았다.)
 *
 * ## 재사용한 Wave 1 컴포넌트
 * · 포커스 링 → `StateLayerFocused`. Figma 도 `StateLayer/Focused`(35:12806)
 *   **인스턴스**를 쓴다(13:2361 · 13:2369). 새로 그리지 않았다. (원칙 2)
 * · 오른쪽 끝 슬롯 → `TextFieldSlotEndItems` (`contentType="icon"`).
 * · 지우기 아이콘 → `Icon name="close-circle-fill" color="secondary"`.
 *   export SVG 가 `TextFieldSlot/Text` 쪽(13:2401)과 문자 단위로 같다.
 *
 * ## 크기를 고정하지 않는다
 * Figma variant 4개는 전부 360×55 지만 둘 다 파생값이다.
 * · 폭 360 은 이 파일의 모바일 페이지 폭이고 안의 `wrapeer` 가 FILL 이다 → `w-full`
 *   (`TextSetTitle` · `Divider` · `TextFieldTextSet` 과 같은 판단)
 * · 높이 55 는 상하 패딩(변수 `spacing/14`) 2개 + 본문 한 줄 높이 27 의 합이다
 *   (18 × 행간 1.5 = 27, 14 + 27 + 14 = 55). 제약이 아니라 hug 결과라서 옮기지 않았다.
 *
 * ## a11y
 * 루트는 `<div>` 다. 이 컴포넌트는 문구를 **표시**할 뿐 `<input type="password">`
 * 가 아니다 — Figma 의 가림 문자는 텍스트 노드의 내용이고 상호작용 축도
 * `state` 하나뿐이다. 실제 입력 요소로 만들지 여부는 Wave 3 이 정한다 (원칙 1·2).
 * 지우기 버튼만 예외로 `<button>` 이다 — 근거는 design.md 참조.
 */
export function TextFieldSlotPassword({
  state = 'default',
  isTyping = false,
  children = '● ● ● ● ● ●',
  slotEnd,
  onClear,
  clearLabel = '지우기',
  input,
  className = '',
  ...props
}: TextFieldSlotPasswordProps) {
  const isFocused = state === 'focused';
  // 문구 색: default 와 focused(미입력)는 변수 text/secondary,
  // done 과 focused+입력중은 변수 text/primary 다.
  const textColor = state === 'done' || isTyping ? 'text-text-primary' : 'text-text-secondary';

  // 커서 13:2365 · 13:2374 — 세로 막대. Figma 는 가로 막대를 90도 돌려 표현하지만
  // 결과 기하가 같으므로 회전 없이 세로로 그린다.
  const cursor = (
    <span aria-hidden className="h-24 w-textfield-cursor-width shrink-0 rounded-100 bg-bg-brand" />
  );

  return (
    <div
      className={[
        // `group` 은 입력 모드의 포커스 링이 자손 <input> 의 포커스를 읽기 위한 것이다.
        'group relative flex w-full flex-col justify-center',
        'rounded-4 bg-bg-tertiary px-16 py-14',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {/* 13:2361 · 13:2369 — Figma 가 쓰는 StateLayer/Focused 인스턴스 그대로.
          진열 모드는 `state` prop 이 켜고, 입력 모드는 실제 포커스가 켠다.
          근거는 `TextFieldSlotText` 의 같은 자리 주석과 같다 (WCAG 2.4.7). */}
      {input ? (
        <StateLayerFocused className="hidden group-focus-within:block" />
      ) : isFocused ? (
        <StateLayerFocused />
      ) : null}

      {/* content 13:2349 등 */}
      <div className="relative flex w-full items-center gap-16">
        {/* wrapeer 13:2350 등 — 입력중에만 지우기 버튼을 오른쪽 끝으로 민다. */}
        <div
          className={[
            'flex min-w-0 flex-1 items-center',
            isTyping ? 'justify-between' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* text 13:2351 등 — 진열 모드는 Text 와 달리 hug 다 (말줄임표 처리가 없다).
              입력 모드만 FILL 로 바꾼다 — 근거는 위 `input` prop 주석. */}
          <div className={['flex items-center', input ? 'min-w-0 flex-1' : 'shrink-0'].join(' ')}>
            {input ? (
              <input
                {...input}
                className={[
                  // 리셋 3개의 근거는 `TextFieldSlotText` 의 같은 자리 주석과 같다.
                  'w-full min-w-0 bg-transparent outline-none',
                  'font-body-large',
                  // placeholder 색 근거: 27818:7078 의 문구가 변수 text/disabled-onLight 다.
                  'placeholder:text-text-disabled-on-light',
                  textColor,
                ].join(' ')}
              />
            ) : (
              <>
                {isFocused && !isTyping ? cursor : null}
                <p
                  className={['break-words whitespace-nowrap font-body-large', textColor].join(' ')}
                >
                  {children}
                </p>
                {isTyping ? cursor : null}
              </>
            )}
          </div>
          {/* close-circle-fill 13:2375 — 슬롯 바깥이 아니라 wrapeer 소속이다.
              입력 모드에서는 `onClear` 가 있을 때만 그린다 — 근거는
              `TextFieldSlotText` 의 같은 자리 주석과 같다. */}
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

        {/* TextFieldSlot/End/Items 13:2353 등 */}
        {slotEnd ? (
          <TextFieldSlotEndItems contentType="icon" className="shrink-0">
            {slotEnd}
          </TextFieldSlotEndItems>
        ) : null}
      </div>
    </div>
  );
}
