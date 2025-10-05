import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/products - Get all products with optimized performance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const includeInactive = searchParams.get("includeInactive") // للأدمن

    const session = await getServerSession(authOptions)
    
    const where: { active?: boolean; category?: string; } = {}

    // إذا لم يكن المستخدم أدمن أو لم يطلب المنتجات غير النشطة، اعرض النشطة فقط
    if (!includeInactive || !session?.user || (session.user as { role: string }).role !== 'ADMIN') {
      where.active = true
    }

    if (category && category !== "all") {
      where.category = category
    }

    if (featured === "true") {
      where.featured = true
    }

    // High-performance optimized query with minimal data selection
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        image: true,
        category: true,
        featured: true,
        active: true,
        createdAt: true
        // Removed author relation for faster queries on homepage
      },
      orderBy: [
        { featured: "desc" }, // Featured products first
        { createdAt: "desc" }
      ],
      take: limit ? parseInt(limit) : (featured === "true" ? 6 : 20) // Default limits
    })

    // Enhanced caching headers for maximum performance
    const response = NextResponse.json(products)
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600') // 5 min cache, 10 min stale
    response.headers.set('X-Response-Time', Date.now().toString())
    
    return response
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      title,
      description,
      price,
      image,
      fileUrl,
      category,
      featured = false
    } = data

    // Validation
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // التأكد من وجود user مؤقت
    let userId = session.user.id
    if (!userId) {
      // إنشاء مستخدم مؤقت إذا لم يكن موجوداً
      const tempUser = await prisma.user.upsert({
        where: { email: session.user.email || 'admin@temp.com' },
        update: {},
        create: {
          id: 'user-temp-' + Date.now(),
          name: session.user.name || 'مستخدم مؤقت',
          email: session.user.email || 'admin@temp.com',
          role: 'ADMIN'
        }
      })
      userId = tempUser.id
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        image,
        fileUrl,
        category,
        featured,
        authorId: userId
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}