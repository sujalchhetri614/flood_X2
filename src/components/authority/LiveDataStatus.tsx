import { useEffect, useState } from 'react';
import {
  Activity,
  CloudRain,
  RefreshCw,
  Wifi,
} from 'lucide-react';

type LiveDataStatusProps = {
  rainfallMm: number;
  riskPercentage: number;
  waterDepthCm: number;
};

export default function LiveDataStatus({
  rainfallMm,
  riskPercentage,
  waterDepthCm,
}: LiveDataStatusProps) {
  const [lastUpdated, setLastUpdated] =
    useState(new Date());

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [liveRainfall, setLiveRainfall] =
    useState(rainfallMm);

  const [liveRisk, setLiveRisk] =
    useState(riskPercentage);

  const [liveDepth, setLiveDepth] =
    useState(waterDepthCm);

  useEffect(() => {
    setLiveRainfall(rainfallMm);
    setLiveRisk(riskPercentage);
    setLiveDepth(waterDepthCm);
  }, [
    rainfallMm,
    riskPercentage,
    waterDepthCm,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);

      setTimeout(() => {
        const rainfallChange =
          Math.floor(Math.random() * 7) - 3;

        const riskChange =
          Math.floor(Math.random() * 5) - 2;

        const depthChange =
          Math.floor(Math.random() * 5) - 2;

        setLiveRainfall((value) =>
          Math.max(
            0,
            Math.round(
              value + rainfallChange,
            ),
          ),
        );

        setLiveRisk((value) =>
          Math.max(
            0,
            Math.min(
              100,
              Math.round(
                value + riskChange,
              ),
            ),
          ),
        );

        setLiveDepth((value) =>
          Math.max(
            0,
            Math.round(
              value + depthChange,
            ),
          ),
        );

        setLastUpdated(new Date());
        setIsUpdating(false);
      }, 600);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getRiskLabel = () => {
    if (liveRisk >= 85) return 'Critical';
    if (liveRisk >= 65) return 'High';
    if (liveRisk >= 40) return 'Moderate';
    return 'Low';
  };

  const riskLabel = getRiskLabel();

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-card">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-risk-low/10">

            <Wifi
              className="h-4 w-4 text-risk-low"
              aria-hidden="true"
            />

          </div>

          <div>

            <p className="text-sm font-bold text-navy">
              Live Flood Monitoring
            </p>

            <p className="text-xs text-ink-muted">
              Real-time frontend data stream
            </p>

          </div>

        </div>


        <div className="flex items-center gap-2">

          <span className="flex items-center gap-1.5 rounded-full bg-risk-low/10 px-3 py-1 text-xs font-bold text-risk-low">

            <span className="h-2 w-2 animate-pulse rounded-full bg-risk-low" />

            LIVE

          </span>

          {isUpdating && (
            <RefreshCw
              className="h-4 w-4 animate-spin text-blue-primary"
              aria-hidden="true"
            />
          )}

        </div>

      </div>


      <div className="mt-4 grid grid-cols-3 gap-3">

        <div className="rounded-xl bg-surface p-3">

          <div className="flex items-center gap-1.5">

            <CloudRain
              className="h-4 w-4 text-blue-primary"
              aria-hidden="true"
            />

            <p className="text-xs text-ink-muted">
              Rainfall
            </p>

          </div>

          <p className="mt-1 text-xl font-bold text-navy">
            {liveRainfall}
            <span className="text-xs font-medium">
              {' '}mm
            </span>
          </p>

        </div>


        <div className="rounded-xl bg-surface p-3">

          <div className="flex items-center gap-1.5">

            <Activity
              className="h-4 w-4 text-risk-high"
              aria-hidden="true"
            />

            <p className="text-xs text-ink-muted">
              Flood Risk
            </p>

          </div>

          <p className="mt-1 text-xl font-bold text-navy">
            {liveRisk}%
          </p>

          <p className="text-[10px] font-semibold text-ink-muted">
            {riskLabel}
          </p>

        </div>


        <div className="rounded-xl bg-surface p-3">

          <div className="flex items-center gap-1.5">

            <Activity
              className="h-4 w-4 text-blue-primary"
              aria-hidden="true"
            />

            <p className="text-xs text-ink-muted">
              Water Depth
            </p>

          </div>

          <p className="mt-1 text-xl font-bold text-navy">
            {liveDepth}
            <span className="text-xs font-medium">
              {' '}cm
            </span>
          </p>

        </div>

      </div>


      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">

        <p className="text-[11px] text-ink-muted">
          Last updated:{' '}
          {lastUpdated.toLocaleTimeString()}
        </p>

        <p className="text-[11px] font-medium text-blue-primary">
          Auto-refresh: 30 sec
        </p>

      </div>

    </div>
  );
}