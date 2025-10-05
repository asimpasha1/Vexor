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
    const { contactId, content, sender } = await request.json()

    if (!contactId || !content || !sender) {
      return NextResponse.json(
        { error: 'Contact ID, content, and sender are required' },
        { status: 400 }
      )
    }

    const contacts = await readContacts()
    const contactIndex = contacts.findIndex(contact => contact.id === contactId)

    if (contactIndex === -1) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      )
    }

    // إنشاء رد جديد
    const newReply: ContactReply = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString()
    }

    // إضافة الرد
    if (!contacts[contactIndex].replies) {
      contacts[contactIndex].replies = []
    }
    contacts[contactIndex].replies!.push(newReply)
    
    // تحديث حالة الرسالة
    contacts[contactIndex].status = 'replied'
    contacts[contactIndex].updatedAt = new Date().toISOString()

    await writeContacts(contacts)

    return NextResponse.json({
      success: true,
      reply: newReply,
      contact: contacts[contactIndex]
    })

  } catch (error) {
    console.error('Error sending reply:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}