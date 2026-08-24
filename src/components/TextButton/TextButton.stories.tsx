import type { Meta, StoryObj } from '@storybook/react';
import { ICON_NAMES } from '../Icon/Icon';
import { TextButton } from './TextButton';

const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=13-1742&t=IKuf4oO7n3Ltvjww-11';

const meta = {
  title: 'Components/TextButton',
  component: TextButton,
  // preview.ts 에서 전역 autodocs를 켜두었지만, 명시해두면 의도가 분명해집니다.
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — Figma 프레임 URL을 넣으면 Design 탭에 렌더링됩니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
  },
  args: {
    // Figma component property `text` 의 기본값입니다.
    children: '레이블',
  },
  argTypes: {
    iconStart: { control: 'select', options: ICON_NAMES },
    iconEnd: { control: 'select', options: ICON_NAMES },
    color: { control: 'inline-radio', options: ['primary', 'secondary'] },
  },
} satisfies Meta<typeof TextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 아이콘 슬롯을 둘 다 비운 상태입니다.
 *
 * Figma 의 기본값은 좌/우 슬롯이 둘 다 켜진 상태지만, 그 자리에 놓인 것은
 * 글리프가 아니라 점선 플레이스홀더(`Icon/line`, 18:5191)입니다. 어느 아이콘이
 * 들어갈지를 Figma 가 지정하지 않았으므로 기본 아이콘을 추측해 넣지 않았습니다.
 */
export const Default: Story = {};

/**
 * 왼쪽 슬롯만 채운 경우입니다. Figma component property `hasIconStart` 에 대응합니다.
 *
 * 여기 쓴 `chevronLeft-small` 은 슬롯 동작을 보여주려고 고른 값이며
 * Figma 가 지정한 글리프가 아닙니다.
 */
export const IconStart: Story = {
  args: { iconStart: 'chevronLeft-small' },
};

/**
 * 오른쪽 슬롯만 채운 경우입니다. Figma component property `hasIconEnd` 에 대응합니다.
 *
 * 여기 쓴 `chevronRight-small` 은 슬롯 동작을 보여주려고 고른 값이며
 * Figma 가 지정한 글리프가 아닙니다.
 */
export const IconEnd: Story = {
  args: { iconEnd: 'chevronRight-small' },
};

/** 양쪽 슬롯을 모두 채운 배치. Figma 기본값(`hasIconStart` · `hasIconEnd` 둘 다 켜짐)과 같은 구조입니다. */
export const BothIcons: Story = {
  args: { iconStart: 'chevronLeft-small', iconEnd: 'chevronRight-small' },
};

/**
 * `color="primary"` — 라벨이 Figma 변수 `text/primary` 입니다.
 *
 * 근거는 Header 섹션의 `HeaderSlot/LeftEnd/Items` `contentType=buttonGroup`
 * (27657:3101) 안에 놓인 TextButton 인스턴스 2개(27657:3102 · 27657:3103)입니다.
 * 세 가지가 일치합니다 — `get_design_context` 가 두 인스턴스 모두 `text/primary` 로
 * 방출하고, `get_variable_defs`(27657:3096)에 `text/secondary` 가 없고,
 * `get_screenshot` 의 글리프 내부 픽셀이 `text/primary` 값과 같습니다.
 * (raw 색상 값은 `TextButton.design.md` 에 있습니다.)
 *
 * 그 인스턴스들은 아이콘이 없는 텍스트 전용(42×19)이므로 이 스토리도 아이콘을 비웠습니다.
 * 기본값은 `secondary` 라서 `color` 를 넘기지 않던 기존 사용처는 영향을 받지 않습니다.
 */
export const ColorPrimary: Story = {
  args: { color: 'primary' },
};

/**
 * `color` 가 라벨과 아이콘에 **함께** 적용된다는 것을 보여줍니다.
 *
 * 아이콘까지 바꾼 근거는 Figma 노드가 아니라 토큰 정의입니다 —
 * `colors.tokens.css` 에서 `--color-text-primary` 와 `--color-icon-primary` 가
 * 둘 다 `--bw-light-black`, `--color-text-secondary` 와 `--color-icon-secondary` 가
 * 둘 다 `--neutral-gray-light-600` 으로, `text/N` ↔ `icon/N` 이 쌍을 이룹니다.
 * 자세한 판단 근거는 `TextButton.tsx` 의 `## color` 주석에 있습니다.
 *
 * 여기 쓴 글리프는 다른 스토리와 같이 슬롯 동작을 보이려고 고른 값이며
 * Figma 가 지정한 것이 아닙니다.
 */
export const ColorPrimaryWithIcons: Story = {
  args: { color: 'primary', iconStart: 'chevronLeft-small', iconEnd: 'chevronRight-small' },
};
