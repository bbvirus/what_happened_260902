import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon/Icon';

/** 라벨과 아이콘에 함께 적용되는 semantic 색 단계. */
type TextButtonColor = 'primary' | 'secondary';

/** `color` → 라벨 색 유틸리티. Tailwind 가 스캔할 수 있도록 정적 클래스명을 그대로 적는다. */
const LABEL_COLOR: Record<TextButtonColor, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
};

/**
 * `color` 를 지우기 위해 `Omit` 이 필요하다. `HTMLAttributes` 가
 * `color?: string` 을 이미 선언해 둔 탓에 유니언으로 재정의하면 충돌한다.
 * `Icon.tsx` 가 `SVGProps` 에 쓴 것과 같은 패턴이다.
 */
export interface TextButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** 왼쪽 아이콘 슬롯. 넘기지 않으면 렌더링하지 않는다. */
  iconStart?: IconName;
  /** 오른쪽 아이콘 슬롯. 넘기지 않으면 렌더링하지 않는다. */
  iconEnd?: IconName;
  /**
   * 라벨과 아이콘의 semantic 색 단계. 기본값 `secondary` 는 이 prop 이
   * 없던 때의 렌더 결과와 같다. 아래 `## color` 에 근거가 있다.
   */
  color?: TextButtonColor;
}

/**
 * Figma `TextButton` (node 13:1742).
 *
 * Figma 원본 구조는 2단이다 — 바깥 COMPONENT(세로 auto-layout)와 그 안의
 * `content` 프레임(가로 auto-layout, node 13:1743). 바깥 단은 크기도 자식과
 * 같고(98×24) 시각 값을 하나도 갖지 않는다. 그래서 두 단을 한 요소로 합쳤다.
 * 요청 범위 밖의 래퍼를 만들지 않는다. (CLAUDE.md 원칙 2, Divider 와 같은 판단)
 *
 * · 간격: Figma 변수 `spacing/4` → 기존 토큰 `--spacing-4` → `gap-4`
 * · 라벨 색: Figma 변수 `text/secondary` → `--color-text-secondary` (`color="secondary"`, 기본값)
 * · 라벨 타이포: Figma 변수 `font/label/large`
 *   (Pretendard · Medium · font-size/label-large · lineHeight 100 · letterSpacing 0)
 *   → 기존 @utility `font-label-large` 와 4개 값 전부 일치 → 재사용
 * · 아이콘 색: Figma 변수 `icon/secondary` → `--color-icon-secondary`
 *   → `Icon` 의 `color="secondary"` (`color="secondary"`, 기본값)
 *   `color="primary"` 일 때의 아이콘 색 근거는 아래 `## color` 에 적었다.
 * · 아이콘 크기: Figma 실측 24 정사각. `Icon` 이 이미 `--spacing-24` 에서 내려온
 *   `size-24` 로 고정하므로 이 컴포넌트가 크기를 다시 지정하지 않는다.
 * · 모서리: Figma 변수 `radius/0` → `--radius-0` → `rounded-0`
 * · 패딩: Figma 에 없다. `content` 프레임이 (0,0) 에서 시작하고 컴포넌트와 크기가 같다.
 *
 * ## 아이콘 슬롯이 선택적인 근거
 * 추측이 아니라 Figma 의 component property 다. `get_design_context` 가 이 노드에서
 * 읽어낸 property 는 `hasIconStart`(boolean) · `hasIconEnd`(boolean) ·
 * `iconStart`/`iconEnd`(instance swap) · `text` 5개이며, boolean 두 개가
 * 좌/우 아이콘의 표시 여부를 켜고 끈다. 그래서 두 슬롯을 optional 로 뒀다.
 *
 * 두 슬롯의 기본 내용물은 `Icon/line` (18:5191) 인스턴스인데, 이것은 글리프가 아니라
 * 점선 테두리의 빈 플레이스홀더 템플릿이다 (`Icon.design.md` 에서 아이콘 12개를
 * 추릴 때 같은 이유로 제외한 노드다). 즉 Figma 는 "어느 아이콘이 들어갈지"를
 * 지정하지 않았으므로 코드에도 기본 아이콘을 두지 않는다. (원칙 1)
 *
 * ## color
 * Header 섹션의 `HeaderSlot/LeftEnd/Items` `contentType=buttonGroup`
 * (27657:3101)에 놓인 TextButton 인스턴스 2개(27657:3102 · 27657:3103)의 라벨이
 * Figma 변수 `text/primary` 라서 추가한 prop 이다. 근거 3건이 일치한다 —
 * `get_design_context`(27657:3101) 가 두 인스턴스 모두 `text/primary` 로 방출하고,
 * `get_variable_defs`(27657:3096) 에 `text/secondary` 가 없으며,
 * `get_screenshot`(27657:3101) 의 글리프 내부 픽셀이 `text/primary` 값과 같다.
 * (raw 색상 값은 `TextButton.design.md` 에 적었다. 여기서는 토큰 이름만 쓴다.)
 * 기본값을 `secondary` 로 둔 이유는 이 prop 이 없던 때의 렌더 결과를 그대로 두기 위함이다.
 *
 * ### 아이콘도 함께 바뀐다 — 근거는 Figma 노드가 아니라 토큰 정의다
 * 위 인스턴스 2개는 **아이콘이 없다**(42×19, 텍스트만). 따라서 `color="primary"` 의
 * 아이콘 색에 대한 Figma 근거는 없다. 그래도 `secondary` 로 고정하지 않고 함께 바꾼 이유:
 *
 * 1. `colors.tokens.css` 에서 두 계단이 **같은 base 토큰**을 가리킨다 —
 *    `--color-text-primary` 와 `--color-icon-primary` 가 둘 다 `--bw-light-black`,
 *    `--color-text-secondary` 와 `--color-icon-secondary` 가 둘 다
 *    `--neutral-gray-light-600`. 이름이 겹치는 계단(primary · secondary · tertiary ·
 *    inverse · brand · negative · disabled-on-light)은 값이 전부 같다.
 *    즉 `text/N` ↔ `icon/N` 은 이 토큰 파일 자체가 세워 둔 쌍 구조다.
 * 2. Figma 근거가 있는 유일한 경우(`secondary`)에서 실제로 그 쌍이 관찰됐다 —
 *    `text/secondary` 와 `icon/secondary` 가 함께 쓰였다(위 목록).
 *
 * 아이콘만 `secondary` 로 고정하는 쪽도 Figma 근거가 없기는 마찬가지이고, 그 경우
 * `primary` 라벨 옆에 `secondary` 아이콘이라는 **어느 계단에도 없는 조합**이 코드에
 * 박힌다. 검증 가능한 근거가 있는 쪽을 골랐다. 새로 지어낸 색 값은 없다 —
 * 두 경우 모두 기존 `--color-icon-*` 토큰을 그대로 참조한다.
 *
 * ## variant
 * 이 노드는 component set 의 variant 가 아니다. 같은 파일의 variant 컴포넌트는
 * 이름 자체가 `size=medium, isChecked=false, ...` 형태인데(예: `[Checkbox]` 13:3929),
 * 이 노드의 `get_metadata` 이름은 그냥 `TextButton` 이고 property 목록에도
 * variant 축이 없다. 그래서 variant prop 을 만들지 않았다.
 *
 * ## 상태
 * hover · pressed · disabled 는 이 노드에 정의돼 있지 않다. 임의로 만들지 않는다.
 * 포커스 표시는 브라우저 기본 outline 을 그대로 쓴다 (지우는 코드를 넣지 않았다).
 */
export function TextButton({
  iconStart,
  iconEnd,
  color = 'secondary',
  className = '',
  type = 'button',
  children,
  ...props
}: TextButtonProps) {
  return (
    <button
      type={type}
      className={['inline-flex items-center justify-center gap-4 rounded-0', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {iconStart ? <Icon name={iconStart} color={color} /> : null}
      <span className={`font-label-large ${LABEL_COLOR[color]} whitespace-nowrap`}>{children}</span>
      {iconEnd ? <Icon name={iconEnd} color={color} /> : null}
    </button>
  );
}
