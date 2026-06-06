import React from 'react';
import { BedDouble, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../Card';
import { Room } from '../../types';

interface RoomManagementProps {
  rooms: Room[];
  onAddRoom: (room: Omit<Room, 'id'>) => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
  role?: string;
}

export function RoomManagement({ rooms }: RoomManagementProps) {
  // Filter rooms by type
  const deluxeRooms = rooms.filter(room => room.type === 'Deluxe Room' || room.type?.toLowerCase().includes('deluxe') && !room.type?.toLowerCase().includes('super'));
  const superDeluxeRooms = rooms.filter(room => room.type === 'Super Deluxe Room' || room.type?.toLowerCase().includes('super'));

  // Helper to count statuses
  const getStatusCounts = (roomList: Room[]) => {
    const counts = { vacant: 0, booked: 0, dirty: 0, maintenance: 0 };
    roomList.forEach(room => {
      if (room.status in counts) {
        counts[room.status as keyof typeof counts]++;
      }
    });
    return counts;
  };

  const deluxeCounts = getStatusCounts(deluxeRooms);
  const superDeluxeCounts = getStatusCounts(superDeluxeRooms);

  // Helper to get status color indicator for badges
  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'vacant': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'booked': return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
      case 'dirty': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'maintenance': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  const getStatusDotColor = (status: Room['status']) => {
    switch (status) {
      case 'vacant': return 'bg-emerald-500';
      case 'booked': return 'bg-sky-500';
      case 'dirty': return 'bg-amber-500';
      case 'maintenance': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Room Management</h1>
          <p className="text-muted-foreground">Overview of the guest house room configurations and live category statuses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deluxe Room Category Card */}
        <Card glass className="overflow-hidden flex flex-col h-full border border-border/40 hover:border-primary/30 transition-all duration-300">
          <div className="relative h-64 overflow-hidden bg-slate-950">
            <img
              src="/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg"
              alt="Deluxe Rooms"
              className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/20 text-accent rounded-full border border-accent/20 backdrop-blur-sm">
                  Premium Category
                </span>
                <h2 className="text-3xl font-bold text-white mt-2 font-serif">Deluxe Room</h2>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-300 block">Standard Rate</span>
                <span className="text-2xl font-bold text-accent">₹2,250<span className="text-xs font-normal text-slate-300">/night</span></span>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
            {/* Room Specs & Details */}
            <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BedDouble className="w-5 h-5" />
=======
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <Card key={room.id} glass hoverable className="overflow-hidden flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={room.type.toLowerCase().includes('super')
                      ? '/images/WhatsApp Image 2026-06-04 at 3.41.10 PM (1).jpeg'
                      : '/images/WhatsApp Image 2026-06-04 at 3.41.06 PM.jpeg'}
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusChip status={room.status} size="sm" />
                  </div>
>>>>>>> b359275e90c7beefa44d6f4c194ab00b7f58433a
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Inventory</p>
                  <p className="text-sm font-semibold text-foreground">{deluxeRooms.length || 12} Rooms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max Capacity</p>
                  <p className="text-sm font-semibold text-foreground">3 Guests / Room</p>
                </div>
              </div>
            </div>

            {/* Live Room Status Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Live Status Summary
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                  <span className="text-xs text-emerald-400 block font-medium">Vacant</span>
                  <span className="text-lg font-bold text-emerald-500">{deluxeCounts.vacant}</span>
                </div>
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-2.5 text-center">
                  <span className="text-xs text-sky-400 block font-medium">Booked</span>
                  <span className="text-lg font-bold text-sky-500">{deluxeCounts.booked}</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 text-center">
                  <span className="text-xs text-amber-400 block font-medium">Dirty</span>
                  <span className="text-lg font-bold text-amber-500">{deluxeCounts.dirty}</span>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-center">
                  <span className="text-xs text-rose-400 block font-medium">OOS</span>
                  <span className="text-lg font-bold text-rose-500">{deluxeCounts.maintenance}</span>
                </div>
              </div>
            </div>

            {/* Room Numbers Status Indicator Grid */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Room Allocations
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {deluxeRooms.map(room => (
                  <div 
                    key={room.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold capitalize border ${getStatusColor(room.status)} shadow-sm`}
                  >
                    <span>{room.roomNumber}</span>
                    <span className={`w-2 h-2 rounded-full ${getStatusDotColor(room.status)}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Standard Amenities</h3>
              <div className="flex flex-wrap gap-1.5">
                {["50 inch smart TV", "cupboard", "Air conditioned", "Twin bed"].map((amenity, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-muted text-xs rounded-md text-foreground border border-border/50">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Super Deluxe Room Category Card */}
        <Card glass className="overflow-hidden flex flex-col h-full border border-border/40 hover:border-primary/30 transition-all duration-300">
          <div className="relative h-64 overflow-hidden bg-slate-950">
            <img
              src="/images/WhatsApp Image 2026-06-04 at 3.41.10 PM (1).jpeg"
              alt="Super Deluxe Rooms"
              className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-gold/20 text-amber-400 rounded-full border border-amber-400/20 backdrop-blur-sm">
                  Luxury Category
                </span>
                <h2 className="text-3xl font-bold text-white mt-2 font-serif">Super Deluxe Room</h2>
              </div>
              <div className="text-right">
                <span className="text-sm text-slate-300 block">Standard Rate</span>
                <span className="text-2xl font-bold text-accent">₹2,350<span className="text-xs font-normal text-slate-300">/night</span></span>
              </div>
            </div>
          </div>

          <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
            {/* Room Specs & Details */}
            <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Inventory</p>
                  <p className="text-sm font-semibold text-foreground">{superDeluxeRooms.length || 6} Rooms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Max Capacity</p>
                  <p className="text-sm font-semibold text-foreground">3 Guests / Room</p>
                </div>
              </div>
            </div>

            {/* Live Room Status Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Live Status Summary
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                  <span className="text-xs text-emerald-400 block font-medium">Vacant</span>
                  <span className="text-lg font-bold text-emerald-500">{superDeluxeCounts.vacant}</span>
                </div>
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-2.5 text-center">
                  <span className="text-xs text-sky-400 block font-medium">Booked</span>
                  <span className="text-lg font-bold text-sky-500">{superDeluxeCounts.booked}</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 text-center">
                  <span className="text-xs text-amber-400 block font-medium">Dirty</span>
                  <span className="text-lg font-bold text-amber-500">{superDeluxeCounts.dirty}</span>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-center">
                  <span className="text-xs text-rose-400 block font-medium">OOS</span>
                  <span className="text-lg font-bold text-rose-500">{superDeluxeCounts.maintenance}</span>
                </div>
              </div>
            </div>

            {/* Room Numbers Status Indicator Grid */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Room Allocations
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {superDeluxeRooms.map(room => (
                  <div 
                    key={room.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold capitalize border ${getStatusColor(room.status)} shadow-sm`}
                  >
                    <span>{room.roomNumber}</span>
                    <span className={`w-2 h-2 rounded-full ${getStatusDotColor(room.status)}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Standard Amenities</h3>
              <div className="flex flex-wrap gap-1.5">
                {["50 inch smart TV", "cupboard", "Air conditioned", "mini fridge", "2 seater sofa", "ceiling fan"].map((amenity, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-muted text-xs rounded-md text-foreground border border-border/50">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
