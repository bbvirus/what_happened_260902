import type { Meta, StoryObj } from '@storybook/react';
import { SignIn } from './SignIn';

/** Figma `page/Login/SignIn` (node 27821:7158). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27821-7158';

const meta = {
  title: 'Pages/SignIn',
  component: SignIn,
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
          'Figma `page/Login/SignIn` (node 27821:7158). 회원가입 화면입니다. ' +
          '**새로 만든 컴포넌트도, 새로 추가한 토큰도 없습니다.**\n\n' +
          '위에서 아래로: `OSBarTopNavigation` → `Header`(`hasTitle=false`) → ' +
          '`TextSetTitle`(`size=xl`, 한 줄) → `TextFieldText`(아이디) → ' +
          '`TextFieldPassword`(비밀번호) → `Button`(`filled-secondary`, 폭 전체) → ' +
          '`OSBarBottomNavigation`.\n\n' +
          '**`Pages/Login` 과 다른 점은 셋뿐입니다** — 타이틀이 한 줄, 하단 TextButton 행이 없음, ' +
          'CTA 가 하나이고 폭을 다 씀. 나머지는 노드 단위로 같습니다. ' +
          '타이틀 `size` 는 Login 과 동일한 `xl` 입니다 (높이 72 → 36 은 크기가 아니라 줄 수 차이).\n\n' +
          '**두 필드는 실제로 입력됩니다.** 비밀번호의 눈 아이콘은 표시/숨김을 토글합니다.\n\n' +
          '`<form>` 과 CTA 핸들러는 두지 않았습니다 — 가입 요청을 보낼 곳이 Figma·요구사항 ' +
          '어디에도 정의돼 있지 않습니다. 근거는 `SignIn.design.md` 참조.',
      },
    },
  },
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 27821:7158 그대로. 두 필드가 비어 있는 최초 상태입니다. */
export const Default: Story = {};
