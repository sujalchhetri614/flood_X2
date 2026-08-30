import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CitizenLayout from '@/components/citizen/CitizenLayout';
import ReportCard from '@/components/citizen/ReportCard';
import ReportDetails from '@/components/reports/ReportDetails';
import Button from '@/components/ui/Button';
import { fetchReports } from '@/services/citizen';
import type { ReportItem } from '@/types/citizen';

export default function CitizenReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ReportItem | null>(null);

  useEffect(() => {
    fetchReports().then((r) => {
      setReports(r);
      setLoading(false);
    });
  }, []);

  if (selected) {
    return (
      <CitizenLayout>
        <div className="animate-fade-in">
          <button
            onClick={() => setSelected(null)}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Reports
          </button>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
            <ReportDetails report={selected} />
          </div>
        </div>
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-5">
          <h1 className="text-h2 font-bold text-navy-dark">My Reports</h1>
          <p className="mt-1 text-[15px] text-ink-muted">
            Track the status of your flood reports.
          </p>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-ink-muted">Loading reports…</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <p className="text-sm text-ink-muted">You haven't submitted any reports yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} onClick={() => setSelected(r)} />
            ))}
          </div>
        )}
      </div>
    </CitizenLayout>
  );
}
