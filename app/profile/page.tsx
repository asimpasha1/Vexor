"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Calendar, Shield, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session, status, router])

  const handleSave = async () => {
    if (!name.trim()) {
      setError("الاسم مطلوب")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ")
      }

      setSuccess("تم تحديث الملف الشخصي بنجاح")
      setIsEditing(false)
      // إعادة تحميل الجلسة لتحديث البيانات
      window.location.reload()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setName(session?.user?.name || "")
    setIsEditing(false)
    setError("")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">الملف الشخصي</h1>
                  <p className="text-blue-100">إدارة معلوماتك الشخصية</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <p className="text-green-800 dark:text-green-200">{success}</p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </motion.div>
            )}

            <div className="space-y-6">
              {/* Name Field */}
              <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <User className="h-6 w-6 text-gray-400" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      الاسم الكامل
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        placeholder="أدخل اسمك الكامل"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {session.user?.name}
                      </p>
                    )}
                  </div>
                </div>
                
                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </motion.button>
                )}
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center space-x-3 space-x-reverse"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 space-x-reverse disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>حفظ</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 space-x-reverse"
                  >
                    <X className="h-4 w-4" />
                    <span>إلغاء</span>
                  </motion.button>
                </motion.div>
              )}

              {/* Email Field (Read Only) */}
              <div className="flex items-center space-x-4 space-x-reverse p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Mail className="h-6 w-6 text-gray-400" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    البريد الإلكتروني
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {session.user?.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    لا يمكن تغيير البريد الإلكتروني
                  </p>
                </div>
              </div>

              {/* Role Field */}
              <div className="flex items-center space-x-4 space-x-reverse p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Shield className="h-6 w-6 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    نوع الحساب
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    session.user?.role === "ADMIN" 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
                  }`}>
                    {session.user?.role === "ADMIN" ? "مدير" : "عميل"}
                  </span>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center space-x-4 space-x-reverse p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Calendar className="h-6 w-6 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    تاريخ الانضمام
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {session.user?.createdAt 
                      ? new Date(session.user.createdAt).toLocaleDateString("ar-SA", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : (
                          <span className="text-orange-600 text-sm">
                            يرجى تسجيل الخروج وإعادة تسجيل الدخول لعرض التاريخ
                          </span>
                        )
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}