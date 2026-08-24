import type { Meta, StoryObj } from '@storybook/react';
import { TextFieldText } from './TextFieldText';

/** Figma 컴포넌트 세트 `TextField/Text` (node 13:2188). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-2188';

const meta = {
  title: 'Components/TextFieldText',
  component: TextFieldText,
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
          'Figma `TextField/Text` (node 13:2188). 라벨 · 입력 줄 · 하단 보조 문구를 세로로 조립한 입력 필드입니다. ' +
          '입력 줄은 `TextFieldSlotText`, 하단 문구는 `TextFieldTextSet` 을 그대로 재사용합니다.\n\n' +
          '**변형은 3개뿐입니다.** 축 이름은 3개(`isTyping`·`isDisabled`·`isError`)지만 ' +
          'Figma 에 있는 조합은 `기본` · `isDisabled` · `isDisabled+isError` 뿐이라 ' +
          '타입이 나머지를 막습니다. 특히 **활성 상태의 에러(`isError` 단독)가 Figma 에 없고**, ' +
          '`isTyping` 은 세 variant 이름에 축으로만 들어 있고 값이 `false` 하나뿐이라 prop 으로 열지 않았습니다.\n\n' +
          '**아직 `<input>` 이 아닙니다.** 문구는 `<p>` 로 그려집니다. ' +
          '`<label>`·`aria-describedby` 를 달지 않은 근거는 `TextFieldText.design.md` 의 "a11y 결정" 절에 있습니다.',
      },
    },
  },
  args: {
    label: '레이블',
    children: '플레이스홀더',
    supporting: '도움말 메세지',
  },
  argTypes: {
    label: {
      control: 'text',
      description: '상단 라벨. 넘기지 않으면 Figma `hasLabel=false` 와 같이 단이 사라집니다',
    },
    children: { control: 'text', description: '입력 자리 문구' },
    supporting: {
      control: 'text',
      description: '하단 보조 문구. 넘기지 않으면 Figma `hasSupporting=false` 와 같이 단이 사라집니다',
    },
    isDisabled: { control: 'boolean', description: 'Figma `isDisabled` 축' },
    isError: {
      control: 'boolean',
      description: 'Figma `isError` 축. `isDisabled` 가 `true` 일 때만 켤 수 있습니다',
    },
  },
} satisfies Meta<typeof TextFieldText>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figma `isTyping=false, isDisabled=false, isError=false` (node 13:2189).
 * 슬롯은 `state="default"`, 문구는 `text/secondary` 입니다.
 */
export const Default: Story = {};

/**
 * Figma `isTyping=false, isDisabled=true, isError=false` (node 13:2199).
 *
 * 슬롯 variant 는 여전히 `default` 이고, 문구 색만 `text/disabled-onLight` 로
 * 오버라이드돼 있습니다. **라벨은 흐려지지 않습니다** — 세 variant 모두 `text/primary` 입니다.
 */
export const Disabled: Story = {
  args: { isDisabled: true },
};

/**
 * Figma `isTyping=false, isDisabled=true, isError=true` (node 13:2204).
 *
 * Figma 에서 에러는 **비활성과만 짝지어져 있습니다.** 이 조합이 유일한 에러 상태입니다.
 * 슬롯이 `state="done"`(문구 `text/primary`)으로 바뀌고, `border/negative` 테두리가 얹히며,
 * 하단 문구가 `text/negative` 가 됩니다.
 */
export const DisabledError: Story = {
  args: { isDisabled: true, isError: true },
};

/** Figma component property `hasLabel=false`. 라벨 단이 사라집니다. */
export const WithoutLabel: Story = {
  args: { label: undefined },
};

/** Figma component property `hasSupporting=false`. 하단 보조 문구 단이 사라집니다. */
export const WithoutSupporting: Story = {
  args: { supporting: undefined },
};

/** Figma 프레임 13:2188 이 늘어놓은 순서 그대로 세 variant 를 나란히 둡니다. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="flex flex-col gap-40">
      <TextFieldText {...args} />
      <TextFieldText {...args} isDisabled />
      <TextFieldText {...args} isDisabled isError />
    </div>
  ),
};
