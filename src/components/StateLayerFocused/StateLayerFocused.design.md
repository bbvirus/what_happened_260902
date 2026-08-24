# StateLayerFocused — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `StateLayerFocused.tsx`, 스토리는 `StateLayerFocused.stories.tsx`.

> **이전 호출에서 BLOCKED 였던 지점은 해소됐다.** 선 두께 1px 을 토큰 유틸리티로
> 내보낼 경로가 없어 구현을 보류했었다. `token-guardian` 이 `spacing.tokens.css` 에
> `@utility border-hairline { border-width: var(--spacing-hairline); }` 를 추가해
> 경로가 열렸다. **새 값이 아니라 새 경로다** — 기존 `--spacing-hairline` 을 그대로 읽는다.
> 지금은 산출물 4/4 를 모두 갖췄다.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=35-12806&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27704:1745` — section "Button" |
| 프레임 | `35:12806` — "StateLayer/Focused", 1222×164 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문):

> State Layer Focused는 컴포넌트가 **포커스(focused) 상태일 때 적용되는 시각적 상태 표현 요소입니다.**
> 키보드 탐색 또는 포커스 이동 시 요소의 경계를 강조하여, 현재 상호작용 가능한 위치를
> 사용자에게 명확하게 전달하는 데 사용됩니다.

## 노드 구조

```
frame 35:12806  "StateLayer/Focused"   1222×164   (variant 진열 프레임)
├─ 35:12809  "radius=small, outerFocus=false"  265×80   (overflow-clip)
│  └─ 35:12810  "state area"   부모를 채움 (flex-1 / w-full)
│                border 1px solid state/focused · radius 4 · fill 없음
└─ 35:12817  "radius=small, outerFocus=true"   265×80   (clip 없음, radius 4)
   └─ 35:12818  "state area"   absolute, inset -4px
                 border 1px solid state/focused · radius 4 · fill 없음
```

각 variant 는 2단이다 — 바깥 265×80 프레임과 그 안의 `state area` 하나.
바깥 프레임은 시각 값을 갖지 않고 **265×80 은 진열용 데모 박스 치수이지 컴포넌트
속성이 아니다** (Divider 의 360, Pressed 의 265×80 과 같은 성격). 코드로 옮기지 않았고
크기는 호스트가 정한다. 그리는 것은 `state area` 하나뿐이라 두 단을 한 요소로 합쳤다. (원칙 2)

`outerFocus=false` 일 때만 바깥 프레임에 clip 이 걸려 있다. `outerFocus=true` 는 clip 이
꺼져 있어 경계 밖에 그린 링이 보인다. 이 차이는 코드에서 **호스트의 책임**으로 넘겼다 —
아래 "Button 합성 조건" 참조.

## variant 축 — `radius` 를 prop 으로 만들지 않는다

`get_design_context` 가 반환한 시그니처는 `{ outerFocus?: boolean; radius?: "small" }` 다.

| 축 | Figma 값 | 결정 |
|---|---|---|
| `outerFocus` | `false` \| `true` | **prop 으로 만든다.** 값이 2개이고 위치(inset)가 실제로 달라진다 |
| `radius` | `small` **하나뿐** | **prop 으로 만들지 않는다.** 근거는 아래 |

`radius` 를 prop 으로 만들지 않은 근거:

1. **값이 하나뿐인 축은 분기를 만들지 않는다.** 두 variant 모두 코너 반경이 같은
   변수 `radius/4` 에 바인딩돼 있다 (`get_variable_defs` 35:12810 · 35:12818 — 둘 다 `radius/4`).
   `radius="small"` 은 항상 같은 값으로 해석되므로 prop 으로 노출해도 호출부가
   바꿀 수 있는 것이 없다. 쓰이지 않는 옵션이 유지비로만 남는다. (원칙 2)
2. **"나중에 medium/large 가 생길 것 같아서" 는 근거가 아니다.** CLAUDE.md 원칙 2 가
   명시적으로 배제한 사유다. Figma 에 축이 늘어나면 그때 추가한다.
3. Divider 가 같은 판단을 했다 — `componentPropertyDefinitions` 가 비어 있어 prop 을
   두지 않았고 근거를 `Divider.design.md` 에 남겼다. 이 저장소의 기존 판단과 일관된다.

**축이 없는 것이지 값이 없는 것이 아니다.** `radius/4` 는 상수로 코드에 들어간다 (`rounded-4`).

## 값의 출처

`불명`으로 남은 값은 없다. 추정한 값도 없다.

| 값 | 출처 | 결론 |
|---|---|---|
| 테두리 색 | Figma 변수 `state/focused` = `#1a1a1a` (`get_variable_defs` 35:12810 · 35:12818) | 기존 토큰 `--color-state-focused` → `--bw-light-black` = `#1a1a1a`. **값 일치 → 재사용** (`border-state-focused`) |
| 테두리 두께 | `get_design_context` 가 `border`(= 1px) 로 반환. **Figma 변수 바인딩 없음** — 해당 노드의 변수는 `radius/4` · `state/focused` 둘뿐이다. Figma 레이어 실측값 | 기존 토큰 `--spacing-hairline` = `0.0625rem` = 1px 와 **값 일치 → 재사용**. `token-guardian` 이 연 `border-hairline` 유틸리티로 내보낸다 |
| 테두리 스타일 | `border-solid` | 실선. `border-solid` (스타일 키워드, 시각 값 아님) |
| 코너 반경 | Figma 변수 `radius/4` = `4` | 기존 토큰 `--radius-4` = `0.25rem` = 4px. **값 일치 → 재사용** (`rounded-4`) |
| 위치 (`outerFocus=false`) | `get_design_context`: `flex-[1_0_0] min-h-px w-full` — 부모를 정확히 채운다 | 오버레이이므로 `absolute inset-0` 로 옮겼다. `--spacing-0` = 0 |
| 위치 (`outerFocus=true`) | `get_design_context`: `absolute inset-[-4px]` — **실측값, 변수 아님** | 기존 토큰 `--spacing-4` = `0.25rem` = 4px 와 **값 일치 → 재사용**. `-inset-4` |
| fill | 두 variant 모두 없음 | 안쪽은 투명하다. 배경 유틸리티가 들어갈 자리가 없다 |
| effect / shadow | 두 variant 모두 0건 | 코드에 들어갈 자리가 없다 |
| 타이포 | 없음 (텍스트 레이어 0개) | 해당 없음 |

두께와 `-4px` 이 Figma 변수가 아니라 실측값이라는 점을 명시해 둔다. 두 값 모두 기존 토큰에
같은 값이 이미 있어 **새 토큰을 만들지 않았다.** (원칙 2 — 기존 토큰으로 표현되는 값에
새 토큰을 만들지 않는다)

## 사용한 토큰

새로 추가된 **값**은 없다. `border-hairline` 은 기존 `--spacing-hairline` 을 읽는 새 경로다.

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--color-state-focused` | `border-state-focused` | 변수 `state/focused` = `#1a1a1a` |
| `--spacing-hairline` | `border-hairline` | `state area` 의 테두리 두께 1px (실측값) |
| `--radius-4` | `rounded-4` | 변수 `radius/4` = `4` |
| `--spacing-0` | `inset-0` | `outerFocus=false` 의 "부모를 채움" |
| `--spacing-4` | `-inset-4` | `outerFocus=true` 의 `inset: -4px` (실측값) |

빌드 산출 CSS(`dist/assets/index-BIyF-A02.css`)에서 실제로 확인한 값:

```
.border-hairline{border-width:var(--spacing-hairline)}
.border-state-focused{border-color:var(--color-state-focused)}
.border-solid{--tw-border-style:solid;border-style:solid}
.rounded-4{border-radius:var(--radius-4)}
.inset-0{inset:var(--spacing-0)}
.-inset-4{inset:calc(var(--spacing-4) * -1)}

--spacing-hairline:.0625rem;
--color-state-focused:var(--bw-light-black);   --bw-light-black:#1a1a1a;
--radius-4:.25rem;   --spacing-4:.25rem;
```

**Tailwind 코어 `border`(= 1px) 는 쓰지 않았다.** hook 은 클래스명이라 통과시키지만
토큰을 우회한 값이고, `border-hairline` 이 만들어진 이유가 바로 그것을 막기 위해서다.
`className` 에 들어간 것은 `border-hairline border-solid border-state-focused` 세 개뿐이며,
두께·스타일·색이 직교하게 분리돼 있다.

토큰이 아닌 유틸리티 3개와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `absolute` | 레이아웃 | Figma 설명의 "요소의 경계를 강조" + `state area` 의 absolute 배치를 직역한 것. 치수 리터럴이 아니다 |
| `pointer-events-none` | 동작 | 링이 호스트의 클릭·호버를 가로채면 포커스 상태 자체가 안 잡힌다 |
| `aria-hidden` | a11y | 순수 장식 요소다. 아래 a11y 항목 참조 |

### 스토리 (`StateLayerFocused.stories.tsx`)

호스트 박스는 Figma 노드가 아니라 링을 눈으로 보기 위한 스토리 전용 장치다.
치수도 토큰으로만 짰다 (Figma 의 265×80 은 데모 치수라 옮기지 않았다).

| 토큰 | 유틸리티 |
|---|---|
| `--spacing-control-lg` | `h-control-lg` |
| `--spacing-100` | `w-100` |
| `--spacing-8` · `--spacing-24` · `--spacing-40` | `gap-8` · `p-24` · `gap-40` |
| `--radius-4` | `rounded-4` |
| `--color-bg-primary` · `--color-bg-tertiary` | `bg-bg-primary` · `bg-bg-tertiary` |
| `--color-text-primary` · `--color-text-secondary` | `text-text-primary` · `text-text-secondary` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

스토리는 variant 2개 조합을 전부 노출한다 — `InnerFocus`(35:12809) · `OuterFocus`(35:12817) ·
둘을 나란히 두는 `AllVariants`. `parameters.design.url` 에는 실제 노드 URL(`node-id=35-12806`)이 들어간다.

## Button 합성 조건 (public API)

이 컴포넌트는 단독으로 쓰이지 않는다. 호스트가 지켜야 하는 조건은 아래 3개다.

| 조건 | 이유 |
|---|---|
| 호스트가 `relative` | 링이 `absolute` 다. 아니면 조상 중 아무 positioned 요소에 붙는다 |
| 자식 순서는 **무관하다** | 링이 콘텐츠와 겹치지 않는다. 아래 "자식 순서" 참조 |
| `outerFocus=false` 면 호스트에 `overflow-hidden`, `true` 면 **걸지 않는다** | Figma 원본이 그 variant 에만 clip 을 건다. `outerFocus=true` 에 걸면 경계 밖 링이 잘려 두 variant 가 똑같아진다 |

### 자식 순서 — 정정 (2026-08-24)

**이 문서의 이전 판은 "링을 호스트의 마지막 자식으로" 라고 적었다. 그것은 과장이었다.**
`1:4049` 하나만 보고 규칙으로 일반화한 것이고, Figma 를 더 읽어 보니 일관돼 있지 않다.

| 노드 | 자식 순서 |
|---|---|
| `1:4049` (filled/primary, focused) | `content`(`1:4050`) → 링(`1:4054`) |
| `1:4027` (filled/secondary, focused) | 링(`1:4028`) → `content`(`1:4029`) |
| `1:4010` (ghost/secondary, focused) | 링(`1:4011`) → `content`(`1:4012`) |

**세 스타일이 서로 다르다.** 그래서 "마지막 자식" 은 규칙이 아니다.

**왜 무관한가**: 링은 `outerFocus=true` 로 호스트 경계 **밖** 한 단계에 그려진다.
콘텐츠가 차지하는 영역과 겹치는 픽셀이 하나도 없으므로, 앞에 두든 뒤에 두든 결과가 같다.
Figma 파일이 일관되지 않은 것도 그래서 눈에 띄지 않았을 것이다.

이 점이 **Pressed 와 결정적으로 다르다.** Pressed 레이어는 호스트 전체를 덮는 반투명
오버레이라 콘텐츠와 완전히 겹치고, 순서가 라벨 명암을 바꾼다. 그래서 Pressed 는
"콘텐츠보다 먼저" 가 지켜야 하는 조건이고 (`StateLayerPressed.design.md` 참조),
Focused 는 조건이 아니다.

**구현은 바뀌지 않았다.** 틀렸던 것은 문서이지 코드가 아니다.

### Figma 에서 실제로 확인한 Button 사용법

추정이 아니라 `get_metadata`(1:4049) · `get_design_context`(1:4049) 로 읽은 사실이다.

- Button `state=focused` 는 이 컴포넌트를 **`outerFocus=true` 로 쓴다.**
  중첩 인스턴스 id 가 `I1:4054;35:12818` 이고, `35:12818` 은 `outerFocus=true` variant 의
  `state area` 다. 코드도 `inset-[-4px]` 로 나온다.
- **Button 루트에 `overflow-clip` 이 없다.** `state=focused`(1:4049) 의 루트 클래스는
  `... min-h-[55px] px-... py-... relative rounded-[radius/4]` 로 clip 이 빠져 있다.
  경계 밖 링을 자르지 않기 위해서다. 위 3번 조건과 정확히 일치한다.
- 링 인스턴스는 버튼과 같은 크기(82×55)로 `left-0 top-0` 에 놓인다 — 즉 호스트를 덮고,
  `-4px` 만큼 밖으로 나간다.
- **`1:4049` 에 한정한 관찰**: 이 노드에서는 링이 `content` 다음 자식이다.
  이것을 규칙으로 읽으면 안 된다 — `1:4027` · `1:4010` 은 반대로 링이 `content` 앞이다.
  위 "자식 순서 — 정정" 절 참조. 링이 콘텐츠와 겹치지 않으므로 어느 쪽이든 결과가 같다.

## a11y

`aria-hidden` 을 기본으로 붙인다. 이 요소는 텍스트도 라벨도 없는 순수 장식이고,
포커스가 어디 있는지는 브라우저와 보조기술이 이미 알고 있다. 링은 그것을 눈으로만
보여주는 장치다. props 를 전개하므로 호출부가 덮어쓸 수 있다.

`<span>` 을 쓴 이유는 `<button>` 의 콘텐츠 모델이 phrasing content 라서다.
`<div>` 를 넣으면 버튼 안에서 무효한 마크업이 된다.

이 컴포넌트는 **포커스 표시를 그리기만 하고 포커스를 관리하지 않는다.** 언제 보일지는
호스트가 정한다. Figma 는 `state=focused` 라는 정적 variant 로만 정의하고 그 트리거를
말하지 않으므로, `:focus` 와 `:focus-visible` 중 무엇에 걸지는 **Figma 에서 확인되지 않는다.**
확인되지 않은 것을 이 파일에 확정으로 적지 않는다. (원칙 1) 판단은 Button 구현에서 한다.

## Code Connect

`get_design_context`(35:12806) 응답에 Code Connect 매핑이 없었다.
매핑 생성은 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| raw 값 스캔 (hex / rgb·hsl / px·rem / arbitrary `[...]` / `var(--`) | `.tsx` 2개 모두 **0건** |
| Tailwind 코어 `border` 사용 | `className` 에 0건. 단독 `border` 매치는 23행 주석(쓰지 않는 이유 설명) 하나뿐 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음, exit=0) |
| `npm run build` | 통과 (`✓ 30 modules transformed` · `✓ built in 307ms`, exit=0) |
| 빌드 CSS 방출 확인 | `.border-hairline{border-width:var(--spacing-hairline)}` 가 **이번에 실제로 방출됐다.** 번들 CSS 가 27.29 → 27.46 kB 로 증가. 나머지 라인은 위 "사용한 토큰" 블록 참조 |
| 빌드 CSS 값 대조 | 토큰 5종의 최종 값이 Figma 변수·실측값과 전부 일치 (`#1a1a1a` · 1px · 4px · 0 · 4px) |
| `get_screenshot`(35:12806) 대조 | 회색 배경 위에 얇은 검은 실선 테두리의 둥근 사각형 2개. fill 없음. 오른쪽(`outerFocus=true`)이 한 단계 크다. 구현의 2개 조합과 형태·두께·반경·크기 차이가 일치 |
| 목적 3 산출물 | **4/4** — ① 이 파일 · ② `StateLayerFocused.tsx` · ③ `StateLayerFocused.stories.tsx` · ④ 이 표 |
