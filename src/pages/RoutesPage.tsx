import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Map as MapIcon, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatKm, formatCost, formatTime, vehicleTypeIcon } from '../utils/formatters';
import type { Route, Location, Vehicle } from '../types';

const ROUTE_COLORS = ['#22C55E','#3B82F6','#A855F7','#F59E0B','#F97316','#06B6D4','#EF4444','#84CC16'];

export default function RoutesPage() {
  const navigate = useNavigate();
  const { optimizationResult, vehicles, locations } = useAppStore(s => ({
    optimizationResult: s.optimizationResult,
    vehicles: s.vehicles,
    locations: s.locations,
  }));

  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const locById = (id: string): Location | undefined => locations.find(l => l.id === id);
  const vehicleById = (id: string): Vehicle | undefined => vehicles.find(v => v.id === id);

  if (!optimizationResult) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <p className="text-text-secondary font-semibold text-lg">No optimization results yet</p>
        <p className="text-text-muted text-sm mt-2">Run the optimizer first to see computed routes.</p>
        <button onClick={() => navigate('/optimize')} className="btn-primary mt-6">Go to Optimizer</button>
      </div>
    );
  }

  const routes = optimizationResult.optimized;

  const RouteCard = ({ route, idx }: { route: Route; idx: number }) => {
    const vehicle = vehicleById(route.vehicleId);
    const color = ROUTE_COLORS[idx % ROUTE_COLORS.length];
    const isOpen = expanded.has(route.vehicleId);

    return (
      <div className="card overflow-hidden">
        <button onClick={() => toggleExpand(route.vehicleId)} className="w-full flex items-center gap-4 text-left">
          <div className="w-3 h-14 rounded-full flex-shrink-0" style={{ background: color }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-text-primary">{route.vehicleId}</span>
              <span className="text-text-muted text-sm">{vehicleTypeIcon(vehicle?.type ?? '')} {vehicle?.type}</span>
              <span className="status-success ml-auto text-xs hidden sm:flex">
                <CheckCircle className="w-3 h-3 mr-1" /> Optimized
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-text-muted">
              <span>📍 {route.deliveries} deliveries</span>
              <span>📏 {formatKm(route.totalDistance)}</span>
              <span>⏱ {formatTime(route.totalTime)}</span>
              <span>💰 {formatCost(route.totalCost)}</span>
              <span>📦 {route.loadUtilized} kg</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-bg-secondary overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${route.efficiency}%`, background: color }} />
              </div>
              <span className="text-xs text-text-muted">{route.efficiency.toFixed(0)}% efficient</span>
            </div>
          </div>
          {isOpen
            ? <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
            : <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />}
        </button>

        {isOpen && (
          <div className="mt-4 pt-4 border-t border-border-default">
            <div className="flex flex-col gap-1">
              {route.stops.map((stop, si) => {
                const loc = locById(stop.locationId);
                const isDepot = loc?.isDepot;
                return (
                  <div key={si} className="flex items-start gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        isDepot ? 'border-purple-400 bg-purple-900/50' : 'border-green-400 bg-green-900/50'
                      }`} />
                      {si < route.stops.length - 1 && <div className="w-0.5 h-6 bg-border-default" />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${isDepot ? 'text-quantum-hover' : 'text-text-primary'}`}>
                        {loc?.name ?? stop.locationId}
                        {isDepot && <span className="ml-2 quantum-badge">Depot</span>}
                      </p>
                      {loc && !isDepot && (
                        <p className="text-xs text-text-muted">{loc.demand} kg · {loc.priority} priority</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border-default grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Distance', value: formatKm(route.totalDistance) },
                { label: 'Time', value: formatTime(route.totalTime) },
                { label: 'Cost', value: formatCost(route.totalCost) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-bg-secondary rounded-lg p-2">
                  <p className="text-sm font-semibold text-text-primary">{value}</p>
                  <p className="text-xs text-text-muted mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/map')}
              className="btn-blue text-sm flex items-center gap-2 mt-4">
              <MapIcon className="w-4 h-4" /> View on Map
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="page-title">Optimized Routes</h2>
          <p className="page-subtitle">{routes.length} vehicle routes computed</p>
        </div>
        <button onClick={() => navigate('/map')} className="btn-blue text-sm flex items-center gap-2">
          <MapIcon className="w-4 h-4" /> Open Map View
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Vehicles', value: routes.length },
          { label: 'Total Deliveries', value: routes.reduce((s, r) => s + r.deliveries, 0) },
          { label: 'Total Distance', value: formatKm(routes.reduce((s, r) => s + r.totalDistance, 0)) },
          { label: 'Total Cost', value: formatCost(routes.reduce((s, r) => s + r.totalCost, 0)) },
        ].map(({ label, value }) => (
          <div key={label} className="card">
            <p className="text-xl font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {routes.map((route, idx) => <RouteCard key={route.vehicleId} route={route} idx={idx} />)}
      </div>

      {routes.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Truck className="w-12 h-12 text-text-muted mb-4" />
          <p className="text-text-secondary font-medium">No routes generated</p>
        </div>
      )}
    </div>
  );
}
