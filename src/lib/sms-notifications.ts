// نظام SMS للإشعارات - يمكن استخدام خدمات مختلفة
// هذا المثال يستخدم Twilio كمثال، يمكن تغييره لخدمات أخرى

interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

interface SMSMessage {
  to: string;
  body: string;
}

class SMSNotificationService {
  private config: SMSConfig | null = null;
  
  constructor() {
    this.initializeConfig();
  }

  private initializeConfig() {
    // تحقق من وجود متغيرات البيئة
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (accountSid && authToken && fromNumber) {
      this.config = {
        accountSid,
        authToken,
        fromNumber
      };
      console.log('✅ SMS service configured');
    } else {
      console.warn('⚠️ SMS service not configured - missing environment variables');
      this.config = null;
    }
  }

  private async sendSMSWithTwilio(message: SMSMessage): Promise<boolean> {
    if (!this.config) {
      console.error('SMS service not configured');
      return false;
    }

    try {
      // في الواقع، هنا يجب استخدام Twilio SDK
      // const client = require('twilio')(this.config.accountSid, this.config.authToken);
      // const result = await client.messages.create({
      //   body: message.body,
      //   from: this.config.fromNumber,
      //   to: message.to
      // });
      
      // محاكاة إرسال SMS للاختبار
      console.log('📱 SMS Sent (Simulated):', {
        to: message.to,
        from: this.config.fromNumber,
        body: message.body
      });
      
      return true;
    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      return false;
    }
  }

  async sendNewOrderSMS(data: any): Promise<boolean> {
    const adminPhone = process.env.ADMIN_PHONE;
    if (!adminPhone) {
      console.warn('Admin phone number not configured');
      return false;
    }

    const message: SMSMessage = {
      to: adminPhone,
      body: `🛒 طلب جديد رقم ${data.orderNumber}
من: ${data.customerName}
المنتج: ${data.productName}
المبلغ: $${data.amount}
تفقد لوحة التحكم للتفاصيل.`
    };

    return await this.sendSMSWithTwilio(message);
  }

  async sendNewUserSMS(data: any): Promise<boolean> {
    const adminPhone = process.env.ADMIN_PHONE;
    if (!adminPhone) {
      console.warn('Admin phone number not configured');
      return false;
    }

    const message: SMSMessage = {
      to: adminPhone,
      body: `👋 مستخدم جديد انضم للمنصة
الاسم: ${data.userName}
البريد: ${data.userEmail}
التاريخ: ${new Date().toLocaleDateString('ar-SA')}`
    };

    return await this.sendSMSWithTwilio(message);
  }

  async sendLowStockSMS(data: any): Promise<boolean> {
    const adminPhone = process.env.ADMIN_PHONE;
    if (!adminPhone) {
      console.warn('Admin phone number not configured');
      return false;
    }

    const message: SMSMessage = {
      to: adminPhone,
      body: `⚠️ تحذير مخزون منخفض!
المنتج: ${data.productName}
الكمية المتبقية: ${data.productStock}
يرجى التجديد فوراً.`
    };

    return await this.sendSMSWithTwilio(message);
  }

  async sendCustomSMS(phoneNumber: string, message: string): Promise<boolean> {
    const smsMessage: SMSMessage = {
      to: phoneNumber,
      body: message
    };

    return await this.sendSMSWithTwilio(smsMessage);
  }

  // التحقق من صحة رقم الهاتف
  static isValidPhoneNumber(phone: string): boolean {
    // regex بسيط للتحقق من صحة رقم الهاتف
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  }
}

export const smsNotificationService = new SMSNotificationService();
export default smsNotificationService;