import type { Meta, StoryObj } from '@storybook/react';
import { Benefit } from './Benefit';

/** Figma `page/List` (node 27683:3204). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-3204';

const meta = {
  title: 'Pages/Benefit',
  component: Benefit,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `page/List` (node 27683:3204) + PRD `docs/prd-list` (요금제 선택). ' +
          '**새로 만든 컴포넌트도, 새로 추가한 토큰도 없습니다.**\n\n' +
          '위에서 아래로: `OSBarTopNavigation` → `Header`(`title="요금제 선택"`) → ' +
          '`Tab`(5G · LTE · 알뜰폰) → `TextSetTitle`(`size=lg`, 두 줄) → ' +
          '`ListRadio` × 3 → `Button`(`filled-secondary` 뒤로가기 · `filled-primary` 선택 완료) → ' +
          '`OSBarBottomNavigation`.\n\n' +
          '**동작합니다** — 탭을 바꾸면 리스트가 바뀌고 선택이 초기화됩니다(PRD §6 시나리오 2). ' +
          '행을 누르면 단일 선택되고, 그때 비로소 `선택 완료` 가 활성화됩니다(시나리오 1·3). ' +
          '리스트는 `role="radiogroup"` 이라 화살표 키로도 이동·선택됩니다.\n\n' +
          '**요금제 목록은 목업입니다.** Figma 의 세 행은 `타이틀 영역입니다.` 자리표시자이고 ' +
          'PRD 는 `planList[]` 를 서버가 내려주는 값으로 적고 있습니다. 실제 상품명을 ' +
          '지어내지 않았습니다.\n\n' +
          '`선택 완료` 와 셰브론(>) 에는 핸들러가 없습니다 — 개통 신청서 화면이 이 저장소에 없고, ' +
          '셰브론의 상세 동작은 PRD 가 "추후 정의" 로 남겨 두었습니다. 근거는 `Benefit.design.md` 참조.',
      },
    },
  },
} satisfies Meta<typeof Benefit>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 27683:3204 의 최초 상태입니다 — 5G 탭, 라디오 미선택, `선택 완료` 비활성. */
export const Default: Story = {};
