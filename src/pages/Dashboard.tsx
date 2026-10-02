import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, TrendingDown, Clock, DollarSign,
  Zap, BarChart3, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAppStore } from '../store/appStore';
import { formatKm, formatCost, formatTime, formatPct } from '../utils/formatters';

export default function Dashboard() {
  const navigate = useNavigate();
  const { vehicles, locations, optimizationResult, loadSampleData } = useAppStore(s => ({
    vehicles: s.vehicles,
    locations: s.locations,
    optimizationResult: s.optimizationResult,
    loadSampleData: s.loadSampleData,
  }));

  const deliveries = locations.filter(l => !l.isDepot);
  const result = optimizationResult;

  const baselineDist = result?.baseline.reduce((s, r) => s + r.totalDistance, 0) ?? 0;
  const optimizedDist = result?.optimized.reduce((s, r) => s + r.totalDistance, 0) ?? 0;
  const baselineCost = result?.baseline.reduce((s, r) => s + r.totalCost, 0) ?? 0;
  const optimizedCost = result?.optimized.reduce((s, r) => s + r.totalCost, 0) ?? 0;
  const baselineTime = result?.baseline.reduce((s, r) => s + r.totalTime, 0) ?? 0;
  const optimizedTime = result?.optimized.reduce((s, r) => s + r.totalTime, 0) ?? 0;
  const distSaved = baselineDist - optimizedDist;
  const costSaved = baselineCost - optimizedCost;
  const improvement = result?.stats.improvement ?? 0;

  const kpis = [
    { label: 'Total Vehicles', value: vehicles.length.toString(), icon: Truck, color: 'text-blue-400', bg: 'bg-blue-900/20' },
    { label: 'Delivery Locations', value: deliveries.length.toString(), icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-900/20' },
    { label: 'Total Distance', value: result ? formatKm(optimizedDist) : '—', icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-900/20',
      sub: result ? `Baseline: ${formatKm(baselineDist)}` : 'Run optimization first' },
    { label: 'Travel Time', value: result ? formatTime(optimizedTime) : '—', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-900/20',
      sub: result ? `Baseline: ${formatTime(baselineTime)}` : '' },
    { label: 'Est. Cost', value: result ? formatCost(optimizedCost) : '—', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-900/20',
      sub: result ? `Baseline: ${formatCost(baselineCost)}` : '' },
    { label: 'Distance Saved', value: result ? formatKm(distSaved) : '—', icon: TrendingDown, color: 'text-traffic-free', bg: 'bg-green-900/20', accent: true },
    { label: 'Cost Saved', value: result ? formatCost(costSaved) : '—', icon: DollarSign, color: 'text-route-quantum', bg: 'bg-purple-900/20', accent: true },
    { label: 'Opt. Efficiency', value: result ? formatPct(improvement) : '—', icon: Zap, color: 'text-quantum-hover', bg: 'bg-purple-900/20', accent: true },
  ];

  const comparisonData = result ? [
    { name: 'Distance (km)', before: +baselineDist.toFixed(1), after: +optimizedDist.toFixed(1) },
    { name: 'Time (min)', before: +baselineTime.toFixed(0), after: +optimizedTime.toFixed(0) },
    { name: 'Cost (₹/10)', before: +(baselineCost/10).toFixed(0), after: +(optimizedCost/10).toFixed(0) },
  ] : [];

  const iterData = result?.stats.iterationHistory.slice(0, 40).map(p => ({
    iter: p.iteration,
    best: +p.bestCost.toFixed(0),
    current: +p.currentCost.toFixed(0),
  })) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status Banner */}
      {!result && (
        <div className="rounded-xl border border-quantum/30 bg-quantum/10 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-quantum-hover flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Ready to Optimize
            </p>
            <p className="text-sm text-text-muted mt-1">
              Load the demo dataset and run your first optimization to see results.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {vehicles.length === 0 && (
              <button onClick={loadSampleData} className="btn-secondary text-sm">Load Demo Data</button>
            )}
            <button onClick={() => navigate('/optimize')} className="btn-primary text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" /> Start Optimization
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-green-700/40 bg-green-900/10 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <CheckCircle className="w-5 h-5 text-traffic-free flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-traffic-free">Optimization Completed</p>
            <p className="text-sm text-text-muted">
              {result.stats.solutionsEvaluated.toLocaleString()} solutions evaluated ·
              {result.stats.improvement.toFixed(1)}% improvement ·
              {new Date(result.completedAt).toLocaleString()}
            </p>
          </div>
          <button onClick={() => navigate('/results')} className="btn-success text-sm flex items-center gap-2">
            View Results <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg, sub, accent }) => (
          <div key={label} className={`card ${accent && result ? 'border-quantum/30' : ''}`}>
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              {accent && result && <span className="status-success text-xs">↑</span>}
            </div>
            <p className="text-2xl font-bold text-text-primary mt-3">{value}</p>
            <p className="text-xs text-text-muted mt-0.5">{label}</p>
            {sub && <p className="text-xs text-text-muted/70 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      {result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="section-header">Before vs After Comparison</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparisonData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#F8FAFC' }} />
                <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
                <Bar dataKey="before" name="Before" fill="#64748B" radius={[4,4,0,0]} />
                <Bar dataKey="after" name="After" fill="#22C55E" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="section-header">Optimization Convergence</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={iterData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="iter" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
                  labelStyle={{ color: '#F8FAFC' }} />
                <Area type="monotone" dataKey="current" name="Current Cost" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                <Area type="monotone" dataKey="best" name="Best Cost" stroke="#A855F7" fill="#A855F7" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="w-10 h-10 text-text-muted mb-3" />
            <p className="text-text-secondary font-medium">No optimization data yet</p>
            <p className="text-text-muted text-sm mt-1">Run an optimization to see charts</p>
          </div>
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <Zap className="w-10 h-10 text-text-muted mb-3" />
            <p className="text-text-secondary font-medium">Convergence Chart</p>
            <p className="text-text-muted text-sm mt-1">Available after optimization</p>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Manage Fleet', path: '/vehicles', desc: `${vehicles.length} vehicles` },
          { label: 'Add Locations', path: '/locations', desc: `${deliveries.length} locations` },
          { label: 'Run Optimizer', path: '/optimize', desc: 'QUBO + SA engine' },
          { label: 'View Map', path: '/map', desc: 'Interactive routes' },
        ].map(({ label, path, desc }) => (
          <button key={path} onClick={() => navigate(path)}
            className="card text-left hover:border-quantum/50 cursor-pointer group">
            <p className="text-sm font-semibold text-text-primary group-hover:text-quantum-hover transition-colors">{label}</p>
            <p className="text-xs text-text-muted mt-1">{desc}</p>
            <ArrowRight className="w-3 h-3 text-text-muted group-hover:text-quantum-hover mt-2 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
