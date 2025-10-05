'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// الأيقونات المخصصة
const Cog6ToothIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const EnvelopeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const CurrencyDollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623C21 7.51 20.402 5.705 19.402 4.204A11.956 11.956 0 0 1 12 2.753Z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

interface SettingsData {
  general: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    currency: string;
    language: string;
    timezone: string;
  };
  notifications: {
    emailNewOrder: boolean;
    emailNewUser: boolean;
    emailLowStock: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
  payment: {
    paypalEnabled: boolean;
    stripeEnabled: boolean;
    bankTransferEnabled: boolean;
    taxRate: number;
    shippingFee: number;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordComplexity: boolean;
    ipWhitelist: boolean;
  };
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      siteName: 'Digital Market',
      siteDescription: 'متجر رقمي للكورسات والمنتجات التعليمية',
      supportEmail: 'support@digitalmarket.com',
      currency: 'USD',
      language: 'ar',
      timezone: 'Asia/Riyadh',
    },
    notifications: {
      emailNewOrder: true,
      emailNewUser: true,
      emailLowStock: false,
      pushNotifications: true,
      smsNotifications: false,
    },
    payment: {
      paypalEnabled: true,
      stripeEnabled: true,
      bankTransferEnabled: false,
      taxRate: 15,
      shippingFee: 0,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordComplexity: true,
      ipWhitelist: false,
    },
  });

  const tabs = [
    { id: 'general', name: 'عام', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'الإشعارات', icon: BellIcon },
    { id: 'payment', name: 'الدفع', icon: CurrencyDollarIcon },
    { id: 'security', name: 'الأمان', icon: ShieldCheckIcon },
  ];

  // تحميل الإعدادات عند فتح الصفحة
  useEffect(() => {
    const loadSettings = async () => {
      setLoadingSettings(true);
      try {
        const response = await fetch('/api/settings');
        const result = await response.json();
        
        if (response.ok && result.success) {
          setSettings(result.settings);
          console.log('Settings loaded:', result.settings);
        } else {
          console.error('Failed to load settings:', result.error);
        }
      } catch (error) {
        console.error('Load settings error:', error);
      } finally {
        setLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // حفظ الإعدادات في API حقيقي
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSaveMessage('تم حفظ الإعدادات بنجاح ✅');
        console.log('Settings saved:', result.settings);
      } else {
        throw new Error(result.error || 'فشل في حفظ الإعدادات');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      setSaveMessage('حدث خطأ في حفظ الإعدادات ❌');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // اختبار الإشعارات
  const testNotification = async (type: string) => {
    try {
      setLoading(true);
      
      // بيانات تجريبية للاختبار
      const testData = {
        newOrder: {
          orderNumber: `#${Date.now()}`,
          customerName: 'أحمد محمد',
          customerEmail: 'ahmed@example.com',
          productName: 'كورس تطوير المواقع',
          amount: 99.99
        },
        newUser: {
          userName: 'فاطمة أحمد',
          userEmail: 'fatima@example.com'
        },
        lowStock: {
          productName: 'كورس البرمجة المتقدمة',
          productStock: 2
        }
      };

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data: testData[type as keyof typeof testData]
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSaveMessage(`✅ تم إرسال إشعار ${type === 'newOrder' ? 'الطلب الجديد' : type === 'newUser' ? 'المستخدم الجديد' : 'نفاد المخزون'} بنجاح!`);
      } else {
        throw new Error(result.error || 'فشل في إرسال الإشعار');
      }
    } catch (error) {
      console.error('Test notification error:', error);
      setSaveMessage('❌ فشل في إرسال الإشعار التجريبي');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loadingSettings ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">جارٍ تحميل الإعدادات...</p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">إعدادات النظام</h1>
                  <p className="text-gray-300">إدارة إعدادات الموقع والنظام</p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 lg:mt-0">
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    saveMessage.includes('نجاح') 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  <CheckIcon className="w-5 h-5" />
                  {saveMessage}
                </motion.div>
              )}
              
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* قائمة التبويبات */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 h-fit"
          >
            <h3 className="text-lg font-semibold text-white mb-4">الأقسام</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </motion.div>

          {/* محتوى الإعدادات */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            {/* الإعدادات العامة */}
            {activeTab === 'general' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">الإعدادات العامة</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      اسم الموقع
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      وصف الموقع
                    </label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      بريد الدعم الفني
                    </label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        العملة
                      </label>
                      <select
                        value={settings.general.currency}
                        onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="USD" className="bg-gray-800">USD</option>
                        <option value="SAR" className="bg-gray-800">SAR</option>
                        <option value="EUR" className="bg-gray-800">EUR</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        اللغة
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => updateSetting('general', 'language', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="ar" className="bg-gray-800">العربية</option>
                        <option value="en" className="bg-gray-800">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        المنطقة الزمنية
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Asia/Riyadh" className="bg-gray-800">الرياض</option>
                        <option value="UTC" className="bg-gray-800">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* إعدادات الإشعارات */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">إعدادات الإشعارات</h3>
                <div className="space-y-6">
                  {/* إعدادات الإشعارات */}
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">
                            {key === 'emailNewOrder' && 'إشعار بريد إلكتروني للطلبات الجديدة'}
                            {key === 'emailNewUser' && 'إشعار بريد إلكتروني للمستخدمين الجدد'}
                            {key === 'emailLowStock' && 'إشعار بريد إلكتروني للمخزون المنخفض'}
                            {key === 'pushNotifications' && 'الإشعارات المباشرة'}
                            {key === 'smsNotifications' && 'إشعارات الرسائل النصية'}
                          </h4>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* اختبار الإشعارات */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">🧪 اختبار الإشعارات</h4>
                    <p className="text-gray-300 text-sm mb-4">اختبر نظام الإشعارات بإرسال إشعارات تجريبية</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => testNotification('newOrder')}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-lg transition-all transform hover:scale-105 text-center"
                      >
                        <div className="text-2xl mb-2">🛒</div>
                        <div className="font-medium">طلب جديد</div>
                        <div className="text-xs opacity-80">اختبار إشعار طلب</div>
                      </button>
                      
                      <button
                        onClick={() => testNotification('newUser')}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-lg transition-all transform hover:scale-105 text-center"
                      >
                        <div className="text-2xl mb-2">👋</div>
                        <div className="font-medium">مستخدم جديد</div>
                        <div className="text-xs opacity-80">اختبار إشعار تسجيل</div>
                      </button>
                      
                      <button
                        onClick={() => testNotification('lowStock')}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-4 rounded-lg transition-all transform hover:scale-105 text-center"
                      >
                        <div className="text-2xl mb-2">⚠️</div>
                        <div className="font-medium">نفاد مخزون</div>
                        <div className="text-xs opacity-80">اختبار إشعار مخزون</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* إعدادات الدفع */}
            {activeTab === 'payment' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">إعدادات الدفع</h3>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">طرق الدفع</h4>
                    {Object.entries(settings.payment).filter(([key]) => key.includes('Enabled')).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h5 className="text-white font-medium">
                            {key === 'paypalEnabled' && 'PayPal'}
                            {key === 'stripeEnabled' && 'Stripe'}
                            {key === 'bankTransferEnabled' && 'التحويل البنكي'}
                          </h5>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(value)}
                            onChange={(e) => updateSetting('payment', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-500 shadow-lg"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        معدل الضريبة (%)
                      </label>
                      <input
                        type="number"
                        value={settings.payment.taxRate}
                        onChange={(e) => updateSetting('payment', 'taxRate', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        رسوم الشحن ($)
                      </label>
                      <input
                        type="number"
                        value={settings.payment.shippingFee}
                        onChange={(e) => updateSetting('payment', 'shippingFee', Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* إعدادات الأمان */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">إعدادات الأمان</h3>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries(settings.security).filter(([key]) => typeof settings.security[key as keyof typeof settings.security] === 'boolean').map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">
                            {key === 'twoFactorAuth' && 'المصادقة الثنائية'}
                            {key === 'passwordComplexity' && 'تعقيد كلمة المرور'}
                            {key === 'ipWhitelist' && 'قائمة IP المسموحة'}
                          </h4>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => updateSetting('security', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      مهلة انتهاء الجلسة (دقيقة)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}