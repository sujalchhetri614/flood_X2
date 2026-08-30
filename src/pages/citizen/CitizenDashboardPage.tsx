import { useNavigate } from 'react-router-dom';
import { Bell, CloudRain, Droplets, Map as MapIcon, Route, Sun, TriangleAlert } from 'lucide-react';
import CitizenLayout from '@/components/citizen/CitizenLayout';
import RiskCard from '@/components/citizen/RiskCard';
import QuickActionCard from '@/components/citizen/QuickActionCard';
import MapPreview from '@/components/map/MapPreview';
import MapLegend from '@/components/citizen/MapLegend';
import { currentRisk, weatherSummary, alerts } from '@/data/citizenMockData';

export default function CitizenDashboardPage() {
  const navigate = useNavigate();
  const activeAlert = alerts[0];

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">Good Morning, Citizen</h1>
          <p className="mt-1 flex items-center gap-1.5 text-[15px] text-ink-muted">
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-light px-2.5 py-1 text-sm font-medium text-navy">
              📍 Kolkata
            </span>
            Current Location
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RiskCard risk={currentRisk} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <Droplets className="h-5 w-5 text-blue-primary" aria-hidden="true" />
              <p className="mt-2 text-xs font-medium text-ink-muted">Rainfall</p>
              <p className="text-lg font-bold text-navy">{weatherSummary.rainfall}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <CloudRain className="h-5 w-5 text-blue-primary" aria-hidden="true" />
              <p className="mt-2 text-xs font-medium text-ink-muted">Water Level</p>
              <p className="text-lg font-bold text-navy">{weatherSummary.waterLevel}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <Sun className="h-5 w-5 text-blue-primary" aria-hidden="true" />
              <p className="mt-2 text-xs font-medium text-ink-muted">Weather</p>
              <p className="text-sm font-bold text-navy">{weatherSummary.weather}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickActionCard icon={<MapIcon className="h-6 w-6" />} label="View Map" onClick={() => navigate('/citizen/map')} />
            <QuickActionCard icon={<Route className="h-6 w-6" />} label="Safe Route" onClick={() => navigate('/citizen/safe-route')} />
            <QuickActionCard icon={<TriangleAlert className="h-6 w-6" />} label="Report Flood" onClick={() => navigate('/citizen/report')} />
            <QuickActionCard icon={<Bell className="h-6 w-6" />} label="Alerts" onClick={() => navigate('/citizen/alerts')} />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-risk-high/30 bg-risk-high/10 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-risk-high/20 text-risk-high">
              <TriangleAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h3 className="font-bold text-risk-high">{activeAlert.title}</h3>
              <p className="mt-1 text-sm text-ink">{activeAlert.description}</p>
              <p className="mt-1.5 text-sm text-ink-muted">
                Expected onset: <span className="font-semibold text-ink">{activeAlert.time}</span>
              </p>
              <button
                onClick={() => navigate(activeAlert.actionPath)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-risk-high hover:underline"
              >
                View Alert
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Map Preview</h2>
            <button
              onClick={() => navigate('/citizen/map')}
              className="text-sm font-semibold text-blue-primary hover:underline"
            >
              View Full Map
            </button>
          </div>
          <div className="relative">
            <MapPreview />
            <div className="absolute bottom-3 right-3">
              <MapLegend />
            </div>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
