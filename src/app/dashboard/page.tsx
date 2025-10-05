'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DashboardLayout from "@/components/layout/dashboard-layout";

// الأيقونات المخصصة
const CubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const CurrencyDollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.563.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  featured: boolean;
}

interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  averagePrice: number;
  featuredProducts: number;
  recentProducts: Product[];
  categoryStats: { [key: string]: number };
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalRevenue: 0,
    averagePrice: 0,
    featuredProducts: 0,
    recentProducts: [],
    categoryStats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const products: Product[] = await response.json();
        
        const totalProducts = products.length;
        const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);
        const averagePrice = totalProducts > 0 ? totalRevenue / totalProducts : 0;
        const featuredProducts = products.filter(p => p.featured).length;
        const recentProducts = products.slice(0, 5);
        
        // حساب إحصائيات الفئات
        const categoryStats: { [key: string]: number } = {};
        products.forEach(product => {
          categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
        });

        setStats({
          totalProducts,
          totalRevenue,
          averagePrice,
          featuredProducts,
          recentProducts,
          categoryStats
        });
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
          <div className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">جاري تحميل لوحة التحكم...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-6">
          
          {/* عنوان الترحيب */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
          >
            <h1 className="text-3xl font-bold mb-2">
              🎉 مرحباً بك في لوحة التحكم الجديدة!
            </h1>
            <p className="text-blue-100 text-lg">
              إدارة متجرك الرقمي بسهولة وفعالية من خلال هذه اللوحة الشاملة
            </p>
          </motion.div>

          {/* تنبيه إعداد الدفع */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  🏦 إعداد نظام الدفع مطلوب
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-3">
                  لاستقبال المدفوعات الحقيقية، تحتاج لإعداد Stripe أو PayPal. الفلوس هتروح مباشرة لحسابك!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href="/PAYMENT_SETUP_GUIDE.md" 
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                  >
                    📖 دليل الإعداد الكامل
                  </a>
                  <span className="text-sm text-yellow-600 dark:text-yellow-400 self-center">
                    ⚡ إعداد سريع: 5-10 دقائق
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* بطاقات الإحصائيات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CubeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUpIcon className="w-4 h-4 ml-1" />
                    +12%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">إجمالي المنتجات</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">منتج متاح في المتجر</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUpIcon className="w-4 h-4 ml-1" />
                    +25%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">إجمالي القيمة</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">قيمة جميع المنتجات</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUpIcon className="w-4 h-4 ml-1" />
                    +8%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">متوسط السعر</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.averagePrice.toFixed(2)}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">متوسط سعر المنتج</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <StarIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUpIcon className="w-4 h-4 ml-1" />
                    +15%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">المنتجات المميزة</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.featuredProducts}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">منتج مميز</p>
              </div>
            </motion.div>
          </div>

          {/* قسم المحتوى الرئيسي */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* الإجراءات السريعة */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <TagIcon className="w-6 h-6 mr-3 text-purple-600" />
                الإجراءات السريعة
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard/add-product')}
                  className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50"
                >
                  <div className="p-3 bg-blue-600 rounded-xl ml-4 shadow-lg">
                    <PlusIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">إضافة منتج جديد</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">أضف منتج للمتجر بسهولة</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard/products')}
                  className="flex items-center p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/40 transition-all duration-300 border border-green-200/50 dark:border-green-700/50"
                >
                  <div className="p-3 bg-green-600 rounded-xl ml-4 shadow-lg">
                    <EyeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">عرض المنتجات</p>
                    <p className="text-green-600 dark:text-green-400 text-sm">تصفح وإدارة المنتجات</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard/analytics')}
                  className="flex items-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50"
                >
                  <div className="p-3 bg-purple-600 rounded-xl ml-4 shadow-lg">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">التحليلات</p>
                    <p className="text-purple-600 dark:text-purple-400 text-sm">عرض التقارير والإحصائيات</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard/data-management')}
                  className="flex items-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/40 transition-all duration-300 border border-orange-200/50 dark:border-orange-700/50"
                >
                  <div className="p-3 bg-orange-600 rounded-xl ml-4 shadow-lg">
                    <RefreshIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">إدارة البيانات</p>
                    <p className="text-orange-600 dark:text-orange-400 text-sm">تحديث ومسح البيانات</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* المنتجات الحديثة */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">المنتجات الحديثة</h3>
              <div className="space-y-4">
                {stats.recentProducts.length > 0 ? (
                  stats.recentProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200/50 dark:border-slate-600/50"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center ml-4 shadow-lg">
                        <CubeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 dark:text-white font-medium text-sm line-clamp-1">{product.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{product.category}</p>
                      </div>
                      <div className="text-left">
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm">${product.price}</span>
                        {product.featured && (
                          <div className="text-xs text-orange-600 dark:text-orange-400">مميز</div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-8">لا توجد منتجات</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* إحصائيات الفئات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">إحصائيات الفئات</h3>
            {Object.keys(stats.categoryStats).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.categoryStats).map(([category, count], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
                  >
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{count}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">{category}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">لا توجد فئات</p>
            )}
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
}