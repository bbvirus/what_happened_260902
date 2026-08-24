# TextFieldTextSet — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `TextFieldTextSet.tsx`, 스토리는 `TextFieldTextSet.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=35-14458> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 컴포넌트 세트 | `35:14458` — frame "TextFieldTextSet", 528×314 |
| 추출 | `get_metadata`(세트 + 6개 variant 전부) · `get_design_context`(35:14458) · `get_screenshot`(35:14458 · 35:14596 · 35:14517) · 아이콘 export SVG 6장 (2026-08-24) |

Figma 설명: "입력 필드 하단에 사용되는 보조 텍스트 묶음 요소입니다. 도움말, 에러, 성공,
안내(informative) 메시지를 전달하는 데 사용됩니다. status 및 supportingCount 기준에 따라
구성합니다."

## variant 는 6개다 — 4×2=8 이 아니다

`get_metadata`(35:14458)로 직접 확인한 세트의 자식은 정확히 6개다.

| 노드 | `status` | `isDisabled` |
|---|---|---|
| `35:14661` | default | false |
| `35:14668` | default | true |
| `35:14596` | error | false |
| `35:14560` | success | false |
| `35:14517` | informative | false |
| `35:14524` | informative | true |

`error`+disabled 와 `success`+disabled 는 **없다.** 없는 조합을 만들지 않기 위해
`status`·`isDisabled` 를 독립된 두 prop 으로 두지 않고 유니온으로 묶었다 (원칙 1·2).
두 조합을 넘기면 컴파일이 실패하는 것을 임시 파일로 확인했다 (아래 검증 표).

## 노드 구조 — 4단, 시각 값을 갖는 단은 2개

```
symbol 35:14596  "status=error, isDisabled=false"  360×21
└─ frame 35:14597  "content"        360×21   flex-col · gap spacing/4 · flex-1
   └─ frame 35:14598  "wrapper"     360×21   flex-row · gap spacing/4 · items-start
      ├─ frame 35:14599  "iconarea"  16×21   items-start · padding-top 2
      │  └─ instance 35:14600  "Icon/circle-fill"  16×16  @ y=2
      └─ frame 35:14601  "supportingText"  340×21  flex-1 · items-center
         └─ text 35:14602  "text"  340×21
```

`content` 는 자식이 `wrapper` 하나뿐이라 세로 gap 이 렌더에 영향을 주지 않고,
`supportingText` 는 크기가 안의 텍스트와 같아(둘 다 340×21) 세로 정렬이 무효다.
그래서 시각 값을 갖는 단만 남겨 **1단으로 접었다** — 남긴 것은 아이콘↔텍스트 gap 과
`iconarea` 의 상단 인셋 둘뿐이다. (`TextSetTitle`·`ListSlotCheckbox` 와 같은 기준, 원칙 2)

접은 결과가 Figma 렌더와 픽셀 단위로 같은지 확인했다 — 아래 "검증" 참조.

## 값의 출처

| 값 | Figma 원값 | 출처 | 토큰 | 결론 |
|---|---|---|---|---|
| 아이콘 ↔ 텍스트 간격 | 4 | 변수 `spacing/4` | `--spacing-4` = `0.25rem` | 값 일치 → 재사용 (`gap-4`) |
| `iconarea` 상단 인셋 | 2 | 6개 variant 전부 `pt-[2px]`. 변수 아님 | `--spacing-textfield-textset-icon-inset-top` | `token-guardian` 이 추가해 둔 신규 토큰 재사용 |
| 아이콘 상자 | 16×16 | 6개 instance 의 width/height | `--spacing-16` → `size-16` | 값 일치 → 재사용 |
| 본문 타이포 | `Font(family-font, Medium, font-size/body-small, 500, lineHeight 1.5)` | 변수 `font/body/small` | `@utility font-body-small` | 4개 값 전부 일치 → 재사용 |
| 폭 | 360 고정 | variant 프레임 | — | 옮기지 않았다 (아래 참조) |
| 높이 | 21 | 본문 14 × 행간 1.5 에서 나온 hug | — | 고정하지 않았다 |
| 루트 fill · radius | 없음 | 6개 variant 전부 0건 | — | 배경·반경 유틸리티가 들어갈 자리가 없다 |

`불명` 으로 남은 값은 없다. **신규 토큰 요청 0건** — 필요한 값이 전부 기존 토큰에 있다.

### 폭 360 을 옮기지 않은 이유

안의 `supportingText` 가 FILL 이고, 360 은 이 파일의 모바일 페이지 폭이다.
`TextSetTitle`(360×n) · `Divider`(360×1) 에서 이미 같은 판단을 내렸다. `w-full` 로 옮겼다.

## 색 — 12개 값 전부 Figma 실측

### 본문

| status | isDisabled | Figma 변수 | Figma 값 | 토큰 → 유틸리티 |
|---|---|---|---|---|
| default | false | `text/secondary` | `#747474` | `--color-text-secondary` → `text-text-secondary` |
| default | **true** | `text/primary` | `#1a1a1a` | `--color-text-primary` → `text-text-primary` |
| error | false | `text/negative` | `#da0707` | `--color-text-negative` → `text-text-negative` |
| success | false | `status/positive` | `#018303` | `--color-status-positive` → `text-status-positive` |
| informative | false | `status/informative` | `#064ad0` | `--color-status-informative` → `text-status-informative` |
| informative | **true** | `text/primary` | `#1a1a1a` | `--color-text-primary` → `text-text-primary` |

### 아이콘

아이콘 색은 Figma **변수가 아니라** 인스턴스의 fill 오버라이드다. 값은 각 아이콘의
export SVG 의 `fill` 속성에서 읽었다.

| status | isDisabled | export SVG 의 fill | 토큰 → 유틸리티 |
|---|---|---|---|
| default | false | `#747474` | `--color-icon-secondary` → `text-icon-secondary` |
| default | **true** | `#1A1A1A` + `fill-opacity="0.160784"` | `--color-icon-disabled-on-light` (`--dimmed-black-16` = `#1a1a1a29`) |
| error | false | `#E51A1A` | `--color-icon-status-negative` → `text-icon-status-negative` |
| success | false | `#24A326` | `--color-icon-status-positive` → `text-icon-status-positive` |
| informative | false | `#477EEB` | `--color-icon-status-informative` → `text-icon-status-informative` |
| informative | **true** | `#1A1A1A` + `fill-opacity="0.160784"` | `--color-icon-disabled-on-light` |

`0.160784` × 255 = 41 = `0x29` 이므로 `--dimmed-black-16`(`#1a1a1a29`)과 정확히 같다.

⚠ `--color-icon-status-negative`(`#e51a1a`)는 기존 `--color-icon-negative`(`#da0707`)와
**다른 토큰이고 값도 다르다.** 섞지 않았다. 근거는 `colors.tokens.css` 의 `icon/status-*` 주석.

### 판정 — disabled 의 텍스트·아이콘 색 (앞선 두 보고가 어긋났던 지점)

두 보고가 `status=informative, isDisabled=true` 아이콘(35:14528)을 두고 갈렸다.
**export SVG 의 fill 속성으로 판정했다** — 추론이 아니라 파일의 값이다.

| 노드 | export SVG 의 fill | 판정 |
|---|---|---|
| `35:14672` (default, disabled) | `fill="#1A1A1A" fill-opacity="0.160784"` | 흐려짐 → `--color-icon-disabled-on-light` |
| `35:14528` (informative, disabled) | `fill="#1A1A1A" fill-opacity="0.160784"` | **같다.** 흐려짐 → `--color-icon-disabled-on-light` |

즉 `35:14528` 을 불투명 `--color-icon-primary` 로 본 판정은 **틀렸다.**
`fill-opacity` 속성을 빠뜨리고 `fill` 값만 읽으면 두 색이 같아 보이는데, 실제로는
알파가 붙어 있다. 렌더 픽셀로도 교차 확인했다: 두 disabled 아이콘 모두 흰 배경 위에서
`#dadada` 로 찍힌다 — `#1a1a1a` 를 16% 로 합성한 값(`0.160784×26 + 0.839216×255 = 218 = 0xda`)과
일치하고, 불투명 `#1a1a1a` 와는 전혀 다르다.

**텍스트 쪽 보고는 맞았다.** `isDisabled=true` 의 본문은 흐려지지 않고
`text/primary`(불투명 `#1a1a1a`)다 — 두 disabled variant 모두 그렇다.
`get_design_context`(35:14458)가 방출한 텍스트 색이 그 값이고, 렌더 픽셀도 `#1a1a1a` 다.
Figma 의 실제 값이므로 보정하지 않았다 (원칙 1·3).

## 아이콘을 `Icon` 컴포넌트로 그리지 않은 이유

**크기와 여백 비율이 다르다.**

| | 아이콘 상자 | 그려진 글리프 | 여백 |
|---|---|---|---|
| `TextFieldTextSet` 의 자리 | 16 | **12** | 2 |
| `Icon` 컴포넌트 | 24 | 20 | 2 |

`Icon` 의 좌표는 24 뷰박스 기준이고 글리프가 상자의 20/24 를 차지한다. 그것을 16 크기로
줄여 그리면 글리프가 16 × 20/24 = **13.33** 이 되어 Figma 의 12 와 어긋난다.
여백 비율이 다르므로 단순 축소로는 맞출 수 없다.

이 12 는 추정이 아니라 실측이다. `get_screenshot`(35:14596, 1:1 배율)의 픽셀을 세었다:

```
빨간 글리프  x = 2..13 (폭 12)   y = 4..15 (높이 12)
```

`iconarea` 상단 인셋 2 + 상자 안 여백 2 = 글리프 상단 4 로, 위 측정과 맞는다.

`Icon` 에는 크기 prop 이 없고 추가는 이번 작업의 승인 범위 밖이다. 그래서 Figma 가
내보낸 **16 뷰박스 export 의 `d` 를 그대로** 그린다. `ListSlotCheckbox` ·
`ListSlotRadio` 가 vector 를 직접 그리는 것과 같은 처리이고, SVG 기하는 CLAUDE.md
토큰 규칙의 스코프 제외 대상이다.

⚠ **인계**: `Icon` 에 `info-circle-fill` 이 24 뷰박스로 추가됐지만 이 컴포넌트는 그것을
쓰지 않는다. 그 글리프는 현재 소비자가 없다. `Icon.design.md` 에도 적어 두었다.

### status → 글리프

| status | Figma 인스턴스 이름 | 비고 |
|---|---|---|
| default | `Icon/circle-fill` | error 와 **같은 글리프**. 색만 다르다 |
| error | `Icon/circle-fill` | 35:14665 · 35:14672 · 35:14600 의 export `d` 가 셋 다 문자 단위로 동일함을 확인 |
| success | `Icon/success-circle-fill` | |
| informative | `info-circle-fill` | 이 세트에서만 쓰이는 글리프 |

### ⚠ `info-circle-fill` 만 세로로 0.29 내려가 있다 — 보정하지 않았다

`circle-fill` · `success-circle-fill` 은 16 상자 안에서 위아래 여백이 같은데
(`M8 2C…`, y 2..14), `info-circle-fill` 만 `M8 2.29102C…` 로 시작해 y 2.291..14.291 을
차지한다. 렌더 픽셀로도 확인된다:

| | 글리프가 찍힌 행 | 대칭 여부 |
|---|---|---|
| error (35:14596) | y 4..15 | 대칭 (양 끝 행의 알파 합이 같다) |
| informative (35:14517) | y 4..**16** | 비대칭 (첫 행 714, 마지막 행 160) |

Figma 파일의 실제 값이다. 눈대중으로 가운데로 옮기지 않았다 (원칙 1).
고칠지는 요청자가 정한다 (원칙 3).

## 사용한 토큰

### 컴포넌트 (`TextFieldTextSet.tsx`)

| 토큰 | 유틸리티 | Figma 에서 읽은 값 |
|---|---|---|
| `--spacing-4` | `gap-4` | 변수 `spacing/4` = 4 |
| `--spacing-16` | `size-16` | 아이콘 인스턴스 width/height = 16 |
| `--spacing-textfield-textset-icon-inset-top` | `pt-textfield-textset-icon-inset-top` | `iconarea` padding-top = 2 |
| typography `font-body-small` (`@utility`) | `font-body-small` | 변수 `font/body/small` |
| `--color-text-primary` | `text-text-primary` | 변수 `text/primary` |
| `--color-text-secondary` | `text-text-secondary` | 변수 `text/secondary` |
| `--color-text-negative` | `text-text-negative` | 변수 `text/negative` |
| `--color-status-positive` | `text-status-positive` | 변수 `status/positive` |
| `--color-status-informative` | `text-status-informative` | 변수 `status/informative` |
| `--color-icon-secondary` | `text-icon-secondary` | 아이콘 fill `#747474` |
| `--color-icon-disabled-on-light` | `text-icon-disabled-on-light` | 아이콘 fill `#1A1A1A` @ 16% |
| `--color-icon-status-negative` | `text-icon-status-negative` | 아이콘 fill `#E51A1A` |
| `--color-icon-status-positive` | `text-icon-status-positive` | 아이콘 fill `#24A326` |
| `--color-icon-status-informative` | `text-icon-status-informative` | 아이콘 fill `#477EEB` |

토큰이 아닌 유틸리티와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `flex` · `items-start` | 레이아웃 | `wrapper` 의 가로 auto-layout · 위 정렬 |
| `w-full` | 레이아웃 | 폭 360 을 페이지 폭으로 판정 (위 참조) |
| `flex-1` · `min-w-0` | 레이아웃 | `supportingText` 의 FILL. `get_design_context` 는 `min-w-px` 를 방출했지만, Figma 가 방출했다는 이유는 토큰 규칙을 면제하지 않는다. Tailwind 코어의 `px` 는 토큰에서 내려오지 않는 raw 1px 이라, 같은 목적(flex 자식의 `min-width:auto` 해제)을 토큰 값 0(`--spacing-0`)으로 옮겼다 |
| `shrink-0` | 레이아웃 | 아이콘 16 이 flex 안에서 줄어들지 않게 |
| `break-words` | 레이아웃 | Figma 텍스트 노드의 `word-break: break-word` |

### 스토리 (`TextFieldTextSet.stories.tsx`)

| 토큰 | 유틸리티 |
|---|---|
| `--color-bg-primary` | `bg-bg-primary` |
| `--spacing-16` · `--spacing-40` | `gap-16` · `p-40` |

## a11y

- 루트는 `<div>` 다. Figma 에 상호작용 축(`state=pressed` · `focused` 등)이 **없다.**
- 이 문구는 입력 필드의 설명이다. 그런데 **어느 입력에 붙는지는 이 컴포넌트가 모른다.**
  그래서 `aria-describedby` 연결, error 를 읽어 줄 live region(`role="alert"` ·
  `aria-live`) 여부는 호스트가 정한다. props 를 전개하므로 `id` · `role` · `aria-live` 를
  넘길 수 있다. Figma 에 근거가 없는 것을 컴포넌트가 미리 정하지 않았다 (원칙 1·2).
  이 책임은 Wave 2 의 `TextField/Text`(13:2188) · `TextField/Password`(13:2167)로 넘긴다.
- 아이콘은 `aria-hidden="true"` 다. 옆 문구가 같은 뜻을 이미 전달하므로 노출하면
  중복해 읽힌다 (`Icon.tsx` 와 같은 기준).
- `isDisabled` 는 **시각만** 바꾼다. `pointer-events` 나 `disabled` 를 건드리지 않았다
  (`ListSlotCheckbox` 와 같은 규칙). 이 컴포넌트는 상호작용 요소가 아니다.

## Code Connect

`get_design_context`(35:14458) 응답에 Code Connect 매핑이 없다. 매핑 생성은 이 작업의
요청 범위 밖이라 보고만 한다 (원칙 3).
매핑을 원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `35:14458`).

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 (`✓ 32 modules transformed`, `✓ built in 312ms`) |
| 없는 조합이 타입 오류인지 | 확인. `status="error" isDisabled` · `status="success" isDisabled` 둘 다 `TS2322: Type 'true' is not assignable to type 'false'`. `status="informative" isDisabled` · `status="error"` 는 통과 (임시 파일로 확인 후 삭제) |
| 빌드 CSS 값 대조 | 번들에서 16개 유틸리티 전부 확인. 예: `.size-16{width:var(--spacing-16);height:var(--spacing-16)}` · `.pt-textfield-textset-icon-inset-top{padding-top:var(--spacing-textfield-textset-icon-inset-top)}` · `.text-icon-status-negative{color:var(--color-icon-status-negative)}` · `.text-status-positive{color:var(--color-status-positive)}`. raw 값 0건 |
| 렌더 ↔ Figma 픽셀 대조 | **12개 색 전부 일치.** 빌드된 CSS 로 6개 variant 를 헤드리스 브라우저에 1:1 배율로 렌더해 픽셀을 읽었다 (아래 표) |

### 렌더 픽셀 대조표

| variant | 글리프 위치·크기 | 아이콘 색 | 본문 색 | Figma 와 |
|---|---|---|---|---|
| default | x 2..13, y 4..15 (12×12) | `#747474` | `#747474` | 일치 |
| default, disabled | x 2..13, y 4..15 (12×12) | `#dadada` (= `#1a1a1a` @16% on white) | `#1a1a1a` | 일치 |
| error | x 2..13, y 4..15 (12×12) | `#e51a1a` | `#da0707` | 일치 (`get_screenshot`(35:14596) 실측과 동일) |
| success | x 2..13, y 4..15 (12×12) | `#24a326` | `#018303` | 일치 |
| informative | x 2..13, y 4..**16** | `#477eeb` | `#064ad0` | 일치 (`get_screenshot`(35:14517) 도 같은 비대칭) |
| informative, disabled | x 2..13, y 4..**16** | `#dadada` | `#1a1a1a` | 일치 |

본문 시작 x 는 6개 전부 **20** 이다 — 아이콘 상자 16 + gap 4 로, Figma `supportingText`
프레임의 x=20 과 같다.

⚠ **한계**: 이 저장소에는 Pretendard 웹폰트가 포함돼 있지 않아 렌더에 폴백 서체가
쓰인다. 그래서 글자 모양은 Figma 와 다르고, 위 대조는 색·위치·크기에 대한 것이다.
이 한계는 `typography.tokens.css` 가 이미 명시해 둔 것이고 이 컴포넌트가 만든 것이 아니다.
