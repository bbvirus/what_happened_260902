import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27738-6454&t=IKuf4oO7n3Ltvjww-11';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  // preview.ts 에서 전역 autodocs를 켜두었지만, 명시해두면 의도가 분명해집니다.
  tags: ['autodocs'],
  parameters: {
    // 1 단위 높이의 선이라 centered 로는 보이지 않습니다.
    layout: 'padded',
    // @storybook/addon-designs — Figma 프레임 URL을 넣으면 Design 탭에 렌더링됩니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma node 20:5645 그대로. 폭은 부모를 채웁니다. */
export const Default: Story = {};

/** 리스트 항목 사이에 놓았을 때. Figma 의 `layoutSizingHorizontal: FILL` 을 확인하는 용도입니다. */
export const InList: Story = {
  render: (args) => (
    <ul className="flex flex-col bg-bg-primary">
      {['요금제 변경', '데이터 선물하기', '가입 정보 조회'].map((label, index) => (
        <li key={label}>
          {index > 0 ? <Divider {...args} /> : null}
          <p className="font-body-medium text-text-primary py-16">{label}</p>
        </li>
      ))}
    </ul>
  ),
};
