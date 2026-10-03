/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Smart Traffic Theme Backgrounds ──────────────────────────────
        'bg-primary':    '#030B1A',   // deepest navy
        'bg-secondary':  '#061222',   // secondary sections
        'bg-panel':      '#081A30',   // sidebar / panels
        'bg-card':       '#0B2040',   // card surface
        'bg-card-hover': '#0E2850',   // card hover

        // ── Primary Accent — Traffic Yellow ────────────────────────────
        'quantum':        '#F5C518',  // remapped to yellow (keep alias working)
        'quantum-hover':  '#FFD740',
        'quantum-active': '#D4A800',

        // ── Tech / Action Blue ─────────────────────────────────────────
        'tech-blue':        '#1D6FEB',
        'tech-blue-hover':  '#4B8FF5',
        'tech-blue-active': '#1558CC',

        // ── Traffic Status ─────────────────────────────────────────────
        'traffic-free':       '#10B981',  // green
        'traffic-moderate':   '#F5C518',  // yellow
        'traffic-heavy':      '#F97316',  // orange
        'traffic-congested':  '#EF4444',  // red
        'traffic-critical':   '#DC2626',

        // ── Route Colors ───────────────────────────────────────────────
        'route-normal':    '#3D5A7A',
        'route-selected':  '#1D6FEB',
        'route-optimized': '#10B981',
        'route-quantum':   '#F5C518',

        // ── Typography ─────────────────────────────────────────────────
        'text-primary':   '#F0F6FF',
        'text-secondary': '#7FA0C0',
        'text-muted':     '#3A5570',

        // ── Borders ────────────────────────────────────────────────────
        'border-default': '#12293F',
        'border-active':  '#F5C518',
        'border-focus':   '#FFD740',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 8px rgba(245,197,24,0.2)' },
          '50%':     { boxShadow: '0 0 20px rgba(245,197,24,0.45)' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'yellow-sm': '0 0 12px rgba(245,197,24,0.18)',
        'yellow-md': '0 0 24px rgba(245,197,24,0.28)',
        'card':      '0 4px 24px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
}
