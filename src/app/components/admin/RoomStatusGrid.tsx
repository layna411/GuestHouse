import React, { useState, useEffect } from 'react';
import { BedDouble, Users, Calendar, Info, ShieldAlert, Plus, CreditCard, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Room, Booking } from '../../types';
import { roomApi, bookingApi } from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface RoomStatusGridProps {
  rooms: Room[];
  bookings: Booking[];
  onRefreshRooms: () => void;
  onRefreshBookings: () => void;
  role?: string;
  currentUser?: any;
}

export function RoomStatusGrid({ 
  rooms, 
  bookings, 
  onRefreshRooms, 
  onRefreshBookings, 
  role,
  currentUser
}: RoomStatusGridProps) {
  const [selectedType, setSelectedType] = useState<'Deluxe Room' | 'Super Deluxe Room'>('Deluxe Room');
  const [activeMenuRoomId, setActiveMenuRoomId] = useState<string | null>(null);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  
  // Reservation Modal state
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    checkIn: format(new Date(), "yyyy-MM-dd'T'14:00"),
    checkOut: format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'11:00"),
    numberOfGuests: 2,
    purpose: 'Academic visit',
    paymentType: 'Direct'
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter rooms by category
  const filteredRooms = rooms
    .filter(r => r.type === selectedType)
    .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));

  // Determine status color codes
  const getStatusStyle = (status: Room['status']) => {
    switch (status) {
      case 'booked':
        return {
          bg: 'bg-blue-600/90 border-blue-500 text-white hover:bg-blue-600 shadow-blue-500/20',
          dot: 'bg-white',
          label: 'Occupied'
        };
      case 'vacant':
        return {
          bg: 'bg-emerald-600/90 border-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20',
          dot: 'bg-white',
          label: 'Vacant'
        };
      case 'dirty':
        return {
          bg: 'bg-amber-500/90 border-amber-400 text-white hover:bg-amber-500 shadow-amber-500/20',
          dot: 'bg-white',
          label: 'Dirty'
        };
      case 'maintenance':
        return {
          bg: 'bg-rose-600/90 border-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20',
          dot: 'bg-white',
          label: 'Out of Service'
        };
      default:
        return {
          bg: 'bg-muted border-border text-muted-foreground hover:bg-muted/80',
          dot: 'bg-muted-foreground',
          label: 'Unknown'
        };
    }
  };

  const isStaff = role === 'staff';

  // Context Actions
  const handleStatusChange = async (room: Room, newStatus: Room['status']) => {
    setActiveMenuRoomId(null);
    if (!isStaff) {
      toast.error('Only staff can edit room status details.');
      return;
    }

    try {
      const updatedRoom = { ...room, status: newStatus };
      await roomApi.update(updatedRoom);
      toast.success(`Room ${room.roomNumber} is now marked as ${newStatus === 'maintenance' ? 'Out of Service' : newStatus}.`);
      onRefreshRooms();
    } catch (err: any) {
      toast.error(err.message || 'Failed to change room status.');
    }
  };

  const handleCreateReservationClick = (room: Room) => {
    setActiveMenuRoomId(null);
    if (!isStaff) {
      toast.error('Only staff can register new reservations.');
      return;
    }
    setBookingRoom(room);
    setBookingForm({
      guestName: '',
      guestPhone: '',
      guestEmail: '',
      checkIn: format(new Date(), "yyyy-MM-dd'T'14:00"),
      checkOut: format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'11:00"),
      numberOfGuests: room.capacity || 2,
      purpose: 'Guest stay',
      paymentType: 'Direct'
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRoom) return;

    setSubmitting(true);
    try {
      const payload = {
        roomId: bookingRoom.id,
        guestName: bookingForm.guestName,
        guestPhone: bookingForm.guestPhone,
        guestEmail: bookingForm.guestEmail,
        checkIn: new Date(bookingForm.checkIn),
        checkOut: new Date(bookingForm.checkOut),
        numberOfGuests: Number(bookingForm.numberOfGuests),
        purpose: bookingForm.purpose,
        bookedBy: currentUser?.id || 'admin001',
        paymentType: bookingForm.paymentType,
        mealPlan: 'Room without Breakfast',
        pricePerNight: bookingRoom.price,
        totalPrice: bookingRoom.price * Math.ceil((new Date(bookingForm.checkOut).getTime() - new Date(bookingForm.checkIn).getTime()) / (1000 * 60 * 60 * 24))
      };

      await bookingApi.create(payload as any);
      toast.success(`Booking successfully registered for Room ${bookingRoom.roomNumber}!`);
      
      setBookingRoom(null);
      onRefreshRooms();
      onRefreshBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to place reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuRoomId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const stats = {
    total: filteredRooms.length,
    vacant: filteredRooms.filter(r => r.status === 'vacant').length,
    booked: filteredRooms.filter(r => r.status === 'booked').length,
    dirty: filteredRooms.filter(r => r.status === 'dirty').length,
    maintenance: filteredRooms.filter(r => r.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Room Booking & Room Status</h1>
          <p className="text-muted-foreground">PMS-style visual room grid. Inspect occupancy statuses, manage cleanliness, and register stays directly.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="h-[42px] px-4 rounded-lg border border-border bg-card/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring font-bold shadow-lg bg-slate-900 text-white dark:bg-slate-950"
          >
            <option value="Deluxe Room" className="bg-slate-900 text-white">Deluxe Room (12 Rooms)</option>
            <option value="Super Deluxe Room" className="bg-slate-900 text-white">Super Deluxe Room (6 Rooms)</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => { onRefreshRooms(); onRefreshBookings(); }} className="h-[42px] px-3">
            <RefreshCw className="w-4 h-4 mr-1" />
            Reload
          </Button>
        </div>
      </div>

      {!isStaff && (
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-center gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <strong className="text-foreground">Administrator View Only:</strong> You are logged in with Admin rights. You can view guest tooltips, but status changes and inline bookings are reserved for Staff roles.
          </div>
        </div>
      )}

      {/* Stats Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card glass>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-card/60 flex items-center justify-center border border-border/40">
              <BedDouble className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Rooms</p>
              <h4 className="text-lg font-bold text-foreground">{stats.total}</h4>
            </div>
          </CardContent>
        </Card>
        <Card glass className="border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Vacant</p>
              <h4 className="text-lg font-bold text-emerald-400">{stats.vacant}</h4>
            </div>
          </CardContent>
        </Card>
        <Card glass className="border-blue-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Occupied</p>
              <h4 className="text-lg font-bold text-blue-400">{stats.booked}</h4>
            </div>
          </CardContent>
        </Card>
        <Card glass className="border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Dirty</p>
              <h4 className="text-lg font-bold text-amber-400">{stats.dirty}</h4>
            </div>
          </CardContent>
        </Card>
        <Card glass className="border-rose-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">O.O.S</p>
              <h4 className="text-lg font-bold text-rose-400">{stats.maintenance}</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid View */}
      <Card glass>
        <CardHeader>
          <CardTitle>Saveetha Room Status Console ({selectedType})</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredRooms.map((room) => {
              const displayStyle = getStatusStyle(room.status);
              const hasBooking = room.status === 'booked' && room.currentBooking;
              
              return (
                <div 
                  key={room.id}
                  className="relative"
                  onMouseEnter={() => setHoveredRoomId(room.id)}
                  onMouseLeave={() => setHoveredRoomId(null)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuRoomId(activeMenuRoomId === room.id ? null : room.id);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveMenuRoomId(activeMenuRoomId === room.id ? null : room.id);
                    }}
                    className={`
                      w-full aspect-square rounded-2xl border-2 p-4 flex flex-col justify-between text-left transition-all duration-300 shadow-lg cursor-pointer select-none
                      ${displayStyle.bg}
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-serif text-lg font-black tracking-wide">Room {room.roomNumber}</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${displayStyle.dot}`} />
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">Status</p>
                      <p className="text-xs font-bold text-white leading-tight">{displayStyle.label}</p>
                    </div>
                  </button>

                  {/* Context Action Menu */}
                  {activeMenuRoomId === room.id && (
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-card border border-border/80 rounded-xl shadow-2xl p-2 z-40 backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-3 py-1.5 border-b border-border/40 mb-1">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Room {room.roomNumber} Actions</p>
                      </div>
                      
                      {isStaff && room.status !== 'booked' && (
                        <button
                          onClick={() => handleCreateReservationClick(room)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-accent hover:bg-muted/80 text-left transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Create Reservation
                        </button>
                      )}
                      
                      {isStaff && (
                        <>
                          <button
                            onClick={() => handleStatusChange(room, 'vacant')}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-muted/80 text-left transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            Vacant (Clean)
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(room, 'dirty')}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-amber-400 hover:bg-muted/80 text-left transition-colors cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5 text-amber-500" />
                            Dirty
                          </button>

                          <button
                            onClick={() => handleStatusChange(room, 'vacant')}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-teal-400 hover:bg-muted/80 text-left transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                            Cleaned (Vacant)
                          </button>
                          
                          <button
                            onClick={() => handleStatusChange(room, 'maintenance')}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-muted/80 text-left transition-colors cursor-pointer"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                            Out of Service
                          </button>
                        </>
                      )}
                      
                      {!isStaff && (
                        <div className="px-3 py-2 text-[10px] text-muted-foreground italic text-center">
                          Admin View Only
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hover Guest Details Tooltip */}
                  {hoveredRoomId === room.id && hasBooking && (
                    <div 
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-900/95 border border-white/10 rounded-2xl p-4 shadow-2xl z-50 pointer-events-none text-white text-xs space-y-2.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                        <Users className="w-4 h-4 text-accent" />
                        <span className="font-bold text-sm">Guest Details - Room {room.roomNumber}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-white/60">Guest Name:</span>
                          <span className="font-semibold text-white">{room.currentBooking?.guestName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Check-in:</span>
                          <span className="font-mono text-[10px]">{room.currentBooking ? format(new Date(room.currentBooking.checkIn), 'MMM dd, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Check-out:</span>
                          <span className="font-mono text-[10px]">{room.currentBooking ? format(new Date(room.currentBooking.checkOut), 'MMM dd, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Payment Type:</span>
                          <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-bold text-[9px] uppercase border border-accent/20">
                            {room.currentBooking?.paymentType || 'Direct'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reservation Dialog Modal */}
      {bookingRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card glass className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create Reservation - Room {bookingRoom.roomNumber}</CardTitle>
                <button 
                  onClick={() => setBookingRoom(null)} 
                  className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5 rotate-45 text-foreground" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <Input
                  label="Guest Name"
                  placeholder="Dr. Rajesh Kumar"
                  value={bookingForm.guestName}
                  onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="+91 98765 43210"
                    type="tel"
                    value={bookingForm.guestPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, guestPhone: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    placeholder="rajesh.kumar@email.com"
                    type="email"
                    value={bookingForm.guestEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, guestEmail: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Check-in</label>
                    <input
                      type="datetime-local"
                      value={bookingForm.checkIn}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })}
                      className="glass-input w-full px-4 py-2.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Check-out</label>
                    <input
                      type="datetime-local"
                      value={bookingForm.checkOut}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })}
                      className="glass-input w-full px-4 py-2.5 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Guests Count</label>
                    <input
                      type="number"
                      min="1"
                      max={bookingRoom.capacity || 4}
                      value={bookingForm.numberOfGuests}
                      onChange={(e) => setBookingForm({ ...bookingForm, numberOfGuests: Number(e.target.value) })}
                      className="glass-input w-full px-4 py-2.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Type</label>
                    <select
                      value={bookingForm.paymentType}
                      onChange={(e) => setBookingForm({ ...bookingForm, paymentType: e.target.value })}
                      className="glass-input w-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-input-background"
                    >
                      <option value="Direct">Direct Payment</option>
                      <option value="Department">Department Billing</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Purpose of Visit"
                  placeholder="Conference Speaker / Guest Lecture"
                  value={bookingForm.purpose}
                  onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                  required
                />

                <div className="flex gap-3 pt-4 border-t border-border/40">
                  <Button type="button" variant="outline" onClick={() => setBookingRoom(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 font-bold flex items-center justify-center gap-1.5" disabled={submitting}>
                    <CreditCard className="w-4 h-4" />
                    {submitting ? 'Creating...' : 'Register stay'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
