import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellOff, Check, CheckSquare, Bell as BellIcon } from 'lucide-react';
import { Notification } from '../../types';
import { format } from 'date-fns';

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (bookingId: string) => void;
}

export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (n: Notification) => {
    onMarkAsRead(n.id);
    onNotificationClick(n.bookingId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-secondary hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all focus:outline-none cursor-pointer"
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-bounce text-accent' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-destructive text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-destructive/30">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl z-[9999] overflow-hidden text-white animate-in fade-in slide-in-from-top-2 duration-250">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-sm font-bold text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-accent hover:text-accent/80 font-medium flex items-center gap-1 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2 bg-slate-900">
                <BellOff className="w-8 h-8 text-slate-500" />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 transition-all flex gap-3 text-left items-start hover:bg-slate-800/50 cursor-pointer ${
                    !n.isRead ? 'bg-slate-800/30' : 'bg-slate-900'
                  }`}
                  onClick={() => handleItemClick(n)}
                >
                  {/* Status Indicator */}
                  <div className="mt-1 flex-shrink-0">
                    {!n.isRead ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    )}
                  </div>

                  {/* Message body */}
                  <div className="flex-1 space-y-1">
                    <p className={`text-xs leading-relaxed ${!n.isRead ? 'text-slate-100 font-semibold' : 'text-slate-400'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {format(new Date(n.createdAt), 'MMM dd, hh:mm a')}
                      </span>
                      {!n.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(n.id);
                          }}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
