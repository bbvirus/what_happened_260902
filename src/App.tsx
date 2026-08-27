import { Button } from './components/Button/Button';

export default function App() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-24 bg-bg-primary font-sans text-text-primary">
      <h1 className="font-title-large-strong">LG U+ Design System Harness</h1>
      <p className="font-body-small text-text-secondary">
        Vite 6 · React 19 · TypeScript 5 · Tailwind CSS v4 · Storybook 8
      </p>
      <div className="flex items-center gap-8">
        <Button>시작하기</Button>
        <Button variant="filled-secondary">문서 보기</Button>
      </div>
    </main>
  );
}
