'use client';

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function UnifiedNotificationCenter() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])

  // محاكاة جلب الإشعارات للأدمن
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      // محاكاة إشعارات المحادثات الجديدة
      const mockNotifications = [
        {
          id: 1,
          type: 'chat',
          title: 'رسالة جديدة من أحمد محمد',
          message: 'أحتاج مساعدة في الطلب رقم #12345',
          time: 'منذ دقيقتين',
          read: false
        },
        {
          id: 2,
          type: 'chat',
          title: 'رسالة جديدة من فاطمة أحمد',
          message: 'متى سيتم توصيل الطلب؟',
          time: 'منذ 5 دقائق',
          read: false
        }
      ]
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    }
  }, [session])

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-sm flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {/* أيقونة الجرس الصحيحة */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border-2 border-black rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b-2 border-black">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">الإشعارات</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                    setUnreadCount(0)
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  قراءة الكل
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      notification.type === 'chat' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <p className="text-gray-500">لا توجد إشعارات</p>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t-2 border-black">
            <button className="w-full text-center text-sm text-blue-600 hover:underline">
              عرض جميع الإشعارات
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
