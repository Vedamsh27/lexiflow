import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - i)
      days.push(date)
    }

    const logs = await prisma.reviewLog.findMany({
      where: {
        userId,
        reviewedAt: { gte: days[0] },
      },
    })

    const data = days.map(day => {
      const next = new Date(day)
      next.setDate(day.getDate() + 1)
      const count = logs.filter(l => l.reviewedAt >= day && l.reviewedAt < next).length
      return {
        date: day.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
      }
    })

    return NextResponse.json({ data })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}