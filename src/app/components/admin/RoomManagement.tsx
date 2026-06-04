import React, { useState } from 'react';
import { Plus, Edit, Trash2, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { StatusChip } from '../StatusChip';
import { AddEditRoomModal } from './AddEditRoomModal';
import { Room } from '../../types';

interface RoomManagementProps {
  rooms: Room[];
  onAddRoom: (room: Omit<Room, 'id'>) => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
}

export function RoomManagement({ rooms, onAddRoom, onEditRoom, onDeleteRoom }: RoomManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'vacant' | 'booked' | 'maintenance'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.floor.toString().includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Room Management</h1>
          <p className="text-muted-foreground">Manage all guest house rooms and their details</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Room
        </Button>
      </div>

      <Card glass>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by room number or floor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'vacant' ? 'success' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('vacant')}
              >
                Vacant
              </Button>
              <Button
                variant={filterStatus === 'booked' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('booked')}
              >
                Booked
              </Button>
              <Button
                variant={filterStatus === 'maintenance' ? 'outline' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('maintenance')}
              >
                Maintenance
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <Card key={room.id} glass hoverable>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Room {room.roomNumber}</h3>
                      <p className="text-sm text-muted-foreground">Floor {room.floor}</p>
                    </div>
                    <StatusChip status={room.status} size="sm" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium text-foreground">{room.type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium text-foreground">{room.capacity} persons</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium text-accent">₹{room.price}/night</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-muted/50 text-xs rounded-md text-foreground"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="px-2 py-0.5 bg-muted/50 text-xs rounded-md text-muted-foreground">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingRoom(room)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
                          onDeleteRoom(room.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rooms found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <AddEditRoomModal
          onSubmit={(roomData) => {
            onAddRoom(roomData);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingRoom && (
        <AddEditRoomModal
          room={editingRoom}
          onSubmit={(roomData) => {
            onEditRoom({ ...roomData, id: editingRoom.id });
            setEditingRoom(null);
          }}
          onClose={() => setEditingRoom(null)}
        />
      )}
    </div>
  );
}
