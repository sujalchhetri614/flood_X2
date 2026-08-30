import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, ChevronRight, MapPin } from 'lucide-react';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import KpiCard from '@/components/authority/KpiCard';
import { LoadingState } from '@/components/authority/States';
import { MapContainer, Polygon, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import MapLegend from '@/components/citizen/MapLegend';
import {
  aiRecommendations,
  authorityFloodZones,
  authorityInfrastructure,
  authorityRoads,
  authorityReports,
  kpiData,
  AUTHORITY_MAP_CENTER,
} from '@/data/authorityMockData';
import type { AiRecommendation } from '@/types/authority';
import { useState, useEffect } from 'react';

const RISK_COLORS: Record<string, string> = {
  low: '#15803D',
  moderate: '#CA8A04',
  high: '#EA580C',
  critical: '#DC2626',
};

function createIcon(html: string) {
  return L.divIcon({ html, className: 'fx-map-icon', iconSize: [24, 24], iconAnchor: [12, 12] });
}

const infraIcons: Record<string, string> = {
  hospital: '🏥',
  'fire-station': '🚒',
  'police-station': '👮',
  school: '🏫',
  shelter: '🏠',
};

const recCategoryColors: Record<AiRecommendation['category'], string> = {
  road: 'text-risk-high',
  infrastructure: 'text-blue-primary',
  zone: 'text-risk-critical',
  shelter: 'text-risk-low',
  evacuation: 'text-emergency',
};

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState message="Loading city risk data..." />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">Command Center Overview</h1>
          <p className="mt-1 flex items-center gap-1.5 text-[15px] text-ink-muted">
            <MapPin className="h-4 w-4 text-blue-primary" aria-hidden="true" />
            Kolkata Municipal Area · Real-time Flood Monitoring
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Map + AI Recommendations */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {/* Live Flood Map */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Live Flood Map</h2>
              <button
                onClick={() => navigate('/authority/map')}
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-primary hover:underline"
              >
                Open Detailed Map
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border sm:h-96">
              <MapContainer center={AUTHORITY_MAP_CENTER} zoom={13} scrollWheelZoom={false} className="h-full w-full" attributionControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                {authorityFloodZones.map((zone) => (
                  <Polygon
                    key={zone.id}
                    positions={zone.polygon}
                    pathOptions={{
                      color: RISK_COLORS[zone.riskLevel],
                      fillColor: RISK_COLORS[zone.riskLevel],
                      fillOpacity: 0.25,
                      weight: 2,
                    }}
                  />
                ))}
                {authorityRoads.map((road) => (
                  <Polyline
                    key={road.id}
                    positions={road.coordinates}
                    pathOptions={{
                      color: road.riskLevel === 'critical' ? '#DC2626' : road.riskLevel === 'high' ? '#EA580C' : '#52667A',
                      weight: road.riskLevel === 'critical' || road.riskLevel === 'high' ? 4 : 3,
                      opacity: 0.7,
                      dashArray: road.riskLevel === 'critical' ? '8 4' : undefined,
                    }}
                  />
                ))}
                {authorityInfrastructure.map((infra) => (
                  <Marker
                    key={infra.id}
                    position={infra.coordinates}
                    icon={createIcon(
                      `<div style="background:white;border:2px solid ${RISK_COLORS[infra.riskLevel]};border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.2);">${infraIcons[infra.type] ?? '📍'}</div>`,
                    )}
                  />
                ))}
              </MapContainer>
              <div className="absolute bottom-3 right-3">
                <MapLegend />
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <div className="mb-3 flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-blue-primary" aria-hidden="true" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Decision Support</h2>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="mb-3 text-xs text-ink-muted">
                AI-generated recommendations based on current flood model. Prototype data.
              </p>
              <ul className="space-y-2.5">
                {aiRecommendations.map((rec) => (
                  <li key={rec.id} className="flex items-start gap-2.5 rounded-xl bg-surface p-3">
                    <span className={`mt-0.5 text-sm font-bold ${recCategoryColors[rec.category]}`}>
                      P{rec.priority}
                    </span>
                    <p className="flex-1 text-sm text-ink">{rec.text}</p>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/authority/response')}
                className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-blue-light py-2 text-sm font-semibold text-blue-primary transition-colors hover:bg-blue-primary hover:text-white"
              >
                View Response Priority
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Citizen Reports */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Recent Citizen Reports</h2>
            <button
              onClick={() => navigate('/authority/reports')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-primary hover:underline"
            >
              View All Reports
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Report</th>
                  <th className="px-4 py-3 font-semibold">Zone</th>
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {authorityReports.slice(0, 4).map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => navigate('/authority/reports')}
                    className="cursor-pointer transition-colors hover:bg-blue-light/50"
                  >
                    <td className="px-4 py-3 font-semibold text-navy">#{report.numericId}</td>
                    <td className="px-4 py-3 text-ink">{report.zone}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${
                        report.severity === 'critical' ? 'text-risk-critical'
                          : report.severity === 'high' ? 'text-risk-high'
                          : report.severity === 'moderate' ? 'text-risk-moderate'
                          : 'text-risk-low'
                      }`}>
                        {report.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{report.submittedAt.split(' ')[1]}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        report.status === 'new' ? 'bg-risk-critical/10 text-risk-critical'
                          : report.status === 'verified' ? 'bg-blue-light text-blue-primary'
                          : report.status === 'resolved' ? 'bg-risk-low/10 text-risk-low'
                          : 'bg-risk-moderate/10 text-risk-moderate'
                      }`}>
                        {report.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
}
