import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Calendar, RefreshCw, Award, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Room, Booking } from '../../types';
import { revenueApi } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface RevenueTabProps {
  bookings: Booking[];
  rooms: Room[];
}

export function RevenueTab({ bookings, rooms }: RevenueTabProps) {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<{ month: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const data = await revenueApi.getStats();
      setTotalRevenue(data.totalRevenue);
      setMonthlyData(data.monthlyRevenue);
    } catch (err: any) {
      // Fallback calculation from bookings array if API fails or in offline dev mode
      const confirmedOrCompleted = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
      const calculatedTotal = confirmedOrCompleted.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      setTotalRevenue(calculatedTotal);
      
      // Compile monthly data fallback
      const monthlyMap: Record<string, number> = {};
      confirmedOrCompleted.forEach(b => {
        const m = format(b.checkIn, 'MMM');
        monthlyMap[m] = (monthlyMap[m] || 0) + (b.totalPrice || 0);
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = format(new Date(), 'MMM');
      const list = months
        .filter(m => monthlyMap[m] !== undefined || m === currentMonth)
        .map(m => ({
          month: m,
          revenue: monthlyMap[m] || 0
        }));
      setMonthlyData(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [bookings]);

  const confirmedOrCompletedBookings = bookings.filter(
    b => b.status === 'confirmed' || b.status === 'completed'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Revenue Analytics</h1>
          <p className="text-muted-foreground">Track total earnings, payment statistics, and monthly revenue performance</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRevenue} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass className="border-accent/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue (As on Date)</p>
              <h3 className="text-3xl font-black text-accent">
                ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
              <p className="text-xs text-muted-foreground">Inclusive of 5% Luxury Stay Tax</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center">
              <IndianRupee className="w-7 h-7 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Paid Transactions</p>
              <h3 className="text-3xl font-bold text-foreground">
                {confirmedOrCompletedBookings.length}
              </h3>
              <p className="text-xs text-success flex items-center gap-1 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                100% payout checkouts
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card glass>
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
              <h3 className="text-3xl font-bold text-foreground">
                ₹{confirmedOrCompletedBookings.length > 0
                  ? (totalRevenue / confirmedOrCompletedBookings.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })
                  : '0'
                }
              </h3>
              <p className="text-xs text-muted-foreground">Per stay reservation</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
              <Award className="w-7 h-7 text-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue Chart (Recharts) */}
        <Card glass className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(10, 34, 57, 0.05)" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#00ccc4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Info */}
        <Card glass className="lg:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Payment Checkpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="p-4 rounded-xl border border-success/20 bg-success/5 space-y-2">
              <span className="text-xs font-bold text-success uppercase tracking-wider block">GPay / PhonePe / PayTm</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Most guests choose to pay on checkout using mobile UPI. Payment verification is handled directly at the reception desk.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">Corporate/University Billing</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For conference guests or guest lectures, invoices are settled internally against the department booking reference.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Bookings Ledger Table */}
      <Card glass>
        <CardHeader>
          <CardTitle>Earnings Ledger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Reference ID</th>
                  <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Guest</th>
                  <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Room Type</th>
                  <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Dates</th>
                  <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-muted-foreground uppercase text-right">Earning</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrCompletedBookings.map((b) => {
                  const room = rooms.find(r => r.id === b.roomId);
                  return (
                    <tr key={b.id} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                      <td className="py-3.5 px-4 text-sm font-mono text-foreground font-bold">{b.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-bold text-foreground block">{b.guestName}</span>
                        <span className="text-[10px] text-muted-foreground block">{b.guestEmail}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">{room?.type || 'Guest Suite'}</td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {format(b.checkIn, 'dd MMM')} - {format(b.checkOut, 'dd MMM, yyyy')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          b.status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm font-bold text-right text-accent">₹{b.totalPrice?.toFixed(2) || '0.00'}</td>
                    </tr>
                  );
                })}

                {confirmedOrCompletedBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                      No matching records found in the ledger.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
