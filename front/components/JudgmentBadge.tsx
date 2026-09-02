import { Icon, type IconColor, type IconName } from '@/components/Icon/Icon';
import type { Judgment } from '../data/mockStockImpact';

const CONFIG: Record<
  Judgment,
  { bg: string; text: string; icon: IconName; iconColor: IconColor; label: string }
> = {
  positive: {
    bg: 'bg-bg-informative-subtle',
    text: 'text-text-primary',
    icon: 'info-circle-fill',
    iconColor: 'primary',
    label: '긍정적',
  },
  negative: {
    bg: 'bg-bg-negative-strong',
    text: 'text-text-inverse',
    icon: 'close-circle-fill',
    iconColor: 'inverse',
    label: '부정적',
  },
  neutral: {
    bg: 'bg-bg-secondary',
    text: 'text-text-primary',
    icon: 'circle-fill',
    iconColor: 'primary',
    label: '중립·불확실',
  },
};

export interface JudgmentBadgeProps {
  judgment: Judgment;
  /**
   * 배지에 표시할 문구. 생략하면 개별 판단 레이블(긍정적/부정적/중립·불확실)을 쓴다.
   * 종합의견 배지에는 "긍정/중립/부정"처럼 다른 문구를 넘긴다 — 색상·아이콘은 같은
   * judgment 팔레트를 그대로 재사용하되 레이블만 다르다 (estimate_stock_impact.md 참조).
   */
  label?: string;
}

export function JudgmentBadge({ judgment, label }: JudgmentBadgeProps) {
  const config = CONFIG[judgment];
  return (
    <span
      className={`inline-flex items-center gap-4 rounded-4 px-12 py-4 ${config.bg} ${config.text}`}
    >
      <Icon name={config.icon} color={config.iconColor} />
      <span className="font-label-small">{label ?? config.label}</span>
    </span>
  );
}
