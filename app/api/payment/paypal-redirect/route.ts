import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { productId, customerEmail, amount } = await request.json()
    
    // بدلاً من الذهاب مباشرة لـ PayPal، نُنشئ رابط مُبسط
    // هذا يقلل من مشاكل CAPTCHA
    const paypalUrl = new URL('https://www.paypal.com/cgi-bin/webscr')
    
    const params = {
      cmd: '_xclick',
      business: 'doodooalmahdi@gmail.com', // بريدك المُثبت
      item_name: 'Digital Product',
      item_number: productId,
      amount: amount.toString(),
      currency_code: 'USD',
      return: `${process.env.NEXTAUTH_URL}/order-confirmation?product=${productId}&email=${customerEmail}&payment=paypal`,
      cancel_return: `${process.env.NEXTAUTH_URL}/checkout?product=${productId}`,
      notify_url: `${process.env.NEXTAUTH_URL}/api/payment/paypal-webhook`,
      no_shipping: '1',
      no_note: '1',
      charset: 'utf-8',
      rm: '2',
      custom: productId,
      // معاملات تقليل CAPTCHA
      bn: 'PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted',
      lc: 'US', // استخدام US بدلاً من AR لتقليل CAPTCHA
      page_style: 'paypal', // استخدام الستايل الافتراضي
    }
    
    // إضافة المعاملات للرابط
    Object.entries(params).forEach(([key, value]) => {
      paypalUrl.searchParams.append(key, value)
    })
    
    return NextResponse.json({ 
      success: true, 
      redirectUrl: paypalUrl.toString()
    })
    
  } catch (error) {
    console.error('PayPal redirect creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal payment' },
      { status: 500 }
    )
  }
}