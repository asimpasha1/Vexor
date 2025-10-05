import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface Rating {
  id: string
  chatId: string
  userEmail: string
  rating: number
  comment?: string
  createdAt: string
}

interface Chat {
  id: string
  userEmail: string
  userName: string
  status: 'active' | 'closed' | 'waiting'
  createdAt: string
  updatedAt: string
  messages: Message[]
  rating?: Rating
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
const RATINGS_FILE = path.join(process.cwd(), 'data', 'ratings.json')

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

// قراءة جميع التقييمات
async function readRatings(): Promise<Rating[]> {
  try {
    const data = await fs.readFile(RATINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// حفظ التقييمات
async function writeRatings(ratings: Rating[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  await fs.writeFile(RATINGS_FILE, JSON.stringify(ratings, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { chatId, rating, comment, userEmail } = await request.json()

    if (!chatId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Chat ID and valid rating (1-5) are required' },
        { status: 400 }
      )
    }

    // إنشاء كائن التقييم
    const newRating: Rating = {
      id: Date.now().toString(),
      chatId,
      userEmail: userEmail || 'guest@example.com',
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString()
    }

    // حفظ التقييم في ملف التقييمات
    const ratings = await readRatings()
    ratings.push(newRating)
    await writeRatings(ratings)

    // تحديث المحادثة بإضافة التقييم
    const chats = await readChats()
    const chatIndex = chats.findIndex(c => c.id === chatId)

    if (chatIndex !== -1) {
      chats[chatIndex].rating = newRating
      chats[chatIndex].updatedAt = new Date().toISOString()
      await writeChats(chats)
    }

    return NextResponse.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    })

  } catch (error) {
    console.error('Error submitting rating:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const ratings = await readRatings()
    
    // حساب المتوسط والإحصائيات
    const totalRatings = ratings.length
    const averageRating = totalRatings > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0

    const ratingDistribution = {
      1: ratings.filter(r => r.rating === 1).length,
      2: ratings.filter(r => r.rating === 2).length,
      3: ratings.filter(r => r.rating === 3).length,
      4: ratings.filter(r => r.rating === 4).length,
      5: ratings.filter(r => r.rating === 5).length
    }

    return NextResponse.json({
      ratings,
      stats: {
        total: totalRatings,
        average: Math.round(averageRating * 100) / 100,
        distribution: ratingDistribution
      }
    })

  } catch (error) {
    console.error('Error getting ratings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}