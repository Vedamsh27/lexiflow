import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    })

    const progress = await prisma.wordProgress.findMany({
      where: { userId },
    })

    const totalWords = progress.length
    const mastered = progress.filter(p => p.easeFactor >= 2.5).length
    const learning = progress.filter(p => p.easeFactor >= 1.8 && p.easeFactor < 2.5).length
    const newWords = progress.filter(p => p.easeFactor < 1.8).length

    return NextResponse.json({
      name: user?.name,
      email: user?.email,
      totalWords,
      mastered,
      learning,
      newWords,
    })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}