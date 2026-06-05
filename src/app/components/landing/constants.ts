import { Wifi, Coffee, Tv, Shield } from 'lucide-react';

export interface GuestReview {
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

export const INITIAL_REVIEWS: GuestReview[] = [
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
    reviewerName: 'Dr. James Anderson',
    reviewerCountry: '🇬🇧',
    date: '28 May 2026',
    advantages: 'The hospitality of the guest house staff was incredible. The environment is perfect for academic work with completely silent zones and fast Wi-Fi.',
    disadvantages: 'Breakfast options could be slightly more diverse.'
  },
  {
    id: 'rev4',
    source: 'our',
    rating: 9,
    ratingText: 'Wonderful',
    reviewerName: 'Sarah Jenkins',
    reviewerCountry: '🇺🇸',
    date: '25 May 2026',
    advantages: 'Very close to Saveetha Dental College, which was ideal for my conference. Clean rooms and helpful concierge desk.',
    disadvantages: 'The water pressure was a bit low on the third floor during peak hours.'
  },
  {
    id: 'rev5',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Prof. Ramachandran',
    reviewerCountry: '🇮🇳',
    date: '22 May 2026',
    advantages: 'Excellent campus residency! Having dynamic meal plan rates and check-in without registration hassle was a breeze.',
    disadvantages: 'None'
  },
  {
    id: 'rev6',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Hiroshi Tanaka',
    reviewerCountry: '🇯🇵',
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

export const GALLERY_IMAGES = [
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

export const ALL_FACILITIES = [
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

export const HERO_SLIDES = [
  {
    image: '/images/WhatsApp Image 2026-06-04 at 3.41.09 PM.jpeg',
    title: 'Saveetha GuestHouse',
    subtitle: 'Luxury Guest House & Serviced Rooms',
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

export const AMENITIES = [
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

export const FAQS = [
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

export const ROOM_IMAGE_MAP: Record<string, string> = {
  '101': '/images/WhatsApp Image 2026-06-04 at 3.41.02 PM.jpeg',
  '102': '/images/WhatsApp Image 2026-06-04 at 3.41.03 PM.jpeg',
  '103': '/images/WhatsApp Image 2026-06-04 at 3.41.04 PM.jpeg',
  '201': '/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg',
  '202': '/images/WhatsApp Image 2026-06-04 at 3.41.07 PM.jpeg',
  '203': '/images/WhatsApp Image 2026-06-04 at 3.41.08 PM.jpeg',
  '301': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM (1).jpeg',
  '302': '/images/WhatsApp Image 2026-06-04 at 3.41.12 PM.jpeg',
};

export const getPriceDetails = (roomType: string, guests: number, mealPlan: string, extraBed: boolean) => {
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
