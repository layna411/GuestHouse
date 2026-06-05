import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, Copy, Mail, MessageSquare, ChevronLeft, ArrowRight, Key
} from 'lucide-react';
import { Room } from '../../types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ConfirmationViewProps {
  selectedRoomForBooking: Room;
  setBookingFlowState: (state: 'landing' | 'room-details' | 'checkout' | 'confirmation') => void;
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
  setBookingErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setSelectedRoomForBooking: (room: Room | null) => void;
  confirmedBookingId: string | null;
  activeNotificationTab: 'email' | 'sms';
  setActiveNotificationTab: (tab: 'email' | 'sms') => void;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  selectedMealPlan: string;
  getPriceDetails: (roomType: string, guests: number, mealPlan: string, extraBed: boolean) => any;
  ROOM_IMAGE_MAP: Record<string, string>;
}

export function ConfirmationView({
  selectedRoomForBooking,
  setBookingFlowState,
  bookingFormDetails,
  setBookingFormDetails,
  setBookingErrors,
  setSelectedRoomForBooking,
  confirmedBookingId,
  activeNotificationTab,
  setActiveNotificationTab,
  checkIn,
  checkOut,
  guestCount,
  selectedMealPlan,
  getPriceDetails,
  ROOM_IMAGE_MAP
}: ConfirmationViewProps) {
  const checkInDate = new Date(`${checkIn}T14:00`);
  const checkOutDate = new Date(`${checkOut}T11:00`);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const pricing = getPriceDetails(
    selectedRoomForBooking.type,
    guestCount,
    selectedMealPlan,
    bookingFormDetails.extraBed
  );

  return (
    <div className="pt-24 pb-16 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Widescreen 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Success Confirmation Status Card */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/60 p-8 space-y-6 shadow-2xl"
            >
              {/* Glowing Success Ring */}
              <div className="mx-auto w-20 h-20 rounded-full bg-success/10 border border-success/30 flex items-center justify-center shadow-lg shadow-success/10 mb-2">
                <Check className="w-10 h-10 text-[#4bd395]" />
              </div>

              <div className="space-y-2 text-center">
                <span className="text-xs uppercase font-bold tracking-widest text-[#4bd395] bg-[#4bd395]/10 px-3 py-1 rounded-full border border-[#4bd395]/20 inline-block font-sans">
                  Reservation Pending Approval
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground">Your booking is secured!</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                  Your guest reservation request has been registered in our system. The Saveetha Guest House administrator has been notified.
                </p>
              </div>

              {/* Receipt Overview Card */}
              <div className="border border-border/40 rounded-xl p-5 bg-secondary/15 text-left text-xs space-y-3.5">
                <div className="flex justify-between border-b border-border/10 pb-2.5">
                  <span className="text-muted-foreground">Reference ID:</span>
                  <span className="font-mono font-bold text-foreground flex items-center gap-1.5">
                    {confirmedBookingId || 'RES982103'}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(confirmedBookingId || 'RES982103');
                        toast.success("Reference ID copied to clipboard!");
                      }}
                      className="text-muted-foreground hover:text-accent focus:outline-none cursor-pointer p-0.5"
                      title="Copy Reference ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Stay Option</span>
                    <p className="font-semibold text-foreground mt-0.5">Room {selectedRoomForBooking.roomNumber}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{selectedRoomForBooking.type} Suite</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dates</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {format(new Date(checkIn), 'MMM d')} - {format(new Date(checkOut), 'MMM d, yyyy')}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Check-in at 2:00 PM</p>
                  </div>
                </div>
                
                <div className="border-t border-border/10 pt-2.5 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest Name:</span>
                    <span className="font-semibold text-foreground">{bookingFormDetails.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest Email:</span>
                    <span className="font-semibold text-foreground">{bookingFormDetails.guestEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest Phone:</span>
                    <span className="font-semibold text-foreground">{bookingFormDetails.guestPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate Plan:</span>
                    <span className="font-semibold text-accent">{selectedMealPlan}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-border/15 font-bold">
                    <span className="text-foreground">Total Price (incl. GST):</span>
                    <span className="text-accent text-sm">₹{(pricing.totalPerNight * nights).toFixed(0)}</span>
                  </div>
                </div>

                <div className="border-t border-border/15 pt-2 flex justify-between">
                  <span className="text-muted-foreground">Payment Details:</span>
                  <span className="font-bold text-[#4bd395]">Pay on Arrival</span>
                </div>
              </div>

              {/* Reset/Return Buttons */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
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
                  }}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md text-center"
                >
                  Return to Room Overview
                </button>
                
                <button
                  onClick={() => {
                    toast.success(`📩 Re-sent confirmation email to ${bookingFormDetails.guestEmail}`);
                    toast.info(`💬 Re-sent SMS message notification to ${bookingFormDetails.guestPhone}`);
                  }}
                  className="w-full bg-secondary/50 hover:bg-secondary/80 text-foreground border border-border font-semibold py-2.5 rounded-xl text-xs tracking-wider transition-all cursor-pointer text-center"
                >
                  Simulate Re-send Notifications
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Notification Simulator */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/60 p-6 shadow-2xl flex flex-col min-h-[640px]">
              
              {/* Simulator Header & Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/40 gap-4">
                <div className="text-left">
                  <h4 className="font-serif text-lg font-bold text-foreground">Interactive Notification Simulator</h4>
                  <p className="text-[11px] text-muted-foreground">Click tabs to view notification formats sent to the guest.</p>
                </div>
                
                {/* Tabs switcher */}
                <div className="flex bg-secondary/60 border border-border/40 p-1 rounded-xl gap-1 self-start font-sans">
                  <button
                    onClick={() => setActiveNotificationTab('email')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeNotificationTab === 'email' 
                        ? 'bg-accent text-accent-foreground shadow-md' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Gmail Preview</span>
                  </button>
                  <button
                    onClick={() => setActiveNotificationTab('sms')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeNotificationTab === 'sms' 
                        ? 'bg-accent text-accent-foreground shadow-md' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>SMS Preview</span>
                  </button>
                </div>
              </div>

              {/* Simulator content */}
              <div className="flex-1 pt-4">
                
                {/* TAB 1: GMAIL STYLE PREVIEW */}
                {activeNotificationTab === 'email' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#ffffff] text-slate-800 rounded-xl border border-slate-300 overflow-hidden shadow-lg flex flex-col text-left font-sans"
                  >
                    {/* Gmail header bar */}
                    <div className="bg-[#f2f6fc] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Gmail Logo Mock */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#ea4335] text-sm tracking-tight">M</span>
                          <span className="font-semibold text-slate-600 text-xs hidden sm:inline">Gmail</span>
                        </div>
                        <div className="h-4 w-[1px] bg-slate-300 hidden sm:block"></div>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Inbox</span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-medium">
                        {format(new Date(), 'dd MMMM yyyy HH:mm')}
                      </div>
                    </div>

                    {/* Subject pane */}
                    <div className="px-5 py-4 border-b border-slate-200 bg-white">
                      <h2 className="text-[15px] sm:text-[17px] font-semibold text-slate-900 leading-tight">
                        Fwd: Your Saveetha Guest House Booking Confirmation - {confirmedBookingId || 'RES982103'}
                      </h2>
                      <div className="flex justify-between items-center mt-3 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                            S
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 flex flex-wrap items-center gap-1 flex-row">
                              Saveetha Guest House Booking 
                              <span className="text-slate-500 font-normal text-[10.5px]">&lt;guesthouse@saveetha.edu&gt;</span>
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              To: {bookingFormDetails.guestName} &lt;{bookingFormDetails.guestEmail}&gt;
                            </p>
                          </div>
                        </div>
                        <div className="text-[10.5px] text-slate-500 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                          Standard Mail
                        </div>
                      </div>
                    </div>

                    {/* Email HTML Body content */}
                    <div className="p-4 sm:p-6 bg-[#f9fafb] overflow-y-auto max-h-[440px] text-slate-700 leading-relaxed text-xs">
                      
                      {/* Inner Styled Email Panel */}
                      <div className="max-w-[650px] mx-auto bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        
                        {/* Blue branding header banner from PDF style */}
                        <div className="bg-[#0f172a] text-white p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-accent gap-2">
                          {/* Logo */}
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-accent/20 border border-accent flex items-center justify-center">
                              <Key className="w-4.5 h-4.5 text-accent" />
                            </div>
                            <div>
                              <span className="font-serif text-sm font-bold tracking-wider text-white">Saveetha</span>
                              <p className="text-[8px] tracking-widest text-accent uppercase font-bold -mt-1">Residency</p>
                            </div>
                          </div>
                          
                          {/* Title address info */}
                          <div className="text-right sm:text-right text-[9px] text-slate-400">
                            <span className="font-serif text-[11px] font-bold text-white block">Saveetha Guest House Campus</span>
                            <span>No. 162 Poonamallee High Road, Chennai, Tamil Nadu 600077</span>
                            <span className="block font-medium mt-0.5 text-accent">+91 44 2680 1560 | guesthouse@saveetha.edu</span>
                          </div>
                        </div>

                        {/* Greeting & Opening text */}
                        <div className="p-5 space-y-4 border-b border-slate-100 text-left">
                          <p className="font-bold text-slate-900">Dear {bookingFormDetails.guestName},</p>
                          <p className="text-slate-600 border-none bg-transparent p-0 m-0">
                            Thank you for choosing to stay at <strong>Saveetha Guest House Campus Chennai</strong>!
                          </p>
                          <p className="text-slate-600 border-none bg-transparent p-0 m-0">
                            Your guest reservation request is now confirmed. Please find below the details of your stay. Should you require any further assistance, please do not hesitate to contact our Guest Service Desk.
                          </p>
                          <p className="text-slate-600 border-none bg-transparent p-0 m-0">
                            We look forward to welcoming you to the campus.
                          </p>
                          <div className="text-slate-500 leading-tight">
                            <p>Warmest regards,</p>
                            <p className="font-semibold text-slate-800 mt-1">Guest Service Team</p>
                            <p className="text-[9.5px]">Saveetha Campus Residency</p>
                          </div>
                        </div>

                        {/* Reservation Details Header */}
                        <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 text-left">
                          <h3 className="font-serif text-sm font-bold text-slate-800 tracking-wide uppercase">Reservation Confirmation</h3>
                          <p className="text-[9.5px] text-slate-400 -mt-0.5 font-bold uppercase tracking-wider">Your Stay Details</p>
                        </div>

                        {/* 2-Column Email Grid */}
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-left">
                          
                          {/* Left details grid */}
                          <div className="space-y-2 text-[11px]">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Confirmation No.</span>
                              <span className="font-bold text-slate-800">{confirmedBookingId || 'RES982103'}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Stay Option</span>
                              <span className="font-semibold text-slate-800">Room {selectedRoomForBooking.roomNumber} ({selectedRoomForBooking.type})</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Check-in</span>
                              <span className="font-bold text-slate-800">{format(new Date(checkIn), 'dd MMM yyyy')} (02:00 PM)</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Check-out</span>
                              <span className="font-bold text-slate-800">{format(new Date(checkOut), 'dd MMM yyyy')} (12:00 PM)</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">No. of Night(s)</span>
                              <span className="font-bold text-slate-800">{nights} Night{nights > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">No. of Guest(s)</span>
                              <span className="font-bold text-slate-800">{guestCount} Adult{guestCount > 1 ? 's' : ''}, 0 Child(ren)</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Guest Name</span>
                              <span className="font-bold text-slate-800">{bookingFormDetails.guestName}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Rate Plan Type</span>
                              <span className="font-bold text-slate-800">Saveetha Exclusive ({selectedMealPlan})</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500">Member Tier</span>
                              <span className="font-semibold text-amber-600">SGH Silver Partner</span>
                            </div>
                            <div className="py-2 text-[9.5px] leading-relaxed text-slate-400">
                              <span className="font-semibold text-slate-500 block mb-0.5">Cancellation Policy:</span>
                              Standard check-in cancellation applies. Free cancellation up to 24 hours prior to scheduled arrival (2:00 PM). Cancellations within 24 hours will bear a charge of 1 night stay fee.
                            </div>
                          </div>

                          {/* Right details box: Price Summary Card & Visitor Policy */}
                          <div className="space-y-4 text-left">
                            
                            {/* Pricing Box */}
                            <div className="border border-slate-200 bg-slate-50 rounded-lg p-3.5 space-y-2.5 text-[10.5px]">
                              <span className="font-bold text-slate-800 block uppercase tracking-wide text-[10px]">Price Summary</span>
                              <div className="flex justify-between text-slate-600">
                                <span>Base Room Rate ({nights}x):</span>
                                <span>INR {(pricing.basePrice * nights).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                              {bookingFormDetails.extraBed && (
                                <div className="flex justify-between text-slate-600">
                                  <span>Extra Bed Charge:</span>
                                  <span>INR {(pricing.extraBedCharge * nights).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-slate-600 border-b border-slate-200 pb-2">
                                <span>Tax (5% GST):</span>
                                <span>INR {(pricing.tax * nights).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between text-slate-900 font-bold text-xs pt-1">
                                <span>Total Invoice Amount</span>
                                <span className="text-slate-950 font-bold">INR {(pricing.totalPerNight * nights).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                            </div>

                            {/* Visitor Policy Block */}
                            <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 text-[9.5px] leading-relaxed bg-[#fefefe]">
                              <span className="font-bold text-slate-800 block uppercase tracking-wide">Campus Residence Policies</span>
                              <ul className="list-disc pl-3 text-slate-500 space-y-1.5">
                                <li>Visitors are not permitted in guest rooms after 9:00 PM.</li>
                                <li>Overnight visitor stays must register at the reception desk with a government-approved ID and are subject to an additional charge of INR 1500 + tax per person.</li>
                                <li>Smoking is strictly prohibited on campus guest premises. Violation will lead to a penalty of INR 10,000.</li>
                                <li>Management reserves the right to admission.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* Incidental Deposit footer line */}
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
                          <span>* Incidental deposit of INR 1000 per day refundable upon checkout.</span>
                          <span className="font-semibold text-slate-700">Saveetha Academic Hospitality</span>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: MOBILE SMS SMARTPHONE PREVIEW */}
                {activeNotificationTab === 'sms' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    {/* Smartphone bezel */}
                    <div className="w-[305px] h-[550px] bg-slate-950 rounded-[40px] p-3 border-[6px] border-slate-800 shadow-2xl relative flex flex-col font-sans select-none text-left">
                      
                      {/* Notch/Camera bezel */}
                      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-b-xl z-20 flex items-center justify-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                        <div className="w-6 h-1 bg-slate-950 rounded-full"></div>
                      </div>

                      {/* Mobile Screen Status Bar */}
                      <div className="flex justify-between items-center px-4 pt-1 pb-2 text-[10px] font-semibold text-white/95 z-10">
                        <span>10:16</span>
                        <div className="flex items-center gap-1">
                          {/* Signals & Battery */}
                          <div className="flex gap-0.5 items-end h-2">
                            <div className="w-[1.5px] h-1 bg-white"></div>
                            <div className="w-[1.5px] h-1.5 bg-white"></div>
                            <div className="w-[1.5px] h-2 bg-white"></div>
                          </div>
                          <span className="text-[9px]">5G</span>
                          <div className="w-4 h-2 rounded-sm border border-white/60 p-0.5 flex items-center">
                            <div className="h-full w-full bg-white rounded-2xs"></div>
                          </div>
                        </div>
                      </div>

                      {/* Message Header */}
                      <div className="bg-slate-900/90 border-b border-slate-800/80 px-3 py-2 flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4 text-accent" />
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-[11px]">
                          SG
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">Saveetha GH</p>
                          <p className="text-[8px] text-slate-400 mt-0.5">Text Message / Verified</p>
                        </div>
                      </div>

                      {/* Message Thread Body */}
                      <div className="flex-1 bg-slate-950 p-3 flex flex-col justify-end overflow-y-auto space-y-4 text-[11px] leading-relaxed">
                        <div className="text-center text-[9px] text-slate-500 uppercase tracking-widest py-1">
                          Today 10:16 AM
                        </div>

                        {/* SMS Text message bubble */}
                        <div className="self-start max-w-[85%] bg-slate-900 text-white p-3 rounded-2xl rounded-tl-sm border border-slate-800 shadow-md">
                          <p className="font-semibold text-accent mb-1 text-[10.5px]">Saveetha Residency Confirmation</p>
                          Dear {bookingFormDetails.guestName}, your guest booking request is confirmed!
                          <div className="my-1.5 border-t border-slate-800/80 pt-1.5 space-y-0.5 text-[10px] text-slate-300">
                            <p>• Ref ID: <span className="font-mono text-white font-bold">{confirmedBookingId || 'RES982103'}</span></p>
                            <p>• Option: Room {selectedRoomForBooking.roomNumber} ({selectedRoomForBooking.type})</p>
                            <p>• Nights: {nights} stay ({format(new Date(checkIn), 'MMM d')} - {format(new Date(checkOut), 'MMM d')})</p>
                            <p>• Rate Plan: {selectedMealPlan}</p>
                            <p>• Total Due: ₹{(pricing.totalPerNight * nights).toFixed(0)}</p>
                            <p>• Payment: Pay on Arrival at Desk</p>
                          </div>
                          Please carry a valid Government ID at the check-in reception. Welcome!
                        </div>
                        <span className="text-[8px] text-slate-500 pl-1 -mt-3.5">Delivered</span>
                      </div>

                      {/* Chat input keyboard placeholder */}
                      <div className="bg-slate-900 border-t border-slate-800/80 p-2.5 flex items-center gap-2 rounded-b-[28px]">
                        <div className="flex-1 bg-slate-950 rounded-full py-1.5 px-3 border border-slate-800 text-[10px] text-slate-500">
                          iMessage
                        </div>
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground cursor-pointer">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
