import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Languages } from 'lucide-react';

import { PretextLayout } from './PretextLayout';
import { API_BASE_URL } from '../constants';


const VoiceMode: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-IN';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleAsk(transcript);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setQuery('');
      setResponse('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleAsk = async (text: string) => {
    const q = text || query;
    if (!q) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, mode: 'flash' })
      });
      const data = await res.json();
      const textResponse = data.response || "I'm sorry, I couldn't reach the information service.";
      setResponse(textResponse);
      speak(textResponse);
    } catch (error) {
      console.error('Voice chat failed');
      setResponse("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Action Button with Waves */}
      <div className="fixed bottom-24 right-6 z-50">
        <AnimatePresence>
          {isListening && (
            <>
              <div className="wave-ring" style={{ animationDelay: '0s' }} />
              <div className="wave-ring" style={{ animationDelay: '0.5s' }} />
              <div className="wave-ring" style={{ animationDelay: '1s' }} />
            </>
          )}
        </AnimatePresence>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-saffron text-white rounded-full shadow-2xl flex items-center justify-center relative z-10"
        >
          <Mic size={28} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex flex-col justify-end"
          >
            <motion.div 
              className="bg-white rounded-t-[3rem] p-8 pb-12 space-y-12 max-w-2xl mx-auto w-full"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                  <Languages size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">English • Hindi</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-10">
                <motion.div 
                  animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all ${isListening ? 'bg-saffron text-white shadow-2xl shadow-saffron/40' : 'bg-slate-50 text-slate-300'}`}
                  onClick={toggleListening}
                >
                  <Mic size={40} />
                </motion.div>

                <div className="text-center w-full min-h-[120px]">
                  <p className="text-xl font-black text-slate-900 mb-6">
                    {isListening ? "Listening..." : isLoading ? "Thinking..." : "How can I help you?"}
                  </p>
                  <PretextLayout 
                    text={query || response || "Ask me about your polling booth or how to register."} 
                    width={300} 
                    fontSize={14}
                    className="text-slate-400 font-medium italic mx-auto"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceMode;
