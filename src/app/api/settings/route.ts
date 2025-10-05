import { NextRequest, NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

// مسار ملف الإعدادات
const SETTINGS_FILE = path.join(process.cwd(), 'app-settings.json')

// إعدادات افتراضية
const DEFAULT_SETTINGS = {
  general: {
    siteName: 'Digital Market',
    siteDescription: 'متجر رقمي للكورسات والمنتجات الرقمية',
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

// قراءة الإعدادات
function readSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8')
      return JSON.parse(data)
    }
    return DEFAULT_SETTINGS
  } catch (error) {
    console.error('Error reading settings:', error)
    return DEFAULT_SETTINGS
  }
}

// كتابة الإعدادات
function writeSettings(settings: typeof DEFAULT_SETTINGS) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing settings:', error)
    return false
  }
}

export async function GET() {
  try {
    const settings = readSettings()
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const newSettings = await request.json()
    
    // التحقق من صحة البيانات
    if (!newSettings || typeof newSettings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      )
    }
    
    // دمج الإعدادات الجديدة مع الموجودة
    const currentSettings = readSettings()
    const mergedSettings = {
      ...currentSettings,
      ...newSettings,
      // التأكد من وجود الأقسام الأساسية
      general: { ...currentSettings.general, ...newSettings.general },
      notifications: { ...currentSettings.notifications, ...newSettings.notifications },
      payment: { ...currentSettings.payment, ...newSettings.payment },
      security: { ...currentSettings.security, ...newSettings.security },
    }
    
    // حفظ الإعدادات
    const saved = writeSettings(mergedSettings)
    
    if (saved) {
      console.log('✅ Settings saved successfully:', mergedSettings)
      return NextResponse.json({ 
        success: true, 
        message: 'تم حفظ الإعدادات بنجاح',
        settings: mergedSettings 
      })
    } else {
      throw new Error('Failed to write settings file')
    }
    
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json(
      { error: 'فشل في حفظ الإعدادات', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}