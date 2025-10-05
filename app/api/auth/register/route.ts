import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { addTempUser, findTempUserByEmail } from "@/lib/temp-users"
// import { prisma } from "@/lib/prisma"

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

    // TODO: Uncomment when Prisma is working
    // التحقق من عدم وجود المستخدم مسبقاً
    // const existingUser = await prisma.user.findUnique({
    //   where: { email }
    // })

    // التحقق من عدم وجود المستخدم مسبقاً (نسخة مؤقتة)
    const existingUser = findTempUserByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { error: "هذا البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12)

    // TODO: Uncomment when Prisma is working
    // إنشاء المستخدم الجديد
    // const user = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     role: "USER"
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     email: true,
    //     role: true,
    //     createdAt: true
    //   }
    // })

    // محاكاة إنشاء المستخدم (مؤقت)
    const user = {
      id: "user-" + Date.now(),
      name,
      email,
      password: hashedPassword, // حفظ كلمة المرور المشفرة
      role: email === "admin11@test.com" ? "ADMIN" : "USER", // جعل هذا البريد مديراً
      createdAt: new Date().toISOString()
    }

    // حفظ المستخدم في التخزين المؤقت
    addTempUser(user)

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