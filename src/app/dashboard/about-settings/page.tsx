"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Plus, Trash2, Info, Users, Target, Heart } from 'lucide-react'
import { useToast } from '@/components/providers/toast-provider'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { useSession } from 'next-auth/react'

interface AboutSettings {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  missionTitle: string
  missionDescription: string
  visionTitle: string
  visionDescription: string
  valuesTitle: string
  values: Array<{
    title: string
    description: string
  }>
  teamTitle: string
  teamDescription: string
  team: Array<{
    id: number
    name: string
    role: string
    bio: string
    image?: string
    social: {
      linkedin?: string
      twitter?: string
      github?: string
      email?: string
    }
  }>
  contactTitle: string
  contactDescription: string
  phone: string
  email: string
  address: string
  socialLinks: {
    twitter: string
    linkedin: string
    instagram: string
  }
}

export default function AboutSettingsPage() {
  const { data: session, status } = useSession()
  const [settings, setSettings] = useState<AboutSettings>({
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    missionTitle: '',
    missionDescription: '',
    visionTitle: '',
    visionDescription: '',
    valuesTitle: '',
    values: [{ title: '', description: '' }],
    teamTitle: '',
    teamDescription: '',
    team: [{
      id: 1,
      name: '',
      role: '',
      bio: '',
      image: '',
      social: {
        linkedin: '',
        twitter: '',
        github: '',
        email: ''
      }
    }],
    contactTitle: '',
    contactDescription: '',
    phone: '',
    email: '',
    address: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{[key: number]: boolean}>({})
  const { success, error } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/about')
      const result = await response.json()
      
      if (result.success) {
        setSettings(prev => ({ ...prev, ...result.data }))
      }
    } catch (err) {
      error('فشل في تحميل الإعدادات')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/settings/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      
      const result = await response.json()
      
      if (result.success) {
        success('تم حفظ إعدادات صفحة "من نحن" بنجاح!')
      } else {
        error(result.error || 'فشل في حفظ الإعدادات')
      }
    } catch (err) {
      error('فشل في حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  const addValue = () => {
    setSettings(prev => ({
      ...prev,
      values: [...prev.values, { title: '', description: '' }]
    }))
  }

  const removeValue = (index: number) => {
    setSettings(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }))
  }

  const updateValue = (index: number, field: 'title' | 'description', value: string) => {
    setSettings(prev => ({
      ...prev,
      values: prev.values.map((val, i) => 
        i === index ? { ...val, [field]: value } : val
      )
    }))
  }

  const uploadImage = async (file: File, memberId: number): Promise<string | null> => {
    try {
      setUploadingImages(prev => ({ ...prev, [memberId]: true }))
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'team') // استخدام نوع team بدلاً من image

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.error) {
        error(result.error)
        return null
      }

      if (result.success && result.url) {
        success('تم رفع الصورة بنجاح!')
        return result.url
      }
      
      return null
    } catch (err) {
      console.error('Upload error:', err)
      error('فشل في رفع الصورة')
      return null
    } finally {
      setUploadingImages(prev => ({ ...prev, [memberId]: false }))
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, memberId: number) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      error('نوع الملف غير مدعوم. يُسمح فقط بـ JPEG, PNG, WebP')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      error('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت')
      return
    }

    const imageUrl = await uploadImage(file, memberId)
    if (imageUrl) {
      updateTeamMember(memberId, 'image', imageUrl)
    }
  }

  const addTeamMember = () => {
    const newId = Math.max(...settings.team.map(m => m.id)) + 1
    setSettings(prev => ({
      ...prev,
      team: [...prev.team, {
        id: newId,
        name: '',
        role: '',
        bio: '',
        image: '',
        social: {
          linkedin: '',
          twitter: '',
          github: '',
          email: ''
        }
      }]
    }))
  }

  const removeTeamMember = (id: number) => {
    setSettings(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== id)
    }))
  }

  const updateTeamMember = (id: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      team: prev.team.map(member => 
        member.id === id 
          ? field.includes('social.') 
            ? { ...member, social: { ...member.social, [field.split('.')[1]]: value } }
            : { ...member, [field]: value }
          : member
      )
    }))
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    )
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              غير مصرح
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              هذه الصفحة متاحة للمديرين فقط
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Info className="h-8 w-8 text-blue-500" />
              إعدادات صفحة "من نحن"
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              قم بتخصيص محتوى صفحة "من نحن" لتناسب شركتك
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </motion.button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              القسم الرئيسي
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  العنوان الرئيسي
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="من نحن"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  العنوان الفرعي
                </label>
                <input
                  type="text"
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="نحن فريق من المتخصصين..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الوصف
                </label>
                <textarea
                  value={settings.heroDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroDescription: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="مرحباً بك في عالم الإبداع الرقمي..."
                />
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              المهمة
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان المهمة
                </label>
                <input
                  type="text"
                  value={settings.missionTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, missionTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف المهمة
                </label>
                <textarea
                  value={settings.missionDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, missionDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              الرؤية
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان الرؤية
                </label>
                <input
                  type="text"
                  value={settings.visionTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, visionTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الرؤية
                </label>
                <textarea
                  value={settings.visionDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, visionDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                القيم
              </h2>
              <button
                onClick={addValue}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                إضافة قيمة
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                عنوان القيم
              </label>
              <input
                type="text"
                value={settings.valuesTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, valuesTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
              />
            </div>
            
            <div className="space-y-4">
              {settings.values.map((value, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) => updateValue(index, 'title', e.target.value)}
                      placeholder="عنوان القيمة"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      value={value.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      placeholder="وصف القيمة"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {settings.values.length > 1 && (
                    <button
                      onClick={() => removeValue(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              فريق العمل
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان فريق العمل
                </label>
                <input
                  type="text"
                  value={settings.teamTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, teamTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف فريق العمل
                </label>
                <textarea
                  value={settings.teamDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, teamDescription: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            {/* Team Members Management */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">أعضاء الفريق</h3>
                <button
                  onClick={addTeamMember}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  إضافة عضو
                </button>
              </div>
              
              <div className="space-y-6">
                {settings.team.map((member) => (
                  <div key={member.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">عضو الفريق #{member.id}</h4>
                      {settings.team.length > 1 && (
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          الاسم
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          placeholder="اسم العضو"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          المنصب
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          placeholder="منصب العضو"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          النبذة التعريفية
                        </label>
                        <textarea
                          value={member.bio}
                          onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          placeholder="نبذة مختصرة عن العضو"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          صورة العضو
                        </label>
                        <div className="space-y-3">
                          {/* Image Preview */}
                          {member.image && (
                            <div className="flex items-center gap-3">
                              <img 
                                src={member.image} 
                                alt={member.name}
                                className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                              />
                              <button
                                onClick={() => updateTeamMember(member.id, 'image', '')}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                حذف الصورة
                              </button>
                            </div>
                          )}
                          
                          {/* File Upload */}
                          <div className="relative">
                            <input
                              type="file"
                              id={`image-${member.id}`}
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) => handleImageUpload(e, member.id)}
                              className="hidden"
                              disabled={uploadingImages[member.id]}
                            />
                            <label
                              htmlFor={`image-${member.id}`}
                              className={`flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                uploadingImages[member.id] ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {uploadingImages[member.id] ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">جاري رفع الصورة...</span>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <div className="text-gray-400 mb-1">📷</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">
                                    اضغط لاختيار صورة
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    JPEG, PNG, WebP (حد أقصى 5MB)
                                  </div>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          value={member.social.email || ''}
                          onChange={(e) => updateTeamMember(member.id, 'social.email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          placeholder="email@company.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={member.social.linkedin || ''}
                          onChange={(e) => updateTeamMember(member.id, 'social.linkedin', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Twitter
                        </label>
                        <input
                          type="url"
                          value={member.social.twitter || ''}
                          onChange={(e) => updateTeamMember(member.id, 'social.twitter', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          GitHub
                        </label>
                        <input
                          type="url"
                          value={member.social.github || ''}
                          onChange={(e) => updateTeamMember(member.id, 'social.github', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              معلومات التواصل
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان التواصل
                </label>
                <input
                  type="text"
                  value={settings.contactTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف التواصل
                </label>
                <input
                  type="text"
                  value={settings.contactDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactDescription: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                روابط التواصل الاجتماعي
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تويتر
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://twitter.com/company"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    لينكد إن
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.linkedin}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://linkedin.com/company"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    إنستغرام
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinks.instagram}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://instagram.com/company"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}