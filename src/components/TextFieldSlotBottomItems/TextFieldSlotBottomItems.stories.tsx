import type { Meta, StoryObj } from '@storybook/react';
import { TextFieldSlotBottomItems } from './TextFieldSlotBottomItems';

/** Figma 컴포넌트 세트 `TextFieldSlot/Bottom/Items` (node 13:2222). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-2222';

const meta = {
  title: 'Components/TextFieldSlotBottomItems',
  component: TextFieldSlotBottomItems,
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
          'Figma `TextFieldSlot/Bottom/Items` (node 13:2222). 입력 필드 아래 슬롯입니다. ' +
          '변형은 축 하나(`contentType`) × 2개입니다.\n\n' +
          '- `text` (13:2223) — 자식이 `TextFieldTextSet` 인스턴스(27738:6501, 주 컴포넌트 35:14458) ' +
          '하나뿐이라 이 저장소의 `TextFieldTextSet` 을 그대로 재사용합니다. ' +
          'Figma 가 물려 둔 값이 기본 variant 그대로여서 `status` · `hasIconStart` 를 넘기지 않습니다.\n' +
          '- `checkbox` (13:2225) — 자식이 `[Checkbox]` 인스턴스(13:2226, 주 컴포넌트 13:3929)입니다. ' +
          '`ListCheckbox`(362×72 리스트 행)도 `ListSlotCheckbox`(24×24)도 아닙니다. ' +
          '안쪽 박스가 `ListSlot/Checkbox` 의 **`small`(20×20) variant** 인데 이 저장소가 옮긴 세트 ' +
          '20:5754 에는 `size` 축이 없어 재사용할 자리가 없었습니다. 판정 근거는 `.design.md` 참조.\n\n' +
          '`checkbox` 행의 상하 패딩 10 은 `/sync-tokens` 로 추가된 ' +
          '`--spacing-textfield-bottomitems-checkbox-inset-y: 0.625rem` 을 씁니다. ' +
          'raw 값 없이 `py-textfield-bottomitems-checkbox-inset-y` 로 그리고, ' +
          '행 높이는 10 + 20 + 10 = 40 으로 Figma 와 일치합니다.',
      },
    },
  },
  args: {
    contentType: 'text',
    children: '도움말 메세지',
  },
  argTypes: {
    contentType: {
      control: 'inline-radio',
      options: ['text', 'checkbox'],
      description: 'Figma `contentType` 축',
    },
    children: {
      control: 'text',
      description: '슬롯 문구 (보조 문구 또는 체크박스 라벨)',
    },
  },
} satisfies Meta<typeof TextFieldSlotBottomItems>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figma `contentType=text` (node 13:2223).
 * Figma 기본 문구는 "도움말 메세지" 이고 상태는 `TextFieldTextSet` 의 기본 variant 입니다.
 */
export const Text: Story = {
  args: {
    contentType: 'text',
    children: '도움말 메세지',
  },
};

/**
 * Figma `contentType=checkbox` (node 13:2225). Figma 기본 라벨은 "레이블" 입니다.
 * Figma 에 선택·비활성 variant 가 없어 비선택 상태 하나만 그립니다.
 */
export const Checkbox: Story = {
  args: {
    contentType: 'checkbox',
    children: '레이블',
  },
};

/** Figma 프레임 13:2222 와 같은 2개 배치입니다. */
export const AllVariants: Story = {
  render: () => (
    <div className="bg-bg-primary flex flex-col gap-24 p-40">
      <div className="flex flex-col gap-12">
        <p className="font-body-small text-text-secondary whitespace-nowrap">contentType=text</p>
        <TextFieldSlotBottomItems contentType="text">도움말 메세지</TextFieldSlotBottomItems>
      </div>
      <div className="flex flex-col gap-12">
        <p className="font-body-small text-text-secondary whitespace-nowrap">
          contentType=checkbox
        </p>
        <TextFieldSlotBottomItems contentType="checkbox">레이블</TextFieldSlotBottomItems>
      </div>
    </div>
  ),
};
