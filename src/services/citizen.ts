import type {
  AlertItem,
  AreaDetail,
  CitizenProfile,
  ForecastPoint,
  ReportItem,
  ReportSeverity,
  RiskInfo,
  RouteOption,
  WeatherSummary,
} from '@/types/citizen';
import {
  alerts,
  areaDetail,
  citizenProfile,
  forecastPoints,
  myReports,
  routeOptions,
  currentRisk,
  weatherSummary,
} from '@/data/citizenMockData';

const LATENCY = 500;

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchCurrentRisk(): Promise<RiskInfo> {
  return delay(currentRisk);
}

export async function fetchWeatherSummary(): Promise<WeatherSummary> {
  return delay(weatherSummary);
}

export async function fetchForecast(): Promise<ForecastPoint[]> {
  return delay(forecastPoints);
}

export async function fetchAreaDetail(): Promise<AreaDetail> {
  return delay(areaDetail);
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  return delay(alerts);
}

export async function fetchRoutes(): Promise<RouteOption[]> {
  return delay(routeOptions, 800);
}

export async function fetchReports(): Promise<ReportItem[]> {
  return delay(myReports);
}

export async function fetchProfile(): Promise<CitizenProfile> {
  return delay(citizenProfile);
}

export interface SubmitReportInput {
  severity: ReportSeverity;
  description: string;
  location: string;
  hasPhoto: boolean;
  photoUrl?: string;
}

export async function submitReport(input: SubmitReportInput): Promise<ReportItem> {
  const numericId = Math.floor(Math.random() * 200) + 100;
  const report: ReportItem = {
    id: `report-${numericId}`,
    numericId,
    zone: 'Zone B',
    severity: input.severity,
    status: 'under-review',
    description: input.description || 'No description provided.',
    location: input.location,
    submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    hasPhoto: input.hasPhoto,
    photoUrl: input.photoUrl,
    authorityFeedback: 'Pending',
  };
  return delay(report, 800);
}
