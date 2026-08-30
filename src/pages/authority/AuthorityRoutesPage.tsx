import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Polyline, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  Navigation,
  Route as RouteIcon,
  Clock,
  MapPin,
  CheckCircle2,
  Ban,
  AlertTriangle,
  ShieldCheck,
  Ambulance,
  Bus,
  Car,
  Gauge,
} from 'lucide-react';

import AuthorityLayout from '@/components/authority/AuthorityLayout';
import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';
import { LoadingState } from '@/components/authority/States';
import {
  emergencyRoutes,
  emergencyDestinations,
  AUTHORITY_MAP_CENTER,
} from '@/data/authorityMockData';
import type { EmergencyRoute } from '@/types/authority';

const STATUS_STYLES: Record<
  EmergencyRoute['status'],
  {
    bg: string;
    text: string;
    icon: typeof CheckCircle2;
    label: string;
  }
> = {
  safe: {
    bg: 'bg-risk-low/10',
    text: 'text-risk-low',
    icon: CheckCircle2,
    label: 'SAFE',
  },

  'high-risk': {
    bg: 'bg-risk-high/10',
    text: 'text-risk-high',
    icon: AlertTriangle,
    label: 'HIGH RISK',
  },

  blocked: {
    bg: 'bg-risk-critical/10',
    text: 'text-risk-critical',
    icon: Ban,
    label: 'BLOCKED',
  },
};

const ROUTE_COLORS: Record<
  EmergencyRoute['status'],
  string
> = {
  safe: '#15803D',
  'high-risk': '#EA580C',
  blocked: '#DC2626',
};

type RoutingMode =
  | 'emergency'
  | 'transit'
  | 'commuter';

const ROUTING_MODES: {
  id: RoutingMode;
  label: string;
  description: string;
  icon: typeof Ambulance;
}[] = [
  {
    id: 'emergency',
    label: 'Emergency Services',
    description: 'Ambulance, fire and rescue',
    icon: Ambulance,
  },
  {
    id: 'transit',
    label: 'Public Transit',
    description: 'Bus and essential transport',
    icon: Bus,
  },
  {
    id: 'commuter',
    label: 'Commuters',
    description: 'General public travel',
    icon: Car,
  },
];

function createIcon(html: string, size = 28) {
  return L.divIcon({
    html,
    className: 'fx-map-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const baseIcon = createIcon(
  '<div style="background:#123B7A;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:12px;font-weight:bold;">HQ</div>',
);

export default function AuthorityRoutesPage() {
  const [loading, setLoading] = useState(true);

  const [selectedDest, setSelectedDest] =
    useState(emergencyDestinations[0].id);

  const [routingMode, setRoutingMode] =
    useState<RoutingMode>('emergency');

  const [searched, setSearched] =
    useState(false);

  const [selectedRoute, setSelectedRoute] =
    useState<EmergencyRoute | null>(null);

  useEffect(() => {
    const t = setTimeout(
      () => setLoading(false),
      500,
    );

    return () => clearTimeout(t);
  }, []);

  const dest =
    emergencyDestinations.find(
      (d) => d.id === selectedDest,
    ) ?? emergencyDestinations[0];

  const destIcon = createIcon(
    `<div style="background:#DC2626;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:14px;">📍</div>`,
  );

  /*
   * SAFE ROUTE SEARCH
   *
   * Frontend prototype:
   * recommended route is selected from mock route data.
   * Real routing API can be connected here later.
   */
  const handleSearch = () => {
    const recommended =
      emergencyRoutes.find(
        (route) => route.recommended,
      ) ??
      emergencyRoutes.find(
        (route) => route.status === 'safe',
      ) ??
      emergencyRoutes[0];

    setSelectedRoute(recommended ?? null);
    setSearched(true);
  };

  /*
   * ROUTE SAFETY SCORE
   */

  const getSafetyScore = (
    route: EmergencyRoute,
  ) => {
    if (route.status === 'blocked') {
      return 0;
    }

    if (route.status === 'high-risk') {
      return 45;
    }

    if (route.riskLevel === 'Critical') {
      return 35;
    }

    if (route.riskLevel === 'High') {
      return 60;
    }

    if (route.riskLevel === 'Moderate') {
      return 78;
    }

    return 94;
  };

  /*
   * ROUTE SUMMARY
   */

  const routeSummary = useMemo(() => {
    const safe = emergencyRoutes.filter(
      (route) =>
        route.status === 'safe',
    ).length;

    const highRisk =
      emergencyRoutes.filter(
        (route) =>
          route.status === 'high-risk',
      ).length;

    const blocked =
      emergencyRoutes.filter(
        (route) =>
          route.status === 'blocked',
      ).length;

    return {
      safe,
      highRisk,
      blocked,
    };
  }, []);

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState
          message="Calculating safe routes..."
        />
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">

        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">
            Flood-Safe Routing
          </h1>

          <p className="mt-1 text-[15px] text-ink-muted">
            Find safer alternative routes for
            emergency teams, public transit and
            commuters during flooding.
          </p>
        </div>


        {/* ROUTING MODE */}

        <div className="mb-5 rounded-2xl border border-border bg-white p-5 shadow-card">

          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck
              className="h-5 w-5 text-blue-primary"
              aria-hidden="true"
            />

            <h2 className="text-sm font-bold text-navy">
              Routing Mode
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">

            {ROUTING_MODES.map((mode) => {
              const Icon = mode.icon;

              const active =
                routingMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setRoutingMode(mode.id);
                    setSearched(false);
                    setSelectedRoute(null);
                  }}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    active
                      ? 'border-blue-primary bg-blue-light ring-2 ring-blue-primary/20'
                      : 'border-border bg-white hover:border-blue-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">

                    <Icon
                      className={`h-5 w-5 ${
                        active
                          ? 'text-blue-primary'
                          : 'text-ink-muted'
                      }`}
                      aria-hidden="true"
                    />

                    <span className="text-sm font-bold text-navy">
                      {mode.label}
                    </span>

                  </div>

                  <p className="mt-1 text-xs text-ink-muted">
                    {mode.description}
                  </p>

                </button>
              );
            })}

          </div>

        </div>


        {/* ROUTE SEARCH */}

        <div className="mb-5 rounded-2xl border border-border bg-white p-5 shadow-card">

          <div className="grid gap-4 sm:grid-cols-3">

            {/* FROM */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                From
              </label>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">

                <Navigation
                  className="h-4 w-4 text-blue-primary"
                  aria-hidden="true"
                />

                <span className="text-sm font-semibold text-navy">
                  Emergency Base
                </span>

              </div>
            </div>


            {/* TO */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                To
              </label>

              <select
                value={selectedDest}
                onChange={(e) => {
                  setSelectedDest(
                    e.target.value,
                  );
                  setSearched(false);
                  setSelectedRoute(null);
                }}
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-blue-primary"
              >
                {emergencyDestinations.map(
                  (d) => (
                    <option
                      key={d.id}
                      value={d.id}
                    >
                      {d.label}
                    </option>
                  ),
                )}
              </select>
            </div>


            {/* SEARCH */}

            <div className="flex items-end">

              <button
                onClick={handleSearch}
                className="w-full rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-dark"
              >
                <span className="flex items-center justify-center gap-2">

                  <RouteIcon
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  Find Safe Route

                </span>
              </button>

            </div>

          </div>

        </div>


        {/* ROUTE STATUS SUMMARY */}

        <div className="mb-5 grid grid-cols-3 gap-3">

          <div className="rounded-xl border border-risk-low/20 bg-white p-3 shadow-card">

            <p className="text-xs text-ink-muted">
              Safe Routes
            </p>

            <p className="mt-1 text-xl font-bold text-risk-low">
              {routeSummary.safe}
            </p>

          </div>


          <div className="rounded-xl border border-risk-high/20 bg-white p-3 shadow-card">

            <p className="text-xs text-ink-muted">
              High Risk
            </p>

            <p className="mt-1 text-xl font-bold text-risk-high">
              {routeSummary.highRisk}
            </p>

          </div>


          <div className="rounded-xl border border-risk-critical/20 bg-white p-3 shadow-card">

            <p className="text-xs text-ink-muted">
              Blocked
            </p>

            <p className="mt-1 text-xl font-bold text-risk-critical">
              {routeSummary.blocked}
            </p>

          </div>

        </div>


        {/* RESULTS */}

        {searched ? (

          <div className="grid gap-5 lg:grid-cols-3">

            {/* ROUTE LIST */}

            <div className="lg:col-span-1">

              <div className="mb-3 flex items-center justify-between">

                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                  Available Routes
                </h2>

                <span className="rounded-full bg-blue-light px-2 py-1 text-[10px] font-bold text-blue-primary">
                  {ROUTING_MODES.find(
                    (m) =>
                      m.id === routingMode,
                  )?.label}
                </span>

              </div>


              <div className="space-y-2">

                {emergencyRoutes.map(
                  (route) => {

                    const s =
                      STATUS_STYLES[
                        route.status
                      ];

                    const StatusIcon =
                      s.icon;

                    const safetyScore =
                      getSafetyScore(
                        route,
                      );

                    return (
                      <button
                        key={route.id}
                        onClick={() =>
                          setSelectedRoute(
                            route,
                          )
                        }
                        className={`w-full rounded-2xl border p-4 text-left shadow-card transition-all duration-200 ${
                          selectedRoute?.id ===
                          route.id
                            ? 'border-blue-primary ring-2 ring-blue-primary/25'
                            : 'border-border hover:border-blue-primary'
                        } ${
                          route.recommended
                            ? 'border-risk-low/40 bg-risk-low/5'
                            : ''
                        }`}
                      >

                        {route.recommended && (
                          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-risk-low/10 px-2 py-0.5 text-xs font-semibold text-risk-low">

                            <CheckCircle2
                              className="h-3 w-3"
                              aria-hidden="true"
                            />

                            RECOMMENDED

                          </span>
                        )}


                        <div className="flex items-center justify-between">

                          <span className="flex items-center gap-2 text-sm font-semibold text-navy">

                            <RouteIcon
                              className="h-4 w-4 text-blue-primary"
                              aria-hidden="true"
                            />

                            {route.label}

                          </span>


                          <span
                            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}
                          >

                            <StatusIcon
                              className="h-3 w-3"
                              aria-hidden="true"
                            />

                            {s.label}

                          </span>

                        </div>


                        <div className="mt-2 flex items-center gap-4 text-xs text-ink-muted">

                          <span>
                            {route.distance}
                          </span>

                          <span className="flex items-center gap-1">

                            <Clock
                              className="h-3 w-3"
                              aria-hidden="true"
                            />

                            {route.travelTime}

                          </span>

                        </div>


                        <div className="mt-3 flex items-center gap-1.5">

                          <Gauge
                            className="h-3.5 w-3.5 text-blue-primary"
                            aria-hidden="true"
                          />

                          <span className="text-xs font-semibold text-navy">
                            Safety Score:
                          </span>

                          <span
                            className={`text-xs font-bold ${
                              safetyScore >= 80
                                ? 'text-risk-low'
                                : safetyScore >= 50
                                ? 'text-risk-high'
                                : 'text-risk-critical'
                            }`}
                          >
                            {safetyScore}/100
                          </span>

                        </div>

                      </button>
                    );
                  },
                )}

              </div>

            </div>


            {/* MAP + DETAILS */}

            <div className="lg:col-span-2">

              {selectedRoute ? (

                <>

                  {/* ROUTE DETAILS */}

                  <div className="mb-4 rounded-2xl border border-border bg-white p-5 shadow-card">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <div>

                        <p className="text-xs text-ink-muted">
                          Recommended routing for
                        </p>

                        <h2 className="text-lg font-bold text-navy-dark">
                          {selectedRoute.label}
                        </h2>

                      </div>

                      <AuthorityRiskBadge
                        level={
                          selectedRoute.riskLevel
                        }
                      />

                    </div>


                    <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">

                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">
                          Distance
                        </dt>

                        <dd className="mt-1 text-lg font-bold text-navy">
                          {selectedRoute.distance}
                        </dd>
                      </div>


                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">
                          Travel Time
                        </dt>

                        <dd className="mt-1 text-lg font-bold text-navy">
                          {selectedRoute.travelTime}
                        </dd>
                      </div>


                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">
                          Road Condition
                        </dt>

                        <dd className="mt-1 text-sm font-bold uppercase text-navy">
                          {selectedRoute.roadCondition}
                        </dd>
                      </div>


                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">
                          Safety Score
                        </dt>

                        <dd
                          className={`mt-1 text-lg font-bold ${
                            getSafetyScore(
                              selectedRoute,
                            ) >= 80
                              ? 'text-risk-low'
                              : getSafetyScore(
                                  selectedRoute,
                                ) >= 50
                              ? 'text-risk-high'
                              : 'text-risk-critical'
                          }`}
                        >
                          {getSafetyScore(
                            selectedRoute,
                          )}
                          /100
                        </dd>
                      </div>


                      <div className="rounded-xl bg-surface p-3">
                        <dt className="text-xs text-ink-muted">
                          Status
                        </dt>

                        <dd className="mt-1">

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[selectedRoute.status].bg} ${STATUS_STYLES[selectedRoute.status].text}`}
                          >
                            {
                              STATUS_STYLES[
                                selectedRoute.status
                              ].label
                            }
                          </span>

                        </dd>
                      </div>

                    </dl>


                    {/* BLOCKED WARNING */}

                    {selectedRoute.status ===
                      'blocked' && (

                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-risk-critical/20 bg-risk-critical/10 p-3">

                        <Ban
                          className="mt-0.5 h-4 w-4 shrink-0 text-risk-critical"
                          aria-hidden="true"
                        />

                        <div>

                          <p className="text-sm font-bold text-risk-critical">
                            Route Blocked
                          </p>

                          <p className="mt-0.5 text-xs text-risk-critical/80">
                            This route should not be
                            used during the current
                            flood condition.
                          </p>

                        </div>

                      </div>

                    )}


                    {/* HIGH RISK WARNING */}

                    {selectedRoute.status ===
                      'high-risk' && (

                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-risk-high/20 bg-risk-high/10 p-3">

                        <AlertTriangle
                          className="mt-0.5 h-4 w-4 shrink-0 text-risk-high"
                          aria-hidden="true"
                        />

                        <div>

                          <p className="text-sm font-bold text-risk-high">
                            High Flood Risk
                          </p>

                          <p className="mt-0.5 text-xs text-risk-high/80">
                            Use this route only if
                            necessary. Prefer a safe
                            alternative route.
                          </p>

                        </div>

                      </div>

                    )}

                  </div>


                  {/* MAP */}

                  <div className="h-80 w-full overflow-hidden rounded-2xl border border-border sm:h-96">

                    <MapContainer
                      center={
                        AUTHORITY_MAP_CENTER
                      }
                      zoom={13}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                      attributionControl={false}
                    >

                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />


                      {/* ROUTE */}

                      <Polyline
                        positions={
                          selectedRoute.coordinates
                        }
                        pathOptions={{
                          color:
                            ROUTE_COLORS[
                              selectedRoute.status
                            ],
                          weight: 6,
                          opacity: 0.85,
                        }}
                      />


                      {/* START */}

                      <Marker
                        position={
                          AUTHORITY_MAP_CENTER
                        }
                        icon={baseIcon}
                      >
                        <Popup>
                          <div className="font-semibold text-navy">
                            Emergency Base
                          </div>
                        </Popup>
                      </Marker>


                      {/* DESTINATION */}

                      <Marker
                        position={
                          dest.coordinates
                        }
                        icon={destIcon}
                      >
                        <Popup>
                          <div className="font-semibold text-navy">
                            {dest.label}
                          </div>
                        </Popup>
                      </Marker>

                    </MapContainer>

                  </div>


                  {/* ROUTE LEGEND */}

                  <div className="mt-3 flex flex-wrap gap-4 rounded-xl border border-border bg-white p-3 text-xs">

                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-risk-low" />
                      Safe Route
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-risk-high" />
                      High Risk
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-risk-critical" />
                      Blocked
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-blue-primary" />
                      Destination
                    </span>

                  </div>


                  <p className="mt-3 text-xs text-ink-muted/70">
                    Prototype routing — route geometry
                    is simulated. Real flood-safe routing
                    API can replace this mock calculation.
                  </p>

                </>

              ) : (

                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12">

                  <MapPin
                    className="h-8 w-8 text-ink-muted/40"
                    aria-hidden="true"
                  />

                  <p className="mt-3 text-sm font-medium text-ink-muted">
                    Select a route to view details
                  </p>

                </div>

              )}

            </div>

          </div>

        ) : (

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12">

            <Navigation
              className="h-8 w-8 text-ink-muted/40"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-ink-muted">
              Select a destination and click
              "Find Safe Route"
            </p>

          </div>

        )}

      </div>
    </AuthorityLayout>
  );
}