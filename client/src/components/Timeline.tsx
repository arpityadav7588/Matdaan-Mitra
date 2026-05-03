import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PretextLayout } from './PretextLayout';
import { API_BASE_URL, MOCK_TIMELINE } from '../constants';

interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  status: 'completed' | 'upcoming';
}

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(MOCK_TIMELINE);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timeline`); 
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      }
      return MOCK_TIMELINE;
    } catch (error) {
      // Log the specific error to help distinguish between CORS, Network, or Syntax issues
      console.error("Failed to fetch timeline, using mock data:", error);
      return MOCK_TIMELINE; 
    }
  };

  useEffect(() => {
    const loadTimeline = async () => {
      setLoading(true);
      const data = await fetchTimeline();
      setEvents(data);
      setLoading(false);
    };

    loadTimeline();
  }, []);

  return (
    <div className="relative min-w-[1000px] py-10">
      {/* Connector Line */}
      <div className="absolute top-[88px] left-0 right-0 h-1 bg-slate-100 rounded-full" />
      
      <div className="flex justify-between relative">
        {events.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="timeline-node"
          >
            {/* Date Label */}
            <div className="mb-6">
              <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${item.status === 'completed' ? 'bg-green-eci text-white' : 'bg-slate-900 text-white'}`}>
                {item.date}
              </span>
            </div>

            {/* Dot */}
            <div className={`timeline-dot ${item.status === 'completed' ? 'bg-green-eci scale-125' : 'bg-slate-200'} mb-6 group-hover:scale-150 transition-all`} />

            {/* Content */}
            <div className="text-center space-y-2">
              <h3 className="font-black text-slate-900 text-sm">{item.event}</h3>
              <div className="max-w-[180px] mx-auto">
                <PretextLayout 
                  text={item.description || "Official ECI update pending."} 
                  width={160} 
                  fontSize={11} 
                  className="text-slate-400 font-medium leading-relaxed"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
