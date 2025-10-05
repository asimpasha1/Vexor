// ملف مساعد للتعامل مع قاعدة البيانات بأمان
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient | null {
  try {
    if (!prisma && process.env.DATABASE_URL) {
      prisma = new PrismaClient()
    }
    return prisma
  } catch (error) {
    console.warn('⚠️ Prisma initialization failed:', error)
    return null
  }
}

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL && !!getPrisma()
}

// تنظيف الاتصال عند إغلاق التطبيق
export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect()
    prisma = null
  }
}

// في حالة عدم توفر قاعدة البيانات، استخدم النظام المؤقت
export const USE_TEMP_STORAGE = !isDatabaseAvailable() || process.env.NODE_ENV === 'production'