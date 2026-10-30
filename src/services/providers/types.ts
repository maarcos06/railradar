import { Train, TrainFeedMetadata } from '@/types/train';

export interface ProviderResult {
  trains: Train[];
  metadata: TrainFeedMetadata;
}

export interface TrainDataProvider {
  readonly id: string;
  readonly name: string;
  fetchTrains(): Promise<ProviderResult>;
}

// Renfe GTFS-RT raw schemas
export interface GtfsRtHeader {
  gtfsRealtimeVersion: string;
  timestamp: string;
}

export interface GtfsRtVehicleEntity {
  id: string;
  vehicle: {
    trip?: {
      tripId?: string;
      routeId?: string;
      startDate?: string;
    };
    position?: {
      latitude: number;
      longitude: number;
      bearing?: number;
      speed?: number;
    };
    currentStatus?: 'IN_TRANSIT_TO' | 'STOPPED_AT' | string;
    stopId?: string;
    vehicle?: {
      id?: string;
      label?: string;
    };
    timestamp?: string;
  };
}

export interface GtfsRtStopTimeUpdate {
  stopId: string;
  arrival?: {
    delay?: number;
    time?: string;
  };
  departure?: {
    delay?: number;
    time?: string;
  };
  scheduleRelationship?: string;
}

export interface GtfsRtTripUpdateEntity {
  id: string;
  tripUpdate: {
    trip: {
      tripId: string;
      scheduleRelationship?: string;
    };
    stopTimeUpdate?: GtfsRtStopTimeUpdate[];
    delay?: number;
    timestamp?: string;
  };
}

