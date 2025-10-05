import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    console.log('🔍 GET Product Request:')
    console.log('  - Product ID:', id)
    console.log('  - Session exists:', !!session)
    console.log('  - User:', session?.user ? {
      email: session.user.email,
      role: (session.user as any).role
    } : 'No user')
    
    // إعداد شروط البحث
    const whereConditions: any = {
      id: id
    }
    
    // إذا لم يكن المستخدم أدمن، اعرض المنتجات النشطة فقط
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      whereConditions.active = true
      console.log('  - Non-admin user, adding active=true condition')
    } else {
      console.log('  - Admin user, no active condition added')
    }
    
    console.log('  - Where conditions:', whereConditions)
    
    const product = await prisma.product.findUnique({
      where: whereConditions,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    console.log("🔍 Product Update - Session Check:")
    console.log("Session exists:", !!session)
    console.log("User:", session?.user)
    console.log("User role:", (session?.user as any)?.role)
    
    if (!session || (session.user as any)?.role !== "ADMIN") {
      console.log("❌ Access denied - User role:", (session?.user as any)?.role)
      return NextResponse.json(
        { error: "غير مصرح - لا يوجد لديك صلاحيات لتعديل المنتجات" },
        { status: 401 }
      )
    }

    console.log("✅ Access granted - User is ADMIN")
    const data = await request.json()
    const {
      title,
      description,
      price,
      image,
      fileUrl,
      category,
      featured,
      active
    } = data

    const product = await prisma.product.update({
      where: {
        id: id
      },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(image && { image }),
        ...(fileUrl && { fileUrl }),
        ...(category && { category }),
        ...(featured !== undefined && { featured }),
        ...(active !== undefined && { active })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.product.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}