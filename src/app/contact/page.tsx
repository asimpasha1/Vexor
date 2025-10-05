"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, MessageCircle, Phone, Mail, MapPin, Clock, Headphones, Users, CheckCircle } from "lucide-react"
import DynamicMetadata from "@/components/DynamicMetadata"
import { useSettings } from "@/hooks/useSettings"
import LiveChat from "@/components/support/LiveChat"

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high'
}

export default function ContactPage() {
  const { siteName, loading: settingsLoading } = useSettings()
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showLiveChat, setShowLiveChat] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          priority: 'medium'
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DynamicMetadata 
        title={`اتصل بنا - ${settingsLoading ? 'Digital Market' : siteName}`}
        description="تواصل معنا للحصول على الدعم الفني أو لأي استفسارات"
      />
      
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              اتصل بنا
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            نحن هنا لمساعدتك! تواصل معنا من خلال النموذج أدناه أو استخدم الدردشة المباشرة للحصول على مساعدة فورية
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Contact Methods */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                طرق التواصل
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">البريد الإلكتروني</p>
                    <p className="text-gray-600 dark:text-gray-400">support@digitalmarket.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">الهاتف</p>
                    <p className="text-gray-600 dark:text-gray-400">+966 50 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">العنوان</p>
                    <p className="text-gray-600 dark:text-gray-400">الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">ساعات العمل</p>
                    <p className="text-gray-600 dark:text-gray-400">24/7 دعم فني</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Support */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <Headphones className="h-8 w-8" />
                <h3 className="text-xl font-bold">دعم فني مباشر</h3>
              </div>
              <p className="mb-6 opacity-90">
                احصل على مساعدة فورية من خلال الدردشة المباشرة مع فريق الدعم الفني
              </p>
              <button
                onClick={() => setShowLiveChat(true)}
                className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
              >
                <MessageCircle className="h-5 w-5" />
                <span>بدء محادثة مباشرة</span>
              </button>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                أسئلة شائعة
              </h3>
              <div className="space-y-3">
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • كيفية تحميل المنتجات المشتراة؟
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • سياسة الاسترداد والضمان
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • مشاكل في عملية الدفع
                </a>
                <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                  • كيفية إنشاء حساب جديد؟
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center space-x-3 space-x-reverse mb-8">
                <Users className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  إرسال رسالة
                </h2>
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.
                    </p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
                >
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الموضوع *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="موضوع الرسالة"
                    />
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الأولوية
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الرسالة *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live Chat Modal */}
      {showLiveChat && (
        <LiveChat onClose={() => setShowLiveChat(false)} />
      )}
    </div>
  )
}