import type { Preview } from '@storybook/react';
// Tailwind v4 엔트리 — Storybook 캔버스에서도 동일한 스타일을 사용합니다.
import '../src/index.css';

// Storybook 8에서는 docs.autodocs 옵션이 제거되었고, tags로 켭니다.
// 여기서 전역으로 선언하면 모든 스토리에 autodocs 페이지가 생성됩니다.
export const tags = ['autodocs'];

const preview: Preview = {
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
