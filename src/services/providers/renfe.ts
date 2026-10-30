import { Train, TrainFeedMetadata, ServiceCategory, ServiceType, TrainStatus } from '@/types/train';
import { CONFIG } from '@/lib/config';
import { isValidSpainCoordinate, calculateBearing, calculateSpeedKmH } from '@/lib/geo';
import { trainHistory } from '@/lib/cache';
import {
  TrainDataProvider,
  ProviderResult,
  GtfsRtVehicleEntity,
  GtfsRtTripUpdateEntity,
} from './types';

import { getStaticData } from '@/lib/staticData';

/**
 * Categorizes a Renfe service type into high-level radar categories.
 */
export function categorizeService(serviceType: string): ServiceCategory {
  const norm = serviceType.toUpperCase().trim();
  if (norm === 'AVE' || norm === 'AVLO' || norm === 'AVE INT') {
    return 'HIGH_SPEED';
  }
  if (norm === 'ALVIA' || norm === 'EUROMED' || norm === 'INTERCITY') {
    return 'LONG_DISTANCE';
  }
  if (norm === 'AVANT' || norm === 'AVANT EXP' || norm === 'MD' || norm === 'PROXIMDAD') {
    return 'MEDIUM_DISTANCE';
  }
  if (norm === 'REGIONAL' || norm === 'REG.EXP.' || norm === 'TRENCELTA') {
    return 'REGIONAL';
  }
  return 'OTHER';
}

/**
 * Normalizes service type to standard enum
 */
export function normalizeServiceType(stype: string): ServiceType {
  const norm = stype.toUpperCase().trim();
  if (norm === 'AVE') return 'AVE';
  if (norm === 'AVLO') return 'AVLO';
  if (norm === 'AVE INT') return 'AVE INT';
  if (norm === 'ALVIA') return 'ALVIA';
  if (norm === 'EUROMED') return 'EUROMED';
  if (norm === 'AVANT' || norm === 'AVANT EXP') return 'AVANT';
  if (norm === 'INTERCITY') return 'INTERCITY';
  if (norm === 'MD') return 'MD';
  if (norm === 'REGIONAL') return 'REGIONAL';
  if (norm === 'REG.EXP.') return 'REG.EXP.';
  if (norm === 'PROXIMDAD') return 'PROXIMDAD';
  if (norm === 'TRENCELTA') return 'TRENCELTA';
  return 'DESCONOCIDO';
}

export class RenfeProvider implements TrainDataProvider {
  readonly id = 'renfe';
  readonly name = 'Renfe Operadora (AV, LD, MD)';

  async fetchTrains(): Promise<ProviderResult> {
    const startTime = Date.now();

    // 1. Fetch live vehicle positions and trip updates concurrently
    const [vpResponse, tuResponse] = await Promise.allSettled([
      fetch(CONFIG.renfe.vehiclePositionsUrl, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(CONFIG.renfe.requestTimeoutMs),
        next: { revalidate: 0 },
      }),
      fetch(CONFIG.renfe.tripUpdatesUrl, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(CONFIG.renfe.requestTimeoutMs),
        next: { revalidate: 0 },
      }),
    ]);

    if (vpResponse.status !== 'fulfilled' || !vpResponse.value.ok) {
      const err = vpResponse.status === 'rejected' ? vpResponse.reason : `HTTP ${vpResponse.value.status}`;
      throw new Error(`Error al conectar con el feed de posiciones de Renfe: ${err}`);
    }

    const vpJson = await vpResponse.value.json();
    const vpEntities: GtfsRtVehicleEntity[] = Array.isArray(vpJson?.entity) ? vpJson.entity : [];

    // Trip updates are optional / supplementary; if it fails, we still process positions
    let tuMap = new Map<string, GtfsRtTripUpdateEntity['tripUpdate']>();
    if (tuResponse.status === 'fulfilled' && tuResponse.value.ok) {
      try {
        const tuJson = await tuResponse.value.json();
        if (Array.isArray(tuJson?.entity)) {
          for (const item of tuJson.entity) {
            const tid = item?.tripUpdate?.trip?.tripId;
            if (tid) {
              tuMap.set(tid, item.tripUpdate);
            }
          }
        }
      } catch (e) {
        console.warn('Advertencia: No se pudieron parsear los trip updates de Renfe', e);
      }
    }

    const feedTimestampSec = Number(vpJson?.header?.timestamp) || Math.floor(Date.now() / 1000);
    const feedTimestampMs = feedTimestampSec * 1000;
    const nowMs = Date.now();

    const { stationsMap, routesMap, tripsMap } = getStaticData();
    const trains: Train[] = [];
    const seenTrainIds = new Set<string>();

    for (const entity of vpEntities) {
      const v = entity?.vehicle;
      if (!v) continue;

      const pos = v.position;
      if (!pos || typeof pos.latitude !== 'number' || typeof pos.longitude !== 'number') {
        continue;
      }

      const lat = pos.latitude;
      const lon = pos.longitude;

      // Validate coordinates are within geographical Spain
      if (!isValidSpainCoordinate(lat, lon)) {
        continue;
      }

      const trainNumber = v.vehicle?.id || v.vehicle?.label || entity.id.replace('VP_', '');
      const trainKey = `RENFE_${trainNumber}`;

      // Deduplicate
      if (seenTrainIds.has(trainKey)) {
        continue;
      }
      seenTrainIds.add(trainKey);

      const tripId = v.trip?.tripId;
      const staticTrip = tripId ? tripsMap[tripId] : undefined;
      const routeId = staticTrip?.routeId;
      const staticRoute = routeId ? routesMap[routeId] : undefined;

      const rawServiceType = staticRoute?.serviceType || 'DESCONOCIDO';
      const serviceType = normalizeServiceType(rawServiceType);
      const serviceCategory = categorizeService(rawServiceType);

      // Station origin and destination
      const originStation = staticRoute?.originId
        ? {
            id: staticRoute.originId,
            name: staticRoute.originName || stationsMap[staticRoute.originId]?.name || `Estación ${staticRoute.originId}`,
            latitude: stationsMap[staticRoute.originId]?.lat ?? undefined,
            longitude: stationsMap[staticRoute.originId]?.lon ?? undefined,
          }
        : { id: '', name: 'Origen no especificado' };

      const destStation = staticRoute?.destId
        ? {
            id: staticRoute.destId,
            name: staticRoute.destName || stationsMap[staticRoute.destId]?.name || `Estación ${staticRoute.destId}`,
            latitude: stationsMap[staticRoute.destId]?.lat ?? undefined,
            longitude: stationsMap[staticRoute.destId]?.lon ?? undefined,
          }
        : { id: '', name: 'Destino no especificado' };

      // Status
      const rawStatus = v.currentStatus || 'UNKNOWN';
      let currentStatus: TrainStatus = 'UNKNOWN';
      if (rawStatus === 'IN_TRANSIT_TO') currentStatus = 'IN_TRANSIT_TO';
      else if (rawStatus === 'STOPPED_AT') currentStatus = 'STOPPED_AT';

      // Next Stop
      const stopId = v.stopId;
      let nextStopStation = stopId ? stationsMap[stopId] : undefined;
      let nextStopName = nextStopStation?.name || (stopId ? `Estación ${stopId}` : undefined);

      // Trip update matching
      let delayMinutes: number | null = null;
      let scheduledArrival: string | undefined;
      let estimatedArrival: string | undefined;
      let delaySeconds: number | undefined;

      const tu = tripId ? tuMap.get(tripId) : undefined;
      if (tu) {
        if (typeof tu.delay === 'number') {
          delaySeconds = tu.delay;
          delayMinutes = Math.round(tu.delay / 60);
        }

        // Look for stop time update for next stop or active stop
        if (Array.isArray(tu.stopTimeUpdate) && tu.stopTimeUpdate.length > 0) {
          const matchingStop = stopId
            ? tu.stopTimeUpdate.find((s) => s.stopId === stopId)
            : tu.stopTimeUpdate.find((s) => s.scheduleRelationship !== 'SKIPPED');

          if (matchingStop) {
            if (!nextStopName && matchingStop.stopId) {
              const st = stationsMap[matchingStop.stopId];
              nextStopName = st?.name || `Estación ${matchingStop.stopId}`;
            }
            if (matchingStop.arrival?.time) {
              const arrivalEpoch = Number(matchingStop.arrival.time) * 1000;
              if (!isNaN(arrivalEpoch)) {
                estimatedArrival = new Date(arrivalEpoch).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
              }
            }
          }
        }
      }

      // Calculate Bearing and Speed
      let bearing = 0;
      let speedKmH: number | undefined;

      const prev = trainHistory.get(trainKey);
      if (prev && prev.lat !== lat && prev.lon !== lon) {
        const timeDiffSec = (nowMs - prev.timestamp) / 1000;
        if (timeDiffSec > 5 && timeDiffSec < 300) {
          bearing = Math.round(calculateBearing(prev.lat, prev.lon, lat, lon));
          speedKmH = calculateSpeedKmH(prev.lat, prev.lon, lat, lon, timeDiffSec);
        }
      }

      // If no historical bearing and next stop is known with coords, point towards next station
      if (bearing === 0 && nextStopStation?.lat && nextStopStation?.lon) {
        bearing = Math.round(calculateBearing(lat, lon, nextStopStation.lat, nextStopStation.lon));
      }

      // Store current point in history
      trainHistory.set(trainKey, { lat, lon, timestamp: nowMs });

      // Stale check (e.g. feed timestamp is older than threshold)
      const ageSeconds = (nowMs - feedTimestampMs) / 1000;
      const isStale = ageSeconds > CONFIG.cache.staleThresholdMinutes * 60;

      trains.push({
        id: trainKey,
        trainNumber,
        tripId,
        operator: 'Renfe',
        serviceType,
        serviceCategory,
        commercialName: `${serviceType !== 'DESCONOCIDO' ? serviceType : 'Tren'} ${trainNumber}`,
        origin: originStation,
        destination: destStation,
        position: {
          latitude: lat,
          longitude: lon,
          bearing,
          speedKmH,
        },
        currentStatus,
        nextStop: nextStopName
          ? {
              id: stopId || '',
              name: nextStopName,
              scheduledArrival,
              estimatedArrival,
              delaySeconds,
            }
          : undefined,
        delayMinutes,
        timestamp: feedTimestampMs,
        isStale,
      });
    }

    const highSpeedCount = trains.filter((t) => t.serviceCategory === 'HIGH_SPEED').length;

    const metadata: TrainFeedMetadata = {
      provider: this.name,
      sourceUrl: CONFIG.renfe.openDataPortalUrl,
      lastFetch: new Date().toISOString(),
      totalTrains: trains.length,
      activeTrains: trains.filter((t) => t.currentStatus === 'IN_TRANSIT_TO').length,
      highSpeedTrains: highSpeedCount,
      timestamp: feedTimestampMs,
      status: 'ONLINE',
    };

    return { trains, metadata };
  }
}

