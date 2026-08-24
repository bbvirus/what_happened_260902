import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { ListRadio } from '../../components/ListRadio/ListRadio';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { Tab } from '../../components/Tab/Tab';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';

/**
 * PRD `docs/prd-list` §5 의 `planList[].category` 열거값 그대로다.
 * 라벨은 Figma `Tab` 인스턴스(27683:3207) 의 세 텍스트 오버라이드 그대로다 —
 * `5G` · `LTE` · `알뜰폰`. 라벨과 값이 다른 것은 `알뜰폰` 하나뿐이고,
 * PRD 가 그 자리에 `MVNO` 를 적어 두었기 때문이다.
 */
const CATEGORIES = [
  { label: '5G', value: 'MOBILE_5G' },
  { label: 'LTE', value: 'LTE' },
  { label: '알뜰폰', value: 'MVNO' },
] as const;

type PlanCategory = (typeof CATEGORIES)[number]['value'];

/** PRD §5 의 `planList[]` 중 이 화면이 그리는 필드만. `monthlyFee` 는 아래 주석 참조. */
interface Plan {
  id: string;
  name: string;
  category: PlanCategory;
}

/**
 * **목업이다. Figma 에도 PRD 에도 실제 요금제명이 없다.**
 *
 * Figma 의 세 행은 전부 `타이틀 영역입니다.` 라는 자리표시자이고(27683:3211 ·
 * 3212 · 3213), PRD §5 는 `planList[]` 를 서버가 내려주는 값으로 적고 있다.
 * 이 저장소에는 그 서버가 없다. 자리표시자 3개를 그대로 두면 PRD 완료 기준
 * *"탭 전환 시 올바른 요금제 리스트가 표시된다"* 를 눈으로 확인할 수 없어서,
 * **탭마다 다르다는 것만 알 수 있는 최소한의 목업**을 둔다.
 * 실제 상품명을 지어내지 않았다 — 그것은 확인되지 않은 값이다 (원칙 1).
 * 서버 연동 시 이 상수를 통째로 교체한다.
 *
 * `monthlyFee` 를 넣지 않은 것은 요청자 결정이다: *"Figma 그대로 — 요금제명만"*.
 * `ListRadio` 는 제목 한 줄만 받고(Figma 행의 `description=false`), 그리지 않는
 * 값을 데이터에만 담아 두지 않는다 (원칙 2). 그래서 PRD 완료 기준의
 * *"월 요금이 정상 노출된다"* 는 미달로 남는다 — `Benefit.design.md` 에 적었다.
 */
const MOCK_PLANS: readonly Plan[] = [
  { id: 'plan-5g-a', name: '5G 요금제 A', category: 'MOBILE_5G' },
  { id: 'plan-5g-b', name: '5G 요금제 B', category: 'MOBILE_5G' },
  { id: 'plan-5g-c', name: '5G 요금제 C', category: 'MOBILE_5G' },
  { id: 'plan-lte-a', name: 'LTE 요금제 A', category: 'LTE' },
  { id: 'plan-lte-b', name: 'LTE 요금제 B', category: 'LTE' },
  { id: 'plan-lte-c', name: 'LTE 요금제 C', category: 'LTE' },
  { id: 'plan-mvno-a', name: '알뜰폰 요금제 A', category: 'MVNO' },
  { id: 'plan-mvno-b', name: '알뜰폰 요금제 B', category: 'MVNO' },
  { id: 'plan-mvno-c', name: '알뜰폰 요금제 C', category: 'MVNO' },
];

/**
 * Figma `page/List` (node 27683:3204) + PRD `docs/prd-list` (요금제 선택).
 * 값 대조표와 판단 근거는 `Benefit.design.md` 에 있다.
 *
 * ## 새로 만든 컴포넌트도, 새로 추가한 토큰도 없다
 * Figma 트리의 인스턴스 7종이 `src/components` 와 1:1 로 맞는다. 이 파일이 직접
 * 그리는 것은 Figma 의 **레이아웃 프레임 3개**뿐이고(`Contents` 27683:3208 ·
 * `Plans` 27683:3210 · `Bottom`→`CTA` 27683:3214→3215), 그 프레임들이 갖는
 * 시각 값은 패딩과 간격뿐이다.
 *
 * | Figma 노드 | 선언된 값 | 이 파일 |
 * |---|---|---|
 * | `Contents` 27683:3208 | padding-top 32 · left/right 20 | `pt-32 px-20` |
 * | `Plans` 27683:3210 | padding-top 16 | `pt-16` |
 * | `CTA` 27683:3215 | padding 8·20·20 · gap 8 | `pt-8 px-20 pb-20 gap-8` |
 *
 * `Contents` 의 Figma 높이 590 은 제약이 아니라 874 − (62 + 56 + 49 + 83 + 34) 의
 * 나머지다. 그래서 높이 토큰이 아니라 `flex-1` 로 옮겼다 — `Login.tsx` 와 같은 판단.
 *
 * ## 라디오 그룹의 의미론은 이 파일이 갖는다
 * `ListRadio` 는 자기 문서에서 *"선택 가능한 행의 시각 표현이다. `role="radio"` ·
 * `aria-checked` · 그룹핑 · 키보드 조작은 호스트가 담당한다"* 고 선언하고, 루트
 * `<div>` 에 props 를 전개해 둔다. 그 계약대로 여기서 얹는다:
 * `role="radiogroup"` + 행마다 `role="radio"` · `aria-checked` · roving tabindex ·
 * 화살표/스페이스 키. 포커스 이동은 `ListRadio` 에 ref 를 넘기는 대신 그룹 컨테이너
 * 에서 `[role="radio"]` 를 찾아 한다 — 컴포넌트의 props 타입을 이 화면 때문에
 * 고치지 않기 위해서다 (원칙 3).
 *
 * ## 셰브론(>) 에 핸들러를 걸지 않았다
 * PRD §6 시나리오 4 가 *"상세 동작은 추후 정의"* 라고 적고 있다. 갈 곳이 정해지지
 * 않은 이동을 지어내지 않았다 (원칙 1). Figma 의 `Icon/chevronRight-small-line` 도
 * `ListRadio` 안의 장식 아이콘이지 별도 버튼이 아니다.
 *
 * ## '선택 완료' 에 핸들러를 걸지 않았다
 * PRD §6 시나리오 5 의 대상인 **개통 신청서 화면이 이 저장소에 없다.** 라우트도
 * 컴포넌트도 없어서 `navigate` 대상이 존재하지 않는다. 활성/비활성 전환은 PRD 가
 * 명시한 값이라 구현했고, 이동만 남겼다.
 */
export function Benefit() {
  const navigate = useNavigate();

  /** Figma 는 첫 번째 탭에만 `isSelected=true` 를 건다. PRD §6 시나리오 1 도 같다. */
  const [categoryIndex, setCategoryIndex] = useState(0);
  /** PRD §6 시나리오 1 — 최초에는 라디오 미선택이다. */
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const groupRef = useRef<HTMLDivElement>(null);

  const category = CATEGORIES[categoryIndex].value;
  const plans = MOCK_PLANS.filter((plan) => plan.category === category);
  const selectedIndex = plans.findIndex((plan) => plan.id === selectedPlanId);

  /** PRD §6 시나리오 2 — 탭을 바꾸면 이전 탭의 선택은 초기화된다. */
  function handleCategorySelect(index: number) {
    setCategoryIndex(index);
    setSelectedPlanId(null);
  }

  /** `ListRadio` 에 ref 를 넘기지 않기 위해 그룹 컨테이너에서 행을 찾는다 (위 주석 참조). */
  function focusRow(index: number) {
    groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[index]?.focus();
  }

  /** radiogroup 표준 키보드 조작. 화살표는 이동과 선택을 함께 한다. */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;

    if (step !== 0) {
      event.preventDefault();
      const next = (index + step + plans.length) % plans.length;
      setSelectedPlanId(plans[next].id);
      focusRow(next);
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      setSelectedPlanId(plans[index].id);
    }
  }

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      {/* 27683:3205 */}
      <OSBarTopNavigation />

      {/* 27683:3206 — `hasTitle` · `hasSlotStart` 는 기본값 그대로 켜져 있고,
          `hasSlotEnd` 는 이 인스턴스가 끈 값이자 Header 의 기본값이다.

          뒤로가기는 이 화면의 하단 "뒤로가기" 버튼(27683:3216)과 **같은 동작**이다 —
          PRD §3 · §6 시나리오 6 의 "이전 화면 복귀" 이고, 그 화면(요금제 관리)이
          이 저장소에 없어 `navigate(-1)` 로 옮겨져 있다. 한 화면 안에서 같은 의도의
          두 컨트롤이 다르게 동작하지 않게 그 선택을 그대로 따른다.
          `Consent` 가 `/login` 을 고정한 것과 다른 이유는 `Benefit.design.md` 참조. */}
      <Header title="요금제 선택" onSlotStartClick={() => navigate(-1)} />

      {/* 27683:3207 — 세 라벨과 선택 인덱스 0 이 Figma 인스턴스의 오버라이드 그대로다. */}
      <Tab
        items={CATEGORIES.map((item) => item.label)}
        selectedIndex={categoryIndex}
        onSelect={handleCategorySelect}
      />

      {/* Contents 27683:3208 */}
      <div className="flex flex-1 flex-col items-start px-20 pt-32">
        {/* 27683:3209 — `[Text Set Title] Large` → size="lg", `hasDescription=false`.
            두 줄로 끊긴 것은 Figma 텍스트 노드의 내용이고 컴포넌트 속성이 아니라서
            (TextSetTitle.tsx 의 "넣지 않은 것" 절) 줄바꿈을 여기서 넣는다. */}
        <TextSetTitle
          size="lg"
          title={
            <>
              가입할 요금제를
              <br />
              선택해 주세요
            </>
          }
        />

        {/* Plans 27683:3210 */}
        <div
          ref={groupRef}
          role="radiogroup"
          aria-label={`${CATEGORIES[categoryIndex].label} 요금제`}
          className="flex w-full flex-col pt-16"
        >
          {plans.map((plan, index) => (
            /* 27683:3211 · 3212 · 3213 — 셋 다 같은 `List/Radio` 인스턴스이고
               다른 것은 `isChecked` 축뿐이다. */
            <ListRadio
              key={plan.id}
              isChecked={plan.id === selectedPlanId}
              title={plan.name}
              role="radio"
              aria-checked={plan.id === selectedPlanId}
              // roving tabindex — 선택된 행이 있으면 그 행이, 없으면 첫 행이 탭 순서에 남는다.
              tabIndex={index === (selectedIndex === -1 ? 0 : selectedIndex) ? 0 : -1}
              onClick={() => setSelectedPlanId(plan.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          ))}
        </div>
      </div>

      {/* Bottom 27683:3214 */}
      <div className="flex w-full flex-col">
        {/* CTA 27683:3215 */}
        <div className="flex w-full gap-8 px-20 pt-8 pb-20">
          {/* 27683:3216 — hierarchy=secondary. PRD §6 시나리오 6 — 선택 내용을 버리고
              이전 화면으로 돌아간다. `navigate(-1)` 이 그 "이전 화면" 이다. */}
          <Button variant="filled-secondary" className="flex-1" onClick={() => navigate(-1)}>
            뒤로가기
          </Button>
          {/* 27683:3217 — hierarchy=primary. PRD §6 시나리오 1·3 — 미선택이면 비활성이다.
              Figma 는 선택된 상태 하나만 그려 두어 활성만 보인다. */}
          <Button variant="filled-primary" className="flex-1" isDisabled={selectedPlanId === null}>
            선택 완료
          </Button>
        </div>
      </div>

      {/* 27683:3218 */}
      <OSBarBottomNavigation />
    </div>
  );
}
