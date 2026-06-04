import { Room, Booking, User } from '../types';

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

  async create(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    const payload = {
      roomId: bookingData.roomId,
      guestName: bookingData.guestName,
      guestPhone: bookingData.guestPhone,
      guestEmail: bookingData.guestEmail,
      checkIn: bookingData.checkIn.toISOString(),
      checkOut: bookingData.checkOut.toISOString(),
      numberOfGuests: bookingData.numberOfGuests,
      purpose: bookingData.purpose,
      bookedBy: bookingData.bookedBy
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
  }
};

export const employeeApi = {
  async getAll(): Promise<User[]> {
    const res = await apiFetch('/api/employees');
    return handleResponse<User[]>(res);
  },

  async create(employeeData: Omit<User, 'id'>): Promise<User> {
    const res = await apiFetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    const data = await handleResponse<{ message: string; employee: User }>(res);
    return data.employee;
  },

  async update(employeeData: User): Promise<User> {
    const res = await apiFetch(`/api/employees/${employeeData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    const data = await handleResponse<{ message: string; employee: User }>(res);
    return data.employee;
  },

  async delete(employeeId: string): Promise<void> {
    const res = await apiFetch(`/api/employees/${employeeId}`, {
      method: 'DELETE'
    });
    await handleResponse<{ message: string }>(res);
  }
};
