import { useMemo, useState } from 'react';
import {
  Activity,
  CloudRain,
  Droplets,
  Gauge,
  MapPin,
  TriangleAlert,
} from 'lucide-react';

import AuthorityLayout from '@/components/authority/AuthorityLayout';
import { floodPredictions } from '@/data/floodPredictionData';

type ForecastPoint = {
  time: string;
  probability: number;
  waterDepthCm: number;
  rainfallMm: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
};

const RISK_COLORS = {
  Low: '#15803D',
  Moderate: '#CA8A04',
  High: '#EA580C',
  Critical: '#DC2626',
};

const TIME_OPTIONS = [
  'Now',
  '+30 min',
  '+1 hour',
  '+2 hour',
  '+3 hour',
];

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getRisk(probability: number): ForecastPoint['riskLevel'] {
  if (probability >= 85) return 'Critical';
  if (probability >= 65) return 'High';
  if (probability >= 40) return 'Moderate';
  return 'Low';
}

function createForecast(
  baseProbability: number,
  baseDepth: number,
  baseRainfall: number,
): ForecastPoint[] {
  const multipliers = [
    1,
    1.12,
    1.28,
    1.38,
    1.20,
  ];

  return TIME_OPTIONS.map((time, index) => {
    const probability = clamp(
      baseProbability * multipliers[index],
    );

    const waterDepthCm = Math.max(
      0,
      Math.round(
        baseDepth * multipliers[index],
      ),
    );

    const rainfallMm = Math.max(
      0,
      Math.round(
        baseRainfall * multipliers[index],
      ),
    );

    return {
      time,
      probability,
      waterDepthCm,
      rainfallMm,
      riskLevel: getRisk(probability),
    };
  });
}

export default function AuthorityForecastPage() {
  const [selectedLocationId, setSelectedLocationId] =
    useState(floodPredictions[0]?.id ?? '');

  const [selectedTime, setSelectedTime] =
    useState('Now');

  const selectedLocation =
    floodPredictions.find(
      (item) => item.id === selectedLocationId,
    ) ?? floodPredictions[0];

  const forecast = useMemo(() => {
    if (!selectedLocation) return [];

    return createForecast(
      selectedLocation.probability,
      selectedLocation.waterDepthCm,
      selectedLocation.rainfallMm,
    );
  }, [selectedLocation]);

  const selectedForecast =
    forecast.find(
      (item) => item.time === selectedTime,
    ) ?? forecast[0];

  const maxProbability = Math.max(
    ...forecast.map(
      (item) => item.probability,
    ),
    1,
  );

  const criticalCount = forecast.filter(
    (item) => item.riskLevel === 'Critical',
  ).length;

  if (!selectedLocation || !selectedForecast) {
    return (
      <AuthorityLayout>
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="text-ink">
            No flood prediction data available.
          </p>
        </div>
      </AuthorityLayout>
    );
  }

  return (
    <AuthorityLayout>
      <div className="animate-fade-in">

        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-h2 font-bold text-navy-dark">
            Flood Nowcast
          </h1>

          <p className="mt-1 text-[15px] text-ink-muted">
            Street-level 0–3 hour flood prediction
            and risk analysis
          </p>
        </div>


        {/* LOCATION SELECTOR */}

        <div className="rounded-2xl border border-border bg-white p-4 shadow-card">

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-primary" />

            <div>
              <p className="text-xs text-ink-muted">
                Select Road / Location
              </p>

              <p className="font-semibold text-navy">
                Choose a location to view forecast
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

            {floodPredictions.map((prediction) => {
              const active =
                prediction.id ===
                selectedLocation.id;

              return (
                <button
                  key={prediction.id}
                  type="button"
                  onClick={() =>
                    setSelectedLocationId(
                      prediction.id,
                    )
                  }
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    active
                      ? 'border-blue-primary bg-blue-light shadow-card'
                      : 'border-border bg-white hover:border-blue-primary'
                  }`}
                >
                  <p className="font-semibold text-navy">
                    {prediction.locationName}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">
                    Current risk:{' '}
                    <span
                      style={{
                        color:
                          RISK_COLORS[
                            prediction.riskLevel ===
                            'Critical'
                              ? 'Critical'
                              : prediction.riskLevel ===
                                'High'
                              ? 'High'
                              : prediction.riskLevel ===
                                'Moderate'
                              ? 'Moderate'
                              : 'Low'
                          ],
                      }}
                      className="font-bold"
                    >
                      {prediction.riskLevel}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">
                    Water depth:{' '}
                    <strong>
                      {prediction.waterDepthCm} cm
                    </strong>
                  </p>
                </button>
              );
            })}

          </div>
        </div>


        {/* TIME SELECTOR */}

        <div className="mt-5 rounded-2xl border border-border bg-white p-4 shadow-card">

          <div className="flex flex-wrap gap-2">

            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() =>
                  setSelectedTime(time)
                }
                className={`rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                  selectedTime === time
                    ? 'border-navy bg-navy text-white'
                    : 'border-border bg-white text-ink-muted hover:border-blue-primary hover:text-navy'
                }`}
              >
                {time}
              </button>
            ))}

          </div>
        </div>


        {/* CURRENT FORECAST */}

        <div
          className="mt-5 rounded-2xl border-2 p-5"
          style={{
            borderColor:
              RISK_COLORS[
                selectedForecast.riskLevel
              ],
            background:
              `${RISK_COLORS[
                selectedForecast.riskLevel
              ]}08`,
          }}
        >

          <div className="flex flex-wrap items-start justify-between gap-4">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Prediction
              </p>

              <h2 className="mt-1 text-2xl font-bold text-navy">
                {selectedLocation.locationName}
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                Forecast at {selectedForecast.time}
              </p>

            </div>

            <div
              className="rounded-full px-4 py-2 text-sm font-bold"
              style={{
                color:
                  RISK_COLORS[
                    selectedForecast.riskLevel
                  ],
                background:
                  `${RISK_COLORS[
                    selectedForecast.riskLevel
                  ]}18`,
              }}
            >
              {selectedForecast.riskLevel} Risk
            </div>

          </div>


          {/* METRICS */}

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

            <div className="rounded-xl border border-border bg-white p-4">

              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-risk-critical" />

                <p className="text-xs text-ink-muted">
                  Probability
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold text-navy">
                {selectedForecast.probability}%
              </p>

            </div>


            <div className="rounded-xl border border-border bg-white p-4">

              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-primary" />

                <p className="text-xs text-ink-muted">
                  Water Depth
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold text-navy">
                {selectedForecast.waterDepthCm}
                <span className="text-sm">
                  {' '}cm
                </span>
              </p>

            </div>


            <div className="rounded-xl border border-border bg-white p-4">

              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-blue-primary" />

                <p className="text-xs text-ink-muted">
                  Rainfall
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold text-navy">
                {selectedForecast.rainfallMm}
                <span className="text-sm">
                  {' '}mm
                </span>
              </p>

            </div>


            <div className="rounded-xl border border-border bg-white p-4">

              <div className="flex items-center gap-2">
                <TriangleAlert className="h-4 w-4 text-risk-high" />

                <p className="text-xs text-ink-muted">
                  Critical Windows
                </p>
              </div>

              <p className="mt-2 text-2xl font-bold text-risk-critical">
                {criticalCount}
              </p>

            </div>

          </div>

        </div>


        {/* 0–3 HOUR GRAPH */}

        <div className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-card">

          <div className="flex items-center gap-2">

            <Activity className="h-5 w-5 text-blue-primary" />

            <div>

              <h2 className="font-bold text-navy">
                0–3 Hour Flood Forecast
              </h2>

              <p className="text-xs text-ink-muted">
                Probability and expected water depth
              </p>

            </div>

          </div>


          <div className="mt-6 flex items-end gap-3 overflow-x-auto pb-2">

            {forecast.map((point) => {

              const height =
                Math.max(
                  20,
                  (point.probability /
                    maxProbability) *
                    180,
                );

              const active =
                point.time === selectedTime;

              return (

                <button
                  key={point.time}
                  type="button"
                  onClick={() =>
                    setSelectedTime(
                      point.time,
                    )
                  }
                  className="group flex min-w-[72px] flex-1 flex-col items-center"
                >

                  <div className="mb-2 text-xs font-bold text-navy">
                    {point.probability}%
                  </div>

                  <div
                    className={`w-full rounded-t-xl transition-all ${
                      active
                        ? 'ring-2 ring-navy ring-offset-2'
                        : ''
                    }`}
                    style={{
                      height: `${height}px`,
                      background:
                        RISK_COLORS[
                          point.riskLevel
                        ],
                      opacity: active
                        ? 1
                        : 0.65,
                    }}
                  />

                  <p className="mt-2 text-[11px] font-semibold text-ink-muted">
                    {point.time}
                  </p>

                  <p className="mt-1 text-[10px] text-ink-muted">
                    {point.waterDepthCm} cm
                  </p>

                </button>

              );
            })}

          </div>

        </div>


        {/* MODEL INPUTS */}

        <div className="mt-5">

          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
            Flood Model Inputs
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="text-xs text-ink-muted">
                Elevation
              </p>

              <p className="mt-1 text-xl font-bold text-navy">
                {selectedLocation.elevationM} m
              </p>
            </div>


            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="text-xs text-ink-muted">
                Slope
              </p>

              <p className="mt-1 text-xl font-bold text-navy">
                {selectedLocation.slopePercent}%
              </p>
            </div>


            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="text-xs text-ink-muted">
                Imperviousness
              </p>

              <p className="mt-1 text-xl font-bold text-navy">
                {selectedLocation.imperviousnessPercent}%
              </p>
            </div>


            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="text-xs text-ink-muted">
                Drainage Capacity
              </p>

              <p className="mt-1 text-xl font-bold text-navy">
                {selectedLocation.drainageCapacityPercent}%
              </p>
            </div>


            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="text-xs text-ink-muted">
                Surcharge Risk
              </p>

              <p className="mt-1 text-xl font-bold text-risk-high">
                {selectedLocation.surchargeRiskPercent}%
              </p>
            </div>


            <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
              <p className="text-xs text-ink-muted">
                Blockage Risk
              </p>

              <p className="mt-1 text-xl font-bold text-risk-critical">
                {selectedLocation.blockageRiskPercent}%
              </p>
            </div>

          </div>

        </div>


        {/* MODEL STATUS */}

        <div className="mt-5 rounded-2xl border border-border bg-surface p-4">

          <div className="flex flex-wrap items-center justify-between gap-3">

            <div>

              <p className="font-semibold text-navy">
                Flood Prediction Engine
              </p>

              <p className="mt-1 text-xs text-ink-muted">
                Frontend prototype using rainfall,
                terrain and drainage indicators.
              </p>

            </div>

            <span className="rounded-full bg-risk-low/10 px-3 py-1.5 text-xs font-bold text-risk-low">
              MODEL ACTIVE
            </span>

          </div>

        </div>

      </div>
    </AuthorityLayout>
  );
}