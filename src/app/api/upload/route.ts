import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم اختيار ملف" },
        { status: 400 }
      )
    }

    // تحديد المجلد حسب نوع الملف
    let uploadDir = 'files'
    if (type === 'image') {
      uploadDir = 'images'
    } else if (type === 'team') {
      uploadDir = 'team'
    }
    const uploadsPath = join(process.cwd(), 'public', 'uploads', uploadDir)

    // إنشاء المجلد إذا لم يكن موجوداً
    if (!existsSync(uploadsPath)) {
      await mkdir(uploadsPath, { recursive: true })
    }

    // إنشاء اسم ملف فريد
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadsPath, fileName)

    // تحويل الملف إلى Buffer وحفظه
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)

    // إرجاع رابط الملف
    const fileUrl = `/uploads/${uploadDir}/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء رفع الملف" },
      { status: 500 }
    )
  }
}