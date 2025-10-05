import { Metadata } from 'next'
import DashboardLayout from '@/components/layout/dashboard-layout'

export const metadata: Metadata = {
  title: 'Help Center | Digital Market',
  description: 'مركز المساعدة والدعم الفني'
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            مركز المساعدة
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              الأسئلة الشائعة
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  كيف يمكنني إنشاء حساب جديد؟
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  يمكنك إنشاء حساب جديد بالضغط على زر "تسجيل" في أعلى الصفحة، ثم ملء البيانات المطلوبة.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  كيف يمكنني شراء المنتجات؟
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  بعد تسجيل الدخول، يمكنك تصفح المنتجات واختيار ما تريد شراؤه، ثم الضغط على "شراء الآن".
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  كيف يمكنني التواصل مع الدعم الفني؟
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  يمكنك التواصل معنا عبر المحادثة المباشرة في الموقع أو عبر البريد الإلكتروني.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}