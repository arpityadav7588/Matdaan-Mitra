import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Info, Scale, GraduationCap, Search, ExternalLink } from 'lucide-react';
import { PretextLayout } from '../components/PretextLayout';
import { API_BASE_URL } from '../constants';


const Candidates: React.FC = () => {
  const [constituency, setConstituency] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    if (!constituency) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/candidates?constituency=${constituency}`);
      const data = await response.json();
      if (data.success && data.data) {
        setCandidates(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-6"
    >
      <div className="flex items-center gap-3">
        <Users className="text-navy dark:text-white" />
        <h2 className="text-2xl font-black dark:text-white">Know Your Candidates</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <input 
            type="text" 
            value={constituency}
            onChange={(e) => setConstituency(e.target.value)}
            placeholder="Enter Constituency (e.g., New Delhi)..."
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-saffron transition-all dark:text-white font-bold"
          />
          <button 
            onClick={fetchCandidates}
            className="absolute right-2 top-2 bg-navy text-white p-2 rounded-xl"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
          Showing data from official EC records (Sample)
        </p>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {candidates.map((c, index) => (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                      👤
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-navy dark:text-white">{c.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-saffron/10 text-saffron text-[10px] font-black rounded-md uppercase">
                          {c.party}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    {c.symbol}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <CandidateInfoCard 
                    icon={<GraduationCap className="w-4 h-4 text-navy" />} 
                    label="Education" 
                    value={c.education} 
                  />
                  <CandidateInfoCard 
                    icon={<Scale className="w-4 h-4 text-red-500" />} 
                    label="Criminal" 
                    value={c.criminalRecords} 
                  />
                  <CandidateInfoCard 
                    icon={<Info className="w-4 h-4 text-green-600" />} 
                    label="Manifesto" 
                    value="View PDF"
                    isLink
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {candidates.length === 0 && !loading && (
          <div className="text-center py-20 opacity-20">
            <Users className="w-20 h-20 mx-auto mb-4" />
            <p className="font-black uppercase tracking-widest">Enter a constituency to search</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CandidateInfoCard = ({ icon, label, value, isLink }: any) => (
  <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100/50 dark:border-gray-700/50">
    <div className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {icon}
    </div>
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{label}</span>
    <div className={`text-[10px] font-bold text-navy dark:text-white text-center leading-tight flex items-center gap-1 ${isLink ? 'text-blue-500' : ''}`}>
      <PretextLayout text={value} width={80} fontSize={10} className="mx-auto" />
      {isLink && <ExternalLink size={10} />}
    </div>
  </div>
);

export default Candidates;
