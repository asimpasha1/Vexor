"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/providers/toast-provider"
import { PAYMENT_CONFIG } from "@/lib/payment-config"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
}

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  paymentMethod: 'card' | 'paypal'
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
}

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { success, error: showError } = useToast()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const productId = searchParams.get('product')
    if (productId) {
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
      showError('خطأ', 'فشل في تحميل تفاصيل المنتج')
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // التحقق من البيانات الشخصية
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'المدينة مطلوبة'
    }

    // التحقق من بيانات الدفع
    if (formData.paymentMethod === 'card') {
      if (!formData.nameOnCard.trim()) {
        newErrors.nameOnCard = 'الاسم على الكارت مطلوب'
      }

      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'رقم الكارت مطلوب'
      } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'رقم الكارت يجب أن يكون 16 رقم'
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'تاريخ الانتهاء مطلوب'
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = 'رمز الأمان مطلوب'
      } else if (formData.cvv.length !== 3) {
        newErrors.cvv = 'رمز الأمان يجب أن يكون 3 أرقام'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // إزالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatCardNumber = (value: string) => {
    // إزالة كل شيء عدا الأرقام
    const cleaned = value.replace(/\D/g, '')
    // إضافة مسافات كل 4 أرقام
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
    return formatted.slice(0, 19) // 16 رقم + 3 مسافات
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showError('خطأ', 'يرجى تصحيح الأخطاء المذكورة')
      return
    }

    setProcessing(true)

    try {
      if (formData.paymentMethod === 'paypal') {
        // التحقق من إعداد PayPal
        if (!PAYMENT_CONFIG.PAYPAL.BUSINESS_EMAIL || PAYMENT_CONFIG.PAYPAL.BUSINESS_EMAIL === 'your-paypal-email@example.com') {
          showError('خطأ في الإعداد', 'PayPal غير مُعدّ بشكل صحيح. يرجى مراجعة المطور.')
          return
        }
        
        // إظهار خيارات متعددة للمستخدم
        const userChoice = confirm(`
🔄 طرق الدفع المتاحة:

✅ موافق: PayPal (تحويل تلقائي)
❌ إلغاء: PayPal.me (رابط مباشر)

اختر "موافق" للتحويل التلقائي أو "إلغاء" للحصول على رابط مباشر.`)
        
        if (userChoice) {
          // الطريقة التلقائية
          const directUrl = `/api/payment/paypal-direct?product=${product?.id}&email=${encodeURIComponent(formData.email)}&amount=${product?.price}&item=${encodeURIComponent(product?.title || 'Digital Product')}`
          
          try {
            window.location.replace(directUrl)
          } catch (error) {
            // Fallback مباشر
            const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=doodooalmahdi@gmail.com&item_name=${encodeURIComponent(product?.title || 'Digital Product')}&amount=${product?.price}&currency_code=USD&return=${encodeURIComponent(window.location.origin + '/order-confirmation?product=' + product?.id + '&email=' + formData.email + '&payment=paypal')}&cancel_return=${encodeURIComponent(window.location.href)}&no_shipping=1&no_note=1&custom=${product?.id}`
            window.location.replace(paypalUrl)
          }
        } else {
          // PayPal.me رابط مباشر
          const paypalMeUrl = `https://paypal.me/doodooalmahdi/${product?.price}USD`
          
          // فتح في نافذة جديدة + نسخ الرابط
          window.open(paypalMeUrl, '_blank')
          
          // نسخ الرابط للحافظة
          if (navigator.clipboard) {
            navigator.clipboard.writeText(paypalMeUrl)
            success('تم فتح PayPal.me', `الرابط: ${paypalMeUrl}\n\nتم نسخ الرابط! أرسل إيميل لـ ${PAYMENT_CONFIG.PAYPAL.BUSINESS_EMAIL} بعد الدفع مع رقم الطلب.`)
          } else {
            success('رابط PayPal.me', `انسخ هذا الرابط واذهب إليه:\n${paypalMeUrl}\n\nأرسل إيميل لـ ${PAYMENT_CONFIG.PAYPAL.BUSINESS_EMAIL} بعد الدفع.`)
          }
        }
        
        return
      } else {
        // معالجة دفع الكريديت كارد
        const response = await fetch('/api/payment/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product?.id,
            customerInfo: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city
            },
            paymentInfo: {
              nameOnCard: formData.nameOnCard,
              cardNumber: formData.cardNumber.replace(/\s/g, ''),
              expiryDate: formData.expiryDate,
              cvv: formData.cvv
            },
            amount: product?.price
          })
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'فشل في معالجة الدفع')
        }

        success(
          'تم الدفع بنجاح! 🎉',
          'تم شراء المنتج بنجاح. سيتم إرسال رابط التحميل إلى بريدك الإلكتروني خلال دقائق'
        )
        
        // توجيه إلى صفحة التأكيد
        router.push(`/order-confirmation?product=${product?.id}&email=${formData.email}&orderId=${result.orderId}`)
      }

    } catch (err: any) {
      showError('فشل في الدفع', err.message || 'حدث خطأ أثناء معالجة الدفع. يرجى التحقق من بيانات الكارت والمحاولة مرة أخرى')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل صفحة الدفع...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">المنتج غير موجود</h1>
          <Link 
            href="/products" 
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            العودة إلى المنتجات
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <div className="border-b border-white/20 dark:border-white/10 backdrop-blur-sm bg-white/10 dark:bg-black/10">
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 py-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/product/${product.id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة للمنتج</span>
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>•</span>
              <Lock className="w-4 h-4" />
              <span>دفع آمن ومحمي</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* نموذج الدفع */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/20 dark:border-white/10 p-8"
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">إتمام عملية الشراء</h1>
              
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                
                {/* معلومات العميل */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    معلومات العميل
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.fullName 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="أدخل اسمك الكامل"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.email 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="example@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.phone 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="+966 5X XXX XXXX"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المدينة *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.city 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                        placeholder="الرياض، جدة، الدمام..."
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      العنوان *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.address 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-300 focus:border-blue-500'
                      } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                      placeholder="أدخل عنوانك الكامل"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* طريقة الدفع */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    طريقة الدفع
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => handleInputChange('paymentMethod', 'card')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6" />
                        <div className="text-left">
                          <div className="font-medium">كريديت كارد</div>
                          <div className="text-sm text-gray-500">Visa, MasterCard</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInputChange('paymentMethod', 'paypal')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.paymentMethod === 'paypal'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          P
                        </div>
                        <div className="text-left">
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-gray-500">دفع آمن</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* تفاصيل الكارت */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          الاسم على الكارت *
                        </label>
                        <input
                          type="text"
                          value={formData.nameOnCard}
                          onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.nameOnCard 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-300 focus:border-blue-500'
                          } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                          placeholder="الاسم كما هو مكتوب على الكارت"
                        />
                        {errors.nameOnCard && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.nameOnCard}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          رقم الكارت *
                        </label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.cardNumber 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-300 focus:border-blue-500'
                          } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            تاريخ الانتهاء *
                          </label>
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.expiryDate 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-gray-300 focus:border-blue-500'
                            } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            رمز الأمان *
                          </label>
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.cvv 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-gray-300 focus:border-blue-500'
                            } bg-white/50 dark:bg-black/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                            placeholder="123"
                            maxLength={3}
                          />
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* زر الدفع */}
                <motion.button
                  type="submit"
                  disabled={processing}
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.98 }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري معالجة الدفع...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>إتمام الدفع - ${product.price}</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/20 dark:border-white/10 p-6 sticky top-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">ملخص الطلب</h2>
              
              {/* معلومات المنتج */}
              <div className="flex gap-4 p-4 bg-white/10 dark:bg-black/10 rounded-2xl mb-6">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {product.category}
                  </p>
                </div>
              </div>

              {/* تفاصيل السعر */}
              <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">سعر المنتج</span>
                  <span className="text-gray-900 dark:text-white">${product.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">رسوم المعالجة</span>
                  <span className="text-green-600">مجاني</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-6">
                <span>المجموع</span>
                <span>${product.price}</span>
              </div>

              {/* ضمانات الأمان */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>دفع آمن ومحمي 256-bit SSL</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>ضمان استرداد خلال 30 يوم</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 text-green-500" />
                  <span>تسليم فوري عبر البريد الإلكتروني</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}