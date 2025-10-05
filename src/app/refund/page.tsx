import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | Digital Market',
  description: 'سياسة الاسترداد والمبالغ المستردة'
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            سياسة الاسترداد
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                فترة الاسترداد
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                يمكنك طلب استرداد المبلغ خلال 14 يوماً من تاريخ الشراء، 
                شريطة أن تكون المنتجات الرقمية لم يتم تحميلها أو استخدامها.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                شروط الاسترداد
              </h2>
              <div className="text-gray-600 dark:text-gray-400">
                <p className="mb-2">يمكن طلب الاسترداد في الحالات التالية:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>المنتج لا يعمل كما هو موصوف</li>
                  <li>حدث خطأ تقني منع تحميل المنتج</li>
                  <li>تم الشراء عن طريق الخطأ ولم يتم تحميل المنتج</li>
                  <li>عدم توافق المنتج مع الوصف المقدم</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                المنتجات غير القابلة للاسترداد
              </h2>
              <div className="text-gray-600 dark:text-gray-400">
                <p className="mb-2">لا يمكن استرداد المبلغ في الحالات التالية:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>المنتجات الرقمية التي تم تحميلها أو استخدامها</li>
                  <li>الخدمات المكتملة أو المنجزة</li>
                  <li>المنتجات المخصصة أو المصنوعة حسب الطلب</li>
                  <li>بعد انتهاء فترة الاسترداد (14 يوم)</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                كيفية طلب الاسترداد
              </h2>
              <div className="text-gray-600 dark:text-gray-400">
                <p className="mb-2">لطلب الاسترداد، يرجى اتباع الخطوات التالية:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>التواصل معنا عبر البريد الإلكتروني: refunds@digitalmarket.com</li>
                  <li>تقديم رقم الطلب وسبب طلب الاسترداد</li>
                  <li>انتظار رد فريق الدعم خلال 48 ساعة</li>
                  <li>اتباع التعليمات المقدمة من فريق الدعم</li>
                </ol>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                معالجة الاسترداد
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                بعد الموافقة على طلب الاسترداد، سيتم معالجة المبلغ خلال 5-10 أيام عمل 
                وإرجاعه إلى نفس وسيلة الدفع المستخدمة في الشراء الأصلي.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                استثناءات خاصة
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                في حالات استثنائية، قد نقدم استردادات جزئية أو ائتمانات متجر بدلاً من الاسترداد الكامل، 
                وذلك حسب طبيعة المنتج أو الخدمة وظروف الطلب.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                التواصل معنا
              </h2>
              <div className="text-gray-600 dark:text-gray-400">
                <p className="mb-2">لأي استفسارات حول سياسة الاسترداد:</p>
                <p>البريد الإلكتروني: refunds@digitalmarket.com</p>
                <p>الهاتف: +966 50 123 4567</p>
                <p>ساعات العمل: الأحد - الخميس، 9:00 ص - 5:00 م</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}