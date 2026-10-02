import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Atom, Eye, EyeOff, Zap, MapPin, Network, UserPlus, LogIn } from 'lucide-react';

type Mode = 'login' | 'register';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function Login() {
  const navigate = useNavigate();
  const { login, register, auth } = useAppStore(s => ({
    login: s.login,
    register: s.register,
    auth: s.auth,
  }));

  // New users see Sign Up first; returning users can switch to Sign In
  const [mode, setMode] = useState<Mode>('register');

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Login-only
  const [remember, setRemember] = useState(false);

  // Register-only
  const [name, setName] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated) navigate('/');
  }, [auth.isAuthenticated, navigate]);

  // Reset state when switching mode
  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPwd('');
    setShowPwd(false);
    setShowConfirm(false);
  };

  // ── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Password is required.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ok = login(email.trim(), password);
    setLoading(false);
    if (!ok) setError('Incorrect email or password. Please try again.');
  };

  // ── Register ─────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Full name is required.'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPwd) { setError('Passwords do not match.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const err = register(name, email.trim(), password);
    setLoading(false);
    if (err) { setError(err); return; }
    // register() auto-logs in → useEffect navigates to '/'
  };

  // ── Left decorative panel (unchanged) ────────────────────────────────────
  const LeftPanel = (
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
  );

  // ── Right panel — Login form ───────────────────────────────────────────────
  const LoginForm = (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-quantum/20 border border-quantum/40 flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-7 h-7 text-quantum-hover" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
        <p className="text-text-muted text-sm mt-1">Sign in to your QVRS Dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label">Email Address</label>
          <input type="email" className="input-field" placeholder="you@example.com"
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
      </form>

      {/* Switch to register */}
      <p className="text-center text-sm text-text-muted mt-6">
        Don't have an account?{' '}
        <button onClick={() => switchMode('register')}
          className="text-quantum-hover hover:underline font-medium">
          Create account
        </button>
      </p>
    </div>
  );

  // ── Right panel — Register form ────────────────────────────────────────────
  const RegisterForm = (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-quantum/20 border border-quantum/40 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-7 h-7 text-quantum-hover" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Create Account</h1>
        <p className="text-text-muted text-sm mt-1">Register to access QVRS Dashboard</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input type="text" className="input-field" placeholder="Your full name"
            value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Email Address</label>
          <input type="email" className="input-field" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Password <span className="text-text-muted font-normal">(min. 6 characters)</span></label>
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} className="input-field pr-10"
              placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} className="input-field pr-10"
              placeholder="••••••••" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Inline mismatch hint */}
          {confirmPwd && password && confirmPwd !== password && (
            <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        {error && (
          <div className="status-error w-full justify-start px-3 py-2.5 rounded-lg text-sm">{error}</div>
        )}
        {successMsg && (
          <div className="status-success w-full justify-start px-3 py-2.5 rounded-lg text-sm">{successMsg}</div>
        )}

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          {loading ? (
            <><span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />Creating account...</>
          ) : (
            <><UserPlus className="w-4 h-4" />Create Account</>
          )}
        </button>
      </form>

      {/* Switch to login */}
      <p className="text-center text-sm text-text-muted mt-6">
        Already have an account?{' '}
        <button onClick={() => switchMode('login')}
          className="text-quantum-hover hover:underline font-medium">
          Sign in
        </button>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#0B1120' }}>
      {LeftPanel}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        {mode === 'login' ? LoginForm : RegisterForm}
      </div>
    </div>
  );
}
