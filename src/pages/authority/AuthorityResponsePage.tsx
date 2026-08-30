import { useEffect, useState } from 'react';
import { CheckCircle2, Users, Building2, Route, History, ShieldAlert } from 'lucide-react';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge, { PriorityBadge } from '@/components/authority/AuthorityRiskBadge';
import ConfirmationModal from '@/components/authority/ConfirmationModal';
import { LoadingState } from '@/components/authority/States';
import { responsePriorities } from '@/data/authorityMockData';
import type { ResponsePriority } from '@/types/authority';

const FACTOR_ICONS = {
  floodRisk: ShieldAlert,
  populationExposure: Users,
  infrastructureCount: Building2,
  roadConnectivity: Route,
  historicalImpact: History,
} as const;

export default function AuthorityResponsePage() {
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<{ action: string; zone: ResponsePriority } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleConfirm = () => {
    if (confirmAction) {
      setSuccessMsg(`${confirmAction.action} confirmed for ${confirmAction.zone.zoneName}.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
    setConfirmAction(null);
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState message="Loading response priority data..." />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">Response Priority</h1>
          <p className="mt-1 text-[15px] text-ink-muted">AI-assisted prioritization of zones for immediate action</p>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-xl border border-risk-low/30 bg-risk-low/10 px-4 py-3 text-sm font-medium text-risk-low animate-slide-in">
            {successMsg}
          </div>
        )}

        <div className="space-y-4">
          {responsePriorities.map((zone) => (
            <div key={zone.zoneId} className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Zone header */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    zone.priority === 1 ? 'bg-risk-critical/10 text-risk-critical'
                      : zone.priority === 2 ? 'bg-risk-high/10 text-risk-high'
                      : 'bg-risk-moderate/10 text-risk-moderate'
                  }`}>
                    <ShieldAlert className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-navy-dark">{zone.zoneName}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <PriorityBadge priority={zone.priority} />
                      <AuthorityRiskBadge level={zone.floodRisk} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Priority Factors */}
                <div className="flex-1 lg:max-w-md">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Priority Factors</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div className="rounded-lg bg-surface p-2.5">
                      <p className="text-xs text-ink-muted">Flood Risk</p>
                      <p className="text-sm font-bold capitalize text-navy">{zone.floodRisk}</p>
                    </div>
                    <div className="rounded-lg bg-surface p-2.5">
                      <p className="text-xs text-ink-muted">Population</p>
                      <p className="text-sm font-bold capitalize text-navy">{zone.populationExposure}</p>
                    </div>
                    <div className="rounded-lg bg-surface p-2.5">
                      <p className="text-xs text-ink-muted">Infrastructure</p>
                      <p className="text-sm font-bold text-navy">{zone.infrastructureCount} critical</p>
                    </div>
                    <div className="rounded-lg bg-surface p-2.5">
                      <p className="text-xs text-ink-muted">Road Connectivity</p>
                      <p className="text-sm font-bold capitalize text-navy">{zone.roadConnectivity}</p>
                    </div>
                    <div className="rounded-lg bg-surface p-2.5">
                      <p className="text-xs text-ink-muted">Historical Impact</p>
                      <p className="text-sm font-bold capitalize text-navy">{zone.historicalImpact}</p>
                    </div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="lg:w-56">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Recommended Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    {zone.recommendedActions.map((action) => (
                      <button
                        key={action}
                        onClick={() => setConfirmAction({ action, zone })}
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-blue-light hover:text-navy"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-risk-low" aria-hidden="true" />
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-ink-muted/70">Prototype data — AI priority recommendations are simulated for demonstration</p>
      </div>

      <ConfirmationModal
        open={confirmAction !== null}
        title={`${confirmAction?.action}?`}
        message={`This will confirm "${confirmAction?.action}" for ${confirmAction?.zone.zoneName} in the prototype system.`}
        confirmLabel="Confirm"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </AuthorityLayout>
  );
}
