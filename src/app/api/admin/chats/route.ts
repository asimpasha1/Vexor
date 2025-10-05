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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const chats = await readChats()
    
    let filteredChats = chats
    
    if (status && status !== 'all') {
      filteredChats = chats.filter(chat => chat.status === status)
    }

    // ترتيب المحادثات حسب آخر تحديث
    filteredChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return NextResponse.json({
      chats: filteredChats,
      total: filteredChats.length,
      stats: {
        active: chats.filter(c => c.status === 'active').length,
        waiting: chats.filter(c => c.status === 'waiting').length,
        closed: chats.filter(c => c.status === 'closed').length,
        total: chats.length
      }
    })

  } catch (error) {
    console.error('Error reading chats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}