import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { Route, Location } from '../types';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ROUTE_COLORS = ['#22C55E','#3B82F6','#A855F7','#F59E0B','#F97316','#06B6D4','#EF4444','#84CC16'];
const BASELINE_COLORS = ['#64748B','#475569','#556B82','#4A596A','#4B5E6C','#526070','#60697B','#5A6473'];

function createMarkerIcon(color: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2.5"/>
    <text x="12" y="16" text-anchor="middle" fill="white" font-size="9" font-weight="bold" font-family="sans-serif">${label}</text>
    <line x1="12" y1="22" x2="12" y2="36" stroke="${color}" stroke-width="2"/>
  </svg>`;
  return L.divIcon({ html: svg, iconSize: [24, 36], iconAnchor: [12, 36], popupAnchor: [0, -30], className: '' });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) map.fitBounds(positions, { padding: [40, 40] });
  }, [map, positions.length]);
  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const { optimizationResult, locations, mapMode, setMapMode } = useAppStore(s => ({
    optimizationResult: s.optimizationResult,
    locations: s.locations,
    mapMode: s.mapMode,
    setMapMode: s.setMapMode,
  }));

  const [visibleRoutes, setVisibleRoutes] = useState<Set<string>>(new Set());

  const routes: Route[] = mapMode === 'before'
    ? (optimizationResult?.baseline ?? [])
    : (optimizationResult?.optimized ?? []);
  const colors = mapMode === 'before' ? BASELINE_COLORS : ROUTE_COLORS;

  useEffect(() => {
    setVisibleRoutes(new Set(routes.map(r => r.vehicleId)));
  }, [routes.length, mapMode]);

  const locMap = new Map(locations.map(l => [l.id, l]));
  const depot = locations.find(l => l.isDepot);
  const center: [number, number] = depot ? [depot.lat, depot.lng] : [16.5062, 80.6480];
  const allPositions: [number, number][] = locations.map(l => [l.lat, l.lng]);

  const toggleRoute = (id: string) =>
    setVisibleRoutes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  if (!optimizationResult) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <p className="text-text-secondary font-semibold text-lg">No optimization results</p>
        <p className="text-text-muted text-sm mt-2">Run optimization to visualize routes on the map.</p>
        <button onClick={() => navigate('/optimize')} className="btn-primary mt-6">Run Optimization</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-border-default overflow-hidden">
          {(['before', 'after'] as const).map(mode => (
            <button key={mode} onClick={() => setMapMode(mode)}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                mapMode === mode ? 'bg-quantum text-white' : 'bg-bg-secondary text-text-muted hover:text-text-primary'
              }`}>
              {mode === 'before' ? '📊 Before (Baseline)' : '⚡ After (Optimized)'}
            </button>
          ))}
        </div>
        <span className="text-xs text-text-muted">
          {mapMode === 'before' ? 'Nearest Neighbor Heuristic' : 'Quantum-Inspired Optimized Routes'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: 'calc(100vh - 270px)', minHeight: 420 }}>
        {/* Map */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden border border-border-default">
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            />
            <FitBounds positions={allPositions} />

            {/* Routes */}
            {routes.map((route, idx) => {
              if (!visibleRoutes.has(route.vehicleId)) return null;
              const pts = route.stops
                .map(s => locMap.get(s.locationId))
                .filter((l): l is Location => !!l)
                .map(l => [l.lat, l.lng] as [number, number]);
              return (
                <Polyline key={route.vehicleId} positions={pts}
                  pathOptions={{ color: colors[idx % colors.length], weight: 3.5, opacity: 0.85 }} />
              );
            })}

            {/* Markers */}
            {locations.map((loc, i) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}
                icon={createMarkerIcon(loc.isDepot ? '#7C3AED' : '#3B82F6', loc.isDepot ? 'D' : String(i))}>
                <Popup>
                  <div style={{ color: '#F8FAFC', minWidth: 160 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{loc.name}</p>
                    {loc.address && <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{loc.address}</p>}
                    {!loc.isDepot && (
                      <>
                        <p style={{ fontSize: 12 }}>📦 Demand: {loc.demand} kg</p>
                        <p style={{ fontSize: 12 }}>⚡ Priority: {loc.priority}</p>
                        {loc.timeWindow && <p style={{ fontSize: 12 }}>🕐 {loc.timeWindow.start}–{loc.timeWindow.end}</p>}
                      </>
                    )}
                    {loc.isDepot && <p style={{ fontSize: 12, color: '#A78BFA', marginTop: 4 }}>🏭 Depot / Start Point</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto">
          {/* Legend */}
          <div className="card">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Map Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500" />Depot</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" />Delivery Point</div>
              <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-green-500" />Optimized Route</div>
              <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-slate-500" />Baseline Route</div>
              <div className="mt-2 pt-2 border-t border-border-default">
                <p className="text-text-muted mb-1">Traffic Status</p>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" />🟢 Free Flow</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" />🟡 Moderate</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" />🟠 Heavy</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" />🔴 Congested</div>
              </div>
            </div>
          </div>

          {/* Vehicle toggles */}
          <div className="card flex-1 overflow-y-auto">
            <h4 className="text-sm font-semibold text-text-primary mb-3">Vehicle Routes</h4>
            <div className="space-y-2">
              {routes.map((route, idx) => (
                <button key={route.vehicleId} onClick={() => toggleRoute(route.vehicleId)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                    visibleRoutes.has(route.vehicleId) ? 'bg-bg-card-hover' : 'bg-bg-secondary opacity-50'
                  }`}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colors[idx % colors.length] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary">{route.vehicleId}</p>
                    <p className="text-xs text-text-muted">{route.deliveries} stops · {route.totalDistance.toFixed(1)} km</p>
                  </div>
                  {visibleRoutes.has(route.vehicleId)
                    ? <Eye className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                    : <EyeOff className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
