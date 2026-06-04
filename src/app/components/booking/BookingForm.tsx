import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Room } from '../../types';
import { format } from 'date-fns';

interface BookingFormProps {
  room: Room;
  onSubmit: (bookingData: any) => void;
  onClose: () => void;
}

export function BookingForm({ room, onSubmit, onClose }: BookingFormProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    checkInDate: format(new Date(), 'yyyy-MM-dd'),
    checkInTime: '14:00',
    checkOutDate: format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    checkOutTime: '11:00',
    numberOfGuests: 1,
    purpose: '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!formData.guestPhone.trim()) newErrors.guestPhone = 'Phone number is required';
    if (!formData.guestEmail.trim()) newErrors.guestEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) newErrors.guestEmail = 'Invalid email format';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (formData.numberOfGuests > room.capacity) {
      newErrors.numberOfGuests = `Maximum capacity is ${room.capacity} guests`;
    }

    const checkIn = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
    const checkOut = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);

    if (checkOut <= checkIn) {
      newErrors.checkOutDate = 'Check-out must be after check-in';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const checkIn = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
    const checkOut = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);

    onSubmit({
      ...formData,
      checkIn,
      checkOut,
      roomId: room.id,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="my-8 w-full max-w-2xl">
        <Card glass className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Book Room {room.roomNumber}</CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Room Type:</span>
                <p className="font-medium">{room.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Capacity:</span>
                <p className="font-medium">{room.capacity} persons</p>
              </div>
              <div>
                <span className="text-muted-foreground">Floor:</span>
                <p className="font-medium">{room.floor}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <p className="font-medium text-accent">₹{room.price}/night</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Guest Name"
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                error={errors.guestName}
                placeholder="Enter guest name"
              />

              <Input
                label="Phone Number"
                name="guestPhone"
                type="tel"
                value={formData.guestPhone}
                onChange={handleChange}
                error={errors.guestPhone}
                placeholder="+91 XXXXX XXXXX"
              />

              <Input
                label="Email Address"
                name="guestEmail"
                type="email"
                value={formData.guestEmail}
                onChange={handleChange}
                error={errors.guestEmail}
                placeholder="guest@email.com"
                className="md:col-span-2"
              />

              <Input
                label="Check-in Date"
                name="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={handleChange}
                error={errors.checkInDate}
              />

              <Input
                label="Check-in Time"
                name="checkInTime"
                type="time"
                value={formData.checkInTime}
                onChange={handleChange}
              />

              <Input
                label="Check-out Date"
                name="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={handleChange}
                error={errors.checkOutDate}
              />

              <Input
                label="Check-out Time"
                name="checkOutTime"
                type="time"
                value={formData.checkOutTime}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm text-foreground">
                  Number of Guests
                </label>
                <select
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.numberOfGuests && (
                  <p className="mt-1.5 text-sm text-destructive">{errors.numberOfGuests}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm text-foreground">
                  Purpose of Visit
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Conference, Guest Lecture, Workshop, etc."
                />
                {errors.purpose && (
                  <p className="mt-1.5 text-sm text-destructive">{errors.purpose}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Confirm Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
