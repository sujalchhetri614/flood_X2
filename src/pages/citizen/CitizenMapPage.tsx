import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CitizenLayout from '@/components/citizen/CitizenLayout';
import FloodMap from '@/components/map/FloodMap';
import MapLegend from '@/components/citizen/MapLegend';

import {
  floodZones,
  mapRoads,
  mapShelters,
} from '@/data/citizenMockData';

import {
  floodPredictions,
} from '@/data/floodPredictionData';

import type {
  FloodZone,
} from '@/types/citizen';

import type {
  FloodPrediction,
} from '@/types/flood';

import {
  riskLabel,
  riskStyles,
} from '@/components/citizen/RiskBadge';


export default function CitizenMapPage() {

  const navigate = useNavigate();

  const [
    selectedZone,
    setSelectedZone,
  ] = useState<FloodZone | null>(null);


  const [
    selectedPrediction,
    setSelectedPrediction,
  ] = useState<FloodPrediction | null>(null);


  return (
    <CitizenLayout>

      <div className="animate-fade-in">

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-5">

          <h1 className="text-h2 font-bold text-navy-dark">
            Flood Risk Map
          </h1>

          <p className="mt-1 text-[15px] text-ink-muted">
            View street-level flood predictions,
            risky roads, water depth and shelters
            around your location.
          </p>

        </div>


        {/* =========================
            MAP
        ========================== */}

        <div className="relative">

          <FloodMap
            zones={floodZones}
            roads={mapRoads}
            shelters={mapShelters}

            predictions={floodPredictions}

            height="600px"

            onZoneClick={
              setSelectedZone
            }

            onPredictionClick={
              setSelectedPrediction
            }
          />


          <div className="absolute right-3 top-3">

            <MapLegend />

          </div>

        </div>


        {/* =========================
            SELECTED STREET
        ========================== */}

        {selectedPrediction && (

          <div className="mt-4 rounded-2xl border border-red-200 bg-white p-5 shadow-card animate-slide-up">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-navy">
                  {selectedPrediction.locationName}
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Street-level flood prediction
                </p>

              </div>


              <span
                className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                  riskStyles(
                    selectedPrediction.riskLevel.toLowerCase() as
                      | 'low'
                      | 'moderate'
                      | 'high'
                      | 'critical'
                  ).text
                }`}
              >

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    riskStyles(
                      selectedPrediction.riskLevel.toLowerCase() as
                        | 'low'
                        | 'moderate'
                        | 'high'
                        | 'critical'
                    ).dot
                  }`}
                />

                {selectedPrediction.riskLevel.toUpperCase()}

              </span>

            </div>


            {/* DETAILS */}

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-4">

              <div>

                <dt className="text-ink-muted">
                  Flood Probability
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedPrediction.probability}%
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Water Depth
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedPrediction.waterDepthCm} cm
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Rainfall
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedPrediction.rainfallMm} mm
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Forecast
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedPrediction.forecastTime}
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Elevation
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedPrediction.elevationM} m
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Imperviousness
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedPrediction.imperviousnessPercent}%
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Drainage Capacity
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedPrediction.drainageCapacityPercent}%
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Surcharge Risk
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedPrediction.surchargeRiskPercent}%
                </dd>

              </div>

            </dl>


            {/* ACTION */}

            <button
              onClick={() =>
                navigate('/citizen/safe-route')
              }
              className="fx-btn-primary mt-5"
            >
              View Safe Route
            </button>

          </div>

        )}


        {/* =========================
            EXISTING FLOOD ZONE
        ========================== */}

        {selectedZone && !selectedPrediction && (

          <div className="mt-4 rounded-2xl border border-border bg-white p-5 shadow-card animate-slide-up">

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold text-navy">
                {selectedZone.name}
              </h2>


              <span
                className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                  riskStyles(
                    selectedZone.riskLevel
                  ).text
                }`}
              >

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    riskStyles(
                      selectedZone.riskLevel
                    ).dot
                  }`}
                />

                {riskLabel(
                  selectedZone.riskLevel
                )}{' '}
                RISK

              </span>

            </div>


            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">

              <div>

                <dt className="text-ink-muted">
                  Risk
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedZone.riskPercentage}%
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Water Level
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedZone.waterLevel}
                </dd>

              </div>


              <div>

                <dt className="text-ink-muted">
                  Expected Onset
                </dt>

                <dd className="font-semibold text-ink">
                  {selectedZone.expectedOnset}
                </dd>

              </div>

            </dl>


            <button
              onClick={() =>
                navigate('/citizen/safe-route')
              }
              className="fx-btn-primary mt-4"
            >
              View Safe Route
            </button>

          </div>

        )}


        {/* =========================
            MAP LEGEND / INFO
        ========================== */}

        <div className="mt-4 rounded-2xl border border-border bg-white p-4">

          <div className="flex flex-wrap gap-4 text-sm">

            <span className="flex items-center gap-1.5 text-ink">

              <span className="text-base">
                📍
              </span>

              Your Location

            </span>


            <span className="flex items-center gap-1.5 text-ink">

              <span className="text-base">
                🚧
              </span>

              Risky Road

            </span>


            <span className="flex items-center gap-1.5 text-ink">

              <span className="text-base">
                📏
              </span>

              Number = Water Depth (cm)

            </span>


            <span className="flex items-center gap-1.5 text-ink">

              <span className="text-base">
                🏥
              </span>

              Shelter

            </span>

          </div>


          <div className="mt-3 border-t border-border pt-3">

            <p className="text-xs text-ink-muted">
              Click a colored flood marker to view
              predicted water depth, rainfall,
              probability and drainage risk.
            </p>

          </div>

        </div>

      </div>

    </CitizenLayout>
  );
}