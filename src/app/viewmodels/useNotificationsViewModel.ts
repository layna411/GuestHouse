import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { notificationApi } from '../services/api';
import { toast } from 'sonner';

export function useNotificationsViewModel(currentUserRole?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (currentUserRole !== 'admin') return;
    try {
      const data = await notificationApi.getAll();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (currentUserRole === 'admin') {
      fetchNotifications();
      // Set up simple polling for real-time updates (every 10 seconds)
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [currentUserRole]);

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      toast.error('Failed to mark notification as read.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (err: any) {
      toast.error('Failed to mark all notifications as read.');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    refreshNotifications: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
