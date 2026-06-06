import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Save, RefreshCw, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { format, addDays, subDays } from 'date-fns';
import { availabilityApi } from '../../services/api';
import { toast } from 'sonner';

import { Booking } from '../../types';

interface RoomInventoryProps {
  role: 'admin' | 'staff';
  bookings?: Booking[];
}

export function RoomInventory({ role, bookings }: RoomInventoryProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [dates, setDates] = useState<string[]>([]);
  const [grid, setGrid] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(false);
  
  // Track local edits before saving to backend
  const [editedCells, setEditedCells] = useState<Record<string, Record<string, number>>>({});
  const [saving, setSaving] = useState(false);

  const fetchGrid = async () => {
    setLoading(true);
    try {
      const formattedDate = format(startDate, 'yyyy-MM-dd');
      const data = await availabilityApi.getDailyGrid(formattedDate);
      setDates(data.dates);
      setGrid(data.grid);
      setEditedCells({}); // clear any unsaved edits
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch daily room availability grid.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrid();
  }, [startDate, bookings]);

  const handleCellChange = (roomType: string, dateStr: string, value: string) => {
    const intVal = parseInt(value, 10);
    if (isNaN(intVal) || intVal < 0) return;
    
    // Limit to max capacities (Deluxe = 12, Super = 6)
    const limit = roomType === 'Deluxe Room' ? 12 : 6;
    const finalVal = Math.min(intVal, limit);

    setEditedCells(prev => ({
      ...prev,
      [roomType]: {
        ...(prev[roomType] || {}),
        [dateStr]: finalVal
      }
    }));
  };

  const handleSave = async () => {
    const editKeys = Object.keys(editedCells);
    if (editKeys.length === 0) {
      toast.info('No changes to save.');
      return;
    }

    setSaving(true);
    try {
      let count = 0;
      for (const roomType of editKeys) {
        const datesMap = editedCells[roomType];
        for (const dateStr of Object.keys(datesMap)) {
          const val = datesMap[dateStr];
          await availabilityApi.updateOverride(roomType, dateStr, val);
          count++;
        }
      }
      toast.success(`Successfully saved ${count} availability updates!`);
      fetchGrid();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save availability changes.');
    } finally {
      setSaving(false);
    }
  };

  const shiftDates = (days: number) => {
    setStartDate(prev => addDays(prev, days));
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      // Split YYYY-MM-DD to construct correct local date object
      const parts = val.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      setStartDate(d);
    }
  };

  const isStaff = role === 'staff';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Room Inventory</h1>
          <p className="text-muted-foreground">Adjust daily available capacities to prevent overflowing bookings and block/unblock dates through 2026</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker widget */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Jump to:</span>
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={handleDatePickerChange}
              max="2026-12-31"
              min="2026-01-01"
              className="glass-input px-3 py-1.5 text-xs text-foreground bg-input-background max-w-[140px]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => shiftDates(-7)} title="Previous Week" className="px-2.5">
              <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
              Prev Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStartDate(new Date())} className="px-2.5">
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => shiftDates(7)} title="Next Week" className="px-2.5">
              Next Week
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={fetchGrid} disabled={loading} title="Reload Grid" className="px-2.5">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {!isStaff && (
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex items-center gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <strong className="text-foreground">Administrator View Only:</strong> You are logged in with Admin rights. You can inspect date availability overrides here, but editing is restricted to Staff roles.
          </div>
        </div>
      )}

      <Card glass>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <CardTitle>Daily Room Inventory Overrides</CardTitle>
          </div>
          {isStaff && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={saving || Object.keys(editedCells).length === 0}
              className="font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Overrides'}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/10 backdrop-blur-sm">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="py-4 px-5 text-sm font-semibold text-muted-foreground w-48 border-r border-border/40">Room Type</th>
                  <th className="py-4 px-4 text-xs font-bold text-center border-r border-border/40 w-24">Cap</th>
                  {dates.map(dateStr => {
                    const dateObj = new Date(`${dateStr}T00:00:00`);
                    return (
                      <th key={dateStr} className="py-3 px-2 text-center w-24 border-r border-border/40 last:border-r-0">
                        <div className="text-xs font-semibold text-muted-foreground">
                          {format(dateObj, 'EEE')}
                        </div>
                        <div className="text-sm font-bold text-foreground mt-0.5">
                          {format(dateObj, 'dd MMM')}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Deluxe Room Row */}
                <tr className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                  <td className="py-4 px-5 font-bold text-sm text-foreground border-r border-border/40">
                    Deluxe Room
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-center text-muted-foreground border-r border-border/40">
                    12 Max
                  </td>
                  {dates.map(dateStr => {
                    const baseVal = grid["Deluxe Room"]?.[dateStr] ?? 12;
                    const editedVal = editedCells["Deluxe Room"]?.[dateStr];
                    const displayedVal = editedVal !== undefined ? editedVal : baseVal;
                    const isEdited = editedVal !== undefined;

                    return (
                      <td key={dateStr} className="p-2 text-center border-r border-border/40 last:border-r-0">
                        {isStaff ? (
                          <input
                            type="number"
                            min="0"
                            max="12"
                            value={displayedVal}
                            onChange={(e) => handleCellChange('Deluxe Room', dateStr, e.target.value)}
                            className={`w-16 h-10 text-center font-bold text-sm rounded-lg border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                              isEdited 
                                ? 'border-accent text-accent shadow-md shadow-accent/5' 
                                : displayedVal === 0 
                                  ? 'border-destructive text-destructive' 
                                  : 'border-border text-foreground'
                            }`}
                          />
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            displayedVal === 0 
                              ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                              : displayedVal < 4
                                ? 'bg-warning/10 text-warning border border-warning/20'
                                : 'bg-success/10 text-success border border-success/20'
                          }`}>
                            {displayedVal}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Super Deluxe Room Row */}
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="py-4 px-5 font-bold text-sm text-foreground border-r border-border/40">
                    Super Deluxe Room
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-center text-muted-foreground border-r border-border/40">
                    6 Max
                  </td>
                  {dates.map(dateStr => {
                    const baseVal = grid["Super Deluxe Room"]?.[dateStr] ?? 6;
                    const editedVal = editedCells["Super Deluxe Room"]?.[dateStr];
                    const displayedVal = editedVal !== undefined ? editedVal : baseVal;
                    const isEdited = editedVal !== undefined;

                    return (
                      <td key={dateStr} className="p-2 text-center border-r border-border/40 last:border-r-0">
                        {isStaff ? (
                          <input
                            type="number"
                            min="0"
                            max="6"
                            value={displayedVal}
                            onChange={(e) => handleCellChange('Super Deluxe Room', dateStr, e.target.value)}
                            className={`w-16 h-10 text-center font-bold text-sm rounded-lg border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                              isEdited 
                                ? 'border-accent text-accent shadow-md shadow-accent/5' 
                                : displayedVal === 0 
                                  ? 'border-destructive text-destructive' 
                                  : 'border-border text-foreground'
                            }`}
                          />
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            displayedVal === 0 
                              ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                              : displayedVal < 3
                                ? 'bg-warning/10 text-warning border border-warning/20'
                                : 'bg-success/10 text-success border border-success/20'
                          }`}>
                            {displayedVal}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          
          {isStaff && Object.keys(editedCells).length > 0 && (
            <div className="flex justify-end mt-4">
              <p className="text-xs text-accent font-semibold animate-pulse">
                * You have unsaved overrides. Click "Save Overrides" in the header to sync with the website.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
