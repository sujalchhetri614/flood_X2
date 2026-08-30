export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type ForecastTime =
  | 'Now'
  | '+30 min'
  | '+1 hour'
  | '+2 hour'
  | '+3 hour';

export interface FloodPrediction {
  id: string;

  locationName: string;

  latitude: number;
  longitude: number;

  riskLevel: RiskLevel;

  probability: number;

  waterDepthCm: number;

  rainfallMm: number;

  elevationM: number;

  slopePercent: number;

  imperviousnessPercent: number;

  drainageCapacityPercent: number;

  surchargeRiskPercent: number;

  blockageRiskPercent: number;

  predictedAt: string;

  forecastTime: ForecastTime;
}