import React from 'react';
import { Building2, BedDouble, CalendarCheck, Users, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Room, Booking } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { StatusChip } from '../StatusChip';

interface AdminDashboardProps {
  rooms: Room[];
  bookings: Booking[];
  role?: string;
}

export function AdminDashboard({ rooms, bookings, role }: AdminDashboardProps) {
  const stats = {
    totalRooms: rooms.length,
    vacantRooms: rooms.filter(r => r.status === 'vacant').length,
    bookedRooms: rooms.filter(r => r.status === 'booked').length,
    maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
    totalBookings: bookings.length,
    activeBookings: bookings.filter(b => b.status === 'confirmed').length,
    upcomingCheckIns: bookings.filter(b =>
      b.checkIn > new Date() && b.checkIn < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  const occupancyRate = stats.totalRooms > 0 ? ((stats.bookedRooms / stats.totalRooms) * 100).toFixed(0) : '0';

  const roomTypeData = [
    { name: 'Deluxe Rooms', value: rooms.filter(r => r.type === 'Deluxe Room').length, color: '#0f766e' },
    { name: 'Super Deluxe Rooms', value: rooms.filter(r => r.type === 'Super Deluxe Room').length, color: '#00ccc4' },
  ];

  const statusData = [
    { name: 'Vacant', value: stats.vacantRooms, color: '#10b981' },
    { name: 'Booked', value: stats.bookedRooms, color: '#ef4444' },
    { name: 'Maintenance', value: stats.maintenanceRooms, color: '#f59e0b' },
  ];

  const monthlyData = [
    { month: 'Jan', bookings: 12 },
    { month: 'Feb', bookings: 19 },
    { month: 'Mar', bookings: 15 },
    { month: 'Apr', bookings: 22 },
    { month: 'May', bookings: bookings.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {role === 'admin' ? 'Admin Dashboard' : 'Staff Dashboard'}
        </h1>
        <p className="text-muted-foreground font-medium">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Rooms</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.totalRooms}</h3>
                <p className="text-xs text-muted-foreground mt-2">Across 2 floors</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vacant Rooms</p>
                <h3 className="text-3xl font-bold text-success">{stats.vacantRooms}</h3>
                <p className="text-xs text-muted-foreground mt-2">Available now</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <BedDouble className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Booked Rooms</p>
                <h3 className="text-3xl font-bold text-destructive">{stats.bookedRooms}</h3>
                <p className="text-xs text-muted-foreground mt-2">Currently occupied</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Occupancy Rate</p>
                <h3 className="text-3xl font-bold text-accent">{occupancyRate}%</h3>
                <p className="text-xs text-success mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% from last week
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass>
          <CardHeader>
            <CardTitle>Monthly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(10, 34, 57, 0.1)" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card glass>
          <CardHeader>
            <CardTitle>Room Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">By Type</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={roomTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {roomTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1">
                  {roomTypeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">By Status</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Guest Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check-out</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => {
                  const room = rooms.find(r => r.id === booking.roomId);
                  return (
                    <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm">{booking.id}</td>
                      <td className="py-3 px-4 text-sm font-medium">{booking.guestName}</td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {booking.status === 'pending' ? (
                          <span className="text-amber-500 italic">Unallocated</span>
                        ) : (
                          room?.roomNumber || 'N/A'
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">{format(booking.checkIn, 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4 text-sm">{format(booking.checkOut, 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-4 text-sm">
                        <StatusChip status={booking.status as any} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
