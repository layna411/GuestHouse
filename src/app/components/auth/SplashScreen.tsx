import React, { useEffect } from 'react';
import { Building2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center bg-background text-foreground font-sans transition-colors duration-300"
      style={{
        backgroundImage: 'linear-gradient(to bottom, var(--background-overlay-start), var(--background-overlay-end)), url("/images/image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="relative">
            <Building2 className="w-20 h-20 text-primary" strokeWidth={1.5} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-accent animate-pulse" fill="currentColor" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-3xl font-bold text-foreground mb-2"
        >
          Saveetha GuestHouse Booking
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-lg mb-8"
        >
          Guest House Management
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <div className="flex gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
