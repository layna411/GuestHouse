import { Room, Booking, User, Notification, RoomAvailability, GalleryImage } from '../types';
import { GuestReview } from '../components/landing/constants';

const API_BASE = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '');

async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let url = typeof input === 'string' ? input : input.toString();
  if (url.startsWith('/api')) {
    url = `${API_BASE}${url}`;
  }

  const headers = new Headers(init?.headers);
  headers.set('ngrok-skip-browser-warning', 'true');

  return fetch(url, {
    ...init,
    headers
  });
}

// Generic helper to process fetch responses and extract meaningful error details
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export const authApi = {
  async login(credentials: { email: string; password_hash: string; role?: string }): Promise<User> {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password_hash, // matching back-end parameter name
        role: credentials.role
      })
    });
    const data = await handleResponse<{ message: string; user: User }>(res);
    return data.user;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const res = await apiFetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await handleResponse<{ message: string; user: User }>(res);
    return data.user;
  },

  async register(userData: { name: string; email: string; password_hash: string; phone?: string }): Promise<User> {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password_hash,
        phone: userData.phone
      })
    });
    const data = await handleResponse<{ message: string; user: User }>(res);
    return data.user;
  }
};

export const roomApi = {
  async getAll(): Promise<Room[]> {
    const res = await apiFetch('/api/rooms');
    return handleResponse<Room[]>(res);
  },

  async create(roomData: Omit<Room, 'id'>): Promise<Room> {
    const res = await apiFetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData)
    });
    const data = await handleResponse<{ message: string; room: Room }>(res);
    return data.room;
  },

  async update(roomData: Room): Promise<Room> {
    const res = await apiFetch(`/api/rooms/${roomData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData)
    });
    const data = await handleResponse<{ message: string; room: Room }>(res);
    return data.room;
  },

  async delete(roomId: string): Promise<void> {
    const res = await apiFetch(`/api/rooms/${roomId}`, {
      method: 'DELETE'
    });
    await handleResponse<{ message: string }>(res);
  }
};

export const bookingApi = {
  async getAll(employeeId?: string): Promise<Booking[]> {
    const url = employeeId ? `/api/bookings?bookedBy=${employeeId}` : '/api/bookings';
    const res = await apiFetch(url);
    const bookings = await handleResponse<any[]>(res);
    
    // ViewModel task: Convert dates from ISO strings in JSON response to javascript Date objects
    return bookings.map(b => ({
      ...b,
      checkIn: new Date(b.checkIn),
      checkOut: new Date(b.checkOut),
      createdAt: new Date(b.createdAt)
    }));
  },

  async create(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const payload = {
      roomId: bookingData.roomId,
      guestName: bookingData.guestName,
      guestPhone: bookingData.guestPhone,
      guestEmail: bookingData.guestEmail,
      checkIn: bookingData.checkIn.toISOString(),
      checkOut: bookingData.checkOut.toISOString(),
      numberOfGuests: bookingData.numberOfGuests,
      purpose: bookingData.purpose,
      bookedBy: bookingData.bookedBy,
      status: bookingData.status,
      mealPlan: bookingData.mealPlan,
      pricePerNight: bookingData.pricePerNight,
      totalPrice: bookingData.totalPrice,
      paymentType: bookingData.paymentType
    };

    const res = await apiFetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await handleResponse<{ message: string; booking: any }>(res);
    
    return {
      ...data.booking,
      checkIn: new Date(data.booking.checkIn),
      checkOut: new Date(data.booking.checkOut),
      createdAt: new Date(data.booking.createdAt)
    };
  },

  async cancel(bookingId: string): Promise<Booking> {
    const res = await apiFetch(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST'
    });
    const data = await handleResponse<{ message: string; booking: any }>(res);
    
    return {
      ...data.booking,
      checkIn: new Date(data.booking.checkIn),
      checkOut: new Date(data.booking.checkOut),
      createdAt: new Date(data.booking.createdAt)
    };
  },

  async complete(bookingId: string): Promise<Booking> {
    const res = await apiFetch(`/api/bookings/${bookingId}/complete`, {
      method: 'POST'
    });
    const data = await handleResponse<{ message: string; booking: any }>(res);
    
    return {
      ...data.booking,
      checkIn: new Date(data.booking.checkIn),
      checkOut: new Date(data.booking.checkOut),
      createdAt: new Date(data.booking.createdAt)
    };
  },

  async confirm(bookingId: string, roomId?: string): Promise<Booking> {
    const res = await apiFetch(`/api/bookings/${bookingId}/confirm`, {
      method: 'POST',
      headers: roomId ? { 'Content-Type': 'application/json' } : undefined,
      body: roomId ? JSON.stringify({ roomId }) : undefined
    });
    const data = await handleResponse<{ message: string; booking: any }>(res);
    
    return {
      ...data.booking,
      checkIn: new Date(data.booking.checkIn),
      checkOut: new Date(data.booking.checkOut),
      createdAt: new Date(data.booking.createdAt)
    };
  }
};

export const customerApi = {
  async getAll(): Promise<User[]> {
    const res = await apiFetch('/api/customers');
    return handleResponse<User[]>(res);
  },

  async create(customerData: Omit<User, 'id'>): Promise<User> {
    const res = await apiFetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    const data = await handleResponse<{ message: string; customer: User }>(res);
    return data.customer;
  },

  async update(customerData: User): Promise<User> {
    const res = await apiFetch(`/api/customers/${customerData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    const data = await handleResponse<{ message: string; customer: User }>(res);
    return data.customer;
  },

  async delete(customerId: string): Promise<void> {
    const res = await apiFetch(`/api/customers/${customerId}`, {
      method: 'DELETE'
    });
    await handleResponse<{ message: string }>(res);
  },

  async toggleActive(customerId: string): Promise<User> {
    const res = await apiFetch(`/api/customers/${customerId}/toggle-active`, {
      method: 'PUT'
    });
    const data = await handleResponse<{ message: string; customer: User }>(res);
    return data.customer;
  }
};

export const notificationApi = {
  async getAll(): Promise<Notification[]> {
    const res = await apiFetch('/api/notifications');
    return handleResponse<Notification[]>(res);
  },

  async markAsRead(id: number): Promise<Notification> {
    const res = await apiFetch(`/api/notifications/${id}/read`, {
      method: 'PUT'
    });
    const data = await handleResponse<{ message: string; notification: Notification }>(res);
    return data.notification;
  },

  async markAllAsRead(): Promise<void> {
    const res = await apiFetch('/api/notifications/read-all', {
      method: 'PUT'
    });
    await handleResponse<{ message: string }>(res);
  }
};

export const availabilityApi = {
  async getDailyGrid(startDate?: string): Promise<{ dates: string[]; defaultCapacities: Record<string, number>; grid: Record<string, Record<string, number>> }> {
    const url = startDate ? `/api/availability?startDate=${startDate}` : '/api/availability';
    const res = await apiFetch(url);
    return handleResponse(res);
  },

  async updateOverride(roomType: string, date: string, count: number): Promise<any> {
    const res = await apiFetch('/api/availability/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomType, date, count })
    });
    return handleResponse(res);
  },

  async checkStayAvailability(roomType: string, checkIn: string, checkOut: string): Promise<{ roomType: string; available: boolean; remaining: number }> {
    const res = await apiFetch(`/api/availability/check?roomType=${encodeURIComponent(roomType)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`);
    return handleResponse(res);
  }
};

export const galleryApi = {
  async getAll(): Promise<GalleryImage[]> {
    const res = await apiFetch('/api/gallery');
    return handleResponse<GalleryImage[]>(res);
  },

  async add(imageUrl: string, caption?: string): Promise<GalleryImage> {
    const res = await apiFetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, caption })
    });
    const data = await handleResponse<{ message: string; photo: GalleryImage }>(res);
    return data.photo;
  },

  async upload(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiFetch('/api/gallery/upload', {
      method: 'POST',
      body: formData
    });
    return handleResponse<{ imageUrl: string }>(res);
  },

  async delete(photoId: number): Promise<void> {
    const res = await apiFetch(`/api/gallery/${photoId}`, {
      method: 'DELETE'
    });
    await handleResponse<{ message: string }>(res);
  }
};

export const revenueApi = {
  async getStats(): Promise<{ totalRevenue: number; monthlyRevenue: { month: string; revenue: number }[] }> {
    const res = await apiFetch('/api/bookings/revenue');
    return handleResponse(res);
  }
};

export const reviewApi = {
  async getAll(): Promise<GuestReview[]> {
    const res = await apiFetch('/api/reviews');
    return handleResponse<GuestReview[]>(res);
  },

  async create(reviewData: Omit<GuestReview, 'id' | 'source'>): Promise<GuestReview> {
    const res = await apiFetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    const data = await handleResponse<{ message: string; review: GuestReview }>(res);
    return data.review;
  }
};

