import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, Camera, CheckCircle2, AlertCircle, X, Image as ImageIcon, UploadCloud } from 'lucide-react';

const Documents: React.FC = () => {
  const [docs, setDocs] = useState([
    { id: 1, name: 'Voter ID (EPIC)', status: 'pending', required: true },
    { id: 2, name: 'Aadhaar Card', status: 'pending', required: false },
    { id: 3, name: 'Passport', status: 'pending', required: false },
  ]);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const toggleDoc = (id: number) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'done' ? 'pending' : 'done' } : d));
  };

  const simulateCapture = () => {
    setUploading(true);
    setTimeout(() => {
      setPreview('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400');
      setUploading(false);
    }, 1500);
  };

  const progress = Math.round((docs.filter(d => d.status === 'done').length / docs.length) * 100);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Document Checklist</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Verify for Polling Day</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-eci/10 flex items-center justify-center text-indigo-eci font-black text-sm">
          {progress}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-green-eci"
        />
      </div>

      <div className="space-y-4">
        {docs.map((doc) => (
          <motion.div 
            key={doc.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleDoc(doc.id)}
            className={`p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between cursor-pointer ${doc.status === 'done' ? 'bg-green-eci/5 border-green-eci/20' : 'bg-white border-slate-100 shadow-sm'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.status === 'done' ? 'bg-green-eci text-white' : 'bg-slate-50 text-slate-300'}`}>
                {doc.status === 'done' ? <CheckCircle2 size={20} /> : <FileCheck size={20} />}
              </div>
              <div>
                <h3 className={`font-black ${doc.status === 'done' ? 'text-green-eci' : 'text-slate-900'}`}>{doc.name}</h3>
                {doc.required && <span className="text-[9px] font-black text-saffron uppercase tracking-widest">Mandatory</span>}
              </div>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); simulateCapture(); }}
              className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-eci transition-colors"
            >
              <Camera size={20} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Camera Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[200] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-black text-lg">Identity Verified</h3>
              <button onClick={() => setPreview(null)} className="text-white p-2 bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 rounded-[3rem] overflow-hidden bg-slate-800 border-2 border-white/20 relative shadow-2xl">
              <img src={preview} alt="ID Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-eci rounded-2xl flex items-center justify-center text-white">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <p className="text-white font-black">AI Match: 98%</p>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Rahul Kumar • New Delhi</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setPreview(null)}
              className="mt-8 btn-primary w-full bg-green-eci shadow-green-eci/20"
            >
              Confirm Document
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-50 p-6 rounded-[2rem] flex gap-4 border border-slate-100">
        <AlertCircle className="text-saffron shrink-0" size={20} />
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Ensure your documents are original and current. Photocopies or digital versions may not be accepted at all polling stations.
        </p>
      </div>
    </div>
  );
};

export default Documents;
