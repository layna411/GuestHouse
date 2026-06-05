import React from 'react';
import { motion } from 'motion/react';
import { Key, Users, Shield, MapPin, Info, Calendar } from 'lucide-react';
import { AMENITIES, ALL_FACILITIES } from './constants';

export function LandingAmenities() {
  return (
    <>
      {/* 4. Luxury Amenities Section */}
      <section id="amenities" className="relative py-24 sm:py-32 bg-secondary/40 border-y border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-accent">Exclusive Services</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-2 text-foreground">World-Class Facilities</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4"></div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mt-4">
              Saveetha GuestHouse provides a selection of services designed to elevate your stay, blending luxury convenience with seamless comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {AMENITIES.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="glass-card p-8 rounded-2xl border border-border/40 hover:border-accent flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <item.icon className="w-8 h-8 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{item.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Categorized Keyword Property Facilities */}
          <div className="mt-16 pt-16 border-t border-border/40">
            <h3 className="font-serif text-2xl font-bold text-center text-foreground mb-8">
              All Property Facilities & Services
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ALL_FACILITIES.map((facility, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-accent/40 hover:bg-secondary/50 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-tight">{facility.name}</p>
                    <span className="text-[9px] text-accent uppercase tracking-wider font-bold">
                      {facility.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Stay Guidelines & House Rules */}
      <section className="relative py-24 bg-background border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-accent">Stay Guidelines</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-2 text-foreground">Good to Know</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-border/40 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Check-in & Check-out</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We operate a <strong>24-hour check-in and check-out</strong> policy. Please inform us in advance of your expected arrival time using the Special Requests box when booking, or contact us directly.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-border/40 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Extra Beds Policy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Extra beds are subject to availability and chargeable at <strong>INR 500.00 per night</strong>. Only <strong>1 extra bed</strong> is allowed in a room.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-border/40 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Visitor Guidelines</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To ensure a peaceful stay, <strong>visitors will strictly not be allowed in the guest rooms after 9:30 PM</strong>.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-border/40 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Parking Space</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Parking space is subject to availability due to limited parking areas within the campus.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-border/40 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Info className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Strict Policies</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This property will strictly <strong>not accommodate any parties</strong> inside the guest rooms.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-border/40 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Special Requests</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For early check-ins, medical needs, or special arrangements, please contact the property directly with the details in your confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
