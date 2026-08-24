import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { TextFieldPassword } from '../../components/TextFieldPassword/TextFieldPassword';
import { TextFieldText } from '../../components/TextFieldText/TextFieldText';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';

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
 * ## `<form>` 을 두지 않았고 CTA 에 핸들러가 없다
 * 가입 요청을 보낼 곳도, 성공·실패 화면도 Figma 에 없다. `Login` 과 같은 판정이다
 * (원칙 1). 이 화면으로 **들어오는** 길만 `Login` 의 회원가입 버튼에 연결했다.
 */
export function SignIn() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

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
        {/* 누르면 로그인 화면으로 돌아간다. 요청자 결정이 근거다 —
            "아이디, 비밀번호 인풋 입력하고 회원가입 버튼 눌러도 로그인 화면으로".

            입력값을 **검사하지 않는다.** 빈 값일 때의 처리(버튼 비활성 · 에러 문구)를
            Figma 가 그려 두지 않았고, `TextField*` 의 에러 variant 는 `isDisabled`
            없이는 켜지지도 않는다. 검사 규칙을 지어내지 않았다 (원칙 1).
            가입 요청을 보내는 것도 아니다 — 보낼 곳이 정해져 있지 않다.
            지금 이 버튼이 하는 일은 화면 이동뿐이고, 그것이 요청받은 범위다. */}
        <Button
          variant="filled-secondary"
          className="flex-1"
          onClick={() => navigate('/login')}
        >
          회원가입
        </Button>
      </div>

      {/* 27821:7173 */}
      <OSBarBottomNavigation />
    </div>
  );
}
