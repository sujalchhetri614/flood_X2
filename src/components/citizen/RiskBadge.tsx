import type { RiskLevel } from '@/types/citizen';

const STYLES: Record<RiskLevel, { bg: string; text: string; border: string; dot: string; icon: string }> = {
  low: {
    bg: 'bg-risk-low/10',
    text: 'text-risk-low',
    border: 'border-risk-low/30',
    dot: 'bg-risk-low',
    icon: 'text-risk-low',
  },
  moderate: {
    bg: 'bg-risk-moderate/10',
    text: 'text-risk-moderate',
    border: 'border-risk-moderate/30',
    dot: 'bg-risk-moderate',
    icon: 'text-risk-moderate',
  },
  high: {
    bg: 'bg-risk-high/10',
    text: 'text-risk-high',
    border: 'border-risk-high/30',
    dot: 'bg-risk-high',
    icon: 'text-risk-high',
  },
  critical: {
    bg: 'bg-risk-critical/10',
    text: 'text-risk-critical',
    border: 'border-risk-critical/30',
    dot: 'bg-risk-critical',
    icon: 'text-risk-critical',
  },
};

const LABELS: Record<RiskLevel, string> = {
  low: 'LOW',
  moderate: 'MODERATE',
  high: 'HIGH',
  critical: 'CRITICAL',
};

export function riskStyles(level: RiskLevel) {
  return STYLES[level];
}

export function riskLabel(level: RiskLevel) {
  return LABELS[level];
}

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export default function RiskBadge({ level, size = 'md', className = '' }: RiskBadgeProps) {
  const s = STYLES[level];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${s.bg} ${s.text} ${s.border} ${padding} font-semibold ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />
      {LABELS[level]} RISK
    </span>
  );
}
