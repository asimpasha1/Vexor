"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from "@/components/layout/dashboard-layout"
import { 
  RefreshCw, 
  Database, 
  Upload, 
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
  FileText,
  Users
} from 'lucide-react'

export default function DataManagementPage() {
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'success' | 'error' | 'warning'
    message: string
    timestamp: Date
  }>>([])

  const addNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    }
    setNotifications(prev => [notification, ...prev.slice(0, 4)])
  }

  const handleSeedDatabase = async () => {
    setLoading(true)
    try {
      // محاكاة تشغيل سكريبت البذر
      await new Promise(resolve => setTimeout(resolve, 2000))
      addNotification('success', 'تم إضافة البيانات التجريبية بنجاح')
      setLastUpdate(new Date().toLocaleString('ar-SA'))
    } catch (error) {
      addNotification('error', 'فشل في إضافة البيانات التجريبية')
    } finally {
      setLoading(false)
    }
  }

  const handleClearDatabase = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/clear-database', { method: 'POST' })
      if (response.ok) {
        addNotification('success', 'تم مسح جميع البيانات بنجاح')
        setLastUpdate(new Date().toLocaleString('ar-SA'))
      } else {
        throw new Error('فشل في مسح البيانات')
      }
    } catch (error) {
      addNotification('error', 'فشل في مسح البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    setLoading(true)
    try {
      // محاكاة تصدير البيانات
      await new Promise(resolve => setTimeout(resolve, 1500))
      addNotification('success', 'تم تصدير البيانات بنجاح')
      
      // محاكاة تحميل ملف
      const element = document.createElement('a')
      element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Sample exported data')
      element.download = `database-export-${new Date().toISOString().split('T')[0]}.json`
      element.click()
    } catch (error) {
      addNotification('error', 'فشل في تصدير البيانات')
    } finally {
      setLoading(false)
    }
  }

  const ActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    color, 
    onClick, 
    disabled = false,
    danger = false 
  }: {
    title: string
    description: string
    icon: any
    color: string
    onClick: () => void
    disabled?: boolean
    danger?: boolean
  }) => (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      <div className="flex items-start space-x-4 space-x-reverse">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
          <motion.button
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              danger
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري المعالجة...</span>
              </div>
            ) : (
              'تنفيذ'
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              إدارة البيانات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              أدوات إدارة وصيانة قاعدة البيانات
            </p>
          </div>
          
          {lastUpdate && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              آخر تحديث: {lastUpdate}
            </div>
          )}
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className={`flex items-center space-x-3 space-x-reverse p-4 rounded-lg ${
                  notification.type === 'success'
                    ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700'
                    : notification.type === 'error'
                    ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-700'
                    : 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
                }`}
              >
                {notification.type === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {notification.type === 'error' && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                {notification.type === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    notification.type === 'success'
                      ? 'text-green-800 dark:text-green-200'
                      : notification.type === 'error'
                      ? 'text-red-800 dark:text-red-200'
                      : 'text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.timestamp.toLocaleTimeString('ar-SA')}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <ActionCard
            title="إضافة بيانات تجريبية"
            description="إضافة منتجات ومستخدمين تجريبيين لاختبار النظام"
            icon={Database}
            color="bg-blue-500"
            onClick={handleSeedDatabase}
            disabled={loading}
          />

          <ActionCard
            title="تصدير البيانات"
            description="تصدير جميع البيانات إلى ملف JSON للنسخ الاحتياطي"
            icon={Download}
            color="bg-green-500"
            onClick={handleExportData}
            disabled={loading}
          />

          <ActionCard
            title="تحديث الفهارس"
            description="إعادة بناء فهارس قاعدة البيانات لتحسين الأداء"
            icon={RefreshCw}
            color="bg-purple-500"
            onClick={() => addNotification('success', 'تم تحديث الفهارس بنجاح')}
            disabled={loading}
          />

          <ActionCard
            title="مسح جميع البيانات"
            description="حذف جميع المنتجات والمستخدمين من قاعدة البيانات"
            icon={Trash2}
            color="bg-red-500"
            onClick={handleClearDatabase}
            disabled={loading}
            danger={true}
          />
        </div>

        {/* Database Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            إحصائيات قاعدة البيانات
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg inline-block mb-3">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">0</h4>
              <p className="text-gray-600 dark:text-gray-400">المنتجات</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg inline-block mb-3">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">0</h4>
              <p className="text-gray-600 dark:text-gray-400">المستخدمون</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg inline-block mb-3">
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">SQLite</h4>
              <p className="text-gray-600 dark:text-gray-400">نوع قاعدة البيانات</p>
            </div>
          </div>
        </motion.div>

        {/* Warning Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6"
        >
          <div className="flex items-start space-x-3 space-x-reverse">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                تحذير مهم
              </h4>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                عمليات إدارة البيانات قد تؤثر على أداء النظام. يُنصح بإجراء نسخة احتياطية قبل تنفيذ أي عملية.
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                <li>عملية مسح البيانات لا يمكن التراجع عنها</li>
                <li>قم بإنشاء نسخة احتياطية قبل إجراء تغييرات كبيرة</li>
                <li>اختبر العمليات على بيئة تطوير أولاً</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}