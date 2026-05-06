import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { SceneBackground } from '@/three/SceneBackground';
import { HeroSection } from '@/features/input/HeroSection';
import { LoadingSequence } from '@/features/loading/LoadingSequence';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { AlertCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const { status, error, reset } = useAppStore();

  return (
    <main className="relative min-h-screen">
      {/* 3D Background only renders when idle or loading */}
      <AnimatePresence>
        {(status === 'idle' || status === 'loading') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-0"
          >
            <SceneBackground />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
            >
              <HeroSection />
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingSequence />
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="min-h-screen flex items-center justify-center p-4 bg-background"
            >
              <div className="glass-card rounded-[24px] p-8 max-w-md text-center border-red-500/30">
                <div className="w-16 h-16 rounded-full bg-red-500/20 mx-auto flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-4">Synthesis Failed</h2>
                <p className="text-muted-foreground mb-8">{error}</p>
                <button
                  onClick={reset}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                >
                  Return to Matrix
                </button>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Dashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};
