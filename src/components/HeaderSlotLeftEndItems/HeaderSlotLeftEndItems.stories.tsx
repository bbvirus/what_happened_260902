import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../Icon/Icon';
import { TextButton } from '../TextButton/TextButton';
import { HeaderSlotLeftEndItems } from './HeaderSlotLeftEndItems';

/** Figma 컴포넌트 세트 `HeaderSlot/LeftEnd/Items` (node 27657:3096). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27657-3096&t=IKuf4oO7n3Ltvjww-11';

const meta = {
  title: 'Components/HeaderSlotLeftEndItems',
  component: HeaderSlotLeftEndItems,
  // preview.ts 에서 전역 autodocs를 켜두었지만, 명시해두면 의도가 분명해집니다.
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `HeaderSlot/LeftEnd/Items` (node 27657:3096). Header 우측에 놓이는 아이템 묶음입니다. ' +
          'variant 축은 `contentType` 하나이고 두 값은 **교차축 정렬만** 다릅니다 — ' +
          '`iconGroup` 은 `items-start`, `buttonGroup` 은 `items-center justify-end` 입니다. ' +
          '자식 높이가 서로 같으면 두 값은 시각적으로 구분되지 않지만, Figma 에 존재하는 축이므로 합치지 않았습니다. ' +
          '높이(iconGroup 44 · buttonGroup 39)는 선언값이 아니라 상하 패딩 10 의 파생값이라 ' +
          '높이 토큰을 쓰지 않습니다 — 자세한 근거는 `HeaderSlotLeftEndItems.design.md` 에 있습니다. ' +
          '내용물은 `children` 입니다. Figma 의 기본 내용물은 글리프가 아니라 점선 플레이스홀더 ' +
          '(`Icon/line`, 18:5191)라서 기본 아이콘을 추측해 넣지 않았습니다.',
      },
    },
  },
  args: {
    contentType: 'iconGroup',
  },
  argTypes: {
    contentType: {
      control: 'inline-radio',
      options: ['iconGroup', 'buttonGroup'],
      description: 'Figma variant 축. 교차축 정렬을 바꿉니다.',
    },
    children: {
      control: false,
      description: '슬롯 내용물. Figma 의 `slotEnd1..3` 인스턴스 스왑 슬롯에 대응합니다.',
    },
  },
} satisfies Meta<typeof HeaderSlotLeftEndItems>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figma node 27657:3097 — `contentType=iconGroup`. 실측 104 × 44 입니다.
 *
 * 여기 쓴 글리프 3개는 슬롯 동작을 보여주려고 고른 값이며 **Figma 가 지정한 것이 아닙니다.**
 * Figma 의 세 슬롯에는 점선 플레이스홀더(`Icon/line`, 18:5191)가 들어 있을 뿐입니다.
 */
export const IconGroup: Story = {
  args: {
    children: (
      <>
        <Icon name="visibility" />
        <Icon name="chevronDown-large" />
        <Icon name="success-circle-line" />
      </>
    ),
  },
};

/**
 * Figma node 27657:3101 — `contentType=buttonGroup`. 실측 100 × 39 입니다.
 *
 * 이 스토리는 **Figma 가 지정한 내용물 그대로**입니다 — 라벨 `레이블` 의 `TextButton`
 * 인스턴스 2개(27657:3102 · 27657:3103)이고, 두 인스턴스의 라벨 색이 Figma 변수
 * `text/primary` 라서 `color="primary"` 를 넘깁니다. 아이콘은 없는 텍스트 전용(42 × 19)입니다.
 * 폭 100 = 42 + 16 + 42 로 gap 이 `spacing/16` 임과 맞물립니다.
 */
export const ButtonGroup: Story = {
  args: {
    contentType: 'buttonGroup',
    children: (
      <>
        <TextButton color="primary">레이블</TextButton>
        <TextButton color="primary">레이블</TextButton>
      </>
    ),
  },
};
