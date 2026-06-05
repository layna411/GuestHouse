import React from 'react';
import { motion } from 'motion/react';
import { Check, Copy } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-md rounded-2xl border border-border/60 p-8 space-y-6 shadow-2xl"
        >
          {/* Glowing Success Ring */}
          <div className="mx-auto w-20 h-20 rounded-full bg-success/10 border border-success/30 flex items-center justify-center shadow-lg shadow-success/10 mb-2">
            <Check className="w-10 h-10 text-success" />
          </div>

          <div className="space-y-2 text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-success bg-success/10 px-3 py-1 rounded-full border border-success/20 inline-block font-sans">
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
                <p className="font-semibold text-foreground mt-0.5">{selectedRoomForBooking.type}</p>
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
              <span className="font-bold text-success">Pay on Checkout (GPay/PhonePe)</span>
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
