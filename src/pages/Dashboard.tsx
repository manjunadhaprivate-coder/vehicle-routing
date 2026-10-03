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
    { label: 'Total Vehicles', value: vehicles.length.toString(), icon: Truck,
      iconColor: '#1D6FEB', iconBg: 'rgba(29,111,235,0.12)' },
    { label: 'Delivery Locations', value: deliveries.length.toString(), icon: MapPin,
      iconColor: '#F5C518', iconBg: 'rgba(245,197,24,0.12)' },
    { label: 'Total Distance', value: result ? formatKm(optimizedDist) : '—', icon: BarChart3,
      iconColor: '#F97316', iconBg: 'rgba(249,115,22,0.12)',
      sub: result ? `Baseline: ${formatKm(baselineDist)}` : 'Run optimization first' },
    { label: 'Travel Time', value: result ? formatTime(optimizedTime) : '—', icon: Clock,
      iconColor: '#06B6D4', iconBg: 'rgba(6,182,212,0.12)',
      sub: result ? `Baseline: ${formatTime(baselineTime)}` : '' },
    { label: 'Est. Cost', value: result ? formatCost(optimizedCost) : '—', icon: DollarSign,
      iconColor: '#10B981', iconBg: 'rgba(16,185,129,0.12)',
      sub: result ? `Baseline: ${formatCost(baselineCost)}` : '' },
    { label: 'Distance Saved', value: result ? formatKm(distSaved) : '—', icon: TrendingDown,
      iconColor: '#10B981', iconBg: 'rgba(16,185,129,0.12)', accent: true },
    { label: 'Cost Saved', value: result ? formatCost(costSaved) : '—', icon: DollarSign,
      iconColor: '#F5C518', iconBg: 'rgba(245,197,24,0.12)', accent: true },
    { label: 'Opt. Efficiency', value: result ? formatPct(improvement) : '—', icon: Zap,
      iconColor: '#F5C518', iconBg: 'rgba(245,197,24,0.12)', accent: true },
  ];

  const comparisonData = result ? [
    { name: 'Distance (km)', before: +baselineDist.toFixed(1), after: +optimizedDist.toFixed(1) },
    { name: 'Time (min)',    before: +baselineTime.toFixed(0),  after: +optimizedTime.toFixed(0) },
    { name: 'Cost (₹/10)',  before: +(baselineCost/10).toFixed(0), after: +(optimizedCost/10).toFixed(0) },
  ] : [];

  const iterData = result?.stats.iterationHistory.slice(0, 40).map(p => ({
    iter: p.iteration,
    best: +p.bestCost.toFixed(0),
    current: +p.currentCost.toFixed(0),
  })) ?? [];

  const tickStyle = { fill: '#7FA0C0', fontSize: 11 };
  const gridStyle = { strokeDasharray: '3 3', stroke: '#1A3A5C' };
  const tooltipStyle = { contentStyle: { background: '#0B2040', border: '1px solid #1A3A5C', borderRadius: 8 }, labelStyle: { color: '#F0F6FF' } };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status Banner — not optimized */}
      {!result && (
        <div className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: 'rgba(245,197,24,0.06)', border: '1px solid rgba(245,197,24,0.2)' }}>
          <div className="flex-1">
            <p className="font-semibold flex items-center gap-2" style={{ color: '#F5C518' }}>
              <AlertCircle className="w-4 h-4" /> Ready to Optimize
            </p>
            <p className="text-sm mt-1" style={{ color: '#3A5570' }}>
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

      {/* Status Banner — optimized */}
      {result && (
        <div className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#10B981' }} />
          <div className="flex-1">
            <p className="font-semibold" style={{ color: '#10B981' }}>Optimization Completed</p>
            <p className="text-sm mt-1" style={{ color: '#3A5570' }}>
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
        {kpis.map(({ label, value, icon: Icon, iconColor, iconBg, sub, accent }) => (
          <div key={label} className="card"
            style={accent && result ? { borderColor: 'rgba(245,197,24,0.25)' } : {}}>
            <div className="flex items-start justify-between">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 16, height: 16, color: iconColor }} />
              </div>
              {accent && result && <span className="status-success text-xs">↑</span>}
            </div>
            <p className="text-2xl font-bold mt-3" style={{ color: '#F0F6FF' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#3A5570' }}>{label}</p>
            {sub && <p className="text-xs mt-1" style={{ color: '#3A5570', opacity: 0.7 }}>{sub}</p>}
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
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="name" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: '#7FA0C0', fontSize: 12 }} />
                <Bar dataKey="before" name="Before" fill="#3D5A7A" radius={[4,4,0,0]} />
                <Bar dataKey="after" name="After" fill="#F5C518" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="section-header">Optimization Convergence</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={iterData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="iter" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="current" name="Current Cost"
                  stroke="#1D6FEB" fill="#1D6FEB" fillOpacity={0.1} />
                <Area type="monotone" dataKey="best" name="Best Cost"
                  stroke="#F5C518" fill="#F5C518" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="w-10 h-10 mb-3" style={{ color: '#3A5570' }} />
            <p className="font-medium" style={{ color: '#7FA0C0' }}>No optimization data yet</p>
            <p className="text-sm mt-1" style={{ color: '#3A5570' }}>Run an optimization to see charts</p>
          </div>
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <Zap className="w-10 h-10 mb-3" style={{ color: '#3A5570' }} />
            <p className="font-medium" style={{ color: '#7FA0C0' }}>Convergence Chart</p>
            <p className="text-sm mt-1" style={{ color: '#3A5570' }}>Available after optimization</p>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Manage Fleet',  path: '/vehicles',  desc: `${vehicles.length} vehicles` },
          { label: 'Add Locations', path: '/locations', desc: `${deliveries.length} locations` },
          { label: 'Run Optimizer', path: '/optimize',  desc: 'QUBO + SA engine' },
          { label: 'View Map',      path: '/map',       desc: 'Interactive routes' },
        ].map(({ label, path, desc }) => (
          <button key={path} onClick={() => navigate(path)}
            className="card text-left cursor-pointer group"
            style={{ transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,197,24,0.35)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = '#12293F'}>
            <p className="text-sm font-semibold" style={{ color: '#F0F6FF' }}>{label}</p>
            <p className="text-xs mt-1" style={{ color: '#3A5570' }}>{desc}</p>
            <ArrowRight className="w-3 h-3 mt-2" style={{ color: '#3A5570' }} />
          </button>
        ))}
      </div>
    </div>
  );
}
