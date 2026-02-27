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
      select: { streak: true, lastReviewDate: true },
    })

    let reviewedToday = false

    if (user?.lastReviewDate) {
      const now = new Date()
      const diffMs = now.getTime() - new Date(user.lastReviewDate).getTime()
      const diffHours = diffMs / (1000 * 60 * 60)
      reviewedToday = diffHours < 24
    }

    return NextResponse.json({ streak: user?.streak ?? 0, reviewedToday })

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}