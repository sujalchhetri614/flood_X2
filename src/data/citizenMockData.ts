import type {
  AlertItem,
  AreaDetail,
  CitizenProfile,
  DestinationOption,
  FloodZone,
  ForecastPoint,
  MapRoad,
  MapShelter,
  ReportItem,
  RiskInfo,
  RouteOption,
  WeatherSummary,
} from '@/types/citizen';

// Kolkata center
export const MAP_CENTER: [number, number] = [22.5726, 88.3639];
export const USER_LOCATION: [number, number] = [22.5675, 88.37];

export const currentRisk: RiskInfo = {
  level: 'high',
  percentage: 72,
  label: 'HIGH',
};

export const weatherSummary: WeatherSummary = {
  rainfall: '82 mm/hr',
  waterLevel: '1.4 m',
  weather: 'Heavy Rain',
};

export const forecastPoints: ForecastPoint[] = [
  { time: 'now', label: 'NOW', percentage: 52, level: 'moderate' },
  { time: '+30m', label: '+30m', percentage: 68, level: 'high' },
  { time: '+1h', label: '+1h', percentage: 76, level: 'high' },
  { time: '+2h', label: '+2h', percentage: 89, level: 'critical' },
  { time: '+3h', label: '+3h', percentage: 92, level: 'critical' },
];

export const areaDetail: AreaDetail = {
  zone: 'Zone B',
  riskLevel: 'high',
  probability: 87,
  expectedOnset: '35 min',
  confidence: 91,
  waterLevel: '1.4 m',
  rainfall: '82 mm/hr',
};

export const floodZones: FloodZone[] = [
  {
    id: 'zone-a',
    name: 'Zone A',
    riskLevel: 'low',
    riskPercentage: 28,
    waterLevel: '0.4 m',
    expectedOnset: 'No immediate risk',
    coordinates: [22.58, 88.35],
    polygon: [
      [22.585, 88.345],
      [22.575, 88.345],
      [22.575, 88.355],
      [22.585, 88.355],
      [22.585, 88.345],
    ],
  },
  {
    id: 'zone-b',
    name: 'Zone B',
    riskLevel: 'high',
    riskPercentage: 84,
    waterLevel: '1.2 m',
    expectedOnset: '25 min',
    coordinates: [22.565, 88.37],
    polygon: [
      [22.572, 88.365],
      [22.558, 88.365],
      [22.558, 88.378],
      [22.572, 88.378],
      [22.572, 88.365],
    ],
  },
  {
    id: 'zone-c',
    name: 'Zone C',
    riskLevel: 'critical',
    riskPercentage: 95,
    waterLevel: '2.1 m',
    expectedOnset: '12 min',
    coordinates: [22.56, 88.385],
    polygon: [
      [22.565, 88.38],
      [22.555, 88.38],
      [22.555, 88.392],
      [22.565, 88.392],
      [22.565, 88.38],
    ],
  },
  {
    id: 'zone-d',
    name: 'Zone D',
    riskLevel: 'moderate',
    riskPercentage: 54,
    waterLevel: '0.8 m',
    expectedOnset: '50 min',
    coordinates: [22.555, 88.355],
    polygon: [
      [22.56, 88.35],
      [22.55, 88.35],
      [22.55, 88.362],
      [22.56, 88.362],
      [22.56, 88.35],
    ],
  },
];

export const mapRoads: MapRoad[] = [
  {
    id: 'road-1',
    name: 'MG Road',
    risky: false,
    coordinates: [
      [22.58, 88.34],
      [22.57, 88.36],
      [22.56, 88.37],
    ],
  },
  {
    id: 'road-2',
    name: 'Park Street',
    risky: true,
    coordinates: [
      [22.553, 88.35],
      [22.56, 88.37],
      [22.565, 88.385],
    ],
  },
  {
    id: 'road-3',
    name: 'AJC Bose Road',
    risky: false,
    coordinates: [
      [22.56, 88.35],
      [22.565, 88.365],
      [22.57, 88.38],
    ],
  },
];

export const mapShelters: MapShelter[] = [
  {
    id: 'shelter-1',
    name: 'Community Shelter — Sector 5',
    coordinates: [22.58, 88.36],
  },
  {
    id: 'shelter-2',
    name: 'Municipal Shelter — Park Circus',
    coordinates: [22.55, 88.37],
  },
];

export const alerts: AlertItem[] = [
  {
    id: 'alert-1',
    type: 'flood',
    title: 'HIGH FLOOD RISK',
    description: 'Heavy rainfall expected in your area. Water levels rising rapidly.',
    severity: 'high',
    location: 'Zone B',
    time: '35 min expected onset',
    action: 'View Safe Route',
    actionPath: '/citizen/safe-route',
  },
  {
    id: 'alert-2',
    type: 'rainfall',
    title: 'Heavy Rainfall Warning',
    description: '82 mm/hr rainfall recorded. Expected to continue for next 2 hours.',
    severity: 'moderate',
    location: 'Kolkata',
    time: 'Active now',
    action: 'View Forecast',
    actionPath: '/citizen/forecast',
  },
  {
    id: 'alert-3',
    type: 'road',
    title: 'Road Closure — Park Street',
    description: 'Park Street flooded. Avoid this route.',
    severity: 'high',
    location: 'Park Street',
    time: '15 min ago',
    action: 'View Safe Route',
    actionPath: '/citizen/safe-route',
  },
  {
    id: 'alert-4',
    type: 'evacuation',
    title: 'Evacuation Advisory — Zone C',
    description: 'Critical flood risk. Residents advised to move to nearest shelter.',
    severity: 'critical',
    location: 'Zone C',
    time: '5 min ago',
    action: 'View Safe Route',
    actionPath: '/citizen/safe-route',
  },
];

export const destinationOptions: DestinationOption[] = [
  { id: 'hospital', label: 'Hospital', icon: 'hospital', coordinates: [22.58, 88.36] },
  { id: 'shelter', label: 'Shelter', icon: 'shelter', coordinates: [22.55, 88.37] },
  { id: 'home', label: 'Home', icon: 'home', coordinates: [22.56, 88.35] },
  { id: 'custom', label: 'Custom Location', icon: 'custom', coordinates: [22.57, 88.38] },
];

export const routeOptions: RouteOption[] = [
  {
    id: 'route-a',
    label: 'Route A',
    duration: '24 min',
    risk: 'high',
    riskLabel: 'HIGH FLOOD RISK',
    recommended: false,
    notes: 'Passes through Zone B — waterlogging likely.',
    coordinates: [
      [22.5675, 88.37],
      [22.565, 88.375],
      [22.56, 88.378],
      [22.555, 88.38],
      [22.55, 88.37],
    ],
  },
  {
    id: 'route-b',
    label: 'Route B',
    duration: '29 min',
    risk: 'low',
    riskLabel: 'LOW FLOOD RISK',
    recommended: true,
    notes: 'Low flood risk. No blocked roads.',
    coordinates: [
      [22.5675, 88.37],
      [22.572, 88.365],
      [22.576, 88.36],
      [22.578, 88.365],
      [22.58, 88.36],
    ],
  },
  {
    id: 'route-c',
    label: 'Route C',
    duration: '26 min',
    risk: 'moderate',
    riskLabel: 'MODERATE FLOOD RISK',
    recommended: false,
    notes: 'Partial waterlogging near Sector 3.',
    coordinates: [
      [22.5675, 88.37],
      [22.565, 88.365],
      [22.562, 88.36],
      [22.558, 88.365],
      [22.55, 88.37],
    ],
  },
];

export const myReports: ReportItem[] = [
  {
    id: 'report-102',
    numericId: 102,
    zone: 'Zone B',
    severity: 'high',
    status: 'under-review',
    description: 'Severe waterlogging on Park Street. Water entering ground-floor shops.',
    location: 'Kolkata, Zone B — Park Street',
    submittedAt: '2026-08-27 09:42',
    hasPhoto: true,
    authorityFeedback: 'Pending',
  },
  {
    id: 'report-098',
    numericId: 98,
    zone: 'Zone A',
    severity: 'moderate',
    status: 'verified',
    description: 'Drainage overflow near MG Road crossing. Water level rising slowly.',
    location: 'Kolkata, Zone A — MG Road',
    submittedAt: '2026-08-26 18:15',
    hasPhoto: false,
    authorityFeedback: 'Verified by municipal team. Drainage clearance scheduled.',
  },
  {
    id: 'report-091',
    numericId: 91,
    zone: 'Zone C',
    severity: 'critical',
    status: 'resolved',
    description: 'Complete submersion of low-lying residential area. Multiple families stranded.',
    location: 'Kolkata, Zone C — Bidhan Nagar',
    submittedAt: '2026-08-25 14:30',
    hasPhoto: true,
    authorityFeedback: 'Resolved. Emergency response completed. Affected families relocated to shelter.',
  },
];

export const citizenProfile: CitizenProfile = {
  name: 'Citizen User',
  phone: '+91 98765 43210',
  location: 'Kolkata',
  zone: 'Zone B',
};
