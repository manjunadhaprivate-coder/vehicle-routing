import type { OptimizationResult, Vehicle, Location } from '../types';
import { formatKm, formatCost, formatTime } from './formatters';

export function exportCSV(result: OptimizationResult, vehicles: Vehicle[], locations: Location[]): void {
  const locMap = new Map(locations.map(l => [l.id, l]));
  const rows: string[] = [
    'Vehicle ID,Route,Total Distance (km),Total Time (min),Total Cost (₹),Deliveries,Load (kg),Efficiency (%)'
  ];

  for (const route of result.optimized) {
    const vehicle = vehicles.find(v => v.id === route.vehicleId);
    const routeStr = route.stops.map(s => locMap.get(s.locationId)?.name ?? s.locationId).join(' → ');
    rows.push(
      `${route.vehicleId},` +
      `"${routeStr}",` +
      `${route.totalDistance.toFixed(2)},` +
      `${route.totalTime.toFixed(0)},` +
      `${route.totalCost.toFixed(2)},` +
      `${route.deliveries},` +
      `${route.loadUtilized},` +
      `${route.efficiency.toFixed(1)}`
    );
  }

  downloadFile('optimized_routes.csv', rows.join('\n'), 'text/csv');
}

export function exportJSON(result: OptimizationResult, vehicles: Vehicle[], locations: Location[]): void {
  const data = {
    exportedAt: new Date().toISOString(),
    project: 'Quantum-Optimized Vehicle Routing System',
    stats: result.stats,
    baselineRoutes: result.baseline,
    optimizedRoutes: result.optimized,
    vehicles,
    locations,
  };
  downloadFile('optimization_result.json', JSON.stringify(data, null, 2), 'application/json');
}

export function exportReport(result: OptimizationResult, vehicles: Vehicle[], locations: Location[]): void {
  const locMap = new Map(locations.map(l => [l.id, l]));

  const baselineDist = result.baseline.reduce((s, r) => s + r.totalDistance, 0);
  const optimizedDist = result.optimized.reduce((s, r) => s + r.totalDistance, 0);
  const baselineCost = result.baseline.reduce((s, r) => s + r.totalCost, 0);
  const optimizedCost = result.optimized.reduce((s, r) => s + r.totalCost, 0);
  const baselineTime = result.baseline.reduce((s, r) => s + r.totalTime, 0);
  const optimizedTime = result.optimized.reduce((s, r) => s + r.totalTime, 0);

  const routeDetails = result.optimized.map(r => {
    const stops = r.stops.map(s => locMap.get(s.locationId)?.name ?? s.locationId).join('\n    → ');
    return `
Vehicle: ${r.vehicleId}
  Route: ${stops}
  Distance: ${formatKm(r.totalDistance)}  |  Time: ${formatTime(r.totalTime)}  |  Cost: ${formatCost(r.totalCost)}
  Deliveries: ${r.deliveries}  |  Load: ${r.loadUtilized} kg  |  Efficiency: ${r.efficiency.toFixed(1)}%`;
  }).join('\n');

  const report = `
╔══════════════════════════════════════════════════════════════════╗
║   QUANTUM-OPTIMIZED VEHICLE ROUTING SYSTEM — OPTIMIZATION REPORT ║
║                     Smart India Hackathon 2026                   ║
╚══════════════════════════════════════════════════════════════════╝

Generated: ${new Date().toLocaleString('en-IN')}

═══════════════════════════════
OPTIMIZATION SUMMARY
═══════════════════════════════
Algorithm : ${result.stats.algorithm}
Objective : ${result.stats.objective.toUpperCase()}
Iterations: ${result.stats.iterations.toLocaleString()}
Solutions : ${result.stats.solutionsEvaluated.toLocaleString()}
Time Taken: ${(result.stats.timeMs / 1000).toFixed(2)}s
Improvement: ${result.stats.improvement.toFixed(1)}%

═══════════════════════════════
BEFORE vs AFTER COMPARISON
═══════════════════════════════
Metric          │ Before        │ After         │ Saved
────────────────┼───────────────┼───────────────┼──────────────
Distance        │ ${formatKm(baselineDist).padEnd(13)} │ ${formatKm(optimizedDist).padEnd(13)} │ ${formatKm(baselineDist - optimizedDist)}
Cost            │ ${formatCost(baselineCost).padEnd(13)} │ ${formatCost(optimizedCost).padEnd(13)} │ ${formatCost(baselineCost - optimizedCost)}
Time            │ ${formatTime(baselineTime).padEnd(13)} │ ${formatTime(optimizedTime).padEnd(13)} │ ${formatTime(baselineTime - optimizedTime)}

═══════════════════════════════
FLEET SUMMARY
═══════════════════════════════
Vehicles: ${vehicles.length}
Deliveries: ${locations.filter(l => !l.isDepot).length}

${vehicles.map(v => `  ${v.id} | ${v.type} | ${v.capacity} kg | ${v.fuelType} | ₹${v.costPerKm}/km`).join('\n')}

═══════════════════════════════
OPTIMIZED ROUTES
═══════════════════════════════
${routeDetails}
`;

  downloadFile('optimization_report.txt', report, 'text/plain');
}

function downloadFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
