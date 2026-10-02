import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Vehicle, Location, OptimizationResult, AppSettings, AuthState
} from '../types';
import { sampleVehicles, sampleLocations, defaultSettings } from '../data/sampleData';

interface AppState {
  // Auth
  auth: AuthState;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Data
  vehicles: Vehicle[];
  locations: Location[];
  addVehicle: (v: Vehicle) => void;
  updateVehicle: (v: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addLocation: (l: Location) => void;
  updateLocation: (l: Location) => void;
  deleteLocation: (id: string) => void;
  loadSampleData: () => void;
  clearData: () => void;

  // Optimization
  optimizationResult: OptimizationResult | null;
  isOptimizing: boolean;
  optimizationProgress: number;
  currentIteration: number;
  currentCost: number;
  bestCost: number;
  solutionsEvaluated: number;
  setOptimizationResult: (r: OptimizationResult) => void;
  setIsOptimizing: (v: boolean) => void;
  setOptimizationProgress: (pct: number, iter: number, cur: number, best: number, sols: number) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;

  // UI
  activeRoute: string | null;
  setActiveRoute: (id: string | null) => void;
  mapMode: 'before' | 'after';
  setMapMode: (m: 'before' | 'after') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────────────────────────────
      auth: { isAuthenticated: false },
      login: (email, password) => {
        if (email === 'demo@sih.com' && password === 'sih2026') {
          set({ auth: { isAuthenticated: true, user: { email, name: 'SIH Demo User' } } });
          return true;
        }
        return false;
      },
      logout: () => set({ auth: { isAuthenticated: false } }),

      // ── Data ──────────────────────────────────────────────────────────
      vehicles: [],
      locations: [],
      addVehicle: (v) => {
        const existing = get().vehicles.find(x => x.id === v.id);
        if (existing) throw new Error(`Vehicle ID "${v.id}" already exists`);
        set(s => ({ vehicles: [...s.vehicles, v] }));
      },
      updateVehicle: (v) =>
        set(s => ({ vehicles: s.vehicles.map(x => (x.id === v.id ? v : x)) })),
      deleteVehicle: (id) =>
        set(s => ({ vehicles: s.vehicles.filter(x => x.id !== id) })),

      addLocation: (l) => {
        const existing = get().locations.find(x => x.id === l.id);
        if (existing) throw new Error(`Location ID "${l.id}" already exists`);
        set(s => ({ locations: [...s.locations, l] }));
      },
      updateLocation: (l) =>
        set(s => ({ locations: s.locations.map(x => (x.id === l.id ? l : x)) })),
      deleteLocation: (id) =>
        set(s => ({ locations: s.locations.filter(x => x.id !== id) })),

      loadSampleData: () =>
        set({ vehicles: sampleVehicles, locations: sampleLocations, optimizationResult: null }),
      clearData: () =>
        set({ vehicles: [], locations: [], optimizationResult: null }),

      // ── Optimization ──────────────────────────────────────────────────
      optimizationResult: null,
      isOptimizing: false,
      optimizationProgress: 0,
      currentIteration: 0,
      currentCost: 0,
      bestCost: 0,
      solutionsEvaluated: 0,
      setOptimizationResult: (r) => set({ optimizationResult: r, isOptimizing: false, optimizationProgress: 100 }),
      setIsOptimizing: (v) => set({ isOptimizing: v }),
      setOptimizationProgress: (pct, iter, cur, best, sols) =>
        set({
          optimizationProgress: pct,
          currentIteration: iter,
          currentCost: cur,
          bestCost: best,
          solutionsEvaluated: sols,
        }),

      // ── Settings ──────────────────────────────────────────────────────
      settings: defaultSettings,
      updateSettings: (s) =>
        set(state => ({ settings: { ...state.settings, ...s } })),

      // ── UI ────────────────────────────────────────────────────────────
      activeRoute: null,
      setActiveRoute: (id) => set({ activeRoute: id }),
      mapMode: 'after',
      setMapMode: (m) => set({ mapMode: m }),
    }),
    {
      name: 'qvrs-storage',
      partialize: (state) => ({
        auth: state.auth,
        vehicles: state.vehicles,
        locations: state.locations,
        settings: state.settings,
        optimizationResult: state.optimizationResult,
      }),
    }
  )
);
