import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CitizenLayout from '@/components/citizen/CitizenLayout';
import FloodMap from '@/components/map/FloodMap';
import MapLegend from '@/components/citizen/MapLegend';
import { floodZones, mapRoads, mapShelters } from '@/data/citizenMockData';
import type { FloodZone } from '@/types/citizen';
import { riskLabel, riskStyles } from '@/components/citizen/RiskBadge';

export default function CitizenMapPage() {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<FloodZone | null>(null);

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-5">
          <h1 className="text-h2 font-bold text-navy-dark">Flood Risk Map</h1>
          <p className="mt-1 text-[15px] text-ink-muted">
            View flood-affected areas, risky roads, and shelters around your location.
          </p>
        </div>

        <div className="relative">
          <FloodMap
            zones={floodZones}
            roads={mapRoads}
            shelters={mapShelters}
            height="600px"
            onZoneClick={setSelectedZone}
          />
          <div className="absolute right-3 top-3">
            <MapLegend />
          </div>
        </div>

        {selectedZone && (
          <div className="mt-4 rounded-2xl border border-border bg-white p-5 shadow-card animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">{selectedZone.name}</h2>
              <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${riskStyles(selectedZone.riskLevel).text}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${riskStyles(selectedZone.riskLevel).dot}`} aria-hidden="true" />
                {riskLabel(selectedZone.riskLevel)} RISK
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-ink-muted">Risk</dt>
                <dd className="font-semibold text-ink">{selectedZone.riskPercentage}%</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Water Level</dt>
                <dd className="font-semibold text-ink">{selectedZone.waterLevel}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Expected Onset</dt>
                <dd className="font-semibold text-ink">{selectedZone.expectedOnset}</dd>
              </div>
            </dl>
            <button
              onClick={() => navigate('/citizen/safe-route')}
              className="fx-btn-primary mt-4"
            >
              View Safe Route
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4 rounded-2xl border border-border bg-white p-4 text-sm">
          <span className="flex items-center gap-1.5 text-ink">
            <span className="text-base">📍</span> Your Location
          </span>
          <span className="flex items-center gap-1.5 text-ink">
            <span className="text-base">🚧</span> Risky Road
          </span>
          <span className="flex items-center gap-1.5 text-ink">
            <span className="text-base">🏥</span> Shelter
          </span>
        </div>
      </div>
    </CitizenLayout>
  );
}
