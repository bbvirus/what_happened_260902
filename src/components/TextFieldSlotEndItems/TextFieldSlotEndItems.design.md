# TextFieldSlotEndItems — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `TextFieldSlotEndItems.tsx`, 스토리는 `TextFieldSlotEndItems.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-2209> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27683:6167` — section "TextField" (요청자가 선택한 영역) |
| 컴포넌트 세트 | `13:2209` — frame "TextFieldSlot/End/Items", 540×126 |
| 추출 | `get_metadata`(13:2209 · 13:2212 · 13:2217) · `get_design_context`(13:2209) · `get_variable_defs`(13:2209 · 13:2212 · 13:2217 · 13:2221) · `get_screenshot`(13:2209) (2026-08-24) |

## 노드 구조 — 변형 2개, 축 1개

```
frame 13:2209  "TextFieldSlot/End/Items"  540×126
├─ symbol 13:2217  "contentType=icon"    24×24   ← flex · items-center · gap = spacing/16
│  ├─ instance 13:2218  "Icon/line"  24×24  hidden
│  ├─ instance 13:2219  "Icon/line"  24×24  hidden
│  ├─ instance 13:2220  "Icon/line"  24×24  hidden
│  └─ instance 13:2221  "Icon/line"  24×24          ← 기본으로 이 1칸만 보인다
└─ symbol 13:2212  "contentType=suffix"  14×19  ← flex · items-start
   └─ text 13:2213  "원"  14×19
```

축은 `contentType` 하나이고 값은 `icon` · `suffix` 2개다. 전 조합이 곧 전부다.
`get_design_context`(13:2209) 가 방출한 property 는 `contentType` ·
`hasIconEnd1`~`hasIconEnd4` · `iconEnd1`~`iconEnd4` · `text` 다.
`hasIconEnd*` · `iconEnd*` 는 variant 축이 아니라 **인스턴스 스왑 슬롯의 표시 여부**이며,
`hasIconEnd4` 만 기본 `true` 다 — 위 트리의 hidden 3개와 일치한다.

**두 변형의 차이는 루트 정렬뿐이다.** `icon` 은 `items-center` + `gap`,
`suffix` 는 `items-start` + gap 없음. 그 외 공통 속성은 없다.

## 값의 출처

| 값 | Figma 원값 | 출처 | 토큰 | 결론 |
|---|---|---|---|---|
| 아이콘 사이 간격 | 16 | 변수 `spacing/16` | `--spacing-16` = `1rem` = 16px | 값 일치 → 재사용 (`gap-16`) |
| 접미 텍스트 색 | `#1a1a1a` | 변수 `text/primary` | `--color-text-primary` → `--bw-light-black` = `#1a1a1a` | 값 일치 → 재사용 (`text-text-primary`) |
| 접미 텍스트 타이포 | `Font(family: family-font, style: Medium, size: font-size/label-large(16), weight: 500, lineHeight: 100, letterSpacing: 0)` | 변수 `font/label/large` | `@utility font-label-large` = `1rem`(16px) / `--font-weight-base`(500) / `line-height: normal` | 4개 값 전부 일치 → 재사용 (아래 lineHeight 주석 참조) |
| 접미 텍스트 정렬 | right | 텍스트 노드 13:2213 의 textAlign | — | `text-right` (치수 리터럴이 아니다) |
| 아이콘 색 | `#747474` | 변수 `icon/secondary` | `--color-icon-secondary` → `--neutral-gray-light-600` = `#747474` | 값 일치 → 재사용. 단 이 컴포넌트가 아니라 **호출부가** `Icon color="secondary"` 로 건다 (아래 참조) |
| 아이콘 크기 | 24×24 | 13:2218~13:2221 의 width/height | `--spacing-24` → `Icon` 의 기본 `size-24` | 값 일치 → `Icon` 기본값 그대로 |
| 아이콘 글리프 | 없음 (스왑 슬롯) | 4칸 전부 `Icon/line`(18:5191) 인스턴스 | — | 그릴 글리프가 지정돼 있지 않다. 호출부가 넘긴다 (아래 참조) |
| 루트 반경 | 없음 | 13:2212 · 13:2217 에 코너 반경 없음 | — | 반경 유틸리티가 들어갈 자리가 없다 |
| 루트 fill | 없음 | 두 변형 모두 fill 0건 | — | 배경 유틸리티가 들어갈 자리가 없다 |
| 크기 24×24 · 14×19 | hug 결과 | 자식(아이콘 24 / 텍스트 14×19)에서 파생 | — | 치수 토큰을 쓰지 않는다 (아래 참조) |

`불명`으로 남은 값은 없다. **신규 토큰 0건** — 이 컴포넌트가 쓰는 값은 전부 기존 토큰으로 표현된다.

### `radius/4` 는 이 컴포넌트의 값이 아니다

`get_variable_defs`(13:2209) 응답에는 `radius/4` 가 들어 있지만, 두 변형을 각각
조회하면 나오지 않는다 (`get_variable_defs`(13:2212) · `(13:2217)` 둘 다 없음).
컴포넌트 세트를 감싼 프레임 쪽 값이며 변형에 걸린 값이 아니다. 코드에 넣지 않았다.

## 아이콘 글리프를 이 컴포넌트가 그리지 않는 이유

4칸 전부 `Icon/line`(18:5191) 인스턴스다. 그 심볼은 `Icon.design.md` 가 이미
판정해 둔 항목이다 — *"점선 빈 플레이스홀더 템플릿. 아이콘이 아니다"* 라는 이유로
`Icon` 컴포넌트의 12개 목록에서 **제외**됐다. `get_screenshot`(13:2209) 도 같은 것을
보여 준다: `contentType=icon` 자리에 점선 원 플레이스홀더가 있고 실제 글리프가 없다.

즉 Figma 가 지정한 것은 **자리(24×24 · 최대 4칸 · 간격 16 · 세로 가운데)** 이고
글리프가 아니다. 없는 것을 지어내지 않는다 (원칙 1) — `children` 으로 받는다.

칸 수도 강제하지 않았다. Figma 는 4칸을 두고 기본으로 1칸만 켜 두는데, 이는
"항상 1개" 가 아니라 "호출부가 켠 만큼" 이라는 뜻이다. `hasIconEnd1`~`4` 를
boolean prop 4개로 옮기면 쓰이지 않는 옵션이 유지비로 남는다 (원칙 2).

### 아이콘 색을 컴포넌트가 강제하지 않는 이유

Figma 슬롯에 물려 있는 색은 변수 `icon/secondary` 이고, 저장소에는 값이 같은
`--color-icon-secondary` 가 이미 있다. 그런데 `Icon.tsx` 는 `COLOR[color]` 유틸리티를
**항상** 자기 `className` 에 붙이므로 컨테이너에서 색이 상속되지 않는다.
슬롯이 색을 강제하려면 자식을 복제해 prop 을 주입해야 하는데, 그것은 Figma 가
요구하지 않은 추상화다 (원칙 2). 호출부가 `<Icon color="secondary" />` 로 넘긴다.
스토리 3개 전부 그 조합으로 세워 둔다.

## 크기를 고정하지 않았다 — hug 결과다

`get_design_context`(13:2209) 는 두 변형 중 어느 것에도 width·height 클래스를
방출하지 않는다 (`content-stretch flex relative` + 정렬/간격뿐). 메타데이터의
24×24 · 14×19 는 자식에서 파생된 hug 값이다. `TabItem` 이 높이 49 에 대해 세운 것과
같은 기준으로, Figma 가 강제하지 않은 제약을 코드가 만들어 내지 않는다.

접미 텍스트 높이 19 는 크기 16 의 **AUTO 행간** 결과다 (16 × 1.1875 = 19,
Pretendard 의 normal 행간 비율). `typography.tokens.css` 가 이미 확정해 둔 사실과
맞물린다 — Figma `font/label/*` 의 `lineHeight: 100` 은 100% 가 아니라 AUTO 의
sentinel 표기이고, 그래서 그 파일의 label 유틸리티 6종은 `line-height: normal` 이다.

⚠ **한계**: `normal` 은 서체 의존이라 결정론적이지 않고, 이 저장소에는 Pretendard
웹폰트가 포함돼 있지 않아 폴백 서체가 적용된다. 실제 렌더 높이는 브라우저·OS 에
따라 달라진다. 이 한계는 `typography.tokens.css` 가 이미 명시해 둔 것이고
이 컴포넌트가 새로 만든 것이 아니다.

## 사용한 토큰

### 컴포넌트 (`TextFieldSlotEndItems.tsx`)

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--spacing-16` | `gap-16` | 변수 `spacing/16` = 16 |
| `--color-text-primary` | `text-text-primary` | 변수 `text/primary` = `#1a1a1a` |
| typography `font-label-large` (`@utility`) | `font-label-large` | 변수 `font/label/large` |

간접 사용 (호출부가 `Icon` 에 넘긴다): `--color-icon-secondary`(변수 `icon/secondary`) ·
`--spacing-24`(`Icon` 기본 `size-24`).

토큰이 아닌 유틸리티와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `flex` | 레이아웃 | Figma 루트의 가로 auto-layout 을 직역 |
| `items-center` | 레이아웃 | 13:2217 의 세로 가운데 정렬 |
| `items-start` | 레이아웃 | 13:2212 의 세로 위 정렬 |
| `text-right` | 정렬 | 텍스트 노드 13:2213 의 textAlign = right. 치수 리터럴이 아니다 |
| `whitespace-nowrap` | 레이아웃 | `get_design_context` 가 접미 텍스트에 방출한 것 그대로 |

### 스토리 (`TextFieldSlotEndItems.stories.tsx`)

| 토큰 | 유틸리티 |
|---|---|
| `--color-bg-primary` | `bg-bg-primary` |
| `--color-text-secondary` | `text-text-secondary` |
| `--spacing-12` · `--spacing-24` · `--spacing-40` | `gap-12` · `gap-24` · `p-40` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

## a11y

- 루트는 `<div>` 다. Figma 에 상호작용 축(`state=pressed` · `focused` 등)이 **없고**,
  두 변형 모두 정렬만 다른 배치 프레임이다. 상호작용이 있다고 볼 근거가 없으므로
  버튼으로 만들지 않았다 (`Header` 가 같은 기준으로 프레임을 버튼으로 만들지 않은 것과 같다).
  아이콘 슬롯이 눌리는 자리라면 `children` 으로 넘어오는 노드가 버튼이 된다 — 그 결정은
  호출부(Wave 2 의 `TextFieldSlot/Text` · `TextFieldSlot/Password`)가 한다.
- `role` 을 붙이지 않았다. 이 슬롯이 무엇을 감싸는지는 호출부만 안다 (원칙 1).
  props 를 전개하므로 호출부가 넘길 수 있다.
- 접미 텍스트("원")는 값의 단위이므로 장식이 아니다. `aria-hidden` 을 붙이지 않았다.

## Code Connect

`get_design_context`(13:2209) 응답에 Code Connect 매핑이 없다. 매핑 생성은 이 작업의
요청 범위 밖이라 보고만 한다 (원칙 3).
매핑을 원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `13:2209`).

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 |
| 빌드 CSS 값 대조 | 번들(`dist/assets/*.css`)에서 확인: `.gap-16{gap:var(--spacing-16)}` · `.text-text-primary{color:var(--color-text-primary)}` · `.font-label-large{font-family:var(--font-sans);font-size:1rem;font-weight:var(--font-weight-base);line-height:normal}` · `.items-center` · `.items-start` · `.text-right` · `.whitespace-nowrap` |
| `get_screenshot`(13:2209) 대조 | 일치. `suffix` 는 좌측 상단 정렬된 "원" 1개, `icon` 은 24×24 자리 1칸(Figma 쪽은 스왑 전 점선 플레이스홀더로 렌더된다) |
