import { useState, useEffect } from 'react';
import { Booking } from '../types';
import { bookingApi } from '../services/api';
import { toast } from 'sonner';

export function useBookingsViewModel(
  currentUserId?: string,
  currentUserRole?: 'admin' | 'staff' | 'customer',
  onRoomsRefresh?: () => void
) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    if (!currentUserId || !currentUserRole) return;
    setLoading(true);
    try {
      // If customer, only get their bookings. If admin/staff, get all bookings.
      const customerId = currentUserRole === 'customer' ? currentUserId : undefined;
      const data = await bookingApi.getAll(customerId);
      setBookings(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to retrieve reservation details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUserId || !currentUserRole) return;
    fetchBookings();
    
    // Set up short polling for real-time bookings updates (every 3 seconds)
    const interval = setInterval(fetchBookings, 3000);
    return () => clearInterval(interval);
  }, [currentUserId, currentUserRole]);

  const handleBookingSubmit = async (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'bookedBy'>
  ) => {
    const userId = currentUserId || undefined;
    try {
      const newBooking = await bookingApi.create({
        ...bookingData,
        bookedBy: userId,
        status: 'pending'
      });
      
      setBookings(prev => [newBooking, ...prev]);
      
      toast.success('Booking confirmed successfully!', {
        description: `Room booked for ${bookingData.guestName}`
      });

      // Reload room list to reflect room status changes immediately
      if (onRoomsRefresh) {
        onRoomsRefresh();
      }
    } catch (err: any) {
      toast.error('Failed to place reservation', {
        description: err.message || 'An unexpected error occurred.'
      });
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      const updated = await bookingApi.cancel(id);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      toast.success('Booking cancelled successfully!');
      
      if (onRoomsRefresh) {
        onRoomsRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel reservation.');
    }
  };

  const handleCompleteBooking = async (id: string) => {
    try {
      const updated = await bookingApi.complete(id);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      toast.success('Booking marked as completed!');
      
      if (onRoomsRefresh) {
        onRoomsRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete reservation.');
    }
  };

  const handleConfirmBooking = async (id: string, roomId?: string) => {
    try {
      const updated = await bookingApi.confirm(id, roomId);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      toast.success('Booking approved and confirmed successfully!', {
        description: `📩 Confirmation email sent to ${updated.guestEmail} and 💬 SMS notification sent to ${updated.guestPhone}`
      });
      
      if (onRoomsRefresh) {
        onRoomsRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to confirm reservation.');
    }
  };

  return {
    bookings,
    loading,
    refreshBookings: fetchBookings,
    handleBookingSubmit,
    handleCancelBooking,
    handleCompleteBooking,
    handleConfirmBooking
  };
}
