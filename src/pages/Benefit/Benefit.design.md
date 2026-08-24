# Benefit (요금제 선택) — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. Figma 소스 확정과 토큰 매핑 근거만 담는다.

> **상태: 구현 완료.** `Benefit.tsx` · `Benefit.stories.tsx` 가 내려가 있다.
> 검증 결과와 미달 항목은 맨 아래 [PRD 완료 기준 대조](#prd-완료-기준-대조) ·
> [남은 것](#남은-것) 에 있다.

## 소스 두 개 — Figma 와 PRD

| 항목 | 값 |
|---|---|
| Figma URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-3204> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 프레임 | `27683:3204` — `page/List` 402×874 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context`(27683:3206 · 3207 · 3208 · 3214) (2026-08-25) |
| PRD | `docs/prd-list` — 요금제 선택 |

**Figma 가 "무엇이 어떻게 보이는가", PRD 가 "무엇이 어떻게 동작하는가" 를 정한다.**
둘이 어긋나는 지점은 아래 [Figma 와 PRD 가 어긋나는 곳](#figma-와-prd-가-어긋나는-곳) 에 전부 적었다.

## 경로 — 요청자 결정

요청 문자열은 `src/page/benefit` 이었고, 요청자가 `src/pages/Benefit` 으로 확정했다.
기존 `src/pages/Login` · `src/pages/SignIn` · `src/pages/Consent` 와 같은 규칙이다.
라우트는 `main.tsx` 한 곳에 `/benefit` 으로 한 줄 추가했다.

## 노드 구조 → 컴포넌트 매핑

**새로 만든 컴포넌트는 없다.** 인스턴스 7종이 `src/components` 와 1:1 로 맞는다.

```
FRAME 27683:3204  "page/List"  402×874
├─ 27683:3205  [OS Bar Top Navigation]     402×62   → OSBarTopNavigation
├─ 27683:3206  [Header]                    402×56   → Header  title="요금제 선택"
├─ 27683:3207  Tab                         402×49   → Tab  items=[5G, LTE, 알뜰폰]
├─ 27683:3208  Contents                    402×590  → (레이아웃 프레임)
│  ├─ 27683:3209  [Text Set Title] Large   362×62   → TextSetTitle size="lg"
│  └─ 27683:3210  Plans                    362×232  → (레이아웃 프레임 · role=radiogroup)
│     ├─ 27683:3211  [List] Radio (selected) 362×72 → ListRadio isChecked
│     ├─ 27683:3212  List/Radio            362×72   → ListRadio
│     └─ 27683:3213  List/Radio            362×72   → ListRadio
├─ 27683:3214  Bottom                      402×83   → (레이아웃 프레임)
│  └─ 27683:3215  CTA                      402×83   → (레이아웃 프레임)
│     ├─ 27683:3216  Button                177×55   → Button variant="filled-secondary"
│     └─ 27683:3217  Button                177×55   → Button variant="filled-primary"
└─ 27683:3218  [OS Bar Bottom Navigation]  402×34   → OSBarBottomNavigation
```

이 파일이 직접 그리는 것은 **레이아웃 프레임 3개**뿐이고(`Contents` · `Plans` ·
`Bottom`→`CTA`), 그 프레임들이 갖는 시각 값은 패딩과 간격뿐이다.

## 넘긴 props

| 컴포넌트 | props | Figma 근거 |
|---|---|---|
| `OSBarTopNavigation` | 없음 (기본값) | `transparent=false, onFrameHigh=false` |
| `Header` | `title="요금제 선택"` | `get_design_context(27683:3206)` 가 `title="요금제 선택" hasSlotEnd={false}` 를 방출. `hasTitle` · `hasSlotStart` 는 기본 true, `hasSlotEnd` 는 기본 false 라 넘기지 않았다 |
| `Tab` | `items` 3개 · `selectedIndex` · `onSelect` | 세 `Tab/ Item` 인스턴스의 텍스트 오버라이드가 `5G` · `LTE` · `알뜰폰`. 첫 인스턴스(`I27683:3207;20:7649`)에만 `border` 자식과 `text/primary` 가 있다 = `isSelected` |
| `TextSetTitle` | `size="lg"` · `title` (2줄) | 인스턴스 이름이 `[Text Set Title] Large`, 방출된 타이포가 `font/title/large-strong` = `lg` 의 값이다. `hasDescription={false}` → `description` 을 넘기지 않는다 |
| `ListRadio` ×N | `isChecked` · `title` · a11y props | 세 인스턴스가 같은 세트이고 다른 축은 `isChecked` 하나뿐이다 |
| `Button` ×2 | `variant` · `className="flex-1"` · `isDisabled` | `hierarchy=secondary` / `primary`, 그리고 flex-grow 1 · basis 0. `isDisabled` 는 PRD 근거 (아래 참조) |
| `OSBarBottomNavigation` | 없음 (기본값) | 위와 같음 |

## 사용 토큰

| 토큰 | 유틸리티 | 쓰는 곳 | Figma 근거 |
|---|---|---|---|
| `--color-bg-secondary` | `bg-bg-secondary` | 페이지 배경 | `Header` 루트가 쓰는 `bg/secondary` 와 같은 값 |
| `--spacing-mobile-frame-width` | `w-mobile-frame-width` | 페이지 폭 402 | `Header` · `Tab` · 두 OSBar 가 이미 고정하는 폭 |
| `--spacing-32` | `pt-32` | `Contents` 상단 여백 | `27683:3208` padding-top 32 |
| `--spacing-20` | `px-20` · `pb-20` | 페이지 좌우 마진 · CTA 하단 | `27683:3208` · `27683:3215` |
| `--spacing-16` | `pt-16` | 타이틀 ↔ 리스트 | `27683:3210` padding-top 16 |
| `--spacing-8` | `gap-8` · `pt-8` | 두 CTA 사이 · CTA 상단 | `27683:3215` |

`spacing.tokens.css` 의 `--spacing-32` 주석이 이 화면을 그대로 지목한다 —
*"탭 하위 콘텐츠 시작 여백"*. **새로 추가한 토큰은 없다. 예외(`token-exempt`)도 0건이다.**

### 토큰이 아닌 클래스

| 클래스 | 왜 토큰이 아닌가 |
|---|---|
| `min-h-dvh` | 뷰포트 상대 단위. 874 는 기기 화면 높이라 컴포넌트가 정할 값이 아니다. `Login.tsx` 와 같은 방식 |
| `flex-1` | `Contents` 의 Figma 높이 590 = 874 − (62+56+49+83+34) 의 나머지. 제약이 아니라 배분 결과 |
| `flex` `flex-col` `w-full` `items-start` | 레이아웃 동작. 시각 값이 아니다 |

## 세로 배치 — 절대 좌표가 없다

Figma 의 y 좌표는 auto-layout 결과라서 옮기지 않았다. 선언된 패딩·간격만 옮기면 같은
좌표가 재현된다.

| Figma 노드 | 선언된 값 | 코드 |
|---|---|---|
| `Contents` 27683:3208 | padding-top 32 · left/right 20 | `pt-32 px-20` |
| `Plans` 27683:3210 | padding-top 16 | `pt-16` |
| `CTA` 27683:3215 | padding 8·20·20 · gap 8 | `pt-8 px-20 pb-20 gap-8` |

검산 — `Contents` 안에서 `TextSetTitle` 이 y=32 (= pt-32), `Plans` 가 y=94 (= 32 + 62),
그 안 첫 행이 y=16 (= pt-16), 둘째 y=88 (= 16 + 72), 셋째 y=160. `get_metadata` 좌표와 일치한다.
CTA 검산 — 402 − 20 − 20 − 8(gap) = 354, 354 / 2 = 177 = Figma 의 각 버튼 폭.

## Figma 와 PRD 가 어긋나는 곳

요청은 *"PRD 바탕으로 화면 구성"* 이므로 **동작은 PRD 를 따랐다.** 어긋난 지점 3건.

| # | Figma | PRD | 채택 | 이유 |
|---|---|---|---|---|
| 1 | 첫 행이 선택된 상태로 그려져 있다 (`27683:3211` = `[List] Radio (selected)`) | §6 시나리오 1 — *"라디오 미선택 상태"* | **PRD** | Figma 는 선택된 모습을 보여주기 위한 한 컷이고, 진입 상태를 규정한 것은 PRD 다. 그래서 최초 렌더가 Figma 스크린샷과 다르다 |
| 2 | `선택 완료` 가 활성으로 그려져 있다 | §6 시나리오 1 — *"'선택 완료' 버튼 비활성화"* | **PRD** | #1 의 결과다. Figma 는 선택된 상태의 컷이라 활성이 맞다. 미선택이면 비활성 |
| 3 | 행에 제목 한 줄만 있다 (`description=false`) | §4 — *"요금제명 + 월 요금"* | **Figma** | 요청자 결정: *"Figma 그대로 — 요금제명만"*. PRD 완료 기준 한 줄이 미달로 남는다 (아래 표) |

## 요금제 목록은 목업이다

Figma 의 세 행은 전부 `타이틀 영역입니다.` 자리표시자이고, PRD §5 는 `planList[]` 를
**서버가 내려주는 값**으로 적고 있다. 이 저장소에 그 서버가 없다.

자리표시자 3개를 그대로 두면 PRD 완료 기준 *"탭 전환 시 올바른 요금제 리스트가
표시된다"* 를 눈으로 확인할 수 없다. 그래서 **탭마다 다르다는 것만 알 수 있는 최소한의
목업**(`5G 요금제 A·B·C` 등 9건)을 `Benefit.tsx` 의 `MOCK_PLANS` 상수에 두었다.
**실제 상품명을 지어내지 않았다** — 그것은 확인되지 않은 값이다 (원칙 1).
서버 연동 시 이 상수를 통째로 교체한다.

`monthlyFee` 필드도 데이터에 넣지 않았다. 그리지 않는 값을 데이터에만 담아 두지 않는다 (원칙 2).

## a11y — 라디오 그룹의 의미론은 이 페이지가 갖는다

`ListRadio` 는 자기 문서에서 *"이 컴포넌트는 선택 가능한 행의 시각 표현이다.
`role="radio"` · `aria-checked` · 그룹핑(`role="radiogroup"`) · 키보드 조작은 호스트가
담당하며, 루트 `<div>` 에 props 가 전개되므로 호스트가 그 속성을 이 컴포넌트에 그대로
얹을 수 있다"* 고 선언한다. 그 계약대로 얹었다.

| 담당 | 무엇 |
|---|---|
| `Benefit.tsx` | `role="radiogroup"` · `aria-label` · 행마다 `role="radio"` · `aria-checked` · roving tabindex · ArrowUp/Down/Left/Right · Space |
| `ListRadio` | 행의 시각 표현 (라디오 글리프 · 제목 · 셰브론 · 구분선) |

포커스 이동은 `ListRadio` 에 ref 를 넘기는 대신 그룹 컨테이너에서 `[role="radio"]` 를
찾아 한다. `ListRadioProps` 에 `ref` 축이 없고, 이 화면 때문에 컴포넌트의 타입을 고치지
않기 위해서다 (원칙 3).

UA 기본 포커스 아웃라인을 끄지 않았다 — 대체 링을 그리는 값이 Figma 에 없다.

## PRD 완료 기준 대조

| PRD 완료 기준 | 결과 |
|---|---|
| 5G / LTE / 알뜰폰 탭 전환 시 올바른 요금제 리스트가 표시된다 | **충족** (목업 데이터 기준) |
| 각 항목에 요금제명과 월 요금이 정상 노출된다 | **미달** — 요금제명만. 요청자 결정 *"Figma 그대로"* |
| 라디오 버튼으로 단일 선택이 동작하고, 미선택 시 '선택 완료'가 비활성화된다 | **충족** |
| '선택 완료' 시 선택된 요금제 ID가 개통 신청서 화면에 정상 전달된다 | **미달** — 개통 신청서 화면이 이 저장소에 없다 (아래) |
| '뒤로가기' 시 이전 화면으로 복귀한다 | **충족** — `navigate(-1)` |

## 구현하지 않은 PRD 항목과 그 이유

| PRD | 왜 구현하지 않았나 |
|---|---|
| §6 시나리오 4 — 셰브론(>) 탭 시 상세 이동 | PRD 본문이 *"상세 동작은 추후 정의"* 라고 적고 있다. 갈 곳이 정해지지 않은 이동을 지어내지 않았다 (원칙 1) |
| §6 시나리오 5 — `선택 완료` → 개통 신청서 이동 | 개통 신청서 화면이 이 저장소에 없다. 라우트도 컴포넌트도 없어 `navigate` 대상이 존재하지 않는다. 버튼의 활성/비활성만 구현했다 |
| §6 시나리오 7 — 네트워크 오류 상태 | 데이터 소스가 없어 오류가 발생할 지점이 없다. 오류 화면도 Figma 에 없어 시각 값을 지어내야 한다 |
| §6 시나리오 8 — 빈 리스트 안내 | 문구(`가입 가능한 요금제가 없습니다`)는 PRD 에 있지만 **그 화면이 Figma 에 없다.** 타이포·여백·정렬을 지어내야 해서 넣지 않았다 (원칙 1) |
| §2 Should — 현재 사용 중인 요금제 뱃지 | Figma 에 그 표현이 없다. PRD §7 도 *"화면에 미반영"* 으로 확인 필요에 올려 두었다 |
| §2 Should — 리스트 스크롤 시 하단 CTA 고정 | Figma 는 리스트가 화면에 다 들어가는 3행 컷이라 스크롤 상태가 없다. 현재 구조에서도 `Contents` 가 `flex-1` 이라 CTA 는 항상 아래에 붙는다 |
| §2 Could 전부 (상세 펼침 · 비교) | 이번 범위 밖이라고 PRD 가 적고 있다 |

## 범위 밖이라 고치지 않고 보고한 것

- ~~**`Header` 의 뒤로가기 아이콘이 눌리지 않는다.**~~ **해소됨 (2026-08-25)** —
  `Header` 에 `onSlotStartClick` 축이 생겨(다른 작업에서 `SignIn` 을 위해 추가됐다)
  이제 연결할 수 있다. 아래 "추가: 헤더 뒤로가기 연결" 절 참조.
- **`Tab` 이 탭 ↔ 패널을 잇는 id 를 노출하지 않는다.** `Tab.tsx` 가 *"`aria-controls` 는
  넣지 않았다 — 어떤 패널을 제어하는지는 호출부만 알고, 이 컴포넌트가 추측할 수 없다"*
  고 적고 있고, 아이템별 props 를 받는 축도 없다. 그래서 리스트에 `role="tabpanel"` 을
  붙이지 않았다 — `aria-controls` 로 참조되지 않는 tabpanel 은 고아 노드가 된다.
  대신 리스트는 `role="radiogroup"` + `aria-label` 로 자기 이름을 갖는다.

## 남은 것

| 미검증 | 왜 |
|---|---|
| 브라우저에서의 실제 탭 전환 · 화살표 키 조작 · 포커스 링 | Chrome 확장이 연결되지 않았고 headless 브라우저가 devDependencies 에 없다. 의존성을 임의로 추가하지 않았다 |
| 스크린샷 픽셀 대조 | 위와 같은 이유. Storybook `Pages/Benefit` 스토리로 눈으로 볼 수 있다. 최초 상태는 위 [어긋나는 곳](#figma-와-prd-가-어긋나는-곳) #1·#2 때문에 Figma 컷과 다르다 (첫 행 미선택 · `선택 완료` 비활성) |

---

## 추가: 헤더 뒤로가기 연결 (2026-08-25)

요청자 결정: *"라우팅을 연결하고 ..."* + 선택지 확인 결과 *"Consent · Benefit 둘 다"*.
헤더(`27683:3206`)에 `onSlotStartClick={() => navigate(-1)}` 을 걸었다.

**하단 `뒤로가기` 버튼(`27683:3216`)과 같은 동작이다.** 다르게 하지 않은 이유:

- 둘 다 PRD `docs/prd-list` §3 · §6 시나리오 6 의 *"이전 화면(요금제 관리) 복귀"* 다.
  그 화면이 이 저장소에 없어 하단 버튼이 이미 `navigate(-1)` 로 옮겨져 있었다.
- 한 화면 안에서 같은 의도의 두 컨트롤이 다르게 동작하면 읽는 사람이 둘 중 하나를
  잘못된 것으로 읽는다.
- 하단 버튼을 `/consent` 같은 고정 경로로 바꾸는 것은 이번 요청 범위 밖이고
  PRD 와도 어긋난다 (원칙 3).

`Consent` 는 같은 자리에서 `navigate(-1)` 이 아니라 `/login` 을 고정했다.
**의도한 차이다** — 그 화면은 앞 화면이 `Login` 하나로 정해져 있고, 직접 URL 로 들어왔을 때
`-1` 이 앱 밖으로 나가는 것을 막아야 했다 (`SignIn.tsx` 가 세운 규칙). 반면 이 화면은
PRD 가 앞 화면을 이 저장소에 없는 "요금제 관리" 로 적고 있어 고정할 목적지가 없다.
근거 대조표는 `Consent.design.md` 의 "화면 이동" 절에 있다.

`선택 완료`(`27683:3217`)에는 여전히 이동이 없다 — 개통 신청서 화면이 이 저장소에 없다.
