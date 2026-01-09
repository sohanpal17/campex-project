import { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { formatTimeAgo } from '@/utils/formatters';
import { NOTIFICATION_TYPES } from '@/constants/notificationTypes';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { Bell, MessageCircle, Tag, HelpCircle } from 'lucide-react';
import api from '@/services/api';

const NotificationsPage = () => {
  const { notifications, loading, markAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'requests'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'requests') {
      return notification.type === NOTIFICATION_TYPES.ITEM_REQUEST;
    }
    // Messages tab includes messages and other system updates, basically everything NOT a request?
    // User requested "messages and requests". 
    // Assuming "Messages" tab contains everything else for now to avoid losing data, 
    // or specifically just messages? The prompt said: "in messages, same as its working"
    // which implies the existing view.
    return notification.type !== NOTIFICATION_TYPES.ITEM_REQUEST;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (window.confirm('Delete all notifications? This cannot be undone.')) {
                  try {
                    await api.delete('/api/notifications/all');
                    window.location.reload(); // Refresh to show empty list
                  } catch (error) {
                    console.error('Failed to delete notifications:', error);
                  }
                }
              }}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'messages'
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Messages 
              {activeTab === 'messages' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'requests'
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Item Requests
              {activeTab === 'requests' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <Bell size={48} className="text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab === 'requests' ? 'requests' : 'notifications'} found
              </h3>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-primary-50' : ''
                  }`}
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    {notification.type === 'message' && <MessageCircle size={22} className="text-primary-600" />}
                    {notification.type === 'listing' && <Tag size={22} className="text-primary-600" />}
                    {notification.type === 'system' && <Bell size={22} className="text-primary-600" />}
                    {notification.type === NOTIFICATION_TYPES.ITEM_REQUEST && <HelpCircle size={22} className="text-primary-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-gray-700 mb-2">{notification.body}</p>
                    <p className="text-sm text-gray-500">{formatTimeAgo(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div >
  );
};

export default NotificationsPage;