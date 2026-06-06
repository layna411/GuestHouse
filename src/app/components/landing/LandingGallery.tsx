import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_IMAGES as FALLBACK_IMAGES } from './constants';
import { galleryApi } from '../../services/api';

export function LandingGallery() {
  const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await galleryApi.getAll();
        if (data.length > 0) {
          setImages(data.map(p => p.imageUrl));
        }
      } catch (err) {
        console.error("Failed to load database gallery, using defaults.", err);
      }
    };
    fetchPhotos();
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images]);

  return (
    <>
      {/* Photo Gallery Showcase */}
      <section id="gallery" className="py-24 bg-background border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-center mb-16 text-foreground">
            Photo Gallery
          </h2>

          <div className="space-y-6">
            {/* Row 1: 2 Landscape Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.slice(0, 2).map((imgUrl, index) => (
                <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1, duration: 0.6 }}
                   className="relative h-64 sm:h-80 md:h-[450px] rounded-xl overflow-hidden cursor-pointer group border border-border/40 hover:border-accent bg-card shadow-md hover:shadow-xl transition-all"
                   onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={imgUrl}
                    alt={`Photo Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 bg-white/10 rounded-lg text-xs font-semibold text-white border border-white/10 backdrop-blur-sm">
                      View Photo
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Row 2: 3 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.slice(2, 5).map((imgUrl, index) => {
                const actualIndex = index + 2;
                return (
                  <motion.div
                    key={actualIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="relative h-56 sm:h-64 md:h-[320px] rounded-xl overflow-hidden cursor-pointer group border border-border/40 hover:border-accent bg-card shadow-md hover:shadow-xl transition-all"
                    onClick={() => setLightboxIndex(actualIndex)}
                  >
                    <img
                      src={imgUrl}
                      alt={`Photo Gallery ${actualIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-4 py-2 bg-white/10 rounded-lg text-xs font-semibold text-white border border-white/10 backdrop-blur-sm">
                        View Photo
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Expanded section: displays the remaining images */}
            <AnimatePresence>
              {showAllGallery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
                    {images.slice(5).map((imgUrl, index) => {
                      const actualIndex = index + 5;
                      return (
                        <motion.div
                          key={actualIndex}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (index % 4) * 0.05, duration: 0.5 }}
                          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border border-border/40 hover:border-accent bg-card shadow-md hover:shadow-xl transition-all"
                          onClick={() => setLightboxIndex(actualIndex)}
                        >
                          <img
                            src={imgUrl}
                            alt={`Photo Gallery ${actualIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-semibold text-white border border-white/10 backdrop-blur-sm">
                              View Photo
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Show More/Less Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              className="px-8 py-3 rounded-full border border-border/85 hover:border-accent text-sm font-semibold tracking-wide text-foreground bg-card hover:bg-secondary transition-all duration-300 shadow-sm hover:shadow-md uppercase text-xs cursor-pointer"
            >
              {showAllGallery ? 'Show Less' : 'Show More'}
            </button>
          </div>

        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 md:p-8 cursor-zoom-out"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4 w-full" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-serif text-lg font-bold">Saveetha Gallery Showcase</h3>
              <p className="text-xs text-slate-400">Photo {lightboxIndex + 1} of {images.length}</p>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Image display with navigation arrows */}
          <div className="flex-1 flex items-center justify-between relative my-4 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
              }}
              className="absolute left-2 md:left-4 z-10 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-sm transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[lightboxIndex]}
                alt={`Zoomed Photo ${lightboxIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/5"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
              }}
              className="absolute right-2 md:right-4 z-10 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-sm transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer slide indicators */}
          <div className="text-center text-slate-400 text-xs py-2 w-full" onClick={(e) => e.stopPropagation()}>
            Use Arrow Keys Left/Right to Navigate • Esc to Close
          </div>
        </div>
      )}
    </>
  );
}
