import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Quantum-Optimized Vehicle Routing System' },
  '/vehicles': { title: 'Fleet Management', subtitle: 'Add and manage your vehicle fleet' },
  '/locations': { title: 'Delivery Locations', subtitle: 'Manage delivery points and depot' },
  '/optimize': { title: 'Route Optimization', subtitle: 'Configure and launch optimization' },
  '/simulation': { title: 'Quantum Simulation', subtitle: 'Real-time quantum-inspired optimization engine' },
  '/routes': { title: 'Optimized Routes', subtitle: 'View computed vehicle routes' },
  '/map': { title: 'Map Visualization', subtitle: 'Interactive route map — Before vs After' },
  '/comparison': { title: 'Before vs After', subtitle: 'Compare baseline and optimized metrics' },
  '/results': { title: 'Results Dashboard', subtitle: 'Executive optimization summary' },
  '/settings': { title: 'Settings', subtitle: 'Configure optimization parameters' },
  '/about': { title: 'About', subtitle: 'Project information and judge demo mode' },
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, subtitle } = pageTitles[location.pathname] ?? { title: 'QVRS', subtitle: '' };
  const { optimizationResult, isOptimizing, auth } = useAppStore(s => ({
    optimizationResult: s.optimizationResult,
    isOptimizing: s.isOptimizing,
    auth: s.auth,
  }));

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-default flex-shrink-0"
      style={{ background: '#111827' }}>
      <div>
        <h1 className="text-lg font-bold text-text-primary">{title}</h1>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick action */}
        {!optimizationResult && !isOptimizing && (
          <button
            onClick={() => navigate('/optimize')}
            className="hidden sm:flex items-center gap-2 btn-primary text-xs py-1.5 px-3"
          >
            <Zap className="w-3.5 h-3.5" />
            Start Optimization
          </button>
        )}

        {optimizationResult && (
          <span className="status-success text-xs">
            ✓ Optimized
          </span>
        )}

        {isOptimizing && (
          <span className="quantum-badge animate-pulse">
            ⚛ Optimizing...
          </span>
        )}

        <button className="p-2 rounded-lg hover:bg-bg-card text-text-muted hover:text-text-primary transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-border-default">
          <div className="w-7 h-7 rounded-full bg-quantum/20 border border-quantum/40 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-quantum-hover" />
          </div>
          <span className="text-xs font-medium text-text-secondary hidden sm:block">
            {auth.user?.name ?? 'Demo User'}
          </span>
        </div>
      </div>
    </header>
  );
}
