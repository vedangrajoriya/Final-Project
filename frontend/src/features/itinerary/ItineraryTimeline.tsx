import React from 'react';
import { motion } from 'framer-motion';
import { ItineraryDay } from '@/services/api';

interface Props {
  days: ItineraryDay[];
}

export const ItineraryTimeline: React.FC<Props> = ({ days }) => {
  return (
    <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12 pb-12">
      {days.map((day, index) => (
        <motion.div 
          key={day.day}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative pl-8 md:pl-12"
        >
          {/* Timeline Node */}
          <div className="absolute w-4 h-4 rounded-full bg-primary -left-[9px] top-1.5 glow-primary shadow-[0_0_15px_#007AFF]"></div>
          
          <div className="glass-card rounded-[20px] p-6 md:p-8 hover:border-primary/30 transition-colors group">
            <div className="flex items-baseline mb-4">
              <span className="text-primary font-display font-bold text-lg mr-4">Day {day.day}</span>
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{day.title}</h3>
            </div>
            
            <ul className="space-y-4">
              {day.activities.map((activity, actIndex) => (
                <li key={actIndex} className="flex text-muted-foreground font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2.5 mr-4 flex-shrink-0"></span>
                  <span className="leading-relaxed">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
