# ListSlotCheckbox — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `ListSlotCheckbox.tsx`, 스토리는 `ListSlotCheckbox.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL (섹션) | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-4431> |
| URL (대상 노드) | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=20-5754> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27683:4431` — section "List" |
| 프레임 | `20:5754` — "ListSlot/Checkbox", 1012×108 (variant 진열 프레임) |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` · `download_assets(svg)` (2026-08-24) |

Figma 컴포넌트 설명(원문, `get_design_context` 응답의 Component descriptions):

> Control 계열에서 사용되는 Checkbox 컴포넌트입니다.
> 다중 선택 상태를 표현하기 위해 사용되며,
> 리스트·카드 구조에서 선택 표현에 활용됩니다.
> 키워드 : 선택, 체크박스, 컨트롤, Checkbox, multi-select.

**같은 섹션의 다른 컴포넌트는 이 작업에서 읽지도 쓰지도 않았다** —
`ListSlot/Radio`(20:5729) · `List/Checkbox`(60:23751) · `List/Radio`(60:24137).
요청 범위가 `20:5754` 하나였다. (원칙 3)

## 노드 구조

```
frame 20:5754  "ListSlot/Checkbox"  1012×108   (variant 진열 프레임)
├─ symbol 20:5755  "isChecked=false, isDisabled=false"  24×24
│  └─ frame 20:5756  "wrapper"  24×24
│     └─ frame 20:5757  "wrapper"  20×20 @ (2,2)
│        └─ vector  "Vector (Stroke)"        ← 선만 있는 둥근 사각형
├─ symbol 20:5771  "isChecked=true, isDisabled=false"   24×24
│  └─ frame 20:5772  "wrapper"  24×24
│     ├─ vector  "Vector"                    ← 꽉 찬 둥근 사각형
│     └─ frame 35:19928  "check-small-line"  20×20 @ (2,2)
│        └─ vector  "Vector"                 ← 체크 표시
├─ symbol 20:5759  "isChecked=false, isDisabled=true"   24×24
│  └─ frame 20:5760  "wrapper"  24×24
│     └─ frame 20:5761  "wrapper"  20×20 @ (2,2)
│        └─ vector  "Vector (Stroke)"
└─ symbol 20:5775  "isChecked=true, isDisabled=true"    24×24
   └─ frame 20:5776  "wrapper"  24×24
      ├─ frame 20:5777  "wrapper"  20×20 @ (2,2)
      │  └─ vector  "Vector"
      └─ frame 35:19924  "check-small-line"  20×20 @ (2,2)
         └─ vector  "Vector"
```

1012×108 은 **진열용 프레임 치수이지 컴포넌트 속성이 아니다** (`StateLayerPressed` 의
265×80 · `Divider` 의 360 과 같은 성격). 코드로 옮기지 않았다.
**컴포넌트의 크기는 심볼 4개 전부 동일한 24×24 다.**

중간의 `wrapper` 프레임들은 시각 값을 갖지 않는다 (fill · stroke · radius 전부 없음).
그리는 것은 vector 뿐이라 24×24 SVG 한 장으로 합쳤다. (원칙 2)

`get_metadata` 상 이 4개 심볼 안에는 **pressed · focused 상태 레이어 노드가 없다.**
그래서 `StateLayerPressed` · `StateLayerFocused` 를 재사용할 자리가 없다 —
있는데 안 쓴 것이 아니라 Figma 에 없다.

## variant 축

`get_design_context` 가 반환한 시그니처 그대로다.

| 축 | 값 | Figma 기본값 |
|---|---|---|
| `isChecked` | `false` \| `true` | `false` |
| `isDisabled` | `false` \| `true` | `false` |

두 축 모두 boolean 이고 조합 4개가 Figma 에 전부 존재한다 (`TabItem` 처럼 빠진 조합이 없다).
그대로 prop 2개로 만들었고 스토리에 4개 전부 있다.
요청받지 않은 축·prop·추상화는 추가하지 않았다. (원칙 2)

## 값의 출처

`불명`으로 남은 값은 없다. 추정한 값도 없다.

기하는 `download_assets(nodeId, defaultFormat: svg)` 로 심볼 4개를 각각 통째로 내보내
얻었다. 24×24 좌표계에 이미 자리가 잡혀 있어 오프셋을 코드에서 다시 계산하지 않았다.

| 값 | 출처 | 결론 |
|---|---|---|
| 심볼 크기 24×24 | `get_metadata` 20:5755 · 5771 · 5759 · 5775 의 width · height | 기존 토큰 `--spacing-24` = `1.5rem` = 24px 와 값 일치 → `size-24` |
| 박스 기하 (선) | export SVG 의 `Vector (Stroke)` path. 20:5755 와 20:5759 가 **완전히 동일한 `d`** | SVG `d` — CLAUDE.md 토큰 규칙 스코프 제외 |
| 박스 기하 (꽉 찬) | export SVG 의 `Vector` path. 20:5771 과 20:5775 가 **완전히 동일한 `d`** | SVG `d` — 스코프 제외 |
| 체크 표시 기하 | export SVG 의 `check-small-line` > `Vector` path. 20:5771 과 20:5775 가 **완전히 동일한 `d`** | SVG `d` — 스코프 제외 |
| 박스 색 — 비선택·활성 | Figma 변수 `text/secondary` = `#747474` (`get_variable_defs` 20:5755) | 기존 토큰 `--color-text-secondary` → `--neutral-gray-light-600` = `#747474`. **값 일치 → 재사용** |
| 박스 색 — 선택(활성·비활성 공통) | Figma 변수 `text/primary` = `#1a1a1a` (`get_variable_defs` 20:5771 · 20:5775) | 기존 토큰 `--color-text-primary` → `--bw-light-black` = `#1a1a1a`. **값 일치 → 재사용** |
| 박스 색 — 비선택·비활성 | Figma 변수 `text/primary` = `#1a1a1a` (`get_variable_defs` 20:5759) | 같은 토큰 재사용 |
| 체크 표시 색 — 활성 | Figma 변수 `bg/primary` = `#ffffff` (`get_variable_defs` 20:5771) | 기존 토큰 `--color-bg-primary` → `--bw-white` = `#ffffff`. **값 일치 → 재사용** |
| 체크 표시 색 — 비활성 | Figma 변수 `text/primary` = `#1a1a1a` (`get_variable_defs` 20:5775) | 기존 토큰 `--color-text-primary` 재사용 |
| 코너 반경 | Figma 변수 `radius/4` = `4` (`get_variable_defs` 4개 심볼 전부) | **코드에 토큰으로 들어가지 않았다.** 아래 "반경과 선 두께" 절 참조 |
| 선 두께 | export SVG 의 확장된 아웃라인 기하에서 읽힌 값 = 1.5 (바깥 경계 반경 4, 안쪽 경계 반경 2.5). **변수 바인딩 없음** — `get_variable_defs` 가 반환한 number 변수는 `radius/4` 뿐이다 | **대응 토큰 없다.** 아래 "반경과 선 두께" 절 참조 |
| opacity | 4개 심볼 전부 없다. `get_screenshot`(24×24 원본 해상도) 픽셀 표본이 SVG fill 값과 정확히 일치해 교차 확인했다 | 코드에 들어갈 자리가 없다 |
| effect / shadow | 4개 심볼 전부 0건 | 코드에 들어갈 자리가 없다 |
| 타이포 | 텍스트 레이어 0개 | 해당 없음 |

### 픽셀 교차 확인 (opacity 가 없다는 근거)

`get_screenshot` 을 `maxDimension` 없이 원본 24×24 로 받아 표본을 떴다.
비활성 variant 가 흐려져 있지 않다는 것을 눈이 아니라 값으로 확인한 것이다.

| 노드 | 표본 위치 | RGBA | SVG fill |
|---|---|---|---|
| 20:5755 | 박스 상단 선 (12,2) | `116,116,116,255` | `#747474` ✔ |
| 20:5771 | 박스 내부 (12,5) | `26,26,26,255` | `#1A1A1A` ✔ |
| 20:5771 | 체크 표시 (8,13) | `255,255,255,255` | `#FFFFFF` ✔ |
| 20:5759 | 박스 상단 선 (12,2) | `26,26,26,255` | `#1A1A1A` ✔ |
| 20:5775 | 박스 내부 (12,5) | `26,26,26,255` | `#1A1A1A` ✔ |

알파가 전부 255 이고 RGB 가 fill 과 정확히 같다 → **variant 어디에도 opacity 가 없다.**
(20:5755 의 `(12,3)` 은 `162,162,162` 로 배경과 섞여 있다. 선 두께가 1.5 이므로
두 번째 픽셀 행이 절반만 덮이는 것이고, 이것이 선 두께 1.5 의 두 번째 근거다.)

### Figma 원본에서 발견한 두 가지 — 고치지 않고 보고한다

**(1) 비활성(`isDisabled=true`) variant 가 흐려지지 않는다.**
비활성 박스는 `text/primary` 를 쓴다 — 활성 선택 상태와 **같은 색**이다.
그래서 `isChecked=true` 두 variant(20:5771 · 20:5775)는 박스만 보면 구분되지 않고,
`isChecked=false` 는 비활성(`text/primary`)이 활성(`text/secondary`)보다 **오히려 진하다.**
저장소에 `--color-text-disabled` · `--color-text-disabled-on-light` ·
`--color-border-disabled` 계열 토큰이 이미 있지만 **Figma 가 그것을 쓰지 않았다.**

**(2) `isChecked=true, isDisabled=true`(20:5775)의 체크 표시가 보이지 않는다.**
체크 표시 fill 이 `text/primary` 이고 그 아래 박스 fill 도 `text/primary` 다 — 같은 색이다.
노드는 존재하지만(35:19924 > Vector) 렌더 결과는 단색 사각형이다.
위 픽셀 표본의 `(8,13) = 26,26,26` 이 그 증거다 (활성 쪽 같은 좌표는 `255,255,255`).

둘 다 **Figma 파일의 실제 값이므로 그대로 옮겼다.** 눈대중으로 보정하지 않았다 (원칙 1).
`TabItem` 의 "focused 일 때 선택 표시선이 사라진다" 와 같은 처리다.
고칠지는 요청자가 정한다 (원칙 3). 디자인 쪽 수정이 필요하다면 Figma 의 비활성 색
바인딩을 `text/disabled` 계열로 바꾸는 것이 코드 변경 없이 끝나는 경로다 — 이 컴포넌트는
색을 semantic 토큰 유틸리티로만 지정하고 있어서, 토큰 동기화(`/sync-tokens`)만으로 따라간다.

### 반경과 선 두께 — 왜 `rounded-4` 가 코드에 없는가

Figma 는 이 박스를 **stroke 를 가진 vector** 로 만들었다 (export SVG 의 레이어 이름이
`Vector (Stroke)` 다 — Figma 가 SVG export 시 stroke 를 아웃라인으로 확장할 때 붙는 이름).
그래서 export 는 반경과 선 두께가 **이미 `d` 안에 포함된** 채로 나온다.

두 가지 구현 경로가 있었다.

| 경로 | 반경 | 선 두께 | 판정 |
|---|---|---|---|
| A. DOM 요소 + `rounded-4` + border 유틸리티 | `--radius-4` 토큰을 쓴다 ✔ | **대응 토큰 없음.** `--spacing-hairline` 은 1px 이고 필요한 값은 1.5 다 | 비선택 variant 2개를 그릴 수 없다 |
| B. Figma export SVG 의 `d` 를 그대로 인라인 | `d` 안에 포함 (토큰 아님) | `d` 안에 포함 (토큰 아님) | 4개 variant 전부 그려진다 |

**B 를 골랐다.** 근거 3개:

1. `d` 는 CLAUDE.md 토큰 규칙이 명시한 **스코프 제외** 대상이다 (`viewBox`, `d`, `points`).
2. 이 저장소에 이미 같은 선례가 있다 — `Icon.tsx` 가 심볼 12개를 전부 Figma export 의
   확장된 아웃라인 path 로 인라인하고, 색만 `text-icon-*` 유틸리티로 준다.
   그 파일의 주석이 이유를 적어 놓았다: "Figma 원본은 12개 전부 stroke 없이 fill 만 쓰는
   확장된 아웃라인이므로 stroke-width 같은 시각 값이 코드에 들어오지 않는다."
3. A 를 쓰면 선택 variant 2개는 토큰(`rounded-4` + `bg-text-primary`)으로 그려지고
   비선택 2개는 그릴 수 없어, **한 컴포넌트 안에 두 메커니즘이 섞이고 절반이 미구현으로 남는다.**
   4개 variant 를 한 메커니즘으로 그리는 쪽이 단순하다. (원칙 2)

**B 의 대가는 명시해 둔다: `radius/4` 는 Figma 변수인데 코드에 토큰으로 들어가지 않는다.**
값 자체는 `d` 가 Figma export 원본 그대로라 Figma 와 1:1 이고 추정이 섞이지 않았지만,
`--radius-4` 를 통한 추적 경로는 끊긴다. A 로 바꾸려면 선 두께 토큰이 먼저 필요하다
(아래 항목 참조). 토큰 파일은 이 에이전트의 편집 권한 밖이라 추가하지 않았다.

### 필요하지만 없는 토큰

| 필요한 것 | 값 | 무엇이 막혔나 |
|---|---|---|
| 선 두께 1.5 (박스 stroke) | Figma export 기하에서 읽힌 값. 변수 바인딩 없음 | **막힌 것은 없다.** 위 경로 B 로 4개 variant 전부 구현됐다. 이 토큰이 있으면 경로 A(DOM + `rounded-4` + border 유틸리티)로 바꿀 수 있고, 그때 `radius/4` 가 토큰으로 복원된다 |

`--spacing-hairline`(1px)에 끼워 맞추지 않았다. 그 토큰의 정의 주석이 세운 기준이
"값이 같아서가 아니라 축이 같아서" 이고, 1.5 는 그 값과 다르다.
값을 반올림해 기존 토큰에 맞추는 것은 추정이다 (원칙 1).

이 토큰이 필요해지면 `/sync-tokens` → `token-guardian` 이 추가한다.
이 에이전트는 `src/tokens/**` 를 편집하지 않았다.

## 사용한 토큰

새로 추가한 토큰은 **없다.** 전부 기존 토큰 재사용이다.

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--spacing-24` | `size-24` | 심볼 4개의 width · height = 24 |
| `--color-text-secondary` | `fill-text-secondary` | 변수 `text/secondary` = `#747474` |
| `--color-text-primary` | `fill-text-primary` | 변수 `text/primary` = `#1a1a1a` |
| `--color-bg-primary` | `fill-bg-primary` | 변수 `bg/primary` = `#ffffff` |

`fill-*` 유틸리티를 쓰는 이유: Tailwind v4 의 `--color-*` 네임스페이스는 `bg-*` · `text-*` ·
`border-*` 와 함께 `fill-*` · `stroke-*` 도 생성한다. 이 컴포넌트는 한 SVG 안에서 색이
2개로 갈라지므로(선택·활성 = 박스 `text/primary` + 체크 `bg/primary`),
`Icon.tsx` 의 `currentColor` + `text-icon-*` 방식으로는 표현되지 않는다.
path 별로 `fill-*` 를 주는 것이 Figma 노드별 색 바인딩과 1:1 로 맞는다.

빌드 산출 CSS(`dist/assets/index-*.css`)에서 실제로 확인한 값:

```
.fill-text-primary{fill:var(--color-text-primary)}
.fill-text-secondary{fill:var(--color-text-secondary)}
.fill-bg-primary{fill:var(--color-bg-primary)}
.size-24{width:var(--spacing-24);height:var(--spacing-24)}

--color-text-primary:var(--bw-light-black);      --bw-light-black:#1a1a1a;
--color-text-secondary:var(--neutral-gray-light-600); --neutral-gray-light-600:#747474;
--color-bg-primary:var(--bw-white);              --bw-white:#fff;
--spacing-24:1.5rem;
```

(`--bw-white` 는 소스에 `#ffffff` 로 정의돼 있고 위 `#fff` 는 빌드 시 축약된 표기다.
`colors.tokens.css` 원본과 Figma 변수 `bg/primary` 의 값은 `#ffffff` 로 일치한다.)

토큰이 아닌 유틸리티 1개와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `shrink-0` | 레이아웃 | 24×24 는 Figma 가 고정한 크기다. flex 컨테이너(리스트 행) 안에서 줄어들지 않게 한다. `Icon.tsx` 가 같은 이유로 같은 클래스를 쓴다 |

### 스토리 (`ListSlotCheckbox.stories.tsx`)

진열 격자는 Figma 노드가 아니라 4개 조합을 나란히 보기 위한 스토리 전용 장치다.
치수도 토큰으로만 짰다 (Figma 의 1012×108 은 진열용이라 옮기지 않았다).

| 토큰 | 유틸리티 |
|---|---|
| `--spacing-8` · `--spacing-24` · `--spacing-40` | `gap-8` · `p-24` · `gap-40` |
| `--color-bg-primary` · `--color-bg-tertiary` | `bg-bg-primary` · `bg-bg-tertiary` |
| `--color-text-secondary` | `text-text-secondary` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

`bg-bg-tertiary` 를 쓰는 자리가 하나 있다: **흰 배경에서는 선택·활성 variant 의 체크 표시가
보이지 않는다** (체크가 `bg/primary` = 흰색이다). Figma 진열 프레임도 회색 배경 위에 있다.
그래서 스토리 배경을 흰색 하나로 두지 않고 두 배경을 함께 보여준다.

## 책임 분리 — 이 컴포넌트가 하는 것과 호스트가 하는 것

Figma 의 이 노드는 **체크박스의 시각 표현이지 체크박스가 아니다.**
심볼 안에 상호작용 관련 노드가 하나도 없다 (hit area · 상태 레이어 · 라벨 전부 없음).
그래서 `Icon` 과 같은 성격의 순수 표시 요소로 구현했다.

| 이 컴포넌트 | 호스트 |
|---|---|
| 24×24 SVG 를 그린다 | 크기 있는 클릭 가능 영역(터치 타깃)을 만든다 |
| `isChecked` · `isDisabled` 를 시각으로 옮긴다 | 그 값의 **출처**를 갖는다 (state · form 값) |
| `aria-hidden` 을 기본으로 붙인다 | 실제 시맨틱을 제공한다 — `<input type="checkbox">` 또는 `role="checkbox"` + `aria-checked` |
| — | `disabled` 속성 · 키보드 조작 · 포커스 표시 |
| — | 라벨과 그 연결(`<label>` · `aria-labelledby`) |

`aria-hidden` 을 기본으로 붙이는 이유는 `Icon.tsx` 와 같다: 호스트가 네이티브
체크박스든 `role="checkbox"` 든 이미 선택 상태를 보조기술에 알리고 있고,
이 그림까지 노출하면 중복이 된다. props 를 `aria-hidden` **뒤에** 전개하므로
호출부가 덮어쓸 수 있다.

**포커스 표시는 이 컴포넌트가 그리지 않는다.** Figma 에 그 variant 가 없다 (위 노드 구조 참조).
`TabItem` 이 세운 규칙과 같다 — 대체 링을 실제로 그리는 경로가 아니면 UA 아웃라인을 끄지 않는다.
여기서는 아웃라인을 건드리는 코드가 아예 없으므로, 호스트의 포커스 표시가 그대로 살아 있다.

**비활성 상태도 시각만 담당한다.** `isDisabled` 는 `<svg>` 에 아무 동작도 걸지 않는다
(`pointer-events` 를 끄지 않는다). 실제 비활성화는 호스트의 `disabled` 속성이 한다.
여기서 `pointer-events-none` 을 넣으면 호스트가 `disabled` 를 안 걸었을 때
"보기엔 비활성인데 눌리는" 상태와 "눌리지 않지만 disabled 도 아닌" 상태가 섞인다.

## Code Connect

`get_design_context`(20:5754) 응답에 Code Connect 매핑이 없었다.
매핑 생성은 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 최종 파일 3개 재현 결과 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음, exit 0) |
| `npm run build` | 통과 (`✓ 32 modules transformed` · `✓ built in 377ms`, exit 0) |
| 빌드 CSS 값 대조 | 통과. 위 "사용한 토큰" 블록 참조 — 토큰 4종의 최종 값이 Figma 변수 값과 전부 일치 |
| 기하·색 대조 (`d` + fill) | 통과. 아래 |
| `get_screenshot` 대조 (픽셀) | 통과. 아래 |

### 기하·색 대조 — Figma export 와 1:1

구현이 variant 별로 내는 `(d, 토큰의 최종 색값)` 목록을 `download_assets` export 4개에서
뽑은 `(d, fill)` 목록과 프로그램으로 비교했다. **4개 variant 전부 완전 일치** —
path 개수 · `d` 문자열 · 색값이 모두 같다.

| 노드 | path 수 | 일치 |
|---|---|---|
| 20:5755 | 1 | ✔ |
| 20:5771 | 2 | ✔ |
| 20:5759 | 1 | ✔ |
| 20:5775 | 2 | ✔ |

### 픽셀 대조 — Figma 렌더 vs 브라우저 렌더

`get_screenshot` 으로 받은 Figma 렌더(24×24 원본 해상도)와, 구현이 내는 SVG 를
브라우저(headless Chrome)로 같은 크기·같은 배경에 렌더한 결과를 픽셀 단위로 비교했다.

| 노드 | 최대 채널차 | 평균 채널차 | 4 초과 픽셀 |
|---|---|---|---|
| 20:5755 | 18 | 0.36 | 18 / 576 |
| 20:5771 | 27 | 0.98 | 44 / 576 |
| 20:5759 | 38 | 0.72 | 36 / 576 |
| 20:5775 | 23 | 0.47 | 19 / 576 |

차이는 전부 곡선 경계 픽셀에 몰려 있다. Figma 의 래스터라이저와 브라우저(Skia)의
안티에일리어싱이 다르기 때문이고, 채워진 면과 선의 색은 완전히 같다
(위 "픽셀 교차 확인" 표의 표본이 그것을 값으로 보여준다).

눈으로 본 결과도 같다: 회색 배경 위 24×24 사각형 4개가 좌→우로
① 회색 선만 있는 빈 사각형 ② 검정으로 찬 사각형 + 흰 체크 ③ 검정 선만 있는 빈 사각형
④ 검정으로 찬 사각형(체크 안 보임).
**④ 에 체크가 보이지 않는 것까지 Figma 와 같다** (위 "발견한 두 가지" (2) 참조).
