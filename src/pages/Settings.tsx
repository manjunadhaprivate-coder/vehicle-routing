import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { defaultSettings } from '../data/sampleData';

export default function Settings() {
  const { settings, updateSettings } = useAppStore(s => ({
    settings: s.settings,
    updateSettings: s.updateSettings,
  }));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    updateSettings(defaultSettings);
  };

  const numField = (key: keyof typeof settings, label: string, min: number, max: number, step = 1, unit = '') => (
    <div key={key}>
      <label className="label">{label}{unit && <span className="text-text-muted"> ({unit})</span>}</label>
      <input
        type="number"
        className="input-field"
        value={settings[key] as number}
        min={min}
        max={max}
        step={step}
        onChange={e => updateSettings({ [key]: +e.target.value })}
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Configure optimization and cost calculation parameters</p>
      </div>

      <div className="card">
        <h3 className="section-header">Cost Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {numField('fuelPrice', 'Fuel Price', 50, 200, 1, '₹/litre')}
          {numField('averageSpeed', 'Average Speed', 10, 100, 5, 'km/h')}
        </div>
      </div>

      <div className="card">
        <h3 className="section-header">Optimization Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {numField('maxIterations', 'Max Iterations', 500, 10000, 500)}
          <div>
            <label className="label">Optimization Objective</label>
            <select
              className="input-field"
              value={settings.objective}
              onChange={e => updateSettings({ objective: e.target.value as typeof settings.objective })}
            >
              <option value="balanced">Balanced</option>
              <option value="distance">Minimum Distance</option>
              <option value="time">Minimum Time</option>
              <option value="cost">Minimum Cost</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-header">Objective Weights</h3>
        <div className="space-y-4">
          {([
            ['distanceWeight', 'Distance Weight'],
            ['timeWeight', 'Time Weight'],
            ['costWeight', 'Cost Weight'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <label className="label mb-0">{label}</label>
                <span className="text-sm font-mono text-text-primary">{(settings[key] as number).toFixed(2)}</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={settings[key] as number}
                onChange={e => updateSettings({ [key]: +e.target.value })}
                className="w-full h-2 rounded-full appearance-none bg-bg-secondary accent-purple-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset Defaults
        </button>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
