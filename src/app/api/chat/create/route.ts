import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface Chat {
  id: string
  userEmail: string
  userName: string
  status: 'active' | 'closed' | 'waiting'
  createdAt: string
  updatedAt: string
  messages: Message[]
}

interface Message {
  id: string
  chatId: string
  content: string
  sender: 'user' | 'support' | 'bot'
  timestamp: string
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

const CHATS_FILE = path.join(process.cwd(), 'data', 'chats.json')

// التأكد من وجود مجلد البيانات
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// قراءة جميع المحادثات
async function readChats(): Promise<Chat[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CHATS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// حفظ المحادثات
async function writeChats(chats: Chat[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CHATS_FILE, JSON.stringify(chats, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName } = await request.json()

    if (!userEmail || !userName) {
      return NextResponse.json(
        { error: 'User email and name are required' },
        { status: 400 }
      )
    }

    const chats = await readChats()
    
    // التحقق من وجود محادثة نشطة للمستخدم
    let existingChat = chats.find(
      chat => chat.userEmail === userEmail && chat.status === 'active'
    )

    if (existingChat) {
      return NextResponse.json({
        chatId: existingChat.id,
        status: 'existing'
      })
    }

    // إنشاء محادثة جديدة
    const newChat: Chat = {
      id: Date.now().toString(),
      userEmail,
      userName,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    }

    chats.push(newChat)
    await writeChats(chats)

    return NextResponse.json({
      chatId: newChat.id,
      status: 'created'
    })

  } catch (error) {
    console.error('Error creating chat:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}