import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { level } = await req.json()

    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
    }

    await prisma.user.update({
  where: { id: userId },
  data: { proficiencyLevel: level },
})

    return NextResponse.json({ success: true, level })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}