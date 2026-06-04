import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Room } from '../../types';

interface AddEditRoomModalProps {
  room?: Room;
  onSubmit: (roomData: Omit<Room, 'id'>) => void;
  onClose: () => void;
}

export function AddEditRoomModal({ room, onSubmit, onClose }: AddEditRoomModalProps) {
  const [formData, setFormData] = useState({
    roomNumber: room?.roomNumber || '',
    floor: room?.floor || 1,
    type: room?.type || 'AC' as const,
    capacity: room?.capacity || 2,
    price: room?.price || 1500,
    status: room?.status || 'vacant' as const,
    amenities: room?.amenities.join(', ') || 'WiFi, TV, Bathroom',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
    if (formData.floor < 1) newErrors.floor = 'Floor must be at least 1';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.amenities.trim()) newErrors.amenities = 'At least one amenity is required';

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const amenitiesArray = formData.amenities
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    onSubmit({
      roomNumber: formData.roomNumber,
      floor: formData.floor,
      type: formData.type,
      capacity: formData.capacity,
      price: formData.price,
      status: formData.status,
      amenities: amenitiesArray,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="my-8 w-full max-w-2xl">
        <Card glass className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{room ? 'Edit Room' : 'Add New Room'}</CardTitle>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Room Number"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  error={errors.roomNumber}
                  placeholder="e.g., 101, 202"
                />

                <div>
                  <label className="block mb-2 text-sm text-foreground">Floor</label>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {[1, 2, 3, 4, 5].map(floor => (
                      <option key={floor} value={floor}>Floor {floor}</option>
                    ))}
                  </select>
                  {errors.floor && <p className="mt-1.5 text-sm text-destructive">{errors.floor}</p>}
                </div>

                <div>
                  <label className="block mb-2 text-sm text-foreground">Room Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-foreground">Capacity</label>
                  <select
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {[1, 2, 3, 4, 5, 6].map(capacity => (
                      <option key={capacity} value={capacity}>{capacity} Person{capacity > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  {errors.capacity && <p className="mt-1.5 text-sm text-destructive">{errors.capacity}</p>}
                </div>

                <Input
                  label="Price per Night (₹)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price}
                  placeholder="1500"
                />

                <div>
                  <label className="block mb-2 text-sm text-foreground">Room Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="vacant">Vacant</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm text-foreground">
                    Amenities (comma-separated)
                  </label>
                  <textarea
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="WiFi, TV, Bathroom, Hot Water, Mini Fridge"
                  />
                  {errors.amenities && (
                    <p className="mt-1.5 text-sm text-destructive">{errors.amenities}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Separate amenities with commas (e.g., WiFi, TV, AC)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  {room ? 'Update Room' : 'Add Room'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
