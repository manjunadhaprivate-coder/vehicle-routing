import { useNavigate } from 'react-router-dom';
import { Atom, CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppStore } from '../store/appStore';
import { formatCost, formatPct } from '../utils/formatters';

const FLOW_STEPS = [
  { label: 'Initial Solution', desc: 'Nearest-neighbor baseline' },
  { label: 'Candidate Solutions', desc: 'Neighbourhood search' },
  { label: 'Quantum-Inspired Search', desc: 'QUBO cost function' },
  { label: 'Constraint Evaluation', desc: 'Capacity & distance check' },
  { label: 'Best Solution', desc: 'SA convergence' },
  { label: 'Optimized Route', desc: 'Final output' },
];

export default function Simulation() {
  const navigate = useNavigate();
  const {
    isOptimizing, optimizationProgress, currentIteration, currentCost,
    bestCost, solutionsEvaluated, optimizationResult,
  } = useAppStore(s => ({
    isOptimizing: s.isOptimizing,
    optimizationProgress: s.optimizationProgress,
    currentIteration: s.currentIteration,
    currentCost: s.currentCost,
    bestCost: s.bestCost,
    solutionsEvaluated: s.solutionsEvaluated,
    optimizationResult: s.optimizationResult,
  }));

  const result = optimizationResult;
  const progress = Math.min(100, optimizationProgress);
  const activeStep = result ? 5 : Math.min(5, Math.floor((progress / 100) * 6));

  const iterData = result?.stats.iterationHistory.slice(0, 60).map(p => ({
    iter: p.iteration,
    best: +p.bestCost.toFixed(0),
    current: +p.currentCost.toFixed(0),
  })) ?? [];

  const displayImprovement = result?.stats.improvement ?? 0;
  const displayIterations = result?.stats.iterations ?? currentIteration;
  const displaySolutions = result?.stats.solutionsEvaluated ?? solutionsEvaluated;
  const displayInitCost = result?.stats.initialCost ?? currentCost;
  const displayBestCost = result?.stats.bestCost ?? bestCost;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="page-title">Quantum-Inspired Optimization Engine</h2>
          <p className="page-subtitle">Simulated Annealing + QUBO Cost Function</p>
        </div>
        {result && (
          <button onClick={() => navigate('/routes')} className="btn-success text-sm flex items-center gap-2">
            View Routes <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Status + Metrics */}
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              {result ? (
                <CheckCircle className="w-6 h-6 text-traffic-free" />
              ) : isOptimizing ? (
                <Atom className="w-6 h-6 text-quantum-hover animate-spin" />
              ) : (
                <Activity className="w-6 h-6 text-text-muted" />
              )}
              <div>
                <p className="font-semibold text-text-primary">
                  {result ? 'Optimization Complete' : isOptimizing ? 'Optimizing...' : 'Waiting'}
                </p>
                <p className="text-xs text-text-muted">{result?.stats.algorithm ?? 'QUBO + Simulated Annealing'}</p>
              </div>
            </div>
            <div className="progress-bar mb-2">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-text-muted text-right">Progress: {progress.toFixed(0)}%</p>
          </div>

          <div className="card space-y-3">
            {[
              { label: 'Iteration', value: displayIterations.toLocaleString() },
              { label: 'Solutions Evaluated', value: displaySolutions.toLocaleString() },
              { label: 'Initial Cost', value: displayInitCost > 0 ? formatCost(displayInitCost) : '—' },
              { label: 'Best Cost', value: displayBestCost > 0 ? formatCost(displayBestCost) : '—' },
              { label: 'Improvement', value: displayImprovement > 0 ? formatPct(displayImprovement) : '—', accent: true },
            ].map(({ label, value, accent }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-text-muted">{label}</span>
                <span className={`text-sm font-semibold ${accent ? 'text-traffic-free' : 'text-text-primary'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Flow + Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <h3 className="section-header">Optimization Pipeline</h3>
            <div className="flex flex-col gap-2">
              {FLOW_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    i <= activeStep ? 'bg-quantum text-white' : 'bg-bg-secondary text-text-muted border border-border-default'
                  }`}>{i + 1}</div>
                  <div className="flex-1 pb-1">
                    <p className={`text-sm font-medium ${i <= activeStep ? 'text-text-primary' : 'text-text-muted'}`}>{step.label}</p>
                    <p className="text-xs text-text-muted">{step.desc}</p>
                  </div>
                  {i === activeStep && isOptimizing && (
                    <div className="w-2 h-2 rounded-full bg-quantum-hover animate-ping mt-2.5" />
                  )}
                  {i < activeStep && (
                    <CheckCircle className="w-4 h-4 text-traffic-free mt-1.5 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <h3 className="section-header">Cost Convergence</h3>
            {iterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={iterData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="iter" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8 }}
                    labelStyle={{ color: '#F8FAFC' }} />
                  <Legend wrapperStyle={{ color: '#94A3B8', fontSize: 11 }} />
                  <Line type="monotone" dataKey="current" name="Current" stroke="#3B82F6" dot={false} strokeWidth={1.5} />
                  <Line type="monotone" dataKey="best" name="Best" stroke="#A855F7" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  {isOptimizing ? (
                    <><Atom className="w-8 h-8 text-quantum-hover animate-spin mx-auto mb-2" />
                    <p className="text-text-muted text-sm">Computing solutions...</p></>
                  ) : (
                    <p className="text-text-muted text-sm">Run optimization to see convergence chart</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-blue-900/10 border-blue-700/30">
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="text-blue-400 font-semibold">ℹ Quantum-Inspired Simulation: </span>
          This system converts the Vehicle Routing Problem (VRP) into a QUBO-inspired cost minimization problem
          and uses Simulated Annealing to explore multiple route combinations. The Metropolis criterion mimics
          quantum tunnelling.&nbsp;
          <strong className="text-text-secondary">This is a classical quantum-inspired simulation</strong>,
          not an actual quantum computer.
        </p>
      </div>
    </div>
  );
}
