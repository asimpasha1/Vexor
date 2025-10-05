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

// قراءة جميع المحادثات
async function readChats(): Promise<Chat[]> {
  try {
    const data = await fs.readFile(CHATS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// حفظ المحادثات
async function writeChats(chats: Chat[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  await fs.writeFile(CHATS_FILE, JSON.stringify(chats, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { chatId, content, sender } = await request.json()

    if (!chatId || !content || !sender) {
      return NextResponse.json(
        { error: 'Chat ID, content, and sender are required' },
        { status: 400 }
      )
    }

    const chats = await readChats()
    const chatIndex = chats.findIndex(chat => chat.id === chatId)

    if (chatIndex === -1) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    // إنشاء رسالة جديدة
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      content,
      sender,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

    // إضافة الرسالة للمحادثة
    chats[chatIndex].messages.push(newMessage)
    chats[chatIndex].updatedAt = new Date().toISOString()

    // إذا كانت الرسالة من المستخدم، تحديث حالة المحادثة إلى "waiting"
    if (sender === 'user') {
      chats[chatIndex].status = 'waiting'
    }

    await writeChats(chats)

    return NextResponse.json({
      message: newMessage,
      success: true
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      )
    }

    const chats = await readChats()
    const chat = chats.find(c => c.id === chatId)

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      chat,
      messages: chat.messages
    })

  } catch (error) {
    console.error('Error getting messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}