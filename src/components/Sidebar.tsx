import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Truck, MapPin, Zap, Activity, Route,
  Map, BarChart2, LineChart, Settings, Info, LogOut
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import clsx from 'clsx';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vehicles', label: 'Vehicles', icon: Truck },
  { path: '/locations', label: 'Locations', icon: MapPin },
  { separator: true },
  { path: '/optimize', label: 'Optimize', icon: Zap },
  { path: '/simulation', label: 'Simulation', icon: Activity },
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
    <aside className="w-60 flex-shrink-0 flex flex-col overflow-y-auto"
      style={{ background: '#081A30', borderRight: '1px solid #12293F' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid #12293F' }}>
        {/* Truck icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: 'rgba(245,197,24,0.12)',
          border: '1.5px solid rgba(245,197,24,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
            stroke="#F5C518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="1"/>
            <path d="M16 8h4l3 5v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div className="min-w-0">
          <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F6FF', lineHeight: 1.2 }}>QVRS</p>
          <p style={{ fontSize: 10, color: '#3A5570', lineHeight: 1.3 }}>Smart Traffic System</p>
        </div>
      </div>

      {/* Yellow accent bar */}
      <div style={{ height: 2, background: 'repeating-linear-gradient(90deg, #F5C518 0px, #F5C518 16px, #081A30 16px, #081A30 22px)' }} />

      {/* Nav */}
      <nav className="flex-1 px-2 py-4" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item, idx) => {
          if ('separator' in item) {
            return <div key={idx} style={{ height: 1, background: '#12293F', margin: '8px 4px' }} />;
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
                    ? 'text-white'
                    : 'text-text-muted hover:text-text-primary'
                )
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(245,197,24,0.12)',
                border: '1px solid rgba(245,197,24,0.3)',
                color: '#F5C518',
              } : {}}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={clsx(
                      'w-4 h-4 flex-shrink-0 transition-colors',
                    )}
                    style={{ color: isActive ? '#F5C518' : '#3A5570' }}
                  />
                  <span style={{ color: isActive ? '#F5C518' : undefined }}>{item.label}</span>
                  {item.path === '/results' && optimizationResult && (
                    <span className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: '#10B981' }} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px', borderTop: '1px solid #12293F' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
          style={{ color: '#3A5570' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#3A5570'; }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
