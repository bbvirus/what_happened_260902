# TextSetTitle — Figma 소스와 토큰 매핑

목적 3의 산출물 ①. 이 파일은 Figma 소스 확정과 토큰 매핑 근거만 담는다.
구현은 `TextSetTitle.tsx`, 스토리는 `TextSetTitle.stories.tsx`.

## Figma 소스

| 항목 | 값 |
|---|---|
| URL | <https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-4265&t=IKuf4oO7n3Ltvjww-11> |
| fileKey | `7DxkWa12fiJWOrvPIDWUcp` |
| 선택 노드 | `27683:4265` — section "TextSetTitle" |
| 컴포넌트 세트 | `27719:1908` — frame "TextSetTitle", 402×606 |
| 추출 | `get_metadata` · `get_variable_defs` · `get_design_context` (2026-08-24) |

## 노드 구조

```
frame 27719:1908  "TextSetTitle"            402×606   (컴포넌트 세트)
├─ 27683:4427  size=xl   360×111
│  └─ 27683:4419 wrapper  360×111
│     ├─ 27683:4420 Title        360×72
│     └─ 27683:4421 Description  360×27   (y=84 → 간격 12)
├─ 27683:4426  size=lg   360×101
│  └─ 27683:4423 wrapper → Title 27683:4424 + Description
├─ 27683:4430  size=md   360×56
│  ├─ 27683:4401 wrapper → Title 27683:4403
│  └─ 27683:4404 "[Text Set Description] Medium" → 27683:4405
├─ 27683:4428  size=sm   360×50   (minHeight 24)
│  ├─ 27683:4407 wrapper → Title 27683:4409
│  └─ 27683:4410 "[Text Set Description] Small" → 27683:4411
└─ 27683:4429  size=xs   360×46
   ├─ 27683:4413 wrapper → Title 27683:4415
   └─ 27683:4416 "[Text Set Description] Small" → 27683:4417
```

**하위 컴포넌트 인스턴스는 0개다.** 이 세트 안에는 텍스트 노드와 auto-layout 프레임만
있다. `Button` · `TextButton` · `Icon` · `Divider` · `Header` 중 어느 것도 쓰이지 않으므로
재사용한 기존 컴포넌트도, 새로 만들어야 할 컴포넌트도 없다.

## component property

`get_design_context`(27719:1908) 가 방출한 prop 시그니처:

```
size?: "lg" | "md" | "sm" | "xl" | "xs"   // variant 축
description?: boolean                      // 보조 텍스트 표시 여부
```

variant 축은 `size` 하나이고 값은 5개다. 이 두 개 외의 property 는 없다.

## 값의 출처 — 3분류

`불명` 0건이다. 모든 시각 값이 Figma 변수 또는 Figma 실측값에서 나왔다.

| 값 | 출처 | 분류 | 결론 |
|---|---|---|---|
| 제목 색 | Figma 변수 `text/primary` = `#1a1a1a` | Figma 변수 | 기존 토큰 `--color-text-primary` 재사용 |
| 보조 색 | Figma 변수 `text/secondary` = `#747474` | Figma 변수 | 기존 토큰 `--color-text-secondary` 재사용 |
| 제목 타이포 ×5 | Figma 변수 `font/display/medium-strong` · `font/title/{large,medium,small,xSmall}-strong` | Figma 변수 | 기존 @utility 재사용 (아래 매핑표) |
| 보조 타이포 ×3 | Figma 변수 `font/body/{large,medium,small}` | Figma 변수 | 기존 @utility 재사용 |
| 간격 12 / 6 / 4 | Figma 변수 `spacing/12` · `spacing/6` · `spacing/4` | Figma 변수 | 기존 토큰 `--spacing-12` · `--spacing-6` · `--spacing-4` 재사용 |
| `sm` minHeight 24 | 27683:4428 실측 `min-h-[24px]` (변수 바인딩 없음) | Figma 실측 | 기존 토큰 `--spacing-24` 와 값 일치 → `min-h-24` |
| 루트 폭 360 | 다섯 variant 루트 모두 고정 360 | Figma 실측 | 배치값으로 판정 → `w-full` (아래 "폭" 참조) |
| radius | 다섯 variant 어디에도 코너 반경 없음 | — | 반경 유틸리티가 들어갈 자리가 없다 |
| fill / stroke / effect | 프레임 fill 0건, stroke 0건, effect 0건 | — | 코드에 들어갈 자리가 없다 |

## 토큰 매핑표 — Figma 변수 → 프로젝트 토큰 → Tailwind 유틸리티

### 색

| Figma 변수 | 값 | 프로젝트 토큰 | 유틸리티 | 쓰이는 곳 |
|---|---|---|---|---|
| `text/primary` | `#1a1a1a` | `--color-text-primary` | `text-text-primary` | 제목 (5 variant 전부) |
| `text/secondary` | `#747474` | `--color-text-secondary` | `text-text-secondary` | 보조 텍스트 (5 variant 전부) |

### 타이포

Figma 의 `Font(size, weight, lineHeight, letterSpacing)` 4개 값이 기존 `@utility` 와
모두 일치해 그대로 재사용했다. `lineHeight 1.2999…` → 1.3, `letterSpacing -2` → -0.02em
환산 기준은 `typography.tokens.css` 머리말에 이미 적혀 있는 것을 따랐다.

| Figma 변수 | size · weight · lh · ls | 프로젝트 @utility | variant |
|---|---|---|---|
| `font/display/medium-strong` | 28 · 700 · 1.3 · -2% | `font-display-medium-strong` | xl 제목 |
| `font/title/large-strong` | 24 · 700 · 1.3 · -2% | `font-title-large-strong` | lg 제목 |
| `font/title/medium-strong` | 20 · 700 · 1.3 · -2% | `font-title-medium-strong` | md 제목 |
| `font/title/small-strong` | 18 · 700 · 1.3 · -2% | `font-title-small-strong` | sm 제목 |
| `font/title/xSmall-strong` | 16 · 700 · 1.3 · -2% | `font-title-x-small-700` | xs 제목 |
| `font/body/large` | 18 · 500 · 1.5 · 0 | `font-body-large` | xl · lg 보조 |
| `font/body/medium` | 16 · 500 · 1.5 · 0 | `font-body-medium` | md 보조 |
| `font/body/small` | 14 · 500 · 1.5 · 0 | `font-body-small` | sm · xs 보조 |

`font/title/xSmall-strong` 만 프로젝트 이름이 `-strong` 이 아니라 `-700` 이다.
이는 `typography.tokens.css` 가 이미 기록해 둔 Figma 쪽 네이밍 불일치이고 값은 같다.

### 간격

| Figma 변수 | 값 | 프로젝트 토큰 | 유틸리티 | variant |
|---|---|---|---|---|
| `spacing/12` | 12 | `--spacing-12` | `gap-12` | xl · lg (제목 ↔ 보조) |
| `spacing/6` | 6 | `--spacing-6` | `gap-6` | md · sm (제목 ↔ 보조) |
| `spacing/4` | 4 | `--spacing-4` | `gap-4` | xs (제목 ↔ 보조) |
| — (실측 24) | 24 | `--spacing-24` | `min-h-24` | sm 루트 minHeight |

## 구조를 3단 → 1단으로 접은 근거

Figma 원본은 루트 / `wrapper` / 텍스트의 3단이고, `md`·`sm`·`xs` 는 보조 텍스트가
`[Text Set Description] …` 라는 별도 4번째 단에 들어 있다.

접을 수 있는 이유는 **자식이 하나뿐인 단의 gap 은 렌더 결과를 바꾸지 않기** 때문이다.

| variant | 루트 gap | wrapper gap | 자식 수 | 실제로 보이는 간격 |
|---|---|---|---|---|
| xl · lg | `spacing/12` (자식 1개 → 무효) | `spacing/12` (자식 2개) | — | **12** |
| md · sm | `spacing/6` (자식 2개) | `spacing/4` (자식 1개 → 무효) | — | **6** |
| xs | `spacing/4` (자식 2개) | `spacing/4` (자식 1개 → 무효) | — | **4** |

`[Text Set Description] …` 단은 자식이 보조 텍스트 하나이고 fill·stroke·padding 이
없어 시각 값을 갖지 않는다. 따라서 세로 한 단 + 텍스트 2개로 접어도 렌더 결과가 같다.
시각 값을 갖지 않는 래퍼를 만들지 않는다. (CLAUDE.md 원칙 2 — `Divider`·`TextButton` 과 같은 판단)

접은 결과가 Figma 실측 높이와 맞는지 확인했다 (제목 lh 1.3 · 보조 lh 1.5):

| variant | 제목 | 간격 | 보조 | 합 | Figma 실측 |
|---|---|---|---|---|---|
| xl | 28×1.3 = 72.8 | 12 | 18×1.5 = 27 | 111.8 | 111 |
| lg | 24×1.3×2줄 = 62.4 | 12 | 27 | 101.4 | 101 |
| md | 20×1.3 = 26 | 6 | 16×1.5 = 24 | 56 | 56 |
| sm | 18×1.3 = 23.4 | 6 | 14×1.5 = 21 | 50.4 | 50 |
| xs | 16×1.3 = 20.8 | 4 | 21 | 45.8 | 46 |

`xl` 은 Figma 에서도 제목이 두 줄(72 = 36×2)이다. 줄바꿈이 텍스트 내용에 들어 있다.

## 폭 — 360 을 `w-full` 로 옮긴 근거

다섯 variant 루트가 모두 고정 360 이지만, 이 값을 컴포넌트 속성으로 보지 않았다.

1. 같은 파일의 `Divider`(360×1)에서 이미 같은 판단을 내렸다 —
   360 은 이 파일의 모바일 페이지 폭에서 온 배치값이다 (`Divider.design.md`).
2. `wrapper` 는 다섯 variant 모두 부모를 채운다 —
   `xl`·`lg` 는 `flex-[1_0_0]`(FILL), `md`·`sm`·`xs` 는 `w-full`.
   즉 컴포넌트 내부는 폭을 스스로 정하지 않고 받아쓴다.

360 에 대응하는 토큰은 없고, 만들지도 않았다.

## variant 6단 표기 불일치 — 보고만 한다

Figma 의 컴포넌트 설명문은 크기를 **6단**(xxLarge, xLarge, Large, Medium, Small, xSmall)
으로 적고 있으나, 세트에 실제로 존재하는 variant 는 **5개**(xl, lg, md, sm, xs)다.
설명문에만 있고 노드가 없는 단(xxLarge)은 구현하지 않았다. 없는 값을 지어내지 않는다.
(원칙 1) 이 불일치는 이 저장소에서 고칠 수 있는 것이 아니라 보고만 한다. (원칙 3)

## 옮기지 않은 Figma 출력

| 항목 | 이유 |
|---|---|
| `overflow-hidden` · `text-ellipsis` (텍스트 노드) | 줄 수 제한이 없어 렌더 결과가 바뀌지 않는다 |
| `overflow-clip` (xl·lg 루트) | 접힌 뒤에는 넘칠 자식이 없다 |
| `whitespace-pre-wrap` (xl·lg 제목) | 줄바꿈은 샘플 내용이지 컴포넌트 속성이 아니다 |
| `not-italic` | Tailwind preflight 기본값과 같다 |
| `w-[360px]` | 위 "폭" 참조 |

## 필요하지만 없는 토큰

**없다.** 이 컴포넌트가 쓰는 색 2개 · 타이포 8개 · 간격 4개가 모두
`src/tokens/*.css` 에 이미 있다. `/sync-tokens` 가 필요하지 않다.

## prop

| prop | 타입 | 기본값 | 근거 |
|---|---|---|---|
| `size` | `'xl' \| 'lg' \| 'md' \| 'sm' \| 'xs'` | `'xl'` | Figma variant 축 |
| `title` | `ReactNode` | 필수 | `Title` 텍스트 노드 자리 (내용 슬롯) |
| `description` | `ReactNode` | `undefined` | Figma component property `description`(boolean). 넘기지 않으면 `false` 와 같은 렌더 결과 |

`title` 은 `HTMLAttributes` 의 `title?: string` 과 충돌해 `Omit` 으로 지운 뒤 재선언했다.
`TextButton` 이 `color` 에 쓴 것과 같은 패턴이다.

Figma 에 없는 variant·상태(hover · pressed · disabled)·정렬 옵션은 추가하지 않았다.
