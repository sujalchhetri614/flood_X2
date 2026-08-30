import {
  floodPredictions,
  forecastTimeline,
} from '../data/floodPredictionData';

import type {
  FloodPrediction,
  RiskLevel,
} from '../types/flood';

export function getFloodPredictions(): FloodPrediction[] {
  return floodPredictions;
}

export function getPredictionByLocation(
  locationName: string
): FloodPrediction | undefined {
  return floodPredictions.find(
    (prediction) =>
      prediction.locationName === locationName
  );
}

export function getForecastTimeline() {
  return forecastTimeline;
}

export function getRiskColor(
  risk: RiskLevel
): string {
  switch (risk) {
    case 'Low':
      return '#22c55e';

    case 'Moderate':
      return '#eab308';

    case 'High':
      return '#f97316';

    case 'Critical':
      return '#ef4444';

    default:
      return '#64748b';
  }
}