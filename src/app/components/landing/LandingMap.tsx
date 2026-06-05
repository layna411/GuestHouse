import React from 'react';
import { MapPin } from 'lucide-react';

export function LandingMap() {
  return (
    <section id="map-section" className="py-24 bg-secondary/20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-accent">Location</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mt-2">Map</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4 mb-6"></div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Check out the Saveetha Dental College location and campus facilities near the residency.
          </p>
        </div>

        {/* Interactive Google Map Wrapper */}
        <div className="relative rounded-2xl border border-border/40 overflow-hidden shadow-2xl bg-card h-[500px] sm:h-[600px] w-full flex flex-col md:flex-row">
          
          {/* Real Interactive Google Maps iframe */}
          <div className="w-full h-full relative z-0">
            <iframe
              src="https://maps.google.com/maps?q=Saveetha%20Dental%20College%20and%20Hospitals,%20Poonamallee%20High%20Road,%20Velappanchavadi,%20Chennai&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Saveetha Dental College Location Map"
              className="w-full h-full filter invert-[0.05] contrast-[0.95]"
            />
          </div>

          {/* Premium Floating Location Detail Card */}
          <div className="absolute top-6 left-6 right-6 md:right-auto z-10 max-w-sm p-6 bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/60 rounded-2xl shadow-2xl space-y-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-success/15 border border-success/30 text-[10px] font-bold text-success uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                Active Campus Residency
              </span>
              <h4 className="font-serif text-lg font-bold text-foreground">
                Saveetha Dental College Guest House
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Located within the prestigious SIMATS Velappanchavadi campus, Poonamallee High Road, Chennai, India.
              </p>
            </div>

            <div className="border-t border-border/20 pt-3.5 space-y-2.5">
              <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">
                Nearby Famous Places
              </span>
              <div className="space-y-2 text-[11px] font-semibold text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    Chennai Central Station
                  </span>
                  <span className="text-[10px] text-muted-foreground/75 font-sans font-bold">~20 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    Koyambedu (CMBT)
                  </span>
                  <span className="text-[10px] text-muted-foreground/75 font-sans font-bold">~9 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    Egmore Station
                  </span>
                  <span className="text-[10px] text-muted-foreground/75 font-sans font-bold">~18 km</span>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Saveetha+Dental+College+and+Hospitals+Chennai"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-accent/10 cursor-pointer"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
