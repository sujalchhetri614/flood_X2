import { useNavigate } from 'react-router-dom';
import { CloudRain, Construction, Siren, TriangleAlert } from 'lucide-react';
import type { AlertItem, AlertType } from '@/types/citizen';
import { riskStyles } from '@/components/citizen/RiskBadge';

const TYPE_ICONS: Record<AlertType, typeof CloudRain> = {
  rainfall: CloudRain,
  flood: TriangleAlert,
  road: Construction,
  evacuation: Siren,
};

const TYPE_LABELS: Record<AlertType, string> = {
  rainfall: 'Rainfall',
  flood: 'Flood',
  road: 'Road',
  evacuation: 'Evacuation',
};

export default function AlertCard({ alert }: { alert: AlertItem }) {
  const navigate = useNavigate();
  const s = riskStyles(alert.severity);
  const Icon = TYPE_ICONS[alert.type];

  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-5`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.icon}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold ${s.text}`}>{alert.title}</h3>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-ink-muted">
              {TYPE_LABELS[alert.type]}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink">{alert.description}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>
              <dt className="inline text-ink-muted">Severity: </dt>
              <dd className="inline font-semibold text-ink">{alert.severity.toUpperCase()}</dd>
            </div>
            <div>
              <dt className="inline text-ink-muted">Area: </dt>
              <dd className="inline font-semibold text-ink">{alert.location}</dd>
            </div>
            <div className="col-span-2">
              <dt className="inline text-ink-muted">Time: </dt>
              <dd className="inline font-semibold text-ink">{alert.time}</dd>
            </div>
          </dl>
          <button
            onClick={() => navigate(alert.actionPath)}
            className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${s.text} hover:underline`}
          >
            {alert.action}
          </button>
        </div>
      </div>
    </div>
  );
}
