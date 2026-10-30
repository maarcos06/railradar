import { describe, it, expect } from 'vitest';
import { 
  isValidSpainCoordinate, 
  calculateBearing, 
  calculateDistanceKm, 
  calculateSpeedKmH 
} from '../src/lib/geo';

describe('Geospatial Utilities (geo.ts)', () => {
  it('validates correct coordinates within Spain', () => {
    // Madrid Puerta de Atocha
    expect(isValidSpainCoordinate(40.4065, -3.6903)).toBe(true);
    // Barcelona Sants
    expect(isValidSpainCoordinate(41.3790, 2.1402)).toBe(true);
    // Sevilla Santa Justa
    expect(isValidSpainCoordinate(37.3920, -5.9754)).toBe(true);
    // Valencia Joaquín Sorolla
    expect(isValidSpainCoordinate(39.4588, -0.3807)).toBe(true);
    // Santa Cruz de Tenerife (Canarias)
    expect(isValidSpainCoordinate(28.4636, -16.2518)).toBe(true);
  });

  it('rejects invalid, null, or out-of-Spain coordinates', () => {
    // Null island
    expect(isValidSpainCoordinate(0, 0)).toBe(false);
    // New York
    expect(isValidSpainCoordinate(40.7128, -74.0060)).toBe(false);
    // Tokyo
    expect(isValidSpainCoordinate(35.6762, 139.6503)).toBe(false);
    // London
    expect(isValidSpainCoordinate(51.5074, -0.1278)).toBe(false);
    // NaN / Infinity
    expect(isValidSpainCoordinate(NaN, -3.7)).toBe(false);
    expect(isValidSpainCoordinate(40.4, Infinity)).toBe(false);
  });

  it('calculates geographic bearing correctly', () => {
    // Due North
    const bearingNorth = calculateBearing(40.0, 0.0, 41.0, 0.0);
    expect(Math.round(bearingNorth)).toBe(0);

    // Due East
    const bearingEast = calculateBearing(40.0, 0.0, 40.0, 1.0);
    expect(Math.round(bearingEast)).toBe(90);

    // Due South
    const bearingSouth = calculateBearing(40.0, 0.0, 39.0, 0.0);
    expect(Math.round(bearingSouth)).toBe(180);

    // Due West
    const bearingWest = calculateBearing(40.0, 0.0, 40.0, -1.0);
    expect(Math.round(bearingWest)).toBe(270);
  });

  it('calculates great-circle distance accurately', () => {
    // Madrid (40.4168, -3.7038) to Barcelona (41.3851, 2.1734) is ~505 km
    const dist = calculateDistanceKm(40.4168, -3.7038, 41.3851, 2.1734);
    expect(dist).toBeGreaterThan(495);
    expect(dist).toBeLessThan(515);
  });

  it('calculates speed in km/h with clamp limit', () => {
    // Moving 10 km in 120 seconds (2 mins) = 300 km/h
    // 10 km ~ 0.09 degrees latitude
    const speed = calculateSpeedKmH(40.0, 0.0, 40.09, 0.0, 120);
    expect(speed).toBeGreaterThan(280);
    expect(speed).toBeLessThan(320);

    // Speed clamped to 350 km/h maximum
    const extremeSpeed = calculateSpeedKmH(40.0, 0.0, 42.0, 0.0, 10);
    expect(extremeSpeed).toBeLessThanOrEqual(350);
  });
});

