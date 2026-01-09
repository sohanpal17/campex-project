import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/services/api';
import { onMessageListener } from '@/services/firebase';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const { data } = await api.get('/api/notifications');
      // Ensure data is an array
      const notificationsList = Array.isArray(data) ? data : [];
      setNotifications(notificationsList);
      setUnreadCount(notificationsList.filter(n => !n.isRead).length);
    } catch (error) {
      // 422 means profile not created yet - this is expected for new users
      // Network errors mean backend is not running - don't log as error
      const is422 = error?.response?.status === 422;
      const errorMessage = error?.message || '';

      if (!is422 && !errorMessage.includes('Network error') && !errorMessage.includes('User profile not created')) {
        console.error('Error fetching notifications:', error);
      }
      // Set empty arrays on error to prevent UI issues
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/api/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Listen for foreground FCM messages
  useEffect(() => {
    if (!isAuthenticated) return;

    onMessageListener()
      .then((payload) => {
        console.log('Received foreground message:', payload);

        // Show toast notification
        toast(payload.notification.body, {
          icon: '🔔',
          duration: 4000,
        });

        // Refresh notifications
        fetchNotifications();
      })
      .catch((err) => console.log('Error listening to messages:', err));
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};