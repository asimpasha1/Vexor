"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  MessageCircle, 
  Send, 
  Clock, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Trash2,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Mail
} from "lucide-react"

interface Chat {
  id: string
  userEmail: string
  userName: string
  status: 'active' | 'closed' | 'waiting'
  createdAt: string
  updatedAt: string
  messages: Message[]
}

interface Message {
  id: string
  chatId: string
  content: string
  sender: 'user' | 'support' | 'bot'
  timestamp: string
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'read' | 'replied' | 'closed'
  createdAt: string
  updatedAt: string
  replies?: ContactReply[]
}

interface ContactReply {
  id: string
  content: string
  sender: string
  timestamp: string
}

interface SupportManagementProps {
  openChatId?: string | null
  openContactId?: string | null
}

export default function SupportManagement({ openChatId, openContactId }: SupportManagementProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'ratings'>('chats')
  const [chats, setChats] = useState<Chat[]>([])
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [ratings, setRatings] = useState<any[]>([])
  const [ratingStats, setRatingStats] = useState<any>(null)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [newReply, setNewReply] = useState("")
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadData()
      // تحديث البيانات كل 30 ثانية
      const interval = setInterval(loadData, 30000)
      return () => clearInterval(interval)
    }
  }, [mounted])

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages])

  // التعامل مع المعاملات الواردة من الإشعارات
  useEffect(() => {
    if (mounted && openChatId) {
      // البحث عن المحادثة وفتحها
      const chat = chats.find(c => c.id === openChatId)
      if (chat) {
        setSelectedChat(chat)
        setActiveTab('chats')
      }
    }
  }, [mounted, openChatId, chats])

  useEffect(() => {
    if (mounted && openContactId) {
      // البحث عن رسالة الاتصال وفتحها
      const contact = contacts.find(c => c.id === openContactId)
      if (contact) {
        setSelectedContact(contact)
        setActiveTab('contacts')
      }
    }
  }, [mounted, openContactId, contacts])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // تحميل المحادثات
      const chatsResponse = await fetch('/api/admin/chats')
      if (chatsResponse.ok) {
        const chatsData = await chatsResponse.json()
        setChats(chatsData.chats || [])
      }

      // تحميل رسائل الاتصال
      const contactsResponse = await fetch('/api/contact')
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json()
        setContacts(contactsData.contacts || [])
      }

      // تحميل التقييمات
      const ratingsResponse = await fetch('/api/chat/rating')
      if (ratingsResponse.ok) {
        const ratingsData = await ratingsResponse.json()
        setRatings(ratingsData.ratings || [])
        setRatingStats(ratingsData.stats || null)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: selectedChat.id,
          content: newMessage,
          sender: 'support'
        }),
      })

      if (response.ok) {
        setNewMessage("")
        await loadData()
        // تحديث المحادثة المحددة
        const updatedChat = chats.find(c => c.id === selectedChat.id)
        if (updatedChat) {
          setSelectedChat(updatedChat)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const sendReply = async () => {
    if (!newReply.trim() || !selectedContact) return

    try {
      const response = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactId: selectedContact.id,
          content: newReply,
          sender: 'الدعم الفني'
        }),
      })

      if (response.ok) {
        setNewReply("")
        await loadData()
        // تحديث الرسالة المحددة
        const updatedContact = contacts.find(c => c.id === selectedContact.id)
        if (updatedContact) {
          setSelectedContact(updatedContact)
        }
      }
    } catch (error) {
      console.error('Error sending reply:', error)
    }
  }

  const updateChatStatus = async (chatId: string, status: Chat['status']) => {
    try {
      const response = await fetch('/api/admin/chats/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, status }),
      })

      if (response.ok) {
        await loadData()
      }
    } catch (error) {
      console.error('Error updating chat status:', error)
    }
  }

  const updateContactStatus = async (contactId: string, status: ContactMessage['status']) => {
    try {
      const response = await fetch('/api/contact/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactId, status }),
      })

      if (response.ok) {
        await loadData()
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const formatTime = (dateString: string) => {
    if (!mounted) return 'جاري التحميل...'
    
    try {
      return new Date(dateString).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'تاريخ غير صحيح'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'new': return 'text-green-600 bg-green-100'
      case 'waiting': return 'text-yellow-600 bg-yellow-100'
      case 'closed': return 'text-gray-600 bg-gray-100'
      case 'replied': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredChats = chats.filter(chat => {
    const matchesStatus = statusFilter === 'all' || chat.status === statusFilter
    const matchesSearch = chat.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const filteredContacts = contacts.filter(contact => {
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <MessageCircle className="h-8 w-8 text-white" />
            <h2 className="text-2xl font-bold text-white">إدارة الدعم الفني</h2>
          </div>
          <button
            onClick={loadData}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mt-6">
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'chats'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            المحادثات المباشرة ({chats.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'contacts'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            رسائل الاتصال ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'ratings'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            التقييمات ({ratings.length})
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 h-96">
        {/* Sidebar */}
        <div className="lg:col-span-1 border-l border-gray-200 dark:border-gray-700">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 space-x-reverse mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="all">جميع الحالات</option>
              {activeTab === 'chats' ? (
                <>
                  <option value="active">نشط</option>
                  <option value="waiting">في الانتظار</option>
                  <option value="closed">مغلق</option>
                </>
              ) : (
                <>
                  <option value="new">جديد</option>
                  <option value="read">مقروء</option>
                  <option value="replied">تم الرد</option>
                  <option value="closed">مغلق</option>
                </>
              )}
            </select>
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ height: '400px' }}>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : activeTab === 'chats' ? (
              filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                    selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {chat.userName}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chat.status)}`}>
                      {chat.status === 'active' ? 'نشط' : 
                       chat.status === 'waiting' ? 'في الانتظار' : 'مغلق'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {chat.userEmail}
                  </p>
                  <p className="text-xs text-gray-500">
                    آخر تحديث: {formatTime(chat.updatedAt)}
                  </p>
                  {chat.messages.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 truncate">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  )}
                </motion.div>
              ))
            ) : activeTab === 'ratings' ? (
              // عرض قائمة التقييمات
              ratings.map((rating) => (
                <motion.div
                  key={rating.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  className="p-4 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {rating.userEmail}
                    </h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
                          } fill-current`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="mr-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        ({rating.rating}/5)
                      </span>
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      "{rating.comment}"
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatTime(rating.createdAt)}
                  </p>
                </motion.div>
              ))
            ) : activeTab === 'contacts' ? (
              filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                    selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </h4>
                    <div className="flex space-x-1 space-x-reverse">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                        {contact.priority === 'high' ? 'عالية' : 
                         contact.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status === 'new' ? 'جديد' :
                         contact.status === 'read' ? 'مقروء' :
                         contact.status === 'replied' ? 'تم الرد' : 'مغلق'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {contact.subject}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {contact.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(contact.createdAt)}
                  </p>
                </motion.div>
              ))
            ) : (
              // قائمة التقييمات
              ratings.map((rating) => (
                <motion.div
                  key={rating.id}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  className="p-4 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {rating.userEmail}
                    </h4>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rating.rating ? 'text-yellow-400' : 'text-gray-300'
                          } fill-current`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="mr-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        ({rating.rating}/5)
                      </span>
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      "{rating.comment}"
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatTime(rating.createdAt)}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat/Contact Detail */}
        <div className="lg:col-span-2 flex flex-col">
          {activeTab === 'chats' && selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedChat.userName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedChat.userEmail}
                    </p>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => updateChatStatus(selectedChat.id, 'active')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                    >
                      تفعيل
                    </button>
                    <button
                      onClick={() => updateChatStatus(selectedChat.id, 'closed')}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.sender === 'support'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : message.sender === 'bot'
                        ? 'bg-purple-100 text-purple-900 rounded-bl-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2 space-x-reverse">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="اكتب ردك..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : activeTab === 'contacts' && selectedContact ? (
            <>
              {/* Contact Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedContact.subject}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      من: {selectedContact.name} ({selectedContact.email})
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(selectedContact.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'read')}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      تم القراءة
                    </button>
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors"
                    >
                      تم الرد
                    </button>
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'closed')}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Message */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    الرسالة الأصلية:
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>

                {/* Replies */}
                {selectedContact.replies && selectedContact.replies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      الردود:
                    </h4>
                    {selectedContact.replies.map((reply) => (
                      <div key={reply.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-900 dark:text-blue-200">
                            {reply.sender}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="اكتب ردك..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                  />
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <button
                      onClick={sendReply}
                      disabled={!newReply.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2 space-x-reverse"
                    >
                      <Send className="h-4 w-4" />
                      <span>إرسال الرد</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'ratings' ? (
            // عرض إحصائيات التقييمات
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                إحصائيات تقييمات الخدمة
              </h3>
              
              {ratingStats && (
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* إجمالي التقييمات */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      إجمالي التقييمات
                    </h4>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {ratingStats.total}
                    </p>
                  </div>
                  
                  {/* متوسط التقييم */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                      متوسط التقييم
                    </h4>
                    <div className="flex items-center">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400 ml-2">
                        {ratingStats.average}
                      </p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-6 h-6 ${
                              star <= Math.round(ratingStats.average) ? 'text-yellow-400' : 'text-gray-300'
                            } fill-current`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* توزيع التقييمات */}
              {ratingStats && (
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    توزيع التقييمات
                  </h4>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                          {stars} نجوم
                        </span>
                        <div className="flex-1 mx-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${ratingStats.total > 0 ? (ratingStats.distribution[stars] / ratingStats.total) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                          {ratingStats.distribution[stars]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {activeTab === 'chats' 
                    ? 'اختر محادثة لعرض الرسائل'
                    : activeTab === 'contacts'
                    ? 'اختر رسالة لعرض التفاصيل'
                    : 'إحصائيات التقييمات'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}