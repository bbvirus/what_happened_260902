import type { Meta, StoryObj } from '@storybook/react';

/**
 * Color 토큰 시각화.
 *
 * 대상: colors.tokens.css 의 Semantic 레이어(`@theme` → 유틸리티 생성분).
 * Primitive 레이어(`:root` 의 --bw-*, --magenta-*, --dimmed-* 등)는 유틸리티가
 * 생성되지 않으므로 여기서 렌더할 수 없다. 렌더하려면 CSS 변수 직접 참조가
 * 필요하고 그것은 CLAUDE.md ## 토큰 규칙에서 금지된다.
 * Primitive 스케일 표는 docs/design-tokens.md 를 본다.
 *
 * 각 스워치는 흰색/검정 절반 위에 색을 겹쳐 그린다. 알파가 있는 토큰
 * (state-layer/*, overlay/*, *-disabled-on-*)의 투명도가 보이도록 한 것이다.
 */

type ColorToken = {
  /** 토큰 이름. --color- 접두어를 뗀 형태 = 유틸리티 접미어 */
  name: string;
  /** 스워치에 적용할 유틸리티. Tailwind 스캔을 위해 완전한 문자열로 적는다 */
  swatch: string;
  /** colors.tokens.css 에 기록된 참조 대상 */
  source: string;
};

type ColorGroup = {
  /** Figma 변수 그룹 이름 */
  group: string;
  tokens: ColorToken[];
};

const GROUPS: ColorGroup[] = [
  {
    group: 'text/*',
    tokens: [
      { name: 'text-primary', swatch: 'bg-text-primary', source: '--bw-light-black' },
      {
        name: 'text-secondary',
        swatch: 'bg-text-secondary',
        source: '--neutral-gray-light-600',
      },
      {
        name: 'text-tertiary',
        swatch: 'bg-text-tertiary',
        source: '--neutral-gray-light-400',
      },
      {
        name: 'text-disabled',
        swatch: 'bg-text-disabled',
        source: '--neutral-gray-light-300',
      },
      { name: 'text-inverse', swatch: 'bg-text-inverse', source: '--bw-white' },
      { name: 'text-brand', swatch: 'bg-text-brand', source: '--magenta-light-500' },
      { name: 'text-negative', swatch: 'bg-text-negative', source: '--negative-light-500' },
      { name: 'text-positive', swatch: 'bg-text-positive', source: '--positive-light-500' },
      {
        name: 'text-disabled-on-light',
        swatch: 'bg-text-disabled-on-light',
        source: '--dimmed-black-16',
      },
      {
        name: 'text-disabled-on-dark',
        swatch: 'bg-text-disabled-on-dark',
        source: '--dimmed-white-40',
      },
    ],
  },
  {
    group: 'bg/*',
    tokens: [
      { name: 'bg-primary', swatch: 'bg-bg-primary', source: '--bw-white' },
      { name: 'bg-secondary', swatch: 'bg-bg-secondary', source: '--neutral-gray-light-10' },
      { name: 'bg-tertiary', swatch: 'bg-bg-tertiary', source: '--neutral-gray-light-50' },
      { name: 'bg-inverse', swatch: 'bg-bg-inverse', source: '--bw-light-black' },
      { name: 'bg-brand', swatch: 'bg-bg-brand', source: '--magenta-light-500' },
      {
        name: 'bg-brand-subtle',
        swatch: 'bg-bg-brand-subtle',
        source: '--magenta-light-10',
      },
      {
        name: 'bg-negative-subtle',
        swatch: 'bg-bg-negative-subtle',
        source: '--negative-light-10',
      },
      {
        name: 'bg-positive-subtle',
        swatch: 'bg-bg-positive-subtle',
        source: '--positive-light-10',
      },
    ],
  },
  {
    group: 'border/*',
    tokens: [
      {
        name: 'border-primary',
        swatch: 'bg-border-primary',
        source: '--neutral-gray-light-100',
      },
      {
        name: 'border-secondary',
        swatch: 'bg-border-secondary',
        source: '--neutral-gray-light-200',
      },
      { name: 'border-strong', swatch: 'bg-border-strong', source: '--bw-light-black' },
      { name: 'border-brand', swatch: 'bg-border-brand', source: '--magenta-light-500' },
      {
        name: 'border-negative',
        swatch: 'bg-border-negative',
        source: '--negative-light-500',
      },
      {
        name: 'border-disabled',
        swatch: 'bg-border-disabled',
        source: '--neutral-gray-light-100',
      },
      {
        name: 'border-disabled-on-light',
        swatch: 'bg-border-disabled-on-light',
        source: '--dimmed-black-16',
      },
    ],
  },
  {
    group: 'interactive/*',
    tokens: [
      {
        name: 'interactive-primary',
        swatch: 'bg-interactive-primary',
        source: '⚠ Primitive 스케일 밖 — 값 직접 지정',
      },
      {
        name: 'interactive-primary-hover',
        swatch: 'bg-interactive-primary-hover',
        source: '--magenta-light-600',
      },
      {
        name: 'interactive-primary-pressed',
        swatch: 'bg-interactive-primary-pressed',
        source: '--magenta-light-700',
      },
      {
        name: 'interactive-secondary',
        swatch: 'bg-interactive-secondary',
        source: '--bw-white',
      },
      {
        name: 'interactive-secondary-hover',
        swatch: 'bg-interactive-secondary-hover',
        source: '--neutral-gray-light-50',
      },
      {
        name: 'interactive-disabled',
        swatch: 'bg-interactive-disabled',
        source: '--neutral-gray-light-100',
      },
    ],
  },
  {
    group: 'button/*',
    tokens: [
      {
        name: 'button-primary-fill',
        swatch: 'bg-button-primary-fill',
        source: '⚠ Primitive 스케일 밖 — 값 직접 지정',
      },
      {
        name: 'button-primary-fill-focused',
        swatch: 'bg-button-primary-fill-focused',
        source: '⚠ primary-fill 과 동일한 값',
      },
      {
        name: 'button-primary-fill-pressed',
        swatch: 'bg-button-primary-fill-pressed',
        source: '⚠ primary-fill 과 동일한 값',
      },
      {
        name: 'button-primary-text',
        swatch: 'bg-button-primary-text',
        source: '--bw-white',
      },
      {
        name: 'button-secondary-fill',
        swatch: 'bg-button-secondary-fill',
        source: '--bw-light-black',
      },
      {
        name: 'button-secondary-fill-focused',
        swatch: 'bg-button-secondary-fill-focused',
        source: '--bw-light-black',
      },
      {
        name: 'button-secondary-fill-pressed',
        swatch: 'bg-button-secondary-fill-pressed',
        source: '--bw-light-black',
      },
      {
        name: 'button-secondary-text',
        swatch: 'bg-button-secondary-text',
        source: '--bw-white',
      },
      {
        name: 'button-disabled-fill',
        swatch: 'bg-button-disabled-fill',
        source: '--neutral-gray-light-100',
      },
      {
        name: 'button-disabled-text',
        swatch: 'bg-button-disabled-text',
        source: '--bw-light-black',
      },
      {
        name: 'button-ghost-text',
        swatch: 'bg-button-ghost-text',
        source: '--bw-light-black',
      },
    ],
  },
  {
    group: 'icon/*',
    tokens: [
      { name: 'icon-primary', swatch: 'bg-icon-primary', source: '--bw-light-black' },
      {
        name: 'icon-secondary',
        swatch: 'bg-icon-secondary',
        source: '--neutral-gray-light-600',
      },
      {
        name: 'icon-tertiary',
        swatch: 'bg-icon-tertiary',
        source: '--neutral-gray-light-400',
      },
      { name: 'icon-inverse', swatch: 'bg-icon-inverse', source: '--bw-white' },
      { name: 'icon-brand', swatch: 'bg-icon-brand', source: '--magenta-light-500' },
      { name: 'icon-negative', swatch: 'bg-icon-negative', source: '--negative-light-500' },
      {
        name: 'icon-disabled-on-light',
        swatch: 'bg-icon-disabled-on-light',
        source: '--dimmed-black-16',
      },
      {
        name: 'icon-disabled-on-dark',
        swatch: 'bg-icon-disabled-on-dark',
        source: '--dimmed-white-64',
      },
    ],
  },
  {
    group: 'status/*',
    tokens: [
      {
        name: 'status-negative',
        swatch: 'bg-status-negative',
        source: '--negative-light-500',
      },
      {
        name: 'status-positive',
        swatch: 'bg-status-positive',
        source: '--positive-light-600',
      },
      {
        name: 'status-informative',
        swatch: 'bg-status-informative',
        source: '--informative-light-500',
      },
      { name: 'status-warning', swatch: 'bg-status-warning', source: '--warning-light-500' },
    ],
  },
  {
    group: 'stateLayer/* · overlay/* · state/*',
    tokens: [
      {
        name: 'state-layer-pressed-black',
        swatch: 'bg-state-layer-pressed-black',
        source: '--dimmed-black-16',
      },
      {
        name: 'state-layer-pressed-white',
        swatch: 'bg-state-layer-pressed-white',
        source: '--dimmed-white-16',
      },
      {
        name: 'state-layer-hover-black',
        swatch: 'bg-state-layer-hover-black',
        source: '--dimmed-black-8',
      },
      {
        name: 'overlay-dimmed',
        swatch: 'bg-overlay-dimmed',
        source: '--dimmed-black-64',
      },
      { name: 'state-focused', swatch: 'bg-state-focused', source: '--bw-light-black' },
    ],
  },
];

function Swatch({ name, swatch, source }: ColorToken) {
  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-64 overflow-hidden rounded-4 border border-border-secondary">
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-bg-primary" />
          <div className="flex-1 bg-bg-inverse" />
        </div>
        <div className={`absolute inset-0 ${swatch}`} />
      </div>
      <div className="font-label-medium-700 text-text-primary">{name}</div>
      <div className="font-label-small text-text-tertiary">{source}</div>
    </div>
  );
}

function Group({ group, tokens }: ColorGroup) {
  return (
    <section className="flex flex-col gap-16">
      <h3 className="font-title-small-strong text-text-primary">{group}</h3>
      <div className="grid grid-cols-2 gap-20 sm:grid-cols-3 lg:grid-cols-4">
        {tokens.map((token) => (
          <Swatch key={token.name} {...token} />
        ))}
      </div>
    </section>
  );
}

const meta: Meta = {
  title: 'Design Tokens/Colors',
  tags: ['autodocs'],
  parameters: {
    // 출처: colors.tokens.css 헤더에 기록된 file key + node id 로 조립한 URL.
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp?node-id=27677-2907',
    },
    docs: {
      description: {
        component: [
          'colors.tokens.css 의 Semantic 색상 토큰. 유틸리티는 이름 앞에 용도를 붙여 쓴다 —',
          '`bg-<이름>` / `text-<이름>` / `border-<이름>` (예: `bg-bg-brand`, `text-text-brand`).',
          '',
          '스워치 아래 두 번째 줄은 colors.tokens.css 에 기록된 참조 Primitive 다.',
          '이 참조는 Figma alias 구조가 아니라 값 일치로 역추적한 것이라는 주의가',
          '토큰 파일 헤더에 함께 적혀 있다.',
          '',
          'Primitive 스케일 자체는 유틸리티가 없어 이 페이지에 렌더하지 않는다.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Semantic: Story = {
  render: () => (
    <div className="flex flex-col gap-40 bg-bg-primary p-24">
      {GROUPS.map((group) => (
        <Group key={group.group} {...group} />
      ))}
    </div>
  ),
};
