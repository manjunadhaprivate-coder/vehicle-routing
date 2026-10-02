/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary': '#0B1120',
        'bg-secondary': '#111827',
        'bg-panel': '#172033',
        'bg-card': '#1E293B',
        'bg-card-hover': '#26354A',
        // Quantum Brand
        'quantum': '#7C3AED',
        'quantum-hover': '#8B5CF6',
        'quantum-active': '#6D28D9',
        // Tech Blue
        'tech-blue': '#2563EB',
        'tech-blue-hover': '#3B82F6',
        'tech-blue-active': '#1D4ED8',
        // Traffic Colors
        'traffic-free': '#22C55E',
        'traffic-moderate': '#F59E0B',
        'traffic-heavy': '#F97316',
        'traffic-congested': '#EF4444',
        'traffic-critical': '#DC2626',
        // Route Colors
        'route-normal': '#64748B',
        'route-selected': '#3B82F6',
        'route-optimized': '#22C55E',
        'route-quantum': '#A855F7',
        // Text
        'text-primary': '#F8FAFC',
        'text-secondary': '#CBD5E1',
        'text-muted': '#94A3B8',
        // Borders
        'border-default': '#334155',
        'border-active': '#7C3AED',
        'border-focus': '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
