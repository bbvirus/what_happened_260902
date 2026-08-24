# TextFieldSlotPassword — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `TextFieldSlotPassword.tsx`, 스토리는 `TextFieldSlotPassword.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/?node-id=13-2347> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 컴포넌트 세트 | `13:2347` — frame "TextFieldSlot/Password", 1820×195 |
| 추출 | `get_metadata`(13:2347 + variant 4개 전부) · `get_design_context`(13:2347) · `get_variable_defs`(13:2377, 같은 값 집합) · `get_screenshot`(13:2347) · `close-circle-fill` export SVG (2026-08-24) |

## variant 는 4개다 — 3×2=6 이 아니다

`get_metadata`(13:2347) 로 직접 확인한 세트의 자식은 정확히 4개다.

| 노드 | `state` | `isTyping` |
|---|---|---|
| `13:2348` | default | false |
| `13:2360` | focused | false |
| `13:2368` | focused | **true** |
| `13:2354` | done | false |

`default`+`isTyping` 과 `done`+`isTyping` 은 **없다.** 유니온으로 막았다 (원칙 1·2).
컴파일이 실패하는 것을 임시 파일로 확인했다 (아래 검증 표).

## 노드 구조

```
symbol 13:2368  "state=focused, isTyping=true"  360×55
├─ instance 13:2369  "[State Layer] Focused"  360×55   ← 35:12806 의 인스턴스
└─ frame 13:2370  "content"    328×27  @ (16,14)   flex-row · gap spacing/16 · items-center
   ├─ frame 13:2371  "wrapeer"  288×27   flex-1 · items-center · justify-between
   │  ├─ frame 13:2372  "text"   119×27   hug · items-center
   │  │  ├─ text 13:2373  "● ● ● ● ● ●"  117×27
   │  │  └─ rounded-rect 13:2374  "cursor"  2×24  @ x=119
   │  └─ instance 13:2375  "close-circle-fill"  24×24  @ x=264
   └─ instance 13:2376  "TextFieldSlot/End/Items"  24×24  @ x=304
```

(프레임 이름 오타 `wrapeer` 는 Figma 원본 그대로다. 코드에는 옮기지 않았다.)

### ⚠ `close-circle-fill` 은 End/Items 소속이 아니다 — 확인함

`13:2375` 의 부모는 `wrapeer`(13:2371) 이고, `TextFieldSlot/End/Items`(13:2376)는
그 **형제**로 `content`(13:2370) 밑에 있다. 두 계층이 다르다. `get_design_context`
도 같은 구조를 방출한다. 코드도 그 계층을 그대로 지켰다.

### hidden 인스턴스 — 이 컴포넌트에는 **없다**

variant 4개 전부 `TextFieldSlot/End/Items` 인스턴스가 **1개씩**이고
숨은 것이 하나도 없다 (13:2353 · 13:2367 · 13:2376 · 13:2359).

이 사실이 자매 컴포넌트 `TextFieldSlot/Text`(13:2377)의 숨은 인스턴스 판정에
근거가 됐다 — 그쪽 variant 3개에는 숨은 인스턴스가 2개씩 있는데, 같은 자리를 두고
두 컴포넌트가 서로 다른 슬롯 수를 갖는다고 볼 근거가 없어 **작업 잔여물**로 판정했다.
자세한 근거 4개는 `TextFieldSlotText.design.md` 참조.

`hasSlotEnd`(boolean) 는 `slotEnd?: ReactNode` 하나로 접었다 — 넘기면 켜지고
안 넘기면 꺼진다. 슬롯 안이 `Icon/line` 인스턴스 스왑 슬롯(글리프 미지정)이라
어차피 내용을 호출부에서 받아야 하기 때문이다 (원칙 2).

## `TextFieldSlot/Text`(13:2377) 와 다른 점은 두 가지뿐이다

| | Text | Password |
|---|---|---|
| `text` 프레임 | FILL (`flex-1` · `overflow-clip`, 말줄임표) | **hug** (`shrink-0`, 말줄임표 없음) |
| `wrapper` 입력중 정렬 | `flex-1` 이 자리를 채워 지우기 버튼이 자동으로 오른쪽 | **`justify-between`** 이 필요하다 |
| 기본 문구 | "플레이스홀더" | "● ● ● ● ● ●" |

`justify-between` 이 필요한 이유는 기하로 확인된다: `wrapeer` 288 안에서 `text` 는
폭 119 로 왼쪽 끝, `close-circle-fill` 은 x=264(+24 = 288)로 오른쪽 끝이다.
`text` 가 hug 라 사이를 채우는 것이 없다.

나머지 색·간격·반경·타이포·포커스 링은 전부 같다.

## 값의 출처 — `불명` 0건

| 값 | Figma 원값 | 출처 | 토큰 | 결론 |
|---|---|---|---|---|
| 루트 배경 | `#f2f2f2` | 변수 `bg/tertiary` | `--color-bg-tertiary` | 값 일치 → 재사용 |
| 루트 반경 | 4 | 변수 `radius/4` | `--radius-4` | 값 일치 → 재사용 |
| 루트 좌우 패딩 | 16 | 변수 `spacing/16` | `--spacing-16` | 값 일치 → 재사용 |
| 루트 상하 패딩 | 14 | 변수 `spacing/14` | `--spacing-14` | 값 일치 → 재사용 |
| content 가로 간격 | 16 | 변수 `spacing/16` | `--spacing-16` | 값 일치 → 재사용 |
| 문구 타이포 | `Font(family-font, Medium, font-size/body-large(18), 500, lineHeight 1.5, letterSpacing 0)` | 변수 `font/body/large` | `@utility font-body-large` | 4개 값 전부 일치 → 재사용 |
| 문구 색 (default · focused) | `#747474` | 변수 `text/secondary` | `--color-text-secondary` | 값 일치 → 재사용 |
| 문구 색 (done · focused+typing) | `#1a1a1a` | 변수 `text/primary` | `--color-text-primary` | 값 일치 → 재사용 |
| 포커스 링 | 색 `#1a1a1a`(변수 `border/strong`) · 두께 1 · 반경 4(변수 `radius/4`) | 인스턴스 13:2361 · 13:2369 | `StateLayerFocused` (`--color-state-focused` · `--spacing-hairline` · `--radius-4`) | 값 일치 → **컴포넌트 재사용** |
| 커서 색 | `#e4107a` | 변수 `bg/brand` | `--color-bg-brand` | 값 일치 → 재사용 |
| 커서 반경 | 100 | 변수 `radius/full` | `--radius-100` | 값 일치 → 재사용 |
| 커서 길이 | 24 | 13:2365 · 13:2374. 변수 아님 | `--spacing-24` | 값 일치 → 재사용 (`h-24`) |
| **커서 두께** | **2** | 13:2365 · 13:2374. **변수 아님** | **없음** | ⚠ **신규 토큰 필요** (아래) |
| 지우기 아이콘 | 24×24, glyph `close-circle-fill`, fill `#747474` | 인스턴스 13:2375 | `Icon name="close-circle-fill" color="secondary"` | export SVG 가 Text 쪽(13:2401)과 **문자 단위로 동일**함을 `diff` 로 확인 → 재사용 |
| End/Items 슬롯 | 24×24 | 13:2353 등 | `TextFieldSlotEndItems contentType="icon"` | 재사용 |
| 폭 360 | variant 프레임 | 모바일 페이지 폭 | — | 옮기지 않았다 → `w-full` |
| 높이 55 | variant 프레임 | 14 + 27 + 14 의 hug | — | 고정하지 않았다 |

`get_variable_defs`(13:2377) 응답에 `spacing/2` 는 **없다.** (같은 섹션의 두 컴포넌트가
같은 변수 집합을 쓴다.)

## 해소된 토큰 — `--spacing-textfield-cursor-width`

`TextFieldSlotText` 와 **같은 토큰 1개**다. 두 컴포넌트가 함께 쓴다.

| 항목 | 값 |
|---|---|
| 필요한 값 | `0.125rem` (2) |
| 쓰는 자리 | 커서 13:2365(focused) · 13:2374(focused+typing) — 그리고 Text 쪽 13:2389 · 13:2400 |
| 현재 코드 | `w-textfield-cursor-width` |
| 해소 | `/sync-tokens` → `token-guardian` 이 `spacing.tokens.css` 에 추가함 (2026-08-25) |

기존 2 토큰 3개(`--spacing-tab-indicator-height` ·
`--spacing-tab-state-layer-inset` · `--spacing-textfield-textset-icon-inset-top`)를
재사용하지 않은 근거는 `TextFieldSlotText.design.md` 의 같은 절에 있다 —
`spacing.tokens.css` 가 이미 "값이 같아도 가리키는 것이 다르면 합치지 않는다"고
판정해 둔 기준을 그대로 따랐다.

**현재 상태.** 토큰이 추가돼 커서가 2 로 렌더된다.
구현 시점에는 토큰이 없어 폭 0 이었고, `src/tokens/**` 가 편집 권한 밖이라
직접 추가하지 않았다. 이후 `token-guardian` 이 같은 이름으로 추가했고,
**컴포넌트 코드는 한 줄도 바뀌지 않았다.**

## 폭·높이를 고정하지 않은 이유

- **폭 360.** 안의 `wrapeer` 가 FILL 이고 360 은 이 파일의 모바일 페이지 폭이다.
  `TextSetTitle` · `Divider` · `TextFieldTextSet` 과 같은 판단으로 `w-full` 로 옮겼다.
- **높이 55.** 상하 패딩(변수 `spacing/14`) 2개 + 본문 한 줄 27 의 합이다.
  선언된 제약이 아니라 hug 결과다. 렌더 실측으로 55 를 확인했다 (검증 표).
  ⚠ 값이 `--spacing-button-height`(55) 와 같지만 축이 다르므로 쓰지 않았다.

## 가림 문자는 실제 마스킹이 아니다 — 그대로 옮겼다

Figma 의 "● ● ● ● ● ●" 는 텍스트 노드 13:2352 등의 **내용**이다.
`<input type="password">` 의 마스킹이 아니다. 있는 그대로 옮겼고
`children` 으로 바꿀 수 있게 두었다 (원칙 1).

⚠ **인계 주의**: 이 컴포넌트를 실제 비밀번호 입력으로 만들 때는 가림을
텍스트 내용이 아니라 입력 요소의 `type` 으로 처리해야 한다. 그 결정은
Wave 3 `TextField/Password`(13:2167)의 몫이다.

## 지우기 버튼 — `<button>` 으로 감쌌다

판정과 근거는 `TextFieldSlotText.design.md` 의 같은 절과 동일하다. 요약하면:

- `state=focused, isTyping=true` 에만 나타나는 조건부 요소이고 글리프가
  `close-circle-fill` 이며 자리가 입력 문구 뒤다 → 뜻은 "입력 지우기" 하나다.
- 이름은 **버튼**이 갖는다(`aria-label={clearLabel}`). 안의 `Icon` 은
  `aria-hidden="true"` 기본값 그대로 둔다 — 버튼이 이미 이름을 가지므로
  `aria-hidden={false}` 를 넘기면 이름이 두 번 읽힌다.
- `type="button"` 으로 form submit 을 막는다.
- 이 요소를 성립시키는 최소 prop 2개(`onClear` · `clearLabel`)만 열었다.

## 사용한 토큰

### 컴포넌트 (`TextFieldSlotPassword.tsx`)

| 토큰 | 유틸리티 | Figma 에서 읽은 값 |
|---|---|---|
| `--color-bg-tertiary` | `bg-bg-tertiary` | 변수 `bg/tertiary` |
| `--radius-4` | `rounded-4` | 변수 `radius/4` |
| `--spacing-16` | `px-16` · `gap-16` | 변수 `spacing/16` |
| `--spacing-14` | `py-14` | 변수 `spacing/14` |
| typography `font-body-large` (`@utility`) | `font-body-large` | 변수 `font/body/large` |
| `--color-text-secondary` | `text-text-secondary` | 변수 `text/secondary` |
| `--color-text-primary` | `text-text-primary` | 변수 `text/primary` |
| `--color-bg-brand` | `bg-bg-brand` | 변수 `bg/brand` (커서) |
| `--radius-100` | `rounded-100` | 변수 `radius/full` (커서) |
| `--spacing-24` | `h-24` | 커서 길이 24 |
| `--spacing-textfield-cursor-width` | `w-textfield-cursor-width` | 커서 두께 2 |

간접 사용:

| 경로 | 토큰 |
|---|---|
| `StateLayerFocused` | `--color-state-focused` · `--spacing-hairline` · `--radius-4` |
| `Icon` (지우기) | `--color-icon-secondary` · `--spacing-24` |
| `TextFieldSlotEndItems` | `--spacing-16` |
| 호출부가 `slotEnd` 에 넘기는 `Icon` | `--color-icon-*` · `--spacing-24` |

토큰이 아닌 유틸리티와 그 근거:

| 유틸리티 | 성격 | 근거 |
|---|---|---|
| `relative` | 레이아웃 | `StateLayerFocused` 오버레이의 기준 |
| `flex` · `flex-col` · `justify-center` | 레이아웃 | 루트 세로 auto-layout |
| `w-full` | 레이아웃 | 폭 360 을 페이지 폭으로 판정 |
| `items-center` | 레이아웃 | `content` · `wrapeer` · `text` 의 세로 가운데 정렬 |
| `flex-1` · `min-w-0` | 레이아웃 | `wrapeer` 의 FILL. Figma 는 이 자리에 `min-w-px` 를 방출하지만, Tailwind 코어의 `px`(1px 고정)는 토큰에서 내려오지 않는 raw 값이다. 목적은 flex 자식의 `min-width:auto` 를 푸는 레이아웃 리셋이므로 토큰 값 0(`--spacing-0`)으로 옮겼다 |
| `justify-between` | 레이아웃 | 13:2371 의 입력중 정렬 (`text` 가 hug 라 필요하다) |
| `shrink-0` | 레이아웃 | `text` 프레임 hug · 커서 · 지우기 버튼 · 슬롯 |
| `whitespace-nowrap` | 레이아웃 | `get_design_context` 가 문구에 방출한 그대로 |
| `break-words` | 레이아웃 | 텍스트 노드의 `word-break: break-word` |

### 스토리 (`TextFieldSlotPassword.stories.tsx`)

| 토큰 | 유틸리티 |
|---|---|
| `--color-bg-primary` | `bg-bg-primary` |
| `--color-text-secondary` | `text-text-secondary` |
| `--spacing-12` · `--spacing-24` · `--spacing-40` | `gap-12` · `gap-24` · `p-40` |
| typography `font-body-small` (`@utility`) | `font-body-small` |

## a11y

- 루트는 `<div>` 다. 이 컴포넌트는 문구를 **표시**할 뿐 `<input type="password">`
  가 아니다. 실제 입력 요소로 만들지, `<label>`·`aria-describedby` 를 어떻게
  연결할지는 Wave 3 `TextField/Password`(13:2167)가 정한다 (원칙 1·2).
- 커서는 `aria-hidden` 이다. 순수 장식이다.
- 지우기 버튼만 `<button>` 이다 — 위 절 참조.
- `state="focused"` 는 **시각만** 바꾼다. 실제 DOM 포커스를 옮기지 않는다.

## Code Connect

`get_design_context`(13:2347) 응답에 Code Connect 매핑이 없다. 매핑 생성은 이 작업의
요청 범위 밖이라 보고만 한다 (원칙 3).
매핑을 원하면 `get_code_connect_suggestions`(fileKey `7DxkWa12fiJWOrvPIDWUcp`, nodeId `13:2347`).

## 검증

| 게이트 | 결과 |
|---|---|
| 레이어 3 hook (파일 쓰기) | 통과. 차단 0건 |
| `npm run typecheck` | 통과 (`tsc -b --noEmit`, 출력 없음) |
| `npm run build` | 통과 (`✓ 32 modules transformed`, `✓ built in 285ms`) |
| 없는 조합이 타입 오류인지 | 확인. 임시 파일 6줄 중 **오류 정확히 4건** — `default+isTyping` · `done+isTyping` (Text·Password 각각). 유효 조합은 통과. 확인 후 삭제 |
| 빌드 CSS 값 대조 | 번들에서 확인. `.rounded-4` · `.bg-bg-tertiary` · `.px-16` · `.py-14` · `.gap-16` · `.h-24` · `.rounded-100` · `.bg-bg-brand` · `.font-body-large` · `.justify-between` 은 `var(--토큰)` 로 나온다. **단 이 행의 최초 기록은 사실이 아니었다** — 당시 코드는 `min-w-px` 였고 이 행에 "`.min-w-px` 까지 전부 `var(--토큰)`, raw 값 0건"이라고 적었으나, 실제 방출은 `.min-w-px{min-width:1px}` 로 토큰을 참조하지 않았다. Tailwind 코어 static 유틸리티라 레이어 3 hook 도 잡지 못했다. 이후 `design-reviewer` 가 raw 1px 로 적발해 `min-w-0` 으로 고쳤고, 현재 번들은 `.min-w-0{min-width:var(--spacing-0)}` 이다. 정정 후 raw 값 0건 |
| 커서 유틸리티 생성 | 토큰 추가 후 번들에 `.w-textfield-cursor-width{width:var(--spacing-textfield-cursor-width)}` 와 `--spacing-textfield-cursor-width:.125rem` 둘 다 있다 |
| 렌더 ↔ Figma 대조 | 아래 표 |

### 렌더 ↔ Figma 픽셀 대조

빌드된 CSS 로 8개 variant(Text 4 + Password 4)를 헤드리스 Chrome 에 1:1 배율로
렌더해 픽셀을 읽고 `get_screenshot`(13:2347) 과 대조했다.

| 측정 | 렌더 | Figma | 판정 |
|---|---|---|---|
| 필드 높이 (default · done) | 55 | 55 | 일치 |
| 필드 높이 (focused, 테두리 포함) | 55 | 55 | 일치 |
| 포커스 테두리 | 1행 `#1a1a1a` | 변수 `border/strong`, 두께 1 | 일치 |
| 문구 색 (default · focused) | `#747474` | 변수 `text/secondary` | 일치 |
| 문구 색 (done · focused+typing) | `#1a1a1a` | 변수 `text/primary` | 일치 |
| 지우기 아이콘 색 | `#747474` | export SVG fill | 일치 |
| 슬롯 아이콘 색 | `#747474` | 변수 `icon/secondary` | 일치 |
| 커서 색 | `#e4107a` | 변수 `bg/brand` | 일치 |
| 커서 위치 | focused 는 문구 **앞**, typing 은 문구 **뒤** 이면서 오른쪽 끝에 지우기 버튼 | 13:2365 는 문구 앞, 13:2374 는 문구 뒤, 13:2375 는 오른쪽 끝 | 일치 |
| **커서 표시 여부** | 보임 | 보임 | 일치 (토큰 추가 후) |

⚠ 위 커서 표시 항목은 **구현 당시** 검증용으로 프리뷰 HTML 에만 `width: 0.125rem` 규칙을
주입해 재렌더한 뒤 확인한 것이다 (`src/tokens/**` 는 건드리지 않았다). 주입 후에는
색·길이·위치가 Figma 스크린샷과 그대로 맞았다 — **코드는 완성돼 있고
빠진 것은 토큰 1개뿐이다.** 확인 후 프리뷰 파일은 전부 삭제했다.

⚠ **한계**: Pretendard 웹폰트가 저장소에 없어 렌더에 폴백 서체가 쓰인다.
위 대조는 색·위치·크기에 대한 것이고 글자 모양은 Figma 와 다르다.

---

## 추가: `input` prop — 실제 입력 모드 (2026-08-25, `page/Login` 작업)

이 문서의 "a11y" 절은 *"이 컴포넌트는 문구를 **표시**할 뿐 `<input>` 이 아니다 … 실제 입력
요소로 만들지 여부는 이것을 조립하는 Wave 3 이 정한다"* 로 결론을 미뤄 두었다.
요청자 결정(*"실제 입력이 되어야 해"*)으로 그 답이 정해져서, 입력 요소를 **이 슬롯에** 넣었다.

### 왜 조립 단이 아니라 이 슬롯인가

이 슬롯이 문구의 타이포·색·말줄임·커서 기하와 지우기 버튼의 자리를 전부 소유한다.
조립 단에서 `<input>` 을 만들어 `children` 으로 넘기면 그 값들을 슬롯 밖에서 다시 정해야
하고, 슬롯 내부 flex 레이아웃과도 싸운다.

### 두 모드를 남긴 이유

이 컴포넌트는 두 가지 일을 겸한다. Storybook 은 Figma variant 4개를 **그림으로** 세워
보여야 해서 `<p>` 가 필요하고 (`● ● ● ● ● ●` 같은 문구는 값이 아니라 그림이다),
페이지는 타이핑되는 `<input>` 이 필요하다. 진열 모드를 지우면 앞쪽이 표현 불가가 된다.
그래서 `input` 을 넘긴 경우에만 갈라진다. 넘기지 않으면 기존과 완전히 같다.

### 입력 모드에서 달라지는 것

| | 진열 모드 (기존) | 입력 모드 |
|---|---|---|
| 문구 요소 | `<p>{children}</p>` | `<input>` |
| 장식 커서 (13:2389 · 13:2400 · 13:2365 · 13:2374) | 그린다 | **안 그린다** — 브라우저가 진짜 캐럿을 그려 두 개가 겹친다 |
| 포커스 링 | `state` prop 이 켠다 | **실제 포커스**가 켠다 (`group-focus-within`) |
| 지우기 버튼 | `isTyping` 이면 항상 | `onClear` 가 있을 때만 |
| placeholder 색 | 해당 없음 | `text/disabled-onLight` |

### 포커스 링을 CSS 로 돌린 이유 — WCAG 2.4.7

입력 모드의 `<input>` 은 UA 기본 포커스 링을 끈다 (`outline-none`). 링을 그리는 조건과
끄는 조건이 어긋나면 *"포커스는 가는데 표시가 없는"* 상태가 만들어진다. 둘을 같은
셀렉터(`group-focus-within`)에 묶으면 그 간극이 생길 수 없다. `Button.tsx` 가 pressed
레이어에 `hidden group-active:block` 을 쓴 것과 같은 방식이고, `Button` 의
`uaFocusOutline` 주석이 세운 규율과 같다.

### placeholder 색은 Figma 근거가 있다

`page/Login` 의 인스턴스(27818:7077 · 27818:7078)에서 문구가 `state=default` 의
`text/secondary` 가 아니라 **`text/disabled-onLight`** 다. 그래서 입력 모드의
placeholder 에만 그 색을 건다. 진열 모드의 색 규칙은 건드리지 않았다.

### 이 슬롯만의 차이 — `text` 프레임이 hug 다

진열 모드의 `text`(13:2351 등)는 Figma 에서 hug 다. 입력 모드에서만 FILL 로 바꾼다.
hug 는 `● ● ● ● ● ●` 라는 고정 샘플 문구의 결과 폭이고, 타이핑되는 입력에는 채울 폭이
있어야 한다. Figma 값을 버린 것이 아니라 **값이 아닌 것(샘플 문구의 결과 폭)을 옮기지
않은 것**이다 — 이 문서가 폭 360·높이 55 를 파생값이라 옮기지 않은 것과 같은 기준이다.

⚠ 진열 모드의 `● ● ● ● ● ●` 는 **그려진 가림 문자**이고 마스킹이 아니다.
실제 마스킹은 입력 모드에서 `type="password"` 를 넘겼을 때 브라우저가 한다.
