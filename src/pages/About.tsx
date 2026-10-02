import { useNavigate } from 'react-router-dom';
import { Atom, Zap, Trophy, Users, Code2, Globe, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function About() {
  const navigate = useNavigate();
  const { loadSampleData } = useAppStore(s => ({ loadSampleData: s.loadSampleData }));

  const handleJudgeDemo = () => {
    loadSampleData();
    navigate('/optimize');
  };

  const techStack = [
    { name: 'React + TypeScript', desc: 'Frontend framework', color: 'text-blue-400' },
    { name: 'Vite', desc: 'Build tool', color: 'text-yellow-400' },
    { name: 'Tailwind CSS', desc: 'Styling', color: 'text-cyan-400' },
    { name: 'Zustand', desc: 'State management', color: 'text-orange-400' },
    { name: 'Leaflet + OpenStreetMap', desc: 'Map visualization', color: 'text-green-400' },
    { name: 'Recharts', desc: 'Data charts', color: 'text-purple-400' },
    { name: 'Simulated Annealing', desc: 'Quantum-inspired optimizer', color: 'text-quantum-hover' },
    { name: 'QUBO Cost Function', desc: 'Optimization objective', color: 'text-quantum-hover' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Hero */}
      <div className="card border-quantum/40 bg-quantum/5 text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-quantum/20 border border-quantum/40 flex items-center justify-center mx-auto mb-4">
          <Atom className="w-8 h-8 text-quantum-hover" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Quantum-Optimized Vehicle Routing System</h1>
        <p className="text-text-secondary max-w-xl mx-auto">
          A Smart India Hackathon 2026 project demonstrating quantum-inspired optimization for intelligent logistics routing.
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <span className="quantum-badge">⚛ Quantum-Inspired</span>
          <span className="status-info">🗺 OpenStreetMap</span>
          <span className="status-success">✓ Open Source</span>
          <span className="status-warning">🏆 SIH 2026</span>
        </div>
      </div>

      {/* Judge Demo Mode */}
      <div className="card border-amber-700/40 bg-amber-900/10">
        <div className="flex items-start gap-4">
          <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-yellow-400 mb-1">🎯 Judge Demo Mode</h2>
            <p className="text-text-secondary text-sm mb-4">
              Load the complete Vijayawada demo dataset (5 vehicles, 12 delivery locations) and
              jump straight to the optimization engine — perfect for a 5-minute SIH demo.
            </p>
            <button onClick={handleJudgeDemo}
              className="btn-primary flex items-center gap-2">
              <Zap className="w-4 h-4" /> Launch Judge Demo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card">
        <h2 className="section-header flex items-center gap-2"><Zap className="w-5 h-5 text-quantum-hover" /> How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Input Data', desc: 'Add vehicles, delivery locations, and constraints' },
            { step: '2', title: 'Baseline Routing', desc: 'Nearest-neighbor heuristic creates initial routes' },
            { step: '3', title: 'Quantum Optimization', desc: 'QUBO + Simulated Annealing explores better solutions' },
            { step: '4', title: 'Results', desc: 'Reduced distance, time, and cost routes output' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center p-4 bg-bg-secondary rounded-xl border border-border-default">
              <div className="w-8 h-8 rounded-full bg-quantum/20 flex items-center justify-center mx-auto mb-3 text-quantum-hover font-bold">
                {step}
              </div>
              <p className="font-semibold text-text-primary text-sm">{title}</p>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <h2 className="section-header flex items-center gap-2"><Code2 className="w-5 h-5" /> Technology Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {techStack.map(({ name, desc, color }) => (
            <div key={name} className="bg-bg-secondary border border-border-default rounded-lg p-3">
              <p className={`text-sm font-semibold ${color}`}>{name}</p>
              <p className="text-xs text-text-muted mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card bg-blue-900/10 border-blue-700/30">
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="text-blue-400 font-semibold">⚠ Prototype Disclaimer: </span>
          This application uses a <strong className="text-text-secondary">classical quantum-inspired simulation</strong> (Simulated Annealing + QUBO cost function) running on conventional hardware.
          It is not connected to a real quantum computer. The quantum-inspired approach mimics the probabilistic exploration characteristics of quantum algorithms to achieve improved routing solutions compared to simple greedy heuristics.
          Displayed metrics are calculated from actual optimization results — not hardcoded values.
        </p>
      </div>
    </div>
  );
}
