import React, { useState, Fragment } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { notificationsAPI } from '../../services/api';

const NotificationDropdown = ({ unreadCount, onNotificationRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications({ limit: 5 });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      onNotificationRead();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'answer':
        return '💬';
      case 'comment':
        return '💭';
      case 'mention':
        return '👤';
      case 'vote':
        return '👍';
      case 'accept':
        return '✅';
      default:
        return '📢';
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button 
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150"
        onClick={fetchNotifications}
      >
        <BellIcon className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <Link
                to="/notifications"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.map((notification) => (
                  <Menu.Item key={notification._id}>
                    {({ active }) => (
                      <div
                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                          active ? 'bg-gray-50' : ''
                        } ${!notification.isRead ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'}`}
                        onClick={() => {
                          if (!notification.isRead) {
                            handleMarkAsRead(notification._id);
                          }
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                              {notification.message}
                            </p>
                            {notification.relatedQuestion && (
                              <Link
                                to={`/question/${notification.relatedQuestion._id}`}
                                className="text-xs text-primary-600 hover:text-primary-700 mt-1 block truncate"
                              >
                                {notification.relatedQuestion.title}
                              </Link>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationDropdown;
