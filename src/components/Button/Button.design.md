# Button — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `Button.tsx`, 스토리는 `Button.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=1-4004&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27704:1745` — section "Button" |
| 프레임 | `1:4004` — "Button", 900×240, symbol 12개 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문):

> Button Page는 페이지 단위에서 **주요 행동을 수행하기 위해 사용하는 버튼 컴포넌트입니다.**
> 화면의 핵심 행동을 명확하게 전달하기 위해 사용되며, 결제, 다음 단계 진행, 완료 등의
> 주요 CTA에 활용됩니다.

## 변형 12개 — 전 조합이 아니다

축은 넷(`variant` · `hierarchy` · `state` · `isDisabled`)이지만 전 조합(2×2×3×2 = 24)이
아니라 **스타일 3종 × 상태 4종 = 12** 다.

| 스타일 | default | pressed | focused | disabled |
|---|---|---|---|---|
| filled / primary | `1:4061` | `1:4055` | `1:4049` | `1:4044` |
| filled / secondary | `1:4039` | `1:4033` | `1:4027` | `1:4022` |
| ghost / secondary | `1:4066` | `1:4016` | `1:4010` | `1:4005` |

두 가지 부재를 코드에서 다르게 다뤘다.

| 없는 조합 | 어디서 막는가 | 근거 |
|---|---|---|
| `ghost` × `primary` | **타입** — `ButtonVariant` 에 `'ghost-primary'` 가 없다 | 실제 호출부가 늘 쓰는 prop 하나 안의 도메인 제약이다. 타입으로 막으면 비용 없이 컴파일 단계에서 걸린다 |
| `isDisabled=true` × `state='pressed'\|'focused'` | **런타임** — `isDisabled` 면 오버레이를 렌더하지 않는다 | 아래 참조 |

`isDisabled` × `state` 를 타입으로 묶지 않은 이유: `isDisabled` 는 실제 호출부가 쓰는
prop 이고 `state` 는 **스토리 전용 강제 지정 prop** 이다. 둘을 discriminated union 으로
묶으면 `state` 를 넘기지 않는 대다수 호출부까지 스토리 전용 제약을 만족시켜야 한다.
비용을 지는 쪽과 이득을 보는 쪽이 어긋난다. 브라우저 동작도 같은 방향이다 —
`disabled` 버튼은 `:active` 도 `:focus-visible` 도 되지 않으므로 기본 경로에서는
애초에 그 조합이 생기지 않는다.

`variant` 와 `hierarchy` 를 한 prop 으로 합친 이유도 같다. 축 2개로 두면 타입상
`ghost-primary` 가 만들어지고, 그것을 런타임 분기로 처리해야 한다. 값 3개짜리 union
하나면 존재하지 않는 조합이 **컴파일되지 않는다.**

## 노드 구조

```
symbol 1:4061  "variant=filled, hierarchy=primary, state=default, isDisabled=false"   82×55
└─ frame 1:4062 "content"   x=20 y=18  42×19   (relative, gap spacing/4)
   └─ text 1:4064 "label"   42×19            font/label/large

symbol 1:4055  (… state=pressed …)   82×55
├─ instance 1:4056 "[State Layer] Pressed"   0,0  82×55     ← 콘텐츠보다 먼저
└─ frame    1:4057 "content"

symbol 1:4049  (… state=focused …)   82×55
├─ frame    1:4050 "content"
└─ instance 1:4054 "[State Layer] Focused"   0,0  82×55
```

루트는 세로 auto-layout 이고 그 안에 가로 `content` 프레임 하나가 들어간다.
상태 오버레이는 `absolute` 인스턴스로 루트 위에 얹힌다.

## 값의 출처

`불명`으로 남은 값은 없다. 추정한 값도 없다.

| 값 | 출처 | 결론 |
|---|---|---|
| 라벨 타이포 | Figma 스타일 `font/label/large` = size `font-size/label-large`(16) · weight 500 · lineHeight 100 · letterSpacing 0. **12개 variant 전부 동일** | 기존 `font-label-large` (`1rem` / `--font-weight-base`=500 / `line-height:1`). **값 일치 → 재사용** |
| 좌우 padding | Figma 변수 `spacing/20` = 20 | `--spacing-20` = `1.25rem`. 일치 → `px-20` |
| 상하 padding | Figma 변수 `spacing/14` = 14 | `--spacing-14` = `0.875rem`. 일치 → `py-14` |
| content 내부 간격 | Figma 변수 `spacing/4` = 4 | `--spacing-4` = `0.25rem`. 일치 → `gap-4` |
| 코너 반경 | Figma 변수 `radius/4` = 4 | `--radius-4` = `0.25rem`. 일치 → `rounded-4` |
| 높이 | `min-h: 55` — **Figma 변수 아님, 레이어 실측 제약** (아래 "높이" 참조) | `--spacing-button-height` = `3.4375rem`. 일치 → `min-h-button-height` |
| 폭 | hug — 라벨 42 + `spacing/20`×2 = 82 | 폭 토큰을 쓰지 않는다. `inline-flex` 로 콘텐츠를 감싼다 |
| primary fill | 변수 `button/primary-fill` · `-pressed` · `-focused` = 셋 다 `#e10975` | `--color-button-primary-fill` 외 2종. **값 일치 → 재사용** |
| secondary fill | 변수 `button/secondary-fill` · `-pressed` · `-focused` = 셋 다 `#1a1a1a` | `--color-button-secondary-fill` 외 2종. 일치 |
| ghost fill | 세 상태 모두 **없음** | 배경 유틸리티가 들어갈 자리가 없다 |
| disabled fill | 변수 `button/disabled-fill` = `#ebebeb`. **filled 2종만** 갖는다 | `--color-button-disabled-fill` → `--neutral-gray-light-100` = `#ebebeb`. 일치 |
| primary 라벨색 | 변수 `button/primary-text` = `#ffffff` | `--color-button-primary-text` → `--bw-white`. 일치 |
| secondary 라벨색 | 변수 `button/secondary-text` = `#ffffff` | `--color-button-secondary-text` → `--bw-white`. 일치 |
| ghost 라벨색 | 변수 `button/ghost-text` = `#1a1a1a` | `--color-button-ghost-text` → `--bw-light-black`. 일치 |
| disabled 라벨색 | 변수 `text/disabled-onLight` = `#1a1a1a29` (`1:4044` · `1:4005` 의 실제 바인딩) | `--color-text-disabled-on-light` → `--dimmed-black-16` = `#1a1a1a29`. 일치 |
| pressed 오버레이 | 인스턴스 `35:12786`(black) / `35:12766`(white), 둘 다 `boundaryOut=false` | `StateLayerPressed` 재사용 |
| focused 링 | 인스턴스 `35:12817`, `outerFocus=true` | `StateLayerFocused` 재사용 |
| 루트 clip | `state=focused` 3종만 clip 없음. 나머지 9종은 `overflow-clip` | `overflow-hidden` / `overflow-visible` |
| transition · shadow | Figma 에 정의 없음 | 코드에 들어갈 자리가 없다. 교체 전 코드의 `transition-colors` 는 Figma 근거가 없어 넣지 않았다 (원칙 2) |

### `button/disabled-text` — Figma 내부 불일치

`get_variable_defs(27677:2907)` 에 `button/disabled-text` = `#1a1a1a`(불투명 검정)이 있고,
저장소의 `--color-button-disabled-text` 는 그 값을 정확히 옮긴 것이다. **저장소는 어긋나 있지 않다.**

어긋난 것은 Figma 내부다 — `button/disabled-text` 는 **어느 variant 에도 바인딩돼 있지 않은
미사용 변수**이고, disabled 라벨 2개(`1:4044` · `1:4005`)가 실제로 바인딩한 것은
`text/disabled-onLight`(`#1a1a1a29`) 다.

구현은 **실제 바인딩을 따른다** — `--color-text-disabled-on-light` 를 쓴다.
`--color-button-disabled-text` 는 이 컴포넌트에서 쓰이지 않는다. 이 사실만 기록하고
토큰은 건드리지 않는다 (원칙 3, 그리고 토큰은 `token-guardian` 권한이다).

### 높이 — 왜 새 토큰이 필요했나

`1:4061`(state layer 가 없어 레이어 개입이 배제된 variant)에서 확인했다.

| 축 | 계산 | 실제 | 판정 |
|---|---|---|---|
| 폭 | 라벨 42 + `spacing/20`×2 = **82** | 82 | **hug 결과** |
| 높이 | 라벨 19 + `spacing/14`×2 = **47** | **55** | **hug 아님 — 8px 초과** |

콘텐츠가 y=18 에 있다. `(55−19)/2 = 18` — 선언된 padding 14 가 아니라 강제된 높이 안에서
가운데 정렬된 결과다. hug 였다면 y=14 여야 한다. `get_design_context` 도 12개 variant
전부의 루트에 `min-h-[55px]` 를 방출하고, `get_variable_defs` 에 높이 변수가 없다.

→ **설정된 제약이고 Figma 변수가 아닌 실측값이다.** `token-guardian` 이
`--spacing-button-height` 를 추가해 해소했다. `--spacing-control-*`(32/40/48)에 넣지 않은
이유는 그 축이 "Figma 출처 없음" 인 기존 저장소 값이라 출처가 섞이고, `sm/md/lg` 에 얹으면
Figma Button 에 없는 size 축을 암시하기 때문이다. 근거는 `spacing.tokens.css` 주석에 있다.

## 사용한 토큰

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--spacing-button-height` | `min-h-button-height` | 루트 `min-h` 55 (실측 제약) |
| `--spacing-20` | `px-20` | 변수 `spacing/20` = 20 |
| `--spacing-14` | `py-14` | 변수 `spacing/14` = 14 |
| `--spacing-4` | `gap-4` | 변수 `spacing/4` = 4 |
| `--radius-4` | `rounded-4` | 변수 `radius/4` = 4 |
| `--color-button-primary-fill` / `-pressed` / `-focused` | `bg-…` (`active:` · `focus-visible:` 포함) | `#e10975` ×3 |
| `--color-button-secondary-fill` / `-pressed` / `-focused` | `bg-…` | `#1a1a1a` ×3 |
| `--color-button-primary-text` | `text-button-primary-text` | `#ffffff` |
| `--color-button-secondary-text` | `text-button-secondary-text` | `#ffffff` |
| `--color-button-ghost-text` | `text-button-ghost-text` | `#1a1a1a` |
| `--color-button-disabled-fill` | `bg-button-disabled-fill` | `#ebebeb` |
| `--color-text-disabled-on-light` | `text-text-disabled-on-light` | `#1a1a1a29` |
| typography `font-label-large` (`@utility`) | `font-label-large` | `font/label/large` |

오버레이 2개가 쓰는 토큰은 각 컴포넌트의 design.md 에 있다 (`--color-state-layer-pressed-*`,
`--color-state-focused`, `--spacing-hairline`, `--radius-0`, `--radius-4`, `--spacing-0`, `--spacing-4`).

토큰이 아닌 유틸리티와 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `inline-flex` · `flex-col` · `items-center` · `justify-center` | 레이아웃 | Figma 루트의 세로 auto-layout + hug 폭을 직역. 치수 리터럴이 아니다 |
| `relative` (루트 · 라벨) | 레이아웃 | 오버레이가 `absolute` 라 루트에 필요하고, 라벨에는 칠 순서 때문에 필요하다 (아래 참조) |
| `group` | 변형 훅 | 오버레이가 버튼의 `:active` · `:focus-visible` 을 읽는다 |
| `overflow-hidden` / `overflow-visible` | 레이아웃 | Figma 루트의 clip 유무를 직역 |
| `hidden` / `group-*:block` | 표시 | 오버레이를 CSS 로만 켜고 끈다 |
| `focus-visible:outline-none` | 리셋 | UA 기본 포커스 링을 끄고 그 자리를 `StateLayerFocused` 가 대신 그린다 |
| `w-full` · `shrink-0` | 레이아웃 | Figma `content` 프레임의 `w-full` · `shrink-0` 직역 |

## 상태 표현 — 두 경로

**기본 경로는 `state` 를 넘기지 않는 것이다.** 그러면 `:active`(pressed) 와
`:focus-visible`(focused) 로 브라우저가 상태를 만든다. 호출부가 아무것도 넘기지 않아도
인터랙션이 동작한다.

`state` prop 은 **Storybook 에서 12개 변형을 정적으로 캡처하기 위한 강제 지정용**이다.
실제 사용처에서 쓰는 prop 이 아니며 그 사실을 JSDoc 에 적어 두었다.

Figma 는 pressed·focused 에서 **fill 토큰 교체와 오버레이를 함께** 한다. 오버레이만으로
상태를 만들지 않으므로 두 가지를 모두 넣었다. (primary·secondary 는 세 상태의 fill 값이
같지만, 값이 같다고 토큰을 하나로 줄이지 않는다 — Figma 가 구분해 둔 것을 그대로 옮긴다.)

Tailwind 는 소스에 적힌 **완전한 클래스 문자열만** 스캔한다. 그래서 `active:${…}` 처럼
조합해 만들지 않고 `VARIANT_AUTO` · `VARIANT_FORCED` 에 펼쳐 적었다.

### `:focus` vs `:focus-visible`

**Figma 에서 확인되지 않는 값이다.** Figma 는 `state=focused` 를 정적 variant 로만 정의하고
그 트리거를 말하지 않는다.

**저장소 선례를 따라 `:focus-visible` 로 했다.** 교체 전 `Button.tsx` 가
`focus-visible:outline-2 focus-visible:outline-offset-2` 를 쓰고 있었다.
확인되지 않았다는 사실과 선례를 따랐다는 사실을 둘 다 기록해 둔다. (원칙 1)

## 오버레이 합성

| 항목 | 내용 |
|---|---|
| pressed 색 | `filled-secondary` → `color="white"`, 나머지 둘 → `color="black"` (`I1:4034;35:12767` vs `I1:4056;35:12787` · `I1:4017;35:12787`) |
| pressed offset | `boundaryOut=false` (3종 전부) |
| focused offset | `outerFocus=true` (3종 전부, `…;35:12818`) |
| 자식 순서 | pressed 레이어는 라벨 **앞**. focus 링은 순서 무관 |
| clip | `state=focused` 만 clip 없음. 나머지 9종은 건다 |

**라벨의 `relative` 가 필수다.** static 요소는 DOM 순서와 무관하게 positioned 형제보다
먼저 칠해진다. 라벨이 static 이면 순서를 앞뒤로 바꿔도 pressed 오버레이가 라벨 위로
올라와 라벨까지 어두워진다. Figma 의 `content` 프레임도 같은 이유로 relative 다.

**반경**: pressed 레이어는 Figma 에서 `radius/0`(직각)이다. Figma 는 부모의 clip 으로
모서리를 잘라 이 직각을 감춘다. **코드에서는 그 clip 에 기댈 수 없다** — 아래 참조.

`boundaryOut=true` 를 클립할 수 없는 문제는 Button 에서 발생하지 않는다. pressed 3종이
전부 `boundaryOut=false` 이기 때문이다.

### clip 과 반경의 충돌 — 해결 (2026-08-24, design-reviewer 경고 반영)

auto 경로의 clip 은 `overflow-hidden focus-visible:overflow-visible` 이다.
**키보드 포커스 상태에서 누르면 `:focus-visible` 과 `:active` 가 동시에 성립한다.**
그러면 `overflow-visible` 이 이겨 clip 이 풀리고, 직각 pressed 레이어가 버튼의
`rounded-4` 모서리 밖으로 삐져나온다.

두 요구가 본질적으로 충돌한다 — pressed 레이어는 클립돼야 하고 focus 링은 클립되면
안 되는데, `overflow` 는 요소 하나에 하나뿐이다. **레이어의 모서리를 clip 이 아니라
레이어 자신이 갖게 해서 충돌을 없앴다**: 호스트가 `rounded-4` 를 `className` 으로 넘긴다.

같은 픽셀이 나오는 근거: 반경 4 사각형을 그리는 것과, 직각 사각형을 반경 4 로 잘라내는
것은 같은 도형이다. 레이어는 `inset-0` 라 버튼 박스와 정확히 같은 사각형을 덮으므로,
반경까지 같으면 clip 유무와 무관하게 결과가 동일하다. Figma 가 clip 으로 얻는 픽셀과 같다.

- `StateLayerPressed.tsx` 는 **고치지 않았다.** 여전히 `rounded-0` 을 기본으로 갖고
  크기·반경을 호스트가 정하는 구조 그대로다. 호스트가 필요할 때 덮어쓸 뿐이다.
- 덮어쓰기가 성립하는 근거: Tailwind v4 는 `@theme` 선언 순서로 유틸리티를 정렬한다.
  `--radius-0` 이 `--radius-4` 보다 먼저 선언돼 있어 산출 CSS 에서 `.rounded-0`(오프셋
  10726)이 `.rounded-4`(10767)보다 앞에 온다 → 뒤에 오는 `.rounded-4` 가 이긴다.
  클래스 속성의 순서가 아니라 **스타일시트 순서**가 판정한다. 빌드마다 확인한다.
- Figma 의 per-state clip 자체는 그대로 유지했다 (9종 clip, focused 3종 해제).
  레이어 반경은 clip 이 풀리는 순간을 위한 이중 안전장치다.

## a11y

| 항목 | 처리 |
|---|---|
| `isDisabled` | Figma `isDisabled` 축 ↔ HTML `disabled` 속성. **시각뿐 아니라 실제로 비활성화된다.** 포커스도 클릭도 되지 않고, 보조기술이 "사용 불가" 로 읽는다 |
| `type` | 기본 `"button"`. form 안에서 의도치 않게 submit 되지 않게 한다 (교체 전 코드와 같은 처리) |
| 오버레이 2개 | 각각 `aria-hidden` 이라 접근성 트리에 나타나지 않는다. 순수 장식이고, 전달하는 상태(눌림·포커스)는 네이티브 버튼이 이미 알린다 |
| 포커스 표시 | UA 아웃라인을 끄는 조건과 대체 링을 그리는 조건이 **같은 불리언**(`showFocused`)이다. 아래 참조 |
| 라벨 대비 | disabled 라벨은 Figma 가 `text/disabled-onLight`(16% 검정)를 쓴다. 대비가 낮지만 **Figma 원본 그대로**이고 임의로 올리지 않았다. 비활성 요소는 WCAG 1.4.3 대비 요구 대상이 아니다 |

### 포커스 표시 — FAIL 수정 (2026-08-24, design-reviewer 지적 반영)

**결함**: `focus-visible:outline-none` 이 className 배열에 상수로 들어가 **무조건** 적용됐다.
그런데 대체 링을 그리는 `StateLayerFocused` 는 `showFocused` 조건부였다.
`state="default"` · `state="pressed"` 를 넘기면 링이 렌더되지 않는데 UA 아웃라인은
이미 꺼져 있어 **포커스를 받아도 아무 표시가 없었다.** WCAG 2.4.7 미달이다.

가설이 아니었다 — `AllVariants` 스토리가 `state: 'default'` · `'pressed'` 로 6개 버튼을
그 상태로 출고하고 있었고, `state` 는 exported public prop 이라 타입으로 막혀 있지 않다.

**수정**: 끄는 조건과 그리는 조건을 하나의 값으로 묶었다.

```
const uaFocusOutline = showFocused ? 'focus-visible:outline-none' : '';
```

`showFocused` 가 false 인 경로에서는 UA 아웃라인을 **남긴다.** 브라우저 기본 표시가
그대로 나오므로 포커스 표시가 사라지는 조합이 없다.

| `isDisabled` | `state` | 포커스 가능? | 표시 |
|---|---|---|---|
| false | 미지정 | O | `StateLayerFocused` (`group-focus-visible:block`) |
| false | `'focused'` | O | `StateLayerFocused` (항상 표시) |
| false | `'default'` | O | **UA 아웃라인** (끄지 않음) |
| false | `'pressed'` | O | **UA 아웃라인** (끄지 않음) |
| true | 전부 | X (`disabled`) | 불필요 |

`variant` 3종은 이 판정에 관여하지 않는다 (색만 다르다). 3 × 4 × 2 = 24 조합에서
"포커스 가능한데 표시 없음" 은 **0건**이다.

## Figma 재확인 (2026-08-24)

`design-reviewer` 세션에 Figma MCP 가 노출되지 않아 원값 대조가 N/A 로 남았다.
`get_design_context` 로 6개 노드를 개별 재확인했다. 수정 후에도 결과는 바뀌지 않는다.

| 노드 | 루트 `overflow-clip` | 코드와 일치? |
|---|---|---|
| `1:4049` filled/primary focused | **없음** | O — `focus-visible:overflow-visible` |
| `1:4027` filled/secondary focused | **없음** | O |
| `1:4010` ghost/secondary focused | **없음** (fill 도 없음) | O |
| `1:4055` filled/primary pressed | **있음** | O — `overflow-hidden` |
| `1:4033` filled/secondary pressed | **있음** | O |
| `1:4016` ghost/secondary pressed | **있음** | O |

곁들여 재확인된 값: focused 3종 전부 `…;35:12818`(`outerFocus=true`),
pressed 는 `I1:4034;35:12767`(white) · `I1:4017;35:12787`(black) 로 색 매핑이 유지되고
셋 다 `boundaryOut=false` 다. `min-h-[55px]` · `px-[spacing/20]` · `py-[spacing/14]` ·
`rounded-[radius/4]` · `font-size/label-large` 도 6개 노드 전부에서 동일하다.

**이번 수정은 Figma 대조 결과를 바꾸지 않는다.** 레이어에 준 `rounded-4` 는 Figma 가
부모 clip 으로 얻던 것과 같은 픽셀이고, UA 아웃라인은 Figma 에 없는 브라우저 기본값이라
`state` 강제 지정(스토리 전용 경로)에서만 나타난다.

## Code Connect

`get_design_context`(1:4004) 응답에 Code Connect 매핑이 없었다.
매핑 생성은 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| raw 값 스캔 | `Button.tsx` · `Button.stories.tsx` · `App.tsx` 전부 **0건** |
| Tailwind 코어 `border` · `h-px` | 사용 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 (exit 0, `✓ 32 modules transformed`) |
| `npm run build-storybook` | 통과 (exit 0, `✓ built in 1.40s`) |
| 빌드 CSS 방출 | `.min-h-button-height{min-height:var(--spacing-button-height)}` 방출 확인 (`dist/assets/index-BIyF-A02.css`). 의사클래스 변형(`active:` · `focus-visible:` · `group-active:` · `group-focus-visible:`)도 전부 방출 |
| 빌드 CSS 값 대조 | 색 11종 · 간격 4종 · 반경 1종 · 높이 1종의 최종 값이 Figma 변수·실측값과 전부 일치 |
| `get_screenshot`(1:4004) 대조 | 3행×4열. 행=스타일 3종, 열=default/pressed/focused/disabled. pressed 열에서 1·3행은 어두워지고 2행만 밝아진다(검은 fill 위 white 오버레이). focused 열은 버튼 **바깥**에 검은 링. disabled 열은 filled 2종만 회색 fill, ghost 는 fill 없이 흐린 라벨. `AllVariants` 스토리가 같은 배치·같은 분기를 만든다 |
| 목적 3 산출물 | **4/4** — ① 이 파일 · ② `Button.tsx` · ③ `Button.stories.tsx` · ④ 이 표 |
