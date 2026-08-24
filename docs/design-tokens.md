# Design Tokens — Figma ↔ Code 매핑 테이블

**출처 파일**: Figma `7DxkWa12fiJWOrvPIDWUcp`
**추출일**: 2026-08-24

| 축 | Figma 노드 | 추출 방법 | 목적지 | 상태 |
|---|---|---|---|---|
| 색상 | `27677:2907` | `get_variable_defs` | `src/tokens/colors.tokens.css` | ✅ 완료 |
| 타이포 | `20:10506` (TypographyGuide) | `get_variable_defs` | `src/tokens/typography.tokens.css` (`@utility`) | ✅ 완료 |
| 스페이싱 | `27671:860` (SpacingGuide) | **가이드 표 판독** (변수 없음) | `src/tokens/spacing.tokens.css` | ✅ 완료 |
| 라디우스 | `27673:872` (RadiusGuide) | **가이드 표 판독** (변수 없음) | `src/tokens/design-tokens.css` | ✅ 완료 |
| 그림자 | — | — | — | ❌ **Figma 에 없음** |

규칙의 단일 진실 공급원은 `CLAUDE.md ## 토큰 규칙`이다. 여기에 규칙을 복사하지 않는다.
이 문서는 **Figma 변수명 → CSS 토큰명 → Tailwind 유틸리티** 대응만 기록한다.

---

## 변환 규칙 (색상)

| 항목 | 규칙 | 예 |
|---|---|---|
| 경로 구분자 | `/` → `-` | `text/primary` → `text-primary` |
| camelCase | kebab-case 로 | `neutralGray` → `neutral-gray`, `disabled-onLight` → `disabled-on-light` |
| Semantic 접두어 | `--color-` 를 붙인다 | `text/primary` → `--color-text-primary` |
| Primitive 접두어 | 붙이지 않는다 | `magenta/light/500` → `--magenta-light-500` |
| 정의 위치 | Primitive → `:root` / Semantic → `@theme` | 아래 참조 |

### `--color-` 접두어가 필수인 이유

Tailwind v4 에서 `--text-*` 는 **font-size 네임스페이스**다.
Figma 이름을 그대로 `--text-primary` 로 옮기면 색상이 아니라 폰트 크기 유틸리티가 생성돼 깨진다.
그래서 모든 semantic 색상은 `--color-*` 아래에 둔다. 유틸리티 이름이
`text-text-primary` / `bg-bg-primary` 처럼 중복되는 것은 이 제약의 결과다.

### Primitive 를 `@theme` 이 아니라 `:root` 에 두는 이유

`@theme` 에 넣으면 primitive 마다 유틸리티가 생성되고(`bg-magenta-light-500` 등),
컴포넌트가 semantic 을 건너뛰고 primitive 를 직접 쓸 길이 열린다.
`:root` 에 두면 값은 참조되지만 유틸리티는 만들어지지 않는다.

---

## Primitive (144개) — `src/tokens/colors.tokens.css` `:root`

유틸리티를 만들지 않는다. Semantic 토큰에서만 참조한다.

| Figma | CSS 토큰 | 개수 |
|---|---|---|
| `BW/*` | `--bw-white`, `--bw-light-black`, `--bw-dark-black` | 3 |
| `neutralGray/light/*` | `--neutral-gray-light-{10,50,100…900}` | 11 |
| `magenta/light/*` | `--magenta-light-{10,50,100…900}` | 11 |
| `magenta/dark/*` | `--magenta-dark-{10,50,100…900}` | 11 |
| `negative/light\|dark/*` | `--negative-{light,dark}-{10…900}` | 22 |
| `positive/light\|dark/*` | `--positive-{light,dark}-{10…900}` | 22 |
| `informative/light\|dark/*` | `--informative-{light,dark}-{10…900}` | 22 |
| `warning/light\|dark/*` | `--warning-{light,dark}-{10…900}` | 22 |
| `dimmed/black/*` | `--dimmed-black-{8,16,24,32,40,48,56,64,72,80}` | 10 |
| `dimmed/white/*` | `--dimmed-white-{8,16,…,80}` | 10 |

정확한 값은 `src/tokens/colors.tokens.css` 가 단일 진실 공급원이다. 여기에 복사하지 않는다.

**다크 스케일에 대응하는 semantic 변수가 Figma 에 없다.** 55개 다크 primitive 는
값만 보존돼 있고 현재 어떤 semantic 토큰도 참조하지 않는다. 다크 semantic 이
Figma 에 생기면 그때 매핑한다 — 추측해서 만들지 않는다 (CLAUDE.md 원칙 1).

---

## Semantic — `src/tokens/colors.tokens.css` `@theme`

`근거` 열은 **`get_variable_defs` 가 준 해석값이 정확히 일치한 primitive**를 뜻한다.
`get_variable_defs` 는 alias 체인을 주지 않으므로, 이 참조 구조는 값 일치로 역추적한 것이며
Figma 의 실제 alias 와 다를 수 있다.

### text/* → `text-text-*`

| Figma | CSS 토큰 | 값 | 참조 primitive |
|---|---|---|---|
| `text/primary` | `--color-text-primary` | `#1a1a1a` | `--bw-light-black` ⚠️ |
| `text/secondary` | `--color-text-secondary` | `#747474` | `--neutral-gray-light-600` |
| `text/tertiary` | `--color-text-tertiary` | `#a8a8a8` | `--neutral-gray-light-400` |
| `text/disabled` | `--color-text-disabled` | `#bdbdbd` | `--neutral-gray-light-300` |
| `text/inverse` | `--color-text-inverse` | `#ffffff` | `--bw-white` |
| `text/brand` | `--color-text-brand` | `#e4107a` | `--magenta-light-500` |
| `text/negative` | `--color-text-negative` | `#da0707` | `--negative-light-500` |
| `text/positive` | `--color-text-positive` | `#24a326` | `--positive-light-500` |
| `text/disabled-onLight` | `--color-text-disabled-on-light` | `#1a1a1a29` | `--dimmed-black-16` |
| `text/disabled-onDark` | `--color-text-disabled-on-dark` | `#ffffff66` | `--dimmed-white-40` |

### bg/* → `bg-bg-*`

| Figma | CSS 토큰 | 값 | 참조 primitive |
|---|---|---|---|
| `bg/primary` | `--color-bg-primary` | `#ffffff` | `--bw-white` |
| `bg/secondary` | `--color-bg-secondary` | `#fcfcfc` | `--neutral-gray-light-10` |
| `bg/tertiary` | `--color-bg-tertiary` | `#f2f2f2` | `--neutral-gray-light-50` |
| `bg/inverse` | `--color-bg-inverse` | `#1a1a1a` | `--bw-light-black` ⚠️ |
| `bg/brand` | `--color-bg-brand` | `#e4107a` | `--magenta-light-500` |
| `bg/brand-subtle` | `--color-bg-brand-subtle` | `#fef1f7` | `--magenta-light-10` |
| `bg/negative-subtle` | `--color-bg-negative-subtle` | `#fdf1f1` | `--negative-light-10` |
| `bg/positive-subtle` | `--color-bg-positive-subtle` | `#eefbee` | `--positive-light-10` |

### border/* → `border-border-*`

| Figma | CSS 토큰 | 값 | 참조 primitive |
|---|---|---|---|
| `border/primary` | `--color-border-primary` | `#ebebeb` | `--neutral-gray-light-100` |
| `border/secondary` | `--color-border-secondary` | `#e0e0e0` | `--neutral-gray-light-200` |
| `border/strong` | `--color-border-strong` | `#1a1a1a` | `--bw-light-black` ⚠️ |
| `border/brand` | `--color-border-brand` | `#e4107a` | `--magenta-light-500` |
| `border/negative` | `--color-border-negative` | `#da0707` | `--negative-light-500` |
| `border/disabled` | `--color-border-disabled` | `#ebebeb` | `--neutral-gray-light-100` |
| `border/disabled-onLight` | `--color-border-disabled-on-light` | `#1a1a1a29` | `--dimmed-black-16` |

### interactive/*

| Figma | CSS 토큰 | 값 | 참조 primitive |
|---|---|---|---|
| `interactive/primary` | `--color-interactive-primary` | `#e10975` | **없음** ❗ |
| `interactive/primary-hover` | `--color-interactive-primary-hover` | `#d5076e` | `--magenta-light-600` |
| `interactive/primary-pressed` | `--color-interactive-primary-pressed` | `#a30554` | `--magenta-light-700` |
| `interactive/secondary` | `--color-interactive-secondary` | `#ffffff` | `--bw-white` |
| `interactive/secondary-hover` | `--color-interactive-secondary-hover` | `#f2f2f2` | `--neutral-gray-light-50` |
| `interactive/disabled` | `--color-interactive-disabled` | `#ebebeb` | `--neutral-gray-light-100` |

### button/*

| Figma | CSS 토큰 | 값 | 참조 primitive |
|---|---|---|---|
| `button/primary-fill` | `--color-button-primary-fill` | `#e10975` | **없음** ❗ |
| `button/primary-text` | `--color-button-primary-text` | `#ffffff` | `--bw-white` |
| `button/primary-fill-focused` | `--color-button-primary-fill-focused` | `#e10975` | **없음** ❗ |
| `button/primary-fill-pressed` | `--color-button-primary-fill-pressed` | `#e10975` | **없음** ❗ |
| `button/secondary-fill` | `--color-button-secondary-fill` | `#1a1a1a` | `--bw-light-black` ⚠️ |
| `button/secondary-text` | `--color-button-secondary-text` | `#ffffff` | `--bw-white` |
| `button/secondary-fill-focused` | `--color-button-secondary-fill-focused` | `#1a1a1a` | `--bw-light-black` ⚠️ |
| `button/secondary-fill-pressed` | `--color-button-secondary-fill-pressed` | `#1a1a1a` | `--bw-light-black` ⚠️ |
| `button/disabled-fill` | `--color-button-disabled-fill` | `#ebebeb` | `--neutral-gray-light-100` |
| `button/disabled-text` | `--color-button-disabled-text` | `#1a1a1a` | `--bw-light-black` ⚠️ |
| `button/ghost-text` | `--color-button-ghost-text` | `#1a1a1a` | `--bw-light-black` ⚠️ |

### icon/* → `text-icon-*`

| Figma | CSS 토큰 | 값 | 참조 primitive |
|---|---|---|---|
| `icon/primary` | `--color-icon-primary` | `#1a1a1a` | `--bw-light-black` ⚠️ |
| `icon/secondary` | `--color-icon-secondary` | `#747474` | `--neutral-gray-light-600` |
| `icon/tertiary` | `--color-icon-tertiary` | `#a8a8a8` | `--neutral-gray-light-400` |
| `icon/inverse` | `--color-icon-inverse` | `#ffffff` | `--bw-white` |
| `icon/brand` | `--color-icon-brand` | `#e4107a` | `--magenta-light-500` |
| `icon/negative` | `--color-icon-negative` | `#da0707` | `--negative-light-500` |
| `icon/disabled-onLight` | `--color-icon-disabled-on-light` | `#1a1a1a29` | `--dimmed-black-16` |
| `icon/disabled-onDark` | `--color-icon-disabled-on-dark` | `#ffffffa3` | `--dimmed-white-64` |

### status/*, stateLayer/*, overlay/*, state/*

| Figma | CSS 토큰 | 값 | 참조 primitive |
|---|---|---|---|
| `status/negative` | `--color-status-negative` | `#da0707` | `--negative-light-500` |
| `status/positive` | `--color-status-positive` | `#018303` | `--positive-light-600` |
| `status/informative` | `--color-status-informative` | `#064ad0` | `--informative-light-500` |
| `status/warning` | `--color-status-warning` | `#e8ba02` | `--warning-light-500` |
| `stateLayer/pressed-black` | `--color-state-layer-pressed-black` | `#1a1a1a29` | `--dimmed-black-16` |
| `stateLayer/pressed-white` | `--color-state-layer-pressed-white` | `#ffffff29` | `--dimmed-white-16` |
| `stateLayer/hover-black` | `--color-state-layer-hover-black` | `#1a1a1a14` | `--dimmed-black-8` |
| `overlay/dimmed` | `--color-overlay-dimmed` | `#1a1a1aa3` | `--dimmed-black-64` |
| `state/focused` | `--color-state-focused` | `#1a1a1a` | `--bw-light-black` ⚠️ |

---

## 미해결 항목 — Figma 쪽 확인 필요

코드를 고쳐서 덮지 않고 읽은 값 그대로 두었다 (CLAUDE.md 원칙 1·3).

| # | 항목 | 내용 |
|---|---|---|
| ❗1 | `#e10975` primitive 미일치 | `interactive/primary`, `button/primary-fill`, `-focused`, `-pressed` 4개가 이 값을 쓴다. magenta 스케일 어디에도 없다 (`magenta/light/500` = `#e4107a`). hover/pressed 는 정상적으로 magenta 600/700 과 일치하므로 base 만 스케일에서 벗어나 있다. Figma 쪽 오타 가능성 |
| ❗2 | `button/primary-fill-*` 상태 미분화 | `-fill`, `-fill-focused`, `-fill-pressed` 가 전부 같은 `#e10975`. 상태 구분이 아직 안 잡힘 |
| ❗3 | `button/disabled-text` 대비 | `#1a1a1a` 불투명 검정. `text/disabled`(`#bdbdbd`)·`text/disabled-onLight`(`#1a1a1a29`)와 어긋난다 |
| ⚠️4 | `#1a1a1a` 중복 | `BW/light-black` 과 `neutralGray/light/900` 이 동일 값. 이 값을 쓰는 semantic 10개가 둘 중 무엇을 참조하는지 값만으로 판정 불가. **`--bw-light-black` 으로 통일**했다 (임의 선택) |
| ⚠️5 | 다크 semantic 부재 | 다크 primitive 55개는 있으나 대응 semantic 이 하나도 없다 |

### 추출 대상에서 제외한 변수

| Figma 변수 | 값 | 제외 사유 |
|---|---|---|
| `guide-gray-low`, `guide/color/gray-low` | `#cccccc` | 가이드 문서 자체의 스타일. 디자인 시스템 토큰이 아니다 |
| `guide-gray-high` | `#1e1e1e` | 동일 |

---

## 기존 placeholder 토큰 처리

`src/tokens/design-tokens.css` 에 있던 중립 placeholder 색상 블록(표면·전경·경계·브랜드·상태)을
**제거**하고 위 Figma 토큰으로 대체했다. `src/tokens/README.md` 가 예고한 교체다.

`--color-border-strong` 과 `--color-status-warning` 은 신·구 양쪽에 같은 이름으로 존재해
공존시키면 import 순서에 따라 조용히 값이 뒤바뀐다. 제거가 불가피했다.

이에 따라 기존 컴포넌트를 새 토큰명으로 옮겼다:

| 파일 | 기존 | 신규 |
|---|---|---|
| `Button.tsx` | `bg-brand-primary` | `bg-button-primary-fill` |
| `Button.tsx` | `text-brand-fg` | `text-button-primary-text` |
| `Button.tsx` | `hover:bg-brand-primary-hover` | `hover:bg-interactive-primary-hover` |
| `Button.tsx` | `bg-surface-subtle` | `bg-bg-tertiary` |
| `Button.tsx` | `text-fg-default` | `text-text-primary` / `text-button-ghost-text` |
| `Button.tsx` | `hover:bg-brand-subtle` | `hover:bg-bg-brand-subtle` |
| `Button.tsx` | `outline-brand-primary` | `outline-border-brand` |
| `App.tsx` | `bg-canvas` | `bg-bg-primary` |
| `App.tsx` | `text-fg-default` | `text-text-primary` |
| `App.tsx` | `text-fg-muted` | `text-text-secondary` |

이름 기준 1:1 매핑이다. placeholder 가 실제 Figma 값으로 바뀌었으므로
**Button primary 의 외형이 회색 `#171717` → 마젠타 `#e10975` 로 바뀐다.** 의도된 결과다.

---

## Spacing — `src/tokens/spacing.tokens.css`

### ⚠ 출처가 변수가 아니다

`SpacingGuide`(27671:860) 프레임에 **Figma Variable 바인딩이 0개**다 (`get_variable_defs` → `{}`).
아래 값은 가이드의 "Spacing Scale" 표에 적힌 숫자를 그대로 읽은 것이다.
변수로 등록되면 `/sync-tokens` 로 다시 맞춘다.

다만 **컬렉션 자체는 조회된다.** `get_variable_defs`(27671:1222) 가 spacing 컬렉션 전체를
`spacing/4 · 6 · 8 · 12 · 14 · 16 · 20 · 24 · 32 · 40 · 64 · 80 · 100` 13단으로 내보낸다.
즉 "이 값이 스케일에 있는가" 는 가이드 표를 읽지 않고도 확인할 수 있다 —
아래 실측 제약 절들(버튼 높이 · 헤더 행 높이 · 헤더 아이템 패딩 · 선 두께)이 이 방법으로
"스케일에 없음" 을 확인했다. (예: 10 은 8 과 12 사이에 없다.)

### ⚠ Tailwind 기본 스케일과 의미가 다르다

Figma 가이드의 숫자를 그대로 유지하기로 했으므로(사용자 결정), `p-4` 는 **16px 이 아니라 4px** 다.
혼동을 막기 위해 `--spacing-*: initial` 로 **Tailwind 기본 동적 spacing 을 껐다.**
스케일에 없는 `p-7`·`p-13` 은 유틸리티가 생성되지 않는다.

| 값 (px) | CSS 토큰 | 유틸리티 | 용도 (Figma 가이드 표) |
|---|---|---|---|
| 0 | `--spacing-0` | `p-0`, `gap-0` | Figma 변수 `gap-0`, `padding/padding-none` |
| 4 | `--spacing-4` | `p-4`, `gap-4` | 미세 간격 · 텍스트 인라인 아이콘 간격 |
| 6 | `--spacing-6` | `p-6` | 컴포넌트 내부 미세 패딩 (Header 상/하, Text Set 내부) |
| 8 | `--spacing-8` | `p-8` | CTA 상단 여백 · 버튼 간격 |
| 12 | `--spacing-12` | `p-12` | 라벨 ↔ 입력 필드 · 텍스트 세트 간격 |
| 14 | `--spacing-14` | `p-14` | 버튼 · 입력 필드 상하 패딩 |
| 16 | `--spacing-16` | `p-16` | 컴포넌트 내 아이콘 ↔ 텍스트 간격 |
| 20 | `--spacing-20` | `p-20` | 페이지 좌우 마진 · CTA 하단 · 리스트 패딩 |
| 24 | `--spacing-24` | `p-24` | 주요 리스트 항목 상하 패딩 (Checkbox/Radio) |
| 32 | `--spacing-32` | `p-32` | 탭 하위 콘텐츠 시작 여백 |
| 40 | `--spacing-40` | `p-40` | 콘텐츠 시작 여백 · 필드 간 간격 |
| 64 | `--spacing-64` | `p-64` | 타이틀 ↔ 입력 영역 간격 |
| 80 | `--spacing-80` | `p-80` | **용도 표 없음** (preview 에만 존재) |
| 100 | `--spacing-100` | `p-100` | **용도 표 없음** (preview 에만 존재) |

### 컨트롤 높이 — Figma 출처 없음

| CSS 토큰 | 값 | 비고 |
|---|---|---|
| `--spacing-control-sm` | 32px | Figma 스케일에 32 존재 |
| `--spacing-control-md` | 40px | Figma 스케일에 40 존재 |
| `--spacing-control-lg` | 48px | **Figma 스케일에 없는 값** |

Spacing 가이드는 *간격*만 다루고 컨트롤 높이를 정의하지 않는다. 기존 저장소 값을 유지했다.

### 버튼 높이 — Figma 변수 아님 (레이어 실측 제약)

| CSS 토큰 | 값 | 유틸리티 | 출처 (실측 노드) |
|---|---|---|---|
| `--spacing-button-height` | 55px (`3.4375rem`) | `min-h-button-height` | 컴포넌트 세트 `Button` `1:4004` 의 variant **12개 전부** height = 55 |

대표 노드는 `1:4061` (filled/primary, default, state layer 없음) — 82 × 55.

**hug 결과가 아니라 설정된 제약인 근거**

| 축 | 계산 | 실제 | 판정 |
|---|---|---|---|
| 폭 | 라벨 42 + `spacing/20` × 2 = 82 | 82 | hug 결과 ✅ |
| 높이 | 라벨 19 + `spacing/14` × 2 = **47** | **55** | hug 아님, 8px 초과 ❌ |

`content` 프레임 `1:4062` 가 `y=18` 에 있다. `(55 − 19) / 2 = 18` — 선언된 padding 14 가 아니라
**강제된 높이 안에서 가운데 정렬된 결과**다. hug 였다면 `y=14` 여야 한다.
`get_design_context`(`1:4004`) 는 12개 variant 루트 전부에 `min-h-[55px]` 를 방출한다 (hug 면 높이 클래스가 나오지 않는다).
`get_variable_defs`(`1:4061`) 에 높이 변수가 없고, 이 파일의 number 변수 전체를 확인해도
`spacing/*` · `radius/*` · `font-size/*` 뿐이라 **높이 변수는 존재하지 않는다.**

**컨트롤 높이 축(32/40/48)에 넣지 않은 이유**

- 그 축은 위 표대로 **Figma 출처 없음**인 기존 저장소 값이다. Figma 실측값을 섞으면 출처 표기가
  토큰마다 달라져 축 단위로 읽을 수 없다.
- `sm`/`md`/`lg` 는 t-shirt 크기 축인데 **Figma Button 에는 size variant 가 없다.**
  55 를 `lg`(48) 위에 `xl` 로 얹으면 존재하지 않는 크기 축을 암시하게 된다.

**이름에 `-height` 를 남긴 이유**: `--spacing-*` 는 `h-*` 뿐 아니라 `w-*` · `inset-*` 도 읽는다.
`--spacing-button` 이면 `w-button` 이 "버튼 폭"으로 그럴듯하게 읽히지만 버튼 폭은 hug(82)라 틀린 값이 된다.
`w-button-height` 는 읽는 순간 오용임이 드러난다. `min-h-button-height` 의 중복은 그 대가다.

### 헤더 행 높이 — Figma 변수 아님 (레이어 실측 제약)

| CSS 토큰 | 값 | 유틸리티 | 출처 (실측 노드) |
|---|---|---|---|
| `--spacing-header-row-height` | 44px (`2.75rem`) | `h-header-row-height` · `min-h-header-row-height` | FRAME `27657:3127` `content` 의 height = 44 (Header `27657:3123`) |

**변수가 아닌 근거**: `get_variable_defs`(`27657:3123`) · (`27657:3096`) 의 number 변수는
`spacing/4 · 6 · 12 · 16 · 20` · `radius/0` · `font-size/*` 뿐이고 44 에 대응하는 변수가 없다.

**hug 결과가 아니라 설정된 제약인 근거** (`--spacing-button-height` 와 같은 시험)

`get_design_context`(`27657:3123`) 가 `27657:3127` **에만** `h-[44px] min-h-[44px]` 를 방출한다.
형제 `27657:3125` · `27657:3129` 에는 높이 클래스가 없다. 자식 title `27657:3128` 은
height 23 · y 오프셋 **10.5** 로, `(44 − 23) / 2 = 10.5` — 강제된 높이 안의 가운데 정렬이다.
상하 패딩 10 의 hug 였다면 프레임 43 · 오프셋 10 이어야 한다.
루트 `27657:3123` 의 상하 패딩이 `spacing/6` 이므로 `6 + 44 + 6 = 56` 이 Header 전체 높이다.

**⚠ 적용 범위는 `27657:3127` 하나다.** 같은 행의 `27657:3125` `wrapper` 와 슬롯
`27657:3129` · `27657:3097` · `27657:3101` 에는 쓰지 않는다 — 그쪽은 hug 이고 선언값은
상하 패딩 10 (`--spacing-header-item-inset-y`) 이다. 슬롯에 `h-header-row-height` 를 쓰면
buttonGroup 이 39 대신 44 로 렌더된다.

**`--spacing-statusbar-height` (44px) 와 합치지 않은 이유**: 값은 같지만 축이 다르다.
그쪽은 iOS 상태바 본체(`27719:2208`)의 재현이고 이쪽은 LG U+ Header 의 제약이다.
기기가 바뀌어도 Header 는 따라가지 않고, Header 가 48 이 되어도 상태바는 따라가지 않는다.
게다가 OS 바 값들은 "OS 바 두 컴포넌트 밖에서는 쓰지 않는다" 고 이미 선언돼 있다.

**이름에 `-height` 를 남긴 이유**: `--spacing-*` 는 `h-*` 뿐 아니라 `w-*` · `p-*` 도 읽는다.
Header 행 폭은 402 안의 fill 이라 고정값이 아니므로 `w-header-row-height` 는 읽는 순간
오용임이 드러난다.

### 헤더 행 안 아이템 묶음의 상하 패딩 — Figma 변수 아님 (레이어 실측값)

| CSS 토큰 | 값 | 유틸리티 | 출처 (실측 노드) |
|---|---|---|---|
| `--spacing-header-item-inset-y` | 10px (`0.625rem`) | `py-header-item-inset-y` | FRAME `27657:3125` `wrapper` (24×44, 자식 24 @ y=10) |
| 〃 (같은 토큰) | 〃 | 〃 | INSTANCE `27657:3129` Header Slot (104×44) |
| 〃 | 〃 | 〃 | `27657:3097` `contentType=iconGroup` (104×44, 자식 24 @ y=10) |
| 〃 | 〃 | 〃 | `27657:3101` `contentType=buttonGroup` (100×39, 자식 19 @ y=10) |

**변수가 아닌 근거**: `get_variable_defs`(`27671:1222`) 가 이 파일의 spacing 컬렉션 **전체**를
내보낸다 — `spacing/4 · 6 · 8 · 12 · 14 · 16 · 20 · 24 · 32 · 40 · 64 · 80 · 100`.
13단 전부이고 **10 은 없다** (8 과 12 사이가 비어 있다). `get_variable_defs`(`27657:3097`) =
`{icon/primary, spacing/16}`, (`27657:3101`) = `{text/primary, family-font, font-size/label-large,
font/label/large, spacing/4, radius/0, spacing/16}` — 두 variant 어디에도 10 에 대응하는 바인딩이 없다.

**높이가 아니라 상하 패딩이 선언값인 근거**

`get_design_context`(`27657:3096`) 이 두 variant 루트에 `gap-[var(--spacing/16,16px)] py-[10px]` 를
방출하고 높이 클래스는 없다. gap 16 은 `var()` 로 나오는데 **10 은 raw 리터럴로 나온다** —
변수였다면 gap 처럼 `var()` 였을 것이다 (`--spacing-button-height` 의 55 는 반대로
`min-h-[55px]` 가 방출됐다).

| 노드 | 실측 | 자식 | 계산 |
|---|---|---|---|
| `27657:3097` iconGroup | 104×**44** | 아이콘 24 @ y=10 | 44 = 24 + 10 + 10 |
| `27657:3101` buttonGroup | 100×**39** | 라벨 19 @ y=10 | 39 = 19 + 10 + 10 |

**같은 컴포넌트 세트의 두 variant 높이가 다르다.** 강제된 높이라면 `Button` `1:4004` 의
12 variant 가 전부 55 인 것처럼 같아야 한다. 불변인 것은 높이가 아니라 패딩 10 이고,
두 높이가 여기서 파생된다.

> 이 판정은 처음에 반대로 났다. `figma-implementer` 가 44 를 선언값·10 을 파생값으로 보고
> 44 만 토큰 요청했고, `token-guardian` 이 `Button` 55 의 시험을 정직하게 적용해 뒤집었다.
> 판정 기준은 "값이 예뻐 보이는지"가 아니라 **variant 전체에서 무엇이 불변인지**다.

**`--spacing-statusbar-inset-top` (10px) 과 합치지 않은 이유**: 값은 같지만 축이 다르다.
그쪽은 `OSBarTopNavigation` 루트(`27719:2205`)가 화면 최상단에 두는 여백이고, 이쪽은
Header 행 안 아이템 묶음의 상하 패딩이다. 기기가 바뀌어 상태바 여백이 움직여도 Header 는
따라가지 않고, Header 패딩이 12 로 바뀌어도 상태바는 따라가지 않는다. 게다가 OS 바 값들은
"OS 바 두 컴포넌트 밖에서는 쓰지 않는다" 고 선언돼 있다. `clock-inset-y` 와
`indicators-height` 를 13px 로 같아도 나눈 것과 같은 기준이다.

**이름에 `-inset-y` 를 남긴 이유**: `--spacing-*` 는 `p-*` 뿐 아니라 `h-*` · `w-*` · `gap-*` 도
읽는다. `h-header-item-inset-y` · `px-header-item-inset-y` · `gap-header-item-inset-y` 가
읽는 순간 오용임이 드러난다 — 이 네 노드의 높이는 파생값(44 · 39)이고 아이템 간 간격은
`spacing/16` 이다.

**`-row-` 가 아니라 `-item-` 인 이유**: 적용 대상은 행 자체가 아니라 행 안의 아이템 묶음이다.
Header 루트 `27657:3123` 의 상하 패딩은 `spacing/6`, wrapper `27657:3124` 는 `spacing/20`(x) ·
`spacing/6`(y) 다 — `row` 로 이름 붙이면 그쪽에 쓰이기 쉽다.
Figma 슬롯 이름 `Header Slot/Left End/ Items` 의 Items 를 따랐다.

### 선 두께 — Figma 변수 아님 (레이어 실측값)

| CSS 토큰 | 값 | 유틸리티 | 출처 (실측 노드) |
|---|---|---|---|
| `--spacing-hairline` | 1px (`0.0625rem`) | `h-hairline` | RECTANGLE `20:5646` `divider` 의 height = 1 |
| 〃 (같은 토큰) | 〃 | `border-hairline` | FRAME `35:12810` `state area` (StateLayer/Focused) 의 border = 1px |

두께 변수는 이 Figma 파일에 **존재하지 않는다.** `get_variable_defs` 로 확인한 number 변수는
`spacing/*` · `radius/*` · `font-size/*` 뿐이고, 두께를 정의한 가이드 프레임도 없다.
`35:12810` 에서 `get_design_context` 는 색·반경만 `var(--state/focused)` · `var(--radius/4)` 로
내보내고 두께는 맨 `border` 로 내보낸다 — 변수였다면 두께도 `var()` 로 나왔을 것이다.

**토큰을 하나로 유지하는 이유**: 구분선 두께와 포커스 링 두께는 "이 시스템에서 가장 얇은 선"
이라는 같은 축의 값이고, 두 실측값이 같은 1px 이며, 어느 쪽도 독립적으로 움직일 근거가 없다.
값이 같아서가 아니라 축이 같아서 합쳤다. Figma 에 두께 변수가 생겨 둘이 갈라지면 그때 나눈다.

**`border-hairline` 이 `@theme` 이 아니라 `@utility` 인 이유**: Tailwind v4 에 `--border-width-*`
테마 네임스페이스가 없다. `border-2` 류는 테마 값이 아니라 bare number 라, 토큰을 정의해도
border 유틸리티가 생성되지 않는다. `--spacing-*` 를 읽는 것은 `h-*` · `w-*` · `inset-*` 뿐이다.
그래서 `typography.tokens.css` 가 합성 타이포에 쓰는 것과 같은 방식으로 `@utility` 를 썼다.
값은 `--spacing-hairline` 한 곳에서만 정의되고, `@utility` 는 그것을 `border-width` 로 읽기만 한다.

---

## Radius — `src/tokens/design-tokens.css`

`RadiusGuide`(27673:872) 도 **변수 바인딩 0개**다. preview 프레임 이름과 라벨, 용도 표에서 읽었다.

| 값 | CSS 토큰 | 유틸리티 | 용도 (Figma 가이드 표) |
|---|---|---|---|
| 0 | `--radius-0` | `rounded-0` | 직각 · Header, List, Divider, Tab, 페이지 프레임 — **기본값** |
| 4px | `--radius-4` | `rounded-4` | 미세 라운딩 · **Button, Text Field** (주요 인터랙션 요소) |
| 8px | `--radius-8` | `rounded-8` | **용도 표 없음** (preview 에만 존재) |
| 12px | `--radius-12` | `rounded-12` | **용도 표 없음** (preview 에만 존재) |
| 16px | `--radius-16` | `rounded-16` | **용도 표 없음** (preview 에만 존재) |
| 100px | `--radius-100` | `rounded-100` | Home Indicator (시스템 UI) — **OS 전용**. 가이드 라벨은 "Full" |

`--radius-*: initial` 로 Tailwind 기본 radius(`rounded-lg` 등)를 껐다.

**주의** — 기존 `--radius-full: 9999px` 를 제거했다. Figma 가이드의 마지막 단은 "Full" 라벨이지만
실제 값은 **100px** 이고 용도는 OS UI 전용이다. 진짜 pill(9999px) 토큰은 Figma 가이드에 없다.

---

## Typography — `src/tokens/typography.tokens.css`

합성 토큰이므로 CSS 변수가 아니라 **`@utility` 클래스 18개**로 만들었다.
Figma 변수명을 그대로 보존한다: `font/display/large-strong` → `.font-display-large-strong`

### 단위 판정 (사용자 확인 완료)

`get_variable_defs` 출력의 단위 표기가 섞여 있었다.

| Figma 출력 | 판정 | CSS |
|---|---|---|
| `lineHeight: 1.2999999523162842` | 130% 배율 | `line-height: 1.3` |
| `lineHeight: 1.5` | 150% 배율 | `line-height: 1.5` |
| `lineHeight: 100` | **100%** | `line-height: 1` |
| `letterSpacing: -2` | **-2%** | `letter-spacing: -0.02em` |
| `letterSpacing: 0` | 0 | (미지정) |

### 서체 · 굵기

| Figma | CSS 토큰 | 값 |
|---|---|---|
| `fontFamily-sans`, `display/typeface` | `--font-sans` | `Pretendard` + 시스템 폴백 |
| `fontWeight-base` (medium) | `--font-weight-base` | `500` |
| `fontWeight-strong` (bold), `display/bold` | `--font-weight-strong` | `700` |

⚠ **Pretendard 웹폰트 파일은 이 저장소에 없다.** 폴백 서체로 렌더링된다.
폰트 로딩은 요청 범위 밖이라 추가하지 않았다.

### @utility 클래스 18개

| Figma 변수 | 클래스 | size | weight | line-height | letter-spacing |
|---|---|---|---|---|---|
| `font/display/large-strong` | `.font-display-large-strong` | 36px | 700 | 1.3 | -0.02em |
| `font/display/medium-strong` | `.font-display-medium-strong` | 28px | 700 | 1.3 | -0.02em |
| `font/title/large-strong` | `.font-title-large-strong` | 24px | 700 | 1.3 | -0.02em |
| `font/title/medium-strong` | `.font-title-medium-strong` | 20px | 700 | 1.3 | -0.02em |
| `font/title/small-strong` | `.font-title-small-strong` | 18px | 700 | 1.3 | -0.02em |
| `font/title/xSmall-700` | `.font-title-x-small-700` | 16px | 700 | 1.3 | -0.02em |
| `font/body/large-strong` | `.font-body-large-strong` | 18px | 700 | 1.5 | 0 |
| `font/body/large` | `.font-body-large` | 18px | 500 | 1.5 | 0 |
| `font/body/medium-700` | `.font-body-medium-700` | 16px | 700 | 1.5 | 0 |
| `font/body/medium` | `.font-body-medium` | 16px | 500 | 1.5 | 0 |
| `font/body/small-700` | `.font-body-small-700` | 14px | 700 | 1.5 | 0 |
| `font/body/small` | `.font-body-small` | 14px | 500 | 1.5 | 0 |
| `font/label/xLarge-700` | `.font-label-x-large-700` | 18px | 700 | 1 | 0 |
| `font/label/large-strong` | `.font-label-large-strong` | 16px | 700 | 1 | 0 |
| `font/label/large` | `.font-label-large` | 16px | 500 | 1 | 0 |
| `font/label/medium-700` | `.font-label-medium-700` | 14px | 700 | 1 | 0 |
| `font/label/medium` | `.font-label-medium` | 14px | 500 | 1 | 0 |
| `font/label/small` | `.font-label-small` | 12px | 500 | 1 | 0 |

`--text-*: initial`, `--font-weight-*: initial` 로 Tailwind 기본 font-size·weight 유틸리티를 껐다.
`text-lg`·`font-semibold` 는 더 이상 생성되지 않는다.

### ⚠ Figma 쪽 네이밍·커버리지 문제

| # | 항목 |
|---|---|
| 1 | **같은 뜻에 두 이름** — 700 굵기를 `-strong`(`display/large-strong`)과 `-700`(`title/xSmall-700`, `body/medium-700`, `label/medium-700`)으로 섞어 쓴다. 코드에서는 Figma 이름을 그대로 보존했으므로 이 불일치가 클래스명에 남는다 |
| 2 | **title 에 non-strong(500) 변형이 없다** — `font/title/*` 는 전부 700 |
| 3 | **label 커버리지 구멍** — `label/xLarge` 의 500 변형과 `label/small-700` 이 없다 |
| 4 | `guide-*` 접두 변수(`guide-H2`~`guide-H5`, `guide-body-1`, `guide-label`, `guide-description`)는 가이드 문서 자체의 스타일이라 제외했다 |

---

## 그림자 · 브레이크포인트 — Figma 출처 없음

| 항목 | 상태 |
|---|---|
| shadow | **이 Figma 파일에 shadow 변수도, shadow 가이드 프레임도 없다.** 기존 저장소 값(`--shadow-sm/md/lg`) 유지 |
| breakpoint | Figma 출처 없음. 기존 값(`--breakpoint-sm/md/lg/xl`) 유지 |

---

## 하드코딩 차단 — 토큰 밖 값이 유틸리티로 생성되지 않는지 검증

`@theme` 에 네임스페이스별 `initial` 을 넣어 Tailwind 기본 스케일을 껐다.
의도적 위반 프로브를 `src/` 에 넣고 빌드해 CSS 산출물을 확인했다 (프로브는 검증 후 삭제).

| 프로브 유틸리티 | 결과 |
|---|---|
| `p-7`, `p-13`, `m-5`, `gap-3` | ✅ 생성 안 됨 (`--spacing-*: initial`) |
| `bg-red-500`, `text-blue-600` | ✅ 생성 안 됨 (`--color-*: initial`) |
| `text-lg`, `text-base` | ✅ 생성 안 됨 (`--text-*: initial`) |
| `rounded-xl`, `rounded-lg` | ✅ 생성 안 됨 (`--radius-*: initial`) |
| `font-semibold`, `font-bold` | ✅ 생성 안 됨 (`--font-weight-*: initial`) |

### 문서가 번들을 오염시키던 문제

Tailwind v4 는 프로젝트를 자동 스캔하므로 `src/tokens/README.md` 와 `docs/design-tokens.md` 에
예시로 적은 클래스명까지 유틸리티로 생성됐다 (미사용 39개, CSS 20.64 kB).
`src/index.css` 에 `@source not '../**/*.md';` 를 넣어 제외했다.

| | CSS 크기 | 생성된 미사용 유틸리티 |
|---|---|---|
| 제외 전 | 20.64 kB | spacing/radius 21개 + 타이포 18개 |
| 제외 후 | **13.02 kB** | 0개 |

**12/12 차단.** 동시에 토큰 유틸리티(`px-8`, `gap-24`, `rounded-4`, `font-label-medium`,
`bg-bg-primary`, `text-text-primary`)는 정상 생성됨을 확인했다.

---

## 컴포넌트 마이그레이션

토큰 교체로 기존 유틸리티가 사라지므로 함께 옮겼다. **이름 기준 1:1 매핑이다.**

| 파일 | 기존 | 신규 | 값 변화 |
|---|---|---|---|
| `Button.tsx` | `rounded-md` | `rounded-4` | 8px → **4px** (Figma: Button = 4px) |
| `Button.tsx` | `px-sm` (sm) | `px-8` | 8px → 8px |
| `Button.tsx` | `px-lg` (md) | `px-16` | 16px → 16px |
| `Button.tsx` | `px-xl` (lg) | `px-24` | 24px → 24px |
| `Button.tsx` | `text-sm` (sm·md) | `font-label-medium` | 14px/20px 행간 → 14px/1.0 |
| `Button.tsx` | `text-md` (lg) | `font-label-large` | 16px/24px 행간 → 16px/1.0 |
| `Button.tsx` | `font-sans font-medium` | (제거) | `@utility` 가 서체·굵기를 포함 |
| `App.tsx` | `gap-xl` | `gap-24` | 24px → 24px |
| `App.tsx` | `gap-sm` | `gap-8` | 8px → 8px |
| `App.tsx` | `text-2xl font-semibold tracking-tight` | `font-title-large-strong` | 24px/600 → 24px/**700**, 자간 -0.02em |
| `App.tsx` | `text-sm` | `font-body-small` | 14px/20px 행간 → 14px/1.5 |
| `Button.stories.tsx` | `gap-3` | `gap-12` | 12px → 12px (Tailwind 기본값 → 토큰) |

**외형이 바뀐 것**: Button 라디우스 8px→4px, Button 라벨 행간, h1 굵기 600→700.
전부 Figma 값을 따른 결과다.

---

## 미완 항목

| # | 항목 | 내용 |
|---|---|---|
| 1 | 색상 ❗1~❗3 | `interactive/primary` = `#e10975` primitive 미일치 등 **Figma 재확인 후에도 값이 그대로**였다. 위 색상 섹션 참조 |
| 2 | shadow | Figma 출처 없음 |
| 3 | Pretendard 웹폰트 | 폰트 파일 미포함. 폴백 렌더링 |
| 4 | 다크 semantic | Figma 에 없음 (primitive 55개만 존재) |
| 5 | `npm run scan:tokens` | 미구현. 현재 검증은 `typecheck` + `build` + 수동 grep + 프로브 빌드 |
