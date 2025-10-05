import { NextRequest, NextResponse } from "next/server"
import { getAllTempUsers, addTempUser } from "@/lib/temp-users"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const users = getAllTempUsers()
    return NextResponse.json({
      message: "المستخدمين المتاحين",
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      })),
      total: users.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: "خطأ في جلب المستخدمين" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12)

    // إضافة المستخدم
    const newUser = {
      id: "user-" + Date.now(),
      name: name || "مستخدم جديد",
      email,
      password: hashedPassword,
      role: "USER",
      createdAt: new Date().toISOString()
    }

    addTempUser(newUser)

    return NextResponse.json({
      message: "تم إضافة المستخدم بنجاح",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "خطأ في إضافة المستخدم" },
      { status: 500 }
    )
  }
}