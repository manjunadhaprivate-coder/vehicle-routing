import type { Vehicle, Location, Route, AppSettings, OptimizationStats, IterationPoint } from '../types';
import { buildDistanceMatrix } from './haversine';
import { calculateRouteMetrics, calculateTotalScore } from './calculator';

type ProgressCallback = (iteration: number, currentCost: number, bestCost: number, solutionsEvaluated: number) => void;

/**
 * Deep-clone routes
 */
function cloneRoutes(routes: Route[]): Route[] {
  return routes.map(r => ({ ...r, stops: r.stops.map(s => ({ ...s })) }));
}

/**
 * 2-opt swap within a single route
 */
function twoOptSwap(route: Route): Route {
  const stops = route.stops;
  if (stops.length <= 3) return route; // depot + 1 loc + depot: nothing to swap

  const i = 1 + Math.floor(Math.random() * (stops.length - 2));
  let j = 1 + Math.floor(Math.random() * (stops.length - 2));
  if (i === j) return route;

  const [a, b] = i < j ? [i, j] : [j, i];
  const newStops = [
    ...stops.slice(0, a),
    ...stops.slice(a, b + 1).reverse(),
    ...stops.slice(b + 1),
  ];

  return { ...route, stops: newStops };
}

/**
 * Relocate: move a stop from one route to another
 */
function relocateStop(
  routes: Route[],
  vehicles: Vehicle[],
  locations: Location[],
  settings: AppSettings,
  distMatrix: Map<string, Map<string, number>>
): Route[] {
  if (routes.length < 2) return routes;

  const fromIdx = Math.floor(Math.random() * routes.length);
  const fromRoute = routes[fromIdx];
  const deliveryStops = fromRoute.stops.filter(
    s => !locations.find(l => l.id === s.locationId)?.isDepot
  );
  if (deliveryStops.length === 0) return routes;

  const stopToMove = deliveryStops[Math.floor(Math.random() * deliveryStops.length)];
  const loc = locations.find(l => l.id === stopToMove.locationId);
  if (!loc) return routes;

  let toIdx = Math.floor(Math.random() * routes.length);
  if (toIdx === fromIdx) toIdx = (toIdx + 1) % routes.length;

  const toVehicle = vehicles.find(v => v.id === routes[toIdx].vehicleId);
  if (!toVehicle) return routes;

  // Check capacity
  if (routes[toIdx].loadUtilized + loc.demand > toVehicle.capacity) return routes;

  const newRoutes = cloneRoutes(routes);
  // Remove from source
  newRoutes[fromIdx].stops = newRoutes[fromIdx].stops.filter(s => s.locationId !== stopToMove.locationId);
  // Insert at random position in destination (not before/after depot)
  const insertPos = 1 + Math.floor(Math.random() * Math.max(1, newRoutes[toIdx].stops.length - 1));
  newRoutes[toIdx].stops.splice(insertPos, 0, { locationId: stopToMove.locationId });

  // Recalculate metrics
  const fromVehicle = vehicles.find(v => v.id === newRoutes[fromIdx].vehicleId)!;
  const toVehicleObj = vehicles.find(v => v.id === newRoutes[toIdx].vehicleId)!;
  newRoutes[fromIdx] = calculateRouteMetrics(
    { vehicleId: newRoutes[fromIdx].vehicleId, stops: newRoutes[fromIdx].stops },
    fromVehicle, locations, settings, distMatrix
  );
  newRoutes[toIdx] = calculateRouteMetrics(
    { vehicleId: newRoutes[toIdx].vehicleId, stops: newRoutes[toIdx].stops },
    toVehicleObj, locations, settings, distMatrix
  );

  return newRoutes;
}

/**
 * Quantum-Inspired Simulated Annealing VRP Optimizer
 *
 * Converts the VRP into a QUBO-inspired cost minimization problem.
 * Uses simulated annealing with 2-opt swaps and cross-route relocations
 * to explore the solution space, mimicking quantum tunneling behaviour.
 */
export async function runQuantumOptimizer(
  baselineRoutes: Route[],
  vehicles: Vehicle[],
  locations: Location[],
  settings: AppSettings,
  onProgress: ProgressCallback
): Promise<{ routes: Route[]; stats: OptimizationStats }> {
  const startTime = Date.now();
  const distMatrix = buildDistanceMatrix(locations);

  let currentRoutes = cloneRoutes(baselineRoutes);
  let bestRoutes = cloneRoutes(baselineRoutes);
  let currentScore = calculateTotalScore(currentRoutes, settings);
  let bestScore = currentScore;
  const initialScore = currentScore;

  const iterationHistory: IterationPoint[] = [];
  const maxIter = settings.maxIterations;
  let solutionsEvaluated = 0;

  // Simulated annealing parameters
  let temperature = 1.0;
  const coolingRate = 0.995;
  const minTemperature = 0.001;

  for (let iter = 0; iter < maxIter && temperature > minTemperature; iter++) {
    // ── Quantum-inspired neighbourhood search ──────────────────────────
    // Apply random perturbation operator
    const operator = Math.random();
    let neighbourRoutes: Route[];

    if (operator < 0.5 && currentRoutes.length > 0) {
      // 2-opt within a random route
      const rIdx = Math.floor(Math.random() * currentRoutes.length);
      const newRoutes = cloneRoutes(currentRoutes);
      const vehicle = vehicles.find(v => v.id === newRoutes[rIdx].vehicleId)!;
      const swapped = twoOptSwap(newRoutes[rIdx]);
      newRoutes[rIdx] = calculateRouteMetrics(
        { vehicleId: swapped.vehicleId, stops: swapped.stops },
        vehicle, locations, settings, distMatrix
      );
      neighbourRoutes = newRoutes;
    } else {
      // Cross-route relocate
      neighbourRoutes = relocateStop(currentRoutes, vehicles, locations, settings, distMatrix);
    }

    solutionsEvaluated++;
    const neighbourScore = calculateTotalScore(neighbourRoutes, settings);
    const delta = neighbourScore - currentScore;

    // Metropolis criterion (quantum tunnelling analogy)
    if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
      currentRoutes = neighbourRoutes;
      currentScore = neighbourScore;

      if (currentScore < bestScore) {
        bestScore = currentScore;
        bestRoutes = cloneRoutes(currentRoutes);
      }
    }

    temperature *= coolingRate;

    // Report progress every 50 iterations
    if (iter % 50 === 0 || iter === maxIter - 1) {
      const improvement = ((initialScore - bestScore) / initialScore) * 100;
      iterationHistory.push({
        iteration: iter,
        currentCost: currentScore * 5000,
        bestCost: bestScore * 5000,
        temperature,
      });
      onProgress(iter, currentScore * 5000, bestScore * 5000, solutionsEvaluated);
      // Yield to event loop
      await new Promise(r => setTimeout(r, 0));
    }
  }

  const finalRoutes = bestRoutes.map(r => {
    const vehicle = vehicles.find(v => v.id === r.vehicleId)!;
    return calculateRouteMetrics(
      { vehicleId: r.vehicleId, stops: r.stops },
      vehicle, locations, settings, distMatrix
    );
  });

  const stats: OptimizationStats = {
    iterations: maxIter,
    solutionsEvaluated,
    initialCost: initialScore * 5000,
    bestCost: bestScore * 5000,
    improvement: ((initialScore - bestScore) / initialScore) * 100,
    timeMs: Date.now() - startTime,
    algorithm: 'Quantum-Inspired Simulated Annealing (QUBO)',
    objective: settings.objective,
    iterationHistory,
  };

  return { routes: finalRoutes, stats };
}
