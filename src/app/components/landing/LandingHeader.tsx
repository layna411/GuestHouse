import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Sparkles, Menu, X } from 'lucide-react';
import { User, Room } from '../../types';

interface LandingHeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  bookingFlowState: 'landing' | 'room-details' | 'checkout' | 'confirmation';
  setBookingFlowState: (state: 'landing' | 'room-details' | 'checkout' | 'confirmation') => void;
  setSelectedRoomForBooking: (room: Room | null) => void;
  setBookingFormDetails: (details: any) => void;
  setBookingErrors: (errors: any) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  currentUser,
  onLogout,
  onNavigateToDashboard,
  bookingFlowState,
  setBookingFlowState,
  setSelectedRoomForBooking,
  setBookingFormDetails,
  setBookingErrors,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    setBookingFlowState('landing');
    setSelectedRoomForBooking(null);
    setBookingFormDetails({
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      purpose: '',
      extraBed: false,
      offers: true,
    });
    setBookingErrors({});
    
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border/40"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={(e) => handleNavClick(e as any, 'hero')}
        >
          <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shadow-lg shadow-accent/5">
            <Key className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-wider text-foreground flex items-center gap-1.5 leading-none">
              Saveetha
            </span>
            <p className="text-[9px] tracking-widest text-accent uppercase font-bold">GuestHouse Booking</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Home</a>
          <a href="#rooms-catalog" onClick={(e) => handleNavClick(e, 'rooms-catalog')} className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Rooms</a>
          <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Gallery</a>
          <a href="#amenities" onClick={(e) => handleNavClick(e, 'amenities')} className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Amenities</a>
          <a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')} className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Reviews</a>
          <a href="#faqs" onClick={(e) => handleNavClick(e, 'faqs')} className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">FAQ</a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser && (
            <>
              <button 
                onClick={onNavigateToDashboard}
                className="glass-button px-5 py-2 rounded-lg text-sm font-semibold hover:text-accent flex items-center gap-2 border border-border"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                {currentUser.role === 'admin' ? 'Admin Portal' : 'My Bookings'}
              </button>
              <button 
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground/80 hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/40 px-4 py-6 flex flex-col gap-4 shadow-xl"
          >
            <a href="#hero" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'hero'); }} className="text-lg font-semibold text-foreground/80 hover:text-accent">Home</a>
            <a href="#rooms-catalog" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'rooms-catalog'); }} className="text-lg font-semibold text-foreground/80 hover:text-accent">Rooms</a>
            <a href="#gallery" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'gallery'); }} className="text-lg font-semibold text-foreground/80 hover:text-accent">Gallery</a>
            <a href="#amenities" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'amenities'); }} className="text-lg font-semibold text-foreground/80 hover:text-accent">Amenities</a>
            <a href="#reviews" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'reviews'); }} className="text-lg font-semibold text-foreground/80 hover:text-accent">Reviews</a>
            <a href="#faqs" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'faqs'); }} className="text-lg font-semibold text-foreground/80 hover:text-accent">FAQ</a>
            
            <hr className="border-border/40 my-2" />
            
            {currentUser && (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { onNavigateToDashboard(); setMobileMenuOpen(false); }}
                  className="glass-button w-full py-2.5 rounded-lg text-sm font-semibold hover:text-accent text-center"
                >
                  {currentUser.role === 'admin' ? 'Admin Portal' : 'My Bookings'}
                </button>
                <button 
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-sm text-center text-destructive"
                >
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
