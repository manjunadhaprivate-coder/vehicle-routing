import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Atom, Eye, EyeOff, Zap, MapPin, Network } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, auth } = useAppStore(s => ({ login: s.login, auth: s.auth }));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) navigate('/');
  }, [auth.isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email.trim(), password);
    setLoading(false);
    if (!ok) setError('Invalid credentials. Use demo@sih.com / sih2026');
  };

  const handleDemo = async () => {
    setEmail('demo@sih.com');
    setPassword('sih2026');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    login('demo@sih.com', 'sih2026');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0B1120' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #111827 0%, #172033 50%, #0f1a2e 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-purple-700/20 animate-pulse-slow"
              style={{ width: `${90 + i * 60}px`, height: `${90 + i * 60}px`,
                top: `${8 + i * 9}%`, left: `${-12 + i * 6}%`,
                animationDelay: `${i * 0.4}s`, opacity: 0.25 - i * 0.02 }} />
          ))}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 600">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            {[[60,80,200,200],[200,200,340,110],[200,200,300,350],[200,200,90,310],[90,310,200,460],[300,350,200,460]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth="1"/>
            ))}
            {[[60,80],[200,200],[340,110],[300,350],[90,310],[200,460]].map(([cx,cy],i)=>(
              <circle key={i} cx={cx} cy={cy} r="5" fill="#7C3AED" opacity="0.7"/>
            ))}
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-quantum/20 border border-quantum/40 flex items-center justify-center">
              <Atom className="w-6 h-6 text-quantum-hover" />
            </div>
            <div>
              <p className="font-bold text-text-primary text-lg leading-tight">Quantum VRS</p>
              <p className="text-xs text-text-muted">Smart India Hackathon 2026</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-text-primary leading-tight mb-4">
            Quantum-Optimized<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Vehicle Routing
            </span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            AI-powered logistics optimization using quantum-inspired algorithms to minimize distance, time, and cost.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { icon: Zap, label: 'Faster Routes', value: 'Up to 25%' },
            { icon: MapPin, label: 'Distance Saved', value: '43 km avg' },
            { icon: Network, label: 'Cost Reduced', value: '₹1,075 avg' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <Icon className="w-5 h-5 text-quantum-hover mx-auto mb-2" />
              <p className="text-xs text-text-muted">{label}</p>
              <p className="text-sm font-bold text-text-primary mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-quantum/20 border border-quantum/40 flex items-center justify-center mx-auto mb-4">
              <Atom className="w-7 h-7 text-quantum-hover" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
            <p className="text-text-muted text-sm mt-1">Sign in to your QVRS Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email / Username</label>
              <input type="email" className="input-field" placeholder="demo@sih.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input-field pr-10"
                  placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" checked={remember}
                onChange={e => setRemember(e.target.checked)} className="w-4 h-4 accent-purple-500" />
              <label htmlFor="remember" className="text-sm text-text-secondary">Remember Me</label>
            </div>

            {error && (
              <div className="status-error w-full justify-start px-3 py-2.5 rounded-lg text-sm">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? (
                <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />Signing in...</>
              ) : 'Sign In'}
            </button>
            <button type="button" onClick={handleDemo} disabled={loading}
              className="btn-secondary w-full py-3 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-quantum-hover" />Demo Login (SIH Judge)
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl border border-border-default bg-bg-card">
            <p className="text-xs text-text-muted text-center mb-2">Demo Credentials</p>
            <div className="flex justify-center gap-6 text-xs">
              <span><span className="text-text-muted">Email: </span>
                <span className="font-mono text-quantum-hover">demo@sih.com</span></span>
              <span><span className="text-text-muted">Password: </span>
                <span className="font-mono text-quantum-hover">sih2026</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
