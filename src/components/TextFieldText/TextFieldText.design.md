# TextFieldText — Figma 소스와 토큰 매핑

## 1. 출처

| 항목 | 값 |
|---|---|
| 파일 | `7DxkWa12fiJWOrvPIDWUcp` |
| Figma URL | https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/?node-id=13-2188 |
| 컴포넌트 세트 | `13:2188` — frame "TextField/Text", 1296×243 |
| 추출 | `get_metadata`(13:2188 + variant 3개 전부) · `get_design_context`(13:2189 · 13:2199 · 13:2204) · `get_variable_defs`(13:2188) · `get_screenshot`(13:2188) · `Icon/circle-fill` export SVG 3개 (2026-08-25) |

## 2. variant — 3개다. 2×2×2 = 8 이 아니다

`get_metadata`(13:2188) 로 직접 확인한 세트의 자식은 정확히 3개다.

| 노드 | isTyping | isDisabled | isError |
|---|---|---|---|
| `13:2189` | false | false | false |
| `13:2199` | false | **true** | false |
| `13:2204` | false | **true** | **true** |

### 2.1 관측한 공백 두 가지 — 판단하지 않고 사실만 적는다

**(a) `isTyping=true` 인 variant 가 없다.**

- 축 이름 `isTyping` 은 **세 variant 이름에 모두 들어 있다.** Figma 의 variant property 는
  존재하는 variant 의 값 집합에서 파생되므로, 이 세트에는 `isTyping` 축이 **존재하되 값이
  `false` 하나뿐**이다. `get_design_context` 가 세 노드 모두에 대해 방출한 타입도
  `isTyping?: "false"` 로, 다른 값을 하나도 싣지 않는다.
- 즉 "축은 있는데 값이 없다" 가 아니라 **"축은 있고 값이 1개다"** 가 정확한 서술이다.
- 대조: 자식 컴포넌트 `TextFieldSlot/Text`(13:2377)에는 `isTyping=true` variant 가
  **있다**(13:2394). 커서·지우기 버튼이 그려져 있다. 부모 쪽에만 없다.
- 디자인 의도인지 저작 누락인지는 **판정하지 않았다.** (CLAUDE.md 원칙 1)

**(b) `isError=true` 가 `isDisabled=true` 와만 짝지어져 있다.**

- "활성 + 에러" (`isDisabled=false, isError=true`) 조합이 세트에 없다.
- `isError` 축의 값은 `false`·`true` 둘 다 존재하므로 축 자체는 온전하다.
  없는 것은 **조합**이다.
- 역시 판정하지 않았다. 코드는 타입으로 이 조합을 막아 두었을 뿐이다.

두 사실 때문에 prop 을 이렇게 두었다.

```ts
type DisabledAndError =
  | { isDisabled?: false; isError?: false }
  | { isDisabled: true; isError?: boolean };
```

`isTyping` 은 prop 으로 열지 않았다. 값이 하나뿐인 축은 prop 이 아니다. (원칙 2)

## 3. 구조 — 세 variant 가 문자 단위로 같다

```
symbol 13:2189  "isTyping=false, isDisabled=false, isError=false"  362×115
├─ frame 13:2190  "wrapper"  362×86  @ (0,0)   flex-col · gap spacing/12 · items-start
│  ├─ instance 13:2191  "[Field Text Set] Label"   362×19  ← 주 컴포넌트 35:14369
│  └─ instance 13:2192  "Text Field Slot/Text"     362×55  ← 주 컴포넌트 13:2377
└─ instance 13:2193  "TextFieldSlot/Bottom/Items"  362×21  @ (0,94)
```

`13:2199` (13:2200·13:2201·13:2202·13:2203) 와 `13:2204` (13:2205·13:2206·13:2207·13:2208) 도
같은 4노드 구조에 같은 위치·크기다.

루트 gap = 94 − 86 = 8 = 변수 `spacing/8`. wrapper gap = 31 − 19 = 12 = 변수 `spacing/12`.

## 4. 값 대조표

| 항목 | Figma 원값 | 출처 | 저장소 토큰 | 판정 |
|---|---|---|---|---|
| 루트 세로 간격 | 8 | 변수 `spacing/8` | `--spacing-8` | 값 일치 → `gap-8` |
| wrapper 세로 간격 | 12 | 변수 `spacing/12` | `--spacing-12` | 값 일치 → `gap-12` |
| 루트 폭 | 362 | 13:2189 width | — | 진열 폭으로 판정 → `w-full` (아래 4.1) |
| 라벨 타이포 | `font/label/large-strong` | 변수 (Bold · 16 · lh 100) | `@utility font-label-large-strong` | 값 일치 → 재사용 |
| 라벨 색 | `text/primary` `#1a1a1a` | 변수 | `--color-text-primary` | 값 일치 → `text-text-primary` |
| 필수 표시 색 | `text/brand` `#e4107a` | 변수 | `--color-text-brand` | 값 일치 → `text-text-brand` |
| **라벨 ↔ 필수 표시 간격** | **2** | `I13:2191;35:14371` 의 `gap-[2px]`. **변수 아님** | **없음** | ⚠ **신규 토큰 필요** (§6) |
| 입력 줄 | — | 인스턴스 13:2192 등 | `TextFieldSlotText` | 컴포넌트 재사용 |
| 에러 테두리 색 | `border/negative` `#da0707` | 변수. 13:2207 stroke | `--color-border-negative` | 값 일치 → `border-border-negative` |
| 에러 테두리 두께 | 1 | 13:2207 stroke weight. 변수 아님 | `--spacing-hairline` | 값 일치 → `border-hairline` |
| 에러 테두리 반경 | 4 | 변수 `radius/4` | `--radius-4` | 값 일치 → `rounded-4` |
| 하단 보조 문구 | — | 인스턴스 13:2193 등 | `TextFieldTextSet` | 컴포넌트 재사용 (§5.2) |

### 4.1 폭 362 를 옮기지 않은 이유

`Divider`(360×1) · `TextSetTitle`(360) · `TextFieldSlotText`(362) 가 이미 같은 판정을 내렸다.
안쪽 `wrapper`(13:2190)와 두 인스턴스가 전부 부모를 채우는 FILL 이라 폭은 배치값이다. → `w-full`.

### 4.2 세 variant 의 색 차이 — 전부 인스턴스 오버라이드다

세 variant 는 **같은 자식 variant 를 쓰면서 색만 오버라이드**하는 곳이 있다.
`get_design_context` 가 방출한 안쪽 노드 id 로 구분했다.

| | 슬롯이 가리키는 variant | 슬롯 문구 색 | 하단 문구 색 | 하단 아이콘 색 |
|---|---|---|---|---|
| `13:2189` 기본 | `13:2378` `state=default` (content `13:2379`) | `text/secondary` | `text/secondary` | `#747474` = `icon/secondary` |
| `13:2199` 비활성 | `13:2378` `state=default` (content `13:2379`) | `text/disabled-onLight` | `text/disabled-onLight` | `#1A1A1A` @ 0.16 = `icon/disabled-onLight` |
| `13:2204` 비활성+에러 | `13:2405` `state=done` (content `13:2406`) | `text/primary` | `text/negative` | `#DA0707` = `icon/negative` |

읽는 법 두 가지:

- **비활성은 슬롯 variant 를 바꾸지 않는다.** `default` 그대로 두고 텍스트 색만 덮었다.
- **에러는 슬롯 variant 를 `done` 으로 바꾼다.** 그래서 문구가 `text/primary` 다 —
  비활성인데도 흐리지 않다. 어색해 보이지만 실측 사실이라 그대로 옮겼다. (원칙 1)

**라벨은 세 variant 모두 `text/primary` 로 바뀌지 않는다.** 비활성에서도 흐려지지 않는다.

## 5. 재사용 판정

### 5.1 `TextFieldSlotText` — 재사용했다. 다만 색 축이 없다

Figma 도 `Text Field Slot/Text` **인스턴스**(13:2192 · 13:2202 · 13:2207)를 쓴다.
새로 그리지 않았다. (원칙 2)

⚠ **한 곳이 맞지 않는다.** `13:2199`(비활성)의 슬롯 문구 색 `text/disabled-onLight` 는
`TextFieldSlotText` 의 어떤 `state` 로도 나오지 않는다 — 그 컴포넌트는 `default`/`focused`
= `text/secondary`, `done`/`focused+typing` = `text/primary` 두 색만 갖는다.
Figma 가 인스턴스에 건 **색 오버라이드**이기 때문이다.

`TextFieldSlotText` 는 다른 에이전트(Wave 2a) 산출물이고 이 작업은 그 파일을 고칠 수 없다.
그래서 슬롯 바깥에서 고치지 않고 **내용 쪽에 색을 얹었다**:

```tsx
<span className="text-text-disabled-on-light">{children}</span>
```

슬롯이 `<p>` 에 건 색보다 자식 `<span>` 의 색이 이긴다. raw 값 0건이고 토큰 유틸리티만 쓴다.
**정공법은 `TextFieldSlotText` 에 `isDisabled` 축을 여는 것이다.** 반환 보고에 올렸다. (원칙 3)

### 5.2 `TextFieldTextSet` — 재사용했다. `TextFieldSlotBottomItems` 는 거치지 않았다

Figma 의 하단 인스턴스는 `TextFieldSlot/Bottom/Items`(13:2193 등)이지만,
`get_design_context` 가 세 variant 모두 그 **안쪽**을 `TextFieldTextSet`(주 컴포넌트 35:14458)
하나로 방출하고 노드 id 도 셋 다 같다 (`27738:6501` → `35:14662` content · `35:14663` wrapper ·
`35:14664` iconarea · `35:14665` Icon/circle-fill · `35:14666` supportingText · `35:14667` text).

**셋이 같은 노드 id 라는 것은 셋 다 `TextFieldTextSet` 의 같은 variant(기본)이고
색만 오버라이드됐다는 뜻이다.** `status=error` variant 를 쓴 것이 아니다.

이 저장소의 `TextFieldSlotBottomItems` 를 거치지 않은 이유는 그것이 `contentType` 하나만
받고 `status`·`isDisabled` pass-through 를 열지 않아, 위 색 차이를 전달할 방법이 없기 때문이다.
그 컴포넌트를 통과시켜도 시각 결과는 `<div class="flex items-start">` 한 겹이 늘 뿐 같으므로,
`TextFieldTextSet` 을 직접 붙였다. (원칙 2 — 값을 전달하지 못하는 경유는 두지 않는다)

매핑:

| variant | 쓴 prop | 아이콘 결과 | 본문 결과 | 일치? |
|---|---|---|---|---|
| 기본 | (기본값) | `icon/secondary` | `text/secondary` | ✅ 일치 |
| 비활성 | `isDisabled` + 본문에 `text-text-disabled-on-light` span | `icon/disabled-onLight` | `text/disabled-onLight` | ✅ 일치 (span 필요 — 아래) |
| 비활성+에러 | `status="error"` | `--color-icon-status-negative` | `text/negative` | ⚠ **아이콘만 불일치** (아래) |

- **비활성**: `TextFieldTextSet` 의 `isDisabled` 는 아이콘을 `icon/disabled-onLight` 로
  맞춰 주지만 **본문을 `text/primary` 로** 만든다(그 컴포넌트 자신의 Figma variant 가 그렇다).
  이 인스턴스는 본문도 `text/disabled-onLight` 라 슬롯과 같은 방식으로 span 을 얹었다.
- **비활성+에러**: 본문 `text/negative` 는 `status="error"` 와 정확히 같다.
  아이콘은 이 인스턴스가 `#DA0707`(변수 `icon/negative`)인데 `TextFieldTextSet` 의
  `error` variant 는 `--color-icon-status-negative`(negative/400, 한 단 밝다)를 쓴다.
  두 값이 다르다. `TextFieldTextSet` 은 아이콘 색만 따로 받는 prop 이 없고 이 작업은
  그 파일을 고칠 수 없어, **가장 가까운 `status="error"` 를 쓰고 차이를 보고했다.**
  (`hasIconStart={false}` + 자체 렌더는 16 뷰박스 글리프를 다시 그리는 일이라
  원칙 2 에 어긋난다. `Icon` 은 24 고정이라 쓸 수 없다.)

### 5.3 `TextSetTitle` — 재사용하지 않았다. 다른 컴포넌트다

| 후보 | Figma 노드 | 구조 | 판정 |
|---|---|---|---|
| 이 자리의 인스턴스 | `13:2191` `[Field Text Set] Label` (주 컴포넌트 **35:14369**) | 라벨 + 필수 표시, 가로 1줄, `font/label/large-strong` | — |
| `TextSetTitle` | **27719:1908** | 제목 + 보조 텍스트, 세로 2줄, `size` 5단 | 다른 노드 · 다른 구조 → 재사용 불가 |

주 컴포넌트 35:14369 는 다른 페이지에 있어 `get_metadata` 가 "invalid node selection" 을
돌려준다. 그래서 **인스턴스 쪽에서만** 확인했다. 인스턴스 3개(13:2191 · 13:2201 · 13:2206)의
안쪽 노드 id·색·타이포가 문자 단위로 같다.

35:14369 를 별도 컴포넌트로 만들지 않은 이유:

- 이 작업의 노드 범위는 `13:2188` · `13:2167` 이다. 35:14369 는 그 밖이다. (원칙 3)
- 컴포넌트 설명이 `subTitle` · `category` · `required` property 를 언급하지만
  주 컴포넌트를 읽을 수 없어 **property 정의를 확인하지 못했다.** 확인 못 한 축으로
  컴포넌트를 설계하지 않는다. (원칙 1)

그래서 관측된 1가지 형태(라벨 + 필수 표시)만 이 컴포넌트 안에 그대로 옮겼다.
**필수 표시 `*` 는 끌 수 없다** — `get_design_context` 가 TextField 레벨에서 방출한
component property 는 `hasLabel` · `hasSupporting` 과 variant 축 3개뿐이고, 라벨 안쪽의
`required` 는 노출돼 있지 않다. 없는 property 를 만들지 않았다. (원칙 2)

### 5.4 `TextFieldSlotEndItems` — 이 컴포넌트에는 없다

`TextField/Text` 세 variant 어디에도 `TextFieldSlot/End/Items` 가 렌더되지 않는다
(`get_design_context` 출력에 없다 — 슬롯의 `hasSlotEnd=false` 다).
그래서 `slotEnd` prop 을 열지 않았다. 자매 컴포넌트 `TextField/Password` 에는 있다.

### 5.5 `Icon` — 이 컴포넌트에서는 직접 쓰지 않는다

하단 아이콘은 `TextFieldTextSet` 이 16 뷰박스로 그린다. `Icon` 은 24 고정이라 쓸 수 없다.

## 6. 추가된 토큰

### `--spacing-textfield-label-gap` = `0.125rem` (2px)

| 항목 | 값 |
|---|---|
| 쓰는 자리 | 라벨 ↔ 필수 표시 간격. `I13:2191;35:14371` · `I13:2201;35:14371` · `I13:2206;35:14371` 의 `gap-[2px]` |
| Figma 변수인가 | **아니다.** `get_variable_defs`(13:2188) 응답에 `spacing/2` 가 없다 |
| 스케일에 있나 | **없다.** `--spacing-*` 13단은 `4`부터 시작한다 |
| 기존 2px 토큰 재사용? | **불가.** `--spacing-tab-indicator-height` · `--spacing-tab-state-layer-inset` · `--spacing-textfield-textset-icon-inset-top` · `--spacing-textfield-cursor-width` 넷 다 2px 이지만 전부 다른 컴포넌트·다른 축 전용이다. `spacing.tokens.css` 가 "값이 같아서가 아니라 축이 같아서 합친다" 를 못박아 뒀다 |

**해소됨.** 2026-08-25 `/sync-tokens` → `token-guardian` 이 `spacing.tokens.css` 에 같은 이름으로
추가했다. 번들에 `.gap-textfield-label-gap{gap:var(--spacing-textfield-label-gap)}` 과
`--spacing-textfield-label-gap:.125rem` 이 둘 다 있고, **컴포넌트 코드는 한 줄도 바뀌지 않았다.**
구현 시점에는 토큰이 없어 이 간격이 0 으로 렌더됐다.
`TextFieldSlotText` 가 `--spacing-textfield-cursor-width` 에 대해 쓴 것과 같은 방식이다.

`--spacing-2` 를 13단 스케일에 정식 추가하는 대안은 검토 후 기각됐다 — 근거는
`docs/design-tokens.md` 에 있다 (요지: Figma spacing 변수 컬렉션에 `2` 단이 존재하지 않고,
저장소의 2px 토큰 5개는 같은 단의 반복이 아니라 서로 다른 축에 산재한 실측 보정이다).

## 7. a11y 결정 — `<input>` 을 넣지 않았다

Wave 2a 가 넘긴 열린 질문이다. 결정과 근거를 그대로 적는다.

### 결정

| 항목 | 결정 |
|---|---|
| `<input>` | **넣지 않았다.** 문구는 `TextFieldSlotText` 가 그리는 `<p>` 다 |
| `<label>` | **쓰지 않았다.** 라벨은 `<p>` 다 |
| `aria-describedby` | **달지 않았다** |
| error live region | **`aria-live="polite"` 를 하단 보조 문구 단에 상시로 걸었다** |

### 근거

**(1) `<input>` 을 넣으려면 재사용 강제와 수정 금지 중 하나를 어겨야 한다.**
이 작업은 `TextFieldSlotText` 재사용이 강제돼 있고 동시에 그 파일 수정이 금지돼 있다.
그 컴포넌트는 문구를 `<p className="truncate … text-text-secondary">{children}</p>` 로 그린다.
`<input>` 을 넣을 수 있는 자리는 그 `<p>` 안뿐이고, 그러면 정적 텍스트용으로 짜인 `<p>`
안에 폼 컨트롤이 들어가 두 벌의 타이포·색 규칙이 겹친다. 슬롯을 안 쓰고 직접 그리면
Wave 2a 산출물을 바깥에서 다시 쓰는 셈이라 원칙 2 에 어긋난다.

**(2) Figma 에 포커스 시각이 없다.**
`TextField/Text`(13:2188)에는 focused variant 도 typing variant 도 **하나도 없다**(§2.1).
포커스 가능한 실제 컨트롤을 넣으면 WCAG 2.4.7(focus visible)을 만족할 포커스 표시가
필요한데, 이 레벨의 Figma 는 그것을 정의하지 않는다. 자식 슬롯에는 `focused` variant 가
있지만 Wave 2a 가 "`state` 는 시각만 바꾸고 DOM 포커스를 옮기지 않는다" 고 못박았고,
`onFocus` 에 그것을 물리는 동작은 Figma 가 지정한 것이 아니다.
**지어내지 않았다.** (원칙 1)

**(3) 가리킬 컨트롤이 없으면 `<label>` · `aria-describedby` 도 달지 않는다.**
`for` 가 없는 `<label>` 과 대상 없는 `aria-describedby` 는 보조기술에 아무 것도 전달하지
못한다. 없느니만 못한 ARIA 를 붙이는 대신, 지금 실제로 동작하는 것 하나만 넣었다:
하단 보조 문구 단의 `aria-live="polite"`. 이것은 컨트롤이 없어도 동작하며,
도움말 → 에러로 문구가 바뀔 때 읽힌다. `role="alert"` 를 쓰지 않은 이유는 그것이
`assertive` 라 정적으로 렌더된 에러까지 즉시 끼어들어 읽기 때문이다.

**(4) 필수 표시 `*` 는 그대로 뒀다.**
`aria-hidden` 을 걸면 "필수" 정보가 사라지고, `sr-only` 대체 텍스트를 넣으면 Figma 에
없는 문자열을 만드는 일이 된다. 관측한 그대로 두고 여기에 적어 둔다.

### 실제 `<input>` 이 되려면 필요한 것

1. `TextFieldSlotText` · `TextFieldSlotPassword` 가 `<input>` 을 받거나 스스로 렌더하도록 확장
2. `TextField/Text`(13:2188)에 focused / typing variant 추가 (Figma 쪽 작업)
3. 그 다음에 `<label htmlFor>` · `aria-describedby` · `aria-invalid` · `disabled` 연결

## 8. 남긴 것 — 옮기지 않은 값

| Figma 값 | 왜 옮기지 않았나 |
|---|---|
| 필수 표시 `*` 의 `w-[9px]` | 글자 하나의 hug 폭이다. 제약이 아니라 렌더 결과다 |
| 슬롯 높이 55 | 상하 패딩(`spacing/14`) + 본문 27 의 합이다. Wave 2a 가 이미 hug 로 판정했다 |
| 하단 단 높이 21 | `font/body/small` 14 × 1.5 = 21. hug 결과다 |
| 라벨 단 높이 19 | `font/label/large-strong` 16 × lh 100% ≈ 19. hug 결과다 |

## 9. 사용 토큰 목록

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
| `--spacing-textfield-label-gap` | `gap-textfield-label-gap` | 라벨 ↔ 필수 표시 (§6) |

간접 사용 — `TextFieldSlotText` · `TextFieldTextSet` 이 자기 토큰을 그대로 쓴다.

## 10. Code Connect

`get_design_context`(13:2189 · 13:2199 · 13:2204) 응답에 Code Connect 매핑이 없다.
매핑 생성은 이 작업의 범위 밖이다.
원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `13:2188`).

## 11. 검증

- `npm run typecheck` · `npm run build` 통과
- `get_screenshot`(13:2188) 과 대조: 세 variant 의 라벨·문구 색, 에러 테두리, 하단 문구 색 일치.
  차이 2건은 위에 적은 그대로다 — 라벨 ↔ `*` 간격 2 → 0 (§6, 토큰 대기),
  에러 하단 아이콘 한 단 밝음 (§5.2, `TextFieldTextSet` 확장 필요)

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
