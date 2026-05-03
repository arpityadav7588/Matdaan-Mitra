import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, ShieldCheck, Search } from 'lucide-react';

import CryptoJS from 'crypto-js';
import { PretextLayout } from '../components/PretextLayout';
import { API_BASE_URL } from '../constants';


const Eligibility: React.FC = () => {
  const [voterId, setVoterId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!voterId.match(/^[A-Z]{3}[0-9]{7}$/)) {
      setError('Invalid format. Use ABC1234567');
      return;
    }

    setLoading(true);
    setError('');
    setStatus(null);

    try {
      // Step 1: Client-side hashing for Privacy (Zero PII transfer)
      const hashedId = CryptoJS.SHA256(voterId.trim().toUpperCase()).toString();

      // Step 2: API Call
      const response = await fetch(`${API_BASE_URL}/eligibility`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashedId })
      });

      const result = await response.json();
      if (result.success) {
        setStatus(result.data);
      } else {
        setError(result.message || 'Record not found.');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="p-4 space-y-6"
    >
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
          <UserCheck className="text-saffron" /> Am I Eligible?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Check your registration status securely. We use client-side hashing to ensure your Voter ID remains private.
        </p>
        
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              placeholder="Enter Voter ID"
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-saffron transition-all dark:text-white font-bold"
            />
            <button 
              onClick={handleCheck}
              disabled={loading || !voterId}
              className="absolute right-2 top-2 bg-saffron text-white p-2 rounded-xl disabled:opacity-50 hover:scale-105 transition-transform"
            >
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs font-bold pl-2">{error}</p>}
        </div>
      </div>

      <AnimatePresence>
        {status && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card border-2 border-green bg-green/5 dark:bg-green/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-green w-8 h-8" />
              <div>
                <h3 className="font-bold text-green dark:text-green-400">Verified Voter Record</h3>
                <p className="text-xs text-gray-500">Last updated: 2 hours ago</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Voter Name</p>
                <PretextLayout text={status.name} width={120} fontSize={14} className="font-bold dark:text-white" />
              </div>
              <div>
                <p className="text-gray-500">Polling Day</p>
                <PretextLayout text={status.date} width={120} fontSize={14} className="font-bold dark:text-white" />
              </div>
              <div className="col-span-2 pt-2 border-t dark:border-gray-700">
                <p className="text-gray-500">Polling Station</p>
                <PretextLayout text={status.booth} width={280} fontSize={14} className="font-bold dark:text-white" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Eligibility;
