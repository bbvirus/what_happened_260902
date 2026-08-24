import type { Meta, StoryObj } from '@storybook/react';
import { ListSlotCheckbox } from './ListSlotCheckbox';

/** Figma 컴포넌트 세트 `ListSlot/Checkbox` (node 20:5754, 섹션 27683:4431). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=20-5754';

/** Figma 프레임 20:5754 의 진열 순서 그대로다. */
const VARIANTS = [
  { isChecked: false, isDisabled: false, node: '20:5755' },
  { isChecked: true, isDisabled: false, node: '20:5771' },
  { isChecked: false, isDisabled: true, node: '20:5759' },
  { isChecked: true, isDisabled: true, node: '20:5775' },
] as const;

const meta = {
  title: 'Components/ListSlotCheckbox',
  component: ListSlotCheckbox,
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
          'Figma `ListSlot/Checkbox` (node 20:5754). 체크박스의 **시각 표현**입니다 — 체크박스 자체가 아닙니다. ' +
          'Figma 심볼 안에 hit area · 상태 레이어 · 라벨이 하나도 없어 `Icon` 과 같은 성격의 순수 표시 요소로 구현했습니다. ' +
          '시맨틱(`<input type="checkbox">` 또는 `role="checkbox"` + `aria-checked`), `disabled` 속성, 터치 타깃, ' +
          '키보드 조작, 라벨 연결은 전부 **호스트의 책임**입니다. 책임 분리표는 `ListSlotCheckbox.design.md` 에 있습니다.\n\n' +
          '⚠ Figma 원본을 그대로 옮긴 두 지점이 있습니다. (1) 비활성 variant 가 흐려지지 않습니다 — ' +
          'Figma 가 비활성 박스에 `text/primary` 를 바인딩해 두었습니다. (2) `isChecked=true, isDisabled=true` 의 ' +
          '체크 표시가 보이지 않습니다 — 체크와 박스의 fill 이 같은 색입니다. 둘 다 눈대중으로 보정하지 않았습니다.',
      },
    },
  },
  args: {
    isChecked: false,
    isDisabled: false,
  },
  argTypes: {
    isChecked: {
      control: 'boolean',
      description: 'Figma variant 축 `isChecked`',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Figma variant 축 `isDisabled`',
    },
  },
} satisfies Meta<typeof ListSlotCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `isChecked=false, isDisabled=false` (node 20:5755). */
export const Unchecked: Story = {
  args: { isChecked: false, isDisabled: false },
};

/**
 * Figma `isChecked=true, isDisabled=false` (node 20:5771).
 * 체크 표시가 `bg/primary`(흰색)이므로 **흰 배경에서는 보이지 않습니다.**
 * 아래 `AllVariants` 가 회색 배경도 함께 보여줍니다.
 */
export const Checked: Story = {
  args: { isChecked: true, isDisabled: false },
};

/** Figma `isChecked=false, isDisabled=true` (node 20:5759). 활성 상태보다 오히려 진합니다 — Figma 그대로입니다. */
export const UncheckedDisabled: Story = {
  args: { isChecked: false, isDisabled: true },
};

/** Figma `isChecked=true, isDisabled=true` (node 20:5775). 체크 표시가 박스와 같은 색이라 보이지 않습니다 — Figma 그대로입니다. */
export const CheckedDisabled: Story = {
  args: { isChecked: true, isDisabled: true },
};

/**
 * Figma 프레임 20:5754 와 같은 순서로 4개 조합을 나란히 둡니다.
 *
 * 배경을 두 개 보여주는 이유: 선택·활성 variant 의 체크 표시가 `bg/primary`(흰색)이라
 * 흰 배경 위에서는 보이지 않습니다. Figma 진열 프레임도 회색 배경 위에 있습니다.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-40">
      {(
        [
          { bg: 'bg-bg-primary', label: 'bg-bg-primary' },
          { bg: 'bg-bg-tertiary', label: 'bg-bg-tertiary' },
        ] as const
      ).map((surface) => (
        <div key={surface.bg} className="flex flex-col gap-8">
          <p className="font-body-small text-text-secondary">{surface.label}</p>
          <div className={['flex flex-wrap items-start gap-40 p-24', surface.bg].join(' ')}>
            {VARIANTS.map((variant) => (
              <div key={variant.node} className="flex flex-col items-center gap-8">
                <ListSlotCheckbox
                  isChecked={variant.isChecked}
                  isDisabled={variant.isDisabled}
                />
                <p className="font-body-small text-text-secondary">
                  {`isChecked=${String(variant.isChecked)}`}
                </p>
                <p className="font-body-small text-text-secondary">
                  {`isDisabled=${String(variant.isDisabled)}`}
                </p>
                <p className="font-body-small text-text-secondary">{variant.node}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
