import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, AlertCircle, Database } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { priorityColor } from '../utils/formatters';
import type { Location, Priority } from '../types';

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];

const emptyLocation = (): Omit<Location, 'id'> => ({
  name: '', address: '', lat: 16.5062, lng: 80.6480, demand: 20,
  priority: 'Medium', timeWindow: { start: '09:00', end: '17:00' }, isDepot: false,
});

export default function Locations() {
  const { locations, addLocation, updateLocation, deleteLocation, loadSampleData } = useAppStore(s => ({
    locations: s.locations, addLocation: s.addLocation, updateLocation: s.updateLocation,
    deleteLocation: s.deleteLocation, loadSampleData: s.loadSampleData,
  }));

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Location>({ id: '', ...emptyLocation() });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState('');

  const showFlash = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.id.trim()) e.id = 'Location ID is required';
    if (!editingId && locations.find(l => l.id === formData.id.trim())) e.id = 'ID already exists';
    if (!formData.name.trim()) e.name = 'Name is required';
    if (formData.lat < -90 || formData.lat > 90) e.lat = 'Latitude must be -90 to 90';
    if (formData.lng < -180 || formData.lng > 180) e.lng = 'Longitude must be -180 to 180';
    if (!formData.isDepot && formData.demand <= 0) e.demand = 'Demand must be > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const loc: Location = { ...formData, id: formData.id.trim() };
    if (editingId) { updateLocation(loc); showFlash('Location updated'); }
    else { addLocation(loc); showFlash('Location added'); }
    setShowForm(false); setEditingId(null); setFormData({ id: '', ...emptyLocation() }); setErrors({});
  };

  const handleEdit = (l: Location) => { setFormData({ ...l }); setEditingId(l.id); setShowForm(true); setErrors({}); };
  const handleCancel = () => { setShowForm(false); setEditingId(null); setFormData({ id: '', ...emptyLocation() }); setErrors({}); };
  const setField = (key: keyof Location, value: unknown) => setFormData(f => ({ ...f, [key]: value }));

  const deliveries = locations.filter(l => !l.isDepot);
  const depot = locations.find(l => l.isDepot);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="page-title">Delivery Locations</h2>
          <p className="page-subtitle">{deliveries.length} delivery locations · {depot ? '1 depot' : 'No depot set'}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {locations.length === 0 && (
            <button onClick={loadSampleData} className="btn-secondary text-sm flex items-center gap-2">
              <Database className="w-4 h-4" /> Load Demo Dataset
            </button>
          )}
          <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ id: '', ...emptyLocation() }); setErrors({}); }}
            className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Location
          </button>
        </div>
      </div>

      {flash && <div className="status-success px-4 py-2.5 rounded-lg text-sm">{flash}</div>}

      {showForm && (
        <div className="card" style={{ borderColor: 'rgba(245,197,24,0.3)' }}>
          <h3 className="section-header">{editingId ? 'Edit Location' : 'Add Location'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Location ID *</label>
              <input className={`input-field ${errors.id ? 'border-red-500' : ''}`}
                value={formData.id} onChange={e => setField('id', e.target.value)}
                disabled={!!editingId} placeholder="LOC_01" />
              {errors.id && <p className="text-red-400 text-xs mt-1">{errors.id}</p>}
            </div>
            <div>
              <label className="label">Name *</label>
              <input className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                value={formData.name} onChange={e => setField('name', e.target.value)} placeholder="Krishnalanka Market" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input-field" value={formData.address}
                onChange={e => setField('address', e.target.value)} placeholder="Area, City" />
            </div>
            <div>
              <label className="label">Latitude *</label>
              <input type="number" step="0.0001" className={`input-field ${errors.lat ? 'border-red-500' : ''}`}
                value={formData.lat} onChange={e => setField('lat', +e.target.value)} />
              {errors.lat && <p className="text-red-400 text-xs mt-1">{errors.lat}</p>}
            </div>
            <div>
              <label className="label">Longitude *</label>
              <input type="number" step="0.0001" className={`input-field ${errors.lng ? 'border-red-500' : ''}`}
                value={formData.lng} onChange={e => setField('lng', +e.target.value)} />
              {errors.lng && <p className="text-red-400 text-xs mt-1">{errors.lng}</p>}
            </div>
            <div>
              <label className="label">Demand (kg) *</label>
              <input type="number" className={`input-field ${errors.demand ? 'border-red-500' : ''}`}
                value={formData.demand} onChange={e => setField('demand', +e.target.value)}
                disabled={formData.isDepot} min={0} />
              {errors.demand && <p className="text-red-400 text-xs mt-1">{errors.demand}</p>}
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input-field" value={formData.priority} onChange={e => setField('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Time Window Start</label>
              <input type="time" className="input-field"
                value={formData.timeWindow?.start ?? '09:00'}
                onChange={e => setField('timeWindow', { ...formData.timeWindow, start: e.target.value })} />
            </div>
            <div>
              <label className="label">Time Window End</label>
              <input type="time" className="input-field"
                value={formData.timeWindow?.end ?? '17:00'}
                onChange={e => setField('timeWindow', { ...formData.timeWindow, end: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isDepot" checked={!!formData.isDepot}
                onChange={e => setField('isDepot', e.target.checked)}
                className="w-4 h-4" style={{ accentColor: '#F5C518' }} />
              <label htmlFor="isDepot" className="label mb-0">This is the Depot</label>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex gap-3 justify-end">
              <button type="button" onClick={handleCancel} className="btn-secondary text-sm">Cancel</button>
              <button type="submit" className="btn-primary text-sm">{editingId ? 'Update' : 'Add Location'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Depot card */}
      {depot && (
        <div className="card" style={{ borderColor: 'rgba(245,197,24,0.25)', background: 'rgba(245,197,24,0.04)' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(245,197,24,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin className="w-4 h-4" style={{ color: '#F5C518' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold" style={{ color: '#F5C518' }}>{depot.name}</p>
              <p className="text-xs" style={{ color: '#3A5570' }}>{depot.address} · {depot.lat.toFixed(4)}, {depot.lng.toFixed(4)}</p>
            </div>
            <button onClick={() => handleEdit(depot)}
              className="p-1.5 rounded transition-colors" style={{ color: '#3A5570' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(29,111,235,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#4B8FF5'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#3A5570'; }}>
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {deliveries.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <MapPin className="w-12 h-12 mb-4" style={{ color: '#3A5570' }} />
          <p className="font-semibold" style={{ color: '#7FA0C0' }}>No delivery locations</p>
          <p className="text-sm mt-1" style={{ color: '#3A5570' }}>Add locations or load the demo dataset.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  {['ID','Name','Coordinates','Demand','Priority','Time Window','Actions'].map(h => (
                    <th key={h} className="table-cell text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: '#3A5570' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliveries.map(loc => (
                  <tr key={loc.id} className="table-row">
                    <td className="table-cell font-mono font-semibold" style={{ color: '#4B8FF5' }}>{loc.id}</td>
                    <td className="table-cell font-medium" style={{ color: '#F0F6FF' }}>{loc.name}</td>
                    <td className="table-cell font-mono text-xs" style={{ color: '#3A5570' }}>{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</td>
                    <td className="table-cell" style={{ color: '#F0F6FF' }}>{loc.demand} kg</td>
                    <td className="table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityColor(loc.priority)}`}>{loc.priority}</span>
                    </td>
                    <td className="table-cell text-xs font-mono" style={{ color: '#3A5570' }}>
                      {loc.timeWindow ? `${loc.timeWindow.start}–${loc.timeWindow.end}` : '—'}
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(loc)}
                          className="p-1.5 rounded transition-colors" style={{ color: '#3A5570' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(29,111,235,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#4B8FF5'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#3A5570'; }}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteLocation(loc.id)}
                          className="p-1.5 rounded transition-colors" style={{ color: '#3A5570' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#3A5570'; }}>
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

      {deliveries.length === 0 && (
        <div className="flex items-center gap-2 text-sm" style={{ color: '#F5C518' }}>
          <AlertCircle className="w-4 h-4" />
          Please add at least one delivery location before optimization.
        </div>
      )}
    </div>
  );
}
