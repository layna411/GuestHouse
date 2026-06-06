import React from 'react';
import { LayoutDashboard, BedDouble, Calendar, Settings, LogOut, Building2, Users, CalendarDays, Image, BarChart3, Layers } from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ role, activeTab, onTabChange, onLogout }: SidebarProps) {
  const menuItems = role === 'admin' 
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'rooms', label: 'Room Management', icon: BedDouble },
        { id: 'bookings', label: 'All Bookings', icon: Calendar },
        { id: 'staff', label: 'Staff Management', icon: Users },
        { id: 'inventory', label: 'Room Inventory', icon: CalendarDays },
        { id: 'room-status', label: 'Room Booking & Status', icon: Layers },
        { id: 'revenue', label: 'Revenue Tab', icon: BarChart3 },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'rooms', label: 'Room Management', icon: BedDouble },
        { id: 'bookings', label: 'All Bookings', icon: Calendar },
        { id: 'inventory', label: 'Room Inventory', icon: CalendarDays },
        { id: 'room-status', label: 'Room Booking & Status', icon: Layers },
        { id: 'gallery', label: 'Gallery Management', icon: Image },
        { id: 'revenue', label: 'Revenue Tab', icon: BarChart3 },
      ];


  return (
    <div className="h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-base leading-tight">Saveetha</h2>
            <p className="text-[10px] text-sidebar-foreground/70">GuestHouse Booking</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left
                ${isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-left leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={() => onTabChange('settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/80 hover:text-sidebar-foreground text-left"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-left leading-tight">Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-sidebar-foreground/80 hover:text-destructive text-left"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-left leading-tight">Logout</span>
        </button>
      </div>
    </div>
  );
}
