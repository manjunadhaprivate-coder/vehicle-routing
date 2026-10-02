import type { Vehicle, Location, Route, AppSettings } from '../types';
import { buildDistanceMatrix, getDistance } from './haversine';
import { calculateRouteMetrics } from './calculator';

/**
 * Nearest-Neighbor Heuristic Baseline VRP solver.
 * Assigns deliveries to vehicles greedily based on proximity and capacity.
 */
export function solveBaseline(
  vehicles: Vehicle[],
  locations: Location[],
  settings: AppSettings
): Route[] {
  const depotId = settings.depotId;
  const deliveryLocs = locations.filter(l => !l.isDepot);
  const distanceMatrix = buildDistanceMatrix(locations);

  // Sort by priority (Urgent > High > Medium > Low)
  const priorityOrder: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
  const sortedDeliveries = [...deliveryLocs].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const routes: Route[] = [];
  const unassigned = new Set(sortedDeliveries.map(l => l.id));

  for (const vehicle of vehicles) {
    if (unassigned.size === 0) break;

    const stops = [{ locationId: depotId }];
    let currentLocationId = depotId;
    let remainingCapacity = vehicle.capacity;
    let totalDist = 0;

    while (unassigned.size > 0) {
      // Find nearest unvisited that fits in capacity
      let bestId: string | null = null;
      let bestDist = Infinity;

      for (const locId of unassigned) {
        const loc = locations.find(l => l.id === locId)!;
        if (loc.demand > remainingCapacity) continue;
        const d = getDistance(distanceMatrix, currentLocationId, locId);
        if (d < bestDist) {
          bestDist = d;
          bestId = locId;
        }
      }

      if (!bestId) break; // no feasible delivery

      // Check max distance constraint
      const distToDepot = getDistance(distanceMatrix, bestId, depotId);
      if (totalDist + bestDist + distToDepot > vehicle.maxDistance) break;

      stops.push({ locationId: bestId });
      unassigned.delete(bestId);
      const loc = locations.find(l => l.id === bestId)!;
      remainingCapacity -= loc.demand;
      totalDist += bestDist;
      currentLocationId = bestId;
    }

    stops.push({ locationId: depotId }); // return to depot

    if (stops.length > 2) {
      const route = calculateRouteMetrics(
        { vehicleId: vehicle.id, stops },
        vehicle,
        locations,
        settings,
        distanceMatrix
      );
      routes.push(route);
    }
  }

  return routes;
}
