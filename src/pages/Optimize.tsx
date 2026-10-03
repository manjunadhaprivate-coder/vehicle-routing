import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Settings2, AlertCircle, CheckCircle, ArrowRight, Cpu } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { solveBaseline } from '../engine/baseline';
import { runQuantumOptimizer } from '../engine/quantumOptimizer';
import type { OptimizationObjective } from '../types';

const OBJECTIVES: { value: OptimizationObjective; label: string; desc: string }[] = [
  { value: 'distance', label: 'Minimum Distance', desc: 'Minimize total travel distance' },
  { value: 'time',     label: 'Minimum Time',     desc: 'Minimize total travel time' },
  { value: 'cost',     label: 'Minimum Cost',     desc: 'Minimize total transportation cost' },
  { value: 'balanced', label: 'Balanced',         desc: 'Balance all objectives equally' },
];

export default function Optimize() {
  const navigate = useNavigate();
  const {
    vehicles, locations, settings, updateSettings,
    setOptimizationResult, setIsOptimizing, setOptimizationProgress, isOptimizing,
  } = useAppStore(s => ({
    vehicles: s.vehicles, locations: s.locations, settings: s.settings,
    updateSettings: s.updateSettings, setOptimizationResult: s.setOptimizationResult,
    setIsOptimizing: s.setIsOptimizing, setOptimizationProgress: s.setOptimizationProgress,
    isOptimizing: s.isOptimizing,
  }));

  const [validationError, setValidationError] = useState('');
  const deliveries = locations.filter(l => !l.isDepot);
  const canOptimize = vehicles.length > 0 && deliveries.length > 0;

  const handleStartOptimization = async () => {
    setValidationError('');
    if (!canOptimize) {
      setValidationError('Please add at least one vehicle and one delivery location before starting optimization.');
      return;
    }
    if (!locations.find(l => l.isDepot)) {
      setValidationError('A depot location is required. Please mark one location as Depot.');
      return;
    }
    navigate('/simulation');
    setIsOptimizing(true);
    setOptimizationProgress(0, 0, 0, 0, 0);
    try {
      const baseline = solveBaseline(vehicles, locations, settings);
      const { routes: optimized, stats } = await runQuantumOptimizer(
        baseline, vehicles, locations, settings,
        (iter, cur, best, sols) => {
          const pct = Math.min(99, (iter / settings.maxIterations) * 100);
          setOptimizationProgress(pct, iter, cur, best, sols);
        }
      );
      setOptimizationResult({ baseline, optimized, stats, completedAt: new Date() });
    } catch (err) {
      console.error(err);
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="page-title">Route Optimization</h2>
        <p className="page-subtitle">Configure the quantum-inspired optimization engine</p>
      </div>

      {/* Validation Status */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Vehicles', count: vehicles.length, ok: vehicles.length > 0, path: '/vehicles' },
          { label: 'Delivery Locations', count: deliveries.length, ok: deliveries.length > 0, path: '/locations' },
        ].map(({ label, count, ok, path }) => (
          <div key={label} className="card"
            style={{ borderColor: ok ? 'rgba(16,185,129,0.35)' : 'rgba(245,197,24,0.35)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#7FA0C0' }}>{label}</span>
              {ok
                ? <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                : <AlertCircle className="w-4 h-4" style={{ color: '#F5C518' }} />}
            </div>
            <p className="text-2xl font-bold mt-2" style={{ color: '#F0F6FF' }}>{count}</p>
            {!ok && (
              <button onClick={() => navigate(path)}
                className="text-xs mt-2 flex items-center gap-1"
                style={{ color: '#F5C518' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.textDecoration = 'underline'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.textDecoration = 'none'}>
                Add now <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Objective Selection */}
      <div className="card">
        <h3 className="section-header flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Optimization Objective
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OBJECTIVES.map(obj => (
            <button key={obj.value} onClick={() => updateSettings({ objective: obj.value })}
              className="text-left p-4 rounded-xl transition-all duration-200"
              style={settings.objective === obj.value ? {
                background: 'rgba(245,197,24,0.1)',
                border: '1px solid rgba(245,197,24,0.4)',
                color: '#F5C518',
              } : {
                background: '#061222',
                border: '1px solid #12293F',
                color: '#7FA0C0',
              }}>
              <p className="font-semibold text-sm">{obj.label}</p>
              <p className="text-xs mt-1 opacity-70">{obj.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Weight Sliders */}
      <div className="card">
        <h3 className="section-header flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Objective Weights
        </h3>
        <div className="space-y-4">
          {[
            { key: 'distanceWeight' as const, label: 'Distance Weight' },
            { key: 'timeWeight' as const,     label: 'Time Weight' },
            { key: 'costWeight' as const,     label: 'Cost Weight' },
          ].map(({ key, label }) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <label className="label mb-0">{label}</label>
                <span className="text-sm font-mono" style={{ color: '#F0F6FF' }}>{settings[key].toFixed(2)}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05"
                value={settings[key]}
                onChange={e => updateSettings({ [key]: +e.target.value })}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#F5C518', background: '#061222' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Iterations */}
      <div className="card">
        <h3 className="section-header">Simulation Parameters</h3>
        <div>
          <div className="flex justify-between mb-2">
            <label className="label mb-0">Max Iterations</label>
            <span className="font-mono" style={{ color: '#F0F6FF' }}>{settings.maxIterations.toLocaleString()}</span>
          </div>
          <input type="range" min="500" max="5000" step="500"
            value={settings.maxIterations}
            onChange={e => updateSettings({ maxIterations: +e.target.value })}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#F5C518', background: '#061222' }}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: '#3A5570' }}>
            <span>500 (fast)</span><span>5000 (thorough)</span>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="flex items-start gap-2 rounded-xl p-4"
          style={{ color: '#F5C518', background: 'rgba(245,197,24,0.07)', border: '1px solid rgba(245,197,24,0.25)' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{validationError}</p>
        </div>
      )}

      <button onClick={handleStartOptimization} disabled={isOptimizing}
        className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3">
        {isOptimizing ? (
          <><span className="animate-spin border-2 rounded-full w-5 h-5"
            style={{ borderColor: 'rgba(3,11,26,0.2)', borderTopColor: '#030B1A' }} />Optimization Running...</>
        ) : (
          <><Zap className="w-5 h-5" /> Start Quantum Optimization</>
        )}
      </button>

      <div className="card" style={{ background: 'rgba(245,197,24,0.04)', borderColor: 'rgba(245,197,24,0.2)' }}>
        <div className="flex items-start gap-3">
          <Cpu className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F5C518' }} />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#F5C518' }}>About the Algorithm</p>
            <p className="text-xs leading-relaxed" style={{ color: '#3A5570' }}>
              The system converts the VRP into a QUBO-inspired cost minimization problem and applies
              Simulated Annealing with quantum-inspired tunnelling. It uses 2-opt swaps and cross-route
              relocation operators.&nbsp;
              <strong style={{ color: '#7FA0C0' }}>This is a quantum-inspired classical simulation</strong>
              &nbsp;— not an actual quantum computer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
