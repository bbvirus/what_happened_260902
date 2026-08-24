import type { Meta, StoryObj } from '@storybook/react';
import { Icon, ICON_NAMES, type IconColor } from './Icon';

const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-6168&t=IKuf4oO7n3Ltvjww-11';

/** color prop 이 받는 값. Icon.tsx 의 IconColor 와 같은 순서다. */
const COLORS: IconColor[] = [
  'primary',
  'secondary',
  'tertiary',
  'inverse',
  'brand',
  'negative',
  'disabled-on-light',
  'disabled-on-dark',
];

/** 어두운 배경 위에서 봐야 의미가 있는 값. */
const ON_DARK: IconColor[] = ['inverse', 'disabled-on-dark'];

const meta = {
  title: 'Components/Icon',
  component: Icon,
  // preview.ts 에서 전역 autodocs를 켜두었지만, 명시해두면 의도가 분명해집니다.
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — Figma 프레임 URL을 넣으면 Design 탭에 렌더링됩니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
  },
  args: {
    name: 'chevronRight-small',
    color: 'primary',
  },
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    color: { control: 'select', options: COLORS },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Figma `Icon` 섹션(node 27683:6168)의 심볼 12개 전부. */
export const AllIcons: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <ul className="grid grid-cols-4 gap-24">
      {ICON_NAMES.map((name) => (
        <li key={name} className="flex flex-col items-center gap-8 text-center">
          <Icon {...args} name={name} />
          <span className="font-body-small text-text-secondary">{name}</span>
        </li>
      ))}
    </ul>
  ),
};

/** color prop → `--color-icon-*` semantic 토큰. inverse·disabled-on-dark 는 어두운 배경에서 본다. */
export const Colors: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex flex-col gap-24">
      {[false, true].map((onDark) => (
        <ul
          key={String(onDark)}
          className={[
            'grid grid-cols-3 gap-24 rounded-8 p-24',
            onDark ? 'bg-bg-inverse' : 'bg-bg-primary',
          ].join(' ')}
        >
          {COLORS.filter((c) => ON_DARK.includes(c) === onDark).map((color) => (
            <li key={color} className="flex flex-col items-center gap-8 text-center">
              <Icon {...args} color={color} />
              <span
                className={[
                  'font-body-small',
                  onDark ? 'text-text-inverse' : 'text-text-secondary',
                ].join(' ')}
              >
                {color}
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  ),
};
