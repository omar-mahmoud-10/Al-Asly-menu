import { NextResponse } from 'next/server'
import { createToken, verifyToken } from '@/lib/auth'

const ORDERS_PASSWORD = '12112'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (!password || typeof password !== 'string' || password !== ORDERS_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const secret = process.env.SITE_AUTH_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const token = await createToken(secret)
  return NextResponse.json({ success: true, token })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  const secret = process.env.SITE_AUTH_SECRET
  if (!secret) {
    return NextResponse.json({ valid: false }, { status: 500 })
  }

  const valid = await verifyToken(token, secret)
  if (!valid) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  return NextResponse.json({ valid: true })
}
