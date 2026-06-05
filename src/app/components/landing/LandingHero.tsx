import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Search, Sparkles } from 'lucide-react';
import { HERO_SLIDES } from './constants';

interface LandingHeroProps {
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  guestCount: number;
  setGuestCount: (val: number) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guestCount,
  setGuestCount,
  onSearch,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95)), url("${HERO_SLIDES[currentSlide].image}")` 
            }}
          />
        </AnimatePresence>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-300">Ultra Pro Guest Rooms</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 leading-none">
            {HERO_SLIDES[currentSlide].title}
          </h1>
          <p className="font-serif text-lg sm:text-2xl text-amber-200/90 font-medium tracking-wide mb-6 italic">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>
          <p className="max-w-2xl text-slate-300 text-sm sm:text-lg mb-12">
            {HERO_SLIDES[currentSlide].description}
          </p>
        </motion.div>

        {/* Check-In / Search Glassmorphic Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-4xl mx-auto"
        >
          <form 
            onSubmit={onSearch}
            className="bg-secondary/95 dark:bg-card/95 p-6 sm:p-8 rounded-lg border border-border/80 dark:border-border/30 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-left shadow-2xl"
          >
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" /> Check In
              </label>
              <input 
                type="date"
                required
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-background dark:bg-secondary border border-border dark:border-border/60 rounded px-4 py-2.5 text-sm w-full text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" /> Check Out
              </label>
              <input 
                type="date"
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-background dark:bg-secondary border border-border dark:border-border/60 rounded px-4 py-2.5 text-sm w-full text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent" /> Guests
              </label>
              <select 
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="bg-background dark:bg-secondary border border-border dark:border-border/60 rounded px-4 py-2.5 text-sm w-full text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              >
                <option value={1} className="bg-background dark:bg-card text-foreground">1 Guest</option>
                <option value={2} className="bg-background dark:bg-card text-foreground">2 Guests</option>
                <option value={3} className="bg-background dark:bg-card text-foreground">3 Guests</option>
                <option value={4} className="bg-background dark:bg-card text-foreground">4 Guests</option>
              </select>
            </div>

            <button 
              type="submit"
              className="glass-button-gold w-full h-11 rounded font-semibold text-sm flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Check Availability
            </button>
          </form>
        </motion.div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2.5 z-20">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3.5 h-1.5 rounded-full transition-all cursor-pointer ${
              currentSlide === idx 
                ? 'bg-accent w-6' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
