import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Search } from 'lucide-react';
import CitizenLayout from '@/components/citizen/CitizenLayout';
import FloodMap from '@/components/map/FloodMap';
import RouteCard from '@/components/citizen/RouteCard';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { destinationOptions, floodZones, mapRoads, mapShelters, routeOptions } from '@/data/citizenMockData';
import { fetchRoutes } from '@/services/citizen';
import type { RouteOption } from '@/types/citizen';

export default function CitizenSafeRoutePage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('hospital');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!destination) {
      setError('Please select a destination.');
      return;
    }
    setLoading(true);
    try {
      const r = await fetchRoutes();
      setRoutes(r);
      const rec = r.find((x) => x.recommended);
      setSelected(rec?.id ?? r[0]?.id ?? null);
      setSearched(true);
    } catch {
      setError('Unable to find safe route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRoute = routes.find((r) => r.id === selected) ?? null;

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-5">
          <h1 className="text-h2 font-bold text-navy-dark">Safe Route Finder</h1>
          <p className="mt-1 text-[15px] text-ink-muted">
            Find the safest route to your destination, avoiding flooded areas.
          </p>
        </div>

        <form onSubmit={handleFind} className="mb-5 rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">From</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink">
                <MapPin className="h-4 w-4 text-blue-primary" aria-hidden="true" />
                Current Location (Kolkata, Zone B)
              </div>
            </div>
            <div>
              <label htmlFor="dest" className="mb-1.5 block text-sm font-medium text-ink">To</label>
              <select
                id="dest"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="fx-input"
              >
                {destinationOptions.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" loading={loading} className="mt-4">
            <Search className="h-4 w-4" aria-hidden="true" />
            {loading ? 'Finding Safe Route…' : 'Find Safe Route'}
          </Button>
        </form>

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        {searched && routes.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Available Routes</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {routes.map((r) => (
                <RouteCard key={r.id} route={r} selected={selected === r.id} onSelect={() => setSelected(r.id)} />
              ))}
            </div>
          </div>
        )}

        {selectedRoute && (
          <div className="mb-5 rounded-2xl border-2 border-risk-low/30 bg-risk-low/5 p-5">
            <div className="flex items-center gap-2">
              <span className="text-base">⭐</span>
              <h2 className="text-lg font-bold text-risk-low">RECOMMENDED — {selectedRoute.label}</h2>
            </div>
            <p className="mt-1 text-sm text-ink">
              {selectedRoute.duration} · {selectedRoute.riskLabel}
            </p>
            <p className="mt-1 text-sm text-ink-muted">{selectedRoute.notes}</p>
            <Button className="mt-4">
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Start Navigation
            </Button>
          </div>
        )}

        {selectedRoute && (
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">Route Map</h2>
            <FloodMap
              zones={floodZones}
              roads={mapRoads}
              shelters={mapShelters}
              selectedRoute={selectedRoute}
              height="400px"
            />
          </div>
        )}

        <p className="mt-4 text-center text-xs text-ink-muted">
          Routes shown are based on prototype data. Not real navigation results.
        </p>
      </div>
    </CitizenLayout>
  );
}
