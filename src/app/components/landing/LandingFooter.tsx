import React from 'react';
import { Key, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

interface LandingFooterProps {
  onOpenLogin: () => void;
  setBookingFlowState: (state: 'landing' | 'room-details' | 'checkout' | 'confirmation') => void;
}

export function LandingFooter({ onOpenLogin, setBookingFlowState }: LandingFooterProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    setBookingFlowState('landing');
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
    <footer className="relative bg-primary text-primary-foreground border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
              <Key className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-wider bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent">
                Saveetha
              </span>
              <p className="text-[10px] tracking-widest text-accent -mt-1 uppercase font-bold">GuestHouse Booking</p>
            </div>
          </div>
          <p className="text-white/70 text-xs leading-relaxed">
            Saveetha University's premier academic residency and luxury guest rooms. Experience the perfect blend of modern comfort and classic academic prestige.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-serif text-lg text-white font-semibold mb-6">Explore</h4>
          <div className="flex flex-col gap-3 text-xs text-white/60">
            <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} className="hover:text-accent transition-colors">Home</a>
            <a href="#rooms-catalog" onClick={(e) => handleNavClick(e, 'rooms-catalog')} className="hover:text-accent transition-colors">Rooms & Accommodations</a>
            <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className="hover:text-accent transition-colors">Gallery Showcase</a>
            <a href="#amenities" onClick={(e) => handleNavClick(e, 'amenities')} className="hover:text-accent transition-colors">Premium Facilities</a>
            <a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')} className="hover:text-accent transition-colors">Guest Experiences</a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-lg text-white font-semibold mb-6">Contact Us</h4>
          <div className="flex flex-col gap-4 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Saveetha University Campus, Chennai, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              <span>+91 98765 00000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <span>guesthouse@saveetha.edu</span>
            </div>
          </div>
        </div>

        {/* Portal Access */}
        <div>
          <h4 className="font-serif text-lg text-white font-semibold mb-6">Portal Access</h4>
          <p className="text-white/60 text-xs mb-4">
            Authorized administrator and guest service staff portal.
          </p>
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent/80 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
          >
            Admin & Staff Portal Sign In
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-8 text-center text-xs text-white/40">
        <p>© {new Date().getFullYear()} Saveetha GuestHouse Booking. All rights reserved.</p>
      </div>
    </footer>
  );
}
