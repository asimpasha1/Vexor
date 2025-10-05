"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/providers/toast-provider"
import { useSettings } from "@/hooks/useSettings"

// Lazy load components for better performance
const ProductCard = lazy(() => import('@/components/ui/product-card'))

interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  category: string
  featured: boolean
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { error: showError, warning } = useToast()
  const { siteName, siteDescription, loading: settingsLoading } = useSettings()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      
      // Simple, fast API call with 3 second timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch('/api/products?featured=true&limit=6', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=300'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const products = await response.json()
        setFeaturedProducts(Array.isArray(products) ? products : [])
      } else {
        setFeaturedProducts(getFallbackProducts())
      }
    } catch (error) {
      // Use fallback data immediately without retries
      setFeaturedProducts(getFallbackProducts())
    } finally {
      setLoading(false)
    }
  }

  // Provide professional sample data as fallback
  const getFallbackProducts = (): Product[] => [
    {
      id: 'fallback-1',
      title: 'كورس تطوير المواقع الاحترافي',
      description: 'تعلم تطوير المواقع الحديثة باستخدام React و Next.js من الصفر حتى الاحتراف',
      price: 199.99,
      image: "/uploads/team/placeholder-cx.jpg",
      category: 'course',
      featured: true
    },
    {
      id: 'fallback-2', 
      title: 'كتاب البرمجة بلغة JavaScript',
      description: 'دليل شامل ومتقدم لتعلم البرمجة بلغة JavaScript الحديثة مع أحدث المعايير',
      price: 89.99,
      image: '/images/js-book.jpg',
      category: 'ebook',
      featured: true
    },
    {
      id: 'fallback-3',
      title: 'قالب موقع تجارة إلكترونية',
      description: 'قالب احترافي ومتجاوب لإنشاء متجر إلكتروني متكامل مع لوحة تحكم',
      price: 149.99,
      image: '/images/ecommerce-template.jpg',
      category: 'template',
      featured: true
    },
    {
      id: 'fallback-4',
      title: 'دورة تصميم UI/UX',
      description: 'تعلم تصميم واجهات المستخدم وتجربة المستخدم باستخدام Figma و Adobe XD',
      price: 299.99,
      image: '/images/ui-ux-course.jpg',
      category: 'course',
      featured: true
    },
    {
      id: 'fallback-5',
      title: 'مجموعة أيقونات احترافية',
      description: 'أكثر من 1000 أيقونة احترافية بدقة عالية لمشاريعك التجارية',
      price: 49.99,
      image: '/images/icons-pack.jpg',
      category: 'design',
      featured: true
    },
    {
      id: 'fallback-6',
      title: 'كورس الذكاء الاصطناعي',
      description: 'تعلم أساسيات الذكاء الاصطناعي والتعلم الآلي مع تطبيقات عملية',
      price: 399.99,
      image: '/images/ai-course.jpg',
      category: 'course',
      featured: true
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* خلفية Hero متدرجة أنيقة ومعاصرة */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-blue-50/20 to-pink-100/30 dark:from-gray-800/30 dark:via-gray-700/20 dark:to-gray-800/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(219,39,119,0.1),transparent)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(219,39,119,0.2),transparent)]" />        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/70 dark:bg-blue-500/50 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/70 dark:bg-purple-500/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-pink-400/70 dark:bg-pink-500/50 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold leading-tight relative"
            >
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {settingsLoading ? 'hasan' : siteName.split(' ')[0] || 'hasan'}
              </span>
              <br />
              <span className="text-neutral-900 dark:text-white relative">
                Innovation
                <span className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 to-success-500/20 blur opacity-30"></span>
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 bg-clip-text text-transparent">
                {settingsLoading ? 'Marketplace' : siteName.split(' ')[1] || 'Marketplace'}
              </span>
              
              {/* تأثير التوهج الأنيق */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-50"></div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed"
            >
              {settingsLoading ? 'اكتشف منتجات رقمية عالية الجودة تحول أعمالك. من الكورسات المتطورة إلى القوالب المذهلة - كل ما تحتاجه للنجاح.' : siteDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 space-x-reverse group overflow-hidden"
                >
                  {/* خلفية متحركة أنيقة */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* تأثير اللمعان */}
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
                  
                  <ShoppingBag className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">تصفح المنتجات</span>
                  <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-8 py-4 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 group overflow-hidden hover:border-brand-400"
              >
                {/* تأثير الخلفية عند التمرير */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-success-50 dark:from-brand-900/20 dark:to-success-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative z-10">شاهد العرض التوضيحي</span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
                            <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group cursor-pointer"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  {featuredProducts.length}+
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">
                  منتجات مميزة
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group cursor-pointer"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-blue-600 transition-all duration-300">
                  50K+
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">
                  عملاء سعداء
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group cursor-pointer"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  4.9
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">
                  التقييم
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full mt-2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-96 lg:h-[600px] relative"
          >
                        <div className="w-full h-full relative">
              {/* خلفية متدرجة أنيقة */}
              <div className="absolute inset-0 bg-brand-gradient rounded-3xl opacity-90"></div>
              
              {/* تأثيرات إضافية */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-accent-300/20 rounded-3xl"></div>
              <div className="absolute top-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 right-4 w-32 h-32 bg-accent-300/20 rounded-full blur-2xl"></div>
              
              {/* المحتوى */}
              <div className="relative z-10 w-full h-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-premium rounded-3xl">
                <div className="text-center p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-glow border border-white/30"
                  >
                    <ShoppingBag className="w-16 h-16 text-white drop-shadow-lg" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-md"
                  >
                    منتجات رقمية متطورة
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-white/90 text-lg drop-shadow-sm"
                  >
                    اكتشف عالم المنتجات الرقمية الحديثة
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden bg-gradient-to-b from-purple-50 to-pink-50">
        {/* Background decorations */}
        {/* خلفيات مزخرفة أنيقة */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>        <div className="w-full max-w-8xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 relative"
              whileInView={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative">
                المنتجات المميزة
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/5 to-purple-600/5 blur-xl rounded-lg"></div>
              </span>
            </motion.h2>
            <p className="text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed">
              منتجات رقمية مختارة بعناية تقدم قيمة استثنائية ونتائج مضمونة، مصممة لتلبية احتياجاتك المهنية والإبداعية
            </p>
          </motion.div>

          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {/* Skeleton loading cards */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 border border-purple-200"
                  >
                    <div className="space-y-4">
                      <div className="h-48 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 rounded-lg animate-pulse"></div>
                      <div className="h-6 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 rounded animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 rounded animate-pulse w-3/4"></div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-8 w-20 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded animate-pulse"></div>
                        <div className="h-10 w-24 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-50 rounded-full">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-200 border-t-purple-600"></div>
                  </div>
                  <span className="text-purple-600 font-medium">
                    جاري تحميل المنتجات المميزة...
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product, index) => (
                <Suspense 
                  key={product.id} 
                  fallback={
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200 animate-pulse">
                      <div className="h-48 bg-purple-200 rounded-lg mb-4"></div>
                      <div className="h-6 bg-purple-200 rounded mb-2"></div>
                      <div className="h-4 bg-purple-200 rounded mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-20 bg-purple-200 rounded"></div>
                        <div className="h-10 w-24 bg-purple-200 rounded"></div>
                      </div>
                    </div>
                  }
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </Suspense>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-20"
            >
              <div className="relative">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-12 h-12 text-purple-600" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-60 animate-pulse"></div>
              </div>
              
              <div className="text-purple-700 text-lg font-medium mb-2">
                لا توجد منتجات مميزة حالياً
              </div>
              <p className="text-purple-500 text-sm max-w-md mx-auto">
                نعمل على إضافة منتجات رقمية مذهلة قريباً. تابعنا للحصول على أحدث المنتجات الإبداعية
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Link href="/products" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 shadow-lg">
                  تصفح جميع المنتجات
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 xl:px-20 relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Dynamic background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(147,51,234,0.08),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(219,39,119,0.08),transparent)]"></div>
        
        {/* Animated shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-bl from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s'}}></div>
        
        <div className="w-full max-w-6xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold relative"
              whileInView={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            >
              جاهز لـ <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative">
                تحويل
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg rounded-lg"></div>
              </span> أعمالك؟
            </motion.h2>
            
            <motion.p 
              className="text-xl text-purple-700 w-full max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              انضم إلى آلاف رجال الأعمال الناجحين الذين يثقون في منصتنا لاحتياجاتهم من المنتجات الرقمية المبتكرة والحلول التقنية المتطورة.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-lg group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-pulse"></div>
                  <span className="relative z-10">ابدأ التسوق الآن</span>
                </motion.button>
              </Link>
              
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 border-2 border-purple-300 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300 group overflow-hidden hover:border-purple-400"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">اعرف المزيد</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
