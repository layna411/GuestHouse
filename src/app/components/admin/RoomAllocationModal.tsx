import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Room, Booking } from '../../types';
import { format } from 'date-fns';
import { Check, X, ShieldAlert } from 'lucide-react';

interface RoomAllocationModalProps {
  booking: Booking;
  rooms: Room[];
  onConfirm: (roomId: string) => void;
  onClose: () => void;
}

export function RoomAllocationModal({
  booking,
  rooms,
  onConfirm,
  onClose
}: RoomAllocationModalProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  // Determine category of booking
  const isSuperDeluxe = booking.purpose.toLowerCase().includes('super') || 
                        rooms.find(r => r.id === booking.roomId)?.type.toLowerCase().includes('super');
  const bookingCategory = isSuperDeluxe ? 'Super Deluxe Room' : 'Deluxe Room';

  // Get all rooms of this type
  const roomsOfCategory = rooms
    .filter(r => r.type === bookingCategory)
    .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) return;
    onConfirm(selectedRoomId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
      <Card glass className="max-w-md w-full border border-border/80 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Allocate Room number</CardTitle>
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Booking Summary */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guest:</span>
                <span className="font-bold text-foreground">{booking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category Requested:</span>
                <span className="font-bold text-accent">{bookingCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dates:</span>
                <span className="font-semibold text-foreground">
                  {format(booking.checkIn, 'MMM dd')} - {format(booking.checkOut, 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact:</span>
                <span className="font-semibold text-foreground">{booking.guestPhone}</span>
              </div>
            </div>

            {/* Room Grid Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Select Room Allocation ({roomsOfCategory.length} total)
              </label>

              <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                {roomsOfCategory.map((room) => {
                  const isVacant = room.status === 'vacant';
                  const isSelected = selectedRoomId === room.id;

                  return (
                    <button
                      key={room.id}
                      type="button"
                      disabled={!isVacant}
                      onClick={() => handleSelectRoom(room.id)}
                      className={`
                        py-3 px-2 rounded-xl border-2 text-center text-xs font-bold transition-all flex flex-col justify-between items-center h-16 cursor-pointer select-none
                        ${isSelected 
                          ? 'bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-500/20 scale-[1.04]' 
                          : isVacant 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-500/40' 
                            : 'bg-slate-800/20 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed'
                        }
                      `}
                    >
                      <span className="block">{room.roomNumber}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isSelected 
                          ? 'bg-white' 
                          : isVacant 
                            ? 'bg-emerald-500' 
                            : 'bg-slate-600'
                      }`} />
                    </button>
                  );
                })}
              </div>

              {roomsOfCategory.filter(r => r.status === 'vacant').length === 0 && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg flex items-center gap-2 text-[10px]">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>Warning: No vacant rooms left in this category. Staff override required.</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border/40">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                className="flex-1 font-bold flex items-center justify-center gap-1.5" 
                disabled={!selectedRoomId}
              >
                <Check className="w-4 h-4" />
                Approve & Allocate
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
