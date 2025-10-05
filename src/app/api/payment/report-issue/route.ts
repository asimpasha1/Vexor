import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { issue, userEmail, productId, userAgent, timestamp } = await request.json()
    
    console.log('🚨 PayPal Issue Reported:', {
      issue,
      userEmail,
      productId,
      userAgent,
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(request.headers.entries())
    })
    
    // هنا يمكن إضافة إرسال إيميل للمطور أو حفظ في قاعدة البيانات
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم تسجيل المشكلة. سيتم التواصل معك قريباً.' 
    })
    
  } catch (error) {
    console.error('Error reporting PayPal issue:', error)
    return NextResponse.json(
      { error: 'Failed to report issue' },
      { status: 500 }
    )
  }
}