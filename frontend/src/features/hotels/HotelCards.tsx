import React from 'react';
import { motion } from 'framer-motion';
import { HotelRecommendation } from '@/services/api';
import { Star, Check } from 'lucide-react';

interface Props {
  hotels: HotelRecommendation[];
}

export const HotelCards: React.FC<Props> = ({ hotels }) => {
  return (
    <div className="flex overflow-x-auto space-x-6 pb-8 snap-x snap-mandatory hide-scrollbar">
      {hotels.map((hotel, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="min-w-[320px] md:min-w-[400px] snap-center glass-card rounded-[24px] p-6 flex flex-col h-full hover:border-secondary/30 hover:glow-secondary transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-display font-bold text-white line-clamp-2">{hotel.name}</h3>
            <div className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold whitespace-nowrap ml-4">
              {hotel.price_range}
            </div>
          </div>
          
          {hotel.category && (
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Star className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" />
              {hotel.category}
            </div>
          )}
          
          <div className="mt-auto space-y-3">
            <div className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-2">Highlights</div>
            {hotel.highlights.slice(0, 3).map((highlight, hIndex) => (
              <div key={hIndex} className="flex items-start text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
