import type { Meta, StoryObj } from '@storybook/react';

/**
 * Elevation(shadow) 토큰 시각화.
 *
 * 대상: design-tokens.css 의 --shadow-sm / -md / -lg.
 *
 * ⚠ 이 세 토큰은 Figma 출처가 없다. design-tokens.css 주석에 "Figma 에 shadow
 * 변수도, shadow 가이드 프레임도 존재하지 않는다 — 기존 저장소 값을 그대로
 * 유지한다"고 적혀 있다. 그래서 이 페이지에는 Design 탭(Figma URL)이 없고,
 * 용도 설명도 붙이지 않는다. 용도는 Figma 에서 확인된 뒤에 채운다.
 *
 * 그림자 값 자체(offset·blur·alpha)는 여기 옮겨 적지 않는다. raw 값을 소스에
 * 두지 않기 위한 것이며, 값은 design-tokens.css 가 단일 진실 공급원이다.
 */

type ShadowToken = {
  /** 토큰 이름. --shadow- 접두어를 뗀 형태 = 유틸리티 접미어 */
  name: string;
  /** 카드에 적용할 유틸리티. Tailwind 스캔을 위해 완전한 문자열로 적는다 */
  shadow: string;
};

const SHADOWS: ShadowToken[] = [
  { name: 'sm', shadow: 'shadow-sm' },
  { name: 'md', shadow: 'shadow-md' },
  { name: 'lg', shadow: 'shadow-lg' },
];

function Card({ name, shadow }: ShadowToken) {
  return (
    <div className="flex flex-col items-center gap-12">
      <div
        className={`flex h-100 w-100 items-center justify-center rounded-8 bg-bg-primary font-label-medium-700 text-text-primary ${shadow}`}
      >
        {name}
      </div>
      <div className="font-label-small text-text-tertiary">{shadow}</div>
    </div>
  );
}

const meta: Meta = {
  title: 'Design Tokens/Elevation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'design-tokens.css 의 그림자 토큰. 유틸리티는 `shadow-<이름>` 이다',
          '(`shadow-sm` · `shadow-md` · `shadow-lg`).',
          '',
          '⚠ Figma 출처 없음. 세 값 모두 Figma 변수나 가이드 프레임에서 온 것이 아니라',
          '저장소에 원래 있던 값이다 (토큰 파일 주석 기준). 그래서 Design 탭을 붙이지',
          '않았고, 단계별 용도도 비워 뒀다.',
          '',
          '값(offset·blur·alpha)은 이 페이지에 적지 않는다 — design-tokens.css 를 본다.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 흰 배경 위. 밝은 면에서의 그림자 세기 비교. */
export const OnLight: Story = {
  render: () => (
    <div className="flex flex-wrap gap-40 bg-bg-primary p-40">
      {SHADOWS.map((token) => (
        <Card key={token.name} {...token} />
      ))}
    </div>
  ),
};

/** 회색 배경 위. 배경이 흰색이 아닐 때 각 단계가 구분되는지 확인한다. */
export const OnTertiary: Story = {
  render: () => (
    <div className="flex flex-wrap gap-40 bg-bg-tertiary p-40">
      {SHADOWS.map((token) => (
        <Card key={token.name} {...token} />
      ))}
    </div>
  ),
};
