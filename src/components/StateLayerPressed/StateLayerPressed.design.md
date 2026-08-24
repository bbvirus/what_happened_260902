# StateLayerPressed — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `StateLayerPressed.tsx`, 스토리는 `StateLayerPressed.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=35-12765&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27704:1745` — section "Button" |
| 프레임 | `35:12765` — "StateLayer/Pressed", 2415×164 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문):

> State Layer Pressed는 컴포넌트가 **눌린(pressed) 상태를 시각적으로 표현하기 위한 오버레이 요소입니다.**
> 사용자 입력 시 컴포넌트 위에 레이어 형태로 적용되며, 버튼, 카드, 컨트롤 등 인터랙션 가능한
> 요소의 눌림 상태를 전달하는 데 사용됩니다.

## 노드 구조

```
frame 35:12765  "StateLayer/Pressed"   2415×164   (variant 진열 프레임)
├─ 35:12786  "color=black, boundaryOut=false"  265×80
│  └─ 35:12787  "state area"   부모를 채움 (flex-1 / w-full)
├─ 35:12788  "color=black, boundaryOut=true"   265×80
│  └─ 35:12789  "state area"   absolute, inset -4px
├─ 35:12766  "color=white, boundaryOut=false"  265×80
│  └─ 35:12767  "state area"   부모를 채움
└─ 35:12768  "color=white, boundaryOut=true"   265×80
   └─ 35:12769  "state area"   absolute, inset -4px
```

각 variant 는 2단이다 — 바깥 265×80 프레임과 그 안의 `state area` 하나.
바깥 프레임은 fill 이 없어 시각 값을 갖지 않는다. **265×80 은 진열용 데모 박스 치수이지
컴포넌트 속성이 아니다** (Divider 의 360 과 같은 성격). 그래서 코드로 옮기지 않았고,
크기는 호스트가 정한다. 그리는 것은 `state area` 하나뿐이라 두 단을 한 요소로 합쳤다. (원칙 2)

`boundaryOut=false` 일 때만 바깥 프레임에 clip 이 걸려 있다(`overflow-clip`).
`boundaryOut=true` 는 clip 이 꺼져 있어 넘긴 부분이 보인다. 이 차이는 코드에서
**호스트의 책임**으로 넘겼다 — 아래 "Button 합성 조건" 참조.

## variant 축

`get_design_context` 가 반환한 시그니처 그대로다.

| 축 | 값 | Figma 기본값 |
|---|---|---|
| `color` | `black` \| `white` | `black` |
| `boundaryOut` | `false` \| `true` | `false` |

두 축 모두 값이 2개이므로 그대로 prop 으로 만들었다. 조합 4개 전부 스토리에 있다.
요청받지 않은 축·prop 은 추가하지 않았다. (원칙 2)

## 값의 출처

`불명`으로 남은 값은 없다. 추정한 값도 없다.

| 값 | 출처 | 결론 |
|---|---|---|
| 오버레이 색 (black) | Figma 변수 `stateLayer/pressed-black` = `#1a1a1a29` (`get_variable_defs` 35:12787) | 기존 토큰 `--color-state-layer-pressed-black` → `--dimmed-black-16` = `#1a1a1a29`. **값 일치 → 재사용** |
| 오버레이 색 (white) | Figma 변수 `stateLayer/pressed-white` = `#ffffff29` (`get_variable_defs` 35:12769) | 기존 토큰 `--color-state-layer-pressed-white` → `--dimmed-white-16` = `#ffffff29`. **값 일치 → 재사용** |
| 코너 반경 | Figma 변수 `radius/0` = `0`, `state area` 에 바인딩됨 (`get_variable_defs` 35:12787 · 35:12789) | 기존 토큰 `--radius-0` = `0`. 값 일치 → `rounded-0` |
| 위치 (`boundaryOut=false`) | `get_design_context`: `flex-[1_0_0] min-h-px w-full` — 부모를 정확히 채운다 | 오버레이이므로 `absolute inset-0` 로 옮겼다. `--spacing-0` = 0 |
| 위치 (`boundaryOut=true`) | `get_design_context`: `absolute inset-[-4px]` — **Figma 레이어 실측값. 변수 바인딩 아님** (해당 노드의 변수는 `radius/0` · `stateLayer/pressed-black` 뿐) | 기존 토큰 `--spacing-4` = `0.25rem` = 4px 와 **값 일치 → 재사용**. `-inset-4` |
| stroke | 4개 variant 모두 0건 | 코드에 들어갈 자리가 없다 |
| effect / shadow | 4개 variant 모두 0건 | 코드에 들어갈 자리가 없다 |
| 타이포 | 없음 (텍스트 레이어 0개) | 해당 없음 |

`-4px` 는 Figma 변수가 아니라 실측값이라는 점을 명시해 둔다. 기존 spacing 스케일에
같은 값이 이미 있어 새 토큰을 만들지 않았다. (원칙 2 — 기존 토큰으로 표현되는 값에
새 토큰을 만들지 않는다)

## 사용한 토큰

새로 추가한 토큰은 **없다.** 전부 기존 토큰 재사용이다.

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--color-state-layer-pressed-black` | `bg-state-layer-pressed-black` | 변수 `stateLayer/pressed-black` = `#1a1a1a29` |
| `--color-state-layer-pressed-white` | `bg-state-layer-pressed-white` | 변수 `stateLayer/pressed-white` = `#ffffff29` |
| `--radius-0` | `rounded-0` | 변수 `radius/0` = `0` |
| `--spacing-0` | `inset-0` | `boundaryOut=false` 의 "부모를 채움" |
| `--spacing-4` | `-inset-4` | `boundaryOut=true` 의 `inset: -4px` (실측값) |

빌드 산출 CSS(`dist/assets/index-BIyF-A02.css`)에서 실제로 확인한 값:

```
.bg-state-layer-pressed-black{background-color:var(--color-state-layer-pressed-black)}
.bg-state-layer-pressed-white{background-color:var(--color-state-layer-pressed-white)}
.rounded-0{border-radius:var(--radius-0)}
.inset-0{inset:var(--spacing-0)}
.-inset-4{inset:calc(var(--spacing-4) * -1)}

--color-state-layer-pressed-black:var(--dimmed-black-16);   --dimmed-black-16:#1a1a1a29;
--color-state-layer-pressed-white:var(--dimmed-white-16);   --dimmed-white-16:#ffffff29;
--spacing-4:.25rem;   --radius-0:0;
```

토큰이 아닌 유틸리티 3개와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `absolute` | 레이아웃 | Figma 설명의 "컴포넌트 위에 레이어 형태로 적용" 을 직역한 것. 치수 리터럴이 아니다 |
| `pointer-events-none` | 동작 | 오버레이가 호스트의 클릭·호버를 가로채면 pressed 상태 자체가 안 잡힌다 |
| `aria-hidden` | a11y | 순수 장식 요소다. 아래 a11y 항목 참조 |

### 스토리 (`StateLayerPressed.stories.tsx`)

호스트 박스는 Figma 노드가 아니라 오버레이를 눈으로 보기 위한 스토리 전용 장치다.
치수도 토큰으로만 짰다 (Figma 의 265×80 은 데모 치수라 옮기지 않았다).

| 토큰 | 유틸리티 |
|---|---|
| `--spacing-control-lg` | `h-control-lg` |
| `--spacing-100` | `w-100` |
| `--spacing-8` · `--spacing-24` · `--spacing-40` | `gap-8` · `p-24` · `gap-40` |
| `--radius-0` | `rounded-0` |
| `--color-bg-primary` · `--color-bg-tertiary` · `--color-bg-inverse` | `bg-bg-primary` · `bg-bg-tertiary` · `bg-bg-inverse` |
| `--color-text-primary` · `--color-text-secondary` · `--color-text-inverse` | `text-text-primary` · `text-text-secondary` · `text-text-inverse` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

## Button 합성 조건 (public API)

이 컴포넌트는 단독으로 쓰이지 않는다. 호스트가 지켜야 하는 조건은 아래 3개다.

| 조건 | 이유 |
|---|---|
| 호스트가 `relative` | 오버레이가 `absolute` 다. 아니면 조상 중 아무 positioned 요소에 붙는다 |
| 오버레이를 호스트의 **콘텐츠 앞** 자식으로 (라벨보다 먼저) | Figma 원본의 자식 순서다. 아래 "자식 순서" 참조 |
| `boundaryOut=false` 면 호스트에 `overflow-hidden` | Figma 원본이 그 variant 에만 clip 을 건다. `boundaryOut=true` 에는 걸면 안 된다 — 넘긴 부분이 잘려 두 variant 가 똑같아진다 |

### 자식 순서 — 정정 (2026-08-24)

**이 문서의 이전 판은 "오버레이를 호스트의 마지막 자식으로" 라고 적었다. 그것은 틀렸다.**
Figma 를 다시 읽어 확인한 결과 Pressed 레이어는 **콘텐츠보다 먼저** 온다.

근거 (`get_metadata` · `get_design_context`, 노드 id 포함):

| 노드 | 자식 순서 |
|---|---|
| `1:4055` (filled/primary, pressed) | `[State Layer] Pressed`(`1:4056`) → `content`(`1:4057`) |
| `1:4033` (filled/secondary, pressed) | 레이어(`1:4034`) → `content`(`1:4035`) |
| `1:4016` (ghost/secondary, pressed) | 레이어(`1:4017`) → `content`(`1:4018`) |

**세 스타일 전부 레이어가 콘텐츠 앞이다.** 예외 없다.

**왜 그런가**: Pressed 레이어는 호스트 전체를 덮는 16% 불투명 오버레이다. 라벨 뒤에 두면
(= 마지막 자식) 라벨까지 함께 어두워진다. 앞에 두면 오버레이가 **fill 과 라벨 사이**에
놓여, 배경만 눌린 것처럼 어두워지고 라벨은 원래 대비를 유지한다. Figma 가 고른 쪽이 후자다.

**Focused 와 다른 이유**: 포커스 링은 `outerFocus=true` 로 경계 **밖** `-4px` 에 그려져
콘텐츠와 겹치는 영역이 아예 없다. 그래서 순서가 시각적으로 무의미하고, 실제로 Figma 파일도
일관돼 있지 않다 — `1:4049`(primary/focused)는 `content` → 링, `1:4027`·`1:4010`
(secondary/focused)는 링 → `content` 다. Pressed 처럼 "반드시 앞" 인 제약이 아니다.

**구현은 바뀌지 않았다.** 이 컴포넌트는 여전히 크기 없는 `absolute` 오버레이이고
자식 순서는 호스트가 정한다. 틀렸던 것은 문서이지 코드가 아니다.

**코너 반경 주의.** Figma 의 `state area` 는 `radius/0` 에 바인딩돼 있어 이 컴포넌트의
기본 반경은 0 이다. 둥근 모서리를 가진 호스트에 그대로 얹으면 직각 오버레이가
모서리 밖으로 삐져나온다.

**이 컴포넌트에 반경 prop 을 만들지 않았다** — Figma 에 그런 축이 없기 때문이다 (원칙 2).
대신 **호스트가 `className` 으로 반경 유틸리티를 넘겨 기본값을 덮을 수 있다.**
`className` 은 기본 클래스 뒤에 붙고, 판정은 클래스 속성 순서가 아니라 스타일시트 순서가
한다 (`--radius-0` 이 `--radius-4` 보다 먼저 선언돼 있어 `.rounded-4` 가 뒤에 온다).

Button 이 실제로 그렇게 한다 — `Button.tsx` 가 이 오버레이에 `rounded-4` 를 넘긴다.
왜 클립만으로는 부족한지(포커스 링을 내보내려고 클립이 풀리는 순간이 있다),
그리고 그 결과가 Figma 원본과 같은 픽셀인지에 대한 판단은 **호스트 측 결정이라
`Button.design.md` 의 "clip 과 반경의 충돌 — 해결" 절이 정본이다.** 여기서 되풀이하지 않는다.

`boundaryOut=true` 를 클립할 수 없는 문제는 **Button 에서 발생하지 않는다.** Button 의
pressed 3종은 전부 `boundaryOut=false` 를 쓴다 (중첩 인스턴스 id `I1:4056;35:12787` ·
`I1:4034;35:12767` · `I1:4017;35:12787` — 모두 `boundaryOut=false` variant 의 `state area`).
즉 Figma 는 "클립되는 레이어" 와 "클립할 수 없는 레이어" 를 한 버튼에 동시에 쓰지 않는다.

## a11y

`aria-hidden` 을 기본으로 붙인다. 이 요소는 텍스트도 라벨도 없는 순수 장식이고,
전달하려는 상태(눌림)는 호스트 버튼의 네이티브 상태가 이미 보조기술에 알린다.
props 를 전개하므로 호출부가 덮어쓸 수 있다.

`<span>` 을 쓴 이유는 `<button>` 의 콘텐츠 모델이 phrasing content 라서다.
`<div>` 를 넣으면 버튼 안에서 무효한 마크업이 된다.

## Code Connect

`get_design_context`(35:12765) 응답에 Code Connect 매핑이 없었다.
매핑 생성은 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 최종 파일 차단 0건 (초안의 주석에 들어간 `#1a1a1a29` · `4px` 5건을 hook 이 차단했고, 값 표기를 이 문서로 옮겨 해소했다) |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 (`✓ 30 modules transformed` · `✓ built in 317ms`) |
| 빌드 CSS 값 대조 | 위 "사용한 토큰" 블록 참조. 토큰 4종의 최종 값이 Figma 변수 값과 전부 일치 |
| `get_screenshot`(35:12765) 대조 | 회색 배경 위 사각형 4개. 왼쪽 2개(black)는 배경보다 어둡고 오른쪽 2개(white)는 밝다. 반경 없는 직각이다. 구현의 4개 조합과 형태·명암 방향이 일치 |
