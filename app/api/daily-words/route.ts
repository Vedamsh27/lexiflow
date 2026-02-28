import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

type WordProgress = {
  word: {
    id: string;
    word: string;
    definition: string;
    example: string | null;
    difficulty: string;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { proficiencyLevel: true },
    })

    const level = user?.proficiencyLevel || 'beginner'

    // Map level to difficulty filter
    const difficultyMap: Record<string, string[]> = {
      beginner: ['easy'],
      intermediate: ['easy', 'medium'],
      advanced: ['easy', 'medium', 'hard'],
    }
    const allowedDifficulties = difficultyMap[level] || ['easy']

    const today = new Date()

    // 1. Get words already due for review
    const dueWords = await prisma.wordProgress.findMany({
      where: { userId, nextReviewDate: { lte: today } },
      include: { word: true },
      take: 5,
    })

    // 2. Get all seen word IDs
    const seenWordIds = await prisma.wordProgress.findMany({
      where: { userId },
      select: { wordId: true },
    })
    const seenIds = seenWordIds.map((p: { wordId: string }) => p.wordId)

    // 3. Fill remaining slots with unseen words matching level
    const needed = 5 - dueWords.length
    let newWords: { id: string; word: string; definition: string; example: string | null; difficulty: string }[] = []

    if (needed > 0) {
      const pool = await prisma.word.findMany({
  where: {
    id: { notIn: seenIds.length > 0 ? seenIds : [''] },
  },
  take: 50,
})

      const shuffled = pool.sort(() => Math.random() - 0.5)
      newWords = shuffled.slice(0, needed)
    }

    // 4. Combine both
    const dueWordObjects = dueWords.map((p: WordProgress) => p.word)
    const allWords = [...dueWordObjects, ...newWords]

    return NextResponse.json({ words: allWords, count: allWords.length })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}