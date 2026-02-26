import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all words the user has seen with their progress
    const progress = await prisma.wordProgress.findMany({
      where: { userId },
      include: { word: true },
    })

    const words = progress.map(p => ({
      id: p.word.id,
      word: p.word.word,
      definition: p.word.definition,
      mastery: Math.round((p.easeFactor - 1.3) / (3.2 - 1.3) * 100),
      nextReview: p.nextReviewDate,
    }))

    // Sort alphabetically
    words.sort((a, b) => a.word.localeCompare(b.word))

    return NextResponse.json({ words })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}