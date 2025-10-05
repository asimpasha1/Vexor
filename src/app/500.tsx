export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          خطأ في الخادم
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          حدث خطأ في الخادم، يرجى المحاولة مرة أخرى لاحقاً
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          إعادة تحميل الصفحة
        </button>
      </div>
    </div>
  )
}