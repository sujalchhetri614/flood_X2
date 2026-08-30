import { ChevronRight } from 'lucide-react';
import type { ReportItem } from '@/types/citizen';
import { SeverityBadge, StatusBadge } from '@/components/citizen/StatusBadge';

interface ReportCardProps {
  report: ReportItem;
  onClick: () => void;
}

export default function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-white p-4 text-left shadow-card transition-all duration-200 hover:border-blue-primary hover:shadow-card-hover"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-navy">#{report.numericId}</span>
          <span className="text-sm text-ink-muted">{report.zone}</span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-ink-muted">{report.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={report.status} />
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-ink-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </button>
  );
}
