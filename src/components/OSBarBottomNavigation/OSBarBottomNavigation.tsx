export interface OSBarBottomNavigationProps {
  /** Figma variant 축 `transparent`. true 면 배경을 그리지 않는다. */
  transparent?: boolean;
  /** Figma variant 축 `onFrameHigh`. 배경을 `bg/secondary` → `bg/tertiary` 로 바꾼다. */
  onFrameHigh?: boolean;
}

/**
 * Figma `OSBar/BottomNavigation` (컴포넌트 세트 27719:2167, 섹션 27719:2395).
 * 근거는 `OSBarBottomNavigation.design.md` 에 있다.
 *
 * · 배경: `transparent` → 없음 / `onFrameHigh` → `bg/tertiary` / 기본 `bg/secondary`.
 *   Figma 에 없는 조합(transparent=true, onFrameHigh=true)은 배경 없음이다 —
 *   `transparent` 가 배경을 제거하고 나면 `onFrameHigh` 가 바꿀 대상이 남지 않는다.
 * · 세로 여백: 루트 `padding: 21 · 8` → `pt-home-indicator-inset-top` · `pb-8`.
 * · Home Indicator: 134×5, `radius/full`.
 *   Figma 의 좌우 패딩 134 는 별도 여백이 아니라 402 안에서 폭 134 를 가운데 두기
 *   위한 표현이므로(134×3 = 402) 폭 토큰 + `items-center` 로 옮겼다.
 * · 폭 402 는 이 컴포넌트가 고정한다 — `w-mobile-frame-width`. 부모가 정하는 값이 아니다.
 *   근거는 요청자 결정이다: "모바일 402 너비용 아이폰 17 해상도 디자인의 컴포넌트라서 그거에
 *   맞게 너비 고정". 이전의 `w-full` 판단(402 를 기기 폭에서 온 배치값으로 본 것)은 뒤집혔다.
 */
export function OSBarBottomNavigation({
  transparent = false,
  onFrameHigh = false,
}: OSBarBottomNavigationProps) {
  const background = transparent ? '' : onFrameHigh ? 'bg-bg-tertiary' : 'bg-bg-secondary';

  return (
    <div
      className={[
        'pt-home-indicator-inset-top flex w-mobile-frame-width flex-col items-center pb-8',
        background,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="w-home-indicator-width h-home-indicator-height bg-icon-primary rounded-100" />
    </div>
  );
}
