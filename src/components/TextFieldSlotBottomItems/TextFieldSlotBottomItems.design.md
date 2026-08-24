# TextFieldSlotBottomItems — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `TextFieldSlotBottomItems.tsx`, 스토리는 `TextFieldSlotBottomItems.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-2222> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | section "TextField" (`TextFieldSlot/End/Items` 13:2209 와 같은 섹션) |
| 컴포넌트 세트 | `13:2222` — frame "TextFieldSlot/Bottom/Items", 540×207 |
| 추출 | `get_metadata`(13:2222 · 13:2223 · 13:2225 · 13:2226 · 20:5754) · `get_design_context`(13:2223 · 13:2225) · `get_variable_defs`(13:2223 · 13:2225) · `get_screenshot`(13:2222) (2026-08-24) |

## 노드 구조 — 변형 2개, 축 1개

```
frame 13:2222  "TextFieldSlot/Bottom/Items"  540×207
├─ symbol 13:2223  "contentType=text"      362×21   ← flex · items-start
│  └─ instance 27738:6501  "TextFieldTextSet"  362×21  (FILL)
│     └─ 주 컴포넌트 35:14458  ← 이 저장소의 TextFieldTextSet
└─ symbol 13:2225  "contentType=checkbox"   61×40   ← flex · items-start
   └─ instance 13:2226  "[Checkbox]"  61×40  (hug)
      ├─ instance I13:2226;13:3940  "ListSlot/Checkbox/small/false/false"  20×20
      └─ text     I13:2226;13:3941  "label" ("레이블")  37×17  @ (24, 11.5)
```

축은 `contentType` 하나이고 값은 `text` · `checkbox` 2개다. 전 조합이 곧 전부다.
`get_design_context` 가 두 노드에서 방출한 property 도 `contentType` 하나뿐이다.

**두 변형은 자식이 완전히 다르다.** 공통은 루트의 `flex items-start` 뿐이고,
루트에는 fill · stroke · radius · padding · gap 이 하나도 없다 (자식이 1개라 gap 이 무효).

## 재사용 판정

### 1. `TextFieldTextSet` — 재사용했다 ✔

`get_design_context`(13:2223) 가 인스턴스 `27738:6501` 의 주 컴포넌트를
**`35:14458 TextFieldTextSet`** 으로 확인해 주었다. 이 저장소의
`TextFieldTextSet.tsx` 가 옮긴 세트와 같은 노드다.

인스턴스가 방출한 안쪽 노드 id 가 그 컴포넌트의 구조와 그대로 일치한다:

| 방출된 노드 | 이름 | `TextFieldTextSet.tsx` 가 문서화한 구조 |
|---|---|---|
| `I27738:6501;35:14662` | content | 접은 단 |
| `I27738:6501;35:14663` | wrapper | 접은 단 |
| `I27738:6501;35:14664` | iconarea | `pt-textfield-textset-icon-inset-top` |
| `I27738:6501;35:14665` | Icon/circle-fill | `status="default"` 의 글리프 |
| `I27738:6501;35:14666` | supportingText | 접은 단 |
| `I27738:6501;35:14667` | text ("도움말 메세지") | `children` |

물려 있는 값도 기본 variant 그대로다 — 본문색 `text/secondary`, 아이콘 있음,
글리프 `Icon/circle-fill`. 즉 `status="default"` · `hasIconStart={true}` 이고
둘 다 컴포넌트 기본값이라 코드에서 넘기지 않는다.
**보조 텍스트 묶음을 다시 그리지 않았다.** (원칙 2)

### 2. `ListCheckbox` — 재사용하지 않았다. 다른 컴포넌트다 ✘

| 항목 | 이 자리의 인스턴스 | 저장소 `ListCheckbox` |
|---|---|---|
| Figma 노드 | `13:2226` `[Checkbox]` (주 컴포넌트 `13:3929`) | `60:23751` `List/Checkbox` |
| 크기 | 61×40 | 362×72 |
| 구성 | 체크박스 그림 + 라벨, 2개 |  체크박스 + `TextSetTitle` + 셰브론 + `Divider`, 4개 |

Figma 가 `[Checkbox]` 에 붙여 둔 설명도 리스트가 아니라 선택 컨트롤이다:
"Checkbox는 사용자가 여러 항목 중 하나 이상을 선택할 수 있도록 하는 선택 컨트롤
컴포넌트입니다. … 키워드 : Checkbox, multi select, selection control, option selection".
`ListCheckbox` 쪽 설명은 "Content 계열에서 여러 정보를 항목 단위로 정렬하여 표현하기
위한 컴포넌트" 다. 주 컴포넌트 id · 크기 · 자식 구성 · 설명 네 가지가 전부 다르다.

### 3. `ListSlotCheckbox` — 재사용하지 못했다. `size` 축이 없다 ✘

`[Checkbox]` 안의 박스는 `ListSlot/Checkbox` 의 **`small` variant** 이고 20×20 이다
(레이어 이름 `ListSlot/Checkbox/small/false/false` = `size`/`isChecked`/`isDisabled`).

그런데 이 저장소의 `ListSlotCheckbox` 가 옮긴 세트 `20:5754` 를 `get_metadata` 로
다시 확인하면 variant 가 4개뿐이고 **전부 24×24 이며 `size` 축이 없다**:

```
frame 20:5754  "ListSlot/Checkbox"  1012×108
├─ symbol 20:5755  "isChecked=false, isDisabled=false"  24×24
├─ symbol 20:5771  "isChecked=true,  isDisabled=false"  24×24
├─ symbol 20:5759  "isChecked=false, isDisabled=true"   24×24
└─ symbol 20:5775  "isChecked=true,  isDisabled=true"   24×24
```

즉 `small` 은 이 저장소가 아직 옮기지 않은 variant 다.
인스턴스가 방출한 안쪽 노드 id (`20:5764` · `20:5765`) 도 위 4개 심볼의 자식
(`20:5757` · `20:5761` · `20:5772` · `20:5777`, `ListSlotCheckbox.tsx` 기록)과 다르다.

> 주 컴포넌트 `13:3929` 와 `20:5764` 는 `get_metadata` 가 둘 다
> "This is an invalid node selection" 을 돌려준다 — 다른 페이지에 있어 조회되지 않는다.
> 그래서 인스턴스가 방출한 것(레이어 이름 · 크기 · export SVG)만으로 판정했다.
> **확인하지 못한 것**: 그 두 노드의 component property 목록. 그래서 `[Checkbox]` 가
> 선택/비활성 property 를 노출하는지는 알 수 없다 (원칙 1).

#### 크기만 줄여 재사용할 수 없는 이유 — 기하가 비례하지 않는다

두 variant 의 export SVG `d` 를 실측한 값이다.

| | 상자 | 박스 | 코너 반경 | 선 두께 | 여백 |
|---|---|---|---|---|---|
| 24 variant (저장소 `ListSlotCheckbox`) | 24 | 20 | 4 | 1.5 | 2 |
| `small` variant (이 자리) | 20 | 16 | 3 | 1.5 | 2 |
| 24 짜리를 20 으로 축소하면 | 20 | 16.67 | 3.33 | 1.25 | 1.67 |

축소 결과가 네 값 중 세 개에서 어긋난다. 선 두께가 특히 그렇다 —
두 variant 의 실제 두께는 1.5 로 **같은데**, 축소하면 1.25 가 된다.
`TextFieldTextSet` 이 24 뷰박스인 `Icon` 을 16 자리에 쓰지 않은 것과 같은 판정이다. (원칙 1)

#### 재사용하려면 무엇이 필요한가 (수정하지 않고 보고만 한다)

`ListSlotCheckbox` 에 Figma 세트에 있는 `size` 축을 추가해야 한다:

- `ListSlotCheckboxProps` 에 `size?: 'small' | …` 추가
- `small` 용 16 뷰박스 path 3종(비선택 박스 · 선택 박스 · 체크 표시) 확보 —
  이 문서를 쓴 시점에 export 로 받은 것은 **비선택 박스 1종뿐**이다.
  나머지 2종은 그 variant 가 이 노드 안에 없어 받지 못했다.
- 상자 크기를 `size-24` 고정에서 `size-20` / `size-24` 분기로

기존 컴포넌트 수정은 이 작업의 범위 밖이라 하지 않았다. (원칙 3)
그래서 이 컴포넌트는 Figma export 의 16 뷰박스 `d` 를 **자기 파일 안에서** 그린다 —
`ListSlotCheckbox` 자체가 vector 를 직접 그리는 것, `TextFieldTextSet` 이 16 뷰박스
아이콘을 직접 그리는 것과 같은 처리다.

## 값의 출처

| 값 | Figma 원값 | 출처 | 토큰 | 결론 |
|---|---|---|---|---|
| 루트 정렬 | flex · items-start | 13:2223 · 13:2225 | — | `flex items-start` (치수 리터럴이 아니다) |
| 루트 fill · stroke · radius | 없음 | 두 변형 모두 0건 | — | 넣을 자리가 없다 |
| 보조 문구 묶음 전체 | 인스턴스 27738:6501 | 주 컴포넌트 35:14458 | — | `TextFieldTextSet` 재사용 (위 판정 1) |
| 체크박스 ↔ 라벨 간격 | 4 | 변수 `spacing/4` | `--spacing-4` = `0.25rem` = 4 | 값 일치 → 재사용 (`gap-4`) |
| 체크박스 상자 크기 | 20×20 | `I13:2226;13:3940` width/height | `--spacing-20` = `1.25rem` = 20 | 값 일치 → 재사용 (`size-20`) |
| 체크박스 글리프 크기 | 16×16 | export SVG 의 `width`/`height`/`viewBox` (상자 안 inset 10%) | `--spacing-16` = `1rem` = 16 | 값 일치 → 재사용 (`size-16`) |
| 체크박스 여백 2 | 상자 20 − 글리프 16 | 위 두 값의 차 | — | 리터럴로 적지 않고 20 상자 안 가운데 정렬로 만든다 |
| 체크박스 박스 색 | `#747474` | 변수 `icon/secondary` | `--color-icon-secondary` → `--neutral-gray-light-600` = `#747474` | 값 일치 → 재사용 (`fill-icon-secondary`) |
| 체크박스 기하 (반경 3 · 두께 1.5) | export `d` 안에 포함 | `get_design_context`(13:2225) 의 asset SVG | — | SVG 기하 → 토큰 규칙 스코프 제외 |
| 라벨 색 | `#1a1a1a` | 변수 `text/primary` | `--color-text-primary` → `--bw-light-black` = `#1a1a1a` | 값 일치 → 재사용 (`text-text-primary`) |
| 라벨 타이포 | `Font(family: family-font, style: Medium, size: font-size/label-medium(14), weight: 500, lineHeight: 100, letterSpacing: 0)` | 변수 `font/label/medium` | `@utility font-label-medium` = `0.875rem`(14) / `--font-weight-base`(500) / `line-height: normal` | 4개 값 전부 일치 → 재사용 |
| 라벨 줄바꿈 | `whitespace-nowrap` | 텍스트 노드 `I13:2226;13:3941` | — | `whitespace-nowrap` |
| **체크박스 행 상하 패딩** | **10** | **변수 바인딩 없음** (아래) | `--spacing-textfield-bottomitems-checkbox-inset-y` = `0.625rem` | 전용 토큰으로 추가됨 → `py-textfield-bottomitems-checkbox-inset-y` |
| 심볼 폭 362 · 61 | hug/FILL 결과 | 자식에서 파생 | — | 폭 유틸리티를 쓰지 않는다 (아래) |
| 심볼 높이 21 · 40 | 파생 결과 | 21 = 본문 행간, 40 = 20 + 10 + 10 | — | 높이 유틸리티를 쓰지 않는다 |

### 상하 패딩 10 에 전용 토큰이 필요했던 이유

`get_design_context`(13:2225) 가 이 값만 `py-[10px]` 로, 즉 변수가 아닌 맨 값으로
내보냈다. `get_variable_defs`(13:2225) 도 `spacing/4` 만 돌려주고 10 은 없다.

**기존 토큰으로 대체할 수 없는 이유**

- spacing scale 13단(`4 · 6 · 8 · 12 · 14 · 16 · 20 · 24 · 32 · 40 · 64 · 80 · 100`)에 10 이 없다.
  `spacing.tokens.css` 가 그 표에 10 이 없음을 이미 확인해 기록해 두었다.
- 값이 10 인 기존 토큰 2개는 둘 다 다른 컴포넌트 전용으로 선언돼 있다:
  `--spacing-header-item-inset-y` (Header 행 안 아이템 묶음),
  `--spacing-statusbar-inset-top` (OSBarTopNavigation 루트).
  `spacing.tokens.css` 가 이 둘을 서로 합치지 않은 기준을 못박아 뒀다 —
  "값이 같아서가 아니라 축이 같아서" 합치고, "한쪽이 Figma 에서 움직여도 다른 쪽은
  따라가지 않는다" 면 나눈다. 입력 필드 하단 체크박스 행의 패딩은 세 번째 축이다.
- `--spacing-control-md`(40) 로 높이를 고정하는 것도 아니다. Figma 의 기제는 높이가
  아니라 패딩이고(40 = 20 + 10 + 10 인 **파생값**), 라벨이 줄바꿈되면 두 기제의
  결과가 갈린다. 값이 우연히 같다고 바꿔 끼우는 것은 추정이다. (원칙 1)

**필요한 토큰** — `token-guardian` / `/sync-tokens` 담당:

```css
--spacing-textfield-bottomitems-checkbox-inset-y: 0.625rem;  /* 10px */
```

이름에 `-inset-y` 를 남기는 이유는 `--spacing-textfield-textset-icon-inset-top` ·
`--spacing-header-item-inset-y` 와 같다: `--spacing-*` 는 `p-*` 뿐 아니라
`h-*` · `w-*` · `gap-*` 도 읽으므로 이름이 자리를 말하고 있어야 오용이 드러난다.

**현재 상태**: 이 토큰은 `/sync-tokens` 로 **추가됐다.** raw 값은 처음부터 쓰지 않았고,
`.tsx` 가 적어 둔 유틸리티 `py-textfield-bottomitems-checkbox-inset-y` 가 그대로 동작한다.
**체크박스 행 높이는 10 + 20 + 10 = 40 으로 Figma 와 일치한다.** 파일을 고칠 필요는 없었다.

### 폭 362 · 61 을 옮기지 않은 이유

`text` 쪽 자식은 FILL 이고 `checkbox` 쪽 자식은 hug 다. 즉 두 폭 다 컴포넌트 속성이
아니라 파생값이다. 루트는 블록 요소라 부모 폭을 그대로 받으므로 폭 유틸리티를 넣지
않았고, `checkbox` 자식에 `shrink-0` 을 두어 Figma 대로 왼쪽에 붙게 했다.
`TextFieldSlotEndItems` 가 24×24 · 14×19 에 대해, `TextFieldTextSet` 이 360 에 대해
세운 것과 같은 기준이다.

## `불명` 으로 남은 값

| 값 | 왜 불명인가 | 구현에 넣었나 |
|---|---|---|
| `[Checkbox]`(13:3929) 의 component property 목록 | 다른 페이지에 있어 `get_metadata` 가 "invalid node selection" 을 돌려준다 | 넣지 않았다. 세트 13:2222 의 축이 `contentType` 하나뿐이므로 그 축만 구현했다 |
| `ListSlot/Checkbox` `small` 의 선택 상태 · 비활성 상태 기하 | 그 variant 가 이 노드 안에 없어 export 를 받지 못했다 | 넣지 않았다. Figma 가 여기 두고 있는 것은 비선택·활성 1개다 |

두 항목 모두 **이 컴포넌트의 렌더에는 필요하지 않다** — Figma 세트 13:2222 에
그 축이 없기 때문이다. 그래서 구현을 막지 않았고, 추정으로 채우지도 않았다. (원칙 1·2)

## a11y — 책임 분리

Figma 인스턴스 13:2226 안에 상호작용 관련 노드가 하나도 없다 (hit area · 상태 레이어
전부 없음). `ListSlotCheckbox` · `ListCheckbox` 와 같은 성격의 **표시 요소**로 구현했다.

| 항목 | 담당 |
|---|---|
| `<input type="checkbox">` 또는 `role="checkbox"` + `aria-checked` | 호스트 |
| 라벨 연결 (`<label for>` / `aria-labelledby`) | 호스트 |
| 키보드 조작 · 터치 타깃 | 호스트 |
| 포커스 표시 | 호스트 (UA 아웃라인을 끄는 코드가 없어 그대로 살아 있다) |
| `text` 변형의 `aria-describedby` · live region | 호스트 (`TextFieldTextSet` 이 세운 규칙 그대로) |
| 체크박스 그림 · 라벨 서식 | 이 컴포넌트 |

`...props` 를 루트에 전개하므로 호스트가 `id` · `role` · `aria-*` · `onClick` ·
`tabIndex` 를 그대로 얹을 수 있다. 체크박스 SVG 는 옆 라벨과 뜻이 겹치므로
`aria-hidden` 이다 (`Icon` · `ListSlotCheckbox` 와 같은 기준).

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기 차단) | 통과 — `.tsx` · `.stories.tsx` 둘 다 차단 없이 기록됨 |
| `npm run typecheck` | 통과 |
| `npm run build` | 통과 |
| `get_screenshot`(13:2222) 대조 | 아래 참조 |

스크린샷 대조: `text` 는 아이콘 + "도움말 메세지" 한 줄, `checkbox` 는 빈 사각형 +
"레이블" 로 Figma 와 같다. 체크박스 행의 상하 패딩 10 도 전용 토큰으로 채워져
행 높이가 Figma 와 같은 40 이다. **다른 점 0건** — 좌우 배치·색·서식·간격이 모두 같다.
