export type ServiceCategory = 
  | 'ALL'
  | 'HIGH_SPEED'      // AVE, AVLO, AVE INT
  | 'LONG_DISTANCE'   // ALVIA, EUROMED, INTERCITY
  | 'MEDIUM_DISTANCE' // AVANT, MD, PROXIMIDAD
  | 'REGIONAL'        // REGIONAL, REG.EXP., TRENCELTA
  | 'OTHER';

export type ServiceType =
  | 'AVE'
  | 'AVLO'
  | 'AVE INT'
  | 'ALVIA'
  | 'EUROMED'
  | 'AVANT'
  | 'INTERCITY'
  | 'MD'
  | 'REGIONAL'
  | 'REG.EXP.'
  | 'PROXIMDAD'
  | 'TRENCELTA'
  | 'DESCONOCIDO';

export type TrainStatus = 'IN_TRANSIT_TO' | 'STOPPED_AT' | 'SCHEDULED' | 'UNKNOWN';

export interface TrainStation {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
}

export interface NextStopInfo {
  id: string;
  name: string;
  scheduledArrival?: string;
  estimatedArrival?: string;
  delaySeconds?: number;
}

export interface TrainPosition {
  latitude: number;
  longitude: number;
  bearing: number; // 0 - 360 degrees
  speedKmH?: number;
}

export interface Train {
  id: string;                  // Unique key, e.g. "VP_05152"
  trainNumber: string;         // E.g. "05152"
  tripId?: string;             // E.g. "0515212026-10-29"
  operator: string;            // E.g. "Renfe"
  serviceType: ServiceType;    // E.g. "AVE", "ALVIA"
  serviceCategory: ServiceCategory; // E.g. "HIGH_SPEED"
  commercialName: string;      // E.g. "AVE 05152"
  origin: TrainStation;
  destination: TrainStation;
  position: TrainPosition;
  currentStatus: TrainStatus;
  nextStop?: NextStopInfo;
  delayMinutes: number | null;
  timestamp: number;           // Feed timestamp in ms
  isStale: boolean;            // Whether timestamp is > 2 min old
}

export interface TrainFeedMetadata {
  provider: string;
  sourceUrl: string;
  lastFetch: string;
  totalTrains: number;
  activeTrains: number;
  highSpeedTrains: number;
  timestamp: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  message?: string;
}

export interface TrainsApiResponse {
  success: boolean;
  meta: TrainFeedMetadata;
  trains: Train[];
}

export interface TrainFilters {
  searchQuery: string;
  operator: string;             // 'ALL' or 'Renfe', etc.
  category: ServiceCategory;
  serviceTypes: ServiceType[];  // multi-select
  onlyMoving: boolean;
  onlyDelayed: boolean;
}

