import { NextRequest, NextResponse } from "next/server"
import { getAllTempUsers } from "@/lib/temp-users"

export async function GET(request: NextRequest) {
  try {
    const users = getAllTempUsers()
    
    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        password: user.password ? "مشفرة" : "غير موجودة"
      }))
    })
  } catch (error) {
    console.error("Error getting users:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 }
    )
  }
}