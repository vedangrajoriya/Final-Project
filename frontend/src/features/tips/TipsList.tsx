import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface Props {
  tips: string[];
}

export const TipsList: React.FC<Props> = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-[24px] p-8"
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
          <Lightbulb className="w-5 h-5 text-secondary" />
        </div>
        <h3 className="text-xl font-display font-bold text-white">Concierge Insights</h3>
      </div>
      
      <ul className="space-y-4">
        {tips.map((tip, index) => (
          <li key={index} className="flex text-muted-foreground font-sans text-sm">
            <span className="text-secondary mr-3 mt-1">•</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
