import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/debug/all-products - Get all products debug info
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debugging ALL products")
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        active: true,
        featured: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log("📊 All products data:", products)

    return NextResponse.json({
      count: products.length,
      products: products,
      debug: {
        timestamp: new Date().toISOString(),
        activeCount: products.filter(p => p.active).length,
        inactiveCount: products.filter(p => !p.active).length
      }
    })
  } catch (error) {
    console.error("❌ Error debugging all products:", error)
    return NextResponse.json(
      { error: "Failed to debug products", details: error },
      { status: 500 }
    )
  }
}