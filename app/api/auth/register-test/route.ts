import { NextRequest, NextResponse } from "next/server"

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

    // محاكاة إنشاء المستخدم (للاختبار فقط)
    const user = {
      id: "user-" + Date.now(),
      name,
      email,
      role: "USER",
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(
      { 
        message: "تم إنشاء الحساب بنجاح (وضع الاختبار)",
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error in registration API:", error)
    return NextResponse.json(
      { 
        error: "حدث خطأ أثناء إنشاء الحساب",
        details: error instanceof Error ? error.message : "خطأ غير محدد"
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}