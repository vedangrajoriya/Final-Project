import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { MapPin, RefreshCw } from 'lucide-react';
import { ItineraryTimeline } from '../itinerary/ItineraryTimeline';
import { HotelCards } from '../hotels/HotelCards';
import { BudgetWidget } from '../budget/BudgetWidget';
import { ImageGallery } from '../gallery/ImageGallery';
import { TipsList } from '../tips/TipsList';

export const Dashboard: React.FC = () => {
  const { data, reset } = useAppStore();

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background relative z-10">
      {/* Hero Header with Parallax Image */}
      <div className="relative h-[60vh] w-full overflow-hidden flex items-end pb-16">
        <div className="absolute inset-0">
          <img 
            src={data.images[0] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop'} 
            alt={data.destination}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 flex justify-between items-end">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center text-primary mb-2 font-semibold tracking-[0.2em] text-sm uppercase">
              <MapPin className="w-4 h-4 mr-2" /> DESTINATION
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white glow-text">
              {data.destination}
            </h1>
          </motion.div>
          
          <button 
            onClick={reset}
            className="hidden md:flex items-center px-4 py-2 rounded-full glass-panel hover:bg-white/10 transition-colors text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> New Synthesis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 space-y-32">
        
        {/* Narrative Description */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h2 className="text-3xl font-display font-bold mb-6 text-white/90">The Vision</h2>
          <p className="text-xl leading-relaxed text-muted-foreground font-sans">
            {data.experience_description}
          </p>
        </motion.section>

        {/* Gallery */}
        <section>
          <ImageGallery images={data.images} />
        </section>

        {/* Two Column Layout for Itinerary & Sidebar (Hotels, Budget, Tips) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Column - Itinerary */}
          <div className="lg:col-span-8 space-y-12">
            <h2 className="text-4xl font-display font-bold text-white sticky top-6 bg-background/80 backdrop-blur-md py-4 z-20">
              Neural Itinerary
            </h2>
            <ItineraryTimeline days={data.itinerary} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <BudgetWidget budget={data.budget_estimate} />
            <TipsList tips={data.tips} />
          </div>
        </div>

        {/* Hotels Section - Full Width */}
        <section className="pt-12 border-t border-white/10">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-4xl font-display font-bold text-white">Recommended Sanctuaries</h2>
          </div>
          <HotelCards hotels={data.hotels} />
        </section>
        
      </div>
      
      {/* Mobile Reset Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={reset}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-white shadow-lg glow-primary"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
