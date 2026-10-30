'use client';

import { useState, useMemo } from 'react';
import { Train, ServiceCategory, ServiceType } from '@/types/train';

export interface FilterState {
  searchQuery: string;
  category: ServiceCategory;
  operator: string;
  serviceTypes: ServiceType[];
  onlyMoving: boolean;
  onlyDelayed: boolean;
}

export const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'ALL',
  operator: 'ALL',
  serviceTypes: [],
  onlyMoving: false,
  onlyDelayed: false,
};

export function useTrainFilters(trains: Train[]) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const filteredTrains = useMemo(() => {
    return trains.filter((t) => {
      // 1. Text Search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesNumber = t.trainNumber.toLowerCase().includes(query);
        const matchesName = t.commercialName.toLowerCase().includes(query);
        const matchesOrigin = t.origin.name.toLowerCase().includes(query);
        const matchesDest = t.destination.name.toLowerCase().includes(query);
        const matchesNext = t.nextStop?.name ? t.nextStop.name.toLowerCase().includes(query) : false;

        if (!matchesNumber && !matchesName && !matchesOrigin && !matchesDest && !matchesNext) {
          return false;
        }
      }

      // 2. Category Filter
      if (filters.category !== 'ALL' && t.serviceCategory !== filters.category) {
        return false;
      }

      // 3. Operator Filter
      if (filters.operator !== 'ALL' && t.operator !== filters.operator) {
        return false;
      }

      // 4. Service Type multi-select (if any selected)
      if (filters.serviceTypes.length > 0 && !filters.serviceTypes.includes(t.serviceType)) {
        return false;
      }

      // 5. Only Moving Filter
      if (filters.onlyMoving && t.currentStatus !== 'IN_TRANSIT_TO') {
        return false;
      }

      // 6. Only Delayed Filter
      if (filters.onlyDelayed && (!t.delayMinutes || t.delayMinutes <= 0)) {
        return false;
      }

      return true;
    });
  }, [trains, filters]);

  // Compute category statistics
  const stats = useMemo(() => {
    return {
      total: trains.length,
      highSpeed: trains.filter((t) => t.serviceCategory === 'HIGH_SPEED').length,
      longDistance: trains.filter((t) => t.serviceCategory === 'LONG_DISTANCE').length,
      mediumDistance: trains.filter((t) => t.serviceCategory === 'MEDIUM_DISTANCE').length,
      regional: trains.filter((t) => t.serviceCategory === 'REGIONAL').length,
      moving: trains.filter((t) => t.currentStatus === 'IN_TRANSIT_TO').length,
      stopped: trains.filter((t) => t.currentStatus === 'STOPPED_AT').length,
      delayed: trains.filter((t) => t.delayMinutes !== null && t.delayMinutes > 0).length,
    };
  }, [trains]);

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return {
    filters,
    setFilters,
    filteredTrains,
    stats,
    resetFilters,
  };
}

