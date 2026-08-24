import type { HTMLAttributes, ReactNode } from 'react';

/** Figma 컴포넌트 세트 `TextFieldTextSet` (35:14458) 의 variant 축 `status`. */
export type TextFieldTextSetStatus = 'default' | 'error' | 'success' | 'informative';

/**
 * 상태 아이콘 글리프. 16 뷰박스 좌표다 — 24 뷰박스인 `Icon` 과 다르다.
 *
 * 출처: `get_design_context`(35:14458) 가 각 variant 아이콘에 물려 준 asset URL 을
 * 그대로 받아 온 export SVG 의 `d` 값이다. 이동·보정 0건.
 * `d` 값은 CLAUDE.md 토큰 규칙의 스코프 제외(SVG 기하) 대상이다.
 *
 * `default` 와 `error` 는 같은 글리프(`Icon/circle-fill`)를 쓴다 — 색만 다르다.
 * 35:14665 · 35:14672 · 35:14600 의 export `d` 가 셋 다 문자 단위로 같음을 확인했다.
 */
const CIRCLE_FILL =
  'M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 9.8C7.66863 9.8 7.4 10.0686 7.4 10.4C7.4 10.7314 7.66863 11 8 11C8.33137 11 8.6 10.7314 8.6 10.4C8.6 10.0686 8.33137 9.8 8 9.8ZM8 5C7.58755 5 7.25284 5.33294 7.25 5.74473L7.40059 8.57656C7.40029 8.58434 7.4 8.59215 7.4 8.6C7.4 8.93137 7.66863 9.2 8 9.2C8.33137 9.2 8.6 8.93137 8.6 8.6L8.75 5.74473C8.74716 5.33294 8.41245 5 8 5Z';

/** 35:14564 `Icon/success-circle-fill` 의 export `d`. */
const SUCCESS_CIRCLE_FILL =
  'M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM10.5594 6.23223C10.3121 6.01192 9.93263 6.03323 9.71211 6.28027L7.46152 8.80332L6.38691 7.71465C6.15403 7.47909 5.77358 7.47659 5.53789 7.70938C5.30225 7.94218 5.29996 8.32265 5.53262 8.5584L7.05723 10.1018C7.17363 10.2196 7.33403 10.284 7.49961 10.2799C7.66518 10.2757 7.82174 10.203 7.93203 10.0795L10.6074 7.07949C10.8279 6.83225 10.8065 6.45281 10.5594 6.23223Z';

/**
 * 35:14521 · 35:14528 `info-circle-fill` 의 export `d`.
 *
 * ⚠ 이 글리프만 세로로 살짝 내려가 있다. 나머지 두 글리프는 16 상자 안에서 위아래
 * 여백이 같은데, 이것은 아래쪽 여백이 조금 더 좁다. Figma 렌더를 실측해 확인한
 * 사실이라 보정하지 않고 그대로 옮겼다 — 근거와 실측값은 design.md 에 있다. (원칙 1·3)
 */
const INFO_CIRCLE_FILL =
  'M8 2.29102C11.3137 2.29102 14 4.97731 14 8.29102C14 11.6047 11.3137 14.291 8 14.291C4.68629 14.291 2 11.6047 2 8.29102C2 4.97731 4.68629 2.29102 8 2.29102ZM8 7.54102C7.66863 7.54102 7.4 7.80965 7.4 8.14102V10.541C7.4 10.8724 7.66863 11.141 8 11.141C8.33137 11.141 8.6 10.8724 8.6 10.541V8.14102C8.6 7.80965 8.33137 7.54102 8 7.54102ZM8 5.44102C7.66863 5.44102 7.4 5.70965 7.4 6.04102C7.4 6.37239 7.66863 6.64102 8 6.64102C8.33137 6.64102 8.6 6.37239 8.6 6.04102C8.6 5.70965 8.33137 5.44102 8 5.44102Z';

const GLYPH: Record<TextFieldTextSetStatus, string> = {
  default: CIRCLE_FILL,
  error: CIRCLE_FILL,
  success: SUCCESS_CIRCLE_FILL,
  informative: INFO_CIRCLE_FILL,
};

/**
 * 아이콘 색. Figma 아이콘 fill 오버라이드 → `--color-icon-*` 토큰.
 * `status-*` 3종은 `token-guardian` 이 추가한 상태 메시지 전용 토큰이다.
 */
const ICON_COLOR: Record<TextFieldTextSetStatus, string> = {
  default: 'text-icon-secondary',
  error: 'text-icon-status-negative',
  success: 'text-icon-status-positive',
  informative: 'text-icon-status-informative',
};

/** 본문 색. Figma 텍스트 노드에 물린 변수 → 기존 토큰. */
const TEXT_COLOR: Record<TextFieldTextSetStatus, string> = {
  default: 'text-text-secondary',
  error: 'text-text-negative',
  success: 'text-status-positive',
  informative: 'text-status-informative',
};

/**
 * `isDisabled=true` 의 두 색.
 *
 * Figma 의 disabled variant 2개(35:14668 · 35:14524)가 **둘 다** 이 조합이라
 * status 와 독립적인 규칙으로 옮겼다. 나머지 두 status 의 disabled 조합은 Figma 에
 * 없고 아래 `TextFieldTextSetProps` 의 타입이 막는다.
 */
const DISABLED_ICON_COLOR = 'text-icon-disabled-on-light';
const DISABLED_TEXT_COLOR = 'text-text-primary';

/**
 * `status` 와 `isDisabled` 의 **실재하는 조합 6개만** 받는다.
 *
 * Figma 세트 35:14458 의 자식은 6개이고 `error`·`success` 에는 disabled 짝이 없다.
 * 4×2=8 이 아니다. 없는 조합을 만들지 않기 위해 축 2개를 따로 두지 않고
 * 유니온으로 묶었다. (원칙 1·2)
 */
type StatusAndDisabled =
  | { status?: 'default'; isDisabled?: boolean }
  | { status: 'informative'; isDisabled?: boolean }
  | { status: 'error'; isDisabled?: false }
  | { status: 'success'; isDisabled?: false };

export type TextFieldTextSetProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** 보조 문구. Figma 의 `text` 노드 자리이고 기본 내용은 "도움말 메세지" 다. */
  children: ReactNode;
  /**
   * 앞머리 아이콘 표시 여부. Figma component property `hasIconStart`(boolean) 에
   * 대응하고 Figma 기본값도 `true` 다. (`Header` 의 `hasSlotStart` 와 같은 매핑)
   */
  hasIconStart?: boolean;
} & StatusAndDisabled;

/**
 * Figma `TextFieldTextSet` 컴포넌트 세트 (node 35:14458).
 *
 * Figma 설명: "입력 필드 하단에 사용되는 보조 텍스트 묶음 요소입니다.
 * 도움말, 에러, 성공, 안내(informative) 메시지를 전달하는 데 사용됩니다.
 * status 및 supportingCount 기준에 따라 구성합니다."
 *
 * ## `Icon` 을 쓰지 않는 이유 — 크기가 다르다
 * 이 자리의 아이콘 상자는 16 이고 그 안의 글리프는 12 다(여백 2).
 * `Icon` 은 24 전용이고 그 글리프는 24 안에서 20 을 차지한다(여백 2).
 * 즉 두 기하의 여백 비율이 다르다 — `Icon` 을 16 크기로 줄여 그리면 글리프가
 * 12 가 아니라 13.33 이 되어 Figma 와 어긋난다. 눈대중으로 맞추지 않고
 * Figma export 의 16 뷰박스 `d` 를 그대로 쓴다. (원칙 1)
 * 실측 근거(스크린샷 픽셀 표본)는 design.md 에 있다.
 * `ListSlotCheckbox` · `ListSlotRadio` 가 vector 를 직접 그리는 것과 같은 처리다.
 *
 * ## Figma 4단 구조를 1단으로 접었다
 * 원본은 심볼 → `content` → `wrapper` → (`iconarea` + `supportingText`) 다.
 * · `content` 는 자식이 `wrapper` 하나뿐이라 세로 gap 이 렌더에 영향을 주지 않는다.
 * · `supportingText` 는 크기가 안의 텍스트와 같아(둘 다 340×21) 세로 정렬이 무효다.
 * 그래서 시각 값을 갖는 단만 남겼다 — 아이콘·텍스트 사이 gap 과 `iconarea` 의 상단 인셋.
 * (`TextSetTitle` · `ListSlotCheckbox` 와 같은 기준, CLAUDE.md 원칙 2)
 *
 * ## 폭
 * Figma variant 6개는 전부 360 고정이지만 이는 이 파일의 모바일 페이지 폭에서 온
 * 배치값으로 본다 — 안의 텍스트가 FILL 이다. `TextSetTitle` · `Divider` 와 같은
 * 판단으로 `w-full` 로 옮겼다. 높이 21 도 고정하지 않았다: 본문 행간에서 나오는 hug 다.
 *
 * ## `isDisabled` 는 텍스트를 흐리게 하지 않는다
 * Figma 의 disabled 2개는 본문에 `text/primary` 를 물려 두었다 — 불투명한 기본 본문색이다.
 * 흐려지는 것은 아이콘뿐이다. Figma 실제 값이라 보정하지 않았다. (원칙 1·3)
 *
 * ## a11y
 * 루트는 `<div>` 다. Figma 에 상호작용 축이 없다. 이 문구는 입력 필드의 설명이므로
 * `aria-describedby` 연결과, error 를 읽어 줄 live region 여부는 **호스트가 정한다** —
 * 이 컴포넌트는 자기가 어느 입력에 붙는지 모른다. props 를 전개하므로 호스트가
 * `id` · `role` · `aria-live` 를 넘길 수 있다.
 * 아이콘은 옆 문구와 뜻이 겹치므로 `aria-hidden` 이다 (`Icon` 과 같은 기준).
 */
export function TextFieldTextSet({
  status = 'default',
  isDisabled = false,
  hasIconStart = true,
  children,
  className = '',
  ...props
}: TextFieldTextSetProps) {
  const iconColor = isDisabled ? DISABLED_ICON_COLOR : ICON_COLOR[status];
  const textColor = isDisabled ? DISABLED_TEXT_COLOR : TEXT_COLOR[status];

  return (
    <div className={['flex w-full items-start gap-4', className].filter(Boolean).join(' ')} {...props}>
      {hasIconStart ? (
        // iconarea 35:14520 등 — 상단 인셋만 갖는 단이다.
        <span className="pt-textfield-textset-icon-inset-top flex shrink-0 items-start">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={['size-16 shrink-0', iconColor].join(' ')}
          >
            <path fillRule="evenodd" clipRule="evenodd" d={GLYPH[status]} fill="currentColor" />
          </svg>
        </span>
      ) : null}

      <p className={['min-w-0 flex-1 break-words font-body-small', textColor].join(' ')}>
        {children}
      </p>
    </div>
  );
}
