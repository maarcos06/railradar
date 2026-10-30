'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Train, TrainsApiResponse, TrainFeedMetadata } from '@/types/train';
import { CONFIG } from '@/lib/config';

export function useTrains() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [meta, setMeta] = useState<TrainFeedMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  const isFetchingRef = useRef(false);

  const fetchTrains = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isInitial) {
      setLoading(true);
    }

    try {
      const res = await fetch('/api/trains');
      if (!res.ok && res.status !== 503) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      const data: TrainsApiResponse = await res.json();

      setMeta(data.meta);

      if (data.success && Array.isArray(data.trains)) {
        setTrains(data.trains);
        setError(null);
      } else if (data.meta?.status === 'DEGRADED' && data.trains?.length > 0) {
        setTrains(data.trains);
        setError(data.meta.message || 'Datos en modo degradado');
      } else {
        setError(data.meta?.message || 'No se han podido obtener trenes en tiempo real.');
      }

      setLastFetchTime(Date.now());
      setSecondsAgo(0);
    } catch (err) {
      console.error('Fetch trains error:', err);
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial fetch and polling every 15 seconds
  useEffect(() => {
    fetchTrains(true);

    const intervalId = setInterval(() => {
      fetchTrains(false);
    }, CONFIG.renfe.pollIntervalSeconds * 1000);

    return () => clearInterval(intervalId);
  }, [fetchTrains]);

  // Seconds ago timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastFetchTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [lastFetchTime]);

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || null;

  return {
    trains,
    meta,
    loading,
    error,
    selectedTrainId,
    selectedTrain,
    setSelectedTrainId,
    refetch: () => fetchTrains(false),
    secondsAgo,
  };
}

