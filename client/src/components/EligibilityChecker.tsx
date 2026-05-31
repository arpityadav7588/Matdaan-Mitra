import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../constants';


async function hashVoterId(id: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(id.trim().toUpperCase());
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const EligibilityChecker: React.FC = () => {
  const [voterId, setVoterId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Memoize checkEligibility to avoid recreating on every render
  const checkEligibility = React.useCallback(async () => {
    if (!voterId) return;
    setLoading(true);
    setError('');
    setStatus(null);

    try {
      const hashedId = await hashVoterId(voterId);
      const res = await fetch(`${API_BASE_URL}/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashedId })
      });
      const result = await res.json();
      
      if (result.success) {
        setStatus(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [voterId]);

  return (
    <div className="card max-w-2xl mx-auto my-8">
      <h3 className="text-xl font-bold mb-4 text-[#000080] flex items-center gap-2">
        <Search className="w-5 h-5" /> Check My Eligibility
      </h3>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
          placeholder="Enter Voter ID (e.g. VOTER123)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9933] outline-none"
        />
        <button 
          onClick={checkEligibility}
          disabled={loading}
          className="btn-primary disabled:bg-gray-400"
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </div>

      <AnimatePresence>
        {status && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <p className="font-bold text-green-800">Verified Voter Record Found</p>
                <p className="text-green-700">Name: {status.name}</p>
                <p className="text-green-700">Constituency: {status.constituency}</p>
                <p className="text-green-700">Polling Station: {status.pollingStation}</p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6 text-red-600" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EligibilityChecker;
