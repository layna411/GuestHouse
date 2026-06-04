import React, { useState } from 'react';
import { Search, Calendar, BedDouble, Plus, ShieldAlert, CheckCircle2, User, ChevronRight, LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { StatusChip } from '../StatusChip';
import { Room, Booking } from '../../types';
import { format } from 'date-fns';

interface EmployeeDashboardProps {
  rooms: Room[];
  bookings: Booking[];
  onBookRoom: (roomId: string) => void;
  onTabChange?: (tab: string) => void;
  view?: 'dashboard' | 'availability';
}

export function EmployeeDashboard({ 
  rooms, 
  bookings, 
  onBookRoom, 
  onTabChange,
  view = 'dashboard' 
}: EmployeeDashboardProps) {
  // Filters for Room Availability View
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'AC' | 'Non-AC'>('All');
  const [floorFilter, setFloorFilter] = useState<'All' | '1' | '2' | '3'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'vacant' | 'booked' | 'maintenance'>('All');

  // Search for Recent Bookings in Dashboard View
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');

  // 1. Calculate Occupancy Stats & Rates
  const vacantRooms = rooms.filter(r => r.status === 'vacant');
  const bookedRooms = rooms.filter(r => r.status === 'booked');
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance');
  
  const totalRoomsCount = rooms.length || 1;
  const vacantPercentage = Math.round((vacantRooms.length / totalRoomsCount) * 100);
  const bookedPercentage = Math.round((bookedRooms.length / totalRoomsCount) * 100);
  const maintenancePercentage = Math.round((maintenanceRooms.length / totalRoomsCount) * 100);

  // 2. Identify Today's Check-ins
  const isTodayDate = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const todaysCheckins = bookings.filter(b => b.status === 'confirmed' && isTodayDate(b.checkIn));
  const todaysCheckinsCount = todaysCheckins.length;

  // 3. Filter Rooms for the Room Availability View
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

  // 4. Find the current booking for a booked room
  const getActiveBookingForRoom = (roomId: string) => {
    return bookings.find(b => b.roomId === roomId && (b.status === 'confirmed' || b.status === 'pending'));
  };

  // 5. Filter recent bookings list for dashboard
  const filteredDashboardBookings = bookings
    .filter(booking => 
      booking.guestName.toLowerCase().includes(dashboardSearchQuery.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(dashboardSearchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(dashboardSearchQuery.toLowerCase())
    )
    .slice(0, 5);

  // DASHBOARD VIEW
  if (view === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 md:p-8 text-primary-foreground shadow-lg">
          <div className="relative z-10 space-y-2">
            <span className="px-3 py-1 bg-white/15 text-xs font-semibold rounded-full uppercase tracking-wider backdrop-blur-sm">
              Employee Portal
            </span>
            <h1 className="text-3xl font-extrabold md:text-4xl">Guest House Overview</h1>
            <p className="text-primary-foreground/90 max-w-xl text-sm md:text-base">
              Monitor real-time room occupancies, review incoming check-ins, and orchestrate guest accommodations seamlessly.
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
                <p className="text-xs text-muted-foreground">Ready for check-in</p>
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
                <p className="text-sm font-medium text-muted-foreground">My Total Bookings</p>
                <h3 className="text-4xl font-black text-primary group-hover:scale-105 transition-transform origin-left">
                  {bookings.length}
                </h3>
                <p className="text-xs text-muted-foreground">Processed by you</p>
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
                <p className="text-sm font-medium text-muted-foreground">Today's Check-ins</p>
                <h3 className="text-4xl font-black text-accent group-hover:scale-105 transition-transform origin-left">
                  {todaysCheckinsCount}
                </h3>
                <p className="text-xs text-muted-foreground">Arriving guests today</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Occupancy Rate Visual Progress */}
        <Card glass className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-foreground">Room Occupancy Rate</h3>
                <p className="text-xs text-muted-foreground">Distribution of {rooms.length} total rooms</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-primary">{bookedPercentage}% Booked</span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-4 bg-muted rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${vacantPercentage}%` }} 
                className="h-full bg-success transition-all duration-500" 
                title={`Vacant: ${vacantPercentage}%`}
              />
              <div 
                style={{ width: `${bookedPercentage}%` }} 
                className="h-full bg-primary transition-all duration-500" 
                title={`Booked: ${bookedPercentage}%`}
              />
              <div 
                style={{ width: `${maintenancePercentage}%` }} 
                className="h-full bg-warning transition-all duration-500" 
                title={`Maintenance: ${maintenancePercentage}%`}
              />
            </div>

            {/* Progress Legends */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-success" />
                <span className="font-semibold text-foreground">{vacantRooms.length} Vacant ({vacantPercentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-semibold text-foreground">{bookedRooms.length} Booked ({bookedPercentage}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-warning" />
                <span className="font-semibold text-foreground">{maintenanceRooms.length} Maintenance ({maintenancePercentage}%)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Split Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings List */}
          <Card glass className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold">Recent Booking Activities</CardTitle>
                <p className="text-xs text-muted-foreground">List of latest processed guest stays</p>
              </div>
              <div className="w-48 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search guest name..."
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
                    <p className="text-sm text-muted-foreground">No bookings match your search</p>
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
                className="w-full flex items-center justify-between group p-4 py-5 rounded-xl text-left"
                onClick={() => onTabChange?.('availability')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <BedDouble className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="font-bold block">Book a New Room</span>
                    <span className="text-[10px] text-primary-foreground/70 block">Find vacant rooms & register guest</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button 
                variant="secondary" 
                className="w-full flex items-center justify-between group p-4 py-5 rounded-xl text-left"
                onClick={() => onTabChange?.('bookings')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold block text-foreground">View Stay History</span>
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
                    <span className="font-bold block text-foreground">Account & Theme</span>
                    <span className="text-[10px] text-muted-foreground block">Adjust password & toggles</span>
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
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Room Availability</h1>
        <p className="text-sm text-muted-foreground">Browse all guest house rooms, review real-time booking statuses, and perform immediate bookings.</p>
      </div>

      {/* Professional Search & Filters Control Panel */}
      <Card glass className="p-4 border-primary/10">
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
              <option value="booked">Booked (Occupied)</option>
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
          
          const currentBooking = isBooked ? getActiveBookingForRoom(room.id) : null;

          // Compute custom borders based on status
          const borderStyle = isVacant 
            ? 'hover:border-success/40 border-l-4 border-l-success'
            : isBooked
              ? 'hover:border-primary/40 border-l-4 border-l-primary'
              : 'hover:border-warning/40 border-l-4 border-l-warning';

          return (
            <Card key={room.id} glass hoverable className={borderStyle}>
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Room {room.roomNumber}</h3>
                      <p className="text-xs text-muted-foreground">Floor {room.floor} • Capacity: {room.capacity} Guests</p>
                    </div>
                    <StatusChip status={room.status} size="sm" />
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

                {/* Status-specific action or details */}
                <div className="mt-4 pt-3 border-t border-border/40">
                  {isVacant && (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-1 bg-success hover:bg-success/90"
                      onClick={() => onBookRoom(room.id)}
                    >
                      <Plus className="w-4 h-4" />
                      Book Guest Stay
                    </Button>
                  )}

                  {isBooked && (
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                        <User className="w-3.5 h-3.5" />
                        <span>Occupancy Stay Active</span>
                      </div>
                      {currentBooking ? (
                        <div className="text-[11px] text-muted-foreground space-y-0.5">
                          <p><strong>Guest:</strong> {currentBooking.guestName}</p>
                          <p><strong>Check-out:</strong> {format(currentBooking.checkOut, 'MMM dd, hh:mm a')}</p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic">Booking details loading...</p>
                      )}
                      <Button variant="ghost" size="sm" className="w-full text-xs h-7 text-primary hover:bg-primary/10 mt-1 cursor-default">
                        Occupied
                      </Button>
                    </div>
                  )}

                  {isMaintenance && (
                    <div className="bg-warning/5 p-3 rounded-lg border border-warning/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-warning font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Under Maintenance</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Currently out of service for guest bookings due to cleaning or repair.</p>
                      <Button variant="ghost" size="sm" className="w-full text-xs h-7 text-warning hover:bg-warning/10 mt-1 cursor-default">
                        Service Ongoing
                      </Button>
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
    </div>
  );
}
