import { MapContainer, Polygon, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { floodZones, USER_LOCATION } from '@/data/citizenMockData';

const RISK_COLORS: Record<string, string> = {
  low: '#15803D',
  moderate: '#CA8A04',
  high: '#EA580C',
  critical: '#DC2626',
};

const userIcon = L.divIcon({
  html: '<div style="background:#123B7A;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:10px;font-weight:bold;">YOU</div>',
  className: 'fx-map-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function MapPreview() {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer center={USER_LOCATION} zoom={13} scrollWheelZoom={false} className="h-full w-full" attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {floodZones.map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.polygon}
            pathOptions={{
              color: RISK_COLORS[zone.riskLevel],
              fillColor: RISK_COLORS[zone.riskLevel],
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        ))}
        <Marker position={USER_LOCATION} icon={userIcon} />
      </MapContainer>
    </div>
  );
}
