import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export function verifyToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}
