import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './Tab';
import type { TabProps } from './Tab';

/** Figma 컴포넌트 `Tab` (node 20:7647). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=20-7647&t=IKuf4oO7n3Ltvjww-11';

/**
 * `Tab` 은 제어 컴포넌트다 — `selectedIndex` 를 호출부가 쥔다.
 * 스토리에서 클릭이 실제로 동작하려면 그 "호출부" 를 스토리가 맡아야 하므로,
 * 모든 스토리가 이 래퍼를 거친다. `Tab.tsx` 는 이 배선을 위해 바뀌지 않았다.
 *
 * · 초기값은 `selectedIndex` arg 에서 온다
 * · Controls 패널에서 그 arg 를 바꾸면 그 값으로 되돌린다 (아래 effect).
 *   이것이 없으면 컨트롤을 움직여도 화면이 그대로여서, 지금 고치는 것과 같은
 *   "눌러도 아무 일이 없다" 가 컨트롤 쪽에서 되풀이된다.
 * · `onSelect` arg(Actions 로거)도 그대로 호출한다 — 배선이 로그를 삼키지 않는다
 */
function ControlledTab({ selectedIndex = 0, onSelect, ...props }: TabProps) {
  const [current, setCurrent] = useState(selectedIndex);

  useEffect(() => {
    setCurrent(selectedIndex);
  }, [selectedIndex]);

  return (
    <Tab
      {...props}
      selectedIndex={current}
      onSelect={(index) => {
        setCurrent(index);
        onSelect?.(index);
      }}
    />
  );
}

const meta = {
  title: 'Components/Tab',
  component: Tab,
  tags: ['autodocs'],
  // 모든 스토리가 선택 상태를 쥔다. 아래 ControlledTab 주석 참조.
  render: (args) => <ControlledTab {...args} />,
  parameters: {
    layout: 'padded',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `Tab` (node 20:7647). 폭은 모바일 프레임 폭에 고정됩니다 (`Header` 와 같은 판정). ' +
          '아이템은 하위 컴포넌트 `TabItem` 이고, 등폭 분배는 이 컨테이너가 겁니다 — ' +
          'Figma 도 `Tab/ Item` 세트가 아니라 여기 놓인 인스턴스 3개에 grow 를 재정의합니다.\n\n' +
          '**이 컴포넌트는 선택 상태를 갖지 않습니다.** `selectedIndex` 를 호출부가 쥐고 ' +
          '`onSelect` 로 옮깁니다. 아래 스토리들은 그 호출부 역할을 스토리가 맡아 배선한 것이라 ' +
          '탭을 눌러 선택이 옮겨가는 것을 그대로 확인할 수 있습니다. ' +
          '`selectedIndex` 컨트롤을 바꾸면 그 값으로 되돌아갑니다.',
      },
    },
  },
  args: {
    items: ['레이블', '레이블', '레이블'],
    selectedIndex: 0,
  },
  argTypes: {
    items: { control: 'object', description: '탭 라벨들. Figma 인스턴스의 `text` 재정의' },
    selectedIndex: {
      control: 'number',
      description: '선택된 탭 인덱스. 스토리에서는 **초기값**으로 쓰이고, 클릭하면 옮겨갑니다',
    },
    onSelect: { action: 'select', description: '탭을 눌렀을 때. Actions 탭에서 발화를 볼 수 있습니다' },
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figma node 20:7647 그대로 — 라벨 3개, 첫 번째가 선택됨.
 * 다른 탭을 누르면 선택이 옮겨가고, 누르고 있는 동안 눌림 오버레이가,
 * Tab 키로 포커스하면 포커스 링이 나타납니다 (그리고 선택 표시선이 사라집니다 — Figma 원본 동작).
 */
export const Default: Story = {};

/** 초기 선택 위치를 옮긴 경우입니다. Figma 에는 이 배치가 없고 `isSelected` 축의 적용입니다. */
export const SecondSelected: Story = {
  args: { selectedIndex: 1 },
};

/** 라벨 수는 Figma 의 3개에 묶여 있지 않습니다. 등폭 분배가 그대로 유지됩니다. */
export const FourItems: Story = {
  args: { items: ['홈', '요금제', '혜택', '마이'], selectedIndex: 0 },
};
