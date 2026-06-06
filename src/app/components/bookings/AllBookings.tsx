import React, { useState } from 'react';
import { Search, Calendar, Filter, Eye, X, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { StatusChip } from '../StatusChip';
import { Room, Booking } from '../../types';
import { format } from 'date-fns';
import { RoomAllocationModal } from '../admin/RoomAllocationModal';

interface AllBookingsProps {
  bookings: Booking[];
  rooms: Room[];
  onCancelBooking: (id: string) => void;
  onCompleteBooking: (id: string) => void;
  onConfirmBooking?: (id: string, roomId?: string) => void;
  role?: string;
}

export function AllBookings({ bookings, rooms, onCancelBooking, onCompleteBooking, onConfirmBooking, role }: AllBookingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [allocatingBooking, setAllocatingBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestPhone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">All Bookings</h1>
        <p className="text-muted-foreground">View and manage all guest house bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.total}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <h3 className="text-2xl font-bold text-success">{stats.confirmed}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <h3 className="text-2xl font-bold text-warning">{stats.pending}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <h3 className="text-2xl font-bold text-primary">{stats.completed}</h3>
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by guest name, booking ID, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'confirmed' ? 'success' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('confirmed')}
              >
                Confirmed
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'outline' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'outline' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check-out</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Meal Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const room = rooms.find(r => r.id === booking.roomId);
                  return (
                    <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{booking.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{booking.guestName}</p>
                          <p className="text-xs text-muted-foreground">{booking.guestPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {booking.status === 'pending' ? (
                          <span className="text-amber-500 font-medium italic">Unallocated</span>
                        ) : (
                          room?.roomNumber || 'N/A'
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">{format(booking.checkIn, 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4 text-sm">{format(booking.checkOut, 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4 text-xs font-medium max-w-[120px] truncate">{booking.mealPlan || 'Room without Breakfast'}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-accent">₹{booking.totalPrice?.toFixed(2) || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <StatusChip status={booking.status} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {booking.status === 'pending' && onConfirmBooking && role === 'staff' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAllocatingBooking(booking)}
                                title="Approve & Allocate Room"
                              >
                                <CheckCircle className="w-4 h-4 text-success" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Cancel/Reject this booking request?')) {
                                    onCancelBooking(booking.id);
                                  }
                                }}
                                title="Reject Booking"
                              >
                                <XCircle className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Mark this booking as completed?')) {
                                    onCompleteBooking(booking.id);
                                  }
                                }}
                              >
                                <CheckCircle className="w-4 h-4 text-success" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Cancel this booking?')) {
                                    onCancelBooking(booking.id);
                                  }
                                }}
                              >
                                <XCircle className="w-4 h-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bookings found matching your criteria</p>
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
                    <p className="font-medium">
                      {selectedBooking.status === 'pending' ? (
                        <span className="text-amber-500 italic">Unallocated (Assigned at Approval)</span>
                      ) : (
                        rooms.find(r => r.id === selectedBooking.roomId)?.roomNumber || 'N/A'
                      )}
                    </p>
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
                    <p className="text-sm text-muted-foreground">Meal Plan</p>
                    <p className="font-medium">{selectedBooking.mealPlan || 'Room without Breakfast'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rate / Night</p>
                    <p className="font-medium">₹{selectedBooking.pricePerNight?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price (Incl. Tax)</p>
                    <p className="font-bold text-accent">₹{selectedBooking.totalPrice?.toFixed(2) || 'N/A'}</p>
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
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Booked On</p>
                  <p className="font-medium">{format(selectedBooking.createdAt, 'MMM dd, yyyy hh:mm a')}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setSelectedBooking(null)} className="flex-1">
                  Close
                </Button>
                 {selectedBooking.status === 'pending' && onConfirmBooking && role === 'staff' && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => setAllocatingBooking(selectedBooking)}
                      className="flex-1"
                    >
                      Approve & Allocate Room
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Reject this booking request?')) {
                          onCancelBooking(selectedBooking.id);
                          setSelectedBooking(null);
                        }
                      }}
                      className="flex-1"
                    >
                      Reject Booking
                    </Button>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => {
                        onCompleteBooking(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="flex-1"
                    >
                      Mark Complete
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Cancel this booking?')) {
                          onCancelBooking(selectedBooking.id);
                          setSelectedBooking(null);
                        }
                      }}
                      className="flex-1"
                    >
                      Cancel Booking
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {allocatingBooking && (
        <RoomAllocationModal
          booking={allocatingBooking}
          rooms={rooms}
          onClose={() => setAllocatingBooking(null)}
          onConfirm={(roomId) => {
            if (onConfirmBooking) {
              onConfirmBooking(allocatingBooking.id, roomId);
            }
            setAllocatingBooking(null);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}
