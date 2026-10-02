// ─────────────────────────────────────────────
// Core Domain Types
// ─────────────────────────────────────────────

export type VehicleType = 'Bike' | 'Van' | 'Truck' | 'Electric Vehicle';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type OptimizationObjective = 'distance' | 'time' | 'cost' | 'balanced';

export interface Vehicle {
  id: string;
  type: VehicleType;
  capacity: number;         // kg
  fuelType: FuelType;
  efficiency: number;       // km/litre or km/kWh
  maxDistance: number;      // km
  startLocation: string;    // Location ID of depot
  availableTime: number;    // hours
  costPerKm: number;        // ₹/km
}

export interface TimeWindow {
  start: string;  // "HH:MM"
  end: string;    // "HH:MM"
}

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  demand: number;           // kg
  priority: Priority;
  timeWindow?: TimeWindow;
  isDepot?: boolean;
}

export interface Stop {
  locationId: string;
  arrivalTime?: number;     // minutes from start
  departureTime?: number;
  load?: number;            // load remaining after delivery
}

export interface Route {
  vehicleId: string;
  stops: Stop[];            // includes depot at start & end
  totalDistance: number;    // km
  totalTime: number;        // minutes
  totalCost: number;        // ₹
  loadUtilized: number;     // kg
  deliveries: number;
  efficiency: number;       // 0-100%
}

export interface OptimizationStats {
  iterations: number;
  solutionsEvaluated: number;
  initialCost: number;
  bestCost: number;
  improvement: number;      // %
  timeMs: number;
  algorithm: string;
  objective: OptimizationObjective;
  iterationHistory: IterationPoint[];
}

export interface IterationPoint {
  iteration: number;
  currentCost: number;
  bestCost: number;
  temperature?: number;
}

export interface OptimizationResult {
  baseline: Route[];
  optimized: Route[];
  stats: OptimizationStats;
  completedAt: Date;
}

export interface AppSettings {
  fuelPrice: number;        // ₹/litre
  averageSpeed: number;     // km/h
  distanceWeight: number;   // 0-1
  timeWeight: number;
  costWeight: number;
  maxIterations: number;
  objective: OptimizationObjective;
  depotId: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: { email: string; name: string };
}
