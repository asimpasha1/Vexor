// إعدادات الدفع - يجب تعديل هذه القيم بالبيانات الحقيقية

export const PAYMENT_CONFIG = {
  // إعدادات PayPal
  PAYPAL: {
    // ضع بريدك الإلكتروني المسجل في PayPal هنا
    BUSINESS_EMAIL: "doodooalmahdi@gmail.com", // غيّر هذا!
    
    // أو استخدم PayPal Business ID إذا كان لديك
    // BUSINESS_ID: "your-paypal-business-id",
    
    CURRENCY: "USD", // أو "SAR" للريال السعودي
    
    // روابط العودة
    SUCCESS_URL: process.env.NEXTAUTH_URL + "/order-confirmation",
    CANCEL_URL: process.env.NEXTAUTH_URL + "/checkout",
    
    // إعدادات إضافية لتجنب مشاكل المصادقة
    ENVIRONMENT: "sandbox", // غيرها إلى "live" للإنتاج
    NO_SHIPPING: "1", // لا نحتاج شحن للمنتجات الرقمية
    NO_NOTE: "1", // لا نحتاج ملاحظات من المشتري
    CHARSET: "utf-8", // ترميز الأحرف
    RETURN_METHOD: "2" // POST method للإرجاع
  },
  
  // إعدادات Stripe
  STRIPE: {
    // هذه القيم تأتي من ملف .env
    PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    
    CURRENCY: "usd", // أو "sar" للريال السعودي
    
    // عمولة Stripe (للمعلومات فقط)
    FEE_PERCENTAGE: 2.9,
    FEE_FIXED: 0.30, // بالدولار
  }
}

// معلومات مهمة للمطور:
export const PAYMENT_INFO = {
  STRIPE: {
    description: "الفلوس تروح مباشرة لحسابك البنكي المربوط بـ Stripe",
    fees: "عمولة Stripe: 2.9% + 30¢ لكل معاملة",
    payout: "التحويل للبنك: كل 2-7 أيام (حسب البلد)",
    setup: [
      "1. إنشاء حساب على stripe.com",
      "2. التحقق من الهوية (KYC)", 
      "3. ربط الحساب البنكي",
      "4. الحصول على API Keys",
      "5. وضع المفاتيح في ملف .env"
    ]
  },
  
  PAYPAL: {
    description: "الفلوس تروح لحساب PayPal بتاعك مباشرة",
    fees: "عمولة PayPal: 3.4% + رسوم ثابتة (حسب البلد)",
    payout: "فوري في حساب PayPal، التحويل للبنك 1-3 أيام",
    setup: [
      "1. إنشاء حساب PayPal Business",
      "2. التحقق من الحساب",
      "3. تفعيل استقبال المدفوعات",
      "4. وضع البريد الإلكتروني في PAYPAL.BUSINESS_EMAIL"
    ]
  }
}