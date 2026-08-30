import { useState } from 'react';

import {
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  TriangleAlert,
  Droplets,
  Clock,
  Route,
} from 'lucide-react';

import CitizenLayout from '@/components/citizen/CitizenLayout';

import FloodMap from '@/components/map/FloodMap';

import RouteCard from '@/components/citizen/RouteCard';

import Button from '@/components/ui/Button';

import Alert from '@/components/ui/Alert';

import {
  destinationOptions,
  floodZones,
  mapRoads,
  mapShelters,
  routeOptions,
} from '@/data/citizenMockData';

import {
  floodPredictions,
} from '@/data/floodPredictionData';

import type {
  RouteOption,
} from '@/types/citizen';

import type {
  FloodPrediction,
} from '@/types/flood';


/* =====================================================
   DISTANCE BETWEEN TWO COORDINATES
===================================================== */

function distanceMeters(
  a: [number, number],
  b: [number, number],
) {
  const R = 6371000;

  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;

  const dLat =
    ((b[0] - a[0]) * Math.PI) / 180;

  const dLon =
    ((b[1] - a[1]) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(x),
      Math.sqrt(1 - x),
    );

  return R * c;
}


/* =====================================================
   FLOOD RISK SCORE FOR A ROUTE
===================================================== */

function calculateRouteRisk(
  route: RouteOption,
  predictions: FloodPrediction[],
) {
  let maxRisk = 0;

  let maxDepth = 0;

  let nearestPrediction:
    FloodPrediction | null = null;


  for (const routePoint of route.coordinates) {

    for (const prediction of predictions) {

      const distance = distanceMeters(
        routePoint,
        [
          prediction.latitude,
          prediction.longitude,
        ],
      );


      /*
        Prediction is considered relevant
        if it is within approximately 800m
        of the route.
      */

      if (distance <= 800) {

        const riskScore =
          prediction.probability +
          prediction.waterDepthCm * 1.2 +
          prediction.surchargeRiskPercent * 0.5;


        if (riskScore > maxRisk) {

          maxRisk = riskScore;

          nearestPrediction = prediction;

        }


        maxDepth = Math.max(
          maxDepth,
          prediction.waterDepthCm,
        );

      }

    }

  }


  /*
    Existing route risk also contributes.
  */

  const riskyRoadPenalty =
    route.risk === 'high'
      ? 35
      : route.risk === 'moderate'
      ? 15
      : 0;


  const finalScore =
    maxRisk + riskyRoadPenalty;


  let risk:
    | 'low'
    | 'moderate'
    | 'high';


  if (finalScore >= 150) {

    risk = 'high';

  } else if (finalScore >= 90) {

    risk = 'moderate';

  } else {

    risk = 'low';

  }


  return {
    score: finalScore,

    risk,

    maxDepth,

    nearestPrediction,
  };
}


/* =====================================================
   MAIN PAGE
===================================================== */

export default function CitizenSafeRoutePage() {

  const [
    destination,
    setDestination,
  ] = useState('hospital');


  const [
    routes,
    setRoutes,
  ] = useState<RouteOption[]>([]);


  const [
    selected,
    setSelected,
  ] = useState<string | null>(null);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    searched,
    setSearched,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(null);


  /* ===================================================
     FIND SAFE ROUTE
  =================================================== */

  const handleFind = async (
    e: React.FormEvent,
  ) => {

    e.preventDefault();

    setError(null);


    if (!destination) {

      setError(
        'Please select a destination.',
      );

      return;

    }


    setLoading(true);


    try {

      /*
        Frontend-only prototype:
        Existing route data is evaluated
        against flood predictions.
      */

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500),
      );


      const evaluatedRoutes =
        routeOptions.map((route) => {

          const evaluation =
            calculateRouteRisk(
              route,
              floodPredictions,
            );


          let riskLabel =
            'LOW FLOOD RISK';


          if (
            evaluation.risk === 'high'
          ) {

            riskLabel =
              'HIGH FLOOD RISK';

          } else if (
            evaluation.risk === 'moderate'
          ) {

            riskLabel =
              'MODERATE FLOOD RISK';

          }


          return {

            ...route,

            risk:
              evaluation.risk,

            riskLabel,

            recommended:
              false,

            notes:
              evaluation.nearestPrediction

                ? `Flood risk detected near ${evaluation.nearestPrediction.locationName}. Expected water depth: ${evaluation.nearestPrediction.waterDepthCm} cm.`

                : 'No major flood prediction detected near this route.',

          };

        });


      /*
        Sort routes according to flood risk.
      */

      const scoredRoutes =
        evaluatedRoutes
          .map((route) => ({

            route,

            evaluation:
              calculateRouteRisk(
                route,
                floodPredictions,
              ),

          }))
          .sort(
            (a, b) =>
              a.evaluation.score -
              b.evaluation.score,
          );


      /*
        Lowest-risk route becomes recommended.
      */

      const recommendedId =
        scoredRoutes[0]?.route.id;


      const finalRoutes =
        evaluatedRoutes.map(
          (route) => ({

            ...route,

            recommended:
              route.id ===
              recommendedId,

          }),
        );


      setRoutes(finalRoutes);


      /*
        Initially select the recommended route.
      */

      setSelected(
        recommendedId ??
        finalRoutes[0]?.id ??
        null,
      );


      setSearched(true);


    } catch {

      setError(
        'Unable to find safe route. Please try again.',
      );

    } finally {

      setLoading(false);

    }

  };


  /* ===================================================
     SELECTED ROUTE
  =================================================== */

  const selectedRoute =
    routes.find(
      (route) =>
        route.id === selected,
    ) ?? null;


  /* ===================================================
     SELECTED ROUTE FLOOD ANALYSIS
  =================================================== */

  const selectedEvaluation =
    selectedRoute
      ? calculateRouteRisk(
          selectedRoute,
          floodPredictions,
        )
      : null;


  /*
    IMPORTANT:
    This automatically changes whenever
    Route A / B / C is selected.
  */

  const selectedNearbyFlood =
    selectedEvaluation?.nearestPrediction ??
    null;


  return (

    <CitizenLayout>

      <div className="animate-fade-in">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5">

          <h1 className="text-h2 font-bold text-navy-dark">
            Safe Route Finder
          </h1>

          <p className="mt-1 text-[15px] text-ink-muted">
            Find the safest route by avoiding
            predicted flood-risk areas.
          </p>

        </div>


        {/* =================================================
            ROUTE SEARCH
        ================================================= */}

        <form
          onSubmit={handleFind}
          className="
            mb-5
            rounded-2xl
            border
            border-border
            bg-white
            p-5
            shadow-card
          "
        >

          <div className="grid gap-4 sm:grid-cols-2">


            {/* FROM */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-ink">
                From
              </label>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-4
                  py-3
                  text-sm
                  text-ink
                "
              >

                <MapPin
                  className="h-4 w-4 text-blue-primary"
                  aria-hidden="true"
                />

                Current Location
                (Kolkata, Zone B)

              </div>

            </div>


            {/* TO */}

            <div>

              <label
                htmlFor="dest"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-ink
                "
              >
                To
              </label>


              <select
                id="dest"
                value={destination}
                onChange={(e) =>
                  setDestination(
                    e.target.value,
                  )
                }
                className="fx-input"
              >

                {destinationOptions.map(
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

          </div>


          <Button
            type="submit"
            loading={loading}
            className="mt-4"
          >

            <Search
              className="h-4 w-4"
              aria-hidden="true"
            />

            {loading
              ? 'Analysing Flood Risk…'
              : 'Find Safe Route'}

          </Button>

        </form>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <Alert
            variant="error"
            className="mb-4"
          >
            {error}
          </Alert>

        )}


        {/* =================================================
            FLOOD ANALYSIS STATUS
        ================================================= */}

        {searched && (

          <div
            className="
              mb-5
              rounded-2xl
              border
              border-blue-200
              bg-blue-50
              p-4
            "
          >

            <div className="flex items-start gap-3">

              <ShieldCheck
                className="
                  mt-0.5
                  h-5
                  w-5
                  shrink-0
                  text-blue-primary
                "
              />


              <div>

                <p className="font-semibold text-navy">
                  Flood-aware route analysis complete
                </p>


                <p className="mt-1 text-sm text-ink-muted">
                  Routes were evaluated using
                  predicted flood probability,
                  water depth and drainage surcharge
                  risk.
                </p>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            ROUTE OPTIONS
        ================================================= */}

        {searched &&
          routes.length > 0 && (

            <div className="mb-5">

              <h2
                className="
                  mb-3
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wide
                  text-ink-muted
                "
              >
                Available Routes
              </h2>


              <div className="grid gap-3 sm:grid-cols-3">

                {routes.map(
                  (route) => (

                    <RouteCard
                      key={route.id}
                      route={route}
                      selected={
                        selected ===
                        route.id
                      }
                      onSelect={() =>
                        setSelected(
                          route.id,
                        )
                      }
                    />

                  ),
                )}

              </div>

            </div>

          )}


        {/* =================================================
            SELECTED ROUTE
        ================================================= */}

        {selectedRoute && (

          <div
            className="
              mb-5
              rounded-2xl
              border-2
              border-risk-low/30
              bg-risk-low/5
              p-5
            "
          >

            <div className="flex items-center gap-2">

              {selectedRoute.recommended ? (

                <ShieldCheck
                  className="
                    h-5
                    w-5
                    text-risk-low
                  "
                />

              ) : (

                <Route
                  className="
                    h-5
                    w-5
                    text-navy
                  "
                />

              )}


              <h2
                className={`
                  text-lg
                  font-bold
                  ${
                    selectedRoute.recommended
                      ? 'text-risk-low'
                      : 'text-navy'
                  }
                `}
              >

                {selectedRoute.recommended
                  ? `RECOMMENDED — ${selectedRoute.label}`
                  : selectedRoute.label}

              </h2>

            </div>


            {/* =================================================
                ROUTE DETAILS
            ================================================= */}

            <div
              className="
                mt-3
                grid
                grid-cols-2
                gap-4
                sm:grid-cols-4
              "
            >


              {/* DURATION */}

              <div>

                <div className="flex items-center gap-1.5">

                  <Clock
                    className="
                      h-4
                      w-4
                      text-blue-primary
                    "
                  />

                  <span className="text-xs text-ink-muted">
                    Travel Time
                  </span>

                </div>

                <p className="mt-1 font-semibold text-ink">
                  {selectedRoute.duration}
                </p>

              </div>


              {/* FLOOD RISK */}

              <div>

                <div className="flex items-center gap-1.5">

                  <TriangleAlert
                    className="
                      h-4
                      w-4
                      text-risk-high
                    "
                  />

                  <span className="text-xs text-ink-muted">
                    Flood Risk
                  </span>

                </div>

                <p className="mt-1 font-semibold text-ink">
                  {selectedRoute.riskLabel}
                </p>

              </div>


              {/* WATER DEPTH */}

              <div>

                <div className="flex items-center gap-1.5">

                  <Droplets
                    className="
                      h-4
                      w-4
                      text-blue-primary
                    "
                  />

                  <span className="text-xs text-ink-muted">
                    Expected Depth
                  </span>

                </div>

                <p className="mt-1 font-semibold text-ink">

                  {selectedEvaluation
                    ? `${selectedEvaluation.maxDepth} cm`
                    : '—'}

                </p>

              </div>


              {/* STATUS */}

              <div>

                <div className="flex items-center gap-1.5">

                  <ShieldCheck
                    className="
                      h-4
                      w-4
                      text-risk-low
                    "
                  />

                  <span className="text-xs text-ink-muted">
                    Route Status
                  </span>

                </div>

                <p className="mt-1 font-semibold text-risk-low">

                  {selectedRoute.recommended
                    ? 'SAFER'
                    : 'ALTERNATIVE'}

                </p>

              </div>

            </div>


            {/* =================================================
                ROUTE NOTES
            ================================================= */}

            <p className="mt-4 text-sm text-ink-muted">
              {selectedRoute.notes}
            </p>


            {/* =================================================
                NEARBY FLOOD PREDICTION
            ================================================= */}

            {selectedNearbyFlood && (

              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-orange-200
                  bg-orange-50
                  p-4
                "
              >

                <p className="font-semibold text-navy">
                  Nearby Flood Prediction
                </p>


                <div
                  className="
                    mt-2
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-4
                  "
                >

                  {/* LOCATION */}

                  <div>

                    <p className="text-xs text-ink-muted">
                      Location
                    </p>

                    <p className="text-sm font-semibold">
                      {selectedNearbyFlood.locationName}
                    </p>

                  </div>


                  {/* PROBABILITY */}

                  <div>

                    <p className="text-xs text-ink-muted">
                      Probability
                    </p>

                    <p className="text-sm font-semibold">
                      {selectedNearbyFlood.probability}%
                    </p>

                  </div>


                  {/* WATER DEPTH */}

                  <div>

                    <p className="text-xs text-ink-muted">
                      Water Depth
                    </p>

                    <p className="text-sm font-semibold">
                      {selectedNearbyFlood.waterDepthCm} cm
                    </p>

                  </div>


                  {/* SURCHARGE */}

                  <div>

                    <p className="text-xs text-ink-muted">
                      Surcharge
                    </p>

                    <p className="text-sm font-semibold">
                      {selectedNearbyFlood.surchargeRiskPercent}%
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* =================================================
                START NAVIGATION
            ================================================= */}

            <Button className="mt-4">

              <Navigation
                className="h-4 w-4"
                aria-hidden="true"
              />

              Start Navigation

            </Button>

          </div>

        )}


        {/* =================================================
            ROUTE MAP
        ================================================= */}

        {selectedRoute && (

          <div>

            <h2
              className="
                mb-3
                text-sm
                font-semibold
                uppercase
                tracking-wide
                text-ink-muted
              "
            >
              Flood-Safe Route Map
            </h2>


            <FloodMap

              zones={floodZones}

              roads={mapRoads}

              shelters={mapShelters}

              predictions={
                floodPredictions
              }

              selectedRoute={
                selectedRoute
              }

              height="450px"

            />

          </div>

        )}


        {/* =================================================
            FOOTNOTE
        ================================================= */}

        <p className="mt-4 text-center text-xs text-ink-muted">

          Route recommendations are based on
          frontend prototype flood-prediction data.
          Real navigation requires live GIS/
          routing API integration.

        </p>

      </div>

    </CitizenLayout>

  );

}