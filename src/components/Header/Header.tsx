import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import { HeaderSlotLeftEndItems } from '../HeaderSlotLeftEndItems/HeaderSlotLeftEndItems';

export interface HeaderProps {
  /** Figma component property `title`. 타이틀 문구. */
  title: string;
  /** Figma component property `hasTitle`. 타이틀 노출 여부. */
  hasTitle?: boolean;
  /** Figma component property `hasSlotStart`. 뒤로가기 아이콘 노출 여부. */
  hasSlotStart?: boolean;
  /**
   * 뒤로가기를 눌렀을 때. **넘기면 아이콘이 `<button>` 이 되고, 넘기지 않으면
   * 이전과 같이 그냥 아이콘이다.**
   *
   * ## Figma 근거가 없다. 요청자 결정이 근거다
   * 이 파일은 원래 뒤로가기를 `<button>` 으로 만들지 않았고, 그 이유를
   * *"Figma 27657:3125 는 상호작용이 정의되지 않은 프레임이고, component property 에도
   * 클릭 축이 없다"* 로 적어 두었다. 그 관측은 **지금도 그대로 맞다.**
   * 축을 연 근거는 요청자 결정이다: *"회원 가입 이후 상단 뒤로가기 버튼 누르면
   * 로그인으로 돌아가게 해줘."*
   *
   * 기본값을 두지 않은 이유: 넘기지 않은 호출부의 렌더 결과를 그대로 두기 위함이다.
   * 클릭 축이 없는 화면에서 아무 일도 하지 않는 `<button>` 이 생기면, 키보드
   * 사용자에게 탭 정지점만 늘고 누르면 아무 일도 없는 컨트롤이 된다.
   * (`TextField*` 의 `onClear` 와 같은 판단)
   */
  onSlotStartClick?: () => void;
  /** Figma component property `hasSlotEnd`. 우측 슬롯 노출 여부. Figma 기본값이 꺼짐이다. */
  hasSlotEnd?: boolean;
  /** 우측 슬롯의 내용물. `hasSlotEnd` 가 켜졌을 때만 렌더된다. */
  children?: ReactNode;
}

/**
 * Figma `Header` (node 27657:3123, 섹션 27704:1746).
 * 근거는 `Header.design.md` 에 있다.
 *
 * · 배경: Figma 변수 `bg/secondary` → 기존 토큰 `--color-bg-secondary` → `bg-bg-secondary`
 * · 좌우 패딩: Figma 변수 `spacing/20` → `--spacing-20` → `px-20`
 * · 상하 패딩: Figma 변수 `spacing/6` → `--spacing-6` → `py-6`  (6 + 44 + 6 = 56)
 * · 행 간격: Figma 변수 `spacing/12` → `--spacing-12` → `gap-12`
 * · 타이틀 타이포: Figma 변수 `font/title/small-strong` → 기존 유틸리티
 *   `font-title-small-strong` (크기 · 굵기 · 행간 · 자간 4개 값 전부 일치)
 * · 타이틀 색: Figma 변수 `text/primary` → `--color-text-primary` → `text-text-primary`
 * · 뒤로가기 아이콘 색: Figma 변수 `icon/primary` → `Icon` 의 `color="primary"` (기본값)
 * · 행 높이: Figma 실측 제약 44 → `--spacing-header-row-height`
 * · 아이템 묶음 상하 패딩: Figma 실측 10 → `--spacing-header-item-inset-y`
 * · 모서리: Figma 에 radius 가 없다 (직각). 지정하지 않는다.
 *
 * ## 폭 402 는 이 컴포넌트가 고정한다 — `w-mobile-frame-width`
 * `get_design_context`(27657:3123) 가 루트에 고정 폭을 방출한다 (`w-full` 이 아니다).
 * `spacing.tokens.css` 의 `--spacing-mobile-frame-width` 주석도 *"같은 402 가 Header
 * 27657:3123 의 폭이기도 하다"* 라고 이 노드를 직접 지목한다. 요청자 결정도 같다 —
 * "모바일 402 너비용 아이폰 17 해상도 디자인의 컴포넌트라서 그거에 맞게 너비 고정".
 * `OSBarTopNavigation` · `OSBarBottomNavigation` 이 같은 402 에서 `w-full` 판단을
 * 뒤집은 것과 같은 결론이다.
 *
 * ## 행 높이 44 는 `content`(27657:3127) 한 노드에만 쓴다
 * `get_design_context`(27657:3123) 는 이 노드에만 높이 · 최소높이 클래스를 방출하고,
 * 같은 행의 형제 27657:3125 · 27657:3129 에는 상하 패딩만 방출한다. 자식 title
 * 27657:3128 이 높이 23 · 세로 오프셋 10.5 인 것이 이를 확인해 준다 —
 * (44 − 23) / 2 = 10.5 로, 강제된 높이 안의 가운데 정렬이다. 상하 패딩 10 의 hug 였다면
 * 프레임이 43, 오프셋이 10 이어야 한다. 그래서 나머지 두 노드에는 높이 토큰이 아니라
 * `py-header-item-inset-y` 를 쓴다. 슬롯에 높이 토큰을 쓰면 `contentType=buttonGroup`
 * 이 39 가 아니라 44 로 깨진다 (`spacing.tokens.css` 의 같은 경고).
 *
 * 최소높이도 함께 쓰는 이유: Figma 가 이 노드에 최소높이를 명시하고, `hasTitle=false`
 * (Figma 설명이 적은 로그인 · 약관동의 화면) 이면 행 안에 높이를 만드는 것이 남지 않는다.
 *
 * ## 슬롯 내용물은 `children` 이다
 * Figma 설명이 직접 답을 준다: *"헤더는 우측에 무엇이 들어갈지 모르고, 쓰는 쪽이
 * 채웁니다. 코드의 children과 같은 개념입니다."* 27657:3129 의 기본 내용물도 글리프가
 * 아니라 점선 플레이스홀더 3개이므로 기본 아이콘을 추측해 넣지 않는다 (원칙 1).
 * 슬롯 **껍데기**는 Figma 그대로 `HeaderSlotLeftEndItems` 인스턴스이고, 그 안이 비어 있다.
 *
 * `contentType` 을 넘기지 않는 이유: Figma Header 의 property 는 title · hasTitle ·
 * hasSlotStart · hasSlotEnd 4개뿐이고 contentType 은 없다. 인스턴스 27657:3129 도
 * 속성 재정의 없이 세트의 기본값(`iconGroup`)을 쓴다. Header 가 표현할 수 없는 축을
 * prop 으로 만들지 않는다 (원칙 2).
 *
 * ## variant 를 만들지 않는 이유
 * Figma 설명이 명시한다: *"variant 축이 하나도 남지 않아 컴포넌트 세트를
 * 해제했습니다."* `get_metadata` 이름도 variant 형식(`a=b, c=d`)이 아니라 그냥 `Header` 다.
 *
 * ## 요소 선택
 * 루트를 `<header>` 로 두는 이유는 `Divider` 가 `<hr>` 을 고른 것과 같다 — Figma 설명이
 * *"화면 상단에 고정되는 헤더"* 라고 적었고, `<header>` 는 banner 랜드마크가 암묵으로
 * 붙는다. 시각 값도 prop 도 늘지 않는다.
 *
 * 타이틀은 `<p>` 다. 화면 제목이니 heading 이 자연스러워 보이지만, 이 컴포넌트는 자신이
 * 문서의 어느 단계에 놓이는지 알 수 없어 heading 레벨을 고를 수 없다. Figma 가 방출한
 * 요소도 `<p>` 다. 알 수 없는 것을 추측해 박지 않는다 (원칙 1).
 *
 * 뒤로가기 자리를 `<button>` 으로 만들지 않는 이유: Figma 27657:3125 는 상호작용이
 * 정의되지 않은 프레임이고, component property 에도 클릭 축이 없다. `OSBarTopNavigation`
 * 이 설명에만 있는 `title` 을 만들지 않은 것과 같은 판정이다 (원칙 2).
 */
export function Header({
  title,
  hasTitle = true,
  hasSlotStart = true,
  hasSlotEnd = false,
  onSlotStartClick,
  children,
}: HeaderProps) {
  return (
    <header className="bg-bg-secondary w-mobile-frame-width flex flex-col items-start justify-center px-20 py-6">
      {/* wrapper 27657:3124 */}
      <div className="flex w-full items-center gap-12">
        {/* wrapper 27657:3125 — 뒤로가기 자리.
            Figma 는 이 프레임을 늘 두고 안의 아이콘 인스턴스 27657:3126 만 켜고 끈다.
            그래서 hasSlotStart 는 프레임이 아니라 아이콘에 걸린다. */}
        <div className="py-header-item-inset-y flex shrink-0 items-center">
          {hasSlotStart ? (
            onSlotStartClick ? (
              // 아이콘이 유일한 의미 전달자라 접근성 이름이 필요하다.
              // UA 기본 포커스 링은 끄지 않는다 — 대체 링을 그리는 Figma variant 가
              // 이 자리에 없어서, 끄면 포커스 표시가 사라진다 (WCAG 2.4.7).
              // `Button.tsx` 가 세운 규율과 같다: 끄는 것은 대신 그릴 때뿐이다.
              <button
                type="button"
                aria-label="뒤로 가기"
                onClick={onSlotStartClick}
                className="flex items-center"
              >
                <Icon name="chevronLeft-large" />
              </button>
            ) : (
              <Icon name="chevronLeft-large" />
            )
          ) : null}
        </div>

        {/* content 27657:3127 — 행 높이 44 를 쓰는 유일한 노드.
            min-w-0 은 Figma 가 방출한 최소폭을 옮긴 것이다. 원본은 1 이지만 그 값의
            목적은 flex 항목의 min-width:auto 를 풀어 말줄임을 가능하게 하는 것이고,
            그 관용 표현은 0 이다 (--spacing-0). 치수 결정이 아니라 레이아웃 리셋이다. */}
        <div className="h-header-row-height min-h-header-row-height flex min-w-0 flex-1 items-center">
          {hasTitle ? (
            <p className="font-title-small-strong text-text-primary min-w-0 flex-1 truncate">
              {title}
            </p>
          ) : null}
        </div>

        {/* 27657:3129 — Figma 에서 hidden 인 선택적 슬롯. 껍데기는 세트 인스턴스 그대로다. */}
        {hasSlotEnd ? (
          <HeaderSlotLeftEndItems className="shrink-0">{children}</HeaderSlotLeftEndItems>
        ) : null}
      </div>
    </header>
  );
}
