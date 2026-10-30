import { TrainsApiResponse, TrainFeedMetadata, Train } from '@/types/train';
import { CONFIG } from '@/lib/config';
import { cache } from '@/lib/cache';
import { RenfeProvider } from './providers/renfe';
import { TrainDataProvider } from './providers/types';

export class TrainService {
  private providers: TrainDataProvider[] = [new RenfeProvider()];

  /**
   * Retrieves all trains across configured providers with caching and fallback.
   */
  async getAllTrains(): Promise<TrainsApiResponse> {
    const cacheKey = 'trains_feed_all';
    const cached = cache.get<TrainsApiResponse>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // Execute providers in parallel
      const results = await Promise.allSettled(
        this.providers.map((p) => p.fetchTrains())
      );

      const allTrains: Train[] = [];
      let totalHighSpeed = 0;
      let totalActive = 0;
      let latestTimestamp = 0;
      const providerNames: string[] = [];

      for (const res of results) {
        if (res.status === 'fulfilled') {
          const { trains, metadata } = res.value;
          allTrains.push(...trains);
          totalHighSpeed += metadata.highSpeedTrains;
          totalActive += metadata.activeTrains;
          if (metadata.timestamp > latestTimestamp) {
            latestTimestamp = metadata.timestamp;
          }
          providerNames.push(metadata.provider);
        } else {
          console.error('Provider fetch failed:', res.reason);
        }
      }

      if (allTrains.length === 0) {
        // Check if we have stale data in cache to serve as fallback
        const stale = cache.getEvenIfStale<TrainsApiResponse>(cacheKey);
        if (stale) {
          return {
            ...stale.data,
            meta: {
              ...stale.data.meta,
              status: 'DEGRADED',
              message: 'Mostrando últimas posiciones conocidas (la fuente de datos no responde temporalmente).',
            },
          };
        }

        return {
          success: false,
          meta: {
            provider: 'Renfe Data',
            sourceUrl: CONFIG.renfe.openDataPortalUrl,
            lastFetch: new Date().toISOString(),
            totalTrains: 0,
            activeTrains: 0,
            highSpeedTrains: 0,
            timestamp: Date.now(),
            status: 'OFFLINE',
            message: 'La fuente oficial de Renfe Data no está disponible en este momento. Reintentando...',
          },
          trains: [],
        };
      }

      const response: TrainsApiResponse = {
        success: true,
        meta: {
          provider: providerNames.join(', '),
          sourceUrl: CONFIG.renfe.openDataPortalUrl,
          lastFetch: new Date().toISOString(),
          totalTrains: allTrains.length,
          activeTrains: totalActive,
          highSpeedTrains: totalHighSpeed,
          timestamp: latestTimestamp || Date.now(),
          status: 'ONLINE',
        },
        trains: allTrains,
      };

      // Store in memory cache for TTL
      cache.set(cacheKey, response, CONFIG.cache.trainsTtlSeconds);

      return response;
    } catch (error) {
      console.error('Error in TrainService.getAllTrains:', error);

      // Attempt stale fallback
      const stale = cache.getEvenIfStale<TrainsApiResponse>(cacheKey);
      if (stale) {
        return {
          ...stale.data,
          meta: {
            ...stale.data.meta,
            status: 'DEGRADED',
            message: 'Datos en modo degradado debido a un error de conexión.',
          },
        };
      }

      return {
        success: false,
        meta: {
          provider: 'Renfe Data',
          sourceUrl: CONFIG.renfe.openDataPortalUrl,
          lastFetch: new Date().toISOString(),
          totalTrains: 0,
          activeTrains: 0,
          highSpeedTrains: 0,
          timestamp: Date.now(),
          status: 'OFFLINE',
          message: error instanceof Error ? error.message : 'Error desconocido al procesar datos ferroviarios.',
        },
        trains: [],
      };
    }
  }
}

export const trainService = new TrainService();

