import { NextRequest, NextResponse } from "next/server"
import { updateUserRole } from "@/lib/temp-users"

export async function GET(request: NextRequest) {
  try {
    // تحديث دور المستخدم الحالي إلى مدير
    const updated = updateUserRole("admin11@test.com", "ADMIN")
    
    if (updated) {
      return NextResponse.json({
        success: true,
        message: "تم تحديث الدور بنجاح"
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "فشل في تحديث الدور"
      })
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء التحديث" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}