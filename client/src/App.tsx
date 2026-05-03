import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Home as HomeIcon, UserCheck, HelpCircle, Users, Moon, Sun, Bot, Globe, X } from 'lucide-react';


import Home from './pages/Home';
import Eligibility from './pages/Eligibility';
import Process from './pages/Process';
import Candidates from './pages/Candidates';
import Documents from './pages/Documents';
import Assistant from './pages/Assistant';
import VoiceMode from './components/VoiceMode';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [lang, setLang] = useState('English');

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-inter">
        {/* Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-[100]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-eci rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-eci/20">M</div>
              <span className="text-xl font-black tracking-tight dark:text-white text-slate-900">Matdaan Mitra</span>
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowLang(true)}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
              >
                <Globe size={20} />
              </button>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto pb-32">
          <PageContent />
        </main>

        <VoiceMode />

        {/* Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-[100] pb-safe shadow-2xl">
          <div className="max-w-4xl mx-auto flex justify-between items-center px-8 py-4">
            <NavLink to="/" icon={<HomeIcon />} label="Home" />
            <NavLink to="/verify" icon={<UserCheck />} label="Verify" />
            <NavLink to="/assistant" icon={<Bot />} label="AI Chat" />
            <NavLink to="/how-to-vote" icon={<HelpCircle />} label="Process" />
            <NavLink to="/candidates" icon={<Users />} label="Who" />
          </div>
        </nav>

        {/* Language Switcher Bottom Sheet */}
        <AnimatePresence>
          {showLang && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLang(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 z-[201] rounded-t-[3rem] p-8 pb-12 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Choose Language</h3>
                  <button onClick={() => setShowLang(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <LangButton flag="🇮🇳" label="English" sub="Universal" active={lang === 'English'} onClick={() => { setLang('English'); setShowLang(false); }} />
                  <LangButton flag="🇮🇳" label="हिन्दी" sub="Hindi" active={lang === 'हिन्दी'} onClick={() => { setLang('हिन्दी'); setShowLang(false); }} />
                  <LangButton flag="🇮🇳" label="தமிழ்" sub="Tamil" active={lang === 'தமிழ்'} onClick={() => { setLang('தமிழ்'); setShowLang(false); }} />
                  <LangButton flag="🇮🇳" label="తెలుగు" sub="Telugu" active={lang === 'తెలుగు'} onClick={() => { setLang('తెలుగు'); setShowLang(false); }} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
};

const LangButton = ({ flag, label, sub, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2rem] border-2 transition-all text-left space-y-2 ${active ? 'bg-saffron/10 border-saffron shadow-lg shadow-saffron/10' : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200'}`}
  >
    <span className="text-3xl block mb-2">{flag}</span>
    <p className={`font-black text-lg ${active ? 'text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}>{label}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
  </button>
);

const PageContent = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Eligibility />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/how-to-vote" element={<Process />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/docs" element={<Documents />} />
      </Routes>
    </AnimatePresence>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: any; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="flex flex-col items-center gap-1">
      <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-indigo-eci text-white shadow-lg shadow-indigo-eci/30 scale-110' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900'}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-indigo-eci' : 'text-slate-400 dark:text-slate-600'}`}>
        {label}
      </span>
    </Link>
  );
};

export default App;
