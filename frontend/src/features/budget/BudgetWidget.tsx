import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

interface Props {
  budget: string;
}

export const BudgetWidget: React.FC<Props> = ({ budget }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-[24px] p-8 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>
      
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
          <Wallet className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-display font-bold text-white">Financial Projection</h3>
      </div>
      
      <div className="text-muted-foreground font-sans leading-relaxed">
        {/* If the budget estimate is a string, just display it. Often LLMs return a short paragraph. */}
        {budget}
      </div>
    </motion.div>
  );
};
