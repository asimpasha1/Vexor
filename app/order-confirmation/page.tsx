"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Home,
  Copy,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/providers/toast-provider"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
  fileUrl?: string  // إضافة رابط الملف
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { success, error: showError } = useToast()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [customerEmail, setCustomerEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [orderNumber] = useState(() => 
    'ORD-' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
  )

  useEffect(() => {
    const productId = searchParams.get('product')
    const email = searchParams.get('email')
    
    if (productId && email) {
      setCustomerEmail(email)
      fetchProduct(productId)
    } else {
      router.push('/products')
    }
  }, [searchParams, router])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`)
      
      if (!response.ok) {
        throw new Error('المنتج غير موجود')
      }
      
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber)
    success('تم النسخ', 'تم نسخ رقم الطلب بنجاح')
  }

  const handleDownload = () => {
    if (product?.fileUrl) {
      // إذا كان المنتج له ملف مرفوع، استخدمه
      window.open(product.fileUrl, '_blank')
      success('بدء التحميل', 'تم بدء تحميل المنتج')
    } else {
      showError('خطأ', 'ملف المنتج غير متوفر. يرجى التواصل مع الدعم')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحضير طلبك...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* رسالة النجاح */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            تم الدفع بنجاح! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            شكراً لك على الشراء من متجرنا
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            رقم الطلب: {orderNumber}
            <button 
              onClick={copyOrderNumber}
              className="ml-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Copy className="w-4 h-4 inline" />
            </button>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* تفاصيل الطلب */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/20 dark:border-white/10 p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">تفاصيل الطلب</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">اسم المنتج:</span>
                <span className="text-gray-900 dark:text-white font-medium">{product.title}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">السعر:</span>
                <span className="text-gray-900 dark:text-white font-medium">${product.price}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">البريد الإلكتروني:</span>
                <span className="text-gray-900 dark:text-white font-medium">{customerEmail}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">تاريخ الشراء:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {new Date().toLocaleDateString('ar-SA')}
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900 dark:text-white">المجموع:</span>
                  <span className="text-green-600">${product.price}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* التحميل والخطوات التالية */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/20 dark:border-white/10 p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">الخطوات التالية</h2>
            
            <div className="space-y-6">
              
              {/* رابط التحميل */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">جاهز للتحميل</span>
                </div>
                
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  يمكنك تحميل المنتج الآن مباشرة
                </p>
                
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  تحميل المنتج
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* البريد الإلكتروني */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">البريد الإلكتروني</span>
                </div>
                
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  تم إرسال رابط التحميل ووصل الشراء إلى بريدك الإلكتروني: 
                  <br />
                  <span className="font-medium">{customerEmail}</span>
                </p>
              </div>

              {/* معلومات إضافية */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>دعم فني مجاني مدى الحياة</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>تحديثات مجانية للمنتج</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>ضمان استرداد خلال 30 يوم</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* أزرار التنقل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Link
            href="/products"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            تصفح المزيد من المنتجات
          </Link>
          
          <Link
            href="/"
            className="px-8 py-3 bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </motion.div>

        {/* معلومات للدعم */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            هل تواجه مشكلة في التحميل؟
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            تواصل معنا على: support@digitalmarket.com
          </p>
        </motion.div>
      </div>
    </div>
  )
}