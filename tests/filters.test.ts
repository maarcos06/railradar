import { describe, it, expect } from 'vitest';
import { Train } from '../src/types/train';

// Mock test trains
const MOCK_TRAINS: Train[] = [
  {
    id: 'RENFE_05152',
    trainNumber: '05152',
    tripId: '0515212026-10-30',
    operator: 'Renfe',
    serviceType: 'AVE',
    serviceCategory: 'HIGH_SPEED',
    commercialName: 'AVE 05152',
    origin: { id: '17000', name: 'Madrid-Chamartín-Clara Campoamor' },
    destination: { id: '60911', name: 'Valencia Joaquín Sorolla' },
    position: { latitude: 39.5, longitude: -1.2, bearing: 110, speedKmH: 290 },
    currentStatus: 'IN_TRANSIT_TO',
    nextStop: { id: '60911', name: 'Valencia Joaquín Sorolla' },
    delayMinutes: 0,
    timestamp: Date.now(),
    isStale: false,
  },
  {
    id: 'RENFE_04142',
    trainNumber: '04142',
    tripId: '0414212026-10-30',
    operator: 'Renfe',
    serviceType: 'ALVIA',
    serviceCategory: 'LONG_DISTANCE',
    commercialName: 'ALVIA 04142',
    origin: { id: '14100', name: 'Santander' },
    destination: { id: '17000', name: 'Madrid-Chamartín-Clara Campoamor' },
    position: { latitude: 41.64, longitude: -4.72, bearing: 180, speedKmH: 150 },
    currentStatus: 'IN_TRANSIT_TO',
    nextStop: { id: '31400', name: 'Valladolid-Campo Grande' },
    delayMinutes: 12, // Delayed
    timestamp: Date.now(),
    isStale: false,
  },
  {
    id: 'RENFE_13014',
    trainNumber: '13014',
    tripId: '1301412026-10-30',
    operator: 'Renfe',
    serviceType: 'MD',
    serviceCategory: 'MEDIUM_DISTANCE',
    commercialName: 'MD 13014',
    origin: { id: '51203', name: 'Sevilla-Santa Justa' },
    destination: { id: '54413', name: 'Málaga María Zambrano' },
    position: { latitude: 37.28, longitude: -5.92, bearing: 90, speedKmH: 0 },
    currentStatus: 'STOPPED_AT', // Stopped
    nextStop: { id: '51203', name: 'Sevilla-Santa Justa' },
    delayMinutes: null,
    timestamp: Date.now(),
    isStale: false,
  },
];

describe('Train Filters Logic', () => {
  it('filters by train number', () => {
    const result = MOCK_TRAINS.filter(t => t.trainNumber.includes('05152'));
    expect(result.length).toBe(1);
    expect(result[0].trainNumber).toBe('05152');
  });

  it('filters by station name', () => {
    const result = MOCK_TRAINS.filter(
      t => t.origin.name.toLowerCase().includes('sevilla') || t.destination.name.toLowerCase().includes('sevilla')
    );
    expect(result.length).toBe(1);
    expect(result[0].trainNumber).toBe('13014');
  });

  it('filters by High Speed category', () => {
    const result = MOCK_TRAINS.filter(t => t.serviceCategory === 'HIGH_SPEED');
    expect(result.length).toBe(1);
    expect(result[0].serviceType).toBe('AVE');
  });

  it('filters only moving trains', () => {
    const result = MOCK_TRAINS.filter(t => t.currentStatus === 'IN_TRANSIT_TO');
    expect(result.length).toBe(2);
    expect(result.map(t => t.trainNumber)).toEqual(['05152', '04142']);
  });

  it('filters only delayed trains', () => {
    const result = MOCK_TRAINS.filter(t => t.delayMinutes !== null && t.delayMinutes > 0);
    expect(result.length).toBe(1);
    expect(result[0].trainNumber).toBe('04142');
    expect(result[0].delayMinutes).toBe(12);
  });
});

