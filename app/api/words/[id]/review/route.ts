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

    return NextResponse.json({ nextReviewDate, interval, repetitions })

  } catch (error) {
    console.error('REVIEW ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
