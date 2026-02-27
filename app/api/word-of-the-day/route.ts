import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const totalWords = await prisma.word.count()

    // Pick a different word each day based on the date
    const today = new Date()
    const dayIndex = Math.floor(today.getTime() / 86400000) % totalWords

    const word = await prisma.word.findFirst({
      skip: dayIndex,
    })

    return NextResponse.json({ word })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}