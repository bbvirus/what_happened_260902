# Tab — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `Tab.tsx`, 스토리는 `Tab.stories.tsx`.
하위 컴포넌트 `TabItem` 의 근거는 `../TabItem/TabItem.design.md` 에 있다.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=20-7647&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27776:6988` — section "Tab", 1657×449 (요청자가 선택한 영역) |
| 컴포넌트 | `20:7647` — symbol "Tab", 402×49 |
| 추출 | `get_metadata`(27776:6988 · 20:7647) · `get_design_context`(20:7647) · `get_variable_defs`(27776:6988) (2026-08-24) |

## 노드 구조

```
symbol 20:7647  "Tab"  402×49   padding-x = spacing/20
├─ frame    20:7648  "divider"    x=0      y=0  402×49   bottom stroke = border/primary
├─ instance 20:7649  "Tab/ Item"  x=20     y=0  120.667×49   isSelected=true
├─ instance 20:7650  "Tab/ Item"  x=140.667 y=0 120.667×49
└─ instance 20:7651  "Tab/ Item"  x=261.333 y=0 120.667×49
```

산술 확인: `20 + 120.667×3 + 20 = 402` — 아이템 3개가 좌우 패딩 20 을 뺀
362 를 3등분한다 (362 나누기 3 = 120.667). 즉 폭은 값이 아니라 **등폭 분배의 결과**다.

## 하위 컴포넌트 인스턴스 — 1종 3개

| Figma 인스턴스 | 세트 | 저장소 컴포넌트 | 새로 만들었나 |
|---|---|---|---|
| `20:7649` · `20:7650` · `20:7651` | `20:7623` Tab/ Item | `src/components/TabItem` | 예 — 이 작업에서 함께 구현 (①) |
| `20:7648` divider (노드 이름·값이 동일) | `20:5645` Divider 와 같은 값 | `src/components/Divider` | 아니오 — 재사용 |

**의존성 순서**: `TabItem` → `Tab`. `TabItem` 은 다시 기존 `StateLayerPressed` ·
`StateLayerFocused` 에 의존하며 그 둘은 이미 저장소에 있다.

## variant 조사 결과 — variant 도 component property 도 없다

`get_design_context`(20:7647) 가 방출한 시그니처는 `Tab({ className })` 하나이고
property 목록이 비어 있다. `get_metadata` 의 이름도 variant 형식(`a=b, c=d`)이 아니라
그냥 `Tab` 이다. 즉 이 컴포넌트 자체에는 축이 없다.

**축이 없는 것과 데이터가 없는 것은 다르다.** Figma 는 이 컨테이너 안에서 세 인스턴스에
인스턴스 오버라이드를 건다 — `text`(라벨) 3건과 `isSelected=true` 1건, 그리고 세 인스턴스
모두에 grow. 코드의 `items` · `selectedIndex` 는 그 오버라이드 자리를 그대로 옮긴 것이지
새로 만든 축이 아니다.

`onSelect` 만은 Figma 노드에 대응이 없다. 요청자 확인을 거쳐 넣었다 —
근거는 아래 `## onSelect` 에 적었다.

## 값의 출처

| 값 | Figma 원값 | 출처 | 토큰 | 결론 |
|---|---|---|---|---|
| 좌우 패딩 | 20 | 변수 `spacing/20` | `--spacing-20` = `1.25rem` = 20px | 값 일치 → 재사용 (`px-20`) |
| 폭 | 402 | `get_design_context` 가 루트에 고정 폭 방출 (`w-full` 아님) | `--spacing-mobile-frame-width` = `25.125rem` = 402px | 값 일치 → 재사용 (`w-mobile-frame-width`, 아래 참조) |
| 구분선 색 | `#ebebeb` | 변수 `border/primary` | `--color-border-primary` → `--neutral-gray-light-100` = `#ebebeb` | 값 일치 → 기존 `Divider` 가 그린다 |
| 구분선 두께 | 가장 얇은 선 | 20:7648 의 bottom stroke | `--spacing-hairline` = `0.0625rem` = 1px | 기존 `Divider` 재사용 |
| 구분선 위치 | 박스 안쪽 마지막 줄 | `get_screenshot`(20:7647) 픽셀 — 렌더 402×49 의 y=48 행 (아래 참조) | `--spacing-0` | `bottom-0` |
| 루트 fill | 없음 | 20:7647 에 fill 0건 | — | 배경 유틸리티가 들어갈 자리가 없다 |
| 루트 반경 | 없음 | 코너 반경 없음 | — | 반경 유틸리티가 들어갈 자리가 없다 (`design-tokens.css` 의 *"radius/0 · Tab"* 메모와 일치) |
| 높이 49 | 아이템 높이 | 아이템의 hug 결과 | — | 높이 토큰을 쓰지 않는다 (`TabItem.design.md` 참조) |
| 아이템 폭 120.667 | (402 − 40) 나누기 3 | 등폭 분배 결과 | — | 폭 토큰을 쓰지 않는다. `flex-1` |

이 컴포넌트가 요구한 **신규 토큰은 0건**이다. 신규 토큰 2건은 전부 `TabItem` 쪽이다.
`불명`으로 남은 값은 없다.

## 폭 402 는 이 컴포넌트가 고정한다

`Header` 와 같은 판정이고, 근거 3건이 일치한다.

1. `get_design_context`(20:7647) 가 루트에 고정 폭을 방출한다 — `w-full` 이 아니다.
2. `spacing.tokens.css` 의 `--spacing-mobile-frame-width` 가 이미 402 를
   "모바일 프레임 폭" 으로 정의해 두었다.
3. 요청자 결정이 이미 기록돼 있다 — *"모바일 402 너비용 아이폰 17 해상도 디자인의
   컴포넌트라서 그거에 맞게 너비 고정"* (`Header.design.md`).

`Divider` 가 360 을 배치값으로 보고 `w-full` 로 옮긴 것과 결론이 반대인 이유:
그쪽은 Figma 가 자식 사각형에 `layoutSizingHorizontal: FILL` 을 **명시**했고,
여기서는 루트에 고정 폭이 나온다. 판정 근거가 다르므로 결론이 다른 것이지
기준이 흔들린 것이 아니다.

## 구분선 위치 — 픽셀이 codegen 을 반증했다

`get_metadata` 는 `divider`(20:7648)를 x=0 y=0 402×49 로 읽는다 — 컨테이너를 꽉 채우는
프레임이고, 선을 그리는 것은 그 프레임의 **아래쪽 stroke** 다.
`get_design_context` 는 같은 노드를 `bottom` 이 음수 한 단계인 절대 배치로 방출한다.
그것만 보면 stroke 정렬이 바깥쪽이라 선이 박스 **밖**에 놓이는 것처럼 읽히고,
최초 구현은 실제로 그렇게 했다 (`-bottom-hairline`). **그것이 틀렸다.**

`get_screenshot`(20:7647) 의 렌더(402×49, 원본 크기 그대로)를 행 단위로 읽으면
선은 박스 **안쪽 마지막 줄**에 있다.

| y | x=0..19 | x=20..140 | x=141..401 | 읽는 법 |
|---|---|---|---|---|
| 0 | `#d0d0d0` | `#d0d0d0` | `#d0d0d0` | 전 폭이 섹션 캔버스 색 → **루트에 fill 이 없다** |
| 44 · 45 · 46 | `#d0d0d0` | `#d0d0d0` | `#d0d0d0` | 이 구간에 선이 없다 |
| 47 | `#d0d0d0` | `#1a1a1a` | `#d0d0d0` | 선택 표시선의 **윗 줄**. 구분선은 아직 없다 |
| 48 | `#ebebeb` | `#1a1a1a` | `#ebebeb` | 구분선(`border/primary`)의 **유일한 줄**. 선택 구간만 표시선 색 |

읽히는 것 3가지:

1. 구분선은 렌더 안의 마지막 줄(y=48)이다 → `bottom-0`. 박스 밖이 아니다.
2. 두께는 한 줄뿐이다 (y=47 에는 없다) → `--spacing-hairline` 로 맞다.
3. **선택된 탭 구간에서 구분선이 표시선에 덮인다** — y=48 의 x=20..140 이
   `#1a1a1a` 다. 겹침은 코드가 만드는 것이 아니라 Figma 의 실제 렌더가 그렇다.
   표시선(두께 2)이 y=47..48 을 차지하고 구분선(y=48)의 그 구간을 덮는다.

즉 codegen 의 음수 `bottom` 은 Figma stroke 를 CSS `border-b` 로 옮기면서 생긴
표현이지 위치의 근거가 아니었다. 렌더 픽셀을 근거로 채택했다 (원칙 1 — 확인한 것만 넣는다).

DOM 순서도 이 겹침과 맞물린다. 구분선이 먼저 오고 아이템이 뒤에 오며, 아이템 루트가
`relative` 라 나중에 칠해진다. 표시선이 구분선 위에 놓인다.

`get_design_context` 는 루트에도 같은 아래 테두리를 한 번 더 방출한다. 그러나
`get_metadata` 가 읽은 실제 자식은 `divider` 노드 하나뿐이므로 **선을 두 번 그리지 않았다.**
codegen 이 자식의 stroke 를 부모에도 평탄화해 낸 중복으로 판단했다.

## 구분선은 기존 `Divider` 를 재사용한다

Figma 의 자식 노드 이름 자체가 `divider` 이고, 값이 기존 컴포넌트와 같다 —
`border/primary` × 가장 얇은 선 × 폭 전체. 새로 그리지 않는다 (원칙 2).

`aria-hidden` 을 넘기는 이유는 `role="tablist"` 가 소유할 수 있는 자식이 `role="tab"`
뿐이기 때문이다. `<hr>` 은 암묵으로 `role="separator"` 라서 접근성 트리에 남으면
tablist 의 소유 규칙(`aria-required-children`)을 깬다. 순수 장식이므로 트리에서 뺀다.
`Divider.design.md` 가 *"장식 목적으로만 쓰이는 자리에서는 호출부가 `aria-hidden` 을
넘겨 덮어쓸 수 있다"* 고 미리 열어 둔 경로를 그대로 쓴 것이다 — 그 컴포넌트를
고치지 않았다 (원칙 3).

## 등폭 분배는 컨테이너가 건다

Figma 도 같다. `Tab/ Item` 세트 자체는 hug 폭(71)이고, 120.667 은 이 컨테이너 안에
놓인 인스턴스의 오버라이드 결과다. `get_design_context` 도 grow 를 세 인스턴스에만
방출하고 세트에는 방출하지 않는다.

`min-w-0` 은 Figma 가 방출한 최소폭을 옮긴 것이다. 원본은 1 이지만 그 값의 목적은
flex 항목의 `min-width:auto` 를 푸는 것이고 그 관용 표현은 0 이다 (`--spacing-0`).
치수 결정이 아니라 레이아웃 리셋이라 1 을 그대로 옮기지 않았다.
`Header` 가 같은 자리에서 내린 것과 같은 판단이고, Tailwind 코어의 `min-w-px` 를
쓰지 않는 이유도 같다 — 그것은 hook 이 잡지 못하는 raw 1px 이다.

## API 결정 — `items` · `selectedIndex` · `onSelect`

구현 전에 요청자에게 두 안(`items` 기반 / `children` 합성)을 올렸고
**`items` + `selectedIndex` + `onSelect`** 로 확정됐다.

| prop | Figma 대응 | 성격 |
|---|---|---|
| `items` | 세 인스턴스의 `text` 오버라이드 | 데이터 자리를 그대로 옮김 |
| `selectedIndex` | 20:7649 의 `isSelected=true` 오버라이드 | 같음 |
| `onSelect` | 없음 | 아래 참조 |

### onSelect

`Tab` 자체에는 component property 가 없지만, 하위 `Tab/ Item` 세트에는
`state=pressed` · `state=focused` 축이 있다. 즉 **이 컴포넌트의 아이템이 눌리고
포커스를 받는다는 것은 Figma 가 이미 정의한 사실**이고, 추측이 아니다.
그 상호작용에 도달할 경로가 없으면 Figma 가 정의한 두 상태가 코드에서 재현되지
않으므로 최소 핸들러 하나만 두었다. 선택 상태 자체는 이 컴포넌트가 갖지 않는다 —
`selectedIndex` 를 호출부가 쥔다 (제어 컴포넌트).

`variant` · 크기 · 정렬 같은 축은 만들지 않았다. Figma 에 없다 (원칙 2).

## 사용한 토큰

### 컴포넌트 (`Tab.tsx`)

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--spacing-20` | `px-20` | 변수 `spacing/20` = 20 |
| `--spacing-mobile-frame-width` | `w-mobile-frame-width` | 루트 20:7647 의 width = 402 |
| `--spacing-0` | `inset-x-0` · `bottom-0` · `min-w-0` | 구분선이 좌·우·하 경계에 붙는다 (렌더 y=48) / flex 최소폭 리셋 |

간접 사용 (하위 컴포넌트가 그린다): `--color-border-primary` · `--spacing-hairline`
(`Divider`), 그리고 `TabItem` 이 쓰는 토큰 전부 (`TabItem.design.md` 참조).

토큰이 아닌 유틸리티와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `relative` | 레이아웃 | 구분선의 절대 배치를 받는 기준 상자 |
| `absolute` | 레이아웃 | Figma 20:7648 의 절대 배치를 직역 |
| `flex` · `items-center` | 레이아웃 | Figma 루트의 가로 auto-layout · 세로 가운데 정렬을 직역 |
| `flex-1` | 레이아웃 | Figma 인스턴스 3개의 grow 오버라이드를 직역 |

### 스토리 (`Tab.stories.tsx`)

시각 유틸리티를 쓰지 않는다 — 컴포넌트를 그대로 세우고 `layout: 'padded'` 만 쓴다.

**선택 상태는 스토리가 쥔다.** `Tab` 이 제어 컴포넌트라 `selectedIndex` 를 고정 arg 로
넘기면 눌러도 화면이 바뀌지 않는다. 그 "호출부" 역할을 스토리가 맡도록
`meta.render` 에 래퍼(`ControlledTab`)를 두어 모든 스토리가 같은 배선을 거친다.
컴포넌트 파일은 이 배선 때문에 바뀌지 않았다 — 요청자 확인 결과
**컴포넌트 API 를 유지하고 스토리에만 배선**하기로 확정됐다 (원칙 2·3).

래퍼가 하는 일 3가지:

| 하는 일 | 이유 |
|---|---|
| `selectedIndex` arg 를 초기값으로 삼아 내부 상태를 둔다 | 클릭으로 선택이 옮겨가게 한다 |
| arg 가 바뀌면 그 값으로 되돌린다 (`useEffect`) | 이것이 없으면 Controls 패널의 `selectedIndex` 를 움직여도 화면이 그대로다 — 고친 것과 같은 증상이 컨트롤 쪽에서 되풀이된다 |
| `onSelect` arg 를 그대로 호출한다 | 배선이 Actions 로거를 삼키지 않는다 |

## a11y

- 루트 `role="tablist"` + 자식 `role="tab"` 은 이 컴포넌트 이름과 구조에 대응하는
  표준 패턴이다. `aria-selected` 는 `TabItem` 이 `isSelected` 축에서 내보낸다.
- `aria-controls` 는 넣지 않았다. 어떤 패널을 제어하는지는 호출부만 안다 (원칙 1).
- 구분선은 `aria-hidden` 이다 (위 참조).
- 키보드 좌우 화살표 이동(APG 의 tablist 권장 동작)은 **구현하지 않았다.**
  Figma 에 대응하는 정의가 없고 요청 범위 밖이다. 현재는 Tab 키로 각 아이템에
  차례로 포커스가 간다. 필요하면 별도 요청으로 다룬다 (원칙 3 — 발견한 것은 보고만 한다).

## Code Connect

`get_design_context`(20:7647) 응답에 Code Connect 매핑이 없다. 매핑 생성은 이 작업의
요청 범위 밖이라 보고만 한다 (원칙 3).
매핑을 원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `20:7647`).

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 |
| 빌드 CSS 값 대조 | 번들(`dist/assets/*.css`)에서 확인: `.w-mobile-frame-width{width:var(--spacing-mobile-frame-width)}` · `--spacing-mobile-frame-width:25.125rem` (= 402px) · `.px-20{padding-inline:var(--spacing-20)}` · `.inset-x-0{inset-inline:var(--spacing-0)}` · `.bottom-0{bottom:var(--spacing-0)}` · `.min-w-0{min-width:var(--spacing-0)}` · `.h-hairline{height:var(--spacing-hairline)}` · `--spacing-hairline:.0625rem` · `.bg-border-primary` |
| `get_screenshot`(20:7647) 픽셀 대조 | 위 `## 구분선 위치` 표 참조. 루트 fill 없음 · 구분선 1줄 · 표시선 2줄 · 겹침까지 원본과 일치 |
