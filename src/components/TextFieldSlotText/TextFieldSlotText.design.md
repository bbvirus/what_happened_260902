# TextFieldSlotText — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `TextFieldSlotText.tsx`, 스토리는 `TextFieldSlotText.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/?node-id=13-2377> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 컴포넌트 세트 | `13:2377` — frame "TextFieldSlot/Text", 1820×191 |
| 추출 | `get_metadata`(13:2377 + variant 4개 전부) · `get_design_context`(13:2377) · `get_variable_defs`(13:2377) · `get_screenshot`(13:2377) · `close-circle-fill` export SVG (2026-08-24) |

## variant 는 4개다 — 3×2=6 이 아니다

`get_metadata`(13:2377) 로 직접 확인한 세트의 자식은 정확히 4개다.

| 노드 | `state` | `isTyping` |
|---|---|---|
| `13:2378` | default | false |
| `13:2384` | focused | false |
| `13:2394` | focused | **true** |
| `13:2405` | done | false |

`default`+`isTyping` 과 `done`+`isTyping` 은 **없다.** 없는 조합을 만들지 않기 위해
`state`·`isTyping` 을 독립된 두 prop 으로 두지 않고 유니온으로 묶었다
(`TextFieldTextSet` 의 `StatusAndDisabled` 와 같은 방식, 원칙 1·2).
두 조합을 넘기면 컴파일이 실패하는 것을 임시 파일로 확인했다 (아래 검증 표).

## 노드 구조

```
symbol 13:2394  "state=focused, isTyping=true"  362×55
├─ instance 13:2395  "[State Layer] Focused"  362×55   ← 35:12806 의 인스턴스
└─ frame 13:2396  "content"    330×27  @ (16,14)   flex-row · gap spacing/16 · items-center
   ├─ frame 13:2397  "wrapper"  290×27   flex-1 · items-center · justify-between
   │  ├─ frame 13:2398  "text"   266×27   flex-1 · overflow-clip · items-center
   │  │  ├─ text 13:2399  "플레이스홀더"  94×27
   │  │  └─ rounded-rect 13:2400  "cursor"  2×24  @ x=96
   │  └─ instance 13:2401  "close-circle-fill"  24×24  @ x=266
   ├─ instance 13:2402  "TextFieldSlot/End/Items"  24×24  @ x=306
   ├─ instance 13:2403  "TextFieldSlot/End/Items"  24×24  @ x=342  hidden
   └─ instance 13:2404  "TextFieldSlot/End/Items"  24×24  @ x=342  hidden
```

### ⚠ `close-circle-fill` 은 End/Items 소속이 아니다 — 확인함

`13:2401` 의 부모는 `wrapper`(13:2397) 이고, `TextFieldSlot/End/Items` 인스턴스
(13:2402~13:2404)는 그 **형제**로 `content`(13:2396) 밑에 있다. 두 계층이 다르다.
`get_design_context`(13:2377) 도 같은 구조를 방출한다 — 지우기 아이콘은 `wrapper`
안에, End/Items 는 `content` 안에 따로 있다. 코드도 그 계층을 그대로 지켰다.

### hidden 인스턴스는 렌더하지 않는다 — 판단과 근거

variant 4개의 End/Items 인스턴스 개수를 전부 세었다.

| 노드 | End/Items 개수 | 보이는 것 | 숨은 것 |
|---|---|---|---|
| `13:2378` (default) | **1** | 13:2383 | 없음 |
| `13:2384` (focused) | 3 | 13:2391 | 13:2392 · 13:2393 |
| `13:2394` (focused+typing) | 3 | 13:2402 | 13:2403 · 13:2404 |
| `13:2405` (done) | 3 | 13:2410 | 13:2411 · 13:2412 |

**판정: 렌더하지 않는다.** 근거 셋.

1. **개수가 variant 마다 다르다.** `default` 만 1개다. 같은 세트의 4개 variant 가
   같은 슬롯 구조를 가져야 하는데 개수가 어긋난다 — 설계된 축이 아니라
   작업 중 남은 사본으로 읽힌다.
2. **자매 컴포넌트에는 아예 없다.** `TextFieldSlot/Password`(13:2347)는 variant
   4개 전부 인스턴스가 **1개씩**이고 숨은 것이 하나도 없다. 두 컴포넌트가 같은
   자리를 두고 서로 다른 슬롯 수를 갖는다고 볼 근거가 없다.
3. **`get_design_context` 가 방출하지 않는다.** Figma 자신의 변환도 boolean
   property `hasSlotEnd` 하나와 End/Items **1개**만 내보내고, 숨은 것은 코드에
   나타나지 않는다.
4. 숨은 것의 x 좌표(342)는 content 오른쪽 경계(330) 밖이다. 켜도 잘린다.

즉 "호출부가 아이콘 개수를 정하는 슬롯" 이 아니다. 자리는 **하나**다.
그 하나 안에서 아이콘을 몇 개 놓을지는 이미 `TextFieldSlotEndItems` 가
`children` 으로 열어 둔 축이므로, 여기서 다시 열지 않았다 (원칙 2).

`hasSlotEnd`(boolean) 를 별도 prop 으로 만들지 않고 `slotEnd?: ReactNode` 하나로
접었다 — 넘기면 켜지고 안 넘기면 꺼지므로 두 상태가 그대로 표현된다.
Figma 슬롯 안이 `Icon/line` **인스턴스 스왑 슬롯**(그릴 글리프 미지정)이라
어차피 내용을 호출부에서 받아야 하기 때문이다
(`TextFieldSlotEndItems.design.md` 가 이미 판정해 둔 사실).

## 값의 출처 — `불명` 0건

| 값 | Figma 원값 | 출처 | 토큰 | 결론 |
|---|---|---|---|---|
| 루트 배경 | `#f2f2f2` | 변수 `bg/tertiary` | `--color-bg-tertiary` → `--neutral-gray-light-50` | 값 일치 → 재사용 (`bg-bg-tertiary`) |
| 루트 반경 | 4 | 변수 `radius/4` | `--radius-4` = `0.25rem` | 값 일치 → 재사용 (`rounded-4`) |
| 루트 좌우 패딩 | 16 | 변수 `spacing/16` | `--spacing-16` = `1rem` | 값 일치 → 재사용 (`px-16`) |
| 루트 상하 패딩 | 14 | 변수 `spacing/14` | `--spacing-14` = `0.875rem` | 값 일치 → 재사용 (`py-14`) |
| content 가로 간격 | 16 | 변수 `spacing/16` | `--spacing-16` | 값 일치 → 재사용 (`gap-16`) |
| 문구 타이포 | `Font(family-font, Medium, font-size/body-large(18), 500, lineHeight 1.5, letterSpacing 0)` | 변수 `font/body/large` | `@utility font-body-large` (`1.125rem` / `--font-weight-base` / `1.5`) | 4개 값 전부 일치 → 재사용 |
| 문구 색 (default · focused) | `#747474` | 변수 `text/secondary` | `--color-text-secondary` → `--neutral-gray-light-600` | 값 일치 → 재사용 |
| 문구 색 (done · focused+typing) | `#1a1a1a` | 변수 `text/primary` | `--color-text-primary` → `--bw-light-black` | 값 일치 → 재사용 |
| 포커스 링 색 | `#1a1a1a` | 변수 `border/strong` | `--color-state-focused` → `--bw-light-black` (`StateLayerFocused` 가 쓰는 토큰) | 값 일치 → 컴포넌트 재사용 (아래 참조) |
| 포커스 링 두께 | 1 | 변수 아님 | `--spacing-hairline` (`StateLayerFocused` 내부) | 값 일치 → 컴포넌트 재사용 |
| 포커스 링 반경 | 4 | 변수 `radius/4` | `--radius-4` (`StateLayerFocused` 내부) | 값 일치 → 컴포넌트 재사용 |
| 커서 색 | `#e4107a` | 변수 `bg/brand` | `--color-bg-brand` → `--magenta-light-500` | 값 일치 → 재사용 (`bg-bg-brand`) |
| 커서 반경 | 100 | 변수 `radius/full` | `--radius-100` = `6.25rem` | 값 일치 → 재사용 (`rounded-100`) |
| 커서 길이 | 24 | 13:2389 · 13:2400 의 길이. 변수 아님 | `--spacing-24` = `1.5rem` | 값 일치 → 재사용 (`h-24`) |
| **커서 두께** | **2** | 13:2389 · 13:2400 의 두께. **변수 아님** | **없음** | ⚠ **신규 토큰 필요** (아래 참조) |
| 지우기 아이콘 크기 | 24×24 | 13:2401 width/height | `--spacing-24` → `Icon` 기본 `size-24` | 값 일치 → `Icon` 기본값 |
| 지우기 아이콘 색 | `#747474` | export SVG 의 `fill` (변수 아님) | `--color-icon-secondary` → `--neutral-gray-light-600` | 값 일치 → `Icon color="secondary"` |
| 지우기 아이콘 글리프 | `close-circle-fill` | 인스턴스 13:2401 | `Icon` 의 `close-circle-fill` | `d` 가 export 와 문자 단위로 같음을 확인 → 재사용 |
| End/Items 슬롯 | 24×24 | 13:2383 등 | — | `TextFieldSlotEndItems contentType="icon"` 재사용 |
| 폭 362 | variant 프레임 | 진열 폭 | — | 옮기지 않았다 (아래 참조) |
| 높이 55 | variant 프레임 | 14 + 27 + 14 의 hug | — | 고정하지 않았다 (아래 참조) |

`get_variable_defs`(13:2377) 전체 응답:
`{text/secondary, family-font, font-size/body-large, font/body/large, icon/secondary,
spacing/16, spacing/14, radius/4, bg/tertiary, border/strong, radius/full, bg/brand, text/primary}`
— 위 표의 "변수" 열과 1:1로 맞는다. **`spacing/2` 는 없다.**

## 해소된 토큰 — `--spacing-textfield-cursor-width`

| 항목 | 값 |
|---|---|
| 필요한 값 | `0.125rem` (2) |
| 쓰는 자리 | 커서 13:2389(focused) · 13:2400(focused+typing), 그리고
`TextFieldSlotPassword` 의 13:2365 · 13:2374 |
| 현재 코드 | `w-textfield-cursor-width` |
| 해소 | `/sync-tokens` → `token-guardian` 이 `spacing.tokens.css` 에 추가함 (2026-08-25) |

**기존 2 토큰을 재사용하지 않은 이유.** 저장소에 값이 `0.125rem` 인 토큰이 이미 3개
있다 — `--spacing-tab-indicator-height` · `--spacing-tab-state-layer-inset` ·
`--spacing-textfield-textset-icon-inset-top`. 그런데 `spacing.tokens.css` 는 이 셋을
**서로 합치지 않는다**고 이미 판정해 두었다("값이 같아서가 아니라 같은 것을 가리켜야
합친다", `--spacing-hairline` 이 세운 기준). 커서 두께는 그 셋 중 어느 것과도 다른
자리이므로 같은 기준을 적용해 네 번째 이름을 요청한다.

**13 단 spacing 스케일에 끼워 넣지 않는 이유**도 그 파일이 이미 세워 둔 것과 같다:
그 13 단은 Figma 가이드 표를 그대로 옮긴 것이고 2 는 그 표에 없다.

**현재 상태.** 토큰이 추가돼 커서가 2 로 렌더된다.
구현 시점에는 토큰이 없어 폭 0 이었고, `src/tokens/**` 가 편집 권한 밖이라
직접 추가하지 않았다 (레이어 분리). 이후 `token-guardian` 이 같은 이름으로 추가했고,
**컴포넌트 코드는 한 줄도 바뀌지 않았다.**

## 폭·높이를 고정하지 않은 이유

- **폭 362.** 안의 `text` 프레임이 FILL 이고 362 는 이 파일의 진열 폭이다.
  자매 컴포넌트 `TextFieldSlot/Password` 는 같은 자리가 360 이다 — 2 차이는
  스펙이 아니라 배치다. `TextSetTitle`(360) · `Divider`(360) · `TextFieldTextSet`(360)
  에서 이미 같은 판단을 내렸다. `w-full` 로 옮겼다.
- **높이 55.** 상하 패딩(변수 `spacing/14`) 2개 + 본문 한 줄 27 의 합이다
  (18 × 행간 1.5 = 27, 14 + 27 + 14 = 55). 선언된 제약이 아니라 hug 결과다.
  `TabItem` 이 높이 49 에, `TextFieldSlotEndItems` 가 24×24 에 세운 것과 같은 기준.
  ⚠ 값이 `--spacing-button-height`(55) 와 같지만 축이 다르므로 쓰지 않았다.
  렌더 실측으로 55 가 그대로 나오는 것을 확인했다 (검증 표).

## `StateLayerFocused` 를 재사용한 이유

Figma 자체가 `StateLayer/Focused`(35:12806) **인스턴스**를 쓴다 — `13:2385`(focused) ·
`13:2395`(focused+typing). 새로 그리지 않고 Wave 1 컴포넌트를 그대로 붙였다 (원칙 2).

⚠ `get_design_context` 는 이 인스턴스의 테두리를 변수 `border/strong` 으로 방출하고,
`StateLayerFocused.tsx` 는 `--color-state-focused` 를 쓴다. **두 토큰의 값이 같다** —
둘 다 `--bw-light-black`(`#1a1a1a`)이다. 렌더 픽셀로도 `#1a1a1a` 를 확인했다.
변수 이름이 다르게 보이는 것은 인스턴스 쪽에서 해석된 이름이 다르게 나온 것이고,
그리는 값은 동일하다. 값이 어긋났다면 재사용하지 않았을 것이다.

`StateLayerFocused` 는 `absolute inset-0` 이므로 루트에 `relative` 를 걸었다.

## 접힌 단 — `content` 는 남기고 루트 정렬만 줄였다

Figma 루트는 `flex-col · items-start · justify-center` 다. `items-start` 는 자식이
`w-full` 이라 무효라서 옮기지 않았고, `justify-center` 는 호스트가 높이를 강제할 때
의미가 남으므로 남겼다. `content` · `wrapper` · `text` 세 단은 각각 시각 값
(gap / flex-1 / overflow-clip)을 가지므로 전부 남겼다.

## 지우기 버튼 — `<button>` 으로 감쌌다

**판정: 버튼이 맞다.** 근거.

- 이 아이콘은 `state=focused, isTyping=true` 에만 나타난다. 즉 **입력된 값이 있을 때만**
  뜨는 요소다. 장식이 그런 조건부로 나타날 이유가 없다.
- 글리프가 `close-circle-fill` 이고 자리가 입력 문구 바로 뒤다. 이 조합의 뜻은
  "입력 지우기" 하나다.
- 아이콘이 유일한 의미 전달자다. `<span>` 으로 두면 키보드로 도달할 수 없고
  보조기술에 이름도 노출되지 않는다.

접근성 처리:

- 이름은 **버튼**이 갖는다 — `<button type="button" aria-label={clearLabel}>`.
- 안의 `Icon` 은 `aria-hidden="true"`(기본값) 그대로 둔다.
  버튼이 이미 이름을 갖고 있어 `aria-hidden={false}` 를 넘기면 **이름이 두 번 읽힌다.**
  즉 "아이콘이 유일한 의미 전달자" 라는 조건은 여기서 `Icon` 이 아니라 버튼 쪽에서 해소된다.
- `type="button"` 은 form 안에서 submit 되지 않게 하기 위한 것이다.
- 핸들러 `onClear` 와 이름 `clearLabel` 두 prop 을 열었다. 핸들러 없는 버튼은
  동작하지 않고, 이름 없는 아이콘 버튼은 읽히지 않는다 — 둘 다 이 요소를 성립시키는
  최소값이라 "요청받지 않은 prop" 이 아니다. 그 밖의 prop 은 열지 않았다 (원칙 2).

⚠ 이 판단은 **이 컴포넌트가 아직 `<input>` 이 아니라는 사실과 독립적**이다.
버튼은 어느 쪽이든 버튼이다. 무엇을 지울지는 Wave 3 이 `onClear` 로 연결한다.

## 사용한 토큰

### 컴포넌트 (`TextFieldSlotText.tsx`)

| 토큰 | 유틸리티 | Figma 에서 읽은 값 |
|---|---|---|
| `--color-bg-tertiary` | `bg-bg-tertiary` | 변수 `bg/tertiary` |
| `--radius-4` | `rounded-4` | 변수 `radius/4` |
| `--spacing-16` | `px-16` · `gap-16` | 변수 `spacing/16` |
| `--spacing-14` | `py-14` | 변수 `spacing/14` |
| typography `font-body-large` (`@utility`) | `font-body-large` | 변수 `font/body/large` |
| `--color-text-secondary` | `text-text-secondary` | 변수 `text/secondary` |
| `--color-text-primary` | `text-text-primary` | 변수 `text/primary` |
| `--color-bg-brand` | `bg-bg-brand` | 변수 `bg/brand` (커서) |
| `--radius-100` | `rounded-100` | 변수 `radius/full` (커서) |
| `--spacing-24` | `h-24` | 커서 길이 24 |
| `--spacing-textfield-cursor-width` | `w-textfield-cursor-width` | 커서 두께 2 |

간접 사용:

| 경로 | 토큰 |
|---|---|
| `StateLayerFocused` | `--color-state-focused` · `--spacing-hairline` · `--radius-4` |
| `Icon` (지우기) | `--color-icon-secondary` · `--spacing-24` |
| `TextFieldSlotEndItems` | `--spacing-16` |
| 호출부가 `slotEnd` 에 넘기는 `Icon` | `--color-icon-*` · `--spacing-24` |

토큰이 아닌 유틸리티와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `relative` | 레이아웃 | `StateLayerFocused` 오버레이의 기준 |
| `flex` · `flex-col` · `justify-center` | 레이아웃 | 루트 세로 auto-layout |
| `w-full` | 레이아웃 | 폭 362 를 진열 폭으로 판정 |
| `items-center` | 레이아웃 | `content` · `wrapper` · `text` 의 세로 가운데 정렬 |
| `flex-1` · `min-w-0` | 레이아웃 | `wrapper` · `text` 의 FILL. Figma 는 이 자리에 `min-w-px` 를 방출하지만, Tailwind 코어의 `px`(1px 고정)는 토큰에서 내려오지 않는 raw 값이다. 목적은 flex 자식의 `min-width:auto` 를 푸는 레이아웃 리셋이므로 토큰 값 0(`--spacing-0`)으로 옮겼다 |
| `shrink-0` | 레이아웃 | 커서 · 지우기 버튼 · 슬롯이 줄어들지 않게 |
| `overflow-clip` | 레이아웃 | `text` 13:2381 등의 clip content |
| `truncate` | 레이아웃 | `get_design_context` 의 `overflow-hidden text-ellipsis whitespace-nowrap` |
| `break-words` | 레이아웃 | 텍스트 노드의 `word-break: break-word` |

### 스토리 (`TextFieldSlotText.stories.tsx`)

| 토큰 | 유틸리티 |
|---|---|
| `--color-bg-primary` | `bg-bg-primary` |
| `--color-text-secondary` | `text-text-secondary` |
| `--spacing-12` · `--spacing-24` · `--spacing-40` | `gap-12` · `gap-24` · `p-40` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

## a11y

- 루트는 `<div>` 다. 이 컴포넌트는 문구를 **표시**할 뿐 `<input>` 이 아니다 —
  Figma 의 문구는 텍스트 노드이고 커서도 그려진 사각형이다. 실제 입력 요소로 만들지,
  `<label>`·`aria-describedby` 를 어떻게 연결할지는 이것을 조립하는
  Wave 3 `TextField/Text`(13:2188)가 정한다 (원칙 1·2). props 를 전개하므로
  `id` · `role` 등을 넘길 수 있다.
- 커서는 `aria-hidden` 이다. 순수 장식이고 읽을 내용이 없다.
- 지우기 버튼만 `<button>` 이다 — 위 절 참조.
- `state="focused"` 는 **시각만** 바꾼다. 실제 DOM 포커스를 옮기지 않는다.
  Figma variant 를 그대로 옮긴 것이고, 진짜 포커스와 연결하는 것은 Wave 3 의 몫이다.

## Code Connect

`get_design_context`(13:2377) 응답에 Code Connect 매핑이 없다. 매핑 생성은 이 작업의
요청 범위 밖이라 보고만 한다 (원칙 3).
매핑을 원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `13:2377`).

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 1건을 만나 고쳤다 — 주석에 쓴 hex 값(`#747474`)이 막혀서 "변수 `icon/secondary` 의 값" 이라는 서술로 바꿨다. 최종 파일 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 (`✓ 32 modules transformed`, `✓ built in 285ms`) |
| 없는 조합이 타입 오류인지 | 확인. 임시 파일에 6줄을 넣어 `npm run typecheck` 를 돌린 결과 **오류 정확히 4건** — `default+isTyping` · `done+isTyping` (Text·Password 각각). 유효 조합 `focused+isTyping` · `done` 은 통과. 확인 후 임시 파일 삭제 |
| 빌드 CSS 값 대조 | 번들(`dist/assets/index-Cmt9XODc.css`)에서 확인: `.rounded-4{border-radius:var(--radius-4)}` · `.bg-bg-tertiary{background-color:var(--color-bg-tertiary)}` · `.px-16{padding-inline:var(--spacing-16)}` · `.py-14{padding-block:var(--spacing-14)}` · `.gap-16{gap:var(--spacing-16)}` · `.h-24{height:var(--spacing-24)}` · `.rounded-100{border-radius:var(--radius-100)}` · `.bg-bg-brand{background-color:var(--color-bg-brand)}` · `.font-body-large{…font-size:1.125rem;…line-height:1.5}`. raw 값 0건 |
| 커서 유틸리티 생성 | 토큰 추가 후 번들에 `.w-textfield-cursor-width{width:var(--spacing-textfield-cursor-width)}` 와 `--spacing-textfield-cursor-width:.125rem` 둘 다 있다 |
| 렌더 ↔ Figma 대조 | 아래 표 |

### 렌더 ↔ Figma 픽셀 대조

빌드된 CSS 로 8개 variant(Text 4 + Password 4)를 헤드리스 Chrome 에 1:1 배율로
렌더해 픽셀을 읽고 `get_screenshot`(13:2377) 과 대조했다.

| 측정 | 렌더 | Figma | 판정 |
|---|---|---|---|
| 필드 높이 (default · done) | 55 | 55 | 일치 |
| 필드 높이 (focused, 테두리 포함) | 123..177 = 55 | 55 | 일치 |
| 포커스 테두리 | y=123 · y=177 각 1행, `#1a1a1a` | 변수 `border/strong` `#1a1a1a`, 두께 1 | 일치 |
| 문구 색 (default) | `#747474` | 변수 `text/secondary` | 일치 |
| 문구 색 (done) | `#1a1a1a` | 변수 `text/primary` | 일치 |
| 문구 색 (focused+typing) | `#1a1a1a` | 변수 `text/primary` | 일치 |
| 지우기 아이콘 색 | `#747474` | export SVG fill | 일치 |
| 슬롯 아이콘 색 | `#747474` | 변수 `icon/secondary` | 일치 |
| 커서 색 | `#e4107a` | 변수 `bg/brand` | 일치 |
| 커서 위치 | focused 는 문구 **앞**, typing 은 문구 **뒤** | 13:2389 는 문구 앞, 13:2400 은 문구 뒤 | 일치 |
| **커서 표시 여부** | 보임 | 보임 | 일치 (토큰 추가 후) |

⚠ 위 커서 표시 항목은 **구현 당시** 검증용으로 프리뷰 HTML 에만 `width: 0.125rem` 규칙을
주입해 재렌더한 뒤 확인한 것이다 (`src/tokens/**` 는 건드리지 않았다). 주입 후에는
색·길이·위치가 Figma 스크린샷과 그대로 맞았다 — 즉 **코드는 완성돼 있고
빠진 것은 토큰 1개뿐이다.** 확인 후 프리뷰 파일은 전부 삭제했다.

⚠ **한계**: 이 저장소에는 Pretendard 웹폰트가 포함돼 있지 않아 렌더에 폴백 서체가
쓰인다. 위 대조는 색·위치·크기에 대한 것이고 글자 모양은 Figma 와 다르다.
이 한계는 `typography.tokens.css` 가 이미 명시해 둔 것이고 이 컴포넌트가 만든 것이 아니다.

---

## 추가: `input` prop — 실제 입력 모드 (2026-08-25, `page/Login` 작업)

이 문서의 "a11y" 절은 *"이 컴포넌트는 문구를 **표시**할 뿐 `<input>` 이 아니다 … 실제 입력
요소로 만들지 여부는 이것을 조립하는 Wave 3 이 정한다"* 로 결론을 미뤄 두었다.
요청자 결정(*"실제 입력이 되어야 해"*)으로 그 답이 정해져서, 입력 요소를 **이 슬롯에** 넣었다.

### 왜 조립 단이 아니라 이 슬롯인가

이 슬롯이 문구의 타이포·색·말줄임·커서 기하와 지우기 버튼의 자리를 전부 소유한다.
조립 단에서 `<input>` 을 만들어 `children` 으로 넘기면 그 값들을 슬롯 밖에서 다시 정해야
하고, 슬롯 내부 flex 레이아웃과도 싸운다.

### 두 모드를 남긴 이유

이 컴포넌트는 두 가지 일을 겸한다. Storybook 은 Figma variant 4개를 **그림으로** 세워
보여야 해서 `<p>` 가 필요하고 (`● ● ● ● ● ●` 같은 문구는 값이 아니라 그림이다),
페이지는 타이핑되는 `<input>` 이 필요하다. 진열 모드를 지우면 앞쪽이 표현 불가가 된다.
그래서 `input` 을 넘긴 경우에만 갈라진다. 넘기지 않으면 기존과 완전히 같다.

### 입력 모드에서 달라지는 것

| | 진열 모드 (기존) | 입력 모드 |
|---|---|---|
| 문구 요소 | `<p>{children}</p>` | `<input>` |
| 장식 커서 (13:2389 · 13:2400 · 13:2365 · 13:2374) | 그린다 | **안 그린다** — 브라우저가 진짜 캐럿을 그려 두 개가 겹친다 |
| 포커스 링 | `state` prop 이 켠다 | **실제 포커스**가 켠다 (`group-focus-within`) |
| 지우기 버튼 | `isTyping` 이면 항상 | `onClear` 가 있을 때만 |
| placeholder 색 | 해당 없음 | `text/disabled-onLight` |

### 포커스 링을 CSS 로 돌린 이유 — WCAG 2.4.7

입력 모드의 `<input>` 은 UA 기본 포커스 링을 끈다 (`outline-none`). 링을 그리는 조건과
끄는 조건이 어긋나면 *"포커스는 가는데 표시가 없는"* 상태가 만들어진다. 둘을 같은
셀렉터(`group-focus-within`)에 묶으면 그 간극이 생길 수 없다. `Button.tsx` 가 pressed
레이어에 `hidden group-active:block` 을 쓴 것과 같은 방식이고, `Button` 의
`uaFocusOutline` 주석이 세운 규율과 같다.

### placeholder 색은 Figma 근거가 있다

`page/Login` 의 인스턴스(27818:7077 · 27818:7078)에서 문구가 `state=default` 의
`text/secondary` 가 아니라 **`text/disabled-onLight`** 다. 그래서 입력 모드의
placeholder 에만 그 색을 건다. 진열 모드의 색 규칙은 건드리지 않았다.
