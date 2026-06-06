import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, ArrowRight, ClipboardList, Home, FileText } from 'lucide-react';
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
}: ConfirmationViewProps) {
  const [showDetails, setShowDetails] = useState(false);

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

  const referenceId = confirmedBookingId || 'RES' + Math.floor(Math.random() * 900000 + 100000);

  const handleDownloadReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Popup blocker prevented invoice download. Please allow popups.");
      return;
    }

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Saveetha GuestHouse - Invoice ${referenceId}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 40px; line-height: 1.6; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f766e; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { display: flex; align-items: center; gap: 10px; }
          .logo-circle { width: 32px; height: 32px; border-radius: 50%; background: #0f766e; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
          .logo-text h1 { font-size: 18px; margin: 0; font-weight: 900; letter-spacing: 1px; color: #111827; }
          .logo-text p { font-size: 8px; margin: 2px 0 0; font-weight: bold; letter-spacing: 2px; color: #6b7280; }
          .invoice-title { text-align: right; }
          .invoice-title h2 { margin: 0; font-size: 24px; color: #0f766e; font-family: serif; }
          .invoice-title p { margin: 5px 0 0; font-size: 12px; color: #6b7280; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
          .details-box h3 { margin: 0 0 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
          .details-box p { margin: 4px 0; font-size: 13px; }
          .details-box strong { color: #111827; }
          .table-invoice { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .table-invoice th { background: #f3f4f6; color: #374151; font-size: 12px; text-transform: uppercase; font-weight: bold; padding: 10px 12px; border-bottom: 2px solid #e5e7eb; text-align: left; }
          .table-invoice td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
          .table-invoice tr.totals td { border-bottom: none; font-weight: bold; text-align: right; padding: 8px 12px; }
          .table-invoice tr.grand-total td { font-size: 16px; color: #0f766e; padding-top: 15px; border-top: 2px solid #0f766e; }
          .stamp-container { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; }
          .stamp-box { border: 2px dashed #0f766e; border-radius: 10px; padding: 15px; text-align: center; width: 150px; transform: rotate(-3deg); opacity: 0.85; }
          .stamp-box p { margin: 2px 0; font-size: 10px; font-weight: bold; }
          .stamp-box .stamp-title { color: #0f766e; font-size: 13px; text-transform: uppercase; font-weight: 900; }
          .footer-invoice { text-align: center; margin-top: 80px; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">
            <div class="logo-circle">S</div>
            <div class="logo-text">
              <h1>SAVEETHA</h1>
              <p>GUESTHOUSE</p>
            </div>
          </div>
          <div class="invoice-title">
            <h2>GUEST INVOICE</h2>
            <p>Invoice #: INV-${referenceId.substring(3)}</p>
            <p>Date: ${format(new Date(), 'MMMM dd, yyyy')}</p>
          </div>
        </div>

        <div class="details-grid">
          <div class="details-box">
            <h3>Resident / Guest</h3>
            <p><strong>Name:</strong> ${bookingFormDetails.guestName}</p>
            <p><strong>Email:</strong> ${bookingFormDetails.guestEmail}</p>
            <p><strong>Mobile:</strong> ${bookingFormDetails.guestPhone}</p>
          </div>
          <div class="details-box">
            <h3>Reservation Details</h3>
            <p><strong>Reference ID:</strong> ${referenceId}</p>
            <p><strong>Check-in Date:</strong> ${format(new Date(checkIn), 'MMM d, yyyy')} (14:00)</p>
            <p><strong>Check-out Date:</strong> ${format(new Date(checkOut), 'MMM d, yyyy')} (11:00)</p>
            <p><strong>Nights Count:</strong> ${nights} ${nights === 1 ? 'Night' : 'Nights'}</p>
          </div>
        </div>

        <table class="table-invoice">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Rate / Night</th>
              <th style="text-align: center;">Nights</th>
              <th style="text-align: right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Room Accommodation</strong><br/>
                Category: ${selectedRoomForBooking.type} - Max capacity 3 guests.
              </td>
              <td style="text-align: right;">₹${pricing.ratePerNight.toFixed(2)}</td>
              <td style="text-align: center;">${nights}</td>
              <td style="text-align: right;">₹${(pricing.ratePerNight * nights).toFixed(2)}</td>
            </tr>
            <tr>
              <td>
                <strong>Meal Package Selection</strong><br/>
                Option: ${selectedMealPlan}
              </td>
              <td style="text-align: right;">₹${pricing.mealPlanPrice.toFixed(2)}</td>
              <td style="text-align: center;">${nights}</td>
              <td style="text-align: right;">₹${(pricing.mealPlanPrice * nights).toFixed(2)}</td>
            </tr>
            ${bookingFormDetails.extraBed ? `
            <tr>
              <td>
                <strong>Additional Service</strong><br/>
                Rollaway Extra Bed
              </td>
              <td style="text-align: right;">₹${pricing.extraBedPrice.toFixed(2)}</td>
              <td style="text-align: center;">${nights}</td>
              <td style="text-align: right;">₹${(pricing.extraBedPrice * nights).toFixed(2)}</td>
            </tr>
            ` : ''}
            
            <!-- Totals Rows -->
            <tr class="totals" style="border-top: 2px solid #e5e7eb;">
              <td colspan="2"></td>
              <td>Subtotal:</td>
              <td>₹${((pricing.ratePerNight + pricing.mealPlanPrice + (bookingFormDetails.extraBed ? pricing.extraBedPrice : 0)) * nights).toFixed(2)}</td>
            </tr>
            <tr class="totals">
              <td colspan="2"></td>
              <td>Taxes (CGST 2.5%):</td>
              <td>₹${(pricing.taxPerNight * nights / 2).toFixed(2)}</td>
            </tr>
            <tr class="totals">
              <td colspan="2"></td>
              <td>Taxes (SGST 2.5%):</td>
              <td>₹${(pricing.taxPerNight * nights / 2).toFixed(2)}</td>
            </tr>
            <tr class="totals grand-total">
              <td colspan="2"></td>
              <td>Total Paid:</td>
              <td>₹${(pricing.totalPerNight * nights).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="stamp-container">
          <div style="font-size: 12px; color: #6b7280;">
            <p><strong>Payment Status:</strong> PAID (Secure Sandbox Authorization)</p>
            <p><strong>Invoice Mode:</strong> Electronic Automated Voucher</p>
          </div>
          
          <div class="stamp-box">
            <p class="stamp-title">SAVEETHA</p>
            <p>GUEST HOUSE</p>
            <p style="color: #0f766e; font-size: 8px;">★ VERIFIED STAMP ★</p>
            <p style="font-size: 7px; color: #6b7280; font-family: monospace;">TXN-${Math.floor(Math.random() * 90000000 + 10000000)}</p>
          </div>
        </div>

        <div class="footer-invoice">
          <p>Thank you for choosing Saveetha Guest House. We look forward to welcoming you.</p>
          <p>SIMATS Campus, Chennai, Tamil Nadu - 602105 | Support: support@simats.edu</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const handleReturnToHome = () => {
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
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-foreground"
      style={{
        backgroundImage: 'linear-gradient(to bottom, var(--background-overlay-start), var(--background-overlay-end)), url("/images/image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >

      {/* Main Thank You Banner */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-12"
        >
          {/* Text Statement */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight max-w-4xl tracking-wide font-sans">
            Thank you for submitting your query. We will get in touch with you soon
          </h2>

          {/* Accreditation Badges / Seals */}
          <div className="flex items-center justify-center gap-6 md:gap-8 pt-4">
            {/* 1. Gold Circle Seal */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center shadow-2xl relative border border-amber-300">
              <div className="absolute inset-1 rounded-full border border-dashed border-amber-200" />
              <span className="text-[9px] md:text-[11px] font-black text-white uppercase tracking-wider text-center leading-tight">
                GOLD<br />STAR
              </span>
            </div>

            {/* 2. Red & Blue Circular Seal */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-[4px] border-rose-500/90 flex items-center justify-center shadow-2xl relative">
              <div className="absolute inset-0 rounded-full border border-sky-600/80 m-0.5" />
              <span className="text-[8px] md:text-[10px] font-extrabold text-blue-900 uppercase tracking-widest text-center leading-tight">
                NABH<br />SAFE
              </span>
            </div>

            {/* 3. LEED Platinum light blue badge */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#90cdf4]/90 flex flex-col items-center justify-center shadow-2xl border border-sky-300">
              <span className="text-[10px] md:text-[13px] font-black text-slate-800 tracking-wider leading-none">LEED</span>
              <span className="text-[7px] md:text-[9px] font-extrabold text-slate-700 uppercase tracking-widest leading-none mt-1">
                PLATINUM
              </span>
            </div>
          </div>

          {/* Booking Summary Box */}
          <div className="max-w-md mx-auto bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 space-y-4 text-left shadow-xl">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Booking ID</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-foreground">{referenceId}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referenceId);
                    toast.success("Booking ID copied!");
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-black/5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Category:</span>
                <span className="font-semibold text-foreground">{selectedRoomForBooking.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guest Name:</span>
                <span className="font-semibold text-foreground">{bookingFormDetails.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stay Dates:</span>
                <span className="font-semibold text-primary font-bold">
                  {format(new Date(checkIn), 'MMM d')} - {format(new Date(checkOut), 'MMM d, yyyy')} ({nights} {nights === 1 ? 'night' : 'nights'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Price:</span>
                <span className="font-bold text-primary text-sm">₹{(pricing.totalPerNight * nights).toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full mt-2 text-center text-[10px] uppercase font-bold text-primary hover:text-primary/80 flex items-center justify-center gap-1.5"
            >
              <ClipboardList className="w-3 h-3" />
              {showDetails ? "Hide full ledger details" : "Show full ledger details"}
            </button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-border/30 text-[11px] text-muted-foreground space-y-1.5"
              >
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span>₹{pricing.ratePerNight}/night</span>
                </div>
                <div className="flex justify-between">
                  <span>Meal Plan ({selectedMealPlan}):</span>
                  <span>₹{pricing.mealPlanPrice}/night</span>
                </div>
                {bookingFormDetails.extraBed && (
                  <div className="flex justify-between">
                    <span>Extra Bed charges:</span>
                    <span>₹{pricing.extraBedPrice}/night</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (CGST 2.5% & SGST 2.5%):</span>
                  <span>₹{(pricing.taxPerNight * nights).toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-1.5 border-t border-border/30">
                  <span>Total Amount:</span>
                  <span>₹{(pricing.totalPerNight * nights).toFixed(0)}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
            <button
              onClick={handleReturnToHome}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/20 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="w-full flex items-center justify-center gap-2 bg-secondary/80 hover:bg-secondary text-primary font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest border border-border/80 transition-all cursor-pointer font-bold"
            >
              Print Receipt
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-secondary/10">
        <p>© 2026 Saveetha GuestHouse. All rights reserved.</p>
      </footer>
    </div>
  );
}
