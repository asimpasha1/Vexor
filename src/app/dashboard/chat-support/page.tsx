'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function ChatSupportPage() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">دعم العملاء</h1>
          <p className="mt-2 text-gray-600">
            إدارة المحادثات والرد على استفسارات العملاء
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">المحادثات النشطة</option>
                <option value="pending">في الانتظار</option>
                <option value="closed">مغلقة</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'active'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  المحادثات النشطة
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  في الانتظار
                </button>
                <button
                  onClick={() => setActiveTab('closed')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'closed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  مغلقة
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'active' && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد محادثات نشطة</h3>
                <p className="mt-1 text-sm text-gray-500">سيتم عرض المحادثات النشطة هنا عند توفرها</p>
              </div>
            )}

            {activeTab === 'pending' && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد محادثات في الانتظار</h3>
                <p className="mt-1 text-sm text-gray-500">سيتم عرض المحادثات في الانتظار هنا</p>
              </div>
            )}

            {activeTab === 'closed' && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد محادثات مغلقة</h3>
                <p className="mt-1 text-sm text-gray-500">سيتم عرض المحادثات المغلقة هنا</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}