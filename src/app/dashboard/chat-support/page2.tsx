'use client';

import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function ChatSupportPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة المحادثات
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            إدارة محادثات الدعم الفني مع العملاء
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* قائمة المحادثات */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                المحادثات النشطة
              </h2>
              <div className="space-y-4">
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">أحمد محمد</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">أحتاج مساعدة في الدفع</p>
                    </div>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">2</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">فاطمة علي</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">شكرا على المساعدة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* منطقة المحادثة */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-96">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  اختر محادثة للبدء
                </h3>
              </div>
              <div className="p-4 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    اختر محادثة من القائمة للبدء في الرد على العملاء
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}