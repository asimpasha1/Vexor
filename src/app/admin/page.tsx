"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Shield, Mail, Calendar, RefreshCw } from "lucide-react"
import DynamicMetadata from "@/components/DynamicMetadata"
import { useSettings } from "@/hooks/useSettings"
import SupportManagement from "@/components/support/SupportManagement"

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminPage() {
  const { siteName, loading: settingsLoading } = useSettings()
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [openChatId, setOpenChatId] = useState<string | null>(null)
  const [openContactId, setOpenContactId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
      return
    }
    
    if (session?.user && (session.user as any).role !== "ADMIN") {
      router.push("/")
      return
    }

    // قراءة معاملات URL للانتقال المباشر
    const chatId = searchParams.get('openChat')
    const contactId = searchParams.get('openContact')
    
    if (chatId) {
      setOpenChatId(chatId)
    }
    
    if (contactId) {
      setOpenContactId(contactId)
    }

    loadUsers()
  }, [session, status, router, searchParams])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadUsers()
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            غير مصرح لك بالوصول
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            هذه الصفحة مخصصة للمديرين فقط
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <DynamicMetadata 
        title={`لوحة الإدارة - ${settingsLoading ? 'Digital Market' : siteName}`}
        description="لوحة إدارة الموقع والمستخدمين"
      />
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    لوحة الإدارة
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    إدارة المستخدمين والنظام
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>تحديث</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    إجمالي المستخدمين
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    المديرين
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(user => user.role === "ADMIN").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    المستخدمين العاديين
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter(user => user.role === "USER").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                قائمة المستخدمين
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                جميع المستخدمين المسجلين في النظام
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      الدور
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      تاريخ التسجيل
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "ADMIN" 
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}>
                          {user.role === "ADMIN" ? "مدير" : "مستخدم"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 ml-2" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {new Date(user.createdAt).toLocaleDateString("ar-SA", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    لا يوجد مستخدمين مسجلين حتى الآن
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Support Management */}
          <div className="mt-8">
            <SupportManagement 
              openChatId={openChatId}
              openContactId={openContactId}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}