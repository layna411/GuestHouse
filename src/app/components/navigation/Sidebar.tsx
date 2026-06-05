import React from 'react';
import { LayoutDashboard, BedDouble, Calendar, Users, Settings, LogOut, Building2, Image } from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ role, activeTab, onTabChange, onLogout }: SidebarProps) {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Room Management', icon: BedDouble },
    { id: 'bookings', label: 'All Bookings', icon: Calendar },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: Image },
  ];

  const customerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'availability', label: 'Room Availability', icon: BedDouble },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : customerMenuItems;

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
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={() => onTabChange('settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/80 hover:text-sidebar-foreground"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-sidebar-foreground/80 hover:text-destructive"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
