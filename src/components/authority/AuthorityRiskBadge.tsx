import type { RiskLevel } from '@/types/citizen';

const STYLES: Record<RiskLevel, { bg: string; text: string; border: string; dot: string }> = {
  low: { bg: 'bg-risk-low/10', text: 'text-risk-low', border: 'border-risk-low/30', dot: 'bg-risk-low' },
  moderate: { bg: 'bg-risk-moderate/10', text: 'text-risk-moderate', border: 'border-risk-moderate/30', dot: 'bg-risk-moderate' },
  high: { bg: 'bg-risk-high/10', text: 'text-risk-high', border: 'border-risk-high/30', dot: 'bg-risk-high' },
  critical: { bg: 'bg-risk-critical/10', text: 'text-risk-critical', border: 'border-risk-critical/30', dot: 'bg-risk-critical' },
};

const LABELS: Record<RiskLevel, string> = {
  low: 'LOW',
  moderate: 'MODERATE',
  high: 'HIGH',
  critical: 'CRITICAL',
};

interface AuthorityRiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export default function AuthorityRiskBadge({ level, size = 'md', className = '' }: AuthorityRiskBadgeProps) {
  const s = STYLES[level];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${s.bg} ${s.text} ${s.border} ${padding} font-semibold ${className}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
      {LABELS[level]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: 1 | 2 | 3 }) {
  const styles: Record<number, string> = {
    1: 'bg-risk-critical/10 text-risk-critical border-risk-critical/30',
    2: 'bg-risk-high/10 text-risk-high border-risk-high/30',
    3: 'bg-risk-moderate/10 text-risk-moderate border-risk-moderate/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-semibold ${styles[priority]}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: priority === 1 ? '#DC2626' : priority === 2 ? '#EA580C' : '#CA8A04' }} aria-hidden="true" />
      PRIORITY {priority}
    </span>
  );
}

export { LABELS as riskLabels, STYLES as authorityRiskStyles };
