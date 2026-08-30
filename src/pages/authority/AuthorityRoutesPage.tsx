import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, Polyline, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Route as RouteIcon, Clock, MapPin, CheckCircle2, Ban, AlertTriangle } from 'lucide-react';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';
import { LoadingState } from '@/components/authority/States';
import { emergencyRoutes, emergencyDestinations, AUTHORITY_MAP_CENTER } from '@/data/authorityMockData';
import type { EmergencyRoute } from '@/types/authority';

const STATUS_STYLES: Record<EmergencyRoute['status'], { bg: string; text: string; icon: typeof CheckCircle2; label: string }> = {
  safe: { bg: 'bg-risk-low/10', text: 'text-risk-low', icon: CheckCircle2, label: 'SAFE' },
  'high-risk': { bg: 'bg-risk-high/10', text: 'text-risk-high', icon: AlertTriangle, label: 'HIGH RISK' },
  blocked: { bg: 'bg-risk-critical/10', text: 'text-risk-critical', icon: Ban, label: 'BLOCKED' },
};

const ROUTE_COLORS: Record<EmergencyRoute['status'], string> = {
  safe: '#15803D',
  'high-risk': '#EA580C',
  blocked: '#DC2626',
};

function createIcon(html: string, size = 28) {
  return L.divIcon({ html, className: 'fx-map-icon', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

const baseIcon = createIcon(
  '<div style="background:#123B7A;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:12px;font-weight:bold;">HQ</div>',
);

export default function AuthorityRoutesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState(emergencyDestinations[0].id);
  const [searched, setSearched] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<EmergencyRoute | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const dest = emergencyDestinations.find((d) => d.id === selectedDest) ?? emergencyDestinations[0];
  const destIcon = createIcon(
    `<div style="background:#DC2626;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:14px;">📍</div>`,
  );

  const handleSearch = () => {
    setSearched(true);
    setSelectedRoute(emergencyRoutes.find((r) => r.recommended) ?? null);
  };

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState message="Calculating safe routes..." />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">Emergency Team Safe Route</h1>
          <p className="mt-1 text-[15px] text-ink-muted">Find safe routes for emergency response teams</p>
        </div>

        {/* Form */}
        <div className="mb-5 rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">From</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
                <Navigation className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-navy">Emergency Base</span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">To</label>
              <select
                value={selectedDest}
                onChange={(e) => { setSelectedDest(e.target.value); setSearched(false); }}
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-blue-primary"
              >
                {emergencyDestinations.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
              >
                Find Safe Route
              </button>
            </div>
          </div>
        </div>

        {searched ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Route List */}
            <div className="lg:col-span-1">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Available Routes</h2>
              <div className="space-y-2">
                {emergencyRoutes.map((route) => {
                  const s = STATUS_STYLES[route.status];
                  const StatusIcon = s.icon;
                  return (
                    <button
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      className={`w-full rounded-2xl border p-4 text-left shadow-card transition-all duration-200 ${
                        selectedRoute?.id === route.id
                          ? 'border-blue-primary ring-2 ring-blue-primary/25'
                          : 'border-border hover:border-blue-primary'
                      } ${route.recommended ? 'border-risk-low/40 bg-risk-low/5' : ''}`}
                    >
                      {route.recommended && (
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-risk-low/10 px-2 py-0.5 text-xs font-semibold text-risk-low">
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> RECOMMENDED
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                          <RouteIcon className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                          {route.label}
                        </span>
                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
                          <StatusIcon className="h-3 w-3" aria-hidden="true" />
                          {s.label}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-ink-muted">
                        <span>{route.distance}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{route.travelTime}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map + Details */}
            <div className="lg:col-span-2">
              {selectedRoute ? (
                <>
                  {/* Route Details */}
                  <div className="mb-4 rounded-2xl border border-border bg-white p-5 shadow-card">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-navy-dark">{selectedRoute.label}</h2>
                      <AuthorityRiskBadge level={selectedRoute.riskLevel} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">Distance</dt>
                        <dd className="mt-1 text-lg font-bold text-navy">{selectedRoute.distance}</dd>
                      </div>
                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">Travel Time</dt>
                        <dd className="mt-1 text-lg font-bold text-navy">{selectedRoute.travelTime}</dd>
                      </div>
                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">Road Condition</dt>
                        <dd className="mt-1 text-sm font-bold uppercase text-navy">{selectedRoute.roadCondition}</dd>
                      </div>
                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">Status</dt>
                        <dd className="mt-1">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[selectedRoute.status].bg} ${STATUS_STYLES[selectedRoute.status].text}`}>
                            {STATUS_STYLES[selectedRoute.status].label}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Map */}
                  <div className="h-80 w-full overflow-hidden rounded-2xl border border-border sm:h-96">
                    <MapContainer center={AUTHORITY_MAP_CENTER} zoom={13} scrollWheelZoom={false} className="h-full w-full" attributionControl={false}>
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                      <Polyline
                        positions={selectedRoute.coordinates}
                        pathOptions={{ color: ROUTE_COLORS[selectedRoute.status], weight: 5, opacity: 0.8 }}
                      />
                      <Marker position={AUTHORITY_MAP_CENTER} icon={baseIcon}>
                        <Popup><div className="font-semibold text-navy">Emergency Base</div></Popup>
                      </Marker>
                      <Marker position={dest.coordinates} icon={destIcon}>
                        <Popup><div className="font-semibold text-navy">{dest.label}</div></Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <p className="mt-3 text-xs text-ink-muted/70">Prototype data — route geometry is simulated, not real navigation</p>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12">
                  <MapPin className="h-8 w-8 text-ink-muted/40" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-ink-muted">Select a route to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12">
            <Navigation className="h-8 w-8 text-ink-muted/40" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-ink-muted">Select a destination and click "Find Safe Route"</p>
          </div>
        )}
      </div>
    </AuthorityLayout>
  );
}
