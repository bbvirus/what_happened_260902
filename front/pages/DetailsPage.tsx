import { useNavigate, useSearchParams } from 'react-router-dom';
import { Divider } from '@/components/Divider/Divider';
import { Header } from '@/components/Header/Header';
import { OSBarTopNavigation } from '@/components/OSBarTopNavigation/OSBarTopNavigation';
import { TextSetTitle } from '@/components/TextSetTitle/TextSetTitle';
import { JudgmentBadge } from '../components/JudgmentBadge';
import { fetchMockStockImpact } from '../data/mockStockImpact';

export default function DetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get('company') ?? '';
  const { news } = fetchMockStockImpact(companyName);

  return (
    <div className="mx-auto min-h-screen w-mobile-frame-width bg-bg-primary">
      <OSBarTopNavigation />
      <Header title="" hasTitle={false} onSlotStartClick={() => navigate('/main')} />

      <div className="flex flex-col gap-24 px-20 py-24">
        {companyName ? <TextSetTitle size="sm" title={`"${companyName}"의 최근 소식`} /> : null}

        {news.length === 0 ? (
          <p className="py-40 text-center font-body-medium text-text-secondary">
            표시할 뉴스가 없습니다.
          </p>
        ) : (
          <>
            {news.map((item, index) => (
              <div key={item.link} className="flex flex-col gap-24">
                {index > 0 ? <Divider /> : null}
                <div className="flex flex-col gap-8">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-body-medium text-text-primary hover:underline"
                  >
                    {item.title}
                  </a>
                  <div className="flex flex-wrap items-center gap-8">
                    <JudgmentBadge judgment={item.judgment} />
                    <span className="font-label-small text-text-secondary">
                      {item.type} · 확신도 {item.confidence}
                    </span>
                  </div>
                  <p className="font-body-small text-text-secondary">{item.rationale}</p>
                </div>
              </div>
            ))}
            <p className="font-label-small text-text-secondary">
              콘텐츠 기반 추정이며 투자 권유가 아닙니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
