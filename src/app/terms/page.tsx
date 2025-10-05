import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Digital Market',
  description: 'شروط الخدمة والاستخدام'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            شروط الخدمة
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                قبول الشروط
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                باستخدام موقعنا، فإنك توافق على الالتزام بشروط الخدمة هذه. 
                إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                استخدام الخدمة
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                يمكنك استخدام خدماتنا للأغراض القانونية فقط. يُحظر استخدام الموقع لأي نشاط غير قانوني 
                أو ضار أو مسيء أو قد يضر بسمعة الموقع أو المستخدمين الآخرين.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                الحسابات
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. 
                أنت مسؤول عن جميع الأنشطة التي تحدث تحت حسابك.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                الدفع والمبالغ المستردة
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                جميع المدفوعات غير قابلة للاسترداد ما لم ينص على خلاف ذلك في سياسة الاسترداد الخاصة بنا. 
                نحن نحتفظ بالحق في تغيير الأسعار في أي وقت.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                إنهاء الخدمة
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                نحن نحتفظ بالحق في إنهاء أو تعليق حسابك أو الوصول إلى خدماتنا 
                في أي وقت دون إشعار مسبق في حالة انتهاك هذه الشروط.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                تحديد المسؤولية
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                خدماتنا متاحة "كما هي" دون ضمانات من أي نوع. 
                نحن لا نتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام خدماتنا.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                تعديل الشروط
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                نحن نحتفظ بالحق في تعديل هذه الشروط في أي وقت. 
                سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال موقعنا.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                التواصل معنا
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                إذا كان لديك أي أسئلة حول شروط الخدمة هذه، 
                يرجى التواصل معنا عبر البريد الإلكتروني: terms@digitalmarket.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}