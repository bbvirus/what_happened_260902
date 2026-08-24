import type { Meta, StoryObj } from '@storybook/react';
import { TextFieldTextSet } from './TextFieldTextSet';

/** Figma 컴포넌트 세트 `TextFieldTextSet` (node 35:14458). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=35-14458';

/** Figma 텍스트 노드의 기본 내용. */
const SAMPLE = '도움말 메세지';

const meta = {
  title: 'Components/TextFieldTextSet',
  component: TextFieldTextSet,
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
          'Figma `TextFieldTextSet` (node 35:14458). 입력 필드 하단의 보조 텍스트 묶음입니다. ' +
          '**variant 는 6개입니다** — `status` 4값 × `isDisabled` 2값의 8개가 아닙니다. ' +
          'Figma 에 `error`·`success` 의 disabled 짝이 없어서, 없는 조합은 타입이 막습니다. ' +
          '`isDisabled=true` 라도 **본문 색은 흐려지지 않습니다** — Figma 가 본문에 ' +
          '`text/primary`(불투명)를 물려 두었고 흐려지는 것은 아이콘뿐입니다. ' +
          '아이콘은 24 뷰박스인 `Icon` 컴포넌트를 쓰지 않고 Figma 의 16 뷰박스 export 를 ' +
          '그대로 그립니다 — 두 기하의 여백 비율이 다르기 때문입니다(design.md 참조).',
      },
    },
  },
  args: {
    status: 'default',
    isDisabled: false,
    hasIconStart: true,
    children: SAMPLE,
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['default', 'error', 'success', 'informative'],
      description: 'Figma `status` 축',
    },
    isDisabled: {
      control: 'boolean',
      description:
        'Figma `isDisabled` 축. `default` · `informative` 에만 짝이 있습니다 — ' +
        '`error` · `success` 와 조합하면 타입 오류입니다(컨트롤은 막지 못합니다).',
    },
    hasIconStart: { control: 'boolean', description: 'Figma `hasIconStart` 속성' },
    children: { control: 'text', description: '보조 문구' },
  },
} satisfies Meta<typeof TextFieldTextSet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `status=default, isDisabled=false` (node 35:14661). */
export const Default: Story = {};

/** Figma `status=default, isDisabled=true` (node 35:14668). 본문은 흐려지지 않습니다. */
export const DefaultDisabled: Story = {
  args: { status: 'default', isDisabled: true },
};

/** Figma `status=error, isDisabled=false` (node 35:14596). 글리프는 default 와 같고 색만 다릅니다. */
export const Error: Story = {
  args: { status: 'error' },
};

/** Figma `status=success, isDisabled=false` (node 35:14560). */
export const Success: Story = {
  args: { status: 'success' },
};

/** Figma `status=informative, isDisabled=false` (node 35:14517). */
export const Informative: Story = {
  args: { status: 'informative' },
};

/** Figma `status=informative, isDisabled=true` (node 35:14524). 본문은 흐려지지 않습니다. */
export const InformativeDisabled: Story = {
  args: { status: 'informative', isDisabled: true },
};

/** Figma component property `hasIconStart=false`. 아이콘 자리와 gap 이 함께 사라집니다. */
export const WithoutIcon: Story = {
  args: { hasIconStart: false },
};

/** Figma 프레임 35:14458 과 같은 6개 배치입니다. 존재하지 않는 조합은 넣지 않았습니다. */
export const AllVariants: Story = {
  render: () => (
    <div className="bg-bg-primary flex flex-col gap-16 p-40">
      <TextFieldTextSet status="default">{SAMPLE}</TextFieldTextSet>
      <TextFieldTextSet status="default" isDisabled>
        {SAMPLE}
      </TextFieldTextSet>
      <TextFieldTextSet status="error">{SAMPLE}</TextFieldTextSet>
      <TextFieldTextSet status="success">{SAMPLE}</TextFieldTextSet>
      <TextFieldTextSet status="informative">{SAMPLE}</TextFieldTextSet>
      <TextFieldTextSet status="informative" isDisabled>
        {SAMPLE}
      </TextFieldTextSet>
    </div>
  ),
};
