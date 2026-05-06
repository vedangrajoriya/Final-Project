import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  "Establishing Neural Link...",
  "Researching Global Destinations...",
  "Synthesizing Luxury Itinerary...",
  "Generating Atmospheric Visuals...",
  "Finalizing Experience Matrix..."
];

export const LoadingSequence: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Fake progress through steps while waiting for API
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-black to-black opacity-80 z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Luminous Pulse Orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary blur-[40px] opacity-70 mb-12"
        />

        <div className="h-12 overflow-hidden relative w-full max-w-md text-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentStep}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-2xl md:text-3xl font-display font-semibold text-white absolute w-full"
            >
              {LOADING_STEPS[currentStep]}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Progress Line */}
        <div className="w-64 h-[2px] bg-white/10 mt-8 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};
