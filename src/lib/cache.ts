/**
 * In-memory cache for provider feeds and historical position tracking.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      return null;
    }
    return entry.data as T;
  }

  getEvenIfStale<T>(key: string): { data: T; isStale: boolean } | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    return {
      data: entry.data as T,
      isStale: Date.now() > entry.expiresAt,
    };
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance across API route executions
declare global {
  // eslint-disable-next-line no-var
  var __railradarCache: MemoryCache | undefined;
  // eslint-disable-next-line no-var
  var __railradarTrainHistory: Map<string, { lat: number; lon: number; timestamp: number }> | undefined;
}

export const cache = globalThis.__railradarCache ?? new MemoryCache();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__railradarCache = cache;
}

export const trainHistory = globalThis.__railradarTrainHistory ?? new Map<string, { lat: number; lon: number; timestamp: number }>();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__railradarTrainHistory = trainHistory;
}

