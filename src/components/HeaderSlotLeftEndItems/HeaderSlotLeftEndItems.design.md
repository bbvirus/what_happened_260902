# HeaderSlotLeftEndItems — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료 (4/4 충족).** `.design.md` · `.tsx` · `.stories.tsx` · 검증 기록.
> 막혀 있던 치수 토큰은 `/sync-tokens` 로 들어왔다.
>
> ⚠ **다만 이 문서가 요청한 토큰이 틀렸다.** `44` 를 요청했지만 이 컴포넌트가 쓰는 값은 `10` 이다.
> 무엇을 왜 정정했는지는 아래 [## 정정 — `44` 가 아니라 `10` 이 선언값이다](#정정--44-가-아니라-10-이-선언값이다)
> 에 남겼다. 지운 것이 아니라 남긴 이유는, 같은 함정(파생값을 강제된 제약으로 오독하는 것)에
> 다음 사람이 다시 빠지지 않게 하기 위함이다.
>
> ⚠ **미해결 불일치 1건이 남아 있다.** `contentType=buttonGroup` 의 렌더 높이가 Figma 실측
> 39 가 아니라 **36** 이다 (3 작다). 원인은 이 컴포넌트가 아니라 `font-label-large` 의
> line-height 이고, 그 파일은 편집 권한 밖이다.
> [## 미해결 불일치 — buttonGroup 높이 3](#미해결-불일치--buttongroup-높이-3) 참조.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27657-3096&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27704:1746` — section "Header" |
| 프레임 | `27657:3096` — "HeaderSlot/LeftEnd/Items" 321×162 |
| variant | `27657:3097` `contentType=iconGroup` 104×44 · `27657:3101` `contentType=buttonGroup` 100×39 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

## 노드 구조

```
frame  27657:3096  "HeaderSlot/LeftEnd/Items"   321×162
├─ symbol 27657:3097  "contentType=iconGroup"   104×44
│  ├─ instance 27657:3098  "Icon/line"  x=0  y=10  24×24
│  ├─ instance 27657:3099  "Icon/line"  x=40 y=10  24×24
│  └─ instance 27657:3100  "Icon/line"  x=80 y=10  24×24
└─ symbol 27657:3101  "contentType=buttonGroup" 100×39
   ├─ instance 27657:3102  "TextButton"  x=0  y=10  42×19
   └─ instance 27657:3103  "TextButton"  x=58 y=10  42×19
```

폭은 둘 다 자식과 gap 으로 정확히 설명된다 — gap 이 `spacing/16` 임을 뒷받침한다.

- iconGroup 104 = 24 + 16 + 24 + 16 + 24
- buttonGroup 100 = 42 + 16 + 42

## variant 축 — `contentType` 1개

`get_design_context` 가 방출한 property 는 `contentType`("iconGroup" | "buttonGroup") ·
`hasSlotEnd1..3`(boolean) · `slotEnd1..3`(instance swap) 다.

두 variant 의 시각 값 차이는 **교차축 정렬 하나뿐**이다.

| | 공통 | iconGroup (27657:3097) | buttonGroup (27657:3101) |
|---|---|---|---|
| 방출된 클래스 | `flex gap-[var(--spacing/16,16px)] py-[10px]` | `items-start` | `items-center justify-end` |

자식 높이가 서로 같으면 `items-start` 와 `items-center` 는 시각적으로 구분되지 않는다.
그래도 Figma 에 존재하는 축이므로 임의로 합치지 않는다.

⚠ **한 가지 관찰된 불일치.** Header 안의 인스턴스 `27657:3129` 는 세트의 기본값
`contentType=iconGroup` 을 쓰는데(속성 재정의가 이름에 없다), `get_design_context`(27657:3123)는
그 인스턴스를 **buttonGroup 쪽 정렬**(`items-center justify-end`)로 평탄화해 방출한다.
내용물은 iconGroup 쪽(`Icon/line` 3개)이다. 둘 중 하나는 인스턴스의 로컬 레이아웃 재정의이거나
MCP 평탄화의 부산물이고, 어느 쪽인지 Figma 가 말해주지 않는다.

**구현을 막는 모호함은 아니다.** (a) 이 인스턴스의 실제 내용물은 높이가 같은 24 아이콘 3개이고,
패딩 10 의 hug 컨테이너에서 `items-start` 와 `items-center` 는 **같은 104×44 를 만든다**.
(b) Header 의 component property 에 `contentType` 이 없어서 Header 는 이 축을 표현할 수단이
아예 없다. 그래서 Header 는 아무것도 넘기지 않고 세트 기본값을 쓴다 — 속성 재정의가 없는
Figma 인스턴스와 같은 상태다. 추측으로 한쪽을 고르지 않았고, 관찰만 남긴다.

## 값의 출처

`get_variable_defs`(27657:3096) 원문:
`{"icon/primary":"#1a1a1a","spacing/16":"16","text/primary":"#1a1a1a","family-font":"Pretendard","font-size/label-large":"16","font/label/large":"Font(...)","spacing/4":"4","radius/0":"0"}`

`spacing/4` · `radius/0` · `font/label/large` 는 자식 `TextButton` 인스턴스에서 올라온 것이고
이 컨테이너 자신의 값이 아니다.

| Figma 값 | 출처 | 토큰 | 판정 |
|---|---|---|---|
| gap `spacing/16` = 16 | **Figma 변수** | `--spacing-16` = `1rem` = 16px (값 일치) | 재사용 → `gap-16` |
| 교차축 정렬 | 레이어 속성 | — (토큰 축이 아니다) | `items-start` / `items-center justify-end` |
| 주축 정렬 (buttonGroup) | 레이어 속성 | — | `justify-end` |
| 세로 여백 `10` | 레이어 실측값 (변수 바인딩 없음) | `--spacing-header-item-inset-y` = `0.625rem` = 10px | 재사용 → `py-header-item-inset-y` |
| 높이 `44`(iconGroup) · `39`(buttonGroup) | 위 `10` 의 **파생값** | — (지정하지 않는다) | iconGroup 44 = 24+10+10 → **코드도 44** ✓ / buttonGroup 39 = 19+10+10 은 Figma 텍스트 메트릭 산술이고 **코드는 36** ✗ (아래 미해결 불일치) |
| 자식 크기 `24` | 실측 | `--spacing-24` | `Icon` 이 자체 `size-24` 로 이미 고정 → 이 컴포넌트가 다시 지정하지 않는다 |

`불명` 0건. 막힌 것도 0건이다.

## 정정 — `44` 가 아니라 `10` 이 선언값이다

**이 문서의 이전 판단은 틀렸다.** 원문은 이렇게 적었다:

> Figma 는 `py-[10px]` 로 방출하지만, 10 은 디자인 결정이 아니라 44 안에서 24 를 가운데 두면
> 나오는 파생값이다 (24 + 10 + 10 = 44). (…) 그래서 토큰 요청을 10 과 44 두 건이 아니라
> **44 한 건으로 줄인다.**

파생 방향이 **반대**였다. 44 가 10 을 낳은 것이 아니라 10 이 44 를 낳는다.
`token-guardian` 이 재확인했고 근거 3건이 일치한다.

**근거 1 — Figma 가 방출하는 클래스의 종류가 다르다.**
`get_design_context`(27657:3096)는 두 variant 루트에 `gap-[var(--spacing/16,16px)] py-[10px]` 를
방출하고 **높이 클래스를 방출하지 않는다.** 그리고 같은 줄에서 gap 16 은 `var()` 로 나오는데
10 은 raw 리터럴로 나온다 — 10 이 Figma 변수였다면 gap 처럼 `var()` 였을 것이다.
반대로 Button 1:4004 는 12개 variant 루트 **전부**에 `min-h-[55px]` 가 방출됐다.
hug 면 높이 클래스가 나오지 않는다.

**근거 2 — 같은 컴포넌트 세트의 두 variant 높이가 다르다.**
`27657:3097` iconGroup 은 104×**44**, `27657:3101` buttonGroup 은 100×**39** 다
(`get_metadata` 로 이 호출에서 독립 재확인). Button 의 55 가 "강제된 높이" 로 판정된 근거는
12 variant 가 **전부** 55 였다는 것이다. 여기서 불변인 것은 높이가 아니라 패딩 10 이고,
두 높이는 그 하나에서 파생된다 — 44 = 24+10+10 (자식 아이콘 24), 39 = 19+10+10 (자식 라벨 19).

⚠ 이 산술의 `19` 는 **Figma 텍스트 메트릭 값**이고 브라우저 라인박스가 아니다. 브라우저는 같은
라벨을 16 으로 만들기 때문에 **코드의 buttonGroup 높이는 39 가 아니라 36 이다.** 위 산술은
"Figma 안에서 10 이 두 높이를 낳는다" 는 것을 보이는 데까지만 유효하다 — 코드 높이의 예측값이
아니다. 아래 "## 미해결 불일치" 에 적었다.

**근거 3 — 진짜 강제된 높이는 어떻게 보이는지.**
Header 의 `content`(27657:3127)에는 `h-[44px]` **와** `min-h-[44px]` 가 함께 방출되고,
자식 title 27657:3128 은 height 23 · y 오프셋 **10.5** 다. (44 − 23) / 2 = 10.5 —
강제된 높이 안의 가운데 정렬이다. 상하 패딩 10 의 hug 였다면 프레임 43 · 오프셋 10 이어야 한다.
이 시험을 통과하는 노드는 27657:3127 **하나뿐**이다.

**⇒ 44 는 `27657:3127` 한 노드만의 제약이고, 나머지 4개 노드(`27657:3125` · `27657:3129` ·
`27657:3097` · `27657:3101`)의 선언값은 10 이다.**

무엇이 이 오독을 만들었나: `24 + 10 + 10 = 44` 라는 산술은 두 방향 모두와 맞는다. 그래서
산술만으로는 판정되지 않고, **Figma 가 무엇을 방출하고 무엇을 방출하지 않는지**와
**같은 세트의 다른 variant 가 그 값을 공유하는지**를 봐야 한다. Button 의 선례를 값의 모양만
보고 끌어온 것이 잘못이었다 — 선례의 근거(12/12 variant 가 동일)가 여기서는 성립하지 않는다.

이 판정은 `spacing.tokens.css` 의 `--spacing-header-item-inset-y` 주석에 토큰 소유자가
그대로 기록했고, `--spacing-header-row-height` 주석은 *"슬롯에 `h-header-row-height` 를 쓰면
buttonGroup 이 39 대신 44 로 렌더된다"* 는 경고를 함께 담고 있다.

## 필요하지만 없는 토큰

없음. 이 컴포넌트가 쓰는 치수는 `gap-16`(`--spacing-16`)과
`py-header-item-inset-y`(`--spacing-header-item-inset-y`) 둘뿐이고 모두 존재한다.

`h-header-row-height` 는 **쓰지 않는다.** 존재하지만 이 컴포넌트의 값이 아니다 (위 정정 참조).

## 불명확한 값

없음.

## 재사용 판단

### `Icon` — 이 컴포넌트에서는 쓰지 않는다 (슬롯으로 넘긴다)

`27657:3098~3100` 은 세 개 모두 `Icon/line` 인스턴스다. 이것은 글리프가 아니라
**점선 테두리의 빈 플레이스홀더 템플릿**이다. `Icon.design.md` 가 아이콘 12개를 추릴 때
같은 이유로 제외한 노드(18:5191)이고, `TextButton.design.md` 도 같은 판정을 내렸다.
`get_screenshot`(27704:1746)에서도 점선 원 3개로 보인다.

⇒ **Figma 는 어느 아이콘이 들어갈지 지정하지 않았다.** 기본 아이콘을 추측해 넣지 않는다. (원칙 1)
Figma 자신이 `slotEnd1..3` 를 instance-swap 슬롯으로 선언했으므로, 코드에서도 내용물은
호출부가 채운다. Header 의 Figma 설명이 이 슬롯을 *"코드의 children과 같은 개념"* 이라고
직접 적어두었다 — 슬롯 6개(`hasSlotEnd1..3` + `slotEnd1..3`)를 그대로 옮기는 대신
`children` 하나로 두는 근거는 추측이 아니라 이 문장이다.

### `TextButton` — 재사용한다. 색 문제는 `color` prop 으로 해소됐다

`27657:3102` · `27657:3103` 은 기존 `TextButton`(13:1742) 인스턴스이므로 구조를 재사용한다.
아래는 이 문서가 처음 쓰였을 때 **라벨 색이 어긋났던** 기록이다.

| | 라벨 색 |
|---|---|
| 기존 `TextButton.tsx` | `text-text-secondary` = `--neutral-gray-light-600` = `#747474` (하드코딩, prop 없음) |
| 이 노드의 Figma 값 | `text/primary` = `#1a1a1a` |

근거 3건이 일치한다 (추측 아님):

1. `get_design_context`(27657:3096)가 두 인스턴스 모두에
   `text-[color:var(--text\/primary,#1a1a1a)]` 로 방출한다.
2. `get_variable_defs`(27657:3096)에 `text/primary` 만 있고 `text/secondary` 가 **없다**.
3. `get_screenshot`(27657:3101) PNG 픽셀 디코드 — 글리프 내부 최빈·최암 색이 정확히
   `#1a1a1a`(90px), 배경 `#d0d0d0`. `#757575` 는 안티에일리어싱 경계값이다.

당시 판정은 *"`TextButton` 은 이 자리를 덮지 못한다"* 였고, 고치지 않고 보고했다 —
요청 범위 밖 파일이고 (원칙 3) `color` prop 신설은 요청받지 않은 API 변경이라서다 (원칙 2).

**그 보고가 처리됐다.** 사용자 승인 후 `component-builder` 가 `TextButton` 에
`color?: 'primary' | 'secondary'` (기본값 `secondary`)를 추가했다. 기본값이 이전 렌더 결과와
같으므로 기존 사용처는 영향받지 않는다.

⇒ 이 컴포넌트의 `contentType=buttonGroup` 은 **`color="primary"` 를 넘긴다.** 라벨은
`label` prop 이 아니라 `children` 으로 넘긴다. 사본을 만들지 않는다.

## 미해결 불일치 — buttonGroup 높이 3

**이 작업은 이 불일치를 해결하지 못했다.** "범위 밖" 이라고만 적어두면 다음 사람이 모르게 되므로
여기 남긴다.

| | Figma | 실제 렌더 |
|---|---|---|
| 라벨 세로 크기 | **19** (Figma 텍스트 메트릭) | **16** (브라우저 라인박스) |
| `contentType=buttonGroup` 높이 | **39** = 19 + 10 + 10 | **36** = 16 + 10 + 10 |
| 차이 | | **3 작다** |

**결정론적인 값이고 추정이 아니다.** shipped CSS 에서 확인했다 —
`.font-label-large{font-family:var(--font-sans);font-size:1rem;font-weight:var(--font-weight-base);line-height:1}`.
`line-height: 1` 이면 라인박스가 글자 크기와 같아지므로 16px 짜리 라벨의 세로 크기는 정확히 16 이다.

**iconGroup 은 이 문제가 없다.** 자식 `Icon` 은 텍스트가 아니라 고정 크기 24 라서
10 + 24 + 10 = 44 로 Figma 실측과 일치한다 (리뷰어가 헤드리스 브라우저로 계측 확인).
즉 어긋나는 것은 이 컨테이너가 아니라 **텍스트 자식이 들어오는 경우**다.

### 왜 이 작업에서 고치지 않았나

- 이 컨테이너가 정하는 값(상하 패딩 10 · gap 16 · 정렬)은 **전부 Figma 와 일치한다.**
  차이는 전부 라벨 라인박스에서 나온다.
- 원인 파일은 `typography.tokens.css` 의 `font-label-large` 이고, **이 작업 범위 밖이자
  `figma-implementer` 의 편집 권한 밖**이다 (토큰은 `token-guardian` 담당).
- 패딩을 키우거나 높이를 박아 36 을 39 로 맞추면 **원인이 숨는다.** 같은 타이포 토큰을 쓰는
  다른 자리(`TextButton` 을 쓰는 모든 컴포넌트)는 그대로 어긋난 채 남는다.

### 해결에 필요한 것 (`token-guardian` 의 일)

Figma 변수 `font/label/large` 의 lineHeight 가 **AUTO(≈1.19)인지 100%인지** 재확인해야 한다.
`get_variable_defs`(27657:3096)가 내보낸 문자열은 `lineHeight: 100` 인데, 이 값이 "100%"(→ 1)를
뜻하는지 Figma 의 AUTO 를 정규화한 표기인지가 갈림길이다. 19 / 16 = **1.1875** 로 Pretendard 의
AUTO 행간에 가깝다는 점이 후자를 시사하지만, **확인하지 않았으므로 단정하지 않는다.**
`font-label-large` 는 `TextButton` 을 비롯해 여러 컴포넌트가 공유하므로 여기서 임의로 바꾸지 않는다.

## 검증

| 항목 | 결과 |
|---|---|
| `npm run typecheck` | 통과 (exit 0). stale `tsbuildinfo` 를 배제하려고 `npx tsc -b --force` 도 함께 돌렸다 — 역시 exit 0 |
| `npm run build` | 통과 (exit 0). 32 modules |
| 하드코딩 hook | `.tsx` 2개 모두 exit 0. Bash 로 파일을 썼기 때문에 `Write` 페이로드로 `check-hardcode.mjs` 에 직접 통과시켰다 (`.claude/settings.json` 의 matcher 는 `Edit|Write|MultiEdit` 뿐이라 Bash 쓰기에는 훅이 발동하지 않는다) |
| 빌드 CSS 값 대조 | 번들(`dist/assets/*.css`)에서 확인: `.py-header-item-inset-y{padding-block:var(--spacing-header-item-inset-y)}` · `--spacing-header-item-inset-y:.625rem` (= 10px) · `.gap-16{gap:var(--spacing-16)}` · `.items-start{align-items:flex-start}` · `.justify-end{justify-content:flex-end}` |
| 스크린샷 대조 (iconGroup) | `get_screenshot`(27657:3096) 은 점선 원 3개 + `레이블` 2개. 기하 계산이 Figma 실측과 일치한다 — 24+16+24+16+24 = **104** 폭, 10+24+10 = **44** 높이 (Figma 104×44) |
| 스크린샷 대조 (buttonGroup) | 정렬 · 간격(gap 16) · 패딩(10)은 일치. **높이는 불일치** — Figma 39, 렌더 **36**. 이 컨테이너가 정하는 값(패딩 10)은 맞고 차이는 자식 라벨의 라인박스에서 나오지만, **미해결 상태로 남아 있다**. 아래 "## 미해결 불일치" 참조 |
| 렌더 대조 | `react-dom/server` 로 실제 컴포넌트를 렌더해 방출 클래스를 확인했다: iconGroup `py-header-item-inset-y flex gap-16 items-start`, buttonGroup `py-header-item-inset-y flex gap-16 items-center justify-end`. buttonGroup 의 `TextButton` 라벨에 `text-text-primary` 가 실제로 붙는 것도 확인 |

⚠ 헤드리스 Chrome 스크린샷은 이 환경에서 응답하지 않아(두 번 타임아웃) 픽셀 대조는 하지 못했다.
대신 (a) 빌드 CSS 의 실제 선언값, (b) `react-dom/server` 가 방출한 실제 클래스,
(c) 그 둘로 계산한 기하를 Figma 실측과 대조했다. 확인하지 않은 것을 확인했다고 적지 않는다.
