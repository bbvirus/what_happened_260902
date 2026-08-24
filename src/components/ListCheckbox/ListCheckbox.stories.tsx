import type { Meta, StoryObj } from '@storybook/react';
import { ListCheckbox } from './ListCheckbox';

/** Figma 컴포넌트 세트 `List/Checkbox` (node 60:23751, 섹션 27683:4431). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--2%EC%9D%BC%EC%B0%A8-%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=60-23751';

/** Figma 프레임 60:23751 의 진열 순서 그대로다. */
const VARIANTS = [
  { isChecked: false, node: '60:23786' },
  { isChecked: true, node: '60:23802' },
] as const;

/** Figma `Text Set Title` 인스턴스의 `Title` 텍스트 그대로다. */
const SAMPLE_TITLE = '타이틀 영역입니다.';

const meta = {
  title: 'Components/ListCheckbox',
  component: ListCheckbox,
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
          'Figma `List/Checkbox` (node 60:23751). 체크박스가 붙은 리스트 **행**입니다.\n\n' +
          '**합성 컴포넌트입니다** — 새로 그린 것이 하나도 없습니다. Figma 의 자식 4개가 전부 instance 였고 ' +
          '기존 컴포넌트를 그대로 씁니다: `ListSlotCheckbox`(20:5754) · `TextSetTitle`(size=sm) · ' +
          '`Icon`(chevronRight-small) · `Divider`(20:5645).\n\n' +
          'Figma variant 축은 `isChecked` 하나입니다. 원자 `ListSlot/Checkbox` 에 있는 `isDisabled` 축은 ' +
          '이 세트에 **없어서** prop 으로 두지 않았습니다.\n\n' +
          '나머지 3개(`size` · `hasIconEnd` · `hasDivider`)는 `page/Consent`(27683:3187)가 ' +
          '실제로 요구해서 붙인 축입니다. 세 기본값이 모두 기존 렌더 결과와 같습니다 — ' +
          '`size="default"` · `hasIconEnd` · `hasDivider` 가 켜진 것이 `List/Checkbox`(60:23751) 심볼 그대로입니다.\n\n' +
          '⚠ `size` 와 `hasDivider` 는 **이 저장소의 명명**입니다. Figma 인스턴스 이름 ' +
          '`[List] Checkbox/false/compact/false` 에서 읽히는 것은 값 `compact` 뿐이고, 구분선은 ' +
          '인스턴스 오버라이드로 숨겨져 있어 MCP 가 property 이름을 내주지 않습니다. ' +
          '근거는 `ListCheckbox.design.md` 참조.\n\n' +
          '두 variant 안에 hit area · pressed/focused 상태 레이어가 하나도 없어, `ListSlotCheckbox` 와 같은 ' +
          '성격의 표시 요소로 구현했습니다. 시맨틱(`role` · `aria-checked`), 체크박스 그룹 묶기, 라벨 연결, ' +
          '키보드 조작은 전부 **호스트의 책임**입니다. 책임 분리표는 `ListCheckbox.design.md` 에 있습니다.',
      },
    },
  },
  args: {
    isChecked: false,
    title: SAMPLE_TITLE,
    size: 'default',
    hasIconEnd: true,
    hasDivider: true,
  },
  argTypes: {
    isChecked: {
      control: 'boolean',
      description: 'Figma variant 축 `isChecked`',
    },
    title: {
      control: 'text',
      description: 'Figma `Text Set Title` 인스턴스의 `Title` 텍스트 자리 (내용 슬롯)',
    },
    size: {
      control: 'radio',
      options: ['default', 'compact'],
      description: '행 밀도. `default` = 상하 `spacing/24`, `compact` = 상하 `spacing/20`',
    },
    hasIconEnd: {
      control: 'boolean',
      description: 'Figma component property `hasIconEnd`. 끝 셰브론 노출 여부',
    },
    hasDivider: {
      control: 'boolean',
      description: '행 아래 구분선 노출 여부',
    },
  },
} satisfies Meta<typeof ListCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `isChecked=false` (node 60:23786). */
export const Unchecked: Story = {
  args: { isChecked: false },
};

/** Figma `isChecked=true` (node 60:23802). */
export const Checked: Story = {
  args: { isChecked: true },
};

/**
 * Figma 프레임 60:23751 과 같은 순서로 두 variant 를 위아래로 둡니다.
 *
 * Figma 진열 프레임처럼 회색 배경 위에 둡니다 — 선택 상태의 체크 표시가
 * `bg/primary`(흰색)이라 흰 배경에서는 잘 보이지 않습니다
 * (`ListSlotCheckbox.design.md` 참조).
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-40 bg-bg-tertiary p-24">
      {VARIANTS.map((variant) => (
        <div key={variant.node} className="flex flex-col gap-8">
          <p className="font-body-small text-text-secondary">
            {`isChecked=${String(variant.isChecked)} · ${variant.node}`}
          </p>
          <ListCheckbox isChecked={variant.isChecked} title={SAMPLE_TITLE} />
        </div>
      ))}
    </div>
  ),
};

/**
 * 행이 여러 개 쌓였을 때 구분선이 어떻게 보이는지 확인하는 스토리입니다.
 * Figma 노드가 아니라 스토리 전용 장치입니다 — 구분선이 절대 배치(bottom=0)라
 * 행 높이 72 를 늘리지 않는다는 것을 눈으로 확인하기 위한 것입니다.
 *
 * 접근성 시맨틱은 이 컴포넌트가 아니라 호스트가 붙입니다. 아래처럼
 * `role="group"` + 행마다 `role="checkbox"` · `aria-checked` 를 얹는 것이
 * `ListCheckbox.design.md` 의 책임 분리표에 적힌 호스트 몫입니다.
 */
export const Stacked: Story = {
  render: () => (
    <div role="group" aria-label="약관 동의" className="bg-bg-primary">
      {[
        { title: '서비스 이용약관 동의', isChecked: true },
        { title: '개인정보 수집·이용 동의', isChecked: false },
        { title: '마케팅 정보 수신 동의', isChecked: false },
      ].map((row) => (
        <ListCheckbox
          key={row.title}
          isChecked={row.isChecked}
          title={row.title}
          role="checkbox"
          aria-checked={row.isChecked}
          tabIndex={0}
        />
      ))}
    </div>
  ),
};

/**
 * `page/Consent`(27683:3187) 가 이 컴포넌트를 쓰는 두 가지 조합입니다.
 * 나중에 붙은 축 3개가 어디서 왔는지 보여 주는 스토리입니다.
 *
 * · 첫 행 (`27683:3193`) — `size="default"` · `hasIconEnd={false}` · 구분선 켬
 * · 아래 4행 (`27683:3196`~`3199`) — `size="compact"` · `hasDivider={false}`
 */
export const ConsentRows: Story = {
  render: () => (
    <div className="bg-bg-primary">
      <ListCheckbox title={SAMPLE_TITLE} hasIconEnd={false} />
      {[
        '[필수] 서비스 이용약관',
        '[필수] 개인정보 수집·이용 동의',
        '[필수] 고유식별정보 처리 동의',
        '[선택] 마케팅 정보 수신 동의',
      ].map((title) => (
        <ListCheckbox key={title} title={title} size="compact" hasDivider={false} />
      ))}
    </div>
  ),
};
