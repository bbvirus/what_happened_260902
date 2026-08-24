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
 * ## `<form>` 을 두지 않았다
 * 제출 대상이 정해져 있지 않다. 로그인 요청을 보낼 곳도, 성공·실패 화면도 Figma 에
 * 없어서 `onSubmit` 이 할 일을 지어내야 한다. 지어내지 않았다 (원칙 1).
 * 두 버튼은 `Button` 기본값인 `type="button"` 이다.
 */
export function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

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
          <Button variant="filled-secondary" className="flex-1" onClick={() => navigate('/signin')}>
            회원가입
          </Button>
          {/* 27818:7152 — hierarchy=primary (Button 의 기본값이지만, 두 버튼이 나란히
              있어 서로의 대비가 읽는 사람에게 의미를 갖는 자리라 명시한다)

              약관 동의 화면(`page/Consent` 27683:3187)으로 넘어간다. 요청자 결정이
              근거다 — Figma 에는 두 프레임을 잇는 프로토타입 연결이 없고, 로그인
              성공·실패 화면도 없다.

              입력값을 **검사하지 않는다.** 빈 값일 때의 처리(버튼 비활성 · 에러 문구)를
              Figma 가 그려 두지 않았다. 검사 규칙을 지어내지 않았다 (원칙 1).
              로그인 요청을 보내는 것도 아니다 — 보낼 곳이 정해져 있지 않다.
              지금 이 버튼이 하는 일은 화면 이동뿐이고, 그것이 요청받은 범위다.
              `SignIn` 의 회원가입 버튼이 같은 자리에서 내린 판단과 같다. */}
          <Button variant="filled-primary" className="flex-1" onClick={() => navigate('/consent')}>
            로그인
          </Button>
        </div>
      </div>

      {/* 27818:7084 */}
      <OSBarBottomNavigation />
    </div>
  );
}
