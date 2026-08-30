import { useState } from 'react';
import {
  MapContainer,
  Polygon,
  Polyline,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import L from 'leaflet';

import {
  Maximize2,
  RotateCcw,
  Search,
} from 'lucide-react';

import AuthorityLayout from '@/components/authority/AuthorityLayout';
import LayerControl from '@/components/authority/LayerControl';
import TimeSlider from '@/components/authority/TimeSlider';
import MapLegend from '@/components/citizen/MapLegend';

import {
  authorityFloodZones,
  authorityInfrastructure,
  authorityRoads,
  authorityReports,
  mapLayers as initialLayers,
  timeSliderOptions,
  timeSliderRiskMap,
  AUTHORITY_MAP_CENTER,
} from '@/data/authorityMockData';

import type { MapLayer } from '@/types/authority';

import {
  floodPredictions,
} from '@/data/floodPredictionData';

import type {
  FloodPrediction,
} from '@/types/flood';

import AuthorityRiskBadge from '@/components/authority/AuthorityRiskBadge';

import {
  terrainZones,
  imperviousZones,
  drainagePipes,
  drainageNodes,
} from '@/data/gisMockData';


/* =====================================================
   RISK COLORS
===================================================== */

const RISK_COLORS: Record<string, string> = {
  low: '#15803D',
  moderate: '#CA8A04',
  high: '#EA580C',
  critical: '#DC2626',
};


function getPredictionRiskColor(
  risk: FloodPrediction['riskLevel'],
) {
  return (
    RISK_COLORS[
      risk.toLowerCase()
    ] ?? '#52667A'
  );
}


/* =====================================================
   CREATE MAP ICON
===================================================== */

function createIcon(
  html: string,
  size = 28,
) {
  return L.divIcon({
    html,
    className: 'fx-map-icon',
    iconSize: [size, size],
    iconAnchor: [
      size / 2,
      size / 2,
    ],
  });
}


/* =====================================================
   TIME MULTIPLIERS
   Frontend prototype nowcast simulation
===================================================== */

const TIME_MULTIPLIERS: Record<
  string,
  number
> = {
  now: 1,

  '30m': 1.15,

  '1h': 1.30,

  '2h': 1.55,

  '3h': 1.80,
};


/* =====================================================
   GET TIME MULTIPLIER
===================================================== */

function getTimeMultiplier(
  timeValue: string,
) {
  return (
    TIME_MULTIPLIERS[
      timeValue
    ] ?? 1
  );
}


/* =====================================================
   GET TIME-BASED PREDICTION
===================================================== */

function getTimePrediction(
  prediction: FloodPrediction,
  timeValue: string,
) {

  const multiplier =
    getTimeMultiplier(
      timeValue,
    );


  /*
    NOW values are taken directly
    from floodPredictionData.ts.

    Future values are frontend-only
    simulated projections.
  */

  const probability = Math.min(
    99,
    Math.round(
      prediction.probability *
        multiplier,
    ),
  );


  const waterDepthCm = Math.round(
    prediction.waterDepthCm *
      multiplier,
  );


  const rainfallMm = Math.round(
    prediction.rainfallMm *
      multiplier,
  );


  const surchargeRiskPercent =
    Math.min(
      99,
      Math.round(
        prediction.surchargeRiskPercent *
          multiplier,
      ),
    );


  const blockageRiskPercent =
    Math.min(
      99,
      Math.round(
        prediction.blockageRiskPercent *
          multiplier,
      ),
    );


  let riskLevel:
    | 'Low'
    | 'Moderate'
    | 'High'
    | 'Critical';


  if (
    probability >= 85 ||
    waterDepthCm >= 40
  ) {

    riskLevel = 'Critical';

  } else if (
    probability >= 65 ||
    waterDepthCm >= 25
  ) {

    riskLevel = 'High';

  } else if (
    probability >= 35 ||
    waterDepthCm >= 10
  ) {

    riskLevel = 'Moderate';

  } else {

    riskLevel = 'Low';

  }


  return {
    ...prediction,

    probability,

    waterDepthCm,

    rainfallMm,

    surchargeRiskPercent,

    blockageRiskPercent,

    riskLevel,
  };

}


/* =====================================================
   INFRASTRUCTURE ICONS
===================================================== */

const infraIcons: Record<
  string,
  string
> = {
  hospital: '🏥',

  'fire-station': '🚒',

  'police-station': '👮',

  school: '🏫',

  shelter: '🏠',
};


/* =====================================================
   MAIN PAGE
===================================================== */

export default function AuthorityMapPage() {

  const [
    layers,
    setLayers,
  ] = useState<MapLayer[]>(
    initialLayers,
  );


  const [
    timeValue,
    setTimeValue,
  ] = useState('now');


  const [
    selectedZone,
    setSelectedZone,
  ] = useState<string | null>(
    null,
  );


  const [
    selectedPrediction,
    setSelectedPrediction,
  ] =
    useState<FloodPrediction | null>(
      null,
    );


  /* ===================================================
     LAYER TOGGLE
  =================================================== */

  const toggleLayer = (
    id: string,
  ) => {

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id
          ? {
              ...layer,
              enabled:
                !layer.enabled,
            }
          : layer,
      ),
    );

  };


  /* ===================================================
     CHECK LAYER
  =================================================== */

  const isLayerOn = (
    type: string,
  ) => {

    return (
      layers.find(
        (layer) =>
          layer.type === type,
      )?.enabled ?? false
    );

  };


  /* ===================================================
     SELECTED ZONE
  =================================================== */

  const selectedZoneData =
    authorityFloodZones.find(
      (zone) =>
        zone.id === selectedZone,
    );


  /* ===================================================
     CURRENT TIME LABEL
  =================================================== */

  const selectedTimeLabel =
    timeSliderOptions.find(
      (option) =>
        option.value ===
        timeValue,
    )?.label ?? 'Now';


  /* ===================================================
     TIME-AWARE PREDICTIONS
  =================================================== */

  const visiblePredictions =
    floodPredictions.map(
      (prediction) =>
        getTimePrediction(
          prediction,
          timeValue,
        ),
    );


  return (

    <AuthorityLayout>

      <div className="animate-fade-in">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-4">

          <h1 className="text-h2 font-bold text-navy-dark">
            Detailed Flood Map
          </h1>

          <p className="mt-1 text-[15px] text-ink-muted">
            City-wide flood risk visualization with GIS layers
          </p>

        </div>


        {/* =================================================
            MAP TOOLS
        ================================================= */}

        <div className="mb-3 flex flex-wrap items-center gap-2">

          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-border
              bg-white
              px-3
              py-2
              shadow-card
            "
          >

            <Search
              className="h-4 w-4 text-ink-muted"
              aria-hidden="true"
            />

            <input
              type="text"
              placeholder="Search location..."
              className="
                w-40
                border-none
                bg-transparent
                text-sm
                text-ink
                outline-none
                placeholder:text-ink-muted/60
                sm:w-56
              "
            />

          </div>


          <button
            type="button"
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-border
              bg-white
              px-3
              py-2
              text-sm
              font-medium
              text-ink-muted
              shadow-card
              transition-colors
              hover:bg-blue-light
              hover:text-navy
            "
          >

            <RotateCcw
              className="h-4 w-4"
              aria-hidden="true"
            />

            Reset View

          </button>


          <button
            type="button"
            className="
              flex
              items-center
              gap-1.5
              rounded-xl
              border
              border-border
              bg-white
              px-3
              py-2
              text-sm
              font-medium
              text-ink-muted
              shadow-card
              transition-colors
              hover:bg-blue-light
              hover:text-navy
            "
          >

            <Maximize2
              className="h-4 w-4"
              aria-hidden="true"
            />

            Fullscreen

          </button>

        </div>


        {/* =================================================
            MAP + SIDE PANEL
        ================================================= */}

        <div className="grid gap-4 lg:grid-cols-4">


          {/* =================================================
              MAP
          ================================================= */}

          <div className="lg:col-span-3">

            <div
              className="
                relative
                h-[500px]
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-border
                sm:h-[600px]
              "
            >

              <MapContainer
                center={
                  AUTHORITY_MAP_CENTER
                }
                zoom={13}
                scrollWheelZoom
                className="h-full w-full"
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />


                {/* =================================================
                    FLOOD RISK ZONES
                ================================================= */}

                {isLayerOn(
                  'flood-risk',
                ) &&
                  authorityFloodZones.map(
                    (zone) => (

                      <Polygon
                        key={zone.id}
                        positions={
                          zone.polygon
                        }
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
                        eventHandlers={{
                          click: () =>
                            setSelectedZone(
                              zone.id,
                            ),
                        }}
                      >

                        <Popup>

                          <div className="min-w-[200px]">

                            <p className="font-bold text-navy">
                              {zone.name}
                            </p>


                            <dl className="mt-2 space-y-1 text-sm">

                              <div>

                                <dt className="inline text-gray-500">
                                  Flood Risk:{' '}
                                </dt>

                                <dd
                                  className="inline font-bold"
                                  style={{
                                    color:
                                      RISK_COLORS[
                                        zone.riskLevel
                                      ],
                                  }}
                                >
                                  {zone.riskLevel.toUpperCase()}
                                </dd>

                              </div>


                              <div>

                                <dt className="inline text-gray-500">
                                  Probability:{' '}
                                </dt>

                                <dd className="inline font-semibold">
                                  {zone.probability}%
                                </dd>

                              </div>


                              <div>

                                <dt className="inline text-gray-500">
                                  Expected Water Depth:{' '}
                                </dt>

                                <dd className="inline font-semibold">
                                  {zone.waterDepth}
                                </dd>

                              </div>


                              <div>

                                <dt className="inline text-gray-500">
                                  Expected Onset:{' '}
                                </dt>

                                <dd className="inline font-semibold">
                                  {zone.expectedOnset}
                                </dd>

                              </div>


                              <div>

                                <dt className="inline text-gray-500">
                                  Confidence:{' '}
                                </dt>

                                <dd className="inline font-semibold">
                                  {zone.confidence}%
                                </dd>

                              </div>


                              <div>

                                <dt className="inline text-gray-500">
                                  Affected Roads:{' '}
                                </dt>

                                <dd className="inline font-semibold">
                                  {zone.affectedRoads}
                                </dd>

                              </div>


                              <div>

                                <dt className="inline text-gray-500">
                                  Nearby Infrastructure:{' '}
                                </dt>

                                <dd className="inline font-semibold">
                                  {zone.nearbyInfrastructure}
                                </dd>

                              </div>

                            </dl>

                          </div>

                        </Popup>

                      </Polygon>

                    ),
                  )}


                {/* =================================================
                    DEM / TERRAIN
                ================================================= */}

                {isLayerOn(
                  'terrain',
                ) &&
                  terrainZones.map(
                    (zone) => (

                      <Polygon
                        key={zone.id}
                        positions={
                          zone.polygon
                        }
                        pathOptions={{
                          color:
                            '#2563eb',

                          fillColor:
                            '#60a5fa',

                          fillOpacity: 0.18,

                          weight: 2,

                          dashArray:
                            '5 5',
                        }}
                      >

                        <Popup>

                          <div className="min-w-[200px]">

                            <p className="font-bold text-navy">
                              {zone.name}
                            </p>


                            <div className="mt-2 space-y-1 text-sm">

                              <p>
                                Elevation:{' '}
                                <strong>
                                  {zone.elevationM} m
                                </strong>
                              </p>


                              <p>
                                Slope:{' '}
                                <strong>
                                  {zone.slopePercent}%
                                </strong>
                              </p>


                              <p>
                                Terrain:{' '}
                                <strong>
                                  {zone.terrain}
                                </strong>
                              </p>

                            </div>

                          </div>

                        </Popup>

                      </Polygon>

                    ),
                  )}


                {/* =================================================
                    IMPERVIOUSNESS
                ================================================= */}

                {isLayerOn(
                  'imperviousness',
                ) &&
                  imperviousZones.map(
                    (zone) => (

                      <Polygon
                        key={zone.id}
                        positions={
                          zone.polygon
                        }
                        pathOptions={{
                          color:
                            '#f97316',

                          fillColor:
                            '#fb923c',

                          fillOpacity: 0.20,

                          weight: 2,
                        }}
                      >

                        <Popup>

                          <div className="min-w-[210px]">

                            <p className="font-bold text-navy">
                              {zone.name}
                            </p>


                            <div className="mt-2 space-y-1 text-sm">

                              <p>
                                Imperviousness:{' '}
                                <strong>
                                  {zone.imperviousnessPercent}%
                                </strong>
                              </p>


                              <p>
                                Runoff Potential:{' '}
                                <strong>
                                  {zone.runoffPotential}
                                </strong>
                              </p>

                            </div>

                          </div>

                        </Popup>

                      </Polygon>

                    ),
                  )}


                {/* =================================================
                    DRAINAGE PIPES
                ================================================= */}

                {isLayerOn(
                  'drainage',
                ) &&
                  drainagePipes.map(
                    (pipe) => (

                      <Polyline
                        key={pipe.id}
                        positions={
                          pipe.coordinates
                        }
                        pathOptions={{
                          color:
                            pipe.status ===
                            'Critical'
                              ? '#dc2626'
                              : pipe.status ===
                                'Overloaded'
                              ? '#f97316'
                              : '#2563eb',

                          weight:
                            pipe.status ===
                            'Critical'
                              ? 6
                              : pipe.status ===
                                'Overloaded'
                              ? 5
                              : 3,

                          opacity: 0.85,
                        }}
                      >

                        <Popup>

                          <div className="min-w-[220px]">

                            <p className="font-bold text-navy">
                              {pipe.name}
                            </p>


                            <div className="mt-2 space-y-1 text-sm">

                              <p>
                                Capacity:{' '}
                                <strong>
                                  {pipe.capacityPercent}%
                                </strong>
                              </p>


                              <p>
                                Current Flow:{' '}
                                <strong>
                                  {pipe.flowPercent}%
                                </strong>
                              </p>


                              <p>
                                Surcharge Risk:{' '}
                                <strong>
                                  {pipe.surchargeRiskPercent}%
                                </strong>
                              </p>


                              <p>
                                Blockage Risk:{' '}
                                <strong>
                                  {pipe.blockageRiskPercent}%
                                </strong>
                              </p>


                              <p>
                                Status:{' '}
                                <strong>
                                  {pipe.status}
                                </strong>
                              </p>

                            </div>

                          </div>

                        </Popup>

                      </Polyline>

                    ),
                  )}


                {/* =================================================
                    DRAINAGE NODES
                ================================================= */}

                {isLayerOn(
                  'drainage',
                ) &&
                  drainageNodes.map(
                    (node) => (

                      <Marker
                        key={node.id}
                        position={
                          node.coordinates
                        }

                        zIndexOffset={
                          500
                        }

                        icon={createIcon(
                          `
                          <div style="
                            background:white;
                            border:3px solid ${
                              node.status ===
                              'Critical'
                                ? '#DC2626'
                                : node.status ===
                                  'At Risk'
                                ? '#F97316'
                                : '#2563EB'
                            };
                            border-radius:50%;
                            width:24px;
                            height:24px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:12px;
                            font-weight:bold;
                            box-shadow:0 2px 5px rgba(0,0,0,0.3);
                          ">
                            ●
                          </div>
                          `,
                          24,
                        )}

                      >

                        <Popup>

                          <div className="min-w-[210px]">

                            <p className="font-bold text-navy">
                              {node.name}
                            </p>


                            <p className="text-sm text-gray-500">
                              Type: {node.type}
                            </p>


                            <div className="mt-2 space-y-1 text-sm">

                              <p>
                                Capacity:{' '}
                                <strong>
                                  {node.capacityPercent}%
                                </strong>
                              </p>


                              <p>
                                Surcharge Risk:{' '}
                                <strong>
                                  {node.surchargeRiskPercent}%
                                </strong>
                              </p>


                              <p>
                                Blockage Risk:{' '}
                                <strong>
                                  {node.blockageRiskPercent}%
                                </strong>
                              </p>


                              <p>
                                Status:{' '}
                                <strong>
                                  {node.status}
                                </strong>
                              </p>

                            </div>

                          </div>

                        </Popup>

                      </Marker>

                    ),
                  )}


                {/* =================================================
                    ROADS
                ================================================= */}

                {isLayerOn(
                  'roads',
                ) &&
                  authorityRoads.map(
                    (road) => (

                      <Polyline
                        key={road.id}
                        positions={
                          road.coordinates
                        }
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
                    STEP 10.6 + 10.7
                ================================================= */}

                {isLayerOn(
                  'roads',
                ) &&
                  visiblePredictions.map(
                    (prediction) => {

                      const riskColor =
                        getPredictionRiskColor(
                          prediction.riskLevel,
                        );


                      const isCritical =
                        prediction.riskLevel.toLowerCase() ===
                        'critical';


                      return (

                        <Marker

                          key={`${prediction.id}-${timeValue}`}

                          position={[
                            prediction.latitude,
                            prediction.longitude,
                          ]}


                          /*
                            STEP 10.6:
                            Keep flood prediction
                            markers above other
                            map markers.
                          */

                          zIndexOffset={
                            2000
                          }


                          icon={createIcon(

                            `
                            <div style="
                              position:relative;

                              background:${riskColor};

                              color:white;

                              border:3px solid white;

                              border-radius:50%;

                              width:38px;

                              height:38px;

                              display:flex;

                              align-items:center;

                              justify-content:center;

                              box-shadow:
                                0 0 0 4px ${riskColor}33,
                                0 3px 10px rgba(0,0,0,0.45);

                              font-size:11px;

                              font-weight:900;

                              line-height:1;

                              cursor:pointer;

                              ${
                                isCritical
                                  ? 'animation:pulse 1.5s infinite;'
                                  : ''
                              }
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

                            <div className="min-w-[240px]">

                              <p className="font-bold text-navy">

                                {
                                  prediction.locationName
                                }

                              </p>


                              <p className="mt-1 text-xs text-gray-500">

                                Street-level flood prediction

                              </p>


                              <div className="mt-3 rounded-lg bg-blue-50 p-2">

                                <p className="text-xs font-semibold text-blue-700">

                                  Forecast:{' '}

                                  {selectedTimeLabel}

                                </p>

                              </div>


                              <div className="mt-3 space-y-1.5 text-sm">


                                {/* RISK */}

                                <p>

                                  <span className="text-gray-500">
                                    Risk:{' '}
                                  </span>

                                  <strong
                                    style={{
                                      color:
                                        riskColor,
                                    }}
                                  >
                                    {
                                      prediction.riskLevel
                                    }
                                  </strong>

                                </p>


                                {/* PROBABILITY */}

                                <p>

                                  <span className="text-gray-500">
                                    Probability:{' '}
                                  </span>

                                  <strong>
                                    {
                                      prediction.probability
                                    }%
                                  </strong>

                                </p>


                                {/* WATER DEPTH */}

                                <p>

                                  <span className="text-gray-500">
                                    Water Depth:{' '}
                                  </span>

                                  <strong>
                                    {
                                      prediction.waterDepthCm
                                    }{' '}
                                    cm
                                  </strong>

                                </p>


                                {/* RAINFALL */}

                                <p>

                                  <span className="text-gray-500">
                                    Rainfall:{' '}
                                  </span>

                                  <strong>
                                    {
                                      prediction.rainfallMm
                                    }{' '}
                                    mm
                                  </strong>

                                </p>


                                {/* DRAINAGE */}

                                <p>

                                  <span className="text-gray-500">
                                    Drainage Capacity:{' '}
                                  </span>

                                  <strong>
                                    {
                                      prediction.drainageCapacityPercent
                                    }%
                                  </strong>

                                </p>


                                {/* SURCHARGE */}

                                <p>

                                  <span className="text-gray-500">
                                    Surcharge Risk:{' '}
                                  </span>

                                  <strong>
                                    {
                                      prediction.surchargeRiskPercent
                                    }%
                                  </strong>

                                </p>


                                {/* BLOCKAGE */}

                                <p>

                                  <span className="text-gray-500">
                                    Blockage Risk:{' '}
                                  </span>

                                  <strong>
                                    {
                                      prediction.blockageRiskPercent
                                    }%
                                  </strong>

                                </p>

                              </div>

                            </div>

                          </Popup>

                        </Marker>

                      );

                    },
                  )}


                {/* =================================================
                    INFRASTRUCTURE
                ================================================= */}

                {authorityInfrastructure.map(
                  (infra) => {

                    const layerType =
                      infra.type ===
                      'hospital'
                        ? 'hospitals'
                        : infra.type ===
                          'fire-station'
                        ? 'fire'
                        : infra.type ===
                          'police-station'
                        ? 'police'
                        : infra.type ===
                          'school'
                        ? 'schools'
                        : 'shelters';


                    if (
                      !isLayerOn(
                        layerType,
                      )
                    ) {
                      return null;
                    }


                    return (

                      <Marker
                        key={infra.id}
                        position={
                          infra.coordinates
                        }

                        zIndexOffset={
                          800
                        }

                        icon={createIcon(

                          `
                          <div style="
                            background:white;
                            border:2px solid ${
                              RISK_COLORS[
                                infra.riskLevel
                              ]
                            };
                            border-radius:50%;
                            width:28px;
                            height:28px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:14px;
                            box-shadow:0 2px 6px rgba(0,0,0,0.3);
                          ">
                            ${
                              infraIcons[
                                infra.type
                              ] ??
                              '📍'
                            }
                          </div>
                          `,

                          28,

                        )}

                      >

                        <Popup>

                          <div className="min-w-[160px]">

                            <p className="font-bold text-navy">
                              {infra.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Risk: {infra.riskPercentage}%
                            </p>

                          </div>

                        </Popup>

                      </Marker>

                    );

                  },
                )}


                {/* =================================================
                    CITIZEN REPORTS
                ================================================= */}

                {isLayerOn(
                  'citizen-reports',
                ) &&
                  authorityReports
                    .filter(
                      (report) =>
                        report.hasPhoto ||
                        report.severity ===
                          'critical' ||
                        report.severity ===
                          'high',
                    )
                    .map(
                      (report) => (

                        <Marker

                          key={
                            report.id
                          }

                          position={[
                            22.56 +
                              (report.numericId %
                                10) *
                                0.003,

                            88.36 +
                              (report.numericId %
                                7) *
                                0.004,
                          ]}

                          zIndexOffset={
                            700
                          }

                          icon={createIcon(

                            `
                            <div style="
                              background:#DC2626;
                              color:white;
                              border-radius:50%;
                              width:24px;
                              height:24px;
                              display:flex;
                              align-items:center;
                              justify-content:center;
                              font-size:10px;
                              font-weight:bold;
                              border:2px solid white;
                              box-shadow:0 2px 4px rgba(0,0,0,0.3);
                            ">
                              !
                            </div>
                            `,

                            24,

                          )}

                        >

                          <Popup>

                            <div className="min-w-[160px]">

                              <p className="font-bold text-navy">
                                Report #{report.numericId}
                              </p>

                              <p className="text-sm text-gray-500">
                                {report.zone} —{' '}
                                {report.severity.toUpperCase()}
                              </p>

                              <p className="text-xs text-gray-400">
                                {report.submittedAt}
                              </p>

                            </div>

                          </Popup>

                        </Marker>

                      ),
                    )}

              </MapContainer>


              {/* =================================================
                  MAP LAYER CONTROL
              ================================================= */}

              <div
                className="
                  absolute
                  right-3
                  top-3
                  z-[1000]
                "
              >

                <LayerControl
                  layers={layers}
                  onToggle={toggleLayer}
                />

              </div>


              {/* =================================================
                  LEGEND
              ================================================= */}

              <div
                className="
                  absolute
                  bottom-3
                  left-3
                  z-[1000]
                "
              >

                <MapLegend />

              </div>


              {/* =================================================
                  ACTIVE TIME INDICATOR
              ================================================= */}

              <div
                className="
                  absolute
                  left-1/2
                  top-3
                  z-[1000]
                  -translate-x-1/2
                  rounded-xl
                  border
                  border-blue-200
                  bg-white
                  px-4
                  py-2
                  text-center
                  shadow-card
                "
              >

                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                  Flood Forecast
                </p>

                <p className="text-sm font-bold text-navy">
                  {selectedTimeLabel}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              SIDE PANEL
          ================================================= */}

          <div className="space-y-4">


            {/* =================================================
                TIME SLIDER
            ================================================= */}

            <TimeSlider
              options={
                timeSliderOptions
              }
              value={timeValue}
              onChange={(value) => {

                setTimeValue(
                  value,
                );

                /*
                  Clear old selected prediction
                  so side panel doesn't display
                  stale time values.
                */

                setSelectedPrediction(
                  null,
                );

              }}
            />


            {/* =================================================
                TIME BASED RISK PREVIEW
            ================================================= */}

            <div
              className="
                rounded-2xl
                border
                border-border
                bg-white
                p-4
                shadow-card
              "
            >

              <p
                className="
                  mb-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-ink-muted
                "
              >

                Risk by Zone —{' '}

                {selectedTimeLabel}

              </p>


              <ul className="space-y-2">

                {authorityFloodZones.map(
                  (zone) => {

                    const riskKey =
                      `zone${zone.id.charAt(5).toUpperCase()}` as keyof typeof timeSliderRiskMap[string];


                    const riskLabel =
                      timeSliderRiskMap[
                        timeValue
                      ]?.[
                        riskKey
                      ] ?? '—';


                    const riskColor =
                      riskLabel ===
                      'Critical'
                        ? 'text-risk-critical'
                        : riskLabel ===
                          'High'
                        ? 'text-risk-high'
                        : riskLabel ===
                          'Moderate'
                        ? 'text-risk-moderate'
                        : 'text-risk-low';


                    return (

                      <li
                        key={
                          zone.id
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-lg
                          bg-surface
                          px-3
                          py-2
                        "
                      >

                        <span className="text-sm font-medium text-ink">
                          {zone.name}
                        </span>

                        <span
                          className={`
                            text-sm
                            font-bold
                            ${riskColor}
                          `}
                        >
                          {riskLabel}
                        </span>

                      </li>

                    );

                  },
                )}

              </ul>

            </div>


            {/* =================================================
                SELECTED ZONE DETAILS
            ================================================= */}

            {selectedZoneData && (

              <div
                className="
                  rounded-2xl
                  border
                  border-blue-primary/30
                  bg-blue-light/50
                  p-4
                  shadow-card
                  animate-slide-up
                "
              >

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >

                  <p className="font-bold text-navy">
                    {selectedZoneData.name}
                  </p>


                  <AuthorityRiskBadge
                    level={
                      selectedZoneData.riskLevel
                    }
                    size="sm"
                  />

                </div>


                <dl className="space-y-1 text-sm">

                  <div className="flex justify-between">

                    <dt className="text-ink-muted">
                      Probability
                    </dt>

                    <dd className="font-semibold text-ink">
                      {selectedZoneData.probability}%
                    </dd>

                  </div>


                  <div className="flex justify-between">

                    <dt className="text-ink-muted">
                      Water Depth
                    </dt>

                    <dd className="font-semibold text-ink">
                      {selectedZoneData.waterDepth}
                    </dd>

                  </div>


                  <div className="flex justify-between">

                    <dt className="text-ink-muted">
                      Onset
                    </dt>

                    <dd className="font-semibold text-ink">
                      {selectedZoneData.expectedOnset}
                    </dd>

                  </div>


                  <div className="flex justify-between">

                    <dt className="text-ink-muted">
                      Confidence
                    </dt>

                    <dd className="font-semibold text-ink">
                      {selectedZoneData.confidence}%
                    </dd>

                  </div>


                  <div className="flex justify-between">

                    <dt className="text-ink-muted">
                      Population
                    </dt>

                    <dd className="font-semibold text-ink">
                      {selectedZoneData.population.toLocaleString()}
                    </dd>

                  </div>

                </dl>

              </div>

            )}


            {/* =================================================
                SELECTED STREET PREDICTION
            ================================================= */}

            {selectedPrediction && (

              <div
                className="
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                  shadow-card
                  animate-slide-up
                "
              >

                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p className="font-bold text-navy">

                      {
                        selectedPrediction.locationName
                      }

                    </p>

                    <p className="text-xs text-gray-500">
                      {selectedTimeLabel}
                    </p>

                  </div>


                  <span
                    className="
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-bold
                    "
                    style={{
                      color:
                        getPredictionRiskColor(
                          selectedPrediction.riskLevel,
                        ),
                    }}
                  >

                    {
                      selectedPrediction.riskLevel
                    }

                  </span>

                </div>


                <div className="grid grid-cols-2 gap-2 text-sm">


                  {/* PROBABILITY */}

                  <div>

                    <p className="text-ink-muted">
                      Flood Probability
                    </p>

                    <p className="font-bold">
                      {
                        selectedPrediction.probability
                      }%
                    </p>

                  </div>


                  {/* WATER DEPTH */}

                  <div>

                    <p className="text-ink-muted">
                      Water Depth
                    </p>

                    <p className="font-bold">
                      {
                        selectedPrediction.waterDepthCm
                      } cm
                    </p>

                  </div>


                  {/* RAINFALL */}

                  <div>

                    <p className="text-ink-muted">
                      Rainfall
                    </p>

                    <p className="font-bold">
                      {
                        selectedPrediction.rainfallMm
                      } mm
                    </p>

                  </div>


                  {/* IMPERVIOUSNESS */}

                  <div>

                    <p className="text-ink-muted">
                      Imperviousness
                    </p>

                    <p className="font-bold">
                      {
                        selectedPrediction.imperviousnessPercent
                      }%
                    </p>

                  </div>


                  {/* DRAINAGE */}

                  <div>

                    <p className="text-ink-muted">
                      Drainage Capacity
                    </p>

                    <p className="font-bold">
                      {
                        selectedPrediction.drainageCapacityPercent
                      }%
                    </p>

                  </div>


                  {/* SURCHARGE */}

                  <div>

                    <p className="text-ink-muted">
                      Surcharge Risk
                    </p>

                    <p className="font-bold">
                      {
                        selectedPrediction.surchargeRiskPercent
                      }%
                    </p>

                  </div>


                  {/* BLOCKAGE */}

                  <div>

                    <p className="text-ink-muted">
                      Blockage Risk
                    </p>

                    <p className="font-bold">
                      {
                        selectedPrediction.blockageRiskPercent
                      }%
                    </p>

                  </div>


                  {/* ELEVATION */}

                  <div>

                    <p className="text-ink-muted">
                      Elevation
                    </p>

                    <p className="font-bold">
                      {
                        selectedPrediction.elevationM
                      } m
                    </p>

                  </div>

                </div>


                {/* =================================================
                    FORECAST STATUS
                ================================================= */}

                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-blue-200
                    bg-blue-50
                    p-3
                  "
                >

                  <p className="text-xs font-semibold text-blue-700">
                    Forecast Window
                  </p>

                  <p className="mt-1 text-sm font-bold text-navy">
                    {selectedTimeLabel}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">
                    Street-level flood values are
                    updated for the selected forecast
                    time in this frontend prototype.
                  </p>

                </div>

              </div>

            )}


            {/* =================================================
                LAYER SUMMARY
            ================================================= */}

            <div
              className="
                rounded-2xl
                border
                border-border
                bg-white
                p-4
                shadow-card
              "
            >

              <p
                className="
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-ink-muted
                "
              >
                Layer Summary
              </p>


              <p className="text-sm text-ink-muted">

                {
                  layers.filter(
                    (layer) =>
                      layer.enabled,
                  ).length
                }{' '}

                of{' '}

                {
                  layers.length
                }{' '}

                layers active

              </p>


              <p className="mt-1 text-xs text-ink-muted/70">
                Frontend prototype — live radar/API
                integration is not connected yet.
              </p>

            </div>

          </div>

        </div>

      </div>

    </AuthorityLayout>

  );
}