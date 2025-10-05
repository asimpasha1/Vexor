import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Digital Market',
  description: 'سياسة الخصوصية وحماية البيانات'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            سياسة الخصوصية
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                جمع المعلومات
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                نحن نجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل في موقعنا أو استخدام خدماتنا. 
                هذه المعلومات قد تشمل اسمك وعنوان بريدك الإلكتروني ومعلومات الدفع.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                استخدام المعلومات
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                نستخدم المعلومات التي نجمعها لتقديم وتحسين خدماتنا، ومعالجة المعاملات، 
                وإرسال الإشعارات المهمة، والتواصل معك بخصوص حسابك أو خدماتنا.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                حماية المعلومات
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                نحن ملتزمون بحماية معلوماتك الشخصية ونستخدم التدابير الأمنية المناسبة 
                لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                مشاركة المعلومات
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقتك، 
                إلا في الحالات المطلوبة قانونياً أو لحماية حقوقنا.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                التواصل معنا
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، 
                يرجى التواصل معنا عبر البريد الإلكتروني: privacy@digitalmarket.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}