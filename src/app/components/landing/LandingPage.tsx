import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Users, Search, Sparkles, MapPin, Phone, Mail, 
  ArrowRight, ChevronRight, Star, Wifi, Tv, Coffee, 
  Menu, X, ChevronLeft, HelpCircle, Shield, Key, Info,
  Bus, Plus, Minus, Navigation
} from 'lucide-react';
import { Room, User } from '../../types';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface GuestReview {
  id: string;
  source: 'booking' | 'our';
  rating: number;
  ratingText: string;
  reviewerName: string;
  reviewerCountry: string;
  date: string;
  advantages: string;
  disadvantages: string;
}

const INITIAL_REVIEWS: GuestReview[] = [
  {
    id: 'rev1',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Ayadural',
    reviewerCountry: '🇸🇬',
    date: '4 June 2026',
    advantages: 'Peaceful',
    disadvantages: ''
  },
  {
    id: 'rev2',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Vicent',
    reviewerCountry: '🇲🇾',
    date: '2 June 2026',
    advantages: 'Good',
    disadvantages: 'NA'
  },
  {
    id: 'rev3',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Charan',
    reviewerCountry: '🇮🇳',
    date: '2 June 2026',
    advantages: 'The staffs went out of their way to make us feel welcome',
    disadvantages: 'Perfect nothing in specific'
  },
  {
    id: 'rev4',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Vicent',
    reviewerCountry: '🇲🇾',
    date: '2 June 2026',
    advantages: 'Courteous staffs, good food, cleanliness',
    disadvantages: 'Na'
  },
  {
    id: 'rev5',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Srinivasan',
    reviewerCountry: '🇮🇳',
    date: '29 May 2026',
    advantages: 'Felt like staying on my guesthouse',
    disadvantages: 'I like everything in hotel'
  },
  {
    id: 'rev6',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Dr. Rajesh Kumar',
    reviewerCountry: '🇮🇳',
    date: '20 May 2026',
    advantages: 'The stay was absolutely spectacular. The rooms have a premium aesthetic and excellent workspaces.',
    disadvantages: 'None'
  },
  {
    id: 'rev7',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Prof. Anita Sharma',
    reviewerCountry: '🇮🇳',
    date: '19 May 2026',
    advantages: 'Clean, quiet, and fully equipped workspaces. Exceeded expectations.',
    disadvantages: 'No issues encountered.'
  }
];

const GALLERY_IMAGES = [
  '/images/WhatsApp Image 2026-06-04 at 3.41.09 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.11 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.05 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.07 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.02 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.03 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.04 PM (1).jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.04 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.05 PM (1).jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.07 PM (1).jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.08 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.09 PM (1).jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.10 PM (1).jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.10 PM.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM (1).jpeg',
];

const ALL_FACILITIES = [
  { name: 'Free 24hrs Wi-Fi Connection', category: 'Connectivity' },
  { name: 'High-speed Internet connection', category: 'Connectivity' },
  { name: 'Photocopying service (chargeable)', category: 'Connectivity' },
  { name: '24-hour Reception Desk', category: 'Services' },
  { name: '24-hour Security & CCTV', category: 'Services' },
  { name: 'Room Service & In-room Dining', category: 'Services' },
  { name: 'Daily Housekeeping', category: 'Services' },
  { name: 'Ironing service (chargeable)', category: 'Services' },
  { name: 'Washing/Laundry service (chargeable)', category: 'Services' },
  { name: '10+ Multicuisine Restaurants', category: 'Dining' },
  { name: 'Dining Hall', category: 'Dining' },
  { name: 'Electric Kettle in rooms', category: 'Dining' },
  { name: 'PAID Fitness Centre', category: 'Leisure' },
  { name: 'Access to Garden Seating Area', category: 'Leisure' },
  { name: 'Dryer facility', category: 'Amenities' },
  { name: 'Extra Bed (chargeable)', category: 'Amenities' },
  { name: 'Non-smoking rooms', category: 'Policies' },
  { name: 'Allergy-free rooms', category: 'Policies' },
  { name: 'Modern Lift Access', category: 'Facilities' },
  { name: 'Backup Energy Supplier', category: 'Facilities' },
  { name: 'Wheelchair access', category: 'Facilities' },
  { name: 'Free parking spaces', category: 'Facilities' },
];

interface LandingPageProps {
  rooms: Room[];
  currentUser: User | null;
  onBookRoom: (roomId: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
}

const HERO_SLIDES = [
  {
    image: '/images/WhatsApp Image 2026-06-04 at 3.41.09 PM.jpeg',
    title: 'Saveetha GuestHouse',
    subtitle: 'Luxury Guest House & Serviced Suites',
    description: 'Experience unmatched sophistication, premium comfort, and exemplary hospitality in the heart of Chennai.'
  },
  {
    image: '/images/WhatsApp Image 2026-06-04 at 3.41.11 PM.jpeg',
    title: 'Exquisite Lounges',
    subtitle: 'Relax and Connect in Elegance',
    description: 'Indulge in our beautifully designed social spaces, perfect for hosting distinguished guests and colleagues.'
  },
  {
    image: '/images/WhatsApp Image 2026-06-04 at 3.41.10 PM (1).jpeg',
    title: 'Infinite Leisure',
    subtitle: 'A Sanctuary Above the City',
    description: 'Refresh your senses at our state-of-the-art rooftop infinity pool, offering panoramic views of Chennai.'
  }
];

const AMENITIES = [
  {
    icon: Wifi,
    name: 'Ultra-Fast Wi-Fi',
    desc: 'High-speed gigabit connectivity accessible throughout the guest house.'
  },
  {
    icon: Coffee,
    name: 'Gourmet Dining',
    desc: 'Exquisite breakfast and multi-cuisine restaurant options for residents.'
  },
  {
    icon: Tv,
    name: 'Smart Entertainment',
    desc: 'Flat-screen LED TVs with premium satellite channels in every room.'
  },
  {
    icon: Shield,
    name: '24/7 Security',
    desc: 'Secure smart card access, round-the-clock monitoring and concierge.'
  }
];

const FAQS = [
  {
    q: 'What are the check-in and check-out timings?',
    a: 'Standard check-in is from 2:00 PM onwards, and check-out is by 11:00 AM. Early check-in or late check-out is subject to room availability.'
  },
  {
    q: 'How does the booking notification system work?',
    a: 'Once you place a booking request, it defaults to "Pending" status and instantly notifies our admin team. You will receive an email/notification as soon as your booking is approved.'
  },
  {
    q: 'Are visitors allowed in the guest rooms?',
    a: 'Yes, visitors are allowed in the lounge and guest rooms during standard daytime hours (9:00 AM - 8:00 PM). Overnight stays for unregistered visitors are not permitted.'
  },
  {
    q: 'Is there a cancellation policy?',
    a: 'Cancellations made 24 hours prior to the check-in date are free of charge. Late cancellations may incur a fee equivalent to one night\'s room rate.'
  }
];

const ROOM_IMAGE_MAP: Record<string, string> = {
  '101': '/images/WhatsApp Image 2026-06-04 at 3.41.02 PM.jpeg',
  '102': '/images/WhatsApp Image 2026-06-04 at 3.41.03 PM.jpeg',
  '103': '/images/WhatsApp Image 2026-06-04 at 3.41.04 PM.jpeg',
  '201': '/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg',
  '202': '/images/WhatsApp Image 2026-06-04 at 3.41.07 PM.jpeg',
  '203': '/images/WhatsApp Image 2026-06-04 at 3.41.08 PM.jpeg',
  '301': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM (1).jpeg',
  '302': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM.jpeg',
};

export function LandingPage({ 
  rooms, 
  currentUser, 
  onBookRoom, 
  onOpenLogin, 
  onLogout,
  onNavigateToDashboard 
}: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Search Widget State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [roomTypeFilter, setRoomTypeFilter] = useState<'ALL' | 'Deluxe Room' | 'Super Deluxe Room'>('ALL');
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_IMAGES.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Filter rooms when catalog loads or filters change
  useEffect(() => {
    let result = rooms;
    if (roomTypeFilter !== 'ALL') {
      result = result.filter(r => r.type === roomTypeFilter);
    }
    setFilteredRooms(result);
  }, [rooms, roomTypeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Scroll to rooms catalog section
    const catalogSection = document.getElementById('rooms-catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.email.trim()) {
      toast.error("Please enter your name and email address");
      return;
    }

    const newRev: GuestReview = {
      id: Date.now().toString(),
      source: 'our',
      rating: reviewForm.rating,
      ratingText: reviewForm.rating >= 9 ? 'Exceptional' : reviewForm.rating >= 8 ? 'Wonderful' : reviewForm.rating >= 7 ? 'Good' : 'Satisfactory',
      reviewerName: reviewForm.name,
      reviewerCountry: reviewForm.country ? reviewForm.country.trim() : '🇮🇳',
      date: format(new Date(), 'd MMMM yyyy'),
      advantages: reviewForm.advantages.trim(),
      disadvantages: reviewForm.disadvantages.trim(),
    };

    setReviewsList(prev => [newRev, ...prev]);
    setCurrentPage(1);
    setReviewForm({
      advantages: '',
      disadvantages: '',
      month: 'Month',
      year: 'Year',
      rating: 10,
      name: '',
      email: '',
      country: '',
    });
    toast.success("Thank you for your feedback! Review posted successfully.");
  };

  // Review calculations
  const ourReviews = reviewsList.filter(r => r.source === 'our');
  const totalReviews = ourReviews.length;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalReviews / itemsPerPage);
  const startIndex = totalReviews > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, totalReviews);
  const currentReviews = ourReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const averageRating = totalReviews > 0
    ? (ourReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '10.0';

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      
      {/* 1. Header / Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-border/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shadow-lg shadow-accent/5">
              <Key className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-wider text-foreground flex items-center gap-1.5 leading-none">
                Saveetha
              </span>
              <p className="text-[9px] tracking-widest text-accent uppercase font-bold">GuestHouse Booking</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Home</a>
            <a href="#rooms-catalog" className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Rooms</a>
            <a href="#gallery" className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Gallery</a>
            <a href="#amenities" className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Amenities</a>
            <a href="#reviews" className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">Reviews</a>
            <a href="#faqs" className="text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">FAQ</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <>
                <button 
                  onClick={onNavigateToDashboard}
                  className="glass-button px-5 py-2 rounded-lg text-sm font-semibold hover:text-accent flex items-center gap-2 border border-border"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  {currentUser.role === 'admin' ? 'Admin Portal' : 'My Bookings'}
                </button>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="glass-button-gold px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground/80 hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/40 px-4 py-6 flex flex-col gap-4 shadow-xl"
            >
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-foreground/80 hover:text-accent">Home</a>
              <a href="#rooms-catalog" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-foreground/80 hover:text-accent">Rooms</a>
              <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-foreground/80 hover:text-accent">Gallery</a>
              <a href="#amenities" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-foreground/80 hover:text-accent">Amenities</a>
              <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-foreground/80 hover:text-accent">Reviews</a>
              <a href="#faqs" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-foreground/80 hover:text-accent">FAQ</a>
              
              <hr className="border-border/40 my-2" />
              
              {currentUser ? (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { onNavigateToDashboard(); setMobileMenuOpen(false); }}
                    className="glass-button w-full py-2.5 rounded-lg text-sm font-semibold hover:text-accent text-center"
                  >
                    {currentUser.role === 'admin' ? 'Admin Portal' : 'My Bookings'}
                  </button>
                  <button 
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="w-full py-2 text-sm text-center text-destructive"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                  className="glass-button-gold w-full py-2.5 rounded-lg text-sm font-semibold text-center"
                >
                  Sign In
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section with Slide Carousel */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.95)), url("${HERO_SLIDES[currentSlide].image}")` 
              }}
            />
          </AnimatePresence>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-semibold tracking-wider text-amber-300">Ultra Pro Guest Suites</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 leading-none">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <p className="font-serif text-lg sm:text-2xl text-amber-200/90 font-medium tracking-wide mb-6 italic">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <p className="max-w-2xl text-slate-300 text-sm sm:text-lg mb-12">
              {HERO_SLIDES[currentSlide].description}
            </p>
          </motion.div>

          {/* Check-In / Search Glassmorphic Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-4xl mx-auto"
          >
            <form 
              onSubmit={handleSearch}
              className="bg-secondary/95 dark:bg-card/95 p-6 sm:p-8 rounded-lg border border-border/80 dark:border-border/30 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-left shadow-2xl"
            >
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" /> Check In
                </label>
                <input 
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-background dark:bg-secondary border border-border dark:border-border/60 rounded px-4 py-2.5 text-sm w-full text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" /> Check Out
                </label>
                <input 
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-background dark:bg-secondary border border-border dark:border-border/60 rounded px-4 py-2.5 text-sm w-full text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-accent" /> Guests
                </label>
                <select 
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="bg-background dark:bg-secondary border border-border dark:border-border/60 rounded px-4 py-2.5 text-sm w-full text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                >
                  <option value={1} className="bg-background dark:bg-card text-foreground">1 Guest</option>
                  <option value={2} className="bg-background dark:bg-card text-foreground">2 Guests</option>
                  <option value={3} className="bg-background dark:bg-card text-foreground">3 Guests</option>
                  <option value={4} className="bg-background dark:bg-card text-foreground">4 Guests</option>
                </select>
              </div>

              <button 
                type="submit"
                className="glass-button-gold w-full h-11 rounded font-semibold text-sm flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Search className="w-4 h-4" />
                Check Availability
              </button>
            </form>
          </motion.div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2.5 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-accent w-8' : 'bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* 2.5 Map Section */}
      <section id="map-section" className="py-24 bg-secondary/20 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-accent">Location</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mt-2">Map</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4 mb-6"></div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Check out the Saveetha Dental College location and campus facilities near the residency.
            </p>
          </div>

          {/* Interactive Google Map Wrapper */}
          <div className="relative rounded-2xl border border-border/40 overflow-hidden shadow-2xl bg-card h-[500px] sm:h-[600px] w-full flex flex-col md:flex-row">
            
            {/* Real Interactive Google Maps iframe */}
            <div className="w-full h-full relative z-0">
              <iframe
                src="https://maps.google.com/maps?q=Saveetha%20Dental%20College%20and%20Hospitals,%20Poonamallee%20High%20Road,%20Velappanchavadi,%20Chennai&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Saveetha Dental College Location Map"
                className="w-full h-full filter invert-[0.05] contrast-[0.95]"
              />
            </div>

            {/* Premium Floating Location Detail Card */}
            <div className="absolute top-6 left-6 right-6 md:right-auto z-10 max-w-sm p-6 bg-card/90 dark:bg-card/95 backdrop-blur-md border border-border/60 rounded-2xl shadow-2xl space-y-4">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-success/15 border border-success/30 text-[10px] font-bold text-success uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                  Active Campus Residency
                </span>
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Saveetha Dental College Guest House
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Located within the prestigious SIMATS Velappanchavadi campus, Poonamallee High Road, Chennai, India.
                </p>
              </div>

              <div className="border-t border-border/20 pt-3.5 space-y-2 text-[11px] font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-foreground font-bold">Open for Bookings</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="text-foreground font-bold">+91 98765 00000</span>
                </div>
                <div className="flex justify-between">
                  <span>Shuttles:</span>
                  <span className="text-foreground font-bold">Every 15 mins</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Saveetha+Dental+College+and+Hospitals+Chennai"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-accent/10 cursor-pointer"
              >
                Open in Google Maps
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Luxury Rooms Catalog */}
      <section id="rooms-catalog" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-accent">Accommodations</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-2 text-foreground">Rooms & Suites</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mt-4">
            Immerse yourself in our catalog of exquisitely designed suites, featuring high-fidelity finishes, private balconies, and premier comfort amenities.
          </p>

          {/* Filtering tabs */}
          <div className="flex justify-center gap-3 mt-10">
            {['ALL', 'Deluxe Room', 'Super Deluxe Room'].map((type) => (
              <button
                key={type}
                onClick={() => setRoomTypeFilter(type as any)}
                className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-300 ${
                  roomTypeFilter === type 
                    ? 'bg-accent/15 text-accent border-accent/30 shadow-lg shadow-accent/5' 
                    : 'bg-secondary text-muted-foreground border-border hover:bg-border/30 hover:text-foreground'
                }`}
              >
                {type === 'ALL' ? 'All Rooms' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => {
            const imageSrc = room.imageUrl || ROOM_IMAGE_MAP[room.roomNumber] || '/images/WhatsApp Image 2026-06-04 at 3.41.02 PM.jpeg';
            return (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-xl overflow-hidden flex flex-col h-full group"
              >
                {/* Image Container with Hover zoom */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={imageSrc} 
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Glass overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Room Status/Badge */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                      room.status === 'vacant' 
                        ? 'bg-[#4bd395]/20 border-[#4bd395]/30 text-[#4bd395]' 
                        : room.status === 'booked'
                        ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                        : 'bg-red-500/20 border-red-500/30 text-red-300'
                    }`}>
                      {room.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-black/60 border-white/10 text-white backdrop-blur-md">
                      Floor {room.floor}
                    </span>
                  </div>

                  {/* Room Title */}
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-serif text-2xl font-semibold text-white">Room {room.roomNumber}</h3>
                    <p className="text-xs text-accent flex items-center gap-1.5 uppercase font-bold tracking-widest mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" /> {room.type} Suite
                    </p>
                  </div>
                </div>

                {/* Details Panel */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Capacity and Price */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-1 text-foreground/80 text-sm font-semibold">
                        <Users className="w-4 h-4 text-accent" />
                        <span>Up to {room.capacity} Guests</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Per Night</span>
                        <p className="font-serif text-2xl font-bold text-foreground">₹{room.price}</p>
                      </div>
                    </div>

                    {/* Amenities list */}
                    <h4 className="text-[11px] uppercase tracking-wider text-accent mb-3 font-bold">Premium Amenities</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.amenities.map((amenity, index) => (
                        <span 
                          key={index} 
                          className="px-2.5 py-1 rounded bg-secondary border border-border text-[11px] text-muted-foreground flex items-center gap-1 font-semibold"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Booking Action */}
                  {room.status === 'maintenance' ? (
                    <button
                      disabled
                      className="w-full py-3 rounded text-sm font-semibold uppercase tracking-wider bg-secondary text-muted-foreground/60 border border-border/80 cursor-not-allowed text-center"
                    >
                      Under Maintenance
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onOpenLogin();
                        } else {
                          onBookRoom(room.id);
                        }
                      }}
                      className="glass-button-gold w-full py-3 rounded text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    >
                      Book This Suite
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Photo Gallery Showcase */}
      <section id="gallery" className="py-24 bg-background border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-center mb-16 text-foreground">
            Photo Gallery
          </h2>

          <div className="space-y-6">
            {/* Row 1: 2 Landscape Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {GALLERY_IMAGES.slice(0, 2).map((imgUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="relative h-64 sm:h-80 md:h-[450px] rounded-xl overflow-hidden cursor-pointer group border border-border/40 hover:border-accent bg-card shadow-md hover:shadow-xl transition-all"
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={imgUrl}
                    alt={`Photo Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 bg-white/10 rounded-lg text-xs font-semibold text-white border border-white/10 backdrop-blur-sm">
                      View Photo
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Row 2: 3 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {GALLERY_IMAGES.slice(2, 5).map((imgUrl, index) => {
                const actualIndex = index + 2;
                return (
                  <motion.div
                    key={actualIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="relative h-56 sm:h-64 md:h-[320px] rounded-xl overflow-hidden cursor-pointer group border border-border/40 hover:border-accent bg-card shadow-md hover:shadow-xl transition-all"
                    onClick={() => setLightboxIndex(actualIndex)}
                  >
                    <img
                      src={imgUrl}
                      alt={`Photo Gallery ${actualIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-4 py-2 bg-white/10 rounded-lg text-xs font-semibold text-white border border-white/10 backdrop-blur-sm">
                        View Photo
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Expanded section: displays the remaining images (images index 5 onwards) */}
            <AnimatePresence>
              {showAllGallery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
                    {GALLERY_IMAGES.slice(5).map((imgUrl, index) => {
                      const actualIndex = index + 5;
                      return (
                        <motion.div
                          key={actualIndex}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (index % 4) * 0.05, duration: 0.5 }}
                          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border border-border/40 hover:border-accent bg-card shadow-md hover:shadow-xl transition-all"
                          onClick={() => setLightboxIndex(actualIndex)}
                        >
                          <img
                            src={imgUrl}
                            alt={`Photo Gallery ${actualIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-semibold text-white border border-white/10 backdrop-blur-sm">
                              View Photo
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Show More/Less Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              className="px-8 py-3 rounded-full border border-border/85 hover:border-accent text-sm font-semibold tracking-wide text-foreground bg-card hover:bg-secondary transition-all duration-300 shadow-sm hover:shadow-md uppercase text-xs cursor-pointer"
            >
              {showAllGallery ? 'Show Less' : 'Show More'}
            </button>
          </div>

        </div>
      </section>

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

      {/* 5. Guest Experiences (Reviews & Form) */}
      <section id="reviews" className="relative py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground">
            Reviews
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4 mb-6"></div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Find out what other guests say about Saveetha GuestHouse! For your convenience, we have collected the reviews from our guests.
          </p>
        </div>

        {/* Main Grid: Left = List of Reviews, Right = Send Review Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: List of Reviews (Span 2) */}
          <div className="lg:col-span-2 border border-border/40 rounded-2xl overflow-hidden bg-card shadow-lg flex flex-col">
            
            {/* Tab Content Header (Overall rating stats) */}
            <div className="p-6 bg-white dark:bg-card border-b border-border">
              {/* Top Row */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-base font-bold text-foreground">100% Verified Reviews</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">{averageRating}</span>
                  <span className="text-xs text-muted-foreground">/10</span>
                </div>
              </div>
              
              {/* Divider Line */}
              <div className="border-t border-border/60 my-3"></div>
              
              {/* Bottom Row */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Saveetha GuestHouse Booking
                  </span>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  Showing {startIndex} - {endIndex} of {totalReviews}
                </span>
              </div>
            </div>

            {/* List of Reviews scrollable container */}
            <div className="p-6 divide-y divide-border/20 max-h-[500px] overflow-y-auto space-y-6 bg-white dark:bg-card">
              {currentReviews.map((review) => (
                <div key={review.id} className="pt-6 first:pt-0 space-y-4 text-left">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {/* Rating Square Badge (Booking.com style) */}
                      <div className="w-9 h-9 rounded-lg bg-[#0a2239] dark:bg-accent text-white dark:text-accent-foreground font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                        {review.rating}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{review.ratingText}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-semibold">
                          <span className="text-sm">{review.reviewerCountry}</span>
                          <span>{review.reviewerName}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/60"></span>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pl-1">
                    {/* Advantages */}
                    {review.advantages && review.advantages.trim() && (
                      <div className="flex items-start gap-2.5 text-xs font-semibold text-foreground/80 leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-[#4bd395] text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5">+</span>
                        <p>{review.advantages}</p>
                      </div>
                    )}
                    {/* Disadvantages */}
                    {review.disadvantages && review.disadvantages.trim() && (
                      <div className="flex items-start gap-2.5 text-xs font-semibold text-muted-foreground leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-destructive text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 mt-0.5">-</span>
                        <p>{review.disadvantages}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {currentReviews.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm font-semibold">
                  No reviews submitted yet. Be the first to leave one!
                </div>
              )}
            </div>

            {/* Pagination footer */}
            <div className="border-t border-border bg-secondary/15 p-4 flex items-center justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-full border border-border flex items-center justify-center transition-all ${
                  currentPage === 1 
                    ? 'opacity-40 cursor-not-allowed text-muted-foreground' 
                    : 'hover:bg-secondary text-foreground cursor-pointer bg-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'border border-border bg-white text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-1.5 rounded-full border border-border flex items-center justify-center transition-all ${
                  currentPage === totalPages || totalPages === 0
                    ? 'opacity-40 cursor-not-allowed text-muted-foreground' 
                    : 'hover:bg-secondary text-foreground cursor-pointer bg-white'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* RIGHT: Send a Review Form */}
          <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg flex flex-col">
            <div className="p-5 border-b border-border bg-white dark:bg-card text-left">
              <h3 className="font-serif text-lg font-bold text-foreground">Send a review</h3>
            </div>

            <form
              onSubmit={handleSubmitReview}
              className="p-6 space-y-5 text-left bg-white dark:bg-card flex-1"
            >
              <div className="space-y-4">
                <span className="block text-xs uppercase font-extrabold tracking-wider text-slate-800 dark:text-accent border-b border-border/40 pb-1.5">
                  Share your impressions
                </span>

                {/* Advantages */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Advantages</label>
                  <textarea
                    rows={2}
                    value={reviewForm.advantages}
                    onChange={(e) => setReviewForm({ ...reviewForm, advantages: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-medium"
                    placeholder="Type your review here..."
                  />
                </div>

                {/* Disadvantages */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Disadvantages</label>
                  <textarea
                    rows={2}
                    value={reviewForm.disadvantages}
                    onChange={(e) => setReviewForm({ ...reviewForm, disadvantages: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-medium"
                    placeholder="Type your review here..."
                  />
                </div>

                {/* Time of stay dropdowns */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Time of stay</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={reviewForm.month}
                      onChange={(e) => setReviewForm({ ...reviewForm, month: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-medium"
                    >
                      <option value="Month">Month</option>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={reviewForm.year}
                      onChange={(e) => setReviewForm({ ...reviewForm, year: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-medium"
                    >
                      <option value="Year">Year</option>
                      {['2026', '2025', '2024'].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rating Points (1-10) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Your rating point</label>
                  <div className="grid grid-cols-10 border border-border/80 rounded-lg overflow-hidden divide-x divide-border">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((point) => (
                      <button
                        key={point}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: point })}
                        className={`py-2 text-center text-xs font-bold transition-all cursor-pointer ${
                          reviewForm.rating === point
                            ? 'bg-slate-800 text-white font-black'
                            : 'bg-white hover:bg-secondary text-muted-foreground hover:text-foreground dark:bg-card'
                        }`}
                      >
                        {point}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-extrabold uppercase text-muted-foreground px-0.5">
                    <span>Awful</span>
                    <span>Awesome</span>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4 pt-3 border-t border-border">
                <span className="block text-xs uppercase font-extrabold tracking-wider text-slate-800 dark:text-accent border-b border-border/40 pb-1.5">
                  Please enter your details
                </span>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Name</label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder="Name"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Email</label>
                  <input
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                    placeholder="Email"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">Where are you from?</label>
                  <input
                    type="text"
                    value={reviewForm.country}
                    onChange={(e) => setReviewForm({ ...reviewForm, country: e.target.value })}
                    placeholder="Country"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white dark:bg-secondary text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 font-semibold"
                  />
                </div>
              </div>

              {/* Send Pill Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="w-1/2 text-center bg-[#4bd395] hover:bg-[#3dbf83] text-white font-bold py-3 rounded-full text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                >
                  SEND
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faqs" className="relative py-24 sm:py-32 bg-secondary/20 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-accent">Questions</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-2 text-foreground">Frequently Asked Questions</h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4"></div>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="glass-card rounded-xl overflow-hidden border border-border/40"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-secondary/40 transition-colors"
                >
                  <span className="font-serif text-lg font-medium text-foreground flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${activeFaq === idx ? 'rotate-90 text-accent' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border/40 bg-secondary/10"
                    >
                      <p className="p-6 text-sm text-muted-foreground leading-relaxed pl-14">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Luxury Footer */}
      <footer className="relative bg-primary text-primary-foreground border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                <Key className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent">
                  Saveetha
                </span>
                <p className="text-[10px] tracking-widest text-accent -mt-1 uppercase font-bold">GuestHouse Booking</p>
              </div>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              Saveetha University's premier academic residency and luxury guest suites. Experience the perfect blend of modern comfort and classic academic prestige.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif text-lg text-white font-semibold mb-6">Explore</h4>
            <div className="flex flex-col gap-3 text-xs text-white/60">
              <a href="#hero" className="hover:text-accent transition-colors">Home</a>
              <a href="#rooms-catalog" className="hover:text-accent transition-colors">Rooms & Accommodations</a>
              <a href="#gallery" className="hover:text-accent transition-colors">Gallery Showcase</a>
              <a href="#amenities" className="hover:text-accent transition-colors">Premium Facilities</a>
              <a href="#reviews" className="hover:text-accent transition-colors">Guest Experiences</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg text-white font-semibold mb-6">Contact Us</h4>
            <div className="flex flex-col gap-4 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Saveetha University Campus, Chennai, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <span>+91 98765 00000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <span>guesthouse@saveetha.edu</span>
              </div>
            </div>
          </div>

          {/* Dev info */}
          <div>
            <h4 className="font-serif text-lg text-white font-semibold mb-6">Portal Access</h4>
            <p className="text-white/60 text-xs mb-4">
              Authorized admin access or customer booking tracking portal.
            </p>
            <a
              href="http://127.0.0.1:5000/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent/80"
            >
              Developer Console UI
              <ArrowRight className="w-4.5 h-4.5" />
            </a>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-8 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} Saveetha GuestHouse Booking. All rights reserved.</p>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 md:p-8 cursor-zoom-out"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4 w-full" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="font-serif text-lg font-bold">Saveetha Gallery Showcase</h3>
              <p className="text-xs text-slate-400">Photo {lightboxIndex + 1} of {GALLERY_IMAGES.length}</p>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Image display with navigation arrows */}
          <div className="flex-1 flex items-center justify-between relative my-4 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : 0));
              }}
              className="absolute left-2 md:left-4 z-10 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-sm transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={GALLERY_IMAGES[lightboxIndex]}
                alt={`Zoomed Photo ${lightboxIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/5"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_IMAGES.length : 0));
              }}
              className="absolute right-2 md:right-4 z-10 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 backdrop-blur-sm transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer slide indicators */}
          <div className="text-center text-slate-400 text-xs py-2 w-full" onClick={(e) => e.stopPropagation()}>
            Use Arrow Keys Left/Right to Navigate • Esc to Close
          </div>
        </div>
      )}
    </div>
  );
}
