# OSBarTopNavigation — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료 (4/4 충족).** 막혀 있던 치수 8건이 `/sync-tokens` 로 `spacing.tokens.css` 에
> 들어와 `OSBarTopNavigation.tsx` · `.stories.tsx` 를 내렸다.
> 매핑은 아래 [사용 토큰](#사용-토큰) 표가 최종본이다.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27719-2395&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27719:2395` — section "OSBarNavigation" |
| 컴포넌트 세트 | `27719:2204` — "OSBar/TopNavigation" |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문): *"iOS/Android의 상단 상태 바를 구현하는 OS 컴포넌트입니다. 시간, 신호,
배터리 등 시스템 정보와 제목을 표시하며, 모바일 화면의 상단 영역을 구성하는 데 활용됩니다.
키워드 : OS, Top Navigation, 상단 바, 상태바, 시스템 정보."*

> 설명에는 "제목을 표시" 가 있으나 **세 variant 어디에도 제목 노드가 없다.** 실제 트리는 시간과
> 신호·와이파이·배터리뿐이다. 설명에 끌려 title prop 을 만들지 않는다 (원칙 2).

## 노드 구조

```
COMPONENT_SET 27719:2204  "OSBar/TopNavigation"
├─ 27719:2205  transparent=false, onFrameHigh=false   402×62
├─ 27719:2224  transparent=false, onFrameHigh=true    402×62
└─ 27719:2243  transparent=true,  onFrameHigh=false   402×62

27719:2205 내부 (세 variant 동일):
└─ FRAME 27719:2206  "Wrapper"      y=10   402×44
   └─ FRAME 27719:2207  "Status Bar"       402×44
      └─ FRAME 27719:2208  "Content"       402×44
         ├─ FRAME 27719:2209  "Start"  x=0    87.33×44   (absolute, left/top/bottom=0)
         │  └─ FRAME 27719:2210  "Time"  x=27 y=15.71  33.328×12.576
         └─ FRAME 27719:2215  "End"    x=278  124×44    (absolute, right/top/bottom=0)
            └─ FRAME 27719:2216  "Content"  x=20 y=13.5  84×17
               └─ FRAME 27719:2217  "Levels"  y=3  99.67×13
                  ├─ VECTOR 27719:2218  "Cellular Connection"  19.20×12.23
                  ├─ VECTOR 27719:2219  "Wifi"                 17.14×12.33
                  └─ FRAME  27719:2220  "Battery"              27.33×13
```

레이아웃(Figma 원값): 루트 `padding: 10 0 8 0` → `10 + 44 + 8 = 62`.
`Start` 는 `padding: 13 27`, `End` 는 `padding: 14 20`, `End > Content` 는 `padding: 3 0 1 0`.

`Levels`(99.67) 가 부모 `Content`(84) 보다 넓다. 자식 3개의 실제 우측 끝은 `56.34 + 27.33 = 83.67 ≈ 84`
이므로 **99.67 은 내용 경계가 아니라 프레임에 남아 있는 선언 폭**이다. 구현에서는 84 쪽을 따라야 한다.

`get_design_context`(27719:2204)가 세 variant를 한 컴포넌트로 합쳐 내보냈고,
**차이가 나는 것은 루트의 배경 하나뿐**이다. 나머지 클래스는 세 variant가 전부 같다.

## variant 축

Figma 변형 축은 `transparent`, `onFrameHigh` 두 개의 boolean이다. 조합 3개만 존재한다.

| transparent | onFrameHigh | 노드 | 배경 (Figma 변수) |
|---|---|---|---|
| false | false | 27719:2205 | `bg/secondary` = `#fcfcfc` |
| false | true | 27719:2224 | `bg/tertiary` = `#f2f2f2` |
| true | false | 27719:2243 | 없음 (fill 0건) |
| true | **true** | **Figma에 없음** | **아래 참조 — 결정 가능** |

### 없는 조합 (transparent=true, onFrameHigh=true) — 발명하지 않고 규칙으로 결정한다

BottomNavigation 과 같은 규칙이 같은 근거로 성립한다.

1. `onFrameHigh` 가 바꾸는 것은 **배경색 하나뿐**이다 (`get_design_context` 가 내보낸 두 variant의
   차이가 `bg/secondary` ↔ `bg/tertiary` 뿐).
2. `transparent=true` 는 **배경 자체를 제거**한다 — `get_variable_defs`(27719:2243) 결과가
   `{icon/primary, border/strong, spacing/20, spacing/8}` 로, 기본 variant(27719:2205)의 결과에서
   `bg/secondary` 만 빠진 형태다.

⇒ **(transparent=true, onFrameHigh=true) = 배경 없음.** 추정이 아니라 두 규칙의 귀결이다.

## 값의 출처

`Figma 변수` / `기존 토큰` / `불명` 3분류. **`불명` 은 0건이다** — 모든 값을 Figma에서 읽었다.
문제는 출처가 아니라, 읽은 값 중 8건에 대응 토큰이 없다는 것이다.

### 토큰이 있는 값 — 재사용

| 값 | Figma 출처 | 변수 바인딩 | 기존 토큰 | 유틸리티 |
|---|---|---|---|---|
| 배경 (기본) | `bg/secondary` `#fcfcfc` | 있음 | `--color-bg-secondary` (값 일치) | `bg-bg-secondary` |
| 배경 (onFrameHigh) | `bg/tertiary` `#f2f2f2` | 있음 | `--color-bg-tertiary` (값 일치) | `bg-bg-tertiary` |
| 글리프 fill | `icon/primary` `#1a1a1a` | 있음 | `--color-icon-primary` (값 일치) | `text-icon-primary` + `fill="currentColor"` (Icon.tsx 방식) |
| 글리프 stroke | `border/strong` `#1a1a1a` | 있음 | `--color-border-strong` (값 일치) | 배터리 외곽선. SVG 안에서 쓰인다 |
| 루트 `padding-bottom 8` | `spacing/8` = `8` | **있음** | `--spacing-8` = `0.5rem` (값 일치) | `pb-8` |
| `End` `padding-x 20` | `spacing/20` = `20` | **있음** | `--spacing-20` = `1.25rem` (값 일치) | `px-20` |
| `End` `padding-y 14` | 레이어 실측값 | 없음 (raw) | `--spacing-14` = `0.875rem` (값 일치) | `py-14` |
| `End > Content` `padding-bottom 1` | 레이어 실측값 | 없음 (raw) | `--spacing-hairline` = `0.0625rem` (값 일치) | `pb-hairline` |

### 막혀 있던 8건 — 채워졌다

아래 8건은 전부 Figma에서 정확히 읽은 값이고 대응 토큰이 없었다. `token-guardian` 이
`spacing.tokens.css` 의 "OS 바 실측 치수" 축에 넣어 해소됐다.

## 사용 토큰

구현이 실제로 쓰는 유틸리티 전부다.

| Figma 값 | 노드 | 쓰이는 자리 | 토큰 | 유틸리티 |
|---|---|---|---|---|
| `bg/secondary` | 27719:2205 | 배경 (기본) | `--color-bg-secondary` | `bg-bg-secondary` |
| `bg/tertiary` | 27719:2224 | 배경 (onFrameHigh) | `--color-bg-tertiary` | `bg-bg-tertiary` |
| `icon/primary` | 27719:2210 · 2217 | 글리프 fill | `--color-icon-primary` | `text-icon-primary` + `fill="currentColor"` |
| `border/strong` | 27719:2220 Battery | 배터리 외곽선 stroke | `--color-border-strong` | `stroke-border-strong` |
| `10` | 27719:2205 루트 | `padding-top` | `--spacing-statusbar-inset-top` | `pt-statusbar-inset-top` |
| `8` | 27719:2205 루트 | `padding-bottom` | `--spacing-8` | `pb-8` |
| `44` | 27719:2208 Content | `height` | `--spacing-statusbar-height` | `h-statusbar-height` |
| `27` | 27719:2209 Start | `padding-x` | `--spacing-statusbar-clock-inset-x` | `px-statusbar-clock-inset-x` |
| `13` | 27719:2209 Start | `padding-y` | `--spacing-statusbar-clock-inset-y` | `py-statusbar-clock-inset-y` |
| `33.32763671875` | 27719:2210 Time | 글리프 폭 | `--spacing-statusbar-clock-width` | `w-statusbar-clock-width` |
| `12.57568359375` | 27719:2210 Time | 글리프 높이 | `--spacing-statusbar-clock-height` | `h-statusbar-clock-height` |
| `14` | 27719:2215 End | `padding-y` | `--spacing-14` | `py-14` |
| `20` | 27719:2215 End | `padding-x` | `--spacing-20` | `px-20` |
| `3` | 27719:2216 End>Content | `padding-top` | `--spacing-statusbar-indicators-inset-top` | `pt-statusbar-indicators-inset-top` |
| `1` | 27719:2216 End>Content | `padding-bottom` | `--spacing-hairline` | `pb-hairline` |
| `84` | 27719:2216 End>Content | `width` | `--spacing-statusbar-indicators-width` | `w-statusbar-indicators-width` |
| `13` | 27719:2217 Levels | `height` | `--spacing-statusbar-indicators-height` | `h-statusbar-indicators-height` |
| `402` | 27719:2205 루트 | 폭 (고정) | `--spacing-mobile-frame-width` = `25.125rem` | `w-mobile-frame-width` |

`27` · `13` 은 값이 겹치는 자리가 있지만 축이 다르다 — `statusbar-clock-inset-y`(시계 영역 상하
패딩)와 `statusbar-indicators-height`(글리프 묶음 높이)는 합치지 않았다. 자리에 맞는 쪽을 쓴다.

여덟 값 모두 **Figma Variable 이 아니라 레이어 실측값**이다. `get_variable_defs`(27719:2205)에 잡히는
number 변수는 `spacing/20` · `spacing/8` 뿐이고, spacing 가이드 표(0·4·6·8·12·14·16·20·24·32·40·
64·80·100)에도 10·44·27·13·3·84 는 없다. 그래서 `--spacing-hairline` ·
`--spacing-button-height` 와 같은 방식으로 별도 하위 축에 들어갔다.

### `Start` · `End` 의 절대 배치를 flex 로 옮긴 근거

Figma 에서 두 프레임은 absolute(left/right · top/bottom=0)라 44 높이를 채우고, 그 안에서 내용이
가운데 정렬된다. `flex justify-between` + 자식의 `items-center` 로 옮기면 선언된 패딩과 함께
Figma 좌표가 그대로 나온다.

| | 계산 | Figma 실측 |
|---|---|---|
| Start > Time `y` | 13 + (44 − 26 − 12.576) / 2 = 15.71 | 15.71 |
| End > Content `y` | 14 + (44 − 28 − 17) / 2 = 13.5 | 13.5 |

`Wrapper` · `Status Bar` · `Content` 세 프레임은 전부 402×44 이고 시각 값이 하나도 없어 한 요소로
접었다 (Divider 가 빈 바깥 프레임을 접은 것과 같은 이유, 원칙 2).

### 글리프 크기는 소수점이다 — 토큰 축을 정할 때 함께 판단해야 한다

`33.32763671875` · `12.57568359375` · `99.66970825195312` 는 OS 상태바 목업의 벡터 바운딩 박스에서
온 값이라 디자인 시스템 스케일과 성격이 다르다. spacing 스케일에 끼워 넣으면 그 축의 전제가 깨진다.
Icon 컴포넌트가 24 고정 크기를 `--spacing-24` → `size-24` 로 푼 것과 달리, 이 두 글리프는
정사각형도 아니고 대응 값도 없다.

### 에셋

`get_design_context` 가 Time · Levels 를 원격 SVG(`https://www.figma.com/api/mcp/asset/...`)로 내보낸다.
이 URL 은 약 7일 후 만료되므로 커밋할 코드에 그대로 넣을 수 없다. 이 저장소의 선례는 `Icon.tsx` 로,
Figma export SVG 의 `path` 를 인라인하고 `fill="currentColor"` 로 바꿔 색만 토큰이 결정하게 한다.
`d` 값은 CLAUDE.md 토큰 규칙의 스코프 제외(SVG 기하) 대상이라 그대로 들어가도 된다.

구현은 그대로 따랐다. `download_assets(defaultFormat: svg)` 로 받은 export SVG 에서 `<g id="Time">`
(27719:2210) 과 `<g id="Levels">`(27719:2217) 를 뽑아 인라인했고, fill `#1a1a1a` → `currentColor`,
배터리 외곽선 stroke → `stroke-border-strong` 으로 바꿨다. `<svg>` 크기는 위 표의 토큰이 준다.

`Levels` 의 `viewBox` 폭은 **84** 다. 선언 폭 99.67 은 잔여값이고 자식의 우측 끝이 83.67 이므로,
실제 경계인 부모 `Content`(27719:2216)의 84 를 따랐다.

배터리 글리프의 `opacity` 0.35(Border) · 0.4(Cap) 는 Figma 원본이 갖고 있는 값이다. 추정이 아니라
읽은 값이지만 이 저장소에 opacity 축 토큰이 없어 에셋의 일부로 SVG 속성에 남겼다.
opacity 토큰이 필요해지면 `/sync-tokens` 로 축을 먼저 만든 뒤 옮긴다.

## 불명확한 값

없음. 모든 값을 Figma에서 읽었고, 존재하지 않는 variant 조합도 위 규칙으로 결정했다.

`width 402` 의 판단은 뒤집혔다. 처음에는 기기 폭(iPhone 16 Pro)에서 온 배치값으로 보고
"Divider의 360과 같은 성격이라 `w-full` 로 옮기며 치수 토큰이 필요 없다" 고 적었으나,
요청자가 402 를 컴포넌트가 고정하는 값으로 확정했다 — "모바일 402 너비용 아이폰 17 해상도
디자인의 컴포넌트라서 그거에 맞게 너비 고정". 따라서 부모가 정하는 값이 아니라 루트가 못박는
값이고, `--spacing-mobile-frame-width` (`w-mobile-frame-width`) 를 쓴다.
루트 밖의 `w-full` (상태바 행 · Levels SVG) 은 부모를 채우는 값이라 그대로다.

## 필요하지만 없는 토큰

없음. (opacity 0.35 · 0.4 는 위 "에셋" 절 참조 — 토큰 축이 없어 SVG 속성으로 남긴 유일한 값이다.)

## 검증

`npm run typecheck` · `npm run build` 통과. 실행 출력은 작업 반환에 적었다.
