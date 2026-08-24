import type { Meta, StoryObj } from '@storybook/react';
import { TabItem } from './TabItem';
import type { TabItemState } from './TabItem';

/** Figma 컴포넌트 세트 `Tab/ Item` (node 20:7623). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=20-7623&t=IKuf4oO7n3Ltvjww-11';

const meta = {
  title: 'Components/TabItem',
  component: TabItem,
  tags: ['autodocs'],
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
          'Figma `Tab/ Item` (node 20:7623). 변형 4개는 전 조합이 아닙니다 — ' +
          '`isSelected=false` 는 `state=default` 와만 짝지어지고, ' +
          '**선택되지 않은 탭의 pressed · focused 표현은 Figma 에 없습니다.** ' +
          '또 `state=focused, isSelected=true` 변형(20:7633)에는 선택 표시선이 없습니다 — ' +
          '포커스가 가면 밑줄이 사라지는 것이 Figma 원본의 동작입니다. ' +
          '`state` 를 넘기지 않으면 `:active` · `:focus-visible` 로 자동 동작합니다.',
      },
    },
  },
  // `role="tab"` 은 `role="tablist"` 조상을 요구한다 (WAI-ARIA 소유 규칙).
  // 실제 사용처에서는 `Tab` 이 그 자리를 채우므로, 낱개로 세우는 스토리에서만
  // 같은 껍데기를 덧대 a11y 검사가 실제 조합과 같은 조건에서 돌게 한다.
  decorators: [
    (Story) => (
      <div role="tablist" className="flex items-center">
        <Story />
      </div>
    ),
  ],
  args: {
    isSelected: false,
    children: '레이블',
  },
  argTypes: {
    isSelected: { control: 'boolean', description: 'Figma `isSelected` 축' },
    state: {
      control: 'inline-radio',
      options: [undefined, 'default', 'pressed', 'focused'],
      description: '상태 강제 지정 (Storybook 캡처용). 미지정이 기본 경로입니다',
    },
  },
} satisfies Meta<typeof TabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `state=default, isSelected=false` (node 20:7637). */
export const Default: Story = {};

/** Figma `state=default, isSelected=true` (node 20:7624). 선택 표시선이 붙습니다. */
export const Selected: Story = {
  args: { isSelected: true },
};

/** Figma `state=pressed, isSelected=true` (node 20:7628). */
export const Pressed: Story = {
  args: { isSelected: true, state: 'pressed' },
};

/**
 * Figma `state=focused, isSelected=true` (node 20:7633).
 * 이 변형에는 선택 표시선이 **없습니다**. Figma 원본 그대로입니다.
 */
export const Focused: Story = {
  args: { isSelected: true, state: 'focused' },
};

/**
 * 상태를 강제하지 않은 기본 경로입니다. 선택된 탭을 누르고 있으면 눌림 오버레이가,
 * Tab 키로 포커스하면 포커스 링이 나타납니다 (그리고 밑줄이 사라집니다).
 * 선택되지 않은 탭은 Figma 에 대응 변형이 없어 브라우저 기본 포커스 링을 씁니다.
 */
export const Interactive: Story = {
  render: (args) => (
    <div className="bg-bg-primary flex items-center gap-16 p-24">
      <TabItem {...args} isSelected>
        레이블
      </TabItem>
      <TabItem {...args} isSelected={false}>
        레이블
      </TabItem>
    </div>
  ),
};

const COLUMNS: readonly { label: string; isSelected: boolean; state: TabItemState }[] = [
  { label: 'default / false', isSelected: false, state: 'default' },
  { label: 'default / true', isSelected: true, state: 'default' },
  { label: 'pressed / true', isSelected: true, state: 'pressed' },
  { label: 'focused / true', isSelected: true, state: 'focused' },
];

/**
 * Figma 프레임 20:7623 과 같은 4개 배치입니다.
 * `state` 를 강제 지정해 변형 4개를 한 화면에 정적으로 세웁니다.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="bg-bg-primary inline-flex flex-col gap-24 p-40">
      <div className="flex items-end gap-32">
        {COLUMNS.map((column) => (
          <div key={column.label} className="flex flex-col items-center gap-12">
            <p className="font-body-small text-text-secondary whitespace-nowrap">
              {column.label}
            </p>
            <TabItem isSelected={column.isSelected} state={column.state}>
              레이블
            </TabItem>
          </div>
        ))}
      </div>
    </div>
  ),
};
