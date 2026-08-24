# SignIn — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료.** `SignIn.tsx` · `SignIn.stories.tsx` 가 내려가 있고
> `npm run typecheck` · `npm run build` 를 통과했다. 미검증 항목은
> [남은 것](#남은-것) 에 적었다.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27821-7158> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 프레임 | `27821:7158` — `page/Login/SignIn` 402×874 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context`(27821:7160 · 7161 · 7166) (2026-08-25) |

## 노드 구조 → 컴포넌트 매핑

**새로 만든 컴포넌트도, 새로 추가한 토큰도 없다.**

```
FRAME 27821:7158  "page/Login/SignIn"  402×874
├─ 27821:7159  OSBar/TopNavigation      402×62   → OSBarTopNavigation
├─ 27821:7160  Header                   402×56   → Header (hasTitle=false)
├─ 27821:7161  Contents                 402×639  → (레이아웃 프레임)
│  ├─ 27821:7162  TextSetTitle          360×36   → TextSetTitle (size=xl)
│  └─ 27821:7163  Fields                362×276  → (레이아웃 프레임)
│     ├─ 27821:7164  TextField/Text     362×86   → TextFieldText     (required=false)
│     └─ 27821:7165  TextField/Password 362×86   → TextFieldPassword (required 기본 true)
├─ 27821:7166  Bottom                   402×83   → (접힘, 아래 참조)
│  └─ 27821:7169  Bottom → 27821:7170  CTA
│     └─ 27821:7171  Button             362×55   → Button variant="filled-secondary"
└─ 27821:7173  OSBar/BottomNavigation   402×34   → OSBarBottomNavigation
```

프레임 합 검산: 62 + 56 + 639 + 83 + 34 = **874** ✓

## `page/Login`(27818:7071) 과 다른 점은 셋뿐이다

`get_design_context` 두 개를 노드 단위로 대조했다. 아래 3건 외에는 같다 —
폭·배경·Header 설정·`Contents` 패딩(40 · 20)·`Fields` 간격(64 · 40)·두 필드의 라벨과
필수 표시·placeholder 문구까지.

| | Login 27818:7071 | SignIn 27821:7158 |
|---|---|---|
| 타이틀 | 2줄 "아이디와 비밀번호를 / 입력해 주세요", 높이 72 | **1줄 "회원가입"**, 높이 36 |
| 하단 TextButton 행 | 있음 (`27818:7080`, "아이디 · 비밀번호 찾기") | **없음** |
| CTA | 버튼 2개, 각 177 (1:1 분할) | **버튼 1개**, 362 (폭 전체) |
| `Contents` 높이 | 580 | 639 (TextButton 행 59 만큼 늘어남) |
| `Bottom` 높이 | 142 | 83 |

### 타이틀 `size` 는 바뀌지 않았다 — 여전히 `xl`

높이가 72 → 36 으로 준 것을 크기 변경으로 읽으면 틀린다. 근거 3건이 `xl` 로 일치한다.

1. `get_design_context(27821:7161)` 가 방출한 타이포가 Login 과 같은
   `font/display/medium-strong` (28 · 행간 1.3 · 자간 −0.56)이다.
2. 함께 온 컴포넌트 설명 노드가 `27683:4427` = **size=xl** 이다.
3. 28 × 1.3 = 36.4 ≈ 36 — 한 줄의 높이가 그대로 프레임 높이다.

즉 줄 수가 2 → 1 로 준 결과이고, 줄바꿈은 Figma 텍스트 노드의 내용이라 컴포넌트
속성이 아니다 (`TextSetTitle.tsx` 의 "넣지 않은 것" 절). 그래서 `size` 를 넘기지 않고
세트 기본값 `xl` 을 쓰고, `<br />` 도 넣지 않는다.

## `Bottom` 두 단을 접은 근거

Figma 는 `Bottom`(27821:7166) → `Bottom`(27821:7169) → `CTA`(27821:7170) 3단이다.
앞의 두 단은 **시각 값을 하나도 갖지 않고** 자식도 하나씩이다 — 방출된 클래스가
`flex flex-col items-start w-full` 뿐이고 패딩·간격·배경이 없다. 패딩을 갖는 것은
`CTA` 하나다. 그래서 한 요소로 합쳤다 (CLAUDE.md 원칙 2, `Divider`·`TextButton` 과
같은 판단).

Login 쪽에서 `Bottom` 을 남긴 이유는 그쪽엔 자식이 둘(TextButton 행 + CTA)이라
세로로 쌓는 단이 실제로 필요했기 때문이다. 여기서는 그 이유가 없다.

## 넘긴 props

| 컴포넌트 | props | Figma 근거 |
|---|---|---|
| `OSBarTopNavigation` | 없음 (기본값) | `transparent=false, onFrameHigh=false` |
| `Header` | `title="" hasTitle={false}` | `get_design_context(27821:7160)` 가 `hasTitle={false}` 로 방출. `hasSlotStart` 기본 true (뒤로가기 있음) |
| `TextSetTitle` | `title="회원가입"` | `size` 생략 = 세트 기본값 `xl` (위 절) |
| `TextFieldText` | `label="아이디" required={false} input onClear` | 라벨 content `I27821:7164;13:2201;35:14371` 안에 텍스트 노드 1개 → `*` 없음 |
| `TextFieldPassword` | `label="비밀번호" input onClear` | 라벨 content 안에 텍스트 노드 2개 → `*` 있음 (`text/brand`) |
| `Button` | `variant="filled-secondary" className="flex-1"` | `hierarchy=secondary`, flex-grow 1 · basis 0 |
| `OSBarBottomNavigation` | 없음 (기본값) | 위와 같음 |

## 사용 토큰

| 토큰 | 유틸리티 | 쓰는 곳 |
|---|---|---|
| `--color-bg-secondary` | `bg-bg-secondary` | 페이지 배경 |
| `--spacing-mobile-frame-width` | `w-mobile-frame-width` | 페이지 폭 402 |
| `--spacing-40` | `pt-40` · `gap-40` | `Contents` 상단 여백 · 필드 간 간격 |
| `--spacing-20` | `px-20` · `pb-20` | 페이지 좌우 마진 · CTA 하단 |
| `--spacing-64` | `pt-64` | 타이틀 ↔ 입력 영역 |
| `--spacing-8` | `pt-8` | CTA 상단 |

Login 과 완전히 같은 토큰 집합이고, **새로 추가한 토큰은 없다.** 토큰이 아닌 클래스
(`min-h-dvh` · `flex-1` · 레이아웃 유틸리티)의 근거는 `Login.design.md` 의 같은 절과 같다.

## 세로 배치 — 절대 좌표가 없다

| Figma 노드 | 선언된 값 | 코드 |
|---|---|---|
| `Contents` 27821:7161 | padding-top 40 · left/right 20 | `pt-40 px-20` |
| `Fields` 27821:7163 | padding-top 64 · gap 40 | `pt-64 gap-40` |
| `CTA` 27821:7170 | padding 8·20·20 | `pt-8 px-20 pb-20` |

검산: `Contents` 안에서 TextSetTitle y=40 (= pt-40), `Fields` y=76 (= 40 + 36),
첫 필드 y=64 (= pt-64), 둘째 y=190 (= 64 + 86 + 40). `get_metadata` 좌표와 일치.
CTA 버튼 폭 검산: 402 − 20 − 20 = **362** = Figma 버튼 폭 ✓

## 화면 이동

요청자 결정: *"로그인 화면에서 회원가입을 누르면 회원가입 화면으로 넘어갈 수 있게"*.
`Login` 의 회원가입 버튼(27818:7151)에 `onClick={() => navigate('/signin')}` 을 걸었다.

**Figma 에는 두 프레임을 잇는 프로토타입 연결이 없다.** 이동 자체는 Figma 근거가 아니라
요청자 결정이 근거다. 프레임 이름이 `page/Login/SignIn` 으로 Login 하위인 것이 관계를
암시하지만, 그것은 이름이지 연결이 아니다.

라우트는 `main.tsx` 한 곳에만 있다 — `/` → `App`, `/login` → `Login`,
`/signin` → `SignIn`.

## 지어내지 않은 것

- **`<form>` 이 없다.** 가입 요청을 보낼 곳도, 성공·실패 화면도 Figma 에 없다.
  `onSubmit` 이 할 일을 지어내야 하므로 지어내지 않았다 (원칙 1). CTA 의 `onClick` 은
  가입 처리가 아니라 화면 이동이다 (위 절).
- **비밀번호 placeholder 가 없다.** Figma 의 `● ● ● ● ● ●` 는 값이 채워진 필드를 그린
  샘플이지 안내 문구가 아니다. 그래서 빈 비밀번호 필드는 Figma 스크린샷과 달리
  비어 보인다 (`Login.design.md` 와 같은 판정).

## 화면을 떠나는 길 2개 (2026-08-25 추가)

요청자 결정 2건으로 열었다. **둘 다 Figma 근거가 없다** — 27821:7158 에는 프로토타입
연결도, 뒤로가기의 클릭 축도 없다. 근거는 요청이다.

| 컨트롤 | 가는 곳 | 요청 문구 |
|---|---|---|
| Header 뒤로가기 (27821:7160) | `/login` | *"회원 가입 이후 상단 뒤로가기 버튼 누르면 로그인으로 돌아가게"* |
| CTA 회원가입 (27821:7171) | `/login` | *"아이디, 비밀번호 인풋 입력하고 회원가입 버튼 눌러도 로그인 화면으로 돌아가게"* |

뒤로가기는 `Header` 에 새로 연 `onSlotStartClick` 축을 쓴다 — 근거와 회귀 범위는
`Header.design.md` 의 같은 이름 절에 있다.

`navigate(-1)` 이 아니라 `/login` 을 명시한 이유: 이 화면에 URL 로 직접 들어온 경우
히스토리에 돌아갈 곳이 없어 `-1` 이 앱 밖으로 나가 버린다. 요청이 *"로그인으로"* 이므로
목적지를 고정했다.

**CTA 는 입력값을 검사하지 않는다.** 빈 값일 때의 처리(버튼 비활성 · 에러 문구)를 Figma 가
그려 두지 않았고, `TextField*` 의 에러 variant 는 `isDisabled` 없이는 켜지지도 않는다.
검사 규칙을 지어내지 않았다 (원칙 1). 가입 요청을 보내지도 않는다 — 보낼 곳이 정해져
있지 않다. 이 버튼이 하는 일은 화면 이동뿐이다.

## 범위 밖이라 고치지 않고 보고한 것
- **`Header` 의 `title` 이 필수 prop 이다.** `hasTitle={false}` 인데도 `title=""` 를
  넘겨야 한다. `Login.design.md` 와 같은 사항이다.
- **파일 이름이 `SignIn` 인데 화면은 회원가입(sign-**up**)이다.** 요청받은 이름을 그대로
  썼다. 바꾸려면 파일·라우트·스토리 3곳을 함께 바꾸면 된다.
- **경로가 `src/pages/SignIn/` 이다.** 요청은 `src/page/SignIn.tsx` 였으나 기존
  `src/pages/Login/Login.tsx` 구조에 맞췄다 — `design.md` 와 스토리를 같은 디렉터리에
  두는 관례가 이미 있고, `src/page` 와 `src/pages` 가 갈리면 라우트 import 가 두
  갈래가 된다.

## 남은 것

| 미검증 | 왜 |
|---|---|
| 브라우저에서의 실제 타이핑 · 포커스 링 · 눈 토글 · 화면 이동 동작 | Chrome 확장이 연결되지 않았고 headless 브라우저가 devDependencies 에 없다. DOM **구조**는 Vite SSR 렌더로 21건 검증했다. dev 서버에서 `/`·`/login`·`/signin` 세 경로가 200 이고, Login 번들에 `navigate("/signin")` 이 들어 있는 것은 확인했다 |
| 스크린샷 대조 | 위와 같은 이유. Storybook `Pages/SignIn` 스토리로 눈으로 볼 수 있다 |
