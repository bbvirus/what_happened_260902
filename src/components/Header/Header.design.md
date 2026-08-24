# Header — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료 (4/4 충족).** `.design.md` · `.tsx` · `.stories.tsx` · 검증 기록.
> 막혀 있던 치수 토큰은 `/sync-tokens` 로 들어왔다 — 다만 **1건이 아니라 2건**이었다
> (`--spacing-header-row-height` 44 · `--spacing-header-item-inset-y` 10).
>
> ⚠ 이 문서에는 정정된 판단이 **2건** 있다. 지우지 않고 남겼다.
> · 행 높이 `44` 의 적용 노드 — 3개가 아니라 **1개**다. 아래 "## 정정 1" 참조.
> · 폭 `402` — `w-full` 이 아니라 `w-mobile-frame-width` 다. 아래 "## 정정 2" 참조.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27657-3123&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27704:1746` — section "Header" |
| 심볼 | `27657:3123` — "Header" 402×56 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문 발췌): *"화면 상단에 고정되는 헤더입니다. 뒤로가기 · 타이틀 · 우측
슬롯으로 구성됩니다. ── 실습용 최소 세트 (4 variants → 컴포넌트 1개) ── 남긴 프로퍼티 title
타이틀 문구 / hasTitle 타이틀 노출 여부 (로그인·약관동의 false / 요금제 true) / hasSlot-start
뒤로가기 노출 여부 / hasSlot-end 우측 슬롯 노출 여부 (기본 false) … variant 축이 하나도 남지
않아 컴포넌트 세트를 해제했습니다. variant가 남지 않으면 그것은 세트가 아니라 컴포넌트입니다.
우측 슬롯은 남겨두었습니다 — 헤더는 우측에 무엇이 들어갈지 모르고, 쓰는 쪽이 채웁니다.
코드의 children과 같은 개념입니다."*

## 노드 구조

```
symbol 27657:3123 "Header"                     402×56   (bg, px-20, py-6)
└─ frame 27657:3124 "wrapper"  x=20 y=6  362×44         (flex, gap-12, items-center)
   ├─ frame 27657:3125 "wrapper"  0×0  24×44            (py-10 hug → 24+10+10 = 44)
   │  └─ instance 27657:3126 "Icon/chevronLeft-large-line"  y=10  24×24
   ├─ frame 27657:3127 "content"  x=36  326×44          (flex-1, h-44, min-h-44, items-center)
   │  └─ text 27657:3128 "title"  y=10.5  326×23
   └─ instance 27657:3129 "Header Slot/Left End/ Items"  x=258  104×44  hidden=true
```

높이 56 = `spacing/6` 6 + 44 + 6 ✓ · `content` x=36 = 24(뒤로가기) + 12(`spacing/12`) ✓

## variant — 없음

Figma 설명이 명시한다: *"variant 축이 하나도 남지 않아 컴포넌트 세트를 해제했습니다."*
`get_metadata` 이름도 variant 형식(`a=b, c=d`)이 아니라 그냥 `Header` 다.
⇒ variant prop 을 만들지 않는다. (`TextButton` 과 같은 판정)

## Figma component property → props

`get_design_context` 가 방출한 property 4개를 그대로 옮긴다. 발명하지 않는다.

| Figma property | 기본값 | props |
|---|---|---|
| `title` (text) | `"타이틀"` | `title: string` |
| `hasTitle` (boolean) | `true` | `hasTitle?: boolean` |
| `hasSlotStart` (boolean) | `true` | `hasSlotStart?: boolean` |
| `hasSlotEnd` (boolean) | **`false`** | `hasSlotEnd?: boolean` |

### `27657:3129` 가 `hidden=true` 인 것을 어떻게 prop 으로 표현하는가

**근거는 두 겹이고 둘 다 Figma 에서 읽은 사실이다.**

1. `get_metadata`(27657:3123) 가 이 인스턴스에만 `hidden="true"` 를 붙인다.
2. 그 hidden 은 임의 상태가 아니라 **property 의 기본값**이다 —
   `get_design_context` 가 시그니처를 `hasSlotEnd = false` 로 방출하고,
   Figma 설명이 *"hasSlot-end 우측 슬롯 노출 여부 (기본 false)"* 라고 직접 적었다.
   `hasSlotStart` · `hasTitle` 은 같은 자리에서 `= true` 로 방출된다.

⇒ `hidden=true` 는 "이 레이어를 지워라" 가 아니라 **"기본값이 꺼짐인 선택적 슬롯"** 이다.
   그래서 `hasSlotEnd?: boolean = false` 로 옮긴다. 렌더 트리에서 조건부로 빠진다
   (Figma 의 hidden 레이어가 레이아웃에 기여하지 않는 것과 같다 — 폭 계산에서
   362 = 24 + 12 + 326 으로 슬롯 104 가 빠져 있는 것이 이를 확인해준다).

### 슬롯의 내용물은 `children` 이다

Figma 설명이 직접 답을 준다: *"헤더는 우측에 무엇이 들어갈지 모르고, 쓰는 쪽이 채웁니다.
코드의 children과 같은 개념입니다."* 기본 내용물로 들어와 있는 것도 `Icon/line`
플레이스홀더 3개이므로 지정된 글리프가 없다. 기본 아이콘을 추측해 넣지 않는다. (원칙 1)

## 값의 출처 — `불명` 0건

`get_variable_defs`(27657:3123) 원문:
`{"icon/primary":"#1a1a1a","text/primary":"#1a1a1a","family-font":"Pretendard",`
`"font-size/title-small":"18","font/title/small-strong":"Font(family: \"family-font\", style: Bold,`
`size: font-size/title-small, weight: 700, lineHeight: 1.2999999523162842, letterSpacing: -2)",`
`"spacing/12":"12","spacing/20":"20","spacing/6":"6","bg/secondary":"#fcfcfc"}`

| Figma 값 | 출처 | 토큰 | 판정 |
|---|---|---|---|
| 배경 `bg/secondary` `#fcfcfc` | **Figma 변수** | `--color-bg-secondary` → `--neutral-gray-light-10` = `#fcfcfc` (값 일치) | 재사용 → `bg-bg-secondary` |
| padding-x `spacing/20` = 20 | **Figma 변수** | `--spacing-20` = `1.25rem` = 20px | 재사용 → `px-20` |
| padding-y `spacing/6` = 6 | **Figma 변수** | `--spacing-6` = `0.375rem` = 6px | 재사용 → `py-6` |
| gap `spacing/12` = 12 | **Figma 변수** | `--spacing-12` = `0.75rem` = 12px | 재사용 → `gap-12` |
| 타이틀 타이포 `font/title/small-strong` | **Figma 변수** | `@utility font-title-small-strong` — 4개 값 전부 일치 (아래) | 재사용 → `font-title-small-strong` |
| 타이틀 색 `text/primary` `#1a1a1a` | **Figma 변수** | `--color-text-primary` → `--bw-light-black` = `#1a1a1a` (값 일치) | 재사용 → `text-text-primary` |
| 뒤로가기 아이콘 색 `icon/primary` `#1a1a1a` | **Figma 변수** | `--color-icon-primary` → `--bw-light-black` (값 일치) | 재사용 → `Icon color="primary"` (기본값) |
| 아이콘 크기 `24` | 실측 | `--spacing-24` | `Icon` 이 자체 `size-24` 로 고정 → 다시 지정하지 않는다 |
| 모서리 | — | Figma 에 radius 없음 (직각) | 지정하지 않는다 |
| 폭 `402` | 심볼 프레임 폭 | `--spacing-mobile-frame-width` = `25.125rem` = 402px | 이 컴포넌트가 고정한다 → `w-mobile-frame-width`. `OSBarTopNavigation` · `OSBarBottomNavigation` 과 같은 판단 |
| 행 높이 `44` (**`27657:3127` 만**) | 레이어 실측 제약 (변수 바인딩 없음) | `--spacing-header-row-height` = `2.75rem` = 44px | `h-header-row-height min-h-header-row-height` |
| 아이템 묶음 상하 패딩 `10` (`27657:3125` · `27657:3129`) | 레이어 실측값 (변수 바인딩 없음) | `--spacing-header-item-inset-y` = `0.625rem` = 10px | `py-header-item-inset-y` — 이 두 노드의 높이 44 는 여기서 파생된다 |

`불명` 0건.

### 타이포 4개 값 대조 — 정확히 일치

| | Figma `font/title/small-strong` | `@utility font-title-small-strong` |
|---|---|---|
| size | `font-size/title-small` = 18 | `1.125rem` = 18px ✓ |
| weight | Bold / 700 | `var(--font-weight-strong)` = 700 ✓ |
| lineHeight | 1.2999999523162842 | `1.3` ✓ |
| letterSpacing | -2 (%) | `-0.02em` ✓ |

`get_design_context` 가 방출한 `tracking-[-0.36px]` 이 이를 교차검증한다 — 18px × -0.02 = -0.36px.

## 정정 1 — 행 높이 `44` 는 세 노드가 아니라 `27657:3127` 하나다

이 문서의 이전 "필요하지만 없는 토큰" 표는 44 의 적용 노드를 이렇게 적었다:

> | `44` | `27657:3127` (`h-[44px] min-h-[44px]` 방출) · **`27657:3125` · `27657:3129`
> (`py-[10px]` 방출)** | 헤더 행 높이 |

같은 칸 안에서 **방출된 클래스가 서로 다르다고 적어놓고도** 세 노드를 한 값으로 묶은 것이
잘못이다. 44 를 방출한 노드는 하나뿐이고, 나머지 둘이 방출한 것은 10 이다.

`token-guardian` 이 재확인해 두 토큰으로 갈랐고 근거는 이렇다.

| | `27657:3127` `content` | `27657:3125` · `27657:3129` |
|---|---|---|
| 방출된 클래스 | `h-[44px]` **+** `min-h-[44px]` | `py-[10px]` (높이 클래스 없음) |
| 자식 위치 | title height 23 @ y **10.5** — (44−23)/2 | 아이콘 24 @ y **10** — 패딩 그대로 |
| 판정 | **강제된 높이** 안의 가운데 정렬 | 패딩 10 의 **hug** (10+24+10 = 44) |
| 토큰 | `--spacing-header-row-height` | `--spacing-header-item-inset-y` |

hug 였다면 27657:3127 은 프레임 43 · 오프셋 10 이어야 한다. 반대로 44 가 강제된 값이라면
같은 세트의 두 variant 가 같은 높이여야 하는데, `27657:3097` 은 44 이고 `27657:3101` 은
**39** 다 (`get_metadata` 로 이 호출에서 독립 재확인).

**⇒ 슬롯 4개(`27657:3125` · `27657:3129` · `27657:3097` · `27657:3101`)에
`h-header-row-height` 를 쓰면 buttonGroup 이 39 대신 44 로 깨진다.**
`spacing.tokens.css` 의 `--spacing-header-row-height` 주석이 이 경고를 담고 있다.
더 긴 근거는 `HeaderSlotLeftEndItems.design.md` 의 "## 정정" 절에 있다.

`min-h` 를 함께 쓰는 것은 그대로 맞다: Figma 가 `content` 에 `min-h-[44px]` 를 명시하고,
`hasTitle=false`(Figma 설명이 적은 로그인·약관동의 화면)면 행 안에 높이를 만드는 것이 남지 않는다.

⚠ `--spacing-statusbar-height` 가 값만 보면 `2.75rem` = 44px 로 같다.
합칠지 나눌지의 판단 근거는 `spacing.tokens.css` 의 해당 주석에 있다 — 축이 다르므로 나눴다.

## 정정 2 — 폭 `402` 는 `w-full` 이 아니라 `w-mobile-frame-width` 다

이 문서의 값 표는 402 를 *"기기 폭(iPhone 16 Pro)에서 온 배치값 → `w-full`.
`OSBarTopNavigation` · `OSBarBottomNavigation` 과 같은 판단"* 이라고 적었다.
**인용한 선례가 이미 뒤집힌 상태였다.** 두 OS 바 컴포넌트는 각자의 `.design.md` 에
"`402` 의 판단은 뒤집혔다" 를 명시하고 `w-mobile-frame-width` 를 쓰고 있다.

근거 3건:

1. `get_design_context`(27657:3123)가 루트에 **고정 폭**을 방출한다 (`w-full` 이 아니다).
2. `spacing.tokens.css` 의 `--spacing-mobile-frame-width` 주석이 이 노드를 직접 지목한다 —
   *"같은 402 가 Header 27657:3123 의 폭이기도 하다."*
3. 요청자 결정: *"모바일 402 너비용 아이폰 17 해상도 디자인의 컴포넌트라서 그거에 맞게 너비 고정."*

⇒ 루트는 `w-mobile-frame-width` 다. 루트 **안**의 `w-full`(wrapper 27657:3124)은 부모를
채우는 값이라 그대로다 — OS 바 두 컴포넌트가 내린 것과 같은 구분이다.

## 필요하지만 없는 토큰

없음. 이 컴포넌트의 시각 값 전부가 기존 토큰으로 덮인다.

## 불명확한 값

없음.

## 재사용 판단

| Figma 노드 | 기존 컴포넌트 | 판정 |
|---|---|---|
| `27657:3126` `Icon/chevronLeft-large-line` | `Icon` | **재사용.** `Icon.tsx` 의 네이밍 규칙(`Icon/` 접두사와 `-line` 접미사 제거)대로 `name="chevronLeft-large"` 가 정확히 대응한다. 글리프도 일치한다 — `get_screenshot` 의 좌향 셰브론과 `Icon.tsx` 의 `chevronLeft-large` path 가 같다. 색은 `fill="currentColor"` 라 `color="primary"` 로 토큰이 결정한다 |
| `27657:3129` `Header Slot/Left End/ Items` | `HeaderSlotLeftEndItems` | **조립.** 슬롯 껍데기를 이 컴포넌트로 렌더하고 내용물은 `children` 으로 받는다. `contentType` 은 넘기지 않는다 — Figma Header 의 property 4개에 그 축이 없고, 인스턴스도 속성 재정의 없이 세트 기본값을 쓴다 (관찰된 정렬 불일치는 `HeaderSlotLeftEndItems.design.md` 의 "variant 축" 절에 적었다) |

⚠ `get_design_context` 는 셰브론을 `-scale-x-100` 으로 좌우 반전된 벡터로 방출한다
(Figma 원본이 chevronRight 를 미러링해 만든 심볼이라서다). `Icon.tsx` 는 좌향 path 를
직접 갖고 있으므로 반전 없이 그대로 쓴다 — 렌더 결과는 같고 코드가 단순하다.

## 구현에서 내린 나머지 판단

| 자리 | 판단 | 근거 |
|---|---|---|
| 루트 요소 | `<header>` | Figma 설명이 *"화면 상단에 고정되는 헤더"* 다. `<header>` 는 banner 랜드마크가 암묵으로 붙는다. `Divider` 가 `<hr>` 을 고른 것과 같은 방식이고 시각 값·prop 이 늘지 않는다 |
| 타이틀 요소 | `<p>` | 화면 제목이라 heading 이 자연스러워 보이지만, 이 컴포넌트는 자신이 문서의 어느 단계에 놓이는지 알 수 없어 heading 레벨을 고를 수 없다. Figma 가 방출한 요소도 `<p>` 다. 알 수 없는 것을 추측해 박지 않는다 (원칙 1) |
| 뒤로가기 | `<button>` 으로 만들지 않았다 | `27657:3125` 는 상호작용이 정의되지 않은 프레임이고 component property 에도 클릭 축이 없다. `OSBarTopNavigation` 이 설명에만 있는 `title` 을 만들지 않은 것과 같은 판정 (원칙 2) |
| `hasSlotStart=false` | 프레임은 남고 아이콘만 빠진다 | `get_design_context` 가 조건을 프레임 27657:3125 가 아니라 **아이콘 인스턴스 27657:3126** 에 건다. Figma 구조를 그대로 옮겼다. 결과적으로 이 조합에서 타이틀은 gap 12 만큼 안쪽에서 시작한다 — Figma auto-layout 의 동작과 같다 |
| `min-w-0` | Figma 는 최소폭 1 을 방출한다 | 그 값의 목적은 flex 항목의 `min-width:auto` 를 풀어 말줄임을 가능하게 하는 것이고, 그 관용 표현은 0 이다 (`--spacing-0`). 치수 결정이 아니라 레이아웃 리셋이라 1 을 그대로 옮기지 않았다. Tailwind 코어 유틸리티 `min-w-px` 는 hook 이 잡지 못하는 raw 1px 이기도 하다 |
| `flex-1` | Figma 는 `flex-[1_0_0]` 을 방출한다 | basis 0 · grow 1 이면 shrink 값은 결과에 영향이 없다. `flex-[1_0_0]` 은 arbitrary 값이라 hook 이 차단한다. 폭 계산이 Figma 와 일치함을 확인했다 — 362 − 24 − 12 = **326** (Figma 326) |
| `truncate` | Figma 방출을 그대로 옮겼다 | `overflow-hidden` · `text-ellipsis` · `whitespace-nowrap` 세 개의 Tailwind 축약이다. Figma 가 함께 방출한 `[word-break:break-word]` 는 `whitespace-nowrap` 아래에서 동작하지 않으므로 옮기지 않았다 |
| 타이틀 타입 | `title: string` (필수) | 기본값 `"타이틀"` 은 Figma property 의 기본값이지 컴포넌트가 소유할 문구가 아니라, `TextButton` 이 `레이블` 을 스토리 args 에 둔 것과 같이 스토리에 뒀다. 타이틀 없는 헤더는 `hasTitle=false` 로 표현한다 |

## 검증

| 항목 | 결과 |
|---|---|
| `npm run typecheck` | 통과 (exit 0). stale `tsbuildinfo` 를 배제하려고 `npx tsc -b --force` 도 함께 돌렸다 — 역시 exit 0 |
| `npm run build` | 통과 (exit 0). 32 modules |
| 하드코딩 hook | `.tsx` 2개 모두 exit 0. Bash 로 파일을 썼기 때문에 `Write` 페이로드로 `check-hardcode.mjs` 에 직접 통과시켰다 (`.claude/settings.json` 의 matcher 는 `Edit|Write|MultiEdit` 뿐이라 Bash 쓰기에는 훅이 발동하지 않는다) |
| 빌드 CSS 값 대조 | 번들(`dist/assets/*.css`)에서 전부 확인: `.h-header-row-height{height:var(--spacing-header-row-height)}` · `.min-h-header-row-height{min-height:…}` · `--spacing-header-row-height:2.75rem` (= 44px) · `.py-header-item-inset-y{padding-block:var(--spacing-header-item-inset-y)}` · `--spacing-header-item-inset-y:.625rem` (= 10px) · `.w-mobile-frame-width{width:var(--spacing-mobile-frame-width)}` · `--spacing-mobile-frame-width:25.125rem` (= 402px) · `.px-20` · `.py-6` · `.gap-12` · `.min-w-0{min-width:var(--spacing-0)}` · `.truncate` · `.font-title-small-strong{font-size:1.125rem;font-weight:var(--font-weight-strong);letter-spacing:-.02em;line-height:1.3}` · `.text-text-primary` · `.bg-bg-secondary` · `.text-icon-primary` |
| 렌더 대조 | `react-dom/server` 로 실제 컴포넌트를 4개 조합(기본 · `hasTitle=false` · `hasSlotStart=false` · `hasSlotEnd=true`) 렌더해 방출 DOM 을 확인했다. 셰브론 `<path>` 가 `Icon` 의 `chevronLeft-large`(좌향)이고 색이 `text-icon-primary` 인 것, 슬롯에 `shrink-0` 이 붙는 것까지 확인 |
| 기하 대조 (스크린샷) | `get_screenshot`(27657:3123) 과 대조. 빌드 CSS 의 실제 선언값으로 계산한 결과가 Figma 실측과 일치한다 — 루트 **402×56** (20+362+20 · 6+44+6), `27657:3125` **24×44** (아이콘 24 · 10+24+10), `27657:3127` **326×44** (362−24−12), 타이틀 높이 18×1.3 = **23.4** 와 세로 오프셋 (44−23.4)/2 = **10.3** (Figma 23 · 10.5) |

⚠ 헤드리스 Chrome 스크린샷은 이 환경에서 응답하지 않아(두 번 타임아웃) 픽셀 대조는 하지
못했다. 대신 (a) 빌드 CSS 의 실제 선언값, (b) `react-dom/server` 가 방출한 실제 DOM,
(c) 그 둘로 계산한 기하를 Figma 실측과 대조했다.
확인하지 않은 것을 확인했다고 적지 않는다 (원칙 1).

---

## 추가: `onSlotStartClick` — 뒤로가기 클릭 축 (2026-08-25)

이 문서는 뒤로가기를 `<button>` 으로 만들지 않은 이유를 *"Figma 27657:3125 는 상호작용이
정의되지 않은 프레임이고, component property 에도 클릭 축이 없다"* 로 적었다.
**그 관측은 지금도 그대로 맞다.** 축을 연 근거는 Figma 가 아니라 요청자 결정이다:

> *"회원 가입 이후 상단 뒤로가기 버튼 누르면 로그인으로 돌아가게 해줘."*

Figma 근거가 없는 변경이므로 그 사실을 여기 남긴다. 나중에 Figma 에 뒤로가기의
pressed·focused 표현이 생기면 그때 이 자리에 반영한다.

### 넘기지 않으면 이전과 같다

| `onSlotStartClick` | 렌더 |
|---|---|
| 없음 (기본) | `<Icon name="chevronLeft-large" />` — 이전과 완전히 같다 |
| 있음 | `<button type="button" aria-label="뒤로 가기">` 로 감싼다 |

기본값을 두지 않은 이유: 클릭 축이 없는 화면에서 아무 일도 하지 않는 `<button>` 이
생기면 키보드 사용자에게 탭 정지점만 늘고, 누르면 아무 일도 없는 컨트롤이 된다.
`TextField*` 의 `onClear` 가 없을 때 지우기 버튼을 렌더하지 않는 것과 같은 판단이다.

`hasSlotStart=false` 면 핸들러를 넘겨도 버튼이 생기지 않는다 — 아이콘 자체가 없는
자리에 컨트롤을 만들지 않는다.

### a11y

- 아이콘이 유일한 의미 전달자라 `aria-label="뒤로 가기"` 를 붙였다. 문구를 prop 으로
  열지 않은 이유는 이 슬롯이 Figma 설명에서 *"뒤로가기 노출 여부"* 로 정의된 자리라
  뜻이 하나이기 때문이다 (원칙 2). 다른 뜻이 필요해지면 그때 축을 연다.
- **UA 기본 포커스 링을 끄지 않았다.** 대체 링을 그릴 Figma variant 가 이 자리에 없어서,
  끄면 포커스 표시가 사라져 WCAG 2.4.7 에 미달한다. `Button.tsx` 의 `uaFocusOutline` 이
  세운 규율과 같다 — 끄는 것은 대신 그릴 때뿐이다.

사용처: `src/pages/SignIn/SignIn.tsx` (→ `/login`).
