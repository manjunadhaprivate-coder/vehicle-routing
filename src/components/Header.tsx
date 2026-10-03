import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/':           { title: 'Dashboard',         subtitle: 'Quantum-Optimized Vehicle Routing System' },
  '/vehicles':   { title: 'Fleet Management',  subtitle: 'Add and manage your vehicle fleet' },
  '/locations':  { title: 'Delivery Locations',subtitle: 'Manage delivery points and depot' },
  '/optimize':   { title: 'Route Optimization',subtitle: 'Configure and launch optimization' },
  '/simulation': { title: 'Optimization Engine',subtitle: 'Real-time quantum-inspired optimization' },
  '/routes':     { title: 'Optimized Routes',  subtitle: 'View computed vehicle routes' },
  '/map':        { title: 'Map Visualization', subtitle: 'Interactive route map — Before vs After' },
  '/comparison': { title: 'Before vs After',   subtitle: 'Compare baseline and optimized metrics' },
  '/results':    { title: 'Results Dashboard', subtitle: 'Executive optimization summary' },
  '/settings':   { title: 'Settings',          subtitle: 'Configure optimization parameters' },
  '/about':      { title: 'About',             subtitle: 'Project information and judge demo mode' },
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
    <header className="flex items-center justify-between px-6 py-4 flex-shrink-0"
      style={{ background: '#081A30', borderBottom: '1px solid #12293F' }}>
      <div>
        <h1 className="text-lg font-bold" style={{ color: '#F0F6FF' }}>{title}</h1>
        <p className="text-xs" style={{ color: '#3A5570' }}>{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {!optimizationResult && !isOptimizing && (
          <button
            onClick={() => navigate('/optimize')}
            className="hidden sm:flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg font-bold transition-all"
            style={{ background: '#F5C518', color: '#030B1A', boxShadow: '0 0 12px rgba(245,197,24,0.25)' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#FFD740'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#F5C518'}
          >
            <Zap className="w-3.5 h-3.5" />
            Start Optimization
          </button>
        )}

        {optimizationResult && (
          <span className="status-success text-xs">✓ Optimized</span>
        )}

        {isOptimizing && (
          <span className="quantum-badge animate-pulse">⚡ Optimizing...</span>
        )}

        <button className="p-2 rounded-lg transition-colors"
          style={{ color: '#3A5570' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0B2040'; (e.currentTarget as HTMLButtonElement).style.color = '#7FA0C0'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#3A5570'; }}>
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid #12293F' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(245,197,24,0.1)',
            border: '1.5px solid rgba(245,197,24,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User className="w-3.5 h-3.5" style={{ color: '#F5C518' }} />
          </div>
          <span className="text-xs font-medium hidden sm:block" style={{ color: '#7FA0C0' }}>
            {auth.user?.name ?? 'Traffic Operator'}
          </span>
        </div>
      </div>
    </header>
  );
}
