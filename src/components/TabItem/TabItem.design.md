# TabItem — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `TabItem.tsx`, 스토리는 `TabItem.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=20-7623&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27776:6988` — section "Tab", 1657×449 (요청자가 선택한 영역) |
| 컴포넌트 세트 | `20:7623` — frame "Tab/ Item", 1220×140 |
| 추출 | `get_metadata`(27776:6988 · 20:7628 · 20:7633) · `get_design_context`(20:7623) · `get_variable_defs`(27776:6988) (2026-08-24) |

## 노드 구조

선택 영역 안의 컴포넌트는 2개이고, 의존성은 `TabItem → Tab` 한 방향이다.

```
section 27776:6988  "Tab"  1657×449
├─ symbol 20:7647  "Tab"        402×49   ← 상위. Tab.design.md
└─ frame  20:7623  "Tab/ Item"  1220×140 ← 이 파일. variant 4개
   ├─ symbol 20:7624  "state=default, isSelected=true"   71×49
   ├─ symbol 20:7628  "state=pressed, isSelected=true"   71×49
   ├─ symbol 20:7633  "state=focused, isSelected=true"   71×49
   └─ symbol 20:7637  "state=default, isSelected=false"  71×49
```

variant 하나의 내부 (20:7628 = pressed / selected, 4개 자식이 모두 나오는 유일한 변형):

```
symbol 20:7628                                  71×49
├─ rounded-rectangle 20:7629  "border"   x=0  y=47  71×2    fill = border/strong
├─ frame 20:7630              "content"  x=12 y=0   47×49   padding-y = spacing/14
│  └─ text 20:7631            "label"    x=0  y=14  47×21   font/label/xLarge-strong
├─ frame 20:7632 부모 래퍼 27776:6987 "Pressed"  x=2 y=2  67×43
   └─ instance 20:7632  "StateLayer/Pressed"    x=0 y=0  67×43
```

focused variant (20:7633) 은 자식이 2개뿐이다 — `border` 노드가 **없다**.

```
symbol 20:7633                                  71×49
├─ frame 20:7634     "content"              x=12 y=0  47×49
│  └─ text 20:7635   "label"                x=0  y=14 47×21
└─ instance 20:7636  "StateLayer/Focused"   x=2  y=2  67×43   ← 래퍼 프레임 없이 직접
```

## 하위 컴포넌트 인스턴스 — 2개, 둘 다 이 저장소에 이미 있다

| Figma 인스턴스 | 세트 | 저장소 컴포넌트 | 새로 만들었나 |
|---|---|---|---|
| `20:7632` StateLayer/Pressed | `35:12765` | `src/components/StateLayerPressed` | 아니오 — 재사용 |
| `20:7636` StateLayer/Focused | `35:12806` | `src/components/StateLayerFocused` | 아니오 — 재사용 |

`get_design_context`(20:7623) 가 반환한 컴포넌트 설명도 `StateLayer/Focused`(35:12806)
하나뿐이며, `StateLayerFocused.tsx` 의 헤더 주석에 옮겨 둔 문구와 같다.

## variant 조사 결과 — 축 2개 × 조합 4개 (전 조합 아님)

`get_design_context`(20:7623) 가 방출한 property 는 `isSelected`(boolean) ·
`state`("default" | "pressed" | "focused") · `text` 3개다.

| `state` | `isSelected` | 노드 | 존재 |
|---|---|---|---|
| default | false | 20:7637 | ✔ |
| default | true | 20:7624 | ✔ |
| pressed | true | 20:7628 | ✔ |
| focused | true | 20:7633 | ✔ |
| pressed | false | — | ✘ **없음** |
| focused | false | — | ✘ **없음** |

2×3 = 6 중 4개만 있다. **선택되지 않은 탭의 pressed · focused 표현이 Figma 에 없다.**
없는 것을 지어내지 않는다 (원칙 1) — 코드는 `isSelected=false` 에서 두 오버레이를
그리지 않고, 포커스 표시는 브라우저 기본 아웃라인에 맡긴다 (아래 a11y 참조).

`Button` 이 `state` 를 Storybook 캡처 전용 prop 으로 둔 것과 같은 구조라 그 형태를
그대로 따랐다 — `state` 미지정이 기본 경로이고 `:active` · `:focus-visible` 이 동작한다.

## 값의 출처

| 값 | Figma 원값 | 출처 | 토큰 | 결론 |
|---|---|---|---|---|
| 좌우 패딩 | 12 | 변수 `spacing/12` | `--spacing-12` = `0.75rem` = 12px | 값 일치 → 재사용 (`px-12`) |
| content 상하 패딩 | 14 | 변수 `spacing/14` | `--spacing-14` = `0.875rem` = 14px | 값 일치 → 재사용 (`py-14`) |
| 선택 라벨 색 | `#1a1a1a` | 변수 `text/primary` | `--color-text-primary` → `--bw-light-black` = `#1a1a1a` | 값 일치 → 재사용 (`text-text-primary`) |
| 비선택 라벨 색 | `#747474` | 변수 `text/secondary` | `--color-text-secondary` → `--neutral-gray-light-600` = `#747474` | 값 일치 → 재사용 (`text-text-secondary`) |
| 라벨 타이포 | `Font(family: family-font, style: Bold, size: font-size/label-xLarge(18), weight: 700, lineHeight: 100, letterSpacing: 0)` | 변수 `font/label/xLarge-strong` | `@utility font-label-x-large-700` = `1.125rem`(18px) / `--font-weight-strong`(700) / `line-height: normal` | 4개 값 전부 일치 → 재사용 (아래 lineHeight 주석 참조) |
| 선택 표시선 색 | `#1a1a1a` | 변수 `border/strong` | `--color-border-strong` → `--bw-light-black` = `#1a1a1a` | 값 일치 → 재사용 (`bg-border-strong`) |
| 선택 표시선 두께 | 2 | 노드 20:7629 · 20:7625 의 height (**변수 바인딩 없음**) | `--spacing-tab-indicator-height` = `0.125rem` = 2px | **신규 토큰** (아래 참조) |
| 상태 레이어 좌·우·상 인셋 | 2 | 노드 27776:6987 · 20:7636 의 x=2 · y=2 (**변수 바인딩 없음**) | `--spacing-tab-state-layer-inset` = `0.125rem` = 2px | **신규 토큰** (아래 참조) |
| 상태 레이어 하단 인셋 | 4 (= 49 − 2 − 43) | 위 두 노드의 height=43 에서 파생 | `--spacing-4` = `0.25rem` = 4px | 값 일치 → **기존 토큰 재사용** (`bottom-4`) |
| pressed 오버레이 색 | `#1a1a1a29` | 변수 `stateLayer/pressed-black` | `--color-state-layer-pressed-black` → `--dimmed-black-16` = `#1a1a1a29` | 값 일치 → `StateLayerPressed` 기본값 |
| focused 링 색 | `#1a1a1a` | 변수 `state/focused` | `--color-state-focused` → `--bw-light-black` = `#1a1a1a` | 값 일치 → `StateLayerFocused` 기본값 |
| 상태 레이어 반경 | 4 | 변수 `radius/4` | `--radius-4` = `0.25rem` = 4px | 값 일치 → 재사용 (`rounded-4`) |
| 루트 반경 | 없음 | 20:7624 · 20:7628 · 20:7633 · 20:7637 에 코너 반경 없음 | — | 반경 유틸리티가 들어갈 자리가 없다 |
| 루트 fill | 없음 | 네 variant 모두 fill 0건 | — | 배경 유틸리티가 들어갈 자리가 없다 |
| 폭 71 | 12 + 47 + 12 | hug 결과 (라벨 47) | — | 폭 토큰을 쓰지 않는다. `Tab` 이 grow 를 건다 |
| 높이 49 | 14 + 21 + 14 | hug 결과 (라벨 높이 21) | — | 높이 토큰을 쓰지 않는다 (아래 참조) |

`불명`으로 남은 값은 없다.

## 신규 토큰 2건 — 둘 다 2px 이지만 합치지 않았다

`spacing.tokens.css` 에 추가됐다.

```
--spacing-tab-indicator-height: 0.125rem;   /* 20:7629 · 20:7625 의 height = 2 */
--spacing-tab-state-layer-inset: 0.125rem;  /* 27776:6987 · 20:7636 의 x=2 · y=2 */
```

- **출처는 Figma 레이어 실측값이다.** `get_variable_defs`(27776:6988) 가 낸 number
  변수는 `spacing/12` · `spacing/14` · `spacing/20` · `font-size/label-xLarge` ·
  `radius/0` · `radius/4` 뿐이고 **2 는 없다.** 가이드 표에도 없다.
- **spacing 13단 스케일(`0, 4, 6, 8, 12, 14, 16, 20, 24, 32, 40, 64, 80, 100`)에
  끼워 넣지 않았다.** `--spacing-hairline` · OS 바 실측값과 같은 이유다 — 그 13단은
  Figma 가이드 표를 그대로 옮긴 것이고 2 는 그 표에 없다.
- **값이 같은데도 두 토큰으로 나눈 이유**: `--spacing-hairline` 이 1px 두 실측값을
  합칠 때 세운 기준이 *"값이 같아서가 아니라 축이 같아서"* 였다. 여기서 하나는
  선의 두께이고 다른 하나는 오버레이의 인셋이라 축이 다르다. 한쪽이 Figma 에서
  움직여도 다른 쪽은 따라가지 않는다. 같은 파일이 `clock-inset-y` 와
  `indicators-height`(둘 다 13px)를 합치지 않은 것과 같은 판정이다.
- 하단 인셋 4 는 새 토큰을 만들지 않고 기존 `--spacing-4` 를 썼다 — 값이 같고,
  `StateLayerPressed` 가 `boundaryOut` 에서 같은 토큰을 같은 성격으로 재사용한 선례가 있다. (원칙 2)

## focused 에서 선택 표시선이 사라진다 — Figma 그대로 옮겼다

`state=focused, isSelected=true`(20:7633)에는 `border` 자식 노드가 없고,
`default`(20:7625) · `pressed`(20:7629) 의 선택 변형에는 있다. `get_metadata` 로
세 variant 를 각각 조회해 확인했고, `get_design_context` 도 같은 조건을 방출한다
(`isSelected && ["default","pressed"].includes(state)`).

디자이너의 누락일 가능성이 있어 **구현 전에 요청자에게 물었고, "Figma 그대로 —
포커스 시 밑줄 숨김" 으로 확정됐다.** 임의 보정하지 않는다 (원칙 1).

코드에서 이 조건은 두 경로에 각각 들어간다.
- `state` 강제 경로: `state !== 'focused'` 일 때만 표시선을 그린다
- 자동 경로: 표시선에 `group-focus-visible:hidden` 을 건다

## 높이 49 는 파생값이다 — 높이 토큰을 만들지 않았다

`get_design_context`(20:7623) 는 네 variant 중 어느 것에도 높이·최소높이 클래스를
방출하지 않는다. hug 이므로 코드도 hug 로 둔다. (`HeaderSlotLeftEndItems` 가
같은 함정을 기록해 둔 것과 반대 방향의 확인이다 — 그쪽은 강제된 높이였다.)

파생 산술: `spacing/14` × 2 + 라벨 높이 21 = 49. 라벨 높이 21 은 크기 18 의
**AUTO 행간** 결과다. `typography.tokens.css` 가 이미 확정해 둔 사실과 맞물린다 —
Figma `font/label/*` 의 `lineHeight: 100` 은 100% 가 아니라 AUTO 의 sentinel 표기이고,
그래서 그 파일의 label 유틸리티 6종은 `line-height: normal` 이다.
`get_design_context` 가 이 노드의 라벨에 방출한 것도 `leading-[normal]` 이다.

⚠ **한계**: `normal` 은 서체 의존이라 결정론적이지 않다. Pretendard 의 normal 행간
비율(19 나누기 16 = 1.1875)로 계산하면 18 × 1.1875 = 21.375 로, Figma 가 보고한 21 과
0.375 차이가 난다. 또 이 저장소에는 Pretendard 웹폰트가 포함돼 있지 않아 폴백 서체가
적용되므로 실제 렌더 높이는 브라우저·OS 에 따라 달라진다. 이 한계는
`typography.tokens.css` 가 이미 명시해 둔 것이고 이 컴포넌트가 새로 만든 것이 아니다.
**높이를 토큰으로 못박는 쪽을 택하지 않았다** — Figma 가 강제하지 않은 제약을
코드가 만들어 내면 파생 방향이 뒤집힌다 (`HeaderSlotLeftEndItems.design.md` 의
"파생값을 강제된 제약으로 오독하는 것" 과 같은 함정).

## 자식 순서 — Figma 노드 순서 그대로 두었다

Figma 의 자식 순서는 `border → content → Pressed` 이고, `StateLayerPressed.tsx` 의
문서는 반대로 *"레이어는 콘텐츠보다 먼저 와야 한다"* 고 적고 있다 (`Button` 이 그렇게 한다).
여기서는 Figma 순서를 따랐고, 근거는 이 컴포넌트에서 두 순서가 **같은 픽셀을 내기**
때문이다.

| 항목 | 값 |
|---|---|
| 선택 라벨 색 | `--color-text-primary` → `--bw-light-black` = `#1a1a1a` |
| pressed 오버레이 | `--color-state-layer-pressed-black` → `--dimmed-black-16` = `#1a1a1a29` (같은 색의 알파 16%) |
| 합성 결과 | `#1a1a1a` 위에 `#1a1a1a` 16% → `#1a1a1a` (동일) |

즉 오버레이가 라벨 위에 겹쳐도 라벨 색이 바뀌지 않는다. 두 색이 갈라지면 이 전제가
깨지므로 그때는 순서를 앞으로 옮긴다. `TabItem.tsx` 주석에 같은 조건을 적어 두었다.

비선택 라벨(`#747474`)은 pressed 변형 자체가 없으므로 이 계산에 들어오지 않는다.

## 상태 레이어를 래퍼로 감싼 이유

두 레이어 컴포넌트는 `inset-0`(호스트를 정확히 덮음) 과 `-inset-4`(경계 밖 한 단계)
두 가지만 제공한다. Figma 의 레이어는 그 사이 — 좌·우·상 2, 하단 4 — 에 놓이므로
그 인셋을 호스트가 만든다. Figma 도 pressed 를 래퍼 프레임 `27776:6987` 에 넣어
같은 방식으로 처리했다. focused(20:7636)는 래퍼 없이 인스턴스가 직접 그 자리에
있지만, 좌표·크기가 pressed 와 완전히 같아(x=2 y=2 67×43) 코드에서는 같은 래퍼를 썼다.
레이어 컴포넌트에 새 prop 을 추가하지 않았다 (원칙 2·3 — 요청 범위 밖 파일이다).

## 사용한 토큰

### 컴포넌트 (`TabItem.tsx`)

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--spacing-12` | `px-12` | 변수 `spacing/12` = 12 |
| `--spacing-14` | `py-14` | 변수 `spacing/14` = 14 |
| `--spacing-0` | `inset-x-0` · `bottom-0` | 표시선이 좌·우·하 경계에 붙는다 (20:7629 의 x=0 · y=47) |
| `--spacing-tab-indicator-height` | `h-tab-indicator-height` | 20:7629 의 height = 2 (실측값) |
| `--spacing-tab-state-layer-inset` | `inset-x-…` · `top-…` | 27776:6987 의 x=2 · y=2 (실측값) |
| `--spacing-4` | `bottom-4` | 49 − 2 − 43 = 4 (실측 파생) |
| `--color-border-strong` | `bg-border-strong` | 변수 `border/strong` = `#1a1a1a` |
| `--color-text-primary` | `text-text-primary` | 변수 `text/primary` = `#1a1a1a` |
| `--color-text-secondary` | `text-text-secondary` | 변수 `text/secondary` = `#747474` |
| `--radius-4` | `rounded-4` | 변수 `radius/4` = 4 |
| typography `font-label-x-large-700` (`@utility`) | `font-label-x-large-700` | 변수 `font/label/xLarge-strong` |

간접 사용 (하위 컴포넌트가 그린다): `--color-state-layer-pressed-black`(`StateLayerPressed`) ·
`--color-state-focused` · `--spacing-hairline`(`StateLayerFocused`).

토큰이 아닌 유틸리티와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `relative` · `flex` · `flex-col` · `items-center` · `justify-center` | 레이아웃 | Figma 루트의 세로 auto-layout · 가운데 정렬을 직역. 치수 리터럴이 아니다 |
| `absolute` | 레이아웃 | Figma 의 절대 배치 자식(border · Pressed · Focused)을 직역 |
| `w-full` · `shrink-0` | 레이아웃 | content 프레임의 FILL 폭. `Button` 의 같은 자리와 같다 |
| `whitespace-nowrap` | 레이아웃 | `get_design_context` 가 라벨에 방출한 것 그대로 |
| `group` · `group-active:*` · `group-focus-visible:*` | 상태 배선 | 자동 경로에서 오버레이가 버튼 상태를 읽는다. `Button` 과 같은 방식 |
| `hidden` · `block` | 상태 배선 | 위와 짝 |
| `pointer-events-none` | 상호작용 | 오버레이가 버튼의 클릭을 가로채지 않게 한다 |
| `focus-visible:outline-none` | 리셋 | **대체 링을 실제로 그리는 경로에서만** 켠다 (아래 a11y) |

### 스토리 (`TabItem.stories.tsx`)

| 토큰 | 유틸리티 |
|---|---|
| `--color-bg-primary` | `bg-bg-primary` |
| `--color-text-secondary` | `text-text-secondary` |
| `--spacing-12` · `--spacing-16` · `--spacing-24` · `--spacing-32` · `--spacing-40` | `gap-12` · `gap-16` · `p-24` · `gap-32` · `p-40` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

## a11y

- 루트는 `<button type="button">` 이다. Figma 가 `state=pressed` · `state=focused`
  축을 정의했으므로 상호작용이 있다는 것은 추측이 아니다. (`Header` 가 상호작용 축이
  없는 프레임을 버튼으로 만들지 않은 것과 반대 방향의 같은 기준이다.)
- `role="tab"` + `aria-selected={isSelected}` — `isSelected` 축과 1:1 로 대응한다.
  `aria-selected` 는 `role="tab"` 없이는 유효하지 않으므로 둘은 함께 간다.
- `aria-controls` 는 넣지 않았다. 어떤 패널을 제어하는지는 호출부만 안다 (원칙 1).
  props 를 전개하므로 호출부가 넘길 수 있다.
- **UA 포커스 아웃라인은 대체 링을 그리는 경로에서만 끈다.** `isSelected=false` 는
  Figma 에 focused 변형이 없어 링을 그리지 않으므로 아웃라인을 남긴다.
  둘을 하나로 묶어 "포커스 가능한데 표시가 없는" 간극을 없앴다 (WCAG 2.4.7).
  `Button.tsx` 가 세운 규칙과 같다.
- 표시선·오버레이는 전부 `aria-hidden` 이다. 순수 장식이고, 선택 여부는
  `aria-selected` 가 이미 전달한다.
- 스토리는 `decorators` 로 `role="tablist"` 껍데기를 덧댄다 — `role="tab"` 은
  tablist 조상을 요구하므로, 낱개 스토리도 실제 조합과 같은 조건에서 검사되게 한다.

## Code Connect

`get_design_context`(20:7623) 응답에 Code Connect 매핑이 없다. 매핑 생성은 이 작업의
요청 범위 밖이라 보고만 한다 (원칙 3).
매핑을 원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `20:7623`).

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 |
| 빌드 CSS 값 대조 | 번들(`dist/assets/*.css`)에서 확인: `.h-tab-indicator-height{height:var(--spacing-tab-indicator-height)}` · `--spacing-tab-indicator-height:.125rem` · `.inset-x-tab-state-layer-inset{inset-inline:var(--spacing-tab-state-layer-inset)}` · `.top-tab-state-layer-inset{top:var(--spacing-tab-state-layer-inset)}` · `.bottom-4{bottom:var(--spacing-4)}` · `.px-12` · `.py-14` · `.rounded-4{border-radius:var(--radius-4)}` · `.bg-border-strong` · `.text-text-primary` · `.text-text-secondary` · `.font-label-x-large-700{font-family:var(--font-sans);font-size:1.125rem;font-weight:var(--font-weight-strong);line-height:normal}` · `.group-active\:block` · `.group-focus-visible\:block` · `.group-focus-visible\:hidden` |
