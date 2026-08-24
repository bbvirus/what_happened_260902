import { Divider } from '../Divider/Divider';
import { TabItem } from '../TabItem/TabItem';

export interface TabProps {
  /**
   * 탭 라벨들. Figma 는 `Tab/ Item` 인스턴스 3개를 배치하고 각각의 `text` 를
   * 재정의한다. 그 재정의 자리를 그대로 옮긴 것이다.
   */
  items: readonly string[];
  /** 선택된 탭의 인덱스. Figma 는 첫 번째 인스턴스에만 `isSelected=true` 를 건다. */
  selectedIndex?: number;
  /** 탭을 눌렀을 때. 아래 `## onSelect` 참조. */
  onSelect?: (index: number) => void;
}

/**
 * Figma `Tab` (node 20:7647, 섹션 27776:6988).
 * 근거는 `Tab.design.md` 에 있다.
 *
 * · 좌우 패딩: Figma 변수 `spacing/20` → 기존 토큰 `--spacing-20` → `px-20`
 * · 구분선 색: Figma 변수 `border/primary` → `--color-border-primary`
 * · 구분선 두께: 기존 토큰 `--spacing-hairline` (기존 `Divider` 재사용)
 * · 배경: Figma 에 fill 이 없다. 배경 유틸리티가 들어갈 자리가 없다
 *   (스크린샷의 회색은 섹션 캔버스 색이지 이 컴포넌트의 값이 아니다)
 * · 모서리: Figma 에 radius 가 없다 (직각). 지정하지 않는다
 *
 * ## 폭 402 는 이 컴포넌트가 고정한다 — `w-mobile-frame-width`
 * `Header` 와 같은 판정이다. `get_design_context`(20:7647) 가 루트에 고정 폭을
 * 방출하고(`w-full` 이 아니다), 그 값은 `--spacing-mobile-frame-width` 와 같다.
 * 요청자 결정도 이미 기록돼 있다 — *"모바일 402 너비용 아이폰 17 해상도 디자인의
 * 컴포넌트라서 그거에 맞게 너비 고정"* (`Header.design.md`).
 * `Divider` 가 360 을 배치값으로 보고 `w-full` 로 옮긴 것과 반대 방향인 이유는,
 * 그쪽은 Figma 가 자식에 `layoutSizingHorizontal: FILL` 을 명시했기 때문이다.
 *
 * ## 구분선은 기존 `Divider` 를 재사용한다
 * Figma 의 자식 노드 이름 자체가 `divider`(20:7648) 이고, 값도 기존 컴포넌트와
 * 같다 (`border/primary` × 가장 얇은 선 × 폭 전체). 새로 그리지 않는다 (원칙 2).
 *
 * 위치는 박스 **안쪽 마지막 줄**이다 (`bottom-0`). `get_design_context` 는 이 노드를
 * 한 단계 아래로 내려 방출하지만(바깥 정렬 stroke 처럼 보인다), `get_screenshot`
 * (20:7647) 의 픽셀이 그 반대를 말한다 — 렌더의 마지막 줄에 구분선 색이 있고,
 * 선택된 탭 구간에서는 그 줄이 표시선 색으로 덮여 있다. 즉 겹침은 코드가 만드는
 * 것이 아니라 Figma 의 실제 렌더가 그렇다. 픽셀 근거는 `Tab.design.md` 에 있다.
 *
 * `aria-hidden` 을 넘기는 이유는 `role="tablist"` 가 소유할 수 있는 자식이
 * `role="tab"` 뿐이기 때문이다. `<hr>` 은 암묵으로 `role="separator"` 라서
 * 접근성 트리에 남으면 tablist 의 소유 규칙을 깬다. 순수 장식이므로 트리에서 뺀다.
 *
 * ## 등폭 분배는 컨테이너가 건다
 * Figma 도 같다 — `Tab/ Item` 세트 자체는 hug 폭이고, 늘어나는 것은 이 컨테이너
 * 안에 놓인 인스턴스 3개의 **오버라이드**다 (`get_design_context` 가 세 인스턴스에만
 * grow 를 방출한다). `min-w-0` 은 Figma 가 방출한 최소폭을 옮긴 것이다 —
 * 원본은 1 이지만 그 값의 목적은 flex 항목의 `min-width:auto` 를 푸는 것이고
 * 그 관용 표현은 0 이다 (`Header` 가 같은 자리에서 내린 것과 같은 판단).
 *
 * ## onSelect
 * Figma 의 `Tab` 에는 component property 가 0개이지만, 하위 `Tab/ Item` 세트에는
 * `state=pressed` · `state=focused` 축이 있다. 즉 이 컴포넌트의 아이템이 눌리고
 * 포커스를 받는다는 것은 Figma 가 이미 정의한 사실이다. 그 상호작용에 도달할
 * 경로가 없으면 정의된 상태가 코드에서 재현되지 않으므로, 최소 핸들러 하나만 둔다.
 * 선택 상태 자체는 이 컴포넌트가 갖지 않는다 — `selectedIndex` 를 호출부가 쥔다.
 *
 * ## a11y
 * `role="tablist"` + 자식 `role="tab"` 은 이 컴포넌트 이름과 구조에 대응하는
 * 표준 패턴이다. `aria-controls` 는 넣지 않았다 — 어떤 패널을 제어하는지는
 * 호출부만 알고, 이 컴포넌트가 추측할 수 없다 (원칙 1).
 */
export function Tab({ items, selectedIndex = 0, onSelect }: TabProps) {
  return (
    <div role="tablist" className="w-mobile-frame-width relative flex items-center px-20">
      {/* divider 20:7648 */}
      <Divider aria-hidden className="absolute inset-x-0 bottom-0" />

      {items.map((label, index) => (
        <TabItem
          key={index}
          className="min-w-0 flex-1"
          isSelected={index === selectedIndex}
          onClick={() => onSelect?.(index)}
        >
          {label}
        </TabItem>
      ))}
    </div>
  );
}
