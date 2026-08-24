import type { ButtonHTMLAttributes } from 'react';
import { StateLayerPressed } from '../StateLayerPressed/StateLayerPressed';
import { StateLayerFocused } from '../StateLayerFocused/StateLayerFocused';

/**
 * Figma 의 `variant` × `hierarchy` 두 축을 한 prop 으로 합친 것이다.
 * Figma 에 존재하는 조합은 셋뿐이고 `ghost-primary` 는 **없다**.
 * 두 축을 따로 두면 타입상 존재하지 않는 조합이 만들어지므로 합쳤다.
 */
export type ButtonVariant = 'filled-primary' | 'filled-secondary' | 'ghost-secondary';

/** Figma `state` 축. */
export type ButtonState = 'default' | 'pressed' | 'focused';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /** Figma `variant`×`hierarchy` 조합. */
  variant?: ButtonVariant;
  /**
   * Figma `isDisabled` 축. HTML `disabled` 속성과 1:1 로 대응한다 —
   * 시각 표현만 바꾸는 것이 아니라 실제로 비활성화된다.
   */
  isDisabled?: boolean;
  /**
   * 상태를 **강제로 고정한다. Storybook 에서 12개 변형을 전부 캡처하기 위한 용도다.**
   *
   * 실제 사용처에서는 넘기지 않는다. 넘기지 않으면 `:active`(pressed) 와
   * `:focus-visible`(focused) 로 브라우저가 알아서 상태를 만든다.
   */
  state?: ButtonState;
}

/** 상태를 넘기지 않았을 때. 의사클래스로 fill 을 바꾼다. */
const VARIANT_AUTO: Record<ButtonVariant, string> = {
  'filled-primary':
    'text-button-primary-text bg-button-primary-fill active:bg-button-primary-fill-pressed focus-visible:bg-button-primary-fill-focused',
  'filled-secondary':
    'text-button-secondary-text bg-button-secondary-fill active:bg-button-secondary-fill-pressed focus-visible:bg-button-secondary-fill-focused',
  // ghost 는 Figma 에서 세 상태 모두 fill 이 없다. 배경 유틸리티가 들어갈 자리가 없다.
  'ghost-secondary': 'text-button-ghost-text',
};

/**
 * `state` 를 강제 지정했을 때. 위와 같은 토큰을 상태 하나로 고정한다.
 * Tailwind 는 소스에 적힌 완전한 클래스 문자열만 스캔하므로 조합해 만들지 않고 펼쳐 적는다.
 */
const VARIANT_FORCED: Record<ButtonVariant, Record<ButtonState, string>> = {
  'filled-primary': {
    default: 'text-button-primary-text bg-button-primary-fill',
    pressed: 'text-button-primary-text bg-button-primary-fill-pressed',
    focused: 'text-button-primary-text bg-button-primary-fill-focused',
  },
  'filled-secondary': {
    default: 'text-button-secondary-text bg-button-secondary-fill',
    pressed: 'text-button-secondary-text bg-button-secondary-fill-pressed',
    focused: 'text-button-secondary-text bg-button-secondary-fill-focused',
  },
  'ghost-secondary': {
    default: 'text-button-ghost-text',
    pressed: 'text-button-ghost-text',
    focused: 'text-button-ghost-text',
  },
};

/**
 * Figma `isDisabled=true`. filled 2종만 disabled fill 을 갖고 ghost 는 fill 이 없다.
 * 라벨 색은 셋 다 같다 — 아래 주석 참조.
 */
const VARIANT_DISABLED: Record<ButtonVariant, string> = {
  'filled-primary': 'text-text-disabled-on-light bg-button-disabled-fill',
  'filled-secondary': 'text-text-disabled-on-light bg-button-disabled-fill',
  'ghost-secondary': 'text-text-disabled-on-light',
};

/**
 * Figma `Button` 컴포넌트 세트 (node 1:4004).
 *
 * Figma 설명: "페이지 단위에서 주요 행동을 수행하기 위해 사용하는 버튼 컴포넌트.
 * 결제, 다음 단계 진행, 완료 등의 주요 CTA 에 활용된다."
 *
 * 변형 12개는 전 조합이 아니다 — 스타일 3종 × 상태 4종이고 `ghost-primary` 는 없다.
 * `isDisabled=true` 는 Figma 에서 `state=default` 와만 짝지어진다.
 * 매핑표와 값의 출처는 `Button.design.md` 에 있다.
 *
 * 상태 표현은 두 경로다:
 * · `state` 를 넘기지 않으면 `:active` · `:focus-visible` 로 자동 동작한다 (기본 경로)
 * · `state` 를 넘기면 그 상태로 고정된다 (Storybook 캡처용)
 *
 * 상태 오버레이 2개는 이 저장소의 기존 컴포넌트를 재사용한다. 새로 그리지 않는다.
 * · pressed → `StateLayerPressed` (`boundaryOut=false`)
 * · focused → `StateLayerFocused` (`outerFocus`)
 *
 * Figma 는 pressed·focused 에서 **fill 토큰 교체와 오버레이를 함께** 한다.
 * 오버레이만으로 상태를 만들지 않으므로 두 가지를 모두 넣었다.
 */
export function Button({
  variant = 'filled-primary',
  isDisabled = false,
  state,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  // state 를 넘기지 않은 기본 경로인지.
  const isAuto = state === undefined;

  // Figma 에 pressed+disabled · focused+disabled 조합이 없다. 타입이 아니라 런타임에서
  // 막는 이유: `isDisabled` 는 실제 호출부가 늘 쓰는 prop 이고 `state` 는 스토리 전용이다.
  // 둘을 타입으로 묶으면, state 를 넘기지 않는 대다수 호출부까지 스토리 전용 제약을
  // 만족시켜야 한다. 반면 `ghost-primary` 는 실제 prop 하나 안의 도메인 제약이라
  // 타입으로 막았다 (ButtonVariant 에 그 값이 없다).
  // 브라우저도 같은 방향이다 — disabled 버튼은 :active 도 :focus-visible 도 되지 않는다.
  const showPressed = !isDisabled && (isAuto || state === 'pressed');
  const showFocused = !isDisabled && (isAuto || state === 'focused');

  // UA 기본 포커스 링은 **대체 링을 실제로 그리는 경로에서만** 끈다.
  // showFocused 가 false 여도 버튼은 여전히 포커스를 받는다 (state='default'|'pressed').
  // 그 경로에서까지 아웃라인을 끄면 "포커스 가능한데 표시가 없는" 상태가 되어
  // WCAG 2.4.7 에 미달한다. 끄는 조건과 그리는 조건을 하나로 묶어 그 간극을 없앤다.
  const uaFocusOutline = showFocused ? 'focus-visible:outline-none' : '';

  // Figma 는 state=focused 를 뺀 9개 variant 루트에 clip 을 건다.
  // focused 만 clip 이 없다 — 링이 경계 밖 한 단계에 그려져 잘리면 안 되기 때문이다.
  const clip = isAuto
    ? 'overflow-hidden focus-visible:overflow-visible'
    : state === 'focused'
      ? 'overflow-visible'
      : 'overflow-hidden';

  const skin = isDisabled
    ? VARIANT_DISABLED[variant]
    : isAuto
      ? VARIANT_AUTO[variant]
      : VARIANT_FORCED[variant][state];

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        // `group` 은 아래 오버레이가 버튼의 :active · :focus-visible 을 읽기 위한 것이다.
        // `inline-flex` 는 Figma 의 hug 폭을 옮긴 것이다 — 폭 토큰을 쓰지 않는다.
        'group relative inline-flex flex-col items-center justify-center',
        'min-h-button-height rounded-4 px-20 py-14 font-label-large',
        // UA 기본 포커스 링을 끄는 것은 그 자리를 StateLayerFocused 가 대신 그릴 때뿐이다.
        // 위 uaFocusOutline 주석 참조.
        uaFocusOutline,
        clip,
        skin,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {/* Figma 의 자식 순서 그대로 — pressed 레이어가 라벨보다 **먼저** 온다.
          호스트 전체를 덮는 반투명 오버레이라, 뒤에 두면 라벨까지 어두워진다. */}
      {showPressed ? (
        <StateLayerPressed
          color={variant === 'filled-secondary' ? 'white' : 'black'}
          // 반경을 호스트가 지정한다. Figma 의 레이어가 `radius/0`(직각)인 것은
          // 부모의 clip 이 모서리를 잘라 주기 때문인데, 코드에서는 그 clip 이
          // 포커스 링을 내보내려고 풀리는 순간이 있다 (:focus-visible 과 :active 동시 성립).
          // 그때 직각 레이어가 버튼의 rounded-4 밖으로 삐져나온다.
          // 레이어에 같은 반경을 직접 주면 clip 유무와 무관하게 같은 픽셀이 나온다 —
          // 반경 4 사각형을 그리는 것과, 직각 사각형을 반경 4 로 잘라내는 것은 같은 도형이다.
          className={isAuto ? 'rounded-4 hidden group-active:block' : 'rounded-4'}
        />
      ) : null}

      {/* `relative` 가 필수다: static 요소는 DOM 순서와 무관하게 positioned 형제보다
          먼저 칠해지므로, 없으면 pressed 레이어가 라벨 위로 올라온다.
          Figma 의 `content` 프레임도 같은 이유로 relative 다. */}
      <span className="relative flex w-full shrink-0 items-center justify-center gap-4">
        {children}
      </span>

      {/* 포커스 링. 경계 밖에 그려져 라벨과 겹치지 않으므로 자식 순서는 무관하다. */}
      {showFocused ? (
        <StateLayerFocused
          outerFocus
          className={isAuto ? 'hidden group-focus-visible:block' : ''}
        />
      ) : null}
    </button>
  );
}
