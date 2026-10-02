import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Truck, MapPin, Zap, Activity, Route,
  Map, BarChart2, LineChart, Settings, Info, LogOut, Atom
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import clsx from 'clsx';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vehicles', label: 'Vehicles', icon: Truck },
  { path: '/locations', label: 'Locations', icon: MapPin },
  { separator: true },
  { path: '/optimize', label: 'Optimize', icon: Zap },
  { path: '/simulation', label: 'Simulation', icon: Atom },
  { path: '/routes', label: 'Routes', icon: Route },
  { separator: true },
  { path: '/map', label: 'Map View', icon: Map },
  { path: '/comparison', label: 'Comparison', icon: BarChart2 },
  { path: '/results', label: 'Results', icon: LineChart },
  { separator: true },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About', icon: Info },
];

export default function Sidebar() {
  const logout = useAppStore(s => s.logout);
  const navigate = useNavigate();
  const optimizationResult = useAppStore(s => s.optimizationResult);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border-default overflow-y-auto"
      style={{ background: '#111827' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border-default">
        <div className="w-9 h-9 rounded-lg bg-quantum/20 border border-quantum/40 flex items-center justify-center flex-shrink-0">
          <Atom className="w-5 h-5 text-quantum-hover" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-text-primary leading-tight">Quantum VRS</p>
          <p className="text-xs text-text-muted leading-tight">SIH 2026</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item, idx) => {
          if ('separator' in item) {
            return <div key={idx} className="my-3 border-t border-border-default/50" />;
          }
          const Icon = item.icon!;
          return (
            <NavLink
              key={item.path}
              to={item.path!}
              end={item.path === '/'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-quantum/15 text-purple-300 border border-quantum/30'
                    : 'text-text-muted hover:bg-bg-card hover:text-text-primary'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={clsx(
                      'w-4 h-4 flex-shrink-0 transition-colors',
                      isActive ? 'text-quantum-hover' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.label}</span>
                  {item.path === '/results' && optimizationResult && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-traffic-free flex-shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border-default">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
                     text-text-muted hover:bg-red-900/20 hover:text-red-400 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
