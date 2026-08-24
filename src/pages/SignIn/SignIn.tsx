import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { TextFieldPassword } from '../../components/TextFieldPassword/TextFieldPassword';
import { TextFieldText } from '../../components/TextFieldText/TextFieldText';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';
import { isEmail } from '../../lib/email';
import { supabase } from '../../lib/supabase';

/**
 * Figma `page/Login/SignIn` (node 27821:7158).
 * 값 대조표와 판단 근거는 `SignIn.design.md` 에 있다.
 *
 * ## `page/Login`(27818:7071) 과 다른 점은 셋뿐이다
 * 나머지(폭·배경·Header·Contents 패딩·Fields 간격·두 필드의 라벨과 필수 표시)는
 * 노드 단위로 같다. `get_design_context` 두 개를 대조해 확인했다.
 *
 * 1. **타이틀이 한 줄이다.** `size` 는 여전히 `xl` 이다 — 방출된 타이포가 Login 과
 *    같은 `font/display/medium-strong`(28 · 행간 1.3 · 자간 −0.56)이고, 컴포넌트
 *    설명 노드도 `27683:4427`(= size=xl) 이다. Figma 높이가 72 → 36 으로 준 것은
 *    크기가 바뀐 게 아니라 줄 수가 2 → 1 로 준 결과다 (28 × 1.3 = 36.4 ≈ 36).
 * 2. **하단 TextButton 행이 없다.** Login 의 `Text Button`(27818:7080, "아이디 ·
 *    비밀번호 찾기")에 해당하는 노드가 이 프레임에 없다. 그래서 `Bottom` 높이가
 *    142 → 83 이고 `Contents` 가 580 → 639 로 그만큼 늘어난다.
 * 3. **CTA 버튼이 하나이고 폭을 다 쓴다.** `27821:7171` 하나뿐이고 폭 362 =
 *    402 − 20 − 20 이다. `hierarchy=secondary` 라 `filled-secondary` 다.
 *
 * ## `Bottom` 두 단을 접었다
 * Figma 는 `Bottom`(27821:7166) → `Bottom`(27821:7169) → `CTA`(27821:7170) 3단인데
 * 앞의 두 단은 시각 값을 하나도 갖지 않고 자식도 하나씩이다. 패딩을 갖는 것은 `CTA`
 * 하나뿐이라 한 요소로 합쳤다 (CLAUDE.md 원칙 2, `Divider`·`TextButton` 과 같은 판단).
 * Login 쪽에서 `Bottom` 을 남긴 이유는 그쪽엔 자식이 둘(TextButton 행 + CTA)이라
 * 세로로 쌓는 단이 실제로 필요했기 때문이다.
 *
 * ## 세로 배치는 전부 flex column 이다. 절대 좌표가 없다
 * | Figma 노드 | 선언된 값 | 이 파일 |
 * |---|---|---|
 * | `Contents` 27821:7161 | padding-top 40 · left/right 20 | `pt-40 px-20` |
 * | `Fields` 27821:7163 | padding-top 64 · gap 40 | `pt-64 gap-40` |
 * | `CTA` 27821:7170 | padding 8·20·20 | `pt-8 px-20 pb-20` |
 *
 * 검산: `Contents` 안에서 TextSetTitle 이 y=40 (= pt-40), `Fields` 가 y=76
 * (= 40 + 36), 그 안 첫 필드가 y=64 (= pt-64), 둘째가 y=190 (= 64 + 86 + 40).
 * 프레임 합도 맞는다 — 62 + 56 + 639 + 83 + 34 = 874.
 *
 * ## 가입 요청은 Supabase Auth 로 간다
 * `src/lib/supabase.ts` 의 클라이언트 하나를 쓴다 (요청자 지시). 새로 만들지 않는다.
 * 아이디 필드 값을 이메일로 그대로 넘기는 판단, 실패 표시에 `isDisabled` 가 함께
 * 붙는 이유는 `Login.tsx` 의 같은 이름 절에 적혀 있다 — 두 화면이 같은 판단이다.
 *
 * 성공 경로는 세 단계다: `auth.signUp` → `profiles` 에 본인 행 1개 → `/login` 이동.
 * `profiles.username` 에는 이메일의 `@` 앞부분을 넣는다 (요청자 결정).
 *
 * 아이디 필드 값이 이메일 형식이 아니면 요청을 보내지 않고 **아이디 필드만** error
 * 상태로 만들어 "이메일을 입력해주세요" 를 그 필드 하단에 띄운다 (요청자 지시).
 * 판정은 `src/lib/email.ts` 의 `isEmail` 하나이고, `Login` 과 같은 함수를 쓴다.
 *
 * ## 세션이 없으면 `profiles` 행을 만들지 않는다
 * `profiles` 의 RLS 는 INSERT 에 `authenticated` 롤과 `auth.uid() = id` 를 요구한다
 * (정책 `profiles_insert_own`). 프로젝트에 이메일 확인이 켜져 있으면 `signUp` 직후
 * 세션이 없어서 이 조건을 만족할 수 없다. 그때는 행을 만들지 않고 "인증 후 로그인"
 * 안내만 띄운다 — 확인 링크를 누르고 로그인한 뒤에 만들어져야 하는 행이다.
 * 두 경우 모두에서 동작하도록 세션 유무로 분기한다 (요청자 결정).
 *
 * ## `<form>` 은 여전히 두지 않았다
 * CTA 는 `Button` 기본값인 `type="button"` 이고, 요청은 클릭 핸들러가 보낸다.
 * `Login` 과 같은 판단이다.
 */
export function SignIn() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  // 요청이 날아가 있는 동안 true. CTA 를 잠근다 (요청자 지시).
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 가입 실패. null 이 아니면 두 필드가 error 상태다. 문구는 비밀번호 필드 하단에 한 번.
  const [error, setError] = useState<string | null>(null);
  // 아이디 필드 하나만의 문제(이메일 형식). 그 필드 하단에 뜬다.
  const [idError, setIdError] = useState<string | null>(null);
  // 실패가 아니라 안내다 (이메일 확인 대기). error 와 동시에 켜지지 않는다.
  const [notice, setNotice] = useState<string | null>(null);

  // Login.tsx 의 "실패 표시에 `isDisabled` 가 함께 붙는 이유" 참조.
  const ERROR_PROPS = { isDisabled: true, isError: true } as const;
  const idErrorProps = error !== null || idError !== null ? ERROR_PROPS : {};
  const passwordErrorProps = error !== null ? ERROR_PROPS : {};

  async function handleSignUp() {
    setError(null);
    setIdError(null);
    setNotice(null);

    // 형식이 아니면 요청 자체를 보내지 않는다. Login 과 같은 판단이다.
    if (!isEmail(id)) {
      setIdError('이메일을 입력해주세요');
      return;
    }

    setIsSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: id,
      password,
    });

    if (signUpError) {
      setIsSubmitting(false);
      // Supabase 문구를 그대로 보여준다 — 실패를 한 문장으로 덮지 않는다 (원칙 4).
      setError(signUpError.message);
      return;
    }

    // 이미 가입된 이메일인데 이메일 확인이 켜져 있으면 Supabase 는 error 를 주지 않고
    // identities 가 빈 사용자를 돌려준다 (계정 존재 여부를 노출하지 않기 위한 동작).
    // 이 경우를 성공으로 읽으면 아래 INSERT 가 조용히 실패한다.
    if (data.user !== null && data.user.identities?.length === 0) {
      setIsSubmitting(false);
      setError('이미 가입된 아이디입니다');
      return;
    }

    // 세션이 없다 = 이메일 확인이 켜져 있다. 위 "세션이 없으면 …" 절 참조.
    if (data.session === null || data.user === null) {
      setIsSubmitting(false);
      setNotice('가입 확인 메일을 보냈습니다. 인증을 마친 뒤 로그인해 주세요');
      return;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: id.split('@')[0],
    });

    setIsSubmitting(false);

    if (profileError) {
      // 계정은 만들어졌는데 프로필 행만 없는 상태다. 이동시키지 않고 그대로 알린다 (원칙 4).
      setError(`계정은 만들어졌지만 프로필 저장에 실패했습니다: ${profileError.message}`);
      return;
    }

    navigate('/login');
  }

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      {/* 27821:7159 */}
      <OSBarTopNavigation />

      {/* 27821:7160 — Login 과 같이 hasTitle=false 다. 화면 제목 "회원가입" 은
          Header 가 아니라 아래 TextSetTitle 이 그린다.

          뒤로가기로 로그인 화면에 돌아간다. 요청자 결정이 근거다 — Figma 의
          27657:3125 에는 클릭 축이 없다. `navigate(-1)` 이 아니라 `/login` 을
          명시하는 이유: 이 화면에 직접 URL 로 들어온 경우 히스토리에 돌아갈 곳이
          없어 `-1` 이 앱 밖으로 나가 버린다. 요청은 "로그인으로 돌아가게" 이므로
          목적지를 고정한다. */}
      <Header title="" hasTitle={false} onSlotStartClick={() => navigate('/login')} />

      {/* Contents 27821:7161 */}
      <div className="flex flex-1 flex-col items-start px-20 pt-40">
        {/* 27821:7162 — size=xl (세트 기본값). 한 줄이라 <br /> 이 없다.
            description 노드도 없다. */}
        <TextSetTitle title="회원가입" />

        {/* Fields 27821:7163 — Login 27818:7076 과 노드 단위로 같다. */}
        <div className="flex w-full flex-col gap-40 pt-64">
          {/* 27821:7164 — 필수 표시 `*` 가 꺼져 있다. 라벨 content
              `I27821:7164;13:2201;35:14371` 안에 텍스트 노드가 하나뿐이다. */}
          <TextFieldText
            label="아이디"
            required={false}
            {...idErrorProps}
            supporting={idError ?? undefined}
            input={{
              id: 'signin-id',
              name: 'username',
              value: id,
              placeholder: '아이디를 입력해 주세요',
              autoComplete: 'username',
              onChange: (event) => setId(event.target.value),
            }}
            onClear={() => setId('')}
          />

          {/* 27821:7165 — 필수 표시 `*` 가 켜져 있다 (`required` 기본값 그대로).
              placeholder 를 넘기지 않는 근거는 Login 과 같다 — Figma 의
              `● ● ● ● ● ●` 는 값이 채워진 필드를 그린 샘플이지 안내 문구가 아니다.
              새 계정의 비밀번호라 autoComplete 은 `new-password` 다. */}
          <TextFieldPassword
            label="비밀번호"
            {...passwordErrorProps}
            supporting={error ?? notice ?? undefined}
            input={{
              id: 'signin-password',
              name: 'new-password',
              value: password,
              autoComplete: 'new-password',
              onChange: (event) => setPassword(event.target.value),
            }}
            onClear={() => setPassword('')}
          />
        </div>
      </div>

      {/* CTA 27821:7170 — 위 "Bottom 두 단을 접었다" 참조.
          27821:7171 하나뿐이고 폭을 다 쓴다. Figma 가 flex-grow 1 · basis 0 을
          방출하고, `Button` 은 hug(`inline-flex`)라서 늘리는 것은 이 호출부다. */}
      <div className="flex w-full px-20 pt-8 pb-20">
        {/* 가입 요청을 보내고, `profiles` 행까지 만들어진 경우에만 로그인 화면으로
            이동한다. 이동처 `/login` 은 요청자 지시다.

            **화면에서 하는 검사는 아이디의 이메일 형식 하나뿐이다** (요청자 지시).
            빈 값·비밀번호 길이 규칙 등은 정해져 있지 않아 지어내지 않고 Supabase 의
            판정을 그대로 받아 두 필드를 error 상태로 만든다 (원칙 1).
            버튼이 잠기는 유일한 조건은 "요청 처리 중"이다. */}
        <Button
          variant="filled-secondary"
          className="flex-1"
          isDisabled={isSubmitting}
          onClick={handleSignUp}
        >
          회원가입
        </Button>
      </div>

      {/* 27821:7173 */}
      <OSBarBottomNavigation />
    </div>
  );
}
