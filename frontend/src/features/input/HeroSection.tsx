import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Send, MapPin, Calendar, Wallet, Tag } from 'lucide-react';

const PREFERENCE_SUGGESTIONS = ['Luxury', 'Culture', 'Gastronomy', 'Wellness', 'Adventure', 'Nature'];

export const HeroSection: React.FC = () => {
  const submitRequest = useAppStore((state) => state.submitRequest);
  
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState('$5000');
  const [preferences, setPreferences] = useState<string[]>(['Luxury']);

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    
    submitRequest({
      destination,
      days,
      budget,
      preferences,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-[0.15em] text-primary-dim uppercase"
          >
            Celestial Concierge
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 glow-text leading-tight">
            Design Your <br /> Next Horizon
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-sans max-w-lg mx-auto">
            Initiate a neural synthesis of global experiences. Our intelligence curates beyond the boundary of ordinary travel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-[24px] p-6 md:p-8 space-y-6 glow-primary">
          <div className="space-y-4">
            {/* Destination */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to? (e.g. Kyoto, Japan)"
                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-white/30 transition-all font-sans text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Days */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all font-sans"
                />
              </div>

              {/* Budget */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Budget"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white transition-all font-sans"
                />
              </div>
            </div>

            {/* Preferences */}
            <div>
              <div className="flex items-center text-sm text-muted-foreground mb-3 font-semibold tracking-wider">
                <Tag className="w-4 h-4 mr-2" /> PREFERENCES
              </div>
              <div className="flex flex-wrap gap-2">
                {PREFERENCE_SUGGESTIONS.map((pref) => {
                  const isSelected = preferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreference(pref)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(0,122,255,0.3)]' 
                          : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative bg-black/50 backdrop-blur-md rounded-xl px-6 py-4 flex items-center justify-center transition-all group-hover:bg-transparent">
              <span className="font-bold text-white tracking-wide mr-2">INITIALIZE SYNTHESIS</span>
              <Send className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
