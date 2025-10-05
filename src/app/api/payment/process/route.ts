import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

// إعداد Stripe (ضع مفاتيح Stripe الحقيقية في ملف .env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2024-06-20'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, customerInfo, paymentInfo, amount } = body

    // التحقق من وجود المنتج
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من صحة المبلغ
    if (amount !== product.price) {
      return NextResponse.json(
        { error: 'خطأ في المبلغ' },
        { status: 400 }
      )
    }

    // إنشاء عميل Stripe
    const customer = await stripe.customers.create({
      email: customerInfo.email,
      name: customerInfo.fullName,
      phone: customerInfo.phone,
      address: {
        line1: customerInfo.address,
        city: customerInfo.city,
        country: 'SA' // السعودية
      }
    })

    // إنشاء Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // تحويل إلى قروش
      currency: 'usd',
      customer: customer.id,
      description: `شراء منتج: ${product.title}`,
      metadata: {
        productId: product.id,
        productTitle: product.title,
        customerEmail: customerInfo.email
      }
    })

    // محاولة معالجة الدفع بالكارت
    try {
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: paymentInfo.cardNumber,
          exp_month: parseInt(paymentInfo.expiryDate.split('/')[0]),
          exp_year: parseInt('20' + paymentInfo.expiryDate.split('/')[1]),
          cvc: paymentInfo.cvv
        },
        billing_details: {
          name: paymentInfo.nameOnCard,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            line1: customerInfo.address,
            city: customerInfo.city,
            country: 'SA'
          }
        }
      })

      // ربط طريقة الدفع بالعميل
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id
      })

      // تأكيد الدفع
      const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: paymentMethod.id
      })

      if (confirmedPayment.status === 'succeeded') {
        // حفظ الطلب في قاعدة البيانات
        const order = await prisma.order.create({
          data: {
            id: 'ORD-' + Date.now().toString(),
            productId: product.id,
            customerName: customerInfo.fullName,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            customerAddress: `${customerInfo.address}, ${customerInfo.city}`,
            amount: amount,
            status: 'COMPLETED',
            paymentId: confirmedPayment.id,
            paymentMethod: 'CARD'
          }
        })

        return NextResponse.json({
          success: true,
          orderId: order.id,
          paymentId: confirmedPayment.id,
          message: 'تم الدفع بنجاح'
        })
      } else {
        throw new Error('فشل في معالجة الدفع')
      }

    } catch (cardError: unknown) {
      // إلغاء Payment Intent في حالة فشل معالجة الكارت
      await stripe.paymentIntents.cancel(paymentIntent.id)
      
      return NextResponse.json(
        { 
          error: 'خطأ في بيانات الكارت', 
          details: cardError instanceof Error ? cardError.message : 'خطأ غير معروف' 
        },
        { status: 400 }
      )
    }

  } catch (error: unknown) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ في معالجة الدفع', 
        details: error instanceof Error ? error.message : 'خطأ غير معروف' 
      },
      { status: 500 }
    )
  }
}