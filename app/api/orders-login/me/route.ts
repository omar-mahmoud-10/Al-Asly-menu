import { NextResponse } from 'next/server'
import { getStaffFromRequest } from '@/lib/auth-middleware'

export async function GET(request: Request) {
  const staff = await getStaffFromRequest(request)

  if (!staff) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true, staff })
}
