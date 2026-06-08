import { useState, useEffect } from 'react';
import { Room } from '../types';
import { roomApi } from '../services/api';
import { toast } from 'sonner';

export function useRoomsViewModel() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await roomApi.getAll();
      setRooms(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to retrieve room details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    
    // Set up short polling for real-time rooms updates (every 3 seconds)
    const interval = setInterval(fetchRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddRoom = async (roomData: Omit<Room, 'id'>) => {
    try {
      const newRoom = await roomApi.create(roomData);
      setRooms(prev => [...prev, newRoom]);
      toast.success(`Room ${roomData.roomNumber} added successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add new room.');
    }
  };

  const handleEditRoom = async (room: Room) => {
    try {
      const updatedRoom = await roomApi.update(room);
      setRooms(prev => prev.map(r => r.id === room.id ? updatedRoom : r));
      toast.success('Room updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update room details.');
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      await roomApi.delete(id);
      setRooms(prev => prev.filter(r => r.id !== id));
      toast.success('Room deleted successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete room.');
    }
  };

  return {
    rooms,
    loading,
    refreshRooms: fetchRooms,
    handleAddRoom,
    handleEditRoom,
    handleDeleteRoom
  };
}
