# Login — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료.** `Login.tsx` · `Login.stories.tsx` 가 내려가 있고
> `npm run typecheck` · `npm run build` 를 통과했다. 미검증 항목은 맨 아래
> [남은 것](#남은-것) 에 적었다.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27818-7071> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 프레임 | `27818:7071` — `page/Login` 402×874 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context`(27818:7073 · 7074 · 7076 · 7079) · `get_variable_defs` (2026-08-25) |

## 노드 구조 → 컴포넌트 매핑

**새로 만든 컴포넌트는 없다.** 인스턴스 7종이 `src/components` 와 1:1 로 맞는다.

```
FRAME 27818:7071  "page/Login"  402×874
├─ 27818:7072  OSBar/TopNavigation      402×62   → OSBarTopNavigation
├─ 27818:7073  Header                   402×56   → Header
├─ 27818:7074  Contents                 402×580  → (레이아웃 프레임)
│  ├─ 27818:7075  TextSetTitle          360×72   → TextSetTitle
│  └─ 27818:7076  Fields                362×276  → (레이아웃 프레임)
│     ├─ 27818:7077  TextField/Text     362×86   → TextFieldText
│     └─ 27818:7078  TextField/Password 362×86   → TextFieldPassword
├─ 27818:7079  Bottom                   402×142  → (레이아웃 프레임)
│  ├─ 27818:7080  Text Button           402×59   → (레이아웃 프레임)
│  │  └─ 27818:7081  TextButton         141×19   → TextButton
│  └─ 27818:7149 → 27818:7150  CTA      402×83   → (레이아웃 프레임)
│     ├─ 27818:7151  Button             177×55   → Button variant="filled-secondary"
│     └─ 27818:7152  Button             177×55   → Button variant="filled-primary"
└─ 27818:7084  OSBar/BottomNavigation   402×34   → OSBarBottomNavigation
```

이 파일이 직접 그리는 것은 **레이아웃 프레임 4개**뿐이고, 그 프레임들이 갖는 시각 값은
패딩과 간격뿐이다.

## 넘긴 props

| 컴포넌트 | props | Figma 근거 |
|---|---|---|
| `OSBarTopNavigation` | 없음 (기본값) | `transparent=false, onFrameHigh=false` |
| `Header` | `title="" hasTitle={false}` | `get_design_context(27818:7073)` 가 `hasTitle={false}` 로 방출. `hasSlotStart` 는 기본 true (뒤로가기 있음), `hasSlotEnd` 는 기본 false |
| `TextSetTitle` | `title` (2줄), `size` 생략 | 세트 기본값 `xl`. 방출된 타이포가 `font/display/medium-strong` = `xl` 의 값이다. `description` 노드 없음 |
| `TextFieldText` | `label="아이디" required={false} input onClear` | `*` 없음 (아래 절), 문구 "아이디를 입력해 주세요" |
| `TextFieldPassword` | `label="비밀번호" input onClear` | `*` 있음 → `required` 기본값 그대로 |
| `TextButton` | `children` | `color` 기본값 `secondary` = 방출된 `text/secondary` |
| `Button` ×2 | `variant`, `className="flex-1"` | `hierarchy=secondary` / `primary`, 그리고 flex-grow 1 · basis 0 |
| `OSBarBottomNavigation` | 없음 (기본값) | 위와 같음 |

## 아이디 라벨의 `*` 가 꺼진 근거 — 이전 판정의 반례

`TextFieldText.design.md` 는 필수 표시를 *"세 variant 모두 켜져 있고 TextField 레벨에
이것을 끄는 component property 가 없다"* 고 적었고, 근거는 세트 `13:2188` 의 variant
3개였다. 이 화면이 그 판정의 **반례**다.

| 노드 | 라벨 content 안의 텍스트 노드 | `*` |
|---|---|---|
| `27818:7077` 아이디 | `I27818:7077;13:2201;35:14372` 1개 | **없다** |
| `27818:7078` 비밀번호 | `…;35:14372` + `…;35:14373` 2개 | 있다 (`text/brand`) |

즉 중첩 인스턴스 `35:14369`(`[Field Text Set] Label`)의 `required` 를 오버라이드해서 끈
것이고, 끌 수 있는 축이 실재한다. 그 컴포넌트의 Figma 설명도 *"category 및 required
여부 기준에 따라 구성합니다"* 라고 적고 있다. 그래서 `required?: boolean`(기본 `true`)을
`TextFieldText` · `TextFieldPassword` 에 열었다 — 기본값이 `true` 라서 기존 호출부의
렌더 결과는 바뀌지 않는다.

## 사용 토큰

| 토큰 | 유틸리티 | 쓰는 곳 |
|---|---|---|
| `--color-bg-secondary` | `bg-bg-secondary` | 페이지 배경 |
| `--spacing-mobile-frame-width` | `w-mobile-frame-width` | 페이지 폭 402 |
| `--spacing-40` | `pt-40` · `gap-40` | `Contents` 상단 여백 · `Fields` 필드 간 간격 |
| `--spacing-20` | `px-20` · `py-20` · `pb-20` | 페이지 좌우 마진 · TextButton 행 · CTA 하단 |
| `--spacing-64` | `pt-64` | 타이틀 ↔ 입력 영역 |
| `--spacing-8` | `gap-8` · `pt-8` | 두 CTA 사이 · CTA 상단 |

`spacing.tokens.css` 의 주석이 이 화면을 그대로 지목한다 — `--spacing-40` *"콘텐츠 시작
여백 · 필드 간 간격"*, `--spacing-64` *"타이틀 ↔ 입력 영역 간격"*, `--spacing-8` *"CTA
상단 여백 · 버튼 간격"*, `--spacing-20` *"페이지 좌우 마진 · CTA 하단"*. **새로 추가한
토큰은 없다.**

### 토큰이 아닌 클래스

| 클래스 | 왜 토큰이 아닌가 |
|---|---|
| `min-h-dvh` | 뷰포트 상대 단위. 874 는 기기 화면 높이라 컴포넌트가 정할 값이 아니다. `App.tsx` 가 이미 쓰는 방식 |
| `flex-1` | `Contents` 의 Figma 높이 580 = 874 − (62+56+142+34) 의 나머지. 제약이 아니라 배분 결과 |
| `flex` `flex-col` `w-full` `items-*` `justify-*` | 레이아웃 동작. 시각 값이 아니다 |

## 세로 배치 — 절대 좌표가 없다

Figma 의 y 좌표는 auto-layout 결과라서 옮기지 않았다. 선언된 패딩·간격만 옮기면 같은
좌표가 재현된다.

| Figma 노드 | 선언된 값 | 코드 |
|---|---|---|
| `Contents` 27818:7074 | padding-top 40 · left/right 20 | `pt-40 px-20` |
| `Fields` 27818:7076 | padding-top 64 · gap 40 | `pt-64 gap-40` |
| `Text Button` 27818:7080 | padding-y 20 · center | `py-20 justify-center` |
| `CTA` 27818:7150 | padding 8·20·20 · gap 8 | `pt-8 px-20 pb-20 gap-8` |

검산: `Contents` 안에서 TextSetTitle 이 y=40 (= pt-40), `Fields` 가 y=112 (= 40 + 72),
그 안 첫 필드가 y=64 (= pt-64), 둘째 필드가 y=190 (= 64 + 86 + 40). Figma
`get_metadata` 좌표와 일치한다.

## 하단 두 버튼의 1:1 분할

추정이 아니다. `get_design_context(27818:7079)` 가 두 Button 인스턴스에 flex-grow 1 ·
flex-shrink 0 · flex-basis 0 과 min-width 리셋을 방출한다. `Button` 은 Figma 의 hug 를
옮겨 `inline-flex` 라서, 늘리는 것은 호출부가 `className="flex-1"` 로 지정한다.
검산: 402 − 20 − 20 − 8(gap) = 354, 354 / 2 = 177 = Figma 의 각 버튼 폭.

## 실제 입력 — 무엇이 Figma 근거이고 무엇이 아닌가

요청자 결정: *"실제 입력이 되어야 해"*. 두 필드를 `<input>` 으로 만들었다.
이때 **상태 4개는 지어낸 것이 아니라 Figma 세트에 이미 저작된 조합**이다
(`TextFieldSlot/Text` 13:2377 · `TextFieldSlot/Password` 13:2347, 각 4 variant).

| 포커스 | 값 | Figma 조합 | 보이는 것 |
|---|---|---|---|
| ✗ | ✗ | `default` | placeholder |
| ✓ | ✗ | `focused` | 포커스 링 |
| ✓ | ✓ | `focused`+`isTyping` | 포커스 링 · 지우기 버튼 · 본문색 |
| ✗ | ✓ | `done` | 본문색 |

placeholder 색도 Figma 근거가 있다 — `27818:7077` 의 문구가 `state=default` 의
`text/secondary` 가 아니라 **`text/disabled-onLight`** 다.

Figma 근거가 **없는** 것 2건은 아래와 같다. 둘 다 적어 둔다.

1. **표시/숨김 토글.** Figma 의 세 variant 는 `visibilityOff` 한 가지뿐이고 눈을 뜬
   상태가 그려져 있지 않다. 다만 `TextField/Password`(13:2167)의 Figma 설명이
   *"필요에 따라 입력값 표시/숨김 기능을 제공합니다"* 라고 기능을 명시하고, 짝 글리프
   `visibility` 가 같은 Figma `Icon` 섹션에서 온 것으로 이 저장소 `Icon` 에 이미 있다.
   글리프 크기가 같은 24 정사각이라 바뀌는 픽셀이 글리프뿐이다.
2. **비밀번호의 placeholder 없음.** Figma 의 `● ● ● ● ● ●` 는 값이 채워진 필드를 그린
   샘플이지 안내 문구가 아니다. 대신할 문구가 Figma 에 없어 지어내지 않았다.
   그래서 빈 비밀번호 필드는 Figma 스크린샷과 달리 **비어 보인다.**

## `<form>` 을 두지 않았다

제출 대상이 정해져 있지 않다. 로그인 요청을 보낼 곳도, 성공·실패 화면도 Figma 에 없어
`onSubmit` 이 할 일을 지어내야 한다. 지어내지 않았다 (원칙 1). 두 버튼은 `Button`
기본값인 `type="button"` 이고, Enter 로 제출되지 않는다.

## 범위 밖이라 고치지 않고 보고한 것

- **`Header` 의 `title` 이 필수 prop 이다.** `hasTitle={false}` 인데도 TS 가 값을
  요구해 `title=""` 를 넘긴다. `Header.tsx` 는 이 작업의 범위가 아니라 고치지 않았다
  (원칙 3). 고칠 경우의 형태는 `title` 을 optional 로 내리는 것이다.

## 남은 것

| 미검증 | 왜 |
|---|---|
| 브라우저에서의 실제 타이핑 · 포커스 링 · 눈 토글 동작 | Chrome 확장이 연결되지 않았고 headless 브라우저가 devDependencies 에 없다. 의존성을 임의로 추가하지 않았다. DOM **구조**는 Vite SSR 렌더로 38건 검증했다 (`<input>` 실재 · type · required · label htmlFor · aria-describedby · 진열 모드 회귀) |
| 스크린샷 대조 | 위와 같은 이유. Storybook `Pages/Login` 스토리로 눈으로 볼 수 있다 |

---

## 추가: 회원가입 화면으로의 이동 (2026-08-25)

요청자 결정: *"로그인 화면에서 회원가입을 누르면 회원가입 화면으로 넘어갈 수 있게"*.
회원가입 버튼(`27818:7151`)에 `onClick={() => navigate('/signin')}` 을 걸었다.
대상 화면은 `page/Login/SignIn`(27821:7158) → `src/pages/SignIn/SignIn.tsx` 다.

**Figma 에는 두 프레임을 잇는 프로토타입 연결이 없다.** 이동 자체는 Figma 근거가 아니라
요청자 결정이 근거다.

## 추가: 로그인 버튼의 이동 (2026-08-25)

요청자 결정: *"라우팅을 연결하고 로그인 화면에 로그인 버튼 누르면 넘어가는 화면으로
연결해줘"* + 선택지 확인 결과 *"Login → Consent → Benefit"*.
로그인 버튼(`27818:7152`)에 `onClick={() => navigate('/consent')}` 을 걸었다.
대상 화면은 `page/Consent`(27683:3187) → `src/pages/Consent/Consent.tsx` 다.

**여기도 Figma 프로토타입 연결이 근거가 아니다.** 로그인 성공·실패 화면 자체가 Figma 에
없어서, 이 버튼이 "성공했을 때 가는 곳" 이라는 것도 요청자 결정으로만 정해진다.

**입력값을 검사하지 않는다.** 빈 값일 때의 처리(버튼 비활성 · 에러 문구)를 Figma 가
그려 두지 않았고, 로그인 요청을 보낼 곳도 없다. 지금 이 버튼이 하는 일은 화면 이동뿐이다
— `SignIn` 의 회원가입 버튼이 같은 자리에서 내린 판단과 같다 (원칙 1).

`<form>` 은 여전히 두지 않았다. 두 버튼은 `Button` 기본값인 `type="button"` 이다.

라우트는 `main.tsx` 한 곳에만 있다:
`/` → `App`, `/login` → `Login`, `/signin` → `SignIn`, `/consent` → `Consent`, `/benefit` → `Benefit`.
