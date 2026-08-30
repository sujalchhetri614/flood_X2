import { useState, useEffect } from 'react';
import { Ban, Bell, Construction, Route as RouteIcon, TriangleAlert } from 'lucide-react';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';
import ConfirmationModal from '@/components/authority/ConfirmationModal';
import { LoadingState } from '@/components/authority/States';
import { authorityRoads } from '@/data/authorityMockData';
import type { AuthorityRoad } from '@/types/authority';

const STATUS_STYLES: Record<AuthorityRoad['status'], string> = {
  open: 'bg-risk-low/10 text-risk-low',
  closed: 'bg-risk-critical/10 text-risk-critical',
  restricted: 'bg-risk-moderate/10 text-risk-moderate',
};

export default function AuthorityRoadsPage() {
  const [roads, setRoads] = useState<AuthorityRoad[]>(authorityRoads);
  const [selectedRoad, setSelectedRoad] = useState<AuthorityRoad | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<{ type: 'close' | 'alert'; road: AuthorityRoad } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const closeRoad = (roadId: string) => {
    setRoads((prev) => prev.map((r) => (r.id === roadId ? { ...r, status: 'closed' as const } : r)));
    setSelectedRoad((prev) => (prev?.id === roadId ? { ...prev, status: 'closed' as const } : prev));
    setSuccessMsg('Road closed successfully.');
    setConfirmAction(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const issueAlert = (road: AuthorityRoad) => {
    setSuccessMsg(`Alert issued for ${road.name}.`);
    setConfirmAction(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState message="Loading road risk data..." />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">Road Risk Monitoring</h1>
          <p className="mt-1 text-[15px] text-ink-muted">Monitor critical roads for flood risk across the city</p>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-xl border border-risk-low/30 bg-risk-low/10 px-4 py-3 text-sm font-medium text-risk-low animate-slide-in">
            {successMsg}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Road List */}
          <div className="lg:col-span-1">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">All Roads</h2>
            <div className="space-y-2">
              {roads.map((road) => (
                <button
                  key={road.id}
                  onClick={() => setSelectedRoad(road)}
                  className={`w-full rounded-2xl border p-4 text-left shadow-card transition-all duration-200 ${
                    selectedRoad?.id === road.id
                      ? 'border-blue-primary ring-2 ring-blue-primary/25'
                      : 'border-border hover:border-blue-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                      <RouteIcon className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                      {road.name}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[road.status]}`}>
                      {road.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-bold text-navy-dark">{road.riskPercentage}%</span>
                    <AuthorityRiskBadge level={road.riskLevel} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Road Details */}
          <div className="lg:col-span-2">
            {selectedRoad ? (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card animate-slide-up">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-navy-dark">{selectedRoad.name}</h2>
                  <AuthorityRiskBadge level={selectedRoad.riskLevel} />
                </div>

                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Flood Risk</dt>
                    <dd className="mt-1 text-lg font-bold text-navy">{selectedRoad.riskPercentage}%</dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Water Depth</dt>
                    <dd className="mt-1 text-lg font-bold text-navy">{selectedRoad.waterDepth}</dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Time to Impact</dt>
                    <dd className="mt-1 text-lg font-bold text-navy">{selectedRoad.timeToImpact}</dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Traffic Importance</dt>
                    <dd className="mt-1 text-sm font-bold text-navy">{selectedRoad.trafficImportance.toUpperCase()}</dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Status</dt>
                    <dd className="mt-1">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[selectedRoad.status]}`}>
                        {selectedRoad.status.toUpperCase()}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-ink-muted">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setConfirmAction({ type: 'alert', road: selectedRoad })}
                      className="flex items-center gap-2 rounded-xl bg-blue-light px-4 py-2.5 text-sm font-semibold text-blue-primary transition-colors hover:bg-blue-primary hover:text-white"
                    >
                      <Bell className="h-4 w-4" aria-hidden="true" />
                      Issue Alert
                    </button>
                    <button
                      onClick={() => setConfirmAction({ type: 'close', road: selectedRoad })}
                      disabled={selectedRoad.status === 'closed'}
                      className="flex items-center gap-2 rounded-xl bg-risk-critical/10 px-4 py-2.5 text-sm font-semibold text-risk-critical transition-colors hover:bg-risk-critical hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Ban className="h-4 w-4" aria-hidden="true" />
                      Close Road
                    </button>
                    <button className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-blue-light hover:text-navy">
                      <Construction className="h-4 w-4" aria-hidden="true" />
                      Diversion Plan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12">
                <TriangleAlert className="h-8 w-8 text-ink-muted/40" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-ink-muted">Select a road to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={confirmAction !== null}
        title={confirmAction?.type === 'close' ? `Close ${confirmAction.road.name}?` : `Issue Alert for ${confirmAction?.road.name}?`}
        message={confirmAction?.type === 'close'
          ? `This will mark ${confirmAction?.road.name} as CLOSED in the prototype.`
          : `An alert will be created for ${confirmAction?.road.name} with ${confirmAction?.road.riskLevel.toUpperCase()} severity.`}
        confirmLabel={confirmAction?.type === 'close' ? 'Close Road' : 'Send Alert'}
        onConfirm={() => {
          if (confirmAction?.type === 'close') closeRoad(confirmAction.road.id);
          else if (confirmAction) issueAlert(confirmAction.road);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </AuthorityLayout>
  );
}
