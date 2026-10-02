import { useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';
import { CheckCircle, Download, AlertCircle, Trophy } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatKm, formatCost, formatTime, formatPct, vehicleTypeIcon } from '../utils/formatters';
import { exportCSV, exportJSON, exportReport } from '../utils/exporters';

const PIE_COLORS = ['#22C55E','#3B82F6','#A855F7','#F59E0B','#F97316','#06B6D4'];

export default function Results() {
  const navigate = useNavigate();
  const { optimizationResult, vehicles, locations } = useAppStore(s => ({
    optimizationResult: s.optimizationResult,
    vehicles: s.vehicles,
    locations: s.locations,
  }));

  if (!optimizationResult) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <p className="text-text-secondary font-semibold text-lg">No optimization results</p>
        <p className="text-text-muted text-sm mt-2">Run optimization to see the executive dashboard.</p>
        <button onClick={() => navigate('/optimize')} className="btn-primary mt-6">Run Optimization</button>
      </div>
    );
  }

  const r = optimizationResult;
  const bDist = r.baseline.reduce((s, x) => s + x.totalDistance, 0);
  const oDist = r.optimized.reduce((s, x) => s + x.totalDistance, 0);
  const bCost = r.baseline.reduce((s, x) => s + x.totalCost, 0);
  const oCost = r.optimized.reduce((s, x) => s + x.totalCost, 0);
  const bTime = r.baseline.reduce((s, x) => s + x.totalTime, 0);
  const oTime = r.optimized.reduce((s, x) => s + x.totalTime, 0);
  const deliveryLocs = locations.filter(l => !l.isDepot);

  const avgDist = r.optimized.length > 0 ? oDist / r.optimized.length : 0;
  const avgDeliveries = r.optimized.length > 0 ? r.optimized.reduce((s, x) => s + x.deliveries, 0) / r.optimized.length : 0;
  const avgEfficiency = r.optimized.length > 0 ? r.optimized.reduce((s, x) => s + x.efficiency, 0) / r.optimized.length : 0;

  const pieData = r.optimized.map(route => ({
    name: route.vehicleId,
    value: +route.totalDistance.toFixed(1),
  }));

  const radarData = [
    { metric: 'Distance', baseline: 100, optimized: +(100 - ((bDist - oDist) / (bDist || 1) * 100)).toFixed(0) },
    { metric: 'Cost', baseline: 100, optimized: +(100 - ((bCost - oCost) / (bCost || 1) * 100)).toFixed(0) },
    { metric: 'Time', baseline: 100, optimized: +(100 - ((bTime - oTime) / (bTime || 1) * 100)).toFixed(0) },
    { metric: 'Efficiency', baseline: 60, optimized: +avgEfficiency.toFixed(0) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header + Export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="page-title">Results Dashboard</h2>
          <p className="page-subtitle">Executive optimization summary — SIH Judge Report</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => exportCSV(r, vehicles, locations)} className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => exportJSON(r, vehicles, locations)} className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> JSON
          </button>
          <button onClick={() => exportReport(r, vehicles, locations)} className="btn-primary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="rounded-xl border border-green-700/40 bg-green-900/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Trophy className="w-10 h-10 text-yellow-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-traffic-free" />
            <p className="text-lg font-bold text-text-primary">Optimization Completed Successfully</p>
          </div>
          <p className="text-text-muted text-sm mt-1">
            {r.stats.algorithm} · {r.stats.solutionsEvaluated.toLocaleString()} solutions evaluated ·
            Completed {new Date(r.completedAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-bold text-traffic-free">{r.stats.improvement.toFixed(1)}%</p>
          <p className="text-xs text-text-muted">Overall Improvement</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Vehicles', value: vehicles.length },
          { label: 'Total Deliveries', value: deliveryLocs.length },
          { label: 'Original Distance', value: formatKm(bDist) },
          { label: 'Optimized Distance', value: formatKm(oDist), accent: 'text-traffic-free' },
          { label: 'Original Cost', value: formatCost(bCost) },
          { label: 'Optimized Cost', value: formatCost(oCost), accent: 'text-traffic-free' },
          { label: 'Distance Saved', value: formatKm(bDist - oDist), accent: 'text-traffic-free' },
          { label: 'Cost Saved', value: formatCost(bCost - oCost), accent: 'text-route-quantum' },
        ].map(({ label, value, accent }) => (
          <div key={label} className="card">
            <p className={`text-xl font-bold ${accent ?? 'text-text-primary'}`}>{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-header">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <Radar name="Baseline" dataKey="baseline" stroke="#64748B" fill="#64748B" fillOpacity={0.2} />
              <Radar name="Optimized" dataKey="optimized" stroke="#22C55E" fill="#22C55E" fillOpacity={0.3} />
              <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-header">Distance Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={90} label={({ name, value }) => `${name}: ${value}km`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Route Efficiency Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border-default">
          <h3 className="font-semibold text-text-primary">Route Efficiency</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                {['Vehicle', 'Type', 'Deliveries', 'Distance', 'Time', 'Cost', 'Load', 'Efficiency'].map(h => (
                  <th key={h} className="table-cell text-left text-xs font-semibold text-text-muted uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.optimized.map(route => {
                const v = vehicles.find(x => x.id === route.vehicleId);
                return (
                  <tr key={route.vehicleId} className="table-row">
                    <td className="table-cell font-mono font-semibold text-quantum-hover">{route.vehicleId}</td>
                    <td className="table-cell">{vehicleTypeIcon(v?.type ?? '')} {v?.type}</td>
                    <td className="table-cell text-text-primary">{route.deliveries}</td>
                    <td className="table-cell">{formatKm(route.totalDistance)}</td>
                    <td className="table-cell">{formatTime(route.totalTime)}</td>
                    <td className="table-cell">{formatCost(route.totalCost)}</td>
                    <td className="table-cell">{route.loadUtilized} kg</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-traffic-free" style={{ width: `${route.efficiency}%` }} />
                        </div>
                        <span className="text-xs text-traffic-free">{route.efficiency.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Iterations', value: r.stats.iterations.toLocaleString() },
          { label: 'Solutions Evaluated', value: r.stats.solutionsEvaluated.toLocaleString() },
          { label: 'Avg Route Distance', value: formatKm(avgDist) },
          { label: 'Avg Efficiency', value: formatPct(avgEfficiency) },
          { label: 'Avg Deliveries/Vehicle', value: avgDeliveries.toFixed(1) },
          { label: 'Time Saved', value: formatTime(bTime - oTime) },
          { label: 'Compute Time', value: `${(r.stats.timeMs / 1000).toFixed(2)}s` },
          { label: 'Improvement', value: formatPct(r.stats.improvement) },
        ].map(({ label, value }) => (
          <div key={label} className="card">
            <p className="text-lg font-bold text-tech-blue-hover">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
