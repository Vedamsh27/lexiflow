import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()

    // 1. Get words already due for review
    const dueWords = await prisma.wordProgress.findMany({
      where: { userId, nextReviewDate: { lte: today } },
      include: { word: true },
      take: 5,
    })

    // 2. If less than 5, fill with new unseen words
    const seenWordIds = await prisma.wordProgress.findMany({
      where: { userId },
      select: { wordId: true },
    })
    const seenIds = seenWordIds.map(p => p.wordId)

    const needed = 5 - dueWords.length
    const newWords = needed > 0
      ? await prisma.word.findMany({
          where: { id: { notIn: seenIds.length > 0 ? seenIds : [''] } },
          take: needed,
        })
      : []

    // 3. Combine both
    const dueWordObjects = dueWords.map(p => p.word)
    const allWords = [...dueWordObjects, ...newWords]

    return NextResponse.json({ words: allWords, count: allWords.length })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
