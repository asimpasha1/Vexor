# 🚀 تشغيل المشروع - إرشادات سريعة

## خطوات التشغيل السريع:

### 1. افتح Terminal في مجلد المشروع
```powershell
cd "C:\Users\doooo\Desktop\djitalmarket\digital-market"
```

### 2. تأكد من تثبيت المكتبات
```powershell
npm install
```

### 3. إعداد قاعدة البيانات
```powershell
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. تشغيل المشروع
```powershell
npm run dev
```

### 5. افتح المتصفح على
```
http://localhost:3000
```

## بيانات الدخول للإدارة:
- **البريد الإلكتروني:** admin@test.com
- **كلمة المرور:** admin123

## الصفحات المتاحة:
- **الصفحة الرئيسية:** http://localhost:3000
- **المنتجات:** http://localhost:3000/products
- **تسجيل الدخول:** http://localhost:3000/login
- **لوحة التحكم:** http://localhost:3000/dashboard

## إذا واجهت مشاكل:

### مشكلة: npm command not found
```powershell
# تأكد من وجود Node.js
node --version
npm --version
```

### مشكلة: لا يمكن الوصول لقاعدة البيانات
```powershell
# إعادة إنشاء قاعدة البيانات
rm prisma/dev.db
npx prisma db push
npm run db:seed
```

### مشكلة: خطأ في الـ dependencies
```powershell
# إعادة تثبيت المكتبات
rm -rf node_modules
rm package-lock.json
npm install
```

## المجلدات المهمة:
- **src/app/** - صفحات الموقع
- **src/components/** - المكونات القابلة لإعادة الاستخدام
- **prisma/** - إعدادات قاعدة البيانات
- **public/** - الملفات العامة (صور، أيقونات)

## نصائح مهمة:
1. تأكد من أن المنفذ 3000 غير مستخدم
2. استخدم Terminal منفصل لكل مشروع
3. احفظ البيانات المهمة قبل التعديل على قاعدة البيانات

---
**نصيحة:** احتفظ بهذا الملف مفتوحاً أثناء العمل للرجوع إليه بسرعة! 📚