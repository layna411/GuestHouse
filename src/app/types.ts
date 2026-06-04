export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: 'AC' | 'Non-AC';
  capacity: number;
  price: number;
  status: 'vacant' | 'booked' | 'maintenance';
  amenities: string[];
  imageUrl?: string;
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  department?: string;
  phone?: string;
}

export type UserRole = 'admin' | 'employee';
