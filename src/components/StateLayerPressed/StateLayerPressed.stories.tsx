import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StateLayerPressed } from './StateLayerPressed';
import type { StateLayerPressedProps } from './StateLayerPressed';

/** Figma 컴포넌트 세트 `StateLayer/Pressed` (node 35:12765). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=35-12765&t=IKuf4oO7n3Ltvjww-11';

/**
 * 오버레이를 눈으로 확인하기 위한 호스트 박스입니다.
 * StateLayerPressed 는 `absolute` 라서 호스트가 `relative` 여야 합니다.
 *
 * `boundaryOut=false` 일 때만 `overflow-hidden` 을 겁니다. Figma 원본도
 * boundaryOut 이 켜지면 바깥 프레임의 clip 을 끕니다 — 켠 채로 두면
 * 경계 밖으로 넘긴 부분이 잘려서 두 variant 가 똑같아 보입니다.
 */
function Host({
  onDark = false,
  boundaryOut = false,
  children,
}: {
  onDark?: boolean;
  boundaryOut?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        'relative flex h-control-lg w-100 items-center justify-center rounded-0',
        onDark ? 'bg-bg-inverse' : 'bg-bg-tertiary',
        boundaryOut ? '' : 'overflow-hidden',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 레이어를 라벨보다 먼저 둡니다 — Figma 의 Button pressed 와 같은 순서입니다.
          뒤에 두면 반투명 오버레이가 라벨까지 어둡게 덮습니다.
          라벨에 `relative` 가 필요합니다: static 요소는 DOM 순서와 무관하게 positioned
          형제보다 먼저 칠해지므로, 없으면 순서를 바꿔도 오버레이가 계속 위에 옵니다.
          Figma 의 Button 도 같은 이유로 `content` 프레임이 relative 입니다. */}
      {children}
      <span
        className={[
          'relative font-body-small',
          onDark ? 'text-text-inverse' : 'text-text-primary',
        ].join(' ')}
      >
        host
      </span>
    </div>
  );
}

const meta = {
  title: 'Components/StateLayerPressed',
  component: StateLayerPressed,
  tags: ['autodocs'],
  parameters: {
    // 경계 밖으로 넘기는 variant 가 잘리지 않도록 여백이 있는 레이아웃을 씁니다.
    layout: 'padded',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `StateLayer/Pressed` (node 35:12765). 눌린 상태를 표현하는 오버레이입니다. ' +
          '`absolute` 로 배치되므로 호스트가 `relative` 여야 하고, 호스트의 콘텐츠보다 **먼저** 넣습니다 — ' +
          '호스트 전체를 덮는 반투명 오버레이라 콘텐츠 뒤에 두면 라벨까지 어두워집니다. ' +
          'Figma 의 Button pressed 3종(1:4055 · 1:4033 · 1:4016)도 레이어를 `content` 앞에 둡니다.',
      },
    },
  },
  args: {
    color: 'black',
    boundaryOut: false,
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['black', 'white'],
      description: 'Figma variant 축 `color`',
    },
    boundaryOut: {
      control: 'boolean',
      description: 'Figma variant 축 `boundaryOut`',
    },
  },
  render: (args: StateLayerPressedProps) => (
    <Host onDark={args.color === 'white'} boundaryOut={args.boundaryOut}>
      <StateLayerPressed {...args} />
    </Host>
  ),
} satisfies Meta<typeof StateLayerPressed>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `color=black, boundaryOut=false` (node 35:12786). */
export const BlackInside: Story = {
  args: { color: 'black', boundaryOut: false },
};

/** Figma `color=black, boundaryOut=true` (node 35:12788). */
export const BlackBoundaryOut: Story = {
  args: { color: 'black', boundaryOut: true },
};

/** Figma `color=white, boundaryOut=false` (node 35:12766). 어두운 호스트 위에서만 보입니다. */
export const WhiteInside: Story = {
  args: { color: 'white', boundaryOut: false },
};

/** Figma `color=white, boundaryOut=true` (node 35:12768). */
export const WhiteBoundaryOut: Story = {
  args: { color: 'white', boundaryOut: true },
};

/** Figma 프레임 35:12765 와 같은 순서로 4개 조합을 나란히 둡니다. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-40 bg-bg-primary p-24">
      {(
        [
          { color: 'black', boundaryOut: false },
          { color: 'black', boundaryOut: true },
          { color: 'white', boundaryOut: false },
          { color: 'white', boundaryOut: true },
        ] as const
      ).map((variant) => (
        <div
          key={`${variant.color}-${String(variant.boundaryOut)}`}
          className="flex flex-col gap-8"
        >
          <Host onDark={variant.color === 'white'} boundaryOut={variant.boundaryOut}>
            <StateLayerPressed {...variant} />
          </Host>
          <p className="font-body-small text-text-secondary">
            {`color=${variant.color}, boundaryOut=${String(variant.boundaryOut)}`}
          </p>
        </div>
      ))}
    </div>
  ),
};
