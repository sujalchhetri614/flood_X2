import type { RiskLevel } from '@/types/citizen';

export type AuthorityRiskLevel = RiskLevel | 'emergency';

export interface KpiData {
  id: string;
  label: string;
  value: number;
  icon: 'critical' | 'high' | 'road' | 'infrastructure' | 'alert' | 'report';
  link: string;
  trend?: string;
}

export interface AuthorityFloodZone {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  riskPercentage: number;
  probability: number;
  waterDepth: string;
  expectedOnset: string;
  confidence: number;
  affectedRoads: number;
  nearbyInfrastructure: string;
  population: number;
  polygon: [number, number][];
  coordinates: [number, number];
}

export interface AuthorityRoad {
  id: string;
  name: string;
  riskPercentage: number;
  riskLevel: RiskLevel;
  waterDepth: string;
  timeToImpact: string;
  trafficImportance: 'low' | 'moderate' | 'high';
  status: 'open' | 'closed' | 'restricted';
  coordinates: [number, number][];
}

export type InfrastructureType = 'hospital' | 'fire-station' | 'police-station' | 'school' | 'shelter';
export type InfrastructureStatus = 'operational' | 'at-risk' | 'critical' | 'offline';

export interface AuthorityInfrastructure {
  id: string;
  name: string;
  type: InfrastructureType;
  riskPercentage: number;
  riskLevel: RiskLevel;
  waterDepth: string;
  accessibility: InfrastructureStatus;
  power: 'stable' | 'backup' | 'down';
  safeRouteAvailable: boolean;
  coordinates: [number, number];
}

export interface NowcastPoint {
  time: string;
  label: string;
  probability: number;
  riskLevel: RiskLevel;
}

export interface NowcastZone {
  zoneId: string;
  zoneName: string;
  currentRisk: RiskLevel;
  peakRisk: RiskLevel;
  peakTime: string;
  expectedOnset: string;
  points: NowcastPoint[];
}

export interface ResponsePriority {
  zoneId: string;
  zoneName: string;
  priority: 1 | 2 | 3;
  floodRisk: RiskLevel;
  populationExposure: 'low' | 'moderate' | 'high';
  infrastructureCount: number;
  roadConnectivity: 'low' | 'moderate' | 'high';
  historicalImpact: 'moderate' | 'severe' | 'extreme';
  recommendedActions: string[];
}

export interface EmergencyRoute {
  id: string;
  label: string;
  status: 'safe' | 'high-risk' | 'blocked';
  distance: string;
  travelTime: string;
  riskLevel: RiskLevel;
  roadCondition: 'open' | 'closed' | 'restricted';
  recommended: boolean;
  coordinates: [number, number][];
}

export type AuthorityAlertType = 'flood' | 'warning' | 'road-closure' | 'evacuation' | 'emergency';
export type AuthorityAlertStatus = 'active' | 'expired' | 'resolved';

export interface AuthorityAlert {
  id: string;
  title: string;
  area: string;
  type: AuthorityAlertType;
  severity: RiskLevel;
  message: string;
  createdAt: string;
  status: AuthorityAlertStatus;
}

export interface AuthorityReport {
  id: string;
  numericId: number;
  zone: string;
  severity: RiskLevel;
  status: 'new' | 'under-review' | 'verified' | 'rejected' | 'dispatched' | 'resolved';
  description: string;
  location: string;
  submittedAt: string;
  hasPhoto: boolean;
  photoUrl?: string;
  citizenName: string;
  authorityFeedback: string;
}

export interface RealityCheck {
  zoneId: string;
  modelRisk: RiskLevel;
  modelRiskPercentage: number;
  citizenReports: number;
  verifiedReports: number;
  observedWaterDepth: string;
  modelEstimatedDepth: string;
  groundObservation: 'confirmed' | 'unconfirmed' | 'contradicted';
  previousRisk: number;
  updatedRisk: number;
  updatedConfidence: number;
  recalibrationReason: string;
}

export interface AiRecommendation {
  id: string;
  text: string;
  priority: 1 | 2 | 3;
  category: 'road' | 'infrastructure' | 'zone' | 'shelter' | 'evacuation';
}

export interface MapLayer {
  id: string;
  label: string;
  type: 'flood-risk' | 'rainfall' | 'terrain' | 'imperviousness' | 'drainage' | 'roads' | 'bridges' | 'hospitals' | 'police' | 'fire' | 'schools' | 'shelters' | 'railway' | 'citizen-reports';
  enabled: boolean;
}

export interface AnalyticsData {
  populationExposed: number;
  roadsAffected: number;
  hospitalsAtRisk: number;
  schoolsAtRisk: number;
  criticalZones: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}
