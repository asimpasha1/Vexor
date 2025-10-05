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
    const { chatId, status } = await request.json()

    if (!chatId || !status) {
      return NextResponse.json(
        { error: 'Chat ID and status are required' },
        { status: 400 }
      )
    }

    // التحقق من صحة الحالة
    const validStatuses = ['active', 'closed', 'waiting']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
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

    // تحديث حالة المحادثة
    chats[chatIndex].status = status
    chats[chatIndex].updatedAt = new Date().toISOString()

    await writeChats(chats)

    return NextResponse.json({
      success: true,
      chat: chats[chatIndex]
    })

  } catch (error) {
    console.error('Error updating chat status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}