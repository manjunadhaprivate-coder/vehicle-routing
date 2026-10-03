import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Eye, EyeOff, UserPlus, LogIn, Zap, MapPin, Network } from 'lucide-react';

type Mode = 'login' | 'register';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

// ── Compact delivery truck SVG ─────────────────────────────────────────────
function TruckSVG({ driving }: { driving: boolean }) {
  const ws = driving ? 'wheel-spin-anim' : '';
  return (
    <svg viewBox="0 0 138 60" width="138" height="60"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* ── Cargo box ── */}
      <rect x="1" y="10" width="82" height="36" rx="3"
        fill="#1E3A5F" stroke="#F59E0B" strokeWidth="1.5"/>
      {/* Cargo ribs */}
      <line x1="28" y1="11" x2="28" y2="45" stroke="#0F2744" strokeWidth="1"/>
      <line x1="55" y1="11" x2="55" y2="45" stroke="#0F2744" strokeWidth="1"/>
      {/* QVRS label plate */}
      <rect x="10" y="20" width="44" height="16" rx="2"
        fill="#0F2744" stroke="#F59E0B" strokeWidth="0.8" opacity="0.9"/>
      <text x="32" y="32" textAnchor="middle" fill="#F59E0B"
        fontSize="7.5" fontWeight="bold" fontFamily="system-ui,sans-serif">QVRS</text>
      {/* Rear door line */}
      <line x1="82" y1="11" x2="82" y2="45" stroke="#F59E0B" strokeWidth="1" opacity="0.6"/>
      {/* Rear door handle */}
      <rect x="78" y="25" width="3" height="10" rx="1.5"
        fill="#F59E0B" opacity="0.7"/>
      {/* Exhaust pipe */}
      <rect x="79" y="8" width="4" height="6" rx="1" fill="#475569"/>
      <circle cx="81" cy="8" r="2" fill="#334155"/>

      {/* ── Cab ── */}
      <rect x="83" y="17" width="44" height="29" rx="4"
        fill="#1E3A5F" stroke="#F59E0B" strokeWidth="1.5"/>
      {/* Roof air deflector */}
      <path d="M87 17 Q102 7 123 13 L127 17Z"
        fill="#F59E0B" opacity="0.9"/>
      {/* Roof beacon */}
      <circle cx="115" cy="12" r="2.5" fill="#EF4444" opacity="0.8"/>
      {/* Windshield */}
      <rect x="90" y="21" width="24" height="15" rx="2.5"
        fill="#93C5FD" opacity="0.65"/>
      {/* Windshield glare */}
      <line x1="93" y1="22" x2="97" y2="33"
        stroke="white" strokeWidth="1.2" opacity="0.35"/>
      {/* Cab door line */}
      <line x1="107" y1="23" x2="107" y2="45"
        stroke="#F59E0B" strokeWidth="0.8" opacity="0.5"/>
      {/* Door handle */}
      <rect x="109" y="33" width="6" height="2.5" rx="1.2"
        fill="#94A3B8" opacity="0.7"/>
      {/* Front grille/bumper */}
      <rect x="125" y="33" width="9" height="9" rx="1"
        fill="#F59E0B"/>
      <line x1="126" y1="35.5" x2="133" y2="35.5"
        stroke="#0F172A" strokeWidth="0.9"/>
      <line x1="126" y1="38"   x2="133" y2="38"
        stroke="#0F172A" strokeWidth="0.9"/>
      <line x1="126" y1="40.5" x2="133" y2="40.5"
        stroke="#0F172A" strokeWidth="0.9"/>
      {/* Headlight */}
      <rect x="125" y="24" width="9" height="6" rx="1"
        fill="#FEF9C3" opacity="0.85"/>
      <rect x="126" y="25" width="7" height="4" rx="0.5"
        fill="#FDE68A"/>

      {/* ── Rear wheel ── */}
      <g className={ws}
        style={{ transformOrigin: '22px 52px', transformBox: 'fill-box' }}>
        <circle cx="22" cy="52" r="9.5" fill="#0F172A" stroke="#64748B" strokeWidth="2"/>
        <circle cx="22" cy="52" r="3.5"  fill="#334155"/>
        <line x1="22" y1="42.5" x2="22" y2="61.5" stroke="#94A3B8" strokeWidth="1.3"/>
        <line x1="12.5" y1="52" x2="31.5" y2="52" stroke="#94A3B8" strokeWidth="1.3"/>
        <line x1="15.3" y1="45.3" x2="28.7" y2="58.7" stroke="#94A3B8" strokeWidth="1"/>
        <line x1="28.7" y1="45.3" x2="15.3" y2="58.7" stroke="#94A3B8" strokeWidth="1"/>
        {/* Tyre tread dots */}
        <circle cx="22" cy="42.5" r="1" fill="#F59E0B" opacity="0.7"/>
        <circle cx="31.5" cy="52"  r="1" fill="#F59E0B" opacity="0.7"/>
      </g>

      {/* ── Front wheel ── */}
      <g className={ws}
        style={{ transformOrigin: '105px 52px', transformBox: 'fill-box' }}>
        <circle cx="105" cy="52" r="9.5" fill="#0F172A" stroke="#64748B" strokeWidth="2"/>
        <circle cx="105" cy="52" r="3.5"  fill="#334155"/>
        <line x1="105" y1="42.5" x2="105" y2="61.5" stroke="#94A3B8" strokeWidth="1.3"/>
        <line x1="95.5"  y1="52"  x2="114.5" y2="52" stroke="#94A3B8" strokeWidth="1.3"/>
        <line x1="98.3"  y1="45.3" x2="111.7" y2="58.7" stroke="#94A3B8" strokeWidth="1"/>
        <line x1="111.7" y1="45.3" x2="98.3"  y2="58.7" stroke="#94A3B8" strokeWidth="1"/>
        <circle cx="105"  cy="42.5" r="1" fill="#F59E0B" opacity="0.7"/>
        <circle cx="114.5" cy="52"  r="1" fill="#F59E0B" opacity="0.7"/>
      </g>

      {/* ── Dust puffs (behind rear wheel, only when driving) ── */}
      {driving && (
        <>
          <ellipse cx="12" cy="54" rx="5" ry="3"
            fill="#94A3B8" opacity="0.18" className="dust-puff-anim"
            style={{ animationDelay: '0s' }}/>
          <ellipse cx="6" cy="56" rx="3.5" ry="2"
            fill="#94A3B8" opacity="0.12" className="dust-puff-anim"
            style={{ animationDelay: '0.18s' }}/>
        </>
      )}
    </svg>
  );
}

// ── Road strip component ────────────────────────────────────────────────────
function RoadStrip({ driving }: { driving: boolean }) {
  return (
    <div style={{
      width: '100%', height: 70, position: 'relative',
      background: '#111827', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Yellow left edge line */}
      <div style={{
        position: 'absolute', left: 0, top: 4,
        width: '100%', height: 3, background: '#F59E0B',
      }}/>
      {/* Yellow right edge line */}
      <div style={{
        position: 'absolute', left: 0, bottom: 4,
        width: '100%', height: 3, background: '#F59E0B',
      }}/>
      {/* White dashed centre line */}
      <div
        className={driving ? 'road-scroll-anim' : ''}
        style={{
          position: 'absolute', left: 0, top: '50%',
          transform: 'translateY(-50%)',
          width: '200%', height: 3,
          backgroundImage: 'repeating-linear-gradient(90deg, #E2E8F0 0px, #E2E8F0 30px, transparent 30px, transparent 60px)',
          backgroundSize: '60px 3px',
        }}
      />
      {/* Truck sliding across */}
      <div
        className={driving ? 'truck-driving' : 'truck-idle'}
        style={{
          position: 'absolute',
          bottom: 6,
          left: 0,
          willChange: 'transform',
        }}
      >
        <TruckSVG driving={driving}/>
      </div>
    </div>
  );
}

// ── Traffic-themed input ────────────────────────────────────────────────────
function TInput({
  label, type, placeholder, value, onChange, required, children,
}: {
  label: string; type: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; children?: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500,
        color: '#94A3B8', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          className="input-traffic"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            width: '100%', background: '#0D1B2E',
            border: '1.5px solid #374151', borderRadius: 8,
            padding: '10px 14px', color: '#F8FAFC',
            fontSize: 14, boxSizing: 'border-box',
          }}
        />
        {children}
      </div>
    </div>
  );
}

// ── Eye toggle button ───────────────────────────────────────────────────────
function EyeBtn({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      position: 'absolute', right: 12, top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748B', background: 'none', border: 'none',
      cursor: 'pointer', padding: 0, display: 'flex',
    }}>
      {show ? <EyeOff size={16}/> : <Eye size={16}/>}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export default function Login() {
  const navigate = useNavigate();
  const { login, register, auth } = useAppStore(s => ({
    login: s.login,
    register: s.register,
    auth: s.auth,
  }));

  // ── All existing state (UNCHANGED) ──────────────────────────────────────
  const [mode, setMode] = useState<Mode>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [name, setName] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (auth.isAuthenticated) navigate('/');
  }, [auth.isAuthenticated, navigate]);

  // ── All existing handlers (UNCHANGED) ───────────────────────────────────
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

  // ── Left decorative panel — road network theme ───────────────────────────
  const LeftPanel = (
    <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060D1A 0%, #0D1B2E 50%, #0A1628 100%)' }}>

      {/* Road network background SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {/* Highway lines */}
        <line x1="40"  y1="0"   x2="40"  y2="600" stroke="#F59E0B" strokeWidth="2" opacity="0.07"/>
        <line x1="200" y1="0"   x2="200" y2="600" stroke="#F59E0B" strokeWidth="2" opacity="0.07"/>
        <line x1="360" y1="0"   x2="360" y2="600" stroke="#F59E0B" strokeWidth="2" opacity="0.07"/>
        <line x1="0"   y1="120" x2="400" y2="120" stroke="#F59E0B" strokeWidth="2" opacity="0.07"/>
        <line x1="0"   y1="300" x2="400" y2="300" stroke="#F59E0B" strokeWidth="2" opacity="0.07"/>
        <line x1="0"   y1="480" x2="400" y2="480" stroke="#F59E0B" strokeWidth="2" opacity="0.07"/>
        {/* Route paths */}
        {[
          [40,120,200,120],[200,120,360,120],
          [200,120,200,300],[200,300,360,480],
          [40,120,40,300],[40,300,200,480],
          [360,120,360,300],[360,300,200,480],
        ].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#F59E0B" strokeWidth="1.5" opacity="0.18"/>
        ))}
        {/* Route nodes (intersections) */}
        {[
          [40,120],[200,120],[360,120],
          [40,300],[200,300],[360,300],
          [200,480],
        ].map(([cx,cy],i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="7" fill="#F59E0B" opacity="0.12"/>
            <circle cx={cx} cy={cy} r="3.5" fill="#F59E0B" opacity="0.55"/>
          </g>
        ))}
        {/* Animated route highlight */}
        <polyline points="40,120 200,120 200,300 200,480"
          fill="none" stroke="#F59E0B" strokeWidth="2.5" opacity="0.22"
          strokeDasharray="8,6"/>
        {/* Small vehicle dots on roads */}
        <circle cx="120" cy="120" r="4" fill="#22C55E" opacity="0.7"/>
        <circle cx="280" cy="300" r="4" fill="#22C55E" opacity="0.6"/>
        <circle cx="200" cy="200" r="4" fill="#F59E0B" opacity="0.7"/>
        {/* Lane centre dashes - vertical road */}
        {[140,180,220,260,320,360,400,440].map((y,i) => (
          <rect key={i} x="198.5" y={y} width="3" height="14"
            fill="#E2E8F0" opacity="0.12" rx="1"/>
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(245,158,11,0.15)',
            border: '1.5px solid rgba(245,158,11,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
              stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="1"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-text-primary text-lg leading-tight">Quantum VRS</p>
            <p className="text-xs" style={{ color: '#64748B' }}>Smart India Hackathon 2026</p>
          </div>
        </div>

        <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: '#F8FAFC' }}>
          Quantum-Optimized<br />
          <span style={{
            background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Vehicle Routing
          </span>
        </h2>
        <p style={{ color: '#94A3B8', fontSize: 16, lineHeight: 1.7 }}>
          AI-powered logistics optimization using quantum-inspired algorithms to minimize distance,
          time, and transportation cost.
        </p>
      </div>

      {/* Stat cards */}
      <div className="relative z-10 grid grid-cols-3 gap-4">
        {[
          { icon: Zap, label: 'Faster Routes', value: 'Up to 25%', color: '#F59E0B' },
          { icon: MapPin, label: 'Distance Saved', value: '43 km avg', color: '#22C55E' },
          { icon: Network, label: 'Cost Reduced', value: '₹1,075 avg', color: '#3B82F6' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '14px 10px', textAlign: 'center',
          }}>
            <Icon size={18} color={color} style={{ margin: '0 auto 6px' }}/>
            <p style={{ fontSize: 11, color: '#64748B', marginBottom: 3 }}>{label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Shared right-panel wrapper styles ────────────────────────────────────
  const panelBg: React.CSSProperties = {
    background: '#060D1A',
    minHeight: '100vh',
  };

  // ── Login form — traffic theme ────────────────────────────────────────────
  const LoginForm = (
    <div style={{ width: '100%', maxWidth: 420 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px',
          background: 'rgba(245,158,11,0.12)',
          border: '1.5px solid rgba(245,158,11,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LogIn size={26} color="#F59E0B"/>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
          Welcome Back
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, marginTop: 6 }}>
          Sign in to your QVRS Dashboard
        </p>
      </div>

      {/* Road accent bar */}
      <div style={{
        height: 4, borderRadius: 2, marginBottom: 28,
        background: 'repeating-linear-gradient(90deg, #F59E0B 0px, #F59E0B 20px, #0D1B2E 20px, #0D1B2E 26px)',
      }}/>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Email */}
        <TInput label="Email Address" type="email" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} required/>

        {/* Password */}
        <TInput label="Password" type={showPwd ? 'text' : 'password'}
          placeholder="••••••••" value={password}
          onChange={e => setPassword(e.target.value)} required>
          <EyeBtn show={showPwd} onClick={() => setShowPwd(!showPwd)}/>
        </TInput>

        {/* Remember me */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input id="remember" type="checkbox" checked={remember}
            onChange={e => setRemember(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#F59E0B' }}/>
          <label htmlFor="remember" style={{ fontSize: 14, color: '#94A3B8' }}>
            Remember Me
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="status-error" style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Sign In button */}
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '12px 0',
          background: loading ? '#374151' : '#1D4ED8',
          color: '#F8FAFC', fontWeight: 700, fontSize: 15,
          border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 0.2s',
        }}>
          {loading ? (
            <>
              <span style={{
                width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%',
                display: 'inline-block', animation: 'wheel-spin 0.7s linear infinite',
              }}/>
              Signing in…
            </>
          ) : (
            <><LogIn size={16}/> Sign In</>
          )}
        </button>
      </form>

      {/* Switch to register */}
      <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B', marginTop: 24 }}>
        Don't have an account?{' '}
        <button onClick={() => switchMode('register')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#F59E0B', fontWeight: 600, fontSize: 14,
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Create account
        </button>
      </p>
    </div>
  );

  // ── Register form — traffic theme + truck animation ───────────────────────
  const RegisterForm = (
    <div style={{ width: '100%', maxWidth: 420 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px',
          background: 'rgba(245,158,11,0.12)',
          border: '1.5px solid rgba(245,158,11,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <UserPlus size={26} color="#F59E0B"/>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
          Create Account
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, marginTop: 6 }}>
          Register to access QVRS Dashboard
        </p>
      </div>

      {/* Road accent bar */}
      <div style={{
        height: 4, borderRadius: 2, marginBottom: 24,
        background: 'repeating-linear-gradient(90deg, #F59E0B 0px, #F59E0B 20px, #0D1B2E 20px, #0D1B2E 26px)',
      }}/>

      {/* Form — existing fields + validation UNCHANGED */}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Full Name */}
        <TInput label="Full Name" type="text" placeholder="Your full name"
          value={name} onChange={e => setName(e.target.value)} required/>

        {/* Email */}
        <TInput label="Email Address" type="email" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)} required/>

        {/* Password */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500,
            color: '#94A3B8', marginBottom: 6 }}>
            Password{' '}
            <span style={{ color: '#64748B', fontWeight: 400 }}>(min. 6 characters)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPwd ? 'text' : 'password'}
              className="input-traffic"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', background: '#0D1B2E',
                border: '1.5px solid #374151', borderRadius: 8,
                padding: '10px 40px 10px 14px',
                color: '#F8FAFC', fontSize: 14, boxSizing: 'border-box',
              }}
            />
            <EyeBtn show={showPwd} onClick={() => setShowPwd(!showPwd)}/>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500,
            color: '#94A3B8', marginBottom: 6 }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              className="input-traffic"
              placeholder="••••••••"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              required
              style={{
                width: '100%', background: '#0D1B2E',
                border: '1.5px solid #374151', borderRadius: 8,
                padding: '10px 40px 10px 14px',
                color: '#F8FAFC', fontSize: 14, boxSizing: 'border-box',
              }}
            />
            <EyeBtn show={showConfirm} onClick={() => setShowConfirm(!showConfirm)}/>
          </div>
          {/* Inline mismatch hint — UNCHANGED logic */}
          {confirmPwd && password && confirmPwd !== password && (
            <p style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>
              Passwords do not match
            </p>
          )}
        </div>

        {/* Error / success messages — UNCHANGED */}
        {error && (
          <div className="status-error" style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div className="status-success" style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
            {successMsg}
          </div>
        )}

        {/* ── Create Account button — traffic yellow + hazard stripes ── */}
        <button
          type="submit"
          disabled={loading}
          className="btn-traffic"
          style={{
            width: '100%', padding: '13px 28px',
            fontSize: 15, letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <>
              {/* Spinning wheel as loader */}
              <span style={{
                width: 16, height: 16,
                border: '2.5px solid rgba(0,0,0,0.2)',
                borderTopColor: '#0F172A',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'wheel-spin 0.6s linear infinite',
              }}/>
              Setting up your route…
            </>
          ) : (
            <><UserPlus size={16}/> Create Account</>
          )}
        </button>
      </form>

      {/* Switch to login — UNCHANGED logic */}
      <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B', marginTop: 20 }}>
        Already have an account?{' '}
        <button onClick={() => switchMode('login')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#F59E0B', fontWeight: 600, fontSize: 14,
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Sign in
        </button>
      </p>

      {/* ── Road + Truck animation ── tied to `loading` state ───────────── */}
      <div style={{ marginTop: 20 }}>
        {/* Small sign above road */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginBottom: 6,
        }}>
          <div style={{
            height: 1, flex: 1,
            background: 'repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 8px, transparent 8px, transparent 16px)',
          }}/>
          <span style={{ fontSize: 10, color: '#475569', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
            {loading ? '🚛  EN ROUTE  🚛' : '⬛  QVRS LOGISTICS  ⬛'}
          </span>
          <div style={{
            height: 1, flex: 1,
            background: 'repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 8px, transparent 8px, transparent 16px)',
          }}/>
        </div>

        {/* Road with travelling truck */}
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #1E293B' }}>
          <RoadStrip driving={loading}/>
        </div>
      </div>
    </div>
  );

  // ── Page shell ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', ...panelBg }}>
      {LeftPanel}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', overflowY: 'auto',
        background: '#060D1A',
      }}>
        {mode === 'login' ? LoginForm : RegisterForm}
      </div>
    </div>
  );
}
