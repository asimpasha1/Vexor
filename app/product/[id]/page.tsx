"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Share2, Heart, ShoppingCart, CheckCircle, Loader2, Copy, X, Facebook, MessageCircle, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/providers/toast-provider"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
  featured: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowShareModal(false)
      }
    }

    if (showShareModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    }
  }, [showShareModal])

  const fetchProduct = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/${id}`)
      
      if (!response.ok) {
        throw new Error("Product not found")
      }
      
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError("لم يتم العثور على المنتج")
      console.error("Error fetching product:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (!product) return

    // Try native sharing first on mobile devices
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const shareData = {
        title: product.title,
        text: product.description,
        url: window.location.href
      }

      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        console.log('Native sharing failed, falling back to modal')
      }
    }

    // Show share modal for desktop or when native sharing fails
    setShowShareModal(true)
  }

  const handlePurchase = () => {
    if (!product) return

    // توجيه إلى صفحة الدفع مع معرف المنتج
    router.push(`/checkout?product=${product.id}`)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      success('تم نسخ الرابط', 'تم نسخ رابط المنتج إلى الحافظة بنجاح ✅')
      setShowShareModal(false)
    } catch (error) {
      console.error('Clipboard error:', error)
      showError('خطأ في النسخ', 'حدث خطأ أثناء نسخ الرابط، يرجى المحاولة مرة أخرى')
    }
  }

  const shareToSocial = (platform: string) => {
    if (!product) return
    
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(product.title)
    const description = encodeURIComponent(product.description)
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${title}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      setShowShareModal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">جاري تحميل المنتج...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "المنتج غير موجود"}</p>
          <Link 
            href="/products"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للمنتجات
          </Link>
        </div>
      </div>
    )
  }

  const categoryLabels = {
    course: "كورس",
    ebook: "كتاب إلكتروني", 
    template: "قالب",
    software: "برنامج"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 py-8">
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link 
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            العودة للمنتجات
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Download className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">صورة المنتج</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            
            <div className="inline-block">
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {product.title}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price}
              </span>
              {product.featured && (
                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                  منتج مميز
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePurchase}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 space-x-reverse"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>شراء الآن</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                  isLiked 
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600" 
                    : "border-gray-300 dark:border-gray-600 hover:border-red-500 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all duration-300 flex items-center justify-center"
                title="مشاركة المنتج"
              >
                <Share2 className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ما ستحصل عليه:
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">وصول فوري للمحتوى</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">تحديثات مجانية مدى الحياة</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">دعم فني متواصل</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">ضمان استرداد المال خلال 30 يوم</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            تفاصيل المنتج
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>
        </motion.div>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowShareModal(false)
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                مشاركة المنتج
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center justify-center space-x-2 space-x-reverse p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => shareToSocial('telegram')}
                className="flex items-center justify-center space-x-2 space-x-reverse p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Send className="h-5 w-5" />
                <span>Telegram</span>
              </button>

              <button
                onClick={() => shareToSocial('facebook')}
                className="flex items-center justify-center space-x-2 space-x-reverse p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </button>

              <button
                onClick={() => shareToSocial('twitter')}
                className="flex items-center justify-center space-x-2 space-x-reverse p-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Twitter</span>
              </button>
            </div>

            {/* Copy Link */}
            <div className="border-t dark:border-gray-700 pt-4">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <Copy className="h-5 w-5" />
                <span>نسخ الرابط</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}