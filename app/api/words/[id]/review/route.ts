import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { calculateSM2 } from '@/lib/sm2'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quality } = await req.json()
    const { id: wordId } = await params

    const progress = await prisma.wordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    })

    const { easeFactor, interval, repetitions } = calculateSM2(
      quality,
      progress?.repetitions ?? 0,
      progress?.easeFactor ?? 2.5,
      progress?.interval ?? 0
    )

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + interval)

    await prisma.wordProgress.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { easeFactor, interval, repetitions, nextReviewDate },
      create: { userId, wordId, easeFactor, interval, repetitions, nextReviewDate },
    })

    // --- Streak logic ---
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastReview = user?.lastReviewDate ? new Date(user.lastReviewDate) : null
    if (lastReview) lastReview.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    let newStreak = user?.streak ?? 0

    if (!lastReview) {
      newStreak = 1
    } else if (lastReview.getTime() === today.getTime()) {
      // already reviewed today, streak stays the same
    } else if (lastReview.getTime() === yesterday.getTime()) {
      newStreak = newStreak + 1
    } else {
      // missed a day, reset
      newStreak = 1
    }

    await prisma.user.update({
  where: { id: userId },
  data: { streak: newStreak, lastReviewDate: new Date() },
})

await prisma.reviewLog.create({
  data: { userId, wordId, quality },
})
    // --- End streak logic ---

    return NextResponse.json({ nextReviewDate, interval, repetitions, streak: newStreak })

  } catch (error) {
    console.error('REVIEW ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}