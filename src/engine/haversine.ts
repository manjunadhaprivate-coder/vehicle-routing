/**
 * Haversine formula: calculates the great-circle distance between two
 * geographic coordinates (in kilometres).
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Build a distance matrix between all locations.
 */
export function buildDistanceMatrix(
  coords: Array<{ id: string; lat: number; lng: number }>
): Map<string, Map<string, number>> {
  const matrix = new Map<string, Map<string, number>>();
  for (const a of coords) {
    const row = new Map<string, number>();
    for (const b of coords) {
      if (a.id === b.id) {
        row.set(b.id, 0);
      } else {
        row.set(b.id, haversineDistance(a.lat, a.lng, b.lat, b.lng));
      }
    }
    matrix.set(a.id, row);
  }
  return matrix;
}

export function getDistance(
  matrix: Map<string, Map<string, number>>,
  fromId: string,
  toId: string
): number {
  return matrix.get(fromId)?.get(toId) ?? 0;
}
