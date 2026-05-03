import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, MapPin, Search } from 'lucide-react';
import Timeline from '../components/Timeline';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-saffron/10 via-white to-transparent rounded-full -z-10 blur-3xl" />
        
        <div className="max-w-xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-saffron/10 text-saffron rounded-full text-xs font-black uppercase tracking-widest"
          >
            <Shield size={14} /> 100% Secure & Neutral
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight"
          >
            Your Voice, <br />
            <span className="text-indigo-eci">Your Vote,</span> <br />
            Our Future.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 font-medium leading-relaxed"
          >
            Matdaan Mitra helps you navigate the election process with AI-powered guidance, candidate transparency, and step-by-step voting day support.
          </motion.p>
        </div>
      </section>

      {/* Horizontal Timeline */}
      <section className="px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Election Roadmap</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">General Elections 2026</p>
          </div>
          <button className="text-saffron font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            Full Schedule <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <Timeline />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4 px-6">
        <QuickActionCard 
          icon={<MapPin className="text-indigo-eci" />} 
          title="Find Booth" 
          desc="Locate your polling station" 
        />
        <QuickActionCard 
          icon={<Search className="text-green-eci" />} 
          title="Candidates" 
          desc="Who's contesting?" 
        />
      </section>
    </div>
  );
};

const QuickActionCard = ({ icon, title, desc }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.98 }}
    className="glass-card p-6 flex flex-col gap-4 border-slate-200"
  >
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">
      {icon}
    </div>
    <div>
      <h3 className="font-black text-slate-900">{title}</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{desc}</p>
    </div>
  </motion.div>
);

export default Home;
