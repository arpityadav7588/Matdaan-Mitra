import React, { useState } from 'react';
import { MessageSquare, Mic, MicOff, Send } from 'lucide-react';
import { API_BASE_URL } from '../constants';


const AIChat: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu'];

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // Rough mapping for demo
    if (language === 'Hindi') utterance.lang = 'hi-IN';
    else if (language === 'Tamil') utterance.lang = 'ta-IN';
    else if (language === 'Telugu') utterance.lang = 'te-IN';
    else utterance.lang = 'en-IN';
    
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, mode: 'flash' })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
        if (voiceMode) speak(data.response);
      }
    } catch (err) {
      console.error('Chat Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-[500px] flex flex-col my-8">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <h3 className="text-xl font-bold text-[#000080] flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Matdaan Mitra Assistant
        </h3>
        <div className="flex gap-4">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border rounded px-2"
          >
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button 
            onClick={() => setVoiceMode(!voiceMode)}
            className={`p-2 rounded-full ${voiceMode ? 'bg-[#FF9933] text-white' : 'bg-gray-100'}`}
          >
            {voiceMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user' ? 'bg-[#FF9933] text-white' : 'bg-gray-100 text-gray-800'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm italic">Thinking...</div>}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e: any) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about voting, documents, or candidates..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9933] outline-none"
        />
        <button onClick={sendMessage} className="btn-primary p-2">
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
