import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "الاسم مطلوب" },
        { status: 400 }
      )
    }

    // تحديث بيانات المستخدم
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: "تم تحديث الملف الشخصي بنجاح",
      user: updatedUser
    })

  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الملف الشخصي" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات الملف الشخصي" },
      { status: 500 }
    )
  }
}