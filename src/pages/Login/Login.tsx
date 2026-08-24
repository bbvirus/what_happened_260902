import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { TextButton } from '../../components/TextButton/TextButton';
import { TextFieldPassword } from '../../components/TextFieldPassword/TextFieldPassword';
import { TextFieldText } from '../../components/TextFieldText/TextFieldText';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';
import { isEmail } from '../../lib/email';
import { supabase } from '../../lib/supabase';

/**
 * Figma `page/Login` (node 27818:7071).
 * 값 대조표와 판단 근거는 `Login.design.md` 에 있다.
 *
 * ## 새로 만든 컴포넌트가 없다
 * Figma 트리의 인스턴스 7종이 `src/components` 의 컴포넌트와 1:1 로 맞는다.
 * 이 파일이 직접 그리는 것은 Figma 의 **레이아웃 프레임 4개**뿐이고
 * (`Contents` 27818:7074 · `Fields` 27818:7076 · `Bottom` 27818:7079 ·
 * `CTA` 27818:7150), 그 프레임들은 시각 값으로 패딩과 간격만 갖는다.
 *
 * ## 세로 배치는 전부 flex column 이다. 절대 좌표가 없다
 * Figma 의 y 좌표는 auto-layout 의 결과라서 옮기지 않았다. 대신 프레임마다
 * 선언된 패딩·간격을 그대로 토큰 유틸리티로 옮기면 같은 좌표가 나온다:
 *
 * | Figma 노드 | 선언된 값 | 이 파일 |
 * |---|---|---|
 * | `Contents` 27818:7074 | padding-top 40 · left/right 20 | `pt-40 px-20` |
 * | `Fields` 27818:7076 | padding-top 64 · gap 40 | `pt-64 gap-40` |
 * | `Text Button` 27818:7080 | padding-y 20 · 가운데 정렬 | `py-20 justify-center` |
 * | `CTA` 27818:7150 | padding 8·20·20 · gap 8 | `pt-8 px-20 pb-20 gap-8` |
 *
 * `Contents` 의 Figma 높이 580 은 제약이 아니라 874 − (62 + 56 + 142 + 34) 의
 * 나머지다. 그래서 높이 토큰이 아니라 `flex-1` 로 옮겼다 — 남는 공간을 이 단이
 * 먹는다는 뜻이 같고, 화면 높이가 874 가 아닐 때도 하단 두 버튼이 아래에 붙는다.
 *
 * ## 하단 두 버튼의 1:1 분할은 Figma 가 지정한 값이다
 * `get_design_context(27818:7079)` 가 두 Button 인스턴스(27818:7151 · 27818:7152)에
 * flex-grow 1 · flex-shrink 0 · flex-basis 0 을 방출한다. 추정이 아니다.
 * `Button` 은 Figma 의 hug 를 옮겨 `inline-flex` 라서, 늘리는 것은 이 호출부가
 * `flex-1` 로 지정한다.
 *
 * ## 폭·높이
 * 폭 402 는 `OSBarTopNavigation` · `Header` · `OSBarBottomNavigation` 세 컴포넌트가
 * 각각 `w-mobile-frame-width` 로 이미 고정한다. 이 루트도 같은 토큰을 써서 가운데
 * `Contents` · `Bottom` 이 같은 폭을 갖게 한다.
 * 높이 874 에 대응하는 토큰은 없고, 874 는 기기 화면 높이라 컴포넌트가 정할 값이
 * 아니다. `App.tsx` 가 이미 쓰는 `min-h-dvh` 로 옮겼다 — 뷰포트 상대 단위라
 * 치수 리터럴이 아니다.
 *
 * ## 로그인 요청은 Supabase Auth 로 간다
 * `src/lib/supabase.ts` 의 클라이언트 하나를 쓴다 (요청자 지시). 새로 만들지 않는다.
 *
 * **아이디 필드에 들어오는 값은 이메일이다.** `signInWithPassword` 는 email 또는
 * phone 으로만 인증하고, 이 화면에는 phone 필드가 없다. 아이디를 이메일로 볼지
 * 도메인을 붙여 합성할지는 요청자가 정했다 — **이메일 그대로 넘긴다.**
 * 라벨과 placeholder 는 Figma 값이라 바꾸지 않았다 (원칙 3). 이메일이 아닌 값을
 * 넣으면 Supabase 가 거절하고, 그 문구가 아래 필드 하단에 그대로 뜬다.
 *
 * ## 이메일 형식 검사만 화면에서 한다
 * 아이디 필드 값이 이메일 형식이 아니면 요청을 보내지 않고 **아이디 필드만** error
 * 상태로 만들어 "이메일을 입력해주세요" 를 그 필드 하단에 띄운다 (요청자 지시).
 * 판정은 `src/lib/email.ts` 의 `isEmail` 하나이고, `SignIn` 과 같은 함수를 쓴다.
 *
 * 이 화면이 자체적으로 하는 검사는 이것뿐이다. 빈 값·비밀번호 규칙 등 나머지 판정은
 * 여전히 Supabase 가 하고, 그 결과는 두 필드를 함께 error 로 만든다 (원칙 1).
 *
 * ## 실패 표시에 `isDisabled` 가 함께 붙는 이유
 * `TextFieldText`·`TextFieldPassword` 의 타입이 `isError` 를 `isDisabled: true` 와만
 * 짝지어 받는다. Figma 세트(13:2188)에 그 조합(13:2204)만 저작돼 있기 때문이다.
 * 두 컴포넌트에서 `isDisabled` 는 **색만** 바꾸고 `<input disabled>` 를 걸지 않으며,
 * `isError` 가 켜지면 그 색 변경마저 건너뛴다. 그래서 이 조합이 실제로 만드는 것은
 * `border/negative` 테두리 + 에러 보조 문구뿐이고, 입력은 계속 된다.
 * 컴포넌트의 타입을 이 화면 때문에 넓히지 않았다 (원칙 3).
 *
 * ## `<form>` 은 여전히 두지 않았다
 * 두 버튼은 `Button` 기본값인 `type="button"` 이고, 요청은 클릭 핸들러가 보낸다.
 * `<form>` 으로 감싸면 Enter 제출이 생기는데, 그것은 요청 범위 밖의 동작 추가다.
 */
export function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  // 요청이 날아가 있는 동안 true. 하단 두 버튼을 함께 잠근다 (요청자 지시).
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 인증 실패. null 이 아니면 두 필드가 error 상태다 — 아이디·비밀번호 중 어느 쪽이
  // 틀렸는지 Supabase 가 알려주지 않는다. 문구는 비밀번호 필드 하단에 한 번만 뜬다.
  const [error, setError] = useState<string | null>(null);
  // 아이디 필드 하나만의 문제(이메일 형식). 그 필드 하단에 뜬다.
  const [idError, setIdError] = useState<string | null>(null);

  // 위 "실패 표시에 `isDisabled` 가 함께 붙는 이유" 참조.
  const ERROR_PROPS = { isDisabled: true, isError: true } as const;
  const idErrorProps = error !== null || idError !== null ? ERROR_PROPS : {};
  const passwordErrorProps = error !== null ? ERROR_PROPS : {};

  async function handleSignIn() {
    setError(null);
    setIdError(null);

    // 형식이 아니면 요청 자체를 보내지 않는다. Supabase 도 거절하지만 그 문구는
    // 영문이고 비밀번호 필드 하단에 뜬다 — 요청받은 것은 아이디 필드의 우리 문구다.
    if (!isEmail(id)) {
      setIdError('이메일을 입력해주세요');
      return;
    }

    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: id,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      // 자격 증명 실패만 우리 문구로 바꾼다. 나머지(이메일 형식·네트워크·설정 오류)는
      // Supabase 문구를 그대로 보여준다 — 실패를 한 문장으로 덮지 않는다 (원칙 4).
      setError(
        signInError.code === 'invalid_credentials'
          ? '아이디 또는 비밀번호를 확인해 주세요'
          : signInError.message,
      );
      return;
    }

    navigate('/consent');
  }

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      {/* 27818:7072 */}
      <OSBarTopNavigation />

      {/* 27818:7073 — 이 화면은 타이틀이 없다. Figma 인스턴스가 hasTitle=false 다.
          `title` 은 Header 의 필수 prop 이라 값을 비워 넘긴다 — hasTitle=false 면
          렌더되지 않는 자리다. Header 의 타입을 이 화면 때문에 고치지 않았다 (원칙 3). */}
      <Header title="" hasTitle={false} />

      {/* Contents 27818:7074 */}
      <div className="flex flex-1 flex-col items-start px-20 pt-40">
        {/* 27818:7075 — size=xl (세트 기본값). description 은 이 인스턴스에 없다.
            두 줄로 끊긴 것은 Figma 텍스트 노드의 내용이고 컴포넌트 속성이 아니라서
            (TextSetTitle.tsx 의 "넣지 않은 것" 절) 줄바꿈을 여기서 넣는다. */}
        <TextSetTitle
          title={
            <>
              아이디와 비밀번호를
              <br />
              입력해 주세요
            </>
          }
        />

        {/* Fields 27818:7076 */}
        <div className="flex w-full flex-col gap-40 pt-64">
          {/* 27818:7077 — 이 인스턴스는 필수 표시 `*` 가 꺼져 있다. 라벨 content
              `I27818:7077;13:2201;35:14371` 안에 텍스트 노드가 하나뿐이다. */}
          <TextFieldText
            label="아이디"
            required={false}
            {...idErrorProps}
            supporting={idError ?? undefined}
            input={{
              id: 'login-id',
              name: 'username',
              value: id,
              // Figma 27818:7077 의 문구가 그대로 placeholder 다 (변수 text/disabled-onLight).
              placeholder: '아이디를 입력해 주세요',
              autoComplete: 'username',
              onChange: (event) => setId(event.target.value),
            }}
            onClear={() => setId('')}
          />

          {/* 27818:7078 — 필수 표시 `*` 가 켜져 있다 (`required` 기본값 그대로).
              placeholder 를 넘기지 않는 이유: Figma 의 `● ● ● ● ● ●` 는 값이 채워진
              필드를 그린 샘플이지 안내 문구가 아니다. 실제 마스킹은 브라우저가 한다.
              대신할 안내 문구는 Figma 에 없어서 지어내지 않았다 (원칙 1). */}
          <TextFieldPassword
            label="비밀번호"
            {...passwordErrorProps}
            supporting={error ?? undefined}
            input={{
              id: 'login-password',
              name: 'password',
              value: password,
              autoComplete: 'current-password',
              onChange: (event) => setPassword(event.target.value),
            }}
            onClear={() => setPassword('')}
          />
        </div>
      </div>

      {/* Bottom 27818:7079 */}
      <div className="flex w-full flex-col">
        {/* Text Button 27818:7080 */}
        <div className="flex w-full items-center justify-center py-20">
          {/* 27818:7081 — color 는 기본값 secondary 다 (Figma 변수 text/secondary). */}
          <TextButton>아이디 · 비밀번호 찾기</TextButton>
        </div>

        {/* Bottom 27818:7149 → CTA 27818:7150 */}
        <div className="flex w-full gap-8 px-20 pt-8 pb-20">
          {/* 27818:7151 — hierarchy=secondary.
              회원가입 화면(`page/Login/SignIn` 27821:7158)으로 넘어간다. 요청자 결정:
              "로그인 화면에서 회원가입을 누르면 회원가입 화면으로 넘어갈 수 있게".
              Figma 에는 두 프레임을 잇는 프로토타입 연결이 없어 이동 자체는 Figma
              근거가 아니라 이 결정이 근거다. */}
          <Button
            variant="filled-secondary"
            className="flex-1"
            isDisabled={isSubmitting}
            onClick={() => navigate('/signin')}
          >
            회원가입
          </Button>
          {/* 27818:7152 — hierarchy=primary (Button 의 기본값이지만, 두 버튼이 나란히
              있어 서로의 대비가 읽는 사람에게 의미를 갖는 자리라 명시한다)

              약관 동의 화면(`page/Consent` 27683:3187)으로 넘어간다. 요청자 결정이
              근거다 — Figma 에는 두 프레임을 잇는 프로토타입 연결이 없고, 로그인
              성공·실패 화면도 없다.

              `signInWithPassword` 성공 시에만 이동한다. 목적지 `/consent` 는 이 버튼이
              원래 갖고 있던 이동처를 그대로 둔 것이다 — 성공 후 어디로 갈지는 이번
              요청에 없어서 바꾸지 않았다 (원칙 3).

              **화면에서 하는 검사는 아이디의 이메일 형식 하나뿐이다** (요청자 지시).
              빈 값·비밀번호 규칙 등은 규칙이 정해져 있지 않아 지어내지 않고 Supabase 의
              판정을 그대로 받아 두 필드를 error 상태로 만든다 (원칙 1).
              버튼이 잠기는 유일한 조건은 "요청 처리 중"이다. */}
          <Button
            variant="filled-primary"
            className="flex-1"
            isDisabled={isSubmitting}
            onClick={handleSignIn}
          >
            로그인
          </Button>
        </div>
      </div>

      {/* 27818:7084 */}
      <OSBarBottomNavigation />
    </div>
  );
}
