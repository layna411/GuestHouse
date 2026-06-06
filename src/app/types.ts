export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: string;
  capacity: number;
  price: number;
  status: 'vacant' | 'booked' | 'maintenance' | 'dirty';
  amenities: string[];
  imageUrl?: string;
  currentBooking?: {
    guestName: string;
    checkIn: string;
    checkOut: string;
    paymentType: string;
  } | null;
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  purpose: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookedBy: string;
  createdAt: Date;
  mealPlan?: string;
  pricePerNight?: number;
  totalPrice?: number;
  paymentType?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  department?: string;
  phone?: string;
  is_active?: boolean;
}

export type UserRole = 'admin' | 'staff';

export interface Notification {
  id: number;
  bookingId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface RoomAvailability {
  id?: number;
  roomType: string;
  date: string;
  availableCount: number;
}

export interface GalleryImage {
  id: number;
  imageUrl: string;
  caption?: string;
}

