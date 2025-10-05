import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'read' | 'replied' | 'closed'
  createdAt: string
  updatedAt: string
  replies?: ContactReply[]
}

interface ContactReply {
  id: string
  content: string
  sender: string
  timestamp: string
}

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json')

// التأكد من وجود مجلد البيانات
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// قراءة جميع رسائل الاتصال
async function readContacts(): Promise<ContactMessage[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CONTACTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// حفظ رسائل الاتصال
async function writeContacts(contacts: ContactMessage[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, priority = 'medium' } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const contacts = await readContacts()
    
    // إنشاء رسالة جديدة
    const newContact: ContactMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      priority,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: []
    }

    contacts.unshift(newContact) // إضافة في المقدمة للحصول على الأحدث أولاً
    await writeContacts(contacts)

    // يمكن إضافة إشعار بريد إلكتروني هنا للإدارة
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: newContact.id
    })

  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    
    const contacts = await readContacts()
    
    let filteredContacts = contacts
    
    if (status) {
      filteredContacts = filteredContacts.filter(contact => contact.status === status)
    }
    
    if (priority) {
      filteredContacts = filteredContacts.filter(contact => contact.priority === priority)
    }

    return NextResponse.json({
      contacts: filteredContacts,
      total: filteredContacts.length
    })

  } catch (error) {
    console.error('Error reading contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}