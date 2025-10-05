import { useState, useEffect } from 'react'

interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    supportEmail: string
    currency: string
    language: string
    timezone: string
  }
  notifications: {
    emailNewOrder: boolean
    emailNewUser: boolean
    emailLowStock: boolean
    pushNotifications: boolean
    smsNotifications: boolean
  }
  payment: {
    paypalEnabled: boolean
    stripeEnabled: boolean
    bankTransferEnabled: boolean
    taxRate: number
    shippingFee: number
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordComplexity: boolean
    ipWhitelist: boolean
  }
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: 'Digital Market',
    siteDescription: 'متجر رقمي للكورسات والمنتجات التعليمية',
    supportEmail: 'support@digitalmarket.com',
    currency: 'USD',
    language: 'العربية',
    timezone: 'الرياض',
  },
  notifications: {
    emailNewOrder: true,
    emailNewUser: true,
    emailLowStock: false,
    pushNotifications: true,
    smsNotifications: false,
  },
  payment: {
    paypalEnabled: true,
    stripeEnabled: true,
    bankTransferEnabled: false,
    taxRate: 15,
    shippingFee: 0,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordComplexity: true,
    ipWhitelist: false,
  },
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/settings', {
          cache: 'no-store' // لضمان الحصول على أحدث إعدادات
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.settings) {
            setSettings(result.settings)
          }
        } else {
          console.warn('Failed to load settings, using defaults')
        }
      } catch (err) {
        console.error('Error loading settings:', err)
        setError('فشل في تحميل الإعدادات')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const refreshSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/settings', {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.settings) {
          setSettings(result.settings)
        }
      }
    } catch (err) {
      console.error('Error refreshing settings:', err)
      setError('فشل في تحديث الإعدادات')
    } finally {
      setLoading(false)
    }
  }

  return {
    settings,
    loading,
    error,
    refreshSettings,
    // Helper getters للوصول السريع
    siteName: settings.general.siteName,
    siteDescription: settings.general.siteDescription,
    supportEmail: settings.general.supportEmail,
    currency: settings.general.currency,
    language: settings.general.language,
  }
}

// Hook مبسط فقط لاسم الموقع
export function useSiteName() {
  const { siteName, loading } = useSettings()
  return { siteName, loading }
}