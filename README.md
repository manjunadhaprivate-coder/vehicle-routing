# Quantum-Optimized Vehicle Routing System (QVRS)
### Smart India Hackathon 2026 — Working Prototype

A complete, demo-ready web application demonstrating quantum-inspired optimization for vehicle routing, showcasing measurable improvements in distance, time, and transportation cost.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (download from https://nodejs.org)
- **npm** 9+

### Run the Application
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser at: http://localhost:5173
```

### Demo Credentials
| Field | Value |
|-------|-------|
| Email | `demo@sih.com` |
| Password | `sih2026` |

---

## 📋 Features

### Pages / Sections
| # | Page | Description |
|---|------|-------------|
| 1 | Login | SIH-style login with demo auth |
| 2 | Dashboard | KPI cards, convergence charts, quick nav |
| 3 | Vehicles | Add/edit/delete/duplicate fleet vehicles |
| 4 | Locations | Delivery location management with map coords |
| 5 | Optimize | Configure and launch optimization |
| 6 | Simulation | Real-time quantum-inspired optimization |
| 7 | Routes | Expandable optimized route explorer |
| 8 | Map View | Interactive Leaflet map — Before/After toggle |
| 9 | Comparison | Before vs After with charts and table |
| 10 | Results | Executive dashboard with export |
| 11 | Settings | Configurable cost/speed/weight parameters |
| 12 | About | Project info + Judge Demo Mode |

### Optimization Engine
- **Phase 1 (Baseline)**: Nearest-Neighbor Heuristic VRP solver
- **Phase 2 (Quantum-Inspired)**: Simulated Annealing with QUBO cost function
  - 2-opt intra-route swap operator
  - Cross-route relocation operator
  - Metropolis criterion (quantum tunneling analogy)
  - Configurable iterations (500–5000)
  - Real-time progress callbacks

### Calculations
- **Distance**: Haversine formula (great-circle, coordinate-based)
- **Time**: Distance ÷ average speed + stop time
- **Cost**: Distance × vehicle cost per km
- **Objective**: Weighted QUBO score = dist×w₁ + time×w₂ + cost×w₃

---

## 🗂 Project Structure
```
src/
├── types/index.ts          # TypeScript interfaces
├── data/sampleData.ts      # Vijayawada demo dataset
├── engine/
│   ├── haversine.ts        # Distance calculations
│   ├── calculator.ts       # Route metrics
│   ├── baseline.ts         # Nearest-neighbor solver
│   └── quantumOptimizer.ts # SA + QUBO optimizer
├── store/appStore.ts       # Zustand global state
├── utils/
│   ├── formatters.ts       # Display helpers
│   └── exporters.ts        # CSV/JSON/Report export
├── components/
│   ├── Layout.tsx           # App shell
│   ├── Sidebar.tsx          # Navigation
│   └── Header.tsx           # Top bar
└── pages/                  # 12 page components
```

---

## 🧪 Demo Dataset (Vijayawada)
- **Depot**: Vijayawada Logistics Hub (Auto Nagar)
- **Fleet**: 5 vehicles — Van × 2, EV × 1, Truck × 1, Bike × 1
- **Deliveries**: 12 locations around Vijayawada city
- **Coordinates**: Real latitude/longitude (Andhra Pradesh)

---

## 📦 Export Options
- **CSV** — Route data with all metrics
- **JSON** — Full optimization result
- **Text Report** — Human-readable summary with before/after comparison

---

## 🎯 Judge Demo Mode
1. Open the app → Login with demo credentials
2. Navigate to **About** → Click **Launch Judge Demo**
3. App auto-loads demo data and opens the Optimize page
4. Click **Start Quantum Optimization**
5. Watch the simulation → then explore Results/Map/Comparison

---

## ⚠️ Disclaimer
This prototype uses a **classical quantum-inspired simulation** (Simulated Annealing + QUBO cost function). It is **not** connected to a real quantum computer. The quantum-inspired approach mimics quantum tunneling behavior to achieve improved routing over greedy heuristics. All displayed metrics are computed from actual optimization results — not hardcoded.

---

## 🏗 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| State | Zustand |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Routing | React Router v6 |
