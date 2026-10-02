export function formatKm(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatCost(cost: number): string {
  return `₹${Math.round(cost).toLocaleString('en-IN')}`;
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'Urgent': return 'text-red-400 bg-red-900/30';
    case 'High': return 'text-orange-400 bg-orange-900/30';
    case 'Medium': return 'text-yellow-400 bg-yellow-900/30';
    default: return 'text-slate-400 bg-slate-800/50';
  }
}

export function vehicleTypeIcon(type: string): string {
  switch (type) {
    case 'Bike': return '🏍️';
    case 'Van': return '🚐';
    case 'Truck': return '🚛';
    case 'Electric Vehicle': return '⚡';
    default: return '🚗';
  }
}

export function fuelTypeColor(fuel: string): string {
  switch (fuel) {
    case 'Electric': return 'text-green-400';
    case 'Petrol': return 'text-blue-400';
    case 'Diesel': return 'text-amber-400';
    case 'CNG': return 'text-cyan-400';
    default: return 'text-slate-400';
  }
}
