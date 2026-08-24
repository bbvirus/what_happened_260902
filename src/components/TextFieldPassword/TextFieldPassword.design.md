# TextFieldPassword — Figma 소스와 토큰 매핑

## 1. 출처

| 항목 | 값 |
|---|---|
| 파일 | `7DxkWa12fiJWOrvPIDWUcp` |
| Figma URL | https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/?node-id=13-2167 |
| 컴포넌트 세트 | `13:2167` — frame "TextField/Password", 1296×248 |
| 추출 | `get_metadata`(13:2167 + variant 3개 전부) · `get_design_context`(13:2168 · 13:2178 · 13:2183) · `get_variable_defs`(13:2188, 같은 값 집합) · `get_screenshot`(13:2167) · `Icon/visibilityOff-line` export SVG 3개 (2026-08-25) |

## 2. variant — 3개다. 자매 컴포넌트와 조합 목록이 같다

`get_metadata`(13:2167) 로 직접 확인한 세트의 자식은 정확히 3개다.

| 노드 | isTyping | isDisabled | isError |
|---|---|---|---|
| `13:2168` | false | false | false |
| `13:2178` | false | **true** | false |
| `13:2183` | false | **true** | **true** |

### 2.1 관측한 공백 두 가지 — `TextField/Text`(13:2188) 와 문자 단위로 같다

**(a) `isTyping=true` 인 variant 가 없다.** 축 이름 `isTyping` 은 세 variant 이름에
모두 들어 있으므로 **축은 존재하고 값이 `false` 하나뿐**이다.
`get_design_context` 가 세 노드에 방출한 타입도 `isTyping?: "false"` 뿐이다.
자식 컴포넌트 `TextFieldSlot/Password`(13:2347)에는 `isTyping=true` variant 가 **있다**(13:2368).
부모 쪽에만 없다.

**(b) "활성 + 에러"(`isDisabled=false, isError=true`) 조합이 없다.**
`isError` 축의 값은 둘 다 존재하고, 없는 것은 조합이다.

둘 다 디자인 의도인지 저작 누락인지 **판정하지 않았다.** (CLAUDE.md 원칙 1)
타입이 없는 조합을 막을 뿐이다.

```ts
type DisabledAndError =
  | { isDisabled?: false; isError?: false }
  | { isDisabled: true; isError?: boolean };
```

## 3. 구조 — 세 variant 가 같다

```
symbol 13:2168  "isTyping=false, isDisabled=false, isError=false"  362×115
├─ frame 13:2169  "wrapper"  362×86  @ (0,0)   flex-col · gap spacing/12 · items-start
│  ├─ instance 13:2170  "[Field Text Set] Label"     362×19  ← 주 컴포넌트 35:14369
│  └─ instance 13:2171  "Text Field Slot/ Password"  362×55  ← 주 컴포넌트 13:2347
└─ instance 13:2172  "TextFieldSlot/Bottom/Items"    362×21  @ (0,94)
```

`13:2178` (13:2179~13:2182) · `13:2183` (13:2184~13:2187) 도 같다.
루트 gap = 8 (`spacing/8`), wrapper gap = 12 (`spacing/12`).

## 4. `TextField/Text`(13:2188) 와 다른 점은 두 가지뿐이다

1. **입력 줄이 `TextFieldSlot/Password`(13:2347)** 다 — 문구가 hug 이고 말줄임표 처리가 없다.
2. **오른쪽 끝에 `TextFieldSlot/End/Items` 가 있다** — `Icon/line`(13:2221) 자리에
   `visibilityOff` 글리프가 들어가 있다. Text 쪽에는 이 슬롯 자체가 렌더되지 않는다.

라벨 단, 간격, 세 variant 의 색 규칙, 에러 테두리는 전부 같다.
그래서 아래 §5·§6·§7·§8 은 `TextFieldText.design.md` 와 같은 판정을 공유한다.

## 5. 값 대조표

| 항목 | Figma 원값 | 출처 | 저장소 토큰 | 판정 |
|---|---|---|---|---|
| 루트 세로 간격 | 8 | 변수 `spacing/8` | `--spacing-8` | 값 일치 → `gap-8` |
| wrapper 세로 간격 | 12 | 변수 `spacing/12` | `--spacing-12` | 값 일치 → `gap-12` |
| 루트 폭 | 362 | 13:2168 width | — | 진열 폭 → `w-full` |
| 라벨 타이포 | `font/label/large-strong` | 변수 | `@utility font-label-large-strong` | 값 일치 → 재사용 |
| 라벨 색 | `text/primary` | 변수 | `--color-text-primary` | 값 일치 |
| 필수 표시 색 | `text/brand` | 변수 | `--color-text-brand` | 값 일치 |
| **라벨 ↔ 필수 표시 간격** | **2** | `I13:2170;35:14371` 의 `gap-[2px]`. **변수 아님** | **없음** | ⚠ **신규 토큰 필요** (§8) |
| 입력 줄 | — | 인스턴스 13:2171 등 | `TextFieldSlotPassword` | 컴포넌트 재사용 |
| 오른쪽 끝 아이콘 | 24×24, 글리프 `visibilityOff`, fill `#747474` | 인스턴스 `I13:2171;13:2353;13:2221` | `Icon name="visibilityOff" color="secondary"` | export SVG 대조 후 재사용 (§6) |
| 에러 테두리 색 | `border/negative` | 변수. 13:2186 stroke | `--color-border-negative` | 값 일치 |
| 에러 테두리 두께 | 1 | 13:2186 stroke weight. 변수 아님 | `--spacing-hairline` | 값 일치 → `border-hairline` |
| 에러 테두리 반경 | 4 | 변수 `radius/4` | `--radius-4` | 값 일치 → `rounded-4` |
| 하단 보조 문구 | — | 인스턴스 13:2172 등 | `TextFieldTextSet` | 컴포넌트 재사용 (§7) |

### 5.1 세 variant 의 색 차이 — 전부 인스턴스 오버라이드다

| | 슬롯이 가리키는 variant | 슬롯 문구 색 | 끝 아이콘 색 | 하단 문구 색 | 하단 아이콘 색 |
|---|---|---|---|---|---|
| `13:2168` 기본 | `13:2348` `state=default` (content `13:2349`) | `text/secondary` | `#747474` | `text/secondary` | `#747474` |
| `13:2178` 비활성 | `13:2348` `state=default` (content `13:2349`) | `text/disabled-onLight` | `#747474` | `text/disabled-onLight` | `#1A1A1A` @ 0.16 |
| `13:2183` 비활성+에러 | `13:2354` `state=done` (content `13:2355`) | `text/primary` | `#747474` | `text/negative` | `#DA0707` |

읽는 법:

- 비활성은 슬롯 variant 를 바꾸지 않고 문구 색만 덮는다.
- 에러는 슬롯 variant 를 `done` 으로 바꾼다 — 그래서 문구가 `text/primary` 다.
- **라벨과 끝 아이콘은 세 variant 모두 바뀌지 않는다.** 비활성에서도 흐려지지 않는다.

## 6. 오른쪽 끝 아이콘 — Wave 2a 가 남긴 질문의 답

Wave 2a 는 `TextFieldSlot/End/Items` 안이 `Icon/line`(13:2221) **인스턴스 스왑 슬롯**이라
그릴 글리프가 지정돼 있지 않다고 판정했다. **그 스왑을 채운 것이 이 컴포넌트다.**

| 확인한 것 | 결과 |
|---|---|
| 글리프 이름 | `get_design_context`(13:2168 · 13:2178 · 13:2183) 가 세 variant 모두 asset 을 `Icon/visibilityOff-line` 이름으로 방출한다 |
| 글리프 기하 | export SVG 3개를 받아 `Icon.tsx` 의 `visibilityOff` 와 대조 — **path 3개가 문자 단위로 같다.** fill 만 `currentColor` 로 치환돼 있다 |
| 색 | export 3개의 fill 이 전부 `#747474` = 변수 `icon/secondary`. 비활성·에러에서도 같다 |
| 크기 | 24×24. `Icon` 이 24 고정이라 그대로 맞는다 |

→ 새로 그리지 않고 `Icon name="visibilityOff" color="secondary"` 를 붙였다. (원칙 2)

**추측이 아니다.** Wave 2a 가 "Password 라면 `visibility`/`visibilityOff` 토글이 자연스럽지만
Figma 가 그렇게 지정한 것은 아니다" 라고 남긴 부분 중, **`visibilityOff` 라는 사실은
Figma 가 지정했음이 확인됐고, 토글이라는 사실은 확인되지 않았다.**

### 토글을 넣지 않은 이유

- 세 variant 모두 `visibilityOff` 한 가지다. 눈을 뜬 짝(`visibility`)을 쓰는 variant 가 없다.
- 아이콘을 누른 상태·포커스 상태 variant 도 없다.
- 컴포넌트 설명은 "필요에 따라 입력값 표시/숨김 기능을 제공합니다" 라고 적고 있으나,
  그 상태를 그린 variant 가 하나도 없어 동작과 시각을 지어낼 근거가 없다.
- 그래서 `<button>` 으로 감싸지 않았고 `onToggleVisibility` 같은 prop 도 만들지 않았다.
  아이콘 스왑 자체를 여는 `slotEnd` prop 도 열지 않았다 — TextField 레벨에서 이미
  글리프가 고정돼 있기 때문이다. (원칙 1·2)

## 7. 재사용 판정

| 대상 | 판정 | 근거 |
|---|---|---|
| `TextFieldSlotPassword` | ✅ 재사용 | Figma 도 인스턴스(13:2171 · 13:2181 · 13:2186)를 쓴다. ⚠ 비활성 문구 색 축이 없다 (아래) |
| `TextFieldTextSet` | ✅ 재사용 | 하단 인스턴스 안쪽이 이 컴포넌트다 (주 컴포넌트 35:14458) |
| `TextFieldSlotBottomItems` | ❌ 경유하지 않음 | `status`·`isDisabled` pass-through 가 없어 색을 전달할 수 없다 |
| `TextFieldSlotEndItems` | ✅ 간접 재사용 | `TextFieldSlotPassword` 가 `slotEnd` 를 받아 안에서 쓴다. 직접 붙이지 않았다 |
| `Icon` | ✅ 재사용 | `visibilityOff` 글리프가 export 와 일치 (§6) |
| `TextSetTitle` | ❌ 재사용 불가 | 다른 컴포넌트다 (아래 7.2) |

### 7.1 슬롯 · 하단 문구의 색 오버라이드 처리 — `TextFieldText` 와 같다

`TextFieldSlotPassword` 는 `default`/`focused` = `text/secondary`,
`done`/`focused+typing` = `text/primary` 두 색만 갖고 `text/disabled-onLight` 가 없다.
`TextFieldTextSet` 의 `isDisabled` 는 아이콘은 맞지만 본문을 `text/primary` 로 만든다.

둘 다 다른 에이전트 산출물이라 고칠 수 없어, 내용 쪽에 토큰 색을 얹었다:

```tsx
<span className="text-text-disabled-on-light">{children}</span>
```

⚠ 에러 하단 아이콘은 이 인스턴스가 `#DA0707`(변수 `icon/negative`)인데
`TextFieldTextSet status="error"` 는 `--color-icon-status-negative`(한 단 밝다)를 쓴다.
아이콘 색만 받는 prop 이 없어 **가장 가까운 `status="error"` 를 쓰고 차이를 보고했다.**
근거 전문은 `TextFieldText.design.md` §5.1 · §5.2 에 있다 (같은 판정).

### 7.2 `TextSetTitle` — 재사용하지 않았다

라벨 자리는 `[Field Text Set] Label`(주 컴포넌트 **35:14369**)이고,
`TextSetTitle` 이 옮긴 세트는 **27719:1908** 로 다른 노드·다른 구조다.
주 컴포넌트 35:14369 는 다른 페이지에 있어 `get_metadata` 가 "invalid node selection" 을
돌려주므로 인스턴스(13:2170 · 13:2180 · 13:2185)에서만 확인했다. 셋의 안쪽 노드 id·색·타이포가
문자 단위로 같다. 별도 컴포넌트로 만들지 않은 이유와 필수 표시 `*` 를 끌 수 없는 이유는
`TextFieldText.design.md` §5.3 과 같다.

## 8. 추가된 토큰

`--spacing-textfield-label-gap` = `0.125rem` (2px) — 라벨 ↔ 필수 표시 간격.
Figma 변수가 아니고, `--spacing-*` 13단에도 없고, 값이 같은 기존 2px 토큰 4개는 전부
다른 컴포넌트·다른 축 전용이라 재사용할 수 없다. 상세는 `TextFieldText.design.md` §6.

**해소됨.** 2026-08-25 `token-guardian` 이 같은 이름으로 추가했고, 컴포넌트 코드는
바뀌지 않았다. 구현 시점에는 토큰이 없어 이 간격이 0 으로 렌더됐다.

## 9. a11y 결정 — `<input type="password">` 를 넣지 않았다

결정과 근거는 `TextFieldText.design.md` §7 과 같다. 요약:

| 항목 | 결정 |
|---|---|
| `<input>` | 넣지 않았다 — 재사용 강제 + 수정 금지 + Figma 에 포커스 시각 없음 |
| `<label>` | 쓰지 않았다 — 가리킬 컨트롤이 없다 |
| `aria-describedby` | 달지 않았다 — 대상이 없는 ARIA 는 없느니만 못하다 |
| error live region | 하단 보조 문구 단에 `aria-live="polite"` 상시 |

비밀번호 필드에만 해당하는 사실 하나:

**"● ● ● ● ● ●" 는 실제 마스킹이 아니다.** 화면 낭독기는 이 문자열을 그대로 읽는다.
`<input type="password">` 였다면 브라우저가 값 노출을 막아 주지만, 지금은 텍스트 노드다.
그래서 이 컴포넌트에 실제 비밀번호를 넣으면 안 된다.
Wave 2a 가 `TextFieldSlotPassword` 에 세운 성질을 그대로 물려받은 것이고,
해소는 위 §9 의 "실제 `<input>` 이 되려면 필요한 것" 3단계와 같다.

## 10. 남긴 것 — 옮기지 않은 값

| Figma 값 | 왜 옮기지 않았나 |
|---|---|
| 필수 표시 `*` 의 `w-[9px]` | 글자 하나의 hug 폭이다 |
| 슬롯 높이 55 | 상하 패딩(`spacing/14`) + 본문 27 의 합. Wave 2a 가 hug 로 판정 |
| 하단 단 높이 21 · 라벨 단 높이 19 | 타이포에서 나오는 hug 결과다 |
| 끝 아이콘 앞 gap 16 | `TextFieldSlotPassword` 안쪽 값이라 그 컴포넌트가 이미 갖고 있다 |

## 11. 사용 토큰 목록

| 토큰 | 유틸리티 | 쓰는 자리 |
|---|---|---|
| `--spacing-8` | `gap-8` | 루트 세로 간격 |
| `--spacing-12` | `gap-12` | wrapper 세로 간격 |
| `--color-text-primary` | `text-text-primary` | 라벨 |
| `--color-text-brand` | `text-text-brand` | 필수 표시 |
| `--color-text-disabled-on-light` | `text-text-disabled-on-light` | 비활성 슬롯 문구 · 비활성 하단 문구 |
| `--color-border-negative` | `border-border-negative` | 에러 테두리 색 |
| `--spacing-hairline` | `border-hairline` | 에러 테두리 두께 |
| `--radius-4` | `rounded-4` | 에러 테두리 반경 |
| `font/label/large-strong` | `font-label-large-strong` | 라벨 타이포 |
| `--color-icon-secondary` | `Icon color="secondary"` | 오른쪽 끝 `visibilityOff` |
| `--spacing-textfield-label-gap` | `gap-textfield-label-gap` | 라벨 ↔ 필수 표시 (§8) |

간접 사용 — `TextFieldSlotPassword` · `TextFieldSlotEndItems` · `TextFieldTextSet` · `Icon` 이
자기 토큰을 그대로 쓴다.

## 12. Code Connect

`get_design_context`(13:2168 · 13:2178 · 13:2183) 응답에 Code Connect 매핑이 없다.
원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `13:2167`).

## 13. 검증

- `npm run typecheck` · `npm run build` 통과
- `get_screenshot`(13:2167) 과 대조: 세 variant 의 라벨·문구 색, `visibilityOff` 아이콘,
  에러 테두리, 하단 문구 색 일치.
  차이 2건 — 라벨 ↔ `*` 간격 2 → 0 (§8), 에러 하단 아이콘 한 단 밝음 (§7.1)

---

## 추가: `required` · `input` prop (2026-08-25, `page/Login` 작업)

### `required` — 이전 판정의 반례가 나왔다

이 문서는 필수 표시 `*` 에 대해 *"세 variant 모두 켜져 있고 TextField 레벨에 이것을 끄는
component property 가 없다"* 고 적었다. 근거는 세트의 variant 3개였다. 반례:

| 노드 | 라벨 content 안 텍스트 노드 | `*` |
|---|---|---|
| `27818:7077` (page/Login 아이디) | 1개 | **없다** |
| `27818:7078` (page/Login 비밀번호) | 2개 | 있다 |

중첩 인스턴스 `35:14369` 의 `required` 를 오버라이드해 끈 것이다. 그 컴포넌트의 Figma
설명도 *"category 및 required 여부 기준에 따라 구성합니다"* 라고 적고 있다.
→ `required?: boolean` 을 열었다. **기본값 `true`** 라서 기존 호출부의 렌더 결과는 바뀌지
않는다. `aria-hidden` 을 붙인 이유는 입력 모드에서 `<input required>` 가 같은 사실을
프로그램적으로 전달하므로 문자 `*` 까지 읽히면 중복이기 때문이다.

### `input` — 실제 입력 모드

요청자 결정: *"실제 입력이 되어야 해"*. `input` 을 넘기면 입력 줄이 `<p>` 대신 `<input>` 이
된다. 넘기지 않으면 기존과 완전히 같다 (진열 모드).

이 문서의 "a11y 결정" 절은 `<label>`·`aria-describedby` 를 달지 않은 이유를 *"가리킬
대상이 없는 ARIA 는 없느니만 못하다"* 로 적었다. 입력 모드에서는 가리킬 대상이 생기므로,
`input.id` 가 있을 때만 라벨이 `<label htmlFor>` 가 되고 보조 문구가 `aria-describedby`
로 이어진다. `input.id` 가 없으면 이전과 같이 달지 않는다.

**상태 4개는 지어낸 것이 아니다** — 슬롯 세트에 이미 저작된 조합에 1:1 로 붙였다.

| 포커스 | 값 | Figma 조합 | 보이는 것 |
|---|---|---|---|
| ✗ | ✗ | `default` | placeholder |
| ✓ | ✗ | `focused` | 포커스 링 |
| ✓ | ✓ | `focused`+`isTyping` | 포커스 링 · 지우기 버튼 · 본문색 |
| ✗ | ✓ | `done` | 본문색 |

`isTyping` 은 *"값이 `false` 하나뿐이라 prop 으로 열지 않았다"* 고 이 문서가 적었던
축인데, 슬롯 세트(13:2377 · 13:2347)에는 `true` 짝이 실재한다. 그것을 쓰는 것이다.

⚠ **controlled 전제.** `isTyping`·`done` 판정을 `input.value` 로 하므로 `defaultValue`
만 넘기면 값이 있어도 `default` 로 보인다.

`onClear` 는 지우기 버튼의 핸들러다. 넘기지 않으면 입력 모드에서 버튼이 **렌더되지 않는다**
— 값은 호출부가 갖고 있어 이 컴포넌트가 스스로 비울 수 없고, 가짜 change 이벤트를 합성해
`onChange` 를 부르는 것보다 호출부가 자기 state 를 비우는 것이 정직하다.

사용처: `src/pages/Login/Login.tsx`, 근거 전문은 `src/pages/Login/Login.design.md`.

### 표시/숨김 토글 — Figma 근거가 부분적이다. 적어 둔다

이 문서는 토글을 넣지 않은 이유를 *"세 variant 는 모두 `visibilityOff` 한 가지이고, 눈을
뜬 짝도 누르는 상태도 없다"* 로 적었다. 그 관측은 그대로 맞다. 입력 모드에서만 토글을 넣은
근거는 둘이다.

1. 이 컴포넌트의 Figma 설명이 기능을 **명시**한다 — *"필요에 따라 입력값 표시/숨김 기능을
   제공합니다."*
2. 짝 글리프 `visibility` 가 같은 Figma `Icon` 섹션에서 온 것으로 이 저장소 `Icon` 에
   이미 있다. 색도 같은 `icon/secondary` 이고 크기도 같은 24 정사각이라, 토글로 바뀌는
   픽셀이 글리프뿐이다.

**여전히 Figma 에 없는 것**: 눈을 뜬 상태의 variant 자체와 그 버튼의 pressed·focused 표현.
`type` 을 호출부가 정하지 못하게 막은 이유도 이것이다 — 토글이 `password` ↔ `text` 를
정하지 않으면 아이콘과 마스킹이 어긋날 수 있다.

진열 모드의 눈은 Figma 그대로 **누를 수 없는 아이콘**이다. `<button>` 은 입력 모드에서만 된다.
