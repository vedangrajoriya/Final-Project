import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  images: string[];
}

export const ImageGallery: React.FC<Props> = ({ images }) => {
  if (!images || images.length === 0) return null;

  // We skip the first image as it's used in the hero header
  const galleryImages = images.slice(1);
  if (galleryImages.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {galleryImages.map((url, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="relative group rounded-[24px] overflow-hidden aspect-[4/3]"
        >
          <img 
            src={url} 
            alt="Generated destination view" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
      ))}
    </div>
  );
};
