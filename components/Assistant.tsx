
import React, { useState } from 'react';
import { getLibraryInsights } from '../services/geminiService';
import { AppState, Student } from '../types';

interface AssistantProps {
  state: AppState;
  masterStudents: Student[];
}

const Assistant: React.FC<AssistantProps> = ({ state, masterStudents }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await getLibraryInsights(state, masterStudents, query);
      setAnswer(res || 'No response generated.');
    } catch (err) {
      setAnswer('Error reaching the AI assistant. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2 flex items-center">
        <span className="bg-indigo-500 p-1.5 rounded-lg mr-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
        Lumina AI Advisor
      </h3>
      <p className="text-indigo-200 text-sm mb-4">Ask about occupancy trends, security status, or daily summaries.</p>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-indigo-800/50 border border-indigo-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-indigo-300"
            placeholder="How is the AC room utilization today?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center"
          >
            {loading ? (
               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : 'Ask'}
          </button>
        </div>

        {answer && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-sm text-indigo-50 leading-relaxed border border-white/5">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;
