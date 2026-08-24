# Icon — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `Icon.tsx`, 스토리는 `Icon.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-6168&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 노드 | `27683:6168` — section "Icon", 943×348 |
| 추출 | `get_metadata` · `get_screenshot` · `get_variable_defs` · `download_assets(defaultFormat: svg)` (2026-08-24) |

## 구현 범위 — 12개

`get_metadata`로 확인한 섹션 직속 자식은 14개다. 그중 2개를 제외해 **12개**를 구현했다.

| Figma 이름 | 노드 ID | `name` 값 |
|---|---|---|
| `Icon/chevronLeft-small-line` | 60:24538 | `chevronLeft-small` |
| `Icon/chevronRight-small-line` | 60:24541 | `chevronRight-small` |
| `Icon/chevronUp-small-line` | 35:19992 | `chevronUp-small` |
| `Icon/chevronLeft-large-line` | 35:12135 | `chevronLeft-large` |
| `Icon/chevronRight-large-line` | 35:12134 | `chevronRight-large` |
| `Icon/chevronUp-large-line` | 35:12132 | `chevronUp-large` |
| `Icon/chevronDown-large-line` | 35:12133 | `chevronDown-large` |
| `Icon/visibility-line` | 35:15200 | `visibility` |
| `Icon/visibilityOff-line` | 35:15201 | `visibilityOff` |
| `Icon/success-circle-line` | 35:12105 | `success-circle-line` |
| `Icon/success-circle-fill` | 35:12104 | `success-circle-fill` |
| `icon/circle-fill` | 35:12101 | `circle-fill` |

제외한 2개:

- `Icon/line` (18:5191) — 점선 빈 플레이스홀더 템플릿. 아이콘이 아니다.
- `Icon/slot-end` (27683:4432) — `Icon/chevronRight-small-line` 인스턴스를 담은 슬롯 래퍼 프레임. 심볼이 아니라 배치용 프레임이다.

`chevronDown-small-line`은 이 섹션에 없다. small은 Left/Right/Up 3방향만 존재한다.
없는 아이콘을 추측해 만들지 않았다. (원칙 1)

### 이름과 기하가 어긋나는 항목

`icon/circle-fill` (35:12101)은 이름과 달리 **단색 원이 아니라, 채워진 원에서 느낌표(!)를
파낸 alert 형태**다. `get_screenshot`과 path 기하(원 + 점 + 막대, `fill-rule="evenodd"`)가
둘 다 이를 확인한다. Figma 기하를 그대로 옮겼고 `name` 값은 요청받은 `circle-fill`을 유지했다.
Figma 쪽 이름을 고칠지는 이 저장소의 결정 범위가 아니라 보고만 한다. (원칙 3)

또한 이 심볼만 접두사가 소문자 `icon/`다. 나머지 11개는 `Icon/`이다.

## 값의 출처

| 값 | 출처 | 결론 |
|---|---|---|
| SVG path 기하 | Figma `download_assets(svg)` export SVG의 `<g id="Icon/...">` 그룹 | 24 뷰박스 좌표 그대로. 12개 16개 path 전부 Figma 출력과 문자 단위 동일함을 검증 |
| 색 | Figma 변수 `icon/primary` = `color/icon/base/primary` (`get_variable_defs`) | 기존 토큰 `--color-icon-primary`와 값 일치 → 재사용 |
| 크기 | `get_metadata`의 각 심볼 width/height (전부 24×24) | 기존 토큰 `--spacing-24` → `size-24` |
| stroke width | Figma 원본에 **stroke 속성이 0건**. 12개 전부 확장된 아웃라인(fill 전용) | 코드에 stroke 값이 들어갈 자리가 없다 |

`불명`으로 남은 값은 없다.

## 사용한 토큰

새로 만든 토큰은 없다. 전부 기존 `src/tokens` 재사용이다. (원칙 2)

### 컴포넌트 (`Icon.tsx`)

| 토큰 | 유틸리티 | 쓰임 |
|---|---|---|
| `--spacing-24` | `size-24` | 24×24 고정 크기 |
| `--color-icon-primary` | `text-icon-primary` | `color="primary"` (기본값) |
| `--color-icon-secondary` | `text-icon-secondary` | `color="secondary"` |
| `--color-icon-tertiary` | `text-icon-tertiary` | `color="tertiary"` |
| `--color-icon-inverse` | `text-icon-inverse` | `color="inverse"` |
| `--color-icon-brand` | `text-icon-brand` | `color="brand"` |
| `--color-icon-negative` | `text-icon-negative` | `color="negative"` |
| `--color-icon-disabled-on-light` | `text-icon-disabled-on-light` | `color="disabled-on-light"` |
| `--color-icon-disabled-on-dark` | `text-icon-disabled-on-dark` | `color="disabled-on-dark"` |

색은 SVG 내부에서 `fill="currentColor"`로 받는다. path에 색 리터럴은 0건이다.
`shrink-0`은 토큰 값이 아니라 레이아웃 유틸리티로, flex 컨테이너에서 24×24 고정이
줄어들지 않게 하기 위한 것이다.

### 스토리 (`Icon.stories.tsx`)

| 토큰 | 유틸리티 |
|---|---|
| `--spacing-8`, `--spacing-24` | `gap-8`, `gap-24`, `p-24` |
| `--radius-8` | `rounded-8` |
| `--color-bg-primary`, `--color-bg-inverse` | `bg-bg-primary`, `bg-bg-inverse` |
| `--color-text-secondary`, `--color-text-inverse` | `text-text-secondary`, `text-text-inverse` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

## a11y — 장식용 기본값의 근거

기본값은 `aria-hidden="true"`다.

이 섹션의 12개는 전부 **텍스트가 있는 컨트롤에 붙는 보조 표시**다. chevron은 아코디언·
리스트·페이지네이션의 방향 표시, `visibility`/`visibilityOff`는 비밀번호 필드의 토글,
`success-circle-*`과 `circle-fill`은 이미 문구가 있는 상태 메시지의 앞머리 표식이다.
Figma에도 아이콘 단독으로 의미를 전달하는 배치는 이 섹션에 없다.
이런 자리에서 아이콘을 스크린리더에 노출하면 옆 라벨이 두 번 읽힌다.

아이콘이 유일한 의미 전달자인 자리(예: 텍스트 없는 아이콘 버튼)에서는 호출부가
`aria-hidden={false}`와 `aria-label`을 넘겨 덮어쓴다. props를 `aria-hidden` 뒤에
전개하므로 덮어쓰기가 동작한다.

`role`은 넣지 않았다. `aria-hidden="true"`인 노드에 role을 붙이는 것은 무의미하고,
노출이 필요한 경우의 role은 그 자리의 맥락(`img` / `button`)이 결정하므로
컴포넌트가 미리 정할 수 없다. 요청 범위 밖의 prop을 만들지 않았다. (원칙 2)

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 초안에서 **주석에 넣은** 색 리터럴과 px 리터럴 2건을 차단당해, 예외를 추가하지 않고 문장을 고쳐 통과시켰다 |
| `npm run typecheck` | 통과 |
| `npm run build` | 통과 |
| path 기하 대조 | 12개 16개 path 전부 Figma export SVG와 문자 단위 동일 |
| `get_screenshot`(27683:6168) 대조 | 12개 형태 일치 |
