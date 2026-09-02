import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button/Button';
import { Header } from '@/components/Header/Header';
import { OSBarBottomNavigation } from '@/components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '@/components/OSBarTopNavigation/OSBarTopNavigation';
import { TextFieldPassword } from '@/components/TextFieldPassword/TextFieldPassword';
import { TextFieldText } from '@/components/TextFieldText/TextFieldText';
import { TextSetTitle } from '@/components/TextSetTitle/TextSetTitle';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;

  async function handleSignUp() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(error.message);
      return;
    }
    // 이메일 확인이 꺼져 있으면 signUp 응답에 바로 세션이 온다 — 그 경우 확인 메일 안내 없이 바로 로그인 처리한다.
    // 켜져 있으면 세션 없이 성공만 오므로 확인 메일 안내로 넘어간다.
    if (data.session) {
      navigate('/main');
      return;
    }
    setIsDone(true);
  }

  return (
    <div className="mx-auto min-h-screen w-mobile-frame-width bg-bg-secondary">
      <OSBarTopNavigation />
      {/* 회원가입 화면 뒤로가기 → 로그인으로 돌아간다 (요청자 결정, Header.tsx 참조) */}
      <Header title="" hasTitle={false} onSlotStartClick={() => navigate('/login')} />

      <div className="flex flex-col px-20 pt-40">
        <TextSetTitle title="회원가입" />

        {isDone ? (
          <p className="pt-64 font-body-medium text-text-primary">
            가입 확인 이메일을 보냈습니다. 메일함에서 링크를 눌러 인증을 완료해 주세요.
          </p>
        ) : (
          <div className="flex flex-col gap-40 pt-64">
            <TextFieldText
              label="이메일"
              required={false}
              input={{
                id: 'signup-email',
                type: 'email',
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: '이메일을 입력해 주세요',
              }}
            />
            <TextFieldPassword
              label="비밀번호"
              input={{
                id: 'signup-password',
                value: password,
                onChange: (e) => setPassword(e.target.value),
              }}
            />
            {errorMessage ? (
              <p className="font-body-small text-text-negative">{errorMessage}</p>
            ) : null}
          </div>
        )}
      </div>

      {!isDone ? (
        <div className="flex flex-col px-20 pb-20 pt-8">
          <Button
            variant="filled-secondary"
            className="w-full"
            isDisabled={!canSubmit}
            onClick={handleSignUp}
          >
            {isSubmitting ? '가입 처리 중..' : '회원가입'}
          </Button>
        </div>
      ) : null}

      <OSBarBottomNavigation />
    </div>
  );
}
