import React, { useState } from 'react';
import { WindowScheduleItem } from '../types/handover';
import { Plus, Trash2, CheckCircle, AlertCircle, Layers } from 'lucide-react';

interface WindowScheduleManagerProps {
  schedule: WindowScheduleItem[];
  onChangeSchedule: (updated: WindowScheduleItem[]) => void;
}

export const WindowScheduleManager: React.FC<WindowScheduleManagerProps> = ({
  schedule,
  onChangeSchedule,
}) => {
  const [newOpeningCode, setNewOpeningCode] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newType, setNewType] = useState('3-Track Sliding with Mesh');
  const [newDimensions, setNewDimensions] = useState('');
  const [newGlass, setNewGlass] = useState('5mm Toughened Clear');
  const [isAdding, setIsAdding] = useState(false);

  const handleStatusChange = (id: string, status: WindowScheduleItem['status']) => {
    const updated = schedule.map((item) => (item.id === id ? { ...item, status } : item));
    onChangeSchedule(updated);
  };

  const handleNotesChange = (id: string, notes: string) => {
    const updated = schedule.map((item) => (item.id === id ? { ...item, notes } : item));
    onChangeSchedule(updated);
  };

  const handleDelete = (id: string) => {
    onChangeSchedule(schedule.filter((item) => item.id !== id));
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpeningCode.trim() || !newLocation.trim()) return;

    const newItem: WindowScheduleItem = {
      id: `ws_${Date.now()}`,
      openingCode: newOpeningCode.trim().toUpperCase(),
      location: newLocation.trim(),
      type: newType,
      dimensions: newDimensions.trim() || 'Custom Opening',
      glassType: newGlass.trim() || '5mm Toughened',
      status: 'Inspected & Passed',
      notes: 'Initial site check completed',
    };

    onChangeSchedule([...schedule, newItem]);
    setNewOpeningCode('');
    setNewLocation('');
    setNewDimensions('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600" />
            Window & Door Openings Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual itemization of every manufactured window and door installed at the site.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {isAdding ? 'Close Panel' : 'Add Opening'}
        </button>
      </div>

      {/* Add New Opening Modal/Form */}
      {isAdding && (
        <form onSubmit={handleAddNew} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <div className="text-xs font-bold text-slate-800">Add New Window / Door Opening</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Opening Code (e.g. W3, D3) *
              </label>
              <input
                type="text"
                value={newOpeningCode}
                onChange={(e) => setNewOpeningCode(e.target.value)}
                placeholder="W3"
                required
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Room / Location *
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Children Bedroom"
                required
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                System Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              >
                <option value="3-Track Sliding with Mesh">3-Track Sliding with Mesh</option>
                <option value="2-Track Sliding Window">2-Track Sliding Window</option>
                <option value="Casement Window with Friction Stay">Casement Window with Friction Stay</option>
                <option value="French Door with Espagnolette">French Door with Espagnolette</option>
                <option value="Tilt & Turn Premium Window">Tilt & Turn Premium Window</option>
                <option value="Top Hung Bathroom Ventilator">Top Hung Bathroom Ventilator</option>
                <option value="Fixed Glazing / Picture Window">Fixed Glazing / Picture Window</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Dimensions (W x H)
              </label>
              <input
                type="text"
                value={newDimensions}
                onChange={(e) => setNewDimensions(e.target.value)}
                placeholder={"e.g. 5'0\" x 4'0\""}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Glass Specification
              </label>
              <input
                type="text"
                value={newGlass}
                onChange={(e) => setNewGlass(e.target.value)}
                placeholder="e.g. 5mm Toughened Clear"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 py-1.5 px-3 rounded transition-colors cursor-pointer"
              >
                Save Opening
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Openings Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3 w-16 text-center">Code</th>
              <th className="py-2.5 px-3 min-w-[140px]">Location</th>
              <th className="py-2.5 px-3 min-w-[200px]">Window / Door System</th>
              <th className="py-2.5 px-3 min-w-[100px]">Size</th>
              <th className="py-2.5 px-3 min-w-[140px]">Glass Specs</th>
              <th className="py-2.5 px-3 w-36 text-center">Status</th>
              <th className="py-2.5 px-3 min-w-[180px]">Field Notes</th>
              <th className="py-2.5 px-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {schedule.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-2.5 px-3 text-center font-mono font-bold text-sky-800 bg-sky-50/50">
                  {item.openingCode}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">{item.location}</td>
                <td className="py-2.5 px-3 text-slate-700">{item.type}</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">{item.dimensions || '—'}</td>
                <td className="py-2.5 px-3 text-slate-600">{item.glassType}</td>
                <td className="py-2.5 px-3 text-center">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as WindowScheduleItem['status'])}
                    className={`text-[11px] font-semibold px-2 py-1 rounded border ${
                      item.status === 'Inspected & Passed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : item.status === 'Minor Snag'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    <option value="Inspected & Passed">Passed</option>
                    <option value="Minor Snag">Minor Snag</option>
                    <option value="Pending Adjustment">Adjustment Needed</option>
                  </select>
                </td>
                <td className="py-2.5 px-3">
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
                    placeholder="e.g. Smooth sliding verified..."
                    className="w-full text-[11px] px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </td>
                <td className="py-2.5 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title="Remove opening"
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{schedule.filter((s) => s.status === 'Inspected & Passed').length} Passed</span>
          <span className="text-slate-300">·</span>
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>{schedule.filter((s) => s.status !== 'Inspected & Passed').length} Attention Items</span>
        </span>
        <span>Total: {schedule.length} Openings Documented</span>
      </div>
    </div>
  );
};
