# OSBarBottomNavigation — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료 (4/4 충족).** 막혀 있던 치수 3건(21 · 134 · 5)이 `/sync-tokens` 로
> `spacing.tokens.css` 에 들어와 `OSBarBottomNavigation.tsx` · `.stories.tsx` 를 내렸다.
> 매핑은 아래 [사용 토큰](#사용-토큰) 표가 최종본이다.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27719-2395&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27719:2395` — section "OSBarNavigation" |
| 컴포넌트 세트 | `27719:2167` — "OSBar/BottomNavigation" |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문): *"iOS/Android의 하단 내비게이션 바를 구현하는 OS 컴포넌트입니다. 메인 탭이나
주요 섹션으로의 빠른 이동을 제공하며, 앱의 주요 네비게이션 구조를 구성하는 데 사용됩니다.
키워드 : OS, Bottom Navigation, 하단 바, 탭 네비게이션."*

## 노드 구조

```
COMPONENT_SET 27719:2167  "OSBar/BottomNavigation"
├─ 27719:2194  transparent=false, onFrameHigh=false   402×34
├─ 27719:2196  transparent=false, onFrameHigh=true    402×34
└─ 27719:2198  transparent=true,  onFrameHigh=false   402×34
      └─ ROUNDED_RECTANGLE  "Home Indicator"  x=134 y=21  134×5
```

세 variant의 자식 구조는 동일하다. `get_design_context`(27719:2167)가 세 variant를 한 컴포넌트로
합쳐 내보냈고, **차이가 나는 것은 루트의 배경 하나뿐**이다. 나머지 클래스는 세 variant가 전부 같다.

레이아웃(Figma 원값): 루트 `padding: 21 134 8 134`, 세로 auto-layout.
`21 + 5 + 8 = 34` 이고 `134 + 134 + 134 = 402` 다 — 즉 좌우 패딩 134는 별도의 여백이 아니라
"Home Indicator 폭 134를 402 안에서 가운데 둔다"를 Figma가 패딩으로 표현한 것이다.

## variant 축

Figma 변형 축은 `transparent`, `onFrameHigh` 두 개의 boolean이다. 조합 3개만 존재한다.

| transparent | onFrameHigh | 노드 | 배경 (Figma 변수) |
|---|---|---|---|
| false | false | 27719:2194 | `bg/secondary` = `#fcfcfc` |
| false | true | 27719:2196 | `bg/tertiary` = `#f2f2f2` |
| true | false | 27719:2198 | 없음 (fill 0건) |
| true | **true** | **Figma에 없음** | **아래 참조 — 결정 가능** |

### 없는 조합 (transparent=true, onFrameHigh=true) — 발명하지 않고 규칙으로 결정한다

존재하는 3개에서 읽히는 규칙은 두 문장이다.

1. `onFrameHigh` 가 바꾸는 것은 **배경색 하나뿐**이다. (`get_design_context` 가 두 variant 사이에
   내보낸 차이가 `bg/secondary` ↔ `bg/tertiary` 뿐이고, `get_variable_defs`(27719:2196) 에도
   `bg/tertiary` 만 추가로 잡힌다.)
2. `transparent=true` 는 **배경 자체를 제거**한다. (`get_variable_defs`(27719:2198) 결과가
   `{radius/full, icon/primary}` 뿐 — `bg/*` 가 아예 없다.)

배경이 제거된 상태에서 `onFrameHigh` 가 바꿀 대상이 남지 않으므로
**(transparent=true, onFrameHigh=true) = 배경 없음**으로 결정된다. 추정이 아니라 두 규칙의 귀결이다.

## 값의 출처

`Figma 변수` / `기존 토큰` / `불명` 3분류. **`불명` 은 0건이다** — 모든 값을 Figma에서 읽었다.
문제는 출처가 아니라, 읽은 값 중 3건에 대응 토큰이 없다는 것이다.

| 값 | Figma 출처 | 변수 바인딩 | 기존 토큰 | 판정 |
|---|---|---|---|---|
| 배경 (기본) | `bg/secondary` `#fcfcfc` | 있음 | `--color-bg-secondary` (값 일치) | 재사용 가능 → `bg-bg-secondary` |
| 배경 (onFrameHigh) | `bg/tertiary` `#f2f2f2` | 있음 | `--color-bg-tertiary` (값 일치) | 재사용 가능 → `bg-bg-tertiary` |
| Home Indicator 색 | `icon/primary` `#1a1a1a` | 있음 | `--color-icon-primary` (값 일치) | 재사용 가능 → `bg-icon-primary` |
| Home Indicator 반경 | `radius/full` = `100` | 있음 | `--radius-100` = `6.25rem` = 100px | 재사용 가능 → `rounded-100`. `design-tokens.css` 주석이 이 토큰의 용도를 이미 "Home Indicator (OS 전용)" 로 적어두고 있다 |
| padding-bottom `8` | 루트 레이어 실측값 | **없음** (raw) | `--spacing-8` = `0.5rem` = 8px (값 일치) | 재사용 가능 → `pb-8` |
| padding-top `21` | 루트 레이어 실측값 | 없음 | **없음** | **막힘** |
| padding-left/right `134` | 루트 레이어 실측값 | 없음 | **없음** | **막힘** |
| Home Indicator height `5` | 27719:2195 실측값 | 없음 | **없음** | **막힘** |
| width `402` | 심볼 프레임 폭 | 없음 | `--spacing-mobile-frame-width` = `25.125rem` | 재사용 가능 → `w-mobile-frame-width`. 처음에는 "기기 폭에서 온 배치값이라 `w-full`, 치수 토큰 불필요" 로 판정했으나 뒤집혔다 — 요청자가 402 를 컴포넌트가 고정하는 값으로 확정했다 |

## 사용 토큰

막혀 있던 3건은 `token-guardian` 이 `spacing.tokens.css` 의 "OS 바 실측 치수" 축에 넣었다.
아래가 구현이 실제로 쓰는 유틸리티 전부다.

| Figma 값 | 노드 | 쓰이는 자리 | 토큰 | 유틸리티 |
|---|---|---|---|---|
| `bg/secondary` | 27719:2194 | 배경 (기본) | `--color-bg-secondary` | `bg-bg-secondary` |
| `bg/tertiary` | 27719:2196 | 배경 (onFrameHigh) | `--color-bg-tertiary` | `bg-bg-tertiary` |
| `icon/primary` | 27719:2195 | Home Indicator 색 | `--color-icon-primary` | `bg-icon-primary` |
| `radius/full` | 27719:2195 | Home Indicator 반경 | `--radius-100` | `rounded-100` |
| `21` | 27719:2194 루트 | `padding-top` | `--spacing-home-indicator-inset-top` | `pt-home-indicator-inset-top` |
| `8` | 27719:2194 루트 | `padding-bottom` | `--spacing-8` | `pb-8` |
| `134` | 27719:2195 | Home Indicator 폭 | `--spacing-home-indicator-width` | `w-home-indicator-width` |
| `5` | 27719:2195 | Home Indicator 높이 | `--spacing-home-indicator-height` | `h-home-indicator-height` |
| `402` | 27719:2194 루트 | 폭 (고정) | `--spacing-mobile-frame-width` | `w-mobile-frame-width` |

`134` 는 Figma 의 좌우 패딩이 아니라 인디케이터 **폭**으로 옮겼다 — 위 "노드 구조" 절의 근거
(134 × 3 = 402)대로다. 가운데 정렬은 `flex flex-col items-center` 가 맡는다.

`402` 의 판단은 뒤집혔다. 처음에는 기기 폭(iPhone 16 Pro)에서 온 배치값으로 보고 `w-full` 로
두었으나, 요청자가 402 를 컴포넌트가 고정하는 값으로 확정했다 — "모바일 402 너비용 아이폰 17
해상도 디자인의 컴포넌트라서 그거에 맞게 너비 고정". 부모가 정하는 값이 아니라 루트가 못박는
값이므로 `w-mobile-frame-width` 를 쓴다. 이로써 위 `134 × 3 = 402` 계산이 실제 폭과 맞물린다.

21 · 134 · 5 는 **Figma Variable 이 아니라 레이어 실측값**이다. `get_variable_defs` 로 확인한 결과
이 세 심볼에 잡히는 number 변수는 `radius/full` 하나뿐이고, spacing 가이드 표(0·4·6·8·12·14·16·
20·24·32·40·64·80·100)에도 21·134·5 는 없다. 그래서 `--spacing-hairline` ·
`--spacing-button-height` 와 같은 방식으로 별도 하위 축에 들어갔다.

## 필요하지만 없는 토큰

없음.

## 불명확한 값

없음. 모든 값을 Figma에서 읽었고, 존재하지 않는 variant 조합도 위 규칙으로 결정했다.

## 검증

`npm run typecheck` · `npm run build` 통과. 실행 출력은 작업 반환에 적었다.
