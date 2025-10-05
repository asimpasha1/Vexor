"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
  ShoppingCart,
  Eye,
  Star,
  Download,
  Loader2
} from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface Product {
  id: string
  title: string
  price: number
  category: string
  featured: boolean
}

interface DashboardStats {
  totalProducts: number
  totalRevenue: number
  averagePrice: number
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      setProducts(data)
      
      // Calculate stats
      const totalProducts = data.length
      const totalRevenue = data.reduce((sum: number, product: Product) => sum + product.price, 0)
      const averagePrice = totalProducts > 0 ? totalRevenue / totalProducts : 0
      
      setStats({
        totalProducts,
        totalRevenue,
        averagePrice
      })
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error("Error fetching dashboard data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 dark:text-gray-400">جاري تحميل لوحة التحكم...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const statsData = [
    {
      name: "إجمالي المنتجات",
      value: stats?.totalProducts.toString() || "0",
      change: "+12%",
      changeType: "increase",
      icon: Package
    },
    {
      name: "إجمالي الإيرادات",
      value: `$${stats?.totalRevenue.toFixed(2) || "0"}`,
      change: "+25%",
      changeType: "increase",
      icon: DollarSign
    },
    {
      name: "متوسط السعر",
      value: `$${stats?.averagePrice.toFixed(2) || "0"}`,
      change: "+8%",
      changeType: "increase",
      icon: TrendingUp
    },
    {
      name: "المنتجات المميزة",
      value: products.filter(p => p.featured).length.toString(),
      change: "+15%",
      changeType: "increase",
      icon: Star
    }
  ]

  const topProducts = products
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            لوحة التحكم
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مرحباً بك في لوحة التحكم الخاصة بك. إليك ما يحدث في متجرك.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {stat.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                أغلى المنتجات
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${product.price}
                        </p>
                        <p className="text-sm text-green-600">
                          {product.featured ? "مميز" : "عادي"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    لا توجد منتجات
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Products by Category */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                المنتجات حسب الفئة
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(
                  products.reduce((acc, product) => {
                    acc[product.category] = (acc[product.category] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                ).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {count} منتج
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => window.location.href = '/dashboard/products/new'}
              className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              إضافة منتج
            </button>
            <button 
              onClick={() => window.location.href = '/products'}
              className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Eye className="h-5 w-5 mr-2" />
              عرض المنتجات
            </button>
            <button 
              onClick={fetchDashboardData}
              className="flex items-center justify-center px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              تحديث البيانات
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <Download className="h-5 w-5 mr-2" />
              تصدير البيانات
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}