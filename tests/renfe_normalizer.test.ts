import { describe, it, expect } from 'vitest';
import { 
  categorizeService, 
  normalizeServiceType 
} from '../src/services/providers/renfe';
import { isValidSpainCoordinate } from '../src/lib/geo';

describe('Renfe Normalizer & Service Categorization', () => {
  it('correctly categorizes High Speed train types', () => {
    expect(categorizeService('AVE')).toBe('HIGH_SPEED');
    expect(categorizeService('ave')).toBe('HIGH_SPEED');
    expect(categorizeService('AVLO')).toBe('HIGH_SPEED');
    expect(categorizeService('AVE INT')).toBe('HIGH_SPEED');
  });

  it('correctly categorizes Long Distance train types', () => {
    expect(categorizeService('ALVIA')).toBe('LONG_DISTANCE');
    expect(categorizeService('EUROMED')).toBe('LONG_DISTANCE');
    expect(categorizeService('INTERCITY')).toBe('LONG_DISTANCE');
  });

  it('correctly categorizes Medium Distance and Regional train types', () => {
    expect(categorizeService('AVANT')).toBe('MEDIUM_DISTANCE');
    expect(categorizeService('MD')).toBe('MEDIUM_DISTANCE');
    expect(categorizeService('PROXIMDAD')).toBe('MEDIUM_DISTANCE');

    expect(categorizeService('REGIONAL')).toBe('REGIONAL');
    expect(categorizeService('REG.EXP.')).toBe('REGIONAL');
  });

  it('handles unknown or unexpected service names gracefully without inventing', () => {
    expect(categorizeService('CUSTOM_TRAIN')).toBe('OTHER');
    expect(normalizeServiceType('UNKNOWN_FOO')).toBe('DESCONOCIDO');
  });

  it('filters out duplicated vehicle records with duplicate IDs', () => {
    const rawEntities = [
      { id: 'VP_05152', vehicle: { vehicle: { id: '05152' }, position: { latitude: 38.88, longitude: -1.14 } } },
      { id: 'VP_05152', vehicle: { vehicle: { id: '05152' }, position: { latitude: 38.88, longitude: -1.14 } } }, // Duplicate
      { id: 'VP_05160', vehicle: { vehicle: { id: '05160' }, position: { latitude: 40.14, longitude: -3.70 } } },
    ];

    const seen = new Set<string>();
    const deduplicated = [];

    for (const item of rawEntities) {
      const trainId = item.vehicle.vehicle.id;
      if (!seen.has(trainId) && isValidSpainCoordinate(item.vehicle.position.latitude, item.vehicle.position.longitude)) {
        seen.add(trainId);
        deduplicated.push(item);
      }
    }

    expect(deduplicated.length).toBe(2);
    expect(deduplicated.map(d => d.vehicle.vehicle.id)).toEqual(['05152', '05160']);
  });
});

