import type { Meta, StoryObj } from '@storybook/react';

/**
 * Radius 토큰 시각화.
 *
 * 대상: design-tokens.css 의 --radius-0 / -4 / -8 / -12 / -16 / -100.
 * 값·용도는 토큰 파일 주석에서 그대로 옮겼다. 용도 표가 없는 단(8/12/16)은
 * 없다고 표시한다.
 *
 * ⚠ RadiusGuide 프레임에는 Figma Variable 바인딩이 0개다. 이름과 값은 가이드
 * preview 프레임 이름과 라벨에서 읽은 것이다 (토큰 파일 주석 기준).
 */

type RadiusToken = {
  /** 토큰 이름. --radius- 접두어를 뗀 형태 = 유틸리티 접미어 */
  name: string;
  /** 상자에 적용할 유틸리티. Tailwind 스캔을 위해 완전한 문자열로 적는다 */
  rounded: string;
  /** 토큰 파일에 적힌 rem 값 */
  rem: string;
  /** 같은 값의 px 숫자 */
  px: string;
  /** 토큰 파일 주석의 용도 */
  usage: string;
};

const RADII: RadiusToken[] = [
  {
    name: '0',
    rounded: 'rounded-0',
    rem: '0',
    px: '0',
    usage: '직각 · Header, List, Divider, Tab, 페이지 프레임 (기본값)',
  },
  {
    name: '4',
    rounded: 'rounded-4',
    rem: '0.25rem',
    px: '4',
    usage: 'Button, Text Field (주요 인터랙션 요소)',
  },
  {
    name: '8',
    rounded: 'rounded-8',
    rem: '0.5rem',
    px: '8',
    usage: '⚠ 가이드 preview 에만 있음, 용도 표 없음',
  },
  {
    name: '12',
    rounded: 'rounded-12',
    rem: '0.75rem',
    px: '12',
    usage: '⚠ 가이드 preview 에만 있음, 용도 표 없음',
  },
  {
    name: '16',
    rounded: 'rounded-16',
    rem: '1rem',
    px: '16',
    usage: '⚠ 가이드 preview 에만 있음, 용도 표 없음',
  },
  {
    name: '100',
    rounded: 'rounded-100',
    rem: '6.25rem',
    px: '100',
    usage: 'Home Indicator (OS 전용). 가이드 라벨은 "Full"',
  },
];

function Tile({ name, rounded, rem, px }: RadiusToken) {
  return (
    <div className="flex flex-col items-center gap-12">
      <div
        className={`flex h-100 w-100 items-center justify-center border border-border-brand bg-bg-brand-subtle font-label-medium-700 text-text-primary ${rounded}`}
      >
        {name}
      </div>
      <div className="font-label-small text-text-tertiary">
        {rem} · {px} px
      </div>
    </div>
  );
}

function Row({ name, rounded, rem, px, usage }: RadiusToken) {
  return (
    <div className="flex items-center gap-16 border-b border-border-primary pb-12">
      <div className="w-100 shrink-0 font-label-medium-700 text-text-primary">{name}</div>
      <div className="w-100 shrink-0 font-label-small text-text-secondary">{rounded}</div>
      <div className="w-64 shrink-0 font-label-small text-text-secondary">{rem}</div>
      <div className="w-32 shrink-0 font-label-small text-text-tertiary">{px}</div>
      <div className="font-label-small text-text-secondary">{usage}</div>
    </div>
  );
}

const meta: Meta = {
  title: 'Design Tokens/Radius',
  tags: ['autodocs'],
  parameters: {
    // 출처: design-tokens.css radius 주석에 기록된 node id + colors.tokens.css 의 file key.
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp?node-id=27673-872',
    },
    docs: {
      description: {
        component: [
          'design-tokens.css 의 라운드 토큰. 유틸리티는 `rounded-<이름>` 이다',
          '(예: `rounded-4`). Tailwind 기본 `--radius-*` 는 토큰 파일에서 꺼져 있어',
          '`rounded-md` 같은 이름은 쓸 수 없다.',
          '',
          '이름의 숫자는 Figma 가이드의 px 숫자다. `100` 은 가이드 라벨상 "Full" 이지만',
          '실제 값은 고정 치수이므로, 상자가 그보다 크면 완전한 원형이 되지 않는다.',
          '',
          '⚠ RadiusGuide 프레임에 Figma Variable 바인딩이 0개다 (토큰 파일 주석 기준).',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 같은 크기 상자에 각 단계를 적용한 비교. */
export const Scale: Story = {
  render: () => (
    <div className="flex flex-wrap gap-40 bg-bg-primary p-40">
      {RADII.map((token) => (
        <Tile key={token.name} {...token} />
      ))}
    </div>
  ),
};

/** 토큰 이름 · 유틸리티 · 값 · 용도. */
export const Table: Story = {
  render: () => (
    <div className="flex flex-col gap-12 bg-bg-primary p-24">
      <div className="flex items-center gap-16 font-label-small text-text-tertiary">
        <div className="w-100 shrink-0">토큰</div>
        <div className="w-100 shrink-0">유틸리티</div>
        <div className="w-64 shrink-0">rem</div>
        <div className="w-32 shrink-0">(px)</div>
        <div>용도</div>
      </div>
      {RADII.map((token) => (
        <Row key={token.name} {...token} />
      ))}
    </div>
  ),
};
