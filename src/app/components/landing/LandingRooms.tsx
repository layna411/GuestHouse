import React from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, ArrowRight } from 'lucide-react';
import { Room } from '../../types';
import { ROOM_IMAGE_MAP } from './constants';

interface LandingRoomsProps {
  filteredRooms: Room[];
  roomTypeFilter: 'ALL' | 'Deluxe Room' | 'Super Deluxe Room';
  setRoomTypeFilter: (val: 'ALL' | 'Deluxe Room' | 'Super Deluxe Room') => void;
  onViewDetails: (room: Room) => void;
}

export const LandingRooms: React.FC<LandingRoomsProps> = ({
  filteredRooms,
  roomTypeFilter,
  setRoomTypeFilter,
  onViewDetails,
}) => {
  return (
    <section id="rooms-catalog" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-accent">Accommodations</span>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-2 text-foreground">Rooms</h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4"></div>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mt-4">
          Immerse yourself in our catalog of exquisitely designed rooms, featuring high-fidelity finishes, private balconies, and premier comfort amenities.
        </p>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-center">
        {filteredRooms.map((room) => {
          const imageSrc = room.imageUrl || ROOM_IMAGE_MAP[room.roomNumber] || '/images/WhatsApp Image 2026-06-04 at 3.41.02 PM.jpeg';
          return (
            <motion.div
              key={room.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-xl overflow-hidden flex flex-col h-full group"
            >
              {/* Image Container with Hover zoom */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={imageSrc} 
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Glass overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Room Status/Badge */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                    room.status === 'vacant' 
                      ? 'bg-success/20 border-success/30 text-success' 
                      : room.status === 'booked'
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                      : 'bg-red-500/20 border-red-500/30 text-red-300'
                  }`}>
                    {room.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-black/60 border-white/10 text-white backdrop-blur-md">
                    Floor {room.floor}
                  </span>
                </div>

                {/* Room Title */}
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-serif text-2xl font-semibold text-white">{room.type}</h3>
                </div>
              </div>

              {/* Details Panel */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Capacity and Price */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1 text-foreground/80 text-sm font-semibold">
                      <Users className="w-4 h-4 text-accent" />
                      <span>Up to {room.capacity} Guests</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Per Night</span>
                      <p className="font-serif text-2xl font-bold text-foreground">₹{room.price}</p>
                    </div>
                  </div>

                  {/* Amenities list */}
                  <h4 className="text-[11px] uppercase tracking-wider text-accent mb-3 font-bold">Premium Amenities</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities.slice(0, 4).map((amenity, index) => (
                      <span 
                        key={index} 
                        className="px-2.5 py-1 rounded bg-secondary border border-border text-[11px] text-muted-foreground flex items-center gap-1 font-semibold"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Details & Rates Action */}
                <button
                  onClick={() => onViewDetails(room)}
                  className="glass-button-gold w-full py-3 rounded text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 cursor-pointer"
                >
                  View Details & Rates
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
