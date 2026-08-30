import type { RiskInfo } from '@/types/citizen';
import { riskStyles, riskLabel } from '@/components/citizen/RiskBadge';

interface RiskCardProps {
  risk: RiskInfo;
}

export default function RiskCard({ risk }: RiskCardProps) {
  const s = riskStyles(risk.level);
  return (
    <div className={`rounded-2xl border-2 ${s.border} ${s.bg} p-5`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-muted">Current Flood Risk</span>
        <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${s.text}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} aria-hidden="true" />
          {riskLabel(risk.level)}
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className={`text-4xl font-bold ${s.text}`}>{risk.percentage}%</span>
        <span className="mb-1 text-sm text-ink-muted">flood risk in your area</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className={`h-full rounded-full ${s.dot} transition-all duration-500`}
          style={{ width: `${risk.percentage}%` }}
        />
      </div>
    </div>
  );
}
