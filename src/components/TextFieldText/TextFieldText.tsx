import { useState } from 'react';
import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { TextFieldSlotText } from '../TextFieldSlotText/TextFieldSlotText';
import { TextFieldTextSet } from '../TextFieldTextSet/TextFieldTextSet';

/**
 * Figma 에 **실재하는 조합 3개만** 받는다.
 *
 * `get_metadata`(13:2188) 로 확인한 세트의 자식은 정확히 3개다.
 * 축은 이름상 3개(`isTyping` · `isDisabled` · `isError`)지만 2×2×2=8 이 아니다.
 *
 * | 노드 | isTyping | isDisabled | isError |
 * |---|---|---|---|
 * | `13:2189` | false | false | false |
 * | `13:2199` | false | **true** | false |
 * | `13:2204` | false | **true** | **true** |
 *
 * 그래서 이 유니온이 막는 것이 두 가지다.
 *
 * 1. **`isError` 단독(활성 + 에러)** — Figma 에 없다. `isDisabled: true` 없이는 못 켠다.
 * 2. **`isTyping`** — 축 자체는 세 variant 이름에 모두 들어 있지만 값이 `false` 하나뿐이라
 *    prop 으로 열지 않았다. 없는 값을 받는 prop 은 만들지 않는다.
 *
 * 이 두 공백이 디자인 의도인지 Figma 저작 누락인지는 **판단하지 않았다.**
 * 관측 사실만 `TextFieldText.design.md` 에 적었다. (CLAUDE.md 원칙 1)
 *
 * `TextFieldSlotText` 의 `StateAndTyping` · `TextFieldTextSet` 의 `StatusAndDisabled` 와 같은 방식이다.
 */
type DisabledAndError =
  | { isDisabled?: false; isError?: false }
  | { isDisabled: true; isError?: boolean };

export type TextFieldTextProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /**
   * 입력 자리에 놓이는 문구. `TextFieldSlotText` 의 `children` 으로 그대로 넘어간다.
   * 넘기지 않으면 슬롯이 자기 기본값("플레이스홀더")을 쓴다 — Figma 기본값과 같다.
   */
  children?: ReactNode;
  /**
   * 상단 라벨. Figma component property `hasLabel`(기본 true) 에 대응한다.
   * 넘기지 않으면 라벨 단을 렌더하지 않는다 — Figma 의 `hasLabel=false` 와 같은 결과다.
   * boolean prop 을 따로 두지 않은 이유는 이 prop 하나로 두 상태가 표현되기 때문이다.
   * (`TextFieldSlotText` 의 `slotEnd` 와 같은 판단, 원칙 2)
   */
  label?: ReactNode;
  /**
   * 하단 보조 문구. Figma component property `hasSupporting`(기본 true) 에 대응한다.
   * 넘기지 않으면 하단 단을 렌더하지 않는다.
   */
  supporting?: ReactNode;
  /**
   * 라벨 오른쪽의 필수 표시 `*` (`I13:2191;35:14373`). 기본값 `true` 는 이 prop 이
   * 없던 때의 렌더 결과와 같다.
   *
   * ## 왜 열었나 — 세트 3개만 보고 내린 이전 판정의 반례가 나왔다
   * 이전 판정은 *"세 variant 모두 켜져 있고 TextField 레벨에 이것을 끄는 component
   * property 가 없다"* 였고, 근거는 세트 13:2188 의 variant 3개뿐이었다.
   * 그런데 `page/Login`(27818:7071)의 인스턴스 **27818:7077** 은 이 `*` 노드가
   * **없다** — `get_design_context(27818:7076)` 가 방출한 라벨 content
   * `I27818:7077;13:2201;35:14371` 안에 텍스트 노드가 하나뿐이다. 같은 화면의
   * 27818:7078(비밀번호)에는 있다. 즉 중첩 인스턴스 `35:14369` 의 `required` 를
   * 오버라이드해 끈 것이고, 끌 수 있는 축이 실재한다는 뜻이다.
   * `35:14369` 의 Figma 설명도 *"category 및 required 여부 기준에 따라 구성합니다"*
   * 라고 적고 있다. 지어낸 축이 아니라 관측된 축이다. (원칙 1)
   */
  required?: boolean;
  /**
   * **실제 입력 모드.** 넘기면 입력 줄이 `<p>` 대신 `<input>` 이 되고, 여기 담긴
   * 속성이 그 `<input>` 에 전달된다. 넘기지 않으면 기존과 완전히 같다.
   * 자세한 근거는 `TextFieldSlotText` 의 같은 이름 prop 주석에 있다.
   *
   * 이 컴포넌트가 입력 모드에서 추가로 하는 일은 셋이다.
   * 1. **Figma variant 4개를 실제 상호작용에 매핑한다** (아래 표).
   * 2. `input.id` 가 있으면 라벨을 `<label htmlFor>` 로 바꾸고, 보조 문구를
   *    `aria-describedby` 로 잇는다. 이전에 이것을 달지 않은 이유는
   *    *"가리킬 대상이 없는 ARIA 는 없느니만 못하다"* 였고, 입력 모드에서는
   *    가리킬 대상이 생긴다.
   * 3. `required` 가 켜져 있으면 `<input required>` 도 함께 켠다 — 시각 표시 `*` 와
   *    실제 제약이 어긋나지 않게 한다.
   *
   * ⚠ **controlled 전제.** `isTyping`·`done` 판정을 `input.value` 로 하기 때문에,
   *   `value` 없이 `defaultValue` 만 넘기면 값이 있어도 `default` 로 보인다.
   */
  input?: InputHTMLAttributes<HTMLInputElement>;
  /**
   * 지우기 버튼(`close-circle-fill`)의 클릭 핸들러. 이 버튼은 Figma 가
   * `focused`+`isTyping` 조합에만 그려 둔 것이라, 입력 모드에서 값이 있고
   * 포커스가 있을 때만 보인다.
   *
   * 넘기지 않으면 버튼이 아예 렌더되지 않는다. controlled 입력의 값은 호출부가
   * 갖고 있어서 이 컴포넌트가 스스로 비울 수 없기 때문이다 — 가짜 change 이벤트를
   * 합성해 `onChange` 를 부르는 대신 호출부가 자기 state 를 비우게 한다.
   */
  onClear?: () => void;
} & DisabledAndError;

/**
 * Figma `TextField/Text` 컴포넌트 세트 (node 13:2188, 섹션 "TextField").
 *
 * 라벨 · 입력 줄 · 하단 보조 문구를 세로로 조립한 입력 필드다.
 * 값 대조표와 판단 근거는 `TextFieldText.design.md` 에 있다.
 *
 * ## 재사용한 것 (원칙 2)
 * · 입력 줄 → `TextFieldSlotText` (Wave 2a). Figma 도 `Text Field Slot/Text`
 *   **인스턴스**(13:2192 · 13:2202 · 13:2207)를 쓴다. 새로 그리지 않았다.
 * · 하단 보조 문구 → `TextFieldTextSet` (Wave 1). Figma 인스턴스는
 *   `TextFieldSlot/Bottom/Items` 이지만 그 안은 `TextFieldTextSet`(35:14458) 하나뿐이고,
 *   `get_design_context` 가 세 variant 모두 같은 안쪽 노드
 *   (`35:14662`·`35:14663`·`35:14664`·`35:14665`·`35:14666`·`35:14667`)를 방출한다.
 *   `TextFieldSlotBottomItems` 를 거치지 않은 이유는 그 컴포넌트가 `status`·`isDisabled`
 *   pass-through 를 열지 않아 disabled·error 색을 전달할 수 없기 때문이다. 그 컴포넌트는
 *   다른 에이전트 산출물이라 고치지 않고 보고했다. (원칙 3)
 *
 * ## 라벨은 `TextSetTitle` 이 아니다
 * Figma 의 라벨 자리는 `[Field Text Set] Label`(주 컴포넌트 **35:14369**) 인스턴스다.
 * 이 저장소의 `TextSetTitle` 이 옮긴 세트는 **27719:1908** 로 다른 노드이고,
 * 구조도 다르다(제목+보조 2줄 vs 라벨+필수 표시 1줄). 그래서 재사용하지 않고
 * 이 컴포넌트 안에 그대로 옮겼다. 35:14369 자체는 이 작업의 노드 범위 밖이라
 * 별도 컴포넌트로 만들지 않았다 — 근거는 design.md 참조. (원칙 1·3)
 *
 * ## variant 3개가 만드는 차이
 *
 * | | 슬롯 variant | 슬롯 문구 색 | 슬롯 테두리 | 보조 문구 |
 * |---|---|---|---|---|
 * | 기본 | `default` | `text/secondary` | 없음 | `TextFieldTextSet` 기본 |
 * | `isDisabled` | `default` | `text/disabled-onLight` | 없음 | `isDisabled` |
 * | `isDisabled`+`isError` | `done` | `text/primary` | `border/negative` | `status="error"` |
 *
 * 라벨 색은 세 variant 모두 `text/primary` 로 **바뀌지 않는다.** 실측 사실이다.
 *
 * ## a11y — 이 컴포넌트는 아직 `<input>` 이 아니다
 * 결정과 근거 전문은 design.md 의 "a11y 결정" 절에 있다. 요약하면:
 * 재사용이 강제된 `TextFieldSlotText` 가 문구를 `<p>` 로 그리고, Figma 의
 * `TextField/Text` 에는 focused·typing variant 가 **하나도 없어** 실제 포커스 가능한
 * 입력 요소에 필요한 포커스 표시를 지어내야 한다. 지어내지 않았다 (원칙 1).
 * 붙일 컨트롤이 없으므로 `<label>` · `aria-describedby` 도 **달지 않았다** —
 * 가리킬 대상이 없는 ARIA 는 없느니만 못하다. 대신 하단 보조 문구 단에
 * `aria-live="polite"` 를 상시로 걸어, 도움말 ↔ 에러 문구 교체가 읽히게 했다.
 */
export function TextFieldText({
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
}: TextFieldTextProps) {
  // 입력 모드의 포커스는 브라우저가 정한다. 값은 호출부가 갖고 있으므로
  // 이 컴포넌트가 자체 state 로 갖는 것은 포커스 하나뿐이다.
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = input !== undefined && String(input.value ?? '') !== '';

  // 슬롯 인스턴스가 가리키는 variant. 노드 id 로 확인했다:
  // 13:2192·13:2202 의 content 는 13:2379 (= 13:2378 `state=default` 의 자식),
  // 13:2207 의 content 는 13:2406 (= 13:2405 `state=done` 의 자식) 이다.
  //
  // 입력 모드에서는 이 축을 실제 상호작용에 맞춘다. 새 상태를 지어낸 것이 아니라
  // Figma 세트 13:2377 에 이미 저작돼 있는 조합 4개에 1:1 로 붙인 것이다:
  //
  // | 포커스 | 값 | Figma 조합            | 보이는 것                     |
  // |---|---|---|---|
  // | ✗ | ✗ | `default`             | placeholder                   |
  // | ✓ | ✗ | `focused`             | 포커스 링                     |
  // | ✓ | ✓ | `focused`+`isTyping`  | 포커스 링 · 지우기 버튼 · 본문색 |
  // | ✗ | ✓ | `done`                | 본문색                        |
  const slotVariant = input
    ? isFocused
      ? ({ state: 'focused', isTyping: hasValue } as const)
      : hasValue
        ? ({ state: 'done' } as const)
        : ({ state: 'default' } as const)
    : isError
      ? ({ state: 'done' } as const)
      : ({ state: 'default' } as const);

  // 라벨 ↔ 입력 ↔ 보조 문구를 잇는 id. input.id 가 없으면 잇지 않는다 —
  // 가리킬 대상이 없는 ARIA 를 만들지 않는다는 기존 판단 그대로다.
  const supportingId = input?.id !== undefined && supporting !== undefined
    ? `${input.id}-supporting`
    : undefined;

  // isDisabled 且 !isError 일 때만 슬롯 문구 색이 variant 기본값과 다르다
  // (Figma 가 인스턴스에 건 색 오버라이드다). `TextFieldSlotText` 는 그 축을 열지
  // 않았고 이 작업은 그 파일을 고칠 수 없어서, 내용 쪽에서 색을 얹는다.
  // 슬롯이 `<p>` 에 건 색보다 자식 `<span>` 의 색이 이긴다. (원칙 3)
  const fieldText =
    isDisabled && !isError ? (
      <span className="text-text-disabled-on-light">{children ?? '플레이스홀더'}</span>
    ) : (
      children
    );

  return (
    // 13:2189 등 — 세로 auto-layout, gap = 변수 spacing/8.
    // 폭 362 는 이 파일의 진열 폭이라 옮기지 않았다 (Wave 1·2 와 같은 판단).
    <div className={['flex w-full flex-col', 'gap-8', className].filter(Boolean).join(' ')} {...props}>
      {/* wrapper 13:2190 등 — gap = 변수 spacing/12 */}
      <div className="flex w-full flex-col gap-12">
        {label !== undefined ? (
          // [Field Text Set] Label 13:2191 등 — 주 컴포넌트 35:14369
          <div className="flex w-full items-end">
            {/* content I13:2191;35:14371 — 변수 font/label/large-strong 을 이 단이 건다 */}
            <div className="font-label-large-strong flex shrink-0 items-center gap-textfield-label-gap">
              {/* 입력 모드에서 id 가 있으면 <label> 이다. 클릭으로 포커스가 옮겨가고
                  스크린리더가 입력의 이름을 읽는다. 없으면 이전처럼 <p> 다. */}
              {input?.id !== undefined ? (
                <label
                  htmlFor={input.id}
                  className="shrink-0 whitespace-nowrap text-text-primary"
                >
                  {label}
                </label>
              ) : (
                <p className="shrink-0 whitespace-nowrap text-text-primary">{label}</p>
              )}
              {/* I13:2191;35:14373 — 필수 표시. `required` prop 이 켜고 끈다.
                  aria-hidden 인 이유: 입력 모드에서는 <input required> 가 같은 사실을
                  프로그램적으로 이미 전달하므로, 문자 "*" 까지 읽히면 중복이 된다. */}
              {required ? (
                <p aria-hidden className="shrink-0 text-text-brand">
                  *
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Text Field Slot/Text 13:2192 등 */}
        <div className="relative w-full">
          <TextFieldSlotText
            {...slotVariant}
            onClear={onClear}
            input={
              input
                ? {
                    ...input,
                    type: input.type ?? 'text',
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
          </TextFieldSlotText>

          {/* 13:2207 의 stroke — 변수 border/negative, 두께 1, 반경 4.
              Figma 는 안쪽 stroke 라 높이 55 가 그대로다. 겹쳐 그려야 그 성질이
              유지되므로 슬롯에 border 유틸리티를 얹지 않고 오버레이로 둔다 —
              `StateLayerFocused` 가 포커스 링에 쓰는 것과 같은 방식이다. */}
          {isError ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-4 border-hairline border-solid border-border-negative"
            />
          ) : null}
        </div>
      </div>

      {/* TextFieldSlot/Bottom/Items 13:2193 등 → 안쪽 TextFieldTextSet 27738:6501 */}
      {supporting !== undefined ? (
        // id 는 위 aria-describedby 가 가리키는 대상이다. 입력 모드에서 input.id 가
        // 있을 때만 만들어지고, 그 밖에는 undefined 라 속성이 붙지 않는다.
        isError ? (
          <TextFieldTextSet id={supportingId} status="error" aria-live="polite">
            {supporting}
          </TextFieldTextSet>
        ) : isDisabled ? (
          // 아이콘은 `isDisabled` 가 맞춰 주지만 본문 색이 다르다:
          // TextFieldTextSet 의 disabled 본문은 text/primary 인데
          // 이 인스턴스는 text/disabled-onLight 다. 슬롯 문구와 같은 방식으로 얹는다.
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
