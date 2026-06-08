import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, ArrowRight, ClipboardList, Home, FileText, Share2, Download } from 'lucide-react';
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
            <p><strong>Check-in Date:</strong> ${format(new Date(checkInDate), 'MMM dd, yyyy')} (14:00)</p>
            <p><strong>Check-out Date:</strong> ${format(new Date(checkOutDate), 'MMM dd, yyyy')} (11:00)</p>
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
                <strong>Room Accommodation &amp; Meal Plan</strong><br/>
                Category: ${selectedRoomForBooking.type} &mdash; Plan: ${selectedMealPlan}
              </td>
              <td style="text-align: right;">₹${pricing.basePrice.toFixed(2)}</td>
              <td style="text-align: center;">${nights}</td>
              <td style="text-align: right;">₹${(pricing.basePrice * nights).toFixed(2)}</td>
            </tr>
            ${bookingFormDetails.extraBed ? `
            <tr>
              <td>
                <strong>Additional Service</strong><br/>
                Rollaway Extra Bed
              </td>
              <td style="text-align: right;">₹${pricing.extraBedCharge.toFixed(2)}</td>
              <td style="text-align: center;">${nights}</td>
              <td style="text-align: right;">₹${(pricing.extraBedCharge * nights).toFixed(2)}</td>
            </tr>
            ` : ''}
            
            <!-- Totals Rows -->
            <tr class="totals" style="border-top: 2px solid #e5e7eb;">
              <td colspan="2"></td>
              <td>Subtotal:</td>
              <td>₹${(pricing.ratePerNight * nights).toFixed(2)}</td>
            </tr>
            <tr class="totals">
              <td colspan="2"></td>
              <td>Taxes (CGST 2.5%):</td>
              <td>₹${((pricing.tax * nights) / 2).toFixed(2)}</td>
            </tr>
            <tr class="totals">
              <td colspan="2"></td>
              <td>Taxes (SGST 2.5%):</td>
              <td>₹${((pricing.tax * nights) / 2).toFixed(2)}</td>
            </tr>
            <tr class="totals grand-total">
              <td colspan="2"></td>
              <td>Total Price:</td>
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

  const handleShareReceipt = async () => {
    const shareText = `Saveetha Guest House Booking Request\nReference ID: ${referenceId}\nGuest Name: ${bookingFormDetails.guestName}\nDates: ${format(new Date(checkInDate), 'MMM dd, yyyy')} - ${format(new Date(checkOutDate), 'MMM dd, yyyy')} (${nights} nights)\nRoom: ${selectedRoomForBooking.type}\nMeal Plan: ${selectedMealPlan}${bookingFormDetails.extraBed ? '\nExtra Bed: Yes' : ''}\nEstimated Total: ₹${(pricing.totalPerNight * nights).toFixed(0)}\n\nStatus: Request Submitted. Our team will contact you shortly.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Saveetha Guest House Booking Details',
          text: shareText,
        });
        toast.success("Receipt details shared successfully!");
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Booking details copied to clipboard. You can paste and share them anywhere!");
      } catch (err) {
        toast.error("Failed to copy details to clipboard.");
      }
    }
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
      className="min-h-screen flex flex-col font-sans text-foreground animate-fadeIn"
      style={{
        backgroundImage: 'linear-gradient(to bottom, var(--background-overlay-start), var(--background-overlay-end)), url("/images/image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >

      {/* Main Thank You Banner */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16 text-center max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-10 w-full"
        >
          {/* Requested Text Statement */}
          <div className="space-y-5 max-w-2xl mx-auto bg-card/25 backdrop-blur-md border border-border/30 rounded-2xl p-6 md:p-8 shadow-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary font-serif tracking-wide">
              Thank You for Your Booking Request
            </h1>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
              <p className="font-bold text-foreground text-base md:text-lg">
                Your reservation request has been successfully received.
              </p>
              <p>
                Our Guest House team will review your request and contact you shortly via your registered email address and mobile number with booking confirmation and further details.
              </p>
              <p className="italic font-serif text-primary font-bold pt-2">
                We look forward to welcoming you to Saveetha Guest House.
              </p>
            </div>
          </div>

          {/* Premium Detailed Receipt Card */}
          <div className="max-w-2xl mx-auto bg-card/60 backdrop-blur-md border border-border/70 rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-2xl relative overflow-hidden">
            {/* Decorative Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            {/* Receipt Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/40 pb-4 gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">Saveetha Guest House</h3>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-bold mt-0.5">Booking Details Receipt</p>
              </div>
              <div className="bg-primary/10 border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Request Submitted</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs border-b border-border/30 pb-5">
              {/* Guest Details */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground border-b border-border/20 pb-1">Guest Information</h4>
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Guest Name</p>
                  <p className="font-semibold text-foreground text-sm">{bookingFormDetails.guestName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Contact Info</p>
                  <p className="font-semibold text-foreground">{bookingFormDetails.guestEmail}</p>
                  <p className="font-semibold text-foreground mt-0.5">{bookingFormDetails.guestPhone}</p>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground border-b border-border/20 pb-1">Reservation Info</h4>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Reference ID</p>
                    <p className="font-mono font-bold text-foreground text-sm">{referenceId}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referenceId);
                      toast.success("Reference ID copied!");
                    }}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-black/10 transition-colors mt-3"
                    title="Copy Reference ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Check-in</p>
                    <p className="font-semibold text-foreground">{format(new Date(checkInDate), 'MMM dd, yyyy')}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">14:00 onwards</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Check-out</p>
                    <p className="font-semibold text-foreground">{format(new Date(checkOutDate), 'MMM dd, yyyy')}</p>
                    <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">Before 11:00</p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Nights / Guests</p>
                  <p className="font-semibold text-foreground">{nights} {nights === 1 ? 'Night' : 'Nights'} &bull; {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</p>
                </div>
              </div>
            </div>

            {/* Bill details table */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Charge Summary</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground text-[10px] uppercase tracking-wider">
                      <th className="py-2 font-bold">Description</th>
                      <th className="py-2 text-right font-bold">Rate/Night</th>
                      <th className="py-2 text-center font-bold">Nights</th>
                      <th className="py-2 text-right font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    <tr>
                      <td className="py-3">
                        <p className="font-semibold text-foreground">{selectedRoomForBooking.type}</p>
                        <p className="text-[10px] text-muted-foreground">Room Accommodation &amp; Meal Plan ({selectedMealPlan})</p>
                      </td>
                      <td className="py-3 text-right font-medium">₹{pricing.basePrice.toFixed(0)}</td>
                      <td className="py-3 text-center">{nights}</td>
                      <td className="py-3 text-right font-semibold text-foreground">₹{(pricing.basePrice * nights).toFixed(0)}</td>
                    </tr>
                    {bookingFormDetails.extraBed && (
                      <tr>
                        <td className="py-3">
                          <p className="font-semibold text-foreground">Extra Bed</p>
                          <p className="text-[10px] text-muted-foreground">Additional rollaway bed</p>
                        </td>
                        <td className="py-3 text-right font-medium">₹{pricing.extraBedCharge.toFixed(0)}</td>
                        <td className="py-3 text-center">{nights}</td>
                        <td className="py-3 text-right font-semibold text-foreground">₹{(pricing.extraBedCharge * nights).toFixed(0)}</td>
                      </tr>
                    )}
                    <tr className="bg-primary/5 font-bold text-foreground">
                      <td colSpan={2} className="py-3 px-3 rounded-l-xl">Estimated Total Price (incl. tax):</td>
                      <td className="py-3 text-center">{nights}</td>
                      <td className="py-3 text-right text-primary text-sm px-3 rounded-r-xl">₹{(pricing.totalPerNight * nights).toFixed(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <button
              onClick={handleReturnToHome}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/20 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="w-full flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border/80 text-foreground font-bold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            <button
              onClick={handleShareReceipt}
              className="w-full flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border/80 text-foreground font-bold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              Share Details
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-secondary/10 mt-auto">
        <p>© 2026 Saveetha GuestHouse. All rights reserved.</p>
      </footer>
    </div>
  );
}
