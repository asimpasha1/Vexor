import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getAllTempUsers } from "@/lib/temp-users"

export async function GET(request: NextRequest) {
  try {
    // في بيئة الإنتاج، استخدم المستخدمين المؤقتين فقط
    if (process.env.NODE_ENV === 'production') {
      const tempUsers = getAllTempUsers()
      return NextResponse.json({ 
        users: tempUsers,
        source: 'temp-storage' 
      })
    }

    // التحقق من جلسة المستخدم
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    // التحقق من أن المستخدم مدير
    if ((session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "هذه الصفحة مخصصة للمديرين فقط" },
        { status: 403 }
      )
    }

    // جلب جميع المستخدمين
    const users = getAllTempUsers()
    
    // إرجاع البيانات بدون كلمات المرور
    const safeUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }))

    return NextResponse.json({
      success: true,
      users: safeUsers,
      total: safeUsers.length,
      admins: safeUsers.filter(u => u.role === "ADMIN").length,
      regularUsers: safeUsers.filter(u => u.role === "USER").length
    })

  } catch (error) {
    console.error("Error in admin users API:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 }
    )
  }
}