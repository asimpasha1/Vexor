'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'system' | 'support'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // جلب الإشعارات الموحدة
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // جلب إشعارات النظام
      const systemResponse = await fetch('/api/notifications/send');
      let systemNotifications = [];
      if (systemResponse.ok) {
        const systemResult = await systemResponse.json();
        systemNotifications = systemResult.notifications || [];
      }

      // جلب إشعارات الدعم الفني
      const supportResponse = await fetch('/api/notifications/status');
      let supportNotifications = [];
      if (supportResponse.ok) {
        const supportResult = await supportResponse.json();
        supportNotifications = (supportResult.notifications || []).map((n: any) => ({
          ...n,
          type: 'support'
        }));
      }

      // دمج جميع الإشعارات
      const allNotifications = [...systemNotifications, ...supportNotifications]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // تحديد لون الإشعار حسب النوع
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'newOrder':
        return 'from-green-500 to-emerald-600';
      case 'newUser':
        return 'from-blue-500 to-indigo-600';
      case 'lowStock':
        return 'from-red-500 to-pink-600';
      case 'support':
      case 'chat':
        return 'from-purple-500 to-blue-600';
      case 'contact':
        return 'from-orange-500 to-yellow-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // أيقونة الإشعار حسب النوع
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'newOrder':
        return '🛒';
      case 'newUser':
        return '👋';
      case 'lowStock':
        return '⚠️';
      case 'support':
      case 'chat':
        return '💬';
      case 'contact':
        return '📧';
      default:
        return '📢';
    }
  };

  // تنسيق التاريخ
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // تصفية الإشعارات
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    if (filter === 'system') return ['system', 'newOrder', 'newUser', 'lowStock'].includes(notification.type);
    if (filter === 'support') return ['support', 'chat', 'contact'].includes(notification.type);
    return true;
  });

  // تحديد الإشعار كمقروء
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // تحديد جميع الإشعارات كمقروءة
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST'
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <BellIcon className="w-8 h-8 text-purple-400" />
                مركز الإشعارات
              </h1>
              <p className="text-gray-300">إدارة ومتابعة جميع إشعارات النظام</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              {/* فلتر الإشعارات */}
              <div className="flex bg-white/10 rounded-lg p-1">
                {[
                  { key: 'all', label: 'الكل' },
                  { key: 'unread', label: 'غير مقروءة' },
                  { key: 'read', label: 'مقروءة' },
                  { key: 'system', label: 'النظام' },
                  { key: 'support', label: 'الدعم' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key as any)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      filter === item.key
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105"
              >
                تحديد الكل كمقروء
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إجمالي الإشعارات</p>
                <p className="text-2xl font-bold text-white">{notifications.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BellIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">غير مقروءة</p>
                <p className="text-2xl font-bold text-white">
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">مقروءة</p>
                <p className="text-2xl font-bold text-white">
                  {notifications.filter(n => n.read).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إشعارات النظام</p>
                <p className="text-2xl font-bold text-white">
                  {notifications.filter(n => ['system', 'newOrder', 'newUser', 'lowStock'].includes(n.type)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                🔔
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إشعارات الدعم</p>
                <p className="text-2xl font-bold text-white">
                  {notifications.filter(n => ['support', 'chat', 'contact'].includes(n.type)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                💬
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">
              الإشعارات ({filteredNotifications.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white/60">جاري التحميل...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-white/60 text-lg">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 hover:bg-white/5 transition-all cursor-pointer ${
                    !notification.read ? 'bg-white/5' : ''
                  }`}
                  onClick={() => setSelectedNotification(notification)}
                >
                  <div className="flex items-start gap-4">
                    {/* أيقونة الإشعار */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getNotificationColor(notification.type)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* محتوى الإشعار */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-medium truncate">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-white/70 text-sm mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-white/50 text-xs">
                        {formatDate(notification.timestamp)}
                      </p>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all"
                          title="تحديد كمقروء"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}