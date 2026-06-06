import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, ArrowLeft, ShieldCheck, CheckCircle2, Lock, Smartphone, Landmark } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentViewProps {
  pendingBookingPayload: any;
  setBookingFlowState: (state: any) => void;
  onPaymentSuccess: () => Promise<void>;
}

export function PaymentView({
  pendingBookingPayload,
  setBookingFlowState,
  onPaymentSuccess
}: PaymentViewProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);
  
  // Card Details State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    setCardCvv(value);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (!cardName.trim() || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) {
        toast.error("Please fill in card details correctly.");
        return;
      }
    } else if (paymentMethod === 'netbanking' && !selectedBank) {
      toast.error("Please select a bank to proceed.");
      return;
    }

    setProcessing(true);
    toast.info("Secure payment gateway initiated. Processing transaction...");

    // Simulate Payment Steps
    setTimeout(() => {
      toast.info("Verifying credit funds and routing with bank...");
      
      setTimeout(async () => {
        try {
          await onPaymentSuccess();
          toast.success("Payment Received Successfully! Secure booking registered.");
        } catch (err: any) {
          toast.error("Payment authorization failed. Please try again.");
          setProcessing(false);
        }
      }, 2000);
    }, 1500);
  };

  return (
    <div 
      className="pt-12 pb-16 min-h-screen text-foreground font-sans"
      style={{
        backgroundImage: 'linear-gradient(to bottom, var(--background-overlay-start), var(--background-overlay-end)), url("/images/image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Back Button */}
        <button
          onClick={() => setBookingFlowState('checkout')}
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Payment Section */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-bold font-serif tracking-wide border-b border-border/40 pb-4 text-foreground">
              Secure Payment Gateway
            </h2>

            {/* Payment Method Selector Tab */}
            <div className="grid grid-cols-3 gap-2 bg-secondary/40 p-1.5 rounded-xl border border-border/30">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi' 
                    ? 'bg-primary text-primary-foreground shadow-md font-bold' 
                    : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                UPI / QR Scan
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card' 
                    ? 'bg-primary text-primary-foreground shadow-md font-bold' 
                    : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Cards (Visa/MC)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'netbanking' 
                    ? 'bg-primary text-primary-foreground shadow-md font-bold' 
                    : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'
                }`}
              >
                <Landmark className="w-4 h-4" />
                Net Banking
              </button>
            </div>

            {/* Payment Forms */}
            <div className="backdrop-blur-md bg-card/40 shadow-xl rounded-2xl border border-border/50 p-6">
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                
                {/* Method 1: UPI/QR Scan */}
                {paymentMethod === 'upi' && (
                  <div className="text-center space-y-6 py-4 flex flex-col items-center">
                    <p className="text-xs text-muted-foreground">
                      Scan the secure QR Code below using GPay, PhonePe, Paytm or any BHIM UPI App to pay instantly.
                    </p>
                    
                    {/* Simulated QR Code */}
                    <div className="bg-white p-4 rounded-2xl shadow-xl relative w-48 h-48 flex items-center justify-center border border-border/30">
                      <svg className="w-40 h-40 text-slate-900" viewBox="0 0 100 100">
                        {/* Simulated QR Matrix */}
                        <path fill="currentColor" d="M0 0h30v30H0zm40 0h20v20H40zm30 0h30v30H70zM0 40h20v20H0zm60 40h10v20H60zm10-40h30v30H70zM0 70h30v30H0zm40 40h20v10H40zm40 0h20v10H80z" />
                        <path fill="currentColor" fillRule="evenodd" d="M10 10h10v10H10zm70 0h10v10H80zM10 80h10v10H10z" />
                        <rect x="42" y="42" width="16" height="16" rx="2" fill="#0f766e" />
                        <circle cx="50" cy="50" r="4" fill="white" />
                      </svg>
                      {processing && (
                        <div className="absolute inset-0 bg-background/80 rounded-2xl flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        Secure Sandbox UPI ID
                      </span>
                      <p className="font-mono text-sm font-bold text-foreground mt-2">saveethaguesthouse@upi</p>
                    </div>
                  </div>
                )}

                {/* Method 2: Credit Card */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    {/* Interactive Mock Card Display */}
                    <div className="w-full h-40 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-800 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-teal-600/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-100">Saveetha Resident Card</span>
                        <CreditCard className="w-6 h-6 text-teal-200" />
                      </div>
                      <p className="font-mono text-lg font-bold tracking-widest text-slate-100">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-teal-200 font-bold">Card Holder</p>
                          <p className="font-mono text-xs font-bold text-white uppercase truncate max-w-[150px]">
                            {cardName || 'YOUR FULL NAME'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] uppercase tracking-wider text-teal-200 font-bold">Expiry</p>
                          <p className="font-mono text-xs font-bold text-white">
                            {cardExpiry || 'MM/YY'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block mb-1.5 text-xs text-muted-foreground font-bold uppercase tracking-wider">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          placeholder="AS APPEARS ON CREDIT CARD"
                          className="glass-input w-full px-4 py-2.5 text-xs"
                          required
                          disabled={processing}
                        />
                      </div>
                      <div>
                        <label className="block mb-1.5 text-xs text-muted-foreground font-bold uppercase tracking-wider">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          className="glass-input w-full px-4 py-2.5 text-xs font-mono"
                          required
                          disabled={processing}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1.5 text-xs text-muted-foreground font-bold uppercase tracking-wider">Expiration Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="glass-input w-full px-4 py-2.5 text-xs font-mono text-center"
                            required
                            disabled={processing}
                          />
                        </div>
                        <div>
                          <label className="block mb-1.5 text-xs text-muted-foreground font-bold uppercase tracking-wider">CVV Code</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            placeholder="•••"
                            maxLength={3}
                            className="glass-input w-full px-4 py-2.5 text-xs font-mono text-center"
                            required
                            disabled={processing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 3: Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Select your respective retail bank from the popular options below:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Canara Bank', 'Punjab National Bank'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`px-4 py-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                            selectedBank === bank
                              ? 'bg-primary/10 border-primary text-primary shadow-md shadow-primary/10 font-bold'
                              : 'bg-background border-border text-foreground hover:border-primary/50'
                          }`}
                          disabled={processing}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-4 border-t border-border/30 space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" /> Secure 256-bit SSL Transaction
                    </span>
                    <span>Merchant: SIMATS Guest House</span>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                        Verifying Transaction...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Authorize Payment & Confirm Book
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Pricing Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold font-serif tracking-wide border-b border-border/40 pb-4 text-foreground">
              Booking Ledger
            </h2>

            <div className="backdrop-blur-md bg-card/40 shadow-xl rounded-2xl border border-border/50 p-5 space-y-4 text-foreground">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Resident Details</p>
                <p className="text-sm font-bold text-foreground">{pendingBookingPayload.guestName}</p>
                <p className="text-xs text-muted-foreground">{pendingBookingPayload.guestEmail}</p>
                <p className="text-xs text-muted-foreground">{pendingBookingPayload.guestPhone}</p>
              </div>

              <div className="border-t border-border/30 pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accommodations:</span>
                  <span className="font-semibold text-foreground">
                    {pendingBookingPayload.roomId ? "Deluxe Room" : "Super Deluxe Room"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meal Plan:</span>
                  <span className="font-semibold text-foreground truncate max-w-[150px]">
                    {pendingBookingPayload.mealPlan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Guests:</span>
                  <span className="font-semibold text-foreground">{pendingBookingPayload.numberOfGuests} Persons</span>
                </div>
              </div>

              <div className="border-t border-border/30 pt-4 space-y-2 text-xs font-bold">
                <div className="flex justify-between text-lg text-foreground">
                  <span>Total Charges</span>
                  <span className="text-primary text-xl">₹{pendingBookingPayload.totalPrice}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-normal leading-relaxed">
                  * Inclusive of all central CGST (2.5%) and state SGST (2.5%) taxes. Payment receipt will be dispatched upon booking validation.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
