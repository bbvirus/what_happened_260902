import type { HTMLAttributes } from 'react';

/** Figma variant 축 `contentType`. 두 값은 교차축 정렬만 다르다. */
export type HeaderSlotLeftEndItemsContentType = 'iconGroup' | 'buttonGroup';

/**
 * `contentType` → 정렬 유틸리티. Tailwind 가 스캔할 수 있도록 정적 클래스명을 그대로 적는다.
 * `TextButton` 의 `LABEL_COLOR` 와 같은 방식이다.
 */
const ALIGN: Record<HeaderSlotLeftEndItemsContentType, string> = {
  iconGroup: 'items-start',
  buttonGroup: 'items-center justify-end',
};

export interface HeaderSlotLeftEndItemsProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma variant 축 `contentType`. 기본값 `iconGroup` 은 Figma 가 방출한 기본값이다. */
  contentType?: HeaderSlotLeftEndItemsContentType;
}

/**
 * Figma `HeaderSlot/LeftEnd/Items` (컴포넌트 세트 27657:3096, 섹션 27704:1746).
 * 근거는 `HeaderSlotLeftEndItems.design.md` 에 있다.
 *
 * · 간격: Figma 변수 `spacing/16` → 기존 토큰 `--spacing-16` → `gap-16`
 * · 상하 패딩: Figma 실측 10 → `--spacing-header-item-inset-y` → `py-header-item-inset-y`
 * · 정렬: `contentType=iconGroup` 은 `items-start`,
 *   `contentType=buttonGroup` 은 `items-center justify-end`
 *
 * ## 높이를 지정하지 않는 이유
 * Figma 의 두 variant 높이(44 · 39)는 선언값이 아니라 상하 패딩 10 의 파생값이다.
 * `get_design_context`(27657:3096) 는 두 variant 루트에 상하 패딩만 방출하고
 * 높이 클래스는 방출하지 않는다. 그래서 `h-header-row-height` 를 쓰지 않는다 —
 * 쓰면 높이가 다른 두 variant 가 같은 높이로 눌린다.
 * (`spacing.tokens.css` 의 `--spacing-header-item-inset-y` 주석이 같은 경고를 담고 있다.)
 * `Button` 의 55 가 강제된 높이로 판정된 근거는 12 variant 가 **전부** 55 였다는 것이고,
 * 여기서는 두 variant 가 다르다 — 그래서 불변인 것은 높이가 아니라 패딩이다.
 *
 * ## ⚠ buttonGroup 은 Figma 와 높이가 어긋난다 — 미해결, 원인은 이 파일 밖이다
 * **iconGroup 은 일치한다.** 자식 `Icon` 이 정확히 24 라서 10 + 24 + 10 = 44 이고
 * Figma 실측 44 와 같다. 리뷰어가 헤드리스 브라우저로 계측해 확인했다.
 *
 * **buttonGroup 은 일치하지 않는다.** 아래 두 수는 서로 다른 것을 재고 있다:
 * · Figma 실측 높이 39 — Figma 는 라벨의 세로 크기를 19 로 잡는다 (Figma 텍스트 메트릭).
 * · 실제 렌더 높이 **36** — 브라우저는 같은 라벨을 16 으로 만든다. shipped CSS 의
 *   `font-label-large` 가 line-height 를 1 로 두어 라인박스가 글자 크기와 같아지기 때문이다.
 *   10 + 16 + 10 = 36 이고, Figma 보다 3 작다. 추정이 아니라 결정론적인 값이다.
 *
 * 즉 이 컴포넌트의 주석에서 "39 = 19 + 10 + 10" 은 **Figma 쪽 산술일 뿐 코드가 만드는 값이
 * 아니다.** 이전 판(그렇게 단정했던 주석)은 이 어긋남을 감추고 있었다.
 *
 * 이 자리에서 덮지 않은 이유: 패딩 10 은 Figma 가 방출한 값 그대로이고 차이는 전부 라벨
 * 라인박스에서 나온다. 원인은 `typography.tokens.css` 의 `font-label-large` line-height 이며
 * 그 파일은 이 작업 범위 밖이자 편집 권한 밖이다 (토큰은 `token-guardian` 담당).
 * 패딩·높이·line-height 를 조정해 36 을 39 로 맞추면 원인이 숨는다.
 * 판정에 필요한 것은 Figma `font/label/large` 의 lineHeight 가 AUTO 인지 100% 인지의
 * 재확인이고, 그것은 `token-guardian` 의 일이다.
 *
 * ## 내용물이 `children` 인 이유
 * Figma 가 방출한 property 는 `contentType` · `hasSlotEnd1..3`(boolean) ·
 * `slotEnd1..3`(instance swap) 이다. 그 슬롯들의 기본 내용물은 `Icon/line` (18:5191)
 * 인스턴스인데, 이것은 글리프가 아니라 점선 테두리의 빈 플레이스홀더 템플릿이다
 * (`Icon.design.md` 가 아이콘 12개를 추릴 때 같은 이유로 제외한 노드다).
 * `get_screenshot`(27657:3096) 에서도 점선 원 3개로 보인다. 즉 Figma 는 어느 아이콘이
 * 들어갈지 지정하지 않았으므로 코드에도 기본 아이콘을 두지 않는다 (원칙 1).
 * `TextButton` 이 자기 아이콘 슬롯에 내린 것과 같은 판정이다.
 *
 * 슬롯 6개(`hasSlotEnd1..3` + `slotEnd1..3`)를 prop 6개로 옮기지 않고 `children` 하나로
 * 두는 근거는 추측이 아니라 Figma 컴포넌트 설명 문장이다: 우측 슬롯을
 * *"코드의 children과 같은 개념"* 이라고 직접 적어두었다. boolean 3개는 "슬롯을 비운다"
 * 는 뜻이고, `children` 을 넘기지 않는 것이 그와 같은 결과다.
 *
 * `contentType` 축은 자식 높이가 서로 같으면 시각적으로 구분되지 않지만, Figma 에
 * 존재하는 축이므로 임의로 합치지 않는다.
 */
export function HeaderSlotLeftEndItems({
  contentType = 'iconGroup',
  className = '',
  children,
  ...props
}: HeaderSlotLeftEndItemsProps) {
  return (
    <div
      className={['py-header-item-inset-y flex gap-16', ALIGN[contentType], className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
