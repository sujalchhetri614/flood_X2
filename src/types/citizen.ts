export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskInfo {
  level: RiskLevel;
  percentage: number;
  label: string;
}

export interface WeatherSummary {
  rainfall: string;
  waterLevel: string;
  weather: string;
}

export interface ForecastPoint {
  time: string;
  label: string;
  percentage: number;
  level: RiskLevel;
}

export interface AreaDetail {
  zone: string;
  riskLevel: RiskLevel;
  probability: number;
  expectedOnset: string;
  confidence: number;
  waterLevel: string;
  rainfall: string;
}

export interface FloodZone {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  riskPercentage: number;
  waterLevel: string;
  expectedOnset: string;
  coordinates: [number, number];
  polygon: [number, number][];
}

export interface MapRoad {
  id: string;
  name: string;
  risky: boolean;
  coordinates: [number, number][];
}

export interface MapShelter {
  id: string;
  name: string;
  coordinates: [number, number];
}

export type AlertType = 'rainfall' | 'flood' | 'road' | 'evacuation';

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  severity: RiskLevel;
  location: string;
  time: string;
  action: string;
  actionPath: string;
}

export type RouteRisk = 'low' | 'moderate' | 'high';

export interface RouteOption {
  id: string;
  label: string;
  duration: string;
  risk: RouteRisk;
  riskLabel: string;
  recommended: boolean;
  notes: string;
  coordinates: [number, number][];
}

export type ReportSeverity = 'low' | 'moderate' | 'high' | 'critical';
export type ReportStatus = 'under-review' | 'verified' | 'resolved';

export interface ReportItem {
  id: string;
  numericId: number;
  zone: string;
  severity: ReportSeverity;
  status: ReportStatus;
  description: string;
  location: string;
  submittedAt: string;
  hasPhoto: boolean;
  photoUrl?: string;
  authorityFeedback: string;
}

export interface CitizenProfile {
  name: string;
  phone: string;
  location: string;
  zone: string;
}

export interface DestinationOption {
  id: string;
  label: string;
  icon: string;
  coordinates: [number, number];
}
