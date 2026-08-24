import type { Meta, StoryObj } from '@storybook/react';
import { ListSlotRadio } from './ListSlotRadio';

/** Figma 컴포넌트 세트 `ListSlot/Radio` (node 20:5729). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=20-5729';

const meta = {
  title: 'Components/ListSlotRadio',
  component: ListSlotRadio,
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
          'Figma `ListSlot/Radio` (node 20:5729). 단일 선택 상태의 **시각 표현만** 담당합니다 — ' +
          '`role="radio"` · `aria-checked` · 키보드 조작은 호스트가 담당합니다. ' +
          '변형은 4개이고 `size` 축은 Figma 에 `medium` 값 하나뿐이라 prop 으로 만들지 않았습니다. ' +
          '**`isDisabled` 는 Figma 에서 별도의 dim 처리를 갖지 않습니다** — ' +
          '`isChecked=true` 인 두 변형은 서로 픽셀이 같고, `isChecked=false` 에서는 ' +
          '비활성이 활성보다 오히려 어둡습니다. Figma 원본 그대로이며 근거는 design.md 에 있습니다. ' +
          '선택 표시는 점을 얹은 링이 아니라 가운데가 비어 있는 두꺼운 도넛입니다.',
      },
    },
  },
  args: {
    isChecked: false,
    isDisabled: false,
  },
  argTypes: {
    isChecked: { control: 'boolean', description: 'Figma `isChecked` 축' },
    isDisabled: { control: 'boolean', description: 'Figma `isDisabled` 축' },
  },
} satisfies Meta<typeof ListSlotRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `size=medium, isChecked=false, isDisabled=false` (node 20:5730). */
export const Default: Story = {};

/** Figma `size=medium, isChecked=true, isDisabled=false` (node 20:5742). */
export const Checked: Story = {
  args: { isChecked: true },
};

/**
 * Figma `size=medium, isChecked=false, isDisabled=true` (node 20:5733).
 * 활성 상태(`Default`)보다 **어둡습니다.** Figma 원본 그대로입니다.
 */
export const Disabled: Story = {
  args: { isDisabled: true },
};

/**
 * Figma `size=medium, isChecked=true, isDisabled=true` (node 20:5745).
 * `Checked` 와 **시각적으로 같습니다.** Figma 원본 그대로입니다.
 */
export const CheckedDisabled: Story = {
  args: { isChecked: true, isDisabled: true },
};

const VARIANTS: readonly { label: string; isChecked: boolean; isDisabled: boolean }[] = [
  { label: 'false / false', isChecked: false, isDisabled: false },
  { label: 'true / false', isChecked: true, isDisabled: false },
  { label: 'false / true', isChecked: false, isDisabled: true },
  { label: 'true / true', isChecked: true, isDisabled: true },
];

/**
 * Figma 프레임 20:5729 과 같은 4개 배치입니다.
 * 라벨은 `isChecked / isDisabled` 순서입니다.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="bg-bg-primary inline-flex flex-col gap-24 p-40">
      <div className="flex items-end gap-32">
        {VARIANTS.map((variant) => (
          <div key={variant.label} className="flex flex-col items-center gap-12">
            <p className="font-body-small text-text-secondary whitespace-nowrap">
              {variant.label}
            </p>
            <ListSlotRadio isChecked={variant.isChecked} isDisabled={variant.isDisabled} />
          </div>
        ))}
      </div>
    </div>
  ),
};
