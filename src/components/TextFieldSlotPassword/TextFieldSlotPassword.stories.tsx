import type { Meta, StoryObj } from '@storybook/react';
import { TextFieldSlotPassword } from './TextFieldSlotPassword';
import { Icon } from '../Icon/Icon';

/** Figma 컴포넌트 세트 `TextFieldSlot/Password` (node 13:2347). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-2347';

const meta = {
  title: 'Components/TextFieldSlotPassword',
  component: TextFieldSlotPassword,
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
          'Figma `TextFieldSlot/Password` (node 13:2347). 비밀번호 입력 필드의 입력 줄 한 칸입니다. ' +
          '**변형은 4개뿐입니다** — `state`(3) × `isTyping`(2) 의 전조합 6개가 아닙니다. ' +
          'Figma 에 `default+isTyping` 과 `done+isTyping` 이 없어서 타입이 그 두 조합을 막습니다. ' +
          '`TextFieldSlotText` 와 다른 점은 문구 프레임이 hug 라는 것(말줄임표 없음, ' +
          '입력중에는 지우기 버튼이 오른쪽 끝으로 밀림)과 기본 문구가 가려진 글자라는 것 둘뿐입니다. ' +
          '⚠ 가림은 Figma 텍스트 내용이지 실제 `<input type="password">` 마스킹이 아닙니다.',
      },
    },
  },
  args: {
    children: '● ● ● ● ● ●',
    slotEnd: <Icon name="visibilityOff" color="secondary" />,
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['default', 'focused', 'done'],
      description: 'Figma `state` 축',
    },
    isTyping: {
      control: 'boolean',
      description: 'Figma `isTyping` 축. `state="focused"` 일 때만 `true` 가 될 수 있습니다',
    },
    children: { control: 'text', description: '입력 자리 문구 (Figma property `text`)' },
    slotEnd: { control: false, description: '오른쪽 끝 슬롯 내용 (Figma property `hasSlotEnd`)' },
    onClear: { action: 'clear', description: '지우기 버튼 클릭' },
    clearLabel: { control: 'text', description: '지우기 버튼의 접근성 이름' },
  },
} satisfies Meta<typeof TextFieldSlotPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `state=default, isTyping=false` (node 13:2348). 문구는 `text/secondary` 입니다. */
export const Default: Story = {
  args: { state: 'default' },
};

/**
 * Figma `state=focused, isTyping=false` (node 13:2360).
 * 포커스 링(`StateLayer/Focused` 인스턴스)이 붙고 커서가 문구 **앞**에 섭니다.
 */
export const Focused: Story = {
  args: { state: 'focused' },
};

/**
 * Figma `state=focused, isTyping=true` (node 13:2368).
 * 커서가 문구 **뒤**로 가고, 문구가 `text/primary` 로 진해지며,
 * `close-circle-fill` 지우기 버튼이 오른쪽 끝에 나타납니다.
 */
export const FocusedTyping: Story = {
  args: { state: 'focused', isTyping: true },
};

/** Figma `state=done, isTyping=false` (node 13:2354). 포커스 링 없이 문구만 진합니다. */
export const Done: Story = {
  args: { state: 'done' },
};

/** 오른쪽 끝 슬롯을 넘기지 않은 경우. Figma `hasSlotEnd=false` 와 같은 결과입니다. */
export const WithoutSlotEnd: Story = {
  args: { state: 'default', slotEnd: undefined },
};

/** Figma 프레임 13:2347 과 같은 4개 배치입니다. */
export const AllVariants: Story = {
  render: ({ children, slotEnd, clearLabel, onClear }) => {
    // state·isTyping 을 뺀 나머지만 넘긴다. 유니온 타입이 없는 조합을 막으므로
    // args 를 통째로 전개하면 state 를 덮어써도 isTyping 이 boolean 으로 남아 막힌다.
    const shared = { children, slotEnd, clearLabel, onClear };
    return (
    <div className="flex flex-col gap-24 bg-bg-primary p-40">
      <div className="flex flex-col gap-12">
        <p className="font-body-small text-text-secondary">state=default, isTyping=false</p>
        <TextFieldSlotPassword {...shared} state="default" />
      </div>
      <div className="flex flex-col gap-12">
        <p className="font-body-small text-text-secondary">state=focused, isTyping=false</p>
        <TextFieldSlotPassword {...shared} state="focused" />
      </div>
      <div className="flex flex-col gap-12">
        <p className="font-body-small text-text-secondary">state=focused, isTyping=true</p>
        <TextFieldSlotPassword {...shared} state="focused" isTyping />
      </div>
      <div className="flex flex-col gap-12">
        <p className="font-body-small text-text-secondary">state=done, isTyping=false</p>
        <TextFieldSlotPassword {...shared} state="done" />
      </div>
    </div>
    );
  },
};
