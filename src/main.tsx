import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';

/**
 * 라우팅은 여기 한 곳에만 있다.
 *
 * 화면 페이지가 제거되어 현재 남은 화면은 하네스 랜딩(`App.tsx`) 하나다.
 * `/` 로 들어오면 `/harness` 로 리다이렉트한다.
 * 화면이 늘면 이 표에 `<Route>` 를 한 줄 더한다.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/harness" replace />} />
        <Route path="/harness" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
