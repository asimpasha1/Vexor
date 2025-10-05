import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
  console.log('🗑️  بدء عملية مسح قاعدة البيانات...')
  
  try {
    // مسح جميع الجداول بالترتيب الصحيح (بسبب Foreign Keys)
    
    // 1. مسح المنتجات أولاً
    console.log('�️  مسح المنتجات...')
    const deletedProducts = await prisma.product.deleteMany({})
    console.log(`✅ تم مسح ${deletedProducts.count} منتج`)
    
    // 2. مسح رموز التحقق
    console.log('� مسح رموز التحقق...')
    const deletedTokens = await prisma.verificationToken.deleteMany({})
    console.log(`✅ تم مسح ${deletedTokens.count} رمز تحقق`)
    
    // 3. مسح الحسابات (Accounts)
    console.log('🔗 مسح الحسابات المرتبطة...')
    const deletedAccounts = await prisma.account.deleteMany({})
    console.log(`✅ تم مسح ${deletedAccounts.count} حساب مرتبط`)
    
    // 4. مسح الجلسات (Sessions)
    console.log('� مسح الجلسات...')
    const deletedSessions = await prisma.session.deleteMany({})
    console.log(`✅ تم مسح ${deletedSessions.count} جلسة`)
    
    // 5. مسح المستخدمين أخيراً
    console.log('👥 مسح المستخدمين...')
    const deletedUsers = await prisma.user.deleteMany({})
    console.log(`✅ تم مسح ${deletedUsers.count} مستخدم`)
    
    console.log('🎉 تم مسح جميع البيانات بنجاح!')
    console.log('')
    console.log('📊 إحصائيات ما بعد المسح:')
    
    // التحقق من أن جميع الجداول فارغة
    const productCount = await prisma.product.count()
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()
    const tokenCount = await prisma.verificationToken.count()
    
    console.log(`- المنتجات: ${productCount}`)
    console.log(`- المستخدمين: ${userCount}`)
    console.log(`- الحسابات: ${accountCount}`)
    console.log(`- الجلسات: ${sessionCount}`)
    console.log(`- رموز التحقق: ${tokenCount}`)
    
    if (productCount + userCount + accountCount + sessionCount + tokenCount === 0) {
      console.log('✨ قاعدة البيانات فارغة تماماً!')
    } else {
      console.log('⚠️  هناك بعض البيانات المتبقية')
    }
    
  } catch (error) {
    console.error('❌ خطأ في مسح قاعدة البيانات:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// تشغيل السكريبت
clearDatabase()
  .then(() => {
    console.log('🏁 انتهى السكريبت بنجاح')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 فشل السكريبت:', error)
    process.exit(1)
  })