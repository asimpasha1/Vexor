import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAllTempUsers } from "@/lib/temp-users"

export async function GET() {
  try {
    console.log("🔍 بدء API جلب المستخدمين...")
    
    // جلب المستخدمين من قاعدة البيانات الحقيقية
    console.log("📊 جلب من قاعدة البيانات...")
    let users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    console.log("💾 المستخدمون من قاعدة البيانات:", users.length)

    // دمج مع المستخدمين المؤقتين
    console.log("🗂️ جلب من التخزين المؤقت...")
    const tempUsers = getAllTempUsers()
    console.log("📝 المستخدمون المؤقتون:", tempUsers.length)
    
    const tempUsersMapped = tempUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any, // تحويل نوع البيانات
      createdAt: new Date(user.createdAt),
      emailVerified: null
    }))

    // دمج البيانات وإزالة التكرار
    const allUsers = [...users]
    
    // إضافة المستخدمين المؤقتين الذين ليسوا في قاعدة البيانات
    tempUsersMapped.forEach(tempUser => {
      const exists = users.find(user => user.email === tempUser.email)
      if (!exists) {
        allUsers.push(tempUser as any)
        console.log("➕ إضافة مستخدم مؤقت:", tempUser.email)
      } else {
        console.log("🔄 مستخدم موجود مسبقاً:", tempUser.email)
      }
    })

    console.log("✅ إجمالي المستخدمين النهائي:", allUsers.length)
    console.log("📊 أسماء المستخدمين:", allUsers.map(u => u.email))

    return NextResponse.json(allUsers)
  } catch (error) {
    console.error("❌ خطأ في جلب المستخدمين:", error)
    
    // في حالة خطأ قاعدة البيانات، اعرض المستخدمين المؤقتين فقط
    const tempUsers = getAllTempUsers()
    const tempUsersMapped = tempUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as any,
      createdAt: new Date(user.createdAt),
      emailVerified: null
    }))

    return NextResponse.json(tempUsersMapped)
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, role } = await request.json()

    // إنشاء مستخدم جديد
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'USER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("خطأ في إنشاء المستخدم:", error)
    return NextResponse.json(
      { error: "فشل في إنشاء المستخدم" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, role } = await request.json()

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("خطأ في تحديث المستخدم:", error)
    return NextResponse.json(
      { error: "فشل في تحديث المستخدم" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("خطأ في حذف المستخدم:", error)
    return NextResponse.json(
      { error: "فشل في حذف المستخدم" },
      { status: 500 }
    )
  }
}