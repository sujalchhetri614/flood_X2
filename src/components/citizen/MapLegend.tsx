import type { RiskLevel } from '@/types/citizen';

const ITEMS: { level: RiskLevel; label: string }[] = [
  { level: 'low', label: 'Low' },
  { level: 'moderate', label: 'Moderate' },
  { level: 'high', label: 'High' },
  { level: 'critical', label: 'Critical' },
];

const COLORS: Record<RiskLevel, string> = {
  low: 'bg-risk-low',
  moderate: 'bg-risk-moderate',
  high: 'bg-risk-high',
  critical: 'bg-risk-critical',
};

export default function MapLegend({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-white/95 p-3 shadow-card ${className}`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Flood Risk</p>
      <ul className="space-y-1.5">
        {ITEMS.map(({ level, label }) => (
          <li key={level} className="flex items-center gap-2 text-sm text-ink">
            <span className={`h-3 w-3 rounded ${COLORS[level]}`} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
