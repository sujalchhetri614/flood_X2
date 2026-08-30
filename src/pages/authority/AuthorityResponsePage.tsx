import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Users,
  Building2,
  Route,
  History,
  ShieldAlert,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge, {
  PriorityBadge,
} from '@/components/authority/AuthorityRiskBadge';
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

function getPriorityScore(priority: number) {
  if (priority === 1) return 92;
  if (priority === 2) return 76;
  return 58;
}

function getPriorityColor(priority: number) {
  if (priority === 1) return 'bg-risk-critical';
  if (priority === 2) return 'bg-risk-high';
  return 'bg-risk-moderate';
}

export default function AuthorityResponsePage() {
  const [loading, setLoading] = useState(true);

  const [confirmAction, setConfirmAction] =
    useState<{
      action: string;
      zone: ResponsePriority;
    } | null>(null);

  const [successMsg, setSuccessMsg] =
    useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(t);
  }, []);

  const handleConfirm = () => {
    if (confirmAction) {
      setSuccessMsg(
        `${confirmAction.action} confirmed for ${confirmAction.zone.zoneName}.`,
      );

      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
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

  const priority1Count =
    responsePriorities.filter(
      (zone) => zone.priority === 1,
    ).length;

  const priority2Count =
    responsePriorities.filter(
      (zone) => zone.priority === 2,
    ).length;

  const priority3Count =
    responsePriorities.filter(
      (zone) => zone.priority === 3,
    ).length;

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">

        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">
            Response Priority
          </h1>

          <p className="mt-1 text-[15px] text-ink-muted">
            AI-assisted prioritization of zones for immediate action
          </p>
        </div>


        {/* SUCCESS MESSAGE */}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-risk-low/30 bg-risk-low/10 px-4 py-3 text-sm font-medium text-risk-low animate-slide-in">

            <CheckCircle2
              className="h-4 w-4"
              aria-hidden="true"
            />

            {successMsg}

          </div>
        )}


        {/* SUMMARY CARDS */}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
            <p className="text-xs text-ink-muted">
              Priority 1
            </p>

            <p className="mt-1 text-2xl font-bold text-risk-critical">
              {priority1Count}
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              Immediate action
            </p>
          </div>


          <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
            <p className="text-xs text-ink-muted">
              Priority 2
            </p>

            <p className="mt-1 text-2xl font-bold text-risk-high">
              {priority2Count}
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              High urgency
            </p>
          </div>


          <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
            <p className="text-xs text-ink-muted">
              Priority 3
            </p>

            <p className="mt-1 text-2xl font-bold text-risk-moderate">
              {priority3Count}
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              Monitor closely
            </p>
          </div>


          <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
            <p className="text-xs text-ink-muted">
              Total Zones
            </p>

            <p className="mt-1 text-2xl font-bold text-navy">
              {responsePriorities.length}
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              Under assessment
            </p>
          </div>

        </div>


        {/* PRIORITY ZONES */}

        <div className="space-y-4">

          {responsePriorities.map((zone) => {

            const priorityScore =
              getPriorityScore(zone.priority);

            return (
              <div
                key={zone.zoneId}
                className="rounded-2xl border border-border bg-white p-5 shadow-card"
              >

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                  {/* ZONE HEADER */}

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        zone.priority === 1
                          ? 'bg-risk-critical/10 text-risk-critical'
                          : zone.priority === 2
                            ? 'bg-risk-high/10 text-risk-high'
                            : 'bg-risk-moderate/10 text-risk-moderate'
                      }`}
                    >
                      <ShieldAlert
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </div>


                    <div>

                      <p className="text-lg font-bold text-navy-dark">
                        {zone.zoneName}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">

                        <PriorityBadge
                          priority={zone.priority}
                        />

                        <AuthorityRiskBadge
                          level={zone.floodRisk}
                          size="sm"
                        />

                        <span className="rounded-full bg-blue-light px-2 py-1 text-[10px] font-bold text-blue-primary">
                          SCORE {priorityScore}/100
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* PRIORITY FACTORS */}

                  <div className="flex-1 lg:max-w-md">

                    {/* SCORE BAR */}

                    <div className="mb-4">

                      <div className="mb-1.5 flex items-center justify-between">

                        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">

                          <BarChart3
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />

                          Response Priority Score

                        </span>

                        <span className="text-sm font-bold text-navy">
                          {priorityScore}/100
                        </span>

                      </div>


                      <div className="h-2 overflow-hidden rounded-full bg-surface">

                        <div
                          className={`h-full rounded-full transition-all ${getPriorityColor(
                            zone.priority,
                          )}`}
                          style={{
                            width: `${priorityScore}%`,
                          }}
                        />

                      </div>

                    </div>


                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Priority Factors
                    </h3>


                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                      <div className="rounded-lg bg-surface p-2.5">
                        <p className="text-xs text-ink-muted">
                          Flood Risk
                        </p>

                        <p className="text-sm font-bold capitalize text-navy">
                          {zone.floodRisk}
                        </p>
                      </div>


                      <div className="rounded-lg bg-surface p-2.5">
                        <p className="text-xs text-ink-muted">
                          Population
                        </p>

                        <p className="text-sm font-bold capitalize text-navy">
                          {zone.populationExposure}
                        </p>
                      </div>


                      <div className="rounded-lg bg-surface p-2.5">
                        <p className="text-xs text-ink-muted">
                          Infrastructure
                        </p>

                        <p className="text-sm font-bold text-navy">
                          {zone.infrastructureCount} critical
                        </p>
                      </div>


                      <div className="rounded-lg bg-surface p-2.5">
                        <p className="text-xs text-ink-muted">
                          Road Connectivity
                        </p>

                        <p className="text-sm font-bold capitalize text-navy">
                          {zone.roadConnectivity}
                        </p>
                      </div>


                      <div className="rounded-lg bg-surface p-2.5">
                        <p className="text-xs text-ink-muted">
                          Historical Impact
                        </p>

                        <p className="text-sm font-bold capitalize text-navy">
                          {zone.historicalImpact}
                        </p>
                      </div>

                    </div>

                  </div>


                  {/* RECOMMENDED ACTIONS */}

                  <div className="lg:w-64">

                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Recommended Actions
                    </h3>


                    {zone.priority === 1 && (
                      <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-risk-critical/10 px-2.5 py-2 text-xs font-semibold text-risk-critical">

                        <AlertTriangle
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />

                        Immediate authority intervention required

                      </div>
                    )}


                    <div className="flex flex-wrap gap-2">

                      {zone.recommendedActions.map(
                        (action) => (
                          <button
                            key={action}
                            type="button"
                            onClick={() =>
                              setConfirmAction({
                                action,
                                zone,
                              })
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-blue-light hover:text-navy"
                          >

                            <CheckCircle2
                              className="h-3.5 w-3.5 text-risk-low"
                              aria-hidden="true"
                            />

                            {action}

                          </button>
                        ),
                      )}

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>


        {/* MODEL STATUS */}

        <div className="mt-5 rounded-2xl border border-blue-primary/20 bg-blue-light/30 p-4">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>

              <p className="font-semibold text-navy">
                Response Priority Engine
              </p>

              <p className="mt-1 text-xs text-ink-muted">
                Priority is based on flood risk,
                population exposure, infrastructure,
                road connectivity and historical impact.
              </p>

            </div>

            <span className="rounded-full bg-risk-low/10 px-3 py-1.5 text-xs font-bold text-risk-low">
              MODEL ACTIVE
            </span>

          </div>

        </div>


        <p className="mt-4 text-xs text-ink-muted/70">
          Prototype data — AI priority recommendations
          are simulated for demonstration.
        </p>

      </div>


      {/* CONFIRMATION MODAL */}

      <ConfirmationModal
        open={confirmAction !== null}

        title={`${confirmAction?.action ?? ''}?`}

        message={
          confirmAction
            ? `This will confirm "${confirmAction.action}" for ${confirmAction.zone.zoneName} in the prototype system.`
            : ''
        }

        confirmLabel="Confirm"

        onConfirm={handleConfirm}

        onCancel={() =>
          setConfirmAction(null)
        }
      />

    </AuthorityLayout>
  );
}