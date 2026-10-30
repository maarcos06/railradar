import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCache } from '../src/lib/cache';

describe('API Resilience and Cache Management', () => {
  let testCache: MemoryCache;

  beforeEach(() => {
    testCache = new MemoryCache();
  });

  it('stores and retrieves items within TTL', () => {
    testCache.set('sample_key', { value: 123 }, 10); // 10s TTL
    const item = testCache.get<{ value: number }>('sample_key');
    expect(item).not.toBeNull();
    expect(item?.value).toBe(123);
  });

  it('expires items after TTL is exceeded', async () => {
    // 0 second TTL for instant expiration
    testCache.set('expired_key', { value: 'old' }, -1);
    const freshItem = testCache.get('expired_key');
    expect(freshItem).toBeNull();

    // getEvenIfStale retrieves expired item for graceful degradation
    const staleItem = testCache.getEvenIfStale<{ value: string }>('expired_key');
    expect(staleItem).not.toBeNull();
    expect(staleItem?.isStale).toBe(true);
    expect(staleItem?.data.value).toBe('old');
  });

  it('cleans up cache entries on delete and clear', () => {
    testCache.set('k1', 'v1', 60);
    testCache.set('k2', 'v2', 60);
    testCache.delete('k1');

    expect(testCache.get('k1')).toBeNull();
    expect(testCache.get('k2')).toBe('v2');

    testCache.clear();
    expect(testCache.get('k2')).toBeNull();
  });
});

