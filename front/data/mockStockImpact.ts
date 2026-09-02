// TODO: stock-impact-check 실제 연동 필요 (docs/prd-무슨일이야.md "리스크 및 메모" 참조)
// 백엔드 연동 전까지, 실제로 생성됐던 산출물(output/20260902/삼성전자-stock-impact-20260902.md)을
// 그대로 옮긴 mock 데이터로 화면을 시연한다.

export type Judgment = 'positive' | 'negative' | 'neutral';

export interface NewsImpactItem {
  title: string;
  link: string;
  type: string;
  judgment: Judgment;
  confidence: '높음' | '보통' | '낮음';
  rationale: string;
}

const SAMSUNG_RESULT: NewsImpactItem[] = [
  {
    title: "삼성 '갤럭시 S26 FE' 내달 4일 출시…카메라·AI 기능 진화",
    link: 'https://view.asiae.co.kr/article/2026082714280569543',
    type: '신제품·기술발표',
    judgment: 'positive',
    confidence: '보통',
    rationale:
      '카메라·AI 기능이 강화된 신제품 출시는 매출 확대 기대 요인이나, FE 라인업은 플래그십 대비 파급력이 제한적이다.',
  },
  {
    title: "삼성전자, 갤럭시 프리미엄 기능을 담은 '갤럭시 S26 FE' 공개",
    link: 'https://news.samsung.com/kr/삼성전자-갤럭시-프리미엄-기능을-담은-갤럭시-s26-fe-공',
    type: '신제품·기술발표',
    judgment: 'positive',
    confidence: '보통',
    rationale:
      '프리미엄 사양을 중저가 라인에 반영한 것은 제품 경쟁력 강화 신호이나, 1번 기사와 동일 이벤트를 다룬 발표성 기사라 시장 영향력은 제한적이다.',
  },
  {
    title: '삼성전자, 파운드리 단가 최대 15% 인상…내년 흑자 전환 가능성',
    link: 'https://www.fnnews.com/news/202608191920114115',
    type: '가격정책·실적전망',
    judgment: 'positive',
    confidence: '보통',
    rationale:
      'AI칩 수요를 바탕으로 한 단가 인상은 수익성 개선 요인이며, 기사 자체가 흑자 전환 가능성을 명시적으로 제기한다.',
  },
  {
    title: 'Samsung Unveils Next-Gen 3D-Memory Vision at FMS 2026',
    link: 'https://news.samsung.com/global/samsung-unveils-next-gen-3d-memory-vision-at-fms-2026-charting-the-future-of-ai-infrastructure',
    type: '신제품·기술발표',
    judgment: 'positive',
    confidence: '보통',
    rationale:
      '차세대 메모리 비전 공개는 AI 인프라 시장 기술 리더십을 부각하지만, 상용화 시점이 없는 미래 비전 발표라 즉각적 실적 반영 여부는 불확실하다.',
  },
  {
    title: '삼성전자, 2026년 2분기 잠정실적 발표',
    link: 'https://news.samsung.com/kr/삼성전자-2026년-2분기-잠정실적-발표',
    type: '실적발표',
    judgment: 'neutral',
    confidence: '낮음',
    rationale:
      '절대 매출·영업이익 수치만 제시되어 전년·전분기 대비 증감이나 컨센서스 부합 여부를 알 수 없어 방향성을 단정할 수 없다.',
  },
];

// 종합의견 근거는 표결 숫자 재진술이 아니라 뉴스 내용 요약이어야 한다
// (estimate_stock_impact.md 5단계 참조). mock이라 직접 요약해 둔다.
const SAMSUNG_SUMMARY =
  '갤럭시 S26 FE 출시, 파운드리 단가 인상, 차세대 메모리 공개 등 우호적인 소식이 다수였다.';

const MOCK_DB: Record<string, { news: NewsImpactItem[]; summary: string }> = {
  삼성전자: { news: SAMSUNG_RESULT, summary: SAMSUNG_SUMMARY },
};

function normalize(companyName: string): string {
  return companyName.trim().replace(/\s+/g, '').toLowerCase();
}

/**
 * 개별 판단 5건을 다수결로 집계한다 (estimate_stock_impact.md 5단계와 동일 규칙).
 * 동률이면 "neutral"로 처리한다.
 */
function majorityJudgment(news: NewsImpactItem[]): Judgment {
  const counts: Record<Judgment, number> = { positive: 0, negative: 0, neutral: 0 };
  news.forEach((item) => {
    counts[item.judgment] += 1;
  });
  const max = Math.max(counts.positive, counts.negative, counts.neutral);
  const winners = (Object.keys(counts) as Judgment[]).filter((k) => counts[k] === max);
  return winners.length === 1 ? winners[0] : 'neutral';
}

export interface StockImpactResult {
  news: NewsImpactItem[];
  /** 뉴스가 0건이면 종합의견도 없다 (estimate_stock_impact.md 5단계와 동일 규칙). */
  overall: { judgment: Judgment; summary: string } | null;
}

/** 회사명으로 mock 결과를 조회한다. 등록되지 않은 회사명이면 뉴스 0건·종합의견 없음을 반환한다. */
export function fetchMockStockImpact(companyName: string): StockImpactResult {
  const key = Object.keys(MOCK_DB).find((k) => normalize(k) === normalize(companyName));
  if (!key) return { news: [], overall: null };
  const { news, summary } = MOCK_DB[key];
  return { news, overall: { judgment: majorityJudgment(news), summary } };
}
