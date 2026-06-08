import { NextResponse } from 'next/server'
import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { createToken } from '@/lib/auth'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const salt = process.env.SITE_PASSWORD_SALT
  const storedHash = process.env.SITE_PASSWORD_HASH
  const secret = process.env.SITE_AUTH_SECRET

  if (!salt || !storedHash || !secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')

  if (hash !== storedHash) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const token = await createToken(secret)
  const response = NextResponse.json({ success: true })
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}
