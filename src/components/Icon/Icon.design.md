# Icon — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `Icon.tsx`, 스토리는 `Icon.stories.tsx`.

## Figma 소스

**소스가 한 곳이 아니다.** 이 파일의 초판은 "`Icon` 섹션(27683:6168)의 심볼만 담는다"를
전제로 썼지만, 2026-08-24 의 2차 추가로 그 전제가 깨졌다. 아래 두 출처를 모두 쓴다.

| # | 출처 | 노드 | 담긴 글리프 |
|---|---|---|---|
| 1 | section "Icon", 943×348 | `27683:6168` | 아래 12개 |
| 2 | `Icon` 섹션 **밖** — 개별 컴포넌트·인스턴스 | `35:12116` · `13:2401` | `info-circle-fill` · `close-circle-fill` |

| 항목 | 값 |
|---|---|
| URL (출처 1) | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-6168&t=IKuf4oO7n3Ltvjww-11> |
| URL (출처 2) | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/?node-id=13-2401> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 추출 | `get_metadata` · `get_screenshot` · `get_variable_defs` · `download_assets(defaultFormat: svg)` (2026-08-24) |

## 구현 범위 — 14개

### 출처 1 — `Icon` 섹션 직속 12개

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

### 출처 2 — `Icon` 섹션 밖의 2개 (2026-08-24 추가)

이 2개는 `Icon` 섹션(27683:6168)의 자식 14개에 **없다.** `get_metadata`(27683:6168)로
확인했다. 그래서 위 12개와 소스 위치도, 추출 경로도 다르다.

| `name` 값 | Figma 노드 | 노드 종류 | 쓰이는 곳 |
|---|---|---|---|
| `info-circle-fill` | 컴포넌트 `35:12116` | 컴포넌트 (24×24, vector 20×20) | Wave 2 이후. **`TextFieldTextSet`은 쓰지 않는다** — 아래 참조 |
| `close-circle-fill` | 인스턴스 `13:2401` · `13:2375` | 인스턴스 (24×24, vector 20×20 at (2,2)) | Wave 2 의 입력값 지우기 버튼 |

#### `info-circle-fill` — 24 뷰박스 좌표를 얻은 경로와 그 검증

컴포넌트 노드 `35:12116`은 `get_metadata` · `get_screenshot` · `get_design_context`가
전부 `invalid node selection`으로 거부한다. 응답하는 것은 `download_assets` 하나뿐이고,
그 응답은 **vector 자체 경계인 20 뷰박스** SVG다 — 24 뷰박스가 아니다.

24 뷰박스로 옮기려면 좌표를 `(2, 2)`만큼 밀어야 하는데, 이 이동을 손으로 하지 않았다.
스크립트로 옮기고, **같은 스크립트를 근거가 있는 표본에 돌려 검증**했다:

1. `close-circle-fill`은 20 뷰박스 vector export와 24 뷰박스 export를 **둘 다** 얻을 수 있다
   (`download_assets(13:2401)`가 `svgAssets`=20 뷰박스, `export`=24 뷰박스를 함께 준다).
2. 그 20 뷰박스 path에 같은 스크립트를 돌린 결과가 Figma가 직접 내보낸 24 뷰박스 path와
   **문자 단위로 동일**했다 (숫자 유효자릿수 6, 뒤따르는 0 제거까지 일치).
3. 따라서 같은 스크립트를 `info-circle-fill`의 20 뷰박스 vector에 적용한 결과를 채택했다.

`(2, 2)` 배치의 근거는 추정이 아니다. `close-circle-fill`에서 실측으로 확인됐고
(vector 20×20 @ (2,2) in 24×24), 기존 12개 중 원형 글리프 3개
(`circle-fill` · `success-circle-fill` · `success-circle-line`)도 전부 24 뷰박스에서
2..22를 차지한다.

#### ⚠ `TextFieldTextSet`은 이 `info-circle-fill`을 쓰지 않는다

`TextFieldTextSet`(35:14458)의 상태 아이콘 자리는 **16×16**이고, 그 안의 글리프는
**12×12**다 (여백 2). 이 컴포넌트의 24 뷰박스 글리프는 24 안에서 20을 차지하므로
(여백 2), 같은 글리프를 16 크기로 렌더하면 13.33이 되어 Figma의 12와 어긋난다.
`Icon`에는 크기 prop이 없고 추가는 이번 작업 범위 밖이다. 자세한 실측과 판단 근거는
`TextFieldTextSet.design.md`에 있다.

즉 `info-circle-fill`은 **현재 소비자가 없는 상태로 추가됐다.** 요청받은 범위이므로
넣었고, 사실을 숨기지 않고 여기에 적는다. (원칙 1·4)

### 이름과 기하가 어긋나는 항목

`icon/circle-fill` (35:12101)은 이름과 달리 **단색 원이 아니라, 채워진 원에서 느낌표(!)를
파낸 alert 형태**다. `get_screenshot`과 path 기하(원 + 점 + 막대, `fill-rule="evenodd"`)가
둘 다 이를 확인한다. Figma 기하를 그대로 옮겼고 `name` 값은 요청받은 `circle-fill`을 유지했다.
Figma 쪽 이름을 고칠지는 이 저장소의 결정 범위가 아니라 보고만 한다. (원칙 3)

또한 이 심볼만 접두사가 소문자 `icon/`다. 나머지 11개는 `Icon/`이다.

## 값의 출처

| 값 | 출처 | 결론 |
|---|---|---|
| SVG path 기하 (출처 1, 12개) | Figma `download_assets(svg)` export SVG의 `<g id="Icon/...">` 그룹 | 24 뷰박스 좌표 그대로. 12개 16개 path 전부 Figma 출력과 문자 단위 동일함을 검증 |
| SVG path 기하 (`close-circle-fill`) | `download_assets(13:2401)`의 `export` — 24 뷰박스 SVG의 `<g id="close-circle-fill">` | 좌표 그대로. 이동·보정 0건 |
| SVG path 기하 (`info-circle-fill`) | `download_assets(35:12116)`의 `svgAssets` — 20 뷰박스 vector | 스크립트로 `(2,2)` 이동. 스크립트는 `close-circle-fill`의 두 export 대조로 검증 (위 참조) |
| 색 | Figma 변수 `icon/primary` = `color/icon/base/primary` (`get_variable_defs`) | 기존 토큰 `--color-icon-primary`와 값 일치 → 재사용 |
| 상태 색 3종 | `TextFieldTextSet`(35:14458) 상태 아이콘의 SVG export fill. Figma 변수가 아니다 — 근거는 `colors.tokens.css`의 `icon/status-*` 주석 | 기존 토큰 `--color-icon-status-negative` · `-positive` · `-informative` 재사용 (`token-guardian`이 추가해 둔 것) |
| 크기 | `get_metadata`의 각 심볼 width/height (전부 24×24) | 기존 토큰 `--spacing-24` → `size-24` |
| stroke width | Figma 원본에 **stroke 속성이 0건**. 14개 전부 확장된 아웃라인(fill 전용) | 코드에 stroke 값이 들어갈 자리가 없다 |

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
| `--color-icon-status-negative` | `text-icon-status-negative` | `color="status-negative"` |
| `--color-icon-status-positive` | `text-icon-status-positive` | `color="status-positive"` |
| `--color-icon-status-informative` | `text-icon-status-informative` | `color="status-informative"` |

⚠ `color="negative"`(`--color-icon-negative`, Figma 변수 `icon/negative`)와
`color="status-negative"`(`--color-icon-status-negative`)는 **값이 다른 별개 토큰**이다.
후자가 한 단 밝다. 상태 메시지 아이콘 전용이며, 둘을 섞으면 안 된다.
근거는 `colors.tokens.css`의 `icon/status-*` 주석에 있다.

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

출처 1의 12개는 전부 **텍스트가 있는 컨트롤에 붙는 보조 표시**다. chevron은 아코디언·
리스트·페이지네이션의 방향 표시, `visibility`/`visibilityOff`는 비밀번호 필드의 토글,
`success-circle-*`과 `circle-fill`은 이미 문구가 있는 상태 메시지의 앞머리 표식이다.
Figma에도 이 12개가 아이콘 단독으로 의미를 전달하는 배치는 없다.
이런 자리에서 아이콘을 스크린리더에 노출하면 옆 라벨이 두 번 읽힌다.

⚠ **출처 2의 `close-circle-fill`은 다르다.** 이 글리프가 쓰이는 자리(13:2401 ·
13:2375 의 입력값 지우기 버튼)는 옆에 라벨이 없어 **아이콘이 유일한 의미 전달자**다.
그 자리의 호출부는 기본값을 그대로 쓰면 안 되고 `aria-hidden={false}`와 `aria-label`을
반드시 넘겨야 한다. 기본값을 글리프별로 다르게 하지는 않았다 — 같은 글리프라도
라벨이 있는 자리에 놓이면 판단이 뒤집히므로, 그 결정은 자리를 아는 호출부의 몫이다.
이 인계 사항은 Wave 2 로 넘긴다.

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

### 2026-08-24 2차 (글리프 2개 · 색 3개 추가)

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 (`✓ 32 modules transformed`, `✓ built in 312ms`) |
| `close-circle-fill` path | Figma가 직접 내보낸 24 뷰박스 export의 `d`를 그대로 사용. 이동·보정 0건 |
| `info-circle-fill` path | 20 → 24 뷰박스 이동 스크립트를 `close-circle-fill`의 두 export 대조로 검증 — **문자 단위 동일**. 그 검증된 스크립트의 출력을 사용 |
| 빌드 CSS 값 대조 | 신규 색 3개 전부 확인: `.text-icon-status-negative{color:var(--color-icon-status-negative)}` · `.text-icon-status-positive{…}` · `.text-icon-status-informative{…}` |
| 스토리 반영 | `AllIcons`는 `ICON_NAMES`(=`PATHS` 키)를 돌므로 글리프 2개가 자동 반영된다. `Colors`는 `COLORS` 배열이 손으로 적힌 목록이라 신규 색 3개를 더했다 |
