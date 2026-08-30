import { useState, useEffect } from 'react';
import { Building2, Hospital, Siren, Shield, School, Home, Zap, Send, AlertCircle } from 'lucide-react';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';
import ConfirmationModal from '@/components/authority/ConfirmationModal';
import { LoadingState } from '@/components/authority/States';
import { authorityInfrastructure } from '@/data/authorityMockData';
import type { AuthorityInfrastructure, InfrastructureType } from '@/types/authority';

const TYPE_ICONS: Record<InfrastructureType, typeof Building2> = {
  hospital: Hospital,
  'fire-station': Siren,
  'police-station': Shield,
  school: School,
  shelter: Home,
};

const ACCESS_STYLES: Record<string, string> = {
  operational: 'bg-risk-low/10 text-risk-low',
  'at-risk': 'bg-risk-high/10 text-risk-high',
  critical: 'bg-risk-critical/10 text-risk-critical',
  offline: 'bg-ink-muted/10 text-ink-muted',
};

const POWER_STYLES: Record<string, string> = {
  stable: 'text-risk-low',
  backup: 'text-risk-moderate',
  down: 'text-risk-critical',
};

export default function AuthorityInfrastructurePage() {
  const [selected, setSelected] = useState<AuthorityInfrastructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleAction = (action: string) => {
    setSuccessMsg(`${action} confirmed for ${selected?.name}.`);
    setConfirmAction(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState message="Loading infrastructure data..." />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">Critical Infrastructure</h1>
          <p className="mt-1 text-[15px] text-ink-muted">Monitor flood risk to hospitals, shelters, and emergency facilities</p>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-xl border border-risk-low/30 bg-risk-low/10 px-4 py-3 text-sm font-medium text-risk-low animate-slide-in">
            {successMsg}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Infrastructure List */}
          <div className="lg:col-span-1">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">All Facilities</h2>
            <div className="space-y-2">
              {authorityInfrastructure.map((infra) => {
                const Icon = TYPE_ICONS[infra.type];
                return (
                  <button
                    key={infra.id}
                    onClick={() => setSelected(infra)}
                    className={`w-full rounded-2xl border p-4 text-left shadow-card transition-all duration-200 ${
                      selected?.id === infra.id
                        ? 'border-blue-primary ring-2 ring-blue-primary/25'
                        : 'border-border hover:border-blue-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        infra.riskLevel === 'critical' || infra.riskLevel === 'high'
                          ? 'bg-risk-high/10 text-risk-high'
                          : infra.riskLevel === 'moderate'
                          ? 'bg-risk-moderate/10 text-risk-moderate'
                          : 'bg-risk-low/10 text-risk-low'
                      }`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-navy">{infra.name}</p>
                        <p className="text-xs text-ink-muted">{infra.riskPercentage}% risk</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-card animate-slide-up">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-navy-dark">{selected.name}</h2>
                  <AuthorityRiskBadge level={selected.riskLevel} />
                </div>

                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Flood Risk</dt>
                    <dd className="mt-1 text-lg font-bold text-navy">{selected.riskPercentage}%</dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Water Depth</dt>
                    <dd className="mt-1 text-lg font-bold text-navy">{selected.waterDepth}</dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Accessibility</dt>
                    <dd className="mt-1">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ACCESS_STYLES[selected.accessibility]}`}>
                        {selected.accessibility.replace('-', ' ').toUpperCase()}
                      </span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Power</dt>
                    <dd className="mt-1 flex items-center gap-1.5">
                      <Zap className={`h-4 w-4 ${POWER_STYLES[selected.power]}`} aria-hidden="true" />
                      <span className="text-sm font-bold text-navy">{selected.power.toUpperCase()}</span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-surface p-3">
                    <dt className="text-xs text-ink-muted">Safe Route</dt>
                    <dd className="mt-1">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        selected.safeRouteAvailable ? 'bg-risk-low/10 text-risk-low' : 'bg-risk-critical/10 text-risk-critical'
                      }`}>
                        {selected.safeRouteAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-ink-muted">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setConfirmAction('Send Alert')}
                      className="flex items-center gap-2 rounded-xl bg-blue-light px-4 py-2.5 text-sm font-semibold text-blue-primary transition-colors hover:bg-blue-primary hover:text-white"
                    >
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      Send Alert
                    </button>
                    <button
                      onClick={() => setConfirmAction('Deploy Team')}
                      className="flex items-center gap-2 rounded-xl bg-risk-high/10 px-4 py-2.5 text-sm font-semibold text-risk-high transition-colors hover:bg-risk-high hover:text-white"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      Deploy Team
                    </button>
                    <button
                      onClick={() => setConfirmAction('Prioritize Support')}
                      className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-blue-light hover:text-navy"
                    >
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      Prioritize Support
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12">
                <Building2 className="h-8 w-8 text-ink-muted/40" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-ink-muted">Select a facility to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={confirmAction !== null}
        title={`${confirmAction}?`}
        message={`This action will be recorded for ${selected?.name} in the prototype system.`}
        confirmLabel={confirmAction ?? 'Confirm'}
        onConfirm={() => confirmAction && handleAction(confirmAction)}
        onCancel={() => setConfirmAction(null)}
      />
    </AuthorityLayout>
  );
}
