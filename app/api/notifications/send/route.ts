import { NextRequest, NextResponse } from 'next/server';
import emailNotificationService from '@/lib/email-notifications';
import smsNotificationService from '@/lib/sms-notifications';
import fs from 'fs';
import path from 'path';

// قراءة إعدادات الإشعارات
function getNotificationSettings() {
  try {
    const settingsPath = path.join(process.cwd(), 'app-settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      return settings.notifications || {};
    }
  } catch (error) {
    console.error('Error reading notification settings:', error);
  }
  
  // إعدادات افتراضية
  return {
    emailNewOrder: true,
    emailNewUser: true,
    emailLowStock: false,
    pushNotifications: true,
    smsNotifications: false,
  };
}

// قاعدة بيانات الإشعارات المحلية (في الواقع يجب استخدام قاعدة بيانات حقيقية)
const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', 'notifications.json');

function getStoredNotifications() {
  try {
    // التأكد من وجود مجلد data
    const dataDir = path.dirname(NOTIFICATIONS_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const content = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading stored notifications:', error);
  }
  return [];
}

function saveNotification(notification: any) {
  try {
    const notifications = getStoredNotifications();
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(newNotification);
    
    // الاحتفاظ بآخر 100 إشعار فقط
    if (notifications.length > 100) {
      notifications.splice(100);
    }
    
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    return newNotification;
  } catch (error) {
    console.error('Error saving notification:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing notification type or data' },
        { status: 400 }
      );
    }

    const settings = getNotificationSettings();
    const results: any = {
      type,
      emailSent: false,
      pushSent: false,
      smsSent: false,
      stored: false,
    };

    // حفظ الإشعار محلياً أولاً
    const savedNotification = saveNotification({
      type,
      data,
      title: getNotificationTitle(type, data),
      message: getNotificationMessage(type, data),
    });
    
    if (savedNotification) {
      results.stored = true;
      results.notificationId = savedNotification.id;
    }

    // إرسال إشعار بالبريد الإلكتروني حسب النوع والإعدادات
    switch (type) {
      case 'newOrder':
        if (settings.emailNewOrder) {
          results.emailSent = await emailNotificationService.sendNewOrderNotification(data);
        }
        if (settings.smsNotifications) {
          results.smsSent = await smsNotificationService.sendNewOrderSMS(data);
        }
        break;
        
      case 'newUser':
        if (settings.emailNewUser) {
          results.emailSent = await emailNotificationService.sendNewUserNotification(data);
        }
        if (settings.smsNotifications) {
          results.smsSent = await smsNotificationService.sendNewUserSMS(data);
        }
        break;
        
      case 'lowStock':
        if (settings.emailLowStock) {
          results.emailSent = await emailNotificationService.sendLowStockNotification(data);
        }
        if (settings.smsNotifications) {
          results.smsSent = await smsNotificationService.sendLowStockSMS(data);
        }
        break;
    }

    // TODO: إضافة دعم Push Notifications
    if (settings.pushNotifications) {
      // يمكن إضافة خدمة Push Notifications هنا (Firebase, OneSignal, etc.)
      results.pushSent = false; // مؤقتاً
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الإشعار بنجاح',
      results
    });

  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: 'فشل في إرسال الإشعار', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const notifications = getStoredNotifications();
    const settings = getNotificationSettings();
    
    return NextResponse.json({
      success: true,
      notifications: Array.isArray(notifications) ? notifications : [],
      settings,
      count: Array.isArray(notifications) ? notifications.length : 0,
      unreadCount: Array.isArray(notifications) ? notifications.filter((n: any) => !n.read).length : 0
    });
  } catch (error) {
    console.error('Error in GET notifications:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch notifications',
        notifications: [],
        settings: getNotificationSettings(),
        count: 0,
        unreadCount: 0
      },
      { status: 200 } // إرجاع 200 بدلاً من 500 لتجنب JSON parse errors
    );
  }
}

function getNotificationTitle(type: string, data: any): string {
  switch (type) {
    case 'newOrder':
      return `طلب جديد رقم ${data.orderNumber}`;
    case 'newUser':
      return `مستخدم جديد: ${data.userName}`;
    case 'lowStock':
      return `نفاد مخزون: ${data.productName}`;
    default:
      return 'إشعار جديد';
  }
}

function getNotificationMessage(type: string, data: any): string {
  switch (type) {
    case 'newOrder':
      return `طلب جديد من ${data.customerName} بقيمة $${data.amount}`;
    case 'newUser':
      return `انضم ${data.userName} إلى المنصة`;
    case 'lowStock':
      return `الكمية المتبقية: ${data.productStock}`;
    default:
      return 'لديك إشعار جديد';
  }
}