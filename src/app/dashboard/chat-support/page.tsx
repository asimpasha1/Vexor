'use client';

import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function ChatSupportPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة المحادثات
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            إدارة محادثات الدعم الفني مع العملاء
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* قائمة المحادثات */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                المحادثات النشطة
              </h2>
              <div className="space-y-4">
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">أحمد محمد</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">أحتاج مساعدة في الدفع</p>
                    </div>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">2</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">فاطمة علي</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">شكرا على المساعدة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* منطقة المحادثة */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-96">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  اختر محادثة للبدء
                </h3>
              </div>
              <div className="p-4 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    اختر محادثة من القائمة للبدء في الرد على العملاء
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface ChatMessage {
  id: number;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
  isRead: boolean;
}

interface ChatSession {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
}

function ChatSupportDashboard() {
  const { data: session } = useSession();
  const [activeChatSessions, setActiveChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // محاكاة جلب جلسات المحادثة
  useEffect(() => {
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        userId: 'user1',
        username: 'أحمد محمد',
        userEmail: 'ahmed@example.com',
        lastMessage: 'أحتاج مساعدة في الطلب',
        lastMessageTime: new Date(),
        unreadCount: 2,
        isActive: true
      },
      {
        id: '2',
        userId: 'user2',
        username: 'فاطمة أحمد',
        userEmail: 'fatima@example.com',
        lastMessage: 'متى سيتم توصيل الطلب؟',
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 1,
        isActive: true
      },
      {
        id: '3',
        userId: 'user3',
        username: 'محمد علي',
        userEmail: 'mohammed@example.com',
        lastMessage: 'شكراً لكم على الخدمة الممتازة',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unreadCount: 0,
        isActive: false
      }
    ];
    setActiveChatSessions(mockSessions);
  }, []);

  // جلب رسائل الجلسة المحددة
  useEffect(() => {
    if (selectedSession) {
      const mockMessages: ChatMessage[] = [
        {
          id: 1,
          userId: 'user1',
          username: 'أحمد محمد',
          message: 'السلام عليكم، أحتاج مساعدة',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          isAdmin: false,
          isRead: true
        },
        {
          id: 2,
          userId: 'admin',
          username: 'فريق الدعم',
          message: 'وعليكم السلام، كيف يمكنني مساعدتك؟',
          timestamp: new Date(Date.now() - 50 * 60 * 1000),
          isAdmin: true,
          isRead: true
        },
        {
          id: 3,
          userId: 'user1',
          username: 'أحمد محمد',
          message: 'أحتاج مساعدة في الطلب رقم #12345',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          isAdmin: false,
          isRead: false
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedSession]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;

    const message: ChatMessage = {
      id: messages.length + 1,
      userId: 'admin',
      username: 'فريق الدعم',
      message: newMessage,
      timestamp: new Date(),
      isAdmin: true,
      isRead: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // تحديث آخر رسالة في الجلسة
    setActiveChatSessions(prev =>
      prev.map(session =>
        session.id === selectedSession
          ? { ...session, lastMessage: newMessage, lastMessageTime: new Date() }
          : session
      )
    );
  };

  const totalUnreadMessages = activeChatSessions.reduce((sum, session) => sum + session.unreadCount, 0);

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">غير مصرح</h1>
            <p className="text-gray-600">ليس لديك صلاحية للوصول لهذه الصفحة</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* إحصائيات سريعة */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">إدارة محادثات الدعم الفني</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المحادثات النشطة</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeChatSessions.filter(s => s.isActive).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.93 3.93M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">رسائل غير مقروءة</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUnreadMessages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المحادثات المكتملة</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeChatSessions.filter(s => !s.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* منطقة المحادثة */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex h-[600px]">
            {/* قائمة جلسات المحادثة */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">قائمة المحادثات</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activeChatSessions.length} محادثة إجمالية</p>
              </div>
              
              <div className="overflow-y-auto h-full">
                {activeChatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      selectedSession === session.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <h3 className="font-medium text-gray-900 dark:text-white">{session.username}</h3>
                          {session.isActive && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                              نشط
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{session.userEmail}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 truncate">{session.lastMessage}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                          {session.lastMessageTime.toLocaleTimeString('ar')}
                        </p>
                      </div>
                      {session.unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                          {session.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* منطقة المحادثة */}
            <div className="flex-1 flex flex-col">
              {selectedSession ? (
                <>
                  {/* هيدر المحادثة */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {activeChatSessions.find(s => s.id === selectedSession)?.username}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activeChatSessions.find(s => s.id === selectedSession)?.userEmail}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activeChatSessions.find(s => s.id === selectedSession)?.isActive
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {activeChatSessions.find(s => s.id === selectedSession)?.isActive ? 'نشط' : 'مكتمل'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* الرسائل */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isAdmin
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.isAdmin ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString('ar')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* صندوق الرد */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex space-x-2 space-x-reverse">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="اكتب ردك هنا..."
                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        إرسال
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">اختر محادثة</h3>
                    <p className="text-gray-500 dark:text-gray-400">اختر محادثة من القائمة لبدء الرد على العملاء</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ChatSupportDashboard;