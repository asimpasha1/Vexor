import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', 'notifications.json')

export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    
    // مؤقتاً إزالة التحقق من المصادقة للاختبار
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { 
    //       success: false,
    //       error: 'Authentication required',
    //       notifications: []
    //     },
    //     { status: 200 } // إرجاع 200 بدلاً من 401 لتجنب errors
    //   )
    // }

    // قراءة حالة الإشعارات المحفوظة
    let notifications: any[] = []
    try {
      // التأكد من وجود مجلد data
      const dataDir = path.dirname(NOTIFICATIONS_FILE)
      try {
        await fs.access(dataDir)
      } catch {
        await fs.mkdir(dataDir, { recursive: true })
      }
      
      const fileContent = await fs.readFile(NOTIFICATIONS_FILE, 'utf-8')
      notifications = JSON.parse(fileContent)
    } catch (error) {
      // إذا لم يوجد الملف أو حدث خطأ، إرجاع مصفوفة فارغة
      notifications = []
    }

    return NextResponse.json({ 
      success: true, 
      notifications: Array.isArray(notifications) ? notifications : []
    })

  } catch (error) {
    console.error('Error reading notification status:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to read notification status',
        notifications: []
      },
      { status: 200 } // إرجاع 200 بدلاً من 500 لتجنب JSON parse errors
    )
  }
}