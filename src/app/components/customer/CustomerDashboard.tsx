import React, { useState } from 'react';
import { Search, Calendar, BedDouble, Plus, ShieldAlert, CheckCircle2, User, ChevronRight, LayoutDashboard, Settings as SettingsIcon, X, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { StatusChip } from '../StatusChip';
import { Room, Booking } from '../../types';
import { format } from 'date-fns';

interface CustomerDashboardProps {
  rooms: Room[];
  bookings: Booking[];
  currentUserId: string;
  onBookRoom: (roomId: string) => void;
  onTabChange?: (tab: string) => void;
  view?: 'dashboard' | 'availability';
}

export function CustomerDashboard({ 
  rooms, 
  bookings, 
  currentUserId,
  onBookRoom, 
  onTabChange,
  view = 'dashboard' 
}: CustomerDashboardProps) {
  // Filters for Room Availability View
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'AC' | 'Non-AC'>('All');
  const [floorFilter, setFloorFilter] = useState<'All' | '1' | '2' | '3'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'vacant' | 'booked' | 'maintenance'>('All');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Search for Customer Bookings
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');

  // 1. Filter bookings to only show those placed by the logged-in customer
  const customerBookings = bookings.filter(b => b.bookedBy === currentUserId);

  // 2. Calculate Stats
  const vacantRooms = rooms.filter(r => r.status === 'vacant');
  const activeBookings = customerBookings.filter(b => b.status === 'confirmed');
  const pendingBookings = customerBookings.filter(b => b.status === 'pending');

  const todaysCheckins = customerBookings.filter(b => {
    const today = new Date();
    return b.status === 'confirmed' && 
      b.checkIn.getDate() === today.getDate() &&
      b.checkIn.getMonth() === today.getMonth() &&
      b.checkIn.getFullYear() === today.getFullYear();
  });

  // 3. Filter Rooms for Availability
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'All' ? true : room.type === typeFilter;
    const matchesFloor = floorFilter === 'All' ? true : room.floor.toString() === floorFilter;
    const matchesStatus = statusFilter === 'All' ? true : room.status === statusFilter;

    return matchesSearch && matchesType && matchesFloor && matchesStatus;
  });

  const getActiveBookingForRoom = (roomId: string) => {
    return bookings.find(b => b.roomId === roomId && (b.status === 'confirmed' || b.status === 'pending'));
  };

  // Filter dashboard bookings search
  const filteredDashboardBookings = customerBookings
    .filter(booking => 
      booking.guestName.toLowerCase().includes(dashboardSearchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(dashboardSearchQuery.toLowerCase())
    )
    .slice(0, 5);

  if (view === 'dashboard') {
    return (
      <div className="space-y-6">
        
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 md:p-8 text-primary-foreground shadow-lg">
          <div className="relative z-10 space-y-2">
            <span className="px-3 py-1 bg-white/15 text-xs font-semibold rounded-full uppercase tracking-wider backdrop-blur-sm">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl font-extrabold md:text-4xl">My Booking Workspace</h1>
            <p className="text-primary-foreground/80 max-w-xl text-sm md:text-base">
              Check real-time room availability, review your booking requests, and manage active reservations at Somerset Greenways.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4 translate-x-1/4">
            <LayoutDashboard className="w-64 h-64" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            glass 
            hoverable 
            onClick={() => onTabChange?.('availability')} 
            className="border-success/20 hover:border-success/40 group transition-all"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Available Rooms</p>
                <h3 className="text-4xl font-black text-success group-hover:scale-105 transition-transform origin-left">
                  {vacantRooms.length}
                </h3>
                <p className="text-xs text-muted-foreground">Ready for booking</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-success/15 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <BedDouble className="w-7 h-7 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card 
            glass 
            hoverable 
            onClick={() => onTabChange?.('bookings')} 
            className="border-primary/20 hover:border-primary/40 group transition-all"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">My Active Bookings</p>
                <h3 className="text-4xl font-black text-primary group-hover:scale-105 transition-transform origin-left">
                  {activeBookings.length}
                </h3>
                <p className="text-xs text-muted-foreground">Confirmed reservations</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card 
            glass 
            className="border-accent/20 group"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <h3 className="text-4xl font-black text-accent group-hover:scale-105 transition-transform origin-left">
                  {pendingBookings.length}
                </h3>
                <p className="text-xs text-muted-foreground">Awaiting admin review</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Split Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings List */}
          <Card glass className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold">My Recent Reservations</CardTitle>
                <p className="text-xs text-muted-foreground">List of your latest booking activities</p>
              </div>
              <div className="w-48 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by ID/Name..."
                  value={dashboardSearchQuery}
                  onChange={(e) => setDashboardSearchQuery(e.target.value)}
                  className="pl-8 py-1 h-8 text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {filteredDashboardBookings.map((booking) => {
                  const room = rooms.find(r => r.id === booking.roomId);
                  return (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl border border-border bg-card/45 hover:bg-card/75 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground">{booking.guestName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                            {booking.id}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Room <strong className="text-foreground">{room?.roomNumber || 'N/A'} ({room?.type})</strong> • Floor {room?.floor}
                        </p>
                        <div className="flex gap-4 text-[11px] text-muted-foreground pt-1">
                          <div>
                            <span className="font-medium text-foreground">In:</span> {format(booking.checkIn, 'MMM dd, yyyy')}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Out:</span> {format(booking.checkOut, 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-2 md:pt-0">
                        <StatusChip status={booking.status} size="sm" />
                      </div>
                    </div>
                  );
                })}

                {filteredDashboardBookings.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">No bookings found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <Card glass className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
              <p className="text-xs text-muted-foreground">Shortcuts to manage guest services</p>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col justify-center">
              <Button 
                variant="primary" 
                className="w-full flex items-center justify-between group p-4 py-5 rounded-xl text-left bg-primary hover:bg-primary/95"
                onClick={() => onTabChange?.('availability')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <BedDouble className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold block text-white">Book a Room</span>
                    <span className="text-[10px] text-primary-foreground/80 block">Check availability & request booking</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform text-white" />
              </Button>

              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-between group p-4 py-5 rounded-xl text-left"
                onClick={() => onTabChange?.('bookings')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/15 rounded-lg">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="font-bold block text-foreground">View My Bookings</span>
                    <span className="text-[10px] text-muted-foreground block">View details of past and active stays</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full flex items-center justify-between group p-4 py-5 rounded-xl text-left"
                onClick={() => onTabChange?.('settings')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <SettingsIcon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <span className="font-bold block text-foreground">Account Settings</span>
                    <span className="text-[10px] text-muted-foreground block">Change password or update profile</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ROOM AVAILABILITY VIEW
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-foreground mb-1">Room Availability</h1>
        <p className="text-sm text-muted-foreground">Browse all guest house rooms, check real-time status, and make booking requests.</p>
      </div>

      {/* Filter Control Panel */}
      <Card glass className="p-4 border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search room, amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Room Types</option>
              <option value="AC">AC Rooms</option>
              <option value="Non-AC">Non-AC Rooms</option>
            </select>
          </div>

          <div>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value as any)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Floors</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Statuses</option>
              <option value="vacant">Vacant</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const isVacant = room.status === 'vacant';
          const isBooked = room.status === 'booked';
          const isMaintenance = room.status === 'maintenance';
          
          const borderStyle = isVacant 
            ? 'hover:border-success/40 border-l-4 border-l-success'
            : isBooked
              ? 'hover:border-primary/40 border-l-4 border-l-primary'
              : 'hover:border-warning/40 border-l-4 border-l-warning';

          return (
            <Card key={room.id} glass hoverable className={`${borderStyle} overflow-hidden flex flex-col h-full`}>
              <div className="relative aspect-video overflow-hidden bg-slate-950 group cursor-zoom-in">
                {(() => {
                  const imageSrc = room.type.toLowerCase().includes('super')
                    ? '/images/WhatsApp Image 2026-06-04 at 3.41.10 PM (1).jpeg'
                    : '/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg';
                  return (
                    <img
                      src={imageSrc}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setZoomedImage(imageSrc)}
                    />
                  );
                })()}
                <div className="absolute top-3 right-3 z-10">
                  <StatusChip status={room.status} size="sm" />
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Room {room.roomNumber}</h3>
                      <p className="text-xs text-muted-foreground">Floor {room.floor} • Capacity: {room.capacity} Guests</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-sm border-t border-border/40 pt-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Type:</span>
                      <span className="font-semibold text-foreground text-xs">{room.type} Class</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Rate:</span>
                      <span className="font-bold text-accent text-xs">₹{room.price}/night</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-muted/65 text-[10px] rounded-md text-foreground font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40">
                  {isVacant && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={() => onBookRoom(room.id)}
                    >
                      <Plus className="w-4 h-4" />
                      Request Booking
                    </Button>
                  )}

                  {isBooked && (
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                        <User className="w-3.5 h-3.5" />
                        <span>Room Occupied</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Currently occupied. You can search other rooms or dates on the home page.</p>
                    </div>
                  )}

                  {isMaintenance && (
                    <div className="bg-warning/5 p-3 rounded-lg border border-warning/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-warning font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Under Maintenance</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Temporarily out of service for guest bookings.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <Card glass className="p-8 text-center border-dashed">
          <p className="text-muted-foreground text-sm">No rooms match your filter criteria.</p>
        </Card>
      )}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-4xl max-h-[85vh] p-2 relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomedImage}
              alt="Zoomed Room Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
            <p className="text-center text-xs text-slate-400 mt-4 font-mono">{zoomedImage.split('/').pop()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
