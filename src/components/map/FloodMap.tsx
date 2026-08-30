import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';

import L from 'leaflet';

import {
  MapPin,
  Shield,
  TriangleAlert,
} from 'lucide-react';

import type {
  FloodZone,
  MapRoad,
  MapShelter,
  RouteOption,
} from '@/types/citizen';

import type {
  FloodPrediction,
} from '@/types/flood';

import { USER_LOCATION } from '@/data/citizenMockData';

import {
  riskLabel,
  riskStyles,
} from '@/components/citizen/RiskBadge';


/* =====================================================
   RISK COLORS
===================================================== */

const RISK_COLORS: Record<string, string> = {
  low: '#15803D',
  moderate: '#CA8A04',
  high: '#EA580C',
  critical: '#DC2626',
};


/* =====================================================
   CREATE CUSTOM MAP ICON
===================================================== */

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


/* =====================================================
   USER LOCATION ICON
===================================================== */

const userIcon = createIcon(
  `
  <div style="
    background:#123B7A;
    color:white;
    border-radius:50%;
    width:28px;
    height:28px;
    display:flex;
    align-items:center;
    justify-content:center;
    border:3px solid white;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
    font-size:9px;
    font-weight:bold;
  ">
    YOU
  </div>
  `,
);


/* =====================================================
   SHELTER ICON
===================================================== */

const shelterIcon = createIcon(
  `
  <div style="
    background:#15803D;
    color:white;
    border-radius:50%;
    width:28px;
    height:28px;
    display:flex;
    align-items:center;
    justify-content:center;
    border:2px solid white;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
    font-size:14px;
  ">
    🏥
  </div>
  `,
);


/* =====================================================
   RISKY ROAD ICON
===================================================== */

const riskyRoadIcon = createIcon(
  `
  <div style="
    background:#DC2626;
    color:white;
    border-radius:50%;
    width:28px;
    height:28px;
    display:flex;
    align-items:center;
    justify-content:center;
    border:2px solid white;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
    font-size:14px;
  ">
    🚧
  </div>
  `,
);


/* =====================================================
   FLOOD MAP PROPS
===================================================== */

interface FloodMapProps {
  zones: FloodZone[];

  roads: MapRoad[];

  shelters: MapShelter[];

  predictions?: FloodPrediction[];

  selectedRoute?: RouteOption | null;

  center?: [number, number];

  zoom?: number;

  height?: string;

  showUserLocation?: boolean;

  onZoneClick?: (
    zone: FloodZone
  ) => void;

  onPredictionClick?: (
    prediction: FloodPrediction
  ) => void;
}


/* =====================================================
   FLOOD MAP COMPONENT
===================================================== */

export default function FloodMap({
  zones,

  roads,

  shelters,

  predictions = [],

  selectedRoute = null,

  center = USER_LOCATION,

  /* CHANGED: 14 → 13 */
  zoom = 13,

  height = '500px',

  showUserLocation = true,

  onZoneClick,

  onPredictionClick,

}: FloodMapProps) {

  return (
    <div
      style={{ height }}
      className="
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-border
      "
    >

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full"
      >


        {/* =================================================
            BASE MAP
        ================================================= */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />


        {/* =================================================
            EXISTING FLOOD ZONES
        ================================================= */}

        {zones.map((zone) => {

          const s = riskStyles(
            zone.riskLevel
          );

          const riskColor =
            RISK_COLORS[
              zone.riskLevel
            ] ?? '#52667A';

          return (
            <Polygon
              key={zone.id}
              positions={zone.polygon}
              pathOptions={{
                color: riskColor,
                fillColor: riskColor,
                fillOpacity: 0.25,
                weight: 2,
              }}
              eventHandlers={{
                click: () =>
                  onZoneClick?.(zone),
              }}
            >

              <Popup>

                <div className="min-w-[180px]">

                  <p className="font-bold text-navy">
                    {zone.name}
                  </p>

                  <dl className="mt-2 space-y-1 text-sm">

                    <div>

                      <dt className="inline text-gray-500">
                        Flood Risk:{' '}
                      </dt>

                      <dd
                        className={`inline font-bold ${s.text}`}
                      >
                        {riskLabel(
                          zone.riskLevel
                        )}
                      </dd>

                    </div>


                    <div>

                      <dt className="inline text-gray-500">
                        Risk:{' '}
                      </dt>

                      <dd className="inline font-semibold">
                        {zone.riskPercentage}%
                      </dd>

                    </div>


                    <div>

                      <dt className="inline text-gray-500">
                        Water Level:{' '}
                      </dt>

                      <dd className="inline font-semibold">
                        {zone.waterLevel}
                      </dd>

                    </div>


                    <div>

                      <dt className="inline text-gray-500">
                        Expected onset:{' '}
                      </dt>

                      <dd className="inline font-semibold">
                        {zone.expectedOnset}
                      </dd>

                    </div>

                  </dl>

                </div>

              </Popup>

            </Polygon>
          );
        })}


        {/* =================================================
            ROADS
        ================================================= */}

        {roads.map((road) => (

          <Polyline
            key={road.id}
            positions={road.coordinates}
            pathOptions={{
              color: road.risky
                ? '#DC2626'
                : '#52667A',

              weight: road.risky
                ? 4
                : 3,

              opacity: 0.7,

              dashArray: road.risky
                ? '8 4'
                : undefined,
            }}
          >

            <Popup>

              <div className="flex items-center gap-1.5">

                {road.risky ? (

                  <TriangleAlert
                    className="h-4 w-4 text-risk-critical"
                  />

                ) : (

                  <MapPin
                    className="h-4 w-4 text-ink-muted"
                  />

                )}

                <span className="font-semibold text-navy">
                  {road.name}
                </span>

                {road.risky && (

                  <span className="text-xs font-semibold text-risk-critical">
                    Risky Road
                  </span>

                )}

              </div>

            </Popup>

          </Polyline>

        ))}


        {/* =================================================
            STREET-LEVEL FLOOD PREDICTIONS
        ================================================= */}

        {predictions.map((prediction) => {

          const risk =
            prediction.riskLevel.toLowerCase();

          const riskColor =
            RISK_COLORS[risk] ?? '#52667A';


          return (

            <Marker

              key={prediction.id}

              position={[
                prediction.latitude,
                prediction.longitude,
              ]}


              /*
                IMPORTANT:
                Keeps prediction markers above
                other map markers.
              */
              zIndexOffset={2000}


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
                ">

                  ${prediction.waterDepthCm}

                </div>
                `,

                38

              )}


              eventHandlers={{

                click: () =>
                  onPredictionClick?.(
                    prediction
                  ),

              }}

            >

              {/* =================================================
                  PREDICTION POPUP
              ================================================= */}

              <Popup>

                <div className="min-w-[230px]">

                  <p className="font-bold text-navy">
                    {prediction.locationName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Street-level flood prediction
                  </p>


                  <div className="mt-3 space-y-1.5 text-sm">


                    {/* RISK */}

                    <p>

                      <span className="text-gray-500">
                        Risk:{' '}
                      </span>

                      <strong
                        style={{
                          color: riskColor,
                        }}
                      >
                        {prediction.riskLevel}
                      </strong>

                    </p>


                    {/* PROBABILITY */}

                    <p>

                      <span className="text-gray-500">
                        Probability:{' '}
                      </span>

                      <strong>
                        {prediction.probability}%
                      </strong>

                    </p>


                    {/* WATER DEPTH */}

                    <p>

                      <span className="text-gray-500">
                        Water Depth:{' '}
                      </span>

                      <strong>
                        {prediction.waterDepthCm} cm
                      </strong>

                    </p>


                    {/* RAINFALL */}

                    <p>

                      <span className="text-gray-500">
                        Rainfall:{' '}
                      </span>

                      <strong>
                        {prediction.rainfallMm} mm
                      </strong>

                    </p>


                    {/* DRAINAGE */}

                    <p>

                      <span className="text-gray-500">
                        Drainage Capacity:{' '}
                      </span>

                      <strong>
                        {prediction.drainageCapacityPercent}%
                      </strong>

                    </p>


                    {/* SURCHARGE */}

                    <p>

                      <span className="text-gray-500">
                        Surcharge Risk:{' '}
                      </span>

                      <strong>
                        {prediction.surchargeRiskPercent}%
                      </strong>

                    </p>


                    {/* BLOCKAGE */}

                    <p>

                      <span className="text-gray-500">
                        Blockage Risk:{' '}
                      </span>

                      <strong>
                        {prediction.blockageRiskPercent}%
                      </strong>

                    </p>

                  </div>

                </div>

              </Popup>

            </Marker>

          );

        })}


        {/* =================================================
            SHELTERS
        ================================================= */}

        {shelters.map((shelter) => (

          <Marker
            key={shelter.id}
            position={shelter.coordinates}
            icon={shelterIcon}
            zIndexOffset={1000}
          >

            <Popup>

              <div className="flex items-center gap-1.5">

                <Shield
                  className="h-4 w-4 text-risk-low"
                />

                <span className="font-semibold text-navy">
                  {shelter.name}
                </span>

              </div>

            </Popup>

          </Marker>

        ))}


        {/* =================================================
            SELECTED ROUTE
        ================================================= */}

        {selectedRoute && (

          <Polyline

            positions={
              selectedRoute.coordinates
            }

            pathOptions={{

              color:
                selectedRoute.recommended
                  ? '#15803D'
                  : selectedRoute.risk === 'high'
                  ? '#DC2626'
                  : '#CA8A04',

              weight: 5,

              opacity: 0.8,

            }}

          />

        )}


        {/* =================================================
            USER LOCATION
        ================================================= */}

        {showUserLocation && (

          <Marker
            position={USER_LOCATION}
            icon={userIcon}
            zIndexOffset={500}
          >

            <Popup>

              <div className="font-semibold text-navy">
                Your Location
              </div>

              <div className="text-sm text-gray-500">
                Kolkata, Zone B
              </div>

            </Popup>

          </Marker>

        )}

      </MapContainer>

    </div>
  );
}


/* =====================================================
   EXPORT ICONS
===================================================== */

export {
  userIcon,
  shelterIcon,
  riskyRoadIcon,
  createIcon,
};