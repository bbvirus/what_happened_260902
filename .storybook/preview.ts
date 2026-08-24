import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Preview } from '@storybook/react';
// Tailwind v4 엔트리 — Storybook 캔버스에서도 동일한 스타일을 사용합니다.
import '../src/index.css';

// Storybook 8에서는 docs.autodocs 옵션이 제거되었고, tags로 켭니다.
// 여기서 전역으로 선언하면 모든 스토리에 autodocs 페이지가 생성됩니다.
export const tags = ['autodocs'];

const preview: Preview = {
  // `src/pages/**` 의 화면 스토리는 `useNavigate` 를 쓴다. Router 컨텍스트 없이
  // 렌더하면 react-router 가 즉시 throw 해서 스토리가 뜨지 않는다.
  // 실제 라우팅은 `main.tsx` 의 `BrowserRouter` 가 하고, 캔버스에서는 이동이
  // 히스토리에만 남으면 되므로 주소창을 건드리지 않는 `MemoryRouter` 를 쓴다.
  // 컴포넌트 스토리에는 아무 영향이 없다 (Router 는 DOM 을 그리지 않는다).
  //
  // ⚠ 이 파일은 `.ts` 라 JSX 를 쓸 수 없어 `createElement` 로 적는다.
  decorators: [(Story) => createElement(MemoryRouter, null, createElement(Story))],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
