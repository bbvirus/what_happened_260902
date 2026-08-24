import { useState } from 'react';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import { TextFieldSlotPassword } from '../TextFieldSlotPassword/TextFieldSlotPassword';
import { TextFieldTextSet } from '../TextFieldTextSet/TextFieldTextSet';

/**
 * Figma 에 **실재하는 조합 3개만** 받는다.
 *
 * `get_metadata`(13:2167) 로 확인한 세트의 자식은 정확히 3개다.
 * 축은 이름상 3개(`isTyping` · `isDisabled` · `isError`)지만 2×2×2=8 이 아니다.
 *
 * | 노드 | isTyping | isDisabled | isError |
 * |---|---|---|---|
 * | `13:2168` | false | false | false |
 * | `13:2178` | false | **true** | false |
 * | `13:2183` | false | **true** | **true** |
 *
 * 자매 컴포넌트 `TextField/Text`(13:2188)와 조합 목록이 **문자 단위로 같다.**
 * 막는 것도 같다: `isError` 단독(활성 + 에러)은 Figma 에 없고, `isTyping` 은 축 이름만
 * 있고 값이 `false` 하나뿐이라 prop 으로 열지 않았다. 판단은 하지 않고 관측 사실만
 * `TextFieldPassword.design.md` 에 적었다. (CLAUDE.md 원칙 1)
 */
type DisabledAndError =
  | { isDisabled?: false; isError?: false }
  | { isDisabled: true; isError?: boolean };

export type TextFieldPasswordProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /**
   * 입력 자리에 놓이는 문구. `TextFieldSlotPassword` 의 `children` 으로 그대로 넘어간다.
   * 넘기지 않으면 슬롯이 자기 기본값("● ● ● ● ● ●")을 쓴다 — Figma 기본값과 같다.
   *
   * ⚠ 이것은 **가림 문자를 그린 텍스트**이고 실제 마스킹이 아니다.
   *   `TextFieldSlotPassword` 가 Wave 2a 에서 세운 성질을 그대로 물려받는다.
   */
  children?: ReactNode;
  /**
   * 상단 라벨. Figma component property `hasLabel`(기본 true) 에 대응한다.
   * 넘기지 않으면 라벨 단을 렌더하지 않는다 — Figma 의 `hasLabel=false` 와 같은 결과다.
   */
  label?: ReactNode;
  /**
   * 하단 보조 문구. Figma component property `hasSupporting`(기본 true) 에 대응한다.
   * 넘기지 않으면 하단 단을 렌더하지 않는다.
   */
  supporting?: ReactNode;
  /**
   * 라벨 오른쪽의 필수 표시 `*` (`I13:2170;35:14373`). 기본값 `true` 는 이 prop 이
   * 없던 때의 렌더 결과와 같다. 축을 연 근거는 `TextFieldText` 의 같은 prop 주석에
   * 있다 (`page/Login` 27818:7077 이 이 노드를 끈 반례).
   *
   * 이 화면(27818:7078)은 `*` 가 **켜져 있다.** 기본값을 그대로 쓰면 된다.
   */
  required?: boolean;
  /**
   * **실제 입력 모드.** 넘기면 입력 줄이 `<p>` 대신 `<input>` 이 되고, 여기 담긴
   * 속성이 그 `<input>` 에 전달된다. 근거는 `TextFieldText` 의 같은 prop 주석과 같다.
   *
   * `type` 은 넘기지 않는다 — 이 컴포넌트가 표시/숨김 토글에 맞춰
   * `password` ↔ `text` 로 직접 정한다. 넘겨도 무시된다.
   */
  input?: InputHTMLAttributes<HTMLInputElement>;
  /**
   * 지우기 버튼의 클릭 핸들러. 넘기지 않으면 버튼이 렌더되지 않는다.
   * 근거는 `TextFieldText` 의 같은 prop 주석과 같다.
   */
  onClear?: () => void;
} & DisabledAndError;

/**
 * Figma `TextField/Password` 컴포넌트 세트 (node 13:2167, 섹션 "TextField").
 *
 * 라벨 · 가려진 입력 줄 · 하단 보조 문구를 세로로 조립한 비밀번호 필드다.
 * 값 대조표와 판단 근거는 `TextFieldPassword.design.md` 에 있다.
 *
 * ## `TextField/Text`(13:2188)와 다른 점은 두 가지뿐이다
 * 1. 입력 줄이 `TextFieldSlotPassword`(13:2347) 다 — 문구가 hug 이고 말줄임표가 없다.
 * 2. 오른쪽 끝 슬롯에 `visibilityOff` 아이콘이 **있다.** Text 쪽에는 슬롯 자체가 없다.
 * 나머지(라벨 단, 간격, 세 variant 의 색 규칙, 에러 테두리)는 전부 같다.
 *
 * ## 오른쪽 끝 아이콘 — Figma 가 지정한 값이다. 추측이 아니다
 * Wave 2a 는 `TextFieldSlot/End/Items` 안이 `Icon/line`(13:2221) **인스턴스 스왑
 * 슬롯**이라 글리프가 비어 있다고 판정했다. 그 스왑을 **채운 것이 이 컴포넌트다.**
 * `get_design_context`(13:2168 · 13:2178 · 13:2183)가 세 variant 모두
 * `Icon/visibilityOff-line` 으로 이름 붙은 asset 을 방출했고, export SVG 를 받아
 * `Icon.tsx` 의 `visibilityOff` 글리프와 대조해 **path 3개가 문자 단위로 같음**을
 * 확인했다(fill 만 `currentColor` 로 치환돼 있다). 그래서 새로 그리지 않고
 * `Icon` 을 재사용했다. (원칙 1·2)
 *
 * 색도 세 variant 가 **같다** — export 3개의 fill 이 전부 변수 `icon/secondary` 값이다
 * (disabled·error 에서도 흐려지지 않는다). 실측 사실이라 그대로 옮겼다.
 *
 * 토글 동작(`visibility` ↔ `visibilityOff`)은 **넣지 않았다.** Figma 의 세 variant 는
 * 모두 `visibilityOff` 한 가지이고, 눈을 뜬 짝도 누르는 상태도 없다.
 * 컴포넌트 설명이 "표시/숨김 기능을 제공합니다" 라고 적고 있으나 그 상태를 그린
 * variant 가 없어, 동작과 시각을 지어내지 않았다. (원칙 1·2)
 *
 * ## a11y — 이 컴포넌트는 아직 `<input type="password">` 가 아니다
 * 결정과 근거 전문은 design.md 의 "a11y 결정" 절에 있다.
 * `<label>` · `aria-describedby` 를 달지 않은 이유도 거기에 있다.
 */
export function TextFieldPassword({
  children,
  label,
  supporting,
  required = true,
  input,
  onClear,
  isDisabled = false,
  isError = false,
  className = '',
  ...props
}: TextFieldPasswordProps) {
  const [isFocused, setIsFocused] = useState(false);
  // 표시/숨김 토글. Figma 는 `visibilityOff` 한 가지만 그려 두었지만, 컴포넌트 설명이
  // *"필요에 따라 입력값 표시/숨김 기능을 제공합니다"* 라고 그 기능을 명시하고,
  // 짝이 되는 `visibility` 글리프도 이 저장소의 `Icon` 에 이미 있다 (같은 Figma
  // `Icon` 섹션에서 온 12개 중 하나, 색도 같은 `icon/secondary`). 그래서 동작을
  // 지어낸 것이 아니라 적힌 기능에 이미 있는 글리프를 붙인 것이다.
  // 눈을 뜬 상태의 **레이아웃**은 Figma 에 없지만 글리프 크기가 같은 24 정사각이라
  // 바뀌는 픽셀이 글리프뿐이다.
  const [isRevealed, setIsRevealed] = useState(false);
  const hasValue = input !== undefined && String(input.value ?? '') !== '';

  // 슬롯 인스턴스가 가리키는 variant. 노드 id 로 확인했다:
  // 13:2171·13:2181 의 content 는 13:2349 (= 13:2348 `state=default` 의 자식),
  // 13:2186 의 content 는 13:2355 (= 13:2354 `state=done` 의 자식) 이다.
  // 입력 모드에서 이 축을 실제 상호작용에 매핑하는 표는
  // `TextFieldText` 의 같은 자리 주석에 있다 (세트 13:2347 의 조합 4개와 1:1).
  const slotVariant = input
    ? isFocused
      ? ({ state: 'focused', isTyping: hasValue } as const)
      : hasValue
        ? ({ state: 'done' } as const)
        : ({ state: 'default' } as const)
    : isError
      ? ({ state: 'done' } as const)
      : ({ state: 'default' } as const);

  const supportingId =
    input?.id !== undefined && supporting !== undefined ? `${input.id}-supporting` : undefined;

  // isDisabled 且 !isError 일 때만 슬롯 문구 색이 variant 기본값과 다르다.
  // 근거는 TextFieldText.tsx 의 같은 자리 주석과 동일하다.
  const fieldText =
    isDisabled && !isError ? (
      <span className="text-text-disabled-on-light">{children ?? '● ● ● ● ● ●'}</span>
    ) : (
      children
    );

  return (
    // 13:2168 등 — 세로 auto-layout, gap = 변수 spacing/8.
    <div className={['flex w-full flex-col', 'gap-8', className].filter(Boolean).join(' ')} {...props}>
      {/* wrapper 13:2169 등 — gap = 변수 spacing/12 */}
      <div className="flex w-full flex-col gap-12">
        {label !== undefined ? (
          // [Field Text Set] Label 13:2170 등 — 주 컴포넌트 35:14369
          <div className="flex w-full items-end">
            {/* content I13:2170;35:14371 — 변수 font/label/large-strong 을 이 단이 건다 */}
            <div className="font-label-large-strong flex shrink-0 items-center gap-textfield-label-gap">
              {/* 입력 모드에서 id 가 있으면 <label> 이다 — 근거는 TextFieldText 와 같다. */}
              {input?.id !== undefined ? (
                <label htmlFor={input.id} className="shrink-0 whitespace-nowrap text-text-primary">
                  {label}
                </label>
              ) : (
                <p className="shrink-0 whitespace-nowrap text-text-primary">{label}</p>
              )}
              {/* I13:2170;35:14373 — 필수 표시. `required` prop 이 켜고 끈다.
                  aria-hidden 근거는 TextFieldText 의 같은 자리 주석과 같다. */}
              {required ? (
                <p aria-hidden className="shrink-0 text-text-brand">
                  *
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Text Field Slot/ Password 13:2171 등 */}
        <div className="relative w-full">
          <TextFieldSlotPassword
            {...slotVariant}
            onClear={onClear}
            // 진열 모드는 Figma 그대로 **누를 수 없는 아이콘**이다 (variant 가 하나뿐이라
            // 누른 결과가 그려져 있지 않다). 입력 모드에서만 <button> 이 된다.
            slotEnd={
              input ? (
                <button
                  type="button"
                  // 이 버튼은 입력의 내용이 아니라 표시 방식을 바꾼다. aria-pressed 로
                  // 토글임을 알리고, 이름은 "지금 누르면 무엇이 되는지"로 적는다.
                  aria-pressed={isRevealed}
                  aria-label={isRevealed ? '비밀번호 숨기기' : '비밀번호 표시'}
                  onClick={() => setIsRevealed((shown) => !shown)}
                  className="flex shrink-0 items-center"
                >
                  <Icon name={isRevealed ? 'visibility' : 'visibilityOff'} color="secondary" />
                </button>
              ) : (
                <Icon name="visibilityOff" color="secondary" />
              )
            }
            input={
              input
                ? {
                    ...input,
                    // type 은 호출부가 정하지 않는다 — 위 토글이 정한다.
                    type: isRevealed ? 'text' : 'password',
                    required: input.required ?? required,
                    'aria-describedby': input['aria-describedby'] ?? supportingId,
                    onFocus: (event) => {
                      setIsFocused(true);
                      input.onFocus?.(event);
                    },
                    onBlur: (event) => {
                      setIsFocused(false);
                      input.onBlur?.(event);
                    },
                  }
                : undefined
            }
          >
            {fieldText}
          </TextFieldSlotPassword>

          {/* 13:2186 의 stroke — 변수 border/negative, 두께 1, 반경 4.
              안쪽 stroke 라 높이가 그대로여야 해서 오버레이로 겹쳐 그린다. */}
          {isError ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-4 border-hairline border-solid border-border-negative"
            />
          ) : null}
        </div>
      </div>

      {/* TextFieldSlot/Bottom/Items 13:2172 등 → 안쪽 TextFieldTextSet 27738:6501 */}
      {supporting !== undefined ? (
        // id 는 위 aria-describedby 가 가리키는 대상이다.
        isError ? (
          <TextFieldTextSet id={supportingId} status="error" aria-live="polite">
            {supporting}
          </TextFieldTextSet>
        ) : isDisabled ? (
          <TextFieldTextSet id={supportingId} isDisabled aria-live="polite">
            <span className="text-text-disabled-on-light">{supporting}</span>
          </TextFieldTextSet>
        ) : (
          <TextFieldTextSet id={supportingId} aria-live="polite">
            {supporting}
          </TextFieldTextSet>
        )
      ) : null}
    </div>
  );
}
