import fs from 'fs';
import path from 'path';

export interface StaticStation {
  name: string;
  lat: number | null;
  lon: number | null;
}

export interface StaticRoute {
  serviceType: string;
  originId: string;
  destId: string;
  originName: string;
  destName: string;
}

export interface StaticTrip {
  routeId: string;
  trainNumber: string;
}

let cachedStations: Record<string, StaticStation> | null = null;
let cachedRoutes: Record<string, StaticRoute> | null = null;
let cachedTrips: Record<string, StaticTrip> | null = null;

export function getStaticData(): {
  stationsMap: Record<string, StaticStation>;
  routesMap: Record<string, StaticRoute>;
  tripsMap: Record<string, StaticTrip>;
} {
  if (!cachedStations || !cachedRoutes || !cachedTrips) {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    try {
      cachedStations = JSON.parse(fs.readFileSync(path.join(dataDir, 'stations.json'), 'utf-8'));
      cachedRoutes = JSON.parse(fs.readFileSync(path.join(dataDir, 'routes.json'), 'utf-8'));
      cachedTrips = JSON.parse(fs.readFileSync(path.join(dataDir, 'trips.json'), 'utf-8'));
    } catch (err) {
      console.error('Error al cargar datos estáticos de Renfe:', err);
      cachedStations = cachedStations || {};
      cachedRoutes = cachedRoutes || {};
      cachedTrips = cachedTrips || {};
    }
  }

  return {
    stationsMap: cachedStations || {},
    routesMap: cachedRoutes || {},
    tripsMap: cachedTrips || {},
  };
}
