import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface NotificationData {
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  productName?: string;
  amount?: number;
  userName?: string;
  userEmail?: string;
  productStock?: number;
}

class EmailNotificationService {
  private transporter: nodemailer.Transporter | null = null;
  
  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    // استخدام إعدادات Gmail كمثال - يمكن تغييرها لخدمات أخرى
    const emailConfig: EmailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '', // استخدم App Password للGmail
      },
    };

    try {
      this.transporter = nodemailer.createTransport(emailConfig);
      
      // التحقق من صحة الاتصال
      await this.transporter.verify();
      console.log('✅ Email service is ready');
    } catch (error) {
      console.error('❌ Email service setup failed:', error);
      this.transporter = null;
    }
  }

  private getNewOrderTemplate(data: NotificationData): EmailTemplate {
    return {
      subject: `طلب جديد رقم ${data.orderNumber}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: #667eea; text-align: center; margin-bottom: 30px;">🎉 طلب جديد!</h1>
            
            <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 15px;">تفاصيل الطلب:</h2>
              <p><strong>رقم الطلب:</strong> ${data.orderNumber}</p>
              <p><strong>اسم العميل:</strong> ${data.customerName}</p>
              <p><strong>البريد الإلكتروني:</strong> ${data.customerEmail}</p>
              <p><strong>المنتج:</strong> ${data.productName}</p>
              <p><strong>المبلغ:</strong> $${data.amount}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/orders" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                عرض الطلب في لوحة التحكم
              </a>
            </div>
          </div>
        </div>
      `,
      text: `طلب جديد رقم ${data.orderNumber}\nالعميل: ${data.customerName}\nالمنتج: ${data.productName}\nالمبلغ: $${data.amount}`
    };
  }

  private getNewUserTemplate(data: NotificationData): EmailTemplate {
    return {
      subject: `مستخدم جديد: ${data.userName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: #667eea; text-align: center; margin-bottom: 30px;">👋 مستخدم جديد!</h1>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-bottom: 15px;">معلومات المستخدم:</h2>
              <p><strong>الاسم:</strong> ${data.userName}</p>
              <p><strong>البريد الإلكتروني:</strong> ${data.userEmail}</p>
              <p><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleString('ar-SA')}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/users" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                عرض المستخدمين في لوحة التحكم
              </a>
            </div>
          </div>
        </div>
      `,
      text: `مستخدم جديد: ${data.userName}\nالبريد الإلكتروني: ${data.userEmail}\nتاريخ التسجيل: ${new Date().toLocaleString('ar-SA')}`
    };
  }

  private getLowStockTemplate(data: NotificationData): EmailTemplate {
    return {
      subject: `تحذير: نفاد المخزون - ${data.productName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 15px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: #f5576c; text-align: center; margin-bottom: 30px;">⚠️ تحذير مخزون!</h1>
            
            <div style="background: #fff5f5; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #f5576c;">
              <h2 style="color: #333; margin-bottom: 15px;">المنتج:</h2>
              <p><strong>اسم المنتج:</strong> ${data.productName}</p>
              <p><strong>الكمية المتبقية:</strong> ${data.productStock}</p>
              <p style="color: #f5576c; font-weight: bold;">يرجى تجديد المخزون في أقرب وقت ممكن!</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/products" 
                 style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                إدارة المنتجات
              </a>
            </div>
          </div>
        </div>
      `,
      text: `تحذير: نفاد المخزون\nالمنتج: ${data.productName}\nالكمية المتبقية: ${data.productStock}`
    };
  }

  async sendNewOrderNotification(data: NotificationData) {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      const template = this.getNewOrderTemplate(data);
      
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Digital Market'}" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log('✅ New order notification sent');
      return true;
    } catch (error) {
      console.error('❌ Failed to send new order notification:', error);
      return false;
    }
  }

  async sendNewUserNotification(data: NotificationData) {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      const template = this.getNewUserTemplate(data);
      
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Digital Market'}" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log('✅ New user notification sent');
      return true;
    } catch (error) {
      console.error('❌ Failed to send new user notification:', error);
      return false;
    }
  }

  async sendLowStockNotification(data: NotificationData) {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      const template = this.getLowStockTemplate(data);
      
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Digital Market'}" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log('✅ Low stock notification sent');
      return true;
    } catch (error) {
      console.error('❌ Failed to send low stock notification:', error);
      return false;
    }
  }
}

export const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;