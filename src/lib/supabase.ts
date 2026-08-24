import { createClient } from '@supabase/supabase-js'

/*
 * Supabase 클라이언트 — 앱 전체에서 이 인스턴스 하나만 쓴다.
 *
 * 인스턴스를 여러 개 만들면 인증 세션(localStorage)을 각자 붙잡고 갱신해서
 * onAuthStateChange 가 서로 다른 값을 흘린다. 그래서 모듈 최상단에서 한 번 만들고
 * 필요한 곳이 import 한다.
 *
 * 키는 .env.local 의 VITE_ 변수다 (git 에 올라가지 않는다 — .gitignore 의 `*.local`).
 * anon key 는 브라우저에 노출되는 공개 키이고, 실제 접근 제어는 테이블의 RLS 정책이 한다.
 *   VITE_SUPABASE_URL       프로젝트 URL (도메인까지만. /rest/v1 붙이지 않는다)
 *   VITE_SUPABASE_ANON_KEY  publishable(anon) 키
 *
 * 배포처(Vercel)에도 같은 두 변수를 넣어야 한다 — Vite 는 빌드 시점에 값을 박아넣으므로
 * 변수가 없으면 빌드된 번들에서 createClient 가 던진다.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
