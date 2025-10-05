import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product')
    const email = searchParams.get('email')
    const amount = searchParams.get('amount')
    const itemName = searchParams.get('item')
    
    // إنشاء URL مباشر لـ PayPal بأبسط طريقة ممكنة
    const paypalParams = new URLSearchParams({
      cmd: '_xclick',
      business: 'doodooalmahdi@gmail.com',
      item_name: itemName || 'Digital Product',
      amount: amount || '19.99',
      currency_code: 'USD',
      return: `${process.env.NEXTAUTH_URL}/order-confirmation?product=${productId}&email=${email}&payment=paypal`,
      cancel_return: `${process.env.NEXTAUTH_URL}/checkout?product=${productId}`,
      no_shipping: '1',
      no_note: '1',
      custom: productId || ''
    })
    
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?${paypalParams.toString()}`
    
    // محاولة 1: إعادة توجيه مباشرة
    try {
      return NextResponse.redirect(paypalUrl, 302)
    } catch (redirectError) {
      // محاولة 2: صفحة HTML بسيطة مع meta refresh
      const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=${paypalUrl}">
    <title>جارٍ التحويل إلى PayPal...</title>
</head>
<body>
    <script>
        // محاولة JavaScript أيضاً
        window.location.replace('${paypalUrl}');
    </script>
    <p>جارٍ التحويل إلى PayPal...</p>
    <p>إذا لم يتم التحويل تلقائياً، <a href="${paypalUrl}">اضغط هنا</a></p>
</body>
</html>`
      
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }
    
  } catch (error) {
    console.error('PayPal direct redirect error:', error)
    // في حالة الخطأ، إعادة توجيه للصفحة الرئيسية
    return NextResponse.redirect(process.env.NEXTAUTH_URL || 'http://localhost:3000', 302)
  }
}