"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, MessageCircle, Mail, X } from "lucide-react"
import { useSession } from "next-auth/react"

interface Notification {
  id: string
  type: 'chat' | 'contact'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority?: 'low' | 'medium' | 'high'
}

export default function SupportNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // فحص الإشعارات كل 30 ثانية مع الحفاظ على الحالة المقروءة
  useEffect(() => {
    if (mounted && session?.user && (session.user as any).role === "ADMIN") {
      loadNotifications()
      const interval = setInterval(() => {
        // تحديث الإشعارات مع الحفاظ على الحالة المحلية
        loadNotifications(true)
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [session, mounted])

  const loadNotifications = async (preserveLocalState = false) => {
    try {
      // إذا كان هناك حالة محلية، احتفظ بها
      const currentReadStates: { [key: string]: boolean } = {}
      if (preserveLocalState) {
        notifications.forEach(notification => {
          if (notification.read) {
            currentReadStates[notification.id] = true
          }
        })
      }

      // جلب حالة الإشعارات المقروءة من الخادم
      let readNotifications: { [key: string]: any } = {}
      let markAllReadActive = false
      try {
        const readResponse = await fetch('/api/notifications/status')
        if (readResponse.ok) {
          const readData = await readResponse.json()
          readNotifications = readData.notifications || {}
          // التحقق من علامة "تحديد الكل كمقروء"
          markAllReadActive = readData.notifications?._markAllRead || false
        }
      } catch (error) {
        console.log('No saved notification status found')
      }

      // دمج الحالة المحلية مع الحالة المحفوظة
      const combinedReadState = { ...readNotifications, ...currentReadStates }

      // إذا كان "تحديد الكل كمقروء" مفعل، جعل جميع الإشعارات مقروءة
      if (markAllReadActive && preserveLocalState) {
        Object.keys(combinedReadState).forEach(key => {
          if (!key.startsWith('_')) { // تجاهل المفاتيح الخاصة
            combinedReadState[key] = { read: true }
          }
        })
      }

      // جلب المحادثات الجديدة
      const chatsResponse = await fetch('/api/admin/chats?status=waiting')
      if (chatsResponse.ok) {
        const chatsData = await chatsResponse.json()
        const chatNotifications = chatsData.chats.slice(0, 5).map((chat: any) => {
          const notificationId = `chat-${chat.id}`
          // إذا كان "تحديد الكل كمقروء" مفعل، جعل جميع الإشعارات مقروءة
          const isRead = markAllReadActive || combinedReadState[notificationId]?.read || false
          return {
            id: notificationId,
            type: 'chat' as const,
            title: 'رسالة جديدة في الدردشة',
            message: `من ${chat.userName}: ${chat.messages[chat.messages.length - 1]?.content.substring(0, 50)}...`,
            timestamp: chat.updatedAt,
            read: isRead
          }
        })

        // جلب رسائل الاتصال الجديدة
        const contactsResponse = await fetch('/api/contact?status=new')
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json()
          const contactNotifications = contactsData.contacts.slice(0, 5).map((contact: any) => {
            const notificationId = `contact-${contact.id}`
            // إذا كان "تحديد الكل كمقروء" مفعل، جعل جميع الإشعارات مقروءة
            const isRead = markAllReadActive || combinedReadState[notificationId]?.read || false
            return {
              id: notificationId,
              type: 'contact' as const,
              title: 'رسالة اتصال جديدة',
              message: `من ${contact.name}: ${contact.subject}`,
              timestamp: contact.createdAt,
              read: isRead,
              priority: contact.priority
            }
          })

          // دمج الإشعارات وترتيبها
          const allNotifications = [...chatNotifications, ...contactNotifications]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10)

          setNotifications(allNotifications)
          setUnreadCount(allNotifications.filter(n => !n.read).length)
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    // تحديث الحالة المحلية فوراً
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))

    // حفظ الحالة في قاعدة البيانات
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    // تحديث الحالة المحلية فوراً
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    setUnreadCount(0)

    // حفظ كل إشعار كمقروء في قاعدة البيانات
    try {
      // حفظ كل إشعار بشكل منفصل لضمان الدقة
      const savePromises = notifications.map(notification => 
        fetch('/api/notifications/mark-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notification.id })
        })
      )

      await Promise.all(savePromises)
      
      // حفظ إضافي للتأكد
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      console.log('جميع الإشعارات تم تحديدها كمقروءة بنجاح')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      // في حالة الخطأ، لا نسترجع البيانات للحفاظ على تجربة المستخدم
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // تحديد الإشعار كمقروء
    markAsRead(notification.id)
    
    // الانتقال للمحتوى المناسب
    if (notification.type === 'chat') {
      // استخراج معرف المحادثة من ID الإشعار
      const chatId = notification.id.replace('chat-', '')
      // إغلاق القائمة والانتقال لإدارة الدعم
      setShowDropdown(false)
      window.location.href = `/admin?openChat=${chatId}#support`
    } else if (notification.type === 'contact') {
      // استخراج معرف رسالة الاتصال
      const contactId = notification.id.replace('contact-', '')
      // الانتقال لصفحة رسائل الاتصال
      setShowDropdown(false)
      window.location.href = `/admin?openContact=${contactId}#contact`
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'الآن'
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-blue-500'
    }
  }

  // عرض الإشعارات للمديرين فقط
  if (!mounted || !session?.user || (session.user as any).role !== "ADMIN") {
    return null
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
            style={{ maxHeight: '480px' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  إشعارات الدعم الفني
                </h3>
                <div className="flex space-x-2 space-x-reverse">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    لا توجد إشعارات جديدة
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'chat' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {notification.type === 'chat' ? (
                          <MessageCircle className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </h4>
                          {notification.priority && (
                            <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              ●
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowDropdown(false)
                    window.location.href = '/admin#support'
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  عرض جميع الإشعارات
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}