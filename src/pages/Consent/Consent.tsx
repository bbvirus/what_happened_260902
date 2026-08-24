import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Divider } from '../../components/Divider/Divider';
import { Header } from '../../components/Header/Header';
import { ListCheckbox } from '../../components/ListCheckbox/ListCheckbox';
import { OSBarBottomNavigation } from '../../components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '../../components/OSBarTopNavigation/OSBarTopNavigation';
import { TextSetTitle } from '../../components/TextSetTitle/TextSetTitle';

/**
 * `Items` 프레임 27683:3195 의 자식 4개. 문구는 Figma 텍스트 노드 그대로다.
 * `id` 는 체크 상태를 담을 키이며 Figma 값이 아니다 — 노드 ID 를 키로 쓰면
 * 파일이 갱신될 때 상태 키가 통째로 갈리므로 의미 기반 키를 따로 둔다.
 */
const AGREEMENT_ROWS = [
  { id: 'terms', node: '27683:3196', title: '[필수] 서비스 이용약관' },
  { id: 'privacy', node: '27683:3197', title: '[필수] 개인정보 수집·이용 동의' },
  { id: 'unique-id', node: '27683:3198', title: '[필수] 고유식별정보 처리 동의' },
  { id: 'marketing', node: '27683:3199', title: '[선택] 마케팅 정보 수신 동의' },
] as const;

/**
 * Figma `page/Consent` (node 27683:3187).
 * 값 대조표와 판단 근거는 `Consent.design.md` 에 있다.
 *
 * ## 새로 만든 컴포넌트가 없다
 * Figma 트리의 인스턴스 8종이 `src/components` 의 컴포넌트와 1:1 로 맞는다.
 * 이 파일이 직접 그리는 것은 Figma 의 **레이아웃 프레임 4개**뿐이고
 * (`Contents` 27683:3190 · `Agreements` 27683:3192 · `Items` 27683:3195 ·
 * `Bottom`/`CTA` 27683:3200·3201), 그 프레임들은 시각 값으로 패딩만 갖는다.
 *
 * `ListCheckbox` 에는 축 3개(`size` · `hasIconEnd` · `hasDivider`)를 **추가했다.**
 * Figma 가 이 화면에서 실제로 그 값들을 쓰고 있어서다 — 근거는 아래 표와
 * `ListCheckbox.design.md` 의 "나중에 늘어난 축 3개" 절에 있다.
 *
 * ## 세로 배치는 전부 flex column 이다. 절대 좌표가 없다
 * Figma 의 y 좌표는 auto-layout 의 결과라서 옮기지 않았다. 프레임마다 선언된
 * 패딩을 그대로 토큰 유틸리티로 옮기면 같은 좌표가 나온다:
 *
 * | Figma 노드 | 선언된 값 | 이 파일 |
 * |---|---|---|
 * | `Contents` 27683:3190 | padding-top 40 · left/right 20 | `pt-40 px-20` |
 * | `Agreements` 27683:3192 | padding-top 40 | `pt-40` |
 * | `Items` 27683:3195 | 패딩·간격 0 | 유틸리티 없음 |
 * | `CTA` 27683:3201 | padding 8·20·20 | `pt-8 px-20 pb-20` |
 *
 * `Contents` 의 Figma 높이 639 는 제약이 아니라 874 − (62 + 56 + 83 + 34) 의
 * 나머지다. 그래서 높이 토큰이 아니라 `flex-1` 로 옮겼다 — `Login.tsx` 와 같은 판단이다.
 *
 * ## 폭·높이
 * 폭 402 는 `OSBarTopNavigation` · `Header` · `OSBarBottomNavigation` 세 컴포넌트가
 * 각각 `w-mobile-frame-width` 로 이미 고정한다. 이 루트도 같은 토큰을 쓴다.
 * 높이 874 는 기기 화면 높이라 `min-h-dvh` 로 옮겼다 (`Login.tsx` 와 같다).
 *
 * ## 구분선이 두 겹이다 — Figma 그대로다
 * `Agreements` 안에서 전체동의 행(27683:3193)이 자기 구분선을 y=111 에 그리고,
 * 그 **바로 아래** 독립 `Divider` 인스턴스 27683:3194 가 y=112 에 또 있다.
 * 두 hairline 이 세로로 붙어 있다. 디자인 파일의 실제 상태이고, 눈대중으로
 * 하나를 지우지 않았다 (원칙 1). 근거 좌표는 `Consent.design.md` 에 있다.
 *
 * ## 첫 행은 전체동의다 — 요청자 결정이 근거다. Figma 에는 없다
 * *"맨 상단 첫번째 체크박스 리스트인 `타이틀 영역입니다.` 부분 체크하면 아래
 * 체크리스트 모두 체크되게"*.
 *
 * Figma 에는 이 행(27683:3193)과 아래 4행 사이의 연동이 정의돼 있지 않고, 라벨도
 * 기본 플레이스홀더 `타이틀 영역입니다.` 그대로다. 연동의 근거는 요청자 결정 하나뿐이라
 * 라벨 문구는 Figma 값 그대로 두고 동작만 붙였다.
 *
 * 양방향으로 묶었다 — 첫 행을 켜면 아래 4행이 모두 켜지고, 끄면 모두 꺼진다.
 * 반대로 첫 행의 표시 상태는 저장하지 않고 **아래 4행이 전부 켜졌는지에서 파생한다**
 * (`isAllChecked`). 한 방향만 묶으면 아래 행을 하나 끈 뒤에도 첫 행이 켜진 채로 남아
 * 실제 상태와 어긋난다.
 *
 * ## 화면 이동 — 요청자 결정이 근거다. Figma 에는 없다
 * Figma 에 이 프레임을 다른 프레임에 잇는 프로토타입 연결이 없다. 아래 두 이동은
 * 요청자 결정으로만 붙였고, 그 사실을 `Consent.design.md` 에 적었다.
 *
 * | 자리 | 이동 |
 * |---|---|
 * | 헤더 뒤로가기 27683:3189 | `/login` |
 * | CTA "동의하고 계속하기" 27683:3202 | `/benefit` |
 *
 * 뒤로가기가 `navigate(-1)` 이 아니라 `/login` 인 이유는 `SignIn.tsx` 가 세운 규칙과
 * 같다 — 이 화면에 직접 URL 로 들어오면 히스토리에 돌아갈 곳이 없어 `-1` 이 앱 밖으로
 * 나간다. 목적지가 하나로 정해져 있으므로 고정한다.
 *
 * ## CTA 비활성 조건 — 요청자 결정이다. Figma 에는 없다
 * *"체크박스 리스트 아무것도 체크 안된 상태는 동의하고 계속하기 버튼이 비활성화.
 * 1개라도 체크박스 선택해야 활성화"*.
 *
 * 그래서 조건은 **아래 4행 중 하나라도 켜졌는가** 하나뿐이다 (`hasAnyChecked`).
 * 첫 행은 이제 그 4행에서 파생하는 값이라 따로 세지 않는다 — 세면 같은 상태를 두 번 센다.
 * 필수/선택을 구분하지 않는다 — `[필수]`·`[선택]` 은 Figma 텍스트 노드의 **문구**이지
 * 컴포넌트 속성이 아니고, 첫 행의 라벨은 아예 플레이스홀더다. 문구를 파싱해 필수
 * 약관을 판정하는 것은 지어내는 것이라 하지 않았다 (원칙 1).
 *
 * Figma 인스턴스 27683:3202 는 활성 variant 하나뿐이라 **비활성 모양의 근거도 Figma 가
 * 아니다** — `Button` 의 `isDisabled` 가 그리는 모양(`--color-button-disabled-*`)을 쓴다.
 * `Benefit.tsx` 가 `선택 완료` 에 쓴 것과 같은 prop 이다.
 *
 * 여전히 **로그인/동의 요청을 보내지는 않는다.** 보낼 곳이 정해져 있지 않다.
 * 이 버튼이 하는 일은 화면 이동뿐이다.
 *
 * 셰브론에는 여전히 이동을 붙이지 않았다 — 약관 상세 화면이 Figma 에 없다.
 * `Button` 은 기본값인 `type="button"` 이고 `<form>` 도 두지 않았다.
 *
 * ## 접근성은 이 화면이 붙인다
 * `ListCheckbox` 는 "체크박스의 그림" 이고 시맨틱·키보드는 호스트 몫이라고
 * `ListCheckbox.design.md` 의 책임 분리표가 정해 두었다. 그 몫을 여기서 붙인다 —
 * `role="group"` + 행마다 `role="checkbox"` · `aria-checked` · `tabIndex` ·
 * 클릭 · Space 토글. 포커스 표시는 UA 아웃라인이 그대로 살아 있다
 * (끄는 코드가 어디에도 없다).
 */
export function Consent() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  /** 전체동의 행의 표시 상태. 저장하지 않고 아래 4행에서 파생한다 (위 "첫 행은 전체동의다" 절). */
  const isAllChecked = AGREEMENT_ROWS.every((row) => checked[row.id]);

  /** 전체동의 토글. 켜져 있으면 4행을 모두 끄고, 아니면 모두 켠다. */
  const toggleAll = () =>
    setChecked(Object.fromEntries(AGREEMENT_ROWS.map((row) => [row.id, !isAllChecked])));

  /**
   * CTA 활성 조건. 껐다 켠 행은 `false` 로 남으므로 키 개수가 아니라 값을 본다.
   * 요청자 결정: "1개라도 체크박스 선택해야 활성화" (위 "CTA 비활성 조건" 절).
   */
  const hasAnyChecked = AGREEMENT_ROWS.some((row) => checked[row.id]);

  /**
   * `ListCheckbox` 루트에 얹는 호스트 몫. `...props` 가 루트로 전개되므로
   * 별도 래퍼 없이 행 자체가 체크박스가 된다.
   */
  const rowProps = (isChecked: boolean, onToggle: () => void) => ({
    role: 'checkbox',
    'aria-checked': isChecked,
    tabIndex: 0,
    onClick: onToggle,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      // role="checkbox" 의 표준 조작은 Space 다. 기본 동작(스크롤)을 막고 토글한다.
      if (event.key !== ' ') return;
      event.preventDefault();
      onToggle();
    },
  });

  return (
    <div className="bg-bg-secondary flex min-h-dvh w-mobile-frame-width flex-col">
      {/* 27683:3188 */}
      <OSBarTopNavigation />

      {/* 27683:3189 — 이 화면도 타이틀이 없다 (hasTitle=false). 우측 슬롯도 꺼져 있고
          `Header` 의 `hasSlotEnd` 기본값이 이미 꺼짐이라 넘기지 않는다.
          `title` 은 필수 prop 이라 값을 비워 넘긴다 — `Login.tsx` 와 같다.

          뒤로가기로 로그인 화면에 돌아간다 (위 "화면 이동" 절). */}
      <Header title="" hasTitle={false} onSlotStartClick={() => navigate('/login')} />

      {/* Contents 27683:3190 */}
      <div className="flex flex-1 flex-col items-start px-20 pt-40">
        {/* 27683:3191 — size=xl (세트 기본값). hasDescription=false 라 description 을 넘기지 않는다.
            두 줄로 끊긴 것은 Figma 텍스트 노드의 내용이고 컴포넌트 속성이 아니라서
            (TextSetTitle.tsx 의 "넣지 않은 것" 절) 줄바꿈을 여기서 넣는다. */}
        <TextSetTitle
          title={
            <>
              서비스 이용을 위해
              <br />
              약관에 동의해 주세요
            </>
          }
        />

        {/* Agreements 27683:3192 */}
        <div role="group" aria-label="약관 동의" className="flex w-full flex-col pt-40">
          {/* 27683:3193 — List/Checkbox 인스턴스. slot-end 가 hidden 이라 hasIconEnd=false.
              라벨은 Figma 텍스트 노드 그대로이고, 전체동의 동작만 붙였다
              (위 "첫 행은 전체동의다" 절 참조). */}
          <ListCheckbox
            title="타이틀 영역입니다."
            hasIconEnd={false}
            isChecked={isAllChecked}
            {...rowProps(isAllChecked, toggleAll)}
          />

          {/* 27683:3194 — 위 행이 이미 그린 구분선 바로 아래에 또 하나 있다.
              Figma 파일의 실제 상태다 (위 "구분선이 두 겹이다" 절). */}
          <Divider />

          {/* Items 27683:3195 */}
          <div className="flex w-full flex-col">
            {AGREEMENT_ROWS.map((row) => (
              /* 27683:3196 ~ 27683:3199 — [List] Checkbox, size=compact, Divider 가 hidden */
              <ListCheckbox
                key={row.id}
                title={row.title}
                size="compact"
                hasDivider={false}
                isChecked={Boolean(checked[row.id])}
                {...rowProps(Boolean(checked[row.id]), () => toggle(row.id))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 27683:3200 */}
      <div className="flex w-full flex-col">
        {/* CTA 27683:3201 */}
        <div className="flex w-full flex-col px-20 pt-8 pb-20">
          {/* 27683:3202 — hierarchy=primary, variant=filled (Button 의 기본값).
              Figma 인스턴스가 부모 폭을 채운다 (362 = 402 − 20 − 20).
              `Button` 은 Figma 의 hug 를 옮겨 `inline-flex` 라서 이 호출부가 폭을 지정한다.

              요금제 선택 화면(`page/List` 27683:3204)으로 넘어간다 (위 "화면 이동" 절).
              하나도 체크되지 않았으면 비활성이다 (위 "CTA 비활성 조건" 절). */}
          <Button className="w-full" isDisabled={!hasAnyChecked} onClick={() => navigate('/benefit')}>
            동의하고 계속하기
          </Button>
        </div>
      </div>

      {/* 27683:3203 */}
      <OSBarBottomNavigation />
    </div>
  );
}
