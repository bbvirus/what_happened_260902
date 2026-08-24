# Consent — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `Consent.tsx`, 스토리는 `Consent.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-3187> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 노드 | `27683:3187` — frame "page/Consent", 402×874 |
| 추출 | `get_metadata` · `get_design_context` · `get_variable_defs` (2026-08-25) |

## 노드 구조

`get_metadata`(27683:3187) 그대로다. 좌표는 부모 기준이다.

```
frame 27683:3187  "page/Consent"  402×874
├─ instance 27683:3188  "[OS Bar Top Navigation]"      402×62   @ (0,0)
├─ instance 27683:3189  "[Header]"                     402×56   @ (0,62)
├─ frame    27683:3190  "Contents"                     402×639  @ (0,118)
│  ├─ instance 27683:3191  "[Text Set Title] xLarge"   362×72   @ (20,40)
│  └─ frame    27683:3192  "Agreements"                362×369  @ (20,112)
│     ├─ instance 27683:3193  "List/Checkbox"          362×72   @ (0,40)
│     │  ├─ instance I…;27742:6589  "Divider"          360×1    @ (1,71)
│     │  └─ frame    I…;60:23788    "content"          362×24   @ (0,24)
│     │     ├─ frame    I…;60:23789  "slot-start"      24×24
│     │     ├─ instance I…;27737:6056 "Text Set Title" 322×24   @ (40,0)
│     │     └─ frame    I…;60:23792  "slot-end"        24×24    @ (338,0)   ← hidden
│     ├─ instance 27683:3194  "Divider"                362×1    @ (0,112)
│     └─ frame    27683:3195  "Items"                  362×256  @ (0,113)
│        ├─ instance 27683:3196  "[List] Checkbox"     362×64   @ (0,0)
│        │  ├─ instance I…;60:23753  "Divider"         362×1    @ (0,63)    ← hidden
│        │  └─ frame    I…;60:23754  "content"         362×24   @ (0,20)
│        ├─ instance 27683:3197  "[List] Checkbox"     362×64   @ (0,64)
│        ├─ instance 27683:3198  "[List] Checkbox"     362×64   @ (0,128)
│        └─ instance 27683:3199  "[List] Checkbox"     362×64   @ (0,192)
├─ frame    27683:3200  "Bottom"                       402×83   @ (0,757)
│  └─ frame 27683:3201  "CTA"                          402×83   @ (0,0)
│     └─ instance 27683:3202  "Button"                 362×55   @ (20,8)
└─ instance 27683:3203  "[OS Bar Bottom Navigation]"   402×34   @ (0,840)
```

### 치수가 서로 맞는지 확인했다

| 축 | 계산 | Figma 실측 |
|---|---|---|
| 화면 높이 | 62 + 56 + **639** + 83 + 34 = 874 | frame height 874 ✔ |
| `Contents` 높이 | 874 − (62 + 56 + 83 + 34) = **639** — 나머지다 | 639 ✔ |
| `Agreements` 높이 | pt 40 + 행 72 + 구분선 1 + `Items` 256 = **369** | 369 ✔ |
| `Items` 높이 | 64 × 4 = **256** | 256 ✔ |
| `CTA` 높이 | pt 8 + 버튼 55 + pb 20 = **83** | 83 ✔ |
| 콘텐츠 폭 | 402 − 20 − 20 = **362** | 자식 인스턴스 width 362 ✔ |

`Contents` 의 639 가 **제약이 아니라 나머지**라는 것이 `flex-1` 로 옮긴 근거다.
`Login.design.md` 가 580 에 대해 내린 것과 같은 판단이다.

## 재사용 — 새로 만든 컴포넌트가 없다

`get_metadata` 가 반환한 인스턴스 8개가 전부 이 저장소에 이미 있다.

| Figma 노드 | 재사용한 컴포넌트 | 넘긴 값 | 근거 |
|---|---|---|---|
| `27683:3188` | `OSBarTopNavigation` | — | 402×62, Figma 기본 variant |
| `27683:3189` | `Header` | `title="" hasTitle={false}` | `get_design_context` 가 `hasTitle={false} hasSlotEnd={false}` 로 반환. `hasSlotEnd` 는 `Header` 의 기본값이 이미 꺼짐이라 넘기지 않았다 |
| `27683:3191` | `TextSetTitle` | `size` 기본값 `xl` | 인스턴스 이름이 `[Text Set Title] xLarge`. `get_design_context` 가 `hasDescription={false}` 로 반환해 `description` 을 넘기지 않았다 |
| `27683:3193` | `ListCheckbox` | `hasIconEnd={false}` | `slot-end` 프레임이 `hidden="true"` |
| `27683:3194` | `Divider` | — | 마스터가 `20:5645` — `Divider.design.md` 의 소스와 동일 |
| `27683:3196`~`3199` | `ListCheckbox` | `size="compact" hasDivider={false}` | 상하 패딩 `spacing/component/y/20`, 내부 `Divider` 가 `hidden="true"` |
| `27683:3202` | `Button` | `className="w-full"` | `variant`·`hierarchy` 가 Figma 기본값(`filled`·`primary`) = `Button` 기본값 `filled-primary` |
| `27683:3203` | `OSBarBottomNavigation` | — | 402×34, Figma 기본 variant |

### `ListCheckbox` 는 **수정했다** — 축 3개를 열었다

이 화면이 요구한 값 3개가 기존 `ListCheckbox` 에 없었다. 사용자가 "축 추가" 를 택했다.

| prop | 값 | 요구한 노드 | Figma 근거 |
|---|---|---|---|
| `size` | `'compact'` | `27683:3196`~`3199` | 상하 패딩 변수 `spacing/component/y/20` = 20, 행 높이 64 |
| `hasIconEnd` | `false` | `27683:3193` | `get_metadata`: `slot-end` 가 `hidden="true"` |
| `hasDivider` | `false` | `27683:3196`~`3199` | `get_metadata`: `Divider` 가 `hidden="true"` |

**세 기본값(`'default'` · `true` · `true`)이 기존 렌더 결과와 같아 다른 호출부는 바뀌지 않았다.**
축 이름 2개(`size` · `hasDivider`)가 Figma 에서 읽은 것이 아니라 이 저장소의 명명이라는
사실과 그 한계는 `ListCheckbox.design.md` 의 "나중에 늘어난 축 3개" 절에 적었다.

#### 왜 새 컴포넌트를 만들지 않았나

약관 4행은 `List/Checkbox`(60:23751) 가 **아닌 다른 마스터**(`[List] Checkbox`)의 인스턴스다.
그 마스터 노드(`60:23752`~`60:23754`)는 `get_metadata` 로 열리지 않는다
("invalid node selection" — 캔버스에서 보이는 페이지의 노드가 아니다).
두 마스터가 같은 원자를 같은 간격(`gap` 16)으로 배치하고 패딩·노출 여부만 다르므로,
별도 컴포넌트를 만들면 같은 조립이 두 벌 남는다. 관측된 차이 3개를 축으로 흡수했다. (원칙 2)

## 값의 출처

`불명`으로 남은 값은 없다. 추정해서 구현에 넣은 값도 없다.

### 이 파일이 직접 쓰는 시각 값

| 값 | Figma 에서 읽은 것 | 토큰 | 유틸리티 |
|---|---|---|---|
| 루트 배경 `#fcfcfc` | `get_design_context` 루트의 `bg-[#fcfcfc]` | `--color-bg-secondary` (= `--neutral-gray-light-10` = `#fcfcfc`) **값 일치** | `bg-bg-secondary` |
| 루트 폭 402 | `get_metadata` frame width | `--spacing-mobile-frame-width` = `25.125rem` = 402 **값 일치** | `w-mobile-frame-width` |
| 루트 높이 874 | `get_metadata` frame height | 대응 토큰 없음. 기기 화면 높이라 컴포넌트가 정할 값이 아니다 | `min-h-dvh` (뷰포트 상대 단위 — 치수 리터럴이 아니다) |
| `Contents` padding-top 40 | `get_design_context`: `pt-[40px]` | `--spacing-40` = `2.5rem` = 40 **값 일치** | `pt-40` |
| `Contents` padding-x 20 | `get_design_context`: `px-[20px]` | `--spacing-20` = `1.25rem` = 20 **값 일치** | `px-20` |
| `Agreements` padding-top 40 | `get_design_context`: `pt-[40px]` | `--spacing-40` **값 일치** | `pt-40` |
| `Items` 패딩·간격 | `get_design_context` 에 패딩·gap 이 없다 | — | 유틸리티를 넣지 않았다 |
| `CTA` padding-top 8 | `get_design_context`: `pt-[8px]` | `--spacing-8` = `0.5rem` = 8 **값 일치** | `pt-8` |
| `CTA` padding-x 20 · bottom 20 | `get_design_context`: `px-[20px] pb-[20px]` | `--spacing-20` **값 일치** | `px-20 pb-20` |
| 버튼 폭 362 | `get_metadata`. 402 − 20 − 20 = 362 = `CTA` 의 내부 폭 | 폭 토큰이 아니라 부모가 정한다 | `w-full` |

**⚠ 위 40 · 20 · 8 에는 Figma 변수 바인딩이 없다.**
`get_variable_defs`(27683:3190 · 27683:3187) 가 `spacing/40` · `spacing/8` 을 반환하지 않고,
`get_design_context` 도 이 자리들을 변수가 아닌 raw 값(`pt-[40px]` 등)으로 내보냈다.
레이아웃 프레임의 패딩으로 직접 적힌 값이다. **기존 토큰과 값이 일치해서 재사용한 것이지,
변수 alias 를 따라간 것이 아니다.** `Login.design.md` 가 같은 자리에 대해 내린 판단과 같다.
(참고로 `spacing/20` 은 `get_variable_defs`(27683:3187) 에 나타나지만, 그것은
`Button` 인스턴스 내부의 좌우 패딩에서 온 것이지 `CTA` 프레임의 것이 아니다.)

### 재사용한 컴포넌트를 통해 들어오는 값

이 화면이 다시 확인하지 않고 컴포넌트를 신뢰한 값들이다. 각 컴포넌트의 design.md 에 근거가 있다.

| 컴포넌트 | 토큰 |
|---|---|
| `OSBarTopNavigation` · `OSBarBottomNavigation` | `--spacing-mobile-frame-width` · statusbar/home-indicator 축 · `--color-bg-secondary` |
| `Header` | `--spacing-20` · `--spacing-6` · `--spacing-12` · `--spacing-header-row-height` · `--color-bg-secondary` · `--color-text-primary` · `--color-icon-primary` · `font-title-small-strong` |
| `TextSetTitle` (`xl`) | `--spacing-12` · `--color-text-primary` · `font-display-medium-strong` |
| `ListCheckbox` | `--spacing-24` · `--spacing-20` · `--spacing-16` (+ 내부의 `ListSlotCheckbox` · `TextSetTitle` sm · `Icon` · `Divider`) |
| `Divider` | `--spacing-hairline` · `--color-border-primary` |
| `Button` (`filled-primary`) | `--spacing-button-height` · `--radius-4` · `--spacing-20` · `--spacing-14` · `--color-button-primary-fill` · `--color-button-primary-text` · `font-label-large` |

### 토큰이 아닌 유틸리티와 그 근거

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `flex` `flex-col` `items-start` | 레이아웃 | Figma auto-layout (세로, 좌측 정렬) |
| `flex-1` | 레이아웃 | `Contents` 의 639 가 나머지다 (위 "치수" 표) |
| `w-full` | 레이아웃 | `Agreements` · `Items` · `Bottom` · `CTA` · `Button` 이 부모 폭을 채운다 |
| `min-h-dvh` | 뷰포트 상대 | 화면 높이 874. `App.tsx` · `Login.tsx` 가 이미 쓰는 표현 |

### hook 이 놓치는 것 — 직접 확인했다

쓰기 시점 hook 이 Tailwind 코어 유틸리티 일부(`h-px` · `border`)를 놓친다는 것을 알고 있어,
1 을 쓰는 자리를 손으로 확인했다.

| 자리 | Figma 원값 | 쓴 것 | 확인 |
|---|---|---|---|
| 독립 구분선 두께 | 1 | **직접 쓰지 않았다.** `Divider` 가 `h-hairline`(= `--spacing-hairline`) 으로 그린다 | 토큰 유틸리티 ✔ |

`h-px` · `w-px` · `border` 는 이 화면의 어느 파일에도 없다.

## Figma 원본을 그대로 옮긴 지점 — 보정하지 않았다

### (1) 전체동의 행 아래 구분선이 두 겹이다

| 구분선 | 노드 | `Agreements` 기준 y | 폭 |
|---|---|---|---|
| 행이 자기 안에 그리는 것 | `I27683:3193;27742:6589` | 40 + 71 = **111** | 360 |
| 독립 인스턴스 | `27683:3194` | **112** | 362 |

두 hairline 이 세로로 맞붙어 있어 합쳐서 2 두께로 보인다.
디자인 파일의 실제 상태이고, 눈대중으로 하나를 지우지 않았다. (원칙 1)
`ListCheckbox` 의 구분선은 절대 배치(bottom=0)라 행 높이 72 를 늘리지 않으므로,
독립 구분선이 그 바로 아래 in-flow 로 들어오는 것까지 Figma 와 같다
(`Agreements` 높이 계산 369 가 맞는 것이 그 증거다).

### (2) 전체동의 행의 라벨이 기본 플레이스홀더다

`27683:3193` 의 `Text Set Title` 인스턴스가 텍스트를 오버라이드하지 않아
컴포넌트 기본값 `타이틀 영역입니다.` 가 그대로 렌더된다 (`get_screenshot` 에도 그렇게 나온다).
요청자가 "Figma 원문 그대로" 를 택해 그대로 넣었다.

## 넣지 않은 것

| 항목 | 이유 |
|---|---|
| 전체동의 ↔ 4행 연동 (select-all) | 첫 행의 라벨이 플레이스홀더이고, 두 그룹의 연동이 Figma·요구사항 어디에도 없다. "전체 동의" 로 읽는 것은 추정이다 (원칙 1). 5개 행이 서로 독립으로 토글된다 |
| 셰브론 클릭 시 이동 | 약관 상세 화면이 Figma 에 없다. 갈 곳을 지어내지 않았다 |
| `<form>` · 제출 | 제출 대상이 정의돼 있지 않다. `Button` 은 기본값 `type="button"` 이다 (`Login.tsx` 와 같은 판단) |
| **필수/선택 구분**에 따른 CTA 비활성 | `[필수]`·`[선택]` 은 Figma 텍스트 노드의 **문구**이지 컴포넌트 속성이 아니고, 첫 행의 라벨은 플레이스홀더다. 문구를 파싱해 필수 약관을 판정하지 않았다 (원칙 1). 실제로 건 조건은 "하나라도 켜졌는가" 하나다 — 아래 "CTA 비활성 조건" 절 |

> CTA 의 **화면 이동**과 **비활성 조건**은 나중에 요청자 결정으로 붙었다 — 아래 두 절.
| `overflow-clip` | Figma 프레임 3개(`Contents` · `Agreements` · `Items`)에 clip 이 걸려 있으나, 이 화면의 콘텐츠가 프레임을 넘지 않아 렌더 결과가 같고, 옮기면 포커스 표시가 잘릴 수 있다. `Login.tsx` 가 같은 자리에서 내린 판단과 같다 |

## 접근성 — 호스트 몫을 이 화면이 붙인다

`ListCheckbox.design.md` 의 책임 분리표가 시맨틱·키보드·그룹핑을 **호스트 몫**으로 정해 두었다.
그 몫이 이 화면이다.

| 붙인 것 | 어디 |
|---|---|
| `role="group"` + `aria-label="약관 동의"` | `Agreements` 27683:3192 |
| `role="checkbox"` + `aria-checked` | 5개 행 각각 (`ListCheckbox` 의 `...props` 가 루트로 전개된다) |
| `tabIndex={0}` | 5개 행 각각 |
| 클릭 토글 | `onClick` |
| Space 토글 | `onKeyDown` — `role="checkbox"` 의 표준 조작. 기본 스크롤을 `preventDefault` 로 막는다 |

포커스 표시는 UA 아웃라인이 그대로 살아 있다 — 이 화면에도, `ListCheckbox` 에도
아웃라인을 끄는 코드가 없다. `TabItem` 이 세운 규칙과 같다.

내부 요소의 시맨틱은 중복되지 않는다: `ListSlotCheckbox` 와 `Icon` 이 기본으로
`aria-hidden="true"` 이고, 행에 `role="checkbox"` 가 붙으면 ARIA 의
presentational-children 규칙에 따라 자식 `Divider`(`<hr>`)의 role 도 노출되지 않는다.

## 필요하지만 없는 토큰

**없다.** 이 화면이 직접 쓰는 시각 값 6개(배경 · 폭 · 40 · 20 · 8 · 버튼 폭)가 모두
기존 토큰과 값이 일치하거나 부모가 정하는 레이아웃이었다.
이 작업에서 `src/tokens/**` 는 편집하지 않았다.

## 불명확한 값

**없다.** 다만 **Figma 파일 쪽에 남은 관측 2건**을 보고한다. 고칠지는 요청자가 정한다. (원칙 3)

| 관측 | 상태 |
|---|---|
| 전체동의 행의 라벨이 기본 플레이스홀더 `타이틀 영역입니다.` 다 | 요청자가 "Figma 원문 그대로" 를 택했다. 문구가 정해지면 `Consent.tsx` 의 한 줄만 바뀐다 |
| 그 행 아래 구분선이 두 겹이다 (y=111 · y=112) | Figma 그대로 옮겼다. 한 겹으로 정리하려면 `27683:3194` 를 지우거나 행의 `hasDivider={false}` 로 바꾸면 된다 |

## Code Connect

`get_design_context`(27683:3187) 응답에 Code Connect 매핑이 없었다.
매핑 생성은 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)

## 라우팅

`main.tsx` 에 `<Route path="/consent" element={<Consent />} />` 한 줄을 더했다.
그 파일의 주석이 정한 방식 그대로다 ("화면이 늘면 이 표에 `<Route>` 를 한 줄 더한다").
`App.tsx` 에도 화면 목록 링크를 한 줄 더했다 — 같은 파일의 주석이 정한 방식이다.

## 화면 이동 (2026-08-25 추가)

**Figma 에 이 프레임을 다른 프레임에 잇는 프로토타입 연결이 없다.**
아래 이동은 전부 요청자 결정이 근거다. Figma 근거가 아니다.

요청자 결정: *"라우팅을 연결하고 로그인 화면에 로그인 버튼 누르면 넘어가는 화면으로 연결해줘"*
+ 선택지 확인 결과 — 흐름은 `Login → Consent → Benefit`, 뒤로가기는 `Consent` · `Benefit` 둘 다.

| 자리 | 노드 | 이동 |
|---|---|---|
| `Login` 의 로그인 버튼 | `27818:7152` | `/consent` |
| `Consent` 헤더 뒤로가기 | `27683:3189` | `/login` |
| `Consent` CTA "동의하고 계속하기" | `27683:3202` | `/benefit` |
| `Benefit` 헤더 뒤로가기 | `27683:3206` | `navigate(-1)` |

### 뒤로가기가 화면마다 다른 이유 — 의도한 차이다

| 화면 | 방식 | 근거 |
|---|---|---|
| `Consent` | `/login` 고정 | `SignIn.tsx` 가 세운 규칙 그대로다 — 직접 URL 로 들어오면 히스토리에 돌아갈 곳이 없어 `-1` 이 앱 밖으로 나간다. 이 화면의 앞 화면은 `Login` 하나로 정해져 있으므로 목적지를 고정한다 |
| `Benefit` | `navigate(-1)` | 그 화면의 **하단 "뒤로가기" 버튼(`27683:3216`)이 이미 `navigate(-1)`** 이다. PRD `docs/prd-list` §3 · §6 시나리오 6 이 "이전 화면(요금제 관리) 복귀" 로 적었고 그 화면이 이 저장소에 없어서 내린 선택이다. 한 화면 안에서 같은 의도의 두 컨트롤이 다르게 동작하지 않도록 헤더도 같은 동작으로 맞췄다. 하단 버튼을 `/consent` 로 바꾸는 것은 이번 요청 범위 밖이고 PRD 와도 어긋난다 (원칙 3) |

## CTA 비활성 조건 (2026-08-25 추가)

요청자 결정: *"체크박스 리스트 아무것도 체크 안된 상태는 아래 동의하고 계속하기 버튼이
비활성화 되어야해. 1개라도 체크박스 선택해야 활성화되게 해줘"*.

```tsx
const hasAnyChecked = Object.values(checked).some(Boolean);
<Button className="w-full" isDisabled={!hasAnyChecked} onClick={() => navigate('/benefit')}>
```

| 항목 | 판단 |
|---|---|
| 조건 | **5개 행 중 하나라도 켜졌는가.** 그것 하나뿐이다 |
| 필수/선택 구분 | **하지 않았다.** `[필수]`·`[선택]` 은 Figma 텍스트 노드의 문구이지 컴포넌트 속성이 아니고, 첫 행 라벨은 플레이스홀더 `타이틀 영역입니다.` 다. 문구를 파싱해 필수 약관을 판정하는 것은 지어내는 것이다 (원칙 1) |
| 키 개수가 아니라 값을 보는 이유 | 껐다 켠 행이 `checked` 에 `false` 로 남는다. `Object.keys().length` 로 세면 껐는데도 활성으로 남는다 |
| 비활성 **모양**의 출처 | Figma 가 아니다. 인스턴스 `27683:3202` 는 활성 variant 하나뿐이다. `Button` 의 `isDisabled` 가 그리는 `--color-button-disabled-fill` · `--color-button-disabled-text` 를 쓴다 — `Benefit.tsx` 가 `선택 완료` 에 쓴 것과 같은 prop 이다 |
| `isDisabled` 가 시각만 바꾸지 않는다 | `Button` 의 `isDisabled` 는 HTML `disabled` 와 1:1 이다. 비활성일 때 클릭·포커스가 실제로 막히므로 `onClick` 이 호출되지 않는다 — 별도 가드가 필요 없다 |

### 여전히 검사하지 않는 것

동의 **요청을 보내지 않는다.** 보낼 곳이 정해져 있지 않다.
이 버튼이 하는 일은 활성일 때의 화면 이동뿐이다.

### Storybook — Router decorator 를 추가해야 했다

`useNavigate` 를 쓰는 순간 이 화면의 스토리가 Router 컨텍스트 없이 렌더되어 터진다.
`.storybook/preview.ts` 에 `MemoryRouter` decorator 를 전역으로 하나 추가했다.

**이건 이 화면만의 문제가 아니었다** — `Login` · `SignIn` · `Benefit` 이 이미
`useNavigate` 를 쓰고 있어 세 스토리가 이 작업 전부터 같은 이유로 터지고 있었다.
decorator 를 파일마다 넣으면 같은 코드가 4벌 남으므로 전역으로 하나만 두었다 (원칙 2).

SSR 렌더로 실제 동작을 확인했다 (임시 파일로 실행 후 삭제):

```
PASS  Login    (len=14809, "로그인" true)
PASS  Consent  (len=15967, "동의하고 계속하기" true)
PASS  Benefit  (len=16149, "선택 완료" true)
PASS  SignIn   (len=13791, "회원가입" true)
CONTROL  decorator 없으면 throw: useNavigate() may be used only in the context of a <Router> component.
```

대조군이 실제로 throw 하는 것까지 확인했으므로, decorator 가 없으면 터진다는 것과
있으면 4개 화면이 모두 렌더된다는 것이 둘 다 증거로 남았다.

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | **통과.** 파일 6개 작성/수정 중 차단 0건. 완료 후 최종 파일 내용을 `Write` 페이로드로 다시 hook 에 먹여 재확인했다 — 6개 전부 exit 0 |
| `npm run typecheck` | **통과** (`tsc -b --noEmit`, 출력 없음, exit 0) |
| `npm run build` | **통과** (`✓ 63 modules transformed` · `✓ built in 386ms`, exit 0) |
| 빌드 CSS 값 대조 | **통과.** 아래 |
| raw 값 스캔 | **통과.** hex · `rgb(`/`hsl(` · px/rem 리터럴 · Tailwind arbitrary `[...]` · `var(--` · `style=` · `h-px`/`w-px`/`border` 전부 0건 |
| 저장소 전체 `token-exempt` | **0건** (기준: 5건 이하) |
| 범위 밖 변경 | **0건.** 아래 |
| `get_screenshot` 픽셀 대조 | **미실행.** Chrome 확장이 연결돼 있지 않아 렌더 비교를 돌리지 못했다. `Login.design.md` 가 한 headless 좌표 대조를 이 화면에는 하지 못했다 — 대신 아래 두 가지(빌드 CSS 값 · 치수 산술)로 확인했다 |

### 빌드 CSS 값 대조

이 화면이 직접 쓰는 유틸리티의 최종 값이다. 전부 Figma 원값과 일치한다.

```
.pt-40{padding-top:var(--spacing-40)}          --spacing-40:2.5rem     /* = 40 ✔ */
.px-20{padding-inline:var(--spacing-20)}       --spacing-20:1.25rem    /* = 20 ✔ */
.pt-8 {padding-top:var(--spacing-8)}           --spacing-8:.5rem       /* = 8  ✔ */
.pb-20{padding-bottom:var(--spacing-20)}       --spacing-20:1.25rem    /* = 20 ✔ */
.py-20{padding-block:var(--spacing-20)}        /* ListCheckbox size="compact" ✔ */
.py-24{padding-block:var(--spacing-24)}        --spacing-24:1.5rem     /* = 24 ✔ */
.gap-16{gap:var(--spacing-16)}                 --spacing-16:1rem       /* = 16 ✔ */
.w-mobile-frame-width{width:var(--spacing-mobile-frame-width)}
                                               --spacing-mobile-frame-width:25.125rem  /* = 402 ✔ */
.bg-bg-secondary{background-color:var(--color-bg-secondary)}
                       --color-bg-secondary:var(--neutral-gray-light-10)  /* = #fcfcfc ✔ */
.h-hairline{height:var(--spacing-hairline)}    --spacing-hairline:.0625rem  /* = 1 ✔ */
.min-h-dvh{min-height:100dvh}                  /* 뷰포트 상대 — 치수 리터럴 아님 ✔ */
```

`.py-20` 이 빌드 산출물에 실제로 들어간 것이 `ROOT_PADDING` 을 정적 클래스명으로 적은
이유이기도 하다 — Tailwind 스캐너가 문자열을 그대로 찾아야 유틸리티가 생성된다.

### 범위 밖 변경 0건

| 파일 | 변경 | 요청의 어느 부분 |
|---|---|---|
| `src/pages/Consent/Consent.tsx` | 신규 | 화면 구현 |
| `src/pages/Consent/Consent.design.md` | 신규 | 목적 3 산출물 ① |
| `src/pages/Consent/Consent.stories.tsx` | 신규 | 목적 3 산출물 ③ |
| `src/components/ListCheckbox/ListCheckbox.tsx` | 축 3개 추가 | 이 화면이 요구한 값 (사용자가 "축 추가" 를 택했다) |
| `src/components/ListCheckbox/ListCheckbox.stories.tsx` | argTypes · `ConsentRows` 스토리 | 위 축의 산출물 ③ |
| `src/components/ListCheckbox/ListCheckbox.design.md` | 위 축의 근거 | 위 축의 산출물 ① |
| `src/main.tsx` | `import` 1줄 + `<Route>` 1줄 | 화면을 볼 수 있게 하는 라우팅 |
| `src/App.tsx` | `<Link>` 3줄 | 같은 파일 주석이 정한 화면 목록 |

`src/tokens/**` · 다른 컴포넌트 · 다른 페이지는 건드리지 않았다.
`git status` 에 보이는 다른 수정 파일들(`Header.tsx` · `Icon.tsx` · `docs/**` 등)은
이 작업 이전부터 있던 것으로 이 작업이 만든 변경이 아니다.

### 2회차 검증 — 화면 이동 · CTA 비활성 (2026-08-25)

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook | **통과.** 변경한 코드 5개(`Consent.tsx` · `Consent.stories.tsx` · `Login.tsx` · `Benefit.tsx` · `.storybook/preview.ts`)의 최종 내용을 `Write` 페이로드로 hook 에 먹여 전부 exit 0 |
| `npm run typecheck` | **통과** (exit 0) |
| `npm run build` | **통과** (`✓ built in 457ms`) |
| `npm run build-storybook` | **통과** (`Preview built`) |
| SSR 런타임 렌더 | **통과.** 아래 |
| 임시 파일 잔여 | **0건.** 검증용 `ssr-check.tsx` · `.ssr-check-out` 은 실행 후 삭제했다 (`git status` 확인) |

#### SSR 런타임 렌더 결과

`.storybook/preview.ts` 의 decorator 를 Storybook 이 호출하는 것과 같은 형태로 적용해
`renderToString` 했다.

```
PASS  Login 렌더    len=14809
PASS  Consent 렌더  len=15550
PASS  Benefit 렌더  len=16149
PASS  SignIn 렌더   len=13791
PASS  CTA 초기 상태가 disabled
      <button type="button" disabled="" class="group relative inline-flex ...
PASS  체크박스 행 5개  count=5
ALL PASS
```

- **CTA 초기 상태**: 아무것도 체크되지 않은 최초 렌더에서 `<button ... disabled="">` 가
  실제로 나온다. `Button` 의 `isDisabled` 가 HTML `disabled` 와 1:1 이라 클릭도 막힌다.
- **체크박스 5개**: `role="checkbox"` 가 정확히 5개다 (전체동의 1 + 약관 4).

#### 여전히 미검증인 것

| 항목 | 왜 |
|---|---|
| 브라우저에서의 실제 클릭 · Space 토글 · 활성 전환 · 포커스 링 | Chrome 확장이 연결되지 않았고 headless 브라우저가 devDependencies 에 없다. 의존성을 임의로 추가하지 않았다 |
| 스크린샷 픽셀 대조 | 위와 같은 이유. Storybook `Pages/Consent` 스토리로 눈으로 볼 수 있다. **최초 상태는 Figma 컷과 다르다** — Figma 의 CTA 는 활성으로 그려져 있고 구현은 미선택이라 비활성이다 (요청자 결정) |
