import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, CheckCircle2, QrCode, FileText, ChevronDown, Landmark, ShieldCheck, Loader2 } from 'lucide-react';
import { PretextLayout } from '../components/PretextLayout';
import { API_BASE_URL } from '../constants';

const DEFAULT_STEPS = [
  {
    title: '1. Identity Check',
    icon: <FileText className="w-5 h-5" />,
    desc: 'Verify your name in the electoral roll and show your ID proof.',
    details: 'You can use EPIC (Voter ID) or 12 alternative documents like Aadhaar, Passport, or PAN card.'
  },
  {
    title: '2. Inking & Slip',
    icon: <Fingerprint className="w-5 h-5" />,
    desc: 'Get your left index finger marked with indelible ink.',
    details: 'The officer will record your signature in the register and give you a small signed slip.'
  },
  {
    title: '3. Casting the Vote',
    icon: <QrCode className="w-5 h-5" />,
    desc: 'Enter the voting compartment and press the blue button on the EVM.',
    details: 'Press the button next to your chosen candidate. A red light will glow and a long beep will sound.'
  },
  {
    title: '4. VVPAT Verification',
    icon: <CheckCircle2 className="w-5 h-5" />,
    desc: 'Verify your choice on the VVPAT paper slip.',
    details: 'The slip showing your candidates name and symbol will be visible for 7 seconds before dropping into the box.'
  }
];

const Process: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/process?lang=en`);
        const data = await res.json();
        if (data.success && data.data) {
          // Map icons back to steps
          const mappedSteps = data.data.map((step: any, index: number) => ({
            ...step,
            icon: DEFAULT_STEPS[index]?.icon || <ShieldCheck className="w-5 h-5" />
          }));
          setSteps(mappedSteps);
        }
      } catch (err) {
        console.error('Failed to fetch voting process');
      } finally {
        setLoading(false);
      }
    };
    fetchProcess();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-eci/10 rounded-2xl flex items-center justify-center text-indigo-eci">
            <Landmark size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Voting Process</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Guided by ECI Regulations</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            className="glass-card overflow-hidden border-slate-100"
          >
            <button 
              onClick={() => setExpanded(expanded === index ? null : index)}
              className="w-full p-6 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${expanded === index ? 'bg-indigo-eci text-white shadow-lg shadow-indigo-eci/30' : 'bg-slate-100 text-slate-400'}`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-black text-lg ${expanded === index ? 'text-indigo-eci' : 'text-slate-900'}`}>{step.title}</h3>
                <p className="text-xs text-slate-400 font-medium">{step.desc}</p>
              </div>
              <motion.div
                animate={{ rotate: expanded === index ? 180 : 0 }}
                className="text-slate-300"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {expanded === index && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="pt-4 border-t border-slate-50">
                    <PretextLayout 
                      text={step.details} 
                      width={300} 
                      fontSize={13}
                      className="text-slate-500 font-medium leading-relaxed"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-eci p-8 rounded-[3rem] text-white flex gap-6 shadow-2xl shadow-indigo-eci/20">
        <ShieldCheck className="shrink-0" size={32} />
        <div>
          <h4 className="font-black text-lg mb-2">Polling Day Support</h4>
          <p className="text-sm text-indigo-100 font-medium leading-relaxed">
            Our AI assistant is available 24/7 on polling day to help you with last-minute questions or booth issues.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Process;
