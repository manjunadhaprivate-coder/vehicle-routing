import { useNavigate } from 'react-router-dom';
import { Cpu, CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppStore } from '../store/appStore';
import { formatCost, formatPct } from '../utils/formatters';

const FLOW_STEPS = [
  { label: 'Initial Solution',       desc: 'Nearest-neighbor baseline' },
  { label: 'Candidate Solutions',    desc: 'Neighbourhood search' },
  { label: 'Quantum-Inspired Search',desc: 'QUBO cost function' },
  { label: 'Constraint Evaluation',  desc: 'Capacity & distance check' },
  { label: 'Best Solution',          desc: 'SA convergence' },
  { label: 'Optimized Route',        desc: 'Final output' },
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

  const tickStyle = { fill: '#7FA0C0', fontSize: 10 };
  const gridStyle = { strokeDasharray: '3 3', stroke: '#1A3A5C' };
  const tooltipStyle = { contentStyle: { background: '#0B2040', border: '1px solid #1A3A5C', borderRadius: 8 }, labelStyle: { color: '#F0F6FF' } };

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
                <CheckCircle className="w-6 h-6" style={{ color: '#10B981' }} />
              ) : isOptimizing ? (
                <Cpu className="w-6 h-6 animate-spin" style={{ color: '#F5C518' }} />
              ) : (
                <Activity className="w-6 h-6" style={{ color: '#3A5570' }} />
              )}
              <div>
                <p className="font-semibold" style={{ color: '#F0F6FF' }}>
                  {result ? 'Optimization Complete' : isOptimizing ? 'Optimizing...' : 'Waiting'}
                </p>
                <p className="text-xs" style={{ color: '#3A5570' }}>
                  {result?.stats.algorithm ?? 'QUBO + Simulated Annealing'}
                </p>
              </div>
            </div>
            <div className="progress-bar mb-2">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-right" style={{ color: '#3A5570' }}>Progress: {progress.toFixed(0)}%</p>
          </div>

          <div className="card space-y-3">
            {[
              { label: 'Iteration',          value: displayIterations.toLocaleString() },
              { label: 'Solutions Evaluated',value: displaySolutions.toLocaleString() },
              { label: 'Initial Cost',       value: displayInitCost > 0 ? formatCost(displayInitCost) : '—' },
              { label: 'Best Cost',          value: displayBestCost > 0 ? formatCost(displayBestCost) : '—' },
              { label: 'Improvement',        value: displayImprovement > 0 ? formatPct(displayImprovement) : '—', accent: true },
            ].map(({ label, value, accent }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs" style={{ color: '#3A5570' }}>{label}</span>
                <span className="text-sm font-semibold"
                  style={{ color: accent ? '#10B981' : '#F0F6FF' }}>{value}</span>
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
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-500"
                    style={i <= activeStep
                      ? { background: '#F5C518', color: '#030B1A' }
                      : { background: '#061222', color: '#3A5570', border: '1px solid #12293F' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="text-sm font-medium"
                      style={{ color: i <= activeStep ? '#F0F6FF' : '#3A5570' }}>{step.label}</p>
                    <p className="text-xs" style={{ color: '#3A5570' }}>{step.desc}</p>
                  </div>
                  {i === activeStep && isOptimizing && (
                    <div className="w-2 h-2 rounded-full animate-ping mt-2.5"
                      style={{ background: '#F5C518' }} />
                  )}
                  {i < activeStep && (
                    <CheckCircle className="w-4 h-4 mt-1.5 flex-shrink-0" style={{ color: '#10B981' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="section-header">Cost Convergence</h3>
            {iterData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={iterData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="iter" tick={tickStyle} />
                  <YAxis tick={tickStyle} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ color: '#7FA0C0', fontSize: 11 }} />
                  <Line type="monotone" dataKey="current" name="Current" stroke="#1D6FEB" dot={false} strokeWidth={1.5} />
                  <Line type="monotone" dataKey="best" name="Best" stroke="#F5C518" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  {isOptimizing ? (
                    <><Cpu className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: '#F5C518' }} />
                    <p className="text-sm" style={{ color: '#3A5570' }}>Computing solutions...</p></>
                  ) : (
                    <p className="text-sm" style={{ color: '#3A5570' }}>Run optimization to see convergence chart</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ background: 'rgba(29,111,235,0.05)', borderColor: 'rgba(29,111,235,0.2)' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#3A5570' }}>
          <span className="font-semibold" style={{ color: '#4B8FF5' }}>ℹ Quantum-Inspired Simulation: </span>
          This system converts the Vehicle Routing Problem (VRP) into a QUBO-inspired cost minimization problem
          and uses Simulated Annealing to explore multiple route combinations. The Metropolis criterion mimics
          quantum tunnelling.&nbsp;
          <strong style={{ color: '#7FA0C0' }}>This is a classical quantum-inspired simulation</strong>,
          not an actual quantum computer.
        </p>
      </div>
    </div>
  );
}
