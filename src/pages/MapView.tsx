import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../store/appStore';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { Route, Location } from '../types';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ROUTE_COLORS    = ['#F5C518','#10B981','#1D6FEB','#F97316','#06B6D4','#EF4444','#84CC16','#A855F7'];
const BASELINE_COLORS = ['#3D5A7A','#2E4A6A','#354E6C','#2B4462','#334B64','#2C4560','#385270','#2F4A68'];

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
        <AlertCircle className="w-12 h-12 mb-4" style={{ color: '#F5C518' }} />
        <p className="font-semibold text-lg" style={{ color: '#7FA0C0' }}>No optimization results</p>
        <p className="text-sm mt-2" style={{ color: '#3A5570' }}>Run optimization to visualize routes on the map.</p>
        <button onClick={() => navigate('/optimize')} className="btn-primary mt-6">Run Optimization</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #12293F' }}>
          {(['before', 'after'] as const).map(mode => (
            <button key={mode} onClick={() => setMapMode(mode)}
              className="px-5 py-2 text-sm font-medium transition-colors"
              style={mapMode === mode
                ? { background: '#F5C518', color: '#030B1A' }
                : { background: '#061222', color: '#3A5570' }}>
              {mode === 'before' ? '📊 Before (Baseline)' : '⚡ After (Optimized)'}
            </button>
          ))}
        </div>
        <span className="text-xs" style={{ color: '#3A5570' }}>
          {mapMode === 'before' ? 'Nearest Neighbor Heuristic' : 'Quantum-Inspired Optimized Routes'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: 'calc(100vh - 270px)', minHeight: 420 }}>
        {/* Map */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ border: '1px solid #12293F' }}>
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            />
            <FitBounds positions={allPositions} />

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

            {locations.map((loc, i) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}
                icon={createMarkerIcon(loc.isDepot ? '#F5C518' : '#1D6FEB', loc.isDepot ? 'D' : String(i))}>
                <Popup>
                  <div style={{ color: '#F0F6FF', minWidth: 160 }}>
                    <p style={{ fontWeight: 'bold', marginBottom: 4 }}>{loc.name}</p>
                    {loc.address && <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{loc.address}</p>}
                    {!loc.isDepot && (
                      <>
                        <p style={{ fontSize: 12 }}>📦 Demand: {loc.demand} kg</p>
                        <p style={{ fontSize: 12 }}>⚡ Priority: {loc.priority}</p>
                        {loc.timeWindow && <p style={{ fontSize: 12 }}>🕐 {loc.timeWindow.start}–{loc.timeWindow.end}</p>}
                      </>
                    )}
                    {loc.isDepot && <p style={{ fontSize: 12, color: '#F5C518', marginTop: 4 }}>🏭 Depot / Start Point</p>}
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
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#F0F6FF' }}>Map Legend</h4>
            <div className="space-y-2 text-xs" style={{ color: '#7FA0C0' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#F5C518' }} />Depot
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: '#1D6FEB' }} />Delivery Point
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5" style={{ background: '#F5C518' }} />Optimized Route
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5" style={{ background: '#3D5A7A' }} />Baseline Route
              </div>
              <div className="mt-2 pt-2" style={{ borderTop: '1px solid #12293F' }}>
                <p className="mb-1" style={{ color: '#3A5570' }}>Traffic Status</p>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />🟢 Free Flow</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: '#F5C518' }} />🟡 Moderate</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: '#F97316' }} />🟠 Heavy</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />🔴 Congested</div>
              </div>
            </div>
          </div>

          {/* Vehicle toggles */}
          <div className="card flex-1 overflow-y-auto">
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#F0F6FF' }}>Vehicle Routes</h4>
            <div className="space-y-2">
              {routes.map((route, idx) => (
                <button key={route.vehicleId} onClick={() => toggleRoute(route.vehicleId)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors"
                  style={visibleRoutes.has(route.vehicleId)
                    ? { background: '#0E2850' }
                    : { background: '#061222', opacity: 0.5 }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colors[idx % colors.length] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: '#F0F6FF' }}>{route.vehicleId}</p>
                    <p className="text-xs" style={{ color: '#3A5570' }}>{route.deliveries} stops · {route.totalDistance.toFixed(1)} km</p>
                  </div>
                  {visibleRoutes.has(route.vehicleId)
                    ? <Eye className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#3A5570' }} />
                    : <EyeOff className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#3A5570' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
