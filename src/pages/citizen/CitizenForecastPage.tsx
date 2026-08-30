import { useState } from 'react';
import { CloudRain, Droplets, Gauge, MapPin, TrendingUp } from 'lucide-react';

import CitizenLayout from '@/components/citizen/CitizenLayout';
import RiskBadge, { riskStyles } from '@/components/citizen/RiskBadge';

import {
  forecastTimeline,
  radarNowcast,
} from '@/data/floodPredictionData';

export default function CitizenForecastPage() {
  const [selected, setSelected] = useState(0);

  const points = forecastTimeline;
  const current = points[selected];

  const currentRisk = current.riskLevel.toLowerCase() as
    | 'low'
    | 'moderate'
    | 'high'
    | 'critical';

  const s = riskStyles(currentRisk);

  const maxPct = Math.max(
    ...points.map((p) => p.probability)
  );

  return (
    <CitizenLayout>
      <div className="animate-fade-in">

        {/* =========================
            PAGE HEADER
        ========================== */}

        <div className="mb-5">
          <h1 className="text-h2 font-bold text-navy-dark">
            Flood Risk &amp; Forecast
          </h1>

          <p className="mt-1 text-[15px] text-ink-muted">
            0–3 Hour Flood Nowcast
          </p>
        </div>


        {/* =========================
            RAINFALL NOWCAST
        ========================== */}

        <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-card">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-primary text-white">
                <CloudRain
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="font-bold text-navy-dark">
                  Rainfall Nowcast
                </h2>

                <p className="text-sm text-ink-muted">
                  Doppler Weather Radar
                </p>
              </div>

            </div>


            <div className="flex items-center gap-2">

              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />

              <span className="text-sm font-bold text-green-700">
                {radarNowcast.status}
              </span>

            </div>

          </div>


          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <div className="rounded-xl border border-blue-100 bg-white p-3">
              <p className="text-xs text-ink-muted">
                Rainfall
              </p>

              <p className="mt-1 text-lg font-bold text-navy">
                {radarNowcast.rainfallIntensity} mm
              </p>
            </div>


            <div className="rounded-xl border border-blue-100 bg-white p-3">
              <p className="text-xs text-ink-muted">
                Trend
              </p>

              <p className="mt-1 text-lg font-bold text-risk-high">
                ↗ {radarNowcast.trend}
              </p>
            </div>


            <div className="rounded-xl border border-blue-100 bg-white p-3">
              <p className="text-xs text-ink-muted">
                Resolution
              </p>

              <p className="mt-1 text-sm font-bold text-navy">
                {radarNowcast.resolution}
              </p>
            </div>


            <div className="rounded-xl border border-blue-100 bg-white p-3">
              <p className="text-xs text-ink-muted">
                Updated
              </p>

              <p className="mt-1 text-sm font-bold text-navy">
                {radarNowcast.lastUpdated}
              </p>
            </div>

          </div>

        </div>


        {/* =========================
            TIME SELECTOR
        ========================== */}

        <div className="mb-5 flex flex-wrap gap-2">

          {points.map((p, i) => {

            const ps = riskStyles(
              p.riskLevel.toLowerCase() as
                | 'low'
                | 'moderate'
                | 'high'
                | 'critical'
            );

            return (
              <button
                key={p.time}
                onClick={() => setSelected(i)}
                className={`rounded-xl border-2 px-4 py-2.5 text-center transition-all duration-200 ${
                  selected === i
                    ? 'border-navy bg-white shadow-card'
                    : 'border-border bg-white hover:border-blue-primary'
                }`}
              >

                <p className="text-xs font-semibold text-ink-muted">
                  {p.time}
                </p>

                <p
                  className={`mt-0.5 text-lg font-bold ${ps.text}`}
                >
                  {p.probability}%
                </p>

              </button>
            );
          })}

        </div>


        {/* =========================
            CURRENT FLOOD RISK
        ========================== */}

        <div
          className={`rounded-2xl border-2 ${s.border} ${s.bg} p-6`}
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-ink-muted">
                Flood Risk at {current.time}
              </p>

              <p
                className={`mt-1 text-4xl font-bold ${s.text}`}
              >
                {current.probability}%
              </p>

            </div>

            <RiskBadge level={currentRisk} />

          </div>


          {/* FORECAST GRAPH */}

          <div className="mt-6 flex items-end gap-1.5">

            {points.map((p, i) => {

              const ps = riskStyles(
                p.riskLevel.toLowerCase() as
                  | 'low'
                  | 'moderate'
                  | 'high'
                  | 'critical'
              );

              return (
                <button
                  key={p.time}
                  onClick={() => setSelected(i)}
                  className="group flex flex-1 flex-col items-center gap-1"
                >

                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${ps.dot} ${
                      selected === i
                        ? 'opacity-100'
                        : 'opacity-40 group-hover:opacity-70'
                    }`}
                    style={{
                      height: `${Math.max(
                        (p.probability / maxPct) * 120,
                        10
                      )}px`,
                    }}
                  />

                  <span className="text-[10px] font-medium text-ink-muted">
                    {p.time}
                  </span>

                </button>
              );
            })}

          </div>


          <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-muted">

            <TrendingUp
              className="h-4 w-4"
              aria-hidden="true"
            />

            Flood risk changes over the next 3 hours based on
            the rainfall nowcast.

          </p>

        </div>


        {/* =========================
            CURRENT CONDITIONS
        ========================== */}

        <div className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-card">

          <h2 className="text-lg font-bold text-navy">
            Current Flood Conditions
          </h2>


          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">

            {/* WATER DEPTH */}

            <div className="flex items-center gap-2">

              <Droplets
                className="h-4 w-4 text-blue-primary"
                aria-hidden="true"
              />

              <div>

                <p className="text-xs text-ink-muted">
                  Water Depth
                </p>

                <p className="text-sm font-semibold text-ink">
                  {current.waterDepthCm} cm
                </p>

              </div>

            </div>


            {/* RAINFALL */}

            <div className="flex items-center gap-2">

              <CloudRain
                className="h-4 w-4 text-blue-primary"
                aria-hidden="true"
              />

              <div>

                <p className="text-xs text-ink-muted">
                  Rainfall
                </p>

                <p className="text-sm font-semibold text-ink">
                  {current.rainfallMm} mm
                </p>

              </div>

            </div>


            {/* PROBABILITY */}

            <div className="flex items-center gap-2">

              <Gauge
                className="h-4 w-4 text-blue-primary"
                aria-hidden="true"
              />

              <div>

                <p className="text-xs text-ink-muted">
                  Flood Probability
                </p>

                <p className="text-sm font-semibold text-ink">
                  {current.probability}%
                </p>

              </div>

            </div>


            {/* FORECAST TIME */}

            <div className="flex items-center gap-2">

              <MapPin
                className="h-4 w-4 text-blue-primary"
                aria-hidden="true"
              />

              <div>

                <p className="text-xs text-ink-muted">
                  Forecast Time
                </p>

                <p className="text-sm font-semibold text-ink">
                  {current.time}
                </p>

              </div>

            </div>


            {/* RISK */}

            <div className="flex items-center gap-2">

              <Gauge
                className="h-4 w-4 text-blue-primary"
                aria-hidden="true"
              />

              <div>

                <p className="text-xs text-ink-muted">
                  Risk Level
                </p>

                <p
                  className={`text-sm font-semibold ${s.text}`}
                >
                  {current.riskLevel}
                </p>

              </div>

            </div>


            {/* DATA STATUS */}

            <div className="flex items-center gap-2">

              <CloudRain
                className="h-4 w-4 text-blue-primary"
                aria-hidden="true"
              />

              <div>

                <p className="text-xs text-ink-muted">
                  Data Status
                </p>

                <p className="text-sm font-semibold text-risk-low">
                  ● {radarNowcast.status}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            0–3 HOUR WATER DEPTH
        ========================== */}

        <div className="mt-5 rounded-2xl border border-border bg-white p-5 shadow-card">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-navy">
                Water Depth Forecast
              </h2>

              <p className="mt-1 text-xs text-ink-muted">
                Expected surface water depth over the next 3 hours
              </p>

            </div>

            <Droplets
              className="h-5 w-5 text-blue-primary"
              aria-hidden="true"
            />

          </div>


          <div className="mt-5 grid grid-cols-5 gap-2">

            {points.map((p) => {

              const depthHeight = Math.max(
                (p.waterDepthCm / 50) * 100,
                8
              );

              const risk = p.riskLevel.toLowerCase();

              const barClass =
                risk === 'critical'
                  ? 'bg-risk-critical'
                  : risk === 'high'
                  ? 'bg-risk-high'
                  : risk === 'moderate'
                  ? 'bg-risk-moderate'
                  : 'bg-risk-low';

              return (
                <div
                  key={p.time}
                  className="flex flex-col items-center"
                >

                  <span className="mb-2 text-xs font-bold text-navy">
                    {p.waterDepthCm} cm
                  </span>

                  <div className="flex h-32 w-full items-end">

                    <div
                      className={`w-full rounded-t-lg ${barClass}`}
                      style={{
                        height: `${depthHeight}%`,
                      }}
                    />

                  </div>

                  <span className="mt-2 text-[10px] font-medium text-ink-muted">
                    {p.time}
                  </span>

                </div>
              );
            })}

          </div>

        </div>


        {/* =========================
            USER INFORMATION
        ========================== */}

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">

          <p className="font-semibold text-navy">
            🌧️ Stay Alert
          </p>

          <p className="mt-1 text-sm text-ink-muted">
            Flood risk can change rapidly during heavy rainfall.
            Check the latest forecast and use the Safe Route
            feature before travelling.
          </p>

          <p className="mt-2 text-xs text-ink-muted">
            Rainfall data source: {radarNowcast.source} •
            Last updated: {radarNowcast.lastUpdated}
          </p>

        </div>

      </div>
    </CitizenLayout>
  );
}