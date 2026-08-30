import { useState } from 'react';
import { MapContainer, Polygon, Polyline, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { Maximize2, RotateCcw, Search } from 'lucide-react';
import AuthorityLayout from '@/components/authority/AuthorityLayout';
import LayerControl from '@/components/authority/LayerControl';
import TimeSlider from '@/components/authority/TimeSlider';
import MapLegend from '@/components/citizen/MapLegend';
import {
  authorityFloodZones,
  authorityInfrastructure,
  authorityRoads,
  authorityReports,
  mapLayers as initialLayers,
  timeSliderOptions,
  timeSliderRiskMap,
  AUTHORITY_MAP_CENTER,
} from '@/data/authorityMockData';
import type { MapLayer } from '@/types/authority';
import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';

const RISK_COLORS: Record<string, string> = {
  low: '#15803D',
  moderate: '#CA8A04',
  high: '#EA580C',
  critical: '#DC2626',
};

function createIcon(html: string, size = 28) {
  return L.divIcon({ html, className: 'fx-map-icon', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

const infraIcons: Record<string, string> = {
  hospital: '🏥',
  'fire-station': '🚒',
  'police-station': '👮',
  school: '🏫',
  shelter: '🏠',
};

export default function AuthorityMapPage() {
  const [layers, setLayers] = useState<MapLayer[]>(initialLayers);
  const [timeValue, setTimeValue] = useState('now');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const toggleLayer = (id: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const isLayerOn = (type: string) => layers.find((l) => l.type === type)?.enabled ?? false;
  const selectedZoneData = authorityFloodZones.find((z) => z.id === selectedZone);

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">
        <div className="mb-4">
          <h1 className="text-h2 font-bold text-navy-dark">Detailed Flood Map</h1>
          <p className="mt-1 text-[15px] text-ink-muted">City-wide flood risk visualization with GIS layers</p>
        </div>

        {/* Map Tools Bar */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-card">
            <Search className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search location..."
              className="w-40 border-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/60 sm:w-56"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-ink-muted shadow-card transition-colors hover:bg-blue-light hover:text-navy">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset View
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-ink-muted shadow-card transition-colors hover:bg-blue-light hover:text-navy">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
            Fullscreen
          </button>
        </div>

        {/* Map + Controls */}
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-border sm:h-[600px]">
              <MapContainer center={AUTHORITY_MAP_CENTER} zoom={13} scrollWheelZoom className="h-full w-full">
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                {isLayerOn('flood-risk') &&
                  authorityFloodZones.map((zone) => (
                    <Polygon
                      key={zone.id}
                      positions={zone.polygon}
                      pathOptions={{
                        color: RISK_COLORS[zone.riskLevel],
                        fillColor: RISK_COLORS[zone.riskLevel],
                        fillOpacity: 0.25,
                        weight: 2,
                      }}
                      eventHandlers={{ click: () => setSelectedZone(zone.id) }}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <p className="font-bold text-navy">{zone.name}</p>
                          <dl className="mt-2 space-y-1 text-sm">
                            <div>
                              <dt className="inline text-gray-500">Flood Risk: </dt>
                              <dd className="inline font-bold" style={{ color: RISK_COLORS[zone.riskLevel] }}>
                                {zone.riskLevel.toUpperCase()}
                              </dd>
                            </div>
                            <div>
                              <dt className="inline text-gray-500">Probability: </dt>
                              <dd className="inline font-semibold">{zone.probability}%</dd>
                            </div>
                            <div>
                              <dt className="inline text-gray-500">Expected Water Depth: </dt>
                              <dd className="inline font-semibold">{zone.waterDepth}</dd>
                            </div>
                            <div>
                              <dt className="inline text-gray-500">Expected Onset: </dt>
                              <dd className="inline font-semibold">{zone.expectedOnset}</dd>
                            </div>
                            <div>
                              <dt className="inline text-gray-500">Confidence: </dt>
                              <dd className="inline font-semibold">{zone.confidence}%</dd>
                            </div>
                            <div>
                              <dt className="inline text-gray-500">Affected Roads: </dt>
                              <dd className="inline font-semibold">{zone.affectedRoads}</dd>
                            </div>
                            <div>
                              <dt className="inline text-gray-500">Nearby Infrastructure: </dt>
                              <dd className="inline font-semibold">{zone.nearbyInfrastructure}</dd>
                            </div>
                          </dl>
                        </div>
                      </Popup>
                    </Polygon>
                  ))}

                {isLayerOn('roads') &&
                  authorityRoads.map((road) => (
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

                {authorityInfrastructure.map((infra) => {
                  const layerType = infra.type === 'hospital' ? 'hospitals'
                    : infra.type === 'fire-station' ? 'fire'
                    : infra.type === 'police-station' ? 'police'
                    : infra.type === 'school' ? 'schools'
                    : 'shelters';
                  if (!isLayerOn(layerType)) return null;
                  return (
                    <Marker
                      key={infra.id}
                      position={infra.coordinates}
                      icon={createIcon(
                        `<div style="background:white;border:2px solid ${RISK_COLORS[infra.riskLevel]};border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${infraIcons[infra.type] ?? '📍'}</div>`,
                      )}
                    >
                      <Popup>
                        <div className="min-w-[160px]">
                          <p className="font-bold text-navy">{infra.name}</p>
                          <p className="text-sm text-gray-500">Risk: {infra.riskPercentage}%</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                {isLayerOn('citizen-reports') &&
                  authorityReports
                    .filter((r) => r.hasPhoto || r.severity === 'critical' || r.severity === 'high')
                    .map((report) => (
                      <Marker
                        key={report.id}
                        position={[
                          22.56 + (report.numericId % 10) * 0.003,
                          88.36 + (report.numericId % 7) * 0.004,
                        ]}
                        icon={createIcon(
                          `<div style="background:#DC2626;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">!</div>`,
                          24,
                        )}
                      >
                        <Popup>
                          <div className="min-w-[160px]">
                            <p className="font-bold text-navy">Report #{report.numericId}</p>
                            <p className="text-sm text-gray-500">{report.zone} — {report.severity.toUpperCase()}</p>
                            <p className="text-xs text-gray-400">{report.submittedAt}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
              </MapContainer>

              {/* Overlay Controls */}
              <div className="absolute right-3 top-3 z-[1000]">
                <LayerControl layers={layers} onToggle={toggleLayer} />
              </div>
              <div className="absolute bottom-3 left-3 z-[1000]">
                <MapLegend />
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <TimeSlider options={timeSliderOptions} value={timeValue} onChange={setTimeValue} />

            {/* Time-based risk preview */}
            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Risk by Zone — {timeSliderOptions.find((o) => o.value === timeValue)?.label}</p>
              <ul className="space-y-2">
                {authorityFloodZones.map((zone) => {
                  const riskKey = `zone${zone.id.charAt(5).toUpperCase()}` as keyof typeof timeSliderRiskMap[string];
                  const riskLabel = timeSliderRiskMap[timeValue]?.[riskKey] ?? '—';
                  const riskColor = riskLabel === 'Critical' ? 'text-risk-critical'
                    : riskLabel === 'High' ? 'text-risk-high'
                    : riskLabel === 'Moderate' ? 'text-risk-moderate'
                    : 'text-risk-low';
                  return (
                    <li key={zone.id} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                      <span className="text-sm font-medium text-ink">{zone.name}</span>
                      <span className={`text-sm font-bold ${riskColor}`}>{riskLabel}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Selected Zone Details */}
            {selectedZoneData && (
              <div className="rounded-2xl border border-blue-primary/30 bg-blue-light/50 p-4 shadow-card animate-slide-up">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-bold text-navy">{selectedZoneData.name}</p>
                  <AuthorityRiskBadge level={selectedZoneData.riskLevel} size="sm" />
                </div>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Probability</dt>
                    <dd className="font-semibold text-ink">{selectedZoneData.probability}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Water Depth</dt>
                    <dd className="font-semibold text-ink">{selectedZoneData.waterDepth}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Onset</dt>
                    <dd className="font-semibold text-ink">{selectedZoneData.expectedOnset}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Confidence</dt>
                    <dd className="font-semibold text-ink">{selectedZoneData.confidence}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Population</dt>
                    <dd className="font-semibold text-ink">{selectedZoneData.population.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Active Alerts Summary */}
            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Layer Summary</p>
              <p className="text-sm text-ink-muted">
                {layers.filter((l) => l.enabled).length} of {layers.length} layers active
              </p>
              <p className="mt-1 text-xs text-ink-muted/70">Prototype data — not real-time</p>
            </div>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
}
