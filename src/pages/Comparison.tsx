import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatKm, formatCost, formatTime, formatPct } from '../utils/formatters';

export default function Comparison() {
  const navigate = useNavigate();
  const { optimizationResult } = useAppStore(s => ({ optimizationResult: s.optimizationResult }));

  if (!optimizationResult) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
        <p className="text-text-secondary font-semibold text-lg">No results to compare</p>
        <p className="text-text-muted text-sm mt-2">Run optimization first to see before/after comparison.</p>
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

  const distPct = bDist > 0 ? ((bDist - oDist) / bDist) * 100 : 0;
  const costPct = bCost > 0 ? ((bCost - oCost) / bCost) * 100 : 0;
  const timePct = bTime > 0 ? ((bTime - oTime) / bTime) * 100 : 0;

  const rows = [
    { metric: 'Total Distance', before: formatKm(bDist), after: formatKm(oDist), saved: formatKm(bDist - oDist), pct: formatPct(distPct) },
    { metric: 'Travel Time', before: formatTime(bTime), after: formatTime(oTime), saved: formatTime(bTime - oTime), pct: formatPct(timePct) },
    { metric: 'Transport Cost', before: formatCost(bCost), after: formatCost(oCost), saved: formatCost(bCost - oCost), pct: formatPct(costPct) },
    { metric: 'Active Vehicles', before: String(r.baseline.length), after: String(r.optimized.length), saved: '—', pct: '—' },
  ];

  const chartData = [
    { name: 'Distance (km)', before: +bDist.toFixed(1), after: +oDist.toFixed(1) },
    { name: 'Time (min)', before: +bTime.toFixed(0), after: +oTime.toFixed(0) },
    { name: 'Cost (₹×0.1)', before: +(bCost / 10).toFixed(0), after: +(oCost / 10).toFixed(0) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="page-title">Before vs After Comparison</h2>
        <p className="page-subtitle">Baseline (Nearest Neighbor) vs Quantum-Inspired Optimized routes</p>
      </div>

      {/* Savings Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Distance Saved', value: formatKm(bDist - oDist), pct: formatPct(distPct), color: 'text-traffic-free', bg: 'bg-green-900/20 border-green-700/40' },
          { label: 'Time Saved', value: formatTime(bTime - oTime), pct: formatPct(timePct), color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700/40' },
          { label: 'Cost Saved', value: formatCost(bCost - oCost), pct: formatPct(costPct), color: 'text-route-quantum', bg: 'bg-purple-900/20 border-purple-700/40' },
        ].map(({ label, value, pct, color, bg }) => (
          <div key={label} className={`card border ${bg} text-center py-6`}>
            <TrendingDown className={`w-7 h-7 ${color} mx-auto mb-3`} />
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-text-muted text-sm mt-2">{label}</p>
            <p className={`text-lg font-bold ${color} mt-1`}>{pct} improvement</p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border-default">
          <h3 className="font-semibold text-text-primary">Detailed Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                {['Metric', 'Before (Baseline)', 'After (Optimized)', 'Saved', 'Improvement'].map(h => (
                  <th key={h} className="table-cell text-left text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.metric} className="table-row">
                  <td className="table-cell font-semibold text-text-primary">{row.metric}</td>
                  <td className="table-cell text-red-400 font-medium">{row.before}</td>
                  <td className="table-cell text-traffic-free font-medium">{row.after}</td>
                  <td className="table-cell text-blue-400 font-semibold">{row.saved}</td>
                  <td className="table-cell">
                    {row.pct !== '—'
                      ? <span className="status-success">{row.pct}</span>
                      : <span className="text-text-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card">
        <h3 className="section-header">Visual Comparison</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
              labelStyle={{ color: '#F8FAFC' }} />
            <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 12 }} />
            <Bar dataKey="before" name="Before (Baseline)" fill="#64748B" radius={[4,4,0,0]} />
            <Bar dataKey="after" name="After (Optimized)" fill="#22C55E" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Algorithm Info */}
      <div className="card bg-purple-900/10 border-purple-700/30">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-quantum-hover flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed">
            <span className="text-quantum-hover font-semibold">Algorithm: </span>
            {r.stats.algorithm} · Objective: {r.stats.objective.toUpperCase()} ·
            {r.stats.solutionsEvaluated.toLocaleString()} solutions evaluated in {(r.stats.timeMs / 1000).toFixed(2)}s
          </p>
        </div>
      </div>
    </div>
  );
}
