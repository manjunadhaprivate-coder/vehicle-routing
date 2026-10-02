import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Truck, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { vehicleTypeIcon, fuelTypeColor } from '../utils/formatters';
import type { Vehicle, VehicleType, FuelType } from '../types';

const VEHICLE_TYPES: VehicleType[] = ['Bike', 'Van', 'Truck', 'Electric Vehicle'];
const FUEL_TYPES: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'CNG'];

const emptyVehicle = (): Omit<Vehicle, 'id'> => ({
  type: 'Van', capacity: 100, fuelType: 'Diesel', efficiency: 12,
  maxDistance: 150, startLocation: 'LOC_DEPOT', availableTime: 8, costPerKm: 12,
});

export default function Vehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, loadSampleData } = useAppStore(s => ({
    vehicles: s.vehicles, addVehicle: s.addVehicle, updateVehicle: s.updateVehicle,
    deleteVehicle: s.deleteVehicle, loadSampleData: s.loadSampleData,
  }));

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ id: string } & Omit<Vehicle,'id'>>({ id: '', ...emptyVehicle() });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flashMsg, setFlashMsg] = useState('');

  const flash = (msg: string) => { setFlashMsg(msg); setTimeout(() => setFlashMsg(''), 3000); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.id.trim()) e.id = 'Vehicle ID is required';
    if (!editingId && vehicles.find(v => v.id === formData.id.trim())) e.id = 'ID already exists';
    if (formData.capacity <= 0) e.capacity = 'Capacity must be > 0';
    if (formData.efficiency <= 0) e.efficiency = 'Efficiency must be > 0';
    if (formData.maxDistance <= 0) e.maxDistance = 'Max distance must be > 0';
    if (formData.costPerKm < 0) e.costPerKm = 'Cost must be ≥ 0';
    if (formData.availableTime <= 0) e.availableTime = 'Available time must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const vehicle: Vehicle = { ...formData, id: formData.id.trim() };
    if (editingId) { updateVehicle(vehicle); flash('Vehicle updated'); }
    else { addVehicle(vehicle); flash('Vehicle added'); }
    setShowForm(false); setEditingId(null); setFormData({ id: '', ...emptyVehicle() }); setErrors({});
  };

  const handleEdit = (v: Vehicle) => { setFormData({ ...v }); setEditingId(v.id); setShowForm(true); setErrors({}); };
  const handleDuplicate = (v: Vehicle) => {
    const newId = `${v.id}_copy`;
    if (vehicles.find(x => x.id === newId)) { flash('ID conflict — rename the copy first'); return; }
    addVehicle({ ...v, id: newId }); flash('Vehicle duplicated');
  };
  const handleCancel = () => { setShowForm(false); setEditingId(null); setFormData({ id: '', ...emptyVehicle() }); setErrors({}); };
  const field = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(f => ({ ...f, [key]: e.target.type === 'number' ? +e.target.value : e.target.value }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="page-title">Fleet Management</h2>
          <p className="page-subtitle">{vehicles.length} vehicle(s) registered</p>
        </div>
        <div className="flex gap-3">
          {vehicles.length === 0 && (
            <button onClick={loadSampleData} className="btn-secondary text-sm">Load Demo Fleet</button>
          )}
          <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ id: '', ...emptyVehicle() }); setErrors({}); }}
            className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {flashMsg && <div className="status-success px-4 py-2.5 rounded-lg text-sm">{flashMsg}</div>}

      {showForm && (
        <div className="card border-quantum/40">
          <h3 className="section-header">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Vehicle ID *</label>
              <input className={`input-field ${errors.id ? 'border-red-500' : ''}`}
                value={formData.id} onChange={field('id')} disabled={!!editingId} placeholder="V01" />
              {errors.id && <p className="text-red-400 text-xs mt-1">{errors.id}</p>}
            </div>
            <div>
              <label className="label">Vehicle Type</label>
              <select className="input-field" value={formData.type} onChange={field('type')}>
                {VEHICLE_TYPES.map(t => <option key={t} value={t}>{vehicleTypeIcon(t)} {t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Capacity (kg) *</label>
              <input type="number" className={`input-field ${errors.capacity ? 'border-red-500' : ''}`}
                value={formData.capacity} onChange={field('capacity')} min={1} />
              {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>}
            </div>
            <div>
              <label className="label">Fuel / Energy Type</label>
              <select className="input-field" value={formData.fuelType} onChange={field('fuelType')}>
                {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Efficiency (km/L or km/kWh) *</label>
              <input type="number" className={`input-field ${errors.efficiency ? 'border-red-500' : ''}`}
                value={formData.efficiency} onChange={field('efficiency')} min={0.1} step={0.1} />
              {errors.efficiency && <p className="text-red-400 text-xs mt-1">{errors.efficiency}</p>}
            </div>
            <div>
              <label className="label">Max Distance (km) *</label>
              <input type="number" className={`input-field ${errors.maxDistance ? 'border-red-500' : ''}`}
                value={formData.maxDistance} onChange={field('maxDistance')} min={1} />
              {errors.maxDistance && <p className="text-red-400 text-xs mt-1">{errors.maxDistance}</p>}
            </div>
            <div>
              <label className="label">Available Time (hours)</label>
              <input type="number" className={`input-field ${errors.availableTime ? 'border-red-500' : ''}`}
                value={formData.availableTime} onChange={field('availableTime')} min={1} max={24} />
              {errors.availableTime && <p className="text-red-400 text-xs mt-1">{errors.availableTime}</p>}
            </div>
            <div>
              <label className="label">Cost per km (₹) *</label>
              <input type="number" className={`input-field ${errors.costPerKm ? 'border-red-500' : ''}`}
                value={formData.costPerKm} onChange={field('costPerKm')} min={0} step={0.5} />
              {errors.costPerKm && <p className="text-red-400 text-xs mt-1">{errors.costPerKm}</p>}
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex gap-3 justify-end">
              <button type="button" onClick={handleCancel} className="btn-secondary text-sm">Cancel</button>
              <button type="submit" className="btn-primary text-sm">
                {editingId ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <Truck className="w-12 h-12 text-text-muted mb-4" />
          <p className="text-text-secondary font-semibold">No vehicles added</p>
          <p className="text-text-muted text-sm mt-1">Add a vehicle or load the demo fleet to get started.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  {['ID', 'Type', 'Capacity', 'Fuel', 'Efficiency', 'Max Dist', 'Cost/km', 'Actions'].map(h => (
                    <th key={h} className="table-cell text-left text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id} className="table-row">
                    <td className="table-cell font-mono font-semibold text-quantum-hover">{v.id}</td>
                    <td className="table-cell">
                      <span className="flex items-center gap-2">{vehicleTypeIcon(v.type)} <span className="text-text-primary">{v.type}</span></span>
                    </td>
                    <td className="table-cell text-text-primary">{v.capacity} kg</td>
                    <td className="table-cell"><span className={`text-xs font-medium ${fuelTypeColor(v.fuelType)}`}>{v.fuelType}</span></td>
                    <td className="table-cell">{v.efficiency} km/L</td>
                    <td className="table-cell">{v.maxDistance} km</td>
                    <td className="table-cell">₹{v.costPerKm}/km</td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(v)}
                          className="p-1.5 rounded hover:bg-blue-900/30 text-text-muted hover:text-blue-400 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDuplicate(v)}
                          className="p-1.5 rounded hover:bg-purple-900/30 text-text-muted hover:text-quantum-hover transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteVehicle(v.id)}
                          className="p-1.5 rounded hover:bg-red-900/30 text-text-muted hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {vehicles.length === 0 && (
        <div className="flex items-center gap-2 text-amber-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          Please add at least one vehicle before starting optimization.
        </div>
      )}
    </div>
  );
}
