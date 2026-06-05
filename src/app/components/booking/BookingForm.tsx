import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, Info, Check, ChevronDown, ChevronUp, Users, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Room } from '../../types';
import { format } from 'date-fns';

const ROOM_IMAGE_MAP: Record<string, string> = {
  '101': '/images/WhatsApp Image 2026-06-04 at 3.41.02 PM.jpeg',
  '102': '/images/WhatsApp Image 2026-06-04 at 3.41.03 PM.jpeg',
  '103': '/images/WhatsApp Image 2026-06-04 at 3.41.04 PM.jpeg',
  '104': '/images/WhatsApp Image 2026-06-04 at 3.41.04 PM (1).jpeg',
  '105': '/images/WhatsApp Image 2026-06-04 at 3.41.05 PM.jpeg',
  '106': '/images/WhatsApp Image 2026-06-04 at 3.41.05 PM (1).jpeg',
  '201': '/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg',
  '202': '/images/WhatsApp Image 2026-06-04 at 3.41.07 PM.jpeg',
  '203': '/images/WhatsApp Image 2026-06-04 at 3.41.08 PM.jpeg',
  '301': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM (1).jpeg',
  '302': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM.jpeg',
  'G01': '/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg',
  'G02': '/images/WhatsApp Image 2026-06-04 at 3.41.07 PM.jpeg',
  'G03': '/images/WhatsApp Image 2026-06-04 at 3.41.07 PM (1).jpeg',
  'G04': '/images/WhatsApp Image 2026-06-04 at 3.41.08 PM.jpeg',
  'G05': '/images/WhatsApp Image 2026-06-04 at 3.41.09 PM.jpeg',
  'G06': '/images/WhatsApp Image 2026-06-04 at 3.41.09 PM (1).jpeg',
  'G07': '/images/WhatsApp Image 2026-06-04 at 3.41.10 PM.jpeg',
  'G08': '/images/WhatsApp Image 2026-06-04 at 3.41.10 PM (1).jpeg',
  'G09': '/images/WhatsApp Image 2026-06-04 at 3.41.11 PM.jpeg',
  'G10': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM.jpeg',
  'G11': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM (1).jpeg',
  'G12': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM.jpeg',
};

const getPriceDetails = (roomType: string, guests: number, mealPlan: string, extraBed: boolean) => {
  const isSuper = roomType.toLowerCase().includes('super');
  let basePrice = 0;
  
  if (mealPlan === 'Room with Breakfast, Lunch & Dinner') {
    if (guests === 1) basePrice = 2800;
    else if (guests === 2) basePrice = 3300;
    else basePrice = 3600;
  } else if (mealPlan === 'Room with Breakfast') {
    if (isSuper) {
      if (guests === 1) basePrice = 2500;
      else if (guests === 2) basePrice = 2700;
      else basePrice = 3000;
    } else {
      if (guests === 1) basePrice = 2400;
      else if (guests === 2) basePrice = 2600;
      else basePrice = 2800;
    }
  } else { // Room without Breakfast
    if (isSuper) {
      if (guests === 1) basePrice = 2350;
      else if (guests === 2) basePrice = 2550;
      else basePrice = 2750;
    } else {
      if (guests === 1) basePrice = 2250;
      else if (guests === 2) basePrice = 2450;
      else basePrice = 2650;
    }
  }

  const extraBedCharge = extraBed ? 500 : 0;
  const ratePerNight = basePrice + extraBedCharge;
  const tax = ratePerNight * 0.05;
  const totalPerNight = ratePerNight + tax;

  return { basePrice, extraBedCharge, ratePerNight, tax, totalPerNight };
};

interface BookingFormProps {
  room: Room;
  onSubmit: (bookingData: any) => void;
  onClose: () => void;
}

export function BookingForm({ room, onSubmit, onClose }: BookingFormProps) {
  // Wizard step state: 'overview' (Step 1) or 'checkout' (Step 2)
  const [step, setStep] = useState<'overview' | 'checkout'>('overview');
  
  // Bed preference: radio select option
  const [bedPreference, setBedPreference] = useState<string>('Twin beds');

  // Drawer toggle for detailed description
  const [showRoomDetails, setShowRoomDetails] = useState(false);

  // Active dates/guests configuration that determines live rate displays
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    checkInDate: format(new Date(), 'yyyy-MM-dd'),
    checkInTime: '14:00',
    checkOutDate: format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    checkOutTime: '11:00',
    numberOfGuests: 1,
    purpose: '',
    mealPlan: 'Room without Breakfast',
    extraBed: false,
  });

  // Top rates bar inputs are managed in temporary state until "CHECK RATES" is clicked
  const [tempCheckInDate, setTempCheckInDate] = useState(formData.checkInDate);
  const [tempCheckOutDate, setTempCheckOutDate] = useState(formData.checkOutDate);
  const [tempNumberOfGuests, setTempNumberOfGuests] = useState(formData.numberOfGuests);

  // State to show tax breakdown details in a small popup for each row
  const [activeTaxInfoRow, setActiveTaxInfoRow] = useState<string | null>(null);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSearchRates = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      checkInDate: tempCheckInDate,
      checkOutDate: tempCheckOutDate,
      numberOfGuests: Number(tempNumberOfGuests),
    }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.guestPhone.trim()) newErrors.guestPhone = 'Phone number is required';
    if (!formData.guestEmail.trim()) newErrors.guestEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) newErrors.guestEmail = 'Invalid email format';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose of visit is required';
    if (formData.numberOfGuests > room.capacity) {
      newErrors.numberOfGuests = `Maximum capacity is ${room.capacity} guests`;
    }

    const checkIn = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
    const checkOut = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);

    if (checkOut <= checkIn) {
      newErrors.checkOutDate = 'Check-out must be after check-in';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const checkIn = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
    const checkOut = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);

    // All rooms have twin beds only
    const finalPurpose = `[Bed Preference: Twin beds] ${formData.purpose}`;

    onSubmit({
      ...formData,
      checkIn,
      checkOut,
      roomId: room.id,
      purpose: finalPurpose,
      pricePerNight: ratePerNight,
      totalPrice: grandTotal,
    });
  };

  // Calculate nights count
  const checkIn = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
  const checkOut = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Calculate details for active selection (needed for checkout invoice screen)
  const { basePrice, extraBedCharge, ratePerNight, tax, totalPerNight } = getPriceDetails(
    room.type, 
    Number(formData.numberOfGuests), 
    formData.mealPlan,
    formData.extraBed
  );
  const grandTotal = totalPerNight * nights;

  // Selected packages mapping
  const packages = [
    {
      id: 'no_breakfast',
      name: 'Room without Breakfast',
      mealTitle: 'Breakfast not included',
      mealsIcon: false,
      isLowest: true,
      policies: ['Free cancellation 24h before check-in'],
    },
    {
      id: 'with_breakfast',
      name: 'Room with Breakfast',
      mealTitle: 'Breakfast included',
      mealsIcon: true,
      isLowest: false,
      policies: ['Free cancellation 24h before check-in'],
    },
    {
      id: 'full_board',
      name: 'Room with Breakfast, Lunch & Dinner',
      mealTitle: 'All Meals Included (Breakfast, Lunch & Dinner)',
      mealsIcon: true,
      isLowest: false,
      policies: ['Free cancellation 24h before check-in'],
    }
  ];

  const imageSrc = room.type.toLowerCase().includes('super')
    ? '/images/WhatsApp Image 2026-06-04 at 3.41.10 PM (1).jpeg'
    : '/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg';

  const roomDescription = room.type.toLowerCase().includes('super')
    ? `Super Deluxe Room offers guests premium air-conditioned comfort, access to high-speed complimentary Wi-Fi, a modern smart TV, mini fridge, and comfortable sofa seating to ensure an exceptional stay.`
    : `Deluxe Room offers guests premium air-conditioned comfort, access to high-speed complimentary Wi-Fi, smart TV, and clean bath amenities to ensure a comfortable stay.`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className={`my-8 w-full transition-all duration-300 ${step === 'overview' ? 'max-w-6xl' : 'max-w-2xl'}`}>
        <Card glass className="w-full border-border/40 shadow-2xl relative">
          
          {/* Header */}
          <CardHeader className="border-b border-border/40 bg-secondary/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Sparkles className="w-4.5 h-4.5 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold font-serif">
                  {step === 'overview' ? `Book - ${room.type}` : 'Checkout Reservation'}
                </CardTitle>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted/80 rounded-lg transition-colors border border-transparent hover:border-border/40 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>

          {/* STEP 1: ROOM OVERVIEW & RATE SELECTION */}
          {step === 'overview' && (
            <CardContent className="p-6 md:p-8 space-y-8">
              
              {/* Check Rates / Top Search Panel */}
              <form onSubmit={handleSearchRates} className="bg-secondary/60 border border-border/40 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                
                {/* Check In Input Card */}
                <div className="relative border border-border/40 rounded-lg bg-card p-2.5 flex items-center gap-3 cursor-pointer hover:border-accent/50 transition-colors">
                  <input
                    type="date"
                    required
                    value={tempCheckInDate}
                    onChange={(e) => setTempCheckInDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Check-in date</span>
                    <span className="block text-sm font-bold text-foreground truncate">
                      {tempCheckInDate ? format(new Date(tempCheckInDate), 'd MMM yyyy') : 'Select Date'}
                    </span>
                  </div>
                </div>

                {/* Check Out Input Card */}
                <div className="relative border border-border/40 rounded-lg bg-card p-2.5 flex items-center gap-3 cursor-pointer hover:border-accent/50 transition-colors">
                  <input
                    type="date"
                    required
                    value={tempCheckOutDate}
                    onChange={(e) => setTempCheckOutDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Check-out date</span>
                    <span className="block text-sm font-bold text-foreground truncate">
                      {tempCheckOutDate ? format(new Date(tempCheckOutDate), 'd MMM yyyy') : 'Select Date'}
                    </span>
                  </div>
                </div>

                {/* Guests Input Card */}
                <div className="relative border border-border/40 rounded-lg bg-card p-2.5 flex items-center gap-3 cursor-pointer hover:border-accent/50 transition-colors">
                  <select
                    value={tempNumberOfGuests}
                    onChange={(e) => setTempNumberOfGuests(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <Users className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Guests</span>
                    <span className="block text-sm font-bold text-foreground truncate">
                      {tempNumberOfGuests} Guest{Number(tempNumberOfGuests) > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg transition-all shadow-md shadow-accent/10 uppercase tracking-wider text-xs"
                >
                  Check Rates
                </Button>
              </form>

              {/* Title & Desc */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground tracking-tight">Room Overview</h1>
                <p className="text-muted-foreground max-w-3xl mx-auto text-sm leading-relaxed">
                  Somerset academic apartments offer distinguished guests a refined residency experience with private workspace desks, climate-controlled comfort, complimentary high-fidelity Wi-Fi connection, and specialized student or faculty guest lounge accessibility.
                </p>
              </div>

              {/* Suite Detail and Packages card */}
              <div className="border border-border/40 rounded-2xl overflow-hidden bg-card shadow-lg flex flex-col">
                
                {/* Upper card info: Image + Quick facts */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 border-b border-border/20">
                  <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border/20 shadow-md">
                    <img
                      src={imageSrc}
                      alt={`Suite Room ${room.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-serif font-bold text-foreground">
                        {room.type}
                      </h2>
                      <div className="w-16 h-0.5 bg-accent rounded"></div>
                      <p className="text-xs text-muted-foreground tracking-wide font-medium">
                        Twin beds • Fully sanitised and prepared
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-bold border border-border/40">
                        Size: {room.type === 'AC' ? '44 m²' : '35 m²'}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-bold border border-border/40">
                        Max capacity: {room.capacity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowRoomDetails(!showRoomDetails)}
                        className="px-3 py-1.5 rounded-lg border border-accent/30 text-accent hover:bg-accent/5 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        ROOM DETAILS
                        {showRoomDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanding Description drawer */}
                {showRoomDetails && (
                  <div className="px-6 md:px-8 py-5 bg-secondary/35 border-b border-border/20 space-y-4 animate-fadeIn">
                    <p className="text-sm text-foreground/80 leading-relaxed font-sans">{roomDescription}</p>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-extrabold tracking-wider text-accent">Room Amenities</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {room.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Packages Rate Table (Desktop) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/50 border-b border-border/30">
                        <th className="p-4 px-6 text-xs uppercase font-bold tracking-wider text-muted-foreground w-1/4">Policies</th>
                        <th className="p-4 px-6 text-xs uppercase font-bold tracking-wider text-muted-foreground w-1/5">Meals</th>
                        <th className="p-4 px-6 text-xs uppercase font-bold tracking-wider text-muted-foreground w-3/10">Sleeps</th>
                        <th className="p-4 px-6 text-xs uppercase font-bold tracking-wider text-muted-foreground w-1/4 text-right">Price for {nights} night{nights > 1 ? 's' : ''}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {packages.map((pkg) => {
                        const pricing = getPriceDetails(
                          room.type, 
                          formData.numberOfGuests, 
                          pkg.name, 
                          false
                        );
                        const packageTotal = pricing.totalPerNight * nights;

                        return (
                          <tr key={pkg.id} className="hover:bg-muted/10 transition-colors">
                            {/* Policies cell */}
                            <td className="p-6 px-6 align-top space-y-3">
                              {pkg.isLowest && (
                                <span className="inline-block px-2.5 py-0.5 rounded text-[9px] font-extrabold bg-success text-success-foreground tracking-widest uppercase">
                                  Lowest Price
                                </span>
                              )}
                              <ul className="space-y-1.5 text-xs text-muted-foreground font-semibold">
                                {pkg.policies.map((policy, idx) => (
                                  <li key={idx} className="flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/60"></span>
                                    {policy}
                                    <Info className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-foreground cursor-pointer" />
                                  </li>
                                ))}
                              </ul>
                            </td>

                            {/* Meals cell */}
                            <td className="p-6 px-6 align-top">
                              {pkg.mealsIcon ? (
                                <div className="flex items-start gap-1.5 text-xs font-bold text-accent">
                                  <Check className="w-4.5 h-4.5 text-accent flex-shrink-0 mt-0.5" />
                                  <span>{pkg.mealTitle}</span>
                                </div>
                              ) : (
                                <ul className="space-y-1 text-xs text-muted-foreground font-semibold">
                                  <li className="flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/60"></span>
                                    {pkg.mealTitle}
                                  </li>
                                </ul>
                              )}
                            </td>

                            {/* Sleeps / Bed Preference cell */}
                            {/* Beds cell */}
                            <td className="p-6 px-6 align-top">
                              <div className="bg-secondary/40 border border-border/40 p-4 rounded-xl space-y-2 max-w-[200px]">
                                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border/20">
                                  <span>Beds</span>
                                </div>
                                <div className="text-xs font-bold text-foreground/80">
                                  Twin beds
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/80 pt-1 border-t border-border/20">
                                  <Users className="w-4 h-4 text-accent" />
                                  <span>{formData.numberOfGuests} Guest{formData.numberOfGuests > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </td>

                            {/* Price / Action cell */}
                            <td className="p-6 px-6 align-top text-right space-y-3">
                              <div className="space-y-0.5">
                                <span className="block text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Estimated price</span>
                                <span className="block text-2xl font-black text-foreground">{Math.round(packageTotal)} INR</span>
                              </div>
                              <Button
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, mealPlan: pkg.name }));
                                  setStep('checkout');
                                }}
                                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 py-2.5 rounded-lg shadow-md hover:shadow-accent/15 transition-all text-xs uppercase tracking-wider"
                              >
                                Book Now
                              </Button>
                              <div className="relative inline-block block">
                                <button
                                  type="button"
                                  onClick={() => setActiveTaxInfoRow(activeTaxInfoRow === pkg.id ? null : pkg.id)}
                                  className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1 ml-auto"
                                >
                                  Taxes info
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                                
                                {activeTaxInfoRow === pkg.id && (
                                  <div className="absolute right-0 mt-2 p-3 bg-card border border-border/60 rounded-lg shadow-xl text-left text-[11px] font-semibold text-muted-foreground w-48 z-20 space-y-1.5">
                                    <div className="flex justify-between text-foreground">
                                      <span>Nightly Rate:</span>
                                      <span>₹{pricing.ratePerNight.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>GST Tax (5%):</span>
                                      <span>₹{pricing.tax.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Nights count:</span>
                                      <span>{nights}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-border/20 pt-1 font-bold text-accent">
                                      <span>Total Price:</span>
                                      <span>₹{packageTotal.toFixed(0)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view packages list */}
                <div className="block md:hidden p-4 space-y-4 bg-secondary/15">
                  {packages.map((pkg) => {
                    const pricing = getPriceDetails(
                      room.type, 
                      formData.numberOfGuests, 
                      pkg.name, 
                      false
                    );
                    const packageTotal = pricing.totalPerNight * nights;

                    return (
                      <div key={pkg.id} className="border border-border/40 rounded-xl p-4 space-y-4 bg-card shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-foreground">{pkg.name}</h3>
                            {pkg.isLowest && (
                              <span className="inline-block px-2 py-0.5 rounded text-[8px] font-extrabold bg-success text-success-foreground uppercase tracking-wider">
                                Lowest Price
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="block text-lg font-black text-foreground">{Math.round(packageTotal)} INR</span>
                            <span className="block text-[9px] text-muted-foreground">For {nights} night{nights > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div className="border-t border-border/20 pt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground font-semibold">
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-accent mb-1">Meals Plan</span>
                            <span>{pkg.mealTitle}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-accent mb-1">Cancel Policies</span>
                            <span>Free cancellation</span>
                          </div>
                        </div>

                        {/* Beds on Mobile */}
                        <div className="border-t border-border/20 pt-3">
                          <span className="block text-[8px] uppercase tracking-wider text-accent mb-1">Beds</span>
                          <span className="text-xs font-bold text-foreground/80">Twin beds</span>
                        </div>

                        <div className="border-t border-border/20 pt-3 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveTaxInfoRow(activeTaxInfoRow === pkg.id ? null : pkg.id)}
                            className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                          >
                            Taxes details ({nights}N)
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          
                          <Button
                            onClick={() => {
                              setFormData(prev => ({ ...prev, mealPlan: pkg.name }));
                              setStep('checkout');
                            }}
                            size="sm"
                            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-5 uppercase"
                          >
                            Book Now
                          </Button>
                        </div>

                        {activeTaxInfoRow === pkg.id && (
                          <div className="p-3 bg-secondary/50 rounded-lg text-[10px] font-semibold text-muted-foreground space-y-1 border border-border/20">
                            <div className="flex justify-between">
                              <span>Base Rate/Night:</span>
                              <span className="text-foreground">₹{pricing.ratePerNight.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GST Tax (5%):</span>
                              <span>₹{pricing.tax.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between border-t border-border/20 pt-1 font-bold text-accent">
                              <span>Grand Total:</span>
                              <span>₹{packageTotal.toFixed(0)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>

            </CardContent>
          )}

          {/* STEP 2: GUEST DETAILS & CHECKOUT FORM */}
          {step === 'checkout' && (
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-border/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Selected Stay Details</span>
                    <button
                      type="button"
                      onClick={() => setStep('overview')}
                      className="text-xs text-accent hover:underline font-bold"
                    >
                      Change plan
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Room Type:</span>
                      <span className="text-foreground">{room.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Meal Package:</span>
                      <span className="text-foreground truncate block max-w-[200px]">{formData.mealPlan}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Dates:</span>
                      <span className="text-foreground truncate block">
                        {format(new Date(formData.checkInDate), 'd MMM')} – {format(new Date(formData.checkOutDate), 'd MMM, yyyy')} ({nights} Night{nights > 1 ? 's' : ''})
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Beds:</span>
                      <span className="text-foreground">Twin beds</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Guest Full Name"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    error={errors.guestName}
                    placeholder="Dr. Rajesh Kumar"
                    required
                  />

                  <Input
                    label="Phone Number"
                    name="guestPhone"
                    type="tel"
                    value={formData.guestPhone}
                    onChange={handleChange}
                    error={errors.guestPhone}
                    placeholder="+91 98765 43210"
                    required
                  />

                  <Input
                    label="Email Address"
                    name="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    error={errors.guestEmail}
                    placeholder="rajesh.kumar@simats.edu"
                    className="sm:col-span-2"
                    required
                  />

                  {/* Purpose of Visit */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-sm font-semibold text-foreground">
                      Purpose of Visit
                    </label>
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none font-medium"
                      placeholder="e.g. Guest Lecture, Conference Speaker, Board Meeting..."
                      required
                    />
                    {errors.purpose && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  {/* Extra Bed charge Selection */}
                  <div className="sm:col-span-2 flex items-start gap-3 p-3.5 bg-secondary/35 border border-border/40 rounded-xl">
                    <input
                      type="checkbox"
                      id="extraBed"
                      name="extraBed"
                      checked={formData.extraBed}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-accent border-border mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <label htmlFor="extraBed" className="text-xs font-bold text-foreground cursor-pointer flex items-center gap-1.5">
                        Request Extra Bed
                      </label>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        INR 500.00 / night additional charge (subject to room size and availability).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Invoice Breakdown */}
                <div className="p-5 border border-accent/20 bg-accent/5 rounded-xl space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-accent tracking-widest border-b border-accent/10 pb-1.5">
                    Invoice Summary
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Base stay price ({formData.numberOfGuests} guest{formData.numberOfGuests > 1 ? 's' : ''}):</span>
                      <span className="text-foreground">₹{basePrice.toFixed(2)} / night</span>
                    </div>
                    {formData.extraBed && (
                      <div className="flex justify-between">
                        <span>Extra Bed surcharge:</span>
                        <span className="text-foreground">+ ₹500.00 / night</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border/20 pt-2 text-[11px]">
                      <span>Stay cost ({nights} night{nights > 1 ? 's' : ''}):</span>
                      <span className="text-foreground">₹{(ratePerNight * nights).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST luxury tax (5%):</span>
                      <span className="text-foreground">₹{(tax * nights).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-accent/30 pt-2 text-sm font-black text-accent">
                      <span>Total Invoice Amount:</span>
                      <span>₹{grandTotal.toFixed(2)} INR</span>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('overview')}
                    className="flex-1 h-12 font-bold uppercase tracking-wider text-xs border-border/60 hover:bg-secondary/40 text-foreground"
                  >
                    Back to Rates
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg shadow-md hover:shadow-accent/10 transition-all uppercase tracking-wider text-xs"
                  >
                    Confirm Booking
                  </Button>
                </div>

              </form>
            </CardContent>
          )}

        </Card>
      </div>
    </div>
  );
}
