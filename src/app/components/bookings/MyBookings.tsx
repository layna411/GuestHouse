import React, { useState } from 'react';
import { Search, Eye, X, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { StatusChip } from '../StatusChip';
import { Room, Booking } from '../../types';
import { format } from 'date-fns';

interface MyBookingsProps {
  bookings: Booking[];
  rooms: Room[];
  currentUserId: string;
}

export function MyBookings({ bookings, rooms, currentUserId }: MyBookingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const myBookings = bookings.filter(b => b.bookedBy === currentUserId || true);

  const filteredBookings = myBookings.filter(booking => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: myBookings.length,
    active: myBookings.filter(b => b.status === 'confirmed').length,
    upcoming: myBookings.filter(b => b.checkIn > new Date()).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.total}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <h3 className="text-2xl font-bold text-success">{stats.active}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <h3 className="text-2xl font-bold text-accent">{stats.upcoming}</h3>
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest name or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookings.map((booking) => {
              const room = rooms.find(r => r.id === booking.roomId);
              return (
                <Card key={booking.id} glass hoverable>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-foreground">{booking.guestName}</h4>
                        <p className="text-sm text-muted-foreground">{booking.id}</p>
                      </div>
                      <StatusChip status={booking.status} size="sm" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Room:</span>
                        <span className="font-medium">{room?.roomNumber} ({room?.type})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Guests:</span>
                        <span className="font-medium">{booking.numberOfGuests}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format(booking.checkIn, 'MMM dd')} - {format(booking.checkOut, 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card glass className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking Details - {selectedBooking.id}</CardTitle>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Name</p>
                    <p className="font-medium">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedBooking.guestPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedBooking.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p className="font-medium">{rooms.find(r => r.id === selectedBooking.roomId)?.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{format(selectedBooking.checkIn, 'MMM dd, yyyy hh:mm a')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{format(selectedBooking.checkOut, 'MMM dd, yyyy hh:mm a')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Number of Guests</p>
                    <p className="font-medium">{selectedBooking.numberOfGuests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusChip status={selectedBooking.status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Purpose of Visit</p>
                  <p className="font-medium">{selectedBooking.purpose}</p>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" onClick={() => setSelectedBooking(null)} className="w-full">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
