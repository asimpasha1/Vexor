"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Upload, X, ArrowLeft, Save, Loader2, Eye } from 'lucide-react'
import { useToast } from "@/components/providers/toast-provider"

interface FormData {
  title: string
  description: string
  price: string
  category: string
  featured: boolean
  active: boolean
  image: string
  fileUrl: string
}

interface Product extends FormData {
  id: string
  createdAt: string
  updatedAt: string
}

const categories = [
  { value: 'course', label: 'كورس' },
  { value: 'ebook', label: 'كتاب إلكتروني' },
  { value: 'template', label: 'قالب' },
  { value: 'software', label: 'برنامج' },
  { value: 'other', label: 'أخرى' }
]

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { success, error: showError } = useToast()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    category: 'course',
    featured: false,
    active: true,
    image: '',
    fileUrl: ''
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [productFile, setProductFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [errorState, setErrorState] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return
      
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const productData = await response.json()
          setProduct(productData)
          setFormData({
            title: productData.title || '',
            description: productData.description || '',
            price: productData.price?.toString() || '',
            category: productData.category || 'course',
            featured: productData.featured || false,
            active: productData.active !== false,
            image: productData.image || '',
            fileUrl: productData.fileUrl || ''
          })
          setImagePreview(productData.image || '')
        } else {
          setErrorState('لم يتم العثور على المنتج')
        }
      } catch (error) {
        console.error('خطأ في جلب المنتج:', error)
        setErrorState('حدث خطأ في تحميل بيانات المنتج')
      }
    }

    fetchProduct()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = formData.image
      let fileUrl = formData.fileUrl

      // رفع الصورة إذا تم اختيار صورة جديدة
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('file', imageFile)
        
        const imageResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        })
        
        if (imageResponse.ok) {
          const imageResult = await imageResponse.json()
          imageUrl = imageResult.url
        }
      }

      // رفع ملف المنتج إذا تم اختيار ملف جديد
      if (productFile) {
        const fileFormData = new FormData()
        fileFormData.append('file', productFile)
        
        const fileResponse = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        })
        
        if (fileResponse.ok) {
          const fileResult = await fileResponse.json()
          fileUrl = fileResult.url
        }
      }

      // تحديث المنتج
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          image: imageUrl,
          fileUrl: fileUrl
        }),
      })
      
      if (response.ok) {
        success('تم تحديث المنتج', 'تم تحديث بيانات المنتج بنجاح')
        router.push('/dashboard/products')
      } else {
        throw new Error('فشل في تحديث المنتج')
      }
    } catch (err) {
      console.error('خطأ في تحديث المنتج:', err)
      showError('خطأ في تحديث المنتج', 'حدث خطأ أثناء تحديث المنتج، يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev: FormData) => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData((prev: FormData) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProductFile(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData((prev: FormData) => ({ ...prev, image: '' }))
  }

  const removeProductFile = () => {
    setProductFile(null)
    setFormData((prev: FormData) => ({ ...prev, fileUrl: '' }))
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">غير مصرح</h1>
          <p className="text-gray-600">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    )
  }

  if (errorState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                رجوع
              </button>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">تعديل المنتج</h1>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <p className="text-red-600 mb-4">{errorState || 'المنتج غير موجود'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              رجوع
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">تعديل المنتج</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان المنتج *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="أدخل عنوان المنتج"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف المنتج *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                  placeholder="اكتب وصفاً مفصلاً للمنتج"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    السعر (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    التصنيف *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    منتج مميز
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Eye className={`w-4 h-4 ${formData.active ? 'text-green-600' : 'text-gray-400'}`} />
                    {formData.active ? 'مرئي' : 'مخفي'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  صورة المنتج
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="معاينة الصورة"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">انقر لاختيار صورة</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF حتى 10MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ملف المنتج
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors relative">
                  {productFile || formData.fileUrl ? (
                    <div className="text-center">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 mb-4">
                        <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {productFile ? productFile.name : 'ملف موجود'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeProductFile}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        إزالة الملف
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">انقر لاختيار ملف المنتج</p>
                      <p className="text-sm text-gray-500">جميع أنواع الملفات مدعومة</p>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleProductFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ التعديلات
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}