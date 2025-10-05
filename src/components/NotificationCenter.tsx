'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // جلب الإشعارات
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications/send');
      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.notifications || []);
        setUnreadCount(result.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحميل الإشعارات عند فتح المكون
  useEffect(() => {
    fetchNotifications();
    
    // جلب الإشعارات كل دقيقة
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
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
      default:
        return 'from-purple-500 to-blue-600';
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
      default:
        return '📢';
    }
  };

  // تنسيق التاريخ
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    
    return date.toLocaleDateString('ar-SA');
  };

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
        setUnreadCount(prev => Math.max(0, prev - 1));
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
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* زر الإشعارات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        <BellIcon className="w-6 h-6" />
        
        {/* عداد الإشعارات غير المقروءة */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* لوحة الإشعارات */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* خلفية للإغلاق */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* لوحة الإشعارات */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute left-0 mt-2 w-96 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden"
            >
              {/* رأس اللوحة */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">الإشعارات</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* قائمة الإشعارات */}
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-white/60">جاري التحميل...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-2">🔔</div>
                    <p className="text-white/60">لا توجد إشعارات</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-b border-white/10 hover:bg-white/5 transition-all cursor-pointer ${
                        !notification.read ? 'bg-white/5' : ''
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* أيقونة الإشعار */}
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getNotificationColor(notification.type)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* محتوى الإشعار */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium text-sm truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-white/70 text-xs mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-white/50 text-xs">
                            {formatDate(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
              
              {/* تذييل اللوحة */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/20 text-center">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // يمكن إضافة رابط لصفحة الإشعارات الكاملة
                    }}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    عرض جميع الإشعارات
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}