import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/debug/product/[id] - Debug product data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("🔍 Debugging product with ID:", id)
    
    const product = await prisma.product.findUnique({
      where: {
        id: id
      },
      include: {
        author: true
      }
    })

    console.log("📊 Product data:", product)

    if (!product) {
      return NextResponse.json(
        { error: "Product not found", id: id },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...product,
      debug: {
        timestamp: new Date().toISOString(),
        activeStatus: product.active,
        typeOfActive: typeof product.active
      }
    })
  } catch (error) {
    console.error("❌ Error debugging product:", error)
    return NextResponse.json(
      { error: "Failed to debug product", details: error },
      { status: 500 }
    )
  }
}