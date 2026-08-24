import type { Meta, StoryObj } from '@storybook/react';
import { OSBarBottomNavigation } from './OSBarBottomNavigation';

/** Figma 컴포넌트 세트 `OSBar/BottomNavigation` (node 27719:2167). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27719-2167&t=IKuf4oO7n3Ltvjww-11';

const meta = {
  title: 'Components/OSBarBottomNavigation',
  component: OSBarBottomNavigation,
  tags: ['autodocs'],
  parameters: {
    // 컴포넌트가 폭 402 를 스스로 고정하므로 캔버스 여백 없이 그대로 보여줍니다.
    layout: 'fullscreen',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `OSBar/BottomNavigation` (node 27719:2167). 변형 축은 `transparent` · `onFrameHigh` ' +
          '두 boolean 이고 Figma 에 존재하는 조합은 3개입니다. ' +
          '없는 조합(`transparent=true, onFrameHigh=true`)은 **배경 없음**입니다 — ' +
          '`transparent` 가 배경을 제거하고 나면 `onFrameHigh` 가 바꿀 대상이 남지 않기 때문입니다.',
      },
    },
  },
  args: {
    transparent: false,
    onFrameHigh: false,
  },
  argTypes: {
    transparent: {
      control: 'boolean',
      description: 'Figma variant 축. true 면 배경을 그리지 않습니다.',
    },
    onFrameHigh: {
      control: 'boolean',
      description: 'Figma variant 축. 배경을 `bg/secondary` → `bg/tertiary` 로 바꿉니다.',
    },
  },
} satisfies Meta<typeof OSBarBottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma node 27719:2194 — `transparent=false, onFrameHigh=false`. */
export const Default: Story = {};

/** Figma node 27719:2196 — `transparent=false, onFrameHigh=true`. */
export const OnFrameHigh: Story = {
  args: { onFrameHigh: true },
};

/** Figma node 27719:2198 — `transparent=true`. 배경이 비치는 것을 보려고 색 있는 면 위에 둡니다. */
export const Transparent: Story = {
  args: { transparent: true },
  render: (args) => (
    <div className="bg-bg-brand">
      <OSBarBottomNavigation {...args} />
    </div>
  ),
};
