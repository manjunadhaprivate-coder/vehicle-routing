import { useNavigate } from 'react-router-dom';
import { Zap, Trophy, Users, Code2, Globe, ArrowRight, Truck } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function About() {
  const navigate = useNavigate();
  const { loadSampleData } = useAppStore(s => ({ loadSampleData: s.loadSampleData }));

  const handleJudgeDemo = () => { loadSampleData(); navigate('/optimize'); };

  const techStack = [
    { name: 'React + TypeScript', desc: 'Frontend framework',         color: '#4B8FF5' },
    { name: 'Vite',              desc: 'Build tool',                  color: '#F5C518' },
    { name: 'Tailwind CSS',      desc: 'Styling',                     color: '#06B6D4' },
    { name: 'Zustand',           desc: 'State management',            color: '#F97316' },
    { name: 'Leaflet + OSM',     desc: 'Map visualization',           color: '#10B981' },
    { name: 'Recharts',          desc: 'Data charts',                 color: '#4B8FF5' },
    { name: 'Simulated Annealing',desc: 'Quantum-inspired optimizer', color: '#F5C518' },
    { name: 'QUBO Cost Function', desc: 'Optimization objective',     color: '#F5C518' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Hero */}
      <div className="card text-center py-10"
        style={{ borderColor: 'rgba(245,197,24,0.3)', background: 'rgba(245,197,24,0.04)' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 16px',
          background: 'rgba(245,197,24,0.12)',
          border: '1.5px solid rgba(245,197,24,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Truck className="w-8 h-8" style={{ color: '#F5C518' }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#F0F6FF' }}>
          Quantum-Optimized Vehicle Routing System
        </h1>
        <p style={{ color: '#7FA0C0', maxWidth: 520, margin: '0 auto' }}>
          A Smart India Hackathon 2026 project demonstrating quantum-inspired optimization for intelligent logistics routing.
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <span className="quantum-badge">⚡ Quantum-Inspired</span>
          <span className="status-info">🗺 OpenStreetMap</span>
          <span className="status-success">✓ Open Source</span>
          <span className="status-warning">🏆 SIH 2026</span>
        </div>
      </div>

      {/* Judge Demo Mode */}
      <div className="card" style={{ borderColor: 'rgba(245,197,24,0.35)', background: 'rgba(245,197,24,0.05)' }}>
        <div className="flex items-start gap-4">
          <Trophy className="w-8 h-8 flex-shrink-0" style={{ color: '#F5C518' }} />
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1" style={{ color: '#F5C518' }}>🎯 Judge Demo Mode</h2>
            <p className="text-sm mb-4" style={{ color: '#7FA0C0' }}>
              Load the complete Vijayawada demo dataset (5 vehicles, 12 delivery locations) and
              jump straight to the optimization engine — perfect for a 5-minute SIH demo.
            </p>
            <button onClick={handleJudgeDemo} className="btn-primary flex items-center gap-2">
              <Zap className="w-4 h-4" /> Launch Judge Demo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card">
        <h2 className="section-header flex items-center gap-2">
          <Zap className="w-5 h-5" style={{ color: '#F5C518' }} /> How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Input Data',       desc: 'Add vehicles, delivery locations, and constraints' },
            { step: '2', title: 'Baseline Routing', desc: 'Nearest-neighbor heuristic creates initial routes' },
            { step: '3', title: 'Optimization',     desc: 'QUBO + Simulated Annealing explores better solutions' },
            { step: '4', title: 'Results',          desc: 'Reduced distance, time, and cost routes output' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center p-4 rounded-xl"
              style={{ background: '#061222', border: '1px solid #12293F' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(245,197,24,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', color: '#F5C518', fontWeight: 700, fontSize: 14,
              }}>{step}</div>
              <p className="font-semibold text-sm" style={{ color: '#F0F6FF' }}>{title}</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: '#3A5570' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <h2 className="section-header flex items-center gap-2">
          <Code2 className="w-5 h-5" style={{ color: '#7FA0C0' }} /> Technology Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {techStack.map(({ name, desc, color }) => (
            <div key={name} className="rounded-lg p-3"
              style={{ background: '#061222', border: '1px solid #12293F' }}>
              <p className="text-sm font-semibold" style={{ color }}>{name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#3A5570' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ background: 'rgba(29,111,235,0.06)', borderColor: 'rgba(29,111,235,0.2)' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#3A5570' }}>
          <span className="font-semibold" style={{ color: '#4B8FF5' }}>⚠ Prototype Disclaimer: </span>
          This application uses a <strong style={{ color: '#7FA0C0' }}>classical quantum-inspired simulation</strong> (Simulated Annealing + QUBO cost function) running on conventional hardware.
          It is not connected to a real quantum computer. Displayed metrics are calculated from actual optimization results — not hardcoded values.
        </p>
      </div>
    </div>
  );
}
