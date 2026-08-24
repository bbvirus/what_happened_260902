import type { HTMLAttributes, ReactNode } from 'react';

/** Figma variant 축 `contentType`. 값 2개는 컴포넌트 세트에 있는 것 그대로다. */
export type TextFieldSlotEndItemsContentType = 'suffix' | 'icon';

export interface TextFieldSlotEndItemsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma variant 축 `contentType`.
   * 기본값 `icon` 은 `get_design_context`(13:2209) 가 방출한 기본값과 같다.
   */
  contentType?: TextFieldSlotEndItemsContentType;
  /**
   * 슬롯 내용.
   *
   * · `contentType="suffix"` — 접미 텍스트. Figma 기본 문구는 "원" 이고
   *   서식(`font/label/large` · `text/primary` · 우측 정렬)은 이 컴포넌트가 건다.
   * · `contentType="icon"` — 아이콘 노드. Figma 는 인스턴스 스왑 슬롯 4칸을 두고
   *   기본으로 마지막 1칸만 보이게 해 둔다(13:2218~13:2221 중 앞 3개가 hidden).
   *   즉 칸 수는 호출부가 정한다. 여기서 개수를 강제하지 않는다.
   */
  children?: ReactNode;
}

/**
 * Figma `TextFieldSlot/End/Items` 컴포넌트 세트 (node 13:2209, 섹션 27683:6167).
 *
 * 입력 필드 오른쪽 끝에 붙는 슬롯이다. 변형은 축 하나(`contentType`) × 2개뿐이고,
 * 두 변형은 **루트 정렬만 다르다.** 매핑표와 값의 출처는
 * `TextFieldSlotEndItems.design.md` 에 있다.
 *
 * · `contentType="icon"` (13:2217) — `flex items-center`,
 *   아이콘 사이 간격은 Figma 변수 `spacing/16` → 기존 토큰 `--spacing-16` → `gap-16`
 * · `contentType="suffix"` (13:2212) — `flex items-start`, 간격 없음(자식 1개)
 *
 * 접미 텍스트 서식은 전부 Figma 변수에서 내려온다.
 * · 타이포: 변수 `font/label/large`
 *   (Pretendard · Medium · font-size/label-large(16) · lineHeight 100 · letterSpacing 0)
 *   → 기존 @utility `font-label-large` 와 4개 값 전부 일치 → 재사용
 * · 색: 변수 `text/primary` → 기존 토큰 `--color-text-primary` → `text-text-primary`
 * · 정렬: 텍스트 노드 13:2213 의 textAlign = right → `text-right`
 *
 * ## 아이콘을 이 컴포넌트가 그리지 않는 이유
 * Figma 의 아이콘 4칸은 전부 `Icon/line`(18:5191) 인스턴스다. 그 심볼은
 * `Icon.design.md` 가 이미 판정해 둔 대로 **점선 빈 플레이스홀더 템플릿이며
 * 아이콘이 아니다** — 즉 스왑 슬롯이다. 그리라고 지정된 글리프가 Figma 에 없으므로
 * 이 컴포넌트는 자리만 만들고 글리프는 호출부가 넘긴다 (원칙 1).
 *
 * 슬롯의 기본 아이콘 색은 Figma 변수 `icon/secondary` = `--color-icon-secondary` 다.
 * 그 색을 여기서 강제하지 않는 이유는 `Icon` 이 이미 `color` prop 으로 같은 토큰
 * 집합을 노출하고 있어서다. 호출부가 `<Icon name="…" color="secondary" />` 로 넘긴다
 * (`Icon` 은 자기 색 유틸리티를 항상 붙이므로 컨테이너에서 상속되지 않는다).
 *
 * ## 크기를 고정하지 않는다
 * Figma 의 두 변형(24×24 · 14×19)은 전부 hug 결과다. 폭·높이 제약이 아니라
 * 내용에서 파생된 값이므로 치수 유틸리티를 넣지 않는다
 * (`TabItem.design.md` 이 높이 49 에 대해 세운 것과 같은 기준).
 */
export function TextFieldSlotEndItems({
  contentType = 'icon',
  className = '',
  children,
  ...props
}: TextFieldSlotEndItemsProps) {
  return (
    <div
      className={[
        'flex',
        // 13:2217 은 items-center + gap(spacing/16), 13:2212 는 items-start + gap 없음.
        contentType === 'icon' ? 'items-center gap-16' : 'items-start',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {contentType === 'suffix' ? (
        // 텍스트 13:2213 — 서식은 전부 Figma 변수에서 내려온 토큰이다.
        <span className="font-label-large text-text-primary text-right whitespace-nowrap">
          {children}
        </span>
      ) : (
        children
      )}
    </div>
  );
}
