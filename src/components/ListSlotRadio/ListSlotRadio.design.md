# ListSlotRadio — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `ListSlotRadio.tsx`, 스토리는 `ListSlotRadio.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=20-5729> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27683:4431` — section "List" |
| 프레임 | `20:5729` — "ListSlot/Radio", 1037×108 (variant 진열 프레임) |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문):

> Control 계열에서 사용되는 Radio 컴포넌트입니다.
> 단일 선택 상태를 표현하기 위해 사용되며,
> 리스트·카드 구조에서 선택 표현에 활용됩니다.
> 키워드 : 선택, 라디오, 컨트롤, Radio, single-select.

같은 섹션의 `ListSlot/Checkbox`(20:5754) · `List/Checkbox`(60:23751) ·
`List/Radio`(60:24137)는 이 작업의 범위 밖이라 읽지도 쓰지도 않았다. (원칙 3)

## 노드 구조

```
frame 20:5729  "ListSlot/Radio"   1037×108   (variant 진열 프레임)
├─ 20:5730  "size=medium, isChecked=false, isDisabled=false"  24×24
│  └─ 20:5731  "wrapper"   20×20 @ (2, 2)
├─ 20:5742  "size=medium, isChecked=true,  isDisabled=false"  24×24
│  └─ 20:5743  "wrapper"   20×20 @ (2, 2)
├─ 20:5733  "size=medium, isChecked=false, isDisabled=true"   24×24
│  └─ 20:5734  "wrapper"   20×20 @ (4, 2)
└─ 20:5745  "size=medium, isChecked=true,  isDisabled=true"   24×24
   └─ 20:5746  "wrapper"   20×20 @ (4, 2)
```

각 변형은 2단이다 — 24 각형 심볼 프레임과 그 안의 20 각형 `wrapper`.
**두 단을 모두 코드로 옮겼다.** 바깥은 심볼 자체의 크기(= 이 컨트롤이 레이아웃에서
차지하는 자리)이고 안쪽은 실제로 그려지는 글리프다. 진열 프레임의 1037×108 은
데모 치수라 옮기지 않았다 (`StateLayer/Pressed` 의 2415×164 와 같은 성격).

한 단으로 합쳐 20 뷰박스를 24 로 늘리면 링 두께가 1.2배로 함께 늘어나 Figma 와
다른 그림이 된다. 그래서 합치지 않았다.

## variant 축

`get_design_context` 가 반환한 시그니처와 `get_metadata` 의 변형 목록 그대로다.

| 축 | Figma 에 존재하는 값 | prop 으로 만들었나 |
|---|---|---|
| `size` | `medium` **하나뿐** | ✗ 만들지 않았다 |
| `isChecked` | `false` \| `true` | ✓ `isChecked?: boolean` |
| `isDisabled` | `false` \| `true` | ✓ `isDisabled?: boolean` |

### `size` prop 을 만들지 않은 근거

먼저 다른 `size` 값이 Figma 에 있는지 확인했다. `get_metadata(20:5729)` 가 반환한
자식은 4개이고 이름이 전부 `size=medium` 이다. `medium` 외의 값은 **없다.**
축이 셋으로 보이지만 실제 조합은 2×2 = 4개가 전부다.

값이 하나인 축은 분기를 만들지 못한다. `size?: 'medium'` 를 두면 호출부에서
쓸 수 있는 값이 기본값 하나뿐인 prop 이 되고, 아무 동작도 바꾸지 못한 채
공용 API 표면과 문서·스토리 유지비만 남는다. CLAUDE.md 원칙 2 의
"요청받지 않은 설정 옵션·variant·prop 을 추가하지 않는다 — '나중에 필요할 것
같아서' 는 근거가 아니다" 에 정면으로 걸린다.

**Figma 원본 구조 보존은 이 문서가 담당한다.** 축이 셋이라는 사실과 `medium` 이
유일한 값이라는 사실은 위 표에 남아 있으므로, 코드에서 축을 빼도 원본 정보가
사라지지 않는다. 두 번째 `size` 값이 Figma 에 들어오면 그때 축을 추가한다 —
그 시점에 실제 값 2개를 읽을 수 있어 추측 없이 만들 수 있다. (원칙 1)

## 값의 출처

`불명`으로 남은 값은 없다. 추정한 값도 없다.
`get_variable_defs(20:5729)` = `{text/secondary: #747474, text/primary: #1a1a1a, spacing/4: 4, radius/4: 4}`.

| 값 | 출처 | 결론 |
|---|---|---|
| 링 색 (unchecked, 활성) | Figma 변수 `text/secondary` = `#747474`. export SVG `fill="#747474"`, 렌더 픽셀도 `#747474` α255 | 기존 토큰 `--color-text-secondary` → `--neutral-gray-light-600` = `#747474`. **값 일치 → 재사용** |
| 링 색 (그 외 3개 변형) | Figma 변수 `text/primary` = `#1a1a1a`. export SVG `fill="#1A1A1A"`, 렌더 픽셀도 `#1a1a1a` α255 | 기존 토큰 `--color-text-primary` → `--bw-light-black` = `#1a1a1a`. **값 일치 → 재사용** |
| 심볼 크기 | `get_metadata`: 4개 변형 전부 24×24. **Figma 변수 아님, 실측값** | 기존 토큰 `--spacing-24` = `1.5rem` = 24px 와 값 일치 → 재사용. `size-24` |
| 글리프 크기 | `get_metadata`: `wrapper` 4개 전부 20×20. **Figma 변수 아님, 실측값** | 기존 토큰 `--spacing-20` = `1.25rem` = 20px 와 값 일치 → 재사용. `size-20` |
| 글리프 위치 | 활성 2개는 `(2, 2)` — 24 안에 20 을 놓은 사방 균등 여백 = 중앙 | `inline-flex items-center justify-center`. 치수 리터럴이 아니라 정렬이므로 토큰이 필요 없다 |
| 링 두께 | export SVG 가 stroke 없이 fill 만 쓰는 확장된 아웃라인이다 (`d` 안에 흡수됨) | 두께가 코드에 들어갈 자리가 없다. `Icon.tsx` 의 12개 심볼과 같은 성격 |
| 코너 반경 | 원형은 SVG path 가 그린다. 프레임 반경은 그림에 나타나지 않는다 | 반경 유틸리티를 쓰지 않았다. `--radius-full` 은 이 저장소에 없고, **필요하지도 않다** |
| stroke | 4개 변형 모두 0건 | 코드에 들어갈 자리가 없다 |
| effect / shadow | 4개 변형 모두 0건 | 코드에 들어갈 자리가 없다 |
| 타이포 | 없음 (텍스트 레이어 0개) | 해당 없음 |
| pressed / focused 레이어 | 4개 변형 모두 0건 (`get_metadata` 자식은 `wrapper` 하나뿐) | `StateLayerPressed` · `StateLayerFocused` 를 **합성하지 않았다.** Figma 에 없는 것을 넣지 않는다 (원칙 1·2) |

`24` · `20` 은 Figma 변수가 아니라 실측값이라는 점을 명시해 둔다. 기존 spacing
스케일에 같은 값이 이미 있어 새 토큰을 만들지 않았다. (원칙 2)

`get_variable_defs` 가 반환한 `spacing/4` 와 `radius/4` 는 **구현에 쓰지 않았다.**
`spacing/4` 는 비활성 두 변형의 오토레이아웃 패딩이고(아래 "발견 ②"), `radius/4` 는
그림에 나타나지 않는다 (원형은 path 가 그린다). 쓰이지 않는 값을 코드에 넣지 않았다.

## SVG 기하

`Icon.tsx` 와 같은 방식이다. 색만 `currentColor` 로 바꾸고 `d` 는 Figma export
SVG 의 `<g id="wrapper">` path 를 그대로 옮겼다. `d` 는 CLAUDE.md 토큰 규칙의
스코프 제외(SVG 기하) 대상이다.

**`Icon` 컴포넌트를 재사용하지 않은 이유.** 먼저 `IconName` 12개를 확인했다.
이름만 보면 `circle-fill` 이 후보지만, 그 `d` 는 원 안에 점과 기둥이 있는
느낌표/정보 글리프이지 라디오의 링·도넛이 아니다. 나머지 11개도 chevron ·
visibility · success-circle 계열이라 맞는 것이 없다. 또 `Icon` 은 24 뷰박스에
고정돼 있는데 이 글리프는 20 뷰박스다. 그래서 SVG 기하만 인라인했다.
(작업 지시의 "없으면 SVG 기하만 인라인하고 색은 토큰 유틸리티로 준다" 경로)

## 사용한 토큰

새로 추가한 토큰은 **없다.** 전부 기존 토큰 재사용이다.

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--color-text-secondary` | `text-text-secondary` | 변수 `text/secondary` = `#747474` |
| `--color-text-primary` | `text-text-primary` | 변수 `text/primary` = `#1a1a1a` |
| `--spacing-24` | `size-24` | 심볼 프레임 24×24 (실측값) |
| `--spacing-20` | `size-20` | `wrapper` 20×20 (실측값) |

`--color-icon-primary` · `--color-icon-secondary` 는 값이 각각 위 두 색과 같지만
**Figma 가 이 노드에 바인딩한 변수는 `text/*` 다.** 값이 같다는 이유로 다른
네임스페이스를 고르지 않고 바인딩을 그대로 따랐다. (원칙 1)

### 스토리 (`ListSlotRadio.stories.tsx`)

진열용 치수도 토큰으로만 짰다.

| 토큰 | 유틸리티 |
|---|---|
| `--spacing-12` · `--spacing-24` · `--spacing-32` · `--spacing-40` | `gap-12` · `gap-24` · `gap-32` · `p-40` |
| `--color-bg-primary` | `bg-bg-primary` |
| `--color-text-secondary` | `text-text-secondary` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

토큰이 아닌 유틸리티와 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `inline-flex` · `items-center` · `justify-center` | 레이아웃 | 24 안에서 20 을 중앙에 놓는다. Figma 활성 변형의 `(2, 2)` 배치를 치수 리터럴 없이 재현한다 |
| `shrink-0` | 레이아웃 | flex 컨테이너 안에서 24·20 고정 크기가 줄어들지 않게 한다. `Icon.tsx` 와 같은 이유 |
| `aria-hidden` | a11y | SVG 는 순수 장식이다. 아래 a11y 항목 참조 |

## Figma 원본에서 발견한 것 — 구현에 반영하지 않았거나 그대로 옮긴 두 가지

두 항목 모두 **추정이 아니다.** export SVG 와 렌더 픽셀을 함께 읽어 확인한 사실이다.
확인 방법: 변형 4개를 `get_screenshot`(24×24, `contentsOnly`)으로 각각 렌더해
알파 채널 bbox 와 색 히스토그램을 직접 셌다.

### 발견 ① `isDisabled` 에 dim 처리가 없다 — **Figma 그대로 옮겼다**

| 변형 | export SVG fill | 렌더 픽셀 (최다 불투명 색) |
|---|---|---|
| 20:5730 `isChecked=false, isDisabled=false` | `#747474` | `#747474` α255 |
| 20:5742 `isChecked=true,  isDisabled=false` | `#1A1A1A` | `#1a1a1a` α255 |
| 20:5733 `isChecked=false, isDisabled=true` | `#1A1A1A` | `#1a1a1a` α255 |
| 20:5745 `isChecked=true,  isDisabled=true` | `#1A1A1A` | `#1a1a1a` α255 |

읽히는 결과는 두 가지다.

1. `isChecked=true` 에서 `isDisabled` 는 **아무 것도 바꾸지 않는다.** 20:5742 와
   20:5745 는 색·기하가 같다 (남는 차이는 발견 ② 의 2 만큼의 가로 어긋남뿐이다).
2. `isChecked=false` 에서 비활성은 활성보다 **어둡다.** 통상적인 비활성 표현과
   반대 방향이다.

`--color-text-disabled` · `--color-text-disabled-on-light` ·
`--color-icon-disabled-on-light` 이 토큰에 이미 있으므로 그중 하나를 넣으면
"비활성다운" 그림이 나온다. **넣지 않았다.** Figma 가 이 노드에 그 변수를
바인딩하지 않았고, 어느 것을 골라야 하는지는 Figma 에서 읽을 수 없다.
추정한 값은 구현에 넣지 않는다. (원칙 1)

그래서 코드는 위 표를 그대로 옮긴 4칸 매핑이다. 그림이 이상해 보이는 것은
구현의 결함이 아니라 원본의 상태다. **디자인 쪽 확인이 필요한 항목이며,
확인 뒤 Figma 가 바뀌면 4칸 매핑만 고치면 된다.**

### 발견 ② 비활성 두 변형의 글리프가 가로로 2 어긋나 있다 — **옮기지 않았다**

`get_screenshot`(24×24) 알파 bbox:

| 변형 | 알파 bbox |
|---|---|
| 20:5730 활성 unchecked | `(2, 2, 22, 22)` |
| 20:5742 활성 checked | `(2, 2, 22, 22)` |
| 20:5733 비활성 unchecked | `(4, 2, 24, 22)` |
| 20:5745 비활성 checked | `(4, 2, 24, 22)` |

비활성 두 변형은 글리프가 24 프레임의 오른쪽 변에 붙어 있다.
원인은 `get_design_context` 응답에 그대로 남아 있다 — 활성 변형은 절대 배치
(`absolute inset-[8.33%]`, 24 의 8.33% = 2)인데, 비활성 변형은 오토레이아웃
(`flex items-center` + 패딩 `spacing/4`)로 다시 만들어져 있다.
24 프레임에 사방 4 패딩을 주면 콘텐츠 폭이 16 인데 자식이 20 이라 4 만큼
넘치고, 그 결과 글리프가 왼쪽 패딩 4 에서 시작해 오른쪽 변까지 밀린다.

**이것은 디자인 결정이 아니라 내부적으로 모순된 값이다.** 24 프레임 안에
사방 4 패딩과 20 자식은 동시에 성립하지 않는다 (4 + 20 + 4 = 28 > 24).
성립하는 유일한 읽기는 활성 두 변형이 보여주는 사방 2 여백, 즉 중앙 정렬이다.
그래서 네 변형 모두 중앙 정렬로 구현했다.

그대로 옮기면 같은 컨트롤이 비활성으로 바뀌는 순간 가로로 2 만큼 튄다.
이 판단의 근거는 "그게 더 나아 보여서" 가 아니라 위의 산술적 모순이다.
**디자인 쪽 확인이 필요한 항목이다** — Figma 에서 비활성 변형의 오토레이아웃을
풀어 활성과 같은 배치로 맞추는 것이 정정 방향으로 보인다.

### 참고 — checked 글리프의 모양

`checked` 는 링 위에 점을 얹은 통상적인 라디오가 아니다. 바깥 반지름 10,
안쪽 반지름 4 의 **가운데가 비어 있는 도넛** 한 겹이다 (path 하나가 두 원을
반대 방향으로 돌아 nonzero 규칙으로 구멍을 만든다). 가운데는 투명이라
호스트 배경이 그대로 보인다. 이것은 원본 그대로이며 결함으로 보지 않았다 —
`unchecked`(바깥 10 / 안쪽 8.5) 와 같은 방식으로 그려진, 일관된 표현이다.

## 호스트 합성 조건 — a11y 역할 분담

이 컴포넌트는 **상호작용 요소의 시각 표현**이다. 상호작용 자체는 갖지 않는다.

| 담당 | 항목 |
|---|---|
| **이 컴포넌트** | 링·도넛 글리프 렌더, `isChecked`·`isDisabled` 에 따른 색 선택, 24 각형 자리 확보 |
| **호스트** | 역할(`role="radio"` 또는 `<input type="radio">`), `aria-checked`, `aria-disabled`/`disabled`, 접근 가능한 이름(라벨), 포커스 표시, 키보드 조작(화살표 이동·Space 선택), 그룹핑(`role="radiogroup"`/`<fieldset>`), 클릭 타겟 크기 |

SVG 에 `aria-hidden` 을 붙인다. 링 그림에는 텍스트도 라벨도 없고, 전달하려는
상태(선택 여부)는 호스트의 `aria-checked` 또는 네이티브 `<input>` 이 이미
보조기술에 알린다. 붙이지 않으면 같은 정보가 두 번 읽히거나, 라벨 없는
그래픽으로 읽힌다.

`aria-hidden` 은 SVG 에 고정이고 `className` 과 나머지 props 는 바깥 `<span>` 에
전개된다. 호스트가 이 컨트롤 자체에 속성을 얹어야 하면 `<span>` 쪽으로 넘긴다.

`<span>` 을 쓴 이유는 이 컨트롤이 `<button>` · `<label>` 안에 들어가기 때문이다.
둘의 콘텐츠 모델이 phrasing content 라서 `<div>` 는 무효한 마크업이 된다.

**색 대비 주의.** 활성 unchecked 의 링은 `--color-text-secondary`(`#747474`)이고
1.5 두께다. 이 얇은 링은 WCAG 2.1 SC 1.4.11 (Non-text Contrast, 3:1) 의 대상이
될 수 있다. `#747474` 대 `#ffffff` 는 4.6:1 로 기준을 넘지만, 흰 배경이 아닌
곳(`--color-bg-tertiary` 등)에 얹는 판단은 호스트 몫이다. 이 컴포넌트는 배경을
그리지 않는다. 대비를 계산한 것은 위 두 값에 대해서만이고, 다른 배경 조합은
확인하지 않았다.

## Code Connect

`get_design_context`(20:5730 · 20:5742 · 20:5733 · 20:5745) 응답 4개 모두에
Code Connect 매핑이 없었다. 매핑 생성은 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. `ListSlotRadio.tsx` · `ListSlotRadio.stories.tsx` 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음, exit 0) |
| `npm run build` | 통과 (`tsc -b && vite build`, 32 modules, exit 0) |
| 빌드 산출 CSS 확인 | 유틸리티 4개가 의도한 토큰으로 해석됨 (아래) |
| 픽셀 대조 | 4개 변형 전부 일치 (아래) |

빌드 산출 CSS(`dist/assets/index-2AmWsZMV.css`)에서 실제로 확인한 값:

```
.size-20{width:var(--spacing-20);height:var(--spacing-20)}
.size-24{width:var(--spacing-24);height:var(--spacing-24)}
.text-text-primary{color:var(--color-text-primary)}
.text-text-secondary{color:var(--color-text-secondary)}

--spacing-20:1.25rem;   --spacing-24:1.5rem;
--color-text-primary:var(--bw-light-black);        --bw-light-black:#1a1a1a;
--color-text-secondary:var(--neutral-gray-light-600);  --neutral-gray-light-600:#747474;
```

### 픽셀 대조

두 단계로 확인했다.

**① path 전사 검증.** `ListSlotRadio.tsx` 의 `d` 두 개가 Figma export SVG 의
`d` 와 **바이트 단위로 동일**함을 문자열 비교로 확인했다 (253자 · 225자).

**② 래스터 대조.** `d` 를 직접 래스터화해(cubic 96분할 평탄화 + nonzero winding +
8×8 슈퍼샘플링) 빌드 CSS 에서 확인한 색으로 흰 배경에 합성한 뒤,
`get_screenshot`(각 변형 24×24, `contentsOnly`) 결과의 글리프 영역 20×20 과
채널별로 비교했다.

| 변형 | 최대 채널차 | 평균 채널차 | 차 > 16 픽셀 | 완전 불투명 픽셀 (구현 / Figma) |
|---|---|---|---|---|
| `isChecked=false, isDisabled=false` | 15 | 1.10 | 0 / 400 | 28 / 28 |
| `isChecked=true, isDisabled=false` | 22 | 1.59 | 4 / 400 | 224 / 224 |
| `isChecked=false, isDisabled=true` | 22 | 1.79 | 8 / 400 | 28 / 28 |
| `isChecked=true, isDisabled=true` | 22 | 1.59 | 4 / 400 | 224 / 224 |

**일치로 판정한다.** 불투명 픽셀 수가 4개 변형 모두 정확히 같고(링 28,
도넛 224), 남는 차이는 최대 22/255 이며 전부 곡선 경계의 안티에일리어싱
서브픽셀에만 나타난다. 두 래스터라이저(Figma 서버 · 이 검증 스크립트)가
서로 다르므로 경계 픽셀의 완전 일치는 기대할 수 없다.

비활성 두 변형은 Figma 쪽 크롭을 **그쪽 실제 위치인 `x=4`** 에서 잘라 비교했다.
즉 위 표는 색과 기하의 일치를 재고, 위치 차이(발견 ②)는 표에 섞이지 않았다.

브라우저 렌더 스크린샷은 만들지 못했다 — 이 환경에 SVG 를 제대로
래스터화하는 도구가 없었다 (`qlmanage` 는 빈 흰 썸네일을 냈고, Chrome 확장은
연결되지 않았다). 그래서 위와 같이 자체 래스터라이저로 대조했다.
Storybook 에서 눈으로 확인하는 절차는 남아 있다.

`token-exempt:` 주석은 쓰지 않았다. 이 컴포넌트가 추가한 예외는 0건이다.
