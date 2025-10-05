import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const settingsPath = path.join(process.cwd(), 'app-settings.json')

// GET - الحصول على إعدادات About
export async function GET() {
  try {
    const data = fs.readFileSync(settingsPath, 'utf8')
    const settings = JSON.parse(data)
    
    return NextResponse.json({
      success: true,
      data: settings.about || {}
    })
  } catch (error) {
    console.error('Error reading about settings:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to read about settings'
    }, { status: 500 })
  }
}

// PUT - تحديث إعدادات About (للمديرين فقط)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const aboutSettings = await request.json()
    
    // قراءة الإعدادات الحالية
    const data = fs.readFileSync(settingsPath, 'utf8')
    const settings = JSON.parse(data)
    
    // تحديث إعدادات About
    settings.about = {
      ...settings.about,
      ...aboutSettings
    }
    
    // حفظ الإعدادات المحدثة
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'About settings updated successfully',
      data: settings.about
    })
  } catch (error) {
    console.error('Error updating about settings:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update about settings'
    }, { status: 500 })
  }
}