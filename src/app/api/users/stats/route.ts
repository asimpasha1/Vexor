import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAllTempUsers } from "@/lib/temp-users"

export async function GET() {
  try {
    // إحصائيات من قاعدة البيانات
    const dbStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      }
    })

    // إحصائيات من التخزين المؤقت
    const tempUsers = getAllTempUsers()
    
    // جلب جميع المستخدمين لإزالة التكرار
    const allDbUsers = await prisma.user.findMany({
      select: { email: true }
    })
    
    // فلترة المستخدمين المؤقتين لإزالة المتكرر مع قاعدة البيانات
    const uniqueTempUsers = tempUsers.filter(
      tempUser => !allDbUsers.some(dbUser => dbUser.email === tempUser.email)
    )

    // حساب الإحصائيات النهائية
    let totalUsers = 0
    let totalAdmins = 0
    let totalRegularUsers = 0
    const totalModerators = 0

    // من قاعدة البيانات
    dbStats.forEach(stat => {
      totalUsers += stat._count.id
      if (stat.role === 'ADMIN') totalAdmins += stat._count.id
      if (stat.role === 'USER') totalRegularUsers += stat._count.id
      // MODERATOR غير موجود في النظام حالياً
    })

    // من التخزين المؤقت (المستخدمين الفريدين فقط)
    uniqueTempUsers.forEach(user => {
      totalUsers += 1
      if (user.role === 'ADMIN') totalAdmins += 1
      if (user.role === 'USER') totalRegularUsers += 1
      // MODERATOR غير موجود في النظام حالياً
    })

    const stats = {
      total: totalUsers,
      admins: totalAdmins,
      users: totalRegularUsers,
      moderators: totalModerators,
      verified: 0 // يمكن حسابها لاحقاً
    }

    console.log("إحصائيات المستخدمين:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("خطأ في جلب إحصائيات المستخدمين:", error)
    
    // في حالة الخطأ، اعرض إحصائيات المستخدمين المؤقتين فقط
    const tempUsers = getAllTempUsers()
    const stats = {
      total: tempUsers.length,
      admins: tempUsers.filter(u => u.role === 'ADMIN').length,
      users: tempUsers.filter(u => u.role === 'USER').length,
      moderators: tempUsers.filter(u => u.role === 'MODERATOR').length,
      verified: 0
    }
    
    return NextResponse.json(stats)
  }
}