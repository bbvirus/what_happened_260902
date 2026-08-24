import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../Icon/Icon';
import { Header } from './Header';

/** Figma 컴포넌트 `Header` (node 27657:3123). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27657-3123&t=IKuf4oO7n3Ltvjww-11';

const meta = {
  title: 'Components/Header',
  component: Header,
  // preview.ts 에서 전역 autodocs를 켜두었지만, 명시해두면 의도가 분명해집니다.
  tags: ['autodocs'],
  parameters: {
    // 컴포넌트가 폭 402 를 스스로 고정하므로 캔버스 여백 없이 그대로 보여줍니다.
    layout: 'fullscreen',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `Header` (node 27657:3123). 화면 상단 헤더입니다. variant 축은 없습니다 — ' +
          'Figma 설명이 "variant 축이 하나도 남지 않아 컴포넌트 세트를 해제했습니다" 라고 적었습니다. ' +
          '남은 축은 component property 4개(`title` · `hasTitle` · `hasSlotStart` · `hasSlotEnd`)이고 ' +
          '그대로 props 가 되었습니다. `hasSlotEnd` 의 기본값만 꺼짐입니다. ' +
          '우측 슬롯의 **내용물**은 `children` 입니다 — Figma 설명이 "헤더는 우측에 무엇이 들어갈지 ' +
          '모르고, 쓰는 쪽이 채웁니다. 코드의 children과 같은 개념입니다" 라고 직접 적었습니다. ' +
          '슬롯 껍데기는 Figma 그대로 `HeaderSlotLeftEndItems` 입니다. ' +
          '행 높이 44 는 `content`(27657:3127) 한 노드에만 쓰고, 뒤로가기 자리와 슬롯에는 ' +
          '상하 패딩 10 을 씁니다 — 근거는 `Header.design.md` 에 있습니다.',
      },
    },
  },
  args: {
    // Figma component property `title` 의 기본값입니다.
    title: '타이틀',
    hasTitle: true,
    hasSlotStart: true,
    hasSlotEnd: false,
  },
  argTypes: {
    title: { control: 'text', description: 'Figma component property `title`.' },
    hasTitle: { control: 'boolean', description: 'Figma component property `hasTitle`.' },
    hasSlotStart: { control: 'boolean', description: 'Figma component property `hasSlotStart`.' },
    hasSlotEnd: {
      control: 'boolean',
      description: 'Figma component property `hasSlotEnd`. Figma 기본값이 꺼짐입니다.',
    },
    children: {
      control: false,
      description: '우측 슬롯 내용물. `hasSlotEnd` 가 켜졌을 때만 렌더됩니다.',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 기본 상태 — 뒤로가기 + 타이틀, 우측 슬롯은 꺼짐입니다. `get_screenshot`(27657:3123) 과 같은 모습입니다. */
export const Default: Story = {};

/**
 * `hasTitle=false`. Figma 설명이 적은 실제 사용처는 로그인 · 약관동의 화면입니다.
 *
 * 타이틀이 빠져도 헤더 높이 56 이 유지됩니다 — `content`(27657:3127)의 최소높이 44 에
 * 루트 상하 패딩 6 이 더해진 값이고, 그 최소높이를 Figma 가 이 노드에 명시했습니다.
 */
export const NoTitle: Story = {
  args: { hasTitle: false },
};

/** `hasSlotStart=false`. 뒤로가기 아이콘만 빠집니다 — Figma 는 프레임 27657:3125 를 두고 안의 아이콘만 끕니다. */
export const NoSlotStart: Story = {
  args: { hasSlotStart: false },
};

/**
 * `hasSlotEnd=true`. Figma 의 27657:3129 는 `hidden` 이라 이 조합의 렌더가 파일에 그려져
 * 있지 않습니다 — 켜진 모습을 보려고 만든 스토리입니다.
 *
 * 여기 쓴 글리프 3개는 슬롯 동작을 보여주려고 고른 값이며 **Figma 가 지정한 것이 아닙니다.**
 * Figma 의 슬롯에는 점선 플레이스홀더(`Icon/line`, 18:5191)가 들어 있을 뿐입니다.
 */
export const WithSlotEnd: Story = {
  args: {
    hasSlotEnd: true,
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
 * 타이틀이 행 폭을 넘을 때입니다. 말줄임은 제가 더한 것이 아니라 Figma 가 타이틀 노드
 * 27657:3128 에 방출한 것입니다 (`overflow-hidden` · `text-ellipsis` · `whitespace-nowrap`
 * → `truncate`). 폭이 고정된 컴포넌트라 이 경계는 실사용 경로입니다.
 */
export const LongTitle: Story = {
  args: { title: '아주 긴 타이틀이 들어와서 한 줄에 담기지 않는 경우의 헤더 표시' },
};
