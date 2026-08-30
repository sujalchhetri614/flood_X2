import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Building2,
  ClipboardList,
  Construction,
  ShieldAlert,
  Siren,
  TrendingUp,
} from 'lucide-react';
import type { KpiData } from '@/types/authority';

const ICONS: Record<KpiData['icon'], typeof AlertTriangle> = {
  critical: ShieldAlert,
  high: AlertTriangle,
  road: Construction,
  infrastructure: Building2,
  alert: Siren,
  report: ClipboardList,
};

const ICON_STYLES: Record<KpiData['icon'], string> = {
  critical: 'bg-risk-critical/10 text-risk-critical',
  high: 'bg-risk-high/10 text-risk-high',
  road: 'bg-risk-moderate/10 text-risk-moderate',
  infrastructure: 'bg-blue-light text-blue-primary',
  alert: 'bg-risk-high/10 text-risk-high',
  report: 'bg-blue-light text-blue-primary',
};

export default function KpiCard({ kpi }: { kpi: KpiData }) {
  const navigate = useNavigate();
  const Icon = ICONS[kpi.icon];
  const iconStyle = ICON_STYLES[kpi.icon];

  return (
    <button
      onClick={() => navigate(kpi.link)}
      className="group flex w-full flex-col rounded-2xl border border-border bg-white p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-primary hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {kpi.trend && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-risk-high">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
            {kpi.trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold text-navy-dark">{kpi.value}</p>
      <p className="mt-1 text-sm font-medium text-ink-muted">{kpi.label}</p>
    </button>
  );
}
