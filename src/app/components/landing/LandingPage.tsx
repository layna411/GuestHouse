import React, { useState, useEffect } from 'react';
import { Room, User } from '../../types';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Constants and Helpers
import { 
  INITIAL_REVIEWS, 
  ROOM_IMAGE_MAP, 
  getPriceDetails,
  GuestReview
} from './constants';

// Modularized Components
import { LandingHeader } from './LandingHeader';
import { LandingHero } from './LandingHero';
import { LandingMap } from './LandingMap';
import { LandingRooms } from './LandingRooms';
import { LandingGallery } from './LandingGallery';
import { LandingAmenities } from './LandingAmenities';
import { LandingReviews } from './LandingReviews';
import { LandingFaqs } from './LandingFaqs';
import { LandingFooter } from './LandingFooter';
import { RoomDetailsView } from './RoomDetailsView';
import { CheckoutView } from './CheckoutView';
import { ConfirmationView } from './ConfirmationView';

interface LandingPageProps {
  rooms: Room[];
  currentUser: User | null;
  onBookRoom: (roomId: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onBookingSubmit?: (bookingData: any) => Promise<void>;
}

export function LandingPage({ 
  rooms, 
  currentUser, 
  onBookRoom, 
  onOpenLogin, 
  onLogout,
  onNavigateToDashboard,
  onBookingSubmit
}: LandingPageProps) {
  // Search Widget State
  const [checkIn, setCheckIn] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [checkOut, setCheckOut] = useState(format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [guestCount, setGuestCount] = useState(1);
  const [roomTypeFilter, setRoomTypeFilter] = useState<'ALL' | 'Deluxe Room' | 'Super Deluxe Room'>('ALL');
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);
  
  // Reviews List and Form
  const [reviewsList, setReviewsList] = useState<GuestReview[]>(INITIAL_REVIEWS);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewForm, setReviewForm] = useState({
    advantages: '',
    disadvantages: '',
    month: 'Month',
    year: 'Year',
    rating: 10,
    name: '',
    email: '',
    country: '',
  });

  // Booking Flow States
  const [bookingFlowState, setBookingFlowState] = useState<'landing' | 'room-details' | 'checkout' | 'confirmation'>('landing');
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [activeDetailImage, setActiveDetailImage] = useState<string>('');
  const [selectedMealPlan, setSelectedMealPlan] = useState('Room without Breakfast');
  const [selectedBedPreference, setSelectedBedPreference] = useState<string>('Twin beds');
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [bookingFormDetails, setBookingFormDetails] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    purpose: '',
    extraBed: false,
    offers: true,
  });
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [activeTaxInfoRow, setActiveTaxInfoRow] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [showSpecialRequest, setShowSpecialRequest] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<'email' | 'sms'>('email');

  // Trigger simulated email/SMS delivery notifications upon booking completion
  useEffect(() => {
    if (bookingFlowState === 'confirmation') {
      const emailTimer = setTimeout(() => {
        toast.success(`📩 Confirmation email successfully delivered to ${bookingFormDetails.guestEmail}!`, {
          duration: 7000,
          description: "Formatted based on MailFormat.pdf (Ascott/Citadines style receipt).",
        });
      }, 1000);

      const smsTimer = setTimeout(() => {
        toast.info(`💬 Booking notification SMS sent to ${bookingFormDetails.guestPhone}!`, {
          duration: 7000,
          description: "Simulating mobile network message dispatch.",
        });
      }, 3000);

      return () => {
        clearTimeout(emailTimer);
        clearTimeout(smsTimer);
      };
    }
  }, [bookingFlowState, bookingFormDetails.guestEmail, bookingFormDetails.guestPhone]);

  // Scroll to top on page view transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [bookingFlowState]);

  // Set active detail image on room selection
  useEffect(() => {
    if (selectedRoomForBooking) {
      const defaultImg = selectedRoomForBooking.imageUrl || ROOM_IMAGE_MAP[selectedRoomForBooking.roomNumber] || '/images/WhatsApp Image 2026-06-04 at 3.41.02 PM.jpeg';
      setActiveDetailImage(defaultImg);
    }
  }, [selectedRoomForBooking]);

  // Filter and group rooms by category (Deluxe Room & Super Deluxe Room)
  useEffect(() => {
    const uniqueTypes = ['Deluxe Room', 'Super Deluxe Room'];
    const result: Room[] = [];
    uniqueTypes.forEach(type => {
      const typeRooms = rooms.filter(r => r.type === type);
      if (typeRooms.length > 0) {
        let selected = typeRooms.find(r => r.status === 'vacant');
        if (!selected) {
          selected = typeRooms[0];
        }
        result.push(selected);
      }
    });
    setFilteredRooms(result);
  }, [rooms]);

  // 15 Minutes Timer
  useEffect(() => {
    if (bookingFlowState !== 'checkout') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.warning("Hold time expired. Prices may change.");
          return 900;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [bookingFlowState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const minsStr = mins.toString().padStart(2, '0');
    const secsStr = secs.toString().padStart(2, '0');
    return {
      min1: minsStr[0],
      min2: minsStr[1],
      sec1: secsStr[0],
      sec2: secsStr[1]
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogSection = document.getElementById('rooms-catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const errs: Record<string, string> = {};
    if (!bookingFormDetails.guestName.trim()) errs.guestName = "Guest name is required";
    if (!bookingFormDetails.guestPhone.trim()) errs.guestPhone = "Phone number is required";
    if (!bookingFormDetails.guestEmail.trim()) errs.guestEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(bookingFormDetails.guestEmail)) errs.guestEmail = "Invalid email format";
    if (!bookingFormDetails.purpose.trim()) errs.purpose = "Purpose of visit is required";
    
    if (Object.keys(errs).length > 0) {
      setBookingErrors(errs);
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (!selectedRoomForBooking) return;

    // Calculate nights
    const checkInDate = new Date(`${checkIn}T14:00`);
    const checkOutDate = new Date(`${checkOut}T11:00`);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Calculate rates
    const pricing = getPriceDetails(
      selectedRoomForBooking.type,
      guestCount,
      selectedMealPlan,
      bookingFormDetails.extraBed
    );

    // All rooms have twin beds only
    const finalPurpose = `[Bed Preference: Twin beds] ${bookingFormDetails.purpose}`;

    const bookingPayload = {
      roomId: selectedRoomForBooking.id,
      guestName: bookingFormDetails.guestName,
      guestPhone: bookingFormDetails.guestPhone,
      guestEmail: bookingFormDetails.guestEmail,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfGuests: guestCount,
      purpose: finalPurpose,
      mealPlan: selectedMealPlan,
      pricePerNight: pricing.ratePerNight,
      totalPrice: pricing.totalPerNight * nights
    };

    try {
      if (onBookingSubmit) {
        await onBookingSubmit(bookingPayload);
        // Set confirmed state
        const generatedId = "RES" + Math.floor(Math.random() * 900000 + 100000);
        setConfirmedBookingId(generatedId);
        setBookingFlowState('confirmation');
      } else {
        toast.error("Booking submit handler is not configured.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to complete reservation.");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <LandingHeader 
        currentUser={currentUser}
        onLogout={onLogout}
        onNavigateToDashboard={onNavigateToDashboard}
        bookingFlowState={bookingFlowState}
        setBookingFlowState={setBookingFlowState}
        setSelectedRoomForBooking={setSelectedRoomForBooking}
        setBookingFormDetails={setBookingFormDetails}
        setBookingErrors={setBookingErrors}
      />

      {bookingFlowState === 'landing' && (
        <>
          <LandingHero 
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            guestCount={guestCount}
            setGuestCount={setGuestCount}
            onSearch={handleSearch}
          />
          <LandingMap />
          <LandingRooms 
            filteredRooms={filteredRooms}
            roomTypeFilter={roomTypeFilter}
            setRoomTypeFilter={setRoomTypeFilter}
            onViewDetails={(room) => {
              setSelectedRoomForBooking(room);
              setBookingFlowState('room-details');
            }}
          />
          <LandingGallery />
          <LandingAmenities />
          <LandingReviews 
            reviewsList={reviewsList}
            setReviewsList={setReviewsList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
          />
          <LandingFaqs />
        </>
      )}

      {bookingFlowState === 'room-details' && selectedRoomForBooking && (
        <RoomDetailsView 
          selectedRoomForBooking={selectedRoomForBooking}
          activeDetailImage={activeDetailImage}
          setActiveDetailImage={setActiveDetailImage}
          guestCount={guestCount}
          setSelectedMealPlan={setSelectedMealPlan}
          setBookingFlowState={setBookingFlowState}
          setSelectedRoomForBooking={setSelectedRoomForBooking}
          setTimeLeft={setTimeLeft}
        />
      )}

      {bookingFlowState === 'checkout' && selectedRoomForBooking && (
        <CheckoutView 
          selectedRoomForBooking={selectedRoomForBooking}
          setBookingFlowState={setBookingFlowState}
          timeLeft={timeLeft}
          formatTime={formatTime}
          handleCheckoutSubmit={handleCheckoutSubmit}
          bookingFormDetails={bookingFormDetails}
          setBookingFormDetails={setBookingFormDetails}
          bookingErrors={bookingErrors}
          selectedBedPreference={selectedBedPreference}
          setSelectedBedPreference={setSelectedBedPreference}
          showSpecialRequest={showSpecialRequest}
          setShowSpecialRequest={setShowSpecialRequest}
          checkIn={checkIn}
          checkOut={checkOut}
          guestCount={guestCount}
          selectedMealPlan={selectedMealPlan}
          getPriceDetails={getPriceDetails}
          ROOM_IMAGE_MAP={ROOM_IMAGE_MAP}
          activeTaxInfoRow={activeTaxInfoRow}
          setActiveTaxInfoRow={setActiveTaxInfoRow}
        />
      )}

      {bookingFlowState === 'confirmation' && selectedRoomForBooking && (
        <ConfirmationView 
          selectedRoomForBooking={selectedRoomForBooking}
          setBookingFlowState={setBookingFlowState}
          bookingFormDetails={bookingFormDetails}
          setBookingFormDetails={setBookingFormDetails}
          setBookingErrors={setBookingErrors}
          setSelectedRoomForBooking={setSelectedRoomForBooking}
          confirmedBookingId={confirmedBookingId}
          activeNotificationTab={activeNotificationTab}
          setActiveNotificationTab={setActiveNotificationTab}
          checkIn={checkIn}
          checkOut={checkOut}
          guestCount={guestCount}
          selectedMealPlan={selectedMealPlan}
          getPriceDetails={getPriceDetails}
          ROOM_IMAGE_MAP={ROOM_IMAGE_MAP}
        />
      )}

      <LandingFooter 
        onOpenLogin={onOpenLogin}
        setBookingFlowState={setBookingFlowState}
      />
    </div>
  );
}
