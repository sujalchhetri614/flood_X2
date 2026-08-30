import LiveDataStatus from '@/components/authority/LiveDataStatus';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ArrowRight,
  Brain,
  ChevronRight,
  Clock,
  Droplets,
  MapPin,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react';

import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';

import L from 'leaflet';

import AuthorityLayout from '@/components/authority/AuthorityLayout';
import KpiCard from '@/components/authority/KpiCard';
import { LoadingState } from '@/components/authority/States';
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

import {
  floodPredictions,
} from '@/data/floodPredictionData';

import type { AiRecommendation } from '@/types/authority';
import type { FloodPrediction } from '@/types/flood';


/* =========================================================
   RISK COLORS
========================================================= */

const RISK_COLORS: Record<string, string> = {
  low: '#15803D',
  moderate: '#CA8A04',
  high: '#EA580C',
  critical: '#DC2626',
};


/* =========================================================
   MAP ICON
========================================================= */

function createIcon(
  html: string,
  size = 28,
) {
  return L.divIcon({
    html,
    className: 'fx-map-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}


/* =========================================================
   INFRASTRUCTURE ICONS
========================================================= */

const infraIcons: Record<string, string> = {
  hospital: '🏥',
  'fire-station': '🚒',
  'police-station': '👮',
  school: '🏫',
  shelter: '🏠',
};


/* =========================================================
   AI RECOMMENDATION COLORS
========================================================= */

const recCategoryColors: Record<
  AiRecommendation['category'],
  string
> = {
  road: 'text-risk-high',
  infrastructure: 'text-blue-primary',
  zone: 'text-risk-critical',
  shelter: 'text-risk-low',
  evacuation: 'text-emergency',
};


/* =========================================================
   HELPER
========================================================= */

function getRiskColor(
  risk: string,
) {
  return (
    RISK_COLORS[
    risk.toLowerCase()
    ] ?? '#52667A'
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AuthorityDashboard() {
  const navigate = useNavigate();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedPrediction,
    setSelectedPrediction,
  ] = useState<FloodPrediction | null>(null);


  /* =======================================================
     LOADING
  ======================================================= */

  useEffect(() => {
    const timer = setTimeout(
      () => setLoading(false),
      600,
    );

    return () => clearTimeout(timer);
  }, []);


  /* =======================================================
     FLOOD STATISTICS
  ======================================================= */

  const criticalAlerts =
    floodPredictions.filter(
      (prediction) =>
        prediction.riskLevel.toLowerCase() ===
        'critical',
    ).length;


  const highRiskAlerts =
    floodPredictions.filter(
      (prediction) => {
        const risk =
          prediction.riskLevel.toLowerCase();

        return (
          risk === 'critical' ||
          risk === 'high'
        );
      },
    ).length;


  const maxWaterDepth =
    floodPredictions.length > 0
      ? Math.max(
        ...floodPredictions.map(
          (prediction) =>
            prediction.waterDepthCm,
        ),
      )
      : 0;


  const drainageStress =
    floodPredictions.filter(
      (prediction) =>
        prediction.drainageCapacityPercent >=
        80 ||
        prediction.surchargeRiskPercent >=
        70,
    ).length;


  const activeAlerts =
    [...floodPredictions]
      .sort(
        (a, b) =>
          b.probability -
          a.probability,
      )
      .slice(0, 4);


  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <AuthorityLayout>
        <LoadingState
          message="Loading city risk data..."
        />
      </AuthorityLayout>
    );
  }


  /* =======================================================
     UI
  ======================================================= */

  return (
    <AuthorityLayout>

      <div className="animate-fade-in">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">

          <h1 className="text-h2 font-bold text-navy-dark">
            Command Center Overview
          </h1>

          <p className="mt-1 flex items-center gap-1.5 text-[15px] text-ink-muted">

            <MapPin
              className="h-4 w-4 text-blue-primary"
              aria-hidden="true"
            />

            Kolkata Municipal Area · Flood Monitoring

          </p>

        </div>
        <LiveDataStatus
          rainfallMm={72}
          riskPercentage={91}
          waterDepthCm={48}
        />


        {/* =================================================
            EXISTING KPI CARDS
        ================================================= */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

          {kpiData.map((kpi) => (
            <KpiCard
              key={kpi.id}
              kpi={kpi}
            />
          ))}

        </div>


        {/* =================================================
            FLOOD STATUS CARDS
        ================================================= */}

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">


          {/* CRITICAL ALERTS */}

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

            <div className="flex items-center gap-2">

              <ShieldAlert className="h-5 w-5 text-risk-critical" />

              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Critical Alerts
              </p>

            </div>

            <p className="mt-2 text-2xl font-bold text-risk-critical">
              {criticalAlerts}
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              Immediate attention required
            </p>

          </div>


          {/* HIGH RISK */}

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">

            <div className="flex items-center gap-2">

              <TriangleAlert className="h-5 w-5 text-risk-high" />

              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                High Risk Locations
              </p>

            </div>

            <p className="mt-2 text-2xl font-bold text-risk-high">
              {highRiskAlerts}
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              Predicted flood-prone locations
            </p>

          </div>


          {/* WATER DEPTH */}

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">

            <div className="flex items-center gap-2">

              <Droplets className="h-5 w-5 text-blue-primary" />

              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Max Water Depth
              </p>

            </div>

            <p className="mt-2 text-2xl font-bold text-blue-primary">
              {maxWaterDepth} cm
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              Highest predicted depth
            </p>

          </div>


          {/* DRAINAGE */}

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">

            <div className="flex items-center gap-2">

              <Droplets className="h-5 w-5 text-risk-moderate" />

              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Drainage Stress
              </p>

            </div>

            <p className="mt-2 text-2xl font-bold text-risk-moderate">
              {drainageStress}
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              Locations under drainage pressure
            </p>

          </div>

        </div>


        {/* =================================================
            MAP + DECISION SUPPORT
        ================================================= */}

        <div className="mt-6 grid gap-5 lg:grid-cols-3">


          {/* =================================================
              LIVE FLOOD MAP
          ================================================= */}

          <div className="lg:col-span-2">

            <div className="mb-3 flex items-center justify-between">

              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                Live Flood Map
              </h2>

              <button
                onClick={() =>
                  navigate('/authority/map')
                }
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-primary hover:underline"
              >

                Open Detailed Map

                <ArrowRight className="h-3.5 w-3.5" />

              </button>

            </div>


            <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border sm:h-96">

              <MapContainer
                center={AUTHORITY_MAP_CENTER}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
                attributionControl={false}
              >

                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />


                {/* FLOOD ZONES */}

                {authorityFloodZones.map(
                  (zone) => (

                    <Polygon
                      key={zone.id}
                      positions={zone.polygon}
                      pathOptions={{
                        color:
                          RISK_COLORS[
                          zone.riskLevel
                          ],

                        fillColor:
                          RISK_COLORS[
                          zone.riskLevel
                          ],

                        fillOpacity: 0.25,
                        weight: 2,
                      }}
                    />

                  ),
                )}


                {/* ROADS */}

                {authorityRoads.map(
                  (road) => (

                    <Polyline
                      key={road.id}
                      positions={road.coordinates}
                      pathOptions={{
                        color:
                          road.riskLevel ===
                            'critical'
                            ? '#DC2626'
                            : road.riskLevel ===
                              'high'
                              ? '#EA580C'
                              : '#52667A',

                        weight:
                          road.riskLevel ===
                            'critical' ||
                            road.riskLevel ===
                            'high'
                            ? 4
                            : 3,

                        opacity: 0.7,

                        dashArray:
                          road.riskLevel ===
                            'critical'
                            ? '8 4'
                            : undefined,
                      }}
                    />

                  ),
                )}


                {/* =================================================
                    FLOOD PREDICTION MARKERS
                ================================================= */}

                {floodPredictions.map(
                  (prediction) => {

                    const riskColor =
                      getRiskColor(
                        prediction.riskLevel,
                      );

                    return (

                      <Marker
                        key={prediction.id}
                        position={[
                          prediction.latitude,
                          prediction.longitude,
                        ]}
                        zIndexOffset={2000}
                        icon={createIcon(
                          `
                          <div style="
                            background:${riskColor};
                            color:white;
                            border:3px solid white;
                            border-radius:50%;
                            width:38px;
                            height:38px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:11px;
                            font-weight:900;
                            box-shadow:
                              0 0 0 4px ${riskColor}33,
                              0 3px 8px rgba(0,0,0,0.4);
                          ">
                            ${prediction.waterDepthCm}
                          </div>
                          `,
                          38,
                        )}

                        eventHandlers={{
                          click: () =>
                            setSelectedPrediction(
                              prediction,
                            ),
                        }}
                      >

                        <Popup>

                          <div className="min-w-[210px]">

                            <p className="font-bold text-navy">
                              {prediction.locationName}
                            </p>

                            <div className="mt-2 space-y-1 text-sm">

                              <p>
                                Risk:{' '}
                                <strong
                                  style={{
                                    color:
                                      riskColor,
                                  }}
                                >
                                  {prediction.riskLevel}
                                </strong>
                              </p>

                              <p>
                                Probability:{' '}
                                <strong>
                                  {prediction.probability}%
                                </strong>
                              </p>

                              <p>
                                Water Depth:{' '}
                                <strong>
                                  {prediction.waterDepthCm} cm
                                </strong>
                              </p>

                              <p>
                                Rainfall:{' '}
                                <strong>
                                  {prediction.rainfallMm} mm
                                </strong>
                              </p>

                              <p>
                                Drainage Capacity:{' '}
                                <strong>
                                  {prediction.drainageCapacityPercent}%
                                </strong>
                              </p>

                              <p>
                                Surcharge Risk:{' '}
                                <strong>
                                  {prediction.surchargeRiskPercent}%
                                </strong>
                              </p>

                              <p>
                                Blockage Risk:{' '}
                                <strong>
                                  {prediction.blockageRiskPercent}%
                                </strong>
                              </p>

                            </div>

                          </div>

                        </Popup>

                      </Marker>

                    );
                  },
                )}


                {/* INFRASTRUCTURE */}

                {authorityInfrastructure.map(
                  (infra) => (

                    <Marker
                      key={infra.id}
                      position={infra.coordinates}
                      icon={createIcon(
                        `
                        <div style="
                          background:white;
                          border:2px solid ${RISK_COLORS[
                        infra.riskLevel
                        ]
                        };
                          border-radius:50%;
                          width:26px;
                          height:26px;
                          display:flex;
                          align-items:center;
                          justify-content:center;
                          font-size:13px;
                          box-shadow:0 2px 6px rgba(0,0,0,0.25);
                        ">
                          ${infraIcons[
                        infra.type
                        ] ?? '📍'
                        }
                        </div>
                        `,
                        26,
                      )}
                    />

                  ),
                )}

              </MapContainer>


              {/* MAP LEGEND */}

              <div className="absolute bottom-3 right-3 z-[1000]">

                <MapLegend />

              </div>


              {/* MAP STATUS */}

              <div className="absolute left-3 top-3 z-[1000] rounded-xl border border-border bg-white px-3 py-2 shadow-card">

                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                  Flood Monitoring
                </p>

                <p className="text-sm font-bold text-navy">
                  {floodPredictions.length} prediction points
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              DECISION SUPPORT
          ================================================= */}

          <div>

            <div className="mb-3 flex items-center gap-1.5">

              <Brain className="h-4 w-4 text-blue-primary" />

              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                Decision Support
              </h2>

            </div>


            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">

              <p className="mb-3 text-xs text-ink-muted">
                AI-generated recommendations based on current flood model. Prototype data.
              </p>


              <ul className="space-y-2.5">

                {aiRecommendations.map(
                  (rec) => (

                    <li
                      key={rec.id}
                      className="flex items-start gap-2.5 rounded-xl bg-surface p-3"
                    >

                      <span
                        className={`mt-0.5 text-sm font-bold ${recCategoryColors[
                          rec.category
                          ]
                          }`}
                      >
                        P{rec.priority}
                      </span>

                      <p className="flex-1 text-sm text-ink">
                        {rec.text}
                      </p>

                    </li>

                  ),
                )}

              </ul>


              <button
                onClick={() =>
                  navigate(
                    '/authority/response',
                  )
                }
                className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-blue-light py-2 text-sm font-semibold text-blue-primary hover:bg-blue-primary hover:text-white"
              >

                View Response Priority

                <ChevronRight className="h-4 w-4" />

              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTIVE FLOOD ALERTS
        ================================================= */}

        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <TriangleAlert className="h-5 w-5 text-risk-critical" />

              <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                Active Flood Alerts
              </h2>

            </div>


            <button
              onClick={() =>
                navigate('/authority/map')
              }
              className="text-sm font-semibold text-blue-primary hover:underline"
            >
              View Detailed Map
            </button>

          </div>


          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

            {activeAlerts.map(
              (prediction) => {

                const riskColor =
                  getRiskColor(
                    prediction.riskLevel,
                  );

                return (

                  <button
                    key={prediction.id}
                    type="button"
                    onClick={() =>
                      setSelectedPrediction(
                        prediction,
                      )
                    }
                    className="rounded-2xl border border-border bg-white p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >

                    <div className="flex items-start justify-between gap-2">

                      <div>

                        <p className="font-bold text-navy">
                          {prediction.locationName}
                        </p>

                        <p className="mt-0.5 text-xs text-ink-muted">
                          Street-level prediction
                        </p>

                      </div>


                      <span
                        className="rounded-full px-2 py-1 text-[10px] font-bold"
                        style={{
                          color: riskColor,
                          background:
                            `${riskColor}15`,
                        }}
                      >
                        {prediction.riskLevel}
                      </span>

                    </div>


                    <div className="mt-4 grid grid-cols-2 gap-3">


                      {/* WATER DEPTH */}

                      <div>

                        <div className="flex items-center gap-1">

                          <Droplets className="h-3.5 w-3.5 text-blue-primary" />

                          <span className="text-[11px] text-ink-muted">
                            Water Depth
                          </span>

                        </div>

                        <p className="mt-1 text-lg font-bold text-navy">
                          {prediction.waterDepthCm}
                          <span className="text-xs">
                            {' '}cm
                          </span>
                        </p>

                      </div>


                      {/* PROBABILITY */}

                      <div>

                        <div className="flex items-center gap-1">

                          <ShieldAlert className="h-3.5 w-3.5 text-risk-high" />

                          <span className="text-[11px] text-ink-muted">
                            Probability
                          </span>

                        </div>

                        <p className="mt-1 text-lg font-bold text-navy">
                          {prediction.probability}%
                        </p>

                      </div>

                    </div>


                    <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">

                      <Clock className="h-3.5 w-3.5" />

                      Rainfall:
                      {' '}
                      {prediction.rainfallMm}
                      {' '}
                      mm

                    </div>

                  </button>

                );
              },
            )}

          </div>

        </div>


        {/* =================================================
            SELECTED FLOOD ALERT DETAILS
        ================================================= */}

        {selectedPrediction && (

          <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 p-5">

            <div className="flex items-start justify-between gap-3">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-risk-critical">
                  Selected Flood Alert
                </p>

                <h2 className="mt-1 text-xl font-bold text-navy">
                  {selectedPrediction.locationName}
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedPrediction(null)
                }
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink-muted"
              >
                Close
              </button>

            </div>


            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">


              <div>
                <p className="text-xs text-ink-muted">
                  Risk
                </p>

                <p
                  className="mt-1 font-bold"
                  style={{
                    color:
                      getRiskColor(
                        selectedPrediction.riskLevel,
                      ),
                  }}
                >
                  {selectedPrediction.riskLevel}
                </p>
              </div>


              <div>
                <p className="text-xs text-ink-muted">
                  Probability
                </p>

                <p className="mt-1 font-bold text-navy">
                  {selectedPrediction.probability}%
                </p>
              </div>


              <div>
                <p className="text-xs text-ink-muted">
                  Water Depth
                </p>

                <p className="mt-1 font-bold text-navy">
                  {selectedPrediction.waterDepthCm} cm
                </p>
              </div>


              <div>
                <p className="text-xs text-ink-muted">
                  Rainfall
                </p>

                <p className="mt-1 font-bold text-navy">
                  {selectedPrediction.rainfallMm} mm
                </p>
              </div>


              <div>
                <p className="text-xs text-ink-muted">
                  Drainage
                </p>

                <p className="mt-1 font-bold text-navy">
                  {selectedPrediction.drainageCapacityPercent}%
                </p>
              </div>


              <div>
                <p className="text-xs text-ink-muted">
                  Surcharge
                </p>

                <p className="mt-1 font-bold text-navy">
                  {selectedPrediction.surchargeRiskPercent}%
                </p>
              </div>


              <div>
                <p className="text-xs text-ink-muted">
                  Blockage
                </p>

                <p className="mt-1 font-bold text-navy">
                  {selectedPrediction.blockageRiskPercent}%
                </p>
              </div>

            </div>


            <div className="mt-4 flex flex-wrap gap-2">

              <button
                onClick={() =>
                  navigate('/authority/map')
                }
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white"
              >

                Open Detailed Map

                <ArrowRight className="h-4 w-4" />

              </button>


              <button
                onClick={() =>
                  navigate('/authority/response')
                }
                className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-navy"
              >
                View Response Priority
              </button>

            </div>

          </div>

        )}


        {/* =================================================
            CRITICAL INFRASTRUCTURE
        ================================================= */}

        <div className="mt-6">

          <div className="mb-3">

            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Critical Infrastructure Impact
            </h2>

          </div>


          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {authorityInfrastructure
              .filter(
                (infra) =>
                  infra.riskLevel ===
                  'critical' ||
                  infra.riskLevel ===
                  'high',
              )
              .slice(0, 8)
              .map(
                (infra) => {

                  const icon =
                    infraIcons[
                    infra.type
                    ] ?? '📍';

                  return (

                    <div
                      key={infra.id}
                      className="rounded-2xl border border-border bg-white p-4 shadow-card"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-xl">
                          {icon}
                        </div>


                        <div className="min-w-0">

                          <p className="truncate font-semibold text-navy">
                            {infra.name}
                          </p>

                          <p className="text-xs text-ink-muted">
                            {infra.type
                              .replace(
                                '-',
                                ' ',
                              )
                              .toUpperCase()}
                          </p>

                        </div>

                      </div>


                      <div className="mt-3 flex items-center justify-between">

                        <span className="text-xs text-ink-muted">
                          Flood Risk
                        </span>

                        <span
                          className="font-bold"
                          style={{
                            color:
                              getRiskColor(
                                infra.riskLevel,
                              ),
                          }}
                        >
                          {infra.riskPercentage}%
                        </span>

                      </div>

                    </div>

                  );
                },
              )}

          </div>

        </div>


        {/* =================================================
            CITIZEN REPORTS
        ================================================= */}

        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Recent Citizen Reports
            </h2>

            <button
              onClick={() =>
                navigate(
                  '/authority/reports',
                )
              }
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-primary hover:underline"
            >

              View All Reports

              <ArrowRight className="h-3.5 w-3.5" />

            </button>

          </div>


          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-card">

            <table className="w-full min-w-[640px] text-left text-sm">

              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-ink-muted">

                <tr>

                  <th className="px-4 py-3 font-semibold">
                    Report
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Zone
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Severity
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Time
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-border">

                {authorityReports
                  .slice(0, 4)
                  .map(
                    (report) => (

                      <tr
                        key={report.id}
                        onClick={() =>
                          navigate(
                            '/authority/reports',
                          )
                        }
                        className="cursor-pointer transition-colors hover:bg-blue-light/50"
                      >

                        <td className="px-4 py-3 font-semibold text-navy">
                          #{report.numericId}
                        </td>

                        <td className="px-4 py-3 text-ink">
                          {report.zone}
                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`font-semibold ${report.severity ===
                                'critical'
                                ? 'text-risk-critical'
                                : report.severity ===
                                  'high'
                                  ? 'text-risk-high'
                                  : report.severity ===
                                    'moderate'
                                    ? 'text-risk-moderate'
                                    : 'text-risk-low'
                              }`}
                          >
                            {report.severity.toUpperCase()}
                          </span>

                        </td>

                        <td className="px-4 py-3 text-ink-muted">
                          {report.submittedAt.split(' ')[1]}
                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${report.status ===
                                'new'
                                ? 'bg-risk-critical/10 text-risk-critical'
                                : report.status ===
                                  'verified'
                                  ? 'bg-blue-light text-blue-primary'
                                  : report.status ===
                                    'resolved'
                                    ? 'bg-risk-low/10 text-risk-low'
                                    : 'bg-risk-moderate/10 text-risk-moderate'
                              }`}
                          >
                            {report.status
                              .replace(
                                '-',
                                ' ',
                              )
                              .toUpperCase()}
                          </span>

                        </td>

                      </tr>

                    ),
                  )}

              </tbody>

            </table>

          </div>

        </div>


      </div>

    </AuthorityLayout>
  );
}