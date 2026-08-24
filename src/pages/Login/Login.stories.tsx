import type { Meta, StoryObj } from '@storybook/react';
import { Login } from './Login';

/** Figma `page/Login` (node 27818:7071). */
const FIGMA_URL =
  'https://www.figma.com/design/7DxkWa12fiJWOrvPIDWUcp/-LG%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4--%EC%8B%A4%EC%8A%B5%EC%9E%90%EB%A3%8C---%EB%AA%A8%EB%B0%94%EC%9D%BC-%EB%B2%84%EC%A0%84?node-id=27818-7071';

const meta = {
  title: 'Pages/Login',
  component: Login,
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
          'Figma `page/Login` (node 27818:7071). `src/components` 의 컴포넌트 7종을 조립한 화면입니다. ' +
          '**새로 만든 컴포넌트는 없습니다.**\n\n' +
          '위에서 아래로: `OSBarTopNavigation` → `Header`(`hasTitle=false`) → `TextSetTitle`(`size=xl`) → ' +
          '`TextFieldText`(아이디) → `TextFieldPassword`(비밀번호) → `TextButton` → `Button` × 2 → ' +
          '`OSBarBottomNavigation`.\n\n' +
          '**두 필드는 실제로 입력됩니다.** 타이핑해 보면 Figma 세트에 저작된 조합 4개가 ' +
          '그대로 나타납니다 — 포커스 시 링(`focused`), 값이 있으면 본문색 + 지우기 버튼(`isTyping`), ' +
          '포커스가 빠지면 `done`. 비밀번호의 눈 아이콘은 표시/숨김을 토글합니다.\n\n' +
          '**아이디 라벨에는 `*` 가 없고 비밀번호에는 있습니다.** Figma 인스턴스 27818:7077 이 ' +
          '필수 표시 노드를 끈 것을 `required={false}` 로 옮긴 것입니다. 근거는 `Login.design.md` 참조.\n\n' +
          '**[로그인] 은 Supabase Auth 로 요청을 보냅니다.** `signInWithPassword` 를 호출하고, ' +
          '성공하면 `/consent` 로 이동합니다. 실패하면 두 필드가 error 상태가 되고 비밀번호 필드 ' +
          '하단에 사유가 뜹니다. 아이디 필드에는 **이메일**을 넣습니다 — Auth 가 email/phone 으로만 ' +
          '인증하고 이 화면에 phone 이 없습니다. [회원가입] 은 `/signin` 으로 이동합니다. ' +
          '요청 처리 중에는 두 버튼이 모두 비활성화됩니다.\n\n' +
          '**아이디가 이메일 형식이 아니면 요청을 보내지 않습니다.** 아이디 필드만 error 상태가 되고 ' +
          '그 아래에 "이메일을 입력해주세요" 가 뜹니다 (`src/lib/email.ts` 의 `isEmail`). ' +
          '이 경로는 네트워크를 타지 않아 Supabase 설정 없이도 확인할 수 있습니다.\n\n' +
          '⚠ 이 스토리는 실제 Supabase 프로젝트로 요청을 보냅니다. `.env.local` 의 ' +
          '`VITE_SUPABASE_URL`·`VITE_SUPABASE_ANON_KEY` 가 없으면 클라이언트 생성 단계에서 실패합니다.\n\n' +
          '`<form>` 은 두지 않았습니다 — 요청은 클릭 핸들러가 보냅니다.',
      },
    },
  },
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 27818:7071 그대로. 두 필드가 비어 있는 최초 상태입니다. */
export const Default: Story = {};
