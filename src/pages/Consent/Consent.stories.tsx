import type { Meta, StoryObj } from '@storybook/react';
import { Consent } from './Consent';

/** Figma `page/Consent` (node 27683:3187). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27683-3187';

const meta = {
  title: 'Pages/Consent',
  component: Consent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // @storybook/addon-designs — Design 탭에 Figma 노드를 그대로 띄웁니다.
    design: {
      type: 'figma',
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          'Figma `page/Consent` (node 27683:3187). `src/components` 의 컴포넌트 7종을 조립한 화면입니다.\n\n' +
          '위에서 아래로: `OSBarTopNavigation` → `Header`(`hasTitle=false`) → `TextSetTitle`(`size=xl`) → ' +
          '`ListCheckbox`(전체동의 행) → `Divider` → `ListCheckbox` × 4(`size="compact"`) → ' +
          '`Button` → `OSBarBottomNavigation`.\n\n' +
          '**`ListCheckbox` 에 축 3개를 추가했습니다.** 이 화면이 Figma 에서 실제로 쓰는 값입니다 — ' +
          '전체동의 행은 `slot-end` 가 `hidden`(→ `hasIconEnd={false}`), 약관 4행은 상하 패딩 20 · ' +
          '`Divider` 가 `hidden`(→ `size="compact"` · `hasDivider={false}`). ' +
          '세 기본값이 기존 렌더 결과와 같아 다른 호출부는 바뀌지 않았습니다. ' +
          '축 이름의 출처와 한계는 `ListCheckbox.design.md` 참조.\n\n' +
          '**5개 행은 서로 독립으로 토글됩니다.** 첫 행의 라벨이 Figma 에서 기본 플레이스홀더 ' +
          '`타이틀 영역입니다.` 로 남아 있고(디자이너 미오버라이드), 그 행과 아래 4행의 연동은 ' +
          'Figma·요구사항 어디에도 정의돼 있지 않습니다. "전체 동의" 로 읽고 select-all 을 만드는 것은 ' +
          '추정이라 넣지 않았습니다. 근거는 `Consent.design.md` 참조.\n\n' +
          '**전체동의 행 아래 구분선이 두 겹입니다.** 행이 자기 구분선을 그리고(y=111) 그 바로 아래 ' +
          '독립 `Divider` 인스턴스 27683:3194 가 또 있습니다(y=112). Figma 파일의 실제 상태이며 ' +
          '눈대중으로 하나를 지우지 않았습니다.\n\n' +
          '**화면 이동은 요청자 결정입니다 — Figma 에는 프로토타입 연결이 없습니다.** ' +
          '헤더 뒤로가기 → `/login`, CTA "동의하고 계속하기" → `/benefit` 입니다. ' +
          '뒤로가기를 `navigate(-1)` 이 아니라 `/login` 으로 고정한 이유는 `SignIn` 과 같습니다 — ' +
          '직접 URL 로 들어오면 히스토리에 돌아갈 곳이 없어 `-1` 이 앱 밖으로 나갑니다.\n\n' +
          '**CTA 는 하나도 체크되지 않으면 비활성입니다** (요청자 결정). 조건은 "5개 행 중 ' +
          '하나라도 켜졌는가" 하나뿐입니다 — `[필수]`·`[선택]` 은 Figma 텍스트 노드의 **문구**이지 ' +
          '컴포넌트 속성이 아니고 첫 행 라벨은 플레이스홀더라, 문구를 파싱해 필수 약관을 판정하지 ' +
          '않았습니다 (원칙 1). Figma 인스턴스 27683:3202 는 활성 variant 하나뿐이라 비활성 모양의 ' +
          '근거도 Figma 가 아니라 `Button` 의 `isDisabled` 입니다.\n\n' +
          '셰브론에는 여전히 이동이 없습니다 — 약관 상세 화면이 Figma 에 없습니다. ' +
          '`<form>` 도 두지 않았고, 동의 요청을 보내지도 않습니다.\n\n' +
          '접근성 시맨틱(`role="group"` · 행마다 `role="checkbox"` · `aria-checked` · `tabIndex` · ' +
          'Space 토글)은 이 화면이 붙입니다. `ListCheckbox.design.md` 의 책임 분리표에서 호스트 몫으로 ' +
          '정해 둔 부분입니다.',
      },
    },
  },
} satisfies Meta<typeof Consent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 27683:3187 그대로. 5개 행이 모두 꺼진 최초 상태입니다. */
export const Default: Story = {};
