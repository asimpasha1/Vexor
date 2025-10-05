"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ArrowLeft, Upload, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useToast } from "@/components/providers/toast-provider"

export default function AddProductPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [productFile, setProductFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'course',
    featured: false,
    image: '',
    fileUrl: ''
  })

  const categories = [
    { value: 'course', label: 'كورس' },
    { value: 'ebook', label: 'كتاب إلكتروني' },
    { value: 'template', label: 'قالب' },
    { value: 'software', label: 'برنامج' },
    { value: 'other', label: 'أخرى' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = formData.image
      let fileUrl = formData.fileUrl

      // رفع الصورة إذا تم اختيارها
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'image')
      }

      // رفع الملف إذا تم اختياره
      if (productFile) {
        fileUrl = await uploadFile(productFile, 'file')
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          fileUrl: fileUrl,
          price: parseFloat(formData.price)
        }),
      })

      if (response.ok) {
        success('تم إضافة المنتج', 'تم إضافة المنتج بنجاح وسيتم توجيهك إلى قائمة المنتجات')
        router.push('/dashboard/products')
      } else {
        throw new Error('فشل في إضافة المنتج')
      }
    } catch (err) {
      console.error('خطأ في إضافة المنتج:', err)
      error('خطأ في إضافة المنتج', 'حدث خطأ أثناء إضافة المنتج، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      
      // إنشاء معاينة للصورة
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProductFile(file)
    }
  }

  const uploadFile = async (file: File, type: 'image' | 'file'): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`فشل في رفع ${type === 'image' ? 'الصورة' : 'الملف'}`)
    }

    const data = await response.json()
    return data.url
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 ml-2" />
              العودة للوحة التحكم
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              إضافة منتج جديد
            </h1>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                عنوان المنتج *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="أدخل عنوان المنتج"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وصف المنتج *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="أدخل وصف المنتج"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  السعر (دولار) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الفئة *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                صورة المنتج
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <img 
                    src={imagePreview} 
                    alt="معاينة الصورة" 
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview('')
                    }}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center"
                  >
                    <X className="h-4 w-4 ml-1" />
                    إزالة الصورة
                  </button>
                </div>
              )}

              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="imageFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    اضغط لاختيار صورة أو اسحبها هنا
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF (الحد الأقصى: 5MB)
                  </span>
                </label>
              </div>

              {/* Alternative URL Input */}
              <div className="mt-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  أو أدخل رابط الصورة
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ملف المنتج
              </label>
              
              {/* Selected File Info */}
              {productFile && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {productFile.name}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {(productFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="productFile"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="productFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    اضغط لاختيار الملف أو اسحبه هنا
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    جميع أنواع الملفات مدعومة (الحد الأقصى: 100MB)
                  </span>
                </label>
              </div>

              {/* Alternative URL Input */}
              <div className="mt-4">
                <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  أو أدخل رابط الملف
                </label>
                <input
                  type="url"
                  id="fileUrl"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/file.zip"
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                منتج مميز
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/dashboard"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                إلغاء
              </Link>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>حفظ المنتج</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}