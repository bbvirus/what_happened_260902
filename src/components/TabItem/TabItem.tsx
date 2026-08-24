import type { ButtonHTMLAttributes } from 'react';
import { StateLayerPressed } from '../StateLayerPressed/StateLayerPressed';
import { StateLayerFocused } from '../StateLayerFocused/StateLayerFocused';

/** Figma variant 축 `state`. 값 3개는 컴포넌트 세트에 있는 것 그대로다. */
export type TabItemState = 'default' | 'pressed' | 'focused';

export interface TabItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma variant 축 `isSelected`. 선택된 탭인지. */
  isSelected?: boolean;
  /**
   * 상태를 **강제로 고정한다. Storybook 에서 변형 4개를 전부 캡처하기 위한 용도다.**
   *
   * 실제 사용처에서는 넘기지 않는다. 넘기지 않으면 `:active`(pressed) 와
   * `:focus-visible`(focused) 로 브라우저가 알아서 상태를 만든다.
   * `Button` 의 같은 이름 prop 과 같은 역할이다.
   */
  state?: TabItemState;
}

/**
 * Figma `Tab/ Item` 컴포넌트 세트 (node 20:7623, 섹션 27776:6988).
 *
 * 변형은 4개이고 전 조합이 아니다 — `isSelected=false` 는 `state=default` 와만
 * 짝지어진다. 즉 **선택되지 않은 탭의 pressed · focused 표현이 Figma 에 없다.**
 * 매핑표와 값의 출처는 `TabItem.design.md` 에 있다.
 *
 * · 좌우 패딩: Figma 변수 `spacing/12` → 기존 토큰 `--spacing-12` → `px-12`
 * · content 상하 패딩: Figma 변수 `spacing/14` → `--spacing-14` → `py-14`
 * · 라벨 타이포: Figma 변수 `font/label/xLarge-strong`
 *   (Pretendard · Bold · font-size/label-xLarge · lineHeight 100 · letterSpacing 0)
 *   → 기존 @utility `font-label-x-large-700` 과 4개 값 전부 일치 → 재사용
 * · 라벨 색: 선택 시 Figma 변수 `text/primary` → `--color-text-primary`,
 *   비선택 시 `text/secondary` → `--color-text-secondary`
 * · 선택 표시선: Figma 변수 `border/strong` → `--color-border-strong`.
 *   두께는 노드 20:7629 · 20:7625 의 실측 height 이며 변수 바인딩이 없다
 *   → 토큰 `--spacing-tab-indicator-height` → `h-tab-indicator-height`
 * · 반경: 루트에 없다(직각). 상태 레이어만 Figma 변수 `radius/4` → `rounded-4`
 *
 * 상태 오버레이 2개는 이 저장소의 기존 컴포넌트를 재사용한다. 새로 그리지 않는다.
 * · pressed → `StateLayerPressed` (Figma 변수 `stateLayer/pressed-black`)
 * · focused → `StateLayerFocused` (Figma 변수 `state/focused`)
 *
 * ## 상태 레이어를 래퍼로 감싸는 이유
 * Figma 의 레이어는 아이템을 꽉 채우지 않고 좌·우·상 인셋 한 단계, 하단은 두 단계
 * 안쪽에 놓인다 (`27776:6987` · `20:7636` 의 x · y · width · height). 두 레이어
 * 컴포넌트는 `inset-0`(호스트를 정확히 덮음) 과 `-inset-4`(경계 밖) 두 가지만
 * 제공하므로, 그 사이의 인셋은 호스트가 만든다. Figma 도 pressed 를 같은 방식으로
 * 래퍼 프레임 `27776:6987` 에 넣어 놓았다 — 구조를 그대로 옮긴 것이다.
 * 하단 인셋은 Figma 실측값이 기존 토큰 `--spacing-4` 와 값이 같아 재사용했다
 * (`StateLayerPressed` 가 `boundaryOut` 에서 같은 토큰을 재사용한 것과 같은 판단).
 *
 * ## 자식 순서는 Figma 노드 순서 그대로다 — pressed 레이어가 라벨보다 **뒤**
 * `StateLayerPressed` 의 문서는 레이어를 콘텐츠보다 앞에 두라고 적고 있고
 * `Button` 도 그렇게 한다. 여기서는 Figma 의 순서(content → Pressed)를 따랐다.
 * 두 순서가 이 컴포넌트에서 같은 픽셀을 내기 때문이다: 오버레이 색과 라벨 색이
 * 둘 다 `--bw-light-black` 에서 내려온 같은 값이라(`stateLayer/pressed-black` 은
 * 그 색의 16% 알파다), 라벨 위에 겹쳐도 합성 결과가 라벨 색과 같다.
 * (근거 값은 `TabItem.design.md` 에 있다. 여기서는 토큰 이름만 쓴다.)
 * 색이 갈라지면 이 전제가 깨지므로 그때는 순서를 앞으로 옮긴다.
 *
 * ## focused 일 때 선택 표시선이 사라진다 — Figma 그대로다
 * `state=focused, isSelected=true` 변형(20:7633)에는 `border` 자식 노드가 **없다.**
 * `default`(20:7625) · `pressed`(20:7629) 의 선택 변형에는 있다.
 * 요청자 확인 결과 이 차이를 그대로 옮기기로 했다. 임의로 보정하지 않는다 (원칙 1).
 *
 * ## 선택되지 않은 탭의 포커스 표시는 브라우저 기본 링이다
 * Figma 에 `state=focused, isSelected=false` 변형이 없어 그릴 값이 없다.
 * 그렇다고 UA 아웃라인까지 끄면 "포커스 가능한데 표시가 없는" 상태가 되어
 * WCAG 2.4.7 에 미달한다. 그래서 아웃라인을 끄는 것은 **대체 링을 실제로 그리는
 * 경로에서만** 한다 (`Button` 이 세운 것과 같은 규칙).
 */
export function TabItem({
  isSelected = false,
  state,
  className = '',
  type = 'button',
  children,
  ...props
}: TabItemProps) {
  // state 를 넘기지 않은 기본 경로인지.
  const isAuto = state === undefined;

  // Figma 에 pressed · focused × isSelected=false 조합이 없다. 그리지 않는다.
  const showPressed = isSelected && (isAuto || state === 'pressed');
  const showFocused = isSelected && (isAuto || state === 'focused');

  // 선택 표시선은 focused 에서 빠진다 (위 주석 참조).
  const showIndicator = isSelected && state !== 'focused';

  // 대체 링을 그리는 경로에서만 UA 아웃라인을 끈다.
  const uaFocusOutline = showFocused ? 'focus-visible:outline-none' : '';

  return (
    <button
      type={type}
      role="tab"
      aria-selected={isSelected}
      className={[
        // `group` 은 아래 오버레이·표시선이 버튼의 :active · :focus-visible 을 읽기 위한 것이다.
        'group relative flex flex-col items-center justify-center px-12',
        uaFocusOutline,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {/* border 20:7625 · 20:7629 — 선택 표시선. 순수 장식이라 aria-hidden 이다.
          자동 경로에서는 focused 일 때 숨는다 (Figma 20:7633 에 이 노드가 없다). */}
      {showIndicator ? (
        <span
          aria-hidden
          className={[
            'pointer-events-none absolute inset-x-0 bottom-0',
            'h-tab-indicator-height bg-border-strong',
            isAuto ? 'group-focus-visible:hidden' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      ) : null}

      {/* content 20:7626 · 20:7630 · 20:7634 · 20:7638 */}
      <span className="relative flex w-full shrink-0 flex-col items-center py-14">
        <span
          className={[
            'font-label-x-large-700 whitespace-nowrap',
            isSelected ? 'text-text-primary' : 'text-text-secondary',
          ].join(' ')}
        >
          {children}
        </span>
      </span>

      {/* Pressed 27776:6987 — Figma 의 래퍼 프레임을 그대로 옮긴 것이다. */}
      {showPressed ? (
        <span
          aria-hidden
          className={[
            'pointer-events-none absolute bottom-4',
            'inset-x-tab-state-layer-inset top-tab-state-layer-inset',
            isAuto ? 'hidden group-active:block' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* 반경을 호스트가 지정한다 — Figma 레이어 인스턴스가 `radius/4` 다. */}
          <StateLayerPressed className="rounded-4" />
        </span>
      ) : null}

      {/* StateLayer/Focused 20:7636 — pressed 와 같은 자리에 놓인다. */}
      {showFocused ? (
        <span
          aria-hidden
          className={[
            'pointer-events-none absolute bottom-4',
            'inset-x-tab-state-layer-inset top-tab-state-layer-inset',
            isAuto ? 'hidden group-focus-visible:block' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <StateLayerFocused />
        </span>
      ) : null}
    </button>
  );
}
