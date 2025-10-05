"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Minimize2, Maximize2, Bot, User, Clock, Plus, LogOut, Star } from "lucide-react"
import { useSession } from "next-auth/react"

interface Message {
  id: string
  content: string
  sender: 'user' | 'support' | 'bot'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

interface LiveChatProps {
  onClose: () => void
}

export default function LiveChat({ onClose }: LiveChatProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [lastMessageCount, setLastMessageCount] = useState(0)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [ratingComment, setRatingComment] = useState("")
  const [chatClosed, setChatClosed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat
  useEffect(() => {
    if (mounted) {
      // محاولة استرداد chatId من localStorage أولاً
      const savedChatId = localStorage.getItem('livechat_id')
      const userEmail = session?.user?.email || 'guest@example.com'
      const savedUserEmail = localStorage.getItem('livechat_user')

      if (savedChatId && savedUserEmail === userEmail) {
        // استخدام المحادثة الموجودة
        setChatId(savedChatId)
        setIsConnected(true)
        loadExistingMessages(savedChatId)
      } else {
        // إنشاء محادثة جديدة
        initializeChat()
      }
    }
  }, [mounted, session])

  // تحديث الرسائل كل 5 ثوانٍ للحصول على ردود الدعم الفني
  useEffect(() => {
    if (chatId && isConnected) {
      const interval = setInterval(() => {
        checkForNewMessages()
      }, 5000) // فحص كل 5 ثوانٍ

      return () => clearInterval(interval)
    }
  }, [chatId, isConnected])

  // دالة لمسح المحادثة وبدء محادثة جديدة
  const startNewChat = () => {
    localStorage.removeItem('livechat_id')
    localStorage.removeItem('livechat_user')
    setMessages([])
    setChatId(null)
    setIsConnected(false)
    setLastMessageCount(0)
    setChatClosed(false)
    setShowRating(false)
    setRating(0)
    setRatingComment("")
    initializeChat()
  }

  // دالة إقفال المحادثة مع خيار التقييم
  const closeChat = () => {
    setChatClosed(true)
    setShowRating(true)
    setMessages([...messages, {
      id: Date.now().toString(),
      content: "تم إقفال المحادثة. يمكنك إضافة تقييم اختياري أو الإغلاق مباشرة.",
      sender: 'bot',
      timestamp: new Date(),
      status: 'sent'
    }])
  }

  // دالة إقفال المحادثة بدون تقييم
  const closeChatWithoutRating = () => {
    setChatClosed(true)
    setShowRating(false)
    setMessages([...messages, {
      id: Date.now().toString(),
      content: "تم إقفال المحادثة بنجاح. شكراً لاستخدام خدمة الدعم!",
      sender: 'bot',
      timestamp: new Date(),
      status: 'sent'
    }])
    
    // إغلاق المحادثة نهائياً بعد 2 ثانية
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  // دالة إرسال التقييم
  const submitRating = async () => {
    if (!chatId || rating === 0) return

    try {
      const response = await fetch('/api/chat/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          rating,
          comment: ratingComment,
          userEmail: session?.user?.email || 'guest@example.com'
        }),
      })

      if (response.ok) {
        addBotMessage(`شكراً لك على التقييم! تم تسجيل تقييمك: ${rating} نجوم`)
        setShowRating(false)
        
        // حفظ في localStorage أن التقييم تم
        localStorage.setItem(`rating_${chatId}`, 'submitted')
        
        // إغلاق المحادثة نهائياً بعد التقييم
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    }
  }

  // فحص الرسائل الجديدة
  const checkForNewMessages = async () => {
    if (!chatId) return

    try {
      const response = await fetch(`/api/chat/send?chatId=${chatId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.messages && data.messages.length > lastMessageCount) {
          const formattedMessages = data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(formattedMessages)
          setLastMessageCount(data.messages.length)
        }
      }
    } catch (error) {
      console.error('Error checking for new messages:', error)
    }
  }

  const initializeChat = async () => {
    try {
      const userEmail = session?.user?.email || 'guest@example.com'
      const userName = session?.user?.name || 'زائر'
      
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          userName
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatId(data.chatId)
        setIsConnected(true)
        
        // حفظ chatId في localStorage
        localStorage.setItem('livechat_id', data.chatId)
        localStorage.setItem('livechat_user', userEmail)
        
        // تحميل الرسائل الموجودة بدلاً من إنشاء رسالة ترحيب جديدة
        await loadExistingMessages(data.chatId)
        
        // إضافة رسالة ترحيب تلقائية فقط للمحادثات الجديدة
        if (data.status === 'created') {
          addBotMessage("مرحباً بك! كيف يمكنني مساعدتك اليوم؟")
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error)
    }
  }

  // دالة جديدة لتحميل الرسائل الموجودة
  const loadExistingMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/send?chatId=${chatId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.messages && data.messages.length > 0) {
          const formattedMessages = data.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(formattedMessages)
          setLastMessageCount(data.messages.length)
        }
      }
    } catch (error) {
      console.error('Error loading existing messages:', error)
    }
  }

  const addBotMessage = (content: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'bot',
      timestamp: new Date(),
      status: 'delivered'
    }
    setMessages(prev => [...prev, botMessage])
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || chatClosed) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, userMessage])
    const messageContent = newMessage
    setNewMessage("")

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          content: messageContent,
          sender: 'user'
        }),
      })

      if (response.ok) {
        // تحديث حالة الرسالة إلى "مرسلة"
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'sent' }
              : msg
          )
        )

        // تحديث عداد الرسائل
        setLastMessageCount(prev => prev + 1)

        // الرد التلقائي فقط إذا كانت هذه أول رسالة من المستخدم
        const userMessagesCount = messages.filter(msg => msg.sender === 'user').length
        if (userMessagesCount === 0) { // أول رسالة فقط
          setTimeout(() => {
            simulateAutoResponse(messageContent)
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // إعادة حالة الرسالة إلى خطأ في حالة الفشل
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sending' }
            : msg
        )
      )
    }
  }

  const simulateAutoResponse = (userMessage: string) => {
    setTyping(true)
    
    setTimeout(() => {
      setTyping(false)
      
      let response = "شكراً لتواصلك معنا! سيقوم أحد أعضاء فريق الدعم بالرد عليك قريباً."
      
      // ردود تلقائية ذكية بناءً على محتوى الرسالة
      if (userMessage.includes("مشكلة") || userMessage.includes("خطأ")) {
        response = "أعتذر عن المشكلة التي تواجهها. سأقوم بتوجيه استفسارك إلى المختص المناسب فوراً."
      } else if (userMessage.includes("دفع") || userMessage.includes("شراء")) {
        response = "بخصوص عمليات الدفع والشراء، سيتواصل معك مختص في أقل من 5 دقائق لمساعدتك."
      } else if (userMessage.includes("تحميل") || userMessage.includes("ملف")) {
        response = "لمساعدتك في تحميل الملفات، يرجى التأكد من تسجيل دخولك والتحقق من البريد الإلكتروني."
      }
      
      addBotMessage(response)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    if (!mounted) return '--:--'
    
    try {
      return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch (error) {
      return '--:--'
    }
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
      case 'sent':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case 'delivered':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'read':
        return <div className="w-2 h-2 bg-green-600 rounded-full" />
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ 
          width: isMinimized ? '320px' : '400px', 
          height: isMinimized ? '60px' : '500px' 
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">الدعم الفني</h3>
                <button
                  onClick={closeChatWithoutRating}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-bold transition-colors duration-200"
                  title="إغلاق سريع بدون تقييم"
                >
                  إغلاق
                </button>
              </div>
              <p className="text-xs opacity-90">
                {isConnected ? 'متصل الآن' : 'جاري الاتصال...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* أزرار إغلاق المحادثة مع خيارات */}
              {!chatClosed && (
                <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-600 mb-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      خيارات إنهاء المحادثة
                    </h4>
                    
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={closeChatWithoutRating}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
                      >
                        ⚡ إغلاق سريع (بدون تقييم)
                      </button>
                      
                      <button
                        onClick={closeChat}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
                      >
                        ⭐ إغلاق مع التقييم (اختياري)
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      اختر طريقة إنهاء المحادثة التي تناسبك
                    </p>
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : message.sender === 'bot'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                      : 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 rounded-bl-sm'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender === 'user' && (
                        <div className="mr-2">
                          {getStatusIcon(message.status)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Rating Interface */}
            {showRating && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    قيم خدمة الدعم الفني
                  </h4>
                  
                  {/* Stars Rating */}
                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 transition-colors ${
                          star <= rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        <Star className="h-8 w-8 fill-current" />
                      </button>
                    ))}
                  </div>
                  
                  {/* Comment */}
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="أضف تعليقاً (اختياري)..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none mb-4"
                  />
                  
                  {/* Submit Rating */}
                  <div className="flex justify-center space-x-3 space-x-reverse">
                    <button
                      onClick={submitRating}
                      disabled={rating === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إرسال التقييم
                    </button>
                    <button
                      onClick={closeChatWithoutRating}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      تخطي وإغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={chatClosed ? "المحادثة مقفلة" : "اكتب رسالتك..."}
                    rows={1}
                    disabled={chatClosed}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || chatClosed}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}