import React from 'react';
import { ChevronRight, Users, Sparkles, MapPin, Key, Check } from 'lucide-react';
import { Room } from '../../types';
import { GALLERY_IMAGES, getPriceDetails } from './constants';

interface RoomDetailsViewProps {
  selectedRoomForBooking: Room;
  activeDetailImage: string;
  setActiveDetailImage: (img: string) => void;
  guestCount: number;
  setSelectedMealPlan: (plan: string) => void;
  setBookingFlowState: (state: 'landing' | 'room-details' | 'checkout' | 'confirmation') => void;
  setSelectedRoomForBooking: (room: Room | null) => void;
  setTimeLeft: (time: number) => void;
}

export const RoomDetailsView: React.FC<RoomDetailsViewProps> = ({
  selectedRoomForBooking,
  activeDetailImage,
  setActiveDetailImage,
  guestCount,
  setSelectedMealPlan,
  setBookingFlowState,
  setSelectedRoomForBooking,
  setTimeLeft,
}) => {
  const handleBack = () => {
    setBookingFlowState('landing');
    setSelectedRoomForBooking(null);
  };

  return (
    <div 
      className="pt-12 pb-16 text-left min-h-screen"
      style={{
        backgroundImage: 'linear-gradient(to bottom, var(--background-overlay-start), var(--background-overlay-end)), url("/images/image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Breadcrumbs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-border/10 mb-8 font-sans">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          <a href="#hero" onClick={(e) => { e.preventDefault(); setBookingFlowState('landing'); }} className="hover:text-accent transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="#rooms-catalog" onClick={(e) => { e.preventDefault(); setBookingFlowState('landing'); }} className="hover:text-accent transition-colors">Accommodations</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground">{selectedRoomForBooking.type} Details</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Media Gallery (col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl h-[300px] sm:h-[450px]">
              <img
                src={activeDetailImage}
                alt={`Room ${selectedRoomForBooking.roomNumber}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-black/60 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  Floor {selectedRoomForBooking.floor}
                </span>
              </div>
            </div>
            
            {/* Thumbnails Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {GALLERY_IMAGES.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDetailImage(img)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    activeDetailImage === img ? 'border-accent ring-2 ring-accent/30 scale-95 shadow-lg' : 'border-border/60 hover:border-accent'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          {/* Right Column: Spec Sheet & Workspace Features (col-span-5) */}
          <div className="lg:col-span-5 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-accent font-sans">{selectedRoomForBooking.type}</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-1">{selectedRoomForBooking.type}</h2>
              <div className="flex items-center gap-2 mt-3 font-sans">
                <span className="bg-success/15 border border-success/30 text-success text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  ★ 9.3 Perfect
                </span>
                <span className="text-xs text-muted-foreground font-semibold">Verified Saveetha Residency Reviews</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="border-y border-border/20 py-5 grid grid-cols-2 gap-4 text-xs font-semibold font-sans">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><Users className="w-4 h-4 text-accent" /></div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block leading-none mb-0.5">Capacity</span>
                  <span className="text-foreground">Up to {selectedRoomForBooking.capacity} Guests</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><Sparkles className="w-4 h-4 text-accent" /></div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block leading-none mb-0.5">Area Size</span>
                  <span className="text-foreground">{selectedRoomForBooking.floor === 1 ? '380' : selectedRoomForBooking.floor === 2 ? '420' : '480'} sq ft</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><MapPin className="w-4 h-4 text-accent" /></div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block leading-none mb-0.5">Location</span>
                  <span className="text-foreground">Floor {selectedRoomForBooking.floor}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"><Key className="w-4 h-4 text-accent" /></div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block leading-none mb-0.5">Bed Setup</span>
                  <span className="text-foreground">Twin beds</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-left font-sans">
              <h4 className="text-[10px] uppercase tracking-wider text-accent font-bold">Executive Workspaces & Comfort</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Designed specifically for corporate guest delegates and visiting academic scholars. The room provides an extensive study workdesk with ergonomic posture support, high-speed Wi-Fi, localized thermostat control, complimentary beverage kettle, and fully secure smart access control.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedRoomForBooking.amenities.map((am, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-secondary/70 border border-border/40 text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {am}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rates Table Section (Full Width) */}
        <div className="mt-12 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-foreground">Room Rates & Reservation Packages</h3>
            <p className="text-xs text-muted-foreground mt-1 font-sans">Select your preferred check-in rate. Rates dynamically calculate for {guestCount} guest{guestCount > 1 ? 's' : ''}.</p>
          </div>

          <div className="overflow-x-auto border border-border/40 rounded-xl bg-background/20 font-sans">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-secondary/40 border-b border-border/40 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  <th className="p-4">Meal Option / Package</th>
                  <th className="p-4">Cancellation Policy</th>
                  <th className="p-4 text-center">Sleeps</th>
                  <th className="p-4 text-right">Price per Night</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'Room without Breakfast',
                  'Room with Breakfast',
                  'Room with Breakfast, Lunch & Dinner'
                ].map((plan, idx) => {
                  const priceDetails = getPriceDetails(selectedRoomForBooking.type, guestCount, plan, false);
                  let policy = "Free cancellation 24h before check-in";
                  let policyColor = "text-success font-semibold flex items-center gap-1";
                  
                  return (
                    <tr key={idx} className="border-b border-border/10 last:border-0 hover:bg-secondary/10 transition-colors">
                      <td className="p-4 font-semibold text-foreground flex flex-col gap-0.5">
                        <span>{plan}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">Standard Occupancy Rate</span>
                      </td>
                      <td className="p-4">
                        <span className={policyColor}>
                          <Check className="w-3.5 h-3.5 inline text-success" />
                          {policy}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-0.5 justify-center">
                          {Array.from({ length: Math.min(selectedRoomForBooking.capacity, 3) }).map((_, i) => (
                            <Users key={i} className="w-3.5 h-3.5 text-muted-foreground" />
                          ))}
                          {selectedRoomForBooking.capacity > 3 && <span className="text-[10px] text-muted-foreground font-bold">+{selectedRoomForBooking.capacity - 3}</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-bold text-foreground text-sm">₹{priceDetails.ratePerNight}</span>
                        <span className="block text-[9px] text-muted-foreground">Excl. taxes ₹{priceDetails.tax.toFixed(0)}</span>
                      </td>
                      <td className="p-4 text-center font-sans">
                        {selectedRoomForBooking.status === 'maintenance' ? (
                          <button disabled className="bg-muted text-muted-foreground/60 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase cursor-not-allowed">
                            Maintenance
                          </button>
                        ) : selectedRoomForBooking.status === 'booked' ? (
                          <button disabled className="bg-muted text-muted-foreground/60 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase cursor-not-allowed">
                            Occupied
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedMealPlan(plan);
                              setBookingFlowState('checkout');
                              setTimeLeft(900);
                            }}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                          >
                            Book Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-start font-sans">
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-border hover:bg-secondary/40 rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground cursor-pointer transition-colors"
          >
            ← Back to Accommodations
          </button>
        </div>
      </div>
    </div>
  );
};
