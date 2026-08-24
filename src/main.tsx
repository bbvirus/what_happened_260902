import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import { Benefit } from './pages/Benefit/Benefit';
import { Consent } from './pages/Consent/Consent';
import { Login } from './pages/Login/Login';
import { SignIn } from './pages/SignIn/SignIn';
import './index.css';

/**
 * 라우팅은 여기 한 곳에만 있다.
 *
 * 기본 진입점은 로그인 화면이다. `/` 로 들어오면 `/login` 으로 리다이렉트한다.
 * `App.tsx` 는 건드리지 않고 하네스 랜딩 화면으로 `/harness` 에 그대로 남긴다 —
 * 페이지로 옮기는 리팩터링은 요청 범위가 아니다 (원칙 3).
 * 화면이 늘면 이 표에 `<Route>` 를 한 줄 더한다.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/harness" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/benefit" element={<Benefit />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
