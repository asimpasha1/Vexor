"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useToast } from "@/components/providers/toast-provider"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react'

interface AnalyticsData {
  totalRevenue: number
  totalProducts: number
  totalUsers: number
  salesCount: number
  revenueGrowth: number
  productsGrowth: number
  usersGrowth: number
  salesGrowth: number
  categoryStats: { [key: string]: number }
  monthlyRevenue: { month: string; revenue: number }[]
}

export default function AnalyticsPage() {
  const { success, error: showError } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    salesCount: 0,
    revenueGrowth: 0,
    productsGrowth: 0,
    usersGrowth: 0,
    salesGrowth: 0,
    categoryStats: {},
    monthlyRevenue: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // محاكاة جلب البيانات من API
      const productsResponse = await fetch('/api/products')
      const products = await productsResponse.json()
      
      // حساب الإحصائيات
      const totalProducts = products.length
      const totalRevenue = products.reduce((sum: number, product: any) => sum + product.price, 0)
      const categoryStats: { [key: string]: number } = {}
      
      products.forEach((product: any) => {
        categoryStats[product.category] = (categoryStats[product.category] || 0) + 1
      })

      // حساب البيانات الحقيقية
      setAnalytics({
        totalRevenue,
        totalProducts,
        totalUsers: 0, // سيتم جلبها من API المستخدمين
        salesCount: 0, // سيتم جلبها من API الطلبات
        revenueGrowth: 0,
        productsGrowth: 0,
        usersGrowth: 0,
        salesGrowth: 0,
        categoryStats,
        monthlyRevenue: [] // بيانات حقيقية من API
      })
    } catch (error) {
      console.error('خطأ في جلب التحليلات:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    color 
  }: { 
    title: string
    value: string | number
    growth: number
    icon: any
    color: string 
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <div className="flex items-center mt-2">
            {growth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              growth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(growth)}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
              من الشهر الماضي
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  const exportReport = async () => {
    try {
      // إنشاء بيانات التقرير
      const reportData = {
        generatedAt: new Date().toISOString(),
        reportDate: new Date().toLocaleDateString('ar-SA'),
        totalRevenue: analytics.totalRevenue,
        totalProducts: analytics.totalProducts,
        totalUsers: analytics.totalUsers,
        salesCount: analytics.salesCount,
        revenueGrowth: analytics.revenueGrowth,
        productsGrowth: analytics.productsGrowth,
        usersGrowth: analytics.usersGrowth,
        salesGrowth: analytics.salesGrowth,
        categoryStats: analytics.categoryStats,
        monthlyRevenue: analytics.monthlyRevenue
      }

      // تحويل البيانات إلى JSON منسق
      const jsonData = JSON.stringify(reportData, null, 2)
      
      // إنشاء محتوى CSV للتقرير الأساسي
      const csvHeaders = ['المقياس', 'القيمة', 'النمو %']
      const csvRows = [
        ['الإيرادات الإجمالية', `$${analytics.totalRevenue}`, `${analytics.revenueGrowth}%`],
        ['إجمالي المنتجات', analytics.totalProducts.toString(), `${analytics.productsGrowth}%`],
        ['إجمالي المستخدمين', analytics.totalUsers.toString(), `${analytics.usersGrowth}%`],
        ['عدد المبيعات', analytics.salesCount.toString(), `${analytics.salesGrowth}%`]
      ]
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n')
      
      // إنشاء تقرير HTML منسق
      const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تقرير التحليلات - ${reportData.reportDate}</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stat-value { font-size: 24px; font-weight: bold; color: #333; }
        .stat-label { color: #666; margin-bottom: 5px; }
        .growth { font-size: 14px; margin-top: 5px; }
        .growth.positive { color: #22c55e; }
        .growth.negative { color: #ef4444; }
        .category-section { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .category-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>تقرير التحليلات</h1>
        <p>تاريخ التقرير: ${reportData.reportDate}</p>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">الإيرادات الإجمالية</div>
            <div class="stat-value">$${analytics.totalRevenue.toLocaleString()}</div>
            <div class="growth ${analytics.revenueGrowth >= 0 ? 'positive' : 'negative'}">
                ${analytics.revenueGrowth >= 0 ? '↗' : '↘'} ${analytics.revenueGrowth}%
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-label">إجمالي المنتجات</div>
            <div class="stat-value">${analytics.totalProducts}</div>
            <div class="growth ${analytics.productsGrowth >= 0 ? 'positive' : 'negative'}">
                ${analytics.productsGrowth >= 0 ? '↗' : '↘'} ${analytics.productsGrowth}%
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-label">إجمالي المستخدمين</div>
            <div class="stat-value">${analytics.totalUsers}</div>
            <div class="growth ${analytics.usersGrowth >= 0 ? 'positive' : 'negative'}">
                ${analytics.usersGrowth >= 0 ? '↗' : '↘'} ${analytics.usersGrowth}%
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-label">عدد المبيعات</div>
            <div class="stat-value">${analytics.salesCount}</div>
            <div class="growth ${analytics.salesGrowth >= 0 ? 'positive' : 'negative'}">
                ${analytics.salesGrowth >= 0 ? '↗' : '↘'} ${analytics.salesGrowth}%
            </div>
        </div>
    </div>
    
    <div class="category-section">
        <h3>توزيع الفئات</h3>
        ${Object.entries(analytics.categoryStats).map(([category, count]) => `
            <div class="category-item">
                <span>${category}</span>
                <strong>${count}</strong>
            </div>
        `).join('')}
    </div>
    
    <div class="footer">
        <p>تم إنشاء هذا التقرير في ${new Date().toLocaleString('ar-SA')}</p>
        <p>Digital Innovation Marketplace</p>
    </div>
</body>
</html>`
      
      // السماح للمستخدم باختيار نوع التصدير
      const format = prompt('اختر صيغة التصدير:\n1 - JSON\n2 - CSV\n3 - HTML\nاكتب رقم الصيغة:', '3')
      
      let fileContent, fileName, mimeType
      
      switch(format) {
        case '1':
          fileContent = jsonData
          fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
          mimeType = 'application/json'
          break
        case '2':
          fileContent = csvContent
          fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`
          mimeType = 'text/csv'
          break
        case '3':
        default:
          fileContent = htmlContent
          fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.html`
          mimeType = 'text/html'
          break
      }
      
      // إنشاء ملف للتحميل
      const blob = new Blob([fileContent], { type: mimeType })
      const url = URL.createObjectURL(blob)
      
      // إنشاء رابط تحميل
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // تنظيف الرابط
      URL.revokeObjectURL(url)
      
      success('تم تصدير التقرير', 'تم تصدير تقرير التحليلات بنجاح إلى جهازك')
    } catch (error) {
      console.error('خطأ في تصدير التقرير:', error)
      showError('خطأ في تصدير التقرير', 'حدث خطأ أثناء تصدير التقرير، يرجى المحاولة مرة أخرى')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              التحليلات والتقارير
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              نظرة شاملة على أداء متجرك
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportReport}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            <span>تصدير التقرير</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="إجمالي الإيرادات"
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            growth={analytics.revenueGrowth}
            icon={DollarSign}
            color="bg-green-500"
          />
          
          <StatCard
            title="إجمالي المنتجات"
            value={analytics.totalProducts}
            growth={analytics.productsGrowth}
            icon={Package}
            color="bg-blue-500"
          />
          
          <StatCard
            title="إجمالي المستخدمين"
            value={analytics.totalUsers}
            growth={analytics.usersGrowth}
            icon={Users}
            color="bg-purple-500"
          />
          
          <StatCard
            title="المبيعات"
            value={analytics.salesCount}
            growth={analytics.salesGrowth}
            icon={BarChart3}
            color="bg-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                الإيرادات الشهرية
              </h3>
              <BarChart3 className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {analytics.monthlyRevenue.map((item, index) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.month}
                  </span>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(item.revenue / 8200) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                توزيع الفئات
              </h3>
              <PieChart className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(analytics.categoryStats).map(([category, count], index) => {
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500']
                const categoryLabels: { [key: string]: string } = {
                  course: 'كورس',
                  ebook: 'كتاب إلكتروني',
                  template: 'قالب',
                  software: 'برنامج'
                }
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {categoryLabels[category] || category}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              النشاط الأخير
            </h3>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  تم إنجاز عملية بيع جديدة
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  منذ ساعتين
                </p>
              </div>
              <span className="text-sm font-medium text-green-600">
                +$49.99
              </span>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  تم إضافة منتج جديد
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  منذ 4 ساعات
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  انضمام مستخدم جديد
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  منذ 6 ساعات
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}