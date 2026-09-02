import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import negativeImage from '@/images/negative_result_image.jpg';
import neutralImage from '@/images/neutral_result_image.jpg';
import positiveImage from '@/images/positive_result_image.jpg';
import { Button } from '@/components/Button/Button';
import { Icon } from '@/components/Icon/Icon';
import { OSBarTopNavigation } from '@/components/OSBarTopNavigation/OSBarTopNavigation';
import { TextFieldText } from '@/components/TextFieldText/TextFieldText';
import { TextFieldTextSet } from '@/components/TextFieldTextSet/TextFieldTextSet';
import { TextSetTitle } from '@/components/TextSetTitle/TextSetTitle';
import { JudgmentBadge } from '../components/JudgmentBadge';
import { fetchMockStockImpact, type Judgment, type StockImpactResult } from '../data/mockStockImpact';

type Status = 'idle' | 'loading' | 'done';

// 종합의견 배지 레이블 — 개별 판단 레이블("긍정적/부정적/중립·불확실")과 다르다.
const OVERALL_LABEL: Record<Judgment, string> = {
  positive: '풀매수 각이다',
  negative: '다 팔아ㅏㅏㅏ',
  neutral: '일단 관망..',
};

const OVERALL_IMAGE: Record<Judgment, string> = {
  positive: positiveImage,
  negative: negativeImage,
  neutral: neutralImage,
};

export default function WhatHappenedPage() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<StockImpactResult | null>(null);

  const canSearch = companyName.trim().length > 0 && status !== 'loading';

  function handleSearch() {
    if (!canSearch) return;
    setStatus('loading');
    // TODO: stock-impact-check 실제 연동 필요 (docs/prd-무슨일이야.md "리스크 및 메모" 참조).
    // 지금은 mock 데이터로 로딩 → 결과 흐름만 시연한다.
    setTimeout(() => {
      setResult(fetchMockStockImpact(companyName));
      setStatus('done');
    }, 1200);
  }

  return (
    <div className="mx-auto min-h-screen w-mobile-frame-width bg-bg-primary">
      <OSBarTopNavigation />

      <div className="flex flex-col gap-40 px-20 py-24">
        <TextSetTitle title="무슨일이야" />

        <div className="flex flex-col gap-16">
          <TextSetTitle size="sm" title="궁금한 기업이 있나요?" />
          <TextFieldText
            label="기업명"
            input={{
              id: 'company-name',
              value: companyName,
              onChange: (e) => setCompanyName(e.target.value),
              onKeyDown: (e) => {
                if (e.key === 'Enter') handleSearch();
              },
              placeholder: '예: 삼성전자',
            }}
          />
          <Button
            variant="filled-primary"
            isDisabled={!canSearch}
            onClick={handleSearch}
            className="w-full"
          >
            무슨일이야?
          </Button>
          {status === 'loading' ? (
            <TextFieldTextSet status="informative">잠시만 기다려주세요..</TextFieldTextSet>
          ) : null}
        </div>

        {status === 'done' && result ? (
          result.overall === null ? (
            <p className="py-40 text-center font-body-medium text-text-secondary">
              &quot;{companyName}&quot; 관련 뉴스를 찾지 못했습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              <JudgmentBadge
                judgment={result.overall.judgment}
                label={OVERALL_LABEL[result.overall.judgment]}
              />
              <p className="font-body-small text-text-primary">{result.overall.summary}</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/details?company=${encodeURIComponent(companyName)}`)}
                  className="inline-flex items-center gap-4 font-body-small text-text-secondary"
                >
                  자세히 알아보기
                  <Icon name="chevronRight-small" color="secondary" />
                </button>
              </div>
            </div>
          )
        ) : null}
      </div>

      {status === 'done' && result?.overall ? (
        <>
          <img
            src={OVERALL_IMAGE[result.overall.judgment]}
            alt={`종합의견: ${OVERALL_LABEL[result.overall.judgment]}`}
            className="w-full"
          />
          <p className="px-20 py-16 font-label-small text-text-secondary">
            콘텐츠 기반 추정이며 투자 권유가 아닙니다.
          </p>
        </>
      ) : null}
    </div>
  );
}
