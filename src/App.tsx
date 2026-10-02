import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Locations from './pages/Locations';
import Optimize from './pages/Optimize';
import Simulation from './pages/Simulation';
import RoutesPage from './pages/RoutesPage';
import MapView from './pages/MapView';
import Comparison from './pages/Comparison';
import Results from './pages/Results';
import Settings from './pages/Settings';
import About from './pages/About';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore(s => s.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="locations" element={<Locations />} />
          <Route path="optimize" element={<Optimize />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="map" element={<MapView />} />
          <Route path="comparison" element={<Comparison />} />
          <Route path="results" element={<Results />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
