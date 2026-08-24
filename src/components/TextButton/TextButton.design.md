# TextButton — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `TextButton.tsx`, 스토리는 `TextButton.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-1742&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 노드 | `13:1742` — COMPONENT "TextButton", 98×24 |
| 추출 | `get_metadata` · `get_screenshot` · `get_variable_defs` · `get_design_context` (2026-08-24) |

## Figma 구조

```
COMPONENT 13:1742  TextButton            98×24   세로 auto-layout, 시각 값 없음
└ FRAME  13:1743   content               98×24   가로 auto-layout, gap=spacing/4, center
  ├ INSTANCE 13:1744  Icon/line          24×24   (x=0)
  ├ TEXT     13:1745  label              42×19   (x=28)
  └ INSTANCE 13:1746  Icon/line          24×24   (x=74)
```

바깥 COMPONENT 는 자식과 크기가 같고 fill·stroke·radius·padding 을 하나도 갖지 않는다.
그래서 구현에서는 두 단을 `<button>` 하나로 합쳤다. `Divider` 에서 한 판단과 같다. (원칙 2)

좌표로 gap 을 역산하면 `24 → 28` 과 `70 → 74` 로 양쪽 모두 4다.
변수 `spacing/4` 와 일치한다.

## 값의 출처 — `불명` 0건

Clarify 단계 통과 조건인 3분류표다.

| 값 | 출처 분류 | 근거 |
|---|---|---|
| 아이템 간격 4 | **Figma 변수** | `spacing/4` = `4` |
| 라벨 색 `#747474` | **Figma 변수** | `text/secondary` |
| 아이콘 색 `#747474` | **Figma 변수** | `icon/secondary` |
| 라벨 타이포 | **Figma 변수** | `font/label/large` = Font(family `family-font`=Pretendard, style Medium, size `font-size/label-large`=16, weight 500, lineHeight 100, letterSpacing 0) |
| 모서리 반경 0 | **Figma 변수** | `radius/0` = `0` |
| 아이콘 크기 24×24 | **기존 토큰** | `get_metadata` 실측 24 정사각 → `--spacing-24` (`Icon` 이 이미 적용 중) |
| 패딩 없음 | **Figma 실측** | `content` 프레임이 (0,0) 에서 시작하고 부모와 크기가 같다 |
| 정렬 (center/center) | **Figma 실측** | `get_design_context` 의 `items-center justify-center` |
| 라벨 기본 문구 `레이블` | **Figma property** | component property `text` 의 기본값 |

`불명` 으로 남은 값은 없다. 그래서 Implement 로 내려갔다.

## Figma component property → props

`get_design_context` 가 이 노드에서 읽어낸 property 는 5개다.

| Figma property | 종류 | Figma 기본값 | 코드 |
|---|---|---|---|
| `hasIconStart` | boolean | `true` | `iconStart` 를 넘겼는지로 판정 |
| `iconStart` | instance swap | `Icon/line` (플레이스홀더) | `iconStart?: IconName` |
| `hasIconEnd` | boolean | `true` | `iconEnd` 를 넘겼는지로 판정 |
| `iconEnd` | instance swap | `Icon/line` (플레이스홀더) | `iconEnd?: IconName` |
| `text` | text | `레이블` | `children` |

boolean 두 개를 별도 prop 으로 두지 않은 이유: `hasIconStart=false` 와
"`iconStart` 를 넘기지 않음" 은 렌더 결과가 같다. 같은 상태를 두 가지 방법으로
표현하게 만들지 않는다. (원칙 2)

### 좌/우 아이콘은 선택적이다 — 추측이 아니다

`hasIconStart` · `hasIconEnd` 두 boolean property 가 Figma 에 실재한다.
즉 "항상 존재"가 아니라 켜고 끄도록 설계된 슬롯이다. 이 근거로 optional 로 뒀다.

### 그러나 어느 글리프가 들어가는지는 Figma 가 지정하지 않았다

두 슬롯의 기본 내용물 `Icon/line` (18:5191) 은 아이콘이 아니라 **점선 테두리의 빈
플레이스홀더 템플릿**이다. `get_screenshot` 에서도 라벨 양옆이 점선 사각형으로 보인다.
`Icon.design.md` 가 아이콘 12개를 추릴 때 같은 이유로 제외한 바로 그 노드다.

따라서 코드에도 기본 아이콘을 두지 않았다. 스토리에서 쓴 `chevronLeft-small` ·
`chevronRight-small` 은 슬롯 동작을 보이려고 고른 값이며 Figma 지정값이 아니다.
스토리 주석에 그렇게 적어 두었다. (원칙 1)

## `color` prop — Figma 근거 (2026-08-24 추가)

이 prop 은 13:1742 자체의 component property 가 아니다. **인스턴스 오버라이드**에서 왔다.
`figma-implementer` 가 Header 섹션(27704:1746)을 구현하다 확인한 것이고,
이 에이전트는 Figma 를 다시 읽지 않았다 (재확인 불필요로 전달받았다).

### 출처 노드

| 항목 | 값 |
|---|---|
| 부모 | `27657:3101` — `HeaderSlot/LeftEnd/Items`, variant `contentType=buttonGroup` |
| 인스턴스 | `27657:3102` · `27657:3103` — 둘 다 `TextButton`(13:1742) 인스턴스, 각 42×19 |
| 라벨 색 | `text/primary` = `#1a1a1a` |

### 근거 3건 (일치)

1. `get_design_context`(`27657:3101`) 가 두 인스턴스 모두 `var(--text/primary,#1a1a1a)` 로 방출한다.
2. `get_variable_defs`(`27657:3096`) 에 `text/primary` 만 있고 `text/secondary` 가 **없다**.
3. `get_screenshot`(`27657:3101`) PNG 픽셀 샘플링 — 글리프 내부가 `#1a1a1a` 다.

### 값 목록과 기본값

| `color` | 라벨 | 아이콘 |
|---|---|---|
| `secondary` (기본값) | `text-text-secondary` | `Icon color="secondary"` |
| `primary` | `text-text-primary` | `Icon color="primary"` |

값은 이 둘뿐이다. `--color-text-*` 에는 tertiary · disabled · inverse · brand · negative ·
positive 계단도 있지만, 요청받은 값이 아니므로 만들지 않았다. (원칙 2)

기본값이 `secondary` 인 이유는 이 prop 이 없던 때의 렌더 결과를 한 픽셀도 바꾸지 않기
위함이다. 기존 사용처는 `color` 를 넘기지 않으므로 `LABEL_COLOR['secondary']` =
`text-text-secondary` 로 이전과 같은 클래스가 나온다.

### 아이콘 색 결정 — 라벨과 함께 바꾼다

**Figma 근거는 없다.** 위 인스턴스 2개는 아이콘이 없는 텍스트 전용(42×19)이므로
`color="primary"` 일 때 아이콘이 무엇이어야 하는지 Figma 가 말해주지 않는다.
그래서 근거를 Figma 가 아니라 **이 저장소의 토큰 정의**에서 가져왔다.

`src/tokens/colors.tokens.css` 에서 `text/N` 과 `icon/N` 은 같은 base 토큰을 가리킨다.

| 계단 | `--color-text-*` | `--color-icon-*` | 같은가 |
|---|---|---|---|
| primary | `--bw-light-black` | `--bw-light-black` | 같다 |
| secondary | `--neutral-gray-light-600` | `--neutral-gray-light-600` | 같다 |
| tertiary | `--neutral-gray-light-400` | `--neutral-gray-light-400` | 같다 |
| inverse | `--bw-white` | `--bw-white` | 같다 |
| brand | `--magenta-light-500` | `--magenta-light-500` | 같다 |
| negative | `--negative-light-500` | `--negative-light-500` | 같다 |
| disabled-on-light | `--dimmed-black-16` | `--dimmed-black-16` | 같다 |
| disabled-on-dark | `--dimmed-white-40` | `--dimmed-white-64` | **다르다** (범위 밖) |

이름이 겹치는 계단은 `disabled-on-dark` 하나를 빼고 전부 값이 같다. 즉 쌍 구조는
추측이 아니라 토큰 파일이 세워 둔 것이고, `primary` · `secondary` 두 계단에서는 예외가 없다.
게다가 Figma 근거가 있는 유일한 경우(`secondary`)에서 그 쌍이 실제로 관찰됐다 —
13:1742 가 `text/secondary` 와 `icon/secondary` 를 함께 썼다.

반대쪽(아이콘을 `secondary` 로 고정)도 Figma 근거가 없기는 같고, 추가로
`#1a1a1a` 라벨 옆 `#747474` 아이콘이라는 **어느 계단에도 없는 조합**을 코드에 박는다.
검증 가능한 근거가 있는 쪽을 골랐다. 지어낸 색 값은 없다 — 두 경우 모두 기존
`--color-icon-*` 토큰을 참조한다. 근거는 `TextButton.tsx` 의 `## color` 주석에도 적었다.

⚠ 아이콘이 있는 `color="primary"` 조합의 Figma 스크린샷 대조는 하지 않았다.
대조할 Figma 노드가 존재하지 않기 때문이다.

### 타입에 `Omit` 이 붙은 이유

`ButtonHTMLAttributes` 의 상위 `HTMLAttributes` 가 `color?: string` 을 이미 선언한다
(`@types/react`). 유니언으로 재정의하면 충돌하므로 `Omit<..., 'color'>` 로 지웠다.
`Icon.tsx` 가 `Omit<SVGProps<SVGSVGElement>, 'color'>` 로 한 것과 같은 패턴이다.
`color` 를 구조 분해로 받아내므로 `...props` 스프레드를 타고 DOM 속성으로도 새지 않는다.

## variant — 없음

이 노드는 component set 의 variant 가 아니다. 근거 2가지:

1. `get_design_context` 의 property 목록에 variant 축(문자열 enum)이 0개다.
   나온 것은 boolean 2 · instance swap 2 · text 1 뿐이다.
2. 이 파일의 variant 컴포넌트는 노드 이름 자체가 variant 문자열이다 —
   같은 파일 `[Checkbox]` (13:3929) 아래 심볼들은 이름이
   `size=medium, fontWeight=strong, isChecked=false, isDisabled=false` 형태다.
   반면 13:1742 의 `get_metadata` 이름은 그냥 `TextButton` 이다.

그래서 variant prop 을 만들지 않았다. 보고할 variant 축도 없다.
(위 `color` prop 은 이 노드의 variant 축이 아니라 인스턴스 오버라이드에서 온 것이다.)

hover · pressed · disabled 상태도 이 노드에 정의돼 있지 않아 만들지 않았다.

## `Icon` 재사용 판단 — 재사용함

하위 `Icon/line` 인스턴스는 글리프가 없는 슬롯이므로, "이 슬롯에 무엇이 들어가는가"는
호출부가 정한다. 그 자리를 기존 `src/components/Icon/Icon.tsx` 의 `IconName` 12개로
받도록 했다. 새 Icon 컴포넌트는 만들지 않았다.

`Icon` 을 그대로 쓸 수 있는 이유:

- 크기: `Icon` 이 `size-24` 로 고정한다. Figma 슬롯 크기 24×24 와 같다.
- 색: `Icon` 의 `color="secondary"` 가 `--color-icon-secondary` 이고,
  Figma 변수 `icon/secondary` 와 값이 같다.
- 접근성: `Icon` 기본값 `aria-hidden="true"`. 이 컴포넌트는 라벨 텍스트가 항상 있으므로
  아이콘을 스크린리더에 노출하면 이름이 중복 읽힌다. 기본값이 그대로 맞다.

## 사용한 토큰

새로 만든 토큰은 없다. 전부 기존 `src/tokens` 재사용이다. (원칙 2)

### 컴포넌트 (`TextButton.tsx`)

| Figma 값 | Figma 변수 | 토큰 | 유틸리티 |
|---|---|---|---|
| gap 4 | `spacing/4` | `--spacing-4` | `gap-4` |
| 라벨 색 `#747474` | `text/secondary` | `--color-text-secondary` | `text-text-secondary` (`color="secondary"`, 기본값) |
| 라벨 색 `#1a1a1a` | `text/primary` | `--color-text-primary` | `text-text-primary` (`color="primary"`) |
| 라벨 타이포 16/500/100%/0 | `font/label/large` | `@utility font-label-large` | `font-label-large` |
| 아이콘 색 `#747474` | `icon/secondary` | `--color-icon-secondary` | `Icon color="secondary"` (`color="secondary"`, 기본값) |
| 아이콘 색 `#1a1a1a` | — (토큰 쌍 구조에서 도출, 아래 `## color` 참조) | `--color-icon-primary` | `Icon color="primary"` (`color="primary"`) |
| 아이콘 24×24 | — (실측) | `--spacing-24` | `Icon` 내부 `size-24` |
| radius 0 | `radius/0` | `--radius-0` | `rounded-0` |

`inline-flex` · `items-center` · `justify-center` · `whitespace-nowrap` 은 시각 값이 아니라
레이아웃 유틸리티다 (Figma auto-layout 의 방향·정렬과 텍스트 hug 에 대응).

### 스토리 (`TextButton.stories.tsx`)

시각 값 유틸리티를 쓰지 않는다. 컴포넌트만 배치한다.

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. `.tsx` 2개 모두 위반 0건, 예외(`token-exempt:`) 추가 0건 |
| `npm run typecheck` | 통과 |
| `npm run build` | 통과 |
| 빌드 CSS 유틸리티 확인 | `gap-4` → `var(--spacing-4)`, `rounded-0` → `var(--radius-0)`, `font-label-large` · `text-text-secondary` · `text-icon-secondary` · `size-24` 전부 `dist` CSS 에 생성됨. 이름을 지어낸 유틸리티가 없음을 확인 |
| `get_screenshot`(13:1742) 대조 | 구조·값 수준에서 일치 — 아이콘 / 라벨 / 아이콘 가로 배치, 세로 중앙, 간격 4, 라벨 secondary 회색, 라벨 문구 `레이블`. ⚠ 브라우저에 렌더해 픽셀로 대조하지는 않았다. Storybook 을 띄운 육안 대조는 하지 않았다 |

## 검증 — `color` prop 추가분 (2026-08-24)

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook | 통과. `.tsx` 2개 모두 위반 0건, 예외(`token-exempt:`) 추가 0건 |
| `npm run typecheck` | 통과 (exit 0) |
| `npm run build` | 통과 (exit 0) |
| `npm run build-storybook` | 통과 (exit 0) |
| 빌드 CSS 유틸리티 확인 | `.text-text-primary{color:var(--color-text-primary)}` · `.text-icon-primary{color:var(--color-icon-primary)}` 가 `dist` CSS 에 생성됨. `text-text-secondary` · `text-icon-secondary` 도 그대로 존재. 이름을 지어낸 유틸리티가 없음을 확인 |
| 기존 사용처 회귀 | `TextButton` 을 import 하는 `.tsx` 는 자기 스토리 파일뿐이다 (`grep -rn "TextButton" src/` — 나머지 매치는 `.design.md` 문서 언급). 기본값 `secondary` 가 이전과 같은 클래스를 내므로 렌더 결과가 바뀌는 호출부가 없다 |

⚠ 레이어 3 hook 은 `Edit|Write|MultiEdit` 만 matcher 로 잡는다. 이 변경은 Bash 로
파일을 썼기 때문에 hook 이 자동 발동하지 않았고, `check-hardcode.mjs` 에 두 파일의
전체 내용을 `Write` 페이로드로 직접 통과시켜 확인했다. 첫 시도에서 JSDoc 주석에 적은
raw hex 와 `var(...)` 10건이 차단됐고(hook 은 주석을 예외 처리하지 않는다),
예외를 늘리는 대신 주석을 토큰·변수 이름만 쓰도록 고쳐서 통과시켰다.
raw 색상 값은 hook 스코프 밖인 이 `.md` 에만 남긴다.
