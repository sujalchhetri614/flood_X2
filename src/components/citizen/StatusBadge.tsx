import type { ReportStatus, ReportSeverity } from '@/types/citizen';
import { riskStyles } from '@/components/citizen/RiskBadge';

const STATUS_STYLES: Record<ReportStatus, { bg: string; text: string; label: string }> = {
  'under-review': { bg: 'bg-risk-moderate/10', text: 'text-risk-moderate', label: 'Under Review' },
  verified: { bg: 'bg-blue-light', text: 'text-blue-primary', label: 'Verified' },
  resolved: { bg: 'bg-risk-low/10', text: 'text-risk-low', label: 'Resolved' },
};

const SEVERITY_LABELS: Record<ReportSeverity, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  critical: 'Critical',
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center rounded-full ${s.bg} ${s.text} px-2.5 py-0.5 text-xs font-semibold`}>
      {s.label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: ReportSeverity }) {
  const s = riskStyles(severity);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${s.bg} ${s.text} px-2.5 py-0.5 text-xs font-semibold`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {SEVERITY_LABELS[severity]}
    </span>
  );
}
