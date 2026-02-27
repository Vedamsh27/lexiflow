import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const BADGES = [
  { id: 'first_step', label: 'First Step', description: 'Master your first word', icon: '🌱', required: 1 },
  { id: 'getting_started', label: 'Getting Started', description: 'Master 10 words', icon: '⭐', required: 10 },
  { id: 'making_progress', label: 'Making Progress', description: 'Master 50 words', icon: '🔥', required: 50 },
  { id: 'word_master', label: 'Word Master', description: 'Master 100 words', icon: '🏆', required: 100 },
]

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await prisma.wordProgress.findMany({ where: { userId } })
    const mastered = progress.filter(p => p.easeFactor >= 2.5).length

    const badges = BADGES.map(badge => ({
      ...badge,
      earned: mastered >= badge.required,
    }))

    return NextResponse.json({ badges, mastered })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}