# Divider — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `Divider.tsx`, 스토리는 `Divider.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27738-6454&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 섹션 | `27738:6454` — section "Divider", 1334×248 |
| 컴포넌트 | `20:5645` — COMPONENT "Divider", 360×1 |
| 추출 | `get_metadata` · `get_screenshot` · `get_design_context` · `get_variable_defs` · `use_figma`(읽기 전용 노드 조회) (2026-08-24) |

## 노드 구조

```
section 27738:6454  "Divider"
└─ COMPONENT 20:5645  "Divider"   360×1, layoutMode=VERTICAL, clipsContent=true, fills=[]
   └─ RECTANGLE 20:5646  "divider" 360×1, layoutSizingHorizontal=FILL
      fills[0] = SOLID #ebebeb, boundVariables.color → VariableID:27697:3492 (border/primary)
```

섹션 안에 배치된 노드는 이 컴포넌트 **하나**뿐이다. 하위 컴포넌트(인스턴스)는 없다.

바깥 COMPONENT 는 `fills` 가 비어 있어 시각 값을 하나도 갖지 않는다. 선을 그리는 것은
안쪽 RECTANGLE 뿐이다. 그래서 두 단을 코드에서 한 요소로 합쳤다. (원칙 2)

## variant 조사 결과 — variant 는 없다

메인 세션의 `get_metadata` 는 이 노드 이름을 `Divider/thin/false/0/0` 으로 읽었고,
그 이름이 variant 프로퍼티(두께 / boolean / 숫자 2개)를 시사했다.
Plugin API 로 노드를 직접 조회해 확인한 결과는 다르다.

| 확인 항목 | 값 | 의미 |
|---|---|---|
| `node.type` | `COMPONENT` | 컴포넌트 세트가 아니다 |
| `node.name` | `Divider` | 슬래시 경로가 붙어 있지 않다 |
| `node.parent` | `27738:6454` (SECTION) | 부모가 `COMPONENT_SET` 이 아니다 → variant 컴포넌트가 아니다 |
| `componentPropertyDefinitions` | `{}` | variant 프로퍼티도 component property 도 **0개** |
| 같은 부모의 `Divider*` 형제 | 자기 자신 1개뿐 | 다른 두께·형태의 짝이 없다 |

`get_design_context`(20:5645) 도 같은 이름 `Divider` 를 반환했다.
**컴포넌트 세트가 존재하지 않으므로 구현할 variant 자체가 없다.** prop 을 두지 않았다.

메인 세션이 읽은 `Divider/thin/false/0/0` 과 현재 파일 상태가 어긋나는 점은
이 저장소에서 고칠 수 있는 것이 아니라 보고만 한다. (원칙 3)

## 값의 출처

| 값 | 출처 | 결론 |
|---|---|---|
| 색 | Figma 변수 `border/primary` = `#ebebeb` (`get_variable_defs` · 노드의 `boundVariables.fills`) | 기존 토큰 `--color-border-primary` 와 값 일치 → 재사용 |
| 두께 | RECTANGLE 20:5646 의 height = 1 | 토큰 `--spacing-hairline` 추가됨 → 유틸리티 `h-hairline` 사용 (아래 참조) |
| 폭 | RECTANGLE 20:5646 의 `layoutSizingHorizontal: FILL` | 부모를 채운다 → `w-full`. 컴포넌트의 360 은 모바일 페이지 폭에서 온 배치값이지 컴포넌트 속성이 아니다 |
| radius | 컴포넌트·사각형 모두 코너 반경 없음 | 코드에 반경 유틸리티가 들어갈 자리가 없다 (`--radius-0` 이 Divider 기본값이라는 `design-tokens.css` 의 메모와도 일치) |
| stroke / effect | 두 노드 모두 0건 | 코드에 들어갈 자리가 없다 |
| variant | `componentPropertyDefinitions = {}` | prop 없음 |

`불명`으로 남은 값은 없다.

## 사용한 토큰

`--spacing-hairline` 은 `token-guardian` 이 추가했고, 나머지는 기존 토큰 재사용이다.
(원칙 2 — 토큰 파일은 이 에이전트의 편집 권한 밖이다)

### 컴포넌트 (`Divider.tsx`)

| 토큰 | 유틸리티 | Figma에서 읽은 값 |
|---|---|---|
| `--color-border-primary` | `bg-border-primary` | 변수 `border/primary` = `#ebebeb` |
| `--spacing-hairline` | `h-hairline` | RECTANGLE 20:5646 의 height = 1 (레이어 실측값, 변수 아님) |

빌드 산출 CSS에서 실제로 확인한 값:

```
.bg-border-primary{background-color:var(--color-border-primary)}
--color-border-primary:var(--neutral-gray-light-100);
--neutral-gray-light-100:#ebebeb;
```

토큰이 아닌 유틸리티 3개와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `w-full` | 레이아웃 | Figma `layoutSizingHorizontal: FILL` 의 직역. 치수 리터럴이 아니다 |
| `shrink-0` | 레이아웃 | flex 컨테이너에서 1 단위 높이가 0으로 눌리는 것을 막는다 (Icon 의 `shrink-0` 과 같은 이유) |
| `border-0` | 리셋 | Tailwind preflight 가 `hr { border-top-width: 1px }` 을 얹는다. 지우지 않으면 선이 두 겹이 된다 |

### 스토리 (`Divider.stories.tsx`)

| 토큰 | 유틸리티 |
|---|---|
| `--spacing-16` | `py-16` |
| `--color-bg-primary` | `bg-bg-primary` |
| `--color-text-primary` | `text-text-primary` |
| typography `font-body-medium` (`@utility`) | `font-body-medium` |

## hairline 두께 토큰 — 해결됨

`spacing.tokens.css` 에 `--spacing-hairline: 0.0625rem`(= Figma 의 height 1)이 추가됐고,
Divider 의 두께는 그 유틸리티 `h-hairline` 로 그린다. 남은 미해결 토큰은 없다.

- **출처는 Figma 레이어 실측값이다** — RECTANGLE `20:5646` 의 height = 1.
  Figma 변수도, 가이드 표도 아니다. `get_variable_defs` 로 확인한 결과 이 파일의
  number 변수는 `spacing/*`·`radius/*`·`font-size/*` 뿐이고 두께 변수가 없으며,
  두께를 정의한 가이드 프레임도 없다.
- **spacing 13단 스케일(`0, 4, 6, 8, 12, 14, 16, 20, 24, 32, 40, 64, 80, 100`)에 끼워 넣지 않았다.**
  이 스케일은 간격 축이고 hairline 은 선 두께다. `--spacing-control-*` 와 같은
  별도 하위 축으로 뒀다.
- **`--border-width-*` 축을 만들지 않은 이유**: Tailwind v4 에 그 테마 네임스페이스가
  없어 유틸리티가 생성되지 않는다. 생성되는 네임스페이스(`--spacing-*`)에 얹어야
  `h-hairline` 이 실제로 나온다.

토큰 추가는 `token-guardian` 이 했다. 이 에이전트는 `src/tokens` 를 편집하지 않았다.

## a11y

`<hr>` 을 쓴다. 암묵으로 `role="separator"` 가 붙어 스크린리더가 구역 경계로 읽는다.
`role` 을 명시하지 않은 이유는 네이티브 요소가 이미 제공하기 때문이다.

Figma 원본은 순수한 시각 요소이고 라벨이 없다. 장식 목적으로만 쓰이는 자리에서는
호출부가 `aria-hidden` 을 넘겨 덮어쓸 수 있다 (props 를 전개하므로 덮어쓰기가 동작한다).
그런 자리를 미리 prop 으로 만들어두지 않았다. (원칙 2)

## Code Connect

`get_design_context`(20:5645) 가 **이 컴포넌트에 Code Connect 매핑이 없다**고 보고했다.
매핑을 만들지는 이 작업의 요청 범위 밖이라 보고만 한다. (원칙 3)
매핑을 원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `20:5645`).

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 (`✓ 30 modules transformed` · `✓ built in 312ms`) |
| 빌드 CSS 값 대조 | 번들(`dist/assets/*.css`)에서 확인: `.h-hairline{height:var(--spacing-hairline)}` · `--spacing-hairline:.0625rem` · `bg-border-primary` → `#ebebeb` · `w-full` → `width:100%`. Figma 의 height 1 × FILL × `#ebebeb` 와 일치. 이전에 쓰던 Tailwind 내장 hairline 유틸리티는 산출 CSS 에서 0건 |
| `get_screenshot`(27738:6454) 대조 | 섹션 스크린샷은 밝은 회색 hairline 가로선 1개다. 형태 일치 |
