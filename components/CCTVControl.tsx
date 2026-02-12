
import React, { useState } from 'react';
import { Camera } from '../types';

interface CCTVControlProps {
  cameras: Camera[];
  onAdd: (name: string, location: string) => void;
  onRemove: (id: string) => void;
}

const CCTVControl: React.FC<CCTVControlProps> = ({ cameras, onAdd, onRemove }) => {
  const [newName, setNewName] = useState('');
  const [newLoc, setNewLoc] = useState('Entrance');
  const [previewing, setPreviewing] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAdd(newName, newLoc);
    setNewName('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Register New Camera</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Camera Name (e.g. Lobby South)"
            className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 outline-none"
            value={newLoc}
            onChange={(e) => setNewLoc(e.target.value)}
          >
            <option value="Entrance">Entrance</option>
            <option value="AC Room">AC Room</option>
            <option value="Non-AC Room">Non-AC Room</option>
            <option value="Storage">Storage</option>
          </select>
          <button
            type="submit"
            className="bg-slate-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200"
          >
            Add Unit
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((cam) => (
          <div key={cam.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group">
            <div className="p-4 bg-slate-900 flex justify-between items-center">
              <span className="text-white font-medium flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${cam.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                {cam.name}
              </span>
              <span className="text-xs text-slate-400">{cam.status}</span>
            </div>
            
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {previewing === cam.id && cam.status === 'Online' ? (
                 <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                    <span className="animate-pulse">STREAMING LIVE FROM {cam.location}...</span>
                 </div>
              ) : (
                <div className="text-center text-slate-600">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs uppercase font-bold tracking-widest">{cam.status === 'Online' ? 'Feed Paused' : 'Connection Lost'}</p>
                </div>
              )}
              {cam.status === 'Online' && (
                <button 
                  onClick={() => setPreviewing(previewing === cam.id ? null : cam.id)}
                  className="absolute bottom-2 right-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/20 transition"
                >
                  {previewing === cam.id ? 'Stop Feed' : 'Launch Feed'}
                </button>
              )}
            </div>

            <div className="p-4 flex justify-between items-center text-sm">
              <div className="text-slate-500">
                <p className="font-semibold text-slate-700">{cam.location}</p>
                <p className="text-xs">Seen: {cam.lastSeen}</p>
              </div>
              <button
                onClick={() => onRemove(cam.id)}
                className="text-red-400 hover:text-red-600 transition"
                title="Decommission Unit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CCTVControl;
