import React, { useState } from 'react';
import { Menu, X, Building2, LogOut, Settings } from 'lucide-react';
import { UserRole } from '../../types';

interface MobileHeaderProps {
  role: UserRole;
  userName: string;
  activeTab: string;
  menuItems: Array<{ id: string; label: string; icon: any }>;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  notificationCenterEl?: React.ReactNode;
}

export function MobileHeader({ 
  role, 
  userName, 
  activeTab, 
  menuItems, 
  onTabChange, 
  onLogout,
  notificationCenterEl
}: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="lg:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6" />
          <div>
            <h2 className="font-bold">Saveetha GuestHouse</h2>
            <p className="text-xs text-white/70">{userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notificationCenterEl}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30 top-[72px]" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-sidebar p-4 space-y-2" onClick={(e) => e.stopPropagation()}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-sidebar-border space-y-2">
              <button
                onClick={() => handleTabChange('settings')}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${activeTab === 'settings'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
                  }
                `}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-sidebar-foreground/80 hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
