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
        <AlertCircle className="w-12 h-12 mb-4" style={{ color: '#F5C518' }} />
        <p className="font-semibold text-lg" style={{ color: '#7FA0C0' }}>No results to compare</p>
        <p className="text-sm mt-2" style={{ color: '#3A5570' }}>Run optimization first to see before/after comparison.</p>
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
    { metric: 'Total Distance', before: formatKm(bDist),  after: formatKm(oDist),  saved: formatKm(bDist - oDist),  pct: formatPct(distPct) },
    { metric: 'Travel Time',    before: formatTime(bTime), after: formatTime(oTime), saved: formatTime(bTime - oTime), pct: formatPct(timePct) },
    { metric: 'Transport Cost', before: formatCost(bCost), after: formatCost(oCost), saved: formatCost(bCost - oCost), pct: formatPct(costPct) },
    { metric: 'Active Vehicles',before: String(r.baseline.length), after: String(r.optimized.length), saved: '—', pct: '—' },
  ];

  const chartData = [
    { name: 'Distance (km)',  before: +bDist.toFixed(1), after: +oDist.toFixed(1) },
    { name: 'Time (min)',     before: +bTime.toFixed(0), after: +oTime.toFixed(0) },
    { name: 'Cost (₹×0.1)',  before: +(bCost/10).toFixed(0), after: +(oCost/10).toFixed(0) },
  ];

  const tickStyle = { fill: '#7FA0C0', fontSize: 12 };
  const gridStyle = { strokeDasharray: '3 3', stroke: '#1A3A5C' };
  const tooltipStyle = { contentStyle: { background: '#0B2040', border: '1px solid #1A3A5C', borderRadius: 8 }, labelStyle: { color: '#F0F6FF' } };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="page-title">Before vs After Comparison</h2>
        <p className="page-subtitle">Baseline (Nearest Neighbor) vs Quantum-Inspired Optimized routes</p>
      </div>

      {/* Savings Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Distance Saved', value: formatKm(bDist - oDist),  pct: formatPct(distPct), color: '#10B981', border: 'rgba(16,185,129,0.25)',  bg: 'rgba(16,185,129,0.06)' },
          { label: 'Time Saved',     value: formatTime(bTime - oTime), pct: formatPct(timePct), color: '#1D6FEB', border: 'rgba(29,111,235,0.25)',  bg: 'rgba(29,111,235,0.06)' },
          { label: 'Cost Saved',     value: formatCost(bCost - oCost), pct: formatPct(costPct), color: '#F5C518', border: 'rgba(245,197,24,0.25)', bg: 'rgba(245,197,24,0.06)' },
        ].map(({ label, value, pct, color, border, bg }) => (
          <div key={label} className="card text-center py-6" style={{ borderColor: border, background: bg }}>
            <TrendingDown style={{ width: 28, height: 28, color, margin: '0 auto 12px' }} />
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
            <p className="text-sm mt-2" style={{ color: '#3A5570' }}>{label}</p>
            <p className="text-lg font-bold mt-1" style={{ color }}>{pct} improvement</p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #12293F' }}>
          <h3 className="font-semibold" style={{ color: '#F0F6FF' }}>Detailed Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                {['Metric','Before (Baseline)','After (Optimized)','Saved','Improvement'].map(h => (
                  <th key={h} className="table-cell text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: '#3A5570' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.metric} className="table-row">
                  <td className="table-cell font-semibold" style={{ color: '#F0F6FF' }}>{row.metric}</td>
                  <td className="table-cell font-medium" style={{ color: '#EF4444' }}>{row.before}</td>
                  <td className="table-cell font-medium" style={{ color: '#10B981' }}>{row.after}</td>
                  <td className="table-cell font-semibold" style={{ color: '#F5C518' }}>{row.saved}</td>
                  <td className="table-cell">
                    {row.pct !== '—'
                      ? <span className="status-success">{row.pct}</span>
                      : <span style={{ color: '#3A5570' }}>—</span>}
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
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="name" tick={tickStyle} />
            <YAxis tick={tickStyle} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ color: '#7FA0C0', fontSize: 12 }} />
            <Bar dataKey="before" name="Before (Baseline)" fill="#3D5A7A" radius={[4,4,0,0]} />
            <Bar dataKey="after"  name="After (Optimized)" fill="#F5C518"  radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Algorithm Info */}
      <div className="card" style={{ background: 'rgba(245,197,24,0.05)', borderColor: 'rgba(245,197,24,0.2)' }}>
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F5C518' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#3A5570' }}>
            <span className="font-semibold" style={{ color: '#F5C518' }}>Algorithm: </span>
            {r.stats.algorithm} · Objective: {r.stats.objective.toUpperCase()} ·
            {r.stats.solutionsEvaluated.toLocaleString()} solutions evaluated in {(r.stats.timeMs / 1000).toFixed(2)}s
          </p>
        </div>
      </div>
    </div>
  );
}
