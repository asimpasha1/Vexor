import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log('PayPal Webhook received')
    
    // الحصول على بيانات PayPal IPN
    const body = await request.text()
    const params = new URLSearchParams(body)
    
    // التحقق من صحة IPN عبر PayPal (خطوة مهمة لتجنب الاحتيال)
    const verifyBody = 'cmd=_notify-validate&' + body
    const verifyResponse = await fetch('https://ipnpb.paypal.com/cgi-bin/webscr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: verifyBody
    })
    
    const verifyResult = await verifyResponse.text()
    
    if (verifyResult !== 'VERIFIED') {
      console.log('PayPal IPN verification failed:', verifyResult)
      return NextResponse.json({ error: 'Invalid IPN' }, { status: 400 })
    }
    
    // استخراج البيانات المهمة
    const paymentStatus = params.get('payment_status')
    const txnId = params.get('txn_id')
    const receiverEmail = params.get('receiver_email')
    const payerEmail = params.get('payer_email')
    const mcGross = params.get('mc_gross')
    const itemName = params.get('item_name')
    const custom = params.get('custom') // product ID
    
    console.log('PayPal IPN verified:', {
      paymentStatus,
      txnId,
      receiverEmail,
      payerEmail,
      mcGross,
      itemName,
      custom
    })

    // التحقق من حالة الدفع
    if (paymentStatus === 'Completed') {
      // الدفع تم بنجاح
      console.log('Payment completed successfully:', txnId)
      
      // حفظ الطلب في قاعدة البيانات
      if (custom && txnId) {
        try {
          await prisma.order.create({
            data: {
              id: 'ORD-PP-' + Date.now().toString(),
              productId: custom,
              paymentId: txnId,
              customerEmail: payerEmail || 'unknown',
              amount: parseFloat(mcGross || '0'),
              status: 'COMPLETED',
              paymentMethod: 'PAYPAL'
            }
          })
          console.log('Order saved to database')
        } catch (dbError) {
          console.error('Database save error:', dbError)
        }
      }
      
      return NextResponse.json({ status: 'success' })
    } else if (paymentStatus === 'Pending') {
      // الدفع في انتظار المراجعة
      console.log('Payment pending:', txnId)
      return NextResponse.json({ status: 'pending' })
    } else {
      // الدفع فشل أو ألغي
      console.log('Payment failed or cancelled:', paymentStatus)
      return NextResponse.json({ status: 'failed' })
    }

  } catch (error) {
    console.error('PayPal IPN processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process PayPal IPN' },
      { status: 500 }
    )
  }
}