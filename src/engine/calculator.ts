import type { Route, Vehicle, Location, AppSettings } from '../types';
import { getDistance } from './haversine';

/**
 * Calculate route cost/time/distance metrics from stops.
 */
export function calculateRouteMetrics(
  route: Omit<Route, 'totalDistance' | 'totalTime' | 'totalCost' | 'loadUtilized' | 'deliveries' | 'efficiency'>,
  vehicle: Vehicle,
  locations: Location[],
  settings: AppSettings,
  distanceMatrix: Map<string, Map<string, number>>
): Route {
  const locMap = new Map(locations.map(l => [l.id, l]));
  const stops = route.stops;

  let totalDistance = 0;
  let loadUtilized = 0;
  let deliveries = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i].locationId;
    const to = stops[i + 1].locationId;
    totalDistance += getDistance(distanceMatrix, from, to);
  }

  for (const stop of stops) {
    const loc = locMap.get(stop.locationId);
    if (loc && !loc.isDepot) {
      loadUtilized += loc.demand;
      deliveries++;
    }
  }

  const totalTime = (totalDistance / settings.averageSpeed) * 60 + deliveries * 10; // +10 min per stop
  const totalCost = totalDistance * vehicle.costPerKm;
  const efficiency = vehicle.capacity > 0 ? Math.min(100, (loadUtilized / vehicle.capacity) * 100) : 0;

  return {
    ...route,
    totalDistance,
    totalTime,
    totalCost,
    loadUtilized,
    deliveries,
    efficiency,
  };
}

/**
 * Calculate total cost across all routes using the QUBO-inspired objective.
 */
export function calculateTotalScore(
  routes: Route[],
  settings: AppSettings
): number {
  const totalDist = routes.reduce((s, r) => s + r.totalDistance, 0);
  const totalTime = routes.reduce((s, r) => s + r.totalTime, 0);
  const totalCost = routes.reduce((s, r) => s + r.totalCost, 0);

  // Normalise each dimension roughly
  const normDist = totalDist / 100;
  const normTime = totalTime / 600;
  const normCost = totalCost / 5000;

  return (
    normDist * settings.distanceWeight +
    normTime * settings.timeWeight +
    normCost * settings.costWeight
  );
}

export function sumRoutes(routes: Route[]) {
  return {
    totalDistance: routes.reduce((s, r) => s + r.totalDistance, 0),
    totalTime: routes.reduce((s, r) => s + r.totalTime, 0),
    totalCost: routes.reduce((s, r) => s + r.totalCost, 0),
    deliveries: routes.reduce((s, r) => s + r.deliveries, 0),
  };
}
