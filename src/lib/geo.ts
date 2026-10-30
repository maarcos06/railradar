/**
 * Geospatial utility functions for calculating distances, bearings, and validating coordinates.
 */

const TO_RAD = Math.PI / 180;
const TO_DEG = 180 / Math.PI;

/**
 * Validates that latitude and longitude are valid numbers and inside the broad Iberian / Canarian / Balearic territory.
 */
export function isValidSpainCoordinate(lat: number, lon: number): boolean {
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    return false;
  }
  // Spain bounding box: Lat ~ 27.0 (Canarias) to 44.5 (Galicia/Cantabria), Lon ~ -18.5 (Canarias/Hierro) to 4.5 (Menorca)
  return lat >= 27.0 && lat <= 44.5 && lon >= -18.5 && lon <= 4.5;
}

/**
 * Calculates the forward azimuth / initial bearing between two geographic points in degrees (0 - 360).
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const phi1 = lat1 * TO_RAD;
  const phi2 = lat2 * TO_RAD;
  const deltaLambda = (lon2 - lon1) * TO_RAD;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  let theta = Math.atan2(y, x) * TO_DEG;
  return (theta + 360) % 360;
}

/**
 * Calculates the great-circle distance between two points in kilometers (Haversine formula).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * TO_RAD;
  const dLon = (lon2 - lon1) * TO_RAD;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * TO_RAD) *
      Math.cos(lat2 * TO_RAD) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates speed in km/h given two positions and the elapsed time in seconds.
 */
export function calculateSpeedKmH(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  timeDiffSeconds: number
): number {
  if (timeDiffSeconds <= 0) return 0;
  const distKm = calculateDistanceKm(lat1, lon1, lat2, lon2);
  const hours = timeDiffSeconds / 3600;
  const speed = distKm / hours;
  // Sanity clamp: Trains in Spain don't exceed 350 km/h in regular operation
  return Math.min(Math.round(speed), 350);
}

