import { Check, Star } from 'lucide-react';
import type { RouteOption, RouteRisk } from '@/types/citizen';

const RISK_STYLES: Record<RouteRisk, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-risk-low/10', text: 'text-risk-low', border: 'border-risk-low/30' },
  moderate: { bg: 'bg-risk-moderate/10', text: 'text-risk-moderate', border: 'border-risk-moderate/30' },
  high: { bg: 'bg-risk-high/10', text: 'text-risk-high', border: 'border-risk-high/30' },
};

interface RouteCardProps {
  route: RouteOption;
  selected: boolean;
  onSelect: () => void;
}

export default function RouteCard({ route, selected, onSelect }: RouteCardProps) {
  const s = RISK_STYLES[route.risk];
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-navy bg-white shadow-card-hover'
          : 'border-border bg-white shadow-card hover:border-blue-primary'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-navy">{route.label}</span>
          {route.recommended && (
            <span className="inline-flex items-center gap-1 rounded-full bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy">
              <Star className="h-3 w-3 fill-navy" aria-hidden="true" />
              RECOMMENDED
            </span>
          )}
        </div>
        {selected && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-sm font-semibold text-ink">{route.duration}</span>
        <span className={`inline-flex items-center gap-1.5 rounded-full border ${s.bg} ${s.text} ${s.border} px-2.5 py-0.5 text-xs font-semibold`}>
          {route.riskLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-ink-muted">{route.notes}</p>
    </button>
  );
}
