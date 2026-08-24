import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import type { ButtonState, ButtonVariant } from './Button';

/** Figma 컴포넌트 세트 `Button` (node 1:4004). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=1-4004&t=IKuf4oO7n3Ltvjww-11';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    // focused 링이 경계 밖으로 나가므로 여백이 있는 레이아웃을 씁니다.
    layout: 'padded',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `Button` (node 1:4004). 변형 12개는 전 조합이 아니라 **스타일 3종 × 상태 4종**입니다 — ' +
          '`ghost-primary` 는 존재하지 않고, `isDisabled=true` 는 `state=default` 와만 짝지어집니다. ' +
          '`state` 를 넘기지 않으면 `:active` · `:focus-visible` 로 자동 동작합니다. ' +
          '`state` prop 은 아래 그리드처럼 정적으로 캡처하기 위한 용도입니다.',
      },
    },
  },
  args: {
    variant: 'filled-primary',
    isDisabled: false,
    children: '레이블',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['filled-primary', 'filled-secondary', 'ghost-secondary'],
      description: 'Figma `variant`×`hierarchy` 조합',
    },
    isDisabled: { control: 'boolean', description: 'Figma `isDisabled` 축 ↔ HTML `disabled`' },
    state: {
      control: 'inline-radio',
      options: [undefined, 'default', 'pressed', 'focused'],
      description: '상태 강제 지정 (Storybook 캡처용). 미지정이 기본 경로입니다',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figma `variant=filled, hierarchy=primary, state=default, isDisabled=false` (node 1:4061).
 * `state` 를 넘기지 않았으므로 클릭·키보드 포커스로 실제 상태 전이를 확인할 수 있습니다.
 */
export const Default: Story = {};

/** Figma node 1:4039. */
export const FilledSecondary: Story = {
  args: { variant: 'filled-secondary' },
};

/** Figma node 1:4066. ghost 는 세 상태 모두 fill 이 없습니다. */
export const GhostSecondary: Story = {
  args: { variant: 'ghost-secondary' },
};

/** Figma node 1:4044. `isDisabled` 는 HTML `disabled` 로 내려가 실제로 비활성화됩니다. */
export const Disabled: Story = {
  args: { isDisabled: true },
};

/**
 * 상태를 강제하지 않은 기본 경로입니다. Tab 으로 포커스하면 경계 밖 링이,
 * 누르고 있으면 눌림 오버레이가 나타납니다.
 */
export const Interactive: Story = {
  render: (args) => (
    <div className="flex items-center gap-16 bg-bg-primary p-24">
      <Button {...args} variant="filled-primary">
        레이블
      </Button>
      <Button {...args} variant="filled-secondary">
        레이블
      </Button>
      <Button {...args} variant="ghost-secondary">
        레이블
      </Button>
    </div>
  ),
};

const VARIANTS: readonly { key: ButtonVariant; label: string }[] = [
  { key: 'filled-primary', label: 'filled / primary' },
  { key: 'filled-secondary', label: 'filled / secondary' },
  { key: 'ghost-secondary', label: 'ghost / secondary' },
];

const COLUMNS: readonly { label: string; state?: ButtonState; isDisabled?: boolean }[] = [
  { label: 'default', state: 'default' },
  { label: 'pressed', state: 'pressed' },
  { label: 'focused', state: 'focused' },
  { label: 'disabled', state: 'default', isDisabled: true },
];

/**
 * Figma 프레임 1:4004 와 같은 3행 × 4열 배치입니다.
 * 행은 스타일 3종, 열은 default / pressed / focused / disabled 입니다.
 * `state` 를 강제 지정해 12개를 한 화면에 정적으로 세웁니다.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="inline-flex flex-col gap-24 bg-bg-tertiary p-40">
      <div className="flex gap-16">
        <div className="w-100 shrink-0" />
        {COLUMNS.map((column) => (
          <p
            key={column.label}
            className="w-100 shrink-0 font-body-small-700 text-text-secondary"
          >
            {column.label}
          </p>
        ))}
      </div>
      {VARIANTS.map((variant) => (
        <div key={variant.key} className="flex items-center gap-16">
          <p className="w-100 shrink-0 font-body-small text-text-secondary">{variant.label}</p>
          {COLUMNS.map((column) => (
            <div key={column.label} className="flex w-100 shrink-0 justify-start">
              <Button
                variant={variant.key}
                state={column.state}
                isDisabled={column.isDisabled ?? false}
              >
                레이블
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
