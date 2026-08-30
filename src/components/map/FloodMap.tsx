import { MapContainer, Marker, Polygon, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Shield, TriangleAlert } from 'lucide-react';
import type { FloodZone, MapRoad, MapShelter, RouteOption } from '@/types/citizen';
import { USER_LOCATION } from '@/data/citizenMockData';
import { riskLabel, riskStyles } from '@/components/citizen/RiskBadge';

const RISK_COLORS: Record<string, string> = {
  low: '#15803D',
  moderate: '#CA8A04',
  high: '#EA580C',
  critical: '#DC2626',
};

function createIcon(html: string) {
  return L.divIcon({
    html,
    className: 'fx-map-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const userIcon = createIcon(
  '<div style="background:#123B7A;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:14px;font-weight:bold;">YOU</div>',
);

const shelterIcon = createIcon(
  '<div style="background:#15803D;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🏥</div>',
);

const riskyRoadIcon = createIcon(
  '<div style="background:#DC2626;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🚧</div>',
);

interface FloodMapProps {
  zones: FloodZone[];
  roads: MapRoad[];
  shelters: MapShelter[];
  selectedRoute?: RouteOption | null;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showUserLocation?: boolean;
  onZoneClick?: (zone: FloodZone) => void;
}

export default function FloodMap({
  zones,
  roads,
  shelters,
  selectedRoute = null,
  center = USER_LOCATION,
  zoom = 14,
  height = '500px',
  showUserLocation = true,
  onZoneClick,
}: FloodMapProps) {
  return (
    <div style={{ height }} className="relative w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {zones.map((zone) => {
          const s = riskStyles(zone.riskLevel);
          return (
            <Polygon
              key={zone.id}
              positions={zone.polygon}
              pathOptions={{
                color: RISK_COLORS[zone.riskLevel],
                fillColor: RISK_COLORS[zone.riskLevel],
                fillOpacity: 0.25,
                weight: 2,
              }}
              eventHandlers={{ click: () => onZoneClick?.(zone) }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-bold text-navy">{zone.name}</p>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div>
                      <dt className="inline text-gray-500">Flood Risk: </dt>
                      <dd className={`inline font-bold ${s.text}`}>{riskLabel(zone.riskLevel)}</dd>
                    </div>
                    <div>
                      <dt className="inline text-gray-500">Risk: </dt>
                      <dd className="inline font-semibold">{zone.riskPercentage}%</dd>
                    </div>
                    <div>
                      <dt className="inline text-gray-500">Water Level: </dt>
                      <dd className="inline font-semibold">{zone.waterLevel}</dd>
                    </div>
                    <div>
                      <dt className="inline text-gray-500">Expected onset: </dt>
                      <dd className="inline font-semibold">{zone.expectedOnset}</dd>
                    </div>
                  </dl>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {roads.map((road) => (
          <Polyline
            key={road.id}
            positions={road.coordinates}
            pathOptions={{
              color: road.risky ? '#DC2626' : '#52667A',
              weight: road.risky ? 4 : 3,
              opacity: 0.7,
              dashArray: road.risky ? '8 4' : undefined,
            }}
          >
            <Popup>
              <div className="flex items-center gap-1.5">
                {road.risky ? (
                  <TriangleAlert className="h-4 w-4 text-risk-critical" />
                ) : (
                  <MapPin className="h-4 w-4 text-ink-muted" />
                )}
                <span className="font-semibold text-navy">{road.name}</span>
                {road.risky && (
                  <span className="text-xs font-semibold text-risk-critical">Risky Road</span>
                )}
              </div>
            </Popup>
          </Polyline>
        ))}

        {shelters.map((shelter) => (
          <Marker key={shelter.id} position={shelter.coordinates} icon={shelterIcon}>
            <Popup>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-risk-low" />
                <span className="font-semibold text-navy">{shelter.name}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedRoute && (
          <Polyline
            positions={selectedRoute.coordinates}
            pathOptions={{
              color: selectedRoute.recommended ? '#15803D' : selectedRoute.risk === 'high' ? '#DC2626' : '#CA8A04',
              weight: 5,
              opacity: 0.8,
            }}
          />
        )}

        {showUserLocation && (
          <Marker position={USER_LOCATION} icon={userIcon}>
            <Popup>
              <div className="font-semibold text-navy">Your Location</div>
              <div className="text-sm text-gray-500">Kolkata, Zone B</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export { userIcon, shelterIcon, riskyRoadIcon, createIcon };
