import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import { PretextLayout } from '../components/PretextLayout';
import { API_BASE_URL } from '../constants';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Namaste! I am Matdaan Mitra. How can I help you with the election process today?', sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, mode: 'flash' })
      });

      const data = await response.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I am having trouble connecting to the election database. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Connection error. Please check if the Matdaan Mitra server is running.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 bg-navy rounded-2xl flex items-center justify-center text-white">
          <Bot />
        </div>
        <div>
          <h2 className="text-xl font-black dark:text-white">Election Assistant</h2>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">AI Powered • Fact Checked</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm font-medium leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-saffron text-white rounded-tr-none' 
                : 'bg-white dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 rounded-tl-none'
            }`}>
              <PretextLayout 
                text={msg.text} 
                width={240} 
                fontSize={14}
                className={msg.sender === 'user' ? 'text-white' : 'text-navy dark:text-white'}
              />
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-3xl rounded-tl-none flex gap-1">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-t-3xl border-t dark:border-gray-800">
        <div className="relative flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e: any) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about voting, documents, or candidates..."
            className="flex-1 px-5 py-4 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-saffron transition-all dark:text-white font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-4 bg-navy text-white rounded-2xl disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
