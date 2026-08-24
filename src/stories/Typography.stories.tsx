import type { Meta, StoryObj } from '@storybook/react';

/**
 * Typography 토큰 시각화.
 *
 * 대상: typography.tokens.css 의 `@utility` 합성 클래스 전체(18개).
 * 타이포는 CSS 변수가 아니라 합성 클래스이므로, 샘플 텍스트에 클래스를 직접
 * 적용해 보여준다. 크기·굵기·행간·자간 값은 토큰 파일에서 옮겼다.
 *
 * ⚠ Pretendard 웹폰트는 저장소에 포함돼 있지 않다. 렌더 결과는 폴백 서체다.
 */

const SAMPLE = '다람쥐 헌 쳇바퀴에 타고파 Design System 0123';

type TypeToken = {
  /** 유틸리티 클래스명. Tailwind 스캔을 위해 완전한 문자열로 적는다 */
  cls: string;
  /** 토큰 파일에 적힌 font-size (rem) */
  rem: string;
  /** 같은 값의 px 숫자 */
  px: string;
  /** base = 500, strong = 700 */
  weight: string;
  /** line-height */
  leading: string;
  /** letter-spacing. 없으면 '0' */
  tracking: string;
};

type TypeGroup = {
  group: string;
  /** 그룹 공통 주의사항. 없으면 표시하지 않는다 */
  note?: string;
  tokens: TypeToken[];
};

const GROUPS: TypeGroup[] = [
  {
    group: 'display',
    tokens: [
      {
        cls: 'font-display-large-strong',
        rem: '2.25rem',
        px: '36',
        weight: 'strong',
        leading: '1.3',
        tracking: '-0.02em',
      },
      {
        cls: 'font-display-medium-strong',
        rem: '1.75rem',
        px: '28',
        weight: 'strong',
        leading: '1.3',
        tracking: '-0.02em',
      },
    ],
  },
  {
    group: 'title',
    note: '⚠ Figma 에 title 의 non-strong(500) 변형이 없다. x-small 만 Figma 이름이 -700 이다.',
    tokens: [
      {
        cls: 'font-title-large-strong',
        rem: '1.5rem',
        px: '24',
        weight: 'strong',
        leading: '1.3',
        tracking: '-0.02em',
      },
      {
        cls: 'font-title-medium-strong',
        rem: '1.25rem',
        px: '20',
        weight: 'strong',
        leading: '1.3',
        tracking: '-0.02em',
      },
      {
        cls: 'font-title-small-strong',
        rem: '1.125rem',
        px: '18',
        weight: 'strong',
        leading: '1.3',
        tracking: '-0.02em',
      },
      {
        cls: 'font-title-x-small-700',
        rem: '1rem',
        px: '16',
        weight: 'strong',
        leading: '1.3',
        tracking: '-0.02em',
      },
    ],
  },
  {
    group: 'body',
    tokens: [
      {
        cls: 'font-body-large-strong',
        rem: '1.125rem',
        px: '18',
        weight: 'strong',
        leading: '1.5',
        tracking: '0',
      },
      {
        cls: 'font-body-large',
        rem: '1.125rem',
        px: '18',
        weight: 'base',
        leading: '1.5',
        tracking: '0',
      },
      {
        cls: 'font-body-medium-700',
        rem: '1rem',
        px: '16',
        weight: 'strong',
        leading: '1.5',
        tracking: '0',
      },
      {
        cls: 'font-body-medium',
        rem: '1rem',
        px: '16',
        weight: 'base',
        leading: '1.5',
        tracking: '0',
      },
      {
        cls: 'font-body-small-700',
        rem: '0.875rem',
        px: '14',
        weight: 'strong',
        leading: '1.5',
        tracking: '0',
      },
      {
        cls: 'font-body-small',
        rem: '0.875rem',
        px: '14',
        weight: 'base',
        leading: '1.5',
        tracking: '0',
      },
    ],
  },
  {
    group: 'label',
    note: '⚠ Figma 에 label/x-large 의 non-700 변형과 label/small-700 이 없다.',
    tokens: [
      {
        cls: 'font-label-x-large-700',
        rem: '1.125rem',
        px: '18',
        weight: 'strong',
        leading: '1',
        tracking: '0',
      },
      {
        cls: 'font-label-large-strong',
        rem: '1rem',
        px: '16',
        weight: 'strong',
        leading: '1',
        tracking: '0',
      },
      {
        cls: 'font-label-large',
        rem: '1rem',
        px: '16',
        weight: 'base',
        leading: '1',
        tracking: '0',
      },
      {
        cls: 'font-label-medium-700',
        rem: '0.875rem',
        px: '14',
        weight: 'strong',
        leading: '1',
        tracking: '0',
      },
      {
        cls: 'font-label-medium',
        rem: '0.875rem',
        px: '14',
        weight: 'base',
        leading: '1',
        tracking: '0',
      },
      {
        cls: 'font-label-small',
        rem: '0.75rem',
        px: '12',
        weight: 'base',
        leading: '1',
        tracking: '0',
      },
    ],
  },
];

function Row({ cls, rem, px, weight, leading, tracking }: TypeToken) {
  return (
    <div className="flex flex-col gap-8 border-b border-border-primary pb-16">
      <div className="flex flex-wrap items-baseline gap-12">
        <span className="font-label-medium-700 text-text-primary">{cls}</span>
        <span className="font-label-small text-text-tertiary">
          {rem} · {px} px · {weight} · leading {leading} · tracking {tracking}
        </span>
      </div>
      <p className={`text-text-primary ${cls}`}>{SAMPLE}</p>
    </div>
  );
}

function Group({ group, note, tokens }: TypeGroup) {
  return (
    <section className="flex flex-col gap-16">
      <h3 className="font-title-small-strong text-text-primary">{group}</h3>
      {note ? <p className="font-label-small text-text-secondary">{note}</p> : null}
      <div className="flex flex-col gap-16">
        {tokens.map((token) => (
          <Row key={token.cls} {...token} />
        ))}
      </div>
    </section>
  );
}

const meta: Meta = {
  title: 'Design Tokens/Typography',
  tags: ['autodocs'],
  parameters: {
    // 출처: typography.tokens.css 헤더에 기록된 file key + node id 로 조립한 URL.
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp?node-id=20-10506',
    },
    docs: {
      description: {
        component: [
          'typography.tokens.css 의 합성 타이포 클래스. 크기·굵기·행간·자간이 한 클래스에',
          '묶여 있으므로 `text-*` 나 `font-*` 굵기 유틸리티를 따로 붙이지 않는다.',
          '(Tailwind 기본 `--text-*` · `--font-weight-*` 는 토큰 파일에서 꺼져 있다.)',
          '',
          '굵기 표기: base = 500, strong = 700. 이름에 `-strong` 과 `-700` 이 섞여 있는 것은',
          'Figma 변수 이름을 그대로 보존한 결과다.',
          '',
          '⚠ Pretendard 웹폰트는 저장소에 없다. 아래 렌더는 폴백 서체로 보인다.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-40 bg-bg-primary p-24">
      {GROUPS.map((group) => (
        <Group key={group.group} {...group} />
      ))}
    </div>
  ),
};
