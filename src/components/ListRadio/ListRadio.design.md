# ListRadio — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `ListRadio.tsx`, 스토리는 `ListRadio.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=60-24137> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27683:4431` — section "List" |
| 프레임 | `60:24137` — "List/Radio", 1032×190 (variant 진열 프레임) |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문):

> Content 계열에서 여러 정보를 항목 단위로 정렬하여 표현하기 위한 컴포넌트입니다.
> 텍스트, 아이콘, 썸네일 등 다양한 요소를 포함한 정보를 목록 형태로 구성할 때 사용되며,
> 메뉴, 설정, 콘텐츠 목록 등 정보 탐색 구조에서 활용됩니다.
> 키워드 : 리스트, 정보 목록, 리스트 항목, List

같은 섹션의 `ListSlot/Checkbox`(20:5754) · `List/Checkbox`(60:23751)는 이 작업의
범위 밖이라 읽지도 쓰지도 않았다. `ListSlot/Radio`(20:5729)는 **재사용 대상**이라
읽었고 수정하지 않았다. (원칙 3)

## 노드 구조

```
frame 60:24137  "List/Radio"   1032×190   (variant 진열 프레임)
├─ symbol 60:24172  "isChecked=false"   362×72
│  ├─ instance 27742:6599  "Divider"                       360×1  @ (1, 71)
│  └─ frame    60:24174    "content"                       362×24 @ (0, 24)
│     ├─ frame    60:24175  "slot-start"                    24×24 @ (0, 0)
│     │  └─ instance 60:24176  "ListSlot/Radio"             24×24 @ (0, 0)
│     ├─ instance 27737:3510 "Text Set Title"              282×24 @ (40, 0)
│     └─ frame    60:24178  "slot-end"                      24×24 @ (338, 0)
│        └─ instance 60:24179 "Icon/chevronRight-small-line" 24×24 @ (0, 0)
└─ symbol 60:24188  "isChecked=true"    362×72
   └─ (60:24190 · 60:24191 · 60:24192 · 27737:3609 · 60:24194 · 60:24195 — 위와 동형)
```

**자식 4개가 전부 인스턴스다.** 이것이 이 컴포넌트의 성격을 결정한다 —
새로 그릴 것이 없고, 기존 컴포넌트를 조립하는 일이 전부다.

진열 프레임의 1032×190 은 데모 치수라 옮기지 않았다
(`ListSlot/Radio` 의 1037×108 · `StateLayer/Pressed` 의 2415×164 와 같은 성격).

## variant 축

| 축 | Figma 에 존재하는 값 | prop 으로 만들었나 |
|---|---|---|
| `isChecked` | `false` (60:24172) \| `true` (60:24188) | ✓ `isChecked?: boolean` |

세트의 변형은 2개가 전부다 (`get_metadata` 60:24137). 원자 `ListSlot/Radio` 에
있는 `isDisabled` 축이 이 세트에는 **없다.** 없는 축을 만들지 않았다 —
원자 인스턴스에도 `isDisabled` 를 넘기지 않는다 (두 변형 모두 `isDisabled=false`).

## 재사용한 컴포넌트 — 근거

`get_design_context`(60:24172 · 60:24188) 가 반환한 구조를 그대로 옮긴 것이다.
4개 모두 **Figma 가 인스턴스로 선언**하고 있어 판단의 여지가 없었다.

| Figma 인스턴스 | 재사용한 기존 컴포넌트 | 근거 |
|---|---|---|
| `ListSlot/Radio` (60:24176 · 60:24192) | `ListSlotRadio` | `get_metadata` 가 `<instance name="ListSlot/Radio">` 로 반환. `get_design_context` 도 별도 `ListSlotRadio` 함수로 분리해 내보냈고 그 안이 원자와 동일한 `size-[24px]` + `inset-[8.33%]` wrapper 다 (= 원자 노드 20:5730 · 20:5742). **라디오 글리프 SVG 를 다시 그리지 않았다.** `isChecked` 만 그대로 넘긴다 |
| `Text Set Title` (27737:3510 · 27737:3609) | `TextSetTitle` `size="sm"` | `get_design_context`(60:24188) 가 `<TextSetTitle description={false} />` 로 내보내고, 그 함수 본문의 기본 className 이 원자 노드 **27683:4428 = `size=sm`** 의 것이다 (`gap-[var(--spacing/6)]` · `min-h-[24px]` · `font/title/small-strong` 18px/1.3, wrapper `gap-[var(--spacing/4)]`). 우리 `TextSetTitle` 의 `sm` 이 `gap-6 min-h-24` + `font-title-small-strong` 로 정확히 같다 |
| `Icon/chevronRight-small-line` (60:24179 · 60:24195) | `Icon` `name="chevronRight-small"` | `Icon` 의 `IconName` 은 Figma 이름에서 `Icon/` 접두사와 `-line` 접미사를 뗀 값이다 → `chevronRight-small`. 기하도 일치한다: Figma 렌더(24×24, `contentsOnly`)의 알파 bbox 가 `(9, 6, 16, 18)` 이고 `get_design_context` 의 `left-[37.5%] right-[33.33%] top-1/4 bottom-1/4` (= x 9…16, y 6…18) 와 같으며, `Icon.tsx` 의 `chevronRight-small` path bbox 도 같다 |
| `Divider` (27742:6599 · 27742:6610) | `Divider` | `get_design_context` 가 내보낸 인스턴스 내부가 `bg-[var(--border/primary)] h-px w-full` 이고 자식 노드 id 가 `I27742:6599;20:5646` — 즉 우리 `Divider` 가 구현한 그 사각형(20:5646)이다 |

`StateLayerPressed` · `StateLayerFocused` 는 **합성하지 않았다.** 두 변형의
`get_metadata` 자식이 `Divider` + `content` 둘뿐이고 `get_design_context` 에도
상태 레이어 노드가 없다. Figma 에 없는 것을 넣지 않는다. (원칙 1·2)
(원자 `ListSlot/Radio` 에서도 0건이었고, 행에서도 0건이다.)

### `TextSetTitle` 의 `description` 을 켜지 않은 이유

`get_design_context`(60:24188) 가 `description={false}` 로 명시한다.
`isChecked=false` 쪽(60:24172)은 인스턴스가 아직 펼쳐진 형태로 나오는데 거기서도
`[Text Set Description] Small` 프레임이 **자식 없이 비어** 있다. 두 변형 모두
보조 텍스트가 없다. 우리 `TextSetTitle` 은 `description` 을 넘기지 않으면
그 단을 렌더하지 않으므로 prop 을 넘기지 않는 것으로 재현된다.

행 높이가 이것에 달려 있다: `content` 24 + 상하 `spacing/24` = **72** (= Figma 실측 72).
보조 텍스트를 켜면 이 값이 깨진다.

## 접은 단 — `slot-start` · `slot-end`

Figma `content`(60:24174) 는 인스턴스를 바로 담지 않고 `slot-start`(60:24175) ·
`slot-end`(60:24178) 프레임을 한 단 더 둔다. **두 프레임을 접었다.**

근거는 두 프레임이 시각 값을 하나도 갖지 않는다는 것이다:

| 항목 | slot-start (60:24175) | slot-end (60:24178) |
|---|---|---|
| 크기 | 24×24 | 24×24 |
| 담은 인스턴스 크기 | 24×24 | 24×24 |
| 패딩 | 없음 (`get_design_context` 에 패딩 클래스 없음) | 없음 |
| 배경 · 테두리 · 반경 | 없음 | 없음 |
| 방출된 클래스 | `flex flex-row items-center self-stretch` → 안쪽 `flex h-full items-center` | 동일 |

프레임과 자식이 같은 24×24 이고 패딩이 0 이므로 이 단을 지워도 렌더 결과가
바뀌지 않는다. 방출된 클래스도 부모 `content` 의 `items-center` 를 반복하는 정렬뿐이다.
`Divider`(바깥 COMPONENT) · `TextSetTitle`(`wrapper` 3단 → 2단) 에서 이미 내린 것과
같은 판단이다 — **시각 값을 갖지 않는 중간 래퍼는 만들지 않는다.** (원칙 2)

`content`(60:24174) 단은 접지 않았다. 접을 수 없는 이유가 둘이다:

1. 루트의 상하 패딩 `spacing/24` 와 별개로 자기 `gap-16` 을 갖는다.
2. 절대 배치된 `Divider` 가 이 단 **밖**에 있어야 한다. 안에 넣으면 `gap-16` 의
   flex 자식이 되어 행 높이 72 가 깨진다.

## 값의 출처

`불명`으로 남은 값은 **0건**이다. 추정한 값도 **0건**이다.
`get_variable_defs(60:24137)` =
`{border/primary: #ebebeb, text/secondary: #747474, text/primary: #1a1a1a,`
`family-font: Pretendard, font-size/title-small: 18, font/title/small-strong: …,`
`spacing/4: 4, spacing/6: 6, spacing/16: 16, spacing/24: 24}`

### 이 파일이 직접 쓰는 값 — 2개

| 값 | 출처 | 결론 |
|---|---|---|
| 행 상하 패딩 | Figma 변수 `spacing/24` = `24`. `get_design_context` 루트가 `py-[var(--spacing/24,24px)]` | 기존 토큰 `--spacing-24` = `1.5rem` = 24px. **값 일치 → 재사용.** `py-24` |
| `content` 내부 간격 | Figma 변수 `spacing/16` = `16`. `get_design_context` `content` 가 `gap-[var(--spacing/16,16px)]`. 실측으로도 확인된다 — 라디오 24 끝(24) → 텍스트 시작(40) = 16, 텍스트 끝(322) → chevron 시작(338) = 16 | 기존 토큰 `--spacing-16` = `1rem` = 16px. **값 일치 → 재사용.** `gap-16` |

### 재사용한 컴포넌트가 자기 토큰으로 그리는 값

이 파일에는 들어오지 않는다. 대조만 적는다.

| 값 | Figma 원값 | 그리는 컴포넌트 → 토큰 원값 |
|---|---|---|
| 구분선 색 | 변수 `border/primary` = `#ebebeb`. 렌더 픽셀도 `#ebebeb` (아래 픽셀 대조) | `Divider` → `--color-border-primary` → `--neutral-gray-light-100` = `#ebebeb` |
| 구분선 두께 | 1 (인스턴스 360×1, `h-px`) | `Divider` → `--spacing-hairline` = `0.0625rem` = 1px |
| 제목 타이포 | 변수 `font/title/small-strong` = Pretendard Bold / `font-size/title-small` 18 / lineHeight 1.3 / letterSpacing −2% | `TextSetTitle` `sm` → `@utility font-title-small-strong` |
| 제목 색 | 변수 `text/primary` = `#1a1a1a` | `TextSetTitle` → `--color-text-primary` → `--bw-light-black` = `#1a1a1a` |
| 텍스트 세트 내부 간격 | 변수 `spacing/6` · `spacing/4` | `TextSetTitle` `sm` → `--spacing-6` (`spacing/4` 단은 자식 1개라 무효 — `TextSetTitle.tsx` 참조) |
| 텍스트 세트 최소 높이 | 24 (`min-h-[24px]`) | `TextSetTitle` `sm` → `--spacing-24` (`min-h-24`) |
| 라디오 링 색 | 변수 `text/secondary` = `#747474` (unchecked) · `text/primary` = `#1a1a1a` (checked) | `ListSlotRadio` → `--color-text-secondary` · `--color-text-primary` |
| 라디오 크기 | 심볼 24 · `wrapper` 20 (실측값) | `ListSlotRadio` → `--spacing-24` · `--spacing-20` |
| chevron 크기 | 24×24 | `Icon` → `--spacing-24` (`size-24`) |
| chevron 색 | **Figma 변수 바인딩 없음.** 렌더 픽셀 `#1a1a1a` α255 | `Icon` 기본 `color="primary"` → `--color-icon-primary` → `--bw-light-black` = `#1a1a1a`. 아래 "판단이 필요했던 값" 참조 |

### 값이 있지만 쓰지 않은 것

| Figma 값 | 왜 안 썼나 |
|---|---|
| 변수 `text/secondary` = `#747474` | 이 프레임에서 이 변수를 쓰는 곳은 (a) `ListSlotRadio` 의 unchecked 링 — 원자가 자기 토큰으로 그린다, (b) `TextSetTitle` 의 보조 텍스트 — 두 변형 모두 꺼져 있어 렌더되지 않는다. 이 파일에 들어올 자리가 없다 |
| 변수 `spacing/4` = `4` | `TextSetTitle` 안쪽 `wrapper` 의 gap 이고, 그 단은 자식이 1개라 렌더에 영향이 없다 (`TextSetTitle.tsx` 의 접기 근거와 동일). 쓰이지 않는 값을 코드에 넣지 않았다 |
| 변형 폭 `362` | 아래 "폭 362" 참조 — `w-full` 로 옮겼다 |

### 판단이 필요했던 값 1건 — chevron 색의 토큰 네임스페이스

**추정한 값이 아니다.** 색 값 자체는 측정했다 — `get_screenshot`(60:24179, 24×24,
`contentsOnly`) 의 불투명 픽셀이 전부 `#1a1a1a` 였다.
판단이 필요했던 것은 **어느 네임스페이스의 토큰으로 부를지**다.

`get_variable_defs(60:24179)` = `{}` — 이 아이콘 인스턴스에는 변수 바인딩이 없다.
프레임 전체(`60:24137`) 결과에도 `icon/*` 이 하나도 없다. 즉 Figma 가 이 노드에
바인딩한 변수가 **없어서 따를 바인딩이 없다.**

`#1a1a1a` 를 값으로 갖는 semantic 토큰은 둘이다 — `--color-text-primary` 와
`--color-icon-primary` (둘 다 `--bw-light-black` 을 가리킨다). `--color-icon-primary`
를 골랐다. 근거는 두 가지다:

1. 이 노드는 아이콘이고, `--color-icon-*` 는 `colors.tokens.css` 가 아이콘 축으로
   선언한 네임스페이스다.
2. 재사용하는 `Icon` 컴포넌트의 `color` 축이 `--color-icon-*` 8개와 1:1 대응한다 —
   `text/*` 를 넘길 통로가 애초에 없다.

`ListSlotRadio` 에서 "값이 같다는 이유로 다른 네임스페이스를 고르지 않고 바인딩을
그대로 따랐다" 고 한 것과 **모순되지 않는다.** 그쪽은 Figma 가 `text/*` 를 바인딩한
경우이고, 여기는 바인딩이 아예 없는 경우다. 따를 바인딩이 있으면 따르고, 없으면
요소의 축을 따른다. Figma 에 `icon/*` 바인딩이 생기면 그때 다시 맞춘다.

## 폭 362 와 구분선의 1px 인셋

### 폭 362 → `w-full`

Figma 변형은 폭 362 고정이고 `content` 도 362(x=0)다. 좌우 패딩은 없다 —
`get_design_context` 루트가 `py-…` 만 방출하고 `px-…` 는 없으며, 실측으로도
라디오 24 박스가 x=0 에서 시작한다.

**362 를 코드에 옮기지 않았다.** 이 값은 컴포넌트 속성이 아니라 이 파일의 모바일
페이지 폭에서 파생된 배치값으로 읽힌다:

```
402 (--spacing-mobile-frame-width, 모바일 프레임 폭)
− 20 × 2 (--spacing-20, spacing.tokens.css 가 "페이지 좌우 마진" 으로 적은 값)
= 362  ← 정확히 일치
```

같은 파일의 `Divider`(360×1) · `TextSetTitle`(360) 에서 이미 같은 판정을 내리고
`w-full` 로 옮겼다. 그래서 여기서도 `w-full` 이고, 폭 362 의 재현은
`ListRadio.stories.tsx` 의 진열 프레임(`w-mobile-frame-width` + `px-20`)이 담당한다.

### 구분선의 1px 인셋 — 옮기지 않았다

`Divider` 인스턴스는 362 안에서 `x=1, width=360` 이다.
`get_design_context` 도 `absolute bottom-0 left-px right-px` 로 방출한다.
픽셀로도 확인했다 (진열 프레임 렌더, 아래 픽셀 대조): 왼쪽 변형의 심볼은
x 55…416 (362)이고 구분선은 x 56…415 (**360**)다.

**이 1px 인셋을 옮기지 않았다.** 이유는 두 가지다.

1. 폭을 고정하지 않기로 했으므로(위) 들여넣을 여유 2 가 존재하지 않는다.
   `w-full` 인 행에서 `left-px right-px` 는 "행 폭 − 2" 라는 다른 의미가 된다.
2. 그 1 은 이 시스템의 어느 축에도 없는 값이다. `--spacing-hairline`(1px)이 있지만
   그 토큰은 자기 주석에서 **선 두께 축**임을 선언하고 이름으로 오용을 막고 있다 —
   가로 인셋으로 쓰면 그 선언과 어긋난다.

읽히는 사실은 이렇다: 이 파일의 `Divider` 컴포넌트 폭은 360 이고, 행은 362 다.
인스턴스를 좌우 1 씩 들여넣으면 정확히 360 이 된다. 즉 **행 폭이 2 늘어난 뒤
구분선만 원래 360 에 남아 있는 상태**로 보인다. 어느 쪽이 정정 방향인지는
Figma 에서 읽을 수 없다.

**디자인 쪽 확인이 필요한 항목이다** — 구분선이 행 폭을 채워야 하는지(`inset-x-0`,
현재 구현) 아니면 좌우 1 을 비워야 하는지. 확인 뒤 Figma 가 바뀌면 `Divider` 의
className 한 줄만 고치면 된다.

### `Divider` 를 절대 배치한 것은 Figma 그대로다

원본도 `absolute bottom: 0` 이다 (`get_metadata`: `y=71`, 심볼 높이 72).
흐름에 두면 hairline 만큼 행이 높아져 72 → 73 이 된다.
`content` 밖·루트 직계에 두는 것도 원본의 부모 관계 그대로다.

## 사용한 토큰

새로 추가한 토큰은 **없다.** 필요하지만 없는 토큰도 **없다.**
전부 기존 토큰 재사용이다.

### `ListRadio.tsx` 가 직접 쓰는 것

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--spacing-24` | `py-24` | 변수 `spacing/24` = `24` |
| `--spacing-16` | `gap-16` | 변수 `spacing/16` = `16` |
| `--spacing-0` | `min-w-0` · `inset-x-0` | 0 (Figma 값 아님 — 레이아웃 기준값. 아래 참조) |

재사용한 컴포넌트가 끌어오는 토큰: `--color-border-primary` · `--spacing-hairline`
(`Divider`) / `--color-text-primary` · `--spacing-6` · `--spacing-24` ·
`font-title-small-strong` (`TextSetTitle` `sm`) / `--color-text-primary` ·
`--color-text-secondary` · `--spacing-24` · `--spacing-20` (`ListSlotRadio`) /
`--color-icon-primary` · `--spacing-24` (`Icon`).

토큰이 아닌 유틸리티와 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `relative` · `absolute` · `bottom-0` | 레이아웃 | Figma 의 `Divider` 절대 배치(`bottom: 0`)를 그대로 옮긴다 |
| `inset-x-0` | 레이아웃 | 구분선이 행 폭을 채운다. 값은 `--spacing-0` 으로 해석된다 (빌드 CSS 확인) |
| `flex` · `items-center` | 레이아웃 | Figma `content-stretch flex items-center` 그대로 |
| `flex-1` | 레이아웃 | Figma `flex-[1_0_0]` — 텍스트 세트가 남는 폭을 채운다 |
| `min-w-0` | 레이아웃 | Figma `min-w-px` 자리다. flex 자식이 콘텐츠 최소폭 밑으로 줄어들 수 있게 하는 것이 목적이고, Tailwind 의 `px`(1px 고정)는 토큰에서 내려오지 않으므로 같은 목적을 토큰 값 0 으로 쓴다 |
| `w-full` | 레이아웃 | 폭 362 를 고정하지 않는다 (위 "폭 362" 참조) |

### 스토리 (`ListRadio.stories.tsx`)

진열용 치수도 토큰으로만 짰다.

| 토큰 | 유틸리티 | 용도 |
|---|---|---|
| `--spacing-mobile-frame-width` | `w-mobile-frame-width` | 402 — 모바일 프레임 폭 |
| `--spacing-20` | `px-20` | 페이지 좌우 마진. 402 − 20×2 = **362** = Figma 변형 폭 |
| `--color-bg-primary` | `bg-bg-primary` | 진열 배경 |

## 만들지 않은 prop — Figma component property 3개

`get_design_context`(60:24172 · 60:24188) 가 반환한 `ListRadioProps` 시그니처는
`isChecked` 외에 셋을 더 갖는다:

| Figma component property | 기본값 | 무엇을 켜고 끄나 |
|---|---|---|
| `hasIconStart` | `true` | `slot-start`(60:24175) — 라디오 자리 |
| `hasIconEnd` | `true` | `slot-end`(60:24178) — chevron 자리 |
| `iconEnd` (instance swap) | `null` | `slot-end` 안의 아이콘 교체 |

**셋 다 props 로 만들지 않았다.** 근거:

1. 요청 범위가 `isChecked` 축 하나로 못박혀 있고, 요청받지 않은 prop·variant·추상화를
   추가하지 않는다. (원칙 2)
2. 범위 안의 변형 2개에서 관측되는 값이 하나뿐이다 — 두 변형 모두 두 슬롯이 켜져
   있고 `iconEnd` 는 기본 chevron 이다. 값이 하나인 축은 분기를 만들지 못한다
   (`ListSlotRadio` 의 `size` 축을 만들지 않은 것과 같은 판정).

**단, 저장소에 반대 방향 선례가 있다.** `Header`(27657:3123)는 component property
`hasSlotStart` · `hasSlotEnd` 를 props 로 열었다. 거기는 Figma 설명이 슬롯 사용법을
직접 적어 두었고 `hasSlotEnd` 의 기본값이 꺼짐이라 두 값이 모두 관측됐다.
여기는 그렇지 않다. **어느 쪽으로 맞출지는 요청자가 정할 사항이라 보고만 한다.** (원칙 3)

`TextSetTitle` 의 `description`(boolean)도 같은 이유로 열지 않았다 — 두 변형 모두 꺼짐이고,
켜면 행 높이 72 가 깨진다.

`title` 은 prop 으로 열었다. Figma component property 는 아니지만 내용 슬롯이고,
텍스트를 코드에 고정하면 컴포넌트가 쓰일 수 없다. `TextSetTitle` 의 `title` 과
같은 성격이며 시각 값이 아니다.

## 호스트 합성 조건 — a11y 역할 분담

이 컴포넌트는 **선택 가능한 목록 항목의 시각 표현**이다. 라디오 그룹의 의미론은
갖지 않는다. `ListSlotRadio` 가 원자 수준에서 그은 선을 행 수준에서 그대로 유지한다.

| 담당 | 항목 |
|---|---|
| **이 컴포넌트** | 행 레이아웃(라디오 · 제목 · chevron · 구분선), `isChecked` 를 라디오 글리프에 전달, 행 높이 72 확보 |
| **호스트** | 그룹핑(`role="radiogroup"` 또는 `<fieldset>` + 그룹 라벨), 각 행의 역할(`role="radio"` 또는 네이티브 `<input type="radio">`), `aria-checked`, 라벨 연결, 포커스 표시, 키보드 조작(화살표 이동 · Space 선택), 클릭 핸들러, 목록 의미(`<ul>`/`<li>` 필요 여부) |

**호스트가 얹는 방법.** 루트 `<div>` 에 나머지 props 가 전개되므로 호스트가
`role="radio"` · `aria-checked` · `tabIndex` · `onClick` · `onKeyDown` 을 이 컴포넌트에
그대로 넘길 수 있다. `isChecked` 는 그림만 바꾸므로, 상태를 보조기술에 전달하려면
호스트가 `aria-checked` 를 **함께** 넘겨야 한다. 이 컴포넌트는 `isChecked` 로부터
`aria-checked` 를 자동으로 만들지 않는다 — 역할 없이 `aria-checked` 만 붙으면
무효한 조합이 되고, 역할을 이 컴포넌트가 정하면 네이티브 `<input>` 경로를 막는다.

**라벨 연결.** 제목 텍스트는 `TextSetTitle` 의 `<p>` 로 렌더된다. 네이티브
`<input type="radio">` 경로를 쓰면 `<label>` 로 이 컴포넌트를 감싸는 방법이 있는데,
`<label>` 의 콘텐츠 모델이 phrasing content 라서 `<div>`·`<p>` 를 담으면 무효한
마크업이 된다. `role="radio"` + `aria-labelledby`(제목에 `id` 부여) 경로가 이 구조에
맞다. 제목에 `id` 를 붙이는 통로는 없으므로 필요해지면 그때 추가한다 — 지금은
관측된 요구가 없어 만들지 않았다. (원칙 2)

**루트가 `<div>` 인 이유.** 자식 `TextSetTitle` 이 `<div>`·`<p>` 를 렌더하므로 이
컴포넌트를 `<button>`·`<label>` 로 만들 수 없다 (둘의 콘텐츠 모델이 phrasing content).
`ListSlotRadio` 가 `<span>` 을 고른 것과 같은 제약의 반대편이다.

**chevron 의 의미.** `Icon` 기본값이 `aria-hidden="true"` 라 보조기술에 노출되지
않는다. Figma 원본에 chevron 이 무엇을 하는지에 대한 설명이 없어(`iconEnd` 는
instance swap 이고 링크·이동 동작은 명시돼 있지 않다) 장식으로 남겼다.
이 chevron 이 "상세로 이동" 을 뜻한다면 그 의미는 호스트가 붙인다.

**대비.** unchecked 링(`--color-text-secondary` = `#747474`, 두께 1.5)의
WCAG 2.1 SC 1.4.11 관련 주의는 `ListSlotRadio.design.md` 에 적힌 그대로다.
구분선(`#ebebeb`)은 장식적 구분이라 대비 기준 대상이 아니다.
행 자체는 배경을 그리지 않는다.

## Code Connect

`get_design_context`(60:24172 · 60:24188) 응답 둘 다에 Code Connect 매핑이 없었다.
매핑 생성은 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. `ListRadio.tsx` · `ListRadio.stories.tsx` · 이 파일 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음, exit 0) |
| `npm run build` | 통과 (`tsc -b && vite build`, 32 modules, exit 0) |
| raw 값 자체 스캔 | 신규 2개 파일에서 hex · rgb/hsl · px/rem 리터럴 · Tailwind arbitrary value · `style` prop · `var(--…)` 직접 참조 **0건** |
| 빌드 산출 CSS 확인 | 이 파일이 쓰는 유틸리티가 전부 토큰 var 로 해석됨 (아래) |
| 픽셀 대조 | Figma 렌더 실측과 일치 (아래) |
| 범위 | `src/components/ListRadio/` 신규 3개 파일뿐. `ListSlotRadio/**` · `src/tokens/**` 변경 0건 |

레이어 3 hook 이 Tailwind 코어 유틸리티 일부(`h-px` · `border`)를 놓친다는 것을
알고 있어 직접 확인했다. 신규 2개 파일에는 `h-px`·`w-px`·`min-w-px`·`border` 가
**없다.** 1px 구분선은 `Divider` 가 `--spacing-hairline`(`h-hairline`)으로 그리고,
Figma 가 방출한 `min-w-px` 는 `min-w-0`(`--spacing-0`)으로 옮겼다.

빌드 산출 CSS(`dist/assets/index-BqPMI8-8.css`)에서 실제로 확인한 값:

```
.py-24{padding-block:var(--spacing-24)}     --spacing-24:1.5rem;
.gap-16{gap:var(--spacing-16)}              --spacing-16:1rem;
.min-w-0{min-width:var(--spacing-0)}        --spacing-0:0;
.inset-x-0{inset-inline:var(--spacing-0)}
.w-mobile-frame-width{width:var(--spacing-mobile-frame-width)}
                                            --spacing-mobile-frame-width:25.125rem;
.px-20{padding-inline:var(--spacing-20)}
.h-hairline{height:var(--spacing-hairline)}       (Divider)
.bg-border-primary{background-color:var(--color-border-primary)}
                                            --color-border-primary:var(--neutral-gray-light-100);  #ebebeb
.text-icon-primary{color:var(--color-icon-primary)}
                                            --color-icon-primary:var(--bw-light-black);            #1a1a1a
.min-h-24{min-height:var(--spacing-24)}          (TextSetTitle sm)
.gap-6{gap:var(--spacing-6)}                     (TextSetTitle sm)
```

`min-w-0` 과 `inset-x-0` 이 둘 다 `var(--spacing-0)` 로 해석된다 —
raw `0` 리터럴이 아니라 토큰에서 내려온 값이다.

### 픽셀 대조

브라우저 렌더 스크린샷은 만들지 못했다 — 이 환경에 SVG·DOM 을 래스터화하는
도구가 없다 (`ListSlotRadio` 검증 때와 같다). 그래서 Figma 렌더의 실측값과
구현이 산출하는 값을 대조했다. Storybook 에서 눈으로 확인하는 절차는 남아 있다.

`get_screenshot(60:24137)` 결과(1032×190, 무손실 PNG)에서 직접 센 값과,
`get_metadata` 좌표 · `get_design_context` 클래스를 함께 놓은 표다.
왼쪽 변형(`isChecked=false`)의 심볼은 진열 프레임 안에서 x 55…416 · y 59…130 이다.

| 항목 | Figma 실측 (렌더 픽셀 / metadata) | 구현이 산출하는 값 | 일치 |
|---|---|---|---|
| 행 높이 | 72 (metadata) | `py-24` × 2 + content 24 = 72 | ✓ |
| 행 폭 | 362 (metadata) | `w-full` → 진열 프레임 402 − `px-20` × 2 = 362 | ✓ |
| 구분선 y | 130 (렌더 픽셀), 심볼 기준 71 | `absolute bottom-0` + `h-hairline` → 71…72 | ✓ |
| 구분선 색 | `#ebebeb` (렌더 픽셀, y=130 전 구간) | `--color-border-primary` = `#ebebeb` | ✓ |
| 구분선 x 범위 | 56…415 (렌더 픽셀) = 폭 **360** | `inset-x-0` → 폭 362 | ✗ 좌우 1 씩 차이. 위 "구분선의 1px 인셋" 참조 — 알고 옮기지 않았다 |
| 라디오 글리프 x | 57 시작 (렌더 픽셀) = 심볼 기준 2 | 행 좌측 패딩 0 + `ListSlotRadio` 24 박스 안 중앙(2) | ✓ |
| 라디오 글리프 크기 | 20×20 (렌더 픽셀 bbox y 85…104) | `ListSlotRadio` `size-20` | ✓ |
| 라디오 ↔ 제목 간격 | 40 − 24 = 16 (metadata) | `gap-16` | ✓ |
| 제목 ↔ chevron 간격 | 338 − 322 = 16 (metadata) | `gap-16` | ✓ |
| chevron 위치 | x 338 (metadata), 24×24 | `flex` 마지막 자식 + `Icon` `size-24` → 362 − 24 = 338 | ✓ |
| chevron 글리프 bbox | `(9, 6, 16, 18)` (60:24179 렌더 픽셀) | `Icon` `chevronRight-small` path bbox 동일 | ✓ |
| chevron 색 | `#1a1a1a` α255 (렌더 픽셀) | `--color-icon-primary` = `#1a1a1a` | ✓ |
| content 세로 위치 | y=24, 높이 24 (metadata) | `py-24` + `items-center`, 자식 최대 높이 24 | ✓ |

불일치 1건은 구분선 폭(360 vs 362)이고, 위에 근거와 함께 적어 둔
**의도된 미이행**이다. 그 외 12개 항목은 전부 일치한다.

`token-exempt:` 주석은 쓰지 않았다. 이 컴포넌트가 추가한 예외는 0건이다.
