import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST() {
  try {
    // تحديث أو إنشاء admin مع كلمة مرور
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@digitalmarket.com' },
      update: {
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'ADMIN'
      },
      create: {
        email: 'admin@digitalmarket.com',
        name: 'مدير النظام',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    })
    
    return NextResponse.json({ 
      message: 'تم تحديث الـ Admin بنجاح!',
      credentials: {
        email: 'admin@digitalmarket.com',
        password: 'admin123'
      },
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
        hasPassword: !!admin.password
      }
    })
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
  }
}