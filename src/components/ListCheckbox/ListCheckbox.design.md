# ListCheckbox — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `ListCheckbox.tsx`, 스토리는 `ListCheckbox.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL (섹션) | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-4431> |
| URL (대상 노드) | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=60-23751> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27683:4431` — section "List" |
| 프레임 | `60:23751` — "List/Checkbox", 1032×190 (variant 진열 프레임) |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` (2026-08-24) |

Figma 컴포넌트 설명(원문, `get_design_context` 응답의 Component descriptions):

> Content 계열에서 여러 정보를 항목 단위로 정렬하여 표현하기 위한 컴포넌트입니다.
> 텍스트, 아이콘, 썸네일 등 다양한 요소를 포함한 정보를 목록 형태로 구성할 때 사용되며,
> 메뉴, 설정, 콘텐츠 목록 등 정보 탐색 구조에서 활용됩니다.
> 키워드 : 리스트, 정보 목록, 리스트 항목, List

**같은 섹션의 다른 컴포넌트는 이 작업에서 읽지도 쓰지도 않았다** —
`ListSlot/Radio`(20:5729) · `List/Radio`(60:24137). 요청 범위가 `60:23751` 하나였다. (원칙 3)
`ListSlot/Checkbox`(20:5754) 는 **읽기만** 했다 (아래 "재사용" 절). 수정하지 않았다.

## 노드 구조

```
frame 60:23751  "List/Checkbox"  1032×190          (variant 진열 프레임)
├─ symbol 60:23786  "isChecked=false"  362×72
│  ├─ instance 27742:6589  "Divider"  360×1  @ (1,71)        ← 절대 배치
│  └─ frame 60:23788  "content"  362×24  @ (0,24)   (가로 auto-layout, gap 16, FILL)
│     ├─ frame 60:23789  "slot-start"  24×24
│     │  └─ instance 60:23790  "ListSlot/Checkbox"  24×24
│     ├─ instance 27737:6056  "Text Set Title"  282×24  @ (40,0)   (FILL)
│     └─ frame 60:23792  "slot-end"  24×24  @ (338,0)
│        └─ instance 60:23793  "Icon/chevronRight-small-line"  24×24
└─ symbol 60:23802  "isChecked=true"   362×72
   ├─ instance 27742:6596  "Divider"  360×1  @ (1,71)        ← 절대 배치
   └─ frame 60:23804  "content"  362×24  @ (0,24)
      ├─ frame 60:23805  "slot-start"  24×24
      │  └─ instance 60:23806  "ListSlot/Checkbox"  24×24
      ├─ instance 27737:6082  "Text Set Title"  282×24  @ (40,0)
      └─ frame 60:23808  "slot-end"  24×24  @ (338,0)
         └─ instance 60:23809  "Icon/chevronRight-small-line"  24×24
```

1032×190 은 **진열용 프레임 치수이지 컴포넌트 속성이 아니다.** 코드로 옮기지 않았다
(`ListSlot/Checkbox` 의 1012×108 · `StateLayerPressed` 의 265×80 과 같은 성격).

**두 variant 의 구조가 완전히 동일하다.** 자식 노드 종류·개수·크기·좌표가 모두 같고
갈라지는 것은 `ListSlot/Checkbox` 인스턴스의 `isChecked` 값 하나뿐이다
(`get_design_context` 가 60:23786 에서는 `20:5755`, 60:23802 에서는 `20:5771` 을 참조).

## variant 축

`get_design_context` 가 반환한 시그니처와 `get_metadata` 의 심볼 이름이 일치한다.

| 축 | 값 | Figma 기본값 |
|---|---|---|
| `isChecked` | `false` \| `true` | `false` |

**Figma variant 축은 하나다.** 원자 `ListSlot/Checkbox` 에 있는 `isDisabled` 축이 이 세트에는
없다 — `get_metadata`(60:23751)가 반환한 심볼이 `isChecked=false` · `isChecked=true` 2개뿐이다.
없는 축을 만들지 않았다. (원칙 2)

### Figma 에 있으나 prop 으로 만들지 않은 component property 2개

`get_design_context` 가 이 세트에서 variant 축 외에 3개를 더 읽어냈다.

| property | 종류 | Figma 기본값 | 처리 |
|---|---|---|---|
| `hasIconStart` | boolean | `true` | prop 으로 만들지 않았다. `true` 로만 렌더 |
| `hasIconEnd` | boolean | `true` | **prop 으로 열었다** — 아래 "나중에 늘어난 축 3개" |
| `iconEnd` | instance swap | 기본 인스턴스(`Icon/chevronRight-small-line`) | prop 으로 만들지 않았다. 기본 인스턴스로만 렌더 |

**근거**: 최초 작업의 요청 범위가 "variant 축은 `isChecked` 하나" 로 고정돼 있었고
"요청받지 않은 prop·variant·추상화를 추가하지 않는다" 였다. (원칙 2·3)
남은 두 property 를 Figma 기본값대로 고정했으므로 **기본 상태의 렌더 결과는 Figma 와 같다** —
빠진 것은 시작 슬롯을 끄거나 끝 아이콘을 바꾸는 능력뿐이다.
필요해지면 `/new-component` 로 추가하면 되고, 그때 `iconEnd` 는 `Icon` 의 `IconName`
12개 중 하나를 받는 형태가 자연스럽다. 지금 추측으로 만들지 않았다.

### 나중에 늘어난 축 3개 (2026-08-25, `page/Consent` 작업)

`page/Consent`(27683:3187) 를 구현하면서 **그 화면이 실제로 요구한 값 3개**를 열었다.
셋 다 "나중에 필요할 것 같아서" 가 아니라 이미 존재하는 Figma 노드에서 읽은 값이다.

| prop | 값 | 요구한 노드 | Figma 근거 |
|---|---|---|---|
| `size` | `'default'` \| `'compact'` | `27683:3196`~`3199` | 상하 패딩 `spacing/component/y/20`(20), 행 높이 64 (`default` 는 24 · 72) |
| `hasIconEnd` | `boolean` | `27683:3193` | `get_metadata`: `slot-end` 프레임이 `hidden="true"` |
| `hasDivider` | `boolean` | `27683:3196`~`3199` | `get_metadata`: `Divider` 인스턴스가 `hidden="true"` |

**세 기본값(`'default'` · `true` · `true`)이 모두 기존 렌더 결과와 같다.**
이 축들이 붙기 전의 호출부(`Stacked` 스토리 포함)는 한 줄도 바뀌지 않았다.

#### ⚠ 이름 2개는 이 저장소의 명명이다 — Figma 에서 읽은 것이 아니다

| 이름 | Figma 에서 읽은 것 | 읽지 못한 것 | 어떻게 정했나 |
|---|---|---|---|
| `size` | **값** `compact` (인스턴스 이름 `[List] Checkbox/false/compact/false`) | 축 이름. MCP 가 마스터의 property 이름을 내주지 않는다 | 같은 섹션 `27683:4431` 의 `ListSlot/Radio`(20:5729) 심볼 이름이 `size=medium, isChecked=false, isDisabled=false` 로 `size` 축을 쓴다. 그 이름을 따랐다 |
| `hasDivider` | 구분선이 **꺼진다**는 사실 (`hidden="true"`) | property 이름. 인스턴스 오버라이드로 숨겨져 있어 이름이 노출되지 않는다 | 같은 세트의 확인된 property `hasIconEnd` 와 같은 `has*` 형태를 따랐다 |

`default` 라는 값 이름도 우리가 붙인 것이다 — Figma 에서 확인된 값은 `compact` 하나뿐이다.
**대가를 명시해 둔다**: Figma 쪽 축·property 이름이 나중에 드러나면 이 두 이름은 어긋난 채 남는다.
드러나는 즉시 맞추면 되고, 값(`compact`) 과 픽셀은 어긋나지 않는다.

#### `[List] Checkbox` 는 `List/Checkbox` 와 다른 마스터다

`page/Consent` 의 약관 4행은 이 세트(60:23751)의 인스턴스가 **아니다.**

| | 전체동의 행 `27683:3193` | 약관 4행 `27683:3196`~`3199` |
|---|---|---|
| 인스턴스 이름 | `List/Checkbox` | `[List] Checkbox` |
| `content` 노드 | `I…;60:23788` → 심볼 60:23786 (이 세트) | `I…;60:23754` → **다른 마스터** |
| 구분선 노드 | `I…;27742:6589` (보임) | `I…;60:23753` (`hidden`) |

`60:23752`~`60:23754` 는 `get_metadata` 로 직접 열리지 않았다
("invalid node selection" — 캔버스에서 보이는 페이지의 노드가 아니다).
그래서 그 마스터를 별도 컴포넌트로 구현하는 대신, **관측된 차이 3개를 이 컴포넌트의
축으로 흡수했다.** 두 마스터가 같은 원자(`ListSlot/Checkbox` · `TextSetTitle` sm ·
`Icon/chevronRight-small-line` · `Divider`)를 같은 간격(`gap` 16)으로 배치하고
패딩·노출 여부만 다르기 때문이다. 새 컴포넌트를 만들면 같은 조립이 두 벌 남는다. (원칙 2)

## 재사용 — 이 작업의 핵심

`get_metadata` 가 두 variant 의 자식을 전부 **instance** 로 반환했고, 4개 모두 이
저장소에 이미 구현돼 있었다. **새로 그린 것이 하나도 없다.**

| Figma 노드 | 종류 | 재사용한 컴포넌트 | 근거 |
|---|---|---|---|
| `60:23790` · `60:23806` `ListSlot/Checkbox` | instance of **20:5754** | `ListSlotCheckbox` | 마스터 노드 ID 가 `ListSlotCheckbox.design.md` 의 소스(`20:5754`)와 **동일**하다. `get_design_context` 가 60:23786 에서 심볼 `20:5755`(=`isChecked=false, isDisabled=false`), 60:23802 에서 `20:5771`(=`isChecked=true, isDisabled=false`) 를 참조했다 — 즉 `isChecked` 만 갈리고 `isDisabled` 는 두 variant 모두 `false` 다. 그래서 `isChecked={isChecked}` 만 넘기고 `isDisabled` 는 기본값 `false` 에 맡겼다 |
| `27737:6056` · `27737:6082` `Text Set Title` | instance | `TextSetTitle` `size="sm"` | `get_design_context` 가 `size="sm"`, `description={false}` 로 반환했다. `TextSetTitle` 의 `sm` 은 `gap-6 min-h-24` + `font-title-small-strong` 이고, Figma 인스턴스 높이 24 · 타이포 `font/title/small-strong` 와 일치한다 |
| `60:23793` · `60:23809` `Icon/chevronRight-small-line` | instance | `Icon name="chevronRight-small"` | 아래 "셰브론 기하 대조" 참조 — export SVG 의 `d` 가 `Icon.tsx` 의 것과 오프셋만큼 **정확히 일치**한다 |
| `27742:6589` · `27742:6596` `Divider` | instance of **20:5645** | `Divider` | 마스터 노드 ID 가 `Divider.design.md` 의 소스(`20:5645`)와 **동일**하다. `get_design_context` 가 내부 사각형을 `I27742:6589;20:5646` 로 반환했고 `20:5646` 은 `Divider.tsx` 주석에 적힌 그 사각형이다. 색 `border/primary`, 높이 1px 도 일치 |

### `ListSlotCheckbox` 의 prop 으로 표현되지 않는 것 — 없다

이 행이 체크박스에 요구하는 것은 `isChecked` 하나이고, 그것이 `ListSlotCheckbox` 의
prop 으로 그대로 있다. **부족한 prop 이 없다. `ListSlotCheckbox` 를 수정하지 않았다.**

체크박스 원자의 특이사항은 `ListSlotCheckbox.design.md` 를 신뢰하고 다시 조사하지 않았다:

- 비선택 박스가 stroke 확장된 SVG vector 라서 반경 `radius/4` 와 선 두께 1.5 가 `d` 안에
  들어가 있고, 그래서 `rounded-4` 토큰이 코드에 나타나지 않는다
- `isDisabled` 에 dim 처리가 없다 (이 세트에는 그 축 자체가 없어 영향이 없다)

이 문서의 `get_variable_defs`(60:23751) 결과가 `radius/4` 를 여전히 반환하는 것도
그 사실과 일치한다 — 반경은 체크박스 인스턴스 안에서 오고, 이 행 자체는 반경을 갖지 않는다.

### 재사용할 자리가 없어서 안 쓴 것

| 후보 | 판정 |
|---|---|
| `StateLayerPressed` · `StateLayerFocused` | `get_metadata`(60:23786 · 60:23802) 상 **두 variant 안에 상태 레이어 노드가 0건**이다. `get_design_context` 에도 pressed/focused 관련 노드가 없다. 있는데 안 쓴 것이 아니라 **Figma 에 없다** |

## 값의 출처

`불명`으로 남은 값은 없다. 추정한 값도 없다.

| 값 | 출처 | 결론 |
|---|---|---|
| 행 상하 패딩 24 | Figma 변수 `spacing/24` (`get_design_context`: `py-[var(--spacing/24,24px)]`) | 기존 토큰 `--spacing-24` = `1.5rem` = 24px. **값 일치 → 재사용** → `py-24` |
| 슬롯 ↔ 텍스트 간격 16 | Figma 변수 `spacing/16` (`get_design_context`: `gap-[var(--spacing/16,16px)]`) | 기존 토큰 `--spacing-16` = `1rem` = 16px. **값 일치 → 재사용** → `gap-16` |
| 세로 정렬 | `content` 의 auto-layout `items-center` + 행의 `items-center` | `items-center` (시각 값 아님) |
| 행 높이 72 | `get_metadata` 심볼 2개의 height | 코드에 고정하지 않았다. 24 + 24 + 24 로 패딩·내용에서 나온다 (검증: 아래) |
| 행 폭 362 | `get_metadata` 심볼 2개의 width. `content` 는 FILL | `w-full`. 아래 "폭" 절 |
| 구분선 색 | Figma 변수 `border/primary` = `#ebebeb` (`get_variable_defs` 60:23751) | `Divider` 가 이미 `--color-border-primary` 로 그린다. **재사용** |
| 구분선 두께 1px | `get_design_context`: `h-px` (Divider 인스턴스 내부 사각형) | `Divider` 가 이미 `--spacing-hairline` → `h-hairline` 로 그린다. **재사용** — `h-px` 를 직접 쓰지 않았다 (아래 "hook 이 놓치는 것" 절) |
| 구분선 배치 | `get_metadata`: 인스턴스가 `@ (1,71)` 로 절대 배치. `get_design_context`: `absolute bottom-0 left-px right-px` | `absolute inset-x-0 bottom-0`. 좌우 1px 은 옮기지 않았다 — 아래 "폭" 절 |
| 제목 타이포 | Figma 변수 `font/title/small-strong` (`get_variable_defs` 60:23751 · `get_design_context` 의 styles 목록) | `TextSetTitle size="sm"` 이 이미 `font-title-small-strong` 로 그린다. **재사용** |
| 제목 색 | Figma 변수 `text/primary` = `#1a1a1a` | `TextSetTitle` 이 이미 `text-text-primary` 로 그린다. **재사용** |
| 제목 ↔ 보조 텍스트 간격 6 | Figma 변수 `spacing/6` (`get_design_context`) | `TextSetTitle size="sm"` 의 `gap-6` 그대로. 이 행은 `description` 이 없어 렌더 결과에 나타나지 않는다 |
| 제목 minHeight 24 | `get_design_context`: `min-h-[24px]` | `TextSetTitle size="sm"` 의 `min-h-24` 그대로. **재사용** |
| 체크박스 24×24 · 색 | 인스턴스 20:5755 · 20:5771 | `ListSlotCheckbox` 가 이미 그린다. **재사용** |
| 끝 아이콘 기하 | export SVG (`get_design_context` 의 `imgVector`) | `Icon name="chevronRight-small"` 와 **완전 일치**. 아래 "셰브론 기하 대조" |
| 끝 아이콘 색 `#1A1A1A` | export SVG 의 `fill="#1A1A1A"`. `get_variable_defs`(60:23793) 는 `{}` — **이 인스턴스에 변수 바인딩이 없다** | `Icon` 의 기본 `color="primary"` → `--color-icon-primary` = `--bw-light-black` = `#1a1a1a`. **값 일치 → 기본값 그대로 사용** |
| opacity | 두 variant 에 0건 | 코드에 들어갈 자리가 없다 |
| effect / shadow | 두 variant 에 0건 | 코드에 들어갈 자리가 없다 |
| 행 배경 fill | 두 variant 에 없다 (`get_design_context` 의 루트에 `bg-*` 가 없다) | 배경 유틸리티를 넣지 않았다. 호스트의 배경이 그대로 보인다 |

### 셰브론 기하 대조 — `Icon.tsx` 와 1:1

`get_design_context`(60:23786) 가 준 `imgVector` 를 내려받아 `d` 를 직접 비교했다.
export 는 `Vector` 노드만 잘라낸 7×12 뷰박스이고, `Icon.tsx` 는 24 뷰박스 좌표다.
Figma 상 그 `Vector` 의 위치는 `left-[37.5%] top-1/4` = (9, 6) 이다.

| | 값 |
|---|---|
| export (7×12 뷰박스) | `M0.292893 0.292893C0.683418 -0.0976311 1.31643 -0.0976311 1.70696 0.292893L6.70696 5.29289…` |
| `Icon.tsx` `chevronRight-small` | `M9.29289 6.29289C9.68342 5.90237 10.3164 5.90237 10.707 6.29289L15.707 11.2929…` |
| 차 | 모든 x 에 +9, 모든 y 에 +6 — **오프셋 (9,6) 을 더하면 완전히 같다** |

export 의 `fill="#1A1A1A"` 도 `--color-icon-primary`(= `#1a1a1a`) 와 같다.
**같은 심볼이다. 셰브론을 다시 그리지 않았다.**

## 폭 — 362 와 구분선 좌우 1px 을 옮기지 않은 근거

`content` 프레임이 FILL(`flex-[1_0_0]`)이므로 **행의 폭은 부모가 정한다** → `w-full`.
362 는 이 파일의 모바일 페이지 폭(360)에서 온 배치값으로 본다.

그 판단의 근거가 이 노드 안에 그대로 있다: 안의 `Divider` 인스턴스가 자기 고유 폭 360 을
유지한 채 362 짜리 행 안에 놓여서 좌우로 1px 씩 남는다 (`@ (1,71)`, width 360).
`get_design_context` 가 그것을 `left-px right-px` 로 내보냈다.
**두 값(362 · 360)이 서로 어긋나 있다는 것 자체가 둘 다 컴포넌트 속성이 아니라는 표시다** —
디자인 의도로 1px 여백을 준 것이라면 양쪽 값이 맞아떨어졌을 것이다.
`Divider.design.md`(360 은 페이지 폭에서 온 배치값) · `TextSetTitle.tsx`(360 → `w-full`)
가 이미 같은 결론을 내렸고 그 규칙을 그대로 따랐다.

그래서 구분선을 `absolute inset-x-0 bottom-0` 로 두었다 — 행 폭 전체를 덮는다.
스크린샷 대조에서도 이 1px 차이가 육안으로 구분되지 않는 것을 확인했다 (아래 검증).

**대가는 명시해 둔다**: Figma 렌더에서는 구분선이 행보다 좌우 1px 씩 짧고, 구현에서는
같다. 이 1px 을 의도된 여백으로 되살릴 거면 좌우 인셋 토큰이 필요하고, 그 토큰은
지금 없다 (`--spacing-hairline` 은 **선 두께** 축이며 `spacing.tokens.css` 가 세운 기준이
"값이 같아서가 아니라 축이 같아서" 다 — 좌우 인셋에 그것을 끼워 맞추는 것은 추정이다).
값을 되살리기로 결정된다면 `/sync-tokens` → `token-guardian` 이 먼저 토큰을 추가해야 한다.

## Figma 3단 구조를 1단으로 접은 근거

`content` · `slot-start` · `slot-end` 세 프레임은 **시각 값을 하나도 갖지 않는다**
(`get_design_context` 가 이 세 프레임에 fill · stroke · radius 를 하나도 내보내지 않았다).
그리고

- `content` 는 행의 유일한 in-flow 자식이고 FILL 이므로 행의 폭을 그대로 받는다
  → 행의 `py-24` 와 `content` 의 `gap-16` 을 한 요소에 얹어도 렌더 결과가 같다
- `slot-start`(24×24) · `slot-end`(24×24) 는 자식이 24×24 인스턴스 하나뿐이고 크기가
  그 인스턴스와 같다 — 감싸는 것 외에 하는 일이 없다

`Divider`(2단 → 1단) · `TextSetTitle`(3단 → 2단) · `ListSlotCheckbox`(3단 → SVG 1장)
이 각각 같은 판단을 내렸고 그 규칙을 그대로 따랐다. (원칙 2)

접은 결과가 Figma 실측 치수와 맞는지 확인했다:

| 축 | 계산 | Figma 실측 |
|---|---|---|
| 높이 | `spacing/24`(24) + content 24 + `spacing/24`(24) = **72** | 심볼 height 72 ✔ |
| 가로 | 24 + `spacing/16`(16) + 282 + `spacing/16`(16) + 24 = **362** | 심볼 width 362 ✔ |

구분선을 절대 배치로 둔 것도 이 계산 때문이다. Figma 에서 `Divider` 는 auto-layout 의
자식이 아니라 절대 배치(bottom=0)이고, in-flow 로 넣으면 행이 73 이 되어 실측 72 와 어긋난다.

## 사용한 토큰

새로 추가한 토큰은 **없다.** 전부 기존 토큰 재사용이다.

### `ListCheckbox.tsx` 가 직접 쓰는 것

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--spacing-24` | `py-24` (`size="default"`) | 변수 `spacing/24` = 24 |
| `--spacing-20` | `py-20` (`size="compact"`) | 변수 `spacing/component/y/20` = 20 (`27683:3196`) |
| `--spacing-16` | `gap-16` | 변수 `spacing/16` = 16 |

### 재사용한 컴포넌트를 통해 들어오는 것

| 컴포넌트 | 토큰 |
|---|---|
| `ListSlotCheckbox` | `--spacing-24` · `--color-text-secondary` · `--color-text-primary` · `--color-bg-primary` |
| `TextSetTitle` (`size="sm"`) | `--spacing-6` · `--spacing-24`(`min-h-24`) · typography `font-title-small-strong` · `--color-text-primary` |
| `Icon` (`chevronRight-small`) | `--spacing-24`(`size-24`) · `--color-icon-primary` |
| `Divider` | `--spacing-hairline` · `--color-border-primary` |

토큰이 아닌 유틸리티와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `relative` | 배치 기준 | 구분선의 절대 배치 기준점. Figma 에서 구분선이 행 기준 절대 배치다 |
| `absolute` `inset-x-0` `bottom-0` | 배치 | Figma 구분선의 절대 배치(bottom=0)를 그대로 옮긴 것. `0` 은 시각 값이 아니라 기준점이다 |
| `flex` `items-center` | 레이아웃 | Figma auto-layout(가로, 세로 center) |
| `w-full` | 레이아웃 | `content` 가 FILL 이다. 위 "폭" 절 |
| `flex-1` `min-w-0` | 레이아웃 | `Text Set Title` 인스턴스가 FILL(`flex-[1_0_0] min-w-px`)이다 |

### hook 이 놓치는 것 — 직접 확인했다

쓰기 시점 hook 이 Tailwind 코어 유틸리티 일부(`h-px` · `border`)를 놓친다는 것을 알고 있어,
1px 을 쓰는 두 자리를 손으로 확인했다.

| 자리 | Figma 원값 | 쓴 것 | 확인 |
|---|---|---|---|
| 구분선 두께 | `h-px`(1px) | **직접 쓰지 않았다.** `Divider` 가 `h-hairline`(= `--spacing-hairline`) 으로 그린다 | 토큰 유틸리티 ✔ |
| 구분선 좌우 인셋 | `left-px right-px`(1px) | **직접 쓰지 않았다.** `inset-x-0` 으로 대체하고 근거를 위 "폭" 절에 적었다 | `0` — 시각 값 아님 ✔ |

`h-px` · `w-px` · `left-px` · `right-px` 는 이 컴포넌트의 어느 파일에도 없다.

### 스토리 (`ListCheckbox.stories.tsx`)

진열 격자는 Figma 노드가 아니라 variant 를 나란히 보기 위한 스토리 전용 장치다.
치수도 토큰으로만 짰다 (Figma 의 1032×190 은 진열용이라 옮기지 않았다).

| 토큰 | 유틸리티 |
|---|---|
| `--spacing-8` · `--spacing-24` · `--spacing-40` | `gap-8` · `p-24` · `gap-40` |
| `--color-bg-primary` · `--color-bg-tertiary` | `bg-bg-primary` · `bg-bg-tertiary` |
| `--color-text-secondary` | `text-text-secondary` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

`bg-bg-tertiary` 를 쓰는 이유는 `ListSlotCheckbox.stories.tsx` 와 같다 — 선택 상태의
체크 표시가 `bg/primary`(흰색)이라 흰 배경에서는 잘 보이지 않는다.
Figma 진열 프레임도 회색 배경 위에 있다.

## 책임 분리 — 접근성

이 행은 **선택 가능한 목록 항목의 시각 표현이지, 체크박스 컨트롤이 아니다.**
근거는 Figma 노드에 있다: 두 variant 안에 hit area · pressed/focused 상태 레이어 ·
`<label>` 에 해당하는 구조가 하나도 없다. `ListSlotCheckbox` 가 같은 근거로 같은
결론에 도달했고, 그 위에 얹히는 이 행도 같은 성격을 유지한다.

| 이 컴포넌트 | 호스트 |
|---|---|
| 행의 레이아웃·간격·구분선을 그린다 | 그룹핑 — `role="group"` + `aria-label`, 또는 `<fieldset>` + `<legend>` |
| `isChecked` 를 체크박스 그림으로 옮긴다 | 그 값의 **출처**를 갖는다 (state · form 값) |
| `title` 을 `TextSetTitle` 로 렌더한다 | 라벨 연결 — 행에 `role="checkbox"` 를 주면 자식 텍스트가 접근가능한 이름이 된다. `<input>` 을 쓸 거면 `<label>` · `aria-labelledby` |
| `...props` 를 루트에 전개해 시맨틱을 얹을 자리를 준다 | 실제 시맨틱 — `role="checkbox"` + `aria-checked={isChecked}`, 또는 `<input type="checkbox">` |
| — | 키보드 조작 (`tabIndex` · Space 토글 · 화살표 이동) |
| — | 포커스 표시 |
| — | 터치 타깃 (행 높이 72 로 충분하지만 그 영역을 눌리게 만드는 것은 호스트) |
| — | 눌림 피드백 (Figma 에 상태 레이어가 없다 — 필요하면 호스트가 `StateLayerPressed` 를 얹는다) |

`Stacked` 스토리가 호스트 몫의 최소 예시다 — `role="group"` + 행마다 `role="checkbox"` ·
`aria-checked` · `tabIndex`.

**내부 요소의 시맨틱은 중복되지 않는다.** `ListSlotCheckbox` 와 `Icon` 은 기본으로
`aria-hidden="true"` 라 체크박스 그림과 셰브론이 이름에 섞이지 않는다.
`Divider` 는 `<hr>`(암묵 `role="separator"`)이지만, 호스트가 행에 `role="checkbox"` 를
주면 ARIA 의 presentational-children 규칙에 따라 자식의 role 이 노출되지 않으므로
추가 속성이 필요하지 않다. `<input type="checkbox">` 방식을 택하는 호스트라면 구분선이
행 밖에 남으므로 역시 문제가 되지 않는다. 그래서 `Divider` 에 `aria-hidden` 을
얹지 않았다 — Figma 에 없는 속성을 짐작으로 넣지 않는다. (원칙 1)

**포커스 표시는 이 컴포넌트가 그리지 않는다.** Figma 에 그 variant 가 없다.
`TabItem` 이 세운 규칙과 같다 — 대체 링을 실제로 그리는 경로가 아니면 UA 아웃라인을
끄지 않는다. 여기서는 아웃라인을 건드리는 코드가 아예 없다.

## 필요하지만 없는 토큰

**없다.** 이 컴포넌트가 직접 쓰는 시각 값 2개(`spacing/24` · `spacing/16`)가 모두
기존 토큰과 값이 일치했고, 나머지는 재사용한 컴포넌트 4개가 이미 토큰으로 그린다.

참고로 남겨두는 항목이 하나 있다 — **막힌 것은 없다.**

| 항목 | 값 | 상태 |
|---|---|---|
| 구분선 좌우 인셋 1px | `get_design_context` 의 `left-px right-px`. 변수 바인딩 없음 | 옮기지 않기로 판단했다 (위 "폭" 절). 되살리기로 결정되면 그때 토큰이 필요하다. `--spacing-hairline` 에 끼워 맞추지 않았다 — 그 토큰은 선 두께 축이다 |

이 에이전트는 `src/tokens/**` 를 편집하지 않았다.

## 불명확한 값

**없다.** 추정해서 구현에 넣은 값이 하나도 없다.

`get_variable_defs`(60:23793)가 `{}` 를 반환한 끝 아이콘 색도 추정하지 않았다 —
export SVG 의 `fill="#1A1A1A"` 를 직접 읽어 `--color-icon-primary` 의 최종 값과
대조해 일치를 확인했다 (위 "셰브론 기하 대조").

## Code Connect

`get_design_context`(60:23786 · 60:23802) 응답에 Code Connect 매핑이 없었다.
매핑 생성은 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)

## 검증

### 축 3개를 추가한 뒤 (2026-08-25)

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. `ListCheckbox.tsx` · `.stories.tsx` 수정 중 차단 0건. 최종 파일 내용을 다시 hook 에 먹여 재확인 — 둘 다 exit 0 |
| `npm run typecheck` | 통과 (exit 0) |
| `npm run build` | 통과 (`✓ 63 modules transformed`, exit 0) |
| 빌드 CSS 값 대조 | 통과. `.py-20{padding-block:var(--spacing-20)}` · `--spacing-20:1.25rem` = 20 = Figma 변수 `spacing/component/y/20` ✔ |
| raw 값 스캔 | 통과. 0건 |
| 기존 호출부 영향 | 0건. 세 기본값이 기존 렌더 결과와 같아 `Stacked` 스토리를 포함한 모든 호출부가 그대로다 |
| `get_screenshot` 픽셀 대조 | 미실행. Chrome 확장 미연결. 최초 작업의 대조 결과(아래)는 `size="default"` 경로에 그대로 유효하다 — 그 경로의 마크업이 바뀌지 않았다 |

### 최초 작업 (2026-08-24)

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 파일 3개 작성 중 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음, exit 0). `tsc -b --listFiles` 로 `ListCheckbox.tsx` · `ListCheckbox.stories.tsx` 가 실제로 프로그램에 포함된 것을 확인했다 |
| `npm run build` | 통과 (`✓ 32 modules transformed` · `✓ built in 344ms`, exit 0) |
| 빌드 CSS 값 대조 | 통과. 아래 |
| `get_screenshot` 대조 | 통과. 아래 |
| raw 값 스캔 | 통과. hex · `rgb(` · `hsl(` · px/rem 리터럴 · Tailwind arbitrary `[...]` · `style=` · `var(--` 전부 0건. `h-px` · `left-px` · `right-px` 도 0건 |
| 범위 밖 변경 | 0건. `src/components/ListCheckbox/` 안의 새 파일 3개만 만들었다. `ListSlotCheckbox/**` · `ListSlotRadio/**` · `src/tokens/**` 는 수정하지 않았다 |

### 빌드 CSS 값 대조

빌드 산출 CSS 에서 확인한, 이 파일이 직접 쓰는 두 유틸리티의 최종 값:

```
.py-24{padding-block:var(--spacing-24)}
.gap-16{gap:var(--spacing-16)}

--spacing-24:1.5rem;   /* = 24px — Figma 변수 spacing/24 = 24 ✔ */
--spacing-16:1rem;     /* = 16px — Figma 변수 spacing/16 = 16 ✔ */
```

### `get_screenshot` 대조 — 눈이 아니라 픽셀 좌표로

`get_screenshot`(60:23751, 1032×190) 을 원본 해상도로 받고, 구현이 내는 마크업을
같은 1032×190 하네스(행 폭 362, 좌표 `@ (55,59)` · `@ (578,59)` — Figma 진열 프레임과
동일)에 headless Chrome 으로 렌더해 좌표를 비교했다. 빌드 산출 CSS 를 그대로 물렸다.

| 측정 항목 | Figma | 구현 | 판정 |
|---|---|---|---|
| 체크박스 박스 좌·우 변 (y=95 의 어두운 런) | `(57,58)` · `(75,76)` | `(57,58)` · `(75,76)` | **완전 일치** |
| 라벨 첫 글자 런 (y=95) | `(96,98)` · `(106,107)` · `(111,113)` · `(117,119)` | `(96,98)` · `(105,107)` · `(111,113)` · `(117,119)` | 1px 차 1건 — 글자 안티에일리어싱 |
| 구분선 y 좌표 | `130` | `130` | **완전 일치** (행 상단 59 + 72 - 1) |
| 구분선 색 (실측 RGB) | `(235,235,235)` | `(235,235,235)` | **완전 일치** = `#ebebeb` = `border/primary` |
| 구분선 두께 | y=130 한 줄뿐 (y=131 은 0px) | y=130 한 줄뿐 | **완전 일치** — 1px |
| 구분선 가로 범위 | `x 56…415` (360px) | `x 55…416` (362px) | **좌우 1px 씩 차이.** 위 "폭" 절에 근거를 적은 그 값이고, 다른 차이는 없다 |

구분선 y 가 정확히 130 으로 같다는 것이 **행 높이 72 가 맞고 구분선이 그 높이를
늘리지 않는다**는 증거다 (in-flow 로 넣었다면 73 이 되어 y 가 어긋난다).

육안 대조도 같다: 회색 배경 위에 좌 → 우로 체크박스 → 라벨 "타이틀 영역입니다." →
셰브론, 그 아래 연회색 1px 선. `isChecked=false` 는 회색 선만 있는 빈 사각형,
`isChecked=true` 는 검정으로 찬 사각형 + 흰 체크. 보조 텍스트는 두 variant 모두 없다
(`description=false`).
