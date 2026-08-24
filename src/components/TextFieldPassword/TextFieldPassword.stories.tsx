import type { Meta, StoryObj } from '@storybook/react';
import { TextFieldPassword } from './TextFieldPassword';

/** Figma 컴포넌트 세트 `TextField/Password` (node 13:2167). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-2167';

const meta = {
  title: 'Components/TextFieldPassword',
  component: TextFieldPassword,
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
          'Figma `TextField/Password` (node 13:2167). 라벨 · 가려진 입력 줄 · 하단 보조 문구를 세로로 조립한 비밀번호 필드입니다. ' +
          '입력 줄은 `TextFieldSlotPassword`, 하단 문구는 `TextFieldTextSet`, 오른쪽 끝 아이콘은 `Icon` 을 그대로 재사용합니다.\n\n' +
          '**변형은 3개뿐입니다** — `기본` · `isDisabled` · `isDisabled+isError`. ' +
          '`TextField/Text` 와 조합 목록이 같습니다: 활성 상태의 에러가 Figma 에 없고, ' +
          '`isTyping` 은 값이 `false` 하나뿐이라 prop 으로 열지 않았습니다.\n\n' +
          '**오른쪽 끝 아이콘은 Figma 가 지정한 `visibilityOff` 입니다** — 세 variant 모두 같은 글리프, 같은 색(`icon/secondary`)이고 ' +
          '눈을 뜬 짝(`visibility`)이나 누른 상태가 Figma 에 없어 토글 동작을 넣지 않았습니다.\n\n' +
          '**아직 `<input type="password">` 가 아닙니다.** "● ● ● ● ● ●" 는 가림 문자를 그린 텍스트이고 실제 마스킹이 아닙니다.',
      },
    },
  },
  args: {
    label: '레이블',
    children: '● ● ● ● ● ●',
    supporting: '도움말 메세지',
  },
  argTypes: {
    label: {
      control: 'text',
      description: '상단 라벨. 넘기지 않으면 Figma `hasLabel=false` 와 같이 단이 사라집니다',
    },
    children: { control: 'text', description: '입력 자리 문구 (가림 문자를 그린 텍스트)' },
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
} satisfies Meta<typeof TextFieldPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figma `isTyping=false, isDisabled=false, isError=false` (node 13:2168).
 * 슬롯은 `state="default"`, 문구는 `text/secondary` 입니다.
 */
export const Default: Story = {};

/**
 * Figma `isTyping=false, isDisabled=true, isError=false` (node 13:2178).
 *
 * 문구 색만 `text/disabled-onLight` 로 오버라이드됩니다.
 * **라벨과 `visibilityOff` 아이콘은 흐려지지 않습니다** — export SVG 의 fill 이
 * 기본 variant 와 문자 단위로 같음을 확인했습니다.
 */
export const Disabled: Story = {
  args: { isDisabled: true },
};

/**
 * Figma `isTyping=false, isDisabled=true, isError=true` (node 13:2183).
 *
 * Figma 에서 에러는 **비활성과만 짝지어져 있습니다.**
 * 슬롯이 `state="done"` 으로 바뀌고, `border/negative` 테두리가 얹히며,
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

/** Figma 프레임 13:2167 이 늘어놓은 순서 그대로 세 variant 를 나란히 둡니다. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="flex flex-col gap-40">
      <TextFieldPassword {...args} />
      <TextFieldPassword {...args} isDisabled />
      <TextFieldPassword {...args} isDisabled isError />
    </div>
  ),
};
