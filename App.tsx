
import React, { useState, useMemo } from 'react';
import { Role, AttendanceRecord, Camera, AppState } from './types';
import { MASTER_STUDENTS, INITIAL_CAMERAS, INITIAL_ATTENDANCE } from './constants';
import StatsCard from './components/StatsCard';
import CCTVControl from './components/CCTVControl';
import Assistant from './components/Assistant';

const App: React.FC = () => {
  const [role, setRole] = useState<Role>(null);
  const [view, setView] = useState<'attendance' | 'cctv'>('attendance');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Student Form State
  const [studId, setStudId] = useState('');
  const [studName, setStudName] = useState('');
  const [studRoom, setStudRoom] = useState<'AC' | 'Non-AC'>('AC');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studId.trim() || !studName.trim()) {
      showToast('Please fill all fields', 'error');
      return;
    }
    const exists = attendance.some(a => a.studentId === studId);
    if (exists) {
       showToast('Attendance already marked for today', 'error');
       return;
    }
    const newRecord: AttendanceRecord = {
      studentId: studId,
      name: studName,
      room: studRoom,
      timestamp: new Date().toLocaleString()
    };
    setAttendance(prev => [...prev, newRecord]);
    showToast(`Success! Room: ${studRoom}`);
    setStudId('');
    setStudName('');
  };

  const addCamera = (name: string, location: string) => {
    const newCam: Camera = {
      id: `cam-${Date.now()}`,
      name,
      location,
      status: 'Online',
      lastSeen: new Date().toLocaleString()
    };
    setCameras(prev => [...prev, newCam]);
    showToast('Camera added successfully');
  };

  const removeCamera = (id: string) => {
    setCameras(prev => prev.filter(c => c.id !== id));
    showToast('Camera unit removed');
  };

  const absentees = useMemo(() => {
    const presentIds = new Set(attendance.map(a => a.studentId));
    return MASTER_STUDENTS.filter(s => !presentIds.has(s.id));
  }, [attendance]);

  const stats = useMemo(() => ({
    present: attendance.length,
    ac: attendance.filter(a => a.room === 'AC').length,
    nonAc: attendance.filter(a => a.room === 'Non-AC').length,
    absent: absentees.length,
  }), [attendance, absentees]);

  const appState: AppState = { attendance, cameras };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-4xl shadow-lg">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Lumina Library</h1>
          <p className="text-slate-500 mb-8">Select your authorization portal to continue.</p>
          <div className="space-y-4">
            <button
              onClick={() => setRole('CEO')}
              className="w-full py-4 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center space-x-3 shadow-xl shadow-slate-200"
            >
              <span>Management Access</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <button
              onClick={() => setRole('STUDENT')}
              className="w-full py-4 px-6 bg-white border-2 border-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center space-x-3"
            >
              <span>Student Portal</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl text-white font-bold transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="bg-slate-900 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
             </div>
             <div>
                <h2 className="font-bold text-slate-900 leading-none">Lumina</h2>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{role} Portal</span>
             </div>
          </div>
          <button 
            onClick={() => { setRole(null); setView('attendance'); }}
            className="text-sm font-semibold text-slate-400 hover:text-slate-900 flex items-center"
          >
            Log Out
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        {role === 'STUDENT' ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
               <h3 className="text-2xl font-bold text-slate-900 mb-6">Mark Attendance</h3>
               <form onSubmit={handleMarkAttendance} className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Student ID</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition"
                      placeholder="e.g. S1001"
                      value={studId}
                      onChange={(e) => setStudId(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-4 focus:ring-slate-100 outline-none transition"
                      placeholder="Enter your legal name"
                      value={studName}
                      onChange={(e) => setStudName(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Room Preference</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setStudRoom('AC')}
                        className={`py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition ${studRoom === 'AC' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>AC Room</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudRoom('Non-AC')}
                        className={`py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition ${studRoom === 'Non-AC' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Non-AC</span>
                      </button>
                    </div>
                 </div>
                 <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95"
                 >
                   Submit Check-in
                 </button>
               </form>
            </div>
            <div className="mt-8 text-center text-slate-400 text-sm italic">
              * Verification will occur upon physical entry to the specified room.
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Header / Nav Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
                <p className="text-slate-500">Real-time library occupancy and security overview.</p>
              </div>
              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setView('attendance')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${view === 'attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Daily Attendance
                </button>
                <button 
                  onClick={() => setView('cctv')}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${view === 'cctv' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  CCTV Controls
                </button>
              </div>
            </div>

            {/* AI Assistant Sidebar Area (Integrated top) */}
            <Assistant state={appState} masterStudents={MASTER_STUDENTS} />

            {/* Content Switch */}
            {view === 'attendance' ? (
              <div className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard label="Total Present" value={stats.present} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} color="bg-blue-600" />
                  <StatsCard label="AC Room" value={stats.ac} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} color="bg-indigo-600" />
                  <StatsCard label="Non-AC Room" value={stats.nonAc} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} color="bg-amber-600" />
                  <StatsCard label="Absentees" value={stats.absent} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} color="bg-rose-600" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Live Entries</h3>
                      <span className="bg-green-100 text-green-700 text-[10px] uppercase font-black px-2 py-0.5 rounded">Active</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-widest font-bold">
                          <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Room</th>
                            <th className="px-6 py-4 text-right">Time In</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {attendance.map((rec) => (
                            <tr key={rec.studentId} className="hover:bg-slate-50 transition">
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{rec.name}</div>
                                <div className="text-xs text-slate-400">{rec.studentId}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${rec.room === 'AC' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                  {rec.room}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right text-xs font-medium text-slate-500">
                                {rec.timestamp.split(', ')[1]}
                              </td>
                            </tr>
                          ))}
                          {attendance.length === 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                                No entries yet today.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Absent Watchlist</h3>
                      <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black px-2 py-0.5 rounded">{absentees.length} Pending</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-widest font-bold">
                          <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {absentees.map((s) => (
                            <tr key={s.id}>
                              <td className="px-6 py-4 text-xs font-mono text-slate-400">{s.id}</td>
                              <td className="px-6 py-4 font-medium text-slate-600">{s.name}</td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-rose-400 text-xs font-bold uppercase tracking-tighter italic">Not Checked In</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <CCTVControl cameras={cameras} onAdd={addCamera} onRemove={removeCamera} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
