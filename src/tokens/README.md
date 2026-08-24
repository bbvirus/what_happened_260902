# Design Tokens

이 디렉터리가 모든 시각 값의 **단일 진실 공급원(SSOT)** 이다.
여기에 없는 값은 코드에서 쓸 수 없다.

## 참조 경로

```
src/tokens/design-tokens.css  ──@theme──▶  Tailwind 유틸리티  ──▶  컴포넌트 className
```

컴포넌트는 생성된 유틸리티 클래스만 쓴다. raw 값 금지 규칙·예외 정책·차단 방식은
**`CLAUDE.md` 의 `## 토큰 규칙` 이 단일 진실 공급원**이다. 여기에 복사하지 않는다 —
두 곳에 적으면 반드시 어긋난다.

## 네이밍 규칙

형식: `--<축>-<의미>[-<변형>]`

**의미로 짓는다. 외형으로 짓지 않는다.**

| 좋음 | 나쁨 | 이유 |
|---|---|---|
| `--color-fg-muted` | `--color-gray-500` | 값이 바뀌면 `gray`는 거짓이 된다 |
| `--color-brand-primary` | `--color-magenta` | 브랜드 색이 바뀌어도 이름은 유효하다 |
| `--color-surface-subtle` | `--color-bg-2` | `2`는 무엇보다 약한지 알려주지 않는다 |
| `--spacing-md` | `--spacing-12` | 값과 이름이 묶여서 재조정이 불가능하다 |

축별 접두어는 Tailwind v4 테마 네임스페이스를 그대로 쓴다. 토큰 이름이 곧 유틸리티 이름이 된다.

| 토큰 | 유틸리티 |
|---|---|
| `--color-brand-primary` | `bg-brand-primary`, `text-brand-primary`, `border-brand-primary` |
| `--spacing-md` | `p-md`, `px-md`, `gap-md`, `m-md` |
| `--spacing-control-md` | `h-control-md`, `w-control-md` |
| `--radius-md` | `rounded-md` |
| `--text-md` | `text-md` (행간은 `--text-md--line-height`) |
| `--shadow-md` | `shadow-md` |
| `--breakpoint-md` | `md:` 변형 |

## 토큰 추가 절차

1. **기존 토큰으로 표현되는지 먼저 확인한다.** 되면 추가하지 않는다. (CLAUDE.md 원칙 2)
2. 안 되면 `design-tokens.css` 의 해당 축 블록에 추가한다. 의미기반 이름으로.
3. 그 다음에 컴포넌트에서 사용한다. **순서를 뒤집지 않는다** — raw 값을 먼저 쓰고
   나중에 토큰화하는 경로는 레이어 3 hook 이 차단한다.

Figma 변수에서 가져올 때는 `/sync-tokens` 를 쓴다. 값을 손으로 옮겨 적지 않는다.

## 파일 분리

축이 커지면 `*.tokens.css` 로 분리할 수 있다.

```
src/tokens/colors.tokens.css       # 색상   (Figma 추출)
src/tokens/spacing.tokens.css      # 간격   (Figma 가이드 표)
src/tokens/typography.tokens.css   # 타이포 (Figma 추출, @utility 합성 클래스)
src/tokens/design-tokens.css       # radius · shadow · breakpoint
```

분리하면 `src/index.css` 에 `@import` 를 한 줄 추가한다.
`*.tokens.css` 는 파일명 규칙으로 hook 예외에 자동 포함된다 — 별도 설정이 필요 없다.

## Tailwind 기본 스케일을 끈 이유

각 축에 `--<축>-*: initial;` 을 넣어 Tailwind 기본 스케일을 껐다.
끄지 않으면 `p-7` · `bg-red-500` · `text-lg` 처럼 토큰에 없는 값이 조용히 통과한다.
훅(레이어 3)은 raw 리터럴을 잡지만 Tailwind 기본 유틸리티는 리터럴이 아니라서 잡히지 않는다.

**결과**: 스케일에 없는 유틸리티는 CSS 가 생성되지 않는다. 검증 결과는
`docs/design-tokens.md` 의 "하드코딩 차단" 절 참조.

## 스페이싱·라디우스 숫자가 Tailwind 와 뜻이 다르다

Figma 가이드의 숫자를 그대로 유지했다. **`p-4` 는 16px 이 아니라 4px 다.**
Tailwind 습관으로 읽으면 틀린다. 매핑 표는 `docs/design-tokens.md` 참조.

## 출처가 변수가 아닌 토큰

`spacing` 과 `radius` 는 Figma **Variable 이 아니다.** 해당 가이드 프레임의
`get_variable_defs` 결과가 `{}` 였고, 값은 가이드 표에서 읽었다.
변수로 등록되면 `/sync-tokens` 로 다시 맞춘다. 파일 상단 주석에 같은 내용이 적혀 있다.
