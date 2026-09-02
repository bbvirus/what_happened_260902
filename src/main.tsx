import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import DetailsPage from '../front/pages/DetailsPage';
import LoginPage from '../front/pages/LoginPage';
import SignUpPage from '../front/pages/SignUpPage';
import WhatHappenedPage from '../front/pages/WhatHappenedPage';
import './index.css';

/**
 * 라우팅은 여기 한 곳에만 있다.
 *
 * `/` 로 들어오면 `/login` 으로 리다이렉트한다 (배포 도메인의 첫 화면, 요청자 결정 2026-09-02).
 * 하네스 랜딩(`App.tsx`)은 `/harness` 로 남아 있지만 더 이상 기본 진입점이 아니다.
 * 화면이 늘면 이 표에 `<Route>` 를 한 줄 더한다.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/harness" element={<App />} />
        <Route path="/main" element={<WhatHappenedPage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
