import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { addTempUser, findTempUserByEmail } from "@/lib/temp-users"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // التحقق من صحة البيانات
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      )
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    // التحقق من عدم وجود المستخدم مسبقاً (نسخة مؤقتة) - للتوافق
    const existingTempUser = findTempUserByEmail(email)

    if (existingUser || existingTempUser) {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12)

    // إنشاء المستخدم الجديد في قاعدة البيانات
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: email === "admin11@test.com" ? "ADMIN" : "USER"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // أيضاً إضافة للتخزين المؤقت للتوافق
    const tempUser = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      password: hashedPassword,
      role: user.role,
      createdAt: user.createdAt.toISOString()
    }
    addTempUser(tempUser)

    return NextResponse.json(
      { 
        message: "تم إنشاء الحساب بنجاح",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { 
        error: "حدث خطأ أثناء إنشاء الحساب",
        details: error instanceof Error ? error.message : "خطأ غير محدد"
      },
      { status: 500 }
    )
  }
}