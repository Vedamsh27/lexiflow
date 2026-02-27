import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get 10 random words for the quiz
    const totalWords = await prisma.word.count()
    const skip = Math.floor(Math.random() * (totalWords - 10))

    const words = await prisma.word.findMany({ take: 10, skip })

    // For each word, pick 3 random wrong answers
    const questions = await Promise.all(words.map(async (word) => {
      const wrongAnswers = await prisma.word.findMany({
        where: { id: { not: word.id } },
        take: 50,
      })
      const shuffled = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
      const choices = [...shuffled.map(w => w.word), word.word].sort(() => Math.random() - 0.5)

      return {
        id: word.id,
        definition: word.definition,
        answer: word.word,
        choices,
      }
    }))

    return NextResponse.json({ questions })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}