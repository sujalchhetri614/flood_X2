import { useState, useEffect } from 'react';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';
import { LoadingState } from '@/components/authority/States';
import { nowcastByZone } from '@/data/authorityMockData';
import type { NowcastZone } from '@/types/authority';

export default function AuthorityForecastPage() {
  const [selectedZoneId, setSelectedZoneId] = useState('zone-b');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const zone: NowcastZone = nowcastByZone.find((z) => z.zoneId === selectedZoneId) ?? nowcastByZone[0];

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState message="Loading nowcast data..." />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">0–3 Hour Flood Nowcast</h1>
          <p className="mt-1 text-[15px] text-ink-muted">Short-term flood prediction by zone</p>
        </div>

        {/* Zone Selector */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-ink">Select Zone</label>
          <div className="flex flex-wrap gap-2">
            {nowcastByZone.map((z) => (
              <button
                key={z.zoneId}
                onClick={() => setSelectedZoneId(z.zoneId)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  selectedZoneId === z.zoneId
                    ? 'bg-navy text-white shadow-sm'
                    : 'border border-border bg-white text-ink-muted hover:bg-blue-light hover:text-navy'
                }`}
              >
                {z.zoneName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Nowcast Table */}
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">AI Nowcast Results</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-card">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Time</th>
                    <th className="px-4 py-3 font-semibold">Probability</th>
                    <th className="px-4 py-3 font-semibold">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {zone.points.map((point) => (
                    <tr key={point.time} className="transition-colors hover:bg-blue-light/40">
                      <td className="px-4 py-3 font-semibold text-navy">{point.label}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-surface sm:w-32">
                            <div
                              className={`h-full rounded-full ${
                                point.riskLevel === 'critical' ? 'bg-risk-critical'
                                  : point.riskLevel === 'high' ? 'bg-risk-high'
                                  : point.riskLevel === 'moderate' ? 'bg-risk-moderate'
                                  : 'bg-risk-low'
                              }`}
                              style={{ width: `${point.probability}%` }}
                            />
                          </div>
                          <span className="font-semibold text-ink">{point.probability}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AuthorityRiskBadge level={point.riskLevel} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Graph */}
            <div className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-card">
              <h3 className="mb-4 text-sm font-semibold text-navy">Flood Probability Trend</h3>
              <div className="flex h-48 items-end justify-between gap-2 sm:gap-4">
                {zone.points.map((point) => (
                  <div key={point.time} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-bold text-ink">{point.probability}%</span>
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          point.riskLevel === 'critical' ? 'bg-risk-critical'
                            : point.riskLevel === 'high' ? 'bg-risk-high'
                            : point.riskLevel === 'moderate' ? 'bg-risk-moderate'
                            : 'bg-risk-low'
                        }`}
                        style={{ height: `${point.probability}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-ink-muted">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Nowcast Summary</h2>
            <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <p className="text-lg font-bold text-navy">{zone.zoneName}</p>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-sm text-ink-muted">Current Risk</dt>
                  <dd className="mt-1"><AuthorityRiskBadge level={zone.currentRisk} /></dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-muted">Peak Predicted Risk</dt>
                  <dd className="mt-1"><AuthorityRiskBadge level={zone.peakRisk} /></dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <dt className="text-sm text-ink-muted">Peak Time</dt>
                  <dd className="text-sm font-semibold text-ink">{zone.peakTime}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-ink-muted">Expected Onset</dt>
                  <dd className="text-sm font-semibold text-ink">{zone.expectedOnset}</dd>
                </div>
              </dl>
            </div>
            <p className="mt-3 text-xs text-ink-muted/70">Prototype data — AI model prediction simulated</p>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
}
