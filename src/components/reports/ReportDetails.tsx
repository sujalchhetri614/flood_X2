import type { ReportItem } from '@/types/citizen';
import { SeverityBadge, StatusBadge } from '@/components/citizen/StatusBadge';
import { MapPin, Clock, MessageSquare } from 'lucide-react';

interface ReportDetailsProps {
  report: ReportItem;
}

export default function ReportDetails({ report }: ReportDetailsProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-navy">#{report.numericId}</span>
        <SeverityBadge severity={report.severity} />
        <StatusBadge status={report.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Location</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink">
            <MapPin className="h-4 w-4 text-blue-primary" aria-hidden="true" />
            {report.location}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Submitted</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink">
            <Clock className="h-4 w-4 text-blue-primary" aria-hidden="true" />
            {report.submittedAt}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Description</p>
        <p className="mt-1 text-sm text-ink">{report.description}</p>
      </div>

      {report.hasPhoto && report.photoUrl && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Evidence</p>
          <img src={report.photoUrl} alt={`Evidence for report #${report.numericId}`} className="mt-2 max-h-64 rounded-xl border border-border object-cover" />
        </div>
      )}

      <div className="rounded-xl border border-border bg-blue-light/50 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Authority Feedback
        </p>
        <p className="mt-1 text-sm text-ink">{report.authorityFeedback}</p>
      </div>
    </div>
  );
}
