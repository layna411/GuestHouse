import { Wifi, Coffee, Tv, Shield } from 'lucide-react';

export interface GuestReview {
  id: string;
  source: 'booking' | 'our';
  rating: number;
  ratingText: string;
  reviewerName: string;
  reviewerCountry: string;
  date: string;
  comments: string;
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
    comments: 'Peaceful'
  },
  {
    id: 'rev2',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Vicent',
    reviewerCountry: '🇲🇾',
    date: '2 June 2026',
    comments: 'Good'
  },
  {
    id: 'rev3',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Dr. James Anderson',
    reviewerCountry: '🇬🇧',
    date: '28 May 2026',
    comments: 'The hospitality of the guest house staff was incredible. The environment is perfect for academic work with completely silent zones and fast Wi-Fi. (Disadvantages: Breakfast options could be slightly more diverse.)'
  },
  {
    id: 'rev4',
    source: 'our',
    rating: 9,
    ratingText: 'Wonderful',
    reviewerName: 'Sarah Jenkins',
    reviewerCountry: '🇺🇸',
    date: '25 May 2026',
    comments: 'Very close to Saveetha Dental College, which was ideal for my conference. Clean rooms and helpful concierge desk. (Disadvantages: The water pressure was a bit low on the third floor during peak hours.)'
  },
  {
    id: 'rev5',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Prof. Ramachandran',
    reviewerCountry: '🇮🇳',
    date: '22 May 2026',
    comments: 'Excellent campus residency! Having dynamic meal plan rates and check-in without registration hassle was a breeze.'
  },
  {
    id: 'rev6',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Hiroshi Tanaka',
    reviewerCountry: '🇯🇵',
    date: '20 May 2026',
    comments: 'The stay was absolutely spectacular. The rooms have a premium aesthetic and excellent workspaces.'
  },
  {
    id: 'rev7',
    source: 'our',
    rating: 10,
    ratingText: 'Exceptional',
    reviewerName: 'Prof. Anita Sharma',
    reviewerCountry: '🇮🇳',
    date: '19 May 2026',
    comments: 'Clean, quiet, and fully equipped workspaces. Exceeded expectations.'
  }
];

export const GALLERY_IMAGES = [
  '/images/lobby_entrance.jpeg',
  '/images/premium_lounge.jpeg',
  '/images/facade.jpeg',
  '/images/exterior_night.jpeg',
  '/images/swimming_pool.jpeg',
  '/images/lobby_view.jpeg',
  '/images/dining_hall.jpeg',
  '/images/room_suite.jpeg',
  '/images/bed_detail.jpeg',
  '/images/bathroom.jpeg',
  '/images/deluxe_room.jpeg',
  '/images/room_corner.jpeg',
  '/images/conference_room.jpeg',
  '/images/gym.jpeg',
  '/images/super_deluxe_room.jpeg',
  '/images/lounge_sitting.jpeg',
  '/images/suite_balcony.jpeg',
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
    image: '/images/lobby_entrance.jpeg',
    title: 'Saveetha GuestHouse',
    subtitle: 'Luxury Guest House & Serviced Rooms',
    description: 'Experience unmatched sophistication, premium comfort, and exemplary hospitality in the heart of Chennai.'
  },
  {
    image: '/images/premium_lounge.jpeg',
    title: 'Exquisite Lounges',
    subtitle: 'Relax and Connect in Elegance',
    description: 'Indulge in our beautifully designed social spaces, perfect for hosting distinguished guests and colleagues.'
  },
  {
    image: '/images/swimming_pool.jpeg',
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

export const getRoomImage = (roomType: string): string => {
  if (roomType.toLowerCase().includes('super')) {
    return '/images/super_deluxe_room.jpeg';
  }
  return '/images/deluxe_room.jpeg';
};

export const ROOM_IMAGE_MAP: Record<string, string> = {
  '101': '/images/deluxe_room.jpeg',
  '102': '/images/deluxe_room.jpeg',
  '103': '/images/deluxe_room.jpeg',
  '201': '/images/deluxe_room.jpeg',
  '202': '/images/deluxe_room.jpeg',
  '203': '/images/deluxe_room.jpeg',
  '301': '/images/super_deluxe_room.jpeg',
  '302': '/images/super_deluxe_room.jpeg',
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
