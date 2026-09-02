import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button/Button';
import { Header } from '@/components/Header/Header';
import { OSBarBottomNavigation } from '@/components/OSBarBottomNavigation/OSBarBottomNavigation';
import { OSBarTopNavigation } from '@/components/OSBarTopNavigation/OSBarTopNavigation';
import { TextButton } from '@/components/TextButton/TextButton';
import { TextFieldPassword } from '@/components/TextFieldPassword/TextFieldPassword';
import { TextFieldText } from '@/components/TextFieldText/TextFieldText';
import { TextSetTitle } from '@/components/TextSetTitle/TextSetTitle';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;

  async function handleLogin() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage(
        error.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : error.message,
      );
      return;
    }
    navigate('/main');
  }

  return (
    <div className="mx-auto min-h-screen w-mobile-frame-width bg-bg-secondary">
      <OSBarTopNavigation />
      <Header title="" hasTitle={false} />

      <div className="flex flex-col px-20 pt-40">
        <TextSetTitle
          title={
            <>
              이메일과 비밀번호를
              <br />
              입력해 주세요
            </>
          }
        />

        <div className="flex flex-col gap-40 pt-64">
          <TextFieldText
            label="이메일"
            required={false}
            input={{
              id: 'login-email',
              type: 'email',
              value: email,
              onChange: (e) => setEmail(e.target.value),
              placeholder: '이메일을 입력해 주세요',
            }}
          />
          <TextFieldPassword
            label="비밀번호"
            input={{
              id: 'login-password',
              value: password,
              onChange: (e) => setPassword(e.target.value),
            }}
          />
          {errorMessage ? (
            <p className="font-body-small text-text-negative">{errorMessage}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center py-20">
          <TextButton>아이디 · 비밀번호 찾기</TextButton>
        </div>
        <div className="flex gap-8 px-20 pb-20 pt-8">
          <Button variant="filled-secondary" className="flex-1" onClick={() => navigate('/sign-up')}>
            회원가입
          </Button>
          <Button
            variant="filled-primary"
            className="flex-1"
            isDisabled={!canSubmit}
            onClick={handleLogin}
          >
            {isSubmitting ? '로그인 중..' : '로그인'}
          </Button>
        </div>
      </div>

      <OSBarBottomNavigation />
    </div>
  );
}
