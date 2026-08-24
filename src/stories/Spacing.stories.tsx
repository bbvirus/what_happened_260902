import type { Meta, StoryObj } from '@storybook/react';

/**
 * Spacing 토큰 시각화.
 *
 * 대상: spacing.tokens.css 의 `@theme` 스케일 전체 + 컨트롤 높이 3개.
 * 값·용도는 토큰 파일 주석에서 그대로 옮겼다. 주석에 용도가 없는 단(80/100)은
 * 없다고 표시한다.
 *
 * ⚠ 이 스케일은 Tailwind 기본 스케일과 의미가 다르다. `p-4` 는 4 이고 16 이 아니다.
 */

type SpacingToken = {
  /** 토큰 이름. --spacing- 접두어를 뗀 형태 = 유틸리티 접미어 */
  name: string;
  /** 막대에 적용할 폭 유틸리티. Tailwind 스캔을 위해 완전한 문자열로 적는다 */
  bar: string;
  /** 토큰 파일에 적힌 rem 값 */
  rem: string;
  /** 토큰 파일에 적힌 px 값 (숫자만) */
  px: string;
  /** 토큰 파일 주석의 용도 */
  usage: string;
};

const SCALE: SpacingToken[] = [
  { name: '0', bar: 'w-0', rem: '0', px: '0', usage: '간격 없음' },
  {
    name: '4',
    bar: 'w-4',
    rem: '0.25rem',
    px: '4',
    usage: '미세 간격 · 텍스트 인라인 아이콘',
  },
  { name: '6', bar: 'w-6', rem: '0.375rem', px: '6', usage: '컴포넌트 내부 미세 패딩' },
  { name: '8', bar: 'w-8', rem: '0.5rem', px: '8', usage: 'CTA 상단 여백 · 버튼 간격' },
  {
    name: '12',
    bar: 'w-12',
    rem: '0.75rem',
    px: '12',
    usage: '라벨 ↔ 입력 필드 · 텍스트 세트',
  },
  { name: '14', bar: 'w-14', rem: '0.875rem', px: '14', usage: '버튼 · 입력 필드 상하 패딩' },
  { name: '16', bar: 'w-16', rem: '1rem', px: '16', usage: '아이콘 ↔ 텍스트 간격' },
  {
    name: '20',
    bar: 'w-20',
    rem: '1.25rem',
    px: '20',
    usage: '페이지 좌우 마진 · CTA 하단',
  },
  { name: '24', bar: 'w-24', rem: '1.5rem', px: '24', usage: '주요 리스트 항목 상하 패딩' },
  { name: '32', bar: 'w-32', rem: '2rem', px: '32', usage: '탭 하위 콘텐츠 시작 여백' },
  {
    name: '40',
    bar: 'w-40',
    rem: '2.5rem',
    px: '40',
    usage: '콘텐츠 시작 여백 · 필드 간 간격',
  },
  { name: '64', bar: 'w-64', rem: '4rem', px: '64', usage: '타이틀 ↔ 입력 영역 간격' },
  { name: '80', bar: 'w-80', rem: '5rem', px: '80', usage: '⚠ 가이드 preview 에만 있음' },
  {
    name: '100',
    bar: 'w-100',
    rem: '6.25rem',
    px: '100',
    usage: '⚠ 가이드 preview 에만 있음',
  },
];

const CONTROL: SpacingToken[] = [
  {
    name: 'control-sm',
    bar: 'w-control-sm',
    rem: '2rem',
    px: '32',
    usage: '⚠ Figma 출처 없음 — 저장소 기존 값',
  },
  {
    name: 'control-md',
    bar: 'w-control-md',
    rem: '2.5rem',
    px: '40',
    usage: '⚠ Figma 출처 없음 — 저장소 기존 값',
  },
  {
    name: 'control-lg',
    bar: 'w-control-lg',
    rem: '3rem',
    px: '48',
    usage: '⚠ Figma 출처 없음 · Figma 스케일 밖',
  },
];

function Row({ name, bar, rem, px, usage }: SpacingToken) {
  return (
    <div className="flex items-center gap-16 border-b border-border-primary pb-12">
      <div className="w-100 shrink-0 font-label-medium-700 text-text-primary">{name}</div>
      <div className="w-64 shrink-0 font-label-small text-text-secondary">{rem}</div>
      <div className="w-32 shrink-0 font-label-small text-text-tertiary">{px}</div>
      <div className="flex min-w-100 shrink-0 items-center">
        <div className={`h-16 rounded-0 bg-bg-brand ${bar}`} />
      </div>
      <div className="font-label-small text-text-secondary">{usage}</div>
    </div>
  );
}

function Table({ rows }: { rows: SpacingToken[] }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-16 font-label-small text-text-tertiary">
        <div className="w-100 shrink-0">토큰</div>
        <div className="w-64 shrink-0">rem</div>
        <div className="w-32 shrink-0">(px)</div>
        <div className="min-w-100 shrink-0">막대</div>
        <div>용도</div>
      </div>
      {rows.map((row) => (
        <Row key={row.name} {...row} />
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Design Tokens/Spacing',
  tags: ['autodocs'],
  parameters: {
    // 출처: spacing.tokens.css 헤더에 기록된 file key + node id 로 조립한 URL.
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp?node-id=27671-860',
    },
    docs: {
      description: {
        component: [
          'spacing.tokens.css 의 간격 스케일. 유틸리티는 `p-<이름>` / `gap-<이름>` /',
          '`m-<이름>` / `w-<이름>` / `h-<이름>` 형태다 (예: `p-16`, `gap-8`).',
          '',
          '⚠ 이름의 숫자는 Figma 가이드의 px 숫자다. Tailwind 기본 스케일과 다르다 —',
          '`p-4` 는 여기서 4 이고 16 이 아니다.',
          '',
          '⚠ 이 값들은 Figma Variable 이 아니라 SpacingGuide 프레임의 표에서 읽은 것이다',
          '(토큰 파일 헤더 기준). 컨트롤 높이 3개는 Figma 출처가 없다.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 스케일 13단 + 0. 막대 길이가 곧 토큰 값이다. */
export const Scale: Story = {
  render: () => (
    <div className="bg-bg-primary p-24">
      <Table rows={SCALE} />
    </div>
  ),
};

/** gap-* 을 같은 부모에 적용했을 때의 상자 간격 비교. */
export const Gap: Story = {
  render: () => (
    <div className="flex flex-col gap-24 bg-bg-primary p-24">
      {[
        { label: 'gap-4', cls: 'flex gap-4' },
        { label: 'gap-8', cls: 'flex gap-8' },
        { label: 'gap-16', cls: 'flex gap-16' },
        { label: 'gap-24', cls: 'flex gap-24' },
        { label: 'gap-40', cls: 'flex gap-40' },
      ].map(({ label, cls }) => (
        <div key={label} className="flex flex-col gap-8">
          <div className="font-label-small text-text-tertiary">{label}</div>
          <div className={cls}>
            <div className="h-32 w-32 rounded-4 bg-bg-brand" />
            <div className="h-32 w-32 rounded-4 bg-bg-brand" />
            <div className="h-32 w-32 rounded-4 bg-bg-brand" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** p-* 을 같은 상자에 적용했을 때의 내부 여백 비교. 바깥 테두리가 패딩 경계다. */
export const Padding: Story = {
  render: () => (
    <div className="flex flex-wrap gap-24 bg-bg-primary p-24">
      {[
        { label: 'p-8', cls: 'p-8' },
        { label: 'p-16', cls: 'p-16' },
        { label: 'p-24', cls: 'p-24' },
        { label: 'p-40', cls: 'p-40' },
      ].map(({ label, cls }) => (
        <div key={label} className="flex flex-col gap-8">
          <div className="font-label-small text-text-tertiary">{label}</div>
          <div className={`rounded-4 border border-border-brand ${cls}`}>
            <div className="h-40 w-40 rounded-4 bg-bg-brand-subtle" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** 컨트롤 높이. h-control-* 로 쓴다. Figma 출처가 없는 값이다. */
export const ControlHeights: Story = {
  render: () => (
    <div className="flex flex-col gap-24 bg-bg-primary p-24">
      <Table rows={CONTROL} />
      <div className="flex items-end gap-16">
        <div className="flex h-control-sm w-100 items-center justify-center rounded-4 bg-bg-tertiary font-label-small text-text-secondary">
          sm
        </div>
        <div className="flex h-control-md w-100 items-center justify-center rounded-4 bg-bg-tertiary font-label-small text-text-secondary">
          md
        </div>
        <div className="flex h-control-lg w-100 items-center justify-center rounded-4 bg-bg-tertiary font-label-small text-text-secondary">
          lg
        </div>
      </div>
    </div>
  ),
};
