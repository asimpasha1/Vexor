import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const password = "admin123"
    const hashedPassword = await bcrypt.hash(password, 12)
    
    return NextResponse.json({
      password,
      hashedPassword
    })
  } catch (error) {
    return NextResponse.json({ error: "Error generating hash" }, { status: 500 })
  }
}