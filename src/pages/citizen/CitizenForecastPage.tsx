import { useEffect, useState } from 'react';
import { Droplets, CloudRain, Gauge, MapPin, TrendingUp } from 'lucide-react';
import CitizenLayout from '@/components/citizen/CitizenLayout';
import RiskBadge, { riskStyles } from '@/components/citizen/RiskBadge';
import { fetchForecast, fetchAreaDetail } from '@/services/citizen';
import type { ForecastPoint, AreaDetail } from '@/types/citizen';

export default function CitizenForecastPage() {
  const [points, setPoints] = useState<ForecastPoint[]>([]);
  const [area, setArea] = useState<AreaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    Promise.all([fetchForecast(), fetchAreaDetail()]).then(([f, a]) => {
      setPoints(f);
      setArea(a);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <CitizenLayout>
        <div className="flex h-64 items-center justify-center">
          <p className="text-ink-muted">Loading forecast…</p>
        </div>
      </CitizenLayout>
    );
  }

  const current = points[selected];
  const s = riskStyles(current.level);
  const maxPct = Math.max(...points.map((p) => p.percentage));

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-5">
          <h1 className="text-h2 font-bold text-navy-dark">Flood Risk &amp; Forecast</h1>
          <p className="mt-1 text-[15px] text-ink-muted">0–3 Hour Flood Nowcast</p>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {points.map((p, i) => {
            const ps = riskStyles(p.level);
            return (
              <button
                key={p.time}
                onClick={() => setSelected(i)}
                className={`rounded-xl border-2 px-4 py-2.5 text-center transition-all duration-200 ${
                  selected === i
                    ? 'border-navy bg-white shadow-card'
                    : 'border-border bg-white hover:border-blue-primary'
                }`}
              >
                <p className="text-xs font-semibold text-ink-muted">{p.label}</p>
                <p className={`mt-0.5 text-lg font-bold ${ps.text}`}>{p.percentage}%</p>
              </button>
            );
          })}
        </div>

        <div className={`rounded-2xl border-2 ${s.border} ${s.bg} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">Flood Risk at {current.label}</p>
              <p className={`mt-1 text-4xl font-bold ${s.text}`}>{current.percentage}%</p>
            </div>
            <RiskBadge level={current.level} />
          </div>
          <div className="mt-4 flex items-end gap-1.5">
            {points.map((p, i) => {
              const ps = riskStyles(p.level);
              return (
                <button
                  key={p.time}
                  onClick={() => setSelected(i)}
                  className="group flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${ps.dot} ${
                      selected === i ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'
                    }`}
                    style={{ height: `${(p.percentage / maxPct) * 120}px` }}
                  />
                  <span className="text-[10px] font-medium text-ink-muted">{p.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-muted">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            Risk is increasing over the next 3 hours.
          </p>
        </div>

        {area && (
          <div className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="text-lg font-bold text-navy">Area Details</h2>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-muted">Area</p>
                  <p className="text-sm font-semibold text-ink">{area.zone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-muted">Probability</p>
                  <p className="text-sm font-semibold text-ink">{area.probability}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-muted">Expected Onset</p>
                  <p className="text-sm font-semibold text-ink">{area.expectedOnset}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-muted">Confidence</p>
                  <p className="text-sm font-semibold text-ink">{area.confidence}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-muted">Water Level</p>
                  <p className="text-sm font-semibold text-ink">{area.waterLevel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-ink-muted">Rainfall</p>
                  <p className="text-sm font-semibold text-ink">{area.rainfall}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
}
