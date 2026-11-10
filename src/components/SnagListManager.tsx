import React, { useState } from 'react';
import { SnagPhotoItem } from '../types/handover';
import { Camera, Image as ImageIcon, Trash2, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';

interface SnagListManagerProps {
  photos: SnagPhotoItem[];
  onChangePhotos: (updated: SnagPhotoItem[]) => void;
}

export const SnagListManager: React.FC<SnagListManagerProps> = ({
  photos,
  onChangePhotos,
}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (id) {
        // Update existing item
        onChangePhotos(
          photos.map((item) => (item.id === id ? { ...item, photoUrl: result } : item))
        );
      } else {
        // Create new item
        const newItem: SnagPhotoItem = {
          id: `photo_${Date.now()}`,
          title: title.trim() || file.name.slice(0, 20),
          location: location.trim() || 'Site Area',
          status: 'Verified',
          photoUrl: result,
          notes: notes.trim() || 'Uploaded during installation handover',
        };
        onChangePhotos([...photos, newItem]);
        setTitle('');
        setLocation('');
        setNotes('');
        setIsAdding(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStatusChange = (id: string, status: SnagPhotoItem['status']) => {
    onChangePhotos(photos.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handleNotesChange = (id: string, updatedNotes: string) => {
    onChangePhotos(photos.map((p) => (p.id === id ? { ...p, notes: updatedNotes } : p)));
  };

  const handleDelete = (id: string) => {
    onChangePhotos(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-sky-600" />
            Site Installation Photos & Snag / Punch List
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Attach photo proof of installed windows, seamless silicone sealant beads, and handle verification.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {isAdding ? 'Close Panel' : 'Attach Photo / Snag'}
        </button>
      </div>

      {/* Add New Snag/Photo Box */}
      {isAdding && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <div className="text-xs font-bold text-slate-800">Attach Site Photo / Snag Item</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Balcony Sliding Finish"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Specific Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 2nd Floor Master Bedroom"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Select Photo File (Camera / Disk)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Field Notes / Verification
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Weatherproof silicone seal tested with water spray; 100% watertight."
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      )}

      {/* Grid of Snag & Photo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-500 block">Inspection Checkpoint</span>
                    <label className="mt-2 inline-block px-2.5 py-1 text-[11px] font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded cursor-pointer">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, item.id)}
                      />
                    </label>
                  </div>
                )}

                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                      item.status === 'Verified'
                        ? 'bg-emerald-600 text-white'
                        : item.status === 'Resolved'
                        ? 'bg-sky-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.status === 'Verified' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                    <p className="text-[11px] text-slate-500">{item.location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title="Delete item"
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={item.notes || ''}
                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
                    placeholder="Add inspection note or snag status..."
                    className="w-full text-[11px] p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">Status:</span>
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(item.id, e.target.value as SnagPhotoItem['status'])}
                className="text-xs font-semibold px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none"
              >
                <option value="Verified">Verified OK</option>
                <option value="Resolved">Snag Resolved</option>
                <option value="Pending Snag">Pending Snag Fix</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg">
          <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No photos attached yet</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Capture or upload images of installed windows and silicone sealing for digital verification.
          </p>
        </div>
      )}
    </div>
  );
};
