import type { Meta, StoryObj } from '@storybook/react';
import { TextSetTitle, type TextSetTitleSize } from './TextSetTitle';

const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-4265&t=IKuf4oO7n3Ltvjww-11';

/** Figma 세트 안의 샘플 텍스트를 그대로 쓴다. */
const TITLE = '타이틀 영역입니다.';
const DESCRIPTION = '보조 텍스트영역입니다.';

const SIZES: TextSetTitleSize[] = ['xl', 'lg', 'md', 'sm', 'xs'];

const meta = {
  title: 'Components/TextSetTitle',
  component: TextSetTitle,
  // preview.ts 에서 전역 autodocs를 켜두었지만, 명시해두면 의도가 분명해집니다.
  tags: ['autodocs'],
  parameters: {
    // 폭을 부모에서 받으므로 centered 가 아니라 padded 로 둡니다.
    layout: 'padded',
    // @storybook/addon-designs — Figma 프레임 URL을 넣으면 Design 탭에 렌더링됩니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: SIZES,
      description: 'Figma variant 축. 세트에 존재하는 5개뿐입니다.',
    },
  },
  args: {
    title: TITLE,
    description: DESCRIPTION,
  },
} satisfies Meta<typeof TextSetTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 기본 variant `size=xl` (27683:4427). */
export const Default: Story = {};

/** `size=xl` — 제목 `font/display/medium-strong`, 보조 `font/body/large`. */
export const Xl: Story = { args: { size: 'xl' } };

/** `size=lg` (27683:4426) — 제목 `font/title/large-strong`, 보조 `font/body/large`. */
export const Lg: Story = { args: { size: 'lg' } };

/** `size=md` (27683:4430) — 제목 `font/title/medium-strong`, 보조 `font/body/medium`. */
export const Md: Story = { args: { size: 'md' } };

/** `size=sm` (27683:4428) — 제목 `font/title/small-strong`, 보조 `font/body/small`. */
export const Sm: Story = { args: { size: 'sm' } };

/** `size=xs` (27683:4429) — 제목 `font/title/xSmall-strong`, 보조 `font/body/small`. */
export const Xs: Story = { args: { size: 'xs' } };

/**
 * Figma component property `description=false` 에 대응합니다.
 * `description` 을 넘기지 않으면 보조 텍스트를 렌더링하지 않습니다.
 */
export const WithoutDescription: Story = {
  args: { description: undefined },
};

/** 다섯 variant 를 Figma 세트와 같은 순서로 나란히 둡니다. 스크린샷 대조용입니다. */
export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-40">
      {SIZES.map((size) => (
        <TextSetTitle key={size} {...args} size={size} />
      ))}
    </div>
  ),
};
