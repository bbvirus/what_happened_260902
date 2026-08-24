import type { Meta, StoryObj } from '@storybook/react';
import { TextFieldSlotEndItems } from './TextFieldSlotEndItems';
import { Icon } from '../Icon/Icon';

/** Figma 컴포넌트 세트 `TextFieldSlot/End/Items` (node 13:2209). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-2209';

const meta = {
  title: 'Components/TextFieldSlotEndItems',
  component: TextFieldSlotEndItems,
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
          'Figma `TextFieldSlot/End/Items` (node 13:2209). 입력 필드 오른쪽 끝 슬롯입니다. ' +
          '변형은 축 하나(`contentType`) × 2개이고, 두 변형은 **루트 정렬만 다릅니다** — ' +
          '`icon` 은 `items-center` + `gap-16`, `suffix` 는 `items-start` 입니다. ' +
          'Figma 의 아이콘 4칸은 전부 `Icon/line`(18:5191) 인스턴스 스왑 슬롯이라 ' +
          '그릴 글리프가 지정돼 있지 않습니다. 그래서 글리프는 `children` 으로 호출부가 넘깁니다. ' +
          'Figma 가 슬롯에 물려 둔 아이콘 색은 `icon/secondary` 이므로 ' +
          '`<Icon color="secondary" />` 로 넘기는 것이 원본과 같은 조합입니다.',
      },
    },
  },
  args: {
    contentType: 'icon',
  },
  argTypes: {
    contentType: {
      control: 'inline-radio',
      options: ['icon', 'suffix'],
      description: 'Figma `contentType` 축',
    },
    children: { control: false, description: '슬롯 내용 (접미 텍스트 또는 아이콘 노드)' },
  },
} satisfies Meta<typeof TextFieldSlotEndItems>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figma `contentType=icon` (node 13:2217).
 * Figma 기본 상태는 슬롯 4칸 중 마지막 1칸만 보이는 형태입니다(앞 3칸 hidden).
 */
export const IconSingle: Story = {
  args: {
    contentType: 'icon',
    children: <Icon name="visibility" color="secondary" />,
  },
};

/**
 * 아이콘 2칸. 칸 사이 간격은 Figma 변수 `spacing/16` 입니다.
 * Figma 는 최대 4칸까지 자리를 두지만, 몇 칸을 쓸지는 호출부가 정합니다.
 */
export const IconMultiple: Story = {
  args: {
    contentType: 'icon',
    children: (
      <>
        <Icon name="visibilityOff" color="secondary" />
        <Icon name="chevronDown-large" color="secondary" />
      </>
    ),
  },
};

/** Figma `contentType=suffix` (node 13:2212). Figma 기본 문구는 "원" 입니다. */
export const Suffix: Story = {
  args: {
    contentType: 'suffix',
    children: '원',
  },
};

/** Figma 프레임 13:2209 와 같은 2개 배치입니다. */
export const AllVariants: Story = {
  render: () => (
    <div className="bg-bg-primary inline-flex flex-col gap-24 p-40">
      <div className="flex flex-col gap-12">
        <p className="font-body-small text-text-secondary whitespace-nowrap">contentType=icon</p>
        <TextFieldSlotEndItems contentType="icon">
          <Icon name="visibility" color="secondary" />
        </TextFieldSlotEndItems>
      </div>
      <div className="flex flex-col gap-12">
        <p className="font-body-small text-text-secondary whitespace-nowrap">contentType=suffix</p>
        <TextFieldSlotEndItems contentType="suffix">원</TextFieldSlotEndItems>
      </div>
    </div>
  ),
};
