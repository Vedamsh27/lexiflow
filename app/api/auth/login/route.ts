import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'  
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // 1. Check user exists
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 2. Check password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ token, userId: user.id, name: user.name })

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
