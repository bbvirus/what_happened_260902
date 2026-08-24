import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StateLayerFocused } from './StateLayerFocused';
import type { StateLayerFocusedProps } from './StateLayerFocused';

/** Figma 컴포넌트 세트 `StateLayer/Focused` (node 35:12806). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=35-12806&t=IKuf4oO7n3Ltvjww-11';

/**
 * 포커스 링을 눈으로 확인하기 위한 호스트 박스입니다.
 * StateLayerFocused 는 `absolute` 라서 호스트가 `relative` 여야 합니다.
 *
 * `outerFocus=false` 일 때만 `overflow-hidden` 을 겁니다. Figma 원본도
 * outerFocus 가 켜지면 바깥 프레임의 clip 을 끕니다 — 켠 채로 두면
 * 경계 밖에 그린 링이 잘려서 두 variant 가 똑같아 보입니다.
 * Figma 의 Button `state=focused` 변형도 같은 이유로 clip 을 걸지 않습니다.
 */
function Host({ outerFocus = false, children }: { outerFocus?: boolean; children: ReactNode }) {
  return (
    <div
      className={[
        'relative flex h-control-lg w-100 items-center justify-center rounded-4 bg-bg-tertiary',
        outerFocus ? '' : 'overflow-hidden',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="font-body-small text-text-primary">host</span>
      {children}
    </div>
  );
}

const meta = {
  title: 'Components/StateLayerFocused',
  component: StateLayerFocused,
  tags: ['autodocs'],
  parameters: {
    // 경계 밖에 그리는 variant 가 잘리지 않도록 여백이 있는 레이아웃을 씁니다.
    layout: 'padded',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `StateLayer/Focused` (node 35:12806). 포커스 상태를 표현하는 링 오버레이입니다. ' +
          '`absolute` 로 배치되므로 호스트가 `relative` 여야 합니다. 자식 순서는 무관합니다 — ' +
          '링은 경계 밖에 그려져 콘텐츠와 겹치는 영역이 없습니다. ' +
          'Figma 도 일관돼 있지 않습니다: 1:4049 는 `content` 다음, 1:4027 · 1:4010 은 `content` 앞입니다. ' +
          'Figma 의 Button `state=focused` 는 이 컴포넌트를 `outerFocus=true` 로 씁니다.',
      },
    },
  },
  args: {
    outerFocus: false,
  },
  argTypes: {
    outerFocus: {
      control: 'boolean',
      description: 'Figma variant 축 `outerFocus`',
    },
  },
  render: (args: StateLayerFocusedProps) => (
    <Host outerFocus={args.outerFocus}>
      <StateLayerFocused {...args} />
    </Host>
  ),
} satisfies Meta<typeof StateLayerFocused>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `radius=small, outerFocus=false` (node 35:12809). 링이 호스트 경계 안쪽에 그려집니다. */
export const InnerFocus: Story = {
  args: { outerFocus: false },
};

/**
 * Figma `radius=small, outerFocus=true` (node 35:12817).
 * 링이 호스트 경계 밖으로 한 단계 나갑니다. Figma 의 Button `state=focused` 가 쓰는 조합입니다.
 */
export const OuterFocus: Story = {
  args: { outerFocus: true },
};

/** Figma 프레임 35:12806 과 같은 순서로 2개 조합을 나란히 둡니다. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-40 bg-bg-primary p-24">
      {([false, true] as const).map((outerFocus) => (
        <div key={String(outerFocus)} className="flex flex-col gap-8">
          <Host outerFocus={outerFocus}>
            <StateLayerFocused outerFocus={outerFocus} />
          </Host>
          <p className="font-body-small text-text-secondary">
            {`radius=small, outerFocus=${String(outerFocus)}`}
          </p>
        </div>
      ))}
    </div>
  ),
};
