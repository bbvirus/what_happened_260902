import type { Meta, StoryObj } from '@storybook/react';
import { ListRadio } from './ListRadio';

/** Figma 컴포넌트 세트 `List/Radio` (node 60:24137). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=60-24137';

/** Figma 세트 안의 샘플 텍스트를 그대로 쓴다. */
const TITLE = '타이틀 영역입니다.';

/**
 * Figma 변형의 폭 362 를 재현하는 진열 프레임.
 * 402(`--spacing-mobile-frame-width`) − 20 × 2(`--spacing-20`, 페이지 좌우 마진) = 362 다.
 * 컴포넌트가 폭을 고정하지 않으므로(`w-full`) 진열 쪽에서 프레임을 준다.
 */
const FRAME = 'w-mobile-frame-width bg-bg-primary px-20';

const meta = {
  title: 'Components/ListRadio',
  component: ListRadio,
  // preview.ts 에서 전역 autodocs를 켜두었지만, 명시해두면 의도가 분명해집니다.
  tags: ['autodocs'],
  parameters: {
    // 진열 프레임이 폭 402 를 스스로 고정하므로 캔버스 여백 없이 그대로 보여줍니다.
    layout: 'fullscreen',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `List/Radio` (node 60:24137). 단일 선택 목록의 한 행입니다. ' +
          'variant 축은 `isChecked` 하나뿐입니다 — 세트에 변형이 2개(60:24172 · 60:24188)입니다. ' +
          '**새로 그린 것이 없는 합성 컴포넌트입니다.** Figma 원본의 자식 4개가 전부 인스턴스여서 ' +
          '`ListSlotRadio` · `TextSetTitle`(`size="sm"`) · `Icon`(`chevronRight-small`) · `Divider` 를 ' +
          '그대로 조립했습니다. 이 파일이 직접 쓰는 시각 값은 `py-24`(`spacing/24`) 와 ' +
          '`gap-16`(`spacing/16`) 둘뿐입니다. ' +
          '라디오 그룹의 의미론(`role="radiogroup"` · `role="radio"` · `aria-checked` · 키보드 조작)은 ' +
          '이 컴포넌트가 담당하지 않습니다 — 루트에 props 가 전개되므로 호스트가 얹습니다. ' +
          '역할 분담과 Figma 원본에서 발견한 것은 `ListRadio.design.md` 에 있습니다.',
      },
    },
  },
  args: {
    title: TITLE,
    isChecked: false,
  },
  argTypes: {
    isChecked: {
      control: 'boolean',
      description: 'Figma variant 축 `isChecked`. 세트에 있는 축은 이것뿐입니다.',
    },
    title: { control: 'text', description: '행 제목. Figma `Text Set Title` 인스턴스의 텍스트 자리.' },
  },
  decorators: [
    (Story) => (
      <div className={FRAME}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 기본 변형 `isChecked=false` (60:24172). */
export const Default: Story = {};

/** `isChecked=false` (60:24172) — `ListSlotRadio` 가 `text/secondary` 링을 그립니다. */
export const Unchecked: Story = { args: { isChecked: false } };

/** `isChecked=true` (60:24188) — `ListSlotRadio` 가 `text/primary` 도넛을 그립니다. */
export const Checked: Story = { args: { isChecked: true } };

/**
 * 변형 2개를 Figma 세트와 같은 순서로 나란히 둡니다.
 * 행이 스스로 구분선을 갖고 있어 목록으로 쌓으면 행 사이 선이 그대로 이어집니다.
 */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <ListRadio isChecked={false} title={TITLE} />
      <ListRadio isChecked title={TITLE} />
    </>
  ),
};
