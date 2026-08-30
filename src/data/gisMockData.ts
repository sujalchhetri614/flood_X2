export interface TerrainZone {
  id: string;
  name: string;
  elevationM: number;
  slopePercent: number;
  terrain: 'Low-lying' | 'Moderate' | 'Elevated';
  polygon: [number, number][];
}

export interface ImperviousZone {
  id: string;
  name: string;
  imperviousnessPercent: number;
  runoffPotential: 'Low' | 'Moderate' | 'High' | 'Very High';
  polygon: [number, number][];
}

export interface DrainagePipe {
  id: string;
  name: string;
  capacityPercent: number;
  flowPercent: number;
  surchargeRiskPercent: number;
  blockageRiskPercent: number;
  status: 'Normal' | 'Overloaded' | 'Critical';
  coordinates: [number, number][];
}

export interface DrainageNode {
  id: string;
  name: string;
  type: 'Manhole' | 'Inlet';
  capacityPercent: number;
  surchargeRiskPercent: number;
  blockageRiskPercent: number;
  status: 'Normal' | 'At Risk' | 'Critical';
  coordinates: [number, number];
}


/* =========================
   DEM / TERRAIN DATA
========================= */

export const terrainZones: TerrainZone[] = [
  {
    id: 'terrain-1',
    name: 'Zone A Terrain',
    elevationM: 8.4,
    slopePercent: 1.2,
    terrain: 'Low-lying',
    polygon: [
      [22.585, 88.345],
      [22.575, 88.345],
      [22.575, 88.355],
      [22.585, 88.355],
      [22.585, 88.345],
    ],
  },

  {
    id: 'terrain-2',
    name: 'Zone B Terrain',
    elevationM: 11.2,
    slopePercent: 1.8,
    terrain: 'Moderate',
    polygon: [
      [22.572, 88.365],
      [22.558, 88.365],
      [22.558, 88.378],
      [22.572, 88.378],
      [22.572, 88.365],
    ],
  },

  {
    id: 'terrain-3',
    name: 'Zone C Terrain',
    elevationM: 6.8,
    slopePercent: 0.9,
    terrain: 'Low-lying',
    polygon: [
      [22.565, 88.380],
      [22.555, 88.380],
      [22.555, 88.392],
      [22.565, 88.392],
      [22.565, 88.380],
    ],
  },
];


/* =========================
   IMPERVIOUSNESS DATA
========================= */

export const imperviousZones: ImperviousZone[] = [
  {
    id: 'impervious-1',
    name: 'Commercial Area',
    imperviousnessPercent: 94,
    runoffPotential: 'Very High',
    polygon: [
      [22.580, 88.350],
      [22.570, 88.350],
      [22.570, 88.365],
      [22.580, 88.365],
      [22.580, 88.350],
    ],
  },

  {
    id: 'impervious-2',
    name: 'Urban Residential Area',
    imperviousnessPercent: 82,
    runoffPotential: 'High',
    polygon: [
      [22.570, 88.365],
      [22.560, 88.365],
      [22.560, 88.378],
      [22.570, 88.378],
      [22.570, 88.365],
    ],
  },

  {
    id: 'impervious-3',
    name: 'Mixed Surface Area',
    imperviousnessPercent: 61,
    runoffPotential: 'Moderate',
    polygon: [
      [22.560, 88.378],
      [22.550, 88.378],
      [22.550, 88.390],
      [22.560, 88.390],
      [22.560, 88.378],
    ],
  },
];


/* =========================
   DRAINAGE NETWORK
========================= */

export const drainagePipes: DrainagePipe[] = [
  {
    id: 'pipe-1',
    name: 'Main Drain A',
    capacityPercent: 96,
    flowPercent: 91,
    surchargeRiskPercent: 88,
    blockageRiskPercent: 74,
    status: 'Critical',
    coordinates: [
      [22.580, 88.350],
      [22.575, 88.360],
      [22.570, 88.370],
    ],
  },

  {
    id: 'pipe-2',
    name: 'Secondary Drain B',
    capacityPercent: 82,
    flowPercent: 70,
    surchargeRiskPercent: 67,
    blockageRiskPercent: 51,
    status: 'Overloaded',
    coordinates: [
      [22.570, 88.370],
      [22.565, 88.380],
      [22.560, 88.385],
    ],
  },

  {
    id: 'pipe-3',
    name: 'Drain C',
    capacityPercent: 45,
    flowPercent: 31,
    surchargeRiskPercent: 18,
    blockageRiskPercent: 12,
    status: 'Normal',
    coordinates: [
      [22.565, 88.350],
      [22.560, 88.360],
      [22.555, 88.370],
    ],
  },
];


export const drainageNodes: DrainageNode[] = [
  {
    id: 'node-1',
    name: 'Manhole A-01',
    type: 'Manhole',
    capacityPercent: 96,
    surchargeRiskPercent: 88,
    blockageRiskPercent: 74,
    status: 'Critical',
    coordinates: [22.575, 88.360],
  },

  {
    id: 'node-2',
    name: 'Inlet B-04',
    type: 'Inlet',
    capacityPercent: 82,
    surchargeRiskPercent: 67,
    blockageRiskPercent: 51,
    status: 'At Risk',
    coordinates: [22.565, 88.380],
  },

  {
    id: 'node-3',
    name: 'Manhole C-07',
    type: 'Manhole',
    capacityPercent: 45,
    surchargeRiskPercent: 18,
    blockageRiskPercent: 12,
    status: 'Normal',
    coordinates: [22.560, 88.360],
  },
];