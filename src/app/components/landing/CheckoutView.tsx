import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, Clock, AlertCircle, Users, ChevronDown, ChevronUp, ArrowRight, Info
} from 'lucide-react';
import { Room } from '../../types';
import { format } from 'date-fns';
import { getRoomImage } from './constants';

interface CheckoutViewProps {
  selectedRoomForBooking: Room;
  setBookingFlowState: (state: 'landing' | 'room-details' | 'checkout' | 'confirmation') => void;
  timeLeft: number;
  formatTime: (seconds: number) => { min1: string; min2: string; sec1: string; sec2: string };
  handleCheckoutSubmit: (e: React.FormEvent) => void;
  bookingFormDetails: {
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    purpose: string;
    extraBed: boolean;
    offers: boolean;
  };
  setBookingFormDetails: React.Dispatch<React.SetStateAction<{
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    purpose: string;
    extraBed: boolean;
    offers: boolean;
  }>>;
  bookingErrors: Record<string, string>;
  selectedBedPreference: '1 King-size bed' | '2 Single beds';
  setSelectedBedPreference: (bed: '1 King-size bed' | '2 Single beds') => void;
  showSpecialRequest: boolean;
  setShowSpecialRequest: (show: boolean) => void;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  selectedMealPlan: string;
  getPriceDetails: (roomType: string, guests: number, mealPlan: string, extraBed: boolean) => any;
  activeTaxInfoRow: string | null;
  setActiveTaxInfoRow: (row: string | null) => void;
}

export function CheckoutView({
  selectedRoomForBooking,
  setBookingFlowState,
  timeLeft,
  formatTime,
  handleCheckoutSubmit,
  bookingFormDetails,
  setBookingFormDetails,
  bookingErrors,
  selectedBedPreference,
  setSelectedBedPreference,
  showSpecialRequest,
  setShowSpecialRequest,
  checkIn,
  checkOut,
  guestCount,
  selectedMealPlan,
  getPriceDetails,
  activeTaxInfoRow,
  setActiveTaxInfoRow
}: CheckoutViewProps) {
  const timer = formatTime(timeLeft);
  const imageSrc = getRoomImage(selectedRoomForBooking.type);

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = outDate.getTime() - inDate.getTime();
  const nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  
  const pricing = getPriceDetails(
    selectedRoomForBooking.type,
    guestCount,
    selectedMealPlan,
    bookingFormDetails.extraBed
  );

  return (
    <div className="pt-24 pb-16 text-left bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step progress tracker */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-12 text-xs sm:text-sm font-semibold tracking-wider uppercase border-b border-border/40 pb-6">
          <span className="text-muted-foreground flex items-center gap-2 cursor-pointer" onClick={() => setBookingFlowState('room-details')}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs border bg-secondary border-border text-muted-foreground">1</span>
            Room Details
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          <span className="text-accent flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs border bg-accent text-black border-accent font-bold animate-pulse">2</span>
            Contact & Payment details
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
          <span className="text-muted-foreground flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs border bg-secondary border-border text-muted-foreground">3</span>
            Confirmation
          </span>
        </div>

        {/* Countdown timer hold banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-500">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400">
              We will hold the price for 15 minutes, but it may change after.
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <span className="bg-amber-500 text-black font-bold px-2.5 py-1.5 rounded text-sm shadow">{timer.min1}</span>
            <span className="bg-amber-500 text-black font-bold px-2.5 py-1.5 rounded text-sm shadow">{timer.min2}</span>
            <span className="font-bold text-amber-500 px-1 text-sm">:</span>
            <span className="bg-amber-500 text-black font-bold px-2.5 py-1.5 rounded text-sm shadow">{timer.sec1}</span>
            <span className="bg-amber-500 text-black font-bold px-2.5 py-1.5 rounded text-sm shadow">{timer.sec2}</span>
          </div>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Guest info (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-foreground">Contact and payment details</h3>
                <p className="text-xs text-muted-foreground mt-1">Please enter guest details to finalize checkout. Guest bookings do not require customer login.</p>
              </div>

              <div className="space-y-4">
                {/* Guest Name */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Guest Full Name <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter guest full name"
                    value={bookingFormDetails.guestName}
                    onChange={(e) => setBookingFormDetails(prev => ({ ...prev, guestName: e.target.value }))}
                    className={`bg-background border rounded-lg px-4 py-2.5 text-sm w-full text-foreground focus:outline-none ${
                      bookingErrors.guestName ? 'border-destructive focus:ring-1 focus:ring-destructive' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'
                    }`}
                  />
                  {bookingErrors.guestName && (
                    <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {bookingErrors.guestName}
                    </p>
                  )}
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@domain.com"
                      value={bookingFormDetails.guestEmail}
                      onChange={(e) => setBookingFormDetails(prev => ({ ...prev, guestEmail: e.target.value }))}
                      className={`bg-background border rounded-lg px-4 py-2.5 text-sm w-full text-foreground focus:outline-none ${
                        bookingErrors.guestEmail ? 'border-destructive focus:ring-1 focus:ring-destructive' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'
                      }`}
                    />
                    {bookingErrors.guestEmail && (
                      <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {bookingErrors.guestEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Phone Number <span className="text-accent">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="bg-secondary border border-border/80 px-3 py-2.5 rounded-lg text-xs flex items-center gap-1 select-none text-muted-foreground">
                        <span>🇮🇳</span>
                        <span className="font-semibold">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="Mobile number"
                        value={bookingFormDetails.guestPhone}
                        onChange={(e) => setBookingFormDetails(prev => ({ ...prev, guestPhone: e.target.value }))}
                        className={`flex-1 bg-background border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none ${
                          bookingErrors.guestPhone ? 'border-destructive focus:ring-1 focus:ring-destructive' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'
                        }`}
                      />
                    </div>
                    {bookingErrors.guestPhone && (
                      <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {bookingErrors.guestPhone}
                      </p>
                    )}
                  </div>
                </div>



                {/* Extra Bed Request */}
                <div className="border border-border/50 rounded-xl p-4 bg-secondary/15 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      Request an Extra Bed
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Adds an additional rollaway bed for ₹500 per night.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={bookingFormDetails.extraBed}
                    onChange={(e) => setBookingFormDetails(prev => ({ ...prev, extraBed: e.target.checked }))}
                    className="w-4.5 h-4.5 rounded border-border text-accent accent-accent cursor-pointer"
                  />
                </div>

                {/* Purpose of Visit */}
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Purpose of Stay <span className="text-accent">*</span>
                  </label>
                  <select
                    value={bookingFormDetails.purpose}
                    onChange={(e) => setBookingFormDetails(prev => ({ ...prev, purpose: e.target.value }))}
                    required
                    className={`bg-background border rounded-lg px-4 py-2.5 text-sm w-full text-foreground focus:outline-none ${
                      bookingErrors.purpose ? 'border-destructive focus:ring-1 focus:ring-destructive' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent'
                    }`}
                  >
                    <option value="">-- Select Purpose --</option>
                    <option value="Academic Conference">Academic Conference / Seminar</option>
                    <option value="University Admission">University Admission / Counseling</option>
                    <option value="Hospital Treatment">SIMATS Clinical Treatment / Medical</option>
                    <option value="Personal Visit">Personal Stay / Guest Visit</option>
                  </select>
                  {bookingErrors.purpose && (
                    <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {bookingErrors.purpose}
                    </p>
                  )}
                </div>

                {/* Special Requests Accordion */}
                <div className="border border-border/40 rounded-xl overflow-hidden mt-2">
                  <button
                    type="button"
                    onClick={() => setShowSpecialRequest(!showSpecialRequest)}
                    className="w-full p-4 bg-secondary/35 text-left text-xs font-semibold text-foreground flex items-center justify-between hover:bg-secondary/50 cursor-pointer"
                  >
                    <span>Do you have any special requests? (Optional)</span>
                    {showSpecialRequest ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  {showSpecialRequest && (
                    <div className="p-4 bg-background border-t border-border/20">
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">
                        Special requests cannot be guaranteed but our staff will do their best to accommodate them.
                      </p>
                      <textarea
                        placeholder="e.g. Early check-in requests, fragrance-free room, specific floor request..."
                        rows={3}
                        className="w-full bg-background border border-border rounded-lg p-3 text-xs text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setBookingFlowState('room-details');
                }}
                className="flex-1 border border-border hover:bg-secondary/50 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider text-muted-foreground cursor-pointer text-center transition-colors"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="flex-[2] bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/15 cursor-pointer text-center"
              >
                Continue the reservation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Pricing Breakdown & Details (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Room Overview Summary Card */}
            <div className="bg-card/45 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden shadow-xl">
              <div className="h-44 relative">
                <img
                  src={imageSrc}
                  alt="Selected Room"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="text-[9px] text-accent uppercase font-bold tracking-widest">{selectedRoomForBooking.type}</span>
                    <h4 className="font-serif text-lg font-bold text-white">{selectedRoomForBooking.type}</h4>
                  </div>
                  <span className="bg-accent/20 border border-accent/30 text-accent px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                    ★ 9.3 Perfect
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {/* Stay Dates */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/10">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Check-in</span>
                    <p className="font-semibold text-foreground mt-0.5">{format(new Date(checkIn), 'EEE, MMM d, yyyy')}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">From 2:00 PM</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Check-out</span>
                    <p className="font-semibold text-foreground mt-0.5">{format(new Date(checkOut), 'EEE, MMM d, yyyy')}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Until 11:00 AM</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border/10">
                  <span className="text-muted-foreground font-medium">Total length of stay:</span>
                  <span className="font-bold text-foreground">
                    {nights} Night{nights > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Meal Plan & Guests */}
                <div className="space-y-1.5 py-1.5 border-b border-border/10 text-muted-foreground font-medium">
                  <div className="flex justify-between">
                    <span>Selected Package:</span>
                    <span className="text-foreground font-semibold text-right max-w-[180px] truncate">{selectedMealPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Guests:</span>
                    <span className="text-foreground font-semibold">{guestCount} Guest{guestCount > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-accent">Price Information</h5>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base Rate ({nights} night{nights > 1 ? 's' : ''}):</span>
                    <span>₹{pricing.basePrice * nights}</span>
                  </div>

                  {bookingFormDetails.extraBed && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Extra Bed Charge ({nights} night{nights > 1 ? 's' : ''}):</span>
                      <span>₹{pricing.extraBedCharge * nights}</span>
                    </div>
                  )}

                  {/* Tax Dropdown Accordion */}
                  <div className="border-t border-border/10 pt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setActiveTaxInfoRow(activeTaxInfoRow === 'tax' ? null : 'tax')}
                        className="text-muted-foreground flex items-center gap-1 hover:text-foreground cursor-pointer"
                      >
                        <span>Taxes & Fees (5% GST)</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeTaxInfoRow === 'tax' ? 'rotate-180' : ''}`} />
                      </button>
                      <span className="font-semibold text-foreground">₹{(pricing.tax * nights).toFixed(0)}</span>
                    </div>
                    {activeTaxInfoRow === 'tax' && (
                      <div className="bg-secondary/40 rounded-lg p-2.5 space-y-1.5 text-[10px] text-muted-foreground border border-border/20">
                        <div className="flex justify-between">
                          <span>CGST (2.5%)</span>
                          <span>₹{((pricing.tax / 2) * nights).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST (2.5%)</span>
                          <span>₹{((pricing.tax / 2) * nights).toFixed(0)}</span>
                        </div>
                        <div className="text-[9px] border-t border-border/10 pt-1.5 leading-relaxed text-muted-foreground/60">
                          Standard GST applicable to short-term lodging services in Tamil Nadu.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-center border-t border-border/20 pt-3 text-sm font-bold">
                    <span className="text-foreground">Total Price</span>
                    <span className="text-accent text-lg">₹{(pricing.totalPerNight * nights).toFixed(0)}</span>
                  </div>

                  <div className="bg-secondary/30 border border-border/30 rounded-lg p-3 text-[10.5px] leading-relaxed text-muted-foreground mt-2">
                    <span className="font-semibold text-foreground block mb-0.5">Payment Terms:</span>
                    You will pay directly upon checkout at guest house reception desk. Pay via online mode only like gpay/phonepe.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
