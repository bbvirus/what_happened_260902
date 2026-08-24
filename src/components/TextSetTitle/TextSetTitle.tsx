import type { HTMLAttributes, ReactNode } from 'react';

/** Figma 컴포넌트 세트 `TextSetTitle` (27719:1908) 의 variant 축 `size`. */
export type TextSetTitleSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';

/**
 * 루트 세로 auto-layout 의 간격.
 * Figma 변수 `spacing/12` · `spacing/6` · `spacing/4` → 토큰 `--spacing-12` · `-6` · `-4`.
 * `sm` 의 `min-h-24` 는 Figma 의 minHeight 24 (변수 바인딩 없음, 실측값).
 * Tailwind 가 스캔할 수 있도록 정적 클래스명을 그대로 적는다.
 */
const ROOT_LAYOUT: Record<TextSetTitleSize, string> = {
  xl: 'gap-12',
  lg: 'gap-12',
  md: 'gap-6',
  sm: 'gap-6 min-h-24',
  xs: 'gap-4',
};

/** 제목 타이포. Figma 변수 `font/*-strong` → 기존 @utility (typography.tokens.css). */
const TITLE_FONT: Record<TextSetTitleSize, string> = {
  xl: 'font-display-medium-strong',
  lg: 'font-title-large-strong',
  md: 'font-title-medium-strong',
  sm: 'font-title-small-strong',
  xs: 'font-title-x-small-700',
};

/** 보조 텍스트 타이포. Figma 변수 `font/body/*` → 기존 @utility. */
const DESCRIPTION_FONT: Record<TextSetTitleSize, string> = {
  xl: 'font-body-large',
  lg: 'font-body-large',
  md: 'font-body-medium',
  sm: 'font-body-small',
  xs: 'font-body-small',
};

/**
 * `title` 을 지우기 위해 `Omit` 이 필요하다. `HTMLAttributes` 가
 * `title?: string` 을 이미 선언해 둔 탓에 `ReactNode` 로 재정의하면 충돌한다.
 * `TextButton.tsx` 가 `color` 에 쓴 것과 같은 패턴이다.
 */
export interface TextSetTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma variant 축 `size`. 세트에 존재하는 5개뿐이다. 기본값은 Figma 기본 variant 인 `xl`. */
  size?: TextSetTitleSize;
  /** 제목. Figma 의 `Title` 텍스트 노드 자리. */
  title: ReactNode;
  /**
   * 보조 텍스트. Figma component property `description`(boolean) 에 대응한다 —
   * 넘기지 않으면 `description=false` 와 같은 렌더 결과가 된다.
   */
  description?: ReactNode;
}

/**
 * Figma `TextSetTitle` 컴포넌트 세트 (node 27719:1908).
 * 제목과 보조 텍스트 한 쌍을 크기 계단에 맞춰 쌓는 텍스트 세트.
 *
 * ## Figma 구조를 2단 접은 근거
 * Figma 원본은 3단이다.
 *
 * · `xl` · `lg`: 루트(가로 auto-layout, gap `spacing/12`) → `wrapper`(세로, gap `spacing/12`)
 *   → `Title` + `Description`
 * · `md` · `sm` · `xs`: 루트(세로, gap `spacing/6` 또는 `spacing/4`)
 *   → `wrapper`(세로, gap `spacing/4`) → `Title`
 *   그리고 루트의 두 번째 자식 `[Text Set Description] …`(가로) → `Description`
 *
 * 접을 수 있는 이유는 **자식이 하나뿐인 단의 gap 은 렌더 결과에 영향을 주지 않기**
 * 때문이다. `xl`·`lg` 의 루트는 자식이 `wrapper` 하나라 gap `spacing/12` 가 무효이고,
 * `md`·`sm`·`xs` 의 `wrapper` 는 자식이 `Title` 하나라 gap `spacing/4` 가 무효이며,
 * `[Text Set Description] …` 단도 자식이 `Description` 하나이고 자체 시각 값이 없다.
 * 따라서 실제로 보이는 간격은 다섯 variant 모두 **제목 ↔ 보조 텍스트 한 곳**뿐이다:
 * `xl`·`lg` = `spacing/12`, `md`·`sm` = `spacing/6`, `xs` = `spacing/4`.
 * 위 `ROOT_LAYOUT` 이 그 값이다. 시각 값을 갖지 않는 중간 래퍼는 만들지 않는다.
 * (CLAUDE.md 원칙 2, `Divider`·`TextButton` 과 같은 판단)
 *
 * 접은 결과가 Figma 실측 높이와 맞는지 확인했다 (제목 lineHeight 1.3 · 보조 1.5 기준):
 * `xl` 72.8+12+27 = 111.8 ≈ 111 / `lg` 62.4+12+27 = 101.4 ≈ 101 /
 * `md` 26+6+24 = 56 / `sm` 23.4+6+21 = 50.4 ≈ 50 / `xs` 20.8+4+21 = 45.8 ≈ 46.
 *
 * ## 폭
 * Figma 루트는 다섯 variant 모두 고정 360 이다. 이 값은 컴포넌트 속성이 아니라
 * 이 파일의 모바일 페이지 폭에서 온 배치값으로 본다 — 같은 파일의 `Divider`(360×1)
 * 에서 이미 같은 판단을 내렸고(`Divider.design.md`), `wrapper` 는 다섯 variant 모두
 * 부모를 채운다(`xl`·`lg` = FILL, `md`·`sm`·`xs` = width 100%). 그래서 `w-full` 로 옮겼다.
 *
 * ## 색
 * · 제목: Figma 변수 `text/primary` → 기존 토큰 `--color-text-primary` → `text-text-primary`
 * · 보조: Figma 변수 `text/secondary` → 기존 토큰 `--color-text-secondary` → `text-text-secondary`
 *
 * ## prop 을 2개로 둔 근거
 * `get_design_context`(27719:1908) 가 이 세트에서 읽어낸 component property 는
 * variant 축 `size`(5값) 와 boolean `description` 둘뿐이다. 텍스트 override 는
 * property 로 선언돼 있지 않지만, 텍스트 세트의 내용을 코드에 고정하면 컴포넌트가
 * 쓰일 수 없으므로 `title`·`description` 을 내용 슬롯으로 열었다. 시각 값이 아닌
 * 내용이며, Figma 에 없는 variant·옵션은 추가하지 않았다.
 *
 * ## 넣지 않은 것
 * · Figma `xl`·`lg` 의 `Title` 은 줄바꿈이 든 두 줄 텍스트지만, 그것은 샘플 내용이지
 *   컴포넌트 속성이 아니다. 줄바꿈 관련 유틸리티를 넣지 않았다. (원칙 1)
 * · Figma 텍스트 노드의 truncate 설정은 줄 수 제한이 없어 렌더 결과가 바뀌지 않는다.
 *   `overflow-hidden text-ellipsis` 를 옮기지 않았다.
 * · 컴포넌트 세트 설명은 크기를 6단(xxLarge…xSmall)으로 적고 있으나 실제 variant 는
 *   5개다. 없는 단을 지어내지 않았다. 이 불일치는 `TextSetTitle.design.md` 에 적었다.
 *
 * `break-words` 는 Figma 의 `word-break: break-word` 를 옮긴 것이고,
 * `shrink-0` 은 flex 부모 안에서 두 줄이 눌리지 않게 한다. 둘 다 시각 토큰이 아니라
 * 레이아웃 동작이다.
 */
export function TextSetTitle({
  size = 'xl',
  title,
  description,
  className = '',
  ...props
}: TextSetTitleProps) {
  return (
    <div
      className={['flex w-full flex-col items-start', ROOT_LAYOUT[size], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <p className={`w-full shrink-0 break-words ${TITLE_FONT[size]} text-text-primary`}>{title}</p>
      {description ? (
        <p className={`w-full shrink-0 break-words ${DESCRIPTION_FONT[size]} text-text-secondary`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
