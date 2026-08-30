export interface FloodLayer {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export const floodLayers: FloodLayer[] = [
  {
    id: 'flood-risk',
    name: 'Flood Risk',
    description: 'Predicted street-level flood risk',
    enabled: true,
  },

  {
    id: 'rainfall',
    name: 'Rainfall',
    description: 'Real-time and forecast rainfall',
    enabled: true,
  },

  {
    id: 'dem',
    name: 'Terrain / DEM',
    description: 'Elevation, slope and terrain',
    enabled: false,
  },

  {
    id: 'imperviousness',
    name: 'Imperviousness',
    description: 'Concrete, asphalt and runoff behaviour',
    enabled: false,
  },

  {
    id: 'drainage',
    name: 'Drainage Network',
    description: 'Manholes, inlets, pipes and canals',
    enabled: false,
  },

  {
    id: 'roads',
    name: 'Roads / Intersections',
    description: 'Road and intersection flood status',
    enabled: true,
  },

  {
    id: 'hospitals',
    name: 'Hospitals',
    description: 'Hospitals at flood risk',
    enabled: true,
  },

  {
    id: 'police',
    name: 'Police Stations',
    description: 'Police stations at flood risk',
    enabled: false,
  },

  {
    id: 'fire',
    name: 'Fire Stations',
    description: 'Fire stations at flood risk',
    enabled: false,
  },

  {
    id: 'schools',
    name: 'Schools',
    description: 'Schools at flood risk',
    enabled: false,
  },

  {
    id: 'shelters',
    name: 'Emergency Shelters',
    description: 'Available emergency shelters',
    enabled: false,
  },
];